# Implementation Roadmap - Txova Marketplace Backend

**Date:** January 2024  
**Project:** Txova Marketplace API & Database Implementation  
**Duration:** 12 weeks  
**Technology:** Node.js + Express + MongoDB + Redis

---

## 🎯 **Project Overview**

This roadmap outlines the step-by-step implementation of the backend infrastructure for the Txova Marketplace, based on the comprehensive API and database design completed. The implementation follows a phased approach to ensure quality, security, and scalability.

---

## 📅 **Implementation Timeline**

### **Total Duration:** 12 weeks
### **Team Size:** 2-3 developers
### **Methodology:** Agile with 2-week sprints

---

## 🚀 **Phase 1: Project Setup & Core Infrastructure**

**Duration:** Week 1-2  
**Priority:** 🔴 Critical

### **Week 1: Foundation Setup**

#### **1.1 Development Environment**
```bash
# Create project structure
mkdir txova-api
cd txova-api
npm init -y

# Install core dependencies
npm install express mongoose bcryptjs jsonwebtoken cors helmet dotenv
npm install -D nodemon @types/node typescript

# Install additional dependencies
npm install joi multer cloudinary redis express-rate-limit
npm install nodemailer sendgrid stripe
```

#### **1.2 Project Structure**
```
src/
├── config/
│   ├── database.js          # MongoDB connection
│   ├── redis.js             # Redis connection
│   └── environment.js       # Environment variables
├── models/
│   ├── User.js              # User model
│   ├── Product.js           # Product model
│   ├── Order.js             # Order model
│   ├── Payment.js           # Payment model
│   ├── Seller.js            # Seller model
│   ├── Category.js          # Category model
│   ├── Review.js            # Review model
│   ├── Ticket.js            # Support ticket model
│   ├── Cart.js              # Shopping cart model
│   └── Newsletter.js        # Newsletter model
├── middleware/
│   ├── auth.js              # JWT authentication
│   ├── validation.js        # Request validation
│   ├── rateLimit.js         # Rate limiting
│   ├── upload.js            # File upload
│   └── errorHandler.js      # Error handling
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── users.js             # User management
│   ├── products.js          # Product management
│   ├── orders.js            # Order processing
│   ├── payments.js          # Payment processing
│   ├── sellers.js           # Seller management
│   ├── admin.js             # Admin functions
│   ├── support.js           # Support system
│   └── newsletter.js        # Newsletter management
├── services/
│   ├── authService.js       # Authentication logic
│   ├── emailService.js      # Email functionality
│   ├── paymentService.js    # Payment processing
│   ├── fileUploadService.js # File upload logic
│   └── notificationService.js # Notifications
├── utils/
│   ├── validation.js        # Validation schemas
│   ├── helpers.js           # Helper functions
│   └── constants.js         # Application constants
└── app.js                   # Main application
```

#### **1.3 Database Setup**
- **MongoDB Configuration**
  - Local development instance
  - Production cluster setup
  - Connection pooling
  - Index creation

- **Redis Configuration**
  - Session storage
  - Caching layer
  - Rate limiting storage

#### **1.4 Basic Express Server**
```javascript
// app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Routes
app.use('/api/v1/auth', require('./routes/auth'));
app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/products', require('./routes/products'));

// Error handling
app.use(require('./middleware/errorHandler'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### **Week 2: Core Infrastructure**

#### **2.1 Database Models**
- **User Model** with authentication fields
- **Product Model** with category relationships
- **Order Model** with payment integration
- **Seller Model** with business information

#### **2.2 Authentication Foundation**
- **JWT token generation** and validation
- **Password hashing** with bcrypt
- **Email verification** system
- **Password reset** functionality

#### **2.3 Basic CRUD Operations**
- **User management** endpoints
- **Product management** endpoints
- **Category management** endpoints

---

## 🔐 **Phase 2: Authentication & User Management**

**Duration:** Week 2-3  
**Priority:** 🔴 Critical

### **Week 2: Authentication System**

#### **2.1 JWT Implementation**
```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};
```

#### **2.2 User Registration & Login**
- **Registration endpoint** with email verification
- **Login endpoint** with JWT token generation
- **Password reset** functionality
- **Email verification** system

#### **2.3 User Profile Management**
- **Profile CRUD operations**
- **Avatar upload** functionality
- **Address management** (billing/shipping)
- **User preferences** and settings

### **Week 3: Security & Validation**

#### **3.1 Input Validation**
```javascript
// utils/validation.js
const Joi = require('joi');

const userRegistrationSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^\+258[0-9]{9}$/).required(),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).required(),
  confirmPassword: Joi.ref('password')
});

const productSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(1000).required(),
  price: Joi.number().positive().required(),
  categoryId: Joi.string().required(),
  stock: Joi.number().integer().min(0).required(),
  isOrganic: Joi.boolean().default(false)
});
```

#### **3.2 Security Measures**
- **Rate limiting** on authentication endpoints
- **Password strength** validation
- **Account lockout** after failed attempts
- **CORS configuration** for frontend

---

## 🛍️ **Phase 3: Core E-commerce Features**

**Duration:** Week 3-5  
**Priority:** 🔴 Critical

### **Week 3: Product Management**

#### **3.1 Product CRUD Operations**
```javascript
// routes/products.js
const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');

// Get all products with filtering
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, organic, page = 1, limit = 20 } = req.query;
    
    const filter = { status: 'active' };
    if (category) filter.categoryId = category;
    if (organic) filter.isOrganic = true;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    const products = await Product.find(filter)
      .populate('sellerId', 'businessName')
      .populate('categoryId', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
      
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create product (seller only)
router.post('/', authenticateToken, authorizeRoles('seller'), validateProduct, async (req, res) => {
  try {
    const product = new Product({
      ...req.body,
      sellerId: req.user.sellerId
    });
    await product.save();
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});
```

#### **3.2 Category Management**
- **Category CRUD operations**
- **Hierarchical category** structure
- **Category-based** product filtering

#### **3.3 Image Upload System**
- **Cloudinary integration** for image storage
- **Multiple image** support for products
- **Image optimization** and resizing
- **Drag-and-drop** upload functionality

### **Week 4: Shopping Cart & Wishlist**

#### **4.1 Shopping Cart Implementation**
```javascript
// models/Cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: String, // For guest users
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000) // 30 days
  }
}, { timestamps: true });

// Indexes for performance
cartSchema.index({ userId: 1 });
cartSchema.index({ sessionId: 1 });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
```

#### **4.2 Cart Management APIs**
- **Add to cart** functionality
- **Update cart** quantities
- **Remove from cart**
- **Cart persistence** across sessions
- **Guest cart** support

#### **4.3 Wishlist Implementation**
- **Add to wishlist** functionality
- **Wishlist management**
- **Wishlist to cart** conversion

### **Week 5: Order Processing**

#### **5.1 Order Creation Workflow**
```javascript
// services/orderService.js
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const createOrder = async (userId, orderData) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Get user's cart
    const cart = await Cart.findOne({ userId }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      throw new Error('Cart is empty');
    }
    
    // Calculate totals and validate stock
    let subtotal = 0;
    const orderItems = [];
    
    for (const item of cart.items) {
      const product = item.productId;
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
      
      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;
      
      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        total: itemTotal
      });
      
      // Update product stock
      await Product.findByIdAndUpdate(
        product._id,
        { $inc: { stock: -item.quantity } },
        { session }
      );
    }
    
    // Create order
    const order = new Order({
      userId,
      sellerId: cart.items[0].productId.sellerId, // Assuming single seller per order
      items: orderItems,
      subtotal,
      shipping: orderData.shipping || 0,
      total: subtotal + (orderData.shipping || 0),
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod
    });
    
    await order.save({ session });
    
    // Clear cart
    await Cart.findByIdAndDelete(cart._id, { session });
    
    await session.commitTransaction();
    return order;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  }
};
```

#### **5.2 Order Management**
- **Order status** tracking
- **Order history** for users
- **Order notifications** system
- **Order cancellation** functionality

---

## 💳 **Phase 4: Payment Integration**

**Duration:** Week 5-6  
**Priority:** 🔴 Critical

### **Week 5: Payment Gateway Setup**

#### **5.1 M-Pesa Integration**
```javascript
// services/mpesaService.js
const axios = require('axios');

