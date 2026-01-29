'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Tag, 
  Edit, 
  ArrowLeft, 
  Package,
  Calendar,
  TrendingUp,
  Eye,
  Plus,
  Image as ImageIcon,
  Star,
  Store
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminCategory, useUpdateCategoryStatus } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/finance-utils';

export default function CategoryDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const categoryId = params.id as string;
  
  const { data: category, isLoading } = useAdminCategory(categoryId);
  const updateStatus = useUpdateCategoryStatus();

  const getStatusColor = (isActive: boolean) => {
    return isActive ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100';
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? 'Ativo' : 'Inativo';
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

  const handleToggleStatus = () => {
    if (category) {
      updateStatus.mutate({ categoryId, isActive: !category.isActive });
    }
  };

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando detalhes da categoria...</p>
          </div>
        </div>
      </>
    );
  }

  if (!category) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Tag className="w-12 h-12 text-gray-4 mx-auto mb-4" />
            <p className="text-gray-6">Categoria não encontrada</p>
            <Button onClick={() => router.back()} className="mt-4">
              Voltar
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">{category.name}</h1>
            {category.description && (
              <p className="text-gray-6">{category.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.push(`/admin/categorias/${categoryId}/editar`)}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Status</CardTitle>
            <Tag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(category.isActive)}>
              {getStatusText(category.isActive)}
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Tag className="w-5 h-5 mr-2" />
                Status da Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Badge className={getStatusColor(category.isActive)}>
                    {getStatusText(category.isActive)}
                  </Badge>
                  <p className="text-sm text-gray-6 mt-2">
                    Última atualização: {formatDate(category.updatedAt)}
                  </p>
                </div>
                <Button
                  onClick={handleToggleStatus}
                  variant={category.isActive ? 'outline' : 'default'}
                  disabled={updateStatus.isPending}
                >
                  {category.isActive ? 'Desativar' : 'Ativar'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Category Information */}
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
                  <p className="text-gray-9 font-medium">{category.name}</p>
                </div>
                {category.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-7">Descrição</label>
                    <p className="text-gray-9">{category.description}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-7">Slug</label>
                  <p className="text-gray-9 font-mono">{category.slug}</p>
                </div>
                {category.image && (
                  <div>
                    <label className="text-sm font-medium text-gray-7">Imagem</label>
                    <div className="mt-2">
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>
                  </div>
                )}
                {category.icon && (
                  <div>
                    <label className="text-sm font-medium text-gray-7">Ícone</label>
                    <p className="text-gray-9">{category.icon}</p>
                  </div>
                )}
                {category.parent && (
                  <div>
                    <label className="text-sm font-medium text-gray-7">Categoria Pai</label>
                    <p className="text-gray-9">{category.parent.name}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-7">Nível</label>
                    <p className="text-gray-9">{category.level}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7">Ordem</label>
                    <p className="text-gray-9">{category.sortOrder}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-7">Em Destaque</label>
                    <p className="text-gray-9">{category.isFeatured ? 'Sim' : 'Não'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO Information */}
          {(category.metaTitle || category.metaDescription || category.keywords) && (
            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {category.metaTitle && (
                    <div>
                      <label className="text-sm font-medium text-gray-7">Meta Título</label>
                      <p className="text-gray-9">{category.metaTitle}</p>
                    </div>
                  )}
                  {category.metaDescription && (
                    <div>
                      <label className="text-sm font-medium text-gray-7">Meta Descrição</label>
                      <p className="text-gray-9">{category.metaDescription}</p>
                    </div>
                  )}
                  {category.keywords && category.keywords.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-7">Palavras-chave</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {category.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Products List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Produtos nesta Categoria
                </div>
                <Badge variant="secondary">
                  {category.products?.length || 0} produtos
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!category.products || category.products.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-9 mb-2">Nenhum produto encontrado</h3>
                  <p className="text-gray-6 mb-4">Esta categoria ainda não possui produtos.</p>
                  <Button 
                    onClick={() => router.push(`/admin/produtos/novo?category=${categoryId}`)}
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Produto
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {category.products.map((product) => (
                    <div 
                      key={product.id} 
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => router.push(`/admin/produtos/${product.id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                            {product.primaryImage ? (
                              <img 
                                src={product.primaryImage} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-6 h-6 text-gray-4" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-9 mb-1">{product.name}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-6">
                              <div className="flex items-center">
                                <Store className="w-4 h-4 mr-1" />
                                {product.seller.name}
                              </div>
                              <div className="flex items-center">
                                <Package className="w-4 h-4 mr-1" />
                                Estoque: {product.stock}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="font-medium text-gray-9 text-lg">
                              {formatCurrency(product.price)}
                            </p>
                            <div className="flex items-center mt-1">
                              <Star className="w-4 h-4 text-yellow-500 mr-1 fill-yellow-500" />
                              <span className="text-sm text-gray-6">
                                {product.averageRating.toFixed(1)} ({product.totalReviews})
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge className={product.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                              {product.status === 'active' ? 'Ativo' : 'Inativo'}
                            </Badge>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/admin/produtos/${product.id}`);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => router.push(`/admin/categorias/${categoryId}/editar`)}
                className="w-full"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar Categoria
              </Button>
              <Button 
                onClick={() => router.push(`/admin/produtos/novo?category=${categoryId}`)}
                variant="outline"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Produto
              </Button>
              <Button 
                onClick={() => router.push(`/admin/produtos?category=${categoryId}`)}
                variant="outline"
                className="w-full"
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver Produtos
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-6">Total de Produtos:</span>
                  <span className="font-medium">{category.productCount}</span>
                </div>
                {category.childrenCount !== undefined && category.childrenCount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-6">Subcategorias:</span>
                    <span className="font-medium">{category.childrenCount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-6">Nível:</span>
                  <span className="font-medium">{category.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Ordem:</span>
                  <span className="font-medium">{category.sortOrder}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
