const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function createMultipleCategories() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    const categoriesCollection = db.collection('categories');

    // Define comprehensive category structure
    const categoryStructure = [
      {
        name: 'Electronics',
        description: 'Electronic devices and gadgets for modern living',
        slug: 'electronics',
        isFeatured: true,
        sortOrder: 1,
        children: [
          {
            name: 'Smartphones',
            description: 'Latest smartphones and mobile devices',
            slug: 'smartphones',
            isFeatured: true,
            sortOrder: 1,
            children: [
              { name: 'iPhone', slug: 'iphone', sortOrder: 1 },
              { name: 'Android Phones', slug: 'android-phones', sortOrder: 2 },
              { name: 'Feature Phones', slug: 'feature-phones', sortOrder: 3 }
            ]
          },
          {
            name: 'Laptops & Computers',
            description: 'Laptops, desktops, and computer accessories',
            slug: 'laptops-computers',
            isFeatured: true,
            sortOrder: 2,
            children: [
              { name: 'Laptops', slug: 'laptops', sortOrder: 1 },
              { name: 'Desktop Computers', slug: 'desktop-computers', sortOrder: 2 },
              { name: 'MacBooks', slug: 'macbooks', sortOrder: 3 },
              { name: 'Computer Accessories', slug: 'computer-accessories', sortOrder: 4 }
            ]
          },
          {
            name: 'Tablets',
            description: 'Tablets and e-readers',
            slug: 'tablets',
            sortOrder: 3,
            children: [
              { name: 'iPad', slug: 'ipad', sortOrder: 1 },
              { name: 'Android Tablets', slug: 'android-tablets', sortOrder: 2 },
              { name: 'E-Readers', slug: 'e-readers', sortOrder: 3 }
            ]
          },
          {
            name: 'Audio & Video',
            description: 'Headphones, speakers, and video equipment',
            slug: 'audio-video',
            sortOrder: 4,
            children: [
              { name: 'Headphones', slug: 'headphones', sortOrder: 1 },
              { name: 'Speakers', slug: 'speakers', sortOrder: 2 },
              { name: 'Cameras', slug: 'cameras', sortOrder: 3 },
              { name: 'TVs & Monitors', slug: 'tvs-monitors', sortOrder: 4 }
            ]
          }
        ]
      },
      {
        name: 'Fashion',
        description: 'Clothing, shoes, and fashion accessories',
        slug: 'fashion',
        isFeatured: true,
        sortOrder: 2,
        children: [
          {
            name: 'Men\'s Clothing',
            description: 'Men\'s apparel and fashion items',
            slug: 'mens-clothing',
            sortOrder: 1,
            children: [
              { name: 'Shirts & T-Shirts', slug: 'mens-shirts-tshirts', sortOrder: 1 },
              { name: 'Pants & Jeans', slug: 'mens-pants-jeans', sortOrder: 2 },
              { name: 'Jackets & Coats', slug: 'mens-jackets-coats', sortOrder: 3 },
              { name: 'Suits & Formal Wear', slug: 'mens-suits-formal', sortOrder: 4 }
            ]
          },
          {
            name: 'Women\'s Clothing',
            description: 'Women\'s apparel and fashion items',
            slug: 'womens-clothing',
            isFeatured: true,
            sortOrder: 2,
            children: [
              { name: 'Dresses', slug: 'womens-dresses', sortOrder: 1 },
              { name: 'Tops & Blouses', slug: 'womens-tops-blouses', sortOrder: 2 },
              { name: 'Pants & Jeans', slug: 'womens-pants-jeans', sortOrder: 3 },
              { name: 'Skirts', slug: 'womens-skirts', sortOrder: 4 }
            ]
          },
          {
            name: 'Shoes',
            description: 'Footwear for all occasions',
            slug: 'shoes',
            sortOrder: 3,
            children: [
              { name: 'Sneakers', slug: 'sneakers', sortOrder: 1 },
              { name: 'Boots', slug: 'boots', sortOrder: 2 },
              { name: 'Formal Shoes', slug: 'formal-shoes', sortOrder: 3 },
              { name: 'Sandals', slug: 'sandals', sortOrder: 4 }
            ]
          },
          {
            name: 'Accessories',
            description: 'Fashion accessories and jewelry',
            slug: 'fashion-accessories',
            sortOrder: 4,
            children: [
              { name: 'Bags & Handbags', slug: 'bags-handbags', sortOrder: 1 },
              { name: 'Jewelry', slug: 'jewelry', sortOrder: 2 },
              { name: 'Watches', slug: 'watches', sortOrder: 3 },
              { name: 'Sunglasses', slug: 'sunglasses', sortOrder: 4 }
            ]
          }
        ]
      },
      {
        name: 'Home & Garden',
        description: 'Home decor, furniture, and garden supplies',
        slug: 'home-garden',
        isFeatured: true,
        sortOrder: 3,
        children: [
          {
            name: 'Furniture',
            description: 'Home and office furniture',
            slug: 'furniture',
            sortOrder: 1,
            children: [
              { name: 'Living Room', slug: 'living-room-furniture', sortOrder: 1 },
              { name: 'Bedroom', slug: 'bedroom-furniture', sortOrder: 2 },
              { name: 'Dining Room', slug: 'dining-room-furniture', sortOrder: 3 },
              { name: 'Office', slug: 'office-furniture', sortOrder: 4 }
            ]
          },
          {
            name: 'Home Decor',
            description: 'Decorative items for your home',
            slug: 'home-decor',
            sortOrder: 2,
            children: [
              { name: 'Wall Art', slug: 'wall-art', sortOrder: 1 },
              { name: 'Cushions & Throws', slug: 'cushions-throws', sortOrder: 2 },
              { name: 'Vases & Planters', slug: 'vases-planters', sortOrder: 3 },
              { name: 'Candles & Fragrances', slug: 'candles-fragrances', sortOrder: 4 }
            ]
          },
          {
            name: 'Kitchen & Dining',
            description: 'Kitchen appliances and dining essentials',
            slug: 'kitchen-dining',
            sortOrder: 3,
            children: [
              { name: 'Kitchen Appliances', slug: 'kitchen-appliances', sortOrder: 1 },
              { name: 'Cookware', slug: 'cookware', sortOrder: 2 },
              { name: 'Dining & Serving', slug: 'dining-serving', sortOrder: 3 },
              { name: 'Storage & Organization', slug: 'kitchen-storage', sortOrder: 4 }
            ]
          },
          {
            name: 'Garden & Outdoor',
            description: 'Garden tools and outdoor living',
            slug: 'garden-outdoor',
            sortOrder: 4,
            children: [
              { name: 'Garden Tools', slug: 'garden-tools', sortOrder: 1 },
              { name: 'Plants & Seeds', slug: 'plants-seeds', sortOrder: 2 },
              { name: 'Outdoor Furniture', slug: 'outdoor-furniture', sortOrder: 3 },
              { name: 'BBQ & Grilling', slug: 'bbq-grilling', sortOrder: 4 }
            ]
          }
        ]
      },
      {
        name: 'Sports & Outdoors',
        description: 'Sports equipment and outdoor activities',
        slug: 'sports-outdoors',
        sortOrder: 4,
        children: [
          {
            name: 'Fitness & Exercise',
            description: 'Fitness equipment and workout gear',
            slug: 'fitness-exercise',
            sortOrder: 1,
            children: [
              { name: 'Cardio Equipment', slug: 'cardio-equipment', sortOrder: 1 },
              { name: 'Strength Training', slug: 'strength-training', sortOrder: 2 },
              { name: 'Yoga & Pilates', slug: 'yoga-pilates', sortOrder: 3 },
              { name: 'Fitness Accessories', slug: 'fitness-accessories', sortOrder: 4 }
            ]
          },
          {
            name: 'Team Sports',
            description: 'Equipment for team sports',
            slug: 'team-sports',
            sortOrder: 2,
            children: [
              { name: 'Soccer', slug: 'soccer', sortOrder: 1 },
              { name: 'Basketball', slug: 'basketball', sortOrder: 2 },
              { name: 'Football', slug: 'football', sortOrder: 3 },
              { name: 'Baseball', slug: 'baseball', sortOrder: 4 }
            ]
          },
          {
            name: 'Outdoor Activities',
            description: 'Gear for outdoor adventures',
            slug: 'outdoor-activities',
            sortOrder: 3,
            children: [
              { name: 'Hiking & Camping', slug: 'hiking-camping', sortOrder: 1 },
              { name: 'Fishing', slug: 'fishing', sortOrder: 2 },
              { name: 'Cycling', slug: 'cycling', sortOrder: 3 },
              { name: 'Water Sports', slug: 'water-sports', sortOrder: 4 }
            ]
          }
        ]
      },
      {
        name: 'Books & Media',
        description: 'Books, movies, music, and educational materials',
        slug: 'books-media',
        sortOrder: 5,
        children: [
          {
            name: 'Books',
            description: 'Fiction, non-fiction, and educational books',
            slug: 'books',
            sortOrder: 1,
            children: [
              { name: 'Fiction', slug: 'fiction-books', sortOrder: 1 },
              { name: 'Non-Fiction', slug: 'non-fiction-books', sortOrder: 2 },
              { name: 'Educational', slug: 'educational-books', sortOrder: 3 },
              { name: 'Children\'s Books', slug: 'childrens-books', sortOrder: 4 }
            ]
          },
          {
            name: 'Movies & TV',
            description: 'Movies, TV shows, and streaming content',
            slug: 'movies-tv',
            sortOrder: 2,
            children: [
              { name: 'Movies', slug: 'movies', sortOrder: 1 },
              { name: 'TV Shows', slug: 'tv-shows', sortOrder: 2 },
              { name: 'Documentaries', slug: 'documentaries', sortOrder: 3 },
              { name: 'Anime & Animation', slug: 'anime-animation', sortOrder: 4 }
            ]
          },
          {
            name: 'Music',
            description: 'Music albums, instruments, and audio equipment',
            slug: 'music',
            sortOrder: 3,
            children: [
              { name: 'Albums & Singles', slug: 'albums-singles', sortOrder: 1 },
              { name: 'Musical Instruments', slug: 'musical-instruments', sortOrder: 2 },
              { name: 'Audio Equipment', slug: 'audio-equipment', sortOrder: 3 },
              { name: 'Sheet Music', slug: 'sheet-music', sortOrder: 4 }
            ]
          }
        ]
      }
    ];

    console.log('📝 Creating comprehensive category structure...');

    let createdCount = 0;
    let skippedCount = 0;

    // Function to create categories recursively
    async function createCategories(categories, parentId = null, level = 0, path = []) {
      for (let i = 0; i < categories.length; i++) {
        const categoryData = categories[i];
        
        // Check if category already exists
        const existingCategory = await categoriesCollection.findOne({
          slug: categoryData.slug
        });

        if (existingCategory) {
          console.log(`⚠️  Category ${categoryData.name} already exists, skipping...`);
          skippedCount++;
          continue;
        }

        // Create category object
        const category = {
          name: categoryData.name,
          description: categoryData.description || '',
          slug: categoryData.slug,
          parentId: parentId ? new ObjectId(parentId) : null,
          level: level,
          path: path.map(id => new ObjectId(id)),
          isActive: true,
          isFeatured: categoryData.isFeatured || false,
          sortOrder: categoryData.sortOrder || 0,
          keywords: [],
          createdAt: new Date(),
          updatedAt: new Date()
        };

        // Insert category
        const result = await categoriesCollection.insertOne(category);
        
        if (result.insertedId) {
          console.log(`✅ Category created: ${category.name} (Level ${level})`);
          createdCount++;

          // Create children if they exist
          if (categoryData.children && categoryData.children.length > 0) {
            const newPath = [...path, result.insertedId.toString()];
            await createCategories(categoryData.children, result.insertedId.toString(), level + 1, newPath);
          }
        } else {
          console.log(`❌ Failed to create category: ${category.name}`);
        }
      }
    }

    // Start creating categories
    await createCategories(categoryStructure);

    // Final statistics
    const totalCategories = await categoriesCollection.countDocuments();
    const rootCategories = await categoriesCollection.countDocuments({ parentId: null });
    const featuredCategories = await categoriesCollection.countDocuments({ isFeatured: true });

    // Category level distribution
    const levelDistribution = await categoriesCollection.aggregate([
      { $group: { _id: '$level', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]).toArray();

    console.log('\n🎉 Multiple Categories Creation Completed!');
    console.log('📊 Summary:');
    console.log(`   - Categories Created: ${createdCount}`);
    console.log(`   - Categories Skipped: ${skippedCount}`);
    console.log(`   - Total Categories: ${totalCategories}`);
    console.log(`   - Root Categories: ${rootCategories}`);
    console.log(`   - Featured Categories: ${featuredCategories}`);
    console.log('   - Category system is now populated with comprehensive hierarchy!');

    console.log('\n📈 Category Level Distribution:');
    levelDistribution.forEach(stat => {
      console.log(`   Level ${stat._id}: ${stat.count} categories`);
    });

    console.log('\n🌳 Category Structure Created:');
    console.log('   - Electronics (with 4 subcategories and 16 sub-subcategories)');
    console.log('   - Fashion (with 4 subcategories and 16 sub-subcategories)');
    console.log('   - Home & Garden (with 4 subcategories and 16 sub-subcategories)');
    console.log('   - Sports & Outdoors (with 3 subcategories and 12 sub-subcategories)');
    console.log('   - Books & Media (with 3 subcategories and 12 sub-subcategories)');
    console.log('   - Total: 5 main categories, 18 subcategories, 72 sub-subcategories');

  } catch (error) {
    console.error('❌ Error creating multiple categories:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createMultipleCategories();
