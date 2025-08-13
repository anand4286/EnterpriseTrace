import { pool } from './connection';
import { QueryResult } from 'pg';
import { 
  Organization, 
  User, 
  Squad, 
  Project, 
  Release, 
  APIEndpoint, 
  TestCase, 
  TestResult, 
  AuditLog 
} from '../models';

// Base Repository Class
export abstract class BaseRepository<T> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async findById(id: string): Promise<T | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async findAll(organizationId?: string, limit: number = 100, offset: number = 0): Promise<T[]> {
    let query = `SELECT * FROM ${this.tableName}`;
    const params: any[] = [];

    if (organizationId) {
      query += ` WHERE organization_id = $1`;
      params.push(organizationId);
      query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);
    } else {
      query += ` LIMIT $1 OFFSET $2`;
      params.push(limit, offset);
    }

    const result = await pool.query(query, params);
    return result.rows;
  }

  async create(data: Partial<T>): Promise<T> {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

    const query = `
      INSERT INTO ${this.tableName} (${columns}) 
      VALUES (${placeholders}) 
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const entries = Object.entries(data);
    const setClause = entries.map(([key], index) => `${key} = $${index + 2}`).join(', ');
    const values = entries.map(([, value]) => value);

    const query = `
      UPDATE ${this.tableName} 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $1 
      RETURNING *
    `;

    const result = await pool.query(query, [id, ...values]);
    return result.rows[0] || null;
  }

  async delete(id: string): Promise<boolean> {
    const query = `DELETE FROM ${this.tableName} WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return (result.rowCount || 0) > 0;
  }
}

// Organization Repository
export class OrganizationRepository extends BaseRepository<Organization> {
  constructor() {
    super('organizations');
  }

