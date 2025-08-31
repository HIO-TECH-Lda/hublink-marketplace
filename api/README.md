# E-Commerce API

A comprehensive e-commerce API built with Node.js, Express, TypeScript, and MongoDB. This project implements a complete e-commerce platform with user management, product catalog, shopping cart, order management, payment processing, and review system.

## Current Status
**Phase 5 - Payment Integration & Review System ✅ COMPLETED**

The API now includes:
- ✅ Complete payment integration with Stripe
- ✅ Review and rating system with moderation
- ✅ Environment management and validation
- ✅ Multiple payment methods support (Stripe, PayPal, Bank Transfer, Cash on Delivery, M-Pesa, E-Mola)
- ✅ Comprehensive testing and documentation

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (user, seller, admin)
- User registration and login
- Password reset functionality

### 📦 Product Management
- Product catalog with categories
- Product variants and specifications
- Image management with Cloudinary
- Search and filtering capabilities
- Product status management (draft, active, inactive)
- Featured, best seller, and new arrival flags

### 🛒 Shopping Cart & Checkout
- Shopping cart functionality
- Add/remove items
- Apply discounts
- Checkout process
- Order creation

### 📋 Order Management
- Complete order lifecycle
- Order status tracking
- Order history
- Order analytics

### 💳 Payment Integration
- Stripe payment processing
- Payment intent creation and confirmation
- Webhook handling
- Refund processing
- Payment analytics
- Support for multiple payment methods

### ⭐ Review & Rating System
- Product reviews and ratings (1-5 stars)
- Review moderation system
- Purchase verification for authentic reviews
- Helpfulness voting
- Review analytics and statistics
- Review request system

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/forgot-password` - Forgot password
- `POST /api/v1/auth/reset-password` - Reset password

### Users
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `DELETE /api/v1/users/profile` - Delete user account

### Products
- `GET /api/v1/products` - Get products (with filtering)
- `POST /api/v1/products` - Create product (seller/admin)
- `GET /api/v1/products/:id` - Get product by ID
- `PUT /api/v1/products/:id` - Update product (seller/admin)
- `DELETE /api/v1/products/:id` - Delete product (seller/admin)
- `GET /api/v1/products/featured` - Get featured products
- `GET /api/v1/products/best-sellers` - Get best sellers
- `GET /api/v1/products/new-arrivals` - Get new arrivals
- `GET /api/v1/products/search` - Search products

### Categories
- `GET /api/v1/categories` - Get categories
- `POST /api/v1/categories` - Create category (admin)
- `GET /api/v1/categories/:id` - Get category by ID
- `PUT /api/v1/categories/:id` - Update category (admin)
- `DELETE /api/v1/categories/:id` - Delete category (admin)
- `GET /api/v1/categories/:id/products` - Get products by category

### Cart
- `GET /api/v1/cart` - Get user cart
- `POST /api/v1/cart/items` - Add item to cart
- `PUT /api/v1/cart/items/:itemId` - Update cart item
- `DELETE /api/v1/cart/items/:itemId` - Remove item from cart
- `DELETE /api/v1/cart` - Clear cart
- `POST /api/v1/cart/apply-discount` - Apply discount code

### Orders
- `GET /api/v1/orders` - Get user orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders/:id` - Get order by ID
- `PUT /api/v1/orders/:id/status` - Update order status (admin)
- `GET /api/v1/orders/admin/all` - Get all orders (admin)

### Payments
- `POST /api/v1/payments/create-intent` - Create payment intent
- `POST /api/v1/payments/confirm` - Confirm payment
- `POST /api/v1/payments/refund` - Process refund
- `POST /api/v1/payments/webhook` - Stripe webhook
- `GET /api/v1/payments/:id` - Get payment by ID
- `GET /api/v1/payments/user/:userId` - Get user payments
- `GET /api/v1/payments/order/:orderId` - Get order payments
- `GET /api/v1/payments/status/:status` - Get payments by status
- `POST /api/v1/payments/manual` - Create manual payment
- `PATCH /api/v1/payments/:id/complete` - Mark manual payment complete
- `GET /api/v1/payments/statistics` - Payment statistics
- `GET /api/v1/payments/analytics` - Payment analytics
- `GET /api/v1/payments/performance` - Payment performance

