import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountTree,
  Assessment,
  Description,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Traceability Matrix', icon: <AccountTree />, path: '/traceability' },
  { text: 'Test Results', icon: <Assessment />, path: '/test-results' },
  { text: 'API Documentation', icon: <Description />, path: '/api-docs' },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#f8f9fa',
          borderRight: '1px solid #e0e0e0',
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: '#e3f2fd',
                    '&:hover': {
                      backgroundColor: '#bbdefb',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
