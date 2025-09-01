const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function createMultipleWishlists() {
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

    if (users.length === 0 || products.length === 0) {
      console.log('❌ Need users and products in database');
      return;
    }

    console.log(`📊 Found ${users.length} users, ${products.length} products`);

    // Sample wishlist data with variety
    const wishlistTemplates = [
      {
        notes: 'Planning to buy this for my birthday next month',
        priority: 'high'
      },
      {
        notes: 'Looks perfect for my home office setup',
        priority: 'medium'
      },
      {
        notes: 'Great gift idea for my sister',
        priority: 'high'
      },
      {
        notes: 'Waiting for a sale or discount',
        priority: 'low'
      },
      {
        notes: 'Need this for my upcoming project',
        priority: 'high'
      },
      {
        notes: 'Researching alternatives before buying',
        priority: 'medium'
      },
      {
        notes: 'Saving up for this purchase',
        priority: 'medium'
      },
      {
        notes: 'Perfect for my travel needs',
        priority: 'high'
      },
      {
        notes: 'Comparing with other brands',
        priority: 'low'
      },
      {
        notes: 'Essential for my daily workflow',
        priority: 'high'
      }
    ];

    const additionalWishlistTemplates = [
      {
        notes: 'Planning to buy when I get my bonus',
        priority: 'medium'
      },
      {
        notes: 'Waiting for the new model to release',
        priority: 'low'
      },
      {
        notes: 'Need to check reviews first',
        priority: 'medium'
      },
      {
        notes: 'Perfect for my business needs',
        priority: 'high'
      },
      {
        notes: 'Looking for a better price',
        priority: 'medium'
      },
      {
        notes: 'Planning to buy as a gift',
        priority: 'high'
      },
      {
        notes: 'Waiting for warranty information',
        priority: 'low'
      },
      {
        notes: 'Need to check compatibility',
        priority: 'medium'
      },
      {
        notes: 'Planning to buy in bulk for team',
        priority: 'high'
      },
      {
        notes: 'Waiting for customer feedback',
        priority: 'low'
      }
    ];

    const allTemplates = [...wishlistTemplates, ...additionalWishlistTemplates];
    console.log(`📝 Creating wishlist items for ${allTemplates.length} user-product combinations...`);

    let createdCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < allTemplates.length; i++) {
      const template = allTemplates[i];
      
      // Rotate through users and products
      const user = users[i % users.length];
      const product = products[i % products.length];

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
          console.log(`✅ Wishlist item ${i + 1} added: ${product.name} for ${user.email}`);
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
          console.log(`✅ Wishlist ${i + 1} created: ${product.name} for ${user.email}`);
          createdCount++;
        } else {
          console.log(`❌ Failed to create wishlist ${i + 1}`);
        }
      }
    }

    // Create some users with multiple wishlist items
    console.log('\n🔄 Creating users with multiple wishlist items...');
    
    const multiWishlistUsers = users.slice(0, 5); // First 5 users get multiple items
    for (let i = 0; i < multiWishlistUsers.length; i++) {
      const user = multiWishlistUsers[i];
      const additionalProducts = products.slice(i + 1, i + 3); // Get 2 additional products
      
      for (const product of additionalProducts) {
        const existingWishlist = await wishlistsCollection.findOne({
          userId: user._id
        });

        if (existingWishlist) {
          const existingItem = existingWishlist.items.find(item => 
            item.productId.toString() === product._id.toString()
          );

          if (!existingItem) {
            const additionalItem = {
              productId: new ObjectId(product._id),
              addedAt: new Date(),
              notes: `Additional item ${i + 1}: ${product.name}`
            };

            await wishlistsCollection.updateOne(
              { userId: user._id },
              { $push: { items: additionalItem } }
            );
            console.log(`✅ Additional item added: ${product.name} for ${user.email}`);
            createdCount++;
          }
        }
      }
    }

    // Final statistics
    const totalWishlists = await wishlistsCollection.countDocuments();
    const totalItems = await wishlistsCollection.aggregate([
      { $group: { _id: null, total: { $sum: { $size: '$items' } } } }
    ]).toArray();

    console.log('\n🎉 Multiple Wishlists Creation Completed!');
    console.log('📊 Summary:');
    console.log(`   - Wishlist Items Created: ${createdCount}`);
    console.log(`   - Items Skipped: ${skippedCount}`);
    console.log(`   - Total Wishlists: ${totalWishlists}`);
    console.log(`   - Total Wishlist Items: ${totalItems[0]?.total || 0}`);
    console.log('   - Wishlist system is now populated with diverse data!');

  } catch (error) {
    console.error('❌ Error creating multiple wishlists:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createMultipleWishlists();
