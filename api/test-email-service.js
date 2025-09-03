const axios = require('axios');

const BASE_URL = 'http://localhost:3002/api/v1';

async function testEmailService() {
  console.log('🧪 Testing Email Service...\n');

  try {
    // Test 1: Check email service status
    console.log('1. Checking email service status...');
    const statusResponse = await axios.get(`${BASE_URL}/email/status`);
    console.log('✅ Status:', statusResponse.data);
    console.log('');

    // Test 2: Test email service
    console.log('2. Testing email service...');
    const testResponse = await axios.post(`${BASE_URL}/email/test`, {
      email: 'test@example.com'
    });
    console.log('✅ Test result:', testResponse.data);
    console.log('');

    // Test 3: Send welcome email
    console.log('3. Sending welcome email...');
    const welcomeResponse = await axios.post(`${BASE_URL}/email/welcome`, {
      email: 'test@example.com',
      firstName: 'Test User'
    });
    console.log('✅ Welcome email result:', welcomeResponse.data);
    console.log('');

    // Test 4: Send password reset email
    console.log('4. Sending password reset email...');
    const resetResponse = await axios.post(`${BASE_URL}/email/password-reset`, {
      email: 'test@example.com',
      firstName: 'Test User',
      resetToken: 'test-reset-token-123'
    });
    console.log('✅ Password reset email result:', resetResponse.data);
    console.log('');

    console.log('🎉 All email service tests completed successfully!');

  } catch (error) {
    console.error('❌ Email service test failed:', error.response?.data || error.message);
  }
}

// Run the test
testEmailService();
