'use client';

import React, { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUpdateProfile, useChangePassword } from '@/hooks/useProfile';
import { User, MapPin, Lock, Eye, EyeOff, Camera } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BuyerSidebar from '../components/BuyerSidebar';
import { useToast } from '@/hooks/use-toast';

const MAX_AVATAR_MB = 2;
const MAX_AVATAR_BYTES = MAX_AVATAR_MB * 1024 * 1024;

export default function SettingsPage() {
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const { toast } = useToast();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

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
  });

  // Update form when user data is available
  React.useEffect(() => {
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
          isDefault: user.billingAddress?.isDefault || true,
        },
        shippingAddress: {
          street: user.shippingAddress?.street || user.shippingAddress?.address || '',
          city: user.shippingAddress?.city || '',
          state: user.shippingAddress?.state || '',
          postalCode: user.shippingAddress?.postalCode || user.shippingAddress?.zipCode || '',
          country: user.shippingAddress?.country || 'Moçambique',
          isDefault: user.shippingAddress?.isDefault || true,
        },
        preferences: {
          language: user.preferences?.language || 'pt',
          currency: user.preferences?.currency || 'MZN',
          notifications: {
            email: user.preferences?.notifications?.email || true,
            sms: user.preferences?.notifications?.sms || true,
            push: user.preferences?.notifications?.push || true,
          },
        },
      });
    }
  }, [user]);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Formato inválido', description: 'Use JPG, PNG ou GIF.', variant: 'destructive' });
      return;
    }
    if (file.size > MAX_AVATAR_BYTES) {
      toast({ title: 'Arquivo grande', description: `Máximo ${MAX_AVATAR_MB}MB.`, variant: 'destructive' });
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (avatarFile) {
      const formData = new FormData();
      formData.append('firstName', profileForm.firstName);
      formData.append('lastName', profileForm.lastName);
      formData.append('phone', profileForm.phone);
      formData.append('avatar', avatarFile);
      formData.append('billingAddress', JSON.stringify(profileForm.billingAddress));
      formData.append('shippingAddress', JSON.stringify(profileForm.shippingAddress));
      formData.append('preferences', JSON.stringify(profileForm.preferences));
      updateProfile.mutate(formData as any);
      setAvatarFile(null);
      setAvatarPreview(null);
    } else {
      updateProfile.mutate(profileForm);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      alert('As palavras-passe não coincidem!');
      return;
    }
    changePassword.mutate(passwordForm);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / 
          <Link href="/painel" className="hover:text-primary"> O Meu Painel</Link> / 
          <span className="text-primary">Configurações</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <BuyerSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-xl font-bold text-gray-900 mb-2">Configurações da Conta</h1>
              <p className="text-gray-600 text-sm">Actualize os seus dados pessoais, moradas, preferências de notificação e palavra-passe.</p>
            </div>

            {/* Profile Settings */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-400 mr-3" />
                  <h2 className="text-lg font-semibold text-gray-900">Informações Pessoais</h2>
                </div>
              </div>
              <div className="p-6">
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <input
                        ref={avatarInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/gif"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                      <img
                        src={avatarPreview || user?.avatar || user?.profileImage || 'https://placehold.co/100x100/cccccc/000000?text=User'}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-1.5 rounded-full hover:bg-primary-hard shadow"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Foto de Perfil</h3>
                      <p className="text-sm text-gray-500">Carregue uma fotografia para personalizar a sua conta. Formatos permitidos: JPG, PNG ou GIF. Tamanho máximo: 2 MB.</p>
                      {avatarFile && <p className="text-xs text-primary mt-1">{avatarFile.name} — clique em Guardar Alterações para enviar</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primeiro Nome
                      </label>
                      <input
                        type="text"
                        value={profileForm.firstName}
                        onChange={(e) => setProfileForm({...profileForm, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                        minLength={2}
                        maxLength={50}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apelido
                      </label>
                      <input
                        type="text"
                        value={profileForm.lastName}
                        onChange={(e) => setProfileForm({...profileForm, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                        minLength={2}
                        maxLength={50}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Número de Telefone
                      </label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="+258XXXXXXXXX"
                        pattern="^\+258[0-9]{9}$"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={updateProfile.isPending}
                    >
                      {updateProfile.isPending ? 'A guardar...' : 'Guardar Alterações'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>


            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <h2 className="text-lg font-semibold text-gray-900">Endereço de Entrega</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rua / Endereço
                      </label>
                      <input
                        type="text"
                        value={profileForm.shippingAddress.street}
                        onChange={(e) => setProfileForm({
                          ...profileForm, 
                          shippingAddress: {...profileForm.shippingAddress, street: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cidade
                      </label>
                      <input
                        type="text"
                        value={profileForm.shippingAddress.city}
                        onChange={(e) => setProfileForm({
                          ...profileForm, 
                          shippingAddress: {...profileForm.shippingAddress, city: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Província
                      </label>
                      <input
                        type="text"
                        value={profileForm.shippingAddress.state}
                        onChange={(e) => setProfileForm({
                          ...profileForm, 
                          shippingAddress: {...profileForm.shippingAddress, state: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        value={profileForm.shippingAddress.postalCode}
                        onChange={(e) => setProfileForm({
                          ...profileForm, 
                          shippingAddress: {...profileForm.shippingAddress, postalCode: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        País
                      </label>
                      <input
                        type="text"
                        value={profileForm.shippingAddress.country}
                        onChange={(e) => setProfileForm({
                          ...profileForm, 
                          shippingAddress: {...profileForm.shippingAddress, country: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="shippingDefault"
                        checked={profileForm.shippingAddress.isDefault}
                        onChange={(e) => setProfileForm({
                          ...profileForm, 
                          shippingAddress: {...profileForm.shippingAddress, isDefault: e.target.checked}
                        })}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <label htmlFor="shippingDefault" className="ml-2 text-sm font-medium text-gray-700">
                        Definir como endereço padrão de entrega
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {/* Billing Address */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <h2 className="text-lg font-semibold text-gray-900">Endereço de Facturação</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rua / Endereço
                      </label>
                      <input
                        type="text"
                        value={profileForm.billingAddress.street}
                        onChange={(e) => setProfileForm({
                          ...profileForm, 
                          billingAddress: {...profileForm.billingAddress, street: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cidade
                      </label>
                      <input
                        type="text"
                        value={profileForm.billingAddress.city}
                        onChange={(e) => setProfileForm({
                          ...profileForm, 
                          billingAddress: {...profileForm.billingAddress, city: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Província
                      </label>
                      <input
                        type="text"
                        value={profileForm.billingAddress.state}
                        onChange={(e) => setProfileForm({
                          ...profileForm, 
                          billingAddress: {...profileForm.billingAddress, state: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        value={profileForm.billingAddress.postalCode}
                        onChange={(e) => setProfileForm({
                          ...profileForm, 
                          billingAddress: {...profileForm.billingAddress, postalCode: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        País
                      </label>
                      <input
                        type="text"
                        value={profileForm.billingAddress.country}
                        onChange={(e) => setProfileForm({
                          ...profileForm, 
                          billingAddress: {...profileForm.billingAddress, country: e.target.value}
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="billingDefault"
                        checked={profileForm.billingAddress.isDefault}
                        onChange={(e) => setProfileForm({
                          ...profileForm, 
                          billingAddress: {...profileForm.billingAddress, isDefault: e.target.checked}
                        })}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <label htmlFor="billingDefault" className="ml-2 text-sm font-medium text-gray-700">
                        Definir como endereço padrão de facturação
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-gray-400 mr-3" />
                  <h2 className="text-lg font-semibold text-gray-900">Preferências</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-6">  
                  <div>
                    <p className="text-sm text-gray-600 mb-4">Escolha como pretende receber actualizações sobre pedidos, pagamentos, entregas, mensagens, suporte e novidades do Txova.</p>
                    <h3 className="text-sm font-medium text-gray-700 mb-4">Notificações</h3>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="emailNotifications"
                          checked={profileForm.preferences.notifications.email}
                          onChange={(e) => setProfileForm({
                            ...profileForm, 
                            preferences: {
                              ...profileForm.preferences,
                              notifications: {...profileForm.preferences.notifications, email: e.target.checked}
                            }
                          })}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <label htmlFor="emailNotifications" className="ml-2 text-sm font-medium text-gray-700">
                          Notificações por e-mail
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="smsNotifications"
                          checked={profileForm.preferences.notifications.sms}
                          onChange={(e) => setProfileForm({
                            ...profileForm, 
                            preferences: {
                              ...profileForm.preferences,
                              notifications: {...profileForm.preferences.notifications, sms: e.target.checked}
                            }
                          })}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <label htmlFor="smsNotifications" className="ml-2 text-sm font-medium text-gray-700">
                          Notificações por SMS
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="pushNotifications"
                          checked={profileForm.preferences.notifications.push}
                          onChange={(e) => setProfileForm({
                            ...profileForm, 
                            preferences: {
                              ...profileForm.preferences,
                              notifications: {...profileForm.preferences.notifications, push: e.target.checked}
                            }
                          })}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <label htmlFor="pushNotifications" className="ml-2 text-sm font-medium text-gray-700">
                          Notificações push
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center">
                  <Lock className="w-5 h-5 text-gray-400 mr-3" />
                  <h2 className="text-lg font-semibold text-gray-900">Alterar Palavra-passe</h2>
                </div>
              </div>
              <div className="p-6">
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Palavra-passe Actual
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                        Nova Palavra-passe
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                        Confirmar Nova Palavra-passe
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordForm.confirmNewPassword}
                          onChange={(e) => setPasswordForm({...passwordForm, confirmNewPassword: e.target.value})}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
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
                    <Button
                      type="submit"
                      disabled={changePassword.isPending}
                    >
                      {changePassword.isPending ? 'A alterar...' : 'Alterar Palavra-passe'}
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