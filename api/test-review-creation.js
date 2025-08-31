const axios = require('axios');

const BASE_URL = 'http://localhost:3002/api/v1';

// Test data
const testUser = {
  email: 'reviewer_1756647187149@test.com',
  password: 'Password123!'
};

const reviewData = {
  productId: '68b3edd61b4905c7fe9f8d0c', // Simple Test Product
  orderId: '68b44f15c0dddb5db36ac8bf', // Order from previous test
  rating: 5,
  title: 'Excellent Product!',
  content: 'This product exceeded my expectations. The quality is outstanding and delivery was fast. Highly recommended!'
};

async function testReviewCreation() {
  console.log('⭐ Testing Review Creation...\n');

  // Step 1: Login user
  console.log('📝 Step 1: Logging in user...');
  let userToken = null;
  
  try {
    const loginResponse = await axios.post(`${BASE_URL}/auth/login`, testUser);
    userToken = loginResponse.data.data?.token || loginResponse.data.token;
    console.log(`✅ User logged in: ${testUser.email}`);
  } catch (error) {
    console.error('❌ Failed to login user:', error.response?.data || error.message);
    return;
  }

  // Step 2: Create review
  console.log('\n⭐ Step 2: Creating review...');
  console.log('Review payload:', JSON.stringify(reviewData, null, 2));
  
  try {
    const reviewResponse = await axios.post(`${BASE_URL}/reviews`, reviewData, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    
    console.log('✅ Review created successfully!');
    console.log('Review response:', JSON.stringify(reviewResponse.data, null, 2));
  } catch (error) {
    console.error('❌ Failed to create review:', error.response?.data || error.message);
    
    // If it's the order status issue, let's try to understand what's happening
    if (error.response?.data?.message?.includes('Order must be delivered')) {
      console.log('\n💡 The order status needs to be "delivered" for review creation.');
      console.log('For testing purposes, you can manually update the order status in the database.');
    }
  }
}

testReviewCreation().catch(console.error);
