import { test, expect } from '@playwright/test';

test.describe('OpenAPI Endpoints', () => {
  test('should parse simple OpenAPI specification', async ({ request }) => {
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
            operationId: 'getUsers',
            responses: {
              '200': {
                description: 'Success'
              }
            }
          }
        }
      }
    };

    const response = await request.post('/api/openapi/parse', {
      data: { spec: openApiSpec }
    });

    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody.success).toBe(true);
    expect(responseBody.data.info.title).toBe('Test API');
  });

  test('should validate OpenAPI specification', async ({ request }) => {
    const validSpec = {
      openapi: '3.0.3',
      info: {
        title: 'Valid API',
        version: '1.0.0'
      },
      paths: {}
    };

    const response = await request.post('/api/openapi/validate', {
      data: { spec: validSpec }
    });

    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody.success).toBe(true);
    expect(responseBody.data.valid).toBe(true);
  });

  test('should extract endpoints from OpenAPI spec', async ({ request }) => {
    const specWithEndpoints = {
      openapi: '3.0.3',
      info: {
        title: 'API with Endpoints',
        version: '1.0.0'
      },
      paths: {
        '/users': {
          get: {
            summary: 'Get users',
            operationId: 'getUsers',
            responses: { '200': { description: 'Success' } }
          },
          post: {
            summary: 'Create user',
            operationId: 'createUser',
            responses: { '201': { description: 'Created' } }
          }
        }
      }
    };

    const response = await request.post('/api/openapi/endpoints', {
      data: { spec: specWithEndpoints }
    });

    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody.success).toBe(true);
    expect(responseBody.data).toHaveLength(2);
    expect(responseBody.data[0].method).toBe('GET');
    expect(responseBody.data[1].method).toBe('POST');
  });

  test('should handle invalid OpenAPI specification', async ({ request }) => {
    const invalidSpec = {
      // Missing required fields
      info: {
        title: 'Invalid API'
        // Missing version
      }
    };

    const response = await request.post('/api/openapi/validate', {
      data: { spec: invalidSpec }
    });

    expect(response.status()).toBe(200);
    
    const responseBody = await response.json();
    expect(responseBody.success).toBe(false);
    expect(responseBody.data.valid).toBe(false);
    expect(responseBody.data.errors.length).toBeGreaterThan(0);
  });
});
