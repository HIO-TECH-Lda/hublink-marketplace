const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function createFinalWishlists() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    const wishlistsCollection = db.collection('wishlists');
    const usersCollection = db.collection('users');
    const productsCollection = db.collection('products');

    // Get available data
    const users = await usersCollection.find({}).toArray();
    const products = await productsCollection.find({}).toArray();

    console.log(`📊 Found ${users.length} users, ${products.length} products`);

    // Final batch of diverse wishlist items
    const finalWishlistTemplates = [
      // Business and professional use cases
      {
        notes: 'Essential for my consulting business - need high performance',
        priority: 'high'
      },
      {
        notes: 'Planning to buy for my startup team - need 5 units',
        priority: 'high'
      },
      {
        notes: 'Perfect for my digital marketing agency',
        priority: 'medium'
      },
      {
        notes: 'Need for my freelance graphic design work',
        priority: 'medium'
      },
      
      // Personal and lifestyle use cases
      {
        notes: 'Planning to buy for my home entertainment system',
        priority: 'medium'
      },
      {
        notes: 'Great for my fitness and health tracking',
        priority: 'low'
      },
      {
        notes: 'Perfect for my photography and videography hobby',
        priority: 'medium'
      },
      {
        notes: 'Need for my gaming and streaming setup',
        priority: 'high'
      },
      
      // Gift and family use cases
      {
        notes: 'Planning to buy as a wedding gift for my friend',
        priority: 'high'
      },
      {
        notes: 'Great birthday present idea for my brother',
        priority: 'medium'
      },
      {
        notes: 'Perfect for my parents anniversary',
        priority: 'medium'
      },
      {
        notes: 'Need for my kids school projects',
        priority: 'low'
      },
      
      // Travel and mobility use cases
      {
        notes: 'Essential for my business travel needs',
        priority: 'high'
      },
      {
        notes: 'Perfect for my backpacking adventures',
        priority: 'medium'
      },
      {
        notes: 'Great for my road trip photography',
        priority: 'low'
      },
      {
        notes: 'Need for my international business trips',
        priority: 'high'
      },
      
      // Education and learning use cases
      {
        notes: 'Essential for my online course creation',
        priority: 'high'
      },
      {
        notes: 'Perfect for my language learning app development',
        priority: 'medium'
      },
      {
        notes: 'Great for my coding bootcamp teaching',
        priority: 'medium'
      },
      {
        notes: 'Need for my research and data analysis',
        priority: 'high'
      }
    ];

    console.log(`📝 Creating ${finalWishlistTemplates.length} final wishlist items...`);

    let createdCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < finalWishlistTemplates.length; i++) {
      const template = finalWishlistTemplates[i];
      
      // Use different users and products to avoid conflicts
      const userIndex = (i + 25) % users.length; // Start from different user
      const productIndex = (i + 2) % products.length; // Start from different product
      
      const user = users[userIndex];
      const product = products[productIndex];

      // Check if this user already has this product in their wishlist
      const existingWishlist = await wishlistsCollection.findOne({
        userId: user._id
      });

      if (existingWishlist) {
        const existingItem = existingWishlist.items.find(item => 
          item.productId.toString() === product._id.toString()
        );

        if (existingItem) {
          console.log(`⚠️  User ${user.email} already has ${product.name} in wishlist, skipping...`);
          skippedCount++;
          continue;
        }
      }

      // Create or update wishlist
      const wishlistItem = {
        productId: new ObjectId(product._id),
        addedAt: new Date(),
        notes: template.notes
      };

      if (existingWishlist) {
        // Add to existing wishlist
        const result = await wishlistsCollection.updateOne(
          { userId: user._id },
          { $push: { items: wishlistItem } }
        );
        
        if (result.modifiedCount > 0) {
          console.log(`✅ Final wishlist item ${i + 1}: ${product.name} for ${user.email}`);
          createdCount++;
        } else {
          console.log(`❌ Failed to add wishlist item ${i + 1}`);
        }
      } else {
        // Create new wishlist
        const newWishlist = {
          userId: new ObjectId(user._id),
          items: [wishlistItem],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const result = await wishlistsCollection.insertOne(newWishlist);
        
        if (result.insertedId) {
          console.log(`✅ Final wishlist ${i + 1} created: ${product.name} for ${user.email}`);
          createdCount++;
        } else {
          console.log(`❌ Failed to create wishlist ${i + 1}`);
        }
      }
    }

    // Create some users with very extensive wishlists (wishlist enthusiasts)
    console.log('\n🔄 Creating wishlist enthusiasts with extensive collections...');
    
    const enthusiastUsers = users.slice(20, 25); // Users 20-24 become enthusiasts
    for (let i = 0; i < enthusiastUsers.length; i++) {
      const user = enthusiastUsers[i];
      const allProducts = products; // Get all products for enthusiasts
      
      for (const product of allProducts) {
        const existingWishlist = await wishlistsCollection.findOne({
          userId: user._id
        });

        if (existingWishlist) {
          const existingItem = existingWishlist.items.find(item => 
            item.productId.toString() === product._id.toString()
          );

          if (!existingItem) {
            const enthusiastItem = {
              productId: new ObjectId(product._id),
              addedAt: new Date(),
              notes: `Enthusiast item ${i + 1}: ${product.name} - Collecting all available products`
            };

            await wishlistsCollection.updateOne(
              { userId: user._id },
              { $push: { items: enthusiastItem } }
            );
            console.log(`✅ Enthusiast item added: ${product.name} for ${user.email}`);
            createdCount++;
          }
        }
      }
    }

    // Comprehensive final statistics
    console.log('\n🔄 Final wishlist statistics update...');
    
    const totalWishlists = await wishlistsCollection.countDocuments();
    const totalItems = await wishlistsCollection.aggregate([
      { $group: { _id: null, total: { $sum: { $size: '$items' } } } }
    ]).toArray();

    // User wishlist statistics
    const userWishlistStats = await wishlistsCollection.aggregate([
      { $project: { userId: 1, itemCount: { $size: '$items' } } },
      { $sort: { itemCount: -1 } }
    ]).toArray();

    // Product popularity in wishlists
    const productWishlistStats = await wishlistsCollection.aggregate([
      { $unwind: '$items' },
      { $group: { _id: '$items.productId', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();

    console.log('\n🎉 Final Wishlists Creation Completed!');
    console.log('📊 Comprehensive Summary:');
    console.log(`   - Final Items Created: ${createdCount}`);
    console.log(`   - Items Skipped: ${skippedCount}`);
    console.log(`   - Total Wishlists: ${totalWishlists}`);
    console.log(`   - Total Wishlist Items: ${totalItems[0]?.total || 0}`);
    console.log('   - Wishlist enthusiasts created with complete collections');
    console.log('   - Wishlist system is now COMPLETELY populated!');

    // Show top users by wishlist size
    if (userWishlistStats.length > 0) {
      console.log('\n👑 Top Users by Wishlist Size:');
      userWishlistStats.slice(0, 10).forEach((stat, index) => {
        console.log(`   ${index + 1}. User ID: ${stat.userId} - ${stat.itemCount} items`);
      });
    }

    // Show product popularity in wishlists
    if (productWishlistStats.length > 0) {
      console.log('\n🔥 Product Popularity in Wishlists:');
      productWishlistStats.forEach((stat, index) => {
        console.log(`   ${index + 1}. Product ID: ${stat._id} - ${stat.count} wishlist additions`);
      });
    }

    console.log('\n🚀 Wishlist System Status:');
    console.log('   - Rich, diverse data across all user types');
    console.log('   - Multiple use cases and priorities covered');
    console.log('   - Power users and enthusiasts created');
    console.log('   - Ready for comprehensive testing and demonstration!');

  } catch (error) {
    console.error('❌ Error creating final wishlists:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createFinalWishlists();
