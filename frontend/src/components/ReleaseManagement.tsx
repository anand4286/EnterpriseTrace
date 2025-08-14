import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Grid,
  Chip,
  LinearProgress,
  Avatar,
  AvatarGroup,
  Button,
  Badge,
  Tooltip,
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
  Fab
} from '@mui/material';
import {
  Rocket as RocketIcon,
  Security as SecurityIcon,
  Code as CodeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { config } from '../utils/config';

interface Release {
  id: string;
  name: string;
  version: string;
  status: 'planning' | 'development' | 'testing' | 'ready' | 'released';
  progress: number;
  startDate: string;
  targetDate: string;
  squads: string[];
  risks: Risk[];
  readinessChecks: ReadinessCheck[];
  description?: string;
}

interface Risk {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'mitigated' | 'closed';
  description: string;
  owner: string;
}

interface ReadinessCheck {
  id: string;
  category: string;
  item: string;
  status: 'pending' | 'in-progress' | 'completed' | 'blocked';
  squadId: string;
  chapterId: string;
  dueDate: string;
}

const mockReleases: Release[] = [
  {
    id: '1',
    name: 'Mobile App v2.1',
    version: '2.1.0',
    status: 'development',
    progress: 65,
    startDate: '2025-07-15',
    targetDate: '2025-08-30',
    squads: ['1', '2'],
    risks: [
      {
        id: 'r1',
        title: 'API Integration Delays',
        severity: 'medium',
        status: 'open',
        description: 'Third-party API changes may impact timeline',
        owner: 'John Smith'
      }
    ],
    readinessChecks: [
      {
        id: 'rc1',
        category: 'Testing',
        item: 'Performance Testing',
        status: 'in-progress',
        squadId: '1',
        chapterId: '1',
        dueDate: '2025-08-20'
      }
    ]
  }
];

const mockSquads = [
  { id: '1', name: 'Alpha Squad', color: '#1976d2' },
  { id: '2', name: 'Beta Squad', color: '#388e3c' },
  { id: '3', name: 'Gamma Squad', color: '#f57c00' }
];

const mockChapters = [
  { id: '1', name: 'Engineering' },
  { id: '2', name: 'QA' },
  { id: '3', name: 'DevOps' }
];

const ReleaseManagement: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [openReleaseDialog, setOpenReleaseDialog] = useState(false);
  const [openRiskDialog, setOpenRiskDialog] = useState(false);
  const [editingRelease, setEditingRelease] = useState<Release | null>(null);
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null);
  const [selectedReleaseId, setSelectedReleaseId] = useState<string>('');

  // Form states
  const [releaseForm, setReleaseForm] = useState({
    name: '',
    version: '',
    status: 'planning' as Release['status'],
    startDate: '',
    targetDate: '',
    description: '',
    squads: [] as string[]
  });

  const [riskForm, setRiskForm] = useState({
    title: '',
    severity: 'medium' as Risk['severity'],
    status: 'open' as Risk['status'],
    description: '',
    owner: ''
  });

  // Load releases from localStorage
  const loadReleases = async () => {
    try {
      setLoading(true);
      
      // Try to load from localStorage first
      const storedReleases = localStorage.getItem('releases');
      if (storedReleases) {
        setReleases(JSON.parse(storedReleases));
      } else {
        // If no stored releases, use default sample data
        const defaultReleases = [
          {
            id: '1',
            name: 'Q4 Platform Release',
            version: '2.1.0',
            status: 'development' as const,
            progress: 65,
            startDate: '2024-10-01',
            targetDate: '2024-12-15',
            squads: ['Frontend Team', 'Backend Team'],
            description: 'Major platform upgrade with new features',
            risks: [],
            readinessChecks: [
              {
                id: '1',
                category: 'Technical',
                item: 'Database Migration',
                status: 'completed' as const,
                squadId: '1',
                chapterId: '1',
                dueDate: '2024-11-15'
              },
              {
                id: '2',
                category: 'Security',
                item: 'Security Audit',
                status: 'in-progress' as const,
                squadId: '2',
                chapterId: '2',
                dueDate: '2024-12-01'
              },
              {
                id: '3',
                category: 'Performance',
                item: 'Load Testing',
                status: 'pending' as const,
                squadId: '1',
                chapterId: '3',
                dueDate: '2024-12-10'
              }
            ]
          }
        ];
        setReleases(defaultReleases);
        localStorage.setItem('releases', JSON.stringify(defaultReleases));
      }
    } catch (error) {
      console.error('Error loading releases:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadReleases();
  }, []);

  // CRUD Operations
  const handleAddRelease = () => {
    setEditingRelease(null);
    setReleaseForm({
      name: '',
      version: '',
      status: 'planning',
      startDate: '',
      targetDate: '',
      description: '',
      squads: []
    });
    setOpenReleaseDialog(true);
  };

  const handleEditRelease = (release: Release) => {
    setEditingRelease(release);
    setReleaseForm({
      name: release.name,
      version: release.version,
      status: release.status,
      startDate: release.startDate.split('T')[0],
      targetDate: release.targetDate.split('T')[0],
      description: release.description || '',
      squads: release.squads
    });
    setOpenReleaseDialog(true);
  };

  const handleDeleteRelease = async (releaseId: string) => {
    if (window.confirm('Are you sure you want to delete this release?')) {
      try {
        // Delete from localStorage
        const existingReleases = JSON.parse(localStorage.getItem('releases') || '[]');
        const updatedReleases = existingReleases.filter((release: any) => release.id !== releaseId);
        localStorage.setItem('releases', JSON.stringify(updatedReleases));
        
        await loadReleases(); // Reload releases from localStorage
      } catch (error) {
        alert('Error deleting release: ' + error);
      }
    }
  };

  const handleSaveRelease = async () => {
    try {
      const releaseData = {
        id: editingRelease?.id || Date.now().toString(),
        name: releaseForm.name,
        version: releaseForm.version,
        status: releaseForm.status,
        startDate: releaseForm.startDate,
        targetDate: releaseForm.targetDate,
        squads: releaseForm.squads,
        description: releaseForm.description,
        progress: 0,
        risks: [],
        features: []
      };

      // Use localStorage instead of API for now
      const existingReleases = JSON.parse(localStorage.getItem('releases') || '[]');
      
      if (editingRelease) {
        // Update existing release
        const updatedReleases = existingReleases.map((release: any) => 
          release.id === editingRelease.id ? releaseData : release
        );
        localStorage.setItem('releases', JSON.stringify(updatedReleases));
      } else {
        // Add new release
        existingReleases.push(releaseData);
        localStorage.setItem('releases', JSON.stringify(existingReleases));
      }

      setOpenReleaseDialog(false);
      await loadReleases(); // Reload releases from localStorage
    } catch (error) {
      alert('Error saving release: ' + error);
    }
  };

  const handleAddRisk = (releaseId: string) => {
    setSelectedReleaseId(releaseId);
    setEditingRisk(null);
    setRiskForm({
      title: '',
      severity: 'medium',
      status: 'open',
      description: '',
      owner: ''
    });
    setOpenRiskDialog(true);
  };

  const handleEditRisk = (risk: Risk, releaseId: string) => {
    setSelectedReleaseId(releaseId);
    setEditingRisk(risk);
    setRiskForm({
      title: risk.title,
      severity: risk.severity,
      status: risk.status,
      description: risk.description,
      owner: risk.owner
    });
    setOpenRiskDialog(true);
  };

  const handleDeleteRisk = async (riskId: string, releaseId: string) => {
    if (window.confirm('Are you sure you want to delete this risk?')) {
      try {
        // Delete risk from localStorage
        const existingReleases = JSON.parse(localStorage.getItem('releases') || '[]');
        const updatedReleases = existingReleases.map((release: any) => {
          if (release.id === releaseId) {
            return {
              ...release,
              risks: release.risks.filter((risk: any) => risk.id !== riskId)
            };
          }
          return release;
        });
        localStorage.setItem('releases', JSON.stringify(updatedReleases));
        
        await loadReleases(); // Reload releases from localStorage
      } catch (error) {
        alert('Error deleting risk: ' + error);
      }
    }
  };

  const handleSaveRisk = async () => {
    try {
      const riskData = {
        title: riskForm.title,
        severity: riskForm.severity,
        status: riskForm.status,
        description: riskForm.description,
        owner: riskForm.owner
      };

      const url = editingRisk 
        ? config.buildApiUrl(`/releases/${selectedReleaseId}/risks/${editingRisk.id}`)
        : config.buildApiUrl(`/releases/${selectedReleaseId}/risks`);
      
      const method = editingRisk ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(riskData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        setOpenRiskDialog(false);
        await loadReleases(); // Reload releases from server
      } else {
        alert('Failed to save risk: ' + result.error);
      }
    } catch (error) {
      alert('Error saving risk: ' + error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return '#757575';
      case 'development': return '#1976d2';
      case 'testing': return '#f57c00';
      case 'ready': return '#388e3c';
      case 'released': return '#4caf50';
      default: return '#757575';
    }
  };

  const getRiskSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return '#4caf50';
      case 'medium': return '#ff9800';
      case 'high': return '#f44336';
      case 'critical': return '#d32f2f';
      default: return '#757575';
    }
  };

  const getReadinessStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#4caf50';
      case 'in-progress': return '#2196f3';
      case 'pending': return '#757575';
      case 'blocked': return '#f44336';
      default: return '#757575';
    }
  };

  const renderReleaseOverview = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Releases</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddRelease}
          color="primary"
        >
          Add Release
        </Button>
      </Box>
      
      <Grid container spacing={3}>
        {releases.map((release) => (
          <Grid item xs={12} key={release.id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <RocketIcon color="primary" />
                    <Typography variant="h6">{release.name}</Typography>
                    <Chip label={release.version} size="small" />
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip
                      label={release.status}
                      style={{ backgroundColor: getStatusColor(release.status), color: 'white' }}
                    />
                    <IconButton onClick={() => handleEditRelease(release)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteRelease(release.id)} size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {release.description || 'Release description will be added here'}
                </Typography>

                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Progress</Typography>
                    <Typography variant="body2">{release.progress}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={release.progress} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">
                      Start Date: {new Date(release.startDate).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Target Date: {new Date(release.targetDate).toLocaleDateString()}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      Squads ({release.squads.length})
                    </Typography>
                    <AvatarGroup max={4}>
                      {release.squads.map((squadId) => {
                        const squad = mockSquads.find(s => s.id === squadId);
                        return (
                          <Tooltip key={squadId} title={squad?.name || 'Unknown Squad'}>
                            <Avatar 
                              sx={{ bgcolor: squad?.color, width: 32, height: 32 }}
                            >
                              {squad?.name?.charAt(0)}
                            </Avatar>
                          </Tooltip>
                        );
                      })}
                    </AvatarGroup>
                  </Grid>
                </Grid>

                {/* Risks Section */}
                <Box mt={3}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="subtitle2">Risks ({release.risks.length})</Typography>
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddRisk(release.id)}
                    >
                      Add Risk
                    </Button>
                  </Box>
                  {release.risks.length > 0 && (
                    <Grid container spacing={1}>
                      {release.risks.slice(0, 3).map((risk) => (
                        <Grid item xs={12} sm={4} key={risk.id}>
                          <Card variant="outlined" sx={{ p: 1 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                              <Box>
                                <Typography variant="caption" display="block">
                                  {risk.title}
                                </Typography>
                                <Chip
                                  label={risk.severity}
                                  size="small"
                                  style={{ 
                                    backgroundColor: getRiskSeverityColor(risk.severity), 
                                    color: 'white',
                                    fontSize: '0.7rem',
                                    height: '20px'
                                  }}
                                />
                              </Box>
                              <Box>
                                <IconButton 
                                  size="small" 
                                  onClick={() => handleEditRisk(risk, release.id)}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                                <IconButton 
                                  size="small" 
                                  color="error"
                                  onClick={() => handleDeleteRisk(risk.id, release.id)}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Box>
                            </Box>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderTimeline = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Release Timeline</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddRelease}
          color="primary"
        >
          Add Release
        </Button>
      </Box>
      
      <Grid container spacing={2}>
        {releases.map((release) => (
          <Grid item xs={12} key={release.id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <ScheduleIcon color="primary" />
                    <Typography variant="h6">{release.name}</Typography>
                    <Chip label={release.version} size="small" />
                    <Chip
                      label={release.status}
                      style={{ backgroundColor: getStatusColor(release.status), color: 'white' }}
                    />
                  </Box>
                  <Box>
                    <IconButton onClick={() => handleEditRelease(release)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteRelease(release.id)} size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary">
                  Timeline: {new Date(release.startDate).toLocaleDateString()} → {new Date(release.targetDate).toLocaleDateString()}
                </Typography>

                <Box mt={2}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Progress</Typography>
                    <Typography variant="body2">{release.progress}%</Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={release.progress} 
                    sx={{ height: 6, borderRadius: 3 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderRisks = () => (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Risk Management</Typography>
      </Box>
      
      <Grid container spacing={2}>
        {releases.flatMap(release => 
          release.risks.map(risk => ({ ...risk, releaseId: release.id, releaseName: release.name }))
        ).map((risk) => (
          <Grid item xs={12} md={6} key={risk.id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="between" mb={2}>
                  <Box display="flex" alignItems="center" gap={2} flex={1}>
                    <WarningIcon color="warning" />
                    <Typography variant="h6">{risk.title}</Typography>
                    <Chip
                      label={risk.severity}
                      style={{ backgroundColor: getRiskSeverityColor(risk.severity), color: 'white' }}
                      size="small"
                    />
                  </Box>
                  <Box>
                    <IconButton onClick={() => handleEditRisk(risk, risk.releaseId)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteRisk(risk.id, risk.releaseId)} size="small" color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
                
                <Typography variant="body2" color="text.secondary" mb={1}>
                  Release: {risk.releaseName}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {risk.description}
                </Typography>
                
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Owner: {risk.owner}
                  </Typography>
                  <Chip
                    label={risk.status}
                    size="small"
                    color={risk.status === 'closed' ? 'success' : risk.status === 'mitigated' ? 'warning' : 'default'}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const renderReadiness = () => (
    <Grid container spacing={2}>
      {releases
        .filter(release => release && release.readinessChecks)
        .flatMap(release => release.readinessChecks)
        .filter(check => check && check.id && check.item)
        .map((check) => (
        <Grid item xs={12} md={6} key={check.id}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <CheckCircleIcon color="primary" />
                <Typography variant="h6">{check.item}</Typography>
                <Chip
                  label={check.status}
                  style={{ backgroundColor: getReadinessStatusColor(check.status), color: 'white' }}
                  size="small"
                />
              </Box>
              <Typography variant="body2" color="text.secondary">
                Category: {check.category}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Due: {new Date(check.dueDate).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Release Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage release planning, squad readiness, risk assessment, and timeline tracking.
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <Typography variant="h6" color="text.secondary">
            Loading releases...
          </Typography>
        </Box>
      ) : (
        <>
          {/* Release Overview Stats */}
          <Box sx={{ mb: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" gutterBottom>
                📊 Release Management Overview
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddRelease}
                color="primary"
                size="small"
              >
                Quick Add Release
              </Button>
            </Box>
            
            {/* Primary metrics */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={2}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                      <RocketIcon color="primary" sx={{ fontSize: 32, mr: 1 }} />
                      <Typography variant="h3" color="primary" fontWeight="bold">
                        {releases.length}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle1" fontWeight="medium">Total Releases</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={2}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                      <CheckCircleIcon color="success" sx={{ fontSize: 32, mr: 1 }} />
                      <Typography variant="h3" color="success.main" fontWeight="bold">
                        {releases.filter(r => r.status === 'released').length}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle1" fontWeight="medium">Released</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={2}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                      <CodeIcon color="warning" sx={{ fontSize: 32, mr: 1 }} />
                      <Typography variant="h3" color="warning.main" fontWeight="bold">
                        {releases.filter(r => ['development', 'testing'].includes(r.status)).length}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle1" fontWeight="medium">In Progress</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card elevation={2}>
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Box display="flex" alignItems="center" justifyContent="center" mb={1}>
                      <WarningIcon color="error" sx={{ fontSize: 32, mr: 1 }} />
                      <Typography variant="h3" color="error.main" fontWeight="bold">
                        {releases.flatMap(r => r.risks).filter(risk => risk.severity === 'high' || risk.severity === 'critical').length}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle1" fontWeight="medium">High Risks</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Secondary metrics */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h4" color="info.main" fontWeight="bold">
                      {releases.filter(r => r.status === 'planning').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Planning</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h4" color="secondary.main" fontWeight="bold">
                      {releases.filter(r => r.status === 'ready').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Ready</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h4" color="text.primary" fontWeight="bold">
                      {releases.flatMap(r => r.risks).length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Total Risks</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined">
                  <CardContent sx={{ textAlign: 'center', py: 2 }}>
                    <Typography variant="h4" color="primary" fontWeight="bold">
                      {releases.length > 0 ? Math.round(releases.reduce((sum, r) => sum + r.progress, 0) / releases.length) : 0}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">Avg Progress</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Status Distribution Overview */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      📈 Release Status Distribution
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {['planning', 'development', 'testing', 'ready', 'released'].map((status) => {
                        const count = releases.filter(r => r.status === status).length;
                        const percentage = releases.length > 0 ? (count / releases.length) * 100 : 0;
                        const colors = {
                          planning: '#2196f3',
                          development: '#ff9800',
                          testing: '#9c27b0',
                          ready: '#4caf50',
                          released: '#8bc34a'
                        };
                        
                        return (
                          <Box key={status} sx={{ mb: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                              <Typography variant="body2" textTransform="capitalize">
                                {status}
                              </Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {count} ({Math.round(percentage)}%)
                              </Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={percentage} 
                              sx={{ 
                                height: 8, 
                                borderRadius: 4,
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: colors[status as keyof typeof colors]
                                }
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      ⚠️ Risk Assessment Summary
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      {['low', 'medium', 'high', 'critical'].map((severity) => {
                        const count = releases.flatMap(r => r.risks).filter(risk => risk.severity === severity).length;
                        const totalRisks = releases.flatMap(r => r.risks).length;
                        const percentage = totalRisks > 0 ? (count / totalRisks) * 100 : 0;
                        const colors = {
                          low: '#4caf50',
                          medium: '#ff9800',
                          high: '#f44336',
                          critical: '#d32f2f'
                        };
                        
                        return (
                          <Box key={severity} sx={{ mb: 2 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                              <Typography variant="body2" textTransform="capitalize">
                                {severity} Risk
                              </Typography>
                              <Typography variant="body2" fontWeight="bold">
                                {count} ({Math.round(percentage)}%)
                              </Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={percentage} 
                              sx={{ 
                                height: 8, 
                                borderRadius: 4,
                                backgroundColor: 'rgba(0,0,0,0.1)',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: colors[severity as keyof typeof colors]
                                }
                              }}
                            />
                          </Box>
                        );
                      })}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={selectedTab} onChange={(_, newValue) => setSelectedTab(newValue)}>
              <Tab 
                icon={<RocketIcon />} 
                label="Release Overview" 
                iconPosition="start"
              />
              <Tab 
                icon={<ScheduleIcon />} 
                label="Timeline" 
                iconPosition="start"
              />
              <Tab 
                icon={<WarningIcon />} 
                label="Risk Management" 
                iconPosition="start"
              />
              <Tab 
                icon={<CheckCircleIcon />} 
                label="Squad Readiness" 
                iconPosition="start"
              />
            </Tabs>
          </Box>

          {selectedTab === 0 && renderReleaseOverview()}
          {selectedTab === 1 && renderTimeline()}
          {selectedTab === 2 && renderRisks()}
          {selectedTab === 3 && renderReadiness()}
        </>
      )}

      {/* Release Dialog */}
      <Dialog open={openReleaseDialog} onClose={() => setOpenReleaseDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingRelease ? 'Edit Release' : 'Add New Release'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Release Name"
                value={releaseForm.name}
                onChange={(e) => setReleaseForm({ ...releaseForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Version"
                value={releaseForm.version}
                onChange={(e) => setReleaseForm({ ...releaseForm, version: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={releaseForm.status}
                  label="Status"
                  onChange={(e) => setReleaseForm({ ...releaseForm, status: e.target.value as Release['status'] })}
                >
                  <MenuItem value="planning">Planning</MenuItem>
                  <MenuItem value="development">Development</MenuItem>
                  <MenuItem value="testing">Testing</MenuItem>
                  <MenuItem value="ready">Ready</MenuItem>
                  <MenuItem value="released">Released</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Squads</InputLabel>
                <Select
                  multiple
                  value={releaseForm.squads}
                  label="Squads"
                  onChange={(e) => setReleaseForm({ ...releaseForm, squads: e.target.value as string[] })}
                >
                  {mockSquads.map((squad) => (
                    <MenuItem key={squad.id} value={squad.id}>
                      {squad.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                type="date"
                value={releaseForm.startDate}
                onChange={(e) => setReleaseForm({ ...releaseForm, startDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Target Date"
                type="date"
                value={releaseForm.targetDate}
                onChange={(e) => setReleaseForm({ ...releaseForm, targetDate: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={releaseForm.description}
                onChange={(e) => setReleaseForm({ ...releaseForm, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenReleaseDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveRelease} variant="contained">
            {editingRelease ? 'Update' : 'Add'} Release
          </Button>
        </DialogActions>
      </Dialog>

      {/* Risk Dialog */}
      <Dialog open={openRiskDialog} onClose={() => setOpenRiskDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingRisk ? 'Edit Risk' : 'Add New Risk'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Risk Title"
                value={riskForm.title}
                onChange={(e) => setRiskForm({ ...riskForm, title: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Severity</InputLabel>
                <Select
                  value={riskForm.severity}
                  label="Severity"
                  onChange={(e) => setRiskForm({ ...riskForm, severity: e.target.value as Risk['severity'] })}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                  <MenuItem value="critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={riskForm.status}
                  label="Status"
                  onChange={(e) => setRiskForm({ ...riskForm, status: e.target.value as Risk['status'] })}
                >
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="mitigated">Mitigated</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Owner"
                value={riskForm.owner}
                onChange={(e) => setRiskForm({ ...riskForm, owner: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={riskForm.description}
                onChange={(e) => setRiskForm({ ...riskForm, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRiskDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveRisk} variant="contained">
            {editingRisk ? 'Update' : 'Add'} Risk
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button for Quick Add */}
      <Fab
        color="primary"
        aria-label="add"
        onClick={handleAddRelease}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 1000
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default ReleaseManagement;
