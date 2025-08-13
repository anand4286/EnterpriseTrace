import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
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
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Switch,
  FormControlLabel,
  Alert,
  Divider,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  SupervisorAccount as ManagerIcon,
  Group as TeamIcon,
  Visibility as ViewIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as DepartmentIcon,
  Work as JobIcon,
  Security as PermissionIcon
} from '@mui/icons-material';
import { apiCall } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

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
  permissions: Array<{
    resource: string;
    actions: string[];
  }>;
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
  updatedAt: Date;
}

interface Role {
  id: string;
  name: string;
  level: string;
  permissions: string[];
  description: string;
}

const UserManagement: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [userForm, setUserForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    roleId: '',
    department: '',
    jobTitle: '',
    location: '',
    phone: '',
    skills: '',
    status: 'active' as User['status']
  });

  const [roleForm, setRoleForm] = useState({
    name: '',
    level: 'member' as Role['level'],
    description: '',
    permissions: [] as string[]
  });

  const availablePermissions = [
    'squads:create', 'squads:read', 'squads:update', 'squads:delete',
    'users:create', 'users:read', 'users:update', 'users:delete',
    'organizations:read', 'organizations:update', 'organizations:delete',
    'projects:create', 'projects:read', 'projects:update', 'projects:delete',
    'tribes:create', 'tribes:read', 'tribes:update', 'tribes:delete',
    'teams:create', 'teams:read', 'teams:update', 'teams:delete',
    'reports:read', 'reports:create', 'reports:export',
    'admin:all'
  ];

  const predefinedRoles = [
    {
      name: 'ADMIN',
      level: 'executive',
      description: 'Full system administrator with all permissions',
      permissions: ['*']
    },
    {
      name: 'MANAGER',
      level: 'manager',
      description: 'Team manager with squad and user management',
      permissions: ['squads:*', 'users:read', 'users:update', 'projects:*', 'reports:*']
    },
    {
      name: 'LEAD',
      level: 'lead',
      description: 'Team lead with squad management',
      permissions: ['squads:read', 'squads:update', 'projects:read', 'projects:update']
    },
    {
      name: 'MEMBER',
      level: 'member',
      description: 'Team member with basic access',
      permissions: ['squads:read', 'projects:read']
    },
    {
      name: 'VIEWER',
      level: 'viewer',
      description: 'Read-only access to assigned projects',
      permissions: ['squads:read', 'projects:read', 'reports:read']
    }
  ];

  useEffect(() => {
    loadUsersFromStorage();
    loadRolesFromStorage();
  }, []);

  // Auto-save to localStorage whenever users or roles change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('userManagement_users', JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    if (roles.length > 0) {
      localStorage.setItem('userManagement_roles', JSON.stringify(roles));
    }
  }, [roles]);

  const initializeSampleUsers = (): User[] => [
    {
      id: '1',
      email: 'sarah.johnson@company.com',
      firstName: 'Sarah',
      lastName: 'Johnson',
      organizationId: 'org-1',
      role: {
        id: 'admin-role',
        name: 'ADMIN',
        level: 'executive',
        permissions: ['*']
      },
      permissions: [{ resource: '*', actions: ['*'] }],
      profile: {
        avatar: '',
        phone: '+1-555-0101',
        location: 'New York, NY',
        department: 'Engineering',
        jobTitle: 'Chief Technology Officer',
        skills: ['Leadership', 'Strategy', 'Technology Architecture'],
        certifications: ['AWS Solutions Architect', 'PMP']
      },
      status: 'active',
      lastLoginAt: new Date('2025-08-13T09:00:00Z'),
      createdAt: new Date('2023-01-15T00:00:00Z'),
      updatedAt: new Date('2025-08-13T09:00:00Z')
    },
    {
      id: '2',
      email: 'mike.chen@company.com',
      firstName: 'Mike',
      lastName: 'Chen',
      organizationId: 'org-1',
      role: {
        id: 'manager-role',
        name: 'MANAGER',
        level: 'manager',
        permissions: ['squads:*', 'users:read', 'users:update', 'projects:*', 'reports:*']
      },
      permissions: [
        { resource: 'squads', actions: ['*'] },
        { resource: 'users', actions: ['read', 'update'] },
        { resource: 'projects', actions: ['*'] },
        { resource: 'reports', actions: ['*'] }
      ],
      profile: {
        avatar: '',
        phone: '+1-555-0102',
        location: 'San Francisco, CA',
        department: 'Product',
        jobTitle: 'Product Manager',
        skills: ['Product Strategy', 'User Research', 'Data Analysis'],
        certifications: ['Certified Scrum Product Owner']
      },
      status: 'active',
      lastLoginAt: new Date('2025-08-13T08:30:00Z'),
      createdAt: new Date('2023-02-01T00:00:00Z'),
      updatedAt: new Date('2025-08-13T08:30:00Z')
    },
    {
      id: '3',
      email: 'lisa.rodriguez@company.com',
      firstName: 'Lisa',
      lastName: 'Rodriguez',
      organizationId: 'org-1',
      role: {
        id: 'lead-role',
        name: 'LEAD',
        level: 'lead',
        permissions: ['squads:read', 'squads:update', 'projects:read', 'projects:update']
      },
      permissions: [
        { resource: 'squads', actions: ['read', 'update'] },
        { resource: 'projects', actions: ['read', 'update'] }
      ],
      profile: {
        avatar: '',
        phone: '+1-555-0103',
        location: 'Austin, TX',
        department: 'Engineering',
        jobTitle: 'Engineering Team Lead',
        skills: ['React', 'Node.js', 'Team Leadership', 'Code Review'],
        certifications: ['AWS Developer Associate']
      },
      status: 'active',
      lastLoginAt: new Date('2025-08-12T16:45:00Z'),
      createdAt: new Date('2023-03-01T00:00:00Z'),
      updatedAt: new Date('2025-08-12T16:45:00Z')
    },
    {
      id: '4',
      email: 'david.park@company.com',
      firstName: 'David',
      lastName: 'Park',
      organizationId: 'org-1',
      role: {
        id: 'member-role',
        name: 'MEMBER',
        level: 'member',
        permissions: ['squads:read', 'projects:read']
      },
      permissions: [
        { resource: 'squads', actions: ['read'] },
        { resource: 'projects', actions: ['read'] }
      ],
      profile: {
        avatar: '',
        phone: '+1-555-0104',
        location: 'Seattle, WA',
        department: 'Engineering',
        jobTitle: 'Software Developer',
        skills: ['JavaScript', 'Python', 'Database Design', 'API Development'],
        certifications: []
      },
      status: 'active',
      lastLoginAt: new Date('2025-08-13T07:15:00Z'),
      createdAt: new Date('2023-04-15T00:00:00Z'),
      updatedAt: new Date('2025-08-13T07:15:00Z')
    }
  ];

  const initializeSampleRoles = () => [
    {
      id: 'admin-role',
      name: 'ADMIN',
      level: 'executive' as const,
      permissions: ['*'],
      description: 'Full system access with all permissions'
    },
    {
      id: 'manager-role',
      name: 'MANAGER',
      level: 'manager' as const,
      permissions: ['squads:*', 'users:read', 'users:update', 'projects:*', 'reports:*'],
      description: 'Squad and project management with user oversight'
    },
    {
      id: 'lead-role',
      name: 'LEAD',
      level: 'lead' as const,
      permissions: ['squads:read', 'squads:update', 'projects:read', 'projects:update'],
      description: 'Lead squads and manage projects'
    },
    {
      id: 'member-role',
      name: 'MEMBER',
      level: 'member' as const,
      permissions: ['squads:read', 'projects:read'],
      description: 'Basic team member access'
    },
    {
      id: 'viewer-role',
      name: 'VIEWER',
      level: 'viewer' as const,
      permissions: ['squads:read', 'projects:read', 'reports:read'],
      description: 'Read-only access to view information'
    }
  ];

  const loadUsersFromStorage = () => {
    try {
      const savedUsers = localStorage.getItem('userManagement_users');
      if (savedUsers) {
        setUsers(JSON.parse(savedUsers));
      } else {
        const sampleUsers = initializeSampleUsers();
        setUsers(sampleUsers);
        localStorage.setItem('userManagement_users', JSON.stringify(sampleUsers));
      }
    } catch (error) {
      console.error('Error loading users from localStorage:', error);
      const sampleUsers = initializeSampleUsers();
      setUsers(sampleUsers);
    }
  };

  const loadRolesFromStorage = () => {
    try {
      const savedRoles = localStorage.getItem('userManagement_roles');
      if (savedRoles) {
        setRoles(JSON.parse(savedRoles));
      } else {
        const sampleRoles = initializeSampleRoles();
        setRoles(sampleRoles);
        localStorage.setItem('userManagement_roles', JSON.stringify(sampleRoles));
      }
    } catch (error) {
      console.error('Error loading roles from localStorage:', error);
      const sampleRoles = initializeSampleRoles();
      setRoles(sampleRoles);
    }
  };

  const handleResetData = () => {
    localStorage.removeItem('userManagement_users');
    localStorage.removeItem('userManagement_roles');
    const sampleUsers = initializeSampleUsers();
    const sampleRoles = initializeSampleRoles();
    setUsers(sampleUsers);
    setRoles(sampleRoles);
    localStorage.setItem('userManagement_users', JSON.stringify(sampleUsers));
    localStorage.setItem('userManagement_roles', JSON.stringify(sampleRoles));
  };

  const handleAddUser = () => {
    setUserForm({
      email: '',
      firstName: '',
      lastName: '',
      roleId: '',
      department: '',
      jobTitle: '',
      location: '',
      phone: '',
      skills: '',
      status: 'active'
    });
    setEditingUser(null);
    setUserDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setUserForm({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roleId: user.role.id,
      department: user.profile.department,
      jobTitle: user.profile.jobTitle,
      location: user.profile.location,
      phone: user.profile.phone || '',
      skills: user.profile.skills.join(', '),
      status: user.status
    });
    setEditingUser(user);
    setUserDialogOpen(true);
  };

  const handleSaveUser = async () => {
    try {
      setLoading(true);
      setError('');

      // Validate required fields
      const validationErrors = [];
      if (!userForm.email) validationErrors.push('Email is required');
      if (!userForm.firstName || userForm.firstName.length < 2) validationErrors.push('First name must be at least 2 characters');
      if (!userForm.lastName || userForm.lastName.length < 2) validationErrors.push('Last name must be at least 2 characters');
      if (!userForm.roleId) validationErrors.push('Role is required');
      if (!userForm.department) validationErrors.push('Department is required');
      if (!userForm.jobTitle) validationErrors.push('Job title is required');
      if (!userForm.location) validationErrors.push('Location is required');

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (userForm.email && !emailRegex.test(userForm.email)) {
        validationErrors.push('Invalid email format');
      }

      if (validationErrors.length > 0) {
        setError('Validation errors: ' + validationErrors.join(', '));
        setLoading(false);
        return;
      }

      const selectedRole = roles.find(role => role.id === userForm.roleId);
      if (!selectedRole) {
        setError('Selected role not found');
        setLoading(false);
        return;
      }

      // Create user data with proper structure
      const userData: User = {
        id: editingUser ? editingUser.id : Date.now().toString(),
        email: userForm.email,
        firstName: userForm.firstName,
        lastName: userForm.lastName,
        organizationId: 'org-1',
        role: {
          id: selectedRole.id,
          name: selectedRole.name,
          level: selectedRole.level as 'executive' | 'manager' | 'lead' | 'member' | 'viewer',
          permissions: selectedRole.permissions
        },
        permissions: selectedRole.level === 'executive' 
          ? [{ resource: '*', actions: ['*'] }]
          : selectedRole.level === 'manager'
          ? [
              { resource: 'squads', actions: ['*'] },
              { resource: 'users', actions: ['read', 'update'] },
              { resource: 'projects', actions: ['*'] },
              { resource: 'reports', actions: ['*'] }
            ]
          : selectedRole.level === 'lead'
          ? [
              { resource: 'squads', actions: ['read', 'update'] },
              { resource: 'projects', actions: ['read', 'update'] }
            ]
          : [
              { resource: 'squads', actions: ['read'] },
              { resource: 'projects', actions: ['read'] }
            ],
        profile: {
          avatar: '',
          phone: userForm.phone || '',
          location: userForm.location,
          department: userForm.department,
          jobTitle: userForm.jobTitle,
          skills: userForm.skills.split(',').map(s => s.trim()).filter(Boolean),
          certifications: []
        },
        status: userForm.status as 'active' | 'inactive' | 'pending',
        lastLoginAt: editingUser?.lastLoginAt,
        createdAt: editingUser?.createdAt || new Date(),
        updatedAt: new Date()
      };

      let updatedUsers;
      if (editingUser) {
        updatedUsers = users.map(user => user.id === editingUser.id ? userData : user);
      } else {
        updatedUsers = [...users, userData];
      }

      setUsers(updatedUsers);
      localStorage.setItem('userManagement_users', JSON.stringify(updatedUsers));

      loadUsersFromStorage();
      setUserDialogOpen(false);
      setError('');
    } catch (error) {
      console.error('Failed to save user:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save user';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const updatedUsers = users.filter(user => user.id !== userId);
        setUsers(updatedUsers);
        localStorage.setItem('userManagement_users', JSON.stringify(updatedUsers));
      } catch (error) {
        console.error('Failed to delete user:', error);
        setError('Failed to delete user');
      }
    }
  };

  const handleAddRole = () => {
    setRoleForm({
      name: '',
      level: 'member',
      description: '',
      permissions: []
    });
    setEditingRole(null);
    setRoleDialogOpen(true);
  };

  const handleSaveRole = async () => {
    try {
      setLoading(true);
      
      const roleData: Role = {
        id: editingRole ? editingRole.id : Date.now().toString(),
        name: roleForm.name,
        level: roleForm.level,
        description: roleForm.description,
        permissions: roleForm.permissions
      };

      let updatedRoles;
      if (editingRole) {
        updatedRoles = roles.map(role => role.id === editingRole.id ? roleData : role);
      } else {
        updatedRoles = [...roles, roleData];
      }

      setRoles(updatedRoles);
      localStorage.setItem('userManagement_roles', JSON.stringify(updatedRoles));

      setRoleDialogOpen(false);
      setError('');
    } catch (error) {
      console.error('Failed to save role:', error);
      setError('Failed to save role');
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (level: string) => {
    switch (level) {
      case 'executive': return <AdminIcon color="error" />;
      case 'manager': return <ManagerIcon color="warning" />;
      case 'lead': return <TeamIcon color="info" />;
      case 'member': return <PersonIcon color="success" />;
      case 'viewer': return <ViewIcon color="disabled" />;
      default: return <PersonIcon />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          User Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<PermissionIcon />}
            onClick={handleAddRole}
            sx={{ mr: 2 }}
          >
            Add Role
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddUser}
          >
            Add User
          </Button>
          <Button
            variant="outlined"
            color="warning"
            onClick={handleResetData}
            sx={{ ml: 1 }}
          >
            Reset Data
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                {users.length}
              </Typography>
              <Typography variant="subtitle1">Total Users</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="success.main">
                {users.filter(u => u.status === 'active').length}
              </Typography>
              <Typography variant="subtitle1">Active Users</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="warning.main">
                {users.filter(u => u.status === 'pending').length}
              </Typography>
              <Typography variant="subtitle1">Pending Users</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" color="info.main">
                {roles.length}
              </Typography>
              <Typography variant="subtitle1">Roles Defined</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Users Table */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Users
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ mr: 2 }}>
                          {(user.firstName?.[0] || '?')}{(user.lastName?.[0] || '?')}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2">
                            {user.firstName || 'Unknown'} {user.lastName || 'User'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getRoleIcon(user.role.level)}
                        <Box sx={{ ml: 1 }}>
                          <Typography variant="subtitle2">
                            {user.role.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user.role.level}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.profile.department}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user.profile.jobTitle}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={user.status}
                        color={getStatusColor(user.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEditUser(user)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteUser(user.id)}
                        color="error"
                        disabled={user.id === currentUser?.id}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* User Dialog */}
      <Dialog open={userDialogOpen} onClose={() => setUserDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                fullWidth
                variant="outlined"
                value={userForm.firstName}
                onChange={(e) => setUserForm({...userForm, firstName: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                fullWidth
                variant="outlined"
                value={userForm.lastName}
                onChange={(e) => setUserForm({...userForm, lastName: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                value={userForm.email}
                onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Role *</InputLabel>
                <Select
                  value={userForm.roleId}
                  label="Role *"
                  onChange={(e) => setUserForm({...userForm, roleId: e.target.value})}
                >
                  {roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name} ({role.level})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={userForm.status}
                  label="Status"
                  onChange={(e) => setUserForm({...userForm, status: e.target.value as User['status']})}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Department"
                fullWidth
                variant="outlined"
                value={userForm.department}
                onChange={(e) => setUserForm({...userForm, department: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Job Title"
                fullWidth
                variant="outlined"
                value={userForm.jobTitle}
                onChange={(e) => setUserForm({...userForm, jobTitle: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Location"
                fullWidth
                variant="outlined"
                value={userForm.location}
                onChange={(e) => setUserForm({...userForm, location: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                fullWidth
                variant="outlined"
                value={userForm.phone}
                onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Skills (comma separated)"
                fullWidth
                variant="outlined"
                value={userForm.skills}
                onChange={(e) => setUserForm({...userForm, skills: e.target.value})}
                placeholder="React, TypeScript, Node.js, Python"
              />
            </Grid>
          </Grid>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUserDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveUser} variant="contained" disabled={loading}>
            {editingUser ? 'Update' : 'Create'} User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Role Dialog */}
      <Dialog open={roleDialogOpen} onClose={() => setRoleDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingRole ? 'Edit Role' : 'Add New Role'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Role Name"
                fullWidth
                variant="outlined"
                value={roleForm.name}
                onChange={(e) => setRoleForm({...roleForm, name: e.target.value})}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Level</InputLabel>
                <Select
                  value={roleForm.level}
                  label="Level"
                  onChange={(e) => setRoleForm({...roleForm, level: e.target.value as Role['level']})}
                >
                  <MenuItem value="executive">Executive</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="lead">Lead</MenuItem>
                  <MenuItem value="member">Member</MenuItem>
                  <MenuItem value="viewer">Viewer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                value={roleForm.description}
                onChange={(e) => setRoleForm({...roleForm, description: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Permissions
              </Typography>
              <Grid container spacing={1}>
                {availablePermissions.map((permission) => (
                  <Grid item xs={12} sm={6} md={4} key={permission}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={roleForm.permissions.includes(permission)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setRoleForm({
                                ...roleForm,
                                permissions: [...roleForm.permissions, permission]
                              });
                            } else {
                              setRoleForm({
                                ...roleForm,
                                permissions: roleForm.permissions.filter(p => p !== permission)
                              });
                            }
                          }}
                        />
                      }
                      label={permission}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRoleDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveRole} variant="contained" disabled={loading}>
            {editingRole ? 'Update' : 'Create'} Role
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
