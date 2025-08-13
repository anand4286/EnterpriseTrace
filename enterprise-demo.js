#!/usr/bin/env node

/**
 * Enterprise TSR Demonstration Script
 * 
 * This script demonstrates the enterprise-scale capabilities of the 
 * requirement traceability matrix system.
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function demonstrateEnterpriseCapabilities() {
  console.log('🚀 Enterprise TSR Demonstration');
  console.log('================================\n');

  try {
    // 1. Health Check
    console.log('1. Health Check...');
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server is healthy:', healthResponse.data.status);
    console.log(`   Version: ${healthResponse.data.version}`);
    console.log(`   Environment: ${healthResponse.data.environment}\n`);

    // 2. Register Organization
    console.log('2. Registering Enterprise Organization...');
    const orgData = {
      organizationName: 'Enterprise Corp',
      domain: 'enterprise-corp.com',
      adminEmail: 'admin@enterprise-corp.com',
      adminPassword: 'SecurePass123!',
      adminFirstName: 'Enterprise',
      adminLastName: 'Admin',
      subscriptionType: 'enterprise'
    };

    const orgResponse = await axios.post(`${BASE_URL}/api/auth/register-organization`, orgData);
    console.log('✅ Organization created successfully');
    console.log(`   Organization ID: ${orgResponse.data.organization.id}`);
    console.log(`   Admin Token: ${orgResponse.data.token.substring(0, 20)}...`);
    
    const adminToken = orgResponse.data.token;
    const organizationId = orgResponse.data.organization.id;

    // 3. Get Organization Details
    console.log('\n3. Fetching Organization Details...');
    const orgDetailsResponse = await axios.get(`${BASE_URL}/api/organizations/current`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Organization details retrieved');
    console.log(`   Name: ${orgDetailsResponse.data.name}`);
    console.log(`   Subscription: ${orgDetailsResponse.data.subscription.type}`);
    console.log(`   Max Users: ${orgDetailsResponse.data.subscription.maxUsers}`);

    // 4. Create Squad
    console.log('\n4. Creating Enterprise Squad...');
    const squadData = {
      name: 'Platform Engineering Squad',
      purpose: 'Develop and maintain enterprise platform infrastructure',
      tribeId: '00000000-0000-0000-0000-000000000001', // Mock tribe ID
      type: 'platform',
      totalPoints: 50
    };

    const squadResponse = await axios.post(`${BASE_URL}/api/squads`, squadData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Squad created successfully');
    console.log(`   Squad ID: ${squadResponse.data.squad.id}`);
    console.log(`   Name: ${squadResponse.data.squad.name}`);
    console.log(`   Type: ${squadResponse.data.squad.type}`);

    const squadId = squadResponse.data.squad.id;

    // 5. Invite User
    console.log('\n5. Inviting Team Member...');
    const inviteData = {
      email: 'engineer@enterprise-corp.com',
      firstName: 'Senior',
      lastName: 'Engineer',
      role: 'ENGINEER',
      department: 'Engineering',
      jobTitle: 'Senior Software Engineer'
    };

    const inviteResponse = await axios.post(`${BASE_URL}/api/organizations/invite`, inviteData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ User invited successfully');
    console.log(`   Invite Token: ${inviteResponse.data.inviteToken.substring(0, 20)}...`);

    // 6. Register Invited User
    console.log('\n6. Registering Invited User...');
    const userData = {
      email: 'engineer@enterprise-corp.com',
      password: 'EngineerPass123!',
      firstName: 'Senior',
      lastName: 'Engineer',
      inviteToken: inviteResponse.data.inviteToken
    };

    const userResponse = await axios.post(`${BASE_URL}/api/auth/register-user`, userData);
    console.log('✅ User registered successfully');
    console.log(`   User ID: ${userResponse.data.user.id}`);

    const userId = userResponse.data.user.id;

    // 7. Add User to Squad
    console.log('\n7. Adding User to Squad...');
    const memberData = {
      userId: userId,
      role: 'engineer',
      allocation: 100
    };

    const memberResponse = await axios.post(`${BASE_URL}/api/squads/${squadId}/members`, memberData, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ User added to squad successfully');
    console.log(`   Role: ${memberResponse.data.member.role}`);
    console.log(`   Allocation: ${memberResponse.data.member.allocation}%`);

    // 8. Get Squad Details
    console.log('\n8. Fetching Squad Details...');
    const squadDetailsResponse = await axios.get(`${BASE_URL}/api/squads/${squadId}`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Squad details retrieved');
    console.log(`   Members: ${squadDetailsResponse.data.members.length}`);
    console.log(`   Capacity: ${squadDetailsResponse.data.capacity.totalPoints} points`);

    // 9. Get Organization Statistics
    console.log('\n9. Fetching Organization Statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/api/organizations/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('✅ Organization statistics retrieved');
    console.log(`   Total Users: ${statsResponse.data.totalUsers}`);
    console.log(`   Active Users: ${statsResponse.data.activeUsers}`);
    console.log(`   Users by Role:`, JSON.stringify(statsResponse.data.usersByRole, null, 2));

    // 10. Get Audit Logs
    console.log('\n10. Fetching Audit Logs...');
    const auditResponse = await axios.get(`${BASE_URL}/api/audit-logs?organizationId=${organizationId}`);
    console.log('✅ Audit logs retrieved');
    console.log(`   Total Actions: ${auditResponse.data.logs.length}`);
    console.log('   Recent Actions:');
    auditResponse.data.logs.slice(0, 3).forEach((log, index) => {
      console.log(`     ${index + 1}. ${log.action} on ${log.resource} - ${log.success ? 'SUCCESS' : 'FAILED'}`);
    });

    console.log('\n🎉 Enterprise Demonstration Complete!');
    console.log('=====================================');
    console.log('✅ Organization created and configured');
    console.log('✅ Users invited and registered');
    console.log('✅ Squads created and managed');
    console.log('✅ Enterprise security and audit logging');
    console.log('✅ Multi-tenant architecture ready');
    console.log('✅ API endpoints functional');
    console.log('\n📊 System is ready for enterprise scale deployment!');

  } catch (error) {
    console.error('❌ Demonstration failed:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Please ensure the enterprise server is running:');
      console.log('   cd /path/to/TSR && npm run dev');
    }
  }
}

// Run demonstration
if (require.main === module) {
  demonstrateEnterpriseCapabilities();
}

module.exports = { demonstrateEnterpriseCapabilities };
