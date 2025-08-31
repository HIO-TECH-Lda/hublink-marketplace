const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkUsersDB() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    const usersCollection = db.collection('users');

    const users = await usersCollection.find({}).toArray();

    console.log(`📊 Found ${users.length} users in database\n`);

    if (users.length === 0) {
      console.log('❌ No users found in database');
      console.log('You need to create users first for testing authentication.');
      return;
    }

    users.forEach((user, index) => {
      console.log(`👤 User ${index + 1}:`);
      console.log(`   ID: ${user._id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   First Name: ${user.firstName}`);
      console.log(`   Last Name: ${user.lastName}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Phone: ${user.phone}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log(`   Updated: ${user.updatedAt}`);
      console.log('');
    });

    const buyers = users.filter(u => u.role === 'buyer').length;
    const sellers = users.filter(u => u.role === 'seller').length;
    const admins = users.filter(u => u.role === 'admin').length;

    console.log('📈 User Statistics:');
    console.log(`   Total Users: ${users.length}`);
    console.log(`   Buyers: ${buyers}`);
    console.log(`   Sellers: ${sellers}`);
    console.log(`   Admins: ${admins}`);

    // Show login credentials for testing
    console.log('\n🔑 Login Credentials for Testing:');
    users.forEach((user, index) => {
      console.log(`   User ${index + 1}:`);
      console.log(`     Email: ${user.email}`);
      console.log(`     Password: (check database or use registration)`);
      console.log(`     Role: ${user.role}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

checkUsersDB();
