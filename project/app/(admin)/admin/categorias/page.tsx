'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Tag, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Package,
  ArrowLeft,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export default function CategoryManagementPage() {
  const router = useRouter();
  const { state } = useMarketplace();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    filterCategories();
  }, [categories, searchTerm]);

  const loadCategories = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockCategories: Category[] = [
      {
        id: '1',
        name: 'Frutas',
        description: 'Frutas frescas e orgânicas',
        slug: 'frutas',
        status: 'active',
        productCount: 25,
        createdAt: '2024-01-10T10:30:00Z',
        updatedAt: '2024-01-20T14:25:00Z'
      },
      {
        id: '2',
        name: 'Legumes',
        description: 'Legumes orgânicos cultivados localmente',
        slug: 'legumes',
        status: 'active',
        productCount: 18,
        createdAt: '2024-01-10T11:20:00Z',
        updatedAt: '2024-01-19T16:45:00Z'
      },
      {
        id: '3',
        name: 'Verduras',
        description: 'Verduras frescas e nutritivas',
        slug: 'verduras',
        status: 'active',
        productCount: 12,
        createdAt: '2024-01-10T12:15:00Z',
        updatedAt: '2024-01-18T10:30:00Z'
      },
      {
        id: '4',
        name: 'Grãos',
        description: 'Grãos orgânicos e cereais',
        slug: 'graos',
        status: 'inactive',
        productCount: 8,
        createdAt: '2024-01-10T13:45:00Z',
        updatedAt: '2024-01-17T14:20:00Z'
      },
      {
        id: '5',
        name: 'Laticínios',
        description: 'Produtos lácteos orgânicos',
        slug: 'laticinios',
        status: 'active',
        productCount: 15,
        createdAt: '2024-01-10T14:30:00Z',
        updatedAt: '2024-01-20T09:15:00Z'
      }
    ];

    setCategories(mockCategories);
    setIsLoading(false);
  };

  const filterCategories = () => {
    let filtered = categories;

    if (searchTerm) {
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCategories(filtered);
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
    return new Date(dateString).toLocaleDateString('pt-MZ');
  };

  const handleToggleStatus = (categoryId: string) => {
    setCategories(prevCategories =>
      prevCategories.map(category =>
        category.id === categoryId
          ? { 
              ...category, 
              status: category.status === 'active' ? 'inactive' : 'active',
              updatedAt: new Date().toISOString()
            }
          : category
      )
    );
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm('Tem certeza que deseja excluir esta categoria?')) {
      setCategories(prevCategories =>
        prevCategories.filter(category => category.id !== categoryId)
      );
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando categorias...</p>
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
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Gerenciamento de Categorias</h1>
            <p className="text-gray-6">Gerencie as categorias de produtos da plataforma</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Categoria
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Total de Categorias</CardTitle>
            <Tag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">{categories.length}</div>
            <p className="text-xs text-gray-6">
              {categories.filter(c => c.status === 'active').length} ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Categorias Ativas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">
              {categories.filter(c => c.status === 'active').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">
              {categories.reduce((sum, c) => sum + c.productCount, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Categorias Inativas</CardTitle>
            <XCircle className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">
              {categories.filter(c => c.status === 'inactive').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-9">Buscar Categorias</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button 
              onClick={() => setSearchTerm('')}
              variant="outline"
            >
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                    <Tag className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <Badge className={getStatusColor(category.status)}>
                      {getStatusText(category.status)}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    onClick={() => router.push(`/admin/categorias/${category.id}/editar`)}
                    size="sm"
                    variant="outline"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteCategory(category.id)}
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-6 mb-4">{category.description}</p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Package className="w-4 h-4 text-gray-4 mr-1" />
                  <span className="text-gray-6">{category.productCount} produtos</span>
                </div>
                <span className="text-gray-5">{formatDate(category.createdAt)}</span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Button
                  onClick={() => handleToggleStatus(category.id)}
                  size="sm"
                  variant={category.status === 'active' ? 'outline' : 'default'}
                  className={category.status === 'active' ? 'text-red-600 hover:text-red-700' : ''}
                >
                  {category.status === 'active' ? 'Desativar' : 'Ativar'}
                </Button>
                <Button
                  onClick={() => router.push(`/admin/categorias/${category.id}`)}
                  size="sm"
                  variant="outline"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Ver Detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-4 mx-auto mb-4" />
            <p className="text-gray-6">Nenhuma categoria encontrada</p>
            {searchTerm && (
              <Button 
                onClick={() => setSearchTerm('')}
                variant="outline"
                className="mt-4"
              >
                Limpar Busca
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add Category Modal (simplified) */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Nova Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-7">Nome</label>
                  <Input placeholder="Nome da categoria" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-7">Descrição</label>
                  <Input placeholder="Descrição da categoria" />
                </div>
                <div className="flex items-center space-x-2">
                  <Button onClick={() => setShowAddForm(false)} variant="outline">
                    Cancelar
                  </Button>
                  <Button>
                    Criar Categoria
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </AdminLayout>
  );
} 