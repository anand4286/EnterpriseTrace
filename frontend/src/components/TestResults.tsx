import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  LinearProgress,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  CircularProgress
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiCall } from '../utils/api';

interface TestSuite {
  name: string;
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: string;
  status: 'passed' | 'failed' | 'running';
}

const TestResults: React.FC = () => {
  const [testData, setTestData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTestResults();
  }, []);

  const fetchTestResults = async () => {
    try {
      setLoading(true);
      const result = await apiCall('/api/test/results');
      setTestData(result.data);
    } catch (err) {
      console.error('Error fetching test results:', err);
      setError('Failed to load test results. Using mock data.');
      
      // Use mock data as fallback
      setTestData({
        summary: {
          totalTests: 45,
          passed: 38,
          failed: 5,
          skipped: 2,
          passRate: 84.4,
          totalDuration: '2m 15s',
          lastRun: new Date().toISOString()
        },
        suites: [
          { name: 'API Tests', total: 20, passed: 18, failed: 2, skipped: 0, duration: '45s', status: 'failed' },
          { name: 'UI Tests', total: 15, passed: 12, failed: 2, skipped: 1, duration: '1m 20s', status: 'failed' },
          { name: 'Integration Tests', total: 10, passed: 8, failed: 1, skipped: 1, duration: '10s', status: 'failed' }
        ],
        chartData: [
          { name: 'API Tests', passed: 18, failed: 2, skipped: 0 },
          { name: 'UI Tests', passed: 12, failed: 2, skipped: 1 },
          { name: 'Integration', passed: 8, failed: 1, skipped: 1 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const runTests = async () => {
    try {
      setLoading(true);
      await apiCall('/api/test/execute', {
        method: 'POST',
        body: JSON.stringify({ suite: 'all' })
      });
      
      setTimeout(fetchTestResults, 2000); // Refresh after 2 seconds
    } catch (err) {
      console.error('Error running tests:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'success';
      case 'failed': return 'error';
      case 'running': return 'warning';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Test Results & Analytics
      </Typography>
      
      {error && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {testData?.summary && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="primary">Total Tests</Typography>
                <Typography variant="h3">{testData.summary.totalTests}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="success.main">Passed</Typography>
                <Typography variant="h3">{testData.summary.passed}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6" color="error.main">Failed</Typography>
                <Typography variant="h3">{testData.summary.failed}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography variant="h6">Pass Rate</Typography>
                <Typography variant="h3">{testData.summary.passRate}%</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={testData.summary.passRate} 
                  color="success"
                  sx={{ mt: 1 }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {testData?.chartData && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Test Results by Suite</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={testData.chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="passed" fill="#4caf50" name="Passed" />
                <Bar dataKey="failed" fill="#f44336" name="Failed" />
                <Bar dataKey="skipped" fill="#ff9800" name="Skipped" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Test Suites</Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Suite Name</strong></TableCell>
                  <TableCell><strong>Total</strong></TableCell>
                  <TableCell><strong>Passed</strong></TableCell>
                  <TableCell><strong>Failed</strong></TableCell>
                  <TableCell><strong>Skipped</strong></TableCell>
                  <TableCell><strong>Duration</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {testData?.suites?.map((suite: TestSuite, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{suite.name}</TableCell>
                    <TableCell>{suite.total}</TableCell>
                    <TableCell>{suite.passed}</TableCell>
                    <TableCell>{suite.failed}</TableCell>
                    <TableCell>{suite.skipped}</TableCell>
                    <TableCell>{suite.duration}</TableCell>
                    <TableCell>
                      <Chip 
                        label={suite.status} 
                        color={getStatusColor(suite.status) as any}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          onClick={runTests}
          disabled={loading}
        >
          Run All Tests
        </Button>
        <Button 
          variant="outlined" 
          onClick={fetchTestResults}
          disabled={loading}
        >
          Refresh Results
        </Button>
      </Box>
    </Box>
  );
};

export default TestResults;
