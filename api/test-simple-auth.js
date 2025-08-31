const axios = require('axios');

const BASE_URL = 'http://localhost:3002/api/v1';

async function testSimpleAuth() {
  console.log('🔐 Testing Simple Authentication...\n');

  // Test 1: Check if server is running
  console.log('🌐 Step 1: Checking if server is running...');
  try {
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Server is running');
  } catch (error) {
    console.error('❌ Server is not running or health endpoint not available');
    console.error('Error:', error.message);
    return;
  }

  // Test 2: Try to register a new user
  console.log('\n👤 Step 2: Registering a new test user...');
  const testUser = {
    email: `auth-test-${Date.now()}@example.com`,
    password: 'Password123!',
    confirmPassword: 'Password123!',
    firstName: 'Auth',
    lastName: 'Tester',
    phone: `+258${Date.now().toString().slice(-9)}`,
    role: 'buyer'
  };

  try {
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
    console.log(`✅ User registered: ${testUser.email}`);
    console.log('Token:', registerResponse.data.data?.token ? 'Available' : 'Not found');
  } catch (error) {
    console.error('❌ Registration failed:', error.response?.data || error.message);
    return;
  }

  // Test 3: Try to login
  console.log('\n🔑 Step 3: Testing login...');
  try {
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    
    const token = loginResponse.data.data?.token || loginResponse.data.token;
    console.log(`✅ Login successful!`);
    console.log(`Token: ${token ? token.substring(0, 20) + '...' : 'Not found'}`);
    
    // Test 4: Use token for authenticated endpoint
    console.log('\n🔒 Step 4: Testing authenticated endpoint...');
    try {
      const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Authenticated endpoint works!');
      console.log('User profile:', profileResponse.data.data?.user?.email);
    } catch (error) {
      console.error('❌ Authenticated endpoint failed:', error.response?.data || error.message);
    }
    
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
  }

  console.log('\n✅ Authentication testing completed!');
}

testSimpleAuth().catch(console.error);
