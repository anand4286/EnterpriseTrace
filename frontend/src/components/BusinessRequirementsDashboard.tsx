import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Button,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Assignment as AssignmentIcon,
  Refresh as RefreshIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
  Timeline as TimelineIcon,
  AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';

interface ProjectConfig {
  id: string;
  name: string;
  initiative: string;
  year: number;
  quarter: string;
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  budget: number;
  description: string;
  businessOwner: string;
  department: string;
  expectedROI: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

interface ProjectForm {
  name: string;
  initiative: string;
  year: number;
  quarter: string;
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  budget: number;
  description: string;
  businessOwner: string;
  department: string;
  expectedROI: number;
  riskLevel: 'Low' | 'Medium' | 'High';
}

const BusinessRequirementsDashboard: React.FC = () => {
  const [projects, setProjects] = useState<ProjectConfig[]>([]);
  const [openProjectDialog, setOpenProjectDialog] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [projectForm, setProjectForm] = useState<ProjectForm>({
    name: '',
    initiative: '',
    year: new Date().getFullYear(),
    quarter: 'Q1',
    status: 'Planning',
    priority: 'Medium',
    budget: 0,
    description: '',
    businessOwner: '',
    department: '',
    expectedROI: 0,
    riskLevel: 'Medium',
  });

  useEffect(() => {
    loadProjectsFromStorage();
  }, []);

  // Auto-save to localStorage whenever projects change
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('businessRequirements_projects', JSON.stringify(projects));
    }
  }, [projects]);

  const initializeSampleProjects = (): ProjectConfig[] => [
    {
      id: '1',
      name: 'Customer Portal Redesign',
      initiative: 'Digital Transformation',
      year: 2025,
      quarter: 'Q1',
      status: 'In Progress',
      priority: 'High',
      budget: 500000,
      description: 'Complete redesign of customer portal with new UX/UI',
      businessOwner: 'Sarah Johnson',
      department: 'Marketing',
      expectedROI: 15,
      riskLevel: 'Medium',
    },
    {
      id: '2',
      name: 'Supply Chain Optimization',
      initiative: 'Operational Excellence',
      year: 2025,
      quarter: 'Q2',
      status: 'Planning',
      priority: 'Critical',
      budget: 750000,
      description: 'Implement AI-driven supply chain optimization system',
      businessOwner: 'Michael Chen',
      department: 'Operations',
      expectedROI: 25,
      riskLevel: 'High',
    },
    {
      id: '3',
      name: 'Employee Self-Service Platform',
      initiative: 'HR Modernization',
      year: 2025,
      quarter: 'Q1',
      status: 'Completed',
      priority: 'Medium',
      budget: 200000,
      description: 'Self-service platform for HR processes and benefits management',
      businessOwner: 'Lisa Rodriguez',
      department: 'Human Resources',
      expectedROI: 12,
      riskLevel: 'Low',
    },
    {
      id: '4',
      name: 'Data Analytics Platform',
      initiative: 'Business Intelligence',
      year: 2025,
      quarter: 'Q3',
      status: 'Planning',
      priority: 'High',
      budget: 650000,
      description: 'Enterprise-wide data analytics and reporting platform',
      businessOwner: 'David Park',
      department: 'IT',
      expectedROI: 20,
      riskLevel: 'Medium',
    },
  ];

  const loadProjectsFromStorage = () => {
    try {
      const savedProjects = localStorage.getItem('businessRequirements_projects');
      if (savedProjects) {
        setProjects(JSON.parse(savedProjects));
      } else {
        const sampleProjects = initializeSampleProjects();
        setProjects(sampleProjects);
        localStorage.setItem('businessRequirements_projects', JSON.stringify(sampleProjects));
      }
    } catch (error) {
      console.error('Error loading projects from localStorage:', error);
      const sampleProjects = initializeSampleProjects();
      setProjects(sampleProjects);
    }
  };

  const handleResetData = () => {
    localStorage.removeItem('businessRequirements_projects');
    const sampleProjects = initializeSampleProjects();
    setProjects(sampleProjects);
    localStorage.setItem('businessRequirements_projects', JSON.stringify(sampleProjects));
  };

  const handleOpenProjectDialog = (projectId?: string) => {
    if (projectId) {
      const project = projects.find(p => p.id === projectId);
      if (project) {
        setProjectForm({
          name: project.name,
          initiative: project.initiative,
          year: project.year,
          quarter: project.quarter,
          status: project.status,
          priority: project.priority,
          budget: project.budget,
          description: project.description,
          businessOwner: project.businessOwner,
          department: project.department,
          expectedROI: project.expectedROI,
          riskLevel: project.riskLevel,
        });
        setEditingProject(projectId);
      }
    } else {
      setProjectForm({
        name: '',
        initiative: '',
        year: new Date().getFullYear(),
        quarter: 'Q1',
        status: 'Planning',
        priority: 'Medium',
        budget: 0,
        description: '',
        businessOwner: '',
        department: '',
        expectedROI: 0,
        riskLevel: 'Medium',
      });
      setEditingProject(null);
    }
    setOpenProjectDialog(true);
  };

  const handleCloseProjectDialog = () => {
    setOpenProjectDialog(false);
    setEditingProject(null);
  };

  const handleSaveProject = () => {
    if (editingProject) {
      // Update existing project
      setProjects(prev => prev.map(project =>
        project.id === editingProject
          ? { ...projectForm, id: editingProject }
          : project
      ));
    } else {
      // Add new project
      const newProject: ProjectConfig = {
        ...projectForm,
        id: Date.now().toString(),
      };
      setProjects(prev => [...prev, newProject]);
    }
    handleCloseProjectDialog();
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  const getIconForDepartment = (department: string) => {
    switch (department.toLowerCase()) {
      case 'marketing': return <BusinessIcon />;
      case 'operations': return <TimelineIcon />;
      case 'human resources': return <AssignmentIcon />;
      case 'it': return <AccountBalanceIcon />;
      default: return <AssignmentIcon />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'primary';
      case 'Planning': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Business Requirements Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="warning"
            startIcon={<RefreshIcon />}
            onClick={handleResetData}
          >
            Reset Data
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenProjectDialog()}
          >
            Add Project
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <AssignmentIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">{projects.length}</Typography>
                  <Typography variant="body2" color="text.secondary">Total Projects</Typography>
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
                  <AssignmentIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">
                    {projects.filter(p => p.status === 'In Progress').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Active Projects</Typography>
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
                  <BusinessIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">
                    ${projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Total Budget</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main' }}>
                  <TimelineIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4">
                    {projects.filter(p => p.status === 'Completed').length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Completed Projects</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} md={6} lg={4} key={project.id}>
            <Card sx={{ height: '100%' }}>
              <CardHeader 
                title={project.name}
                subheader={`${project.initiative} • ${project.businessOwner}`}
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    {getIconForDepartment(project.department)}
                  </Avatar>
                }
                action={
                  <Box>
                    <IconButton onClick={() => handleOpenProjectDialog(project.id)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDeleteProject(project.id)} color="error">
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              />
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={project.status} 
                    color={getStatusColor(project.status) as any} 
                    size="small" 
                    sx={{ mr: 1 }}
                  />
                  <Chip 
                    label={project.priority} 
                    color="warning" 
                    size="small" 
                    sx={{ mr: 1 }}
                  />
                  <Chip 
                    label={project.riskLevel + ' Risk'} 
                    color={project.riskLevel === 'High' ? 'error' : project.riskLevel === 'Medium' ? 'warning' : 'success'} 
                    size="small" 
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {project.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                  <Chip label={project.department} variant="outlined" size="small" />
                  <Chip label={`${project.year} ${project.quarter}`} size="small" />
                  <Chip label={`$${project.budget.toLocaleString()}`} variant="outlined" size="small" />
                  <Chip label={`${project.expectedROI}% ROI`} color="success" variant="outlined" size="small" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Project Form Dialog */}
      <Dialog open={openProjectDialog} onClose={handleCloseProjectDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingProject ? 'Edit Project' : 'Add New Project'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Project Name"
                value={projectForm.name}
                onChange={(e) => setProjectForm(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Initiative"
                value={projectForm.initiative}
                onChange={(e) => setProjectForm(prev => ({ ...prev, initiative: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Business Owner"
                value={projectForm.businessOwner}
                onChange={(e) => setProjectForm(prev => ({ ...prev, businessOwner: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Department"
                value={projectForm.department}
                onChange={(e) => setProjectForm(prev => ({ ...prev, department: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Year"
                type="number"
                value={projectForm.year}
                onChange={(e) => setProjectForm(prev => ({ ...prev, year: parseInt(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Quarter</InputLabel>
                <Select
                  value={projectForm.quarter}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, quarter: e.target.value }))}
                  label="Quarter"
                >
                  <MenuItem value="Q1">Q1</MenuItem>
                  <MenuItem value="Q2">Q2</MenuItem>
                  <MenuItem value="Q3">Q3</MenuItem>
                  <MenuItem value="Q4">Q4</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={projectForm.status}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, status: e.target.value as ProjectForm['status'] }))}
                  label="Status"
                >
                  <MenuItem value="Planning">Planning</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="On Hold">On Hold</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={projectForm.priority}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, priority: e.target.value as ProjectForm['priority'] }))}
                  label="Priority"
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Critical">Critical</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Budget ($)"
                type="number"
                value={projectForm.budget}
                onChange={(e) => setProjectForm(prev => ({ ...prev, budget: parseInt(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Expected ROI (%)"
                type="number"
                value={projectForm.expectedROI}
                onChange={(e) => setProjectForm(prev => ({ ...prev, expectedROI: parseInt(e.target.value) }))}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Risk Level</InputLabel>
                <Select
                  value={projectForm.riskLevel}
                  onChange={(e) => setProjectForm(prev => ({ ...prev, riskLevel: e.target.value as ProjectForm['riskLevel'] }))}
                  label="Risk Level"
                >
                  <MenuItem value="Low">Low</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={projectForm.description}
                onChange={(e) => setProjectForm(prev => ({ ...prev, description: e.target.value }))}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProjectDialog}>Cancel</Button>
          <Button onClick={handleSaveProject} variant="contained">
            {editingProject ? 'Update Project' : 'Add Project'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BusinessRequirementsDashboard;
