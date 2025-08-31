const axios = require('axios');

const BASE_URL = 'http://localhost:3002/api/v1';

// Test with the user from the last test
const testUser = {
  email: 'reviewer_1756647187149@test.com',
  password: 'Password123!'
};

async function debugUserId() {
  console.log('🔍 Debugging User ID format...\n');

  // Step 1: Login user
  console.log('📝 Step 1: Logging in user...');
  let userToken = null;
  
  try {
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, testUser);
    userToken = loginResponse.data.data?.token || loginResponse.data.token;
    console.log(`✅ User logged in: ${testUser.email}`);
    
    // Decode JWT token to see user info
    const tokenParts = userToken.split('.');
    if (tokenParts.length === 3) {
      const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
      console.log('🔍 JWT Payload:', JSON.stringify(payload, null, 2));
      console.log(`🔍 User ID from JWT: ${payload.userId}`);
    }
  } catch (error) {
    console.error('❌ Failed to login user:', error.response?.data || error.message);
    return;
  }

  // Step 2: Get user profile to see user ID
  console.log('\n👤 Step 2: Getting user profile...');
  
  try {
    const profileResponse = await axios.get(`${BASE_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    
    console.log('🔍 User Profile:', JSON.stringify(profileResponse.data, null, 2));
    console.log(`🔍 User ID from profile: ${profileResponse.data.data?.user?._id || profileResponse.data.user?._id}`);
  } catch (error) {
    console.error('❌ Failed to get user profile:', error.response?.data || error.message);
  }

  // Step 3: Get the order to see its user ID
  console.log('\n📦 Step 3: Getting order details...');
  
  try {
    const orderId = '68b44f15c0dddb5db36ac8bf'; // From the last test
    const orderResponse = await axios.get(`${BASE_URL}/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    
    console.log('🔍 Order Details:', JSON.stringify(orderResponse.data, null, 2));
    console.log(`🔍 Order User ID: ${orderResponse.data.data?.order?.userId || orderResponse.data.order?.userId}`);
  } catch (error) {
    console.error('❌ Failed to get order details:', error.response?.data || error.message);
  }
}

debugUserId().catch(console.error);
