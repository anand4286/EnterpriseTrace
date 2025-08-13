import { test, expect } from '@playwright/test';

test.describe('Dashboard API', () => {
  test('should get dashboard overview data', async ({ request }) => {
    const response = await request.get('/api/dashboard/overview');
    
    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody.success).toBe(true);
    expect(responseBody.data).toHaveProperty('project');
    expect(responseBody.data).toHaveProperty('components');
    expect(responseBody.data).toHaveProperty('metrics');
    expect(responseBody.data).toHaveProperty('recentActivity');
  });

  test('should get test metrics with project ID', async ({ request }) => {
    const response = await request.get('/api/dashboard/metrics?projectId=test-project');
    
    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody.success).toBe(true);
    expect(responseBody.data).toHaveProperty('totalEndpoints');
    expect(responseBody.data).toHaveProperty('testedEndpoints');
    expect(responseBody.data).toHaveProperty('coveragePercentage');
  });

  test('should require project ID for metrics', async ({ request }) => {
    const response = await request.get('/api/dashboard/metrics');
    
    expect(response.status()).toBe(400);
    
    const responseBody = await response.json();
    expect(responseBody.success).toBe(false);
    expect(responseBody.error).toContain('Project ID is required');
  });
});

test.describe('Traceability API', () => {
  test('should generate traceability matrix', async ({ request }) => {
    const openApiSpec = {
      openapi: '3.0.3',
      info: {
        title: 'Test API',
        version: '1.0.0'
      },
      paths: {
        '/users': {
          get: {
            summary: 'Get users',
            tags: ['Users'],
            responses: { '200': { description: 'Success' } }
          }
        }
      }
    };

    const response = await request.post('/api/traceability/matrix', {
      data: {
        projectId: 'test-project',
        openApiSpec,
        includeTests: true
      }
    });

    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody.success).toBe(true);
    expect(responseBody.data).toHaveProperty('id');
    expect(responseBody.data).toHaveProperty('projectName');
    expect(responseBody.data).toHaveProperty('components');
  });

  test('should get requirements traceability', async ({ request }) => {
    const response = await request.get('/api/traceability/requirements?projectId=test-project');
    
    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody.success).toBe(true);
    expect(Array.isArray(responseBody.data)).toBe(true);
  });

  test('should get coverage analysis', async ({ request }) => {
    const response = await request.get('/api/traceability/coverage?projectId=test-project');
    
    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody.success).toBe(true);
    expect(responseBody.data).toHaveProperty('overall');
    expect(responseBody.data).toHaveProperty('byComponent');
    expect(responseBody.data).toHaveProperty('gaps');
  });
});

test.describe('Test Service API', () => {
  test('should run tests for project', async ({ request }) => {
    const response = await request.post('/api/test/run', {
      data: {
        projectId: 'test-project',
        testType: 'api'
      }
    });

    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody.success).toBe(true);
    expect(responseBody.data).toHaveProperty('testRunId');
    expect(responseBody.data).toHaveProperty('status');
  });

  test('should get test results', async ({ request }) => {
    const response = await request.get('/api/test/results?projectId=test-project');
    
    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody.success).toBe(true);
    expect(Array.isArray(responseBody.data)).toBe(true);
  });

  test('should generate test cases from OpenAPI spec', async ({ request }) => {
    const openApiSpec = {
      openapi: '3.0.3',
      info: {
        title: 'Test API',
        version: '1.0.0'
      },
      paths: {
        '/users': {
          get: {
            summary: 'Get users',
            responses: { '200': { description: 'Success' } }
          }
        }
      }
    };

    const response = await request.post('/api/test/generate', {
      data: {
        projectId: 'test-project',
        openApiSpec,
        testFramework: 'playwright'
      }
    });

    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody.success).toBe(true);
    expect(Array.isArray(responseBody.data)).toBe(true);
  });
});
