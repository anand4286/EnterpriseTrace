import React, { useState } from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Avatar,
  SelectChangeEvent
} from '@mui/material';
import {
  Add as AddIcon,
  Code as CodeIcon,
  GitHub as GitHubIcon,
  Security as SecurityIcon,
  AccountTree as DependencyIcon
} from '@mui/icons-material';

interface TechnicalComponent {
  id: string;
  name: string;
  type: 'Frontend' | 'Backend' | 'Database' | 'Microservice';
  technology: string;
  version: string;
  status: 'Active' | 'Deprecated' | 'Development';
  healthStatus: 'Healthy' | 'Warning' | 'Critical';
}

const TechnicalConfigurationDashboard: React.FC = () => {
  const [filterType, setFilterType] = useState<string>('All');

  const components: TechnicalComponent[] = [
    {
      id: '1',
      name: 'Customer Portal Frontend',
      type: 'Frontend',
      technology: 'React 18.2.0',
      version: '2.1.0',
      status: 'Active',
      healthStatus: 'Healthy'
    },
    {
      id: '2',
      name: 'User Authentication API',
      type: 'Backend',
      technology: 'Node.js 18.x',
      version: '1.8.2',
      status: 'Active',
      healthStatus: 'Warning'
    }
  ];

  const handleFilterChange = (event: SelectChangeEvent) => {
    setFilterType(event.target.value as string);
  };

  const filteredComponents = filterType === 'All' 
    ? components 
    : components.filter(c => c.type === filterType);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'success';
      case 'Development': return 'warning';
      case 'Deprecated': return 'error';
      default: return 'default';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'Healthy': return 'success';
      case 'Warning': return 'warning';
      case 'Critical': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Tech Stack Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Filter by Type</InputLabel>
            <Select value={filterType} onChange={handleFilterChange} label="Filter by Type">
              <MenuItem value="All">All Components</MenuItem>
              <MenuItem value="Frontend">Frontend</MenuItem>
              <MenuItem value="Backend">Backend</MenuItem>
              <MenuItem value="Database">Database</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" startIcon={<AddIcon />}>
            Add Component
          </Button>
        </Box>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <CodeIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">{components.length}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Components</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <GitHubIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">{components.length}</Typography>
                  <Typography variant="body2" color="text.secondary">GitHub Repositories</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <SecurityIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">4</Typography>
                  <Typography variant="body2" color="text.secondary">Security Issues</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <DependencyIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">2</Typography>
                  <Typography variant="body2" color="text.secondary">Vulnerable Dependencies</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Components Grid */}
      <Grid container spacing={3}>
        {filteredComponents.map((component) => (
          <Grid item xs={12} md={6} lg={4} key={component.id}>
            <Card>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: getStatusColor(component.status) + '.main' }}>
                    <CodeIcon />
                  </Avatar>
                }
                title={component.name}
                subheader={`${component.technology} • ${component.version}`}
                action={
                  <Chip 
                    label={component.healthStatus} 
                    color={getHealthColor(component.healthStatus) as any} 
                    size="small" 
                  />
                }
              />
              <CardContent>
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip label={component.type} size="small" />
                  <Chip label={component.status} color={getStatusColor(component.status) as any} size="small" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TechnicalConfigurationDashboard;
