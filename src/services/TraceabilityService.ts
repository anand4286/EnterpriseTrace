import { TraceabilityMatrix, Component, ApiEndpoint, TestCase, OpenApiSpec, Requirement } from '../types';
import { OpenApiParser } from './OpenApiParser';

export class TraceabilityService {
  private openApiParser: OpenApiParser;

  constructor() {
    this.openApiParser = new OpenApiParser();
  }

  /**
   * Generate comprehensive traceability matrix from OpenAPI specification
   */
  async generateMatrix(
    projectId: string, 
    openApiSpec: OpenApiSpec, 
    includeTests: boolean = true
  ): Promise<TraceabilityMatrix> {
    // Extract endpoints from OpenAPI spec
    const endpoints = await this.openApiParser.extractEndpoints(openApiSpec);
    
    // Group endpoints by tags/components
    const components = this.groupEndpointsByComponents(endpoints);
    
    // Generate test cases if requested
    if (includeTests) {
      for (const component of components) {
        component.testCases = await this.generateTestCasesForComponent(component);
      }
    }

    const matrix: TraceabilityMatrix = {
      id: `matrix-${projectId}-${Date.now()}`,
      projectName: openApiSpec.info.title,
      version: openApiSpec.info.version,
      createdAt: new Date(),
      components,
      testMetrics: this.calculateTestMetrics(components)
    };

    return matrix;
  }

  /**
   * Get requirements traceability mapping
   */
  async getRequirementsTraceability(projectId: string, requirementId?: string): Promise<any> {
    // Mock implementation - would query database for real requirements
    const requirements = await this.getMockRequirements(projectId);
    
    if (requirementId) {
      return requirements.find(req => req.id === requirementId);
    }
    
    return requirements.map(req => ({
      ...req,
      traceability: {
        linkedEndpoints: req.linkedEndpoints.length,
        linkedTestCases: req.linkedTestCases.length,
        coveragePercentage: this.calculateRequirementCoverage(req)
      }
    }));
  }

  /**
   * Get test coverage analysis
   */
  async getCoverageAnalysis(projectId: string): Promise<any> {
    // Mock implementation
    return {
      overall: {
        totalEndpoints: 32,
        coveredEndpoints: 28,
        coveragePercentage: 87.5
      },
      byComponent: [
        {
          componentId: 'user-management',
          name: 'User Management',
          totalEndpoints: 8,
          coveredEndpoints: 7,
          coveragePercentage: 87.5,
          uncoveredEndpoints: [
            { path: '/users/{id}/avatar', method: 'DELETE' }
          ]
        },
        {
          componentId: 'product-catalog',
          name: 'Product Catalog',
          totalEndpoints: 12,
          coveredEndpoints: 9,
          coveragePercentage: 75.0,
          uncoveredEndpoints: [
            { path: '/products/{id}/reviews', method: 'DELETE' },
            { path: '/categories/{id}/products', method: 'PATCH' },
            { path: '/products/bulk-update', method: 'PUT' }
          ]
        }
      ],
      gaps: [
        {
          type: 'untested_endpoint',
          endpoint: '/users/{id}/avatar',
          method: 'DELETE',
          component: 'user-management',
          severity: 'medium'
        },
        {
          type: 'missing_negative_tests',
          endpoint: '/orders',
          method: 'POST',
          component: 'order-processing',
          severity: 'high'
        }
      ]
    };
  }

