'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Shield, 
  User, 
  Building, 
  Star, 
  ArrowLeft,
  DollarSign,
  Package,
  Calendar,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  Eye,
  ShoppingCart
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminSeller, useUpdateSellerStatus } from '@/hooks/useAdmin';
import { formatCurrency } from '@/lib/finance-utils';
import { useToast } from '@/hooks/use-toast';

export default function VendorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const sellerId = params.id as string;
  
  const { data: seller, isLoading } = useAdminSeller(sellerId);
  const updateStatus = useUpdateSellerStatus();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-yellow-600 bg-yellow-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Aprovado';
      case 'inactive': return 'Pendente';
      case 'suspended': return 'Rejeitado';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-MZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleUpdateStatus = (newStatus: 'active' | 'inactive' | 'suspended') => {
    updateStatus.mutate({ sellerId, status: newStatus });
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

  if (!seller) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Shield className="w-12 h-12 text-gray-4 mx-auto mb-4" />
            <p className="text-gray-6">Vendedor não encontrado</p>
            <Button onClick={() => router.back()} className="mt-4">
              Voltar
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const stats = seller.statistics || {
    productCount: seller.productCount || 0,
    averageRating: seller.averageRating || 0,
    totalReviews: seller.totalReviews || 0,
    totalViews: 0,
    totalPurchases: 0,
    totalOrders: 0,
    totalSales: seller.totalSales || 0,
    totalQuantitySold: 0
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Detalhes do Vendedor</h1>
            <p className="text-gray-6">{seller.company.name}</p>
          </div>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Vendor Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vendor Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Status do Vendedor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Badge className={`${getStatusColor(seller.status)} text-sm`}>
                    {getStatusText(seller.status)}
                  </Badge>
                  <p className="text-sm text-gray-6 mt-2">
                    Última atualização: {formatDate(seller.updatedAt)}
                  </p>
                </div>
                <Select 
                  value={seller.status} 
                  onValueChange={handleUpdateStatus}
                  disabled={updateStatus.isPending}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aprovado</SelectItem>
                    <SelectItem value="inactive">Pendente</SelectItem>
                    <SelectItem value="suspended">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

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
                  <label className="text-sm font-medium text-gray-7">Nome da Empresa</label>
                  <p className="text-gray-9 font-medium">{seller.company.name}</p>
                </div>
                {seller.company.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-7">Descrição</label>
                    <p className="text-gray-9">{seller.company.description}</p>
                  </div>
                )}
                {seller.company.productTypes && (
                  <div>
                    <label className="text-sm font-medium text-gray-7">Tipos de Produtos</label>
                    <p className="text-gray-9">{seller.company.productTypes}</p>
                  </div>
                )}
                {seller.company.experience && (
                  <div>
                    <label className="text-sm font-medium text-gray-7">Experiência</label>
                    <p className="text-gray-9">{seller.company.experience}</p>
                  </div>
                )}
                {seller.company.address && (
                  <div>
                    <label className="text-sm font-medium text-gray-7">Endereço</label>
                    <p className="text-gray-9">
                      {seller.company.address}
                      {seller.company.city && `, ${seller.company.city}`}
                      {seller.company.province && `, ${seller.company.province}`}
                      {seller.company.postalCode && ` - ${seller.company.postalCode}`}
                    </p>
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
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-7">Pessoa de Contato</label>
                  <p className="text-gray-9 font-medium">{seller.contact.name}</p>
                  {seller.contact.firstName && seller.contact.lastName && (
                    <p className="text-sm text-gray-6">
                      {seller.contact.firstName} {seller.contact.lastName}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-7 flex items-center">
                      <Mail className="w-4 h-4 mr-1" />
                      Email
                    </label>
                    <p className="text-gray-9">{seller.contact.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7 flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      Telefone
                    </label>
                    <p className="text-gray-9">{seller.contact.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Vendor Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Estatísticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-6">Avaliação:</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                    <span className="font-medium">{stats.averageRating.toFixed(1)}/5</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Total de Avaliações:</span>
                  <span className="font-medium">{stats.totalReviews}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Vendas Totais:</span>
                  <span className="font-bold">{formatCurrency(stats.totalSales)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Total de Produtos:</span>
                  <span className="font-medium">{stats.productCount}</span>
                </div>
                {stats.totalOrders > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-6">Total de Pedidos:</span>
                    <span className="font-medium">{stats.totalOrders}</span>
                  </div>
                )}
                {stats.totalViews > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-6">Total de Visualizações:</span>
                    <span className="font-medium">{stats.totalViews}</span>
                  </div>
                )}
                {stats.totalQuantitySold > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-6">Quantidade Vendida:</span>
                    <span className="font-medium">{stats.totalQuantitySold}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Vendor Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="text-sm font-medium">Vendedor Registrado</p>
                    <p className="text-xs text-gray-6">{formatDate(seller.createdAt)}</p>
                  </div>
                </div>
                {seller.status === 'active' && (
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium">Aprovado</p>
                      <p className="text-xs text-gray-6">{formatDate(seller.updatedAt)}</p>
                    </div>
                  </div>
                )}
                {seller.status === 'suspended' && (
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium">Rejeitado</p>
                      <p className="text-xs text-gray-6">{formatDate(seller.updatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
