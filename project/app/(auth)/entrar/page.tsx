'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const { dispatch } = useMarketplace();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate mock credentials
    const isValidEmail = formData.email === 'cliente@exemplo.com' || formData.email === 'vendedor@exemplo.com';
    const isValidPassword = formData.password === 'qualquer coisa';
    
    if (!isValidEmail || !isValidPassword) {
      setError('Email ou senha incorretos. Use as credenciais de demonstração.');
      return;
    }

    // Create mock user based on email
    const isSeller = formData.email === 'vendedor@exemplo.com';
    
    const mockUser = {
      id: isSeller ? 'seller1' : 'user1',
      firstName: isSeller ? 'Maria' : 'João',
      lastName: isSeller ? 'Santos' : 'Silva',
      email: formData.email,
      phone: '(+258) 99999-9999',
      isSeller: isSeller,
      role: isSeller ? 'seller' as const : 'buyer' as const,
      sellerId: isSeller ? 'seller1' : undefined,
      profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      billingAddress: {
        firstName: isSeller ? 'Maria' : 'João',
        lastName: isSeller ? 'Santos' : 'Silva',
        address: 'Rua das Flores, 123',
        country: 'Brasil',
        state: 'Sofala',
        zipCode: '01234-567',
        email: formData.email,
        phone: '(+258) 99999-9999'
      },
      ...(isSeller && {
        storeSettings: {
          storeName: 'Fazenda Verde',
          storeDescription: 'Produtos orgânicos frescos direto da fazenda',
          storeEmail: 'vendedor@exemplo.com',
          storePhone: '(+258) 99999-9999',
          bankName: 'M-Pesa',
          accountNumber: '12345-6',
          agencyNumber: '0001',
          paymentKey: 'vendedor@exemplo.com',
          paymentMethod: 'M-Pesa'
        }
      })
    };

    dispatch({ type: 'SET_USER', payload: mockUser });
    dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    
    // Redirect based on user type
    if (isSeller) {
      router.push('/vendedor/painel');
    } else {
      router.push('/painel');
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

  const handleDemoLogin = (email: string) => {
    setFormData({
      email: email,
      password: 'qualquer coisa',
      rememberMe: false
    });
    setError('');
  };

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
              className="w-full bg-primary hover:bg-primary-hard text-white py-3"
            >
              Entrar
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
                  onClick={() => handleDemoLogin('cliente@exemplo.com')}
                  className="flex-1 text-xs"
                >
                  Login Cliente
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin('vendedor@exemplo.com')}
                  className="flex-1 text-xs"
                >
                  Login Vendedor
                </Button>
              </div>
              <div className="text-xs text-gray-7 space-y-1">
                <p><strong>Cliente:</strong> cliente@exemplo.com</p>
                <p><strong>Vendedor:</strong> vendedor@exemplo.com</p>
                <p><strong>Senha:</strong> qualquer coisa</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}