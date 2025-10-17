const axios = require('axios');

// Test script for pay-by-link functionality
const BASE_URL = 'http://localhost:3002/api/v1';

// You'll need to replace these with actual values
const AUTH_TOKEN = 'your-auth-token-here';
const ORDER_ID = 'your-order-id-here';

async function testPayByLink() {
  try {
    console.log('🧪 Testing Pay-by-Link Creation...\n');

    const payByLinkData = {
      orderId: ORDER_ID,
      short_description: 'Payment for Order #12345',
      title: 'Order Payment',
      send_to_phone: '254700000000', // Replace with actual phone number
      type: 'DIRECT',
      transaction_type: 'C2B'
    };

    console.log('📤 Sending request to create pay-by-link...');
    console.log('Request data:', JSON.stringify(payByLinkData, null, 2));

    const response = await axios.post(
      `${BASE_URL}/imali/create-pay-by-link`,
      payByLinkData,
      {
        headers: {
          'Authorization': `Bearer ${AUTH_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('\n✅ Pay-by-Link created successfully!');
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));

    if (response.data.data.paymentLink) {
      console.log('\n🔗 Payment Link Details:');
      console.log('Link ID:', response.data.data.paymentLink.link_id);
      console.log('Customer Link ID:', response.data.data.paymentLink.customer_link_id);
      console.log('Amount:', response.data.data.paymentLink.amount);
      console.log('Status:', response.data.data.paymentLink.status);
      console.log('Expiration:', response.data.data.paymentLink.expiration_datetime);
    }

  } catch (error) {
    console.error('\n❌ Error testing pay-by-link:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error('Error message:', error.message);
    }
  }
}

// Instructions for running the test
console.log('📋 Pay-by-Link Test Instructions:');
console.log('1. Make sure your server is running on port 3002');
console.log('2. Replace AUTH_TOKEN with a valid authentication token');
console.log('3. Replace ORDER_ID with a valid order ID from your database');
console.log('4. Update the phone number in send_to_phone field');
console.log('5. Run: node test-pay-by-link.js\n');

// Uncomment the line below to run the test
// testPayByLink();
