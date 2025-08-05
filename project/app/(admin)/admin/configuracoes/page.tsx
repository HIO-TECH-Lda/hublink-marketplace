'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Settings, 
  Shield, 
  Mail, 
  CreditCard, 
  Globe, 
  Bell,
  Save,
  ArrowLeft,
  Eye,
  EyeOff
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useMarketplace } from '@/contexts/MarketplaceContext';

interface SystemSettings {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    supportPhone: string;
    timezone: string;
    currency: string;
    language: string;
  };
  security: {
    requireEmailVerification: boolean;
    requirePhoneVerification: boolean;
    twoFactorAuth: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
  };
  payment: {
    stripeEnabled: boolean;
    paypalEnabled: boolean;
    pixEnabled: boolean;
    commissionRate: number;
    minimumPayout: number;
    autoPayout: boolean;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  notifications: {
    orderNotifications: boolean;
    paymentNotifications: boolean;
    systemNotifications: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
  };
}

export default function SystemSettingsPage() {
  const router = useRouter();
  const { state } = useMarketplace();
  const [settings, setSettings] = useState<SystemSettings>({
    general: {
      siteName: 'Ecobazar',
      siteDescription: 'Marketplace brasileiro de alimentos orgânicos frescos e saudáveis',
      contactEmail: 'contato@ecobazar.com.br',
      supportPhone: '(11) 99999-9999',
      timezone: 'America/Sao_Paulo',
      currency: 'BRL',
      language: 'pt-BR'
    },
    security: {
      requireEmailVerification: true,
      requirePhoneVerification: false,
      twoFactorAuth: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 8
    },
    payment: {
      stripeEnabled: true,
      paypalEnabled: true,
      pixEnabled: true,
      commissionRate: 5.0,
      minimumPayout: 50.00,
      autoPayout: false
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: 'noreply@ecobazar.com.br',
      smtpPassword: '********',
      fromEmail: 'noreply@ecobazar.com.br',
      fromName: 'Ecobazar'
    },
    notifications: {
      orderNotifications: true,
      paymentNotifications: true,
      systemNotifications: true,
      emailNotifications: true,
      smsNotifications: false
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    alert('Configurações salvas com sucesso!');
  };

  const updateSetting = (section: keyof SystemSettings, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-9 mb-2">Configurações do Sistema</h1>
        <p className="text-gray-6">Gerencie as configurações da plataforma</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'general' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-6 hover:text-gray-9 hover:bg-gray-1'
                  }`}
                >
                  <Globe className="w-4 h-4 mr-2 inline" />
                  Geral
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'security' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-6 hover:text-gray-9 hover:bg-gray-1'
                  }`}
                >
                  <Shield className="w-4 h-4 mr-2 inline" />
                  Segurança
                </button>
                <button
                  onClick={() => setActiveTab('payment')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'payment' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-6 hover:text-gray-9 hover:bg-gray-1'
                  }`}
                >
                  <CreditCard className="w-4 h-4 mr-2 inline" />
                  Pagamentos
                </button>
                <button
                  onClick={() => setActiveTab('email')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'email' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-6 hover:text-gray-9 hover:bg-gray-1'
                  }`}
                >
                  <Mail className="w-4 h-4 mr-2 inline" />
                  Email
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'notifications' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-6 hover:text-gray-9 hover:bg-gray-1'
                  }`}
                >
                  <Bell className="w-4 h-4 mr-2 inline" />
                  Notificações
                </button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {activeTab === 'general' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-9">Configurações Gerais</CardTitle>
                <CardDescription>
                  Configurações básicas da plataforma
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="siteName">Nome do Site</Label>
                    <Input
                      id="siteName"
                      value={settings.general.siteName}
                      onChange={(e) => updateSetting('general', 'siteName', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail">Email de Contato</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={settings.general.contactEmail}
                      onChange={(e) => updateSetting('general', 'contactEmail', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="supportPhone">Telefone de Suporte</Label>
                    <Input
                      id="supportPhone"
                      value={settings.general.supportPhone}
                      onChange={(e) => updateSetting('general', 'supportPhone', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="timezone">Fuso Horário</Label>
                    <Select 
                      value={settings.general.timezone} 
                      onValueChange={(value) => updateSetting('general', 'timezone', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                        <SelectItem value="America/Manaus">Manaus (GMT-4)</SelectItem>
                        <SelectItem value="America/Belem">Belém (GMT-3)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="siteDescription">Descrição do Site</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.general.siteDescription}
                    onChange={(e) => updateSetting('general', 'siteDescription', e.target.value)}
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-9">Configurações de Segurança</CardTitle>
                <CardDescription>
                  Configurações de segurança e autenticação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Verificação de Email Obrigatória</Label>
                      <p className="text-sm text-gray-6">Exigir verificação de email para novos usuários</p>
                    </div>
                    <Switch
                      checked={settings.security.requireEmailVerification}
                      onCheckedChange={(checked) => updateSetting('security', 'requireEmailVerification', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Verificação de Telefone</Label>
                      <p className="text-sm text-gray-6">Exigir verificação de telefone para novos usuários</p>
                    </div>
                    <Switch
                      checked={settings.security.requirePhoneVerification}
                      onCheckedChange={(checked) => updateSetting('security', 'requirePhoneVerification', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Autenticação de Dois Fatores</Label>
                      <p className="text-sm text-gray-6">Permitir 2FA para usuários</p>
                    </div>
                    <Switch
                      checked={settings.security.twoFactorAuth}
                      onCheckedChange={(checked) => updateSetting('security', 'twoFactorAuth', checked)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="sessionTimeout">Timeout da Sessão (minutos)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxLoginAttempts">Tentativas Máximas de Login</Label>
                    <Input
                      id="maxLoginAttempts"
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="passwordMinLength">Tamanho Mínimo da Senha</Label>
                    <Input
                      id="passwordMinLength"
                      type="number"
                      value={settings.security.passwordMinLength}
                      onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'payment' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-9">Configurações de Pagamento</CardTitle>
                <CardDescription>
                  Configurações de gateways de pagamento e comissões
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Stripe</Label>
                      <p className="text-sm text-gray-6">Habilitar pagamentos via Stripe</p>
                    </div>
                    <Switch
                      checked={settings.payment.stripeEnabled}
                      onCheckedChange={(checked) => updateSetting('payment', 'stripeEnabled', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">PayPal</Label>
                      <p className="text-sm text-gray-6">Habilitar pagamentos via PayPal</p>
                    </div>
                    <Switch
                      checked={settings.payment.paypalEnabled}
                      onCheckedChange={(checked) => updateSetting('payment', 'paypalEnabled', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">M-Pesa</Label>
                      <p className="text-sm text-gray-6">Habilitar pagamentos via M-Pesa</p>
                    </div>
                    <Switch
                      checked={settings.payment.pixEnabled}
                      onCheckedChange={(checked) => updateSetting('payment', 'pixEnabled', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Payout Automático</Label>
                      <p className="text-sm text-gray-6">Realizar pagamentos automáticos aos vendedores</p>
                    </div>
                    <Switch
                      checked={settings.payment.autoPayout}
                      onCheckedChange={(checked) => updateSetting('payment', 'autoPayout', checked)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="commissionRate">Taxa de Comissão (%)</Label>
                    <Input
                      id="commissionRate"
                      type="number"
                      step="0.1"
                      value={settings.payment.commissionRate}
                      onChange={(e) => updateSetting('payment', 'commissionRate', parseFloat(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="minimumPayout">Payout Mínimo (MTn)</Label>
                    <Input
                      id="minimumPayout"
                      type="number"
                      step="0.01"
                      value={settings.payment.minimumPayout}
                      onChange={(e) => updateSetting('payment', 'minimumPayout', parseFloat(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'email' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-9">Configurações de Email</CardTitle>
                <CardDescription>
                  Configurações do servidor SMTP para envio de emails
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtpHost">Servidor SMTP</Label>
                    <Input
                      id="smtpHost"
                      value={settings.email.smtpHost}
                      onChange={(e) => updateSetting('email', 'smtpHost', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPort">Porta SMTP</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      value={settings.email.smtpPort}
                      onChange={(e) => updateSetting('email', 'smtpPort', parseInt(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpUser">Usuário SMTP</Label>
                    <Input
                      id="smtpUser"
                      value={settings.email.smtpUser}
                      onChange={(e) => updateSetting('email', 'smtpUser', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPassword">Senha SMTP</Label>
                    <div className="relative mt-1">
                      <Input
                        id="smtpPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={settings.email.smtpPassword}
                        onChange={(e) => updateSetting('email', 'smtpPassword', e.target.value)}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="fromEmail">Email Remetente</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      value={settings.email.fromEmail}
                      onChange={(e) => updateSetting('email', 'fromEmail', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fromName">Nome Remetente</Label>
                    <Input
                      id="fromName"
                      value={settings.email.fromName}
                      onChange={(e) => updateSetting('email', 'fromName', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-9">Configurações de Notificações</CardTitle>
                <CardDescription>
                  Configurações de notificações do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Notificações de Pedidos</Label>
                      <p className="text-sm text-gray-6">Enviar notificações sobre novos pedidos</p>
                    </div>
                    <Switch
                      checked={settings.notifications.orderNotifications}
                      onCheckedChange={(checked) => updateSetting('notifications', 'orderNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Notificações de Pagamento</Label>
                      <p className="text-sm text-gray-6">Enviar notificações sobre pagamentos</p>
                    </div>
                    <Switch
                      checked={settings.notifications.paymentNotifications}
                      onCheckedChange={(checked) => updateSetting('notifications', 'paymentNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Notificações do Sistema</Label>
                      <p className="text-sm text-gray-6">Enviar notificações sobre eventos do sistema</p>
                    </div>
                    <Switch
                      checked={settings.notifications.systemNotifications}
                      onCheckedChange={(checked) => updateSetting('notifications', 'systemNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Notificações por Email</Label>
                      <p className="text-sm text-gray-6">Enviar notificações por email</p>
                    </div>
                    <Switch
                      checked={settings.notifications.emailNotifications}
                      onCheckedChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Notificações por SMS</Label>
                      <p className="text-sm text-gray-6">Enviar notificações por SMS</p>
                    </div>
                    <Switch
                      checked={settings.notifications.smsNotifications}
                      onCheckedChange={(checked) => updateSetting('notifications', 'smsNotifications', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Save Button */}
          <div className="mt-6">
            <Button 
              onClick={handleSave}
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Configurações
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 