# Txova Marketplace API

A TypeScript-based REST API for the Txova Marketplace platform, built with Express.js and MongoDB Atlas.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Redis (optional, for caching)

### Installation

1. **Clone and install dependencies**
```bash
cd api
npm install
```

2. **Set up MongoDB Atlas**
   - Create a MongoDB Atlas account at [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create a new cluster (M0 Free tier is sufficient for development)
   - Create a database user with read/write permissions
   - Get your connection string

3. **Environment Configuration**

**Method 1: Interactive Setup (Recommended)**
```bash
npm run setup
```

**Method 2: Manual Setup**
```bash
# Copy the example environment file
cp env.example .env

# Edit .env with your MongoDB Atlas connection string and payment gateway keys
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster-url/txova_marketplace?retryWrites=true&w=majority
JWT_SECRET=your-jwt-secret-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
```

**Required Environment Variables:**
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT tokens

**Optional Variables (for Phase 5 features):**
- `STRIPE_SECRET_KEY` - For payment processing
- `SMTP_USER` / `SMTP_PASS` - For email notifications
- `CLOUDINARY_*` - For file uploads

See [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) for complete documentation.

### MongoDB Atlas Connection String Format

Your connection string should look like this:
```
mongodb+srv://username:password@cluster-name.xxxxx.mongodb.net/database-name?retryWrites=true&w=majority
```

**Steps to get your connection string:**
1. Go to your MongoDB Atlas dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string
5. Replace `<username>`, `<password>`, and `<database-name>` with your values

### Running the Application

**Development mode:**
```bash
npm run dev
```

**Production build:**
```bash
npm run build
npm start
```

## 🗄️ Database Setup

### MongoDB Atlas Configuration

1. **Network Access**
   - In Atlas dashboard, go to "Network Access"
   - Add your IP address or use `0.0.0.0/0` for development (allows all IPs)

2. **Database Access**
   - Go to "Database Access"
   - Create a new database user with read/write permissions
   - Use a strong password

3. **Collections**
   The API will automatically create these collections:
   - `users` - User accounts and authentication
   - `sellers` - Seller profiles and business info
   - `products` - Product catalog
   - `orders` - Order management
   - `payments` - Payment transactions
   - `reviews` - Product reviews
   - `tickets` - Support tickets

## 🧪 Testing the Setup

Once your server is running, test the database connection:

```bash
# Test database connection
curl http://localhost:3002/api/v1/test/db-test

# Create a test user
curl -X POST http://localhost:3002/api/v1/test/create-test-user

# Test product endpoints
curl http://localhost:3002/api/v1/products

# Test cart endpoints (requires authentication)
curl http://localhost:3002/api/v1/cart

# Test payment endpoints (requires authentication)
curl http://localhost:3002/api/v1/payments
```

## 🎯 **Current Status**

### **✅ Completed Phases**
- **Phase 1**: Project Setup & Infrastructure ✅
- **Phase 2**: Authentication & User Management ✅  
- **Phase 3**: Product Management & E-commerce Core ✅
- **Phase 4**: Order Management & Shopping Cart ✅ **COMPLETED & TESTED**
- **Phase 5**: Payment Integration & Review System ✅ **COMPLETED & TESTED**

### **🚀 Next Phase**
- **Phase 6**: Review System & Advanced Features (Ready to Start)

### **🔧 Recent Fixes Applied**
- ✅ Fixed TypeScript compilation errors in payment system
- ✅ Updated Stripe API version to latest (2025-08-27.basil)
- ✅ Fixed Payment model interface and method definitions
- ✅ Corrected import statements and authorization middleware
- ✅ Enhanced payment validation and error handling
- ✅ Fixed duplicate schema index warnings in all models
- ✅ Fixed boolean filter bug in product controller
- ✅ Fixed product filtering returning incorrect results
- ✅ Enhanced debugging and testing capabilities

## 📁 Project Structure

```
src/
├── config/          # Database and environment configuration
├── models/          # Mongoose models and schemas
├── middleware/      # Authentication, validation, etc.
├── routes/          # API route handlers
├── services/        # Business logic
├── utils/           # Helper functions
├── types/           # TypeScript type definitions
└── app.ts           # Main application file
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run compiled JavaScript in production
- `npm test` - Run tests (to be implemented)

## 🌐 API Endpoints

### Health Check
- `GET /health` - Server health status

### API Info
- `GET /api/v1` - API information and available endpoints

### Test Routes
- `GET /api/v1/test/db-test` - Test database connection
- `POST /api/v1/test/create-test-user` - Create a test user

### Payment Routes
- `POST /api/v1/payments/create-intent` - Create payment intent
- `POST /api/v1/payments/confirm` - Confirm payment
- `POST /api/v1/payments/refund` - Process refund (admin/seller only)
- `POST /api/v1/payments/webhook/stripe` - Stripe webhook handler
- `GET /api/v1/payments/:paymentId` - Get payment by ID
- `GET /api/v1/payments/user/payments` - Get user's payments
- `GET /api/v1/payments/order/:orderId` - Get payment by order ID
- `GET /api/v1/payments/status/:status` - Get payments by status (admin only)
- `POST /api/v1/payments/manual` - Create manual payment
- `PATCH /api/v1/payments/manual/:paymentId/complete` - Mark manual payment completed
- `GET /api/v1/payments/statistics/overview` - Get payment statistics (admin only)

## 🔐 Environment Variables

Required environment variables:
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `PORT` - Server port (default: 3002)
- `STRIPE_SECRET_KEY` - Stripe secret key for payment processing
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret for event verification

## 📝 Next Steps

1. **Review System** - Implement product reviews and ratings
2. **Email Notifications** - Add email confirmation for orders and payments
3. **Advanced Search** - Implement advanced product search and filtering
4. **Admin Dashboard** - Build comprehensive admin management features
5. **Mobile App API** - Optimize API for mobile application

## 🛠️ Development

### Adding New Models
1. Create the model in `src/models/`
2. Add TypeScript interfaces in `src/types/`
3. Create routes in `src/routes/`
4. Add middleware for validation and authentication

### Database Migrations
For production, consider using a migration tool like `migrate-mongo` for schema changes.

## 📊 Monitoring

The API includes basic logging and error handling. For production, consider:
- Application monitoring (Sentry)
- Performance monitoring (New Relic)
- Database monitoring (MongoDB Atlas built-in tools)

## 🔒 Security

- All passwords are hashed using bcrypt
- JWT tokens for authentication
- Rate limiting on all endpoints
- Input validation with Joi
- CORS configuration
- Helmet.js for security headers
- Payment gateway security (Stripe webhook verification)

## 💳 Payment Integration

The API now includes comprehensive payment processing capabilities:

### Supported Payment Methods
- **Stripe**: Credit/debit card payments
- **Manual Payments**: Bank transfer, cash on delivery
- **Future**: M-Pesa, E-Mola integration planned

### Payment Features
- Payment intent creation and confirmation
- Webhook handling for real-time payment updates
- Refund processing with reason tracking
- Payment status tracking and history
- Manual payment management for offline payments
- Payment statistics and reporting
- Role-based access control for payment operations

### Payment Security
- Stripe webhook signature verification
- Payment gateway transaction ID tracking
- Comprehensive error handling and logging
- Secure payment data handling
- Audit trail for all payment operations
