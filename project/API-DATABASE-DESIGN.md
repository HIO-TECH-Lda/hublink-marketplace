# API & Database Design - Txova Marketplace

**Version:** 1.0.0  
**Date:** January 2024  
**Technology Stack:** Node.js + Express + MongoDB  
**Architecture:** RESTful API with JWT Authentication

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Database Schema](#database-schema)
3. [API Architecture](#api-architecture)
4. [Authentication & Authorization](#authentication--authorization)
5. [API Endpoints](#api-endpoints)
6. [Data Models](#data-models)
7. [Security Considerations](#security-considerations)
8. [Performance Optimization](#performance-optimization)
9. [Deployment Strategy](#deployment-strategy)

---

## 🎯 Project Overview

### **Application Type**
- **E-commerce Marketplace** for organic food products
- **Multi-tenant platform** supporting buyers, sellers, and administrators
- **Real-time features** including chat, notifications, and order tracking
- **Payment processing** with multiple gateways (M-Pesa, E-Mola, credit cards)

### **User Roles**
1. **Buyers** - Purchase products, manage orders, reviews
2. **Sellers** - Manage products, orders, analytics, payouts
3. **Administrators** - Platform management, user management, analytics
4. **Support Agents** - Ticket management, customer support

### **Key Features**
- Product catalog with advanced search and filtering
- Shopping cart and wishlist management
- Order processing and tracking
- Payment processing with multiple methods
- Review and rating system
- Support ticket system
- Newsletter and marketing campaigns
- Analytics and reporting

---

## 🗄️ Database Schema

### **MongoDB Collections**

#### 1. **users**
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String, // unique
  phone: String,
  password: String, // hashed with bcrypt
  avatar: String, // URL
  role: String, // 'buyer', 'seller', 'admin', 'support'
  isEmailVerified: Boolean,
  isPhoneVerified: Boolean,
  status: String, // 'active', 'inactive', 'suspended'
  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  twoFactorSecret: String,
  twoFactorEnabled: Boolean,
  lastLogin: Date,
  loginAttempts: Number,
  lockUntil: Date,
  preferences: {
    language: String, // 'pt', 'en'
    currency: String, // 'MZN', 'USD'
    timezone: String,
    notifications: {
      email: Boolean,
      sms: Boolean,
      push: Boolean
    }
  },
  addresses: [{
    _id: ObjectId,
    type: String, // 'billing', 'shipping'
    firstName: String,
    lastName: String,
    street: String,
    number: String,
    complement: String,
    neighborhood: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    isDefault: Boolean
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. **sellers**
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // ref: users
  businessName: String,
  businessDescription: String,
  logo: String, // URL
  banner: String, // URL
  category: String,
  tags: [String],
  contactInfo: {
    email: String,
    phone: String,
    website: String
  },
  address: {
    street: String,
    number: String,
    complement: String,
    neighborhood: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  businessHours: [{
    day: Number, // 0-6 (Sunday-Saturday)
    open: String, // HH:MM
    close: String, // HH:MM
    isOpen: Boolean
  }],
  deliveryOptions: {
    pickup: Boolean,
    localDelivery: Boolean,
    shipping: Boolean,
    deliveryRadius: Number, // km
    deliveryFee: Number
  },
  paymentMethods: [String], // ['m-pesa', 'e-mola', 'credit_card']
  bankInfo: {
    bankName: String,
    accountNumber: String,
    agencyNumber: String,
    accountType: String
  },
  commissionRate: Number, // percentage
  minimumPayout: Number,
  totalSales: Number,
  totalOrders: Number,
  averageRating: Number,
  totalReviews: Number,
  status: String, // 'pending', 'approved', 'rejected', 'suspended'
  approvedAt: Date,
  approvedBy: ObjectId, // ref: users (admin)
  createdAt: Date,
  updatedAt: Date
}
```

#### 3. **categories**
```javascript
{
  _id: ObjectId,
  name: String,
  slug: String, // unique
  description: String,
  image: String, // URL
  icon: String, // icon name
  parentId: ObjectId, // ref: categories (for subcategories)
  level: Number, // 0 for main categories
  order: Number,
  isActive: Boolean,
  metadata: {
    seoTitle: String,
    seoDescription: String,
    keywords: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. **products**
```javascript
{
  _id: ObjectId,
  sellerId: ObjectId, // ref: sellers
  categoryId: ObjectId, // ref: categories
  name: String,
  slug: String, // unique
  description: String,
  shortDescription: String,
  images: [String], // URLs
  mainImage: String, // URL
  price: Number, // in cents
  comparePrice: Number, // original price for discounts
  costPrice: Number, // seller's cost
  sku: String,
  barcode: String,
  weight: Number, // kg
  dimensions: {
    length: Number, // cm
    width: Number, // cm
    height: Number // cm
  },
  stock: Number,
  minStock: Number, // alert threshold
  maxStock: Number,
  isOrganic: Boolean,
  isGlutenFree: Boolean,
  isVegan: Boolean,
  allergens: [String],
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
    sugar: Number
  },
  tags: [String],
  attributes: [{
    name: String,
    value: String
  }],
  variants: [{
    _id: ObjectId,
    name: String, // e.g., "Size", "Color"
    options: [{
      value: String,
      price: Number,
      stock: Number,
      sku: String
    }]
  }],
  status: String, // 'draft', 'active', 'inactive', 'out_of_stock'
  isFeatured: Boolean,
  isBestSeller: Boolean,
  viewCount: Number,
  salesCount: Number,
  averageRating: Number,
  totalReviews: Number,
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### 5. **orders**
```javascript
{
  _id: ObjectId,
  orderNumber: String, // e.g., "ORD-2024-001"
  userId: ObjectId, // ref: users
  sellerId: ObjectId, // ref: sellers
  items: [{
    productId: ObjectId, // ref: products
    variantId: ObjectId, // ref: product variants
    name: String,
    sku: String,
    price: Number, // in cents
    quantity: Number,
    total: Number, // in cents
    image: String
  }],
  subtotal: Number, // in cents
  tax: Number, // in cents
  shipping: Number, // in cents
  discount: Number, // in cents
  total: Number, // in cents
  currency: String, // "MZN"
  status: String, // 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
  paymentStatus: String, // 'pending', 'paid', 'failed', 'refunded'
  paymentMethod: String, // 'm-pesa', 'e-mola', 'credit_card'
  paymentIntentId: String, // external payment ID
  shippingAddress: {
    firstName: String,
    lastName: String,
    street: String,
    number: String,
    complement: String,
    neighborhood: String,
    city: String,
    state: String,
    zipCode: String,
    phone: String
  },
  billingAddress: {
    // same structure as shippingAddress
  },
  deliveryMethod: String, // 'pickup', 'local_delivery', 'shipping'
  estimatedDelivery: Date,
  trackingNumber: String,
  trackingUrl: String,
  notes: String,
  sellerNotes: String,
  commission: Number, // platform commission
  sellerAmount: Number, // amount after commission
  createdAt: Date,
  updatedAt: Date,
  paidAt: Date,
  shippedAt: Date,
  deliveredAt: Date,
  cancelledAt: Date
}
```

#### 6. **payments**
```javascript
{
  _id: ObjectId,
  orderId: ObjectId, // ref: orders
  userId: ObjectId, // ref: users
  amount: Number, // in cents
  currency: String, // "MZN"
  method: String, // 'm-pesa', 'e-mola', 'credit_card'
  status: String, // 'pending', 'processing', 'succeeded', 'failed', 'cancelled', 'refunded'
  externalId: String, // payment gateway ID
  gateway: String, // 'm-pesa', 'e-mola', 'stripe'
  gatewayData: Object, // raw gateway response
  cardInfo: {
    last4: String,
    brand: String,
    expMonth: Number,
    expYear: Number
  },
  pixCode: String,
  pixExpiresAt: Date,
  refunds: [{
    _id: ObjectId,
    amount: Number, // in cents
    reason: String,
    status: String,
    externalId: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date,
  paidAt: Date
}
```

#### 7. **payouts**
```javascript
{
  _id: ObjectId,
  sellerId: ObjectId, // ref: sellers
  amount: Number, // in cents
  currency: String, // "MZN"
  status: String, // 'pending', 'processing', 'completed', 'failed', 'cancelled'
  method: String, // 'bank_transfer', 'm-pesa'
  bankInfo: {
    bank: String,
    agency: String,
    account: String,
    accountType: String
  },
  mpesaNumber: String,
  externalId: String, // payout gateway ID
  orders: [ObjectId], // ref: orders
  commission: Number, // in cents
  netAmount: Number, // amount after commission
  scheduledAt: Date,
  processedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

#### 8. **reviews**
```javascript
{
  _id: ObjectId,
  productId: ObjectId, // ref: products
  userId: ObjectId, // ref: users
  orderId: ObjectId, // ref: orders
  rating: Number, // 1-5
  title: String,
  comment: String,
  images: [String], // URLs
  isVerified: Boolean, // purchased the product
  helpful: Number, // helpful votes count
  notHelpful: Number, // not helpful votes count
  status: String, // 'pending', 'approved', 'rejected'
  moderatedBy: ObjectId, // ref: users (admin)
  moderatedAt: Date,
  moderationNotes: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### 9. **tickets**
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String, // 'technical_issue', 'payment_problem', 'order_issue', etc.
  priority: String, // 'low', 'medium', 'high', 'urgent'
  status: String, // 'open', 'in_progress', 'waiting_for_user', 'resolved', 'closed'
  userId: ObjectId, // ref: users
  userType: String, // 'buyer', 'seller', 'admin'
  assignedTo: ObjectId, // ref: users (support agent)
  orderId: ObjectId, // ref: orders (optional)
  productId: ObjectId, // ref: products (optional)
  tags: [String],
  attachments: [{
    _id: ObjectId,
    fileName: String,
    fileUrl: String,
    fileSize: Number,
    mimeType: String,
    uploadedAt: Date
  }],
  messages: [{
    _id: ObjectId,
    userId: ObjectId, // ref: users
    userType: String, // 'buyer', 'seller', 'admin', 'support'
    message: String,
    isInternal: Boolean,
    attachments: [{
      _id: ObjectId,
      fileName: String,
      fileUrl: String,
      fileSize: Number,
      mimeType: String
    }],
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

#### 10. **carts**
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // ref: users
  sessionId: String, // for guest users
  items: [{
    productId: ObjectId, // ref: products
    variantId: ObjectId, // ref: product variants
    quantity: Number,
    addedAt: Date
  }],
  expiresAt: Date, // cart expiration
  createdAt: Date,
  updatedAt: Date
}
```

#### 11. **wishlists**
```javascript
{
  _id: ObjectId,
  userId: ObjectId, // ref: users
  productId: ObjectId, // ref: products
  addedAt: Date
}
```

#### 12. **newsletter_subscribers**
```javascript
{
  _id: ObjectId,
  email: String, // unique
  firstName: String, // optional
  lastName: String, // optional
  status: String, // 'active', 'unsubscribed', 'bounced', 'pending'
  source: String, // 'popup', 'footer', 'signup', 'admin'
  tags: [String], // for segmentation
  preferences: {
    categories: [String], // preferred content categories
    frequency: String, // 'weekly', 'monthly', 'promotional'
    language: String
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    referrer: String,
    utmSource: String,
    utmMedium: String,
    utmCampaign: String
  },
  stats: {
    emailsSent: Number,
    emailsOpened: Number,
    emailsClicked: Number,
    lastOpened: Date,
    lastClicked: Date
  },
  unsubscribedAt: Date,
  unsubscribedReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### 13. **blog_posts**
```javascript
{
  _id: ObjectId,
  title: String,
  slug: String, // unique
  excerpt: String,
  content: String, // HTML content
  image: String, // URL
  authorId: ObjectId, // ref: users
  category: String,
  tags: [String],
  status: String, // 'draft', 'published', 'archived'
  publishedAt: Date,
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  stats: {
    views: Number,
    likes: Number,
    shares: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### 14. **system_settings**
```javascript
{
  _id: ObjectId,
  key: String, // unique setting key
  value: Mixed, // setting value
  type: String, // 'string', 'number', 'boolean', 'object', 'array'
  category: String, // 'general', 'security', 'payment', 'email', 'notifications'
  description: String,
  isPublic: Boolean, // if setting can be exposed to frontend
  updatedBy: ObjectId, // ref: users (admin)
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🏗️ API Architecture

### **Project Structure**
```
src/
├── config/
│   ├── database.js
│   ├── redis.js
│   └── environment.js
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   ├── productController.js
│   ├── orderController.js
│   ├── paymentController.js
│   ├── sellerController.js
│   ├── adminController.js
│   └── supportController.js
├── middleware/
│   ├── auth.js
│   ├── validation.js
│   ├── rateLimit.js
│   ├── upload.js
│   └── errorHandler.js
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   ├── Payment.js
│   └── ...
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── products.js
│   ├── orders.js
│   ├── payments.js
│   ├── sellers.js
│   ├── admin.js
│   └── support.js
├── services/
│   ├── authService.js
│   ├── emailService.js
│   ├── paymentService.js
│   ├── notificationService.js
│   └── fileUploadService.js
├── utils/
│   ├── validation.js
│   ├── helpers.js
│   └── constants.js
└── app.js
```

### **Technology Stack**
- **Runtime:** Node.js 18+
- **Framework:** Express.js 4.x
- **Database:** MongoDB 6.x
- **ORM:** Mongoose 7.x
- **Authentication:** JWT + bcrypt
- **File Upload:** Multer + Cloudinary
- **Email:** Nodemailer + SendGrid
- **Payment:** M-Pesa API, E-Mola API, Stripe
- **Caching:** Redis
- **Validation:** Joi
- **Documentation:** Swagger/OpenAPI

---

## 🔐 Authentication & Authorization

### **JWT Token Structure**
```javascript
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "userId": "ObjectId",
    "email": "user@example.com",
    "role": "buyer|seller|admin|support",
    "sellerId": "ObjectId", // if user is seller
    "iat": 1640995200,
    "exp": 1641081600
  }
}
```

### **Authentication Flow**
1. **Login:** Email/password → JWT token
2. **Registration:** Email verification required
3. **Password Reset:** Email-based reset flow
4. **Two-Factor:** Optional 2FA for admin accounts
5. **Session Management:** Redis for token blacklisting

### **Authorization Levels**
```javascript
// Role-based access control
const roles = {
  buyer: ['read:products', 'create:orders', 'read:own_orders'],
  seller: ['manage:own_products', 'read:own_orders', 'manage:own_store'],
  admin: ['manage:all', 'read:all', 'write:all'],
  support: ['read:tickets', 'update:tickets', 'read:orders']
};
```

---

## 🌐 API Endpoints

### **Base URL:** `https://api.txova.com/v1`

### **Authentication Endpoints**
```
POST   /auth/register          # User registration
POST   /auth/login             # User login
POST   /auth/logout            # User logout
POST   /auth/refresh           # Refresh JWT token
POST   /auth/forgot-password   # Request password reset
POST   /auth/reset-password    # Reset password with token
POST   /auth/verify-email      # Verify email with token
POST   /auth/resend-verification # Resend email verification
```

### **User Management**
```
GET    /users/profile          # Get user profile
PUT    /users/profile          # Update user profile
PUT    /users/password         # Change password
POST   /users/avatar           # Upload avatar
GET    /users/addresses        # Get user addresses
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
GET    /products/categories/:id # Get category products
POST   /products               # Create product (seller)
PUT    /products/:id           # Update product (seller)
DELETE /products/:id           # Delete product (seller)
POST   /products/:id/images    # Upload product images
```

### **Orders**
```
GET    /orders                 # Get user orders
POST   /orders                 # Create order
GET    /orders/:id             # Get order details
PUT    /orders/:id/cancel      # Cancel order
GET    /orders/:id/tracking    # Get order tracking
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
POST   /cart/items             # Add item to cart
PUT    /cart/items/:id         # Update cart item
DELETE /cart/items/:id         # Remove cart item
DELETE /cart                   # Clear cart
GET    /wishlist               # Get wishlist
POST   /wishlist               # Add to wishlist
DELETE /wishlist/:id           # Remove from wishlist
```

### **Seller Management**
```
GET    /sellers                # List sellers
GET    /sellers/:id            # Get seller details
GET    /sellers/:id/products   # Get seller products
POST   /sellers/apply          # Apply to become seller
PUT    /sellers/profile        # Update seller profile
GET    /sellers/analytics      # Get seller analytics
GET    /sellers/payouts        # Get seller payouts
```

### **Admin Endpoints**
```
GET    /admin/dashboard        # Admin dashboard stats
GET    /admin/users            # List all users
PUT    /admin/users/:id        # Update user
DELETE /admin/users/:id        # Delete user
GET    /admin/orders           # List all orders
PUT    /admin/orders/:id       # Update order
GET    /admin/products         # List all products
PUT    /admin/products/:id     # Update product
GET    /admin/sellers          # List all sellers
PUT    /admin/sellers/:id      # Approve/reject seller
GET    /admin/analytics        # Platform analytics
```

### **Support System**
```
GET    /support/tickets        # Get user tickets
POST   /support/tickets        # Create ticket
GET    /support/tickets/:id    # Get ticket details
PUT    /support/tickets/:id    # Update ticket
POST   /support/tickets/:id/messages # Add message
```

### **Newsletter**
```
POST   /newsletter/subscribe   # Subscribe to newsletter
POST   /newsletter/unsubscribe # Unsubscribe
GET    /newsletter/campaigns   # Get campaigns (admin)
POST   /newsletter/campaigns   # Create campaign (admin)
```

---

## 📊 Data Models

### **Request/Response Examples**

#### **User Registration**
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
  "message": "Registration successful. Please check your email to verify your account.",
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

#### **Product Creation**
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
  "weight": 0.5,
  "isOrganic": true,
  "tags": ["orgânico", "fresco", "sem agrotóxicos"],
  "attributes": [
    {
      "name": "Cor",
      "value": "Vermelho"
    }
  ]
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
      "status": "active",
      "createdAt": "2024-01-20T10:30:00Z"
    }
  }
}
```

#### **Order Creation**
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
    "neighborhood": "Centro",
    "city": "Maputo",
    "state": "Maputo",
    "zipCode": "1100",
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

### **Input Validation**
- **Joi schemas** for all request validation
- **Sanitization** of user inputs
- **SQL injection prevention** (MongoDB injection)
- **XSS protection** with helmet.js

### **Authentication Security**
- **Password hashing** with bcrypt (12 rounds)
- **JWT token expiration** (15 minutes access, 7 days refresh)
- **Rate limiting** on auth endpoints
- **Account lockout** after failed attempts

### **API Security**
- **CORS configuration** for frontend domains
- **Rate limiting** per IP and user
- **Request size limits** for file uploads
- **API versioning** for backward compatibility

### **Data Protection**
- **Encryption at rest** for sensitive data
- **HTTPS only** in production
- **Secure headers** with helmet.js
- **Input sanitization** and validation

---

## ⚡ Performance Optimization

### **Database Optimization**
- **Indexes** on frequently queried fields
- **Compound indexes** for complex queries
- **Text indexes** for search functionality
- **Aggregation pipelines** for analytics

### **Caching Strategy**
- **Redis** for session storage
- **Product cache** for frequently accessed items
- **User cache** for profile data
- **API response cache** for static data

### **File Upload Optimization**
- **Image compression** before storage
- **CDN integration** for fast delivery
- **Multiple sizes** generation (thumbnail, medium, large)
- **Lazy loading** for product images

### **API Performance**
- **Pagination** for large datasets
- **Field selection** to reduce payload size
- **Compression** with gzip
- **Connection pooling** for database

---

## 🚀 Deployment Strategy

### **Environment Configuration**
```javascript
// config/environment.js
module.exports = {
  development: {
    port: 3000,
    mongoUri: 'mongodb://localhost:27017/txova_dev',
    jwtSecret: 'dev-secret-key',
    corsOrigin: 'http://localhost:3000'
  },
  production: {
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGO_URI,
    jwtSecret: process.env.JWT_SECRET,
    corsOrigin: process.env.CORS_ORIGIN
  }
};
```

### **Docker Configuration**
```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### **Environment Variables**
```bash
# .env
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

### **Deployment Checklist**
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] SSL certificates installed
- [ ] Monitoring and logging setup
- [ ] Backup strategy implemented
- [ ] Performance testing completed
- [ ] Security audit performed

---

## 📈 Monitoring & Analytics

### **Application Monitoring**
- **Error tracking** with Sentry
- **Performance monitoring** with New Relic
- **Uptime monitoring** with Pingdom
- **Log aggregation** with ELK stack

### **Business Analytics**
- **Sales analytics** dashboard
- **User behavior** tracking
- **Product performance** metrics
- **Payment success rates**

### **API Analytics**
- **Request/response times**
- **Error rates** by endpoint
- **Usage patterns** by user type
- **Rate limit violations**

---

## 🔄 API Versioning

### **Version Strategy**
- **URL versioning:** `/v1/`, `/v2/`
- **Backward compatibility** for 6 months
- **Deprecation notices** in headers
- **Migration guides** for breaking changes

### **Change Management**
- **Semantic versioning** for API versions
- **Changelog** documentation
- **Breaking changes** require major version bump
- **Feature additions** in minor versions

---

## 📚 Documentation

### **API Documentation**
- **Swagger/OpenAPI** specification
- **Interactive documentation** with Swagger UI
- **Code examples** in multiple languages
- **Postman collection** for testing

### **Developer Resources**
- **SDK libraries** for popular languages
- **Webhook documentation** for integrations
- **Rate limit documentation**
- **Error code reference**

---

This comprehensive API and database design provides a solid foundation for building a scalable, secure, and performant marketplace platform. The design follows RESTful principles, implements proper security measures, and includes all necessary features for a modern e-commerce application.
