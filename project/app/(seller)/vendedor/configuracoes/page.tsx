'use client';

import React, { useState } from 'react';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { Save, Store, CreditCard, User, Shield, Bell } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import SellerSidebar from '@/app/(seller)/components/SellerSidebar';
import Link from 'next/link';

export default function SellerSettingsPage() {
  const { state, dispatch } = useMarketplace();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('store');
  
  const [storeData, setStoreData] = useState({
    storeName: state.user?.storeSettings?.storeName || '',
    storeDescription: state.user?.storeSettings?.storeDescription || '',
    storeEmail: state.user?.storeSettings?.storeEmail || '',
    storePhone: state.user?.storeSettings?.storePhone || ''
  });

  const [paymentData, setPaymentData] = useState({
    bankName: state.user?.storeSettings?.bankName || '',
    accountNumber: state.user?.storeSettings?.accountNumber || '',
    agencyNumber: state.user?.storeSettings?.agencyNumber || '',
    pixKey: state.user?.storeSettings?.pixKey || '',
    paymentMethod: state.user?.storeSettings?.paymentMethod || 'M-Pesa'
  });

  const [accountData, setAccountData] = useState({
    firstName: state.user?.firstName || '',
    lastName: state.user?.lastName || '',
    email: state.user?.email || '',
    phone: state.user?.phone || ''
  });

  const [notifications, setNotifications] = useState({
    newOrders: true,
    lowStock: true,
    customerReviews: true,
    paymentReceived: true,
    marketingEmails: false
  });

  const handleStoreChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStoreData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (key: string, checked: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Update user with new settings
      const updatedUser = {
        ...state.user!,
        firstName: accountData.firstName,
        lastName: accountData.lastName,
        email: accountData.email,
        phone: accountData.phone,
        storeSettings: {
          storeName: storeData.storeName,
          storeDescription: storeData.storeDescription,
          storeEmail: storeData.storeEmail,
          storePhone: storeData.storePhone,
          bankName: paymentData.bankName,
          accountNumber: paymentData.accountNumber,
          agencyNumber: paymentData.agencyNumber,
          pixKey: paymentData.pixKey,
          paymentMethod: paymentData.paymentMethod
        }
      };

      dispatch({ type: 'SET_USER', payload: updatedUser });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message (you could add a toast notification here)
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Erro ao salvar configurações. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!state.isAuthenticated || !state.user?.isSeller) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Acesso Negado</h1>
          <p className="text-gray-6 mb-8">Você precisa estar logado como vendedor para acessar esta página.</p>
          <Button className="bg-primary hover:bg-primary-hard text-white">
            Fazer Login
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const tabs = [
    { id: 'store', label: 'Banca', icon: Store },
    { id: 'payment', label: 'Pagamentos', icon: CreditCard },
    { id: 'account', label: 'Conta', icon: User },
    { id: 'notifications', label: 'Notificações', icon: Bell }
  ];

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />
      
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / 
          <Link href="/vendedor/painel" className="hover:text-primary"> Painel do Vendedor</Link> / 
          <span className="text-primary">Configurações</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SellerSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b border-gray-2">
                <nav className="flex overflow-x-auto px-4 sm:px-6">
                  <div className="flex space-x-4 sm:space-x-8 min-w-full">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 whitespace-nowrap flex-shrink-0 ${
                            activeTab === tab.id
                              ? 'border-primary text-primary'
                              : 'border-transparent text-gray-6 hover:text-gray-9'
                          }`}
                        >
                          <Icon size={16} />
                          <span>{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-4 sm:p-6">
                <form onSubmit={handleSubmit}>
                  {/* Store Settings */}
                  {activeTab === 'store' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-9 mb-4">Informações da Banca</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-7 mb-2">
                              Nome da Banca *
                            </label>
                            <Input
                              type="text"
                              name="storeName"
                              value={storeData.storeName}
                              onChange={handleStoreChange}
                              placeholder="Digite o nome da sua loja"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-7 mb-2">
                              Email da Banca *
                            </label>
                            <Input
                              type="email"
                              name="storeEmail"
                              value={storeData.storeEmail}
                              onChange={handleStoreChange}
                              placeholder="Digite o email da loja"
                              required
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-7 mb-2">
                            Telefone da Banca
                          </label>
                          <Input
                            type="tel"
                            name="storePhone"
                            value={storeData.storePhone}
                            onChange={handleStoreChange}
                            placeholder="Digite o telefone da loja"
                          />
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-7 mb-2">
                            Descrição da Banca
                          </label>
                          <Textarea
                            name="storeDescription"
                            value={storeData.storeDescription}
                            onChange={handleStoreChange}
                            placeholder="Descreva sua loja e produtos"
                            rows={4}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Payment Settings */}
                  {activeTab === 'payment' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-9 mb-4">Informações de Pagamento</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-7 mb-2">
                              Nome do Banco
                            </label>
                            <Input
                              type="text"
                              name="bankName"
                              value={paymentData.bankName}
                              onChange={handlePaymentChange}
                              placeholder="Digite o nome do banco"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-7 mb-2">
                              Número da Conta
                            </label>
                            <Input
                              type="text"
                              name="accountNumber"
                              value={paymentData.accountNumber}
                              onChange={handlePaymentChange}
                              placeholder="Digite o número da conta"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-7 mb-2">
                              Número da Agência
                            </label>
                            <Input
                              type="text"
                              name="agencyNumber"
                              value={paymentData.agencyNumber}
                              onChange={handlePaymentChange}
                              placeholder="Digite o número da agência"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-7 mb-2">
                              Chave M-Pesa
                            </label>
                            <Input
                              type="text"
                              name="pixKey"
                              value={paymentData.pixKey}
                              onChange={handlePaymentChange}
                              placeholder="Digite a chave M-Pesa"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-7 mb-2">
                            Método de Pagamento Preferido
                          </label>
                          <select
                            name="paymentMethod"
                            value={paymentData.paymentMethod}
                            onChange={handlePaymentChange}
                            className="w-full px-3 py-2 border border-gray-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          >
                            <option value="M-Pesa">M-Pesa</option>
                            <option value="Transferência Bancária">Transferência Bancária</option>
                            <option value="E-Mola">E-Mola</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Account Settings */}
                  {activeTab === 'account' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-9 mb-4">Informações da Conta</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-7 mb-2">
                              Nome *
                            </label>
                            <Input
                              type="text"
                              name="firstName"
                              value={accountData.firstName}
                              onChange={handleAccountChange}
                              placeholder="Digite seu nome"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-7 mb-2">
                              Sobrenome *
                            </label>
                            <Input
                              type="text"
                              name="lastName"
                              value={accountData.lastName}
                              onChange={handleAccountChange}
                              placeholder="Digite seu sobrenome"
                              required
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-7 mb-2">
                              Email *
                            </label>
                            <Input
                              type="email"
                              name="email"
                              value={accountData.email}
                              onChange={handleAccountChange}
                              placeholder="Digite seu email"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-7 mb-2">
                              Telefone
                            </label>
                            <Input
                              type="tel"
                              name="phone"
                              value={accountData.phone}
                              onChange={handleAccountChange}
                              placeholder="Digite seu telefone"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Notification Settings */}
                  {activeTab === 'notifications' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-9 mb-4">Preferências de Notificação</h3>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="newOrders"
                              checked={notifications.newOrders}
                              onCheckedChange={(checked) => handleNotificationChange('newOrders', checked as boolean)}
                            />
                            <label htmlFor="newOrders" className="text-sm text-gray-7 cursor-pointer">
                              Novos pedidos
                            </label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="lowStock"
                              checked={notifications.lowStock}
                              onCheckedChange={(checked) => handleNotificationChange('lowStock', checked as boolean)}
                            />
                            <label htmlFor="lowStock" className="text-sm text-gray-7 cursor-pointer">
                              Produtos com estoque baixo
                            </label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="customerReviews"
                              checked={notifications.customerReviews}
                              onCheckedChange={(checked) => handleNotificationChange('customerReviews', checked as boolean)}
                            />
                            <label htmlFor="customerReviews" className="text-sm text-gray-7 cursor-pointer">
                              Novas avaliações de clientes
                            </label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="paymentReceived"
                              checked={notifications.paymentReceived}
                              onCheckedChange={(checked) => handleNotificationChange('paymentReceived', checked as boolean)}
                            />
                            <label htmlFor="paymentReceived" className="text-sm text-gray-7 cursor-pointer">
                              Pagamentos recebidos
                            </label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id="marketingEmails"
                              checked={notifications.marketingEmails}
                              onCheckedChange={(checked) => handleNotificationChange('marketingEmails', checked as boolean)}
                            />
                            <label htmlFor="marketingEmails" className="text-sm text-gray-7 cursor-pointer">
                              Emails de marketing e promoções
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-end mt-8 pt-6 border-t border-gray-2">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary hover:bg-primary-hard text-white px-6 py-2 flex items-center space-x-2"
                    >
                      <Save size={16} />
                      <span>{isSubmitting ? 'Salvando...' : 'Salvar Configurações'}</span>
                    </Button>
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