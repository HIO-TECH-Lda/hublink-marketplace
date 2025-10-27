'use client';

import { useAuth } from '@/hooks/useAuth';
import { ReactNode } from 'react';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string | string[];
  fallback?: ReactNode;
  showForRoles?: boolean; // If true, show for these roles, if false, hide for these roles
}

export default function RoleGuard({ 
  children, 
  allowedRoles, 
  fallback = null,
  showForRoles = true 
}: RoleGuardProps) {
  const { hasRole, loading } = useAuth();

  if (loading) {
    return null;
  }

  const hasAccess = hasRole(allowedRoles);
  const shouldShow = showForRoles ? hasAccess : !hasAccess;

  return shouldShow ? <>{children}</> : <>{fallback}</>;
}
