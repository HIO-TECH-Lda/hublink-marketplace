# API & Database Design - Txova Marketplace

**Version:** 1.0.0  
**Technology:** Node.js + Express + MongoDB  
**Architecture:** RESTful API with JWT Authentication

---

## 🎯 Project Overview

**E-commerce Marketplace** for organic food products with multi-tenant support for buyers, sellers, and administrators.

### **Key Features**
- Product catalog with search/filtering
- Shopping cart and wishlist
- Order processing and tracking
- Payment processing (M-Pesa, E-Mola, credit cards)
- Review and rating system
- Support ticket system
- Newsletter campaigns
- Analytics and reporting

---

## 🗄️ Database Schema

### **Core Collections**

#### **users**
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String, // unique
  phone: String,
  password: String, // hashed
  avatar: String,
  role: String, // 'buyer', 'seller', 'admin', 'support'
  isEmailVerified: Boolean,
  status: String, // 'active', 'inactive', 'suspended'
  addresses: [{
    type: String, // 'billing', 'shipping'
    firstName: String,
    lastName: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    isDefault: Boolean
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### **sellers**
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // ref: users
  businessName: String,
  businessDescription: String,
  logo: String,
  contactInfo: {
    email: String,
    phone: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    coordinates: { latitude: Number, longitude: Number }
  },
  deliveryOptions: {
    pickup: Boolean,
    localDelivery: Boolean,
    deliveryRadius: Number
  },
  paymentMethods: [String], // ['m-pesa', 'e-mola', 'credit_card']
  commissionRate: Number,
  status: String, // 'pending', 'approved', 'rejected'
  createdAt: Date,
  updatedAt: Date
}
```

#### **products**
```javascript
{
  _id: ObjectId,
  sellerId: ObjectId, // ref: sellers
  categoryId: ObjectId, // ref: categories
  name: String,
  slug: String, // unique
  description: String,
  images: [String], // URLs
  mainImage: String,
  price: Number, // in cents
  comparePrice: Number,
  stock: Number,
  isOrganic: Boolean,
  tags: [String],
  status: String, // 'draft', 'active', 'inactive'
  averageRating: Number,
  totalReviews: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### **orders**
```javascript
{
  _id: ObjectId,
  orderNumber: String, // "ORD-2024-001"
  userId: ObjectId, // ref: users
  sellerId: ObjectId, // ref: sellers
  items: [{
    productId: ObjectId,
    name: String,
    price: Number,
    quantity: Number,
    total: Number
  }],
  subtotal: Number,
  shipping: Number,
  total: Number,
  status: String, // 'pending', 'confirmed', 'shipped', 'delivered'
  paymentStatus: String, // 'pending', 'paid', 'failed'
  paymentMethod: String, // 'm-pesa', 'e-mola', 'credit_card'
  shippingAddress: {
    firstName: String,
    lastName: String,
    street: String,
    city: String,
    phone: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### **payments**
```javascript
{
  _id: ObjectId,
  orderId: ObjectId, // ref: orders
  userId: ObjectId, // ref: users
  amount: Number, // in cents
  method: String, // 'm-pesa', 'e-mola', 'credit_card'
  status: String, // 'pending', 'succeeded', 'failed'
  externalId: String, // payment gateway ID
  gateway: String, // 'm-pesa', 'e-mola', 'stripe'
  createdAt: Date,
  updatedAt: Date
}
```

#### **reviews**
```javascript
{
  _id: ObjectId,
  productId: ObjectId, // ref: products
  userId: ObjectId, // ref: users
  orderId: ObjectId, // ref: orders
  rating: Number, // 1-5
  title: String,
  comment: String,
  isVerified: Boolean,
  status: String, // 'pending', 'approved', 'rejected'
  createdAt: Date,
  updatedAt: Date
}
```

#### **tickets**
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String, // 'technical_issue', 'payment_problem'
  priority: String, // 'low', 'medium', 'high', 'urgent'
  status: String, // 'open', 'in_progress', 'resolved'
  userId: ObjectId, // ref: users
  userType: String, // 'buyer', 'seller', 'admin'
  assignedTo: ObjectId, // ref: users (support)
  messages: [{
    userId: ObjectId,
    message: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🏗️ API Architecture

### **Project Structure**
```
src/
├── config/          # Database, Redis, environment config
├── controllers/     # Route handlers
├── middleware/      # Auth, validation, rate limiting
├── models/          # Mongoose models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Helpers and constants
└── app.js           # Main application
```

### **Technology Stack**
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.x
- **Database:** MongoDB 6.x + Mongoose
- **Authentication:** JWT + bcrypt
- **File Upload:** Multer + Cloudinary
- **Email:** Nodemailer + SendGrid
- **Payment:** M-Pesa API, E-Mola API, Stripe
- **Caching:** Redis
- **Validation:** Joi

---

## 🔐 Authentication & Authorization

### **JWT Token Structure**
```javascript
{
  "payload": {
    "userId": "ObjectId",
    "email": "user@example.com",
    "role": "buyer|seller|admin|support",
    "sellerId": "ObjectId", // if seller
    "iat": 1640995200,
    "exp": 1641081600
  }
}
```

### **Authorization Levels**
```javascript
const roles = {
  buyer: ['read:products', 'create:orders', 'read:own_orders'],
  seller: ['manage:own_products', 'read:own_orders'],
  admin: ['manage:all', 'read:all', 'write:all'],
  support: ['read:tickets', 'update:tickets']
};
```

---

## 🌐 API Endpoints

### **Base URL:** `https://api.txova.com/v1`

### **Authentication**
```
POST   /auth/register          # User registration
POST   /auth/login             # User login
POST   /auth/logout            # User logout
POST   /auth/refresh           # Refresh JWT token
POST   /auth/forgot-password   # Request password reset
POST   /auth/reset-password    # Reset password
POST   /auth/verify-email      # Verify email
```

### **Users**
```
GET    /users/profile          # Get profile
PUT    /users/profile          # Update profile
PUT    /users/password         # Change password
POST   /users/avatar           # Upload avatar
GET    /users/addresses        # Get addresses
POST   /users/addresses        # Add address
PUT    /users/addresses/:id    # Update address
DELETE /users/addresses/:id    # Delete address
```

### **Products**
```
GET    /products               # List products (with filters)
GET    /products/:id           # Get product details
GET    /products/search        # Search products
GET    /products/categories    # Get categories
POST   /products               # Create product (seller)
PUT    /products/:id           # Update product (seller)
DELETE /products/:id           # Delete product (seller)
POST   /products/:id/images    # Upload images
```

### **Orders**
```
GET    /orders                 # Get user orders
POST   /orders                 # Create order
GET    /orders/:id             # Get order details
PUT    /orders/:id/cancel      # Cancel order
GET    /orders/:id/tracking    # Get tracking
POST   /orders/:id/review      # Review order
```

### **Payments**
```
POST   /payments/create-intent # Create payment intent
POST   /payments/confirm       # Confirm payment
GET    /payments/:id           # Get payment details
POST   /payments/:id/refund    # Request refund
```

### **Cart & Wishlist**
```
GET    /cart                   # Get cart
POST   /cart/items             # Add to cart
PUT    /cart/items/:id         # Update cart item
DELETE /cart/items/:id         # Remove from cart
DELETE /cart                   # Clear cart
GET    /wishlist               # Get wishlist
POST   /wishlist               # Add to wishlist
DELETE /wishlist/:id           # Remove from wishlist
```

### **Sellers**
```
GET    /sellers                # List sellers
GET    /sellers/:id            # Get seller details
GET    /sellers/:id/products   # Get seller products
POST   /sellers/apply          # Apply to become seller
PUT    /sellers/profile        # Update profile
GET    /sellers/analytics      # Get analytics
GET    /sellers/payouts        # Get payouts
```

### **Admin**
```
GET    /admin/dashboard        # Dashboard stats
GET    /admin/users            # List users
PUT    /admin/users/:id        # Update user
DELETE /admin/users/:id        # Delete user
GET    /admin/orders           # List orders
PUT    /admin/orders/:id       # Update order
GET    /admin/products         # List products
PUT    /admin/products/:id     # Update product
GET    /admin/sellers          # List sellers
PUT    /admin/sellers/:id      # Approve/reject seller
GET    /admin/analytics        # Platform analytics
```

### **Support**
```
GET    /support/tickets        # Get tickets
POST   /support/tickets        # Create ticket
GET    /support/tickets/:id    # Get ticket details
PUT    /support/tickets/:id    # Update ticket
POST   /support/tickets/:id/messages # Add message
```

### **Newsletter**
```
POST   /newsletter/subscribe   # Subscribe
POST   /newsletter/unsubscribe # Unsubscribe
GET    /newsletter/campaigns   # Get campaigns (admin)
POST   /newsletter/campaigns   # Create campaign (admin)
```

---

## 📊 Data Models Examples

### **User Registration**
```javascript
// POST /auth/register
{
  "firstName": "João",
  "lastName": "Silva",
  "email": "joao@example.com",
  "phone": "+258841234567",
  "password": "SecurePassword123!",
  "confirmPassword": "SecurePassword123!",
  "acceptTerms": true
}

// Response
{
  "success": true,
  "message": "Registration successful. Please verify your email.",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "firstName": "João",
      "lastName": "Silva",
      "email": "joao@example.com",
      "role": "buyer",
      "isEmailVerified": false
    }
  }
}
```

### **Product Creation**
```javascript
// POST /products
{
  "name": "Tomates Orgânicos",
  "description": "Tomates orgânicos frescos e saborosos",
  "categoryId": "507f1f77bcf86cd799439012",
  "price": 850, // in cents
  "comparePrice": 1000,
  "stock": 50,
  "sku": "TOM-ORG-001",
  "isOrganic": true,
  "tags": ["orgânico", "fresco"]
}

// Response
{
  "success": true,
  "data": {
    "product": {
      "id": "507f1f77bcf86cd799439013",
      "name": "Tomates Orgânicos",
      "slug": "tomates-organicos",
      "price": 850,
      "status": "active"
    }
  }
}
```

### **Order Creation**
```javascript
// POST /orders
{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439013",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "firstName": "João",
    "lastName": "Silva",
    "street": "Rua das Flores",
    "number": "123",
    "city": "Maputo",
    "phone": "+258841234567"
  },
  "paymentMethod": "m-pesa",
  "deliveryMethod": "local_delivery"
}

// Response
{
  "success": true,
  "data": {
    "order": {
      "id": "507f1f77bcf86cd799439014",
      "orderNumber": "ORD-2024-001",
      "total": 1700,
      "status": "pending",
      "paymentIntentId": "pi_1234567890"
    }
  }
}
```

---

## 🔒 Security Considerations

### **Authentication Security**
- Password hashing with bcrypt (12 rounds)
- JWT token expiration (15 min access, 7 days refresh)
- Rate limiting on auth endpoints
- Account lockout after failed attempts

### **API Security**
- CORS configuration for frontend domains
- Rate limiting per IP and user
- Input validation with Joi schemas
- XSS protection with helmet.js
- HTTPS only in production

### **Data Protection**
- Encryption at rest for sensitive data
- Secure headers with helmet.js
- Input sanitization and validation
- SQL injection prevention

---

## ⚡ Performance Optimization

### **Database Optimization**
- Indexes on frequently queried fields
- Compound indexes for complex queries
- Text indexes for search functionality
- Aggregation pipelines for analytics

### **Caching Strategy**
- Redis for session storage
- Product cache for frequently accessed items
- User cache for profile data
- API response cache for static data

### **API Performance**
- Pagination for large datasets
- Field selection to reduce payload size
- Compression with gzip
- Connection pooling for database

---

## 🚀 Deployment Strategy

### **Environment Configuration**
```javascript
// config/environment.js
module.exports = {
  development: {
    port: 3000,
    mongoUri: 'mongodb://localhost:27017/txova_dev',
    jwtSecret: 'dev-secret-key'
  },
  production: {
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET
  }
};
```

### **Environment Variables**
```bash
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb://localhost:27017/txova
JWT_SECRET=your-super-secret-jwt-key
REDIS_URL=redis://localhost:6379
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
SENDGRID_API_KEY=your-sendgrid-api-key
MPESA_API_KEY=your-mpesa-api-key
EMOLA_API_KEY=your-emola-api-key
STRIPE_SECRET_KEY=your-stripe-secret-key
```

### **Docker Configuration**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📈 Monitoring & Analytics

### **Application Monitoring**
- Error tracking with Sentry
- Performance monitoring with New Relic
- Uptime monitoring with Pingdom
- Log aggregation with ELK stack

### **Business Analytics**
- Sales analytics dashboard
- User behavior tracking
- Product performance metrics
- Payment success rates

---

## 🔄 API Versioning

### **Version Strategy**
- URL versioning: `/v1/`, `/v2/`
- Backward compatibility for 6 months
- Deprecation notices in headers
- Migration guides for breaking changes

---

## 📚 Documentation

### **API Documentation**
- Swagger/OpenAPI specification
- Interactive documentation with Swagger UI
- Code examples in multiple languages
- Postman collection for testing

---

This API and database design provides a solid foundation for building a scalable, secure, and performant marketplace platform. The design follows RESTful principles, implements proper security measures, and includes all necessary features for a modern e-commerce application.
