'use client';

import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import { Button } from '@/components/ui/button';

export default function ApiDemoPage() {
  const { user, logout } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">API Integration Demo</h1>
      
      {/* Authentication Section */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Authentication</h2>
        {user ? (
          <div className="space-y-4">
            <p>Welcome, {user.firstName} {user.lastName}!</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <Button onClick={logout}>Logout</Button>
          </div>
        ) : (
          <div className="max-w-md">
            <LoginForm />
          </div>
        )}
      </div>

      {/* API Status Section */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">API Integration Status</h2>
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-medium text-green-800">✅ Dependencies Installed</h3>
            <p className="text-sm text-green-600">Axios, React Query, Stripe integration</p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-medium text-green-800">✅ API Client Configured</h3>
            <p className="text-sm text-green-600">Authentication interceptors and error handling</p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-medium text-green-800">✅ TypeScript Types</h3>
            <p className="text-sm text-green-600">Complete type definitions for all API responses</p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-medium text-green-800">✅ React Query Hooks</h3>
            <p className="text-sm text-green-600">Products, Cart, Orders, Payments, Reviews</p>
          </div>
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-medium text-yellow-800">⚠️ API Server Required</h3>
            <p className="text-sm text-yellow-600">Start your API server on http://localhost:3002 to test full functionality</p>
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="mb-8 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
        <div className="space-y-2 text-sm">
          <p>1. Start your API server on port 3002</p>
          <p>2. Configure environment variables in .env.local</p>
          <p>3. Test authentication with the login form above</p>
          <p>4. Use the React Query hooks in your components</p>
          <p>5. Check the API-INTEGRATION-README.md for detailed documentation</p>
        </div>
      </div>
    </div>
  );
}
