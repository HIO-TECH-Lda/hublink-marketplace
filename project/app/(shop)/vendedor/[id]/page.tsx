'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { 
  Building, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Package, 
  Users, 
  Calendar,
  ArrowLeft,
  Filter,
  Grid,
  List,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/common/ProductCard';
import { Product } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { formatCurrency } from '@/lib/payment';
import { useSellerProfile, useSellerProducts } from '@/hooks/useSellers';

export default function SellerProfilePage() {
  const params = useParams();
  const sellerId = params.id as string;
  const { state } = useMarketplace();
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [productsPage, setProductsPage] = useState(1);

  const { data: seller, isLoading: sellerLoading } = useSellerProfile(sellerId);
  const { data: productsData, isLoading: productsLoading } = useSellerProducts(sellerId, {
    page: productsPage,
    limit: 12,
    sortBy,
      sortOrder: 'desc'
  });

  const products = productsData?.products || [];
  const productsPagination = productsData?.pagination;
  const isLoading = sellerLoading || productsLoading;

  if (sellerLoading) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-6">Carregando perfil do vendedor...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <Building className="w-16 h-16 text-gray-4 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Vendedor não encontrado</h1>
          <p className="text-gray-6 mb-8">O vendedor que você está procurando não existe.</p>
          <Link href="/loja">
            <Button className="bg-primary hover:bg-primary-hard text-white">
              <ArrowLeft size={16} className="mr-2" />
              Voltar para as Compras
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / 
          <Link href="/loja" className="hover:text-primary"> Comprar</Link> / 
          <span className="text-primary break-words">{seller.businessName}</span>
        </nav>

        {/* Seller Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-primary to-primary-hard relative">
            {seller.coverImage && (
              <img
                src={seller.coverImage}
                alt={seller.businessName}
                className="w-full h-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          {/* Seller Info */}
          <div className="relative px-6 pb-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col sm:flex-row sm:items-end space-y-4 sm:space-y-0 sm:space-x-4 -mt-16 sm:-mt-20">
                {/* Logo */}
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-lg shadow-lg flex items-center justify-center border-4 border-white flex-shrink-0">
                  {seller.logo ? (
                    <img
                      src={seller.logo}
                      alt={seller.businessName}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Building className="w-12 h-12 text-primary" />
                  )}
                </div>

                {/* Basic Info */}
                <div className="flex-1 min-w-0">
                  <h1 className="inline-block px-3 py-1 rounded-lg bg-white/90 shadow-sm text-2xl sm:text-3xl font-bold text-gray-9 mb-2 break-words">
                    {seller.businessName}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-gray-6 flex-wrap">
                    {/* Rating with Stars */}
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= Math.round(seller.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-300 text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-gray-9">{seller.rating.toFixed(1)}</span>
                      <span className="text-gray-500">({seller.totalReviews.toLocaleString()} avaliações)</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      <span>{(seller.totalProducts || 0).toLocaleString()} produtos</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{seller.totalSales.toLocaleString()} vendas</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Desde {new Date(seller.memberSince).toLocaleDateString('pt-MZ', { month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Badges */}
              <div className="mt-4 lg:mt-0 lg:ml-4 flex flex-wrap gap-2">
                {seller.isVerified && (
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200">
                    <Star className="w-3 h-3 mr-1 fill-blue-700" />
                    Verificado
                  </Badge>
                )}
                {seller.isFeatured && (
                  <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-200">
                    <Star className="w-3 h-3 mr-1 fill-purple-700" />
                    Destaque
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="w-5 h-5 mr-2 flex-shrink-0" />
                  Sobre
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-7 text-sm leading-relaxed">
                  {seller.description}
                </p>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {seller.contactEmail && (
                  <div className="flex items-start space-x-2">
                    <Mail className="w-4 h-4 text-gray-4 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-7 break-all">{seller.contactEmail}</span>
                  </div>
                )}
                {seller.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-4 flex-shrink-0" />
                    <span className="text-sm text-gray-7">{seller.phone}</span>
                  </div>
                )}
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 text-gray-4 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-7 min-w-0">
                    <p className="break-words">{seller.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Desempenho</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Rating */}
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-700 mb-1">
                      {seller.rating.toFixed(1)}
                    </div>
                    <div className="flex justify-center mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(seller.rating)
                              ? 'fill-yellow-500 text-yellow-500'
                              : 'fill-gray-300 text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-gray-600">
                      {seller.totalReviews.toLocaleString()} avaliações
                    </div>
                  </div>
                </div>

                {/* Sales & Products */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200 text-center">
                    <div className="text-2xl font-bold text-green-700">
                      {seller.totalSales.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Vendas</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
                    <div className="text-2xl font-bold text-blue-700">
                      {(seller.totalProducts || 0).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">Produtos</div>
                  </div>
                </div>

                {/* Additional Statistics */}
                {seller.statistics && (
                  <div className="space-y-3 pt-3 border-t">
                    {seller.statistics.avgResponseTime && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Tempo de Resposta:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {seller.statistics.avgResponseTime}
                        </span>
                      </div>
                    )}
                    {seller.statistics.responseRate && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Taxa de Resposta:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {seller.statistics.responseRate}%
                        </span>
                      </div>
                    )}
                    {seller.statistics.avgShippingTime && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Tempo de Envio:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {seller.statistics.avgShippingTime}
                        </span>
                      </div>
                    )}
                    {seller.statistics.successfulOrders && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-600">Pedidos Bem-Sucedidos:</span>
                        <span className="text-sm font-medium text-gray-900">
                          {seller.statistics.successfulOrders.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Policies */}
            {seller.policies && (
              <Card>
                <CardHeader>
                  <CardTitle>Políticas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {seller.policies.returns && (
                    <div>
                      <div className="font-medium text-gray-900 mb-1">Devoluções</div>
                      <div className="text-gray-600">{seller.policies.returns}</div>
                    </div>
                  )}
                  {seller.policies.shipping && (
                    <div>
                      <div className="font-medium text-gray-900 mb-1">Envio</div>
                      <div className="text-gray-600">{seller.policies.shipping}</div>
                    </div>
                  )}
                  {seller.policies.warranty && (
                    <div>
                      <div className="font-medium text-gray-900 mb-1">Garantia</div>
                      <div className="text-gray-600">{seller.policies.warranty}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* Products Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-gray-9 mb-1 break-words">
                  Produtos de {seller.businessName}
                </h2>
                <p className="text-gray-6">
                  {products.length} produto{products.length !== 1 ? 's' : ''} encontrado{products.length !== 1 ? 's' : ''}
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Mais Populares</SelectItem>
                    <SelectItem value="price">Menor Preço</SelectItem>
                    <SelectItem value="rating">Melhor Avaliação</SelectItem>
                    <SelectItem value="name">Nome A-Z</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-1 border border-gray-2 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="w-8 h-8 p-0"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="w-8 h-8 p-0"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {productsLoading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : products.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-4'
              }>
                {products.map((product: any) => (
                  <ProductCard
                    key={product.id || product._id}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <Package className="w-16 h-16 text-gray-3 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-7 mb-2">
                    Nenhum produto encontrado
                  </h3>
                  <p className="text-gray-5">
                    Este vendedor ainda não possui produtos cadastrados.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 