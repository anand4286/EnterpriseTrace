import express from 'express';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { v4 as uuidv4 } from 'uuid';

// Import route modules
import authRoutes from './routes/auth';
import organizationRoutes from './routes/organizations';
import userRoutes from './routes/users';
import tribeRoutes from './routes/tribes';
import squadRoutes from './routes/squads';
import chapterRoutes from './routes/chapters';
import projectRoutes from './routes/projects';
import componentRoutes from './routes/components';
import releaseRoutes from './routes/releases';
import incidentRoutes from './routes/incidents';
import analyticsRoutes from './routes/analytics';
import complianceRoutes from './routes/compliance';
import integrationRoutes from './routes/integrations';

// Middleware
import { authMiddleware } from './middleware/auth';
import { rbacMiddleware } from './middleware/rbac';
import { auditMiddleware } from './middleware/audit';
import { validationMiddleware } from './middleware/validation';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';

// Database connection
import { DatabaseManager } from './database/manager';
import { CacheManager } from './cache/manager';
import { MessageQueueManager } from './queue/manager';

const app = express();
const PORT = process.env.PORT || 8080;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // Limit each IP
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    database: DatabaseManager.isHealthy(),
    cache: CacheManager.isHealthy(),
    queue: MessageQueueManager.isHealthy()
  });
});

// Readiness check
app.get('/ready', async (req: Request, res: Response) => {
  try {
    await DatabaseManager.checkConnection();
    await CacheManager.checkConnection();
    await MessageQueueManager.checkConnection();
    
    res.status(200).json({
      status: 'ready',
      checks: {
        database: 'healthy',
        cache: 'healthy',
        queue: 'healthy'
      }
    });
  } catch (error) {
    res.status(503).json({
      status: 'not ready',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// API Routes with middleware chain
app.use('/api/auth', authRoutes);

// Protected routes - require authentication
app.use('/api', authMiddleware);
app.use('/api', auditMiddleware);

// Organization management
app.use('/api/organizations', rbacMiddleware(['org:read']), organizationRoutes);

// User management
app.use('/api/users', rbacMiddleware(['user:read']), userRoutes);

// Organizational structure
app.use('/api/tribes', rbacMiddleware(['tribe:read']), tribeRoutes);
app.use('/api/squads', rbacMiddleware(['squad:read']), squadRoutes);
app.use('/api/chapters', rbacMiddleware(['chapter:read']), chapterRoutes);

// Project and component management
app.use('/api/projects', rbacMiddleware(['project:read']), projectRoutes);
app.use('/api/components', rbacMiddleware(['component:read']), componentRoutes);

// Release management
app.use('/api/releases', rbacMiddleware(['release:read']), releaseRoutes);

// Incident management
app.use('/api/incidents', rbacMiddleware(['incident:read']), incidentRoutes);

// Analytics and reporting
app.use('/api/analytics', rbacMiddleware(['analytics:read']), analyticsRoutes);

// Compliance management
app.use('/api/compliance', rbacMiddleware(['compliance:read']), complianceRoutes);

// Integrations
app.use('/api/integrations', rbacMiddleware(['integration:read']), integrationRoutes);

// API Documentation
app.use('/api-docs', express.static('docs'));

// Generic error handling
app.use(errorHandler);

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await DatabaseManager.disconnect();
  await CacheManager.disconnect();
  await MessageQueueManager.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await DatabaseManager.disconnect();
  await CacheManager.disconnect();
  await MessageQueueManager.disconnect();
  process.exit(0);
});

// Start server
const startServer = async () => {
  try {
    // Initialize database
    await DatabaseManager.connect();
    await DatabaseManager.migrate();
    
    // Initialize cache
    await CacheManager.connect();
    
    // Initialize message queue
    await MessageQueueManager.connect();
    
    app.listen(PORT, () => {
      console.log(`🚀 Enterprise API Server running on port ${PORT}`);
      console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
      console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
      console.log(`✅ Readiness check available at http://localhost:${PORT}/ready`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

export default app;

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}
