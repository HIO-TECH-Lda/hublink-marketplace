# API Integration Implementation

This document outlines the complete API integration implementation for the Txova Marketplace frontend.

## 🚀 What's Been Implemented

### 1. Core Dependencies
- ✅ **Axios** - HTTP client for API requests
- ✅ **@tanstack/react-query** - Data fetching and caching
- ✅ **@stripe/stripe-js** - Stripe payment integration
- ✅ **@stripe/react-stripe-js** - React Stripe components

### 2. API Client Setup
- ✅ **lib/api-client.ts** - Axios instance with interceptors
- ✅ **Authentication headers** - Automatic token injection
- ✅ **Error handling** - 401 redirects and error management
- ✅ **Base URL configuration** - Environment-based API endpoints

### 3. TypeScript Types
- ✅ **types/api.ts** - Complete type definitions for:
  - User, Product, Cart, Order, Category, Review
  - API responses and pagination
  - Authentication and payment types

### 4. Authentication System
- ✅ **contexts/AuthContext.tsx** - Global auth state management
- ✅ **Login/Register/Logout** functionality
- ✅ **Token persistence** in localStorage
- ✅ **Auto token refresh** and profile fetching

### 5. React Query Hooks
- ✅ **hooks/useProducts.ts** - Product fetching, search, featured products
- ✅ **hooks/useCategories.ts** - Category management
- ✅ **hooks/useCart.ts** - Cart operations (add, update, remove, clear)
- ✅ **hooks/useWishlist.ts** - Wishlist management
- ✅ **hooks/useOrders.ts** - Order creation and tracking
- ✅ **hooks/usePayments.ts** - Payment processing
- ✅ **hooks/useReviews.ts** - Review system

### 6. UI Components
- ✅ **components/auth/LoginForm.tsx** - Authentication form
- ✅ **components/products/ProductCard.tsx** - Product display with API integration
- ✅ **components/products/ProductsList.tsx** - Product listing with loading states

### 7. Provider Setup
- ✅ **QueryClientProvider** - React Query setup
- ✅ **AuthProvider** - Authentication context
- ✅ **Updated layout.tsx** - Proper provider hierarchy

## 🔧 Environment Configuration

Create `.env.local` file:
```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3002/api/v1
NEXT_PUBLIC_API_URL=http://localhost:3002

# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# App Configuration
NEXT_PUBLIC_APP_NAME=Txova Marketplace
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📋 API Endpoints Expected

The integration expects the following API endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user profile

### Products
- `GET /products` - List products with filters
- `GET /products/:id` - Get single product
- `GET /products/featured` - Featured products
- `GET /products/best-sellers` - Best selling products
- `GET /products/new-arrivals` - New arrivals
- `GET /products/search?q=query` - Search products

### Categories
- `GET /categories` - List all categories
- `GET /products/category/:id` - Products by category

### Cart
- `GET /cart` - Get user cart
- `POST /cart/add` - Add item to cart
- `PUT /cart/update` - Update cart item quantity
- `DELETE /cart/remove` - Remove item from cart
- `DELETE /cart/clear` - Clear entire cart

### Wishlist
- `GET /wishlist` - Get user wishlist
- `POST /wishlist/add` - Add to wishlist
- `DELETE /wishlist/remove/:id` - Remove from wishlist
- `GET /wishlist/check/:id` - Check if item is in wishlist

### Orders
- `GET /orders/my-orders` - User orders
- `GET /orders/:id` - Single order details
- `POST /orders/create-from-cart` - Create order from cart
- `POST /orders/:id/cancel` - Cancel order

### Payments
- `POST /payments/create-intent` - Create Stripe payment intent
- `POST /payments/confirm` - Confirm payment
- `POST /payments/manual` - Manual payment processing

### Reviews
- `GET /reviews/product/:id` - Product reviews
- `GET /reviews/product/:id/statistics` - Review statistics
- `POST /reviews` - Create review
- `POST /reviews/:id/helpful` - Mark review as helpful

## 🎯 Usage Examples

### Using Product Hooks
```tsx
import { useProducts, useProduct } from '@/hooks/useProducts';

function ProductsPage() {
  const { data: products, isLoading } = useProducts({
    page: 1,
    limit: 20,
    category: 'fruits'
  });

  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {products?.data.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
```

### Using Cart Hooks
```tsx
import { useCart, useAddToCart } from '@/hooks/useCart';

function CartPage() {
  const { data: cart } = useCart();
  const addToCart = useAddToCart();

  const handleAddToCart = (productId: string) => {
    addToCart.mutate({ productId, quantity: 1 });
  };

  return (
    <div>
      {cart?.items.map(item => (
        <CartItem key={item._id} item={item} />
      ))}
    </div>
  );
}
```

### Using Authentication
```tsx
import { useAuth } from '@/contexts/AuthContext';

function Header() {
  const { user, logout } = useAuth();

  return (
    <div>
      {user ? (
        <div>
          Welcome, {user.firstName}!
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <Link href="/entrar">Login</Link>
      )}
    </div>
  );
}
```

## 🧪 Testing the Integration

1. **Start the API server** on `http://localhost:3002`
2. **Visit `/api-demo`** to see the integration in action
3. **Test authentication** with the login form
4. **Test product loading** and cart functionality
5. **Check browser network tab** for API requests

## 🔄 Next Steps

1. **Update existing components** to use API hooks instead of mock data
2. **Implement error boundaries** for better error handling
3. **Add loading skeletons** for better UX
4. **Implement offline support** with React Query's caching
5. **Add real-time updates** with WebSocket integration

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure API server has proper CORS configuration
   - Add frontend URL to CORS_ORIGIN in API

2. **Authentication Issues**
   - Check if JWT token is being sent correctly
   - Verify token expiration handling
   - Ensure proper error handling for 401 responses

3. **API Connection Issues**
   - Verify API base URL in environment variables
   - Check if API server is running
   - Test API endpoints with tools like Postman

4. **TypeScript Errors**
   - Ensure all types are properly imported
   - Check API response structure matches types
   - Update types if API responses change

## 📚 Additional Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com/docs/intro)
- [Stripe React Documentation](https://stripe.com/docs/stripe-js/react)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
