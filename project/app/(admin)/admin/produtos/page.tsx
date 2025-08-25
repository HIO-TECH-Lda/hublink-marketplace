'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  Search, 
  Eye, 
  Edit, 
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Star,
  ArrowLeft,
  Filter
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMarketplace } from '@/contexts/MarketplaceContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  seller: {
    id: string;
    name: string;
    businessName: string;
  };
  status: 'active' | 'inactive' | 'pending' | 'rejected';
  rating: number;
  reviewCount: number;
  stock: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProductManagementPage() {
  const router = useRouter();
  const { state } = useMarketplace();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, statusFilter, categoryFilter]);

  const loadProducts = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Smartphone Samsung Galaxy A54',
        description: 'Smartphone Samsung Galaxy A54 128GB, 8GB RAM, Tela 6.4", Câmera Tripla 50MP, Android 13.',
        price: 450.00,
        category: 'Eletrônicos',
        seller: {
          id: '1',
          name: 'João Silva',
          businessName: 'TechStore'
        },
        status: 'active',
        rating: 4.8,
        reviewCount: 25,
        stock: 15,
        image: '/images/smartphone.jpg',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-20T14:25:00Z'
      },
      {
        id: '2',
        name: 'Tênis Nike Air Max',
        description: 'Tênis Nike Air Max para corrida e esportes, confortável e durável',
        price: 299.90,
        category: 'Esportes',
        seller: {
          id: '2',
          name: 'Maria Santos',
          businessName: 'SportStore'
        },
        status: 'pending',
        rating: 0,
        reviewCount: 0,
        stock: 8,
        image: '/images/tenis.jpg',
        createdAt: '2024-01-20T09:15:00Z',
        updatedAt: '2024-01-20T09:15:00Z'
      },
      {
        id: '3',
        name: 'Camiseta Básica Algodão',
        description: 'Camiseta básica 100% algodão, confortável e versátil',
        price: 29.90,
        category: 'Moda',
        seller: {
          id: '3',
          name: 'Pedro Oliveira',
          businessName: 'FashionStore'
        },
        status: 'active',
        rating: 4.5,
        reviewCount: 18,
        stock: 50,
        image: '/images/camiseta.jpg',
        createdAt: '2024-01-10T11:20:00Z',
        updatedAt: '2024-01-18T16:45:00Z'
      },
      {
        id: '4',
        name: 'Smartwatch Apple Watch',
        description: 'Smartwatch Apple Watch Series 8, GPS, monitor cardíaco',
        price: 899.90,
        category: 'Eletrônicos',
        seller: {
          id: '1',
          name: 'João Silva',
          businessName: 'TechStore'
        },
        status: 'rejected',
        rating: 0,
        reviewCount: 0,
        stock: 0,
        image: '/images/smartwatch.jpg',
        createdAt: '2024-01-19T08:30:00Z',
        updatedAt: '2024-01-19T15:20:00Z'
      },
      {
        id: '5',
        name: 'Livro "O Poder do Hábito"',
        description: 'Livro best-seller sobre desenvolvimento pessoal e produtividade',
        price: 45.00,
        category: 'Livros',
        seller: {
          id: '4',
          name: 'Ana Costa',
          businessName: 'BookStore'
        },
        status: 'active',
        rating: 4.7,
        reviewCount: 32,
        stock: 25,
        image: '/images/livro.jpg',
        createdAt: '2024-01-12T14:20:00Z',
        updatedAt: '2024-01-18T10:15:00Z'
      },
      {
        id: '6',
        name: 'Perfume Masculino',
        description: 'Perfume masculino com fragrância duradoura e elegante',
        price: 89.90,
        category: 'Beleza',
        seller: {
          id: '5',
          name: 'Carlos Mendes',
          businessName: 'BeautyStore'
        },
        status: 'active',
        rating: 4.3,
        reviewCount: 12,
        stock: 20,
        image: '/images/perfume.jpg',
        createdAt: '2024-01-16T16:45:00Z',
        updatedAt: '2024-01-19T09:30:00Z'
      }
    ];

    setProducts(mockProducts);
    setIsLoading(false);
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.seller.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(product => product.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    setFilteredProducts(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'pending': return 'Pendente';
      case 'rejected': return 'Rejeitado';
      case 'inactive': return 'Inativo';
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

  const handleUpdateStatus = (productId: string, newStatus: string) => {
    setProducts(prevProducts =>
      prevProducts.map(product =>
        product.id === productId
          ? { ...product, status: newStatus as Product['status'], updatedAt: new Date().toISOString() }
          : product
      )
    );
  };

  const getCategories = () => {
    const categories = Array.from(new Set(products.map(product => product.category)));
    return categories;
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando produtos...</p>
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
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Gerenciamento de Produtos</h1>
            <p className="text-gray-6">Modere e gerencie produtos da plataforma</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={() => router.push('/admin/produtos/novo')}>
              <Package className="w-4 h-4 mr-2" />
              Novo Produto
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
            <CardTitle className="text-sm font-medium text-gray-6">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">{products.length}</div>
            <p className="text-xs text-gray-6">
              {products.filter(p => p.status === 'active').length} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Produtos Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">
              {products.filter(p => p.status === 'pending').length}
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
              {(products.reduce((sum, p) => sum + p.rating, 0) / products.filter(p => p.rating > 0).length || 0).toFixed(1)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Produtos Rejeitados</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">
              {products.filter(p => p.status === 'rejected').length}
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-7 mb-2 block">Buscar</label>
              <Input
                placeholder="Nome do produto, vendedor..."
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
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="rejected">Rejeitado</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-7 mb-2 block">Categoria</label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {getCategories().map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
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

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-9">
            Produtos ({filteredProducts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Produto</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Vendedor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Categoria</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Preço</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Avaliação</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg mr-3 flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-4" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-9">{product.name}</p>
                          <p className="text-sm text-gray-6">Estoque: {product.stock}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-9">{product.seller.businessName}</p>
                        <p className="text-sm text-gray-6">{product.seller.name}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline">{product.category}</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-9">{formatCurrency(product.price)}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="text-sm text-gray-7">
                          {product.rating > 0 ? product.rating.toFixed(1) : 'N/A'} ({product.reviewCount})
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(product.status)}>
                        {getStatusText(product.status)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => router.push(`/admin/produtos/${product.id}`)}
                          size="sm"
                          variant="outline"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Select
                          value={product.status}
                          onValueChange={(value) => handleUpdateStatus(product.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Ativo</SelectItem>
                            <SelectItem value="pending">Pendente</SelectItem>
                            <SelectItem value="rejected">Rejeitado</SelectItem>
                            <SelectItem value="inactive">Inativo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-4 mx-auto mb-4" />
              <p className="text-gray-6">Nenhum produto encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
} 