### Reviews
- `POST /api/v1/reviews` - Create review
- `GET /api/v1/reviews/product/:productId` - Get product reviews
- `GET /api/v1/reviews/product/:productId/statistics` - Get review statistics
- `GET /api/v1/reviews/:reviewId` - Get review by ID
- `PUT /api/v1/reviews/:reviewId` - Update review
- `DELETE /api/v1/reviews/:reviewId` - Delete review
- `POST /api/v1/reviews/:reviewId/helpful` - Mark review helpful
- `PATCH /api/v1/reviews/:reviewId/moderate` - Moderate review (admin)
- `GET /api/v1/reviews/admin/pending` - Get pending reviews (admin)
- `GET /api/v1/reviews/admin/analytics` - Get review analytics (admin)
- `GET /api/v1/reviews/user/reviews` - Get user reviews
- `GET /api/v1/reviews/recent/reviews` - Get recent reviews
- `POST /api/v1/reviews/send-request` - Send review request (admin/seller)

## Environment Configuration

### Quick Setup
1. Clone the repository
2. Run the interactive setup script:
   ```bash
   npm run setup
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### Manual Setup
1. Copy `.env.example` to `.env`
2. Configure the following environment variables:

```env
# Server Configuration
PORT=3002
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT Configuration
JWT_SECRET=your-jwt-secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=30d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Stripe Configuration
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Email Configuration (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# M-Pesa Configuration (Phase 6 - Local Payment Integration)
MPESA_API_KEY=your-mpesa-api-key
MPESA_BASE_URL=https://sandbox.safaricom.co.ke
MPESA_BUSINESS_SHORT_CODE=your-business-short-code
MPESA_PASSKEY=your-mpesa-passkey

# E-Mola Configuration (Phase 6 - Local Payment Integration)
EMOLA_API_KEY=your-emola-api-key
EMOLA_BASE_URL=https://api.emola.co.mz
```

## Installation

```bash
# Install dependencies
npm install

# Run setup script (recommended)
npm run setup

# Or set up environment manually
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Testing

### Manual Testing Examples

#### Test Product Endpoints
```bash
# Get all products
curl http://localhost:3002/api/v1/products

# Get products with filters
curl "http://localhost:3002/api/v1/products?status=active&isFeatured=true&page=1&limit=10"

# Search products
curl "http://localhost:3002/api/v1/products/search?q=smartphone"
```

#### Test Cart Endpoints (requires authentication)
```bash
# Get user cart
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:3002/api/v1/cart

# Add item to cart
curl -X POST -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":"PRODUCT_ID","quantity":2}' \
  http://localhost:3002/api/v1/cart/items
```

#### Test Payment Endpoints (requires authentication)
```bash
# Create payment intent
curl -X POST -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"amount":1000,"currency":"usd","orderId":"ORDER_ID"}' \
  http://localhost:3002/api/v1/payments/create-intent
```

#### Test Review Endpoints (requires authentication)
```bash
# Create review
curl -X POST -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"productId":"PRODUCT_ID","orderId":"ORDER_ID","rating":5,"title":"Great Product","content":"Excellent quality and fast delivery"}' \
  http://localhost:3002/api/v1/reviews

# Get product reviews
curl http://localhost:3002/api/v1/reviews/product/PRODUCT_ID
```

### Automated Testing
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e
```

## Recent Fixes Applied

### Phase 4 Fixes
- ✅ Fixed boolean query parameter handling in product filtering
- ✅ Resolved product status filtering issues
- ✅ Fixed duplicate index warnings in Mongoose models
- ✅ Enhanced error handling in models and services

### Phase 5 Fixes
- ✅ Resolved TypeScript compilation errors in payment service
- ✅ Fixed review system integration issues
- ✅ Corrected validation schema errors
- ✅ Updated payment methods to include M-Pesa and E-Mola

## Project Structure

```
src/
├── controllers/     # Request handlers
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
├── middleware/     # Custom middleware
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
└── app.ts          # Main application file
```

## Technologies Used

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens
- **File Storage**: Cloudinary
- **Payment**: Stripe API
- **Email**: Nodemailer (structure ready)
- **Validation**: Joi schemas
- **Testing**: Manual testing with curl/axios

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run setup` - Interactive environment setup
- `npm run setup:env` - Manual environment setup
- `npm test` - Run tests
- `npm run lint` - Run linter
- `npm run type-check` - TypeScript type checking

### Code Style
- Follow TypeScript best practices
- Use ESLint for code linting
- Implement comprehensive error handling
- Write meaningful commit messages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please refer to the project documentation or create an issue in the repository.
