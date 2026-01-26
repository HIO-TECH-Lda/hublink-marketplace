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
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-9 mb-2 break-words">
                    {seller.businessName}
                  </h1>
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-gray-6">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-warning fill-warning flex-shrink-0" />
                      <span>{seller.rating}</span>
                      <span>({seller.totalReviews} avaliações)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Package className="w-4 h-4 flex-shrink-0" />
                      <span>{seller.totalProducts || 0} produtos</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>Membro desde {new Date(seller.memberSince).toLocaleDateString('pt-MZ')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mt-4 lg:mt-0 lg:ml-4">
                <Badge 
                  variant={seller.isVerified ? 'default' : 'secondary'}
                  className="text-sm"
                >
                  {seller.isVerified ? 'Verificado' : 'Pendente'}
                </Badge>
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

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-6">Vendas Totais:</span>
                  <span className="font-medium">{seller.totalSales}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-6">Produtos:</span>
                  <span className="font-medium">{seller.totalProducts || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-6">Avaliação:</span>
                  <span className="font-medium">{seller.rating}/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-6">Avaliações:</span>
                  <span className="font-medium">{seller.totalReviews}</span>
                </div>
              </CardContent>
            </Card>
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