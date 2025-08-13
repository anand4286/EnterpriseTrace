// Database Seeding Script for Enterprise TSR System

const { Pool } = require('pg');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Database configuration
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'tsr_enterprise',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
});

async function seedDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🌱 Starting database seeding...');
    
    // Create demo organization
    const orgId = uuidv4();
    const adminUserId = uuidv4();
    
    // Insert demo organization
    await client.query(`
      INSERT INTO organizations (id, name, domain, subscription) VALUES ($1, $2, $3, $4)
      ON CONFLICT (domain) DO NOTHING
    `, [
      orgId,
      'Demo Enterprise Corp',
      'demo.enterprise.com',
      JSON.stringify({
        type: 'enterprise',
        maxUsers: 1000,
        maxProjects: 500,
        features: ['basic', 'advanced', 'premium'],
        billingCycle: 'monthly',
        price: 299
      })
    ]);

    // Create admin user
    const hashedPassword = await bcrypt.hash('DemoAdmin123!', 10);
    await client.query(`
      INSERT INTO users (id, organization_id, email, first_name, last_name, role, status) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (email) DO NOTHING
    `, [
      adminUserId,
      orgId,
      'admin@demo.enterprise.com',
      'Demo',
      'Admin',
      JSON.stringify({
        id: uuidv4(),
        name: 'ADMIN',
        level: 'executive',
        permissions: ['*']
      }),
      'active'
    ]);

    // Create sample tribe
    const tribeId = uuidv4();
    await client.query(`
      INSERT INTO tribes (id, organization_id, name, purpose, lead_id, status) 
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [
      tribeId,
      orgId,
      'Platform Tribe',
      'Responsible for platform infrastructure and tooling',
      adminUserId,
      'active'
    ]);

    // Create sample squad
    const squadId = uuidv4();
    await client.query(`
      INSERT INTO squads (id, organization_id, tribe_id, name, purpose, type, status, capacity, performance) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      squadId,
      orgId,
      tribeId,
      'Platform Engineering Squad',
      'Develop and maintain enterprise platform infrastructure',
      'platform',
      'performing',
      JSON.stringify({
        totalPoints: 50,
        availablePoints: 30,
        committedPoints: 20,
        velocity: [25, 30, 28, 32],
        efficiency: 85
      }),
      JSON.stringify({
        deliveredStories: 45,
        deliveredPoints: 180,
        cycleTime: 5.2,
        throughput: 8.5
      })
    ]);

    // Create sample project
    const projectId = uuidv4();
    await client.query(`
      INSERT INTO projects (id, organization_id, squad_id, name, description, status, priority, start_date, metadata) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      projectId,
      orgId,
      squadId,
      'Enterprise API Platform',
      'Core API platform for enterprise applications',
      'active',
      'high',
      new Date('2025-01-01'),
      JSON.stringify({
        technologies: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis'],
        estimatedDuration: '6 months',
        team: 'Platform Engineering Squad'
      })
    ]);

    // Create sample API endpoints
    const endpoints = [
      {
        path: '/api/users',
        method: 'GET',
        summary: 'List all users',
        description: 'Retrieve a paginated list of all users in the organization'
      },
      {
        path: '/api/users',
        method: 'POST',
        summary: 'Create new user',
        description: 'Create a new user account with role assignment'
      },
      {
        path: '/api/squads',
        method: 'GET',
        summary: 'List all squads',
        description: 'Retrieve all squads with their members and performance metrics'
      },
      {
        path: '/api/projects',
        method: 'GET',
        summary: 'List all projects',
        description: 'Get all projects with status and progress information'
      }
    ];

    for (const endpoint of endpoints) {
      await client.query(`
        INSERT INTO api_endpoints (id, project_id, path, method, summary, description, tags) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        uuidv4(),
        projectId,
        endpoint.path,
        endpoint.method,
        endpoint.summary,
        endpoint.description,
        ['api', 'enterprise']
      ]);
    }

    // Create sample test cases
    const testCases = [
      {
        name: 'User Authentication Test',
        description: 'Test user login and JWT token generation',
        type: 'integration',
        priority: 'high'
      },
      {
        name: 'Squad Creation Test',
        description: 'Test creating a new squad with proper validation',
        type: 'integration',
        priority: 'medium'
      },
      {
        name: 'API Rate Limiting Test',
        description: 'Test API rate limiting functionality',
        type: 'performance',
        priority: 'medium'
      }
    ];

    for (const testCase of testCases) {
      const testCaseId = uuidv4();
      await client.query(`
        INSERT INTO test_cases (id, project_id, name, description, type, priority, automation_status) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        testCaseId,
        projectId,
        testCase.name,
        testCase.description,
        testCase.type,
        testCase.priority,
        'automated'
      ]);

      // Create sample test results
      await client.query(`
        INSERT INTO test_results (id, test_case_id, status, execution_time, executed_by) 
        VALUES ($1, $2, $3, $4, $5)
      `, [
        uuidv4(),
        testCaseId,
        'passed',
        Math.floor(Math.random() * 5000) + 500, // Random execution time
        adminUserId
      ]);
    }

    // Create sample audit logs
    const auditActions = [
      { action: 'CREATE_ORGANIZATION', resourceType: 'ORGANIZATION', resourceId: orgId },
      { action: 'CREATE_USER', resourceType: 'USER', resourceId: adminUserId },
      { action: 'CREATE_SQUAD', resourceType: 'SQUAD', resourceId: squadId },
      { action: 'CREATE_PROJECT', resourceType: 'PROJECT', resourceId: projectId }
    ];

    for (const audit of auditActions) {
      await client.query(`
        INSERT INTO audit_logs (id, organization_id, user_id, action, resource_type, resource_id, status, ip_address) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `, [
        uuidv4(),
        orgId,
        adminUserId,
        audit.action,
        audit.resourceType,
        audit.resourceId,
        'SUCCESS',
        '127.0.0.1'
      ]);
    }

    console.log('✅ Database seeding completed successfully!');
    console.log('');
    console.log('📊 Sample data created:');
    console.log(`   Organization: Demo Enterprise Corp (${orgId})`);
    console.log(`   Admin User: admin@demo.enterprise.com (Password: DemoAdmin123!)`);
    console.log(`   Squad: Platform Engineering Squad`);
    console.log(`   Project: Enterprise API Platform`);
    console.log(`   API Endpoints: ${endpoints.length} endpoints`);
    console.log(`   Test Cases: ${testCases.length} test cases`);
    console.log(`   Audit Logs: ${auditActions.length} log entries`);
    console.log('');
    console.log('🚀 You can now:');
    console.log('   1. Start the server: npm run enterprise');
    console.log('   2. Login with: admin@demo.enterprise.com / DemoAdmin123!');
    console.log('   3. Explore the API at: http://localhost:8080/api-docs');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run seeding
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Failed to seed database:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
