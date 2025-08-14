import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Collapse,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Code as CodeIcon,
  Storage as DatabaseIcon,
  Web as FrontendIcon,
  CloudQueue as BackendIcon,
  Security as SecurityIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Visibility as ViewIcon,
  TrendingUp as TrendingUpIcon,
  Update as UpdateIcon
} from '@mui/icons-material';

// Add global CSS animations
const globalStyles = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.type = 'text/css';
  styleSheet.innerText = globalStyles;
  document.head.appendChild(styleSheet);
}

interface TechStackInsightsProps {
  onNavigateToTechStack?: () => void;
  currentPage?: string;
}

interface TechStackMetrics {
  totalComponents: number;
  healthyComponents: number;
  warningComponents: number;
  criticalComponents: number;
  securityScore: number;
  outdatedComponents: number;
  coverage: number;
}

interface TechStackCategory {
  name: string;
  count: number;
  healthy: number;
  warning: number;
  critical: number;
  icon: React.ReactNode;
  color: string;
}

const TechStackInsights: React.FC<TechStackInsightsProps> = ({ onNavigateToTechStack, currentPage }) => {
  const [expanded, setExpanded] = useState(false);
  const [metrics, setMetrics] = useState<TechStackMetrics>({
    totalComponents: 0,
    healthyComponents: 0,
    warningComponents: 0,
    criticalComponents: 0,
    securityScore: 0,
    outdatedComponents: 0,
    coverage: 0
  });
  const [categories, setCategories] = useState<TechStackCategory[]>([]);

  useEffect(() => {
    const pageData = getPageSpecificData(currentPage || 'dashboard');
    setMetrics(pageData.metrics);
    setCategories(pageData.categories);
  }, [currentPage]);

  const getPageSpecificData = (page: string) => {
    switch (page) {
      case 'dashboard':
      case 'live-dashboard':
        return {
          metrics: {
            totalComponents: 24,
            healthyComponents: 18,
            warningComponents: 4,
            criticalComponents: 2,
            securityScore: 87,
            outdatedComponents: 6,
            coverage: 92
          },
          categories: [
            { name: 'Active Projects', count: 12, healthy: 10, warning: 2, critical: 0, icon: <TrendingUpIcon />, color: '#4CAF50' },
            { name: 'Components', count: 24, healthy: 18, warning: 4, critical: 2, icon: <CodeIcon />, color: '#2196F3' },
            { name: 'Services', count: 8, healthy: 6, warning: 1, critical: 1, icon: <BackendIcon />, color: '#FF9800' },
            { name: 'Infrastructure', count: 6, healthy: 5, warning: 1, critical: 0, icon: <DatabaseIcon />, color: '#9C27B0' }
          ]
        };

      case 'traceability':
        return {
          metrics: {
            totalComponents: 156,
            healthyComponents: 142,
            warningComponents: 12,
            criticalComponents: 2,
            securityScore: 94,
            outdatedComponents: 8,
            coverage: 96
          },
          categories: [
            { name: 'Requirements', count: 45, healthy: 42, warning: 3, critical: 0, icon: <TrendingUpIcon />, color: '#4CAF50' },
            { name: 'Test Cases', count: 78, healthy: 72, warning: 5, critical: 1, icon: <SecurityIcon />, color: '#2196F3' },
            { name: 'API Endpoints', count: 23, healthy: 20, warning: 2, critical: 1, icon: <BackendIcon />, color: '#FF9800' },
            { name: 'Coverage Maps', count: 10, healthy: 8, warning: 2, critical: 0, icon: <DatabaseIcon />, color: '#9C27B0' }
          ]
        };

      case 'test-results':
        return {
          metrics: {
            totalComponents: 89,
            healthyComponents: 76,
            warningComponents: 8,
            criticalComponents: 5,
            securityScore: 88,
            outdatedComponents: 12,
            coverage: 85
          },
          categories: [
            { name: 'Test Suites', count: 25, healthy: 22, warning: 2, critical: 1, icon: <SecurityIcon />, color: '#4CAF50' },
            { name: 'API Tests', count: 34, healthy: 28, warning: 4, critical: 2, icon: <BackendIcon />, color: '#2196F3' },
            { name: 'UI Tests', count: 20, healthy: 16, warning: 2, critical: 2, icon: <FrontendIcon />, color: '#FF9800' },
            { name: 'Performance', count: 10, healthy: 10, warning: 0, critical: 0, icon: <TrendingUpIcon />, color: '#9C27B0' }
          ]
        };

      case 'technical-configuration':
        return {
          metrics: {
            totalComponents: 24,
            healthyComponents: 18,
            warningComponents: 4,
            criticalComponents: 2,
            securityScore: 87,
            outdatedComponents: 6,
            coverage: 92
          },
          categories: [
            { name: 'Frontend', count: 8, healthy: 6, warning: 1, critical: 1, icon: <FrontendIcon />, color: '#2196F3' },
            { name: 'Backend', count: 10, healthy: 8, warning: 2, critical: 0, icon: <BackendIcon />, color: '#4CAF50' },
            { name: 'Database', count: 4, healthy: 3, warning: 1, critical: 0, icon: <DatabaseIcon />, color: '#FF9800' },
            { name: 'Security', count: 2, healthy: 1, warning: 0, critical: 1, icon: <SecurityIcon />, color: '#F44336' }
          ]
        };

      case 'business-requirements':
        return {
          metrics: {
            totalComponents: 67,
            healthyComponents: 58,
            warningComponents: 7,
            criticalComponents: 2,
            securityScore: 91,
            outdatedComponents: 5,
            coverage: 89
          },
          categories: [
            { name: 'Requirements', count: 45, healthy: 40, warning: 4, critical: 1, icon: <TrendingUpIcon />, color: '#4CAF50' },
            { name: 'User Stories', count: 12, healthy: 10, warning: 2, critical: 0, icon: <FrontendIcon />, color: '#2196F3' },
            { name: 'Acceptance Criteria', count: 8, healthy: 6, warning: 1, critical: 1, icon: <SecurityIcon />, color: '#FF9800' },
            { name: 'Dependencies', count: 2, healthy: 2, warning: 0, critical: 0, icon: <BackendIcon />, color: '#9C27B0' }
          ]
        };

      case 'release':
        return {
          metrics: {
            totalComponents: 15,
            healthyComponents: 12,
            warningComponents: 2,
            criticalComponents: 1,
            securityScore: 85,
            outdatedComponents: 3,
            coverage: 88
          },
          categories: [
            { name: 'Active Releases', count: 3, healthy: 2, warning: 1, critical: 0, icon: <TrendingUpIcon />, color: '#4CAF50' },
            { name: 'Release Pipeline', count: 5, healthy: 4, warning: 1, critical: 0, icon: <BackendIcon />, color: '#2196F3' },
            { name: 'Deploy Targets', count: 4, healthy: 3, warning: 0, critical: 1, icon: <DatabaseIcon />, color: '#FF9800' },
            { name: 'Readiness Checks', count: 3, healthy: 3, warning: 0, critical: 0, icon: <SecurityIcon />, color: '#9C27B0' }
          ]
        };

      case 'squad':
        return {
          metrics: {
            totalComponents: 32,
            healthyComponents: 28,
            warningComponents: 3,
            criticalComponents: 1,
            securityScore: 93,
            outdatedComponents: 2,
            coverage: 94
          },
          categories: [
            { name: 'Squad Members', count: 18, healthy: 16, warning: 2, critical: 0, icon: <FrontendIcon />, color: '#4CAF50' },
            { name: 'Active Sprints', count: 4, healthy: 4, warning: 0, critical: 0, icon: <TrendingUpIcon />, color: '#2196F3' },
            { name: 'Deliverables', count: 8, healthy: 6, warning: 1, critical: 1, icon: <BackendIcon />, color: '#FF9800' },
            { name: 'Velocity Metrics', count: 2, healthy: 2, warning: 0, critical: 0, icon: <SecurityIcon />, color: '#9C27B0' }
          ]
        };

      case 'environment':
        return {
          metrics: {
            totalComponents: 18,
            healthyComponents: 15,
            warningComponents: 2,
            criticalComponents: 1,
            securityScore: 89,
            outdatedComponents: 4,
            coverage: 91
          },
          categories: [
            { name: 'Dev Environment', count: 6, healthy: 5, warning: 1, critical: 0, icon: <CodeIcon />, color: '#4CAF50' },
            { name: 'Staging', count: 5, healthy: 4, warning: 1, critical: 0, icon: <BackendIcon />, color: '#2196F3' },
            { name: 'Production', count: 4, healthy: 3, warning: 0, critical: 1, icon: <SecurityIcon />, color: '#FF9800' },
            { name: 'Monitoring', count: 3, healthy: 3, warning: 0, critical: 0, icon: <TrendingUpIcon />, color: '#9C27B0' }
          ]
        };

      case 'user-management':
        return {
          metrics: {
            totalComponents: 47,
            healthyComponents: 42,
            warningComponents: 4,
            criticalComponents: 1,
            securityScore: 96,
            outdatedComponents: 2,
            coverage: 94
          },
          categories: [
            { name: 'Active Users', count: 28, healthy: 26, warning: 2, critical: 0, icon: <FrontendIcon />, color: '#4CAF50' },
            { name: 'User Roles', count: 8, healthy: 7, warning: 1, critical: 0, icon: <SecurityIcon />, color: '#2196F3' },
            { name: 'Permissions', count: 15, healthy: 14, warning: 1, critical: 0, icon: <BackendIcon />, color: '#FF9800' },
            { name: 'Auth Systems', count: 3, healthy: 2, warning: 0, critical: 1, icon: <DatabaseIcon />, color: '#9C27B0' }
          ]
        };

      case 'chapter':
        return {
          metrics: {
            totalComponents: 23,
            healthyComponents: 20,
            warningComponents: 2,
            criticalComponents: 1,
            securityScore: 88,
            outdatedComponents: 3,
            coverage: 87
          },
          categories: [
            { name: 'Active Chapters', count: 8, healthy: 7, warning: 1, critical: 0, icon: <TrendingUpIcon />, color: '#4CAF50' },
            { name: 'Chapter Members', count: 12, healthy: 11, warning: 1, critical: 0, icon: <FrontendIcon />, color: '#2196F3' },
            { name: 'Governance', count: 2, healthy: 1, warning: 0, critical: 1, icon: <SecurityIcon />, color: '#FF9800' },
            { name: 'Artifacts', count: 5, healthy: 5, warning: 0, critical: 0, icon: <BackendIcon />, color: '#9C27B0' }
          ]
        };

      case 'api-docs':
        return {
          metrics: {
            totalComponents: 34,
            healthyComponents: 28,
            warningComponents: 5,
            criticalComponents: 1,
            securityScore: 92,
            outdatedComponents: 6,
            coverage: 82
          },
          categories: [
            { name: 'API Endpoints', count: 18, healthy: 15, warning: 2, critical: 1, icon: <BackendIcon />, color: '#4CAF50' },
            { name: 'Documentation', count: 10, healthy: 8, warning: 2, critical: 0, icon: <CodeIcon />, color: '#2196F3' },
            { name: 'Examples', count: 4, healthy: 3, warning: 1, critical: 0, icon: <FrontendIcon />, color: '#FF9800' },
            { name: 'Schemas', count: 2, healthy: 2, warning: 0, critical: 0, icon: <DatabaseIcon />, color: '#9C27B0' }
          ]
        };

      case 'api-test':
        return {
          metrics: {
            totalComponents: 41,
            healthyComponents: 35,
            warningComponents: 4,
            criticalComponents: 2,
            securityScore: 89,
            outdatedComponents: 5,
            coverage: 85
          },
          categories: [
            { name: 'Test Cases', count: 22, healthy: 19, warning: 2, critical: 1, icon: <SecurityIcon />, color: '#4CAF50' },
            { name: 'API Endpoints', count: 12, healthy: 10, warning: 1, critical: 1, icon: <BackendIcon />, color: '#2196F3' },
            { name: 'Mock Data', count: 5, healthy: 4, warning: 1, critical: 0, icon: <DatabaseIcon />, color: '#FF9800' },
            { name: 'Automation', count: 2, healthy: 2, warning: 0, critical: 0, icon: <TrendingUpIcon />, color: '#9C27B0' }
          ]
        };

      case 'user-autocomplete-demo':
        return {
          metrics: {
            totalComponents: 12,
            healthyComponents: 10,
            warningComponents: 1,
            criticalComponents: 1,
            securityScore: 85,
            outdatedComponents: 2,
            coverage: 83
          },
          categories: [
            { name: 'Search Engine', count: 4, healthy: 3, warning: 1, critical: 0, icon: <FrontendIcon />, color: '#4CAF50' },
            { name: 'Data Sources', count: 3, healthy: 2, warning: 0, critical: 1, icon: <DatabaseIcon />, color: '#2196F3' },
            { name: 'UI Components', count: 3, healthy: 3, warning: 0, critical: 0, icon: <CodeIcon />, color: '#FF9800' },
            { name: 'Performance', count: 2, healthy: 2, warning: 0, critical: 0, icon: <TrendingUpIcon />, color: '#9C27B0' }
          ]
        };

      default:
        return {
          metrics: {
            totalComponents: 24,
            healthyComponents: 18,
            warningComponents: 4,
            criticalComponents: 2,
            securityScore: 87,
            outdatedComponents: 6,
            coverage: 92
          },
          categories: [
            { name: 'Components', count: 24, healthy: 18, warning: 4, critical: 2, icon: <CodeIcon />, color: '#2196F3' },
            { name: 'Services', count: 8, healthy: 6, warning: 1, critical: 1, icon: <BackendIcon />, color: '#4CAF50' },
            { name: 'Data Sources', count: 4, healthy: 3, warning: 1, critical: 0, icon: <DatabaseIcon />, color: '#FF9800' },
            { name: 'Security', count: 2, healthy: 1, warning: 0, critical: 1, icon: <SecurityIcon />, color: '#F44336' }
          ]
        };
    }
  };

  const getHealthPercentage = () => {
    return metrics.totalComponents > 0 
      ? Math.round((metrics.healthyComponents / metrics.totalComponents) * 100)
      : 0;
  };

  const getPageTitle = (page: string) => {
    switch (page) {
      case 'dashboard':
      case 'live-dashboard':
        return 'Project Dashboard Overview';
      case 'traceability':
        return 'Traceability Matrix Insights';
      case 'test-results':
        return 'Test Results Overview';
      case 'technical-configuration':
        return 'Tech Stack Overview';
      case 'business-requirements':
        return 'Business Requirements Insights';
      case 'release':
        return 'Release Management Overview';
      case 'squad':
        return 'Squad Performance Metrics';
      case 'environment':
        return 'Environment Status Overview';
      case 'user-management':
        return 'User Management Insights';
      case 'chapter':
        return 'Chapter Management Overview';
      case 'api-docs':
        return 'API Documentation Insights';
      case 'api-test':
        return 'API Testing Overview';
      case 'user-autocomplete-demo':
        return 'User Search System Overview';
      default:
        return 'System Overview';
    }
  };

  const getPageSubtitle = (page: string) => {
    switch (page) {
      case 'dashboard':
      case 'live-dashboard':
        return 'Real-time project health and performance metrics';
      case 'traceability':
        return 'Requirements to test coverage tracking';
      case 'test-results':
        return 'Test execution and quality metrics';
      case 'technical-configuration':
        return 'Technology stack health monitoring';
      case 'business-requirements':
        return 'Requirements analysis and progress tracking';
      case 'release':
        return 'Release pipeline and deployment status';
      case 'squad':
        return 'Team productivity and sprint metrics';
      case 'environment':
        return 'Infrastructure and deployment monitoring';
      case 'user-management':
        return 'User accounts, roles, and access control';
      case 'chapter':
        return 'Chapter governance and member management';
      case 'api-docs':
        return 'API documentation completeness and quality';
      case 'api-test':
        return 'API testing coverage and performance';
      case 'user-autocomplete-demo':
        return 'User search functionality and performance';
      default:
        return 'System health and monitoring dashboard';
    }
  };

  const getMetricLabels = (page: string) => {
    switch (page) {
      case 'traceability':
        return {
          total: 'Total Items',
          health: 'Coverage %',
          security: 'Quality Score',
          coverage: 'Traced %'
        };
      case 'test-results':
        return {
          total: 'Test Cases',
          health: 'Pass Rate',
          security: 'Quality Score',
          coverage: 'Coverage %'
        };
      case 'business-requirements':
        return {
          total: 'Requirements',
          health: 'Completion %',
          security: 'Quality Score',
          coverage: 'Approved %'
        };
      case 'release':
        return {
          total: 'Release Items',
          health: 'Ready %',
          security: 'Quality Score',
          coverage: 'Complete %'
        };
      case 'squad':
        return {
          total: 'Team Members',
          health: 'Velocity %',
          security: 'Performance',
          coverage: 'Sprint Goal %'
        };
      case 'environment':
        return {
          total: 'Environments',
          health: 'Uptime %',
          security: 'Security Score',
          coverage: 'Monitored %'
        };
      case 'user-management':
        return {
          total: 'Total Users',
          health: 'Active %',
          security: 'Security Score',
          coverage: 'Managed %'
        };
      case 'chapter':
        return {
          total: 'Chapters',
          health: 'Active %',
          security: 'Governance Score',
          coverage: 'Compliance %'
        };
      case 'api-docs':
        return {
          total: 'API Endpoints',
          health: 'Documented %',
          security: 'Quality Score',
          coverage: 'Complete %'
        };
      case 'api-test':
        return {
          total: 'Test Cases',
          health: 'Pass Rate %',
          security: 'Quality Score',
          coverage: 'Coverage %'
        };
      case 'user-autocomplete-demo':
        return {
          total: 'Components',
          health: 'Performance %',
          security: 'Quality Score',
          coverage: 'Response %'
        };
      default:
        return {
          total: 'Total Components',
          health: 'Health Score',
          security: 'Security Score',
          coverage: 'Coverage'
        };
    }
  };

  const getSecurityColor = (score: number) => {
    if (score >= 90) return '#4CAF50';
    if (score >= 70) return '#FF9800';
    return '#F44336';
  };

  return (
    <Card 
      sx={{ 
        mb: 3, 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'visible',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
        }
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
              <TrendingUpIcon />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {getPageTitle(currentPage || 'dashboard')}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {getPageSubtitle(currentPage || 'dashboard')}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="View detailed dashboard">
              <IconButton sx={{ color: 'white' }}>
                <ViewIcon />
              </IconButton>
            </Tooltip>
            <IconButton 
              onClick={() => setExpanded(!expanded)}
              sx={{ color: 'white' }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* Quick Metrics */}
        <Grid container spacing={3} sx={{ mb: 2 }}>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center', '&:hover': { transform: 'scale(1.05)' }, transition: 'transform 0.2s' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, animation: 'fadeInUp 0.6s ease' }}>
                {metrics.totalComponents}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {getMetricLabels(currentPage || 'dashboard').total}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center', '&:hover': { transform: 'scale(1.05)' }, transition: 'transform 0.2s' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#4CAF50', animation: 'fadeInUp 0.8s ease' }}>
                {getHealthPercentage()}%
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {getMetricLabels(currentPage || 'dashboard').health}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center', '&:hover': { transform: 'scale(1.05)' }, transition: 'transform 0.2s' }}>
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  color: getSecurityColor(metrics.securityScore),
                  animation: 'fadeInUp 1s ease'
                }}
              >
                {metrics.securityScore}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {getMetricLabels(currentPage || 'dashboard').security}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box sx={{ textAlign: 'center', '&:hover': { transform: 'scale(1.05)' }, transition: 'transform 0.2s' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, animation: 'fadeInUp 1.2s ease' }}>
                {metrics.coverage}%
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {getMetricLabels(currentPage || 'dashboard').coverage}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Health Status Bar */}
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {getMetricLabels(currentPage || 'dashboard').health === 'Health Score' ? 'Component Health' : 
               getMetricLabels(currentPage || 'dashboard').health === 'Pass Rate' ? 'Test Results' :
               getMetricLabels(currentPage || 'dashboard').health === 'Pass Rate %' ? 'API Test Results' :
               getMetricLabels(currentPage || 'dashboard').health === 'Coverage %' ? 'Traceability Coverage' :
               getMetricLabels(currentPage || 'dashboard').health === 'Completion %' ? 'Requirements Progress' :
               getMetricLabels(currentPage || 'dashboard').health === 'Ready %' ? 'Release Readiness' :
               getMetricLabels(currentPage || 'dashboard').health === 'Velocity %' ? 'Team Performance' :
               getMetricLabels(currentPage || 'dashboard').health === 'Uptime %' ? 'Environment Status' :
               getMetricLabels(currentPage || 'dashboard').health === 'Active %' ? 'User Activity' :
               getMetricLabels(currentPage || 'dashboard').health === 'Documented %' ? 'Documentation Status' :
               getMetricLabels(currentPage || 'dashboard').health === 'Performance %' ? 'System Performance' :
               'Overall Status'}
            </Typography>
            <Typography variant="body2">
              {metrics.healthyComponents} Good, {metrics.warningComponents} Warning, {metrics.criticalComponents} Critical
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={getHealthPercentage()} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#4CAF50'
              }
            }} 
          />
        </Box>

        {/* Expandable Details */}
        <Collapse in={expanded}>
          <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.3)' }} />
          
          {/* Category Breakdown */}
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            {currentPage === 'traceability' ? 'Traceability Breakdown' :
             currentPage === 'test-results' ? 'Test Categories' :
             currentPage === 'business-requirements' ? 'Requirements Breakdown' :
             currentPage === 'release' ? 'Release Components' :
             currentPage === 'squad' ? 'Squad Metrics' :
             currentPage === 'environment' ? 'Environment Breakdown' :
             currentPage === 'user-management' ? 'User Management Areas' :
             currentPage === 'chapter' ? 'Chapter Components' :
             currentPage === 'api-docs' ? 'Documentation Areas' :
             currentPage === 'api-test' ? 'Testing Areas' :
             currentPage === 'user-autocomplete-demo' ? 'Search Components' :
             'Component Categories'}
          </Typography>
          <Grid container spacing={2}>
            {categories.map((category, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Card sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                  <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: category.color, 
                          width: 32, 
                          height: 32 
                        }}
                      >
                        {category.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {category.name}
                        </Typography>
                        <Typography variant="caption">
                          {category.count} components
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {category.healthy > 0 && (
                        <Chip 
                          label={category.healthy} 
                          size="small" 
                          sx={{ 
                            bgcolor: '#4CAF50', 
                            color: 'white',
                            fontSize: '0.7rem',
                            height: 20
                          }} 
                        />
                      )}
                      {category.warning > 0 && (
                        <Chip 
                          label={category.warning} 
                          size="small" 
                          sx={{ 
                            bgcolor: '#FF9800', 
                            color: 'white',
                            fontSize: '0.7rem',
                            height: 20
                          }} 
                        />
                      )}
                      {category.critical > 0 && (
                        <Chip 
                          label={category.critical} 
                          size="small" 
                          sx={{ 
                            bgcolor: '#F44336', 
                            color: 'white',
                            fontSize: '0.7rem',
                            height: 20
                          }} 
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Quick Actions */}
          <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Chip 
              icon={<UpdateIcon />}
              label={`${metrics.outdatedComponents} outdated`}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                '& .MuiChip-icon': { color: 'white' }
              }}
            />
            <Chip 
              icon={<SecurityIcon />}
              label="Security Scan"
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                '& .MuiChip-icon': { color: 'white' }
              }}
            />
            <Chip 
              icon={<CodeIcon />}
              label="View All Components"
              onClick={onNavigateToTechStack}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.2)', 
                color: 'white',
                cursor: onNavigateToTechStack ? 'pointer' : 'default',
                '& .MuiChip-icon': { color: 'white' }
              }}
            />
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default TechStackInsights;
