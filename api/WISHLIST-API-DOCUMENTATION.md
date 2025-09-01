# Wishlist & Favorites API Documentation

## Overview
This document provides comprehensive documentation for the Wishlist & Favorites System API endpoints. All endpoints require authentication via JWT token in the Authorization header.

## 🔐 **Authentication**
All wishlist endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## 📋 **Base URL**
```
http://localhost:3002/api/v1/wishlist
```

---

## 🚀 **API Endpoints**

### 1. **Get User's Wishlist**
Retrieve the current user's complete wishlist with populated product details.

**Endpoint:** `GET /api/v1/wishlist`

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "Wishlist retrieved successfully",
  "data": {
    "_id": "wishlist_id",
    "userId": "user_id",
    "items": [
      {
        "productId": {
          "_id": "product_id",
          "name": "Product Name",
          "description": "Product description",
          "price": 99.99,
          "primaryImage": "image_url",
          "stock": 50,
          "status": "active",
          "sellerName": "Seller Name",
          "averageRating": 4.5,
          "totalReviews": 25,
          "slug": "product-slug"
        },
        "addedAt": "2024-12-01T10:00:00.000Z",
        "notes": "Remember to buy this for birthday"
      }
    ],
    "createdAt": "2024-12-01T10:00:00.000Z",
    "updatedAt": "2024-12-01T10:00:00.000Z"
  }
}
```

**Error Responses:**
```json
{
  "success": false,
  "message": "Access token required",
  "error": "No token provided"
}
```

---

### 2. **Add Product to Wishlist**
Add a new product to the user's wishlist or update existing item notes.

**Endpoint:** `POST /api/v1/wishlist/add`

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "productId": "product_id_here",
  "notes": "Optional notes about this product"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product added to wishlist successfully",
  "data": {
    "_id": "wishlist_id",
    "userId": "user_id",
    "items": [...],
    "createdAt": "2024-12-01T10:00:00.000Z",
    "updatedAt": "2024-12-01T10:00:00.000Z"
  }
}
```

**Error Responses:**
```json
{
  "success": false,
  "message": "Validation error",
  "error": "Product ID is required"
}
```

```json
{
  "success": false,
  "message": "Failed to add to wishlist",
  "error": "Product not found"
}
```

---

### 3. **Remove Product from Wishlist**
Remove a specific product from the user's wishlist.

**Endpoint:** `DELETE /api/v1/wishlist/remove/:productId`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**URL Parameters:**
- `productId`: The ID of the product to remove

**Response:**
```json
{
  "success": true,
  "message": "Product removed from wishlist successfully"
}
```

**Error Responses:**
```json
{
  "success": false,
  "message": "Product ID is required"
}
```

---

### 4. **Check Wishlist Status**
Check if a specific product is in the user's wishlist.

**Endpoint:** `GET /api/v1/wishlist/check/:productId`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**URL Parameters:**
- `productId`: The ID of the product to check

**Response:**
```json
{
  "success": true,
  "message": "Wishlist status checked successfully",
  "data": {
    "productId": "product_id",
    "isInWishlist": true
  }
}
```

---

### 5. **Clear Wishlist**
Remove all items from the user's wishlist.

**Endpoint:** `DELETE /api/v1/wishlist/clear`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Wishlist cleared successfully"
}
```

---

### 6. **Move Item to Cart**
Move a wishlist item to the shopping cart and remove it from the wishlist.

**Endpoint:** `POST /api/v1/wishlist/move-to-cart/:productId`

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**URL Parameters:**
- `productId`: The ID of the product to move

**Request Body:**
```json
{
  "quantity": 2
}
```

**Response:**
```json
{
  "success": true,
  "message": "Product moved to cart successfully"
}
```

**Error Responses:**
```json
{
  "success": false,
  "message": "Failed to move to cart",
  "error": "Insufficient stock"
}
```

---

### 7. **Get Wishlist Statistics**
Retrieve analytics and statistics about the user's wishlist.

**Endpoint:** `GET /api/v1/wishlist/stats`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "success": true,
  "message": "Wishlist statistics retrieved successfully",
  "data": {
    "totalItems": 15,
    "totalValue": 1499.85,
    "averagePrice": 99.99,
    "categories": ["electronics", "clothing", "books"]
  }
}
```

---

### 8. **Get Paginated Wishlist Items**
Retrieve wishlist items with pagination support.

**Endpoint:** `GET /api/v1/wishlist/items`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Example:** `GET /api/v1/wishlist/items?page=2&limit=5`

**Response:**
```json
{
  "success": true,
  "message": "Wishlist items retrieved successfully",
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 5,
    "total": 15,
    "pages": 3
  }
}
```

---

### 9. **Update Item Notes**
Update the notes for a specific wishlist item.

**Endpoint:** `PUT /api/v1/wishlist/update-notes/:productId`

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**URL Parameters:**
- `productId`: The ID of the product to update

**Request Body:**
```json
{
  "notes": "Updated notes for this product"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Wishlist item notes updated successfully"
}
```

---

### 10. **Get Recommendations**
Retrieve personalized product recommendations based on wishlist items.

**Endpoint:** `GET /api/v1/wishlist/recommendations`

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Query Parameters:**
- `limit`: Number of recommendations (default: 10)

**Example:** `GET /api/v1/wishlist/recommendations?limit=5`

