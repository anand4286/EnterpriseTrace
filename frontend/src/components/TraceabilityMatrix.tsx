import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Avatar,
  AvatarGroup,
  Tooltip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab,
  Badge
} from '@mui/material';
import {
  AccountTree as TraceabilityIcon,
  Person as PersonaIcon,
  Assignment as ScenarioIcon,
  BugReport as TestCaseIcon,
  Link as LinkIcon,
  GitHub as GitHubIcon,
  Description as ConfluenceIcon,
  Task as JiraIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Warning as WarningIcon,
  ExpandMore as ExpandMoreIcon,
  PlayArrow as RunTestIcon,
  Code as TechStackIcon,
  Devices as ChannelIcon,
  Timeline as TimelineIcon
} from '@mui/icons-material';
import { config } from '../utils/config';

// Type definitions
interface UserJourney {
  id: string;
  title: string;
  description: string;
  persona: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Draft' | 'Review' | 'Approved' | 'Deprecated';
  businessScenarios: string[]; // IDs of linked scenarios
  createdDate: string;
  owner: string;
  tags: string[];
  jiraLink?: string;
  confluenceLink?: string;
}

interface BusinessScenario {
  id: string;
  title: string;
  description: string;
  userJourneyId: string;
  acceptanceCriteria: AcceptanceCriteria[];
  testCases: string[]; // IDs of linked test cases
  priority: 'High' | 'Medium' | 'Low';
  status: 'Draft' | 'Review' | 'Approved' | 'In Progress' | 'Completed';
  techStack: string[];
  channels: string[];
  owner: string;
  jiraTicket?: string;
  confluenceLink?: string;
}

interface AcceptanceCriteria {
  id: string;
  description: string;
  status: 'Pending' | 'Completed' | 'Failed';
}

interface TestCase {
  id: string;
  title: string;
  description: string;
  businessScenarioId: string;
  type: 'Unit' | 'Integration' | 'E2E' | 'Manual' | 'API' | 'UI';
  automationStatus: 'Manual' | 'Automated' | 'Semi-Automated';
  status: 'Draft' | 'Ready' | 'In Progress' | 'Passed' | 'Failed' | 'Blocked';
  priority: 'High' | 'Medium' | 'Low';
  assignee: string;
  lastExecuted?: string;
  executionResult?: 'Pass' | 'Fail' | 'Skip';
  githubLink?: string;
  defects: Defect[];
  techStack: string[];
  channels: string[];
}

interface Defect {
  id: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  jiraTicket: string;
  assignee: string;
}

// Mock data
const mockUserJourneys: UserJourney[] = [
  {
    id: '1',
    title: 'User Registration and Onboarding',
    description: 'Complete user registration flow from sign-up to profile completion',
    persona: 'New User',
    priority: 'High',
    status: 'Approved',
    businessScenarios: ['1', '2'],
    createdDate: '2024-08-01',
    owner: 'Product Team',
    tags: ['Authentication', 'Onboarding'],
    jiraLink: 'PROJ-123',
    confluenceLink: 'https://confluence.company.com/user-journeys/registration'
  },
  {
    id: '2',
    title: 'E-commerce Purchase Flow',
    description: 'End-to-end purchase experience from product selection to order confirmation',
    persona: 'Customer',
    priority: 'High',
    status: 'Approved',
    businessScenarios: ['3', '4', '5'],
    createdDate: '2024-08-05',
    owner: 'E-commerce Team',
    tags: ['Purchase', 'Payment'],
    jiraLink: 'PROJ-456',
    confluenceLink: 'https://confluence.company.com/user-journeys/purchase'
  }
];

