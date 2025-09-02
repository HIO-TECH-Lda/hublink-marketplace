const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function createMultiplePayments() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db();
    const paymentsCollection = db.collection('payments');
    const ordersCollection = db.collection('orders');
    const usersCollection = db.collection('users');

    // Get available data
    const orders = await ordersCollection.find({}).toArray();
    const users = await usersCollection.find({}).toArray();

    if (orders.length === 0) {
      console.log('❌ Need orders in database to create payments');
      return;
    }

    console.log(`📊 Found ${orders.length} orders, ${users.length} users`);

    // Payment method distribution
    const paymentMethods = [
      'stripe',
      'paypal', 
      'bank_transfer',
      'cash_on_delivery',
      'm_pesa',
      'e_mola'
    ];

    // Payment status distribution
    const paymentStatuses = [
      'pending',
      'processing', 
      'completed',
      'failed',
      'refunded'
    ];

    // Gateway distribution
    const gateways = [
      'stripe',
      'paypal',
      'manual',
      'm_pesa',
      'e_mola'
    ];

    // Currency options
    const currencies = ['USD', 'EUR', 'GBP', 'MZN', 'ZAR'];

    console.log(`📝 Creating payments for ${orders.length} orders...`);

    let createdCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      
      // Check if payment already exists for this order
      const existingPayment = await paymentsCollection.findOne({
        orderId: order._id
      });

      if (existingPayment) {
        console.log(`⚠️  Payment already exists for order ${order.orderNumber}, skipping...`);
        skippedCount++;
        continue;
      }

      // Create diverse payment data
      const paymentMethod = paymentMethods[i % paymentMethods.length];
      const paymentStatus = paymentStatuses[i % paymentStatuses.length];
      const gateway = gateways[i % gateways.length];
      const currency = currencies[i % currencies.length];

      // Create payment object
      const payment = {
        orderId: new ObjectId(order._id),
        userId: new ObjectId(order.userId),
        amount: order.total,
        currency: currency,
        method: paymentMethod,
        status: paymentStatus,
        gateway: gateway,
        gatewayTransactionId: paymentStatus === 'completed' ? `TXN-${Date.now()}-${i}` : undefined,
        gatewayResponse: paymentStatus === 'failed' ? { error: 'Payment gateway error', code: 'PAYMENT_FAILED' } : undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      // Add refund data for refunded payments
      if (paymentStatus === 'refunded') {
        payment.refundAmount = order.total * 0.5; // Partial refund
        payment.refundReason = 'Customer requested partial refund';
        payment.refundedAt = new Date();
      }

      // Add gateway-specific data
      if (gateway === 'stripe') {
        payment.gatewayResponse = {
          stripe_payment_intent_id: `pi_${Date.now()}_${i}`,
          stripe_charge_id: `ch_${Date.now()}_${i}`,
          stripe_customer_id: `cus_${Date.now()}_${i}`
        };
      } else if (gateway === 'paypal') {
        payment.gatewayResponse = {
          paypal_payment_id: `PAY-${Date.now()}-${i}`,
          paypal_order_id: `PAY-ORDER-${Date.now()}-${i}`,
          paypal_capture_id: `CAPTURE-${Date.now()}-${i}`
        };
      } else if (gateway === 'm_pesa') {
        payment.gatewayResponse = {
          mpesa_transaction_id: `MPESA-${Date.now()}-${i}`,
          mpesa_merchant_request_id: `MR-${Date.now()}-${i}`,
          mpesa_checkout_request_id: `CR-${Date.now()}-${i}`,
          mpesa_result_code: '0',
          mpesa_result_desc: 'Success'
        };
      } else if (gateway === 'e_mola') {
        payment.gatewayResponse = {
          emola_transaction_id: `EMOLA-${Date.now()}-${i}`,
          emola_merchant_id: `MERCHANT-${Date.now()}-${i}`,
          emola_result_code: '200',
          emola_result_desc: 'Payment successful'
        };
      }

      // Insert payment
      const result = await paymentsCollection.insertOne(payment);
      
      if (result.insertedId) {
        console.log(`✅ Payment ${i + 1} created: ${order.orderNumber} - ${paymentMethod} - ${paymentStatus}`);
        createdCount++;
      } else {
        console.log(`❌ Failed to create payment ${i + 1}`);
      }
    }

    // Create additional payments for some orders (multiple payment attempts)
    console.log('\n🔄 Creating additional payment attempts for some orders...');
    
    const ordersForMultiplePayments = orders.slice(0, 3); // First 3 orders get multiple payments
    for (let i = 0; i < ordersForMultiplePayments.length; i++) {
      const order = ordersForMultiplePayments[i];
      
      // Create a failed payment attempt
      const failedPayment = {
        orderId: new ObjectId(order._id),
        userId: new ObjectId(order.userId),
        amount: order.total,
        currency: 'USD',
        method: 'stripe',
        status: 'failed',
        gateway: 'stripe',
        gatewayResponse: {
          error: 'Card declined',
          code: 'card_declined',
          decline_code: 'insufficient_funds',
          stripe_payment_intent_id: `pi_failed_${Date.now()}_${i}`
        },
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
        updatedAt: new Date(Date.now() - 3600000)
      };

      const result = await paymentsCollection.insertOne(failedPayment);
      if (result.insertedId) {
        console.log(`✅ Failed payment attempt created for order: ${order.orderNumber}`);
        createdCount++;
      }
    }

    // Final statistics
    const totalPayments = await paymentsCollection.countDocuments();
    const paymentsByStatus = await paymentsCollection.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();

    const paymentsByMethod = await paymentsCollection.aggregate([
      { $group: { _id: '$method', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();

    const paymentsByGateway = await paymentsCollection.aggregate([
      { $group: { _id: '$gateway', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();

    console.log('\n🎉 Multiple Payments Creation Completed!');
    console.log('📊 Summary:');
    console.log(`   - Payments Created: ${createdCount}`);
    console.log(`   - Payments Skipped: ${skippedCount}`);
    console.log(`   - Total Payments: ${totalPayments}`);
    console.log('   - Payment system is now populated with diverse data!');

    console.log('\n📈 Payment Status Distribution:');
    paymentsByStatus.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count}`);
    });

    console.log('\n💳 Payment Method Distribution:');
    paymentsByMethod.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count}`);
    });

    console.log('\n🌐 Payment Gateway Distribution:');
    paymentsByGateway.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count}`);
    });

  } catch (error) {
    console.error('❌ Error creating multiple payments:', error);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

createMultiplePayments();
