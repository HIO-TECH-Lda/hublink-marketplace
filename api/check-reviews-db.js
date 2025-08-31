const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkReviewsDB() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    const reviewsCollection = db.collection('reviews');

    // Get all reviews
    const reviews = await reviewsCollection.find({}).toArray();
    
    console.log(`📊 Found ${reviews.length} reviews in database\n`);

    if (reviews.length === 0) {
      console.log('❌ No reviews found in database');
      console.log('This means no reviews have been successfully created yet.');
      return;
    }

    // Display each review
    reviews.forEach((review, index) => {
      console.log(`📝 Review ${index + 1}:`);
      console.log(`   ID: ${review._id}`);
      console.log(`   Product ID: ${review.productId}`);
      console.log(`   User ID: ${review.userId}`);
      console.log(`   Order ID: ${review.orderId}`);
      console.log(`   Rating: ${review.rating}/5`);
      console.log(`   Title: ${review.title}`);
      console.log(`   Content: ${review.content.substring(0, 100)}${review.content.length > 100 ? '...' : ''}`);
      console.log(`   Status: ${review.status}`);
      console.log(`   Verified: ${review.isVerified}`);
      console.log(`   Helpful: ${review.isHelpful}`);
      console.log(`   Not Helpful: ${review.isNotHelpful}`);
      console.log(`   Created: ${review.createdAt}`);
      console.log(`   Updated: ${review.updatedAt}`);
      console.log('');
    });

    // Get some statistics
    const totalReviews = reviews.length;
    const approvedReviews = reviews.filter(r => r.status === 'approved').length;
    const pendingReviews = reviews.filter(r => r.status === 'pending').length;
    const rejectedReviews = reviews.filter(r => r.status === 'rejected').length;
    
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
    const verifiedReviews = reviews.filter(r => r.isVerified).length;

    console.log('📈 Review Statistics:');
    console.log(`   Total Reviews: ${totalReviews}`);
    console.log(`   Average Rating: ${avgRating.toFixed(2)}/5`);
    console.log(`   Verified Reviews: ${verifiedReviews}`);
    console.log(`   Status Breakdown:`);
    console.log(`     - Approved: ${approvedReviews}`);
    console.log(`     - Pending: ${pendingReviews}`);
    console.log(`     - Rejected: ${rejectedReviews}`);

  } catch (error) {
    console.error('❌ Error checking reviews:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

checkReviewsDB();