**Response:**
```json
{
  "success": true,
  "message": "Recommendations retrieved successfully",
  "data": [
    {
      "_id": "product_id",
      "name": "Recommended Product",
      "description": "Product description",
      "price": 89.99,
      "primaryImage": "image_url",
      "averageRating": 4.2,
      "totalReviews": 18,
      "slug": "recommended-product-slug"
    }
  ]
}
```

---

### 11. **Bulk Add to Wishlist**
Add multiple products to the wishlist in a single request.

**Endpoint:** `POST /api/v1/wishlist/bulk-add`

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "products": [
    {
      "productId": "product_id_1",
      "notes": "First product notes"
    },
    {
      "productId": "product_id_2",
      "notes": "Second product notes"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bulk add to wishlist completed",
  "data": {
    "wishlist": {...},
    "results": [
      {"productId": "product_id_1", "success": true},
      {"productId": "product_id_2", "success": true}
    ],
    "errors": []
  }
}
```

---

### 12. **Bulk Remove from Wishlist**
Remove multiple products from the wishlist in a single request.

**Endpoint:** `DELETE /api/v1/wishlist/bulk-remove`

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "productIds": ["product_id_1", "product_id_2", "product_id_3"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bulk remove from wishlist completed",
  "data": {
    "results": [
      {"productId": "product_id_1", "success": true},
      {"productId": "product_id_2", "success": true},
      {"productId": "product_id_3", "success": true}
    ],
    "errors": []
  }
}
```

---

## 📊 **Data Models**

### **Wishlist Item Structure**
```typescript
interface IWishlistItem {
  productId: string;        // Product reference
  addedAt: Date;           // When added to wishlist
  notes?: string;          // Optional user notes (max 500 chars)
}
```

### **Product Information (Populated)**
```typescript
interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  primaryImage: string;
  stock: number;
  status: 'active' | 'inactive' | 'draft' | 'archived';
  sellerName: string;
  averageRating: number;
  totalReviews: number;
  slug: string;
}
```

---

## 🚨 **Error Handling**

### **HTTP Status Codes**
- `200` - Success
- `201` - Created (for add operations)
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (token expired)
- `404` - Not Found (product/wishlist not found)
- `500` - Internal Server Error

### **Common Error Messages**
```json
{
  "success": false,
  "message": "Access token required"
}
```

```json
{
  "success": false,
  "message": "Token expired"
}
```

```json
{
  "success": false,
  "message": "Product not found"
}
```

```json
{
  "success": false,
  "message": "Insufficient stock"
}
```

---

## 🔧 **Usage Examples**

### **JavaScript/Node.js Example**
```javascript
const axios = require('axios');

const wishlistAPI = {
  baseURL: 'http://localhost:3002/api/v1/wishlist',
  token: 'your-jwt-token-here',
  
  headers: {
    'Authorization': `Bearer ${this.token}`,
    'Content-Type': 'application/json'
  },

  // Get wishlist
  async getWishlist() {
    try {
      const response = await axios.get(this.baseURL, { headers: this.headers });
      return response.data;
    } catch (error) {
      console.error('Error fetching wishlist:', error.response.data);
    }
  },

  // Add to wishlist
  async addToWishlist(productId, notes = '') {
    try {
      const response = await axios.post(`${this.baseURL}/add`, {
        productId,
        notes
      }, { headers: this.headers });
      return response.data;
    } catch (error) {
      console.error('Error adding to wishlist:', error.response.data);
    }
  },

  // Move to cart
  async moveToCart(productId, quantity = 1) {
    try {
      const response = await axios.post(`${this.baseURL}/move-to-cart/${productId}`, {
        quantity
      }, { headers: this.headers });
      return response.data;
    } catch (error) {
      console.error('Error moving to cart:', error.response.data);
    }
  }
};
```

### **cURL Examples**
```bash
# Get wishlist
curl -X GET "http://localhost:3002/api/v1/wishlist" \
  -H "Authorization: Bearer your-jwt-token"

# Add to wishlist
curl -X POST "http://localhost:3002/api/v1/wishlist/add" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"productId": "product_id", "notes": "Remember to buy"}'

# Move to cart
curl -X POST "http://localhost:3002/api/v1/wishlist/move-to-cart/product_id" \
  -H "Authorization: Bearer your-jwt-token" \
  -H "Content-Type: application/json" \
  -d '{"quantity": 2}'
```

---

## 📈 **Performance Considerations**

### **Best Practices**
1. **Use Pagination**: For large wishlists, use the paginated endpoints
2. **Batch Operations**: Use bulk endpoints for multiple operations
3. **Caching**: Cache wishlist data on the client side
4. **Error Handling**: Implement proper error handling for all API calls

### **Rate Limiting**
- API is rate-limited to 100 requests per 15 minutes per IP
- Implement exponential backoff for retry logic

---

## 🔍 **Testing**

### **Test Endpoints**
Use the provided test file `src/__tests__/wishlist.test.ts` to verify functionality:

```bash
# Run tests
npm test

# Run specific wishlist tests
npm test -- --grep "Wishlist"
```

### **Test Coverage**
- Unit tests for service layer
- Integration tests for API endpoints
- Error handling validation
- Database operation testing

---

## 📚 **Additional Resources**

- **Implementation Summary**: `WISHLIST-IMPLEMENTATION-SUMMARY.md`
- **Source Code**: `src/` directory
- **Test Suite**: `src/__tests__/wishlist.test.ts`
- **Type Definitions**: `src/types/index.ts`

---

**Documentation Version**: 1.0  
**Last Updated**: December 2024  
**API Version**: v1  
**Status**: ✅ Complete
