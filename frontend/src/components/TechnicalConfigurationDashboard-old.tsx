import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Fab,
  Alert,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab,
  SelectChangeEvent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Code as CodeIcon,
  Storage as StorageIcon,
  Link as LinkIcon,
  GitHub as GitHubIcon,
  Architecture as ArchitectureIcon,
  Security as SecurityIcon,
  CloudQueue as CloudIcon,
  ExpandMore as ExpandMoreIcon,
  AccountTree as DependencyIcon
} from '@mui/icons-material';

interface TechnicalComponent {
  id: string;
  name: string;
  type: 'Frontend' | 'Backend' | 'Database' | 'Microservice' | 'API Gateway' | 'Message Queue' | 'Cache' | 'CDN';
  technology: string;
  version: string;
  description: string;
  status: 'Active' | 'Deprecated' | 'Development' | 'Testing';
  owner: string;
  repository: GitHubRepository;
  dependencies: ComponentDependency[];
  deploymentInfo: DeploymentInfo;
  securityInfo: SecurityInfo;
  healthStatus: 'Healthy' | 'Warning' | 'Critical' | 'Unknown';
  lastUpdated: string;
}

interface GitHubRepository {
  url: string;
  branch: string;
  lastCommit: string;
  contributors: number;
  language: string;
  size: string;
  issues: number;
  pullRequests: number;
}

interface ComponentDependency {
  id: string;
  name: string;
  version: string;
  type: 'Internal' | 'External' | 'Third-party';
  criticality: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Up-to-date' | 'Outdated' | 'Deprecated' | 'Vulnerable';
  lastChecked: string;
}

interface DeploymentInfo {
  environment: 'Development' | 'Staging' | 'Production';
  containerImage: string;
  namespace: string;
  replicas: number;
  resources: {
    cpu: string;
    memory: string;
  };
  endpoints: string[];
}

interface SecurityInfo {
  vulnerabilities: number;
  securityScore: number;
  lastScan: string;
  compliance: string[];
  certificates: {
    name: string;
    expiryDate: string;
    status: 'Valid' | 'Expiring' | 'Expired';
  }[];
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const TechnicalConfigurationDashboard: React.FC = () => {
  const [components, setComponents] = useState<TechnicalComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<TechnicalComponent | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [filterType, setFilterType] = useState<string>('All');

  useEffect(() => {
    loadComponents();
  }, []);

  const loadComponents = () => {
    // Mock data - in real app, this would come from API
    const mockComponents: TechnicalComponent[] = [
      {
        id: '1',
        name: 'Customer Portal Frontend',
        type: 'Frontend',
        technology: 'React 18.2.0',
        version: '2.1.0',
        description: 'Main customer-facing web application',
        status: 'Active',
        owner: 'Frontend Team',
        repository: {
          url: 'https://github.com/company/customer-portal-frontend',
          branch: 'main',
          lastCommit: '2025-08-12T10:30:00Z',
          contributors: 8,
          language: 'TypeScript',
          size: '45.2 MB',
          issues: 3,
          pullRequests: 2
        },
        dependencies: [
          { id: 'dep1', name: '@mui/material', version: '5.14.5', type: 'External', criticality: 'Medium', status: 'Up-to-date', lastChecked: '2025-08-12' },
          { id: 'dep2', name: 'react-router-dom', version: '6.3.0', type: 'External', criticality: 'High', status: 'Outdated', lastChecked: '2025-08-12' }
        ],
        deploymentInfo: {
          environment: 'Production',
          containerImage: 'customer-portal:v2.1.0',
          namespace: 'customer-services',
          replicas: 3,
          resources: { cpu: '500m', memory: '1Gi' },
          endpoints: ['https://portal.company.com', 'https://portal-api.company.com/health']
        },
        securityInfo: {
          vulnerabilities: 1,
          securityScore: 85,
          lastScan: '2025-08-10',
          compliance: ['SOC2', 'GDPR'],
          certificates: [
            { name: 'portal.company.com', expiryDate: '2025-12-15', status: 'Valid' }
          ]
        },
        healthStatus: 'Healthy',
        lastUpdated: '2025-08-12T15:45:00Z'
      },
      {
        id: '2',
        name: 'User Authentication API',
        type: 'Backend',
        technology: 'Node.js 18.x',
        version: '1.8.2',
        description: 'Microservice handling user authentication and authorization',
        status: 'Active',
        owner: 'Backend Team',
        repository: {
          url: 'https://github.com/company/auth-service',
          branch: 'main',
          lastCommit: '2025-08-11T14:20:00Z',
          contributors: 5,
          language: 'TypeScript',
          size: '28.1 MB',
          issues: 1,
          pullRequests: 1
        },
        dependencies: [
          { id: 'dep3', name: 'express', version: '4.18.2', type: 'External', criticality: 'Critical', status: 'Up-to-date', lastChecked: '2025-08-12' },
          { id: 'dep4', name: 'jsonwebtoken', version: '9.0.0', type: 'External', criticality: 'Critical', status: 'Vulnerable', lastChecked: '2025-08-12' }
        ],
        deploymentInfo: {
          environment: 'Production',
          containerImage: 'auth-service:v1.8.2',
          namespace: 'auth-services',
          replicas: 5,
          resources: { cpu: '1000m', memory: '2Gi' },
          endpoints: ['https://auth-api.company.com', 'https://auth-api.company.com/health']
        },
        securityInfo: {
          vulnerabilities: 3,
          securityScore: 72,
          lastScan: '2025-08-09',
          compliance: ['SOC2', 'PCI-DSS'],
          certificates: [
            { name: 'auth-api.company.com', expiryDate: '2025-11-30', status: 'Valid' }
          ]
        },
        healthStatus: 'Warning',
        lastUpdated: '2025-08-11T14:20:00Z'
      },
      {
        id: '3',
        name: 'Customer Database',
        type: 'Database',
        technology: 'PostgreSQL 15.2',
        version: '15.2',
        description: 'Primary customer data storage',
        status: 'Active',
        owner: 'Data Team',
        repository: {
          url: 'https://github.com/company/database-schemas',
          branch: 'main',
          lastCommit: '2025-08-08T09:15:00Z',
          contributors: 3,
          language: 'SQL',
          size: '12.5 MB',
          issues: 0,
          pullRequests: 0
        },
        dependencies: [
          { id: 'dep5', name: 'postgresql', version: '15.2', type: 'External', criticality: 'Critical', status: 'Up-to-date', lastChecked: '2025-08-12' }
        ],
        deploymentInfo: {
          environment: 'Production',
          containerImage: 'postgres:15.2-alpine',
          namespace: 'data-services',
          replicas: 1,
          resources: { cpu: '2000m', memory: '8Gi' },
          endpoints: ['customer-db.data-services.svc.cluster.local:5432']
        },
        securityInfo: {
          vulnerabilities: 0,
          securityScore: 95,
          lastScan: '2025-08-10',
          compliance: ['SOC2', 'GDPR', 'PCI-DSS'],
          certificates: []
        },
        healthStatus: 'Healthy',
        lastUpdated: '2025-08-08T09:15:00Z'
      }
    ];
    setComponents(mockComponents);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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
      case 'Testing': return 'info';
      case 'Deprecated': return 'error';
      default: return 'default';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'Healthy': return 'success';
      case 'Warning': return 'warning';
      case 'Critical': return 'error';
      case 'Unknown': return 'default';
      default: return 'default';
    }
  };

