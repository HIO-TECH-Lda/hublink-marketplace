'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function CreateAccountPage() {
  const { register, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/painel');
    }
  }, [isAuthenticated, authLoading, router]);

  const validate = () => {
    if (!formData.firstName.trim() || formData.firstName.trim().length < 2) {
      return 'O primeiro nome deve ter pelo menos 2 caracteres';
    }
    if (!formData.lastName.trim() || formData.lastName.trim().length < 2) {
      return 'O apelido deve ter pelo menos 2 caracteres';
    }

    const cleanPhone = formData.phone.trim().replace(/[\s-]/g, '');
    const phoneRegex = /^(\+258|258)?[0-9]{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      return 'Insira um número moçambicano válido (ex: 847554622 ou +258847554622)';
    }

    const emailTrimmed = formData.email.trim();
    if (emailTrimmed) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailTrimmed)) {
        return 'Insira um email válido';
      }
    }

    if (formData.password.length < 8) {
      return 'A palavra-passe deve ter pelo menos 8 caracteres';
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/;
    if (!passwordRegex.test(formData.password)) {
      return 'A palavra-passe deve conter maiúscula, minúscula, número e símbolo';
    }

    if (formData.password !== formData.confirmPassword) {
      return 'As palavras-passe não coincidem';
    }

    if (!formData.acceptTerms) {
      return 'Deve aceitar os Termos de Utilização';
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const cleanPhone = formData.phone.trim().replace(/[\s-]/g, '');
      const emailTrimmed = formData.email.trim();

      await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: cleanPhone,
        ...(emailTrimmed ? { email: emailTrimmed } : {}),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: 'buyer'
      });

      router.push('/painel');
    } catch (err: any) {
      setError(err.message || 'Falha ao criar conta. Verifique os dados e tente novamente.');
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
    if (error) setError('');
  };

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
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Criar Conta</h1>
            <p className="text-gray-6">Junte-se ao marketplace local Txova</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-7 mb-2">
                  Nome *
                </label>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Seu nome"
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-7 mb-2">
                  Apelido *
                </label>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Seu apelido"
                  required
                  className="w-full"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-7 mb-2">
                Telefone *
              </label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="ex: 847554622 ou +258847554622"
                required
                className="w-full"
              />
              <p className="text-xs text-gray-5 mt-1">
                Número moçambicano obrigatório (com ou sem indicativo +258)
              </p>
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-7 mb-2">
                Email (Opcional)
              </label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="ex: joao@exemplo.com"
                className="w-full"
              />
              <p className="text-xs text-gray-5 mt-1">
                Pode adicionar ou atualizar o email mais tarde no seu perfil
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-7 mb-2">
                Palavra-passe *
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Introduza a sua palavra-passe"
                  required
                  minLength={8}
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
              <p className="text-xs text-gray-5 mt-1">
                Mínimo 8 caracteres, com maiúscula, minúscula, número e símbolo (ex: #, _, !, @)
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-7 mb-2">
                Confirmar Palavra-passe *
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirme a sua palavra-passe"
                  required
                  minLength={8}
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

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-2 pt-2">
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
                Aceito os{' '}
                <Link href="/termos" className="text-primary hover:text-primary-hard">
                  Termos de Utilização
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || authLoading}
              className="w-full bg-primary hover:bg-primary-hard text-white py-3 disabled:opacity-50"
            >
              {isLoading ? 'A criar conta...' : 'Criar Conta'}
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

          {/* Become a Seller */}
          <div className="mt-8 p-4 bg-primary-lighter border border-primary/20 rounded-lg">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-primary-hard mb-2">
                Quer vender os seus produtos?
              </h3>
              <p className="text-sm text-primary mb-4">
                Junte-se aos nossos vendedores e comece a divulgar produtos e serviços na plataforma
              </p>
              <Link href="/seja-vendedor">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-primary/30 text-primary hover:bg-primary-lighter hover:text-primary-hard"
                >
                  Seja Vendedor no Txova
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}