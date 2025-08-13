import React, { useState, useEffect } from 'react';
import { apiCall } from '../utils/api';

const ApiTest: React.FC = () => {
  const [rolesData, setRolesData] = useState<any>(null);
  const [healthData, setHealthData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const testHealthAPI = async () => {
    try {
      console.log('Testing /health endpoint...');
      const response = await fetch('/health');
      const data = await response.text();
      console.log('Health API Response:', data);
      setHealthData(data);
    } catch (err) {
      console.error('Health API Error:', err);
    }
  };

  const testRolesAPI = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing /api/roles endpoint...');
      const response = await apiCall('/api/roles');
      console.log('API Response:', response);
      setRolesData(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('API Test Error:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testHealthAPI();
    testRolesAPI();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>API Test - Backend Connection</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={testHealthAPI}>Test /health</button>
        {healthData && (
          <div style={{ marginTop: '10px' }}>
            <strong>Health Check:</strong> {String(healthData)}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={testRolesAPI} disabled={loading}>
          {loading ? 'Testing...' : 'Test /api/roles'}
        </button>
        
        {error && (
          <div style={{ color: 'red', marginTop: '10px' }}>
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {rolesData && (
          <div style={{ marginTop: '10px' }}>
            <strong>Success! Response:</strong>
            <pre style={{ background: '#f5f5f5', padding: '10px', marginTop: '5px' }}>
              {JSON.stringify(rolesData, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div>
        <h3>Expected Roles:</h3>
        <ul>
          <li>ADMIN (executive level)</li>
          <li>MANAGER (manager level)</li>
          <li>LEAD (lead level)</li>
          <li>MEMBER (member level)</li>
          <li>VIEWER (viewer level)</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiTest;
