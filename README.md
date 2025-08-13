# EnterpriseTrace - Enterprise Requirement Traceability Matrix

A comprehensive enterprise-scale requirement traceability matrix system that transforms from OpenAPI specifications into a full-featured project management and traceability platform. Built for organizations managing thousands of employees, squads, projects, and complex software requirements.

## 🌟 Overview

The TSR system has evolved into a complete **enterprise SaaS platform** capable of handling massive organizational scale:
- **40,000+ employees** across **50+ tribes** and **1000+ squads**
- **1000+ projects** with complex components and business requirements  
- **Monthly releases** with production incident management
- **Multi-tenant architecture** with complete security and compliance
- **Self-served, scalable, and trackable** enterprise management

## 🚀 Core Features

### 🏢 Enterprise Management
- **Multi-tenant Organizations**: Complete isolation and security
- **Role-Based Access Control (RBAC)**: Granular permissions system
- **Squad & Tribe Management**: Agile organizational structure
- **User Lifecycle Management**: Onboarding, offboarding, role changes
- **Audit Trails**: Complete security and compliance logging

### 📊 Project & Release Management
- **Project Lifecycle**: From planning to production deployment
- **Release Coordination**: Version management and deployment tracking
- **Component Traceability**: End-to-end requirement mapping
- **Test Integration**: Automated test generation and execution
- **Performance Metrics**: Real-time analytics and reporting

### 🔧 Technical Capabilities
- **OpenAPI Integration**: Parse and validate specifications
- **API Endpoint Management**: Complete REST API documentation
- **Test Automation**: Playwright-based E2E testing
- **Database Layer**: PostgreSQL with Redis caching
- **Real-time Dashboard**: Interactive project monitoring
- **CI/CD Pipeline**: Automated deployment to OpenShift/Kubernetes

## 🏗️ Architecture

### Technology Stack
```
Frontend:  React 18 + TypeScript + Material-UI
Backend:   Node.js + Express + TypeScript
Database:  PostgreSQL 13+ with Redis caching
Security:  JWT authentication, Helmet.js, CORS
Testing:   Playwright (E2E), Jest (Unit)
DevOps:    Docker, Kubernetes/OpenShift, GitHub Actions
```

### System Components
```
├── Enterprise API Server     # Multi-tenant REST API
├── Authentication Layer      # JWT + RBAC security
├── Database Layer            # PostgreSQL + Redis
├── Frontend Dashboard        # React management interface
├── Test Automation           # Playwright test suites
├── Audit & Compliance        # Complete logging system
└── CI/CD Pipeline           # Automated deployment
```

## 📁 Project Structure

```
TSR/
├── src/                      # Backend TypeScript source
│   ├── database/            # Database layer & repositories
│   │   ├── connection.ts    # DB connection & Redis setup
│   │   ├── repositories.ts  # Data access layer
│   │   └── schema.sql       # PostgreSQL database schema
│   ├── middleware/          # Security & validation
│   │   ├── auth.ts         # JWT authentication & RBAC
│   │   ├── audit.ts        # Audit logging middleware
│   │   └── validation.ts   # Request validation & schemas
│   ├── routes/             # API endpoint definitions
│   │   ├── enterprise/     # Enterprise management APIs
│   │   │   ├── auth.ts     # Authentication endpoints
│   │   │   ├── organizations.ts  # Organization management
│   │   │   └── squads.ts   # Squad & team management
│   │   ├── dashboard.ts    # Dashboard data APIs
│   │   ├── openapi.ts      # OpenAPI parsing APIs
│   │   ├── test.ts         # Test management APIs
│   │   └── traceability.ts # Requirement traceability
│   ├── services/           # Business logic services
│   │   ├── DashboardService.ts    # Dashboard data service
│   │   ├── OpenApiParser.ts       # OpenAPI specification parser
│   │   ├── TestService.ts         # Test automation service
│   │   └── TraceabilityService.ts # Requirement mapping
│   ├── models/             # TypeScript interfaces & types
│   ├── enterprise-server.ts # Enterprise API server
│   └── index.ts            # Main application server
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # React UI components
│   │   │   ├── Dashboard.tsx              # Main dashboard
│   │   │   ├── Squad.tsx                 # Squad management
│   │   │   ├── TraceabilityMatrix.tsx    # Requirement traceability
│   │   │   ├── BusinessRequirementsDashboard.tsx
│   │   │   ├── TechnicalConfigurationDashboard.tsx
│   │   │   ├── EnvironmentManagement.tsx
│   │   │   ├── ReleaseManagement.tsx
│   │   │   └── ChapterManagement.tsx
│   │   └── types/          # Frontend type definitions
├── tests/                  # Test suites
│   ├── api/               # API integration tests
│   ├── e2e/               # End-to-end tests
│   └── ui/                # Frontend component tests
├── k8s/                   # Kubernetes deployment manifests
│   ├── staging/           # Staging environment
│   └── production/        # Production environment
├── samples/               # Sample OpenAPI specifications
├── .github/               # GitHub Actions CI/CD
├── enterprise-demo.js     # Enterprise demonstration script
├── ENTERPRISE-README.md   # Enterprise deployment guide
└── README.md             # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js** 18+ with npm
- **PostgreSQL** 13+ database server
- **Redis** 6+ for caching
- **Docker** (optional, for containerized deployment)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-org/TSR.git
cd TSR

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Database Setup
```bash
# Create PostgreSQL database
createdb tsr_enterprise

