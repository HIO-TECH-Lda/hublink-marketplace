'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Save, 
  ArrowLeft, 
  Mail,
  Phone,
  Shield,
  Lock,
  AlertCircle
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useCreateUser } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';

interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: 'buyer' | 'seller' | 'admin' | 'support';
  status: 'active' | 'inactive' | 'suspended';
}

export default function CreateUserPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createUser = useCreateUser();

  const [formData, setFormData] = useState<CreateUserData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'buyer',
    status: 'active'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'Nome é obrigatório';
    }
    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Sobrenome é obrigatório';
    }
    if (!formData.email?.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^\+258\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Telefone deve estar no formato +258XXXXXXXXX';
    }
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const newUser = await createUser.mutateAsync({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: formData.role,
        status: formData.status
      });
      
      toast({
        title: 'Usuário criado',
        description: 'O novo usuário foi criado com sucesso.',
      });
      
      router.push(`/admin/usuarios/${newUser.id}`);
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Falha ao criar usuário',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Criar Novo Usuário</h1>
            <p className="text-gray-6">Adicione um novo usuário ao sistema</p>
          </div>
          <Button onClick={() => router.push('/admin/usuarios')} variant="outline">
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
                <CardTitle>Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nome *</Label>
                    <Input
                      id="firstName"
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
                    <Label htmlFor="lastName">Sobrenome *</Label>
                    <Input
                      id="lastName"
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
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
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
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+258841234567"
                      className={errors.phone ? 'border-red-500' : ''}
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                    )}
                    <p className="text-xs text-gray-5 mt-1">Formato: +258XXXXXXXXX</p>
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
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => setFormData({...formData, status: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                        <SelectItem value="suspended">Suspenso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="role">Função *</Label>
                    <Select 
                      value={formData.role} 
                      onValueChange={(value) => setFormData({...formData, role: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buyer">Comprador</SelectItem>
                        <SelectItem value="seller">Vendedor</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="support">Suporte</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Password */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Senha de Acesso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="password">Senha *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        placeholder="Mínimo 8 caracteres"
                        className={errors.password ? 'border-red-500' : ''}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? 'Ocultar' : 'Mostrar'}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                    <p className="text-xs text-gray-5 mt-1">
                      A senha deve ter pelo menos 8 caracteres
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
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
                    <span className="font-medium text-sm">{formData.email || 'Não definido'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Telefone:</span>
                    <span className="font-medium text-sm">{formData.phone || 'Não definido'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Status:</span>
                    <span className="font-medium">
                      {formData.status === 'active' ? 'Ativo' : 
                       formData.status === 'inactive' ? 'Inativo' : 'Suspenso'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Função:</span>
                    <span className="font-medium">
                      {formData.role === 'buyer' ? 'Comprador' : 
                       formData.role === 'seller' ? 'Vendedor' : 
                       formData.role === 'admin' ? 'Administrador' : 'Suporte'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-blue-9">Informação</p>
                    <p className="text-xs text-blue-7">
                      O usuário receberá um email de boas-vindas com as credenciais de acesso.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Create Button */}
            <Card>
              <CardContent className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={createUser.isPending}
                >
                  {createUser.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Criando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Criar Usuário
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

