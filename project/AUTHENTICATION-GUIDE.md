# Authentication & Authorization Guide

This guide explains the updated authentication and authorization system with API integration.

## 🚀 Features

- **JWT Token Authentication** with refresh token support
- **Role-based Access Control** (buyer, seller, admin, support)
- **Automatic Token Refresh** on API calls
- **Protected Routes** and components
- **TypeScript Support** with full type safety
- **Error Handling** with user-friendly messages

## 📁 File Structure

```
contexts/
├── AuthContext.tsx          # Main authentication context
hooks/
├── useAuth.ts              # Authentication hooks
components/auth/
├── LoginForm.tsx           # Login form component
├── ProtectedRoute.tsx      # Route protection wrapper
└── RoleGuard.tsx          # Role-based component wrapper
lib/
└── api-client.ts          # API client with auth interceptors
types/
└── api.ts                 # TypeScript type definitions
```

## 🔧 Setup

### 1. Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3002/api/v1
NEXT_PUBLIC_API_URL=http://localhost:3002
```

### 2. Provider Setup

Wrap your app with the AuthProvider:

```tsx
// app/layout.tsx
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
```

## 🎯 Usage Examples

### Basic Authentication

```tsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, login, logout, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.fullName}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => login('email@example.com', 'password')}>
          Login
        </button>
      )}
    </div>
  );
}
```

### Role-based Access Control

```tsx
import { useAuth, useRequireRole } from '@/hooks/useAuth';
import { RoleGuard } from '@/components/auth/RoleGuard';

function AdminPanel() {
  const { hasRole } = useAuth();
  const { user, hasAccess } = useRequireRole('admin');

  // Method 1: Using hook
  if (!hasAccess) {
    return <div>Access denied</div>;
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      {/* Admin content */}
    </div>
  );
}

function ConditionalContent() {
  return (
    <div>
      {/* Method 2: Using component wrapper */}
      <RoleGuard allowedRoles="admin">
        <div>Admin only content</div>
      </RoleGuard>

      <RoleGuard allowedRoles={['seller', 'admin']}>
        <div>Seller or Admin content</div>
      </RoleGuard>

      <RoleGuard allowedRoles="buyer" showForRoles={false}>
        <div>Content for non-buyers</div>
      </RoleGuard>
    </div>
  );
}
```

### Protected Routes

```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function AdminPage() {
  return (
    <ProtectedRoute allowedRoles="admin">
      <div>
        <h1>Admin Dashboard</h1>
        {/* Admin content */}
      </div>
    </ProtectedRoute>
  );
}

function UserProfile() {
  return (
    <ProtectedRoute>
      <div>
        <h1>User Profile</h1>
        {/* Any authenticated user can see this */}
      </div>
    </ProtectedRoute>
  );
}
```

### Redirect Hooks

```tsx
import { 
  useRedirectIfAuthenticated, 
  useRedirectIfNotAuthenticated,
  useRedirectIfNotRole 
} from '@/hooks/useAuth';

function LoginPage() {
  // Redirect to home if already logged in
  useRedirectIfAuthenticated('/');
  
  return <div>Login form...</div>;
}

function ProtectedPage() {
  // Redirect to login if not authenticated
  useRedirectIfNotAuthenticated('/entrar');
  
  return <div>Protected content...</div>;
}

function AdminPage() {
  // Redirect to home if not admin
  useRedirectIfNotRole('admin', '/');
  
  return <div>Admin content...</div>;
}
```

## 🔐 API Integration

### Login Flow

1. User submits login form
2. API call to `/auth/login` with email/password
3. Server returns JWT token and refresh token
4. Tokens stored in localStorage
5. User state updated in context

### Token Refresh

- Automatic token refresh on 401 responses
- Refresh token used to get new access token
- Seamless user experience without re-login

### Logout Flow

1. Clear tokens from localStorage
2. Clear user state from context
3. Redirect to login page

## 🎨 User Types

```typescript
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'buyer' | 'seller' | 'admin' | 'support';
  status: 'active' | 'inactive' | 'suspended';
  emailVerified: boolean;
  phoneVerified: boolean;
  avatar?: string;
  sellerId?: string;
  preferences: {
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
    };
    language: string;
    currency: string;
  };
  createdAt: string;
  updatedAt: string;
  fullName: string;
}
```

## 🛡️ Security Features

### Token Management
- JWT access tokens with expiration
- Refresh tokens for seamless renewal
- Automatic token cleanup on logout

### Error Handling
- Graceful handling of expired tokens
- User-friendly error messages
- Automatic redirect on authentication failure

### Role-based Security
- Fine-grained access control
- Component-level protection
- Route-level protection

## 🧪 Testing

Visit `/auth-demo` to see the authentication system in action:

- Authentication status
- Role-based content visibility
- Protected route examples
- Hook usage demonstrations

## 🔄 API Endpoints

The system expects these API endpoints:

```
POST /auth/login          # User login
POST /auth/register       # User registration
POST /auth/refresh        # Token refresh
GET  /auth/me            # Get current user
POST /auth/logout        # User logout
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure API server has proper CORS configuration
   - Add frontend URL to CORS_ORIGIN

2. **Token Refresh Issues**
   - Check refresh token endpoint
   - Verify token storage in localStorage

3. **Role Access Issues**
   - Verify user role in API response
   - Check role comparison logic

4. **TypeScript Errors**
   - Ensure all types are properly imported
   - Check API response structure matches types

## 📚 Additional Resources

- [React Context Documentation](https://reactjs.org/docs/context.html)
- [JWT.io](https://jwt.io/) - JWT token debugging
- [Next.js Authentication](https://nextjs.org/docs/authentication)
