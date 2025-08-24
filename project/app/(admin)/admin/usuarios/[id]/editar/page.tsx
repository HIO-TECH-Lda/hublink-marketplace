'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  User, 
  Save, 
  ArrowLeft, 
  Mail,
  Phone,
  MapPin,
  Lock,
  Shield,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useMarketplace } from '@/contexts/MarketplaceContext';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  role: 'buyer' | 'seller' | 'admin';
  avatar?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    newsletter: boolean;
    notifications: boolean;
    language: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function UserEditPage() {
  const router = useRouter();
  const params = useParams();
  const { state } = useMarketplace();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    status: 'active' as User['status'],
    role: 'buyer' as User['role'],
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Moçambique'
    },
    preferences: {
      newsletter: true,
      notifications: true,
      language: 'pt-MZ'
    },
    password: '',
    confirmPassword: ''
  });

  const languages = [
    { code: 'pt-MZ', name: 'Português (Moçambique)' },
    { code: 'en-US', name: 'English (US)' },
    { code: 'pt-BR', name: 'Português (Brasil)' }
  ];

  useEffect(() => {
    loadUserData();
  }, [params.id]);

  const loadUserData = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUser: User = {
      id: params.id as string,
      firstName: 'João',
      lastName: 'Silva',
      email: 'joao.silva@email.com',
      phone: '+258 84 123 4567',
      status: 'active',
      role: 'buyer',
      address: {
        street: 'Rua Principal, nº 123',
        city: 'Maputo',
        state: 'Maputo',
        zipCode: '1100',
        country: 'Moçambique'
      },
      preferences: {
        newsletter: true,
        notifications: true,
        language: 'pt-MZ'
      },
      createdAt: '2023-06-15T10:30:00Z',
      updatedAt: '2024-01-20T14:25:00Z'
    };

    setFormData({
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      email: mockUser.email,
      phone: mockUser.phone,
      status: mockUser.status,
      role: mockUser.role,
      address: mockUser.address,
      preferences: mockUser.preferences,
      password: '',
      confirmPassword: ''
    });

    setIsLoading(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Nome é obrigatório';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Sobrenome é obrigatório';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }
    if (!formData.address.street.trim()) {
      newErrors.street = 'Endereço é obrigatório';
    }
    if (!formData.address.city.trim()) {
      newErrors.city = 'Cidade é obrigatória';
    }
    if (!formData.address.state.trim()) {
      newErrors.state = 'Província é obrigatória';
    }
    if (!formData.address.zipCode.trim()) {
      newErrors.zipCode = 'Código postal é obrigatório';
    }

    // Password validation (only if password is being changed)
    if (formData.password || formData.confirmPassword) {
      if (formData.password.length < 6) {
        newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Senhas não coincidem';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Here you would typically make an API call to update the user
      console.log('Updating user:', {
        ...formData,
        password: formData.password || undefined // Only send if changed
      });

      // Navigate back to user details
      router.push(`/admin/usuarios/${params.id}`);
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando dados do usuário...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Editar Usuário</h1>
            <p className="text-gray-6">Modifique as informações do usuário</p>
          </div>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Nome *</label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                      placeholder="Nome do usuário"
                      className={errors.firstName ? 'border-red-500' : ''}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Sobrenome *</label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      placeholder="Sobrenome do usuário"
                      className={errors.lastName ? 'border-red-500' : ''}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Email *</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="email@exemplo.com"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Telefone *</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+258 84 123 4567"
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Configurações da Conta
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Status</label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as User['status']})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                        <SelectItem value="suspended">Suspenso</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Função</label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value as User['role']})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buyer">Comprador</SelectItem>
                        <SelectItem value="seller">Vendedor</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Endereço
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Rua/Avenida *</label>
                    <Input
                      value={formData.address.street}
                      onChange={(e) => setFormData({
                        ...formData, 
                        address: {...formData.address, street: e.target.value}
                      })}
                      placeholder="Rua Principal, nº 123"
                      className={errors.street ? 'border-red-500' : ''}
                    />
                    {errors.street && (
                      <p className="text-red-500 text-sm mt-1">{errors.street}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-7 mb-2 block">Cidade *</label>
                      <Input
                        value={formData.address.city}
                        onChange={(e) => setFormData({
                          ...formData, 
                          address: {...formData.address, city: e.target.value}
                        })}
                        placeholder="Maputo"
                        className={errors.city ? 'border-red-500' : ''}
                      />
                      {errors.city && (
                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-7 mb-2 block">Província *</label>
                      <Input
                        value={formData.address.state}
                        onChange={(e) => setFormData({
                          ...formData, 
                          address: {...formData.address, state: e.target.value}
                        })}
                        placeholder="Maputo"
                        className={errors.state ? 'border-red-500' : ''}
                      />
                      {errors.state && (
                        <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-7 mb-2 block">Código Postal *</label>
                      <Input
                        value={formData.address.zipCode}
                        onChange={(e) => setFormData({
                          ...formData, 
                          address: {...formData.address, zipCode: e.target.value}
                        })}
                        placeholder="1100"
                        className={errors.zipCode ? 'border-red-500' : ''}
                      />
                      {errors.zipCode && (
                        <p className="text-red-500 text-sm mt-1">{errors.zipCode}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Password Change */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Alterar Senha
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-gray-6">
                    Deixe em branco para manter a senha atual
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-7 mb-2 block">Nova Senha</label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          placeholder="Nova senha"
                          className={errors.password ? 'border-red-500' : ''}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-7 mb-2 block">Confirmar Senha</label>
                      <Input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        placeholder="Confirmar nova senha"
                        className={errors.confirmPassword ? 'border-red-500' : ''}
                      />
                      {errors.confirmPassword && (
                        <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Preferências
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium text-gray-7">Newsletter</Label>
                      <p className="text-xs text-gray-6">Receber emails promocionais</p>
                    </div>
                    <Switch
                      checked={formData.preferences.newsletter}
                      onCheckedChange={(checked) => setFormData({
                        ...formData,
                        preferences: {...formData.preferences, newsletter: checked}
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium text-gray-7">Notificações</Label>
                      <p className="text-xs text-gray-6">Receber notificações push</p>
                    </div>
                    <Switch
                      checked={formData.preferences.notifications}
                      onCheckedChange={(checked) => setFormData({
                        ...formData,
                        preferences: {...formData.preferences, notifications: checked}
                      })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Idioma</label>
                    <Select 
                      value={formData.preferences.language} 
                      onValueChange={(value) => setFormData({
                        ...formData,
                        preferences: {...formData.preferences, language: value}
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {languages.map((lang) => (
                          <SelectItem key={lang.code} value={lang.code}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo das Alterações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-6">Nome:</span>
                    <span className="font-medium">
                      {formData.firstName && formData.lastName ? 
                        `${formData.firstName} ${formData.lastName}` : 'Não definido'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Email:</span>
                    <span className="font-medium">{formData.email || 'Não definido'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Telefone:</span>
                    <span className="font-medium">{formData.phone || 'Não definido'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Status:</span>
                    <span className="font-medium">
                      {formData.status === 'active' ? 'Ativo' : 
                       formData.status === 'inactive' ? 'Inativo' : 
                       formData.status === 'suspended' ? 'Suspenso' : 'Pendente'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Função:</span>
                    <span className="font-medium">
                      {formData.role === 'buyer' ? 'Comprador' : 
                       formData.role === 'seller' ? 'Vendedor' : 'Administrador'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Senha:</span>
                    <span className="font-medium">
                      {formData.password ? 'Será alterada' : 'Mantida'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Card>
              <CardContent className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
