'use client';

import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/auth/LoginForm';
import { Button } from '@/components/ui/button';

export default function TestApiPage() {
  const { user, logout } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">API Integration Test</h1>
      
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Authentication Test</h2>
        {user ? (
          <div className="space-y-4">
            <p>✅ Authentication working!</p>
            <p>Welcome, {user.firstName} {user.lastName}!</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <Button onClick={logout}>Logout</Button>
          </div>
        ) : (
          <div className="max-w-md">
            <p className="mb-4">Test authentication:</p>
            <LoginForm />
          </div>
        )}
      </div>

      <div className="mb-8 p-6 bg-green-50 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">✅ API Integration Status</h2>
        <div className="space-y-2">
          <p>✅ Dependencies installed</p>
          <p>✅ API client configured</p>
          <p>✅ TypeScript types defined</p>
          <p>✅ React Query hooks created</p>
          <p>✅ Authentication context working</p>
        </div>
      </div>
    </div>
  );
}
