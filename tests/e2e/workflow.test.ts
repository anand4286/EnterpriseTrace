import { test, expect } from '@playwright/test';

test.describe('End-to-End Workflow', () => {
  test('should complete full traceability workflow', async ({ page, request }) => {
    // Step 1: Upload OpenAPI specification
    const openApiSpec = {
      openapi: '3.0.3',
      info: {
        title: 'E2E Test API',
        version: '1.0.0',
        description: 'API for end-to-end testing'
      },
      paths: {
        '/users': {
          get: {
            summary: 'Get all users',
            tags: ['Users'],
            responses: {
              '200': {
                description: 'List of users',
                content: {
                  'application/json': {
                    schema: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          id: { type: 'integer' },
                          name: { type: 'string' },
                          email: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          post: {
            summary: 'Create a new user',
            tags: ['Users'],
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    required: ['name', 'email'],
                    properties: {
                      name: { type: 'string' },
                      email: { type: 'string', format: 'email' }
                    }
                  }
                }
              }
            },
            responses: {
              '201': {
                description: 'User created successfully'
              }
            }
          }
        },
        '/products': {
          get: {
            summary: 'Get all products',
            tags: ['Products'],
            responses: {
              '200': {
                description: 'List of products'
              }
            }
          }
        }
      }
    };

    // Step 2: Parse the OpenAPI spec via API
    const parseResponse = await request.post('/api/openapi/parse', {
      data: { spec: openApiSpec }
    });
    expect(parseResponse.status()).toBe(200);

    // Step 3: Generate traceability matrix
    const matrixResponse = await request.post('/api/traceability/matrix', {
      data: {
        projectId: 'e2e-test-project',
        openApiSpec,
        includeTests: true
      }
    });
    expect(matrixResponse.status()).toBe(200);
    
    const matrixData = await matrixResponse.json();
    expect(matrixData.success).toBe(true);
    expect(matrixData.data.components).toHaveLength(2); // Users and Products

    // Step 4: Generate test cases
    const testGenResponse = await request.post('/api/test/generate', {
      data: {
        projectId: 'e2e-test-project',
        openApiSpec,
        testFramework: 'playwright'
      }
    });
    expect(testGenResponse.status()).toBe(200);
    
    const testCases = await testGenResponse.json();
    expect(testCases.success).toBe(true);
    expect(testCases.data.length).toBeGreaterThan(0);

    // Step 5: Navigate to dashboard and verify data
    await page.goto('http://localhost:3000/dashboard');
    
    // Wait for dashboard to load
    await expect(page.locator('h4')).toContainText('Dashboard');
    
    // Verify project information is displayed
    await expect(page.locator('text=Components')).toBeVisible();
    await expect(page.locator('text=API Endpoints')).toBeVisible();
    
    // Step 6: Navigate to traceability matrix view
    await page.click('text=Traceability Matrix');
    await expect(page).toHaveURL(/.*traceability/);
    await expect(page.locator('h4')).toContainText('Traceability Matrix');

    // Step 7: Check test results
    await page.click('text=Test Results');
    await expect(page).toHaveURL(/.*test-results/);
    await expect(page.locator('h4')).toContainText('Test Results');

    // Step 8: View API documentation
    await page.click('text=API Documentation');
    await expect(page).toHaveURL(/.*api-docs/);
    await expect(page.locator('h4')).toContainText('API Documentation');
  });

  test('should handle complex banking API workflow', async ({ page, request }) => {
    // Load the complex banking API spec from file
    const bankingApiPath = './samples/complex-banking-api.yaml';
    
    // Parse the banking API spec
    const parseResponse = await request.post('/api/openapi/parse', {
      data: { filePath: bankingApiPath }
    });
    
    if (parseResponse.status() === 200) {
      const parsedData = await parseResponse.json();
      
      // Generate traceability matrix for banking API
      const matrixResponse = await request.post('/api/traceability/matrix', {
        data: {
          projectId: 'banking-api-project',
          openApiSpec: parsedData.data,
          includeTests: true
        }
      });
      
      expect(matrixResponse.status()).toBe(200);
      
      const matrixData = await matrixResponse.json();
      expect(matrixData.success).toBe(true);
      
      // Should have multiple components for banking API
      expect(matrixData.data.components.length).toBeGreaterThan(3);
      
      // Navigate to dashboard and verify complex API data
      await page.goto('http://localhost:3000/dashboard');
      await expect(page.locator('h4')).toContainText('Dashboard');
      
      // Should display metrics for complex API
      await expect(page.locator('text=Test Coverage Metrics')).toBeVisible();
    }
  });

  test('should demonstrate requirement traceability end-to-end', async ({ page, request }) => {
    const projectId = 'traceability-demo';
    
    // Step 1: Create requirements (mock data)
    const requirements = [
      {
        id: 'REQ-001',
        name: 'User Authentication',
        description: 'Users must be able to authenticate securely',
        type: 'functional',
        priority: 'high'
      },
      {
        id: 'REQ-002',
        name: 'Data Validation',
        description: 'All input data must be validated',
        type: 'functional',
        priority: 'medium'
      }
    ];

    // Step 2: Get requirements traceability
    const traceabilityResponse = await request.get(`/api/traceability/requirements?projectId=${projectId}`);
    expect(traceabilityResponse.status()).toBe(200);
    
    const traceabilityData = await traceabilityResponse.json();
    expect(traceabilityData.success).toBe(true);

    // Step 3: Get coverage analysis
    const coverageResponse = await request.get(`/api/traceability/coverage?projectId=${projectId}`);
    expect(coverageResponse.status()).toBe(200);
    
    const coverageData = await coverageResponse.json();
    expect(coverageData.success).toBe(true);
    expect(coverageData.data).toHaveProperty('overall');
    expect(coverageData.data).toHaveProperty('byComponent');
    expect(coverageData.data).toHaveProperty('gaps');

    // Step 4: Navigate through UI to view traceability
    await page.goto('http://localhost:3000/dashboard');
    
    // View overall dashboard metrics
    await expect(page.locator('text=Test Coverage Metrics')).toBeVisible();
    
    // Navigate to detailed traceability view
    await page.click('text=Traceability Matrix');
    await expect(page).toHaveURL(/.*traceability/);
    
    // Verify traceability matrix is accessible
    await expect(page.locator('h4')).toContainText('Traceability Matrix');
  });

  test('should execute test run workflow', async ({ page, request }) => {
    const projectId = 'test-execution-demo';
    
    // Step 1: Trigger test run
    const testRunResponse = await request.post('/api/test/run', {
      data: {
        projectId,
        testType: 'api',
        endpoints: ['/users', '/products']
      }
    });
    
    expect(testRunResponse.status()).toBe(200);
    
    const testRunData = await testRunResponse.json();
    expect(testRunData.success).toBe(true);
    expect(testRunData.data).toHaveProperty('testRunId');

    // Step 2: Get test results
    const resultsResponse = await request.get(`/api/test/results?projectId=${projectId}`);
    expect(resultsResponse.status()).toBe(200);
    
    const resultsData = await resultsResponse.json();
    expect(resultsData.success).toBe(true);
    expect(Array.isArray(resultsData.data)).toBe(true);

    // Step 3: Navigate to test results in UI
    await page.goto('http://localhost:3000/test-results');
    
    // Verify test results page loads
    await expect(page.locator('h4')).toContainText('Test Results');
    
    // Navigate back to dashboard to see updated metrics
    await page.click('text=Dashboard');
    await expect(page.locator('text=Test Coverage Metrics')).toBeVisible();
  });
});

test.describe('Performance and Reliability', () => {
  test('should handle large OpenAPI specifications', async ({ request }) => {
    // Create a large OpenAPI spec with many endpoints
    const largeSpec = {
      openapi: '3.0.3',
      info: {
        title: 'Large API',
        version: '1.0.0'
      },
      paths: {}
    };

    // Add 50 endpoints
    for (let i = 1; i <= 50; i++) {
      largeSpec.paths[`/endpoint${i}`] = {
        get: {
          summary: `Get endpoint ${i}`,
          operationId: `getEndpoint${i}`,
          tags: [`Group${Math.ceil(i / 10)}`],
          responses: {
            '200': { description: 'Success' }
          }
        }
      };
    }

    const parseResponse = await request.post('/api/openapi/parse', {
      data: { spec: largeSpec }
    });

    expect(parseResponse.status()).toBe(200);
    
    const matrixResponse = await request.post('/api/traceability/matrix', {
      data: {
        projectId: 'large-api-project',
        openApiSpec: largeSpec,
        includeTests: true
      }
    });

    expect(matrixResponse.status()).toBe(200);
    
    const matrixData = await matrixResponse.json();
    expect(matrixData.success).toBe(true);
    expect(matrixData.data.components.length).toBeGreaterThan(0);
  });

  test('should maintain performance under load', async ({ request }) => {
    const startTime = Date.now();
    
    // Make multiple concurrent requests
    const promises = Array.from({ length: 10 }, () =>
      request.get('/api/dashboard/overview')
    );
    
    const responses = await Promise.all(promises);
    const endTime = Date.now();
    
    // All requests should succeed
    responses.forEach(response => {
      expect(response.status()).toBe(200);
    });
    
    // Should complete within reasonable time (less than 5 seconds)
    expect(endTime - startTime).toBeLessThan(5000);
  });
});
