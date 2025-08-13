import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  IconButton
} from '@mui/material';
import {
  Groups,
  Computer,
  Assessment,
  CloudUpload,
  Settings,
  Business,
  Group,
  Person,
  TrendingUp,
  Security,
  Speed,
  Timeline,
  Refresh
} from '@mui/icons-material';

interface DashboardMetrics {
  totalProjects: number;
  totalUsers: number;
  totalSquads: number;
  totalEnvironments: number;
  totalReleases: number;
  totalChapters: number;
  testCoverage: number;
  successRate: number;
  apiEndpoints: number;
  documentationPages: number;
  recentActivities: Array<{
    type: string;
    user: string;
    action: string;
    timestamp: string;
  }>;
  systemHealth: {
    cpu: number;
    memory: number;
    storage: number;
    network: number;
  };
}

const Dashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalProjects: 12,
    totalUsers: 45,
    totalSquads: 8,
    totalEnvironments: 6,
    totalReleases: 23,
    totalChapters: 15,
    testCoverage: 85,
    successRate: 92,
    apiEndpoints: 124,
    documentationPages: 67,
    recentActivities: [
      { type: 'Project', user: 'John Doe', action: 'Created new project "API Gateway"', timestamp: '2 minutes ago' },
      { type: 'Release', user: 'Jane Smith', action: 'Deployed release v2.1.0', timestamp: '15 minutes ago' },
      { type: 'User', user: 'Mike Johnson', action: 'Updated user permissions', timestamp: '1 hour ago' },
      { type: 'Test', user: 'Sarah Wilson', action: 'Test coverage improved to 85%', timestamp: '2 hours ago' },
      { type: 'Squad', user: 'Tom Brown', action: 'Added new team member to Alpha Squad', timestamp: '4 hours ago' }
    ],
    systemHealth: {
      cpu: 72,
      memory: 68,
      storage: 45,
      network: 90
    }
  });

  const [loading, setLoading] = useState(false);

  const loadDashboardData = () => {
    setLoading(true);
    // Simulate loading time
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const refreshData = () => {
    loadDashboardData();
  };

  // Simple CSS-based chart components
  const SimpleBarChart: React.FC<{ data: Array<{name: string, value: number, color: string}>, title: string }> = ({ data, title }) => (
    <Card className="h-80">
      <CardContent>
        <Typography variant="h6" className="mb-4 text-slate-700 font-semibold">
          {title}
        </Typography>
        <Box className="space-y-3">
          {data.map((item, index) => (
            <Box key={index} className="flex items-center space-x-3">
              <Typography variant="body2" className="w-20 text-sm text-slate-600">
                {item.name}
              </Typography>
              <Box className="flex-1 bg-slate-200 rounded-full h-4 relative overflow-hidden">
                <Box
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{
                    width: `${(item.value / Math.max(...data.map(d => d.value))) * 100}%`,
                    backgroundColor: item.color
                  }}
                />
              </Box>
              <Typography variant="body2" className="w-12 text-sm font-medium text-slate-700">
                {item.value}
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );

  const SimplePieChart: React.FC<{ data: Array<{name: string, value: number, color: string}>, title: string }> = ({ data, title }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <Card className="h-80">
        <CardContent>
          <Typography variant="h6" className="mb-4 text-slate-700 font-semibold">
            {title}
          </Typography>
          <Box className="flex items-center justify-center h-40">
            <Box className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />
                {data.map((item, index) => {
                  const percentage = (item.value / total) * 100;
                  const offset = data.slice(0, index).reduce((sum, d) => sum + (d.value / total) * 100, 0);
                  return (
                    <circle
                      key={index}
                      cx="18"
                      cy="18"
                      r="16"
                      fill="none"
                      stroke={item.color}
                      strokeWidth="2"
                      strokeDasharray={`${percentage} ${100 - percentage}`}
                      strokeDashoffset={-offset}
                      className="transition-all duration-500"
                    />
                  );
                })}
              </svg>
            </Box>
          </Box>
          <Box className="space-y-2 mt-4">
            {data.map((item, index) => (
              <Box key={index} className="flex items-center justify-between">
                <Box className="flex items-center space-x-2">
                  <Box
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <Typography variant="body2" className="text-slate-600">
                    {item.name}
                  </Typography>
                </Box>
                <Typography variant="body2" className="font-medium text-slate-700">
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  };

  const StatCard: React.FC<{ title: string; value: number; icon: React.ReactNode; color: string; subtitle?: string }> = 
    ({ title, value, icon, color, subtitle }) => (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-6">
        <Box className="flex items-center justify-between">
          <Box>
            <Typography variant="h4" className="font-bold mb-1" style={{ color }}>
              {value}
            </Typography>
            <Typography variant="body1" className="text-slate-600 font-medium">
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" className="text-slate-500 mt-1">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
            {React.cloneElement(icon as React.ReactElement, { 
              style: { color, fontSize: 32 } 
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <Box className="text-center">
          <Typography variant="h5" className="mb-4 text-slate-600">
            Loading Dashboard...
          </Typography>
          <LinearProgress className="w-64" />
        </Box>
      </Box>
    );
  }

  return (
    <Box className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <Box className="max-w-7xl mx-auto">
        {/* Header */}
        <Box className="flex justify-between items-center mb-8">
          <Box>
            <Typography variant="h3" className="font-bold text-slate-800 mb-2">
              Project Dashboard
            </Typography>
            <Typography variant="body1" className="text-slate-600">
              Welcome back! Here's what's happening with your projects today.
            </Typography>
          </Box>
          <IconButton 
            onClick={refreshData}
            className="bg-blue-500 text-white hover:bg-blue-600"
            size="large"
          >
            <Refresh />
          </IconButton>
        </Box>

        {/* Key Metrics */}
        <Grid container spacing={4} className="mb-8">
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Projects"
              value={metrics.totalProjects}
              icon={<Business />}
              color="#3b82f6"
              subtitle="Active projects"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Team Members"
              value={metrics.totalUsers}
              icon={<Groups />}
              color="#10b981"
              subtitle="Active users"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Success Rate"
              value={metrics.successRate}
              icon={<TrendingUp />}
              color="#f59e0b"
              subtitle="% deployment success"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Test Coverage"
              value={metrics.testCoverage}
              icon={<Assessment />}
              color="#8b5cf6"
              subtitle="% code coverage"
            />
          </Grid>
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={4} className="mb-8">
          <Grid item xs={12} md={6}>
            <SimpleBarChart
              title="Project Distribution by Type"
              data={[
                { name: 'Web Apps', value: 8, color: '#3b82f6' },
                { name: 'APIs', value: 6, color: '#10b981' },
                { name: 'Mobile', value: 4, color: '#f59e0b' },
                { name: 'Desktop', value: 3, color: '#8b5cf6' }
              ]}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <SimplePieChart
              title="Squad Distribution"
              data={[
                { name: 'Alpha Squad', value: 12, color: '#3b82f6' },
                { name: 'Beta Squad', value: 10, color: '#10b981' },
                { name: 'Gamma Squad', value: 8, color: '#f59e0b' },
                { name: 'Delta Squad', value: 15, color: '#8b5cf6' }
              ]}
            />
          </Grid>
        </Grid>

        {/* System Health and Activity */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Card className="h-96">
              <CardContent>
                <Typography variant="h6" className="mb-4 text-slate-700 font-semibold">
                  System Health
                </Typography>
                <Box className="space-y-4">
                  {Object.entries(metrics.systemHealth).map(([key, value]) => (
                    <Box key={key}>
                      <Box className="flex justify-between items-center mb-2">
                        <Typography variant="body2" className="text-slate-600 capitalize">
                          {key}
                        </Typography>
                        <Typography variant="body2" className="font-medium text-slate-700">
                          {value}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={value}
                        className="h-2 rounded-full"
                        sx={{
                          backgroundColor: '#e5e7eb',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: value > 80 ? '#10b981' : value > 60 ? '#f59e0b' : '#ef4444',
                            borderRadius: '4px'
                          }
                        }}
                      />
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card className="h-96">
              <CardContent>
                <Typography variant="h6" className="mb-4 text-slate-700 font-semibold">
                  Recent Activity
                </Typography>
                <List className="max-h-64 overflow-y-auto">
                  {metrics.recentActivities.map((activity, index) => (
                    <Box key={index}>
                      <ListItem className="px-0">
                        <ListItemIcon>
                          <Avatar className="w-8 h-8" style={{ backgroundColor: '#3b82f6' }}>
                            {activity.user.split(' ').map(n => n[0]).join('')}
                          </Avatar>
                        </ListItemIcon>
                        <ListItemText
                          primary={activity.action}
                          secondary={activity.timestamp}
                          primaryTypographyProps={{ className: 'text-sm text-slate-700' }}
                          secondaryTypographyProps={{ className: 'text-xs text-slate-500' }}
                        />
                        <Chip
                          label={activity.type}
                          size="small"
                          className="ml-2"
                          style={{ backgroundColor: '#e0f2fe', color: '#0277bd' }}
                        />
                      </ListItem>
                      {index < metrics.recentActivities.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Additional Metrics */}
        <Grid container spacing={4} className="mt-4">
          <Grid item xs={12} md={4}>
            <StatCard
              title="API Endpoints"
              value={metrics.apiEndpoints}
              icon={<Computer />}
              color="#06b6d4"
              subtitle="Total endpoints"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Documentation"
              value={metrics.documentationPages}
              icon={<CloudUpload />}
              color="#84cc16"
              subtitle="Pages available"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <StatCard
              title="Environments"
              value={metrics.totalEnvironments}
              icon={<Settings />}
              color="#f97316"
              subtitle="Active environments"
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
