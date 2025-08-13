import React, { useState } from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { 
  Menu as MenuIcon, 
  Dashboard as DashboardIcon, 
  Timeline as TimelineIcon, 
  BugReport as BugReportIcon, 
  Api as ApiIcon,
  Business as BusinessIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import Dashboard from './components/Dashboard';
import TraceabilityMatrix from './components/TraceabilityMatrix';
import TestResults from './components/TestResults';
import ApiDocumentation from './components/ApiDocumentation';
import BusinessRequirementsDashboard from './components/BusinessRequirementsDashboard';
import TechnicalConfigurationDashboard from './components/TechnicalConfigurationDashboard';

const drawerWidth = 240;

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuClick = (view: string) => {
    setCurrentView(view);
    setDrawerOpen(false);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'traceability':
        return <TraceabilityMatrix />;
      case 'tests':
        return <TestResults />;
      case 'api':
        return <ApiDocumentation />;
      case 'business':
        return <BusinessRequirementsDashboard />;
      case 'technical':
        return <TechnicalConfigurationDashboard />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Requirement Traceability Matrix System
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button onClick={() => handleMenuClick('dashboard')}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItem>
            <ListItem button onClick={() => handleMenuClick('traceability')}>
              <ListItemIcon>
                <TimelineIcon />
              </ListItemIcon>
              <ListItemText primary="Traceability Matrix" />
            </ListItem>
            <ListItem button onClick={() => handleMenuClick('tests')}>
              <ListItemIcon>
                <BugReportIcon />
              </ListItemIcon>
              <ListItemText primary="Test Results" />
            </ListItem>
            <ListItem button onClick={() => handleMenuClick('api')}>
              <ListItemIcon>
                <ApiIcon />
              </ListItemIcon>
              <ListItemText primary="API Documentation" />
            </ListItem>
            <Divider />
            <ListItem button onClick={() => handleMenuClick('business')}>
              <ListItemIcon>
                <BusinessIcon />
              </ListItemIcon>
              <ListItemText primary="Business Requirements" />
            </ListItem>
            <ListItem button onClick={() => handleMenuClick('technical')}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Tech Stack" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {renderCurrentView()}
      </Box>
    </Box>
  );
}

export default App;