class MpesaService {
  constructor() {
    this.baseUrl = process.env.MPESA_API_URL;
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.passkey = process.env.MPESA_PASSKEY;
    this.shortcode = process.env.MPESA_SHORTCODE;
  }

  async getAccessToken() {
    const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
    const response = await axios.get(`${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        Authorization: `Basic ${auth}`
      }
    });
    return response.data.access_token;
  }

  async initiateSTKPush(phoneNumber, amount, reference) {
    const accessToken = await this.getAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${this.shortcode}${this.passkey}${timestamp}`).toString('base64');

    const payload = {
      BusinessShortCode: this.shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: this.shortcode,
      PhoneNumber: phoneNumber,
      CallBackURL: `${process.env.API_BASE_URL}/api/v1/payments/mpesa/callback`,
      AccountReference: reference,
      TransactionDesc: 'Txova Marketplace Payment'
    };

    const response = await axios.post(`${this.baseUrl}/mpesa/stkpush/v1/processrequest`, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  }
}

module.exports = new MpesaService();
```

#### **5.2 E-Mola Integration**
- **E-Mola API** setup and configuration
- **Payment initiation** endpoints
- **Callback handling** for payment confirmation

#### **5.3 Stripe Integration**
- **Stripe API** configuration
- **Payment intent** creation
- **Webhook handling** for payment events

### **Week 6: Payment Processing**

#### **6.1 Payment Service Layer**
```javascript
// services/paymentService.js
const MpesaService = require('./mpesaService');
const StripeService = require('./stripeService');
const Payment = require('../models/Payment');

class PaymentService {
  async createPaymentIntent(orderId, amount, method, userId) {
    try {
      let paymentIntent;
      
      switch (method) {
        case 'm-pesa':
          paymentIntent = await this.createMpesaPayment(orderId, amount, userId);
          break;
        case 'e-mola':
          paymentIntent = await this.createEmolaPayment(orderId, amount, userId);
          break;
        case 'credit_card':
          paymentIntent = await this.createStripePayment(orderId, amount, userId);
          break;
        default:
          throw new Error('Unsupported payment method');
      }
      
      return paymentIntent;
    } catch (error) {
      throw new Error(`Payment creation failed: ${error.message}`);
    }
  }

  async createMpesaPayment(orderId, amount, userId) {
    const order = await Order.findById(orderId).populate('userId');
    const phoneNumber = order.userId.phone;
    
    const mpesaResponse = await MpesaService.initiateSTKPush(
      phoneNumber,
      amount,
      orderId.toString()
    );
    
    const payment = new Payment({
      orderId,
      userId,
      amount,
      method: 'm-pesa',
      status: 'pending',
      externalId: mpesaResponse.CheckoutRequestID,
      gateway: 'm-pesa',
      gatewayData: mpesaResponse
    });
    
    await payment.save();
    return payment;
  }

  async confirmPayment(paymentId, gatewayData) {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      throw new Error('Payment not found');
    }
    
    payment.status = 'succeeded';
    payment.gatewayData = { ...payment.gatewayData, ...gatewayData };
    payment.paidAt = new Date();
    
    await payment.save();
    
    // Update order status
    await Order.findByIdAndUpdate(payment.orderId, {
      paymentStatus: 'paid',
      status: 'confirmed'
    });
    
    return payment;
  }
}

