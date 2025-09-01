# Wishlist & Favorites System - Developer Quick Start

## 🚀 **Quick Setup**

### **1. Prerequisites**
- Node.js 16+ installed
- MongoDB running locally or Atlas connection
- JWT secret configured in environment

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Setup**
Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key-here
PORT=3002
NODE_ENV=development
```

### **4. Start Development Server**
```bash
npm run dev
```

---

## 🔧 **Core Components Overview**

### **File Structure**
```
src/
├── models/Wishlist.ts          # Database schema & methods
├── services/wishlistService.ts  # Business logic
├── controllers/wishlistController.ts # HTTP handlers
├── routes/wishlist.ts          # API endpoints
├── types/index.ts              # TypeScript interfaces
└── utils/validation.ts         # Input validation
```

### **Key Interfaces**
```typescript
interface IWishlist {
  _id?: string;
  userId: string;
  items: IWishlistItem[];
  createdAt?: Date;
  updatedAt?: Date;
}

interface IWishlistItem {
  productId: string;
  addedAt: Date;
  notes?: string;
}
```

---

## 📡 **API Quick Reference**

### **Base URL**
```
http://localhost:3002/api/v1/wishlist
```

### **Essential Endpoints**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Get user's wishlist |
| `POST` | `/add` | Add product to wishlist |
| `DELETE` | `/remove/:productId` | Remove product |
| `POST` | `/move-to-cart/:productId` | Move to cart |
| `GET` | `/stats` | Get wishlist statistics |

### **Authentication Header**
```
Authorization: Bearer <jwt-token>
```

---

## 💻 **Quick Test Examples**

### **1. Test Health Endpoint**
```bash
curl http://localhost:3002/health
```

### **2. Test API Documentation**
```bash
curl http://localhost:3002/api/v1
```

### **3. Test Wishlist Endpoint (with auth)**
```bash
curl -X GET "http://localhost:3002/api/v1/wishlist" \
  -H "Authorization: Bearer your-jwt-token"
```

---

## 🧪 **Running Tests**

### **Run All Tests**
```bash
npm test
```

### **Run Wishlist Tests Only**
```bash
npm test -- --grep "Wishlist"
```

### **Test Coverage**
```bash
npm run test:coverage
```

---

## 🔍 **Debugging Tips**

### **1. Check Server Logs**
```bash
npm run dev
# Watch console for errors and requests
```

### **2. Database Connection**
```bash
# Check MongoDB connection in logs
# Look for "Database connected successfully" message
```

### **3. Common Issues**
- **Port already in use**: Change PORT in .env
- **Database connection failed**: Check MONGODB_URI
- **JWT errors**: Verify JWT_SECRET is set

---

## 📚 **Key Methods to Know**

### **WishlistService Methods**
```typescript
// Core operations
await WishlistService.getUserWishlist(userId);
await WishlistService.addToWishlist(userId, productId, notes);
await WishlistService.removeFromWishlist(userId, productId);
await WishlistService.moveToCart(userId, productId, quantity);

// Advanced features
await WishlistService.getWishlistStats(userId);
await WishlistService.getRecommendations(userId, limit);
await WishlistService.bulkAddToWishlist(userId, products);
```

### **Controller Methods**
```typescript
// All methods return consistent response format
{
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}
```

---

## 🚨 **Error Handling**

### **Common Error Responses**
```typescript
// Authentication
401: "Access token required"
403: "Invalid token"

// Validation
400: "Product ID is required"
400: "Notes cannot exceed 500 characters"

// Business Logic
404: "Product not found"
400: "Insufficient stock"
```

### **Error Handling Pattern**
```typescript
try {
  const result = await WishlistService.someMethod();
  return res.status(200).json({
    success: true,
    message: 'Operation successful',
    data: result
  });
} catch (error: any) {
  return res.status(500).json({
    success: false,
    message: 'Operation failed',
    error: error.message
  });
}
```

---

## 🔄 **Database Operations**

### **Mongoose Methods**
```typescript
// Find or create wishlist
const wishlist = await (Wishlist as any).getOrCreateWishlist(userId);

// Add item
await wishlist.addItem(productId, notes);

// Remove item
await wishlist.removeItem(productId);

// Check if item exists
const hasItem = wishlist.hasItem(productId);
```

### **Indexes**
```typescript
// Performance indexes
wishlistSchema.index({ userId: 1 });
wishlistSchema.index({ 'items.productId': 1 });
wishlistSchema.index({ createdAt: -1 });
```

---

## 📊 **Performance Considerations**

### **Best Practices**
1. **Use pagination** for large wishlists
2. **Implement caching** on client side
3. **Use bulk operations** for multiple items
4. **Monitor database queries** for optimization

### **Query Optimization**
```typescript
// Efficient population
.populate({
  path: 'items.productId',
  select: 'name price primaryImage stock status'
})

// Lean queries for read-only operations
.lean()
```

---

## 🔮 **Next Steps**

### **1. Test the System**
- Run the test suite
- Test API endpoints manually
- Verify database operations

### **2. Integration**
- Connect with frontend application
- Implement error handling
- Add logging and monitoring

### **3. Production Ready**
- Set up environment variables
- Configure database indexes
- Implement rate limiting
- Add security headers

---

## 📞 **Need Help?**

### **Documentation Files**
- `WISHLIST-IMPLEMENTATION-SUMMARY.md` - Complete implementation details
- `WISHLIST-API-DOCUMENTATION.md` - Full API documentation
- `src/__tests__/wishlist.test.ts` - Test examples

### **Code Examples**
- Check controller methods for response patterns
- Review service layer for business logic
- Examine routes for endpoint configuration

---

**Quick Start Guide Version**: 1.0  
**Last Updated**: December 2024  
**Status**: ✅ Ready for Development
