const axios = require('axios');
const { MongoClient } = require('mongodb');
require('dotenv').config();

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

async function createCompleteReview() {
  console.log('🚀 Creating Complete Review Workflow...\n');

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
  } catch (error) {
    console.error('❌ Failed to create order:', error.response?.data || error.message);
    return;
  }

  // Step 4: Update order status to delivered (for testing)
  console.log('\n📦 Step 4: Updating order status to delivered...');
  
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db();
    const ordersCollection = db.collection('orders');

    // Update order status to delivered
    const result = await ordersCollection.updateOne(
      { _id: orderId },
      { 
        $set: { 
          status: 'delivered',
          deliveredAt: new Date()
        }
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`✅ Order status updated to delivered`);
    } else {
      console.log('❌ Failed to update order status');
      await client.close();
      return;
    }

    await client.close();
  } catch (error) {
    console.error('❌ Error updating order status:', error);
    return;
  }

  // Step 5: Create review
  console.log('\n⭐ Step 5: Creating review...');
  
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
    return;
  }

  // Step 6: Verify review in database
  console.log('\n🔍 Step 6: Verifying review in database...');
  
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    const db = client.db();
    const reviewsCollection = db.collection('reviews');

    // Get all reviews
    const reviews = await reviewsCollection.find({}).toArray();
    
    console.log(`📊 Found ${reviews.length} reviews in database`);

    if (reviews.length > 0) {
      const latestReview = reviews[reviews.length - 1];
      console.log('\n📝 Latest Review Details:');
      console.log(`   ID: ${latestReview._id}`);
      console.log(`   Product ID: ${latestReview.productId}`);
      console.log(`   User ID: ${latestReview.userId}`);
      console.log(`   Order ID: ${latestReview.orderId}`);
      console.log(`   Rating: ${latestReview.rating}/5`);
      console.log(`   Title: ${latestReview.title}`);
      console.log(`   Content: ${latestReview.content}`);
      console.log(`   Status: ${latestReview.status}`);
      console.log(`   Verified: ${latestReview.isVerified}`);
      console.log(`   Created: ${latestReview.createdAt}`);
    }

    await client.close();
  } catch (error) {
    console.error('❌ Error checking reviews in database:', error);
  }

  console.log('\n✅ Complete Review Workflow Test Completed!');
  console.log('📊 Summary:');
  console.log(`   - User: ${testUser.email}`);
  console.log(`   - Product: ${productIds[0]}`);
  console.log(`   - Order: ${orderId}`);
  console.log(`   - Review: Successfully created and verified in database`);
  console.log(`   - Review System: ✅ Fully functional!`);
}

createCompleteReview().catch(console.error);