const mockBusinessScenarios: BusinessScenario[] = [
  {
    id: '1',
    title: 'Email Registration',
    description: 'User registers using email and password',
    userJourneyId: '1',
    acceptanceCriteria: [
      { id: '1', description: 'User can enter valid email address', status: 'Completed' },
      { id: '2', description: 'Password meets security requirements', status: 'Completed' },
      { id: '3', description: 'Email verification sent successfully', status: 'Completed' }
    ],
    testCases: ['1', '2', '3'],
    priority: 'High',
    status: 'Completed',
    techStack: ['React', 'Node.js', 'PostgreSQL'],
    channels: ['Web', 'Mobile'],
    owner: 'Dev Team A',
    jiraTicket: 'PROJ-124',
    confluenceLink: 'https://confluence.company.com/scenarios/email-registration'
  },
  {
    id: '2',
    title: 'Profile Setup',
    description: 'User completes profile information after registration',
    userJourneyId: '1',
    acceptanceCriteria: [
      { id: '4', description: 'User can upload profile picture', status: 'Completed' },
      { id: '5', description: 'Personal information form validation', status: 'Pending' }
    ],
    testCases: ['4', '5'],
    priority: 'Medium',
    status: 'In Progress',
    techStack: ['React', 'AWS S3'],
    channels: ['Web', 'Mobile'],
    owner: 'Dev Team B',
    jiraTicket: 'PROJ-125'
  }
];

const mockTestCases: TestCase[] = [
  {
    id: '1',
    title: 'Valid Email Registration',
    description: 'Test successful registration with valid email and password',
    businessScenarioId: '1',
    type: 'E2E',
    automationStatus: 'Automated',
    status: 'Passed',
    priority: 'High',
    assignee: 'QA Team',
    lastExecuted: '2024-08-13',
    executionResult: 'Pass',
    githubLink: 'https://github.com/company/tests/registration.spec.ts',
    defects: [],
    techStack: ['Playwright', 'TypeScript'],
    channels: ['Web']
  },
  {
    id: '2',
    title: 'Invalid Email Registration',
    description: 'Test registration failure with invalid email format',
    businessScenarioId: '1',
    type: 'E2E',
    automationStatus: 'Automated',
    status: 'Failed',
    priority: 'High',
    assignee: 'QA Team',
    lastExecuted: '2024-08-13',
    executionResult: 'Fail',
    githubLink: 'https://github.com/company/tests/registration-invalid.spec.ts',
    defects: [
      {
        id: '1',
        title: 'Email validation not working on mobile',
        severity: 'High',
        status: 'Open',
        jiraTicket: 'BUG-001',
        assignee: 'Dev Team A'
      }
    ],
    techStack: ['Playwright', 'TypeScript'],
    channels: ['Mobile']
  }
];

