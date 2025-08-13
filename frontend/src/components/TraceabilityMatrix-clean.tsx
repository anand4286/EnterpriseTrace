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
        Requirement Traceability Matrix
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Track requirements from User Journeys through Business Scenarios to Test Cases with comprehensive linking to JIRA, Confluence, and GitHub.
      </Typography>
      <Alert severity="info">
        This component is being redesigned with the comprehensive User Journey → Business Scenario → Test Case hierarchy.
        The full implementation will include:
        <br />• User Journey management with personas and priorities
        <br />• Business Scenario tracking with acceptance criteria
        <br />• Test Case linking with automation status
        <br />• Tech Stack and Channel coverage
        <br />• JIRA, Confluence, and GitHub integration
        <br />• Defect linking and test execution results
      </Alert>
    </Box>
  );
};

export default TraceabilityMatrix;
