import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  AppBar,
  Box,
  Drawer,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import { 
  AccountCircle,
  Dashboard as DashboardIcon,
  Assignment as TraceabilityIcon,
  Quiz as TestIcon,
  Business as BusinessIcon,
  Settings as TechnicalIcon,
  Group as SquadIcon,
  AccountBox as UserManagementIcon,
  Cloud as EnvironmentIcon,
  Rocket as ReleaseIcon,
  Category as ChapterIcon,
  Description as ApiIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  TrendingUp
} from '@mui/icons-material';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TraceabilityMatrix from './components/TraceabilityMatrix';
import TestResults from './components/TestResults';
import BusinessRequirementsDashboard from './components/BusinessRequirementsDashboard';
import TechnicalConfigurationDashboard from './components/TechnicalConfigurationDashboard';
import Squad from './components/Squad';
import UserManagement from './components/UserManagement';
import EnvironmentManagement from './components/EnvironmentManagement';
import ReleaseManagement from './components/ReleaseManagement';
import ChapterManagement from './components/ChapterManagement';
import ApiDocumentation from './components/ApiDocumentation';
import ApiTest from './components/ApiTest';
import UserAutocompleteDemo from './components/UserAutocompleteDemo';
import LiveProjectDashboard from './components/LiveProjectDashboard';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const AuthenticatedApp: React.FC = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [currentPage, setCurrentPage] = React.useState('dashboard');
  const [drawerOpen, setDrawerOpen] = React.useState(true);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'traceability':
        return <TraceabilityMatrix />;
      case 'test-results':
        return <TestResults />;
      case 'business-requirements':
        return <BusinessRequirementsDashboard />;
      case 'technical-configuration':
        return <TechnicalConfigurationDashboard />;
      case 'squad':
        return <Squad />;
      case 'user-management':
        return <UserManagement />;
      case 'environment':
        return <EnvironmentManagement />;
      case 'release':
        return <ReleaseManagement />;
      case 'chapter':
        return <ChapterManagement />;
      case 'api-docs':
        return <ApiDocumentation />;
      case 'api-test':
        return <ApiTest />;
      case 'user-autocomplete-demo':
        return <UserAutocompleteDemo />;
      case 'live-dashboard':
        return <LiveProjectDashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            TSR Enterprise Dashboard
          </Typography>
          <Typography variant="body1" sx={{ mr: 2 }}>
            Welcome, {user?.firstName || user?.email}
          </Typography>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{
          width: drawerOpen ? 280 : 80,
          flexShrink: 0,
          transition: 'width 0.3s ease',
          '& .MuiDrawer-paper': {
            width: drawerOpen ? 280 : 80,
            boxSizing: 'border-box',
            transition: 'width 0.3s ease',
            overflow: 'hidden',
          },
        }}
      >
        <Drawer
          variant="permanent"
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerOpen ? 280 : 80,
              boxSizing: 'border-box',
              transition: 'width 0.3s ease',
              backgroundColor: '#f8f9fa',
              borderRight: '1px solid #e0e0e0',
            },
          }}
        >
          <Toolbar />
          <Box sx={{ overflow: 'auto', p: 1 }}>
            {/* Toggle Button */}
            <Button 
              fullWidth 
              variant="outlined"
              onClick={() => setDrawerOpen(!drawerOpen)}
              sx={{ 
                mb: 2, 
                minHeight: 40,
                justifyContent: drawerOpen ? 'space-between' : 'center',
                transition: 'all 0.3s ease',
                '& .MuiButton-startIcon': { 
                  margin: drawerOpen ? '0 8px 0 0' : '0',
                }
              }}
              startIcon={drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
            >
              {drawerOpen && 'Collapse'}
            </Button>

            {/* OVERVIEW SECTION */}
            {drawerOpen && (
              <Typography variant="caption" sx={{ px: 1, py: 0.5, color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600 }}>
                OVERVIEW
              </Typography>
            )}
            
            <Tooltip title={!drawerOpen ? 'Dashboard' : ''} placement="right">
              <Button 
                fullWidth 
                variant={currentPage === 'dashboard' ? 'contained' : 'text'}
                onClick={() => setCurrentPage('dashboard')}
                sx={{ 
                  mb: 1, 
                  justifyContent: drawerOpen ? 'flex-start' : 'center',
                  minWidth: drawerOpen ? 'auto' : '56px',
                  transition: 'all 0.3s ease',
                  '& .MuiButton-startIcon': { 
                    margin: drawerOpen ? '0 8px 0 0' : '0',
                  }
                }}
                startIcon={<DashboardIcon />}
              >
                {drawerOpen && 'Dashboard'}
              </Button>
            </Tooltip>

            <Tooltip title={!drawerOpen ? 'Live Dashboard' : ''} placement="right">
              <Button 
                fullWidth 
                variant={currentPage === 'live-dashboard' ? 'contained' : 'text'}
                onClick={() => setCurrentPage('live-dashboard')}
                sx={{ 
                  mb: 1, 
                  justifyContent: drawerOpen ? 'flex-start' : 'center',
                  minWidth: drawerOpen ? 'auto' : '56px',
                  transition: 'all 0.3s ease',
                  '& .MuiButton-startIcon': { 
                    margin: drawerOpen ? '0 8px 0 0' : '0',
                  }
                }}
                startIcon={<TrendingUp />}
              >
                {drawerOpen && 'Live Dashboard'}
              </Button>
            </Tooltip>

            {/* PROJECT MANAGEMENT SECTION */}
            <Divider sx={{ my: 1 }} />
            {drawerOpen && (
              <Typography variant="caption" sx={{ px: 1, py: 0.5, color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600 }}>
                PROJECT MANAGEMENT
              </Typography>
            )}
            
            <Tooltip title={!drawerOpen ? 'Business Requirements' : ''} placement="right">
              <Button 
                fullWidth 
                variant={currentPage === 'business-requirements' ? 'contained' : 'text'}
                onClick={() => setCurrentPage('business-requirements')}
                sx={{ 
                  mb: 1, 
                  justifyContent: drawerOpen ? 'flex-start' : 'center',
                  minWidth: drawerOpen ? 'auto' : '56px',
                  transition: 'all 0.3s ease',
                  '& .MuiButton-startIcon': { 
                    margin: drawerOpen ? '0 8px 0 0' : '0',
                  }
                }}
                startIcon={<BusinessIcon />}
              >
                {drawerOpen && 'Business Requirements'}
              </Button>
            </Tooltip>
            
            <Tooltip title={!drawerOpen ? 'Tech Stack' : ''} placement="right">
              <Button 
                fullWidth 
                variant={currentPage === 'technical-configuration' ? 'contained' : 'text'}
                onClick={() => setCurrentPage('technical-configuration')}
                sx={{ 
                  mb: 1, 
                  justifyContent: drawerOpen ? 'flex-start' : 'center',
                  minWidth: drawerOpen ? 'auto' : '56px',
                  transition: 'all 0.3s ease',
                  '& .MuiButton-startIcon': { 
                    margin: drawerOpen ? '0 8px 0 0' : '0',
                  }
                }}
                startIcon={<TechnicalIcon />}
              >
                {drawerOpen && 'Tech Stack'}
              </Button>
            </Tooltip>

            <Tooltip title={!drawerOpen ? 'Release Management' : ''} placement="right">
              <Button 
                fullWidth 
                variant={currentPage === 'release' ? 'contained' : 'text'}
                onClick={() => setCurrentPage('release')}
                sx={{ 
                  mb: 1, 
                  justifyContent: drawerOpen ? 'flex-start' : 'center',
                  minWidth: drawerOpen ? 'auto' : '56px',
                  transition: 'all 0.3s ease',
                  '& .MuiButton-startIcon': { 
                    margin: drawerOpen ? '0 8px 0 0' : '0',
                  }
                }}
                startIcon={<ReleaseIcon />}
              >
                {drawerOpen && 'Release Management'}
              </Button>
            </Tooltip>

            <Tooltip title={!drawerOpen ? 'Environment Management' : ''} placement="right">
              <Button 
                fullWidth 
                variant={currentPage === 'environment' ? 'contained' : 'text'}
                onClick={() => setCurrentPage('environment')}
                sx={{ 
                  mb: 1, 
                  justifyContent: drawerOpen ? 'flex-start' : 'center',
                  minWidth: drawerOpen ? 'auto' : '56px',
                  transition: 'all 0.3s ease',
                  '& .MuiButton-startIcon': { 
                    margin: drawerOpen ? '0 8px 0 0' : '0',
                  }
                }}
                startIcon={<EnvironmentIcon />}
              >
                {drawerOpen && 'Environment Management'}
              </Button>
            </Tooltip>

            {/* TEAM MANAGEMENT SECTION */}
            <Divider sx={{ my: 1 }} />
            {drawerOpen && (
              <Typography variant="caption" sx={{ px: 1, py: 0.5, color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600 }}>
                TEAM MANAGEMENT
              </Typography>
            )}
            
            <Tooltip title={!drawerOpen ? 'User Management' : ''} placement="right">
              <Button 
                fullWidth 
                variant={currentPage === 'user-management' ? 'contained' : 'text'}
                onClick={() => setCurrentPage('user-management')}
                sx={{ 
                  mb: 1, 
                  justifyContent: drawerOpen ? 'flex-start' : 'center',
                  minWidth: drawerOpen ? 'auto' : '56px',
                  transition: 'all 0.3s ease',
                  '& .MuiButton-startIcon': { 
                    margin: drawerOpen ? '0 8px 0 0' : '0',
                  }
                }}
                startIcon={<UserManagementIcon />}
              >
                {drawerOpen && 'User Management'}
              </Button>
            </Tooltip>
            
            <Tooltip title={!drawerOpen ? 'Squad Management' : ''} placement="right">
              <Button 
                fullWidth 
                variant={currentPage === 'squad' ? 'contained' : 'text'}
                onClick={() => setCurrentPage('squad')}
                sx={{ 
                  mb: 1, 
                  justifyContent: drawerOpen ? 'flex-start' : 'center',
                  minWidth: drawerOpen ? 'auto' : '56px',
                  transition: 'all 0.3s ease',
                  '& .MuiButton-startIcon': { 
                    margin: drawerOpen ? '0 8px 0 0' : '0',
                  }
                }}
                startIcon={<SquadIcon />}
              >
                {drawerOpen && 'Squad Management'}
              </Button>
            </Tooltip>

            <Tooltip title={!drawerOpen ? 'Chapter Management' : ''} placement="right">
              <Button 
                fullWidth 
                variant={currentPage === 'chapter' ? 'contained' : 'text'}
                onClick={() => setCurrentPage('chapter')}
                sx={{ 
                  mb: 1, 
                  justifyContent: drawerOpen ? 'flex-start' : 'center',
                  minWidth: drawerOpen ? 'auto' : '56px',
                  transition: 'all 0.3s ease',
                  '& .MuiButton-startIcon': { 
                    margin: drawerOpen ? '0 8px 0 0' : '0',
                  }
                }}
                startIcon={<ChapterIcon />}
              >
                {drawerOpen && 'Chapter Management'}
              </Button>
            </Tooltip>

            {/* QUALITY ASSURANCE SECTION */}
            <Divider sx={{ my: 1 }} />
            {drawerOpen && (
              <Typography variant="caption" sx={{ px: 1, py: 0.5, color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600 }}>
                QUALITY ASSURANCE
              </Typography>
            )}
            
            <Tooltip title={!drawerOpen ? 'Traceability Matrix' : ''} placement="right">
              <Button 
                fullWidth 
                variant={currentPage === 'traceability' ? 'contained' : 'text'}
                onClick={() => setCurrentPage('traceability')}
                sx={{ 
                  mb: 1, 
                  justifyContent: drawerOpen ? 'flex-start' : 'center',
                  minWidth: drawerOpen ? 'auto' : '56px',
                  transition: 'all 0.3s ease',
                  '& .MuiButton-startIcon': { 
                    margin: drawerOpen ? '0 8px 0 0' : '0',
                  }
                }}
                startIcon={<TraceabilityIcon />}
              >
                {drawerOpen && 'Traceability Matrix'}
              </Button>
            </Tooltip>

            <Tooltip title={!drawerOpen ? 'Test Results' : ''} placement="right">
              <Button 
                fullWidth 
                variant={currentPage === 'test-results' ? 'contained' : 'text'}
                onClick={() => setCurrentPage('test-results')}
                sx={{ 
                  mb: 1, 
                  justifyContent: drawerOpen ? 'flex-start' : 'center',
                  minWidth: drawerOpen ? 'auto' : '56px',
                  transition: 'all 0.3s ease',
                  '& .MuiButton-startIcon': { 
                    margin: drawerOpen ? '0 8px 0 0' : '0',
                  }
                }}
                startIcon={<TestIcon />}
              >
                {drawerOpen && 'Test Results'}
              </Button>
            </Tooltip>

            {/* API & DEVELOPMENT SECTION */}
            <Divider sx={{ my: 1 }} />
            {drawerOpen && (
              <Typography variant="caption" sx={{ px: 1, py: 0.5, color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600 }}>
                API & DEVELOPMENT
              </Typography>
            )}
            
            <Tooltip title={!drawerOpen ? 'API Documentation' : ''} placement="right">
              <Button
                fullWidth
                variant={currentPage === 'api-docs' ? 'contained' : 'text'}
                onClick={() => setCurrentPage('api-docs')}
                sx={{ 
                  mb: 1, 
                  justifyContent: drawerOpen ? 'flex-start' : 'center',
                  minWidth: drawerOpen ? 'auto' : '56px',
                  transition: 'all 0.3s ease',
                  '& .MuiButton-startIcon': { 
                    margin: drawerOpen ? '0 8px 0 0' : '0',
                  }
                }}
                startIcon={<ApiIcon />}
              >
                {drawerOpen && 'API Documentation'}
              </Button>
            </Tooltip>
            
            <Tooltip title={!drawerOpen ? 'API Test' : ''} placement="right">
              <Button
                fullWidth
                variant={currentPage === 'api-test' ? 'contained' : 'text'}
                onClick={() => setCurrentPage('api-test')}
                sx={{ 
                  mb: 1, 
                  justifyContent: drawerOpen ? 'flex-start' : 'center',
                  minWidth: drawerOpen ? 'auto' : '56px',
                  transition: 'all 0.3s ease',
                  '& .MuiButton-startIcon': { 
                    margin: drawerOpen ? '0 8px 0 0' : '0',
                  }
                }}
                startIcon={<ApiIcon />}
              >
                {drawerOpen && 'API Test'}
              </Button>
            </Tooltip>

            {/* DEMO & UTILITIES SECTION */}
            <Divider sx={{ my: 1 }} />
            {drawerOpen && (
              <Typography variant="caption" sx={{ px: 1, py: 0.5, color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600 }}>
                DEMO & UTILITIES
              </Typography>
            )}
            
            <Tooltip title={!drawerOpen ? 'User Selection Demo' : ''} placement="right">
              <Button
                fullWidth
                variant={currentPage === 'user-autocomplete-demo' ? 'contained' : 'text'}
                onClick={() => setCurrentPage('user-autocomplete-demo')}
                sx={{ 
                  mb: 1, 
                  justifyContent: drawerOpen ? 'flex-start' : 'center',
                  minWidth: drawerOpen ? 'auto' : '56px',
                  transition: 'all 0.3s ease',
                  '& .MuiButton-startIcon': { 
                    margin: drawerOpen ? '0 8px 0 0' : '0',
                  }
                }}
                startIcon={<UserManagementIcon />}
              >
                {drawerOpen && 'User Selection Demo'}
              </Button>
            </Tooltip>
          </Box>
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          mt: 8, // Account for AppBar height
          ml: drawerOpen ? '280px' : '80px', // Account for dynamic Sidebar width
          transition: 'margin-left 0.3s ease',
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppWrapper />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

const AppWrapper: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return user ? <AuthenticatedApp /> : <Login />;
};

export default App;
