const axios = require('axios');

const BASE_URL = 'http://localhost:3002/api/v1';

// Test with unique data
const testUser = {
  email: `reviewer_${Date.now()}@test.com`,
  password: 'Password123!',
  confirmPassword: 'Password123!',
  firstName: 'Test',
  lastName: 'Reviewer',
  phone: `+258${Date.now().toString().slice(-9)}`,
  role: 'buyer'
};

const sampleReview = {
  rating: 5,
  title: 'Excellent Product!',
  content: 'This product exceeded my expectations. The quality is outstanding and delivery was fast. Highly recommended!'
};

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testReviewSystem() {
  console.log('🚀 Starting Simple Review System Test...\n');

  // Step 1: Register a new user
  console.log('📝 Step 1: Registering new user...');
  let userToken = null;
  
  try {
    const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
    userToken = registerResponse.data.data?.token || registerResponse.data.token || registerResponse.data.accessToken;
    console.log(`✅ User registered: ${testUser.email}`);
  } catch (error) {
    console.error('❌ Failed to register user:', error.response?.data || error.message);
    return;
  }

  if (!userToken) {
    console.error('❌ No user token available');
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
    console.error('❌ No products available for testing');
    return;
  }

  // Step 3: Create an order
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
    
    console.log('Order response:', JSON.stringify(orderResponse.data, null, 2));
    orderId = orderResponse.data.data?.order?.orderId || orderResponse.data.data?._id || orderResponse.data._id;
    console.log(`✅ Order created: ${orderId}`);
  } catch (error) {
    console.error('❌ Failed to create order:', error.response?.data || error.message);
    return;
  }

  // Step 4: Create a review
  console.log('\n⭐ Step 4: Creating review...');
  let reviewId = null;
  
  try {
    const reviewPayload = {
      productId: productIds[0],
      orderId: orderId,
      rating: sampleReview.rating,
      title: sampleReview.title,
      content: sampleReview.content
    };

    console.log('Review payload:', JSON.stringify(reviewPayload, null, 2));

    const reviewResponse = await axios.post(`${BASE_URL}/reviews`, reviewPayload, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    
    reviewId = reviewResponse.data._id;
    console.log(`✅ Review created: ${reviewId} (Rating: ${sampleReview.rating})`);
  } catch (error) {
    console.error('❌ Failed to create review:', error.response?.data || error.message);
    console.log('Note: This might be because the order status is not "delivered" yet.');
    console.log('For testing purposes, you can manually update the order status in the database.');
    return;
  }

  // Step 5: Test review functionality
  console.log('\n🔍 Step 5: Testing review functionality...');
  
  // Get reviews for the product
  try {
    const reviewsResponse = await axios.get(`${BASE_URL}/reviews/product/${productIds[0]}`);
    console.log(`✅ Product reviews retrieved: ${reviewsResponse.data.reviews.length} reviews`);
  } catch (error) {
    console.error('❌ Failed to get product reviews:', error.response?.data || error.message);
  }

  // Get review statistics
  try {
    const statsResponse = await axios.get(`${BASE_URL}/reviews/product/${productIds[0]}/statistics`);
    console.log(`✅ Review statistics retrieved:`, statsResponse.data);
  } catch (error) {
    console.error('❌ Failed to get review statistics:', error.response?.data || error.message);
  }

  // Mark review as helpful
  try {
    await axios.post(`${BASE_URL}/reviews/${reviewId}/helpful`, {
      isHelpful: true
    }, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    console.log(`✅ Review marked as helpful: ${reviewId}`);
  } catch (error) {
    console.error('❌ Failed to mark review helpful:', error.response?.data || error.message);
  }

  // Get recent reviews
  try {
    const recentResponse = await axios.get(`${BASE_URL}/reviews/recent/reviews`);
    console.log(`✅ Recent reviews retrieved: ${recentResponse.data.reviews.length} reviews`);
  } catch (error) {
    console.error('❌ Failed to get recent reviews:', error.response?.data || error.message);
  }

  console.log('\n✅ Review System Test Completed Successfully!');
  console.log(`📊 Summary:`);
  console.log(`   - User: ${testUser.email}`);
  console.log(`   - Product: ${productIds[0]}`);
  console.log(`   - Order: ${orderId}`);
  console.log(`   - Review: ${reviewId}`);
}

// Run the test
testReviewSystem().catch(console.error);
