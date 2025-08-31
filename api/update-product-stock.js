const axios = require('axios');

const BASE_URL = 'http://localhost:3002/api/v1';

async function updateProductStock() {
  console.log('🔄 Updating product stock for testing...\n');

  // Step 1: Get products
  console.log('📦 Step 1: Getting products...');
  
  try {
    const productsResponse = await axios.get(`${BASE_URL}/products?limit=5`);
    const products = productsResponse.data.data?.products || [];
    console.log(`✅ Found ${products.length} products`);
    
    // Display product info
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name} - Stock: ${product.stock} - Status: ${product.status}`);
    });

    if (products.length === 0) {
      console.error('❌ No products found');
      return;
    }

    // Use the first product that has stock > 0 or update stock
    const productToUse = products.find(p => p.stock > 0) || products[0];
    
    if (productToUse.stock === 0) {
      console.log(`\n⚠️  Product "${productToUse.name}" has 0 stock.`);
      console.log('For testing purposes, you can manually update the stock in the database.');
      console.log(`Product ID: ${productToUse._id}`);
      console.log(`Current stock: ${productToUse.stock}`);
    } else {
      console.log(`\n✅ Using product: ${productToUse.name} (Stock: ${productToUse.stock})`);
    }

  } catch (error) {
    console.error('❌ Failed to get products:', error.response?.data || error.message);
  }
}

updateProductStock().catch(console.error);
