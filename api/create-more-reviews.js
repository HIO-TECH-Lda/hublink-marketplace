const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function createMoreReviews() {
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

    // More diverse review content
    const additionalReviewTemplates = [
      // 5-star reviews
      {
        rating: 5,
        title: 'Absolutely Fantastic!',
        content: 'This product is absolutely amazing! I can\'t believe the quality for this price. It\'s exceeded all my expectations and I\'m so happy with my purchase.',
        status: 'approved'
      },
      {
        rating: 5,
        title: 'Premium Quality',
        content: 'The craftsmanship is outstanding. This feels like a premium product that should cost much more. Very impressed with the attention to detail.',
        status: 'approved'
      },
      {
        rating: 5,
        title: 'Game Changer',
        content: 'This product has completely changed how I work. The efficiency gains are incredible and the build quality is top-notch.',
        status: 'approved'
      },
      
      // 4-star reviews
      {
        rating: 4,
        title: 'Great Value',
        content: 'Solid product with good features. The price is reasonable and it delivers what it promises. Minor issues but nothing deal-breaking.',
        status: 'approved'
      },
      {
        rating: 4,
        title: 'Reliable Performance',
        content: 'Been using this for a while now and it\'s very reliable. Good performance and durability. Would recommend to others.',
        status: 'approved'
      },
      {
        rating: 4,
        title: 'Good Investment',
        content: 'Worth the money spent. Good quality materials and construction. Serves its purpose well.',
        status: 'approved'
      },
      
      // 3-star reviews
      {
        rating: 3,
        title: 'It\'s Okay',
        content: 'Product works but nothing special. Average quality for the price. Gets the job done but I expected more.',
        status: 'approved'
      },
      {
        rating: 3,
        title: 'Mixed Results',
        content: 'Some features work well, others don\'t. It\'s a mixed experience overall. Not bad but not great either.',
        status: 'pending'
      },
      
      // 2-star reviews
      {
        rating: 2,
        title: 'Disappointed',
        content: 'Not happy with this purchase. The quality is poor and it doesn\'t work as advertised. Would not recommend.',
        status: 'pending'
      },
      {
        rating: 2,
        title: 'Below Expectations',
        content: 'Had higher expectations for this product. The quality is subpar and it feels cheaply made.',
        status: 'pending'
      },
      
      // 1-star reviews
      {
        rating: 1,
        title: 'Terrible Product',
        content: 'This is the worst product I\'ve ever purchased. Complete waste of money. Poor quality and doesn\'t work.',
        status: 'rejected'
      },
      {
        rating: 1,
        title: 'Avoid This',
        content: 'Save your money and avoid this product. It\'s poorly made and broke within days of use.',
        status: 'rejected'
      }
    ];

    // Special themed reviews
    const themedReviews = [
      {
        rating: 5,
        title: 'Perfect for Beginners',
        content: 'As someone new to this type of product, I found it very easy to use. Great for beginners with clear instructions.',
        status: 'approved'
      },
      {
        rating: 4,
        title: 'Good for Professionals',
        content: 'Professional-grade quality. Good for daily use in a work environment. Sturdy construction.',
        status: 'approved'
      },
      {
        rating: 5,
        title: 'Family Favorite',
        content: 'My whole family loves this product! It\'s become a household essential. Great for everyone.',
        status: 'approved'
      },
      {
        rating: 4,
        title: 'Travel Companion',
        content: 'Perfect for travel. Compact, durable, and reliable. Hasn\'t let me down on any trip.',
        status: 'approved'
      },
      {
        rating: 3,
        title: 'Office Use',
        content: 'Decent for office use. Not the best but adequate for basic needs. Gets the job done.',
        status: 'pending'
      }
    ];

    const allReviews = [...additionalReviewTemplates, ...themedReviews];
    console.log(`📝 Creating ${allReviews.length} additional reviews...`);

    let createdCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < allReviews.length; i++) {
      const review = allReviews[i];
      
      // Use different users and products to avoid conflicts
      const userIndex = (i + 10) % users.length; // Start from different user
      const productIndex = (i + 3) % products.length; // Start from different product
      const orderIndex = (i + 5) % orders.length; // Start from different order
      
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
        isHelpful: Math.floor(Math.random() * 15),
        isNotHelpful: Math.floor(Math.random() * 8),
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

    // Update product ratings again
    console.log('\n🔄 Updating product ratings...');
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

    // Final statistics
    const totalReviews = await reviewsCollection.countDocuments();
    const approvedReviews = await reviewsCollection.countDocuments({ status: 'approved' });
    const pendingReviews = await reviewsCollection.countDocuments({ status: 'pending' });
    const rejectedReviews = await reviewsCollection.countDocuments({ status: 'rejected' });

    // Rating distribution
    const ratingDistribution = {};
    for (let i = 1; i <= 5; i++) {
      ratingDistribution[i] = await reviewsCollection.countDocuments({ rating: i });
    }

    console.log('\n🎉 Additional Reviews Creation Completed!');
    console.log('📊 Summary:');
    console.log(`   - Reviews Created: ${createdCount}`);
    console.log(`   - Reviews Skipped: ${skippedCount}`);
    console.log(`   - Total Reviews in DB: ${totalReviews}`);
    console.log(`   - Status Breakdown:`);
    console.log(`     - Approved: ${approvedReviews}`);
    console.log(`     - Pending: ${pendingReviews}`);
    console.log(`     - Rejected: ${rejectedReviews}`);
    console.log('   - Rating Distribution:');
    Object.entries(ratingDistribution).forEach(([rating, count]) => {
      console.log(`     - ${rating}⭐: ${count} reviews`);
    });
    console.log('   - Product ratings updated');
    console.log('   - Review system is now richly populated!');

  } catch (error) {
    console.error('❌ Error creating additional reviews:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createMoreReviews();
