'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Package, 
  Edit, 
  ArrowLeft, 
  Star,
  Calendar,
  Store,
  Tag,
  DollarSign,
  ShoppingCart,
  Eye,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminProduct, useUpdateProductStatus } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const productId = params.id as string;
  
  const { data: product, isLoading } = useAdminProduct(productId);
  const updateStatus = useUpdateProductStatus();

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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      active: 'Activo',
      inactive: 'Inactivo',
      archived: 'Rejeitado'
    };
    return statusMap[status] || status;
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ productId, status: newStatus });
      toast({
        title: 'Estado actualizado',
        description: 'O estado do produto foi actualizado com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Falha ao actualizar estado',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando produto...</p>
          </div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Package className="w-12 h-12 text-gray-4 mx-auto mb-4" />
            <p className="text-gray-6">Produto não encontrado</p>
            <Button onClick={() => router.push('/admin/produtos')} className="mt-4">
              Voltar para Lista
            </Button>
          </div>
        </div>
      </>
    );
  }

  const productData = product as any;
  const statistics = productData.statistics || {};
  const images = productData.images || [];
  const specifications = productData.specifications || [];
  const tags = productData.tags || [];

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">{productData.name}</h1>
            <p className="text-gray-6">ID: {productData.id || productData._id}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={() => router.push('/admin/produtos')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button onClick={() => router.push(`/admin/produtos/${productId}/editar`)}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Estado do Produto
                </CardTitle>
                <Select
                  value={productData.status}
                  onValueChange={handleStatusChange}
                  disabled={updateStatus.isPending}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Pendente</SelectItem>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                    <SelectItem value="archived">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge className={`${getStatusColor(productData.status)} border`}>
                  {getStatusText(productData.status)}
                </Badge>
                <p className="text-sm text-gray-6">
                  Última actualização: {formatDate(productData.updatedAt)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Product Images */}
          {images.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-5 h-5 mr-2" />
                  Imagens do Produto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {images.map((image: any, index: number) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={image.url || image}
                        alt={image.alt || productData.name}
                        className="w-full h-full object-cover rounded-lg border border-gray-2"
                      />
                      {image.isPrimary && (
                        <Badge className="absolute top-2 right-2">Principal</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Product Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Informações do Produto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-7">Nome</label>
                  <p className="text-gray-9 font-medium mt-1">{productData.name}</p>
                </div>
                {productData.shortDescription && (
                  <div>
                    <label className="text-sm font-medium text-gray-7">Descrição Curta</label>
                    <p className="text-gray-9 mt-1">{productData.shortDescription}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-7">Descrição</label>
                  <p className="text-gray-9 mt-1 whitespace-pre-wrap">{productData.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-7">Preço</label>
                    <p className="text-gray-9 font-medium text-lg mt-1">
                      {formatCurrency(productData.price)}
                    </p>
                    {productData.originalPrice && productData.originalPrice > productData.price && (
                      <p className="text-sm text-gray-5 line-through mt-1">
                        {formatCurrency(productData.originalPrice)}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7">Stock</label>
                    <p className="text-gray-9 font-medium mt-1">
                      {productData.stock || 0} unidades
                    </p>
                    {productData.inStock === false && (
                      <Badge variant="destructive" className="mt-1">Sem stock</Badge>
                    )}
                  </div>
                </div>
                {productData.sku && (
                  <div>
                    <label className="text-sm font-medium text-gray-7">SKU</label>
                    <p className="text-gray-9 font-mono text-sm mt-1">{productData.sku}</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-7">Categoria</label>
                    <div className="mt-1">
                      <Badge variant="outline">
                        {productData.category?.name || 'N/A'}
                      </Badge>
                    </div>
                  </div>
                  {productData.subcategory && (
                    <div>
                      <label className="text-sm font-medium text-gray-7">Subcategoria</label>
                      <div className="mt-1">
                        <Badge variant="outline">
                          {productData.subcategory.name}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
                {tags.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-7">Tags</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {specifications.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-7">Especificações</label>
                    <div className="mt-1 space-y-2">
                      {specifications.map((spec: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-6">{spec.name}:</span>
                          <span className="text-gray-9 font-medium">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          {statistics.totalOrders !== undefined && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Estatísticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-6">Total de Pedidos</p>
                    <p className="text-xl font-bold text-gray-9">{statistics.totalOrders || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-6">Quantidade Vendida</p>
                    <p className="text-xl font-bold text-gray-9">{statistics.totalQuantitySold || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-6">Receita Total</p>
                    <p className="text-xl font-bold text-gray-9">
                      {formatCurrency(statistics.totalRevenue || 0)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-6">Visualizações</p>
                    <p className="text-xl font-bold text-gray-9">{statistics.viewCount || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Seller Info */}
          {productData.seller && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Store className="w-5 h-5 mr-2" />
                  Vendedor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium text-gray-9">
                    {productData.seller.storeName || productData.seller.name}
                  </p>
                  <p className="text-sm text-gray-6">{productData.seller.email}</p>
                  {productData.seller.phone && (
                    <p className="text-sm text-gray-6">{productData.seller.phone}</p>
                  )}
                  {productData.seller.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3"
                      onClick={() => router.push(`/admin/vendedores/${productData.seller.id}`)}
                    >
                      Ver Vendedor
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Rating & Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="w-5 h-5 mr-2" />
                Avaliações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-6">Avaliação Média</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-bold text-lg">
                      {statistics.averageRating ? statistics.averageRating.toFixed(1) : '0.0'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Total de Avaliações</span>
                  <span className="font-medium">{statistics.totalReviews || 0}</span>
                </div>
                {statistics.ratingDistribution && (
                  <div className="space-y-1 pt-2 border-t">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = statistics.ratingDistribution.find((r: any) => r.rating === rating)?.count || 0;
                      const total = statistics.totalReviews || 1;
                      const percentage = (count / total) * 100;
                      return (
                        <div key={rating} className="flex items-center gap-2 text-xs">
                          <span className="w-4">{rating}★</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-gray-6 w-8 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Product Flags */}
          <Card>
            <CardHeader>
              <CardTitle>Marcadores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-6">Destaque</span>
                  {productData.isFeatured ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-6">Mais Vendido</span>
                  {productData.isBestSeller ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-6">Novo</span>
                  {productData.isNewArrival ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-9">Produto Criado</p>
                    <p className="text-xs text-gray-6">{formatDate(productData.createdAt)}</p>
                  </div>
                </div>
                {productData.status === 'active' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-9">Aprovado</p>
                      <p className="text-xs text-gray-6">{formatDate(productData.updatedAt)}</p>
                    </div>
                  </div>
                )}
                {productData.status === 'archived' && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-9">Rejeitado</p>
                      <p className="text-xs text-gray-6">{formatDate(productData.updatedAt)}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-9">Última Actualização</p>
                    <p className="text-xs text-gray-6">{formatDate(productData.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
