'use client';

import { useAuth, useRequireAuth, useRequireRole } from '@/hooks/useAuth';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LogOut, User, Shield, ShoppingBag, Settings } from 'lucide-react';

export default function AuthDemoPage() {
  const { user, isAuthenticated, hasRole, logout, loading } = useAuth();
  const requireAuth = useRequireAuth();
  const requireAdmin = useRequireRole('admin');
  const requireSeller = useRequireRole('seller');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-1 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Authentication & Authorization Demo</h1>
          
          {/* Authentication Status */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Authentication Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Status:</span>
                  <Badge variant={isAuthenticated ? "default" : "secondary"}>
                    {isAuthenticated ? "Authenticated" : "Not Authenticated"}
                  </Badge>
                </div>
                
                {user && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Name:</span>
                      <span>{user.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Email:</span>
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Role:</span>
                      <Badge variant="outline">{user.role}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Status:</span>
                      <Badge variant={user.status === 'active' ? "default" : "secondary"}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                )}
                
                {isAuthenticated && (
                  <Button onClick={logout} variant="outline" className="mt-4">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Role-based Access Control */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Role-based Access Control
              </CardTitle>
              <CardDescription>
                These sections are only visible to users with specific roles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Buyer Content */}
                <RoleGuard allowedRoles="buyer">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-semibold text-green-800 mb-2">Buyer Dashboard</h3>
                    <p className="text-green-700 text-sm">This content is only visible to buyers.</p>
                  </div>
                </RoleGuard>

                {/* Seller Content */}
                <RoleGuard allowedRoles="seller">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Seller Dashboard</h3>
                    <p className="text-blue-700 text-sm">This content is only visible to sellers.</p>
                  </div>
                </RoleGuard>

                {/* Admin Content */}
                <RoleGuard allowedRoles="admin">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="font-semibold text-red-800 mb-2">Admin Dashboard</h3>
                    <p className="text-red-700 text-sm">This content is only visible to admins.</p>
                  </div>
                </RoleGuard>
              </div>
            </CardContent>
          </Card>

          {/* Protected Routes Demo */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Protected Routes Demo
              </CardTitle>
              <CardDescription>
                These components demonstrate different protection levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Any authenticated user */}
                <ProtectedRoute>
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h3 className="font-semibold mb-2">Protected Content</h3>
                    <p className="text-sm text-gray-600">This content is visible to any authenticated user.</p>
                  </div>
                </ProtectedRoute>

                {/* Admin only */}
                <ProtectedRoute allowedRoles="admin">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h3 className="font-semibold text-red-800 mb-2">Admin Only Content</h3>
                    <p className="text-red-700 text-sm">This content is only visible to administrators.</p>
                  </div>
                </ProtectedRoute>

                {/* Seller or Admin */}
                <ProtectedRoute allowedRoles={['seller', 'admin']}>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">Seller/Admin Content</h3>
                    <p className="text-blue-700 text-sm">This content is visible to sellers and admins.</p>
                  </div>
                </ProtectedRoute>
              </div>
            </CardContent>
          </Card>

          {/* Hook Usage Examples */}
          <Card>
            <CardHeader>
              <CardTitle>Hook Usage Examples</CardTitle>
              <CardDescription>
                Examples of how to use the authentication hooks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">useRequireAuth()</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Returns: loading, requiresAuth, user
                  </p>
                  <div className="text-xs font-mono bg-white p-2 rounded border">
                    {JSON.stringify(requireAuth, null, 2)}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">useRequireRole('admin')</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Returns: loading, requiresAuth, hasAccess, user
                  </p>
                  <div className="text-xs font-mono bg-white p-2 rounded border">
                    {JSON.stringify(requireAdmin, null, 2)}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-2">useRequireRole('seller')</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    Returns: loading, requiresAuth, hasAccess, user
                  </p>
                  <div className="text-xs font-mono bg-white p-2 rounded border">
                    {JSON.stringify(requireSeller, null, 2)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
