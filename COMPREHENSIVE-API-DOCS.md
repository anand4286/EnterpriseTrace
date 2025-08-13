# Enterprise Requirement Traceability Matrix API Documentation

## Overview
This documentation covers all 25+ REST endpoints for the Enterprise TSR system, providing comprehensive CRUD operations for requirement traceability, organizational management, and testing workflows.

## Base URL
- **Development**: `http://localhost:8080/api`
- **Staging**: `https://tsr-staging.your-domain.com/api`
- **Production**: `https://tsr.your-domain.com/api`

## Authentication
All API endpoints (except login and health check) require JWT authentication.

### Headers Required
```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

## API Endpoints Reference

### 1. Authentication & User Management

#### 1.1 User Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "admin@demo.enterprise.com",
  "password": "DemoAdmin123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "admin@demo.enterprise.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "ADMIN",
      "organizationId": "uuid"
    }
  }
}
```

#### 1.2 Get Current User Profile
```http
GET /auth/profile
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@company.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "USER",
    "organizationId": "uuid",
    "lastLogin": "2024-01-15T10:30:00Z",
    "permissions": ["READ_PROJECTS", "WRITE_TESTS"]
  }
}
```

#### 1.3 Update User Profile
```http
PUT /auth/profile
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "preferences": {
    "theme": "dark",
    "notifications": true
  }
}
```

### 2. Organization Management

#### 2.1 Get All Organizations
```http
GET /organizations
```

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)
- `search` (string): Search by name

