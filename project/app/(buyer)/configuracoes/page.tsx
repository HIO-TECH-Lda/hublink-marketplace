'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { ArrowLeft, User, MapPin, Lock, Eye, EyeOff, Camera } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BuyerSidebar from '../components/BuyerSidebar';

export default function SettingsPage() {
  const { state, dispatch } = useMarketplace();
  const { user } = state;

  if (!state.isAuthenticated || !state.user) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Acesso Negado</h1>
          <p className="text-gray-6 mb-8">Você precisa estar logado para acessar esta página.</p>
          <Link href="/entrar">
            <Button className="bg-primary hover:bg-primary-hard text-white">
              Fazer Login
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [accountForm, setAccountForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [billingForm, setBillingForm] = useState({
    firstName: user?.billingAddress?.firstName || '',
    lastName: user?.billingAddress?.lastName || '',
    company: user?.billingAddress?.company || '',
    address: user?.billingAddress?.address || '',
    country: user?.billingAddress?.country || '',
    state: user?.billingAddress?.state || '',
    zipCode: user?.billingAddress?.zipCode || '',
    email: user?.billingAddress?.email || '',
    phone: user?.billingAddress?.phone || '',
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate saving account settings
    console.log('Saving account settings:', accountForm);
    alert('Configurações da conta salvas com sucesso!');
  };

  const handleBillingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate saving billing address
    console.log('Saving billing address:', billingForm);
    alert('Endereço de faturamento salvo com sucesso!');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }
    // Simulate password change
    console.log('Changing password:', passwordForm);
    alert('Senha alterada com sucesso!');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / 
          <Link href="/painel" className="hover:text-primary"> Meu Painel</Link> / 
          <span className="text-primary">Configurações</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <BuyerSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Account Settings */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-400 mr-3" />
                  <h2 className="text-lg font-semibold text-gray-900">Configurações da Conta</h2>
                </div>
              </div>
              <div className="p-6">
                <form onSubmit={handleAccountSubmit} className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <img 
                        src={user?.profileImage || 'https://placehold.co/100x100/cccccc/000000?text=User'} 
                        alt="Profile" 
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <button 
                        type="button"
                        className="absolute bottom-0 right-0 bg-green-600 text-white p-1 rounded-full hover:bg-green-700"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Foto do Perfil</h3>
                      <p className="text-sm text-gray-500">JPG, PNG ou GIF. Máximo 2MB.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primeiro Nome
                      </label>
                      <input
                        type="text"
                        value={accountForm.firstName}
                        onChange={(e) => setAccountForm({...accountForm, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sobrenome
                      </label>
                      <input
                        type="text"
                        value={accountForm.lastName}
                        onChange={(e) => setAccountForm({...accountForm, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-mail
                      </label>
                      <input
                        type="email"
                        value={accountForm.email}
                        onChange={(e) => setAccountForm({...accountForm, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Telefone
                      </label>
                      <input
                        type="tel"
                        value={accountForm.phone}
                        onChange={(e) => setAccountForm({...accountForm, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Salvar Alterações
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <h2 className="text-lg font-semibold text-gray-900">Endereço de Faturamento</h2>
                </div>
              </div>
              <div className="p-6">
                <form onSubmit={handleBillingSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primeiro Nome
                      </label>
                      <input
                        type="text"
                        value={billingForm.firstName}
                        onChange={(e) => setBillingForm({...billingForm, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sobrenome
                      </label>
                      <input
                        type="text"
                        value={billingForm.lastName}
                        onChange={(e) => setBillingForm({...billingForm, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nome da Empresa (Opcional)
                      </label>
                      <input
                        type="text"
                        value={billingForm.company}
                        onChange={(e) => setBillingForm({...billingForm, company: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Endereço
                      </label>
                      <input
                        type="text"
                        value={billingForm.address}
                        onChange={(e) => setBillingForm({...billingForm, address: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        País/Região
                      </label>
                      <input
                        type="text"
                        value={billingForm.country}
                        onChange={(e) => setBillingForm({...billingForm, country: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Província
                      </label>
                      <input
                        type="text"
                        value={billingForm.state}
                        onChange={(e) => setBillingForm({...billingForm, state: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        ZIP
                      </label>
                      <input
                        type="text"
                        value={billingForm.zipCode}
                        onChange={(e) => setBillingForm({...billingForm, zipCode: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-mail
                      </label>
                      <input
                        type="email"
                        value={billingForm.email}
                        onChange={(e) => setBillingForm({...billingForm, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Telefone
                      </label>
                      <input
                        type="tel"
                        value={billingForm.phone}
                        onChange={(e) => setBillingForm({...billingForm, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Salvar Alterações
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <Lock className="w-5 h-5 text-gray-400 mr-3" />
                  <h2 className="text-lg font-semibold text-gray-900">Alterar Senha</h2>
                </div>
              </div>
              <div className="p-6">
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Senha Atual
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nova Senha
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmar Nova Senha
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Alterar Senha
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 