import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Alert
} from '@mui/material';
import UserAutocomplete from './UserAutocomplete';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  organizationId: string;
  role: {
    id: string;
    name: string;
    level: 'executive' | 'manager' | 'lead' | 'member' | 'viewer';
    permissions: string[];
  };
  profile: {
    avatar?: string;
    phone?: string;
    location: string;
    department: string;
    jobTitle: string;
    skills: string[];
    certifications: string[];
  };
  status: 'active' | 'inactive' | 'pending';
  lastLoginAt?: Date;
  createdAt: Date;
}

const UserAutocompleteDemo: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [assignmentMessage, setAssignmentMessage] = useState<string>('');

  const handleAssignUser = () => {
    if (selectedUser) {
      setAssignmentMessage(`✅ Assigned ${selectedUser.firstName} ${selectedUser.lastName} (${selectedUser.profile.jobTitle}) to this project!`);
    }
  };

  const handleAssignMultipleUsers = () => {
    if (selectedUsers.length > 0) {
      const names = selectedUsers.map(u => `${u.firstName} ${u.lastName}`).join(', ');
      setAssignmentMessage(`✅ Assigned ${selectedUsers.length} users to this team: ${names}`);
    }
  };

  const clearSelection = () => {
    setSelectedUser(null);
    setSelectedUsers([]);
    setAssignmentMessage('');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        🎯 User Autocomplete System
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
        This system ensures that only users from the User Management system can be assigned to projects, 
        squads, and teams. This prevents "unwanted user dumps" and maintains data consistency.
      </Typography>

      <Grid container spacing={3}>
        {/* Single User Selection */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                👤 Single User Assignment
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                Assign a project manager or team lead
              </Typography>
              
              <UserAutocomplete
                value={selectedUser}
                onChange={setSelectedUser}
                label="Project Manager"
                placeholder="Search for a user..."
                filterByStatus={['active']}
                filterByRole={['ADMIN', 'MANAGER', 'LEAD']}
              />
              
              <Button 
                variant="contained" 
                onClick={handleAssignUser}
                disabled={!selectedUser}
                sx={{ mt: 2 }}
                fullWidth
              >
                Assign as Project Manager
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Multiple User Selection */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                👥 Multiple User Assignment
              </Typography>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                Build your team with multiple members
              </Typography>
              
              <UserAutocomplete
                multiple
                multipleValue={selectedUsers}
                onMultipleChange={setSelectedUsers}
                label="Team Members"
                placeholder="Search and select team members..."
                filterByStatus={['active']}
              />
              
              <Button 
                variant="contained" 
                color="secondary"
                onClick={handleAssignMultipleUsers}
                disabled={selectedUsers.length === 0}
                sx={{ mt: 2 }}
                fullWidth
              >
                Add to Team ({selectedUsers.length} selected)
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Results */}
        {assignmentMessage && (
          <Grid item xs={12}>
            <Alert 
              severity="success" 
              action={
                <Button color="inherit" size="small" onClick={clearSelection}>
                  Clear
                </Button>
              }
            >
              {assignmentMessage}
            </Alert>
          </Grid>
        )}

        {/* Features */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                ✨ Key Features
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" color="primary">🔍</Typography>
                    <Typography variant="subtitle2">Smart Search</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Type name, email, or job title
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" color="primary">🎯</Typography>
                    <Typography variant="subtitle2">Role Filtering</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Filter by user roles and status
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" color="primary">👥</Typography>
                    <Typography variant="subtitle2">Multiple Selection</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Select multiple users at once
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" color="primary">🛡️</Typography>
                    <Typography variant="subtitle2">Data Control</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Only managed users allowed
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserAutocompleteDemo;
