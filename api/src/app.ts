import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { validateEnvironmentVariables } from './utils/envValidation';
import testRoutes from './routes/test';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';
import paymentRoutes from './routes/payment';
import reviewRoutes from './routes/reviews';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3002;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    message: 'Txova Marketplace API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes (to be added)
app.get('/api/v1', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to Txova Marketplace API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      products: '/api/v1/products',
      categories: '/api/v1/categories',
      cart: '/api/v1/cart',
      orders: '/api/v1/orders',
      payments: '/api/v1/payments',
      reviews: '/api/v1/reviews',
      test: '/api/v1/test'
    },
    authEndpoints: {
      register: 'POST /api/v1/auth/register',
      login: 'POST /api/v1/auth/login',
      refresh: 'POST /api/v1/auth/refresh',
      profile: 'GET /api/v1/auth/me',
      updateProfile: 'PUT /api/v1/auth/me',
      changePassword: 'PUT /api/v1/auth/change-password',
      logout: 'POST /api/v1/auth/logout'
    },
    cartEndpoints: {
      getCart: 'GET /api/v1/cart',
      addToCart: 'POST /api/v1/cart/add',
      updateCart: 'PUT /api/v1/cart/update',
      removeFromCart: 'DELETE /api/v1/cart/remove',
      clearCart: 'DELETE /api/v1/cart/clear',
      cartSummary: 'GET /api/v1/cart/summary',
      cartAvailability: 'GET /api/v1/cart/availability'
    },
    orderEndpoints: {
      createFromCart: 'POST /api/v1/orders/create-from-cart',
      createOrder: 'POST /api/v1/orders/create',
      myOrders: 'GET /api/v1/orders/my-orders',
      getOrder: 'GET /api/v1/orders/:orderId',
      getOrderByNumber: 'GET /api/v1/orders/number/:orderNumber',
      orderTracking: 'GET /api/v1/orders/:orderId/tracking',
      cancelOrder: 'POST /api/v1/orders/:orderId/cancel',
      updateOrderStatus: 'PATCH /api/v1/orders/:orderId/status (admin/seller)',
      allOrders: 'GET /api/v1/orders (admin)',
      orderStatistics: 'GET /api/v1/orders/statistics/user'
    },
    paymentEndpoints: {
      createPaymentIntent: 'POST /api/v1/payments/create-intent',
      confirmPayment: 'POST /api/v1/payments/confirm',
      processRefund: 'POST /api/v1/payments/refund (admin/seller)',
      getPayment: 'GET /api/v1/payments/:paymentId',
      getUserPayments: 'GET /api/v1/payments/user/payments',
      getPaymentByOrder: 'GET /api/v1/payments/order/:orderId',
      getPaymentsByStatus: 'GET /api/v1/payments/status/:status (admin)',
      createManualPayment: 'POST /api/v1/payments/manual',
      markManualComplete: 'PATCH /api/v1/payments/manual/:paymentId/complete (admin/seller)',
      paymentStatistics: 'GET /api/v1/payments/statistics/overview (admin)',
      paymentAnalytics: 'GET /api/v1/payments/analytics (admin)',
      paymentPerformance: 'GET /api/v1/payments/performance (admin)',
      stripeWebhook: 'POST /api/v1/payments/webhook/stripe'
    },
    reviewEndpoints: {
      createReview: 'POST /api/v1/reviews',
      getProductReviews: 'GET /api/v1/reviews/product/:productId',
      getReviewStatistics: 'GET /api/v1/reviews/product/:productId/statistics',
      updateReview: 'PUT /api/v1/reviews/:reviewId',
      deleteReview: 'DELETE /api/v1/reviews/:reviewId',
      markHelpful: 'POST /api/v1/reviews/:reviewId/helpful',
      moderateReview: 'PATCH /api/v1/reviews/:reviewId/moderate (admin)',
      getPendingReviews: 'GET /api/v1/reviews/admin/pending (admin)',
      getReviewAnalytics: 'GET /api/v1/reviews/admin/analytics (admin)',
      getUserReviews: 'GET /api/v1/reviews/user/reviews',
      getRecentReviews: 'GET /api/v1/reviews/recent/reviews',
      sendReviewRequest: 'POST /api/v1/reviews/send-request (admin/seller)'
    }
  });
});

// Test routes
app.use('/api/v1/test', testRoutes);

// Authentication routes
app.use('/api/v1/auth', authRoutes);

// Product routes
app.use('/api/v1/products', productRoutes);

// Category routes
app.use('/api/v1/categories', categoryRoutes);

// Cart routes
app.use('/api/v1/cart', cartRoutes);

// Order routes
app.use('/api/v1/orders', orderRoutes);

// Payment routes
app.use('/api/v1/payments', paymentRoutes);

// Review routes
app.use('/api/v1/reviews', reviewRoutes);

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Start server
const startServer = async () => {
  try {
    // Validate environment variables
    if (!validateEnvironmentVariables()) {
      console.error('❌ Environment validation failed. Please check your .env file.');
      process.exit(1);
    }

    // Connect to MongoDB
    await connectDB();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`✅ Health check: http://localhost:${PORT}/health`);
      console.log(`🌐 API Base URL: http://localhost:${PORT}/api/v1`);
      console.log(`🗄️ Database: MongoDB Atlas`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Only start server if this file is run directly
if (require.main === module) {
  startServer();
}

// Export app for testing
export { app };
