'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Save, 
  ArrowLeft, 
  Mail,
  Phone,
  Shield,
  AlertCircle,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAdminUser, useUpdateUser } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';

interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  role?: 'buyer' | 'seller' | 'admin' | 'support';
  status?: 'active' | 'inactive' | 'suspended';
  emailVerified?: boolean;
  phoneVerified?: boolean;
}

export default function UserEditPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const userId = params.id as string;
  
  const { data: user, isLoading } = useAdminUser(userId);
  const updateUser = useUpdateUser();

  const [formData, setFormData] = useState<UpdateUserData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'buyer',
    status: 'active',
    emailVerified: false,
    phoneVerified: false
  });

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified || false,
        phoneVerified: user.phoneVerified || false
      });
    }
  }, [user]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = 'Nome é obrigatório';
    }
    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Sobrenome é obrigatório';
    }
    if (formData.email?.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.phone?.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!/^\+258\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Telefone deve estar no formato +258XXXXXXXXX';
    }

    // Password validation (only if admin entered a new password)
    const trimmedPassword = password.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (trimmedPassword || trimmedConfirm) {
      if (!trimmedPassword) {
        newErrors.password = 'Insira a nova palavra-passe';
      } else if (password.length < 8) {
        newErrors.password = 'A palavra-passe deve ter pelo menos 8 caracteres';
      }

      if (!trimmedConfirm) {
        newErrors.confirmPassword = 'Confirme a nova palavra-passe';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'As palavras-passe não coincidem';
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

    const dataToSend: UpdateUserData = {
      firstName: formData.firstName?.trim(),
      lastName: formData.lastName?.trim(),
      email: formData.email?.trim() || undefined,
      phone: formData.phone?.trim()?.replace(/\s/g, ''),
      role: formData.role,
      status: formData.status,
      emailVerified: formData.emailVerified,
      phoneVerified: formData.phoneVerified,
    };

    // Ensure the frontend only includes the password field if the admin actually typed a new password
    if (password.trim()) {
      dataToSend.password = password;
    }

    try {
      await updateUser.mutateAsync({
        userId,
        data: dataToSend
      });
      
      toast({
        title: 'Utilizador actualizado',
        description: 'As alterações foram salvas com sucesso.',
      });
      
      router.push(`/admin/usuarios/${userId}`);
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Falha ao actualizar utilizador',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando dados do utilizador...</p>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-gray-6">Utilizador não encontrado</p>
            <Button onClick={() => router.push('/admin/usuarios')} className="mt-4">
              Voltar para Lista
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Editar Utilizador</h1>
            <p className="text-gray-6">Modifique as informações do utilizador</p>
          </div>
          <Button onClick={() => router.push(`/admin/usuarios/${userId}`)} variant="outline">
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
                      placeholder="Nome do utilizador"
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
                      placeholder="Sobrenome do utilizador"
                      className={errors.lastName ? 'border-red-500' : ''}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ''}
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

            {/* Password Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Palavra-passe de Acesso
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-gray-5 mb-4">
                  Deixe os campos abaixo em branco para manter a palavra-passe actual do utilizador.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">Nova Palavra-passe</Label>
                    <div className="relative mt-1">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) {
                            setErrors((prev) => ({ ...prev, password: '' }));
                          }
                        }}
                        placeholder="Mínimo 8 caracteres"
                        className={`pr-10 ${errors.password ? 'border-red-500' : ''}`}
                        autoComplete="new-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-gray-4 hover:text-gray-7"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                        aria-label={showPassword ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                    )}
                    <p className="text-xs text-gray-5 mt-1">Mínimo de 8 caracteres</p>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirmar Nova Palavra-passe</Label>
                    <div className="relative mt-1">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errors.confirmPassword) {
                            setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                          }
                        }}
                        placeholder="Repita a palavra-passe"
                        className={`pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                        autoComplete="new-password"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-gray-4 hover:text-gray-7"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        tabIndex={-1}
                        aria-label={showConfirmPassword ? 'Ocultar confirmação' : 'Mostrar confirmação'}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                    )}
                    <p className="text-xs text-gray-5 mt-1">Deve coincidir com a nova palavra-passe</p>
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
                    <Label htmlFor="status">Estado</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => setFormData({...formData, status: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="inactive">Inactivo</SelectItem>
                        <SelectItem value="suspended">Suspenso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="role">Função</Label>
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

            {/* Verification Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Estado de Verificação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Verificado</Label>
                      <p className="text-xs text-gray-6">Marcar email como verificado</p>
                    </div>
                    <Switch
                      checked={formData.emailVerified}
                      onCheckedChange={(checked) => setFormData({
                        ...formData,
                        emailVerified: checked
                      })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Telefone Verificado</Label>
                      <p className="text-xs text-gray-6">Marcar telefone como verificado</p>
                    </div>
                    <Switch
                      checked={formData.phoneVerified}
                      onCheckedChange={(checked) => setFormData({
                        ...formData,
                        phoneVerified: checked
                      })}
                    />
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
                    <span className="text-gray-6">Estado:</span>
                    <span className="font-medium">
                      {formData.status === 'active' ? 'Activo' : 
                       formData.status === 'inactive' ? 'Inactivo' : 'Suspenso'}
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
                  <div className="flex justify-between items-center">
                    <span className="text-gray-6">Palavra-passe:</span>
                    <span className="font-medium text-xs">
                      {password.trim() ? (
                        <span className="text-primary font-semibold">Será actualizada</span>
                      ) : (
                        'Inalterada'
                      )}
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
                  disabled={updateUser.isPending}
                >
                  {updateUser.isPending ? (
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
    </>
  );
}
