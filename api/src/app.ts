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
import wishlistRoutes from './routes/wishlist';
import emailRoutes from './routes/email';
import imaliRoutes from './routes/imali';
import payoutRoutes from './routes/payouts';
import refundRoutes from './routes/refunds';
import ticketRoutes from './routes/tickets';
import financeRoutes from './routes/finances';
import dashboardRoutes from './routes/dashboard';
import adminUserRoutes from './routes/adminUsers';
import adminOrderRoutes from './routes/adminOrders';
import adminRefundRoutes from './routes/adminRefunds';
import adminProductRoutes from './routes/adminProducts';
import adminSellerRoutes from './routes/adminSellers';
import adminCategoryRoutes from './routes/adminCategories';
import blogRoutes from './routes/blog';
import adminBlogRoutes from './routes/adminBlog';
import adminNewsletterRoutes from './routes/adminNewsletter';
import adminTicketRoutes from './routes/adminTickets';
import adminReportsRoutes from './routes/adminReports';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3002;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 100 requests per windowMs
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
      processPayment: 'POST /api/v1/payments/process (UNIFIED - handles all payment methods)',
      createPaymentIntent: 'POST /api/v1/payments/create-intent (Stripe only)',
      confirmPayment: 'POST /api/v1/payments/confirm (Stripe only)',
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
    imaliEndpoints: {
      generateTransaction: 'POST /api/v1/imali/generate-transaction',
      getStaticQRCode: 'GET /api/v1/imali/qrcode/:storeAccountNumber',
      generatePaymentPush: 'POST /api/v1/imali/generate-payment-push',
      checkTransactionStatus: 'GET /api/v1/imali/check-transaction/:transactionId',
      createPayByLink: 'POST /api/v1/imali/create-pay-by-link'
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
    },
    wishlistEndpoints: {
      getWishlist: 'GET /api/v1/wishlist',
      addToWishlist: 'POST /api/v1/wishlist/add',
      removeFromWishlist: 'DELETE /api/v1/wishlist/remove/:productId',
      checkWishlistStatus: 'GET /api/v1/wishlist/check/:productId',
      clearWishlist: 'DELETE /api/v1/wishlist/clear',
      moveToCart: 'POST /api/v1/wishlist/move-to-cart/:productId',
      getWishlistStats: 'GET /api/v1/wishlist/stats',
      getWishlistItems: 'GET /api/v1/wishlist/items',
      updateItemNotes: 'PUT /api/v1/wishlist/update-notes/:productId',
      getRecommendations: 'GET /api/v1/wishlist/recommendations',
      bulkAddToWishlist: 'POST /api/v1/wishlist/bulk-add',
      bulkRemoveFromWishlist: 'DELETE /api/v1/wishlist/bulk-remove'
    },
    payoutEndpoints: {
      getBalance: 'GET /api/v1/payouts/balance (seller)',
      getHistory: 'GET /api/v1/payouts/history (seller)',
      requestPayout: 'POST /api/v1/payouts/request (seller)',
      getPayoutById: 'GET /api/v1/payouts/:payoutId (seller)'
    },
    refundEndpoints: {
      createRefundRequest: 'POST /api/v1/refunds/request (buyer)',
      getBuyerRefunds: 'GET /api/v1/refunds/my-refunds (buyer)',
      getBuyerRefundById: 'GET /api/v1/refunds/my-refunds/:refundId (buyer)',
      getStatistics: 'GET /api/v1/refunds/statistics (seller)',
      getRefunds: 'GET /api/v1/refunds (seller)',
      getRefundById: 'GET /api/v1/refunds/:refundId (seller)',
      approveRefund: 'PATCH /api/v1/refunds/:refundId/approve (seller)',
      rejectRefund: 'PATCH /api/v1/refunds/:refundId/reject (seller)',
      getAllRefunds: 'GET /api/v1/refunds/admin/all (admin)',
      getAllStatistics: 'GET /api/v1/refunds/admin/statistics (admin)',
      getAnyRefundById: 'GET /api/v1/refunds/admin/:refundId (admin)',
      approveRefundByAdmin: 'PATCH /api/v1/refunds/admin/:refundId/approve (admin)',
      rejectRefundByAdmin: 'PATCH /api/v1/refunds/admin/:refundId/reject (admin)'
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

// Wishlist routes
app.use('/api/v1/wishlist', wishlistRoutes);

// Email routes
app.use('/api/v1/email', emailRoutes);

// iMali routes
app.use('/api/v1/imali', imaliRoutes);

// Payout routes (seller only)
app.use('/api/v1/payouts', payoutRoutes);

// Refund routes (seller only)
app.use('/api/v1/refunds', refundRoutes);

// Ticket routes
app.use('/api/v1/tickets', ticketRoutes);

// Seller finance routes
app.use('/api/v1/seller/finances', financeRoutes);

// Admin dashboard routes
app.use('/api/v1/admin/dashboard', dashboardRoutes);

// Admin user management routes
app.use('/api/v1/admin/users', adminUserRoutes);

// Admin order management routes
app.use('/api/v1/admin/orders', adminOrderRoutes);

// Admin refund management routes
app.use('/api/v1/admin/refunds', adminRefundRoutes);

// Admin product management routes
app.use('/api/v1/admin/products', adminProductRoutes);

// Admin seller management routes
app.use('/api/v1/admin/sellers', adminSellerRoutes);

// Admin category management routes
app.use('/api/v1/admin/categories', adminCategoryRoutes);

// Blog routes (public)
app.use('/api/v1/blog', blogRoutes);

// Admin blog management routes
app.use('/api/v1/admin/blog', adminBlogRoutes);

// Admin newsletter routes
app.use('/api/v1/admin/newsletter', adminNewsletterRoutes);

// Admin ticket management routes
app.use('/api/v1/admin/tickets', adminTicketRoutes);

// Admin reports and analytics routes
app.use('/api/v1/admin/reports', adminReportsRoutes);

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