const TraceabilityMatrix: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [userJourneys, setUserJourneys] = useState<UserJourney[]>([]);
  const [businessScenarios, setBusinessScenarios] = useState<BusinessScenario[]>([]);
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJourney, setSelectedJourney] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<'journey' | 'scenario' | 'testcase' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Load data from API
  const loadTraceabilityData = async () => {
    try {
      setLoading(true);
      const response = await fetch(config.buildApiUrl('/traceability/overview'));
      const result = await response.json();
      
      if (result.success) {
        setUserJourneys(result.data.userJourneys || []);
        setBusinessScenarios(result.data.businessScenarios || []);
        setTestCases(result.data.testCases || []);
      } else {
        console.error('Failed to load traceability data:', result.error);
        // Fallback to mock data
        setUserJourneys(mockUserJourneys);
        setBusinessScenarios(mockBusinessScenarios);
        setTestCases(mockTestCases);
      }
    } catch (error) {
      console.error('Error loading traceability data:', error);
      // Fallback to mock data
      setUserJourneys(mockUserJourneys);
      setBusinessScenarios(mockBusinessScenarios);
      setTestCases(mockTestCases);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadTraceabilityData();
  }, []);

  // Calculate metrics
  const totalUserJourneys = userJourneys.length;
  const totalBusinessScenarios = businessScenarios.length;
  const totalTestCases = testCases.length;
  const automatedTests = testCases.filter(tc => tc.automationStatus === 'Automated').length;
  const passedTests = testCases.filter(tc => tc.executionResult === 'Pass').length;
  const openDefects = testCases.flatMap(tc => tc.defects).filter(d => d.status === 'Open').length;
  const coveragePercentage = totalTestCases > 0 ? Math.round((passedTests / totalTestCases) * 100) : 0;
  const automationPercentage = totalTestCases > 0 ? Math.round((automatedTests / totalTestCases) * 100) : 0;

  const getStatusColor = (status: string) => {
    const colors = {
      'Draft': '#757575',
      'Review': '#ff9800',
      'Approved': '#4caf50',
      'In Progress': '#2196f3',
      'Completed': '#8bc34a',
      'Passed': '#4caf50',
      'Failed': '#f44336',
      'Blocked': '#ff5722',
      'Deprecated': '#9e9e9e'
    };
    return colors[status as keyof typeof colors] || '#757575';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'High': '#f44336',
      'Medium': '#ff9800',
      'Low': '#4caf50'
    };
    return colors[priority as keyof typeof colors] || '#757575';
  };

  const renderOverviewMetrics = () => (
    <Box sx={{ mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" gutterBottom>
          📊 Traceability Overview
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog('journey')}
          color="primary"
          size="small"
        >
          Quick Add Journey
        </Button>
      </Box>
      
      {/* Primary metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                <PersonaIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
                <Typography variant="h3" color="primary" fontWeight="bold">
                  {totalUserJourneys}
                </Typography>
              </Box>
              <Typography variant="subtitle1" fontWeight="medium">User Journeys</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                <ScenarioIcon color="info" sx={{ fontSize: 32, mr: 1 }} />
                <Typography variant="h3" color="info.main" fontWeight="bold">
                  {totalBusinessScenarios}
                </Typography>
              </Box>
              <Typography variant="subtitle1" fontWeight="medium">Business Scenarios</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                <TestCaseIcon color="success" sx={{ fontSize: 32, mr: 1 }} />
                <Typography variant="h3" color="success.main" fontWeight="bold">
                  {totalTestCases}
                </Typography>
              </Box>
              <Typography variant="subtitle1" fontWeight="medium">Test Cases</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={2}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                <WarningIcon color="error" sx={{ fontSize: 32, mr: 1 }} />
                <Typography variant="h3" color="error.main" fontWeight="bold">
                  {openDefects}
                </Typography>
              </Box>
              <Typography variant="subtitle1" fontWeight="medium">Open Defects</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Coverage metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                📈 Test Coverage & Automation
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2">Test Coverage</Typography>
                  <Typography variant="body2" fontWeight="bold">{coveragePercentage}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={coveragePercentage} 
                  sx={{ height: 8, borderRadius: 4, mb: 2 }}
                />
                
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2">Test Automation</Typography>
                  <Typography variant="body2" fontWeight="bold">{automationPercentage}%</Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={automationPercentage} 
                  sx={{ 
                    height: 8, 
                    borderRadius: 4,
                    '& .MuiLinearProgress-bar': { backgroundColor: '#ff9800' }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🔗 Integration Status
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Box display="flex" justify-content="space-between" align-items="center" mb={2}>
                  <Box display="flex" alignItems="center">
                    <JiraIcon sx={{ mr: 1, color: '#0052cc' }} />
                    <Typography variant="body2">JIRA Links</Typography>
                  </Box>
                  <Chip label={`${userJourneys.filter(uj => uj.jiraLink).length}/${totalUserJourneys}`} size="small" />
                </Box>
                <Box display="flex" justify-content="space-between" align-items="center" mb={2}>
                  <Box display="flex" alignItems="center">
                    <ConfluenceIcon sx={{ mr: 1, color: '#172b4d' }} />
                    <Typography variant="body2">Confluence Links</Typography>
                  </Box>
                  <Chip label={`${userJourneys.filter(uj => uj.confluenceLink).length}/${totalUserJourneys}`} size="small" />
                </Box>
                <Box display="flex" justify-content="space-between" align-items="center">
                  <Box display="flex" alignItems="center">
                    <GitHubIcon sx={{ mr: 1, color: '#333' }} />
                    <Typography variant="body2">GitHub Links</Typography>
                  </Box>
                  <Chip label={`${testCases.filter(tc => tc.githubLink).length}/${totalTestCases}`} size="small" />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );

  const renderUserJourneys = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">User Journeys</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog('journey')}
        >
          Add Journey
        </Button>
      </Box>
      
      <Grid container spacing={2}>
        {userJourneys.map((journey) => (
          <Grid item xs={12} key={journey.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" mb={2}>
                  <Box>
                    <Typography variant="h6">{journey.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {journey.description}
                    </Typography>
                    <Box display="flex" gap={1} flexWrap="wrap">
                      <Chip label={journey.persona} size="small" icon={<PersonaIcon />} />
                      <Chip 
                        label={journey.priority} 
                        size="small" 
                        style={{ backgroundColor: getPriorityColor(journey.priority), color: 'white' }}
                      />
                      <Chip 
                        label={journey.status} 
                        size="small" 
                        style={{ backgroundColor: getStatusColor(journey.status), color: 'white' }}
                      />
                    </Box>
                  </Box>
                  <Box>
                    <IconButton onClick={() => {setEditingItem(journey); setOpenDialog('journey');}}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <Box display="flex" gap={2} mt={2}>
                  {journey.jiraLink && (
                    <Chip 
                      icon={<JiraIcon />} 
                      label={journey.jiraLink} 
                      size="small" 
                      clickable
                      sx={{ backgroundColor: '#0052cc', color: 'white' }}
                    />
                  )}
                  {journey.confluenceLink && (
                    <Chip 
                      icon={<ConfluenceIcon />} 
                      label="Confluence" 
                      size="small" 
                      clickable
                      sx={{ backgroundColor: '#172b4d', color: 'white' }}
                    />
                  )}
                </Box>
                
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Business Scenarios: {journey.businessScenarios.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderMatrix = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Complete Traceability Matrix
      </Typography>
      
      {userJourneys.map((journey) => (
        <Accordion key={journey.id} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box display="flex" alignItems="center" gap={2} width="100%">
              <PersonaIcon color="primary" />
              <Typography variant="h6">{journey.title}</Typography>
              <Chip 
                label={journey.status} 
                size="small" 
                style={{ backgroundColor: getStatusColor(journey.status), color: 'white' }}
              />
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {businessScenarios
                .filter(scenario => scenario.userJourneyId === journey.id)
                .map((scenario) => (
                  <Grid item xs={12} key={scenario.id}>
                    <Card variant="outlined" sx={{ ml: 2 }}>
                      <CardContent>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                          <ScenarioIcon color="info" />
                          <Typography variant="subtitle1">{scenario.title}</Typography>
                          <Chip 
                            label={scenario.status} 
                            size="small" 
                            style={{ backgroundColor: getStatusColor(scenario.status), color: 'white' }}
                          />
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {scenario.description}
                        </Typography>
                        
                        <Box display="flex" gap={1} mb={2}>
                          {scenario.techStack.map((tech) => (
                            <Chip key={tech} label={tech} size="small" icon={<TechStackIcon />} />
                          ))}
                        </Box>
                        
                        {/* Test Cases */}
                        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                          Test Cases:
                        </Typography>
                        {testCases
                          .filter(tc => tc.businessScenarioId === scenario.id)
                          .map((testCase) => (
                            <Card key={testCase.id} variant="outlined" sx={{ ml: 2, mb: 1 }}>
                              <CardContent sx={{ py: 1 }}>
                                <Box display="flex" alignItems="center" justify-content="space-between">
                                  <Box display="flex" alignItems="center" gap={2}>
                                    <TestCaseIcon fontSize="small" />
                                    <Typography variant="body2">{testCase.title}</Typography>
                                    <Chip 
                                      label={testCase.type} 
                                      size="small" 
                                      variant="outlined"
                                    />
                                    <Chip 
                                      label={testCase.automationStatus} 
                                      size="small" 
                                      color={testCase.automationStatus === 'Automated' ? 'success' : 'default'}
                                    />
                                    <Chip 
                                      label={testCase.status} 
                                      size="small" 
                                      style={{ backgroundColor: getStatusColor(testCase.status), color: 'white' }}
                                    />
                                  </Box>
                                  {testCase.githubLink && (
                                    <Chip 
                                      icon={<GitHubIcon />} 
                                      label="GitHub" 
                                      size="small" 
                                      clickable
                                    />
                                  )}
                                </Box>
                                
                                {testCase.defects.length > 0 && (
                                  <Box sx={{ mt: 1 }}>
                                    <Typography variant="caption" color="error">
                                      Defects: {testCase.defects.length}
                                    </Typography>
                                  </Box>
                                )}
                              </CardContent>
                            </Card>
                          ))}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom display="flex" alignItems="center" gap={2}>
        <TraceabilityIcon color="primary" />
        Requirement Traceability Matrix
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Track requirements from User Journeys through Business Scenarios to Test Cases with comprehensive linking to JIRA, Confluence, and GitHub.
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography variant="h6" color="text.secondary">
            Loading traceability data...
          </Typography>
        </Box>
      ) : (
        <>
          {renderOverviewMetrics()}

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)}>
              <Tab 
                icon={<TraceabilityIcon />} 
                label="Traceability Matrix" 
                iconPosition="start"
              />
              <Tab 
                icon={<PersonaIcon />} 
                label="User Journeys" 
                iconPosition="start"
              />
              <Tab 
                icon={<ScenarioIcon />} 
                label="Business Scenarios" 
                iconPosition="start"
              />
              <Tab 
                icon={<TestCaseIcon />} 
                label="Test Cases" 
                iconPosition="start"
              />
              <Tab 
                icon={<TimelineIcon />} 
                label="Analytics" 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {selectedTab === 0 && renderMatrix()}
          {selectedTab === 1 && renderUserJourneys()}
          {selectedTab === 2 && <Typography>Business Scenarios view - Coming soon</Typography>}
          {selectedTab === 3 && <Typography>Test Cases view - Coming soon</Typography>}
          {selectedTab === 4 && <Typography>Analytics view - Coming soon</Typography>}

          {/* Floating Action Button */}
          <Fab
            color="primary"
            aria-label="add"
            onClick={() => setOpenDialog('journey')}
            sx={{
              position: 'fixed',
              bottom: 16,
              right: 16,
              zIndex: 1000
            }}
          >
            <AddIcon />
          </Fab>

          {/* Add User Journey Dialog */}
          <Dialog open={openDialog === 'journey'} onClose={() => setOpenDialog(null)} maxWidth="md" fullWidth>
            <DialogTitle>
              {editingItem ? 'Edit User Journey' : 'Add New User Journey'}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Journey Title"
                    placeholder="e.g., User Registration and Onboarding"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    placeholder="Describe the complete user journey..."
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Persona</InputLabel>
                    <Select label="Persona">
                      <MenuItem value="New User">New User</MenuItem>
                      <MenuItem value="Customer">Customer</MenuItem>
                      <MenuItem value="Admin">Admin</MenuItem>
                      <MenuItem value="Power User">Power User</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Priority</InputLabel>
                    <Select label="Priority">
                      <MenuItem value="High">High</MenuItem>
                      <MenuItem value="Medium">Medium</MenuItem>
                      <MenuItem value="Low">Low</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="JIRA Link"
                    placeholder="PROJ-123"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confluence Link"
                    placeholder="https://confluence.company.com/..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Owner/Team"
                    placeholder="Product Team"
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(null)}>Cancel</Button>
              <Button variant="contained">
                {editingItem ? 'Update' : 'Add'} Journey
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default TraceabilityMatrix;
