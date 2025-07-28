'use client';

import React, { useState } from 'react';
import { Filter, Grid, List, ChevronDown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CartPopup from '@/components/CartPopup';
import { Button } from '@/components/ui/button';
import { mockProducts, mockCategories } from '@/data/mockData';

export default function ShopPage() {
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category);
    if (category === '') {
      setFilteredProducts(mockProducts);
    } else {
      setFilteredProducts(mockProducts.filter(product => product.category === category));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Breadcrumbs */}
      <div className="bg-gray-1 py-4">
        <div className="container">
          <nav className="text-sm text-gray-6">
            <span>Início</span> <span className="mx-2">/</span> <span className="text-gray-9">Loja</span>
          </nav>
        </div>
      </div>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full bg-primary hover:bg-primary-hard text-white"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtrar
              </Button>
            </div>

            <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              {/* Categories */}
              <div className="bg-white border border-gray-2 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-9 mb-4">Categorias</h3>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={() => handleCategoryFilter('')}
                      className={`text-left w-full py-1 ${
                        selectedCategory === '' ? 'text-primary font-medium' : 'text-gray-7'
                      }`}
                    >
                      Todas as Categorias
                    </button>
                  </li>
                  {mockCategories.map(category => (
                    <li key={category.id}>
                      <button
                        onClick={() => handleCategoryFilter(category.name)}
                        className={`text-left w-full py-1 flex justify-between ${
                          selectedCategory === category.name ? 'text-primary font-medium' : 'text-gray-7'
                        }`}
                      >
                        <span>{category.name}</span>
                        <span className="text-gray-5">({category.count})</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range */}
              <div className="bg-white border border-gray-2 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-9 mb-4">Preço</h3>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-6">
                    <span>R$ 0</span>
                    <span>R$ {priceRange[1]}</span>
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="bg-white border border-gray-2 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-9 mb-4">Avaliação</h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map(rating => (
                    <label key={rating} className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <div className="flex">
                        {[...Array(rating)].map((_, i) => (
                          <span key={i} className="text-warning">★</span>
                        ))}
                        {[...Array(5 - rating)].map((_, i) => (
                          <span key={i} className="text-gray-3">★</span>
                        ))}
                      </div>
                      <span className="ml-2 text-sm text-gray-6">& acima</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Popular Tags */}
              <div className="bg-white border border-gray-2 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-9 mb-4">Tags Populares</h3>
                <div className="flex flex-wrap gap-2">
                  {['Orgânico', 'Fresco', 'Saudável', 'Premium', 'Natural'].map(tag => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-1 text-gray-7 rounded-full text-sm hover:bg-primary hover:text-white cursor-pointer transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sale Products */}
              <div className="bg-primary rounded-lg p-4 text-white">
                <h3 className="text-lg font-semibold mb-2">Produtos em Promoção</h3>
                <p className="text-primary-soft text-sm mb-4">
                  Até 79% de desconto em produtos selecionados
                </p>
                <Button className="bg-white text-primary hover:bg-gray-1 w-full">
                  Ver Ofertas
                </Button>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <p className="text-gray-6">
                Mostrando {filteredProducts.length} de {mockProducts.length} produtos
              </p>
              <div className="flex items-center space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="name">Ordenar por Nome</option>
                  <option value="price-low">Menor Preço</option>
                  <option value="price-high">Maior Preço</option>
                  <option value="rating">Avaliação</option>
                </select>
                <div className="flex border border-gray-3 rounded-lg overflow-hidden">
                  <button className="p-2 bg-primary text-white">
                    <Grid className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-gray-1">
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <div className="flex items-center space-x-2">
                <button className="px-3 py-2 border border-gray-3 rounded-lg hover:bg-gray-1">
                  Anterior
                </button>
                {[1, 2, 3, 4, 5].map(page => (
                  <button
                    key={page}
                    className={`px-3 py-2 rounded-lg ${
                      page === 1 
                        ? 'bg-primary text-white' 
                        : 'border border-gray-3 hover:bg-gray-1'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button className="px-3 py-2 border border-gray-3 rounded-lg hover:bg-gray-1">
                  Próximo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <CartPopup />
    </div>
  );
}