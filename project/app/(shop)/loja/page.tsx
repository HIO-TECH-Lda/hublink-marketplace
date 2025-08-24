'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Filter, Grid, List, ChevronDown, Star } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/common/ProductCard';
import CartPopup from '@/components/popups/CartPopup';
import QuickViewPopup from '@/components/popups/QuickViewPopup';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useMarketplace } from '@/contexts/MarketplaceContext';

export default function ShopPage() {
  const { state } = useMarketplace();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedSellers, setSelectedSellers] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');

  // Get search query from URL parameters
  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const categories = ['Verduras', 'Legumes', 'Frutas', 'Grãos', 'Laticínios'];
  const sellers = Array.from(new Set(state.products.map(p => p.sellerName)));

  const filteredProducts = state.products.filter(product => {
    // Search filter
    const searchMatch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    const ratingMatch = selectedRating === 0 || product.rating >= selectedRating;
    const sellerMatch = selectedSellers.length === 0 || selectedSellers.includes(product.sellerName);
    
    return searchMatch && categoryMatch && priceMatch && ratingMatch && sellerMatch;
  });

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== category));
    }
  };

  const handleSellerChange = (seller: string, checked: boolean) => {
    if (checked) {
      setSelectedSellers([...selectedSellers, seller]);
    } else {
      setSelectedSellers(selectedSellers.filter(s => s !== seller));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-6">
          <span>Início</span> / <span className="text-primary">Comprar Agora</span>
          {searchQuery && (
            <>
              <span> / </span>
              <span className="text-primary">Busca: "{searchQuery}"</span>
            </>
          )}
        </nav>

        {/* Page Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-9 mb-2">
              {searchQuery ? `Resultados para "${searchQuery}"` : 'Comprar Agora'}
            </h1>
            <p className="text-gray-6 text-sm sm:text-base">
              {searchQuery 
                ? `Encontramos ${filteredProducts.length} produto${filteredProducts.length !== 1 ? 's' : ''} para "${searchQuery}"`
                : `Encontramos ${filteredProducts.length} produtos para você`
              }
            </p>
          </div>
          
          {/* Sort and View Options */}
          <div className="flex items-center space-x-2 sm:space-x-4 mt-4 lg:mt-0">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-6">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-3 rounded-lg px-2 sm:px-3 py-1 text-sm focus:outline-none focus:border-primary"
              >
                <option value="popular">Popularidade</option>
                <option value="price-low">Menor Preço</option>
                <option value="price-high">Maior Preço</option>
                <option value="rating">Avaliação</option>
                <option value="newest">Mais Recentes</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            {/* Mobile Filter Toggle */}
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full mb-4 bg-gray-1 text-gray-9 hover:bg-gray-2"
            >
              <Filter size={18} className="mr-2" />
              Filtros
              <ChevronDown size={18} className={`ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>

            {/* Filters */}
            <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'} bg-white lg:bg-transparent p-4 sm:p-6 lg:p-0 rounded-lg lg:rounded-none shadow-lg lg:shadow-none`}>
              {/* Categories */}
              <div>
                <h3 className="font-semibold text-gray-9 mb-4">Categorias</h3>
                <div className="space-y-3">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox
                        id={category}
                        checked={selectedCategories.includes(category)}
                        onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                      />
                      <label htmlFor={category} className="text-sm text-gray-7 cursor-pointer">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-semibold text-gray-9 mb-4">Preço</h3>
                <div className="space-y-4">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={1000}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-6">
                    <span>MZN {priceRange[0]}</span>
                    <span>MZN {priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div>
                <h3 className="font-semibold text-gray-9 mb-4">Avaliação</h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setSelectedRating(selectedRating === rating ? 0 : rating)}
                      className={`flex items-center space-x-2 w-full text-left p-2 rounded transition-colors ${
                        selectedRating === rating ? 'bg-primary/10' : 'hover:bg-gray-1'
                      }`}
                    >
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < rating ? 'text-warning fill-warning' : 'text-gray-3'}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-7">& acima</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sellers */}
              <div>
                <h3 className="font-semibold text-gray-9 mb-4">Vendedores</h3>
                <div className="space-y-3">
                  {sellers.map((seller) => (
                    <div key={seller} className="flex items-center space-x-2">
                      <Checkbox
                        id={seller}
                        checked={selectedSellers.includes(seller)}
                        onCheckedChange={(checked) => handleSellerChange(seller, checked as boolean)}
                      />
                      <label htmlFor={seller} className="text-sm text-gray-7 cursor-pointer">
                        {seller}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Popular Tags */}
              <div>
                <h3 className="font-semibold text-gray-9 mb-4">Tags Populares</h3>
                <div className="flex flex-wrap gap-2">
                  {['orgânico', 'fresco', 'local', 'doce', 'crocante'].map((tag) => (
                    <button
                      key={tag}
                      className="px-3 py-1 bg-gray-1 text-gray-7 rounded-full text-sm hover:bg-primary hover:text-white transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sale Products */}
              <div className="bg-primary/5 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-9 mb-2">Produtos em Promoção</h3>
                <p className="text-sm text-gray-6 mb-3">Até 79% de desconto</p>
                <Button size="sm" className="bg-primary hover:bg-primary-hard text-white">
                  Ver Ofertas
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 border border-gray-3 rounded hover:bg-gray-1 transition-colors">
                  Anterior
                </button>
                <button className="px-3 py-2 bg-primary text-white rounded">1</button>
                <button className="px-3 py-2 border border-gray-3 rounded hover:bg-gray-1 transition-colors">2</button>
                <button className="px-3 py-2 border border-gray-3 rounded hover:bg-gray-1 transition-colors">3</button>
                <button className="px-3 py-2 border border-gray-3 rounded hover:bg-gray-1 transition-colors">
                  Próximo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <CartPopup />
      <QuickViewPopup />
    </div>
  );
}