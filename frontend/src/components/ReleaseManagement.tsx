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
  Tooltip
} from '@mui/material';
import {
  Rocket as RocketIcon,
  Security as SecurityIcon,
  Code as CodeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

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
    <Grid container spacing={3}>
      {mockReleases.map((release) => (
        <Grid item xs={12} key={release.id}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <RocketIcon color="primary" />
                  <Typography variant="h6">{release.name}</Typography>
                  <Chip label={release.version} size="small" />
                </Box>
                <Chip
                  label={release.status}
                  style={{ backgroundColor: getStatusColor(release.status), color: 'white' }}
                />
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
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderTimeline = () => (
    <Grid container spacing={2}>
      {mockReleases.map((release) => (
        <Grid item xs={12} key={release.id}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <ScheduleIcon color="primary" />
                <Typography variant="h6">{release.name}</Typography>
                <Chip label={release.version} size="small" />
                <Chip
                  label={release.status}
                  style={{ backgroundColor: getStatusColor(release.status), color: 'white' }}
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary">
                Timeline: {new Date(release.startDate).toLocaleDateString()} → {new Date(release.targetDate).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderRisks = () => (
    <Grid container spacing={2}>
      {mockReleases.flatMap(release => release.risks).map((risk) => (
        <Grid item xs={12} md={6} key={risk.id}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <WarningIcon color="warning" />
                <Typography variant="h6">{risk.title}</Typography>
                <Chip
                  label={risk.severity}
                  style={{ backgroundColor: getRiskSeverityColor(risk.severity), color: 'white' }}
                  size="small"
                />
              </Box>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {risk.description}
              </Typography>
              <Typography variant="body2">
                Owner: {risk.owner}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderReadiness = () => (
    <Grid container spacing={2}>
      {mockReleases.flatMap(release => release.readinessChecks).map((check) => (
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
    </Box>
  );
};

export default ReleaseManagement;
