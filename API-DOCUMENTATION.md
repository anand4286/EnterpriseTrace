# Enterprise TSR API Documentation

Complete API reference for the Enterprise Requirement Traceability Matrix System.

## 🔐 Authentication

All API endpoints except health check and organization registration require authentication via JWT Bearer token.

### Headers
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

### Error Responses
```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "timestamp": "2025-08-13T04:52:45.584Z"
}
```

## 📋 API Endpoints

### Authentication & Organization Management

#### Register New Organization
Creates a new organization with admin user.

```http
POST /api/auth/register-organization
```

**Request Body:**
```json
{
  "organizationName": "Enterprise Corp",
  "domain": "enterprise-corp.com",
  "adminEmail": "admin@enterprise-corp.com",
  "adminPassword": "SecurePassword123!",
  "adminFirstName": "Admin",
  "adminLastName": "User",
  "subscriptionType": "enterprise"
}
```

**Response (201):**
```json
{
  "organization": {
    "id": "uuid",
    "name": "Enterprise Corp",
    "domain": "enterprise-corp.com",
    "subscription": {
      "type": "enterprise",
      "maxUsers": 1000,
      "maxProjects": 500
    }
  },
  "adminUser": {
    "id": "uuid",
    "email": "admin@enterprise-corp.com",
    "role": "ADMIN"
  },
  "token": "jwt_token_here"
}
```

#### User Login
Authenticate existing user.

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@enterprise-corp.com",
  "password": "UserPassword123!"
}
```

**Response (200):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "user@enterprise-corp.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": {
      "name": "ENGINEER",
      "level": "individual",
      "permissions": ["squads:read", "projects:read"]
    },
    "organizationId": "uuid"
  }
}
```

#### Register Invited User
Complete user registration from invitation.

```http
POST /api/auth/register-user
```

**Request Body:**
```json
{
  "email": "newuser@enterprise-corp.com",
  "password": "NewUserPassword123!",
  "firstName": "Jane",
  "lastName": "Smith",
  "inviteToken": "invitation_token_here"
}
```

### Organization Management

#### Get Current Organization
Retrieve organization details for authenticated user.

```http
GET /api/organizations/current
```

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Enterprise Corp",
  "domain": "enterprise-corp.com",
  "settings": {
    "timezone": "UTC",
    "currency": "USD",
    "workingDays": [1, 2, 3, 4, 5]
  },
  "subscription": {
    "type": "enterprise",
    "maxUsers": 1000,
    "maxProjects": 500,
    "features": ["basic", "advanced", "premium"]
  },
  "createdAt": "2025-08-13T04:52:45.584Z"
}
```

#### Invite User
Send invitation to new user.

```http
POST /api/organizations/invite
```

**Request Body:**
```json
{
  "email": "newuser@enterprise-corp.com",
  "firstName": "New",
  "lastName": "User",
  "role": "ENGINEER",
  "department": "Engineering",
  "jobTitle": "Software Engineer"
}
```

**Response (200):**
```json
{
  "message": "Invitation sent successfully",
  "inviteToken": "invitation_token_here",
  "inviteLink": "http://localhost:3000/register?token=invitation_token"
}
```

#### Get Organization Statistics
Retrieve organization metrics and statistics.

```http
GET /api/organizations/stats
```

**Response (200):**
```json
{
  "totalUsers": 150,
  "activeUsers": 142,
  "totalSquads": 25,
  "totalProjects": 45,
  "totalReleases": 12,
  "usersByRole": {
    "ADMIN": 5,
    "MANAGER": 15,
    "ENGINEER": 100,
    "DESIGNER": 20,
    "ANALYST": 10
  },
  "squadsByType": {
    "feature": 15,
    "platform": 5,
    "enabling": 3,
    "complicated-subsystem": 2
  }
}
```

### Squad Management

#### List Squads
Get all squads for the organization.

```http
GET /api/squads?limit=20&offset=0&tribeId=uuid&type=feature&status=performing
```

**Query Parameters:**
- `limit` (optional): Number of results to return (default: 20)
- `offset` (optional): Number of results to skip (default: 0)
- `tribeId` (optional): Filter by tribe ID
- `type` (optional): Filter by squad type (feature, platform, enabling, complicated-subsystem)
- `status` (optional): Filter by status (forming, storming, norming, performing, dissolved)

**Response (200):**
```json
{
  "squads": [
    {
      "id": "uuid",
      "name": "Platform Engineering Squad",
      "purpose": "Develop and maintain platform infrastructure",
      "type": "platform",
      "status": "performing",
      "members": [
        {
          "userId": "uuid",
          "name": "John Doe",
          "role": "tech-lead",
          "allocation": 100
        }
      ],
      "capacity": {
        "totalPoints": 50,
        "availablePoints": 30,
        "committedPoints": 20
      },
      "productOwner": {
        "id": "uuid",
        "name": "Jane Smith"
      },
      "techLead": {
        "id": "uuid",
        "name": "John Doe"
      }
    }
  ],
  "total": 25,
  "limit": 20,
  "offset": 0
}
```

#### Create Squad
Create a new squad.

```http
POST /api/squads
```

**Request Body:**
```json
{
  "name": "Platform Engineering Squad",
  "purpose": "Develop and maintain enterprise platform infrastructure",
  "tribeId": "uuid",
  "type": "platform",
  "totalPoints": 50
}
```

**Response (201):**
```json
{
  "message": "Squad created successfully",
  "squad": {
    "id": "uuid",
    "name": "Platform Engineering Squad",
    "purpose": "Develop and maintain enterprise platform infrastructure",
    "type": "platform",
    "status": "forming",
    "capacity": {
      "totalPoints": 50,
      "availablePoints": 50,
      "committedPoints": 0
    },
    "members": [],
    "createdAt": "2025-08-13T04:52:45.584Z"
  }
}
```

#### Get Squad Details
Retrieve detailed information about a specific squad.

```http
GET /api/squads/:squadId
```

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Platform Engineering Squad",
  "purpose": "Develop and maintain platform infrastructure",
  "type": "platform",
  "status": "performing",
  "capacity": {
    "totalPoints": 50,
    "availablePoints": 30,
    "committedPoints": 20,
    "velocity": [25, 30, 28, 32],
    "efficiency": 85
  },
  "performance": {
    "deliveredStories": 45,
    "deliveredPoints": 180,
    "cycleTime": 5.2,
    "throughput": 8.5
  },
  "members": [
    {
      "userId": "uuid",
      "name": "John Doe",
      "email": "john@enterprise-corp.com",
      "role": "tech-lead",
      "allocation": 100,
      "startDate": "2025-01-01",
      "skills": ["TypeScript", "React", "Node.js"]
    }
  ],
  "createdAt": "2025-08-13T04:52:45.584Z",
  "updatedAt": "2025-08-13T04:52:45.584Z"
}
```

