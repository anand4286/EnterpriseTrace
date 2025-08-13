import React, { useState, useEffect } from 'react';
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Paper,
  Tab,
  Tabs,
  Badge,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Group as GroupIcon,
  Person as PersonIcon,
  Engineering as EngineeringIcon,
  BugReport as TestIcon,
  Analytics as AnalyticsIcon,
  RocketLaunch as ReleaseIcon,
  Business as ProductIcon,
  Map as JourneyIcon,
} from '@mui/icons-material';
import { apiCall } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import UserAutocomplete from './UserAutocomplete';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'product-owner' | 'scrum-master' | 'tech-lead' | 'engineer' | 'designer' | 'analyst' | 'tester';
  avatar?: string;
  skills: string[];
  experience: string;
  status: 'active' | 'inactive' | 'on_leave';
}

interface Squad {
  id: string;
  name: string;
  description: string;
  productOwner?: TeamMember;
  engineers: TeamMember[];
  testers: TeamMember[];
  releaseLead?: TeamMember;
  analysts: TeamMember[];
  journeyExperts: TeamMember[];
  status: 'active' | 'inactive' | 'planning';
  project: string;
  startDate: string;
  endDate?: string;
}

const SquadPage: React.FC = () => {
  const { user } = useAuth();
  const [squads, setSquads] = useState<Squad[]>([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [squadDialogOpen, setSquadDialogOpen] = useState(false);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [editingSquad, setEditingSquad] = useState<Squad | null>(null);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [selectedSquad, setSelectedSquad] = useState<string>('');

  // Form states
  const [squadForm, setSquadForm] = useState({
    name: '',
    description: '',
    project: '',
    startDate: '',
    endDate: '',
    status: 'planning' as Squad['status']
  });

  const [memberForm, setMemberForm] = useState({
    selectedUser: null as any,
    role: 'engineer' as TeamMember['role'],
    skills: '',
    experience: '',
    status: 'active' as TeamMember['status']
  });

  // Load squads from API when component mounts
  useEffect(() => {
    loadSquads();
  }, []);

  // Debug logging when squads state changes
  useEffect(() => {
    console.log('Squads state changed:', squads);
    console.log('Total squads:', squads.length);
    console.log('Auth token in localStorage:', localStorage.getItem('auth_token'));
    console.log('Current user:', user);
  }, [squads, user]);

  const loadSquads = async () => {
    try {
      console.log('Loading squads from API...');
      console.log('Auth token:', localStorage.getItem('auth_token'));
      console.log('Is authenticated:', user ? 'Yes' : 'No');
      
      const response = await apiCall('/api/squads');
      console.log('Raw API response:', response);
      
      if (response && response.squads) {
        console.log('Found squads in response:', response.squads);
        // Transform backend squad format to frontend format
        const transformedSquads = response.squads.map((squad: any) => {
          // Transform backend members to frontend format
          const transformMember = (member: any) => {
            // Extract role name as string for UI compatibility
            const roleName = typeof member.role === 'string' ? member.role : member.role?.name || 'member';
            
            return {
              id: member.user_id || member.id,
              name: `${member.first_name || 'Unknown'} ${member.last_name || 'User'}`,
              email: member.email || 'no-email',
              role: roleName.toLowerCase(), // Normalize to lowercase string
              skills: [], // We don't have skills in the database yet
              experience: '',
              status: 'active' as const
            };
          };

          // Group members by role - handle both string and object role formats
          const getRoleName = (member: any) => {
            if (typeof member.role === 'string') return member.role.toLowerCase();
            if (member.role && typeof member.role === 'object') {
              // Try both role.name and member.role field for squad role
              return member.role.name?.toLowerCase() || 'unknown';
            }
            return 'unknown';
          };

          // For now, let's collect all members and categorize them flexibly
          const allMembers = squad.members || [];
          console.log('All members for squad', squad.name, ':', allMembers.map((m: any) => ({
            name: `${m.first_name} ${m.last_name}`,
            role: m.role,
            roleName: getRoleName(m)
          })));
          
          const engineers = allMembers.filter((m: any) => {
            const roleName = getRoleName(m);
            return roleName === 'engineer' || roleName === 'lead' || roleName === 'admin'; // Include LEADs and ADMINs as engineers for now
          }).map(transformMember);
          
          const testers = allMembers.filter((m: any) => {
            const roleName = getRoleName(m);
            return roleName === 'tester';
          }).map(transformMember);
          
          const analysts = allMembers.filter((m: any) => {
            const roleName = getRoleName(m);
            return roleName === 'analyst';
          }).map(transformMember);
          
          const designers = allMembers.filter((m: any) => {
            const roleName = getRoleName(m);
            return roleName === 'designer';
          }).map(transformMember);

          return {
            id: squad.id,
            name: squad.name,
            description: squad.purpose || '',
            project: 'new', // Default for now since backend doesn't have this field
            status: squad.status,
            startDate: squad.createdAt ? new Date(squad.createdAt).toISOString().split('T')[0] : '',
            endDate: '',
            productOwner: allMembers.find((m: any) => {
              const roleName = getRoleName(m);
              return roleName === 'product-owner' || roleName === 'admin'; // ADMINs can be product owners
            }) ? transformMember(allMembers.find((m: any) => {
              const roleName = getRoleName(m);
              return roleName === 'product-owner' || roleName === 'admin';
            })) : undefined,
            engineers,
            testers,
            releaseLead: allMembers.find((m: any) => {
              const roleName = getRoleName(m);
              return roleName === 'scrum-master' || roleName === 'lead'; // LEADs can be scrum masters
            }) ? transformMember(allMembers.find((m: any) => {
              const roleName = getRoleName(m);
              return roleName === 'scrum-master' || roleName === 'lead';
            })) : undefined,
            analysts,
            journeyExperts: designers // Using designers as journey experts for now
          };
        });
        console.log('Transformed squads:', transformedSquads);
        setSquads(transformedSquads);
        console.log('Squads state updated');
      } else {
        console.log('No squads found in response or response is null');
        setSquads([]);
      }
    } catch (error) {
      console.error('Failed to load squads:', error);
      console.error('Error details:', error);
      setSquads([]);
    }
  };

  const getRoleIcon = (role: TeamMember['role']) => {
    switch (role) {
      case 'product-owner': return <ProductIcon />;
      case 'scrum-master': return <ReleaseIcon />; 
      case 'tech-lead': return <EngineeringIcon />;
      case 'engineer': return <EngineeringIcon />;
      case 'designer': return <JourneyIcon />;
      case 'tester': return <TestIcon />;
      case 'analyst': return <AnalyticsIcon />;
      default: return <PersonIcon />;
    }
  };

  const getRoleColor = (role: TeamMember['role']) => {
    switch (role) {
      case 'product-owner': return '#2196f3';
      case 'scrum-master': return '#9c27b0';
      case 'tech-lead': return '#4caf50';
      case 'engineer': return '#4caf50';
      case 'designer': return '#e91e63';
      case 'tester': return '#ff9800';
      case 'analyst': return '#607d8b';
      default: return '#757575';
    }
  };

  const formatRoleName = (role: TeamMember['role']) => {
    // Handle both string and potential object roles
    const roleStr = typeof role === 'string' ? role : String(role);
    
    // Handle different role formats
    if (roleStr.includes('_')) {
      return roleStr.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    } else if (roleStr.includes('-')) {
      return roleStr.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    } else {
      // Simple case - just capitalize first letter
      return roleStr.charAt(0).toUpperCase() + roleStr.slice(1);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'on_leave': return 'warning';
      case 'planning': return 'info';
      default: return 'default';
    }
  };

  const handleAddSquad = () => {
    setSquadForm({
      name: '',
      description: '',
      project: '',
      startDate: '',
      endDate: '',
      status: 'planning'
    });
    setEditingSquad(null);
    setSquadDialogOpen(true);
  };

  const handleEditSquad = (squad: Squad) => {
    setSquadForm({
      name: squad.name,
      description: squad.description,
      project: squad.project,
      startDate: squad.startDate,
      endDate: squad.endDate || '',
      status: squad.status
    });
    setEditingSquad(squad);
    setSquadDialogOpen(true);
  };

  const handleDeleteSquad = async (squad: Squad) => {
    if (window.confirm(`Are you sure you want to delete squad "${squad.name}"? This action cannot be undone.`)) {
      try {
        await apiCall(`/api/squads/${squad.id}`, {
          method: 'DELETE'
        });
        
        // Reload squads to update the list
        await loadSquads();
        alert('Squad deleted successfully');
      } catch (error: any) {
        console.error('Failed to delete squad:', error);
        let errorMessage = 'Failed to delete squad. Please try again.';
        if (error && error.message) {
          errorMessage = error.message;
        } else if (error && error.error) {
          errorMessage = error.error;
        }
        alert(errorMessage);
      }
    }
  };

  const handleAddMember = (squadId: string) => {
    setMemberForm({
      selectedUser: null,
      role: 'engineer',
      skills: '',
      experience: '',
      status: 'active'
    });
    setSelectedSquad(squadId);
    setEditingMember(null);
    setMemberDialogOpen(true);
  };

  const handleEditMember = (member: TeamMember, squadId: string) => {
    setMemberForm({
      selectedUser: null, // We'll need to find this user in the user list
      role: member.role,
      skills: member.skills.join(', '),
      experience: member.experience,
      status: member.status
    });
    setSelectedSquad(squadId);
    setEditingMember(member);
    setMemberDialogOpen(true);
  };

  const handleDeleteMember = async (member: TeamMember, squadId: string) => {
    if (window.confirm(`Are you sure you want to remove ${member.name} from this squad?`)) {
      try {
        await apiCall(`/api/squads/${squadId}/members/${member.id}`, {
          method: 'DELETE'
        });
        
        // Reload squads to update the member list
        await loadSquads();
        alert('Member removed successfully');
      } catch (error: any) {
        console.error('Failed to remove member:', error);
        let errorMessage = 'Failed to remove member. Please try again.';
        if (error && error.message) {
          errorMessage = error.message;
        } else if (error && error.error) {
          errorMessage = error.error;
        }
        alert(errorMessage);
      }
    }
  };

  const handleSaveSquad = async () => {
    try {
      const squadData = {
        name: squadForm.name,
        purpose: squadForm.description,
        type: 'feature', // Default type
        // tribeId: optional, will be null in database
        // totalPoints: optional, will default to 10
      };

      console.log('Sending squad data:', squadData);

      if (editingSquad) {
        // Update existing squad
        await apiCall(`/api/squads/${editingSquad.id}`, {
          method: 'PUT',
          body: JSON.stringify(squadData)
        });
      } else {
        // Create new squad
        const response = await apiCall('/api/squads', {
          method: 'POST',
          body: JSON.stringify(squadData)
        });
        console.log('Squad created:', response);
      }

      // Reload squads from server
      await loadSquads();
      setSquadDialogOpen(false);
      
      // Reset form
      setSquadForm({
        name: '',
        description: '',
        project: '',
        startDate: '',
        endDate: '',
        status: 'planning'
      });
      setEditingSquad(null);
    } catch (error) {
      console.error('Failed to save squad:', error);
      
      // Try to get more detailed error information
      if (error instanceof Error) {
        try {
          const errorResponse = JSON.parse(error.message.split('status: ')[1] || '{}');
          console.error('Detailed error:', errorResponse);
        } catch (parseError) {
          console.error('Could not parse error details');
        }
      }
      
      alert(`Failed to save squad: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleSaveMember = async () => {
    console.log('handleSaveMember called', { memberForm, selectedSquad });
    
    if (!memberForm.selectedUser) {
      alert('Please select a user');
      return;
    }

    if (!selectedSquad) {
      alert('No squad selected');
      return;
    }

    try {
      const memberData = {
        userId: memberForm.selectedUser.id,
        role: memberForm.role, // Use the role directly as it now matches backend format
        allocation: 100 // Default allocation
      };

      console.log('Adding member with data:', memberData);

      if (editingMember) {
        // For editing, we need to remove the old member and add the new one
        // This is a simplified approach - in a real app, you'd have an update endpoint
        console.log('Removing existing member:', editingMember);
        await apiCall(`/api/squads/${selectedSquad}/members/${editingMember.id}`, {
          method: 'DELETE'
        });
      }

      // Add the member to the squad
      console.log('Adding member to squad:', selectedSquad);
      const response = await apiCall(`/api/squads/${selectedSquad}/members`, {
        method: 'POST',
        body: JSON.stringify(memberData)
      });
      
      console.log('Member added successfully:', response);

      // Reload squads to get updated member list
      await loadSquads();
      setMemberDialogOpen(false);
      
    } catch (error: any) {
      console.error('Failed to save member:', error);
      
      // Extract error message from API response
      let errorMessage = 'Failed to save member. Please try again.';
      if (error && error.message) {
        errorMessage = error.message;
      } else if (error && error.error) {
        errorMessage = error.error;
      }
      
      alert(errorMessage);
    }
  };

  const renderMemberCard = (member: TeamMember, squadId: string) => (
    <Card key={member.id} sx={{ mb: 1 }}>
      <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            <Avatar sx={{ bgcolor: getRoleColor(member.role), mr: 2 }}>
              {getRoleIcon(member.role)}
            </Avatar>
            <Box>
              <Typography variant="subtitle2">{member.name}</Typography>
              <Typography variant="caption" color="text.secondary">
                {member.email}
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                <Chip 
                  label={formatRoleName(member.role)} 
                  size="small" 
                  sx={{ mr: 1, bgcolor: getRoleColor(member.role), color: 'white' }}
                />
                <Chip 
                  label={member.status} 
                  size="small" 
                  color={getStatusColor(member.status) as any}
                />
              </Box>
              <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                Experience: {member.experience}
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                {member.skills.slice(0, 3).map((skill, index) => (
                  <Chip key={index} label={skill} variant="outlined" size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                ))}
                {member.skills.length > 3 && (
                  <Chip label={`+${member.skills.length - 3} more`} variant="outlined" size="small" />
                )}
              </Box>
            </Box>
          </Box>
          <Box>
            <IconButton 
              size="small" 
              onClick={() => handleEditMember(member, squadId)}
              title="Edit Member"
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={() => handleDeleteMember(member, squadId)}
              title="Remove Member"
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderSquadCard = (squad: Squad) => {
    const totalMembers = 
      (squad.productOwner ? 1 : 0) +
      squad.engineers.length +
      squad.testers.length +
      (squad.releaseLead ? 1 : 0) +
      squad.analysts.length +
      squad.journeyExperts.length;

    return (
      <Card key={squad.id} sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                {squad.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {squad.description}
              </Typography>
              <Typography variant="subtitle2" color="primary">
                Project: {squad.project}
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Chip 
                  label={squad.status} 
                  color={getStatusColor(squad.status) as any}
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Chip 
                  icon={<GroupIcon />}
                  label={`${totalMembers} members`} 
                  variant="outlined"
                  size="small"
                />
              </Box>
            </Box>
            <Box>
              <IconButton onClick={() => handleEditSquad(squad)} title="Edit Squad">
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDeleteSquad(squad)} title="Delete Squad" color="error">
                <DeleteIcon />
              </IconButton>
              <Button 
                variant="outlined" 
                size="small" 
                startIcon={<AddIcon />}
                onClick={() => handleAddMember(squad.id)}
                sx={{ ml: 1 }}
              >
                Add Member
              </Button>
            </Box>
          </Box>

          <Grid container spacing={2}>
            {/* Product Owner */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Product Owner
              </Typography>
              {squad.productOwner ? 
                renderMemberCard(squad.productOwner, squad.id) :
                <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">No Product Owner assigned</Typography>
                </Box>
              }
            </Grid>

            {/* Release Lead */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Release Lead
              </Typography>
              {squad.releaseLead ? 
                renderMemberCard(squad.releaseLead, squad.id) :
                <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">No Release Lead assigned</Typography>
                </Box>
              }
            </Grid>

            {/* Engineers */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Engineers ({squad.engineers.length})
              </Typography>
              {squad.engineers.length > 0 ? 
                squad.engineers.map(engineer => renderMemberCard(engineer, squad.id)) :
                <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">No Engineers assigned</Typography>
                </Box>
              }
            </Grid>

            {/* Testers */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Testers ({squad.testers.length})
              </Typography>
              {squad.testers.length > 0 ? 
                squad.testers.map(tester => renderMemberCard(tester, squad.id)) :
                <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">No Testers assigned</Typography>
                </Box>
              }
            </Grid>

            {/* Analysts */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Analysts ({squad.analysts.length})
              </Typography>
              {squad.analysts.length > 0 ? 
                squad.analysts.map(analyst => renderMemberCard(analyst, squad.id)) :
                <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">No Analysts assigned</Typography>
                </Box>
              }
            </Grid>

            {/* Journey Experts */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Journey Experts ({squad.journeyExperts.length})
              </Typography>
              {squad.journeyExperts.length > 0 ? 
                squad.journeyExperts.map(expert => renderMemberCard(expert, squad.id)) :
                <Box sx={{ p: 2, border: '1px dashed #ccc', borderRadius: 1, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">No Journey Experts assigned</Typography>
                </Box>
              }
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Squad Management
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={handleAddSquad}
        >
          Add Squad
        </Button>
      </Box>

      {/* Squad Overview Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {squads.length}
              </Typography>
              <Typography variant="subtitle1">Total Squads</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {squads.filter(s => s.status === 'active').length}
              </Typography>
              <Typography variant="subtitle1">Active Squads</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {squads.reduce((total, squad) => {
                  return total + 
                    (squad.productOwner ? 1 : 0) +
                    squad.engineers.length +
                    squad.testers.length +
                    (squad.releaseLead ? 1 : 0) +
                    squad.analysts.length +
                    squad.journeyExperts.length;
                }, 0)}
              </Typography>
              <Typography variant="subtitle1">Total Members</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {squads.reduce((total, squad) => total + squad.engineers.length, 0)}
              </Typography>
              <Typography variant="subtitle1">Engineers</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Squads List */}
      {squads.map(squad => renderSquadCard(squad))}

      {/* Squad Add/Edit Dialog */}
      <Dialog open={squadDialogOpen} onClose={() => setSquadDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingSquad ? 'Edit Squad' : 'Add Squad'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                label="Squad Name"
                fullWidth
                variant="outlined"
                value={squadForm.name}
                onChange={(e) => setSquadForm({...squadForm, name: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Project"
                fullWidth
                variant="outlined"
                value={squadForm.project}
                onChange={(e) => setSquadForm({...squadForm, project: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={squadForm.description}
                onChange={(e) => setSquadForm({...squadForm, description: e.target.value})}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={squadForm.status}
                  label="Status"
                  onChange={(e) => setSquadForm({...squadForm, status: e.target.value as Squad['status']})}
                >
                  <MenuItem value="planning">Planning</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                variant="outlined"
                value={squadForm.startDate}
                onChange={(e) => setSquadForm({...squadForm, startDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="End Date"
                type="date"
                fullWidth
                variant="outlined"
                value={squadForm.endDate}
                onChange={(e) => setSquadForm({...squadForm, endDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSquadDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveSquad} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Member Add/Edit Dialog */}
      <Dialog open={memberDialogOpen} onClose={() => setMemberDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingMember ? 'Edit Member' : 'Add Member'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <UserAutocomplete
                value={memberForm.selectedUser}
                onChange={(user) => setMemberForm({...memberForm, selectedUser: user})}
                label="Select Team Member"
                placeholder="Search and select a user..."
                required
                filterByStatus={['active']}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={memberForm.role}
                  label="Role"
                  onChange={(e) => setMemberForm({...memberForm, role: e.target.value as TeamMember['role']})}
                >
                  <MenuItem value="product-owner">Product Owner</MenuItem>
                  <MenuItem value="scrum-master">Scrum Master</MenuItem>
                  <MenuItem value="tech-lead">Tech Lead</MenuItem>
                  <MenuItem value="engineer">Engineer</MenuItem>
                  <MenuItem value="designer">Designer</MenuItem>
                  <MenuItem value="analyst">Analyst</MenuItem>
                  <MenuItem value="tester">Tester</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={memberForm.status}
                  label="Status"
                  onChange={(e) => setMemberForm({...memberForm, status: e.target.value as TeamMember['status']})}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="on_leave">On Leave</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Skills (comma separated)"
                fullWidth
                variant="outlined"
                value={memberForm.skills}
                onChange={(e) => setMemberForm({...memberForm, skills: e.target.value})}
                placeholder="React, Node.js, TypeScript, AWS"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Experience"
                fullWidth
                variant="outlined"
                value={memberForm.experience}
                onChange={(e) => setMemberForm({...memberForm, experience: e.target.value})}
                placeholder="e.g. 5 years"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMemberDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveMember} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SquadPage;
