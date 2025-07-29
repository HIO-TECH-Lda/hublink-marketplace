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
    paymentMethod: state.user?.storeSettings?.paymentMethod || 'PIX'
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
    { id: 'store', label: 'Loja', icon: Store },
    { id: 'payment', label: 'Pagamentos', icon: CreditCard },
    { id: 'account', label: 'Conta', icon: User },
    { id: 'notifications', label: 'Notificações', icon: Bell }
  ];

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />
      
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SellerSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Header */}
            <div className="mb-6">
              <nav className="text-sm text-gray-6 mb-2">
                <span className="text-primary">Configurações</span>
              </nav>
              <h1 className="text-2xl font-bold text-gray-9">Configurações da Loja</h1>
              <p className="text-gray-6 mt-2">Gerencie as configurações da sua loja e conta</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="border-b border-gray-2">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
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
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                <form onSubmit={handleSubmit}>
                  {/* Store Settings */}
                  {activeTab === 'store' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-9 mb-4">Informações da Loja</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-7 mb-2">
                              Nome da Loja *
                            </label>
                            <Input
                              type="text"
                              name="storeName"
                              value={storeData.storeName}
                              onChange={handleStoreChange}
                              placeholder="Ex: Fazenda Verde"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-7 mb-2">
                              Email da Loja *
                            </label>
                            <Input
                              type="email"
                              name="storeEmail"
                              value={storeData.storeEmail}
                              onChange={handleStoreChange}
                              placeholder="loja@exemplo.com"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-7 mb-2">
                              Telefone da Loja
                            </label>
                            <Input
                              type="tel"
                              name="storePhone"
                              value={storeData.storePhone}
                              onChange={handleStoreChange}
                              placeholder="(11) 99999-9999"
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-7 mb-2">
                            Descrição da Loja
                          </label>
                          <Textarea
                            name="storeDescription"
                            value={storeData.storeDescription}
                            onChange={handleStoreChange}
                            placeholder="Descreva sua loja..."
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
                        <h3 className="text-lg font-semibold text-gray-9 mb-4">Configurações de Pagamento</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-7 mb-2">
                              Banco
                            </label>
                            <Input
                              type="text"
                              name="bankName"
                              value={paymentData.bankName}
                              onChange={handlePaymentChange}
                              placeholder="Ex: Banco do Brasil"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-7 mb-2">
                              Método de Pagamento
                            </label>
                            <select
                              name="paymentMethod"
                              value={paymentData.paymentMethod}
                              onChange={handlePaymentChange}
                              className="w-full px-3 py-2 border border-gray-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                              <option value="PIX">PIX</option>
                              <option value="Transferência">Transferência Bancária</option>
                              <option value="Boleto">Boleto</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-7 mb-2">
                              Agência
                            </label>
                            <Input
                              type="text"
                              name="agencyNumber"
                              value={paymentData.agencyNumber}
                              onChange={handlePaymentChange}
                              placeholder="Ex: 0001"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-7 mb-2">
                              Conta
                            </label>
                            <Input
                              type="text"
                              name="accountNumber"
                              value={paymentData.accountNumber}
                              onChange={handlePaymentChange}
                              placeholder="Ex: 12345-6"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-7 mb-2">
                              Chave PIX
                            </label>
                            <Input
                              type="text"
                              name="pixKey"
                              value={paymentData.pixKey}
                              onChange={handlePaymentChange}
                              placeholder="Ex: vendedor@exemplo.com"
                            />
                          </div>
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
                              placeholder="Seu nome"
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
                              placeholder="Seu sobrenome"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-7 mb-2">
                              Email *
                            </label>
                            <Input
                              type="email"
                              name="email"
                              value={accountData.email}
                              onChange={handleAccountChange}
                              placeholder="seu@email.com"
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
                              placeholder="(11) 99999-9999"
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
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-9">Novos Pedidos</h4>
                              <p className="text-sm text-gray-6">Receber notificações quando houver novos pedidos</p>
                            </div>
                            <Checkbox
                              checked={notifications.newOrders}
                              onCheckedChange={(checked) => handleNotificationChange('newOrders', checked as boolean)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-9">Estoque Baixo</h4>
                              <p className="text-sm text-gray-6">Alertas quando produtos estiverem com estoque baixo</p>
                            </div>
                            <Checkbox
                              checked={notifications.lowStock}
                              onCheckedChange={(checked) => handleNotificationChange('lowStock', checked as boolean)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-9">Avaliações de Clientes</h4>
                              <p className="text-sm text-gray-6">Notificações sobre novas avaliações</p>
                            </div>
                            <Checkbox
                              checked={notifications.customerReviews}
                              onCheckedChange={(checked) => handleNotificationChange('customerReviews', checked as boolean)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-9">Pagamentos Recebidos</h4>
                              <p className="text-sm text-gray-6">Confirmações de pagamentos recebidos</p>
                            </div>
                            <Checkbox
                              checked={notifications.paymentReceived}
                              onCheckedChange={(checked) => handleNotificationChange('paymentReceived', checked as boolean)}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-9">Emails de Marketing</h4>
                              <p className="text-sm text-gray-6">Receber emails promocionais e novidades</p>
                            </div>
                            <Checkbox
                              checked={notifications.marketingEmails}
                              onCheckedChange={(checked) => handleNotificationChange('marketingEmails', checked as boolean)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex justify-end pt-6 border-t border-gray-2 mt-6">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-primary hover:bg-primary-hard text-white flex items-center"
                    >
                      <Save size={16} className="mr-2" />
                      {isSubmitting ? 'Salvando...' : 'Salvar Configurações'}
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