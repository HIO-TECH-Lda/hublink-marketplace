const axios = require('axios');

const BASE_URL = 'http://localhost:3002/api/v1';

// Test data
const testUsers = [
  {
    email: 'reviewer1_new@test.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+258123456792',
    role: 'buyer'
  },
  {
    email: 'reviewer2_new@test.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    firstName: 'Jane',
    lastName: 'Smith',
    phone: '+258123456793',
    role: 'buyer'
  },
  {
    email: 'reviewer3_new@test.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    firstName: 'Mike',
    lastName: 'Johnson',
    phone: '+258123456794',
    role: 'buyer'
  }
];

const sampleReviews = [
  {
    rating: 5,
    title: 'Excellent Product!',
    content: 'This product exceeded my expectations. The quality is outstanding and delivery was fast. Highly recommended!'
  },
  {
    rating: 4,
    title: 'Great Value for Money',
    content: 'Good quality product at a reasonable price. The features work well and it\'s easy to use.'
  },
  {
    rating: 3,
    title: 'Decent Product',
    content: 'The product is okay, meets basic expectations. Could be better but not bad for the price.'
  },
  {
    rating: 5,
    title: 'Amazing Quality!',
    content: 'Absolutely love this product! The build quality is exceptional and it performs perfectly.'
  },
  {
    rating: 2,
    title: 'Disappointed',
    content: 'Expected better quality for the price. The product arrived damaged and customer service was slow to respond.'
  }
];

let authTokens = [];
let productIds = [];
let orderIds = [];

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function registerUser(userData) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, userData);
    console.log(`✅ User registered: ${userData.email}`);
    return response.data.token;
  } catch (error) {
    if (error.response?.status === 409) {
      // User already exists, try to login
      console.log(`⚠️  User already exists, logging in: ${userData.email}`);
      const loginToken = await loginUser(userData);
      if (loginToken) {
        console.log(`✅ User logged in successfully: ${userData.email}`);
        return loginToken;
      } else {
        console.error(`❌ Failed to login existing user: ${userData.email}`);
        return null;
      }
    }
    console.error(`❌ Failed to register user ${userData.email}:`, error.response?.data || error.message);
    return null;
  }
}

async function loginUser(userData) {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: userData.email,
      password: userData.password
    });
    console.log(`✅ User logged in: ${userData.email}`);
    return response.data.token;
  } catch (error) {
    console.error(`❌ Failed to login user ${userData.email}:`, error.response?.data || error.message);
    return null;
  }
}

async function getProducts() {
  try {
    const response = await axios.get(`${BASE_URL}/products?limit=5`);
    const products = response.data.products;
    console.log(`✅ Found ${products.length} products`);
    return products.map(p => p._id);
  } catch (error) {
    console.error('❌ Failed to get products:', error.response?.data || error.message);
    return [];
  }
}