# Run database schema
psql -d tsr_enterprise -f src/database/schema.sql

# Start Redis server
redis-server
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit configuration (update database credentials, JWT secret, etc.)
nano .env
```

### 4. Start Development Servers
```bash
# Start enterprise backend server
npm run enterprise

# In another terminal, start frontend
npm run dev:frontend

# Or start both simultaneously
npm run dev
```

## 🚀 Usage

### Enterprise Demo
Run the complete enterprise demonstration:
```bash
# Ensure enterprise server is running
npm run enterprise

# In another terminal, run demo
npm run enterprise:demo
```

The demo will:
1. ✅ Health check the server
2. ✅ Register enterprise organization  
3. ✅ Create admin user with full permissions
4. ✅ Create enterprise squad
5. ✅ Invite and register team members
6. ✅ Demonstrate squad management
7. ✅ Show organization statistics
8. ✅ Display audit logs

### API Endpoints

#### Authentication
```bash
POST /api/auth/register-organization  # Create new organization
POST /api/auth/login                  # User login
POST /api/auth/register-user          # Register invited user
```

#### Organization Management
```bash
GET    /api/organizations/current     # Get organization details
POST   /api/organizations/invite      # Invite new user
GET    /api/organizations/stats       # Organization statistics
```

#### Squad Management
```bash
GET    /api/squads                    # List squads
POST   /api/squads                    # Create squad
GET    /api/squads/:id                # Get squad details
POST   /api/squads/:id/members        # Add squad member
```

#### Project & Traceability
```bash
GET    /api/openapi/parse             # Parse OpenAPI spec
GET    /api/traceability/matrix       # Get traceability matrix
GET    /api/dashboard/overview        # Dashboard data
GET    /api/test/results              # Test results
```

#### Audit & Compliance
```bash
GET    /api/audit-logs               # Get audit logs
GET    /api/health                   # System health check
```

### Frontend Access
- **Dashboard**: http://localhost:3000
- **API Documentation**: http://localhost:8080/api-docs
- **Health Check**: http://localhost:8080/health

## 🧪 Testing

### Run Test Suites
```bash
# API integration tests
npm test

# End-to-end tests
npm run test:e2e

# Frontend component tests
cd frontend && npm test
```

### Test Coverage
```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
open coverage/lcov-report/index.html
```

## 🐳 Deployment

### Docker Deployment
```bash
# Build Docker image
npm run docker:build

# Run containerized application
npm run docker:run

# Or use docker-compose
docker-compose up -d
```

### Kubernetes/OpenShift
```bash
# Deploy to staging
kubectl apply -f k8s/staging/

# Deploy to production
kubectl apply -f k8s/production/

# Check deployment status
kubectl get pods -n tsr-system
```

### Environment-Specific Deployment
```bash
# Staging deployment
npm run deploy:staging

# Production deployment  
npm run deploy:production
```

## 📊 Monitoring & Analytics

### Health Monitoring
- **Health Endpoint**: `/health` - System status
- **Metrics Collection**: Automatic performance tracking
- **Audit Logging**: Complete user action history
- **Error Tracking**: Comprehensive error reporting

### Performance Metrics
- **API Response Times**: Real-time monitoring
- **Database Performance**: Query optimization tracking
- **Test Execution**: Automated test result tracking
- **User Activity**: Organization usage analytics

## 🔒 Security & Compliance

### Security Features
- **JWT Authentication**: Secure token-based auth
- **Role-Based Access Control**: Granular permissions
- **Rate Limiting**: API abuse prevention
- **CORS Protection**: Cross-origin request security
- **Helmet.js**: Security headers
- **Input Validation**: Joi schema validation

### Compliance & Audit
- **Complete Audit Trail**: All user actions logged
- **Data Encryption**: At rest and in transit
- **Access Controls**: Multi-level permission system
- **Session Management**: Secure session handling
- **GDPR Compliance**: Data privacy controls

## 🔧 Configuration

### Environment Variables
Key configuration options in `.env`:
```bash
# Database
DB_HOST=localhost
DB_NAME=tsr_enterprise
DB_USER=postgres
DB_PASSWORD=postgres

