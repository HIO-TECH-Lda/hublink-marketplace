'use client';

import React, { useState } from 'react';
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
  XCircle,
  TrendingUp
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  useAdminCategoryStats, 
  useAdminCategories, 
  useUpdateCategoryStatus, 
  useDeleteCategory 
} from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';

export default function CategoryManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data: stats, isLoading: statsLoading } = useAdminCategoryStats();
  const { data: categoriesData, isLoading: categoriesLoading } = useAdminCategories({
    page,
    limit,
    search: searchTerm || undefined,
    isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const updateStatus = useUpdateCategoryStatus();
  const deleteCategory = useDeleteCategory();

  const categories = categoriesData?.categories || [];
  const isLoading = statsLoading || categoriesLoading;

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Ativo' : 'Inativo';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-MZ');
  };

  const handleToggleStatus = (categoryId: string, currentStatus: boolean) => {
    updateStatus.mutate({ categoryId, isActive: !currentStatus });
  };

  const handleDeleteCategory = (categoryId: string, categoryName: string) => {
    if (confirm(`Tem certeza que deseja excluir a categoria "${categoryName}"?`)) {
      deleteCategory.mutate(categoryId);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const totalPages = categoriesData?.totalPages || 1;

  if (isLoading && !categoriesData) {
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
          <div className="flex gap-2">
            <Button onClick={() => router.push('/admin/categorias/novo')}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Categoria
            </Button>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-6">Total de Categorias</CardTitle>
              <Tag className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-9">{stats.total}</div>
              <p className="text-xs text-gray-6">
                {stats.active} ativas
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
                {stats.active}
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
                {stats.totalProducts}
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
                {stats.inactive}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-9">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-7 mb-2 block">Buscar</label>
              <Input
                placeholder="Nome, descrição ou slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-7 mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={(value) => { setStatusFilter(value); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os status</SelectItem>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button type="submit" className="flex-1">
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
              <Button 
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setPage(1);
                }}
                variant="outline"
              >
                Limpar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                    {category.image ? (
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Tag className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{category.name}</CardTitle>
                    <Badge className={getStatusColor(category.isActive)}>
                      {getStatusText(category.isActive)}
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
                    onClick={() => handleDeleteCategory(category.id, category.name)}
                    size="sm"
                    variant="outline"
                    className="text-red-600 hover:text-red-700"
                    disabled={deleteCategory.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {category.description && (
                <p className="text-gray-6 mb-4 line-clamp-2">{category.description}</p>
              )}
              <div className="flex items-center justify-between text-sm mb-4">
                <div className="flex items-center">
                  <Package className="w-4 h-4 text-gray-4 mr-1" />
                  <span className="text-gray-6">{category.productCount} produtos</span>
                </div>
                {category.parent && (
                  <Badge variant="outline" className="text-xs">
                    {category.parent.name}
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-gray-5 mb-4">
                <span>Slug: {category.slug}</span>
                <span>{formatDate(category.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <Button
                  onClick={() => handleToggleStatus(category.id, category.isActive)}
                  size="sm"
                  variant={category.isActive ? 'outline' : 'default'}
                  className={category.isActive ? 'text-red-600 hover:text-red-700' : ''}
                  disabled={updateStatus.isPending}
                >
                  {category.isActive ? 'Desativar' : 'Ativar'}
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

      {categories.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-4 mx-auto mb-4" />
            <p className="text-gray-6">Nenhuma categoria encontrada</p>
            {searchTerm && (
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setPage(1);
                }}
                variant="outline"
                className="mt-4"
              >
                Limpar Busca
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <p className="text-sm text-gray-6">
            Página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
