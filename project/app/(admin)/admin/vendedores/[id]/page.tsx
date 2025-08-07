'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Shield, 
  User, 
  Building, 
  Star, 
  Edit, 
  Eye,
  Calendar,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Package,
  FileText,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
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
  rating: number;
  reviewCount: number;
  totalSales: number;
  totalProducts: number;
  commissionRate: number;
  logo?: string;
  documents: {
    cnpj: string;
    addressProof: string;
    bankAccount: string;
  };
  createdAt: string;
  updatedAt: string;
  rejectionReason?: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  status: string;
  rating: number;
  reviewCount: number;
  stock: number;
}

export default function VendorDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { state } = useMarketplace();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVendor();
  }, [params.id]);

  const loadVendor = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock vendor data
    const mockVendor: Vendor = {
      id: params.id as string,
      userId: '1',
      businessName: 'Fazenda Verde',
      businessDescription: 'Produtos orgânicos frescos direto da fazenda. Cultivamos com amor e respeito ao meio ambiente, garantindo qualidade e sabor em todos os nossos produtos.',
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
      rating: 4.8,
      reviewCount: 45,
      totalSales: 125000.00,
      totalProducts: 15,
      commissionRate: 10,
      documents: {
        cnpj: '/documents/cnpj.pdf',
        addressProof: '/documents/address.pdf',
        bankAccount: '/documents/bank.pdf'
      },
      createdAt: '2024-01-10T10:30:00Z',
      updatedAt: '2024-01-20T14:25:00Z'
    };

    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Maçãs Orgânicas',
        price: 150.00,
        status: 'active',
        rating: 4.8,
        reviewCount: 25,
        stock: 50
      },
      {
        id: '2',
        name: 'Alface Orgânica',
        price: 55.00,
        status: 'active',
        rating: 4.5,
        reviewCount: 18,
        stock: 30
      },
      {
        id: '3',
        name: 'Tomates Orgânicos',
        price: 125.00,
        status: 'pending',
        rating: 0,
        reviewCount: 0,
        stock: 20
      }
    ];

    setVendor(mockVendor);
    setProducts(mockProducts);
    setIsLoading(false);
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
    return new Date(dateString).toLocaleString('pt-MZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleUpdateStatus = (newStatus: string) => {
    if (vendor) {
      setVendor({
        ...vendor,
        status: newStatus as Vendor['status'],
        updatedAt: new Date().toISOString()
      });
    }
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
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Detalhes do Vendedor</h1>
            <p className="text-gray-6">{vendor.businessName}</p>
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
                  <Badge className={`${getStatusColor(vendor.status)} text-sm`}>
                    {getStatusText(vendor.status)}
                  </Badge>
                  <p className="text-sm text-gray-6 mt-2">
                    Última atualização: {formatDate(vendor.updatedAt)}
                  </p>
                </div>
                <Select value={vendor.status} onValueChange={handleUpdateStatus}>
                  <SelectTrigger className="w-40">
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
                  <p className="text-gray-9 font-medium">{vendor.businessName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-7">Descrição</label>
                  <p className="text-gray-9">{vendor.businessDescription}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-7">CNPJ</label>
                  <p className="text-gray-9 font-medium">{vendor.cnpj}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-7">Taxa de Comissão</label>
                  <p className="text-gray-9 font-medium">{vendor.commissionRate}%</p>
                </div>
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
                  <p className="text-gray-9 font-medium">
                    {vendor.contactPerson.firstName} {vendor.contactPerson.lastName}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-7">Email</label>
                    <p className="text-gray-9">{vendor.contactPerson.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7">Telefone</label>
                    <p className="text-gray-9">{vendor.contactPerson.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-gray-9">
                  {vendor.address.street}, {vendor.address.number}
                  {vendor.address.complement && `, ${vendor.address.complement}`}
                </p>
                <p className="text-gray-6">{vendor.address.neighborhood}</p>
                <p className="text-gray-6">
                  {vendor.address.city}, {vendor.address.state} - {vendor.address.zipCode}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Produtos ({products.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4 flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-9">{product.name}</p>
                        <p className="text-sm text-gray-6">
                          Estoque: {product.stock} | Avaliação: {product.rating}/5 ({product.reviewCount})
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-9">{formatCurrency(product.price)}</p>
                      <Badge className={getStatusColor(product.status)}>
                        {getStatusText(product.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
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
                <DollarSign className="w-5 h-5 mr-2" />
                Estatísticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-6">Avaliação:</span>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                    <span className="font-medium">{vendor.rating}/5</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Total de Avaliações:</span>
                  <span className="font-medium">{vendor.reviewCount}</span>
                </div>
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

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Documentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  CNPJ
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Comprovante de Endereço
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Dados Bancários
                </Button>
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
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="text-sm font-medium">Vendedor Registrado</p>
                    <p className="text-xs text-gray-6">{formatDate(vendor.createdAt)}</p>
                  </div>
                </div>
                {vendor.status === 'approved' && (
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium">Aprovado</p>
                      <p className="text-xs text-gray-6">{formatDate(vendor.updatedAt)}</p>
                    </div>
                  </div>
                )}
                {vendor.status === 'rejected' && (
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium">Rejeitado</p>
                      <p className="text-xs text-gray-6">{formatDate(vendor.updatedAt)}</p>
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