**Response:**
```json
{
  "success": true,
  "data": {
    "organizations": [
      {
        "id": "uuid",
        "name": "Demo Enterprise Corp",
        "domain": "demo.enterprise.com",
        "settings": {
          "allowSelfRegistration": false,
          "defaultRole": "USER"
        },
        "userCount": 145,
        "squadCount": 12,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

#### 2.2 Create Organization
```http
POST /organizations
```

**Request Body:**
```json
{
  "name": "New Enterprise Corp",
  "domain": "new.enterprise.com",
  "settings": {
    "allowSelfRegistration": true,
    "defaultRole": "USER",
    "maxUsers": 1000
  }
}
```

#### 2.3 Get Organization by ID
```http
GET /organizations/:id
```

#### 2.4 Update Organization
```http
PUT /organizations/:id
```

#### 2.5 Delete Organization
```http
DELETE /organizations/:id
```

### 3. Squad Management

#### 3.1 Get All Squads
```http
GET /squads
```

**Query Parameters:**
- `organizationId` (string): Filter by organization
- `chapterId` (string): Filter by chapter
- `page`, `limit`, `search`

**Response:**
```json
{
  "success": true,
  "data": {
    "squads": [
      {
        "id": "uuid",
        "name": "Platform Engineering Squad",
        "description": "Core platform development team",
        "organizationId": "uuid",
        "chapterId": "uuid",
        "leadId": "uuid",
        "memberCount": 8,
        "projectCount": 3,
        "status": "ACTIVE",
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": { /* ... */ }
  }
}
```

#### 3.2 Create Squad
```http
POST /squads
```

**Request Body:**
```json
{
  "name": "New Development Squad",
  "description": "Frontend development team",
  "organizationId": "uuid",
  "chapterId": "uuid",
  "leadId": "uuid"
}
```

#### 3.3 Get Squad by ID
```http
GET /squads/:id
```

#### 3.4 Update Squad
```http
PUT /squads/:id
```

#### 3.5 Delete Squad
```http
DELETE /squads/:id
```

#### 3.6 Get Squad Members
```http
GET /squads/:id/members
```

#### 3.7 Add Squad Member
```http
POST /squads/:id/members
```

**Request Body:**
```json
{
  "userId": "uuid",
  "role": "DEVELOPER"
}
```

#### 3.8 Remove Squad Member
```http
DELETE /squads/:id/members/:userId
```

### 4. Project Management

#### 4.1 Get All Projects
```http
GET /projects
```

**Query Parameters:**
- `squadId` (string): Filter by squad
- `status` (string): Filter by status (PLANNING, ACTIVE, COMPLETED, ARCHIVED)
- `page`, `limit`, `search`

**Response:**
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "id": "uuid",
        "name": "Enterprise API Platform",
        "description": "Core API infrastructure",
        "squadId": "uuid",
        "status": "ACTIVE",
        "startDate": "2024-01-01",
        "endDate": "2024-06-30",
        "componentCount": 12,
        "testCoverage": 85.5,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": { /* ... */ }
  }
}
```

#### 4.2 Create Project
```http
POST /projects
```

#### 4.3 Get Project by ID
```http
GET /projects/:id
```

#### 4.4 Update Project
```http
PUT /projects/:id
```

#### 4.5 Delete Project
```http
DELETE /projects/:id
```

### 5. API Endpoint Management

#### 5.1 Get All API Endpoints
```http
GET /api-endpoints
```

**Query Parameters:**
- `projectId` (string): Filter by project
- `method` (string): Filter by HTTP method
- `status` (string): Filter by implementation status

**Response:**
```json
{
  "success": true,
  "data": {
    "endpoints": [
      {
        "id": "uuid",
        "projectId": "uuid",
        "method": "GET",
        "path": "/users",
        "summary": "Get all users",
        "description": "Retrieve paginated list of users",
        "tags": ["users", "authentication"],
        "parameters": [
          {
            "name": "page",
            "in": "query",
            "type": "integer",
            "required": false
          }
        ],
        "responses": {
          "200": {
            "description": "Success",
            "schema": { /* OpenAPI schema */ }
          }
        },
        "implementationStatus": "IMPLEMENTED",
        "testCoverage": 90,
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": { /* ... */ }
  }
}
```

#### 5.2 Create API Endpoint
```http
POST /api-endpoints
```

#### 5.3 Get API Endpoint by ID
```http
GET /api-endpoints/:id
```

#### 5.4 Update API Endpoint
```http
PUT /api-endpoints/:id
```

#### 5.5 Delete API Endpoint
```http
DELETE /api-endpoints/:id
```

### 6. Test Management

#### 6.1 Get All Test Cases
```http
GET /test-cases
```

**Query Parameters:**
- `projectId` (string): Filter by project
- `endpointId` (string): Filter by API endpoint
- `status` (string): Filter by test status

**Response:**
```json
{
  "success": true,
  "data": {
    "testCases": [
      {
        "id": "uuid",
        "projectId": "uuid",
        "endpointId": "uuid",
        "name": "Test user creation",
        "description": "Verify user creation endpoint",
        "type": "INTEGRATION",
        "priority": "HIGH",
        "status": "PASSED",
        "steps": [
          {
            "action": "POST /users",
            "expected": "201 Created"
          }
        ],
        "createdAt": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": { /* ... */ }
  }
}
```

#### 6.2 Create Test Case
```http
POST /test-cases
```

#### 6.3 Get Test Case by ID
```http
GET /test-cases/:id
```

#### 6.4 Update Test Case
```http
PUT /test-cases/:id
```

#### 6.5 Delete Test Case
```http
DELETE /test-cases/:id
```

#### 6.6 Execute Test Case
```http
POST /test-cases/:id/execute
```

**Response:**
```json
{
  "success": true,
  "data": {
    "executionId": "uuid",
    "status": "RUNNING",
    "startedAt": "2024-01-15T10:30:00Z"
  }
}
```

### 7. Traceability Matrix

#### 7.1 Generate Traceability Matrix
```http
GET /traceability/matrix
```

**Query Parameters:**
- `projectId` (string): Required project ID
- `format` (string): Response format (json, csv, excel)

**Response:**
```json
{
  "success": true,
  "data": {
    "matrix": {
      "requirements": [
        {
          "id": "REQ-001",
          "description": "User authentication",
          "endpoints": ["EP-001", "EP-002"],
          "testCases": ["TC-001", "TC-002"],
          "coverage": 100
        }
      ],
      "coverage": {
        "overall": 85.5,
        "requirements": 90,
        "endpoints": 80,
        "tests": 85
      }
    }
  }
}
```

#### 7.2 Get Coverage Report
```http
GET /traceability/coverage
```

#### 7.3 Get Gap Analysis
```http
GET /traceability/gaps
```

### 8. Dashboard & Analytics

#### 8.1 Get Dashboard Summary
```http
GET /dashboard/summary
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totals": {
      "organizations": 1,
      "squads": 12,
      "projects": 45,
      "endpoints": 234,
      "testCases": 567
    },
    "coverage": {
      "overall": 85.5,
      "byProject": [
        {
          "projectId": "uuid",
          "name": "API Platform",
          "coverage": 90
        }
      ]
    },
    "recentActivity": [
      {
        "type": "TEST_EXECUTION",
        "description": "User login test passed",
        "timestamp": "2024-01-15T10:30:00Z"
      }
    ]
  }
}
```

#### 8.2 Get Project Analytics
```http
GET /dashboard/projects/:id/analytics
```

#### 8.3 Get Squad Performance
```http
GET /dashboard/squads/:id/performance
```

### 9. OpenAPI Integration

#### 9.1 Upload OpenAPI Specification
```http
POST /openapi/upload
```

**Request (multipart/form-data):**
```
file: [OpenAPI YAML/JSON file]
projectId: uuid
```

**Response:**
```json
{
  "success": true,
  "data": {
    "parsedEndpoints": 15,
    "createdEndpoints": 12,
    "updatedEndpoints": 3,
    "errors": []
  }
}
```

#### 9.2 Parse OpenAPI from URL
```http
POST /openapi/parse-url
```

**Request Body:**
```json
{
  "url": "https://api.example.com/openapi.yaml",
  "projectId": "uuid"
}
```

#### 9.3 Get Parsed Specifications
```http
GET /openapi/specifications
```

### 10. Audit & Monitoring

#### 10.1 Get Audit Logs
```http
GET /audit/logs
```

**Query Parameters:**
- `action` (string): Filter by action type
- `userId` (string): Filter by user
- `from` (date): Start date
- `to` (date): End date
- `page`, `limit`

**Response:**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "uuid",
        "userId": "uuid",
        "action": "CREATE_PROJECT",
        "resourceType": "PROJECT",
        "resourceId": "uuid",
        "details": {
          "projectName": "New API Project"
        },
        "ipAddress": "192.168.1.100",
        "userAgent": "Mozilla/5.0...",
        "timestamp": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": { /* ... */ }
  }
}
```

#### 10.2 Get System Health
```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "1.0.0",
    "uptime": 86400,
    "database": {
      "status": "connected",
      "connections": {
        "active": 5,
        "idle": 15,
        "total": 20
      }
    },
    "redis": {
      "status": "connected",
      "memory": "2.5MB"
    },
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `AUTHENTICATION_ERROR`: Invalid or missing JWT token
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource already exists
- `RATE_LIMITED`: Too many requests
- `INTERNAL_ERROR`: Server error