module.exports = new PaymentService();
```

#### **6.2 Payment Endpoints**
- **Payment intent** creation
- **Payment confirmation** handling
- **Payment status** tracking
- **Refund processing**

---

## 🏪 **Phase 5: Seller & Admin Features**

**Duration:** Week 6-8  
**Priority:** 🟡 High

### **Week 6: Seller Management**

#### **6.1 Seller Application Process**
```javascript
// routes/sellers.js
router.post('/apply', authenticateToken, async (req, res) => {
  try {
    const { businessName, businessDescription, contactInfo, address } = req.body;
    
    // Check if user already has a seller account
    const existingSeller = await Seller.findOne({ userId: req.user.id });
    if (existingSeller) {
      return res.status(400).json({ 
        success: false, 
        message: 'Seller account already exists' 
      });
    }
    
    const seller = new Seller({
      userId: req.user.id,
      businessName,
      businessDescription,
      contactInfo,
      address,
      status: 'pending'
    });
    
    await seller.save();
    
    // Update user role to seller
    await User.findByIdAndUpdate(req.user.id, { role: 'seller' });
    
    res.status(201).json({ 
      success: true, 
      message: 'Seller application submitted successfully',
      data: seller 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

#### **6.2 Seller Dashboard APIs**
- **Sales analytics** and reporting
- **Product management** for sellers
- **Order management** and fulfillment
- **Payout tracking** and history

### **Week 7: Admin Dashboard**

#### **7.1 Admin User Management**
```javascript
// routes/admin.js
router.get('/users', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  try {
    const { page = 1, limit = 20, role, status, search } = req.query;
    
    const filter = {};
    if (role) filter.role = role;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(filter)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });
      
    const total = await User.countDocuments(filter);
    
    res.json({
      success: true,
      data: users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

#### **7.2 Admin Product Moderation**
- **Product approval** system
- **Product editing** capabilities
- **Product removal** and suspension
- **Category management**

#### **7.3 Admin Analytics**
- **Platform-wide** analytics
- **Sales reporting** and insights
- **User behavior** tracking
- **Performance metrics**

### **Week 8: Advanced Seller Features**

#### **8.1 Payout System**
```javascript
// services/payoutService.js
const Payout = require('../models/Payout');
const Order = require('../models/Order');

class PayoutService {
  async calculatePayout(sellerId, startDate, endDate) {
    const orders = await Order.find({
      sellerId,
      status: 'delivered',
      createdAt: { $gte: startDate, $lte: endDate }
    });
    
    let totalAmount = 0;
    let totalCommission = 0;
    
    orders.forEach(order => {
      totalAmount += order.total;
      totalCommission += order.commission;
    });
    
    return {
      totalAmount,
      totalCommission,
      netAmount: totalAmount - totalCommission,
      orderCount: orders.length
    };
  }

  async createPayout(sellerId, amount, orders) {
    const payout = new Payout({
      sellerId,
      amount,
      orders,
      status: 'pending',
      scheduledAt: new Date()
    });
    
    await payout.save();
    return payout;
  }
}
```

#### **8.2 Seller Analytics**
- **Sales performance** tracking
- **Product performance** analysis
- **Customer insights** and behavior
- **Revenue forecasting**

---

## 🆘 **Phase 6: Support System**

**Duration:** Week 8-9  
**Priority:** 🟡 High

### **Week 8: Ticket Management**

#### **8.1 Ticket Creation System**
```javascript
// models/Ticket.js
const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: true,
    enum: ['technical_issue', 'payment_problem', 'order_issue', 'product_question', 'general']
  },
  priority: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    required: true,
    enum: ['open', 'in_progress', 'waiting_for_user', 'resolved', 'closed'],
    default: 'open'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userType: {
    type: String,
    required: true,
    enum: ['buyer', 'seller', 'admin']
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  messages: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    userType: {
      type: String,
      required: true,
      enum: ['buyer', 'seller', 'admin', 'support']
    },
    message: {
      type: String,
      required: true,
      maxlength: 2000
    },
    isInternal: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

// Indexes
ticketSchema.index({ userId: 1, status: 1 });
ticketSchema.index({ assignedTo: 1, status: 1 });
ticketSchema.index({ priority: 1, status: 1 });
```

#### **8.2 Ticket APIs**
- **Ticket creation** and management
- **Message threading** system
- **Agent assignment** functionality
- **Status tracking** and updates

### **Week 9: Support Agent Features**

#### **9.1 Agent Dashboard**
- **Ticket queue** management
- **Ticket assignment** system
- **Response templates** and automation
- **Performance tracking**

#### **9.2 Advanced Support Features**
- **Internal notes** system
- **Ticket escalation** process
- **Knowledge base** integration
- **Customer satisfaction** tracking

---

## 📧 **Phase 7: Content Management**

**Duration:** Week 9-10  
**Priority:** 🟢 Medium

### **Week 9: Blog System**

#### **9.1 Blog Management**
```javascript
// models/BlogPost.js
const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 200
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  excerpt: {
    type: String,
    maxlength: 500
  },
  content: {
    type: String,
    required: true
  },
  image: String,
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: {
    type: String,
    required: true
  },
  tags: [String],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: Date,
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  stats: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Indexes
blogPostSchema.index({ slug: 1 });
blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ category: 1, status: 1 });
```

#### **9.2 Newsletter System**
- **Subscriber management**
- **Campaign creation** and sending
- **Email templates** and personalization
- **Analytics** and tracking

### **Week 10: Content APIs**

#### **10.1 Blog APIs**
- **Blog post** CRUD operations
- **Category and tag** management
- **Search and filtering** capabilities
- **SEO optimization**

#### **10.2 Newsletter APIs**
- **Subscription** management
- **Campaign** creation and sending
- **Analytics** and reporting
- **Template** management

---

## ⚡ **Phase 8: Performance & Optimization**

**Duration:** Week 10-11  
**Priority:** 🟡 High

### **Week 10: Caching Implementation**

#### **10.1 Redis Caching Strategy**
```javascript
// services/cacheService.js
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

class CacheService {
  async get(key) {
    try {
      const value = await client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key, value, ttl = 3600) {
    try {
      await client.setex(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async del(key) {
    try {
      await client.del(key);
    } catch (error) {
      console.error('Cache delete error:', error);
    }
  }

  // Cache product data
  async cacheProduct(productId, productData) {
    const key = `product:${productId}`;
    await this.set(key, productData, 1800); // 30 minutes
  }

  // Cache user session
  async cacheUserSession(sessionId, userData) {
    const key = `session:${sessionId}`;
    await this.set(key, userData, 86400); // 24 hours
  }
}

module.exports = new CacheService();
```

#### **10.2 Database Optimization**
- **Index creation** for performance
- **Query optimization** and aggregation
- **Connection pooling** configuration
- **Database monitoring** setup

### **Week 11: API Optimization**

#### **11.1 Performance Improvements**
- **API response** caching
- **Pagination** implementation
- **Field selection** optimization
- **Compression** and gzip

#### **11.2 Monitoring & Logging**
```javascript
// middleware/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'txova-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
  });
  
  next();
};

module.exports = { logger, requestLogger };
```

---

## 🧪 **Phase 9: Testing & Quality Assurance**

**Duration:** Week 11-12  
**Priority:** 🔴 Critical

### **Week 11: Testing Implementation**

#### **11.1 Unit Testing**
```javascript
// tests/auth.test.js
const request = require('supertest');
const app = require('../app');
const User = require('../models/User');
const { connect, disconnect } = require('../config/database');

describe('Authentication Endpoints', () => {
  beforeAll(async () => {
    await connect();
  });

  afterAll(async () => {
    await disconnect();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao@example.com',
        phone: '+258841234567',
        password: 'SecurePassword123!',
        confirmPassword: 'SecurePassword123!'
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.user.role).toBe('buyer');
    });

    it('should return error for invalid email', async () => {
      const userData = {
        firstName: 'João',
        lastName: 'Silva',
        email: 'invalid-email',
        phone: '+258841234567',
        password: 'SecurePassword123!',
        confirmPassword: 'SecurePassword123!'
      };

      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('email');
    });
  });
});
```

#### **11.2 Integration Testing**
- **API endpoint** testing
- **Database integration** testing
- **Payment gateway** testing
- **Authentication flow** testing

### **Week 12: Quality Assurance**

#### **12.1 Security Testing**
- **Authentication** security testing
- **Authorization** testing
- **Input validation** testing
- **SQL injection** prevention testing

#### **12.2 Performance Testing**
- **Load testing** with multiple users
- **Stress testing** for high traffic
- **Database performance** testing
- **API response time** optimization

---

## 🚀 **Phase 10: Deployment & Production**

**Duration:** Week 12  
**Priority:** 🔴 Critical

### **Week 12: Production Deployment**

#### **12.1 Docker Configuration**
```dockerfile
# Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["npm", "start"]
```

#### **12.2 Environment Configuration**
```bash
# .env.production
NODE_ENV=production
PORT=3000
MONGO_URI=mongodb://localhost:27017/txova_prod
JWT_SECRET=your-super-secret-jwt-key-production
REDIS_URL=redis://localhost:6379
CLOUDINARY_URL=cloudinary://api_key:api_secret@cloud_name
SENDGRID_API_KEY=your-sendgrid-api-key
MPESA_API_KEY=your-mpesa-api-key
EMOLA_API_KEY=your-emola-api-key
STRIPE_SECRET_KEY=your-stripe-secret-key
CORS_ORIGIN=https://txova.com
```

#### **12.3 CI/CD Pipeline**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Use Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
    - run: npm ci
    - run: npm test
    - run: npm run lint

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to server
      run: |
        # Deployment commands
        echo "Deploying to production..."
```

---

## 📋 **Development Checklist**

### **Phase 1: Foundation**
- [ ] Node.js project initialized
- [ ] Express server configured
- [ ] MongoDB connection established
- [ ] Redis connection configured
- [ ] Basic project structure created
- [ ] Environment variables set up

### **Phase 2: Authentication**
- [ ] JWT authentication implemented
- [ ] User registration working
- [ ] User login working
- [ ] Password reset functional
- [ ] Email verification working
- [ ] Role-based authorization implemented

### **Phase 3: E-commerce Core**
- [ ] Product CRUD operations
- [ ] Category management
- [ ] Shopping cart functionality
- [ ] Wishlist implementation
- [ ] Order processing system
- [ ] Image upload system

### **Phase 4: Payments**
- [ ] M-Pesa integration
- [ ] E-Mola integration
- [ ] Stripe integration
- [ ] Payment confirmation
- [ ] Refund processing
- [ ] Payment analytics

### **Phase 5: Seller & Admin**
- [ ] Seller application process
- [ ] Seller dashboard
- [ ] Admin user management
- [ ] Product moderation
- [ ] Analytics dashboard
- [ ] Payout system

### **Phase 6: Support System**
- [ ] Ticket creation system
- [ ] Message threading
- [ ] Agent assignment
- [ ] Status tracking
- [ ] Performance metrics

### **Phase 7: Content Management**
- [ ] Blog system
- [ ] Newsletter management
- [ ] Email campaigns
- [ ] Content analytics

### **Phase 8: Performance**
- [ ] Redis caching
- [ ] Database optimization
- [ ] API performance
- [ ] Monitoring setup

### **Phase 9: Testing**
- [ ] Unit tests
- [ ] Integration tests
- [ ] Security testing
- [ ] Performance testing

### **Phase 10: Deployment**
- [ ] Docker configuration
- [ ] Production environment
- [ ] CI/CD pipeline
- [ ] Monitoring and logging

---

## 🎯 **Success Metrics**

### **Technical Metrics**
- **API Response Time:** < 200ms for 95% of requests
- **Database Query Time:** < 100ms for 95% of queries
- **Uptime:** 99.9% availability
- **Error Rate:** < 0.1% of requests

### **Business Metrics**
- **User Registration:** 1000+ users in first month
- **Product Listings:** 500+ products from 50+ sellers
- **Order Processing:** 100+ orders per day
- **Payment Success Rate:** > 95%

### **Security Metrics**
- **Zero Security Breaches**
- **100% Input Validation**
- **Secure Authentication**
- **Data Encryption**

---

## 🔄 **Maintenance & Updates**

### **Ongoing Tasks**
- **Security updates** and patches
- **Performance monitoring** and optimization
- **Feature enhancements** based on user feedback
- **Database maintenance** and optimization
- **API versioning** and backward compatibility

### **Regular Reviews**
- **Monthly security** audits
- **Quarterly performance** reviews
- **Bi-annual feature** planning
- **Annual architecture** review

---

This roadmap provides a comprehensive guide for implementing the Txova Marketplace backend infrastructure. Each phase builds upon the previous one, ensuring a solid foundation for a scalable and secure e-commerce platform.