#### Add Squad Member
Add a user to a squad.

```http
POST /api/squads/:squadId/members
```

**Request Body:**
```json
{
  "userId": "uuid",
  "role": "engineer",
  "allocation": 100,
  "startDate": "2025-08-13"
}
```

**Response (200):**
```json
{
  "message": "Member added to squad successfully",
  "member": {
    "userId": "uuid",
    "name": "Jane Smith",
    "role": "engineer",
    "allocation": 100,
    "startDate": "2025-08-13"
  },
  "squad": {
    "id": "uuid",
    "name": "Platform Engineering Squad",
    "memberCount": 3
  }
}
```

### Project & Traceability Management

#### Parse OpenAPI Specification
Upload and parse an OpenAPI specification.

```http
POST /api/openapi/parse
```

**Request Body:**
```json
{
  "spec": "openapi_spec_content_here",
  "format": "yaml",
  "projectId": "uuid"
}
```

**Response (200):**
```json
{
  "success": true,
  "info": {
    "title": "E-commerce API",
    "version": "1.0.0",
    "description": "API for e-commerce platform"
  },
  "endpoints": [
    {
      "path": "/api/products",
      "method": "GET",
      "summary": "Get all products",
      "tags": ["products"],
      "parameters": [],
      "responses": {
        "200": {
          "description": "List of products"
        }
      }
    }
  ],
  "components": 5,
  "paths": 12
}
```

#### Get Traceability Matrix
Retrieve requirement traceability matrix for a project.

```http
GET /api/traceability/matrix?projectId=uuid
```

**Response (200):**
```json
{
  "projectId": "uuid",
  "projectName": "E-commerce Platform",
  "matrix": [
    {
      "requirementId": "REQ-001",
      "requirement": "User can view product catalog",
      "endpoints": [
        {
          "id": "uuid",
          "path": "/api/products",
          "method": "GET",
          "coverage": "full"
        }
      ],
      "testCases": [
        {
          "id": "uuid",
          "name": "Test product catalog retrieval",
          "status": "passed",
          "coverage": "automated"
        }
      ],
      "coverageScore": 100
    }
  ],
  "overallCoverage": 85,
  "totalRequirements": 25,
  "coveredRequirements": 21
}
```

### Dashboard & Analytics

#### Get Dashboard Overview
Retrieve dashboard data for organization.

```http
GET /api/dashboard/overview
```

