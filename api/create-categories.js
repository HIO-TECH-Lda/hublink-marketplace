const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function createCategories() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    const categoriesCollection = db.collection('categories');

    // Define main categories
    const mainCategories = [
      {
        name: 'Electronics',
        description: 'Electronic devices and gadgets for modern living',
        slug: 'electronics',
        isFeatured: true,
        sortOrder: 1
      },
      {
        name: 'Fashion',
        description: 'Clothing, shoes, and fashion accessories',
        slug: 'fashion',
        isFeatured: true,
        sortOrder: 2
      },
      {
        name: 'Home & Garden',
        description: 'Home decor, furniture, and garden supplies',
        slug: 'home-garden',
        isFeatured: true,
        sortOrder: 3
      },
      {
        name: 'Sports & Outdoors',
        description: 'Sports equipment and outdoor activities',
        slug: 'sports-outdoors',
        sortOrder: 4
      },
      {
        name: 'Books & Media',
        description: 'Books, movies, music, and educational materials',
        slug: 'books-media',
        sortOrder: 5
      }
    ];

    console.log('📝 Creating main categories...');

    let createdCount = 0;
    let skippedCount = 0;

    // Create main categories
    for (let i = 0; i < mainCategories.length; i++) {
      const categoryData = mainCategories[i];
      
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
        description: categoryData.description,
        slug: categoryData.slug,
        parentId: null,
        level: 0,
        path: [],
        isActive: true,
        isFeatured: categoryData.isFeatured || false,
        sortOrder: categoryData.sortOrder,
        keywords: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Insert category
      const result = await categoriesCollection.insertOne(category);
      
      if (result.insertedId) {
        console.log(`✅ Category created: ${category.name}`);
        createdCount++;

        // Create subcategories for Electronics
        if (categoryData.slug === 'electronics') {
          const electronicsSubcategories = [
            { name: 'Smartphones', slug: 'smartphones', sortOrder: 1 },
            { name: 'Laptops & Computers', slug: 'laptops-computers', sortOrder: 2 },
            { name: 'Tablets', slug: 'tablets', sortOrder: 3 },
            { name: 'Audio & Video', slug: 'audio-video', sortOrder: 4 }
          ];

          for (const sub of electronicsSubcategories) {
            const subCategory = {
              name: sub.name,
              description: `${sub.name} and accessories`,
              slug: sub.slug,
              parentId: new ObjectId(result.insertedId),
              level: 1,
              path: [new ObjectId(result.insertedId)],
              isActive: true,
              isFeatured: false,
              sortOrder: sub.sortOrder,
              keywords: [],
              createdAt: new Date(),
              updatedAt: new Date()
            };

            const subResult = await categoriesCollection.insertOne(subCategory);
            if (subResult.insertedId) {
              console.log(`  ✅ Subcategory created: ${sub.name}`);
              createdCount++;
            }
          }
        }

        // Create subcategories for Fashion
        if (categoryData.slug === 'fashion') {
          const fashionSubcategories = [
            { name: 'Men\'s Clothing', slug: 'mens-clothing', sortOrder: 1 },
            { name: 'Women\'s Clothing', slug: 'womens-clothing', sortOrder: 2 },
            { name: 'Shoes', slug: 'shoes', sortOrder: 3 },
            { name: 'Accessories', slug: 'fashion-accessories', sortOrder: 4 }
          ];

          for (const sub of fashionSubcategories) {
            const subCategory = {
              name: sub.name,
              description: `${sub.name} and fashion items`,
              slug: sub.slug,
              parentId: new ObjectId(result.insertedId),
              level: 1,
              path: [new ObjectId(result.insertedId)],
              isActive: true,
              isFeatured: false,
              sortOrder: sub.sortOrder,
              keywords: [],
              createdAt: new Date(),
              updatedAt: new Date()
            };

            const subResult = await categoriesCollection.insertOne(subCategory);
            if (subResult.insertedId) {
              console.log(`  ✅ Subcategory created: ${sub.name}`);
              createdCount++;
            }
          }
        }

        // Create subcategories for Home & Garden
        if (categoryData.slug === 'home-garden') {
          const homeSubcategories = [
            { name: 'Furniture', slug: 'furniture', sortOrder: 1 },
            { name: 'Home Decor', slug: 'home-decor', sortOrder: 2 },
            { name: 'Kitchen & Dining', slug: 'kitchen-dining', sortOrder: 3 },
            { name: 'Garden & Outdoor', slug: 'garden-outdoor', sortOrder: 4 }
          ];

          for (const sub of homeSubcategories) {
            const subCategory = {
              name: sub.name,
              description: `${sub.name} for your home`,
              slug: sub.slug,
              parentId: new ObjectId(result.insertedId),
              level: 1,
              path: [new ObjectId(result.insertedId)],
              isActive: true,
              isFeatured: false,
              sortOrder: sub.sortOrder,
              keywords: [],
              createdAt: new Date(),
              updatedAt: new Date()
            };

            const subResult = await categoriesCollection.insertOne(subCategory);
            if (subResult.insertedId) {
              console.log(`  ✅ Subcategory created: ${sub.name}`);
              createdCount++;
            }
          }
        }
      } else {
        console.log(`❌ Failed to create category: ${category.name}`);
      }
    }

    // Final statistics
    const totalCategories = await categoriesCollection.countDocuments();
    const rootCategories = await categoriesCollection.countDocuments({ parentId: null });
    const subCategories = await categoriesCollection.countDocuments({ level: 1 });
    const featuredCategories = await categoriesCollection.countDocuments({ isFeatured: true });

    console.log('\n🎉 Categories Creation Completed!');
    console.log('📊 Summary:');
    console.log(`   - Categories Created: ${createdCount}`);
    console.log(`   - Categories Skipped: ${skippedCount}`);
    console.log(`   - Total Categories: ${totalCategories}`);
    console.log(`   - Root Categories: ${rootCategories}`);
    console.log(`   - Sub Categories: ${subCategories}`);
    console.log(`   - Featured Categories: ${featuredCategories}`);
    console.log('   - Category system is now populated with hierarchy!');

  } catch (error) {
    console.error('❌ Error creating categories:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createCategories();
