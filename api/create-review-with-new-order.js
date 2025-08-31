const axios = require('axios');

const BASE_URL = 'http://localhost:3002/api/v1';

// Test with a new user
const testUser = {
  email: `reviewer_${Date.now()}@test.com`,
  password: 'Password123!',
  confirmPassword: 'Password123!',
  firstName: 'Test',
  lastName: 'Reviewer',
  phone: `+258${Date.now().toString().slice(-9)}`,
  role: 'buyer'
};

async function createReviewWithNewOrder() {
  console.log('🚀 Creating Review with New Order...\n');

  // Step 1: Register new user
  console.log('📝 Step 1: Registering new user...');
  let userToken = null;
  
  try {
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
    userToken = registerResponse.data.data?.token || registerResponse.data.token;
    console.log(`✅ User registered: ${testUser.email}`);
  } catch (error) {
    console.error('❌ Failed to register user:', error.response?.data || error.message);
    return;
  }

  // Step 2: Get products
  console.log('\n📦 Step 2: Getting products...');
  let productIds = [];
  
  try {
    const productsResponse = await axios.get(`${BASE_URL}/products?limit=3`);
    productIds = productsResponse.data.data?.products?.map(p => p._id) || [];
    console.log(`✅ Found ${productIds.length} products`);
  } catch (error) {
    console.error('❌ Failed to get products:', error.response?.data || error.message);
    return;
  }

  if (productIds.length === 0) {
    console.error('❌ No products available');
    return;
  }

  // Step 3: Create order
  console.log('\n🛒 Step 3: Creating order...');
  let orderId = null;
  
  try {
    const orderData = {
      items: [{
        productId: productIds[0],
        quantity: 1
      }],
      shippingAddress: {
        firstName: 'Test',
        lastName: 'Reviewer',
        email: testUser.email,
        phone: testUser.phone,
        address: '123 Test Street, Test Building',
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
        zipCode: '12345'
      },
      billingAddress: {
        firstName: 'Test',
        lastName: 'Reviewer',
        email: testUser.email,
        phone: testUser.phone,
        address: '123 Test Street, Test Building',
        city: 'Test City',
        state: 'Test State',
        country: 'Test Country',
        zipCode: '12345'
      },
      payment: {
        method: 'cash_on_delivery'
      }
    };

    const orderResponse = await axios.post(`${BASE_URL}/orders/create`, orderData, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    
    orderId = orderResponse.data.data?.order?.orderId || orderResponse.data.data?._id || orderResponse.data._id;
    console.log(`✅ Order created: ${orderId}`);
    
    // Log order details for debugging
    console.log('Order details:', JSON.stringify(orderResponse.data.data?.order, null, 2));
  } catch (error) {
    console.error('❌ Failed to create order:', error.response?.data || error.message);
    return;
  }

  // Step 4: Create review
  console.log('\n⭐ Step 4: Creating review...');
  
  try {
    const reviewPayload = {
      productId: productIds[0],
      orderId: orderId,
      rating: 5,
      title: 'Excellent Product!',
      content: 'This product exceeded my expectations. The quality is outstanding and delivery was fast. Highly recommended!'
    };

    console.log('Review payload:', JSON.stringify(reviewPayload, null, 2));

    const reviewResponse = await axios.post(`${BASE_URL}/reviews`, reviewPayload, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    
    console.log('✅ Review created successfully!');
    console.log('Review response:', JSON.stringify(reviewResponse.data, null, 2));
  } catch (error) {
    console.error('❌ Failed to create review:', error.response?.data || error.message);
    
    if (error.response?.data?.message?.includes('Order does not belong to user')) {
      console.log('\n🔍 Debugging user ID mismatch...');
      
      // Decode JWT to get user ID
      const tokenParts = userToken.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
        console.log(`JWT User ID: ${payload.userId}`);
      }
      
      console.log(`Order ID: ${orderId}`);
      console.log('This suggests there might be an issue with how the order is being associated with the user.');
    }
  }

  console.log('\n✅ Test completed!');
}

createReviewWithNewOrder().catch(console.error);
