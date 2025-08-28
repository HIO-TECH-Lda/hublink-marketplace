'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  Search, 
  Eye, 
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Star,
  ArrowLeft,
  User,
  Building
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMarketplace } from '@/contexts/MarketplaceContext';

interface Vendor {
  id: string;
  userId: string;
  businessName: string;
  businessDescription: string;
  cnpj: string;
  contactPerson: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  rating: number;
  reviewCount: number;
  totalSales: number;
  totalProducts: number;
  commissionRate: number;
  logo?: string;
  createdAt: string;
  updatedAt: string;
}

export default function VendorManagementPage() {
  const router = useRouter();
  const { state } = useMarketplace();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVendors();
  }, []);

  useEffect(() => {
    filterVendors();
  }, [vendors, searchTerm, statusFilter]);

  const loadVendors = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockVendors: Vendor[] = [
      {
        id: '1',
        userId: '1',
        businessName: 'Fazenda Verde',
        businessDescription: 'Produtos orgânicos frescos direto da fazenda',
        cnpj: '12.345.678/0001-90',
        contactPerson: {
          firstName: 'João',
          lastName: 'Silva',
          email: 'joao@fazendaverde.com',
          phone: '(84) 99999-9999'
        },
        status: 'approved',
        rating: 4.8,
        reviewCount: 45,
        totalSales: 12500.00,
        totalProducts: 15,
        commissionRate: 10,
        createdAt: '2024-01-10T10:30:00Z',
        updatedAt: '2024-01-20T14:25:00Z'
      },
      {
        id: '2',
        userId: '2',
        businessName: 'Horta Orgânica',
        businessDescription: 'Hortaliças orgânicas cultivadas com amor',
        cnpj: '98.765.432/0001-10',
        contactPerson: {
          firstName: 'Maria',
          lastName: 'Santos',
          email: 'maria@hortaorganica.com',
          phone: '(84) 88888-8888'
        },
        status: 'pending',
        rating: 0,
        reviewCount: 0,
        totalSales: 0,
        totalProducts: 8,
        commissionRate: 10,
        createdAt: '2024-01-20T09:15:00Z',
        updatedAt: '2024-01-20T09:15:00Z'
      },
      {
        id: '3',
        userId: '3',
        businessName: 'Bananal Orgânico',
        businessDescription: 'Bananas orgânicas da melhor qualidade',
        cnpj: '55.444.333/0001-22',
        contactPerson: {
          firstName: 'Pedro',
          lastName: 'Oliveira',
          email: 'pedro@bananalorganico.com',
          phone: '(84) 77777-7777'
        },
        status: 'approved',
        rating: 4.5,
        reviewCount: 32,
        totalSales: 8900.00,
        totalProducts: 12,
        commissionRate: 10,
        createdAt: '2024-01-05T11:20:00Z',
        updatedAt: '2024-01-18T16:45:00Z'
      },
      {
        id: '4',
        userId: '4',
        businessName: 'Frutas Frescas',
        businessDescription: 'Frutas frescas e orgânicas',
        cnpj: '33.222.111/0001-33',
        contactPerson: {
          firstName: 'Ana',
          lastName: 'Costa',
          email: 'ana@frutasfrescas.com',
          phone: '(84) 66666-6666'
        },
        status: 'rejected',
        rating: 0,
        reviewCount: 0,
        totalSales: 0,
        totalProducts: 0,
        commissionRate: 10,
        createdAt: '2024-01-19T08:30:00Z',
        updatedAt: '2024-01-19T15:20:00Z'
      }
    ];

    setVendors(mockVendors);
    setIsLoading(false);
  };

  const filterVendors = () => {
    let filtered = vendors;

    if (searchTerm) {
      filtered = filtered.filter(vendor =>
        vendor.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.contactPerson.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.contactPerson.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.cnpj.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(vendor => vendor.status === statusFilter);
    }

    setFilteredVendors(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'suspended': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovado';
      case 'pending': return 'Pendente';
      case 'rejected': return 'Rejeitado';
      case 'suspended': return 'Suspenso';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-MZ');
  };

  const handleUpdateStatus = (vendorId: string, newStatus: string) => {
    setVendors(prevVendors =>
      prevVendors.map(vendor =>
        vendor.id === vendorId
          ? { ...vendor, status: newStatus as Vendor['status'], updatedAt: new Date().toISOString() }
          : vendor
      )
    );
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando vendedores...</p>
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
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Gerenciamento de Vendedores</h1>
            <p className="text-gray-6">Aprove e gerencie vendedores da plataforma</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={() => router.push('/admin/vendedores/novo')}>
              <Shield className="w-4 h-4 mr-2" />
              Novo Vendedor
            </Button>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Total de Vendedores</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">{vendors.length}</div>
            <p className="text-xs text-gray-6">
              {vendors.filter(v => v.status === 'approved').length} aprovados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Pendentes de Aprovação</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">
              {vendors.filter(v => v.status === 'pending').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Vendas Totais</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">
              {formatCurrency(vendors.reduce((sum, v) => sum + v.totalSales, 0))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Avaliação Média</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">
              {(vendors.reduce((sum, v) => sum + v.rating, 0) / vendors.filter(v => v.rating > 0).length || 0).toFixed(1)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-9">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-7 mb-2 block">Buscar</label>
              <Input
                placeholder="Nome da empresa, contato, NUIT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-7 mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="approved">Aprovado</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="rejected">Rejeitado</SelectItem>
                  <SelectItem value="suspended">Suspenso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
                variant="outline"
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendors Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-9">
            Vendedores ({filteredVendors.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Empresa</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Contato</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">NUIT</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Vendas</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Avaliação</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                          <Building className="w-6 h-6 text-gray-4" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-9">{vendor.businessName}</p>
                          <p className="text-sm text-gray-6">{vendor.totalProducts} produtos</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-9">
                          {vendor.contactPerson.firstName} {vendor.contactPerson.lastName}
                        </p>
                        <p className="text-sm text-gray-6">{vendor.contactPerson.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-7">{vendor.cnpj}</p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-9">{formatCurrency(vendor.totalSales)}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-gray-7">
                          {vendor.rating > 0 ? vendor.rating.toFixed(1) : 'N/A'} ({vendor.reviewCount})
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(vendor.status)}>
                        {getStatusText(vendor.status)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => router.push(`/admin/vendedores/${vendor.id}`)}
                          size="sm"
                          variant="outline"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Select
                          value={vendor.status}
                          onValueChange={(value) => handleUpdateStatus(vendor.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="approved">Aprovado</SelectItem>
                            <SelectItem value="pending">Pendente</SelectItem>
                            <SelectItem value="rejected">Rejeitado</SelectItem>
                            <SelectItem value="suspended">Suspenso</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredVendors.length === 0 && (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-gray-4 mx-auto mb-4" />
              <p className="text-gray-6">Nenhum vendedor encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
} 