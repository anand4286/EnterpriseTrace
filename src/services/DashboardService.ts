import { DashboardData, ProjectInfo, ComponentSummary, TestMetrics, ActivityItem } from '../types';

export class DashboardService {
  /**
   * Get comprehensive dashboard data
   */
  async getDashboardData(projectId?: string): Promise<DashboardData> {
    // Mock data for now - in real implementation, this would query the database
    const projectInfo: ProjectInfo = {
      name: 'Sample E-commerce API',
      version: '2.1.0',
      description: 'RESTful API for e-commerce platform with user management, product catalog, and order processing',
      totalComponents: 5,
      totalEndpoints: 32,
      totalTestCases: 156
    };

    const components: ComponentSummary[] = [
      {
        id: 'user-management',
        name: 'User Management',
        endpointCount: 8,
        testCaseCount: 32,
        coveragePercentage: 87.5,
        lastTested: new Date('2024-01-15T10:30:00Z'),
        status: 'healthy'
      },
      {
        id: 'product-catalog',
        name: 'Product Catalog',
        endpointCount: 12,
        testCaseCount: 48,
        coveragePercentage: 75.0,
        lastTested: new Date('2024-01-14T16:45:00Z'),
        status: 'warning'
      },
      {
        id: 'order-processing',
        name: 'Order Processing',
        endpointCount: 7,
        testCaseCount: 35,
        coveragePercentage: 91.4,
        lastTested: new Date('2024-01-15T14:20:00Z'),
        status: 'healthy'
      },
      {
        id: 'payment-gateway',
        name: 'Payment Gateway',
        endpointCount: 3,
        testCaseCount: 24,
        coveragePercentage: 95.8,
        lastTested: new Date('2024-01-15T12:15:00Z'),
        status: 'healthy'
      },
      {
        id: 'notifications',
        name: 'Notifications',
        endpointCount: 2,
        testCaseCount: 17,
        coveragePercentage: 58.8,
        lastTested: new Date('2024-01-13T09:30:00Z'),
        status: 'error'
      }
    ];

    const metrics: TestMetrics = {
      totalEndpoints: 32,
      testedEndpoints: 28,
      coveragePercentage: 87.5,
      totalTestCases: 156,
      passedTests: 142,
      failedTests: 8,
      pendingTests: 6,
      lastUpdated: new Date('2024-01-15T16:30:00Z')
    };

    const recentActivity: ActivityItem[] = [
      {
        id: 'activity-1',
        type: 'test_run',
        message: 'Test suite completed for Order Processing component',
        timestamp: new Date('2024-01-15T14:20:00Z'),
        component: 'order-processing'
      },
      {
        id: 'activity-2',
        type: 'coverage_change',
        message: 'Coverage increased to 95.8% for Payment Gateway',
        timestamp: new Date('2024-01-15T12:15:00Z'),
        component: 'payment-gateway'
      },
      {
        id: 'activity-3',
        type: 'spec_update',
        message: 'OpenAPI specification updated with new endpoints',
        timestamp: new Date('2024-01-15T10:30:00Z')
      },
      {
        id: 'activity-4',
        type: 'test_run',
        message: 'Failed test cases detected in Notifications component',
        timestamp: new Date('2024-01-13T09:30:00Z'),
        component: 'notifications'
      }
    ];

    return {
      project: projectInfo,
      components,
      metrics,
      recentActivity
    };
  }

  /**
   * Get detailed test metrics for a project
   */
  async getTestMetrics(projectId: string): Promise<TestMetrics> {
    // Mock implementation - would query database in real scenario
    return {
      totalEndpoints: 32,
      testedEndpoints: 28,
      coveragePercentage: 87.5,
      totalTestCases: 156,
      passedTests: 142,
      failedTests: 8,
      pendingTests: 6,
      lastUpdated: new Date('2024-01-15T16:30:00Z')
    };
  }

  /**
   * Get component summary data
   */
  async getComponentSummaries(projectId: string): Promise<ComponentSummary[]> {
    // Mock implementation
    return [
      {
        id: 'user-management',
        name: 'User Management',
        endpointCount: 8,
        testCaseCount: 32,
        coveragePercentage: 87.5,
        lastTested: new Date('2024-01-15T10:30:00Z'),
        status: 'healthy'
      }
    ];
  }

  /**
   * Get recent activity for a project
   */
  async getRecentActivity(projectId: string, limit: number = 10): Promise<ActivityItem[]> {
    // Mock implementation
    return [
      {
        id: 'activity-1',
        type: 'test_run',
        message: 'Test suite completed for Order Processing component',
        timestamp: new Date('2024-01-15T14:20:00Z'),
        component: 'order-processing'
      }
    ];
  }
}