# Security
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h

# API Settings
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=http://localhost:3000
```

### Database Configuration
- **PostgreSQL**: Primary data storage
- **Redis**: Session cache and temporary data
- **Connection Pooling**: Optimized for high load
- **Migrations**: Automated schema updates

## 📈 Enterprise Scale Features

### Massive Scale Support
- **Multi-tenancy**: Complete organization isolation
- **Horizontal Scaling**: Kubernetes-ready architecture
- **Load Balancing**: Multiple server instance support
- **Database Optimization**: Indexed queries and caching

### Organizational Features
- **40,000+ Users**: Efficient user management
- **1000+ Squads**: Agile team coordination
- **Complex Hierarchies**: Tribes, squads, chapters
- **Role Management**: Executive, manager, team levels

## 🤝 Contributing

### Development Setup
```bash
# Fork the repository
git clone https://github.com/your-username/TSR.git

# Create feature branch
git checkout -b feature/your-feature

# Make changes and test
npm test && npm run test:e2e

# Submit pull request
```

### Code Standards
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Jest**: Unit test coverage
- **Playwright**: E2E test coverage

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- **API Documentation**: http://localhost:8080/api-docs
- **Enterprise Guide**: [ENTERPRISE-README.md](ENTERPRISE-README.md)
- **Deployment Guide**: [k8s/README.md](k8s/README.md)

### Getting Help
- **Issues**: GitHub Issues for bug reports
- **Discussions**: GitHub Discussions for questions
- **Enterprise Support**: Contact enterprise@yourcompany.com

---

## 🎯 Enterprise Ready

This system is **production-ready** for enterprise deployment at massive scale. It provides:

✅ **Complete Enterprise Management** - Organizations, users, squads, projects  
✅ **Security & Compliance** - RBAC, audit trails, data protection  
✅ **Scalable Architecture** - Multi-tenant, cloud-native, Kubernetes-ready  
✅ **Real-time Analytics** - Dashboards, metrics, performance monitoring  
✅ **API-First Design** - Complete REST API with Swagger documentation  
✅ **Production Deployment** - CI/CD pipelines, health monitoring, error tracking  

**Ready for commercial deployment as an enterprise project management SaaS platform!** 🚀
│   ├── src/
│   │   ├── components/    # React components
│   │   └── App.tsx        # Main app component
│   └── public/            # Static assets
├── tests/                 # Test suites
│   ├── api/              # API integration tests
│   ├── ui/               # UI tests
│   └── e2e/              # End-to-end tests
├── samples/              # Sample OpenAPI specifications
├── k8s/                  # Kubernetes deployment configs
├── .github/workflows/    # CI/CD pipeline
└── docs/                 # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Docker (optional)
- PostgreSQL (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TSR
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd frontend && npm install && cd ..
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Build the application**
   ```bash
   npm run build
   ```

5. **Start the development servers**
   ```bash
   # Terminal 1: Backend
   npm run dev:backend
   
   # Terminal 2: Frontend
   npm run dev:frontend
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080
   - API Documentation: http://localhost:8080/api-docs

### Using Docker

1. **Build the Docker image**
   ```bash
   npm run docker:build
   ```

2. **Run the container**
   ```bash
   npm run docker:run
   ```

## 📋 Usage

### 1. Upload OpenAPI Specification

Use the API endpoint to parse and validate your OpenAPI specification:

```bash
curl -X POST http://localhost:8080/api/openapi/parse \
  -H "Content-Type: application/json" \
  -d @samples/simple-ecommerce-api.yaml
```

### 2. Generate Traceability Matrix

Create a comprehensive traceability matrix:

```bash
curl -X POST http://localhost:8080/api/traceability/matrix \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "my-project",
    "openApiSpec": { ... },
    "includeTests": true
  }'
```

### 3. Run Test Suite

Execute automated tests for your API:

```bash
curl -X POST http://localhost:8080/api/test/run \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "my-project",
    "testType": "api"
  }'
```

### 4. View Dashboard

Navigate to the web interface to view:
- Project metrics and statistics
- Component health status
- Test coverage analysis
- Requirements traceability
- Recent activity logs

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### API Integration Tests
```bash
npx playwright test tests/api/
```

### UI Tests
```bash
npx playwright test tests/ui/
```

### End-to-End Tests
```bash
npx playwright test tests/e2e/
```

### All Tests
```bash
npm run test:e2e
```

## 📊 Sample OpenAPI Specifications

The project includes two sample specifications for demonstration:

### 1. Simple E-commerce API (`samples/simple-ecommerce-api.yaml`)
- Basic CRUD operations for users, products, and orders
- Demonstrates simple API structure and endpoints
- Good for initial testing and validation

### 2. Complex Banking API (`samples/complex-banking-api.yaml`)
- Comprehensive banking system with authentication, accounts, transactions
- Advanced features like multi-factor authentication, batch processing
- Demonstrates complex API patterns and relationships

## 🚀 Deployment

### OpenShift Container Platform 4

The application is designed for deployment on OpenShift 4 with automated CI/CD.

#### Prerequisites
- OpenShift 4 cluster access
- GitHub repository with Actions enabled
- Container registry access (GitHub Container Registry)

#### Deployment Steps

1. **Configure secrets in GitHub**
   ```
   OPENSHIFT_SERVER=<your-openshift-server>
   OPENSHIFT_TOKEN=<service-account-token>
   STAGING_URL=<staging-environment-url>
   PRODUCTION_URL=<production-environment-url>
   ```

2. **Deploy to staging** (automatic on develop branch)
   - Push to `develop` branch
   - GitHub Actions will build and deploy to staging
   - Smoke tests run automatically

3. **Deploy to production** (automatic on main branch)
   - Push to `main` branch
   - GitHub Actions will build and deploy to production
   - Comprehensive health checks run automatically

#### Manual Deployment

```bash
# Login to OpenShift
oc login --token=<token> --server=<server>

# Create/switch to project
oc new-project rtm-production

# Deploy application
envsubst < k8s/production/deployment.yaml | oc apply -f -
envsubst < k8s/production/service.yaml | oc apply -f -
envsubst < k8s/production/route.yaml | oc apply -f -

# Monitor deployment
oc rollout status deployment/rtm-app
```

### Environment Configuration

#### Staging Environment
- 2 replicas for availability
- Basic resource limits
- Automated testing after deployment

#### Production Environment
- 3 replicas with rolling updates
- Enhanced resource allocations
- Comprehensive monitoring and logging
- Production-grade health checks

## 📖 API Documentation

### Core Endpoints

#### OpenAPI Management
- `POST /api/openapi/parse` - Parse OpenAPI specification
- `POST /api/openapi/validate` - Validate OpenAPI specification
- `POST /api/openapi/endpoints` - Extract endpoints from specification

#### Dashboard
- `GET /api/dashboard/overview` - Get project dashboard data
- `GET /api/dashboard/metrics` - Get detailed test metrics

#### Traceability
- `POST /api/traceability/matrix` - Generate traceability matrix
- `GET /api/traceability/requirements` - Get requirements traceability
- `GET /api/traceability/coverage` - Get coverage analysis

#### Testing
- `POST /api/test/run` - Execute test suite
- `GET /api/test/results` - Get test results
- `POST /api/test/generate` - Generate test cases from OpenAPI spec

### Interactive API Documentation
Visit http://localhost:8080/api-docs for complete Swagger UI documentation.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Backend server port | `8080` |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `REDIS_URL` | Redis connection string | - |
| `JWT_SECRET` | JWT signing secret | - |
| `LOG_LEVEL` | Logging level | `debug` |

### Frontend Configuration
- Proxy configuration for API calls
- Material-UI theme customization
- Chart.js configuration for metrics visualization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests for new features
- Update documentation for API changes
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAPI Initiative for specification standards
- Playwright team for excellent testing framework
- Material-UI for React components
- ReportPortal.io for dashboard inspiration

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Review the API documentation at `/api-docs`
- Check the sample specifications in `/samples`

## 🗺️ Roadmap

### Version 2.0 (Planned)
- [ ] Real-time WebSocket notifications
- [ ] Advanced requirement management
- [ ] Custom test framework adapters
- [ ] Performance monitoring dashboard
- [ ] Multi-tenant support
- [ ] Advanced reporting features

### Version 1.1 (Current)
- [x] OpenAPI 3.0 support
- [x] Playwright integration
- [x] Interactive dashboard
- [x] CI/CD pipeline
- [x] OpenShift deployment

---

## Quick Commands Reference

```bash
# Development
npm run dev                 # Start both backend and frontend
npm run dev:backend        # Start backend only
npm run dev:frontend       # Start frontend only

# Building
npm run build              # Build both backend and frontend
npm run build:frontend     # Build frontend only

# Testing
npm test                   # Run unit tests
npm run test:e2e          # Run all Playwright tests
npx playwright test        # Run Playwright tests

# Docker
npm run docker:build      # Build Docker image
npm run docker:run        # Run Docker container

# Linting
npm run lint              # Run ESLint
```

For more detailed information, see the individual documentation files in the `/docs` directory.
