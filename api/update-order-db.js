const mongoose = require('mongoose');
require('dotenv').config();

async function updateOrderStatus() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Import Order model
    const Order = require('./src/models/Order');

    // Find the most recent order
    const order = await Order.findOne().sort({ createdAt: -1 });
    
    if (!order) {
      console.log('❌ No orders found');
      return;
    }

    console.log(`📦 Found order: ${order._id}`);
    console.log(`📊 Current status: ${order.status}`);

    // Update order status to delivered
    order.status = 'delivered';
    order.deliveredAt = new Date();
    
    // Update all order items status to delivered
    order.items.forEach(item => {
      item.status = 'delivered';
      item.deliveredAt = new Date();
    });

    await order.save();
    
    console.log(`✅ Order status updated to: ${order.status}`);
    console.log(`📅 Delivered at: ${order.deliveredAt}`);
    console.log(`🆔 Order ID: ${order._id}`);
    console.log(`📦 Order Number: ${order.orderNumber}`);

  } catch (error) {
    console.error('❌ Error updating order:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

updateOrderStatus();
