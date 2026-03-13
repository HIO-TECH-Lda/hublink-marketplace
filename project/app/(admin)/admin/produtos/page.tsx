'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  Search, 
  Eye, 
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Store,
  Tag,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  useAdminProducts, 
  useAdminProductStats, 
  useUpdateProductStatus,
  useDeleteProduct 
} from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';

export default function ProductManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data: stats } = useAdminProductStats();
  const { data: productsData, isLoading } = useAdminProducts({
    page,
    limit,
    search: searchTerm || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  const updateStatus = useUpdateProductStatus();
  const deleteProduct = useDeleteProduct();

  const products = productsData?.products || [];
  const pagination = {
    page: productsData?.page || 1,
    totalPages: productsData?.totalPages || 1,
    total: productsData?.total || 0,
    limit: productsData?.limit || limit
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('pt-MZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      draft: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      active: 'bg-green-100 text-green-800 border-green-300',
      inactive: 'bg-gray-100 text-gray-800 border-gray-300',
      archived: 'bg-red-100 text-red-800 border-red-300'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      draft: 'Pendente',
      active: 'Ativo',
      inactive: 'Inativo',
      archived: 'Rejeitado'
    };
    return statusMap[status] || status;
  };

  const handleStatusChange = async (productId: string, newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ productId, status: newStatus });
      toast({
        title: 'Status atualizado',
        description: 'O status do produto foi atualizado com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Falha ao atualizar status',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
      await deleteProduct.mutateAsync(productId);
      toast({
        title: 'Produto excluído',
        description: 'O produto foi excluído com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Falha ao excluir produto',
        variant: 'destructive',
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const total = pagination.totalPages;
    const current = pagination.page;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(total);
      } else if (current >= total - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = total - 3; i <= total; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(total);
      }
    }
    return pages;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-6">Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Produtos</h1>
            <p className="text-gray-6">Gerencie produtos da plataforma</p>
          </div>
          <Button onClick={() => router.push('/admin/produtos/novo')}>
            <Package className="w-4 h-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 sm:gap-6 mb-6">
        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-6 mb-1">Total</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-9 break-words">
                  {stats?.total.toLocaleString() || 0}
                </p>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-gray-4" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-6 mb-1">Ativos</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600 break-words">
                  {stats?.active.toLocaleString() || 0}
                </p>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-6 mb-1">Pendentes</p>
                <p className="text-xl sm:text-2xl font-bold text-yellow-600 break-words">
                  {stats?.pending.toLocaleString() || 0}
                </p>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-6 mb-1">Rejeitados</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600 break-words">
                  {stats?.rejected.toLocaleString() || 0}
                </p>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm text-gray-6 mb-1">Avaliação Média</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-9 break-words">
                  {stats?.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
                </p>
              </div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-4 w-4 h-4" />
              <Input
                placeholder="Buscar por nome, SKU, vendedor..."
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
                <SelectItem value="draft">Pendente</SelectItem>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="archived">Rejeitado</SelectItem>
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
                <Filter className="w-4 h-4 mr-2" />
                Limpar
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Produtos</CardTitle>
            <span className="text-sm text-gray-6">{pagination.total.toLocaleString()} total</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {products.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-9 mb-1">Nenhum produto encontrado</h3>
              <p className="text-sm text-gray-6">Tente ajustar os filtros de busca</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-2 bg-gray-50">
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-7">Produto</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-7">Vendedor</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-7">Categoria</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-7">Preço</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-7">Estoque</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-7">Avaliação</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-7">Status</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-gray-7">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product: any) => (
                      <tr 
                        key={product.id || product._id} 
                        className="border-b border-gray-2 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            {product.primaryImage ? (
                              <img
                                src={product.primaryImage}
                                alt={product.name}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-4" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-sm text-gray-9">{product.name}</p>
                              {product.isFeatured && (
                                <Badge variant="outline" className="text-xs mt-0.5">Destaque</Badge>
                              )}
                              {product.isBestSeller && (
                                <Badge variant="outline" className="text-xs mt-0.5">Mais Vendido</Badge>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Store className="w-3 h-3 text-gray-4" />
                            <div>
                              <p className="text-sm font-medium text-gray-9">
                                {product.seller?.name || 'N/A'}
                              </p>
                              {product.seller?.email && (
                                <p className="text-xs text-gray-5">{product.seller.email}</p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Tag className="w-3 h-3 text-gray-4" />
                            <Badge variant="outline" className="text-xs">
                              {product.category?.name || 'N/A'}
                            </Badge>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-sm text-gray-9">
                            {formatCurrency(product.price)}
                          </span>
                          {product.currency && product.currency !== 'MZN' && (
                            <p className="text-xs text-gray-5">{product.currency}</p>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <span className={`text-sm font-medium ${
                              product.stock < 10 ? 'text-red-600' : 'text-gray-9'
                            }`}>
                              {product.stock || 0}
                            </span>
                            {product.stock < 10 && product.stock > 0 && (
                              <AlertCircle className="w-3 h-3 text-red-600" />
                            )}
                            {product.stock === 0 && (
                              <Badge variant="destructive" className="text-xs">Sem estoque</Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {product.averageRating > 0 ? (
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="text-sm text-gray-7">
                                {product.averageRating.toFixed(1)}
                              </span>
                              <span className="text-xs text-gray-5">
                                ({product.totalReviews || 0})
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-5">Sem avaliações</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={`${getStatusColor(product.status)} border`}>
                            {getStatusText(product.status)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/admin/produtos/${product.id || product._id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => router.push(`/admin/produtos/${product.id || product._id}/editar`)}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                {product.status !== 'active' && (
                                  <DropdownMenuItem
                                    onClick={() => handleStatusChange(product.id || product._id, 'active')}
                                    disabled={updateStatus.isPending}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                    Ativar
                                  </DropdownMenuItem>
                                )}
                                {product.status !== 'draft' && (
                                  <DropdownMenuItem
                                    onClick={() => handleStatusChange(product.id || product._id, 'draft')}
                                    disabled={updateStatus.isPending}
                                  >
                                    <Clock className="w-4 h-4 mr-2 text-yellow-600" />
                                    Marcar como Pendente
                                  </DropdownMenuItem>
                                )}
                                {product.status !== 'inactive' && (
                                  <DropdownMenuItem
                                    onClick={() => handleStatusChange(product.id || product._id, 'inactive')}
                                    disabled={updateStatus.isPending}
                                  >
                                    <XCircle className="w-4 h-4 mr-2 text-gray-600" />
                                    Desativar
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => handleDeleteProduct(product.id || product._id)}
                                  disabled={deleteProduct.isPending}
                                  className="text-red-600"
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
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

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="border-t border-gray-2 px-4 py-3">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-6">
                      Mostrando {(pagination.page - 1) * pagination.limit + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(1)}
                        disabled={pagination.page === 1}
                      >
                        Primeira
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={pagination.page === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      {getPageNumbers().map((pageNum, idx) => (
                        <Button
                          key={idx}
                          variant={pageNum === pagination.page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => typeof pageNum === 'number' && setPage(pageNum)}
                          disabled={pageNum === '...'}
                          className="min-w-[40px]"
                        >
                          {pageNum}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                        disabled={pagination.page >= pagination.totalPages}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(pagination.totalPages)}
                        disabled={pagination.page >= pagination.totalPages}
                      >
                        Última
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
}
