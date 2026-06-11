'use client';

import React, { useState } from 'react';
import { Search, Filter, MapPin, Star, Package, TrendingUp, Grid, List, Loader2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SellerCard from '@/components/common/SellerCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSellers } from '@/hooks/useSellers';

export default function SellersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: sellersData, isLoading } = useSellers({
    search: searchTerm || undefined,
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    location: selectedLocation !== 'all' ? selectedLocation : undefined,
    verified: true,
    page: currentPage,
    limit: 12,
    sortBy,
    sortOrder: 'desc',
  });

  const sellers = sellersData?.sellers || [];
  const pagination = sellersData?.pagination;

  // Categories
  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'vegetais', label: 'Vegetais' },
    { value: 'frutas', label: 'Frutas' },
    { value: 'grãos', label: 'Grãos' },
    { value: 'mel', label: 'Mel' },
  ];

  // Locations
  const locations = [
    { value: 'all', label: 'Todas as Localizações' },
    { value: 'Beira', label: 'Beira' },
    { value: 'Maputo', label: 'Maputo' },
    { value: 'Nampula', label: 'Nampula' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'rating', label: 'Melhor Avaliados' },
    { value: 'sales', label: 'Mais Vendidos' },
    { value: 'name', label: 'Nome A-Z' },
    { value: 'createdAt', label: 'Mais Recentes' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-green-gray-1 to-green-gray-2 py-12">
        <div className="container">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-9 mb-4">
              Nossos Vendedores
            </h1>
            <p className="text-lg text-gray-7 max-w-2xl mx-auto">
              Conheça os produtores locais que fazem parte da nossa comunidade. 
              Todos comprometidos com qualidade e sustentabilidade.
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-8 border-b">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-4" size={20} />
              <Input
                placeholder="Pesquisar vendedores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Location Filter */}
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Localização" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location.value} value={location.value}>
                    {location.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-6">Visualização:</span>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid size={16} />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List size={16} />
              </Button>
            </div>

            <div className="text-sm text-gray-6">
              {isLoading ? (
                <span className="text-gray-4">Carregando...</span>
              ) : (
                <>{pagination?.total || 0} vendedor{(pagination?.total || 0) !== 1 ? 'es' : ''} encontrado{(pagination?.total || 0) !== 1 ? 's' : ''}</>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sellers Grid/List */}
      <section className="py-12">
        <div className="container">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : sellers.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-1 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="text-gray-4" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-9 mb-2">Nenhum vendedor encontrado</h3>
              <p className="text-gray-6 mb-6">
                Tente ajustar os filtros ou termos de busca
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setSelectedLocation('all');
                }}
              >
                Limpar Filtros
              </Button>
            </div>
          ) : (
            <>
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch"
                : "space-y-4"
              }>
                {sellers.map((seller) => (
                  <SellerCard 
                    key={seller.id} 
                    seller={{
                      id: seller.id,
                      businessName: seller.businessName,
                      businessDescription: seller.description,
                      logo: seller.logo,
                      rating: seller.rating,
                      reviewCount: seller.totalReviews,
                      totalProducts: seller.totalProducts || 0,
                      totalSales: seller.totalSales,
                      location: seller.location,
                      isVerified: seller.isVerified,
                      isFeatured: seller.isFeatured,
                      isTopSeller: seller.isFeatured,
                      joinedDate: seller.memberSince,
                    }} 
                    showStats={viewMode === 'grid'}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    >
                      Anterior
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <Button
                            key={pageNum}
                            size="sm"
                            variant={currentPage === pageNum ? 'default' : 'outline'}
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= pagination.totalPages}
                      onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                    >
                      Próxima
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-1">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {pagination?.total || 0}+
              </div>
              <div className="text-gray-6">Vendedores Ativos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {sellers.filter(s => s.isVerified).length}
              </div>
              <div className="text-gray-6">Vendedores Verificados</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {sellers.reduce((sum, seller) => sum + (seller.totalProducts || 0), 0)}+
              </div>
              <div className="text-gray-6">Produtos Disponíveis</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
