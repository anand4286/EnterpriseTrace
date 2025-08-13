import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

// Middleware imports
import { errorHandler } from './middleware/validation';
import { requestLogger } from './middleware/audit';
import { getAuditLogs } from './middleware/audit';

// Route imports
import { authRoutes } from './routes/enterprise/auth';
import { organizationRoutes } from './routes/enterprise/organizations';
import { squadRoutes } from './routes/enterprise/squads';
import { userManagementRoutes } from './routes/enterprise/users';
import { dashboardRouter } from './routes/dashboard';
import { openApiRouter } from './routes/openapi';
import { traceabilityRouter } from './routes/traceability';
import { testRouter } from './routes/test';
import { releaseRouter } from './routes/releases';

const app = express();
const PORT = process.env.PORT || 8080;

// Trust proxy for proper client IP detection
app.set('trust proxy', 1);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || ['http://localhost:3000', 'http://localhost:4000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Body parsing and compression
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/squads', squadRoutes);
app.use('/api', userManagementRoutes); // This will handle both /api/users and /api/roles
app.use('/api/dashboard', dashboardRouter);
app.use('/api/openapi', openApiRouter);
app.use('/api/traceability', traceabilityRouter);
app.use('/api/test', testRouter);
app.use('/api/releases', releaseRouter);

// Audit logs endpoint
app.get('/api/audit-logs', (req: Request, res: Response) => {
  const filters = {
    organizationId: req.query.organizationId as string,
    userId: req.query.userId as string,
    resource: req.query.resource as string,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 100,
    offset: req.query.offset ? parseInt(req.query.offset as string) : 0
  };

  const logs = getAuditLogs(filters);
  res.json({ logs, total: logs.length });
});

// API Documentation placeholder
app.get('/api-docs', (req: Request, res: Response) => {
  res.json({
    title: 'Enterprise TSR API',
    version: '2.0.0',
    description: 'Enterprise-scale Requirement Traceability Matrix API',
    endpoints: {
      authentication: '/api/auth/*',
      organizations: '/api/organizations/*',
      squads: '/api/squads/*'
    }
  });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Enterprise TSR Server running on port ${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health check available at http://localhost:${PORT}/health`);
  console.log(`🔐 Authentication endpoints at http://localhost:${PORT}/api/auth/*`);
  console.log(`🏢 Organization management at http://localhost:${PORT}/api/organizations/*`);
  console.log(`👥 Squad management at http://localhost:${PORT}/api/squads/*`);
});

export default app;
