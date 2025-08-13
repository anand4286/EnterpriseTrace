import React from 'react';
import {
  Box,
  Typography,
  Alert
} from '@mui/material';

const TraceabilityMatrix: React.FC = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Requirement Traceability Matrix (RTM)
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Comprehensive User Journey-based requirement traceability system.
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Planned RTM Features:
        </Typography>
        • User Journey as parent hierarchy structure
        <br />• Business scenarios with detailed requirement mapping
        <br />• Test case linking and coverage tracking  
        <br />• Technical stack and channel documentation
        <br />• Testing type categorization and environment management
        <br />• Integration with JIRA, Confluence, and GitHub
        <br />• Defect linking and test execution results
      </Alert>
    </Box>
  );
};

export default TraceabilityMatrix;