  const getDependencyStatusColor = (status: string) => {
    switch (status) {
      case 'Up-to-date': return 'success';
      case 'Outdated': return 'warning';
      case 'Vulnerable': return 'error';
      case 'Deprecated': return 'error';
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
              <MenuItem value="Microservice">Microservice</MenuItem>
              <MenuItem value="API Gateway">API Gateway</MenuItem>
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
                  <Typography variant="h4">
                    {components.reduce((acc, c) => acc + c.securityInfo.vulnerabilities, 0)}
                  </Typography>
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
                  <Typography variant="h4">
                    {components.reduce((acc, c) => acc + c.dependencies.filter(d => d.status === 'Vulnerable').length, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Vulnerable Dependencies</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs for different views */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Component Overview" />
          <Tab label="Dependencies" />
          <Tab label="Security Status" />
          <Tab label="Deployment Info" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {/* Components Overview */}
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
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {component.description}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip label={component.type} size="small" />
                    <Chip label={component.status} color={getStatusColor(component.status) as any} size="small" />
                    <Chip label={component.owner} variant="outlined" size="small" />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <List dense>
                    <ListItem>
                      <ListItemIcon><GitHubIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Repository"
                        secondary={
                          <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="caption">{component.repository.language}</Typography>
                            <Chip label={`${component.repository.issues} issues`} size="small" />
                          </Box>
                        }
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><CloudIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Deployment"
                        secondary={`${component.deploymentInfo.environment} • ${component.deploymentInfo.replicas} replicas`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemIcon><SecurityIcon /></ListItemIcon>
                      <ListItemText 
                        primary="Security Score"
                        secondary={`${component.securityInfo.securityScore}/100 • ${component.securityInfo.vulnerabilities} vulnerabilities`}
                      />
                    </ListItem>
                  </List>

                  <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                    <Button size="small" variant="outlined" startIcon={<EditIcon />}>
                      Edit
                    </Button>
                    <Button size="small" variant="outlined" startIcon={<LinkIcon />}>
                      View
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* Dependencies View */}
        <Card>
          <CardHeader title="Dependency Management" />
          <CardContent>
            {filteredComponents.map((component) => (
              <Accordion key={component.id}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Typography variant="h6">{component.name}</Typography>
                    <Chip 
                      label={`${component.dependencies.length} dependencies`} 
                      size="small" 
                    />
                    <Box sx={{ ml: 'auto' }}>
                      <Chip 
                        label={`${component.dependencies.filter(d => d.status === 'Vulnerable').length} vulnerable`}
                        color={component.dependencies.some(d => d.status === 'Vulnerable') ? 'error' : 'success'}
                        size="small"
                      />
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Dependency</TableCell>
                          <TableCell>Version</TableCell>
                          <TableCell>Type</TableCell>
                          <TableCell>Criticality</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Last Checked</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {component.dependencies.map((dep) => (
                          <TableRow key={dep.id}>
                            <TableCell>{dep.name}</TableCell>
                            <TableCell><code>{dep.version}</code></TableCell>
                            <TableCell>{dep.type}</TableCell>
                            <TableCell>
                              <Chip 
                                label={dep.criticality} 
                                color={dep.criticality === 'Critical' ? 'error' : dep.criticality === 'High' ? 'warning' : 'default'} 
                                size="small" 
                              />
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label={dep.status} 
                                color={getDependencyStatusColor(dep.status) as any} 
                                size="small" 
                              />
                            </TableCell>
                            <TableCell>{dep.lastChecked}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {/* Security Status */}
        <Grid container spacing={3}>
          {filteredComponents.map((component) => (
            <Grid item xs={12} md={6} key={component.id}>
              <Card>
                <CardHeader 
                  title={component.name}
                  subheader={`Security Score: ${component.securityInfo.securityScore}/100`}
                  action={
                    <Chip 
                      label={component.securityInfo.vulnerabilities > 0 ? 'Has Issues' : 'Secure'} 
                      color={component.securityInfo.vulnerabilities > 0 ? 'error' : 'success'} 
                      size="small" 
                    />
                  }
                />
                <CardContent>
                  <Alert 
                    severity={component.securityInfo.vulnerabilities > 0 ? 'warning' : 'success'}
                    sx={{ mb: 2 }}
                  >
                    {component.securityInfo.vulnerabilities} vulnerabilities found
                  </Alert>

                  <Typography variant="subtitle2" gutterBottom>Compliance</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    {component.securityInfo.compliance.map((compliance) => (
                      <Chip key={compliance} label={compliance} color="primary" size="small" />
                    ))}
                  </Box>

                  {component.securityInfo.certificates.length > 0 && (
                    <>
                      <Typography variant="subtitle2" gutterBottom>Certificates</Typography>
                      <List dense>
                        {component.securityInfo.certificates.map((cert, index) => (
                          <ListItem key={index}>
                            <ListItemText 
                              primary={cert.name}
                              secondary={`Expires: ${cert.expiryDate}`}
                            />
                            <Chip 
                              label={cert.status} 
                              color={cert.status === 'Valid' ? 'success' : cert.status === 'Expiring' ? 'warning' : 'error'} 
                              size="small" 
                            />
                          </ListItem>
                        ))}
                      </List>
                    </>
                  )}

                  <Typography variant="caption" color="text.secondary">
                    Last scan: {component.securityInfo.lastScan}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        {/* Deployment Information */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Component</TableCell>
                <TableCell>Environment</TableCell>
                <TableCell>Container Image</TableCell>
                <TableCell>Namespace</TableCell>
                <TableCell>Replicas</TableCell>
                <TableCell>Resources</TableCell>
                <TableCell>Endpoints</TableCell>
                <TableCell>Health</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredComponents.map((component) => (
                <TableRow key={component.id}>
                  <TableCell>
                    <Box>
                      <Typography variant="subtitle2">{component.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {component.version}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{component.deploymentInfo.environment}</TableCell>
                  <TableCell>
                    <code style={{ fontSize: '0.8rem' }}>
                      {component.deploymentInfo.containerImage}
                    </code>
                  </TableCell>
                  <TableCell>{component.deploymentInfo.namespace}</TableCell>
                  <TableCell>{component.deploymentInfo.replicas}</TableCell>
                  <TableCell>
                    <Typography variant="caption">
                      CPU: {component.deploymentInfo.resources.cpu}<br/>
                      Memory: {component.deploymentInfo.resources.memory}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {component.deploymentInfo.endpoints.map((endpoint, index) => (
                      <Typography key={index} variant="caption" display="block">
                        {endpoint}
                      </Typography>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={component.healthStatus} 
                      color={getHealthColor(component.healthStatus) as any} 
                      size="small" 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Floating Action Button */}
      <Fab 
        color="primary" 
        aria-label="add"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default TechnicalConfigurationDashboard;