**Response (200):**
```json
{
  "overview": {
    "totalProjects": 45,
    "activeProjects": 32,
    "totalSquads": 25,
    "activeSquads": 23,
    "totalUsers": 150,
    "activeUsers": 142
  },
  "projectHealth": [
    {
      "projectId": "uuid",
      "name": "E-commerce Platform",
      "health": "healthy",
      "coverage": 85,
      "testsPassing": 95,
      "lastUpdated": "2025-08-13T04:52:45.584Z"
    }
  ],
  "recentActivity": [
    {
      "id": "uuid",
      "type": "test_execution",
      "description": "Automated tests completed for release v1.2.0",
      "timestamp": "2025-08-13T04:52:45.584Z",
      "user": "John Doe"
    }
  ],
  "metrics": {
    "averageCoverage": 82,
    "testExecutionRate": 95,
    "deploymentFrequency": 12
  }
}
```

### Test Management

#### Get Test Results
Retrieve test execution results.

```http
GET /api/test/results?projectId=uuid&releaseId=uuid&limit=50
```

**Response (200):**
```json
{
  "results": [
    {
      "id": "uuid",
      "testCaseId": "uuid",
      "testName": "Product API Integration Test",
      "status": "passed",
      "executionTime": 1250,
      "executedAt": "2025-08-13T04:52:45.584Z",
      "executedBy": "Automated",
      "details": {
        "request": {
          "method": "GET",
          "url": "/api/products",
          "headers": {}
        },
        "response": {
          "status": 200,
          "body": "response_data"
        }
      }
    }
  ],
  "summary": {
    "total": 125,
    "passed": 118,
    "failed": 5,
    "skipped": 2,
    "passRate": 94.4
  }
}
```

### Audit & Compliance

#### Get Audit Logs
Retrieve audit trail for organization.

```http
GET /api/audit-logs?organizationId=uuid&limit=100&action=CREATE_SQUAD
```

**Query Parameters:**
- `organizationId` (required): Organization ID
- `limit` (optional): Number of results (default: 100)
- `action` (optional): Filter by specific action
- `userId` (optional): Filter by user ID
- `resourceType` (optional): Filter by resource type

**Response (200):**
```json
{
  "logs": [
    {
      "id": "uuid",
      "action": "CREATE_SQUAD",
      "resourceType": "SQUAD",
      "resourceId": "uuid",
      "user": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@enterprise-corp.com"
      },
      "changes": {
        "name": "Platform Engineering Squad",
        "type": "platform"
      },
      "ipAddress": "192.168.1.100",
      "userAgent": "Mozilla/5.0...",
      "status": "SUCCESS",
      "timestamp": "2025-08-13T04:52:45.584Z"
    }
  ],
  "total": 1250,
  "summary": {
    "totalActions": 1250,
    "successfulActions": 1195,
    "failedActions": 55,
    "uniqueUsers": 35,
    "uniqueActions": 12
  }
}
```

### System Health

#### Health Check
Check system health and status.

```http
GET /health
```

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "2025-08-13T04:52:45.584Z",
  "version": "1.0.0",
  "environment": "development",
  "services": {
    "database": "healthy",
    "redis": "healthy",
    "api": "healthy"
  },
  "metrics": {
    "uptime": 3600,
    "memoryUsage": 256.5,
    "cpuUsage": 15.2
  }
}
```

## 🔒 Security & Rate Limiting

### Rate Limits
- **Authentication endpoints**: 5 requests per minute per IP
- **API endpoints**: 100 requests per 15 minutes per user
- **Public endpoints**: 50 requests per minute per IP

### CORS Policy
- **Allowed Origins**: Configured via `CORS_ORIGIN` environment variable
- **Allowed Methods**: GET, POST, PUT, DELETE, PATCH, OPTIONS
- **Allowed Headers**: Authorization, Content-Type, X-Requested-With

### Security Headers
All responses include security headers via Helmet.js:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`

## 📊 Response Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **409**: Conflict
- **422**: Validation Error
- **429**: Rate Limited
- **500**: Internal Server Error

## 🔧 API Testing

### Using cURL
```bash
# Register organization
curl -X POST http://localhost:8080/api/auth/register-organization \
  -H "Content-Type: application/json" \
  -d '{"organizationName":"Test Corp","domain":"test.com","adminEmail":"admin@test.com","adminPassword":"Test123!","adminFirstName":"Admin","adminLastName":"User","subscriptionType":"enterprise"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"Test123!"}'

# Get organization (with token)
curl -X GET http://localhost:8080/api/organizations/current \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Swagger UI
Interactive API documentation available at: http://localhost:8080/api-docs

## 📝 Changelog

### v1.0.0 (Current)
- ✅ Complete enterprise authentication system
- ✅ Multi-tenant organization management
- ✅ Squad and team coordination
- ✅ Project and release management
- ✅ OpenAPI specification parsing
- ✅ Requirement traceability matrix
- ✅ Test automation integration
- ✅ Comprehensive audit logging
- ✅ Real-time dashboard analytics
- ✅ Production-ready security