  /**
   * Group endpoints by components based on tags or path patterns
   */
  private groupEndpointsByComponents(endpoints: ApiEndpoint[]): Component[] {
    const componentMap = new Map<string, ApiEndpoint[]>();

    endpoints.forEach(endpoint => {
      let componentName = 'General';
      
      // Use tags if available
      if (endpoint.tags && endpoint.tags.length > 0) {
        componentName = endpoint.tags[0];
      } else {
        // Extract component name from path
        const pathSegments = endpoint.path.split('/');
        if (pathSegments.length > 1) {
          componentName = pathSegments[1] || 'General';
        }
      }

      if (!componentMap.has(componentName)) {
        componentMap.set(componentName, []);
      }
      componentMap.get(componentName)!.push(endpoint);
    });

    return Array.from(componentMap.entries()).map(([name, apis]) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name: name.charAt(0).toUpperCase() + name.slice(1),
      description: `Component for ${name} related operations`,
      apis,
      testCases: []
    }));
  }

  /**
   * Generate test cases for a component
   */
  private async generateTestCasesForComponent(component: Component): Promise<TestCase[]> {
    const testCases: TestCase[] = [];

    component.apis.forEach((endpoint, index) => {
      // Generate basic positive test case
      testCases.push({
        id: `test-${component.id}-${index}-positive`,
        name: `Test ${endpoint.method} ${endpoint.path} - Success`,
        description: `Verify successful ${endpoint.method} request to ${endpoint.path}`,
        type: 'api',
        status: 'pending',
        scenarios: [
          {
            id: `scenario-${component.id}-${index}-1`,
            name: 'Happy path scenario',
            description: 'Test with valid data and expected successful response',
            steps: [
              {
                id: `step-1`,
                action: `Send ${endpoint.method} request to ${endpoint.path}`,
                data: 'Valid request payload',
                expectedResponse: 'Success response (2xx)'
              }
            ],
            expectedResult: 'Request should succeed with appropriate response',
            status: 'pending'
          }
        ],
        linkedEndpoints: [endpoint.id]
      });

      // Generate negative test case
      testCases.push({
        id: `test-${component.id}-${index}-negative`,
        name: `Test ${endpoint.method} ${endpoint.path} - Error Handling`,
        description: `Verify error handling for ${endpoint.method} request to ${endpoint.path}`,
        type: 'api',
        status: 'pending',
        scenarios: [
          {
            id: `scenario-${component.id}-${index}-2`,
            name: 'Invalid data scenario',
            description: 'Test with invalid data and expected error response',
            steps: [
              {
                id: `step-1`,
                action: `Send ${endpoint.method} request to ${endpoint.path}`,
                data: 'Invalid request payload',
                expectedResponse: 'Error response (4xx/5xx)'
              }
            ],
            expectedResult: 'Request should fail with appropriate error message',
            status: 'pending'
          }
        ],
        linkedEndpoints: [endpoint.id]
      });

      // Update endpoint test coverage
      endpoint.testCoverage = {
        covered: true,
        testCases: [
          `test-${component.id}-${index}-positive`,
          `test-${component.id}-${index}-negative`
        ],
        coverage: 100
      };
    });

    return testCases;
  }

  /**
   * Calculate test metrics for components
   */
  private calculateTestMetrics(components: Component[]): any {
    const totalEndpoints = components.reduce((sum, comp) => sum + comp.apis.length, 0);
    const testedEndpoints = components.reduce((sum, comp) => 
      sum + comp.apis.filter(api => api.testCoverage.covered).length, 0
    );
    const totalTestCases = components.reduce((sum, comp) => sum + comp.testCases.length, 0);

    return {
      totalEndpoints,
      testedEndpoints,
      coveragePercentage: totalEndpoints > 0 ? (testedEndpoints / totalEndpoints) * 100 : 0,
      totalTestCases,
      passedTests: 0,
      failedTests: 0,
      pendingTests: totalTestCases,
      lastUpdated: new Date()
    };
  }

  /**
   * Get mock requirements for demonstration
   */
  private async getMockRequirements(projectId: string): Promise<Requirement[]> {
    return [
      {
        id: 'req-001',
        projectId,
        name: 'User Authentication',
        description: 'System must provide secure user authentication and authorization',
        type: 'functional',
        priority: 'high',
        status: 'implemented',
        linkedEndpoints: ['POST_/auth/login', 'POST_/auth/logout', 'POST_/auth/refresh'],
        linkedTestCases: ['test-auth-001', 'test-auth-002'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-15')
      },
      {
        id: 'req-002',
        projectId,
        name: 'Product Management',
        description: 'System must allow CRUD operations for product catalog',
        type: 'functional',
        priority: 'high',
        status: 'implemented',
        linkedEndpoints: ['GET_/products', 'POST_/products', 'PUT_/products/{id}', 'DELETE_/products/{id}'],
        linkedTestCases: ['test-product-001', 'test-product-002', 'test-product-003'],
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-10')
      }
    ];
  }

  /**
   * Calculate requirement coverage percentage
   */
  private calculateRequirementCoverage(requirement: Requirement): number {
    const totalLinks = requirement.linkedEndpoints.length + requirement.linkedTestCases.length;
    const implementedLinks = requirement.status === 'implemented' ? requirement.linkedEndpoints.length : 0;
    const testedLinks = requirement.linkedTestCases.length;
    
    if (totalLinks === 0) return 0;
    return ((implementedLinks + testedLinks) / (totalLinks * 2)) * 100;
  }
}
