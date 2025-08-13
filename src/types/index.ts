export interface OpenApiSpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  paths: Record<string, PathItem>;
  components?: {
    schemas?: Record<string, SchemaObject>;
  };
}

export interface PathItem {
  get?: Operation;
  post?: Operation;
  put?: Operation;
  delete?: Operation;
  patch?: Operation;
  options?: Operation;
  head?: Operation;
  trace?: Operation;
}

export interface Operation {
  operationId?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses: Record<string, ResponseObject>;
}

export interface Parameter {
  name: string;
  in: 'query' | 'header' | 'path' | 'cookie';
  required?: boolean;
  schema: SchemaObject;
  description?: string;
}

export interface RequestBody {
  required?: boolean;
  content: Record<string, MediaType>;
}

export interface ResponseObject {
  description: string;
  content?: Record<string, MediaType>;
}

export interface MediaType {
  schema: SchemaObject;
}

export interface SchemaObject {
  type?: string;
  properties?: Record<string, SchemaObject>;
  items?: SchemaObject;
  required?: string[];
  description?: string;
}

// Traceability Matrix Types
export interface TraceabilityMatrix {
  id: string;
  projectName: string;
  version: string;
  createdAt: Date;
  components: Component[];
  testMetrics: TestMetrics;
}

export interface Component {
  id: string;
  name: string;
  description?: string;
  apis: ApiEndpoint[];
  testCases: TestCase[];
}

export interface ApiEndpoint {
  id: string;
  path: string;
  method: string;
  operationId?: string;
  summary?: string;
  description?: string;
  tags?: string[];
  testCoverage: TestCoverage;
}

export interface TestCase {
  id: string;
  name: string;
  description?: string;
  type: 'unit' | 'integration' | 'e2e' | 'api';
  status: 'pending' | 'passed' | 'failed' | 'skipped';
  scenarios: TestScenario[];
  linkedEndpoints: string[];
}

export interface TestScenario {
  id: string;
  name: string;
  description?: string;
  steps: TestStep[];
  expectedResult: string;
  status: 'pending' | 'passed' | 'failed' | 'skipped';
}

export interface TestStep {
  id: string;
  action: string;
  data?: any;
  expectedResponse?: any;
}

export interface TestCoverage {
  covered: boolean;
  testCases: string[];
  lastTested?: Date;
  coverage: number; // percentage
}

export interface TestMetrics {
  totalEndpoints: number;
  testedEndpoints: number;
  coveragePercentage: number;
  totalTestCases: number;
  passedTests: number;
  failedTests: number;
  pendingTests: number;
  lastUpdated: Date;
}

// Dashboard Types
export interface DashboardData {
  project: ProjectInfo;
  components: ComponentSummary[];
  metrics: TestMetrics;
  recentActivity: ActivityItem[];
}

export interface ProjectInfo {
  name: string;
  version: string;
  description?: string;
  totalComponents: number;
  totalEndpoints: number;
  totalTestCases: number;
}

export interface ComponentSummary {
  id: string;
  name: string;
  endpointCount: number;
  testCaseCount: number;
  coveragePercentage: number;
  lastTested?: Date;
  status: 'healthy' | 'warning' | 'error';
}

export interface ActivityItem {
  id: string;
  type: 'test_run' | 'spec_update' | 'coverage_change';
  message: string;
  timestamp: Date;
  component?: string;
}

// Playwright Integration Types
export interface PlaywrightConfig {
  testDir: string;
  timeout: number;
  retries: number;
  workers: number;
  projects: PlaywrightProject[];
}

export interface PlaywrightProject {
  name: string;
  use: {
    baseURL?: string;
    headless?: boolean;
    viewport?: { width: number; height: number };
  };
}

export interface TestResult {
  testId: string;
  name: string;
  status: 'passed' | 'failed' | 'skipped' | 'timedout';
  duration: number;
  errors?: string[];
  attachments?: TestAttachment[];
}

export interface TestAttachment {
  name: string;
  contentType: string;
  path: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Database Models
export interface Project {
  id: string;
  name: string;
  description?: string;
  openApiSpecPath: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Requirement {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  type: 'functional' | 'non-functional' | 'technical';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'approved' | 'implemented' | 'tested';
  linkedEndpoints: string[];
  linkedTestCases: string[];
  createdAt: Date;
  updatedAt: Date;
}
