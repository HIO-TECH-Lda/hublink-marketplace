const axios = require('axios');

const BASE_URL = 'http://localhost:3002/api/v1';

// Test user credentials
const testUser = {
  email: 'reviewer_1756646681227@test.com',
  password: 'Password123!'
};

async function updateOrderStatus() {
  console.log('🔄 Updating order status for review testing...\n');

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

  // Step 2: Get user orders
  console.log('\n📋 Step 2: Getting user orders...');
  let orders = [];
  
  try {
    const ordersResponse = await axios.get(`${BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    orders = ordersResponse.data.data?.orders || [];
    console.log(`✅ Found ${orders.length} orders`);
  } catch (error) {
    console.error('❌ Failed to get orders:', error.response?.data || error.message);
    return;
  }

  if (orders.length === 0) {
    console.error('❌ No orders found');
    return;
  }

  // Step 3: Update the first order status to delivered
  console.log('\n📦 Step 3: Updating order status to delivered...');
  const orderToUpdate = orders[0];
  
  try {
    const updateResponse = await axios.put(`${BASE_URL}/orders/${orderToUpdate._id}/status`, {
      status: 'delivered'
    }, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    
    console.log(`✅ Order status updated to delivered: ${orderToUpdate._id}`);
    console.log('Order details:', JSON.stringify(updateResponse.data, null, 2));
  } catch (error) {
    console.error('❌ Failed to update order status:', error.response?.data || error.message);
    return;
  }

  console.log('\n✅ Order status update completed!');
  console.log(`📊 Summary:`);
  console.log(`   - Order ID: ${orderToUpdate._id}`);
  console.log(`   - New Status: delivered`);
  console.log(`   - Ready for review creation`);
}

// Run the update
updateOrderStatus().catch(console.error);
