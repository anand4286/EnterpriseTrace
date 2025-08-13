import React from 'react';
import {
  Box,
  Typography,
  Alert
} from '@mui/material';

const ReleaseManagement: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Release Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Manage release planning, squad readiness, risk assessment, and timeline tracking.
      </Typography>
      <Alert severity="info">
        This component includes:
        <br />• Release Overview with progress tracking
        <br />• Squad Readiness management
        <br />• Risk Management and assessment
        <br />• Timeline view with calendar integration
        <br />• Environment booking visualization
      </Alert>
    </Box>
  );
};

export default ReleaseManagement;
