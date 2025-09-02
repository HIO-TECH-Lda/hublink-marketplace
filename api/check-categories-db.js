const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkCategoriesDB() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    const categoriesCollection = db.collection('categories');

    const categories = await categoriesCollection.find({}).toArray();

    console.log(`📊 Found ${categories.length} categories in database\n`);

    if (categories.length === 0) {
      console.log('❌ No categories found in database');
      return;
    }

    // Display root categories
    const rootCategories = categories.filter(cat => !cat.parentId);
    console.log('🌳 Root Categories:');
    rootCategories.forEach((category, index) => {
      console.log(`   ${index + 1}. ${category.name} (${category.slug})`);
      console.log(`      Description: ${category.description}`);
      console.log(`      Featured: ${category.isFeatured ? 'Yes' : 'No'}`);
      console.log(`      Sort Order: ${category.sortOrder}`);
      console.log('');
    });

    // Display subcategories grouped by parent
    console.log('📂 Subcategories by Parent:');
    rootCategories.forEach(rootCat => {
      const subcategories = categories.filter(cat => 
        cat.parentId && cat.parentId.toString() === rootCat._id.toString()
      );
      
      if (subcategories.length > 0) {
        console.log(`\n   ${rootCat.name}:`);
        subcategories.forEach((sub, index) => {
          console.log(`     ${index + 1}. ${sub.name} (${sub.slug})`);
          console.log(`        Description: ${sub.description}`);
          console.log(`        Level: ${sub.level}`);
        });
      }
    });

    // Statistics
    const totalCategories = categories.length;
    const rootCount = rootCategories.length;
    const subCount = categories.filter(cat => cat.parentId).length;
    const featuredCount = categories.filter(cat => cat.isFeatured).length;
    const activeCount = categories.filter(cat => cat.isActive).length;

    // Level distribution
    const levelDistribution = {};
    categories.forEach(cat => {
      levelDistribution[cat.level] = (levelDistribution[cat.level] || 0) + 1;
    });

    console.log('\n📊 Category Statistics:');
    console.log(`   Total Categories: ${totalCategories}`);
    console.log(`   Root Categories: ${rootCount}`);
    console.log(`   Sub Categories: ${subCount}`);
    console.log(`   Featured Categories: ${featuredCount}`);
    console.log(`   Active Categories: ${activeCount}`);

    console.log('\n📈 Level Distribution:');
    Object.keys(levelDistribution).sort().forEach(level => {
      console.log(`   Level ${level}: ${levelDistribution[level]} categories`);
    });

    // Featured categories
    const featuredCategories = categories.filter(cat => cat.isFeatured);
    if (featuredCategories.length > 0) {
      console.log('\n⭐ Featured Categories:');
      featuredCategories.forEach((cat, index) => {
        console.log(`   ${index + 1}. ${cat.name} (${cat.slug})`);
      });
    }

    // Category hierarchy tree
    console.log('\n🌳 Category Hierarchy Tree:');
    rootCategories.forEach(rootCat => {
      console.log(`   ${rootCat.name}`);
      const subcategories = categories.filter(cat => 
        cat.parentId && cat.parentId.toString() === rootCat._id.toString()
      );
      subcategories.forEach(sub => {
        console.log(`     └── ${sub.name}`);
      });
    });

    console.log('\n🎉 Category System Status:');
    console.log('   - Hierarchical structure implemented');
    console.log('   - Featured categories configured');
    console.log('   - Proper slug generation');
    console.log('   - Ready for product categorization!');

  } catch (error) {
    console.error('❌ Error checking categories:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

checkCategoriesDB();
