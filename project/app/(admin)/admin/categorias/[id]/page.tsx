'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Tag, 
  Edit, 
  ArrowLeft, 
  Package,
  Calendar,
  TrendingUp,
  Eye,
  Plus
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMarketplace } from '@/contexts/MarketplaceContext';

interface Category {
  id: string;
  name: string;
  description: string;
  slug: string;
  status: 'active' | 'inactive';
  productCount: number;
  image?: string;
  parentCategory?: string;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  status: 'active' | 'inactive';
  image?: string;
  seller: {
    name: string;
  };
  createdAt: string;
}

export default function CategoryDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { state } = useMarketplace();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCategoryDetails();
  }, [params.id]);

  const loadCategoryDetails = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockCategory: Category = {
      id: params.id as string,
      name: 'Frutas',
      description: 'Frutas frescas e orgânicas cultivadas localmente. Inclui uma variedade de frutas sazonais e tropicais.',
      slug: 'frutas',
      status: 'active',
      productCount: 25,
      createdAt: '2024-01-10T10:30:00Z',
      updatedAt: '2024-01-20T14:25:00Z'
    };

    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Maçãs Vermelhas',
        price: 25.90,
        status: 'active',
        seller: { name: 'Fazenda Orgânica' },
        createdAt: '2024-01-15T08:30:00Z'
      },
      {
        id: '2',
        name: 'Bananas Prata',
        price: 12.50,
        status: 'active',
        seller: { name: 'Produtos Naturais' },
        createdAt: '2024-01-16T10:15:00Z'
      },
      {
        id: '3',
        name: 'Laranjas Doces',
        price: 18.75,
        status: 'active',
        seller: { name: 'Horta Familiar' },
        createdAt: '2024-01-17T14:20:00Z'
      },
      {
        id: '4',
        name: 'Mangas Tommy',
        price: 22.00,
        status: 'inactive',
        seller: { name: 'Frutas Frescas' },
        createdAt: '2024-01-18T09:45:00Z'
      },
      {
        id: '5',
        name: 'Abacaxis',
        price: 35.90,
        status: 'active',
        seller: { name: 'Produtos Tropicais' },
        createdAt: '2024-01-19T11:30:00Z'
      }
    ];

    setCategory(mockCategory);
    setProducts(mockProducts);
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-MZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(price);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando detalhes da categoria...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!category) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Tag className="w-12 h-12 text-gray-4 mx-auto mb-4" />
            <p className="text-gray-6">Categoria não encontrada</p>
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
            <h1 className="text-3xl font-bold text-gray-9 mb-2">{category.name}</h1>
            <p className="text-gray-6">{category.description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button onClick={() => router.push(`/admin/categorias/${category.id}/editar`)}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">{category.productCount}</div>
            <p className="text-xs text-gray-6">
              {products.filter(p => p.status === 'active').length} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-6">Status</CardTitle>
            <Tag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(category.status)}>
              {getStatusText(category.status)}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Criada em</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-gray-9">
              {formatDate(category.createdAt)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Última Atualização</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium text-gray-9">
              {formatDate(category.updatedAt)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Informações da Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-7">Nome</label>
                  <p className="text-gray-9">{category.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-7">Descrição</label>
                  <p className="text-gray-9">{category.description}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-7">Slug</label>
                  <p className="text-gray-9 font-mono">{category.slug}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-7">Status</label>
                  <Badge className={getStatusColor(category.status)}>
                    {getStatusText(category.status)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => router.push(`/admin/categorias/${category.id}/editar`)}
                className="w-full"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar Categoria
              </Button>
              <Button 
                onClick={() => router.push(`/admin/produtos/novo?category=${category.id}`)}
                variant="outline"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Produto
              </Button>
              <Button 
                onClick={() => router.push(`/admin/produtos?category=${category.id}`)}
                variant="outline"
                className="w-full"
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver Todos os Produtos
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Products List */}
      <Card>
        <CardHeader>
          <CardTitle>Produtos nesta Categoria</CardTitle>
          <CardDescription>
            Lista dos produtos associados a esta categoria
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-9 mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-6">Esta categoria ainda não possui produtos.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-4" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-9">{product.name}</h3>
                        <p className="text-sm text-gray-6">Vendedor: {product.seller.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium text-gray-9">{formatPrice(product.price)}</p>
                        <Badge className={getStatusColor(product.status)}>
                          {getStatusText(product.status)}
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
