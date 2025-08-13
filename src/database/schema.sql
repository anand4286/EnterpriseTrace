-- Enterprise TSR Database Schema
-- PostgreSQL Database Setup for Requirement Traceability Matrix System

-- Drop existing tables if they exist (in dependency order)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS squad_members CASCADE;
DROP TABLE IF EXISTS project_components CASCADE;
DROP TABLE IF EXISTS release_components CASCADE;
DROP TABLE IF EXISTS release_tests CASCADE;
DROP TABLE IF EXISTS test_results CASCADE;
DROP TABLE IF EXISTS test_cases CASCADE;
DROP TABLE IF EXISTS api_endpoints CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS releases CASCADE;
DROP TABLE IF EXISTS squads CASCADE;
DROP TABLE IF EXISTS chapters CASCADE;
DROP TABLE IF EXISTS tribes CASCADE;
DROP TABLE IF EXISTS user_permissions CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;

-- Create Organizations table
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    settings JSONB DEFAULT '{}',
    subscription JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role JSONB NOT NULL,
    profile JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending', 'suspended')),
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Permissions table
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resource VARCHAR(100) NOT NULL,
    actions TEXT[] NOT NULL,
    description TEXT
);

-- Create User Permissions table
CREATE TABLE user_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    granted_by UUID REFERENCES users(id),
    UNIQUE(user_id, permission_id)
);

-- Create Tribes table
CREATE TABLE tribes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    purpose TEXT,
    lead_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'forming')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Chapters table
CREATE TABLE chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    purpose TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('frontend', 'backend', 'data', 'platform', 'security', 'qa')),
    lead_id UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Squads table
CREATE TABLE squads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    tribe_id UUID REFERENCES tribes(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    purpose TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('feature', 'platform', 'enabling', 'complicated-subsystem')),
    status VARCHAR(20) DEFAULT 'forming' CHECK (status IN ('forming', 'storming', 'norming', 'performing', 'dissolved')),
    capacity JSONB DEFAULT '{}',
    performance JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Squad Members table
CREATE TABLE squad_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    squad_id UUID NOT NULL REFERENCES squads(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('product-owner', 'scrum-master', 'tech-lead', 'engineer', 'designer', 'analyst', 'tester')),
    allocation INTEGER DEFAULT 100 CHECK (allocation >= 0 AND allocation <= 100),
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(squad_id, user_id)
);

-- Create Projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    squad_id UUID REFERENCES squads(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'on-hold', 'completed', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    start_date DATE,
    end_date DATE,
    budget DECIMAL(12,2),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Releases table
CREATE TABLE releases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(50) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'planning' CHECK (status IN ('planning', 'development', 'testing', 'staging', 'production', 'rollback')),
    release_date TIMESTAMP WITH TIME ZONE,
    rollback_plan TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create API Endpoints table
CREATE TABLE api_endpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    path VARCHAR(500) NOT NULL,
    method VARCHAR(10) NOT NULL CHECK (method IN ('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD')),
    summary TEXT,
    description TEXT,
    tags TEXT[],
    parameters JSONB DEFAULT '[]',
    responses JSONB DEFAULT '{}',
    security JSONB DEFAULT '[]',
    deprecated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Test Cases table
CREATE TABLE test_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    endpoint_id UUID REFERENCES api_endpoints(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('unit', 'integration', 'e2e', 'performance', 'security')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    test_data JSONB DEFAULT '{}',
    expected_result TEXT,
    automation_status VARCHAR(20) DEFAULT 'manual' CHECK (automation_status IN ('manual', 'automated', 'semi-automated')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Test Results table
CREATE TABLE test_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_case_id UUID NOT NULL REFERENCES test_cases(id) ON DELETE CASCADE,
    release_id UUID REFERENCES releases(id) ON DELETE SET NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('passed', 'failed', 'skipped', 'error')),
    execution_time INTEGER, -- in milliseconds
    error_message TEXT,
    test_data JSONB DEFAULT '{}',
    executed_by UUID REFERENCES users(id),
    executed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Project Components table (for traceability)
CREATE TABLE project_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('frontend', 'backend', 'database', 'api', 'service', 'library')),
    version VARCHAR(50),
    repository_url VARCHAR(500),
    documentation_url VARCHAR(500),
    health_status VARCHAR(20) DEFAULT 'unknown' CHECK (health_status IN ('healthy', 'warning', 'critical', 'unknown')),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Release Components table (many-to-many)
CREATE TABLE release_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    release_id UUID NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
    component_id UUID NOT NULL REFERENCES project_components(id) ON DELETE CASCADE,
    version VARCHAR(50),
    changes TEXT,
    UNIQUE(release_id, component_id)
);

