'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Shield, 
  Save, 
  ArrowLeft, 
  AlertCircle,
  Building,
  User,
  MapPin
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMarketplace } from '@/contexts/MarketplaceContext';

interface Vendor {
  id: string;
  businessName: string;
  businessDescription: string;
  cnpj: string;
  contactPerson: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  commissionRate: number;
  totalSales: number;
  totalProducts: number;
  updatedAt: string;
  rejectionReason?: string;
}

export default function EditVendorPage() {
  const router = useRouter();
  const params = useParams();
  const { state } = useMarketplace();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    businessName: '',
    businessDescription: '',
    cnpj: '',
    status: '',
    commissionRate: '',
    contactFirstName: '',
    contactLastName: '',
    contactEmail: '',
    contactPhone: '',
    addressStreet: '',
    addressNumber: '',
    addressComplement: '',
    addressNeighborhood: '',
    addressCity: '',
    addressState: '',
    addressZipCode: '',
    rejectionReason: ''
  });

  useEffect(() => {
    loadVendor();
  }, [params.id]);

  const loadVendor = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockVendor: Vendor = {
      id: params.id as string,
      businessName: 'Fazenda Verde',
      businessDescription: 'Produtos orgânicos frescos direto da fazenda.',
      cnpj: '12.345.678/0001-90',
      contactPerson: {
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao@fazendaverde.com',
        phone: '(258) 84-123-4567'
      },
      address: {
        street: 'Estrada Nacional 1',
        number: 'Km 25',
        complement: 'Fazenda Verde',
        neighborhood: 'Zona Rural',
        city: 'Maputo',
        state: 'Maputo',
        zipCode: '1100'
      },
      status: 'approved',
      commissionRate: 10,
      totalSales: 125000.00,
      totalProducts: 15,
      updatedAt: '2024-01-20T14:25:00Z'
    };

    setVendor(mockVendor);
    
    setFormData({
      businessName: mockVendor.businessName,
      businessDescription: mockVendor.businessDescription,
      cnpj: mockVendor.cnpj,
      status: mockVendor.status,
      commissionRate: mockVendor.commissionRate.toString(),
      contactFirstName: mockVendor.contactPerson.firstName,
      contactLastName: mockVendor.contactPerson.lastName,
      contactEmail: mockVendor.contactPerson.email,
      contactPhone: mockVendor.contactPerson.phone,
      addressStreet: mockVendor.address.street,
      addressNumber: mockVendor.address.number,
      addressComplement: mockVendor.address.complement || '',
      addressNeighborhood: mockVendor.address.neighborhood,
      addressCity: mockVendor.address.city,
      addressState: mockVendor.address.state,
      addressZipCode: mockVendor.address.zipCode,
      rejectionReason: mockVendor.rejectionReason || ''
    });
    
    setIsLoading(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Nome da empresa é obrigatório';
    }
    if (!formData.cnpj.trim()) {
      newErrors.cnpj = 'CNPJ é obrigatório';
    }
    if (!formData.contactEmail.trim()) {
      newErrors.contactEmail = 'Email é obrigatório';
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

      if (vendor) {
        const updatedVendor: Vendor = {
          ...vendor,
          businessName: formData.businessName,
          businessDescription: formData.businessDescription,
          cnpj: formData.cnpj,
          status: formData.status as Vendor['status'],
          commissionRate: Number(formData.commissionRate),
          contactPerson: {
            firstName: formData.contactFirstName,
            lastName: formData.contactLastName,
            email: formData.contactEmail,
            phone: formData.contactPhone
          },
          address: {
            street: formData.addressStreet,
            number: formData.addressNumber,
            complement: formData.addressComplement || undefined,
            neighborhood: formData.addressNeighborhood,
            city: formData.addressCity,
            state: formData.addressState,
            zipCode: formData.addressZipCode
          },
          rejectionReason: formData.rejectionReason || undefined,
          updatedAt: new Date().toISOString()
        };

        setVendor(updatedVendor);
      }

      router.push(`/admin/vendedores/${params.id}`);
    } catch (error) {
      console.error('Error updating vendor:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando vendedor...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!vendor) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Shield className="w-12 h-12 text-gray-4 mx-auto mb-4" />
            <p className="text-gray-6">Vendedor não encontrado</p>
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
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Editar Vendedor</h1>
            <p className="text-gray-6">{vendor.businessName}</p>
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
            {/* Business Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="w-5 h-5 mr-2" />
                  Informações da Empresa
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Nome da Empresa *</label>
                    <Input
                      value={formData.businessName}
                      onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                      className={errors.businessName ? 'border-red-500' : ''}
                    />
                    {errors.businessName && (
                      <p className="text-red-500 text-sm mt-1">{errors.businessName}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Descrição da Empresa</label>
                    <Textarea
                      value={formData.businessDescription}
                      onChange={(e) => setFormData({...formData, businessDescription: e.target.value})}
                      rows={4}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-7 mb-2 block">CNPJ *</label>
                      <Input
                        value={formData.cnpj}
                        onChange={(e) => setFormData({...formData, cnpj: e.target.value})}
                        className={errors.cnpj ? 'border-red-500' : ''}
                      />
                      {errors.cnpj && (
                        <p className="text-red-500 text-sm mt-1">{errors.cnpj}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-7 mb-2 block">Taxa de Comissão (%)</label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={formData.commissionRate}
                        onChange={(e) => setFormData({...formData, commissionRate: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Status e Aprovação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Status</label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Aprovado</SelectItem>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="rejected">Rejeitado</SelectItem>
                        <SelectItem value="suspended">Suspenso</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {formData.status === 'rejected' && (
                    <div>
                      <label className="text-sm font-medium text-gray-7 mb-2 block">Motivo da Rejeição</label>
                      <Textarea
                        value={formData.rejectionReason}
                        onChange={(e) => setFormData({...formData, rejectionReason: e.target.value})}
                        placeholder="Explique o motivo da rejeição..."
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Informações de Contato
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Nome</label>
                    <Input
                      value={formData.contactFirstName}
                      onChange={(e) => setFormData({...formData, contactFirstName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Sobrenome</label>
                    <Input
                      value={formData.contactLastName}
                      onChange={(e) => setFormData({...formData, contactLastName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Email *</label>
                    <Input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                      className={errors.contactEmail ? 'border-red-500' : ''}
                    />
                    {errors.contactEmail && (
                      <p className="text-red-500 text-sm mt-1">{errors.contactEmail}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Telefone</label>
                    <Input
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({...formData, contactPhone: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Vendor Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Vendedor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-6">Vendas Totais:</span>
                    <span className="font-bold">{formatCurrency(vendor.totalSales)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Total de Produtos:</span>
                    <span className="font-medium">{vendor.totalProducts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Taxa de Comissão:</span>
                    <span className="font-medium">{vendor.commissionRate}%</span>
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