async function createOrder(userToken, productId) {
  try {
    const orderData = {
      items: [{
        productId: productId,
        quantity: 1,
        price: 100
      }],
      shippingAddress: {
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'Test Country'
      },
      paymentMethod: 'cash_on_delivery',
      totalAmount: 100
    };

    const response = await axios.post(`${BASE_URL}/orders`, orderData, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    
    console.log(`✅ Order created: ${response.data._id}`);
    return response.data._id;
  } catch (error) {
    console.error('❌ Failed to create order:', error.response?.data || error.message);
    return null;
  }
}

async function createReview(userToken, productId, orderId, reviewData) {
  try {
    const reviewPayload = {
      productId: productId,
      orderId: orderId,
      rating: reviewData.rating,
      title: reviewData.title,
      content: reviewData.content
    };

    const response = await axios.post(`${BASE_URL}/reviews`, reviewPayload, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    
    console.log(`✅ Review created: ${response.data._id} (Rating: ${reviewData.rating})`);
    return response.data._id;
  } catch (error) {
    console.error('❌ Failed to create review:', error.response?.data || error.message);
    return null;
  }
}

async function getProductReviews(productId) {
  try {
    const response = await axios.get(`${BASE_URL}/reviews/product/${productId}`);
    console.log(`✅ Product reviews retrieved: ${response.data.reviews.length} reviews`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get product reviews:', error.response?.data || error.message);
    return null;
  }
}

async function getReviewStatistics(productId) {
  try {
    const response = await axios.get(`${BASE_URL}/reviews/product/${productId}/statistics`);
    console.log(`✅ Review statistics retrieved:`, response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get review statistics:', error.response?.data || error.message);
    return null;
  }
}

async function markReviewHelpful(userToken, reviewId) {
  try {
    const response = await axios.post(`${BASE_URL}/reviews/${reviewId}/helpful`, {
      isHelpful: true
    }, {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    
    console.log(`✅ Review marked as helpful: ${reviewId}`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to mark review helpful:', error.response?.data || error.message);
    return null;
  }
}

async function getRecentReviews() {
  try {
    const response = await axios.get(`${BASE_URL}/reviews/recent/reviews`);
    console.log(`✅ Recent reviews retrieved: ${response.data.reviews.length} reviews`);
    return response.data;
  } catch (error) {
    console.error('❌ Failed to get recent reviews:', error.response?.data || error.message);
    return null;
  }
}

async function testReviewSystem() {
  console.log('🚀 Starting Review System Test...\n');

  // Step 1: Register/Login users
  console.log('📝 Step 1: Setting up users...');
  for (const user of testUsers) {
    const token = await registerUser(user);
    console.log(`Token for ${user.email}: ${token ? 'Received' : 'Failed'}`);
    if (token) {
      authTokens.push(token);
    }
    await delay(500);
  }

  console.log(`Total tokens collected: ${authTokens.length}`);

  if (authTokens.length === 0) {
    console.error('❌ No users available for testing');
    return;
  }

  // Step 2: Get products
  console.log('\n📦 Step 2: Getting products...');
  productIds = await getProducts();
  
  if (productIds.length === 0) {
    console.error('❌ No products available for testing');
    return;
  }

  // Step 3: Create orders for reviews
  console.log('\n🛒 Step 3: Creating orders...');
  for (let i = 0; i < Math.min(authTokens.length, productIds.length); i++) {
    const orderId = await createOrder(authTokens[i], productIds[i]);
    if (orderId) {
      orderIds.push(orderId);
    }
    await delay(500);
  }

  // Step 4: Create reviews
  console.log('\n⭐ Step 4: Creating reviews...');
  const reviewIds = [];
  
  for (let i = 0; i < Math.min(authTokens.length, productIds.length, sampleReviews.length); i++) {
    const reviewId = await createReview(
      authTokens[i], 
      productIds[i], 
      orderIds[i], 
      sampleReviews[i]
    );
    if (reviewId) {
      reviewIds.push(reviewId);
    }
    await delay(500);
  }

  // Step 5: Test review functionality
  console.log('\n🔍 Step 5: Testing review functionality...');
  
  if (productIds.length > 0) {
    // Get reviews for first product
    await getProductReviews(productIds[0]);
    await delay(500);
    
    // Get review statistics
    await getReviewStatistics(productIds[0]);
    await delay(500);
  }

  // Mark a review as helpful
  if (reviewIds.length > 0) {
    await markReviewHelpful(authTokens[0], reviewIds[0]);
    await delay(500);
  }

  // Get recent reviews
  await getRecentReviews();

  console.log('\n✅ Review System Test Completed!');
  console.log(`📊 Summary:`);
  console.log(`   - Users: ${authTokens.length}`);
  console.log(`   - Products: ${productIds.length}`);
  console.log(`   - Orders: ${orderIds.length}`);
  console.log(`   - Reviews: ${reviewIds.length}`);
}

// Run the test
testReviewSystem().catch(console.error);
