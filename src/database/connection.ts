import { Pool, Client } from 'pg';
import { createClient } from 'redis';
import dotenv from 'dotenv';
import path from 'path';

// Load environment-specific configuration
const nodeEnv = process.env.NODE_ENV || 'development';
const envFile = `.env.${nodeEnv}`;

// Try to load environment-specific file first, then fall back to .env
if (require('fs').existsSync(path.resolve(envFile))) {
  dotenv.config({ path: envFile });
} else {
  dotenv.config();
}

console.log(`🌍 Loading configuration for environment: ${nodeEnv}`);

// PostgreSQL Configuration
export const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || `tsr_enterprise_${nodeEnv}`,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: parseInt(process.env.DB_MAX_CONNECTIONS || '20'),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
};

// Redis Configuration
export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0'),
};

// PostgreSQL Pool
export const pool = new Pool(dbConfig);

// Redis Client
export const redisClient = createClient({
  url: process.env.REDIS_URL || `redis://${redisConfig.password ? `:${redisConfig.password}@` : ''}${redisConfig.host}:${redisConfig.port}/${redisConfig.db}`
});

// Database Connection Functions
export const connectDatabase = async (): Promise<void> => {
  try {
    console.log(`🔌 Connecting to PostgreSQL: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
    // Test PostgreSQL connection
    const client = await pool.connect();
    const result = await client.query('SELECT NOW() as current_time, version() as version');
    console.log('✅ PostgreSQL connected successfully');
    console.log(`   Database: ${dbConfig.database}`);
    console.log(`   Version: ${result.rows[0].version.split(' ')[0]} ${result.rows[0].version.split(' ')[1]}`);
    console.log(`   Time: ${result.rows[0].current_time}`);
    client.release();

    console.log(`🔌 Connecting to Redis: ${redisConfig.host}:${redisConfig.port}/${redisConfig.db}`);
    // Connect Redis
    await redisClient.connect();
    const redisPing = await redisClient.ping();
    console.log('✅ Redis connected successfully');
    console.log(`   Response: ${redisPing}`);
    console.log(`   Database: ${redisConfig.db}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await pool.end();
    await redisClient.quit();
    console.log('✅ Database connections closed gracefully');
  } catch (error) {
    console.error('❌ Error closing database connections:', error);
  }
};

// Health Check
export const checkDatabaseHealth = async (): Promise<{ postgres: boolean; redis: boolean; details: any }> => {
  const health: { postgres: boolean; redis: boolean; details: any } = { 
    postgres: false, 
    redis: false, 
    details: { postgres: {}, redis: {} } 
  };
  
  try {
    // Check PostgreSQL
    const pgClient = await pool.connect();
    const pgResult = await pgClient.query('SELECT NOW() as time, COUNT(*) as connection_count FROM pg_stat_activity WHERE state = \'active\'');
    pgClient.release();
    health.postgres = true;
    health.details.postgres = {
      status: 'healthy',
      timestamp: pgResult.rows[0].time,
      activeConnections: parseInt(pgResult.rows[0].connection_count),
      poolSize: pool.totalCount,
      idleConnections: pool.idleCount,
      waitingClients: pool.waitingCount
    };
  } catch (error) {
    console.error('PostgreSQL health check failed:', error);
    health.details.postgres = { status: 'unhealthy', error: (error as Error).message };
  }

  try {
    // Check Redis
    const redisPing = await redisClient.ping();
    const redisInfo = await redisClient.info('memory');
    health.redis = true;
    health.details.redis = {
      status: 'healthy',
      ping: redisPing,
      memory: redisInfo.split('\n').find(line => line.startsWith('used_memory_human:'))?.split(':')[1]?.trim() || 'unknown'
    };
  } catch (error) {
    console.error('Redis health check failed:', error);
    health.details.redis = { status: 'unhealthy', error: (error as Error).message };
  }

  return health;
};

// Environment-specific database utilities
export const isDevelopment = () => nodeEnv === 'development';
export const isProduction = () => nodeEnv === 'production';
export const isStaging = () => nodeEnv === 'staging';

// Database pool event handlers
pool.on('connect', (client) => {
  if (isDevelopment()) {
    console.log('🔗 New PostgreSQL client connected');
  }
});

pool.on('error', (err, client) => {
  console.error('❌ Unexpected error on idle PostgreSQL client:', err);
});

// Redis event handlers
redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
});

redisClient.on('connect', () => {
  if (isDevelopment()) {
    console.log('🔗 Redis client connected');
  }
});

redisClient.on('ready', () => {
  if (isDevelopment()) {
    console.log('✅ Redis client ready');
  }
});
