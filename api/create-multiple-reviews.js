const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function createMultipleReviews() {
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

    if (users.length === 0 || products.length === 0 || orders.length === 0) {
      console.log('❌ Need users, products, and orders in database');
      return;
    }

    console.log(`📊 Found ${users.length} users, ${products.length} products, ${orders.length} orders`);

    // Sample review data with variety
    const reviewTemplates = [
      {
        rating: 5,
        title: 'Excellent Product!',
        content: 'This product exceeded my expectations. The quality is outstanding and delivery was fast. Highly recommended!',
        status: 'approved'
      },
      {
        rating: 4,
        title: 'Very Good Quality',
        content: 'Great product with good quality. Fast shipping and good packaging. Would buy again.',
        status: 'approved'
      },
      {
        rating: 3,
        title: 'Decent Product',
        content: 'Product is okay, meets basic expectations. Could be better but gets the job done.',
        status: 'approved'
      },
      {
        rating: 2,
        title: 'Below Average',
        content: 'Not very satisfied with this product. Quality could be better for the price.',
        status: 'pending'
      },
      {
        rating: 1,
        title: 'Poor Quality',
        content: 'Very disappointed with this purchase. Product arrived damaged and quality is poor.',
        status: 'pending'
      },
      {
        rating: 5,
        title: 'Amazing Value!',
        content: 'Incredible value for money. The quality is premium and the price is unbeatable.',
        status: 'approved'
      },
      {
        rating: 4,
        title: 'Solid Choice',
        content: 'Good product that delivers what it promises. Reliable and well-made.',
        status: 'approved'
      },
      {
        rating: 5,
        title: 'Perfect for My Needs',
        content: 'Exactly what I was looking for. Great functionality and easy to use.',
        status: 'approved'
      },
      {
        rating: 3,
        title: 'Average Experience',
        content: 'Product works as described but nothing special. Average quality for the price.',
        status: 'approved'
      },
      {
        rating: 4,
        title: 'Good Purchase',
        content: 'Happy with this purchase. Good quality and reasonable price.',
        status: 'approved'
      }
    ];

    const additionalReviews = [
      {
        rating: 5,
        title: 'Outstanding Service',
        content: 'Not only is the product excellent, but the customer service was also top-notch. Very impressed!',
        status: 'approved'
      },
      {
        rating: 4,
        title: 'Great for Daily Use',
        content: 'Been using this product daily and it holds up well. Good durability and functionality.',
        status: 'approved'
      },
      {
        rating: 2,
        title: 'Expected Better',
        content: 'Had high hopes for this product but it fell short. Not worth the price in my opinion.',
        status: 'rejected'
      },
      {
        rating: 5,
        title: 'Best in Class',
        content: 'This is definitely the best product in its category. Superior quality and features.',
        status: 'approved'
      },
      {
        rating: 3,
        title: 'Mixed Feelings',
        content: 'Some aspects are good, others not so much. It\'s a mixed bag overall.',
        status: 'pending'
      }
    ];

    const allReviews = [...reviewTemplates, ...additionalReviews];
    console.log(`📝 Creating ${allReviews.length} reviews...`);

    let createdCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < allReviews.length; i++) {
      const review = allReviews[i];
      
      // Rotate through users, products, and orders
      const user = users[i % users.length];
      const product = products[i % products.length];
      const order = orders[i % orders.length];

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
        isHelpful: Math.floor(Math.random() * 10),
        isNotHelpful: Math.floor(Math.random() * 5),
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

    // Update product ratings
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

    console.log('\n🎉 Multiple Reviews Creation Completed!');
    console.log('📊 Summary:');
    console.log(`   - Reviews Created: ${createdCount}`);
    console.log(`   - Reviews Skipped: ${skippedCount}`);
    console.log(`   - Total Reviews in DB: ${totalReviews}`);
    console.log(`   - Status Breakdown:`);
    console.log(`     - Approved: ${approvedReviews}`);
    console.log(`     - Pending: ${pendingReviews}`);
    console.log(`     - Rejected: ${rejectedReviews}`);
    console.log('   - Product ratings updated');
    console.log('   - Review system is now populated with diverse data!');

  } catch (error) {
    console.error('❌ Error creating multiple reviews:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createMultipleReviews();