-- Create Release Tests table (many-to-many)
CREATE TABLE release_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    release_id UUID NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
    test_case_id UUID NOT NULL REFERENCES test_cases(id) ON DELETE CASCADE,
    required BOOLEAN DEFAULT TRUE,
    UNIQUE(release_id, test_case_id)
);

-- Create Audit Logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    status VARCHAR(20) NOT NULL CHECK (status IN ('SUCCESS', 'FAILURE', 'ERROR')),
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for Performance
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);

CREATE INDEX idx_squads_organization_id ON squads(organization_id);
CREATE INDEX idx_squads_tribe_id ON squads(tribe_id);
CREATE INDEX idx_squads_status ON squads(status);

CREATE INDEX idx_projects_organization_id ON projects(organization_id);
CREATE INDEX idx_projects_squad_id ON projects(squad_id);
CREATE INDEX idx_projects_status ON projects(status);

CREATE INDEX idx_releases_organization_id ON releases(organization_id);
CREATE INDEX idx_releases_project_id ON releases(project_id);
CREATE INDEX idx_releases_status ON releases(status);

CREATE INDEX idx_api_endpoints_project_id ON api_endpoints(project_id);
CREATE INDEX idx_api_endpoints_method_path ON api_endpoints(method, path);

CREATE INDEX idx_test_cases_project_id ON test_cases(project_id);
CREATE INDEX idx_test_cases_endpoint_id ON test_cases(endpoint_id);
CREATE INDEX idx_test_cases_type ON test_cases(type);

CREATE INDEX idx_test_results_test_case_id ON test_results(test_case_id);
CREATE INDEX idx_test_results_release_id ON test_results(release_id);
CREATE INDEX idx_test_results_status ON test_results(status);
CREATE INDEX idx_test_results_executed_at ON test_results(executed_at);

CREATE INDEX idx_audit_logs_organization_id ON audit_logs(organization_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Create Functions for Updated Timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create Triggers for Updated Timestamps
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tribes_updated_at BEFORE UPDATE ON tribes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON chapters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_squads_updated_at BEFORE UPDATE ON squads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_releases_updated_at BEFORE UPDATE ON releases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_api_endpoints_updated_at BEFORE UPDATE ON api_endpoints FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_test_cases_updated_at BEFORE UPDATE ON test_cases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert Sample Data for Development
INSERT INTO permissions (resource, actions, description) VALUES
('organizations', ARRAY['read', 'create', 'update', 'delete'], 'Organization management permissions'),
('users', ARRAY['read', 'create', 'update', 'delete', 'invite'], 'User management permissions'),
('squads', ARRAY['read', 'create', 'update', 'delete'], 'Squad management permissions'),
('projects', ARRAY['read', 'create', 'update', 'delete'], 'Project management permissions'),
('releases', ARRAY['read', 'create', 'update', 'delete'], 'Release management permissions'),
('test-cases', ARRAY['read', 'create', 'update', 'delete', 'execute'], 'Test case management permissions'),
('audit-logs', ARRAY['read'], 'Audit log viewing permissions');

-- Sample Organization (for development)
INSERT INTO organizations (id, name, domain, subscription) VALUES 
('00000000-0000-0000-0000-000000000001', 'Demo Enterprise Corp', 'demo.example.com', 
 '{"type": "enterprise", "maxUsers": 1000, "maxProjects": 500, "features": ["basic", "advanced", "premium"]}');

COMMIT;
