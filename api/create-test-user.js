const axios = require('axios');

const BASE_URL = 'http://localhost:3002/api/v1';

const testUser = {
  email: 'review-test@example.com',
  password: 'Password123!',
  confirmPassword: 'Password123!',
  firstName: 'Review',
  lastName: 'Tester',
  phone: '+258123456789',
  role: 'buyer'
};

async function createTestUser() {
  console.log('👤 Creating test user for review authentication...\n');

  try {
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
    console.log(`✅ Test user created: ${testUser.email}`);
    console.log('Response:', JSON.stringify(registerResponse.data, null, 2));
    
    console.log('\n🔑 Test User Credentials:');
    console.log(`   Email: ${testUser.email}`);
    console.log(`   Password: ${testUser.password}`);
    console.log(`   Role: ${testUser.role}`);
    
  } catch (error) {
    if (error.response?.data?.message?.includes('already exists')) {
      console.log(`⚠️  User ${testUser.email} already exists, proceeding with login test...`);
    } else {
      console.error('❌ Failed to create test user:', error.response?.data || error.message);
      return;
    }
  }

  // Test login
  console.log('\n🔐 Testing login with test user...');
  try {
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    
    const token = loginResponse.data.data?.token || loginResponse.data.token;
    console.log(`✅ Login successful! Token: ${token.substring(0, 20)}...`);
    
    console.log('\n✅ Test user is ready for authentication testing!');
    console.log('📊 Summary:');
    console.log(`   - Email: ${testUser.email}`);
    console.log(`   - Password: ${testUser.password}`);
    console.log(`   - Token: Available for testing`);
    console.log(`   - Ready for review API testing`);
    
  } catch (error) {
    console.error('❌ Failed to login test user:', error.response?.data || error.message);
  }
}

createTestUser().catch(console.error);
