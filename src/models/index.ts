// Enterprise Data Models for Scale

export interface Organization {
  id: string;
  name: string;
  domain: string;
  settings: OrganizationSettings;
  subscription: SubscriptionPlan;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionPlan {
  type: 'starter' | 'professional' | 'enterprise' | 'custom';
  maxUsers: number;
  maxProjects: number;
  features: string[];
  billingCycle: 'monthly' | 'yearly';
  price: number;
}

export interface OrganizationSettings {
  timezone: string;
  currency: string;
  workingDays: number[];
  notifications: NotificationSettings;
  integrations: IntegrationSettings;
}

export interface User {
  id: string;
  organizationId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  permissions: Permission[];
  profile: UserProfile;
  status: 'active' | 'inactive' | 'pending';
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserRole {
  id: string;
  name: string;
  level: 'executive' | 'manager' | 'lead' | 'member' | 'viewer';
  permissions: string[];
}

export interface UserProfile {
  avatar?: string;
  phone?: string;
  location: string;
  department: string;
  jobTitle: string;
  skills: string[];
  certifications: string[];
}

export interface Tribe {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  mission: string;
  leaderId: string;
  squads: string[];
  businessDomain: string;
  budget: TribeBudget;
  kpis: KPI[];
  status: 'active' | 'inactive' | 'restructuring';
  createdAt: Date;
  updatedAt: Date;
}

export interface TribeBudget {
  allocated: number;
  spent: number;
  currency: string;
  period: 'quarterly' | 'yearly';
}

export interface Squad {
  id: string;
  organizationId: string;
  tribeId: string;
  name: string;
  purpose: string;
  type: 'feature' | 'platform' | 'enabling' | 'complicated-subsystem';
  members: SquadMember[];
  capacity: SquadCapacity;
  performance: SquadPerformance;
  status: 'forming' | 'storming' | 'norming' | 'performing' | 'dissolved';
  createdAt: Date;
  updatedAt: Date;
}

export interface SquadMember {
  userId: string;
  role: 'product-owner' | 'scrum-master' | 'tech-lead' | 'engineer' | 'designer' | 'analyst' | 'tester';
  allocation: number; // percentage 0-100
  startDate: Date;
  endDate?: Date;
}

export interface SquadCapacity {
  totalPoints: number;
  availablePoints: number;
  committedPoints: number;
  velocity: number[];
  efficiency: number;
}

export interface SquadPerformance {
  deliveryRate: number;
  qualityScore: number;
  satisfactionScore: number;
  lastUpdated: Date;
}

export interface Chapter {
  id: string;
  organizationId: string;
  name: string;
  domain: 'product' | 'engineering' | 'design' | 'data' | 'qa' | 'devops' | 'security';
  leaderId: string;
  members: string[];
  competencies: Competency[];
  initiatives: string[];
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface Competency {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  certificationRequired: boolean;
  trainingPrograms: string[];
}

export interface Project {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  type: 'epic' | 'initiative' | 'program' | 'portfolio';
  status: 'ideation' | 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
  priority: 'critical' | 'high' | 'medium' | 'low';
  timeline: ProjectTimeline;
  budget: ProjectBudget;
  stakeholders: ProjectStakeholder[];
  squads: string[];
  dependencies: ProjectDependency[];
  risks: Risk[];
  health: ProjectHealth;
  metrics: ProjectMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectTimeline {
  startDate: Date;
  endDate: Date;
  milestones: Milestone[];
  phases: ProjectPhase[];
}

export interface ProjectBudget {
  allocated: number;
  spent: number;
  forecasted: number;
  currency: string;
  breakdown: BudgetBreakdown[];
}

export interface BudgetBreakdown {
  category: string;
  amount: number;
  description: string;
}

export interface ProjectStakeholder {
  userId: string;
  role: 'sponsor' | 'owner' | 'contributor' | 'informed';
  influence: 'high' | 'medium' | 'low';
  interest: 'high' | 'medium' | 'low';
}

export interface ProjectDependency {
  id: string;
  type: 'blocks' | 'enables' | 'related';
  dependentProjectId: string;
  description: string;
  status: 'active' | 'resolved' | 'at-risk';
}

export interface ProjectHealth {
  overall: 'green' | 'yellow' | 'red';
  scope: 'green' | 'yellow' | 'red';
  timeline: 'green' | 'yellow' | 'red';
  budget: 'green' | 'yellow' | 'red';
  quality: 'green' | 'yellow' | 'red';
  lastAssessed: Date;
}

export interface Component {
  id: string;
  organizationId: string;
  projectId: string;
  name: string;
  description: string;
  type: 'frontend' | 'backend' | 'database' | 'integration' | 'infrastructure';
  complexity: 'simple' | 'moderate' | 'complex' | 'very-complex';
  architecture: ComponentArchitecture;
  dependencies: ComponentDependency[];
  apis: APIEndpoint[];
  documentation: Documentation[];
  tests: TestSuite[];
  owner: string;
  maintainers: string[];
  status: 'planning' | 'development' | 'testing' | 'deployed' | 'deprecated';
  createdAt: Date;
  updatedAt: Date;
}

export interface ComponentArchitecture {
  pattern: string;
  technology: string[];
  frameworks: string[];
  databases: string[];
  integrations: string[];
}

export interface ComponentDependency {
  componentId: string;
  type: 'hard' | 'soft';
  version: string;
  description: string;
}

export interface ReleaseApproval {
  id: string;
  stage: 'code-review' | 'qa-sign-off' | 'security-review' | 'business-approval' | 'deployment-approval';
  approver: string;
  status: 'pending' | 'approved' | 'rejected' | 'conditional';
  comments: string;
  approvedAt?: Date;
  conditions?: string[];
}

export interface ComplianceAssessment {
  id: string;
  assessor: string;
  date: Date;
  score: number;
  findings: AssessmentFinding[];
  recommendations: string[];
  nextAssessment: Date;
}

export interface AssessmentFinding {
  requirement: string;
  status: 'compliant' | 'non-compliant' | 'partial';
  evidence: string[];
  gaps: string[];
  remediation: string;
}

export interface Release {
  id: string;
  organizationId: string;
  name: string;
  version: string;
  type: 'major' | 'minor' | 'patch' | 'hotfix' | 'emergency';
  train: 'regular' | 'off-cadence' | 'security';
  scope: ReleaseScope;
  timeline: ReleaseTimeline;
  components: string[];
  projects: string[];
  squads: string[];
  approvals: ReleaseApproval[];
  deployments: Deployment[];
  rollback: RollbackPlan;
  metrics: ReleaseMetrics;
  status: 'planning' | 'development' | 'testing' | 'staging' | 'production' | 'completed' | 'failed' | 'rolled-back';
  createdAt: Date;
  updatedAt: Date;
}

export interface ReleaseScope {
  features: string[];
  bugFixes: string[];
  improvements: string[];
  deprecations: string[];
}

export interface ReleaseTimeline {
  codeFreeze: Date;
  testingStart: Date;
  stagingDeployment: Date;
  productionDeployment: Date;
  phases: ReleasePhase[];
}

export interface ReleasePhase {
  name: string;
  startDate: Date;
  endDate: Date;
  criteria: string[];
  responsible: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
}

export interface Deployment {
  id: string;
  environment: string;
  strategy: 'blue-green' | 'canary' | 'rolling' | 'recreate';
  automation: boolean;
  deployedAt: Date;
  deployedBy: string;
  status: 'success' | 'failed' | 'in-progress' | 'rolled-back';
  logs: string[];
  metrics: DeploymentMetrics;
}

export interface Incident {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  severity: 'p0' | 'p1' | 'p2' | 'p3' | 'p4';
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'availability' | 'performance' | 'security' | 'data' | 'functionality';
  status: 'new' | 'acknowledged' | 'investigating' | 'identified' | 'monitoring' | 'resolved' | 'closed';
  impact: IncidentImpact;
  timeline: IncidentTimeline;
  response: IncidentResponse;
  postMortem: PostMortem;
  affectedComponents: string[];
  affectedUsers: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IncidentImpact {
  usersAffected: number;
  revenueImpact: number;
  servicesDown: string[];
  degradedServices: string[];
}

export interface IncidentTimeline {
  detected: Date;
  acknowledged: Date;
  investigating: Date;
  identified: Date;
  mitigated: Date;
  resolved: Date;
}

export interface IncidentResponse {
  commanderId: string;
  responders: IncidentResponder[];
  communications: Communication[];
  actions: IncidentAction[];
}

export interface IncidentResponder {
  userId: string;
  role: 'commander' | 'investigator' | 'communicator' | 'support';
  joinedAt: Date;
}

export interface PostMortem {
  rootCause: string;
  contributingFactors: string[];
  lessonsLearned: string[];
  actionItems: ActionItem[];
  preventionMeasures: string[];
  publishedAt?: Date;
}

export interface APIEndpoint {
  id: string;
  componentId: string;
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  description: string;
  version: string;
  authentication: boolean;
  authorization: string[];
  rateLimit: number;
  schema: any;
  examples: any[];
  status: 'active' | 'deprecated' | 'beta';
  metrics: APIMetrics;
}

export interface APIMetrics {
  requests: number;
  errors: number;
  avgResponseTime: number;
  p95ResponseTime: number;
  uptime: number;
  lastUpdated: Date;
}

// Analytics & Metrics Interfaces
export interface KPI {
  id: string;
  name: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  trend: 'up' | 'down' | 'stable';
  lastUpdated: Date;
}

export interface ProjectMetrics {
  velocity: number[];
  burndown: BurndownPoint[];
  cycleTime: number;
  leadTime: number;
  defectRate: number;
  customerSatisfaction: number;
  teamMorale: number;
}

export interface BurndownPoint {
  date: Date;
  remaining: number;
  ideal: number;
}

export interface ReleaseMetrics {
  deploymentFrequency: number;
  leadTimeForChanges: number;
  meanTimeToRecovery: number;
  changeFailureRate: number;
}

export interface DeploymentMetrics {
  duration: number;
  failureRate: number;
  rollbackRate: number;
  successRate: number;
}

// Audit & Compliance
export interface AuditLog {
  id: string;
  organizationId: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string;
  changes: any;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

export interface Compliance {
  framework: 'SOX' | 'GDPR' | 'HIPAA' | 'PCI-DSS' | 'ISO27001';
  requirements: ComplianceRequirement[];
  assessments: ComplianceAssessment[];
  status: 'compliant' | 'non-compliant' | 'partial' | 'unknown';
}

export interface ComplianceRequirement {
  id: string;
  title: string;
  description: string;
  controls: string[];
  evidence: string[];
  responsible: string;
  dueDate: Date;
  status: 'met' | 'not-met' | 'in-progress' | 'not-applicable';
}

// Integration & Communication Interfaces
export interface Integration {
  id: string;
  type: 'jira' | 'github' | 'slack' | 'teams' | 'confluence' | 'jenkins' | 'datadog';
  config: any;
  status: 'active' | 'inactive' | 'error';
  lastSync: Date;
}

export interface NotificationSettings {
  email: boolean;
  slack: boolean;
  teams: boolean;
  inApp: boolean;
  frequency: 'real-time' | 'daily' | 'weekly';
}

export interface IntegrationSettings {
  jira: any;
  github: any;
  slack: any;
  teams: any;
  confluence: any;
}

// Common Interfaces
export interface Permission {
  resource: string;
  actions: string[];
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  dueDate: Date;
  status: 'pending' | 'completed' | 'at-risk' | 'delayed';
  deliverables: string[];
}

export interface ProjectPhase {
  name: string;
  startDate: Date;
  endDate: Date;
  objectives: string[];
  deliverables: string[];
  status: 'not-started' | 'in-progress' | 'completed' | 'on-hold';
}

export interface Risk {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'business' | 'operational' | 'financial' | 'compliance';
  probability: 'very-low' | 'low' | 'medium' | 'high' | 'very-high';
  impact: 'very-low' | 'low' | 'medium' | 'high' | 'very-high';
  severity: 'low' | 'medium' | 'high' | 'critical';
  mitigation: string;
  contingency: string;
  owner: string;
  status: 'identified' | 'assessing' | 'mitigating' | 'monitoring' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

export interface ActionItem {
  id: string;
  description: string;
  assignee: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
}

export interface Communication {
  id: string;
  type: 'internal' | 'external' | 'stakeholder' | 'customer';
  channel: 'email' | 'slack' | 'teams' | 'status-page' | 'social';
  message: string;
  sentBy: string;
  sentAt: Date;
  recipients: string[];
}

export interface IncidentAction {
  id: string;
  description: string;
  takenBy: string;
  takenAt: Date;
  result: string;
}

export interface Documentation {
  id: string;
  title: string;
  type: 'api' | 'architecture' | 'deployment' | 'user-guide' | 'troubleshooting';
  url: string;
  version: string;
  lastUpdated: Date;
}

export interface TestSuite {
  id: string;
  name: string;
  type: 'unit' | 'integration' | 'e2e' | 'performance' | 'security';
  coverage: number;
  status: 'passing' | 'failing' | 'skipped';
  lastRun: Date;
}

export interface TestCase {
  id: string;
  projectId: string;
  endpointId?: string;
  name: string;
  description: string;
  type: 'unit' | 'integration' | 'e2e' | 'performance' | 'security';
  priority: 'low' | 'medium' | 'high' | 'critical';
  testData: any;
  expectedResult: string;
  automationStatus: 'manual' | 'automated' | 'semi-automated';
  createdAt: Date;
  updatedAt: Date;
}

export interface TestResult {
  id: string;
  testCaseId: string;
  releaseId?: string;
  status: 'passed' | 'failed' | 'skipped' | 'error';
  executionTime?: number;
  errorMessage?: string;
  testData: any;
  executedBy?: string;
  executedAt: Date;
}

export interface RollbackPlan {
  strategy: string;
  steps: string[];
  estimatedTime: number;
  responsible: string;
  tested: boolean;
}