## Rate Limiting

API endpoints are rate limited:
- **Authentication**: 5 requests per minute per IP
- **Standard endpoints**: 100 requests per minute per user
- **File uploads**: 10 requests per hour per user

Rate limit headers are included in all responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `page`: Page number (starting from 1)
- `limit`: Items per page (max 100)

**Response Format:**
```json
{
  "data": { /* ... */ },
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 150,
    "totalPages": 15,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

## Search & Filtering

Most list endpoints support search and filtering:

**Common Query Parameters:**
- `search`: Text search across relevant fields
- `sortBy`: Field to sort by
- `sortOrder`: `asc` or `desc`
- `status`: Filter by status
- `createdFrom`, `createdTo`: Date range filters

## WebSocket Events

Real-time updates are available via WebSocket connection at `/ws`:

**Connection:**
```javascript
const ws = new WebSocket('ws://localhost:8080/ws');
ws.send(JSON.stringify({
  type: 'authenticate',
  token: 'your-jwt-token'
}));
```

**Event Types:**
- `test_execution_complete`: Test execution finished
- `project_updated`: Project data changed
- `new_audit_log`: New audit log entry

## SDK Examples

### JavaScript/TypeScript
```typescript
import { TSRClient } from '@enterprise/tsr-sdk';

const client = new TSRClient({
  baseURL: 'http://localhost:8080/api',
  token: 'your-jwt-token'
});

// Get all projects
const projects = await client.projects.list({
  page: 1,
  limit: 10
});

// Create a new test case
const testCase = await client.testCases.create({
  name: 'Test user registration',
  projectId: 'uuid',
  type: 'INTEGRATION'
});
```

### Python
```python
from tsr_client import TSRClient

client = TSRClient(
    base_url='http://localhost:8080/api',
    token='your-jwt-token'
)

# Get dashboard summary
summary = client.dashboard.get_summary()

# Execute test case
result = client.test_cases.execute('test-case-id')
```

### cURL Examples
```bash
# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@demo.enterprise.com","password":"DemoAdmin123!"}'

# Get projects with authentication
curl -X GET http://localhost:8080/api/projects \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create new squad
curl -X POST http://localhost:8080/api/squads \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"New Squad","organizationId":"uuid"}'
```

## Testing the API

### Using the Interactive Documentation
1. Start the server: `npm run enterprise`
2. Visit: http://localhost:8080/api-docs
3. Use the "Authorize" button to add your JWT token
4. Test endpoints directly in the browser

### Postman Collection
Import the Postman collection from `/docs/postman-collection.json` for complete API testing.

### Integration Tests
Run the test suite:
```bash
npm test
npm run test:api
npm run test:e2e
```

## Deployment Considerations

### Environment Variables
Required environment variables for each deployment:

**Development:**
- `NODE_ENV=development`
- `PORT=8080`
- `DB_*` variables for PostgreSQL
- `REDIS_URL` for Redis connection
- `JWT_SECRET` for authentication

**Production:**
- `NODE_ENV=production`
- `CORS_ORIGIN` - Allowed origins
- `RATE_LIMIT_*` - Rate limiting configuration
- `LOG_LEVEL=warn`
- SSL/TLS configuration

### Monitoring & Observability
- Health check endpoint: `/health`
- Metrics endpoint: `/metrics` (Prometheus format)
- Audit logging for all operations
- Request/response logging in development
- Error tracking and alerting

This comprehensive API documentation covers all 25+ REST endpoints with full CRUD operations, authentication, error handling, and real-world usage examples.
