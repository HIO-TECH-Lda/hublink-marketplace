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

export default function CreateAccountPage() {
  const { dispatch } = useMarketplace();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem');
      return;
    }

    if (!formData.acceptTerms) {
      alert('Você deve aceitar os termos e condições');
      return;
    }

    // Mock user creation
    const mockUser = {
      id: '2',
      firstName: 'Novo',
      lastName: 'Usuário',
      email: formData.email,
      phone: '',
      isSeller: false,
      profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
    };

    dispatch({ type: 'SET_USER', payload: mockUser });
    dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    
    // Show success message
    alert('Conta criada com sucesso!');
    
    // Redirect to dashboard
    router.push('/painel');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />
      
      <div className="container py-16">
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Criar Conta</h1>
            <p className="text-gray-6">Junte-se ao nosso marketplace orgânico</p>
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-7 mb-2">
                Confirmar Senha
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirme sua senha"
                  required
                  className="w-full pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-5 hover:text-gray-7"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, acceptTerms: checked as boolean }))
                }
                className="mt-0.5"
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-7 cursor-pointer leading-5">
                Aceitar todos os{' '}
                <Link href="/termos" className="text-primary hover:text-primary-hard">
                  Termos e Condições
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-hard text-white py-3"
            >
              Criar Conta
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <p className="text-gray-6">
              Já tem uma conta?{' '}
              <Link href="/entrar" className="text-primary hover:text-primary-hard font-medium">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}