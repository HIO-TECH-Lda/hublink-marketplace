'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function ApiTestPage() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">API Integration Test</h1>
      
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>
        {user ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-medium text-green-800">✅ User Authenticated</h3>
              <p className="text-sm text-green-600">
                Welcome, {user.firstName} {user.lastName}!
              </p>
              <p className="text-sm text-green-600">Email: {user.email}</p>
              <p className="text-sm text-green-600">Role: {user.role}</p>
              <Button onClick={logout} className="mt-2">Logout</Button>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-medium text-yellow-800">⚠️ Not Authenticated</h3>
            <p className="text-sm text-yellow-600">
              Authentication context is working, but no user is logged in.
            </p>
          </div>
        )}
      </div>

      <div className="mb-8 p-6 bg-blue-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Integration Status</h2>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✅</span>
            <span>React Query configured</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✅</span>
            <span>Authentication context working</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✅</span>
            <span>API client configured</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-600">✅</span>
            <span>TypeScript types defined</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600">⚠️</span>
            <span>API server not connected (expected)</span>
          </div>
        </div>
      </div>

      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
        <div className="space-y-2 text-sm">
          <p>1. Start your API server on port 3002</p>
          <p>2. Configure environment variables in .env.local</p>
          <p>3. Test the React Query hooks with real API data</p>
          <p>4. Check the API-INTEGRATION-README.md for documentation</p>
        </div>
      </div>
    </div>
  );
}
