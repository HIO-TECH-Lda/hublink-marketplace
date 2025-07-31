'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, Grid, List, SortAsc, SortDesc } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/common/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AdvancedFilters from '@/components/search/AdvancedFilters';
import SearchSuggestions from '@/components/search/SearchSuggestions';
import { useMarketplace } from '@/contexts/MarketplaceContext';

interface FilterState {
  search: string;
  categories: string[];
  sellers: string[];
  tags: string[];
  priceRange: [number, number];
  rating: number;
  inStock: boolean;
  onSale: boolean;
  organic: boolean;
}

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'trending' | 'product' | 'category';
  count?: number;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const { state } = useMarketplace();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<FilterState>({
    search: initialQuery,
    categories: [],
    sellers: [],
    tags: [],
    priceRange: [0, 200],
    rating: 0,
    inStock: false,
    onSale: false,
    organic: false
  });
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [trendingSearches] = useState<string[]>([
    'Tomate Orgânico',
    'Alface Hidropônica',
    'Cenoura Orgânica',
    'Maçã Verde',
    'Banana Prata'
  ]);

  // Mock suggestions
  const [suggestions] = useState<SearchSuggestion[]>([
    { id: '1', text: 'Tomate Orgânico', type: 'product', count: 15 },
    { id: '2', text: 'Alface Hidropônica', type: 'product', count: 8 },
    { id: '3', text: 'Frutas', type: 'category', count: 45 },
    { id: '4', text: 'Verduras', type: 'category', count: 32 }
  ]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);

  const saveRecentSearch = (search: string) => {
    if (!search.trim()) return;
    
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 10);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const removeRecentSearch = (search: string) => {
    const updated = recentSearches.filter(s => s !== search);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setFilters(prev => ({ ...prev, search: searchQuery }));
    setShowSuggestions(false);
    saveRecentSearch(searchQuery);
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: query,
      categories: [],
      sellers: [],
      tags: [],
      priceRange: [0, 200],
      rating: 0,
      inStock: false,
      onSale: false,
      organic: false
    });
  };

  // Filter and sort products
  const filteredProducts = state.products.filter(product => {
    // Search filter
    if (filters.search && !product.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }

    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
      return false;
    }

    // Seller filter
    if (filters.sellers.length > 0 && !filters.sellers.includes(product.sellerId)) {
      return false;
    }

    // Price range filter
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }

    // Rating filter
    if (filters.rating > 0 && (product.rating || 0) < filters.rating) {
      return false;
    }

    // Stock filter
    if (filters.inStock && !product.inStock) {
      return false;
    }

    // Sale filter
    if (filters.onSale && !product.originalPrice) {
      return false;
    }

    // Organic filter
    if (filters.organic && !product.tags?.includes('orgânico')) {
      return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'name':
        return a.name.localeCompare(b.name);
      case 'relevance':
      default:
        return 0; // Keep original order for relevance
    }
  });

  // Mock filter options
  const categories = [
    { id: 'frutas', label: 'Frutas', count: 45 },
    { id: 'verduras', label: 'Verduras', count: 32 },
    { id: 'legumes', label: 'Legumes', count: 28 },
    { id: 'graos', label: 'Grãos', count: 15 },
    { id: 'temperos', label: 'Temperos', count: 12 }
  ];

  const sellers = [
    { id: 'seller1', label: 'Fazenda Orgânica', count: 25 },
    { id: 'seller2', label: 'Horta Urbana', count: 18 },
    { id: 'seller3', label: 'Produtos Naturais', count: 12 }
  ];

  const tags = [
    { id: 'organico', label: 'Orgânico', count: 35 },
    { id: 'hidroponico', label: 'Hidropônico', count: 8 },
    { id: 'sem-agrotoxicos', label: 'Sem Agrotóxicos', count: 42 }
  ];

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />
      
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-9 mb-2">
            {query ? `Resultados para "${query}"` : 'Buscar Produtos'}
          </h1>
          <p className="text-gray-6">
            {sortedProducts.length} produto{sortedProducts.length !== 1 ? 's' : ''} encontrado{sortedProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <AdvancedFilters
                categories={categories}
                sellers={sellers}
                tags={tags}
                priceRange={[0, 200]}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />
            </div>
          </div>

          {/* Search Results */}
          <div className="lg:col-span-3">
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-4 w-4 h-4" />
                <Input
                  placeholder="Buscar produtos..."
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setFilters(prev => ({ ...prev, search: e.target.value }));
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="pl-10 pr-4"
                />
              </div>
              
              <SearchSuggestions
                query={query}
                suggestions={suggestions}
                recentSearches={recentSearches}
                trendingSearches={trendingSearches}
                onSuggestionClick={handleSearch}
                onClearRecent={clearRecentSearches}
                onRemoveRecent={removeRecentSearch}
                isVisible={showSuggestions}
              />
            </div>

            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-6">
                  {sortedProducts.length} resultado{sortedProducts.length !== 1 ? 's' : ''}
                </span>
                {filters.categories.length > 0 || filters.sellers.length > 0 || filters.rating > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    Filtrado
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Mais Relevantes</SelectItem>
                    <SelectItem value="price-asc">Menor Preço</SelectItem>
                    <SelectItem value="price-desc">Maior Preço</SelectItem>
                    <SelectItem value="rating">Melhor Avaliados</SelectItem>
                    <SelectItem value="name">Nome A-Z</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
                <div className="flex border border-gray-2 rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Results */}
            {sortedProducts.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
              }>
                {sortedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <Search className="w-16 h-16 text-gray-3 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-7 mb-2">
                    Nenhum produto encontrado
                  </h3>
                  <p className="text-gray-5 mb-6">
                    Tente ajustar seus filtros ou usar termos de busca diferentes
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Limpar Filtros
                  </Button>
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