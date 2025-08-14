import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip,
  Fab,
  alpha,
  useTheme,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Tooltip,
  Badge,
  CircularProgress
} from '@mui/material';
import {
  Timeline,
  TrendingUp,
  Speed,
  Computer,
  CheckCircle,
  BugReport,
  CloudUpload,
  Code,
  Business,
  Engineering,
  Group,
  Cloud,
  Assignment,
  Quiz,
  Rocket,
  Category,
  Warning,
  Error,
  Schedule
} from '@mui/icons-material';
import config from '../utils/config';

// Consolidated dashboard data interfaces
interface DashboardSnapshot {
  businessRequirements: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    onHoldProjects: number;
    totalBudget: number;
    highPriorityProjects: number;
  };
  techStack: {
    totalComponents: number;
    healthyComponents: number;
    warningComponents: number;
    criticalComponents: number;
    activeCategories: number;
  };
  releases: {
    totalReleases: number;
    inDevelopment: number;
    inTesting: number;
    ready: number;
    released: number;
    averageProgress: number;
  };
  squads: {
    totalSquads: number;
    activeSquads: number;
    totalMembers: number;
    availableMembers: number;
  };
  environments: {
    totalEnvironments: number;
    availableEnvironments: number;
    bookedEnvironments: number;
    errorEnvironments: number;
  };
  traceability: {
    totalUserJourneys: number;
    approvedJourneys: number;
    totalScenarios: number;
    linkedTestCases: number;
    coveragePercentage: number;
  };
  testResults: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    skippedTests: number;
    passRate: number;
    lastRunTime: string;
  };
  recentActivities: Array<{
    id: string;
    type: 'project' | 'release' | 'test' | 'environment' | 'squad';
    action: string;
    user: string;
    timestamp: string;
    status: 'success' | 'warning' | 'error';
  }>;
}

