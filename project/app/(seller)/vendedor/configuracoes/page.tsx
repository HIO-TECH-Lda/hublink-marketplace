'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateProfile, useChangePassword } from '@/hooks/useProfile';
import { Save, Store, User, MapPin, Lock, Bell } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import SellerSidebar from '@/app/(seller)/components/SellerSidebar';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function SellerSettingsPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('store');

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Moçambique',
      isDefault: true,
    },
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'Moçambique',
      isDefault: true,
    },
    preferences: {
      language: 'pt',
      currency: 'MZN',
      notifications: {
        email: true,
        sms: true,
        push: true,
      },
    },
    sellerProfile: {
      storeName: '',
      storeDescription: '',
      address: '',
      city: '',
      province: '',
      postalCode: '',
      productTypes: '',
      experience: '',
    },
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        billingAddress: {
          street: user.billingAddress?.street || user.billingAddress?.address || '',
          city: user.billingAddress?.city || '',
          state: user.billingAddress?.state || '',
          postalCode: user.billingAddress?.postalCode || user.billingAddress?.zipCode || '',
          country: user.billingAddress?.country || 'Moçambique',
          isDefault: user.billingAddress?.isDefault ?? true,
        },
        shippingAddress: {
          street: user.shippingAddress?.street || user.shippingAddress?.address || '',
          city: user.shippingAddress?.city || '',
          state: user.shippingAddress?.state || '',
          postalCode: user.shippingAddress?.postalCode || user.shippingAddress?.zipCode || '',
          country: user.shippingAddress?.country || 'Moçambique',
          isDefault: user.shippingAddress?.isDefault ?? true,
        },
        preferences: {
          language: user.preferences?.language || 'pt',
          currency: user.preferences?.currency || 'MZN',
          notifications: {
            email: user.preferences?.notifications?.email ?? true,
            sms: user.preferences?.notifications?.sms ?? true,
            push: user.preferences?.notifications?.push ?? true,
          },
        },
        sellerProfile: {
          storeName: user.sellerProfile?.storeName || '',
          storeDescription: user.sellerProfile?.storeDescription || '',
          address: user.sellerProfile?.address || '',
          city: user.sellerProfile?.city || '',
          province: user.sellerProfile?.province || '',
          postalCode: user.sellerProfile?.postalCode || '',
          productTypes: user.sellerProfile?.productTypes || '',
          experience: user.sellerProfile?.experience || '',
        },
      });
    }
  }, [user]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(profileForm);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      toast({
        title: 'Erro',
        description: 'As palavras-passe não coincidem.',
        variant: 'destructive',
      });
      return;
    }
    changePassword.mutate(passwordForm);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-gray-6">Verificando autenticação...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'seller') {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Acesso Negado</h1>
          <p className="text-gray-6 mb-8">Você precisa estar logado como vendedor para acessar esta página.</p>
          <Link href="/entrar">
            <Button className="bg-primary hover:bg-primary-hard text-white">Fazer Login</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const tabs = [
    { id: 'store', label: 'Banca', icon: Store },
    { id: 'account', label: 'Conta', icon: User },
    { id: 'addresses', label: 'Endereços', icon: MapPin },
    { id: 'preferences', label: 'Preferências', icon: Bell },
    { id: 'password', label: 'Palavra-passe', icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />
      
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / 
          <Link href="/vendedor/painel" className="hover:text-primary"> Painel do Vendedor</Link> / 
          <span className="text-primary">Configurações</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <SellerSidebar />
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
              <h1 className="text-2xl font-bold text-gray-9 mb-2">Configurações do Vendedor</h1>
              <p className="text-gray-6 text-sm">Actualize aqui as informações da sua banca, dados da conta, endereços, preferências e palavra-passe.</p>
            </div>
            <div className="bg-white rounded-lg shadow-sm">
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

              <div className="p-4 sm:p-6">
                {/* Store Profile */}
                {activeTab === 'store' && (
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-9 mb-4">Informações da Banca</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-7 mb-2">Nome da Banca *</label>
                        <Input
                          value={profileForm.sellerProfile.storeName}
                          onChange={(e) => setProfileForm({
                            ...profileForm,
                            sellerProfile: { ...profileForm.sellerProfile, storeName: e.target.value }
                          })}
                          placeholder="Nome da sua banca"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-7 mb-2">Cidade *</label>
                        <Input
                          value={profileForm.sellerProfile.city}
                          onChange={(e) => setProfileForm({
                            ...profileForm,
                            sellerProfile: { ...profileForm.sellerProfile, city: e.target.value }
                          })}
                          placeholder="Cidade"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-7 mb-2">Província *</label>
                        <Input
                          value={profileForm.sellerProfile.province}
                          onChange={(e) => setProfileForm({
                            ...profileForm,
                            sellerProfile: { ...profileForm.sellerProfile, province: e.target.value }
                          })}
                          placeholder="Província"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-7 mb-2">Código Postal *</label>
                        <Input
                          value={profileForm.sellerProfile.postalCode}
                          onChange={(e) => setProfileForm({
                            ...profileForm,
                            sellerProfile: { ...profileForm.sellerProfile, postalCode: e.target.value }
                          })}
                          placeholder="Código Postal"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-7 mb-2">Endereço *</label>
                      <Input
                        value={profileForm.sellerProfile.address}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          sellerProfile: { ...profileForm.sellerProfile, address: e.target.value }
                        })}
                        placeholder="Endereço completo"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-7 mb-2">Tipos de Produtos *</label>
                      <Input
                        value={profileForm.sellerProfile.productTypes}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          sellerProfile: { ...profileForm.sellerProfile, productTypes: e.target.value }
                        })}
                        placeholder="Ex: Hortaliças, Frutas, Legumes"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-7 mb-2">Descrição da Banca</label>
                      <Textarea
                        value={profileForm.sellerProfile.storeDescription}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          sellerProfile: { ...profileForm.sellerProfile, storeDescription: e.target.value }
                        })}
                        placeholder="Descreva sua banca e produtos"
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-7 mb-2">Experiência</label>
                      <Textarea
                        value={profileForm.sellerProfile.experience}
                        onChange={(e) => setProfileForm({
                          ...profileForm,
                          sellerProfile: { ...profileForm.sellerProfile, experience: e.target.value }
                        })}
                        placeholder="Sua experiência no ramo"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end pt-4 border-t border-gray-2">
                      <Button type="submit" disabled={updateProfile.isPending}>
                        <Save size={16} className="mr-2" />
                        {updateProfile.isPending ? 'A guardar...' : 'Guardar Alterações'}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Account */}
                {activeTab === 'account' && (
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-9 mb-2">Informações da Conta</h3>
                    <p className="text-sm text-gray-6 mb-4">Actualize os seus dados pessoais e contactos associados à sua conta de vendedor no Txova.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-7 mb-2">Nome *</label>
                        <Input
                          value={profileForm.firstName}
                          onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                          required
                          minLength={2}
                          maxLength={50}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-7 mb-2">Apelido *</label>
                        <Input
                          value={profileForm.lastName}
                          onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                          required
                          minLength={2}
                          maxLength={50}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-7 mb-2">Telefone *</label>
                      <Input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="+258XXXXXXXXX"
                        pattern="^\+258[0-9]{9}$"
                        required
                      />
                    </div>
                    <div className="flex justify-end pt-4 border-t border-gray-2">
                      <Button type="submit" disabled={updateProfile.isPending}>
                        <Save size={16} className="mr-2" />
                        {updateProfile.isPending ? 'A guardar...' : 'Guardar Alterações'}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Addresses */}
                {activeTab === 'addresses' && (
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-9 mb-2">Endereços</h3>
                    <p className="text-sm text-gray-6 mb-4">Actualize os endereços associados à sua conta. Estes dados ajudam a facilitar a facturação, a entrega de pedidos e a localização da sua banca quando necessário.</p>
                    
                    <div>
                      <h4 className="text-md font-medium text-gray-9 mb-3">Endereço de Facturação</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-7 mb-2">Rua / Endereço *</label>
                          <Input
                            value={profileForm.billingAddress.street}
                            onChange={(e) => setProfileForm({
                              ...profileForm,
                              billingAddress: { ...profileForm.billingAddress, street: e.target.value }
                            })}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-7 mb-2">Cidade *</label>
                          <Input
                            value={profileForm.billingAddress.city}
                            onChange={(e) => setProfileForm({
                              ...profileForm,
                              billingAddress: { ...profileForm.billingAddress, city: e.target.value }
                            })}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-7 mb-2">Província *</label>
                          <Input
                            value={profileForm.billingAddress.state}
                            onChange={(e) => setProfileForm({
                              ...profileForm,
                              billingAddress: { ...profileForm.billingAddress, state: e.target.value }
                            })}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-7 mb-2">Código Postal *</label>
                          <Input
                            value={profileForm.billingAddress.postalCode}
                            onChange={(e) => setProfileForm({
                              ...profileForm,
                              billingAddress: { ...profileForm.billingAddress, postalCode: e.target.value }
                            })}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-7 mb-2">País *</label>
                          <Input
                            value={profileForm.billingAddress.country}
                            onChange={(e) => setProfileForm({
                              ...profileForm,
                              billingAddress: { ...profileForm.billingAddress, country: e.target.value }
                            })}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-9 mb-3">Endereço de Entrega</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-7 mb-2">Rua / Endereço *</label>
                          <Input
                            value={profileForm.shippingAddress.street}
                            onChange={(e) => setProfileForm({
                              ...profileForm,
                              shippingAddress: { ...profileForm.shippingAddress, street: e.target.value }
                            })}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-7 mb-2">Cidade *</label>
                          <Input
                            value={profileForm.shippingAddress.city}
                            onChange={(e) => setProfileForm({
                              ...profileForm,
                              shippingAddress: { ...profileForm.shippingAddress, city: e.target.value }
                            })}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-7 mb-2">Província *</label>
                          <Input
                            value={profileForm.shippingAddress.state}
                            onChange={(e) => setProfileForm({
                              ...profileForm,
                              shippingAddress: { ...profileForm.shippingAddress, state: e.target.value }
                            })}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-7 mb-2">Código Postal *</label>
                          <Input
                            value={profileForm.shippingAddress.postalCode}
                            onChange={(e) => setProfileForm({
                              ...profileForm,
                              shippingAddress: { ...profileForm.shippingAddress, postalCode: e.target.value }
                            })}
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-7 mb-2">País *</label>
                          <Input
                            value={profileForm.shippingAddress.country}
                            onChange={(e) => setProfileForm({
                              ...profileForm,
                              shippingAddress: { ...profileForm.shippingAddress, country: e.target.value }
                            })}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-gray-2">
                      <Button type="submit" disabled={updateProfile.isPending}>
                        <Save size={16} className="mr-2" />
                        {updateProfile.isPending ? 'A guardar...' : 'Guardar Alterações'}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Preferences */}
                {activeTab === 'preferences' && (
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-9 mb-4">Preferências</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-7 mb-2">Idioma</label>
                        <select
                          value={profileForm.preferences.language}
                          onChange={(e) => setProfileForm({
                            ...profileForm,
                            preferences: { ...profileForm.preferences, language: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="pt">Português</option>
                          <option value="en">English</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-7 mb-2">Moeda</label>
                        <select
                          value={profileForm.preferences.currency}
                          onChange={(e) => setProfileForm({
                            ...profileForm,
                            preferences: { ...profileForm.preferences, currency: e.target.value }
                          })}
                          className="w-full px-3 py-2 border border-gray-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="MZN">MZN (Metical)</option>
                          <option value="USD">USD (Dollar)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-md font-medium text-gray-9 mb-3">Notificações</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="email"
                            checked={profileForm.preferences.notifications.email}
                            onCheckedChange={(checked) => setProfileForm({
                              ...profileForm,
                              preferences: {
                                ...profileForm.preferences,
                                notifications: { ...profileForm.preferences.notifications, email: checked as boolean }
                              }
                            })}
                          />
                          <label htmlFor="email" className="text-sm text-gray-7 cursor-pointer">Email</label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="sms"
                            checked={profileForm.preferences.notifications.sms}
                            onCheckedChange={(checked) => setProfileForm({
                              ...profileForm,
                              preferences: {
                                ...profileForm.preferences,
                                notifications: { ...profileForm.preferences.notifications, sms: checked as boolean }
                              }
                            })}
                          />
                          <label htmlFor="sms" className="text-sm text-gray-7 cursor-pointer">SMS</label>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id="push"
                            checked={profileForm.preferences.notifications.push}
                            onCheckedChange={(checked) => setProfileForm({
                              ...profileForm,
                              preferences: {
                                ...profileForm.preferences,
                                notifications: { ...profileForm.preferences.notifications, push: checked as boolean }
                              }
                            })}
                          />
                          <label htmlFor="push" className="text-sm text-gray-7 cursor-pointer">Push</label>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-gray-2">
                      <Button type="submit" disabled={updateProfile.isPending}>
                        <Save size={16} className="mr-2" />
                        {updateProfile.isPending ? 'A guardar...' : 'Guardar Alterações'}
                      </Button>
                    </div>
                  </form>
                )}

                {/* Password */}
                {activeTab === 'password' && (
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-9 mb-4">Alterar Palavra-passe</h3>
                    <p className="text-sm text-gray-6 mb-4">Actualize a sua palavra-passe para manter a conta segura.</p>
                    <div>
                      <label className="block text-sm font-medium text-gray-7 mb-2">Palavra-passe Actual *</label>
                      <Input
                        type="password"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-7 mb-2">Nova Palavra-passe *</label>
                      <Input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        required
                        minLength={8}
                        pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]"
                      />
                      <p className="text-xs text-gray-5 mt-1">
                        A nova palavra-passe deve ter, no mínimo, 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula, um número e um carácter especial.
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-7 mb-2">Confirmar Nova Palavra-passe *</label>
                      <Input
                        type="password"
                        value={passwordForm.confirmNewPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
                        required
                      />
                    </div>
                    <div className="flex justify-end pt-4 border-t border-gray-2">
                      <Button type="submit" disabled={changePassword.isPending}>
                        <Lock size={16} className="mr-2" />
                        {changePassword.isPending ? 'A alterar...' : 'Alterar Palavra-passe'}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
