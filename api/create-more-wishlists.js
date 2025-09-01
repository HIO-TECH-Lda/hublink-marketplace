const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function createMoreWishlists() {
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

    // More diverse wishlist content
    const additionalWishlistTemplates = [
      // High priority items
      {
        notes: 'Urgent need for my business presentation next week',
        priority: 'high'
      },
      {
        notes: 'Essential for my daily productivity workflow',
        priority: 'high'
      },
      {
        notes: 'Need this before my business trip',
        priority: 'high'
      },
      {
        notes: 'Critical for my project deadline',
        priority: 'high'
      },
      
      // Medium priority items
      {
        notes: 'Planning to buy within the next month',
        priority: 'medium'
      },
      {
        notes: 'Good to have for my home office',
        priority: 'medium'
      },
      {
        notes: 'Considering this for my team',
        priority: 'medium'
      },
      {
        notes: 'Waiting for budget approval',
        priority: 'medium'
      },
      
      // Low priority items
      {
        notes: 'Nice to have, but not urgent',
        priority: 'low'
      },
      {
        notes: 'Planning for future upgrade',
        priority: 'low'
      },
      {
        notes: 'Researching market options',
        priority: 'low'
      },
      {
        notes: 'Waiting for better pricing',
        priority: 'low'
      }
    ];

    // Special themed wishlist items
    const themedWishlistItems = [
      {
        notes: 'Perfect for my photography hobby',
        priority: 'medium'
      },
      {
        notes: 'Great for my gaming setup',
        priority: 'high'
      },
      {
        notes: 'Essential for my remote work',
        priority: 'high'
      },
      {
        notes: 'Planning to buy as a family gift',
        priority: 'medium'
      },
      {
        notes: 'Need for my fitness tracking',
        priority: 'low'
      },
      {
        notes: 'Perfect for my creative projects',
        priority: 'medium'
      },
      {
        notes: 'Essential for my online business',
        priority: 'high'
      },
      {
        notes: 'Planning to buy for my startup',
        priority: 'medium'
      },
      {
        notes: 'Great for my travel photography',
        priority: 'low'
      },
      {
        notes: 'Need for my podcast recording',
        priority: 'medium'
      }
    ];

    const allTemplates = [...additionalWishlistTemplates, ...themedWishlistItems];
    console.log(`📝 Creating ${allTemplates.length} additional wishlist items...`);

    let createdCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < allTemplates.length; i++) {
      const template = allTemplates[i];
      
      // Use different users and products to avoid conflicts
      const userIndex = (i + 15) % users.length; // Start from different user
      const productIndex = (i + 4) % products.length; // Start from different product
      
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
          console.log(`✅ Additional wishlist item ${i + 1}: ${product.name} for ${user.email}`);
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
          console.log(`✅ New wishlist ${i + 1} created: ${product.name} for ${user.email}`);
          createdCount++;
        } else {
          console.log(`❌ Failed to create wishlist ${i + 1}`);
        }
      }
    }

    // Create some power users with extensive wishlists
    console.log('\n🔄 Creating power users with extensive wishlists...');
    
    const powerUsers = users.slice(10, 15); // Users 10-14 get extensive wishlists
    for (let i = 0; i < powerUsers.length; i++) {
      const user = powerUsers[i];
      const additionalProducts = products.slice(0, 3); // Get 3 products for each power user
      
      for (const product of additionalProducts) {
        const existingWishlist = await wishlistsCollection.findOne({
          userId: user._id
        });

        if (existingWishlist) {
          const existingItem = existingWishlist.items.find(item => 
            item.productId.toString() === product._id.toString()
          );

          if (!existingItem) {
            const powerUserItem = {
              productId: new ObjectId(product._id),
              addedAt: new Date(),
              notes: `Power user item ${i + 1}: ${product.name} - High priority for professional use`
            };

            await wishlistsCollection.updateOne(
              { userId: user._id },
              { $push: { items: powerUserItem } }
            );
            console.log(`✅ Power user item added: ${product.name} for ${user.email}`);
            createdCount++;
          }
        }
      }
    }

    // Final comprehensive statistics
    const totalWishlists = await wishlistsCollection.countDocuments();
    const totalItems = await wishlistsCollection.aggregate([
      { $group: { _id: null, total: { $sum: { $size: '$items' } } } }
    ]).toArray();

    // User wishlist statistics
    const userWishlistStats = await wishlistsCollection.aggregate([
      { $project: { userId: 1, itemCount: { $size: '$items' } } },
      { $sort: { itemCount: -1 } }
    ]).toArray();

    console.log('\n🎉 Additional Wishlists Creation Completed!');
    console.log('📊 Summary:');
    console.log(`   - Additional Items Created: ${createdCount}`);
    console.log(`   - Items Skipped: ${skippedCount}`);
    console.log(`   - Total Wishlists: ${totalWishlists}`);
    console.log(`   - Total Wishlist Items: ${totalItems[0]?.total || 0}`);
    console.log('   - Power users created with extensive wishlists');
    console.log('   - Wishlist system is now richly populated!');

    // Show top users by wishlist size
    if (userWishlistStats.length > 0) {
      console.log('\n👑 Top Users by Wishlist Size:');
      userWishlistStats.slice(0, 5).forEach((stat, index) => {
        console.log(`   ${index + 1}. User ID: ${stat.userId} - ${stat.itemCount} items`);
      });
    }

  } catch (error) {
    console.error('❌ Error creating additional wishlists:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createMoreWishlists();
