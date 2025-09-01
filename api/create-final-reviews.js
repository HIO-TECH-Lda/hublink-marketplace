const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function createFinalReviews() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    const reviewsCollection = db.collection('reviews');
    const usersCollection = db.collection('users');
    const productsCollection = db.collection('products');
    const ordersCollection = db.collection('orders');

    // Get available data
    const users = await usersCollection.find({}).toArray();
    const products = await productsCollection.find({}).toArray();
    const orders = await ordersCollection.find({}).toArray();

    console.log(`📊 Found ${users.length} users, ${products.length} products, ${orders.length} orders`);

    // Final batch of diverse reviews
    const finalReviewTemplates = [
      // Detailed technical reviews
      {
        rating: 5,
        title: 'Technical Excellence',
        content: 'As a technical professional, I appreciate the engineering behind this product. The specifications are accurate, build quality is excellent, and performance exceeds benchmarks. The attention to detail in the design shows real expertise.',
        status: 'approved'
      },
      {
        rating: 4,
        title: 'Good Technical Specs',
        content: 'Solid technical specifications and good performance. The product meets most of my technical requirements. Some minor improvements could be made, but overall very satisfied.',
        status: 'approved'
      },
      
      // Customer service focused reviews
      {
        rating: 5,
        title: 'Amazing Customer Support',
        content: 'The product is great, but the customer service is even better! When I had an issue, they resolved it immediately and went above and beyond. This level of service is rare these days.',
        status: 'approved'
      },
      {
        rating: 3,
        title: 'Product Good, Service Average',
        content: 'The product itself is decent quality, but customer service could be improved. Response times are slow and they weren\'t very helpful with my questions.',
        status: 'pending'
      },
      
      // Price-focused reviews
      {
        rating: 5,
        title: 'Best Value Ever',
        content: 'I\'ve been shopping for this type of product for months and this is by far the best value. Quality that rivals products twice the price. Incredible deal!',
        status: 'approved'
      },
      {
        rating: 2,
        title: 'Overpriced for Quality',
        content: 'The product is okay but definitely overpriced for what you get. You can find similar quality for much less money elsewhere.',
        status: 'pending'
      },
      
      // Durability and longevity reviews
      {
        rating: 5,
        title: 'Built to Last',
        content: 'I\'ve been using this product daily for over a year and it still works like new. The durability is impressive and it shows no signs of wear. Great investment.',
        status: 'approved'
      },
      {
        rating: 1,
        title: 'Fell Apart Quickly',
        content: 'This product broke within weeks of purchase. Very poor quality materials and construction. Complete waste of money.',
        status: 'rejected'
      },
      
      // Comparison reviews
      {
        rating: 4,
        title: 'Better Than Competitors',
        content: 'I compared this with several similar products and this one came out on top. Better features, better quality, and better price than the competition.',
        status: 'approved'
      },
      {
        rating: 3,
        title: 'Average Among Peers',
        content: 'This product is about average compared to others in the same category. Not the best, not the worst. Middle of the road option.',
        status: 'approved'
      },
      
      // Specific use case reviews
      {
        rating: 5,
        title: 'Perfect for My Work',
        content: 'I use this product professionally and it handles all my work requirements perfectly. Reliable, efficient, and professional-grade quality.',
        status: 'approved'
      },
      {
        rating: 4,
        title: 'Good for Casual Use',
        content: 'Great for casual, everyday use. Not professional-grade but perfect for personal projects and light work.',
        status: 'approved'
      },
      
      // Innovation and features reviews
      {
        rating: 5,
        title: 'Innovative Features',
        content: 'Love the innovative features this product offers. It\'s clear the developers thought outside the box. Some features I didn\'t even know I needed!',
        status: 'approved'
      },
      {
        rating: 3,
        title: 'Basic Features Only',
        content: 'The product has basic features but nothing innovative or special. It works but doesn\'t stand out from the crowd.',
        status: 'pending'
      },
      
      // Shipping and packaging reviews
      {
        rating: 5,
        title: 'Excellent Packaging',
        content: 'Product arrived in perfect condition thanks to excellent packaging. The attention to detail in shipping shows they care about customer satisfaction.',
        status: 'approved'
      },
      {
        rating: 2,
        title: 'Poor Packaging',
        content: 'Product arrived damaged due to inadequate packaging. The shipping materials were insufficient to protect the item.',
        status: 'pending'
      }
    ];

    console.log(`📝 Creating ${finalReviewTemplates.length} final reviews...`);

    let createdCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < finalReviewTemplates.length; i++) {
      const review = finalReviewTemplates[i];
      
      // Use different users and products to avoid conflicts
      const userIndex = (i + 20) % users.length; // Start from different user
      const productIndex = (i + 7) % products.length; // Start from different product
      const orderIndex = (i + 12) % orders.length; // Start from different order
      
      const user = users[userIndex];
      const product = products[productIndex];
      const order = orders[orderIndex];

      // Check if this user already reviewed this product
      const existingReview = await reviewsCollection.findOne({
        userId: user._id,
        productId: product._id
      });

      if (existingReview) {
        console.log(`⚠️  User ${user.email} already reviewed ${product.name}, skipping...`);
        skippedCount++;
        continue;
      }

      const newReview = {
        productId: new ObjectId(product._id),
        userId: new ObjectId(user._id),
        orderId: new ObjectId(order._id),
        rating: review.rating,
        title: review.title,
        content: review.content,
        images: [],
        isVerified: true,
        isHelpful: Math.floor(Math.random() * 20),
        isNotHelpful: Math.floor(Math.random() * 10),
        status: review.status,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const result = await reviewsCollection.insertOne(newReview);
      
      if (result.insertedId) {
        console.log(`✅ Review ${i + 1} created: ${review.rating}⭐ - ${review.title}`);
        createdCount++;
      } else {
        console.log(`❌ Failed to create review ${i + 1}`);
      }
    }

    // Final comprehensive statistics
    console.log('\n🔄 Final product ratings update...');
    for (const product of products) {
      const productReviews = await reviewsCollection.find({
        productId: product._id,
        status: 'approved'
      }).toArray();

      if (productReviews.length > 0) {
        const totalRating = productReviews.reduce((sum, r) => sum + r.rating, 0);
        const averageRating = totalRating / productReviews.length;

        await productsCollection.updateOne(
          { _id: product._id },
          { 
            $set: { 
              averageRating: Math.round(averageRating * 100) / 100,
              totalReviews: productReviews.length
            } 
          }
        );

        console.log(`📊 ${product.name}: ${averageRating.toFixed(2)}⭐ (${productReviews.length} reviews)`);
      }
    }

    // Comprehensive final statistics
    const totalReviews = await reviewsCollection.countDocuments();
    const approvedReviews = await reviewsCollection.countDocuments({ status: 'approved' });
    const pendingReviews = await reviewsCollection.countDocuments({ status: 'pending' });
    const rejectedReviews = await reviewsCollection.countDocuments({ status: 'rejected' });

    // Rating distribution
    const ratingDistribution = {};
    for (let i = 1; i <= 5; i++) {
      ratingDistribution[i] = await reviewsCollection.countDocuments({ rating: i });
    }

    // Helpfulness statistics
    const totalHelpful = await reviewsCollection.aggregate([
      { $group: { _id: null, total: { $sum: '$isHelpful' } } }
    ]).toArray();
    
    const totalNotHelpful = await reviewsCollection.aggregate([
      { $group: { _id: null, total: { $sum: '$isNotHelpful' } } }
    ]).toArray();

    console.log('\n🎉 Final Reviews Creation Completed!');
    console.log('📊 Comprehensive Summary:');
    console.log(`   - Reviews Created: ${createdCount}`);
    console.log(`   - Reviews Skipped: ${skippedCount}`);
    console.log(`   - Total Reviews in DB: ${totalReviews}`);
    console.log(`   - Status Breakdown:`);
    console.log(`     - Approved: ${approvedReviews}`);
    console.log(`     - Pending: ${pendingReviews}`);
    console.log(`     - Rejected: ${rejectedReviews}`);
    console.log('   - Rating Distribution:');
    Object.entries(ratingDistribution).forEach(([rating, count]) => {
      const percentage = ((count / totalReviews) * 100).toFixed(1);
      console.log(`     - ${rating}⭐: ${count} reviews (${percentage}%)`);
    });
    console.log('   - Helpfulness Metrics:');
    console.log(`     - Total Helpful Votes: ${totalHelpful[0]?.total || 0}`);
    console.log(`     - Total Not Helpful Votes: ${totalNotHelpful[0]?.total || 0}`);
    console.log('   - Product ratings updated');
    console.log('   - Review system is now COMPLETELY populated with rich, diverse data!');
    console.log('   - Ready for comprehensive testing and demonstration!');

  } catch (error) {
    console.error('❌ Error creating final reviews:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createFinalReviews();
