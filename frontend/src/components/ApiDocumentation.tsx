import React, { useState, useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { 
  Typography, 
  Box, 
  Alert,
  CircularProgress,
  Button
} from '@mui/material';

const ApiDocumentation: React.FC = () => {
  const [swaggerSpec, setSwaggerSpec] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSwaggerSpec();
  }, []);

  const fetchSwaggerSpec = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // First, try to get the swagger spec from our backend
      const response = await fetch('http://localhost:8080/api-docs/swagger.json');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch swagger spec: ${response.status}`);
      }
      
      const spec = await response.json();
      setSwaggerSpec(spec);
    } catch (err) {
      console.error('Error fetching swagger spec:', err);
      setError('Failed to load Swagger specification from backend. Using fallback spec.');
      
      // Fallback to a basic spec that matches our actual endpoints
      setSwaggerSpec({
        openapi: '3.0.3',
        info: {
          title: 'Requirement Traceability Matrix API',
          description: 'Complete API for managing OpenAPI specifications, traceability matrices, and test execution',
          version: '1.0.0',
          contact: {
            name: 'TSR Team',
            email: 'support@tsr.com'
          }
        },
        servers: [
          {
            url: 'http://localhost:8080',
            description: 'Development server'
          }
        ],
        paths: {
          '/health': {
            get: {
              tags: ['System'],
              summary: 'Health Check',
              description: 'Check if the API is running and responsive',
              responses: {
                '200': {
                  description: 'API is healthy',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          status: { type: 'string', example: 'OK' },
                          timestamp: { type: 'string', format: 'date-time' },
                          uptime: { type: 'number' }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '/api/openapi/parse': {
            post: {
              tags: ['OpenAPI Management'],
              summary: 'Parse OpenAPI Specification',
              description: 'Parse and validate an OpenAPI YAML/JSON file',
              requestBody: {
                required: true,
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      required: ['filePath'],
                      properties: {
                        filePath: {
                          type: 'string',
                          description: 'Path to OpenAPI specification file',
                          example: '/Users/Anand/github/TSR/samples/simple-ecommerce-api.yaml'
                        }
                      }
                    }
                  }
                }
              },
              responses: {
                '200': {
                  description: 'Successfully parsed OpenAPI specification',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          success: { type: 'boolean' },
                          data: { type: 'object' },
                          message: { type: 'string' }
                        }
                      }
                    }
                  }
                },
                '400': {
                  description: 'Invalid file path or corrupted specification'
                }
              }
            }
          },
          '/api/traceability/matrix': {
            get: {
              tags: ['Traceability'],
              summary: 'Get Traceability Matrix',
              description: 'Generate and retrieve requirement traceability matrix',
              parameters: [
                {
                  name: 'projectId',
                  in: 'query',
                  description: 'Project identifier',
                  required: false,
                  schema: {
                    type: 'string',
                    example: 'ecommerce-demo'
                  }
                }
              ],
              responses: {
                '200': {
                  description: 'Traceability matrix data',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          success: { type: 'boolean' },
                          data: {
                            type: 'object',
                            properties: {
                              summary: { type: 'object' },
                              matrix: { type: 'array' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '/api/test/execute': {
            post: {
              tags: ['Test Management'],
              summary: 'Execute Test Suite',
              description: 'Run API and UI test suites',
              requestBody: {
                required: true,
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      required: ['suite'],
                      properties: {
                        suite: {
                          type: 'string',
                          enum: ['api', 'ui', 'integration', 'all'],
                          description: 'Test suite to execute',
                          example: 'all'
                        }
                      }
                    }
                  }
                }
              },
              responses: {
                '200': {
                  description: 'Tests executed successfully'
                }
              }
            }
          },
          '/api/test/results': {
            get: {
              tags: ['Test Management'],
              summary: 'Get Test Results',
              description: 'Retrieve test execution results and analytics',
              responses: {
                '200': {
                  description: 'Test results and metrics',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          success: { type: 'boolean' },
                          data: {
                            type: 'object',
                            properties: {
                              summary: { type: 'object' },
                              suites: { type: 'array' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          '/api/dashboard/overview': {
            get: {
              tags: ['Dashboard'],
              summary: 'Get Dashboard Overview',
              description: 'Retrieve project metrics and dashboard data',
              responses: {
                '200': {
                  description: 'Dashboard overview data',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object',
                        properties: {
                          success: { type: 'boolean' },
                          data: {
                            type: 'object',
                            properties: {
                              project: { type: 'object' },
                              metrics: { type: 'object' }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        components: {
          schemas: {
            ApiResponse: {
              type: 'object',
              properties: {
                success: { type: 'boolean' },
                data: { type: 'object' },
                message: { type: 'string' },
                error: { type: 'string' }
              }
            }
          }
        }
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Loading Swagger UI...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        API Documentation
      </Typography>
      
      {error && (
        <Alert severity="info" sx={{ mb: 2 }} action={
          <Button size="small" onClick={fetchSwaggerSpec}>
            Retry
          </Button>
        }>
          {error}
        </Alert>
      )}

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Interactive API documentation powered by Swagger UI. Test all endpoints directly from this interface.
      </Typography>

      {swaggerSpec && (
        <Box sx={{ 
          '& .swagger-ui': {
            fontFamily: 'inherit',
          },
          '& .swagger-ui .topbar': {
            display: 'none' // Hide the top bar since we're embedding it
          },
          '& .swagger-ui .info': {
            margin: '20px 0'
          }
        }}>
          <SwaggerUI 
            spec={swaggerSpec}
            docExpansion="list"
            deepLinking={true}
            displayOperationId={false}
            defaultModelsExpandDepth={1}
            defaultModelExpandDepth={1}
            defaultModelRendering="example"
            displayRequestDuration={true}
            tryItOutEnabled={true}
            filter={false}
            layout="BaseLayout"
            validatorUrl={null}
          />
        </Box>
      )}
    </Box>
  );
};

export default ApiDocumentation;