const LiveProjectDashboard: React.FC = () => {
  const theme = useTheme();
  const [dashboardData, setDashboardData] = useState<DashboardSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from localStorage and component sources
  const fetchDashboardData = async (): Promise<DashboardSnapshot> => {
    try {
      // Fetch Business Requirements data
      const businessProjects = JSON.parse(localStorage.getItem('businessRequirements_projects') || '[]');
      const businessRequirements = {
        totalProjects: businessProjects.length,
        activeProjects: businessProjects.filter((p: any) => p.status === 'In Progress').length,
        completedProjects: businessProjects.filter((p: any) => p.status === 'Completed').length,
        onHoldProjects: businessProjects.filter((p: any) => p.status === 'On Hold').length,
        totalBudget: businessProjects.reduce((sum: number, p: any) => sum + (p.budget || 0), 0),
        highPriorityProjects: businessProjects.filter((p: any) => p.priority === 'High' || p.priority === 'Critical').length,
      };

      // Fetch Tech Stack data
      const techStackItems = JSON.parse(localStorage.getItem('techStackItems') || '[]');
      const techStackCategories = JSON.parse(localStorage.getItem('techStackCategories') || '[]');
      const techStack = {
        totalComponents: techStackItems.length,
        healthyComponents: techStackItems.filter((item: any) => item.healthStatus === 'Healthy').length,
        warningComponents: techStackItems.filter((item: any) => item.healthStatus === 'Warning').length,
        criticalComponents: techStackItems.filter((item: any) => item.healthStatus === 'Critical').length,
        activeCategories: techStackCategories.length,
      };

      // Fetch Squads data
      const squadsData = JSON.parse(localStorage.getItem('squads') || '[]');
      const squads = {
        totalSquads: squadsData.length,
        activeSquads: squadsData.filter((s: any) => s.status === 'active').length,
        totalMembers: squadsData.reduce((sum: number, s: any) => 
          sum + (s.engineers?.length || 0) + (s.testers?.length || 0) + (s.analysts?.length || 0) + 
          (s.journeyExperts?.length || 0) + (s.productOwner ? 1 : 0) + (s.releaseLead ? 1 : 0), 0),
        availableMembers: squadsData.reduce((sum: number, s: any) => 
          sum + (s.engineers?.filter((m: any) => m.status === 'active').length || 0), 0),
      };

      // Fetch Environments data
      const environmentsData = JSON.parse(localStorage.getItem('environments') || '[]');
      const environments = {
        totalEnvironments: environmentsData.length,
        availableEnvironments: environmentsData.filter((env: any) => env.status === 'available').length,
        bookedEnvironments: environmentsData.filter((env: any) => env.status === 'booked').length,
        errorEnvironments: environmentsData.filter((env: any) => env.status === 'error').length,
      };

      // Fetch Traceability data
      const userJourneys = JSON.parse(localStorage.getItem('userJourneys') || '[]');
      const businessScenarios = JSON.parse(localStorage.getItem('businessScenarios') || '[]');
      const testCases = JSON.parse(localStorage.getItem('testCases') || '[]');
      const traceability = {
        totalUserJourneys: userJourneys.length,
        approvedJourneys: userJourneys.filter((uj: any) => uj.status === 'Approved').length,
        totalScenarios: businessScenarios.length,
        linkedTestCases: testCases.filter((tc: any) => tc.businessScenario).length,
        coveragePercentage: businessScenarios.length > 0 ? 
          Math.round((testCases.filter((tc: any) => tc.businessScenario).length / businessScenarios.length) * 100) : 0,
      };

      // Mock releases data (since it's not stored in localStorage in the current implementation)
      const releases = {
        totalReleases: 4,
        inDevelopment: 2,
        inTesting: 1,
        ready: 1,
        released: 0,
        averageProgress: 65,
      };

      // Mock test results data
      const testResults = {
        totalTests: 45,
        passedTests: 38,
        failedTests: 5,
        skippedTests: 2,
        passRate: 84.4,
        lastRunTime: new Date(Date.now() - 30 * 60000).toLocaleTimeString(),
      };

      // Generate recent activities
      const recentActivities = [
        {
          id: '1',
          type: 'project' as const,
          action: 'Customer Portal Redesign updated to In Progress',
          user: 'John Doe',
          timestamp: new Date(Date.now() - 5 * 60000).toLocaleTimeString(),
          status: 'success' as const,
        },
        {
          id: '2',
          type: 'test' as const,
          action: 'API integration tests completed successfully',
          user: 'Jane Smith',
          timestamp: new Date(Date.now() - 15 * 60000).toLocaleTimeString(),
          status: 'success' as const,
        },
        {
          id: '3',
          type: 'environment' as const,
          action: 'Production environment health check failed',
          user: 'Mike Johnson',
          timestamp: new Date(Date.now() - 30 * 60000).toLocaleTimeString(),
          status: 'error' as const,
        },
        {
          id: '4',
          type: 'release' as const,
          action: 'Mobile App v2.1 moved to testing phase',
          user: 'Sarah Wilson',
          timestamp: new Date(Date.now() - 45 * 60000).toLocaleTimeString(),
          status: 'success' as const,
        },
        {
          id: '5',
          type: 'squad' as const,
          action: 'New developer added to Frontend Squad',
          user: 'Admin User',
          timestamp: new Date(Date.now() - 60 * 60000).toLocaleTimeString(),
          status: 'success' as const,
        },
      ];

      return {
        businessRequirements,
        techStack,
        releases,
        squads,
        environments,
        traceability,
        testResults,
        recentActivities,
      };
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchDashboardData();
        setDashboardData(data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data loading error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project': return <Business />;
      case 'release': return <Rocket />;
      case 'test': return <Quiz />;
      case 'environment': return <Cloud />;
      case 'squad': return <Group />;
      default: return <Timeline />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case 'success': return theme.palette.success.main;
      case 'error': return theme.palette.error.main;
      case 'warning': return theme.palette.warning.main;
      default: return theme.palette.info.main;
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px'
      }}>
        <CircularProgress size={60} />
        <Typography sx={{ mt: 2, color: 'text.secondary' }}>
          Loading dashboard data...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error" variant="h6">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      p: 3,
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ 
          color: 'white',
          fontWeight: 700,
          mb: 1,
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          Enterprise Dashboard - Live Snapshot
        </Typography>
        <Typography variant="subtitle1" sx={{ 
          color: 'rgba(255, 255, 255, 0.8)',
          mb: 2
        }}>
          Real-time consolidated view across all business functions
        </Typography>
        <Chip
          icon={<TrendingUp />}
          label="System Operational"
          color="success"
          sx={{ bgcolor: 'rgba(76, 175, 80, 0.9)' }}
        />
      </Box>

      <Grid container spacing={3}>
        {/* Business Requirements Overview */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  borderRadius: '50%',
                  p: 1,
                  mr: 2
                }}>
                  <Business color="primary" />
                </Box>
                <Typography variant="h6">Business Projects</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {dashboardData?.businessRequirements.totalProjects || 0}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip label={`${dashboardData?.businessRequirements.activeProjects || 0} Active`} size="small" color="primary" />
                <Chip label={`${dashboardData?.businessRequirements.completedProjects || 0} Done`} size="small" color="success" />
                <Chip label={`${dashboardData?.businessRequirements.onHoldProjects || 0} On Hold`} size="small" color="warning" />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Total Budget: ${(dashboardData?.businessRequirements.totalBudget || 0).toLocaleString()}K
              </Typography>
              <Typography variant="body2" color="error">
                {dashboardData?.businessRequirements.highPriorityProjects || 0} High Priority
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Tech Stack Health */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  borderRadius: '50%',
                  p: 1,
                  mr: 2
                }}>
                  <Engineering color="success" />
                </Box>
                <Typography variant="h6">Tech Stack</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {dashboardData?.techStack.totalComponents || 0}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip label={`${dashboardData?.techStack.healthyComponents || 0} Healthy`} size="small" color="success" />
                <Chip label={`${dashboardData?.techStack.warningComponents || 0} Warning`} size="small" color="warning" />
                <Chip label={`${dashboardData?.techStack.criticalComponents || 0} Critical`} size="small" color="error" />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {dashboardData?.techStack.activeCategories || 0} Active Categories
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Release Management */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  bgcolor: alpha(theme.palette.info.main, 0.1),
                  borderRadius: '50%',
                  p: 1,
                  mr: 2
                }}>
                  <Rocket color="info" />
                </Box>
                <Typography variant="h6">Releases</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {dashboardData?.releases.totalReleases || 0}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip label={`${dashboardData?.releases.inDevelopment || 0} Dev`} size="small" color="primary" />
                <Chip label={`${dashboardData?.releases.inTesting || 0} Test`} size="small" color="warning" />
                <Chip label={`${dashboardData?.releases.ready || 0} Ready`} size="small" color="success" />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">Avg Progress:</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={dashboardData?.releases.averageProgress || 0}
                  sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {dashboardData?.releases.averageProgress || 0}%
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Squad Management */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  bgcolor: alpha(theme.palette.secondary.main, 0.1),
                  borderRadius: '50%',
                  p: 1,
                  mr: 2
                }}>
                  <Group color="secondary" />
                </Box>
                <Typography variant="h6">Squads</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {dashboardData?.squads.totalSquads || 0}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip label={`${dashboardData?.squads.activeSquads || 0} Active`} size="small" color="secondary" />
                <Chip label={`${dashboardData?.squads.totalMembers || 0} Members`} size="small" color="default" />
              </Box>
              <Typography variant="body2" color="text.secondary">
                {dashboardData?.squads.availableMembers || 0} Available Members
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Environment Status */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  bgcolor: alpha(theme.palette.primary.main, 0.1),
                  borderRadius: '50%',
                  p: 1,
                  mr: 2
                }}>
                  <Cloud color="primary" />
                </Box>
                <Typography variant="h6">Environments</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {dashboardData?.environments.totalEnvironments || 0}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip label={`${dashboardData?.environments.availableEnvironments || 0} Available`} size="small" color="success" />
                <Chip label={`${dashboardData?.environments.bookedEnvironments || 0} Booked`} size="small" color="warning" />
                <Chip label={`${dashboardData?.environments.errorEnvironments || 0} Error`} size="small" color="error" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Test Results */}
        <Grid item xs={12} md={6} lg={4}>
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  bgcolor: alpha(theme.palette.success.main, 0.1),
                  borderRadius: '50%',
                  p: 1,
                  mr: 2
                }}>
                  <Quiz color="success" />
                </Box>
                <Typography variant="h6">Test Results</Typography>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
                {dashboardData?.testResults.totalTests || 0}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                <Chip label={`${dashboardData?.testResults.passedTests || 0} Passed`} size="small" color="success" />
                <Chip label={`${dashboardData?.testResults.failedTests || 0} Failed`} size="small" color="error" />
                <Chip label={`${dashboardData?.testResults.skippedTests || 0} Skipped`} size="small" color="default" />
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2" color="text.secondary">Pass Rate:</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={dashboardData?.testResults.passRate || 0}
                  color="success"
                  sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {dashboardData?.testResults.passRate?.toFixed(1) || 0}%
                </Typography>
              </Box>
              <Typography variant="caption" color="text.secondary">
                Last run: {dashboardData?.testResults.lastRunTime}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Traceability Coverage */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  bgcolor: alpha(theme.palette.warning.main, 0.1),
                  borderRadius: '50%',
                  p: 1,
                  mr: 2
                }}>
                  <Assignment color="warning" />
                </Box>
                <Typography variant="h6">Traceability Matrix</Typography>
              </Box>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">User Journeys</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {dashboardData?.traceability.totalUserJourneys || 0}
                  </Typography>
                  <Typography variant="body2" color="success.main">
                    {dashboardData?.traceability.approvedJourneys || 0} Approved
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">Test Coverage</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    {dashboardData?.traceability.coveragePercentage || 0}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {dashboardData?.traceability.linkedTestCases || 0}/{dashboardData?.traceability.totalScenarios || 0} Linked
                  </Typography>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={dashboardData?.traceability.coveragePercentage || 0}
                  color="warning"
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card sx={{ 
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
          }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Timeline color="primary" />
                Recent Activities
              </Typography>
              
              <List sx={{ p: 0 }}>
                {dashboardData?.recentActivities.slice(0, 5).map((activity, index) => (
                  <React.Fragment key={activity.id}>
                    <ListItem sx={{ px: 0 }}>
                      <Box sx={{ 
                        color: getActivityColor(activity.status),
                        mr: 2,
                        mt: 0.5
                      }}>
                        {getActivityIcon(activity.type)}
                      </Box>
                      <ListItemText
                        primary={
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {activity.action}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="caption" color="text.secondary">
                            {activity.user} • {activity.timestamp}
                          </Typography>
                        }
                      />
                      <Chip 
                        size="small" 
                        label={activity.status} 
                        color={activity.status === 'success' ? 'success' : 
                               activity.status === 'error' ? 'error' : 'warning'}
                        variant="outlined"
                      />
                    </ListItem>
                    {index < (dashboardData?.recentActivities.length || 0) - 1 && index < 4 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          animation: 'float 3s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-10px)' }
          }
        }}
        onClick={() => window.open(config.buildApiUrl('/api-docs'), '_blank')}
      >
        <Computer />
      </Fab>
    </Box>
  );
};

export default LiveProjectDashboard;