  // Override create method to handle database column transformation
  async create(data: Partial<Organization>): Promise<Organization> {
    // Transform Organization object to database format
    const dbData: any = {};
    
    if (data.id) dbData.id = data.id;
    if (data.name) dbData.name = data.name;
    if (data.domain) dbData.domain = data.domain;
    if (data.settings) dbData.settings = JSON.stringify(data.settings);
    if (data.subscription) dbData.subscription = JSON.stringify(data.subscription);

    const columns = Object.keys(dbData).join(', ');
    const values = Object.values(dbData);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

    const query = `
      INSERT INTO ${this.tableName} (${columns}) 
      VALUES (${placeholders}) 
      RETURNING *
    `;

    const result = await pool.query(query, values);
    const row = result.rows[0];
    
    // Transform back to Organization format
    return {
      id: row.id,
      name: row.name,
      domain: row.domain,
      settings: typeof row.settings === 'string' ? JSON.parse(row.settings) : row.settings,
      subscription: typeof row.subscription === 'string' ? JSON.parse(row.subscription) : row.subscription,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  async findByDomain(domain: string): Promise<Organization | null> {
    const query = 'SELECT * FROM organizations WHERE domain = $1';
    const result = await pool.query(query, [domain]);
    return result.rows[0] || null;
  }

  async getStats(organizationId: string): Promise<any> {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM users WHERE organization_id = $1) as total_users,
        (SELECT COUNT(*) FROM users WHERE organization_id = $1 AND status = 'active') as active_users,
        (SELECT COUNT(*) FROM squads WHERE organization_id = $1) as total_squads,
        (SELECT COUNT(*) FROM projects WHERE organization_id = $1) as total_projects,
        (SELECT COUNT(*) FROM releases WHERE organization_id = $1) as total_releases
    `;
    const result = await pool.query(query, [organizationId]);
    return result.rows[0];
  }
}

// User Repository
export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users');
  }

  // Transform database row to User object
  private transformRow(row: any): User {
    return {
      id: row.id,
      organizationId: row.organization_id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      role: typeof row.role === 'string' ? JSON.parse(row.role) : row.role,
      permissions: [], // Will be populated from role permissions
      profile: typeof row.profile === 'string' ? JSON.parse(row.profile) : row.profile,
      status: row.status,
      lastLoginAt: row.last_login_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0] ? this.transformRow(result.rows[0]) : null;
  }

  async findByOrganization(organizationId: string): Promise<User[]> {
    const query = 'SELECT * FROM users WHERE organization_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [organizationId]);
    return result.rows.map(row => this.transformRow(row));
  }

  async findById(id: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] ? this.transformRow(result.rows[0]) : null;
  }

  async create(user: User): Promise<User> {
    const query = `
      INSERT INTO users (id, organization_id, email, first_name, last_name, role, profile, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `;
    const values = [
      user.id,
      user.organizationId,
      user.email,
      user.firstName,
      user.lastName,
      JSON.stringify(user.role),
      JSON.stringify(user.profile),
      user.status,
      user.createdAt,
      user.updatedAt
    ];
    const result = await pool.query(query, values);
    return this.transformRow(result.rows[0]);
  }

  async update(id: string, user: User): Promise<User | null> {
    const query = `
      UPDATE users 
      SET email = $2, first_name = $3, last_name = $4, role = $5, profile = $6, status = $7, updated_at = $8
      WHERE id = $1
      RETURNING *
    `;
    const values = [
      id,
      user.email,
      user.firstName,
      user.lastName,
      JSON.stringify(user.role),
      JSON.stringify(user.profile),
      user.status,
      user.updatedAt
    ];
    const result = await pool.query(query, values);
    return result.rows[0] ? this.transformRow(result.rows[0]) : null;
  }

  async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return (result.rowCount || 0) > 0;
  }

  async getUsersByRole(organizationId: string): Promise<Record<string, number>> {
    const query = `
      SELECT 
        role->>'name' as role_name,
        COUNT(*) as count
      FROM users 
      WHERE organization_id = $1 AND status = 'active'
      GROUP BY role->>'name'
    `;
    const result = await pool.query(query, [organizationId]);
    return result.rows.reduce((acc, row) => {
      acc[row.role_name] = parseInt(row.count);
      return acc;
    }, {});
  }
}

// Squad Repository
export class SquadRepository extends BaseRepository<Squad> {
  constructor() {
    super('squads');
  }

  // Transform database row to Squad object
  private transformRow(row: any): Squad {
    return {
      id: row.id,
      organizationId: row.organization_id,
      tribeId: row.tribe_id,
      name: row.name,
      purpose: row.purpose,
      type: row.type,
      status: row.status,
      members: [], // Will be populated separately
      capacity: typeof row.capacity === 'string' ? JSON.parse(row.capacity) : row.capacity,
      performance: typeof row.performance === 'string' ? JSON.parse(row.performance) : row.performance,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  // Override create method to handle database column transformation
  async create(data: Partial<Squad>): Promise<Squad> {
    // Transform Squad object to database format
    const dbData: any = {};
    
    if (data.id) dbData.id = data.id;
    if (data.organizationId) dbData.organization_id = data.organizationId;
    if (data.tribeId) dbData.tribe_id = data.tribeId;
    if (data.name) dbData.name = data.name;
    if (data.purpose) dbData.purpose = data.purpose;
    if (data.type) dbData.type = data.type;
    if (data.status) dbData.status = data.status;
    if (data.capacity) dbData.capacity = JSON.stringify(data.capacity);
    if (data.performance) dbData.performance = JSON.stringify(data.performance);
    // Note: Don't include createdAt/updatedAt, let database handle with DEFAULT

    const columns = Object.keys(dbData).join(', ');
    const values = Object.values(dbData);
    const placeholders = values.map((_, index) => `$${index + 1}`).join(', ');

    const query = `
      INSERT INTO ${this.tableName} (${columns}) 
      VALUES (${placeholders}) 
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return this.transformRow(result.rows[0]);
  }

  async findAll(organizationId?: string, limit?: number, offset?: number): Promise<Squad[]> {
    let query = `SELECT * FROM ${this.tableName}`;
    const params: any[] = [];
    
    if (organizationId) {
      query += ' WHERE organization_id = $1';
      params.push(organizationId);
    }
    
    query += ' ORDER BY created_at DESC';
    
    if (limit !== undefined) {
      query += ` LIMIT $${params.length + 1}`;
      params.push(limit);
    }
    
    if (offset !== undefined) {
      query += ` OFFSET $${params.length + 1}`;
      params.push(offset);
    }

    const result = await pool.query(query, params);
    return result.rows.map(row => this.transformRow(row));
  }

  async findById(id: string): Promise<Squad | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rows[0] ? this.transformRow(result.rows[0]) : null;
  }

  async findByTribe(tribeId: string): Promise<Squad[]> {
    const query = 'SELECT * FROM squads WHERE tribe_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [tribeId]);
    return result.rows.map(row => this.transformRow(row));
  }

  async getSquadMembers(squadId: string): Promise<any[]> {
    const query = `
      SELECT 
        sm.*,
        u.first_name,
        u.last_name,
        u.email,
        u.role
      FROM squad_members sm
      JOIN users u ON sm.user_id = u.id
      WHERE sm.squad_id = $1
      ORDER BY sm.created_at
    `;
    const result = await pool.query(query, [squadId]);
    return result.rows;
  }

  async addMember(squadId: string, userId: string, role: string, allocation: number = 100): Promise<any> {
    const query = `
      INSERT INTO squad_members (squad_id, user_id, role, allocation)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(query, [squadId, userId, role, allocation]);
    return result.rows[0];
  }

  async removeMember(squadId: string, userId: string): Promise<boolean> {
    const query = 'DELETE FROM squad_members WHERE squad_id = $1 AND user_id = $2';
    const result = await pool.query(query, [squadId, userId]);
    return (result.rowCount || 0) > 0;
  }

  // Override delete to handle cascading deletes
  async delete(id: string): Promise<boolean> {
    // First delete squad members
    await pool.query('DELETE FROM squad_members WHERE squad_id = $1', [id]);
    
    // Then delete the squad itself
    const query = 'DELETE FROM squads WHERE id = $1';
    const result = await pool.query(query, [id]);
    return (result.rowCount || 0) > 0;
  }
}

// Project Repository
export class ProjectRepository extends BaseRepository<Project> {
  constructor() {
    super('projects');
  }

  async findBySquad(squadId: string): Promise<Project[]> {
    const query = 'SELECT * FROM projects WHERE squad_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [squadId]);
    return result.rows;
  }

  async getProjectStats(projectId: string): Promise<any> {
    const query = `
      SELECT 
        p.*,
        (SELECT COUNT(*) FROM api_endpoints WHERE project_id = p.id) as total_endpoints,
        (SELECT COUNT(*) FROM test_cases WHERE project_id = p.id) as total_test_cases,
        (SELECT COUNT(*) FROM releases WHERE project_id = p.id) as total_releases,
        (SELECT COUNT(*) FROM project_components WHERE project_id = p.id) as total_components
      FROM projects p
      WHERE p.id = $1
    `;
    const result = await pool.query(query, [projectId]);
    return result.rows[0];
  }
}

// API Endpoint Repository
export class ApiEndpointRepository extends BaseRepository<APIEndpoint> {
  constructor() {
    super('api_endpoints');
  }

  async findByProject(projectId: string): Promise<APIEndpoint[]> {
    const query = 'SELECT * FROM api_endpoints WHERE project_id = $1 ORDER BY path, method';
    const result = await pool.query(query, [projectId]);
    return result.rows;
  }

  async findByMethodAndPath(method: string, path: string): Promise<APIEndpoint[]> {
    const query = 'SELECT * FROM api_endpoints WHERE method = $1 AND path = $2';
    const result = await pool.query(query, [method, path]);
    return result.rows;
  }
}

// Test Case Repository
export class TestCaseRepository extends BaseRepository<TestCase> {
  constructor() {
    super('test_cases');
  }

  async findByProject(projectId: string): Promise<TestCase[]> {
    const query = 'SELECT * FROM test_cases WHERE project_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [projectId]);
    return result.rows;
  }

  async findByEndpoint(endpointId: string): Promise<TestCase[]> {
    const query = 'SELECT * FROM test_cases WHERE endpoint_id = $1 ORDER BY priority DESC';
    const result = await pool.query(query, [endpointId]);
    return result.rows;
  }

  async getTestCoverage(projectId: string): Promise<any> {
    const query = `
      SELECT 
        COUNT(DISTINCT tc.id) as total_tests,
        COUNT(DISTINCT tc.endpoint_id) as covered_endpoints,
        (SELECT COUNT(*) FROM api_endpoints WHERE project_id = $1) as total_endpoints,
        COUNT(CASE WHEN tc.automation_status = 'automated' THEN 1 END) as automated_tests
      FROM test_cases tc
      WHERE tc.project_id = $1
    `;
    const result = await pool.query(query, [projectId]);
    return result.rows[0];
  }
}

// Test Result Repository
export class TestResultRepository extends BaseRepository<TestResult> {
  constructor() {
    super('test_results');
  }

  async findByTestCase(testCaseId: string, limit: number = 50): Promise<TestResult[]> {
    const query = `
      SELECT * FROM test_results 
      WHERE test_case_id = $1 
      ORDER BY executed_at DESC 
      LIMIT $2
    `;
    const result = await pool.query(query, [testCaseId, limit]);
    return result.rows;
  }

  async findByRelease(releaseId: string): Promise<TestResult[]> {
    const query = `
      SELECT tr.*, tc.name as test_name, tc.type as test_type
      FROM test_results tr
      JOIN test_cases tc ON tr.test_case_id = tc.id
      WHERE tr.release_id = $1
      ORDER BY tr.executed_at DESC
    `;
    const result = await pool.query(query, [releaseId]);
    return result.rows;
  }

  async getTestResultsStats(projectId: string, releaseId?: string): Promise<any> {
    let query = `
      SELECT 
        COUNT(*) as total_executions,
        COUNT(CASE WHEN tr.status = 'passed' THEN 1 END) as passed,
        COUNT(CASE WHEN tr.status = 'failed' THEN 1 END) as failed,
        COUNT(CASE WHEN tr.status = 'skipped' THEN 1 END) as skipped,
        COUNT(CASE WHEN tr.status = 'error' THEN 1 END) as errors,
        AVG(tr.execution_time) as avg_execution_time
      FROM test_results tr
      JOIN test_cases tc ON tr.test_case_id = tc.id
      WHERE tc.project_id = $1
    `;
    
    const params = [projectId];
    if (releaseId) {
      query += ' AND tr.release_id = $2';
      params.push(releaseId);
    }

    const result = await pool.query(query, params);
    return result.rows[0];
  }
}

// Audit Log Repository
export class AuditLogRepository extends BaseRepository<AuditLog> {
  constructor() {
    super('audit_logs');
  }

  async findByOrganization(organizationId: string, limit: number = 100): Promise<AuditLog[]> {
    const query = `
      SELECT al.*, u.first_name, u.last_name, u.email
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE al.organization_id = $1
      ORDER BY al.created_at DESC
      LIMIT $2
    `;
    const result = await pool.query(query, [organizationId, limit]);
    return result.rows;
  }

  async findByUser(userId: string, limit: number = 100): Promise<AuditLog[]> {
    const query = `
      SELECT * FROM audit_logs 
      WHERE user_id = $1 
      ORDER BY created_at DESC 
      LIMIT $2
    `;
    const result = await pool.query(query, [userId, limit]);
    return result.rows;
  }

  async getAuditStats(organizationId: string, days: number = 30): Promise<any> {
    const query = `
      SELECT 
        COUNT(*) as total_actions,
        COUNT(CASE WHEN status = 'SUCCESS' THEN 1 END) as successful_actions,
        COUNT(CASE WHEN status = 'FAILURE' THEN 1 END) as failed_actions,
        COUNT(DISTINCT user_id) as active_users,
        COUNT(DISTINCT action) as unique_actions
      FROM audit_logs
      WHERE organization_id = $1 
        AND created_at >= NOW() - INTERVAL '${days} days'
    `;
    const result = await pool.query(query, [organizationId]);
    return result.rows[0];
  }
}

// Repository Factory
export class RepositoryFactory {
  private static instances: Map<string, any> = new Map();

  static getOrganizationRepository(): OrganizationRepository {
    if (!this.instances.has('organization')) {
      this.instances.set('organization', new OrganizationRepository());
    }
    return this.instances.get('organization');
  }

  static getUserRepository(): UserRepository {
    if (!this.instances.has('user')) {
      this.instances.set('user', new UserRepository());
    }
    return this.instances.get('user');
  }

  static getSquadRepository(): SquadRepository {
    if (!this.instances.has('squad')) {
      this.instances.set('squad', new SquadRepository());
    }
    return this.instances.get('squad');
  }

  static getProjectRepository(): ProjectRepository {
    if (!this.instances.has('project')) {
      this.instances.set('project', new ProjectRepository());
    }
    return this.instances.get('project');
  }

  static getApiEndpointRepository(): ApiEndpointRepository {
    if (!this.instances.has('apiEndpoint')) {
      this.instances.set('apiEndpoint', new ApiEndpointRepository());
    }
    return this.instances.get('apiEndpoint');
  }

  static getTestCaseRepository(): TestCaseRepository {
    if (!this.instances.has('testCase')) {
      this.instances.set('testCase', new TestCaseRepository());
    }
    return this.instances.get('testCase');
  }

  static getTestResultRepository(): TestResultRepository {
    if (!this.instances.has('testResult')) {
      this.instances.set('testResult', new TestResultRepository());
    }
    return this.instances.get('testResult');
  }

  static getAuditLogRepository(): AuditLogRepository {
    if (!this.instances.has('auditLog')) {
      this.instances.set('auditLog', new AuditLogRepository());
    }
    return this.instances.get('auditLog');
  }
}
