'use client';

import { useRequireAuth, useRequireRole } from '@/hooks/useAuth';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string | string[];
  fallback?: ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  allowedRoles, 
  fallback = <div>Loading...</div>,
  redirectTo 
}: ProtectedRouteProps) {
  const requireAuthResult = useRequireAuth();
  const requireRoleResult = useRequireRole(allowedRoles || ['']);
  
  const authResult = allowedRoles ? requireRoleResult : requireAuthResult;

  if (authResult.loading) {
    return <>{fallback}</>;
  }

  if (authResult.requiresAuth) {
    if (redirectTo) {
      // Redirect will be handled by the hook
      return null;
    }
    return <div>Access denied. Please log in.</div>;
  }

  if ('hasAccess' in authResult && !authResult.hasAccess) {
    if (redirectTo) {
      // Redirect will be handled by the hook
      return null;
    }
    return <div>Access denied. Insufficient permissions.</div>;
  }

  return <>{children}</>;
}
