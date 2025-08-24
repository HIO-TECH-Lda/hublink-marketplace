'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  Save, 
  ArrowLeft, 
  Upload,
  AlertCircle,
  User,
  Building,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMarketplace } from '@/contexts/MarketplaceContext';

export default function AdminCreateSellerPage() {
  const router = useRouter();
  const { state } = useMarketplace();
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    businessDescription: '',
    businessType: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'Moçambique'
    },
    status: 'pending',
    commissionRate: '10'
  });

  const businessTypes = [
    { id: 'individual', name: 'Pessoa Individual' },
    { id: 'company', name: 'Empresa' },
    { id: 'cooperative', name: 'Cooperativa' },
    { id: 'association', name: 'Associação' }
  ];

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
    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Nome do negócio é obrigatório';
    }
    if (!formData.businessType) {
      newErrors.businessType = 'Tipo de negócio é obrigatório';
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

      // Here you would typically make an API call to create the seller
      console.log('Creating seller:', {
        ...formData,
        commissionRate: parseFloat(formData.commissionRate)
      });

      // Navigate back to sellers list
      router.push('/admin/vendedores');
    } catch (error) {
      console.error('Error creating seller:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Criar Novo Vendedor</h1>
            <p className="text-gray-6">Adicione um novo vendedor à plataforma</p>
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
                      placeholder="Nome do vendedor"
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
                      placeholder="Sobrenome do vendedor"
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

            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Informações do Negócio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Nome do Negócio *</label>
                    <Input
                      value={formData.businessName}
                      onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                      placeholder="Ex: Fazenda Verde"
                      className={errors.businessName ? 'border-red-500' : ''}
                    />
                    {errors.businessName && (
                      <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Descrição do Negócio</label>
                    <Textarea
                      value={formData.businessDescription}
                      onChange={(e) => setFormData({...formData, businessDescription: e.target.value})}
                      placeholder="Descreva o negócio..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Tipo de Negócio *</label>
                    <Select value={formData.businessType} onValueChange={(value) => setFormData({...formData, businessType: value})}>
                      <SelectTrigger className={errors.businessType ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecione o tipo de negócio" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessTypes.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.businessType && (
                      <p className="text-red-500 text-sm mt-1">{errors.businessType}</p>
                    )}
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

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Configurações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Status</label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="approved">Aprovado</SelectItem>
                        <SelectItem value="rejected">Rejeitado</SelectItem>
                        <SelectItem value="suspended">Suspenso</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-6 mt-1">
                      Vendedores pendentes precisam de aprovação
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Taxa de Comissão (%)</label>
                    <Input
                      type="number"
                      min="0"
                      max="50"
                      step="0.1"
                      value={formData.commissionRate}
                      onChange={(e) => setFormData({...formData, commissionRate: e.target.value})}
                      placeholder="10"
                    />
                    <p className="text-xs text-gray-6 mt-1">
                      Percentual que o vendedor recebe por venda
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Vendedor</CardTitle>
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
                    <span className="text-gray-6">Negócio:</span>
                    <span className="font-medium">{formData.businessName || 'Não definido'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Tipo:</span>
                    <span className="font-medium">
                      {businessTypes.find(t => t.id === formData.businessType)?.name || 'Não definido'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Status:</span>
                    <span className="font-medium">
                      {formData.status === 'pending' ? 'Pendente' : 
                       formData.status === 'approved' ? 'Aprovado' : 
                       formData.status === 'rejected' ? 'Rejeitado' : 'Suspenso'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Comissão:</span>
                    <span className="font-medium">{formData.commissionRate}%</span>
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
                      Criando Vendedor...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Criar Vendedor
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
