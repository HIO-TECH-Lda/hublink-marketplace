const { MongoClient } = require('mongodb');
require('dotenv').config();

async function updateOrderStatus() {
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    const ordersCollection = db.collection('orders');

    // Find the most recent order
    const order = await ordersCollection.findOne({}, { sort: { createdAt: -1 } });
    
    if (!order) {
      console.log('❌ No orders found');
      return;
    }

    console.log(`📦 Found order: ${order._id}`);
    console.log(`📊 Current status: ${order.status}`);

    // Update order status to delivered
    const result = await ordersCollection.updateOne(
      { _id: order._id },
      { 
        $set: { 
          status: 'delivered',
          deliveredAt: new Date()
        },
        $set: {
          'items.$[].status': 'delivered',
          'items.$[].deliveredAt': new Date()
        }
      }
    );

    if (result.modifiedCount > 0) {
      console.log(`✅ Order status updated to delivered`);
      console.log(`🆔 Order ID: ${order._id}`);
      console.log(`📦 Order Number: ${order.orderNumber}`);
    } else {
      console.log('❌ Failed to update order status');
    }

  } catch (error) {
    console.error('❌ Error updating order:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

updateOrderStatus();
