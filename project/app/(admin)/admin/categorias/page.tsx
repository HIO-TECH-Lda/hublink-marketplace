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
  MoreVertical,
  Building
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-6 mb-1">Total</p>
                  <p className="text-xl font-bold text-gray-9">{stats.total.toLocaleString()}</p>
                </div>
                <Tag className="w-5 h-5 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-6 mb-1">Ativas</p>
                  <p className="text-xl font-bold text-green-600">{stats.active.toLocaleString()}</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-6 mb-1">Inativas</p>
                  <p className="text-xl font-bold text-gray-600">{stats.inactive.toLocaleString()}</p>
                </div>
                <XCircle className="w-5 h-5 text-gray-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-6 mb-1">Total Produtos</p>
                  <p className="text-xl font-bold text-blue-600">{stats.totalProducts.toLocaleString()}</p>
                </div>
                <Package className="w-5 h-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-4 w-4 h-4" />
              <Input
                placeholder="Buscar por nome, descrição ou slug..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
            {(searchTerm || statusFilter !== 'all') && (
              <Button 
                type="button"
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setPage(1);
                }}
              >
                Limpar
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-9">
            Categorias ({categoriesData?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Categoria</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Slug</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Categoria Pai</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Produtos</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Criada em</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Ações</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
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
                        <div>
                          <p className="font-medium text-gray-9">{category.name}</p>
                          {category.description && (
                            <p className="text-sm text-gray-6 line-clamp-1">{category.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <code className="text-xs text-gray-6 bg-gray-100 px-2 py-1 rounded">
                        {category.slug}
                      </code>
                    </td>
                    <td className="py-4 px-4">
                      {category.parent ? (
                        <div className="flex items-center">
                          <Building className="w-4 h-4 text-gray-4 mr-1" />
                          <span className="text-sm text-gray-7">{category.parent.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-5">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Package className="w-4 h-4 text-gray-4 mr-1" />
                        <span className="text-sm text-gray-7">{category.productCount}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(category.isActive)}>
                        {getStatusText(category.isActive)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-6">{formatDate(category.createdAt)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => router.push(`/admin/categorias/${category.id}`)}
                          size="sm"
                          variant="outline"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/categorias/${category.id}/editar`)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleToggleStatus(category.id, category.isActive)}
                              disabled={updateStatus.isPending}
                            >
                              {category.isActive ? (
                                <>
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Desativar
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Ativar
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteCategory(category.id, category.name)}
                              className="text-red-600"
                              disabled={deleteCategory.isPending}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

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
