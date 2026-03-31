'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

function safeReturnUrl(raw: string | null): string {
  if (!raw || typeof raw !== 'string') return '/';
  const path = raw.startsWith('/') ? raw : `/${raw}`;
  return path.startsWith('/') && !path.startsWith('//') ? path : '/';
}

function getDefaultRouteByRole(role?: string): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'seller':
      return '/vendedor/painel';
    case 'affiliate':
      return '/affiliate/dashboard';
    case 'support':
      return '/suporte/meus-tickets';
    case 'buyer':
    default:
      return '/painel';
  }
}

export default function SignInPage() {
  const { login, loading: authLoading, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = safeReturnUrl(searchParams.get('returnUrl'));
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: 'helton@test.com',
    password: 'H2Furau2711@',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Clear any existing tokens and redirect if already authenticated
  useEffect(() => {
    // Clear any potentially corrupted tokens
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken');
      const refreshToken = localStorage.getItem('refreshToken');
      
      // If we have tokens but auth is not loading, clear them to prevent loops
      if (token && refreshToken && !authLoading) {
        // Only clear if we're on the login page and not authenticated
        if (!isAuthenticated) {
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
        }
      }
    }
    
    if (!authLoading && isAuthenticated) {
      const fallbackRoute = getDefaultRouteByRole(user?.role);
      router.push(returnUrl === '/' ? fallbackRoute : returnUrl);
    }
  }, [isAuthenticated, authLoading, router, returnUrl, user?.role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleDemoLogin = async (email: string) => {
    setFormData({
      email: email,
      password: 'H2Furau2711@',
      rememberMe: false
    });
    setError('');
    setIsLoading(true);

    try {
      await login(email, 'H2Furau2711@');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login com conta de demonstração.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />
      
      <div className="container py-16">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Entrar</h1>
            <p className="text-gray-6">Bem-vindo de volta! Faça login em sua conta</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-7 mb-2">
                E-mail
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Digite seu e-mail"
                required
                className="w-full"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-7 mb-2">
                Senha
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Digite sua senha"
                  required
                  className="w-full pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-5 hover:text-gray-7"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, rememberMe: checked as boolean }))
                  }
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-7 cursor-pointer">
                  Lembrar-me
                </label>
              </div>
              <Link href="/esqueci-senha" className="text-sm text-primary hover:text-primary-hard">
                Esqueceu a Senha?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || authLoading}
              className="w-full bg-primary hover:bg-primary-hard text-white py-3 disabled:opacity-50"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="text-center mt-6">
            <p className="text-gray-6">
              Não tem uma conta?{' '}
              <Link href="/criar-conta" className="text-primary hover:text-primary-hard font-medium">
                Cadastre-se
              </Link>
            </p>
          </div>

          {/* Demo Accounts */}
          <div className="mt-8 p-4 bg-gray-1 rounded-lg">
            <p className="text-sm text-gray-6 mb-3 font-medium">Contas de demonstração:</p>
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isLoading || authLoading}
                  onClick={() => handleDemoLogin('buyer.test@test.com')}
                  className="flex-1 text-xs disabled:opacity-50"
                >
                  {isLoading ? 'Entrando...' : 'Login Cliente'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isLoading || authLoading}
                  onClick={() => handleDemoLogin('vendedor.update@test.com')}
                  className="flex-1 text-xs disabled:opacity-50"
                >
                  {isLoading ? 'Entrando...' : 'Login Vendedor'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isLoading || authLoading}
                  onClick={() => handleDemoLogin('helton@test.com')}
                  className="flex-1 text-xs disabled:opacity-50"
                >
                  {isLoading ? 'Entrando...' : 'Login Admin'}
                </Button>
              </div>
              {/* <div className="text-xs text-gray-7 space-y-1">
                <p><strong>Cliente:</strong> cliente@exemplo.com</p>
                <p><strong>Vendedor:</strong> vendedor@exemplo.com</p>
                <p><strong>Admin:</strong> admin@exemplo.com</p>
                <p><strong>Senha:</strong> H2Furau2711@</p>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}