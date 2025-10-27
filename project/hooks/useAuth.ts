import { useAuth as useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useAuth = () => {
  return useAuthContext();
};

export const useRequireAuth = () => {
  const { user, loading } = useAuth();
  
  if (loading) return { loading: true };
  if (!user) {
    return { loading: false, requiresAuth: true };
  }
  
  return { loading: false, requiresAuth: false, user };
};

export const useRequireRole = (allowedRoles: string | string[]) => {
  const { user, loading, hasRole } = useAuth();
  
  if (loading) return { loading: true };
  if (!user) {
    return { loading: false, requiresAuth: true };
  }
  
  const hasRequiredRole = hasRole(allowedRoles);
  if (!hasRequiredRole) {
    return { loading: false, requiresAuth: false, hasAccess: false, user };
  }
  
  return { loading: false, requiresAuth: false, hasAccess: true, user };
};

export const useRedirectIfAuthenticated = (redirectTo: string = '/') => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, loading, router, redirectTo]);
  
  return { isAuthenticated, loading };
};

export const useRedirectIfNotAuthenticated = (redirectTo: string = '/entrar') => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, loading, router, redirectTo]);
  
  return { isAuthenticated, loading };
};

export const useRedirectIfNotRole = (allowedRoles: string | string[], redirectTo: string = '/') => {
  const { user, loading, hasRole } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && user && !hasRole(allowedRoles)) {
      router.push(redirectTo);
    }
  }, [user, loading, hasRole, allowedRoles, router, redirectTo]);
  
  return { user, loading, hasAccess: user ? hasRole(allowedRoles) : false };
};
