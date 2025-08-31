const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function createReviewDirectly() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    const reviewsCollection = db.collection('reviews');
    const usersCollection = db.collection('users');
    const productsCollection = db.collection('products');
    const ordersCollection = db.collection('orders');

    // Get a user, product, and order for testing
    const user = await usersCollection.findOne({});
    const product = await productsCollection.findOne({});
    const order = await ordersCollection.findOne({});

    if (!user || !product || !order) {
      console.log('❌ Need at least one user, product, and order in database');
      return;
    }

    console.log(`👤 Using user: ${user.email}`);
    console.log(`📦 Using product: ${product.name}`);
    console.log(`🛒 Using order: ${order.orderNumber}`);

    // Create a test review directly in the database
    const testReview = {
      productId: new ObjectId(product._id),
      userId: new ObjectId(user._id),
      orderId: new ObjectId(order._id),
      rating: 5,
      title: 'Excellent Product!',
      content: 'This product exceeded my expectations. The quality is outstanding and delivery was fast. Highly recommended!',
      isVerified: true,
      isHelpful: 0,
      isNotHelpful: 0,
      status: 'approved',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await reviewsCollection.insertOne(testReview);
    
    if (result.insertedId) {
      console.log('✅ Review created successfully!');
      console.log(`📝 Review ID: ${result.insertedId}`);
      console.log(`⭐ Rating: ${testReview.rating}/5`);
      console.log(`📋 Title: ${testReview.title}`);
      console.log(`📄 Content: ${testReview.content}`);
      console.log(`✅ Status: ${testReview.status}`);
      console.log(`🔒 Verified: ${testReview.isVerified}`);
    } else {
      console.log('❌ Failed to create review');
    }

    // Verify the review was created
    const reviews = await reviewsCollection.find({}).toArray();
    console.log(`\n📊 Total reviews in database: ${reviews.length}`);

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

  } catch (error) {
    console.error('❌ Error creating review:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createReviewDirectly();
