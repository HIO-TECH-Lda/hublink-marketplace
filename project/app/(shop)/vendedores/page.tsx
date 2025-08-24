'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Star, Package, TrendingUp, Grid, List } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SellerCard from '@/components/common/SellerCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Seller {
  id: string;
  businessName: string;
  businessDescription: string;
  logo?: string;
  rating: number;
  reviewCount: number;
  totalProducts: number;
  totalSales: number;
  location: string;
  isVerified: boolean;
  isTopSeller: boolean;
  joinedDate: string;
  category: string;
  tags: string[];
}

export default function SellersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isLoading, setIsLoading] = useState(true);

  // Mock sellers data
  const allSellers: Seller[] = [
    {
      id: 'seller1',
      businessName: 'Fazenda Verde',
      businessDescription: 'Produtos orgânicos frescos direto da fazenda. Cultivamos com amor e respeito pela natureza.',
      logo: 'https://placehold.co/64x64/00BE27/ffffff?text=FV',
      rating: 4.8,
      reviewCount: 127,
      totalProducts: 15,
      totalSales: 125000,
      location: 'Beira, Sofala',
      isVerified: true,
      isTopSeller: true,
      joinedDate: '2023-06-15',
      category: 'vegetais',
      tags: ['orgânico', 'fresco', 'local']
    },
    {
      id: 'seller2',
      businessName: 'Horta Orgânica Silva',
      businessDescription: 'Especialistas em vegetais orgânicos frescos. Qualidade garantida desde 2020.',
      logo: 'https://placehold.co/64x64/00BE27/ffffff?text=HS',
      rating: 4.9,
      reviewCount: 89,
      totalProducts: 12,
      totalSales: 98000,
      location: 'Maputo, Maputo',
      isVerified: true,
      isTopSeller: true,
      joinedDate: '2020-03-10',
      category: 'vegetais',
      tags: ['orgânico', 'certificado', 'qualidade']
    },
    {
      id: 'seller3',
      businessName: 'Frutas Frescas Costa',
      businessDescription: 'As melhores frutas orgânicas da região. Sabor e qualidade em cada produto.',
      logo: 'https://placehold.co/64x64/00BE27/ffffff?text=FC',
      rating: 4.7,
      reviewCount: 156,
      totalProducts: 18,
      totalSales: 145000,
      location: 'Nampula, Nampula',
      isVerified: true,
      isTopSeller: false,
      joinedDate: '2022-08-22',
      category: 'frutas',
      tags: ['frutas', 'fresco', 'sabor']
    },
    {
      id: 'seller4',
      businessName: 'Grãos Naturais',
      businessDescription: 'Grãos orgânicos de alta qualidade. Nutrição e sabor em cada grão.',
      logo: 'https://placehold.co/64x64/00BE27/ffffff?text=GN',
      rating: 4.6,
      reviewCount: 73,
      totalProducts: 8,
      totalSales: 67000,
      location: 'Beira, Sofala',
      isVerified: true,
      isTopSeller: false,
      joinedDate: '2023-01-15',
      category: 'grãos',
      tags: ['grãos', 'nutrição', 'orgânico']
    },
    {
      id: 'seller5',
      businessName: 'Mel Orgânico Santos',
      businessDescription: 'Mel puro e natural das abelhas locais. Sabor autêntico e propriedades medicinais.',
      logo: 'https://placehold.co/64x64/00BE27/ffffff?text=MS',
      rating: 4.5,
      reviewCount: 45,
      totalProducts: 5,
      totalSales: 45000,
      location: 'Beira, Sofala',
      isVerified: true,
      isTopSeller: false,
      joinedDate: '2023-09-01',
      category: 'mel',
      tags: ['mel', 'natural', 'medicinal']
    },
    {
      id: 'seller6',
      businessName: 'Hortaliças Frescas',
      businessDescription: 'Hortaliças orgânicas cultivadas sem agrotóxicos. Frescor e saúde em cada folha.',
      logo: 'https://placehold.co/64x64/00BE27/ffffff?text=HF',
      rating: 4.4,
      reviewCount: 67,
      totalProducts: 10,
      totalSales: 55000,
      location: 'Maputo, Maputo',
      isVerified: false,
      isTopSeller: false,
      joinedDate: '2023-03-20',
      category: 'hortaliças',
      tags: ['hortaliças', 'fresco', 'sem agrotóxicos']
    },
    {
      id: 'seller7',
      businessName: 'Raízes Orgânicas',
      businessDescription: 'Raízes e tubérculos orgânicos. Nutrição e sabor da terra.',
      logo: 'https://placehold.co/64x64/00BE27/ffffff?text=RO',
      rating: 4.3,
      reviewCount: 34,
      totalProducts: 7,
      totalSales: 38000,
      location: 'Nampula, Nampula',
      isVerified: true,
      isTopSeller: false,
      joinedDate: '2023-07-10',
      category: 'raízes',
      tags: ['raízes', 'tubérculos', 'orgânico']
    },
    {
      id: 'seller8',
      businessName: 'Ervas Aromáticas',
      businessDescription: 'Ervas aromáticas e medicinais. Sabor e benefícios para sua saúde.',
      logo: 'https://placehold.co/64x64/00BE27/ffffff?text=EA',
      rating: 4.2,
      reviewCount: 28,
      totalProducts: 6,
      totalSales: 32000,
      location: 'Beira, Sofala',
      isVerified: false,
      isTopSeller: false,
      joinedDate: '2023-11-05',
      category: 'ervas',
      tags: ['ervas', 'aromáticas', 'medicinais']
    }
  ];

  // Categories
  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'vegetais', label: 'Vegetais' },
    { value: 'frutas', label: 'Frutas' },
    { value: 'grãos', label: 'Grãos' },
    { value: 'mel', label: 'Mel' },
    { value: 'hortaliças', label: 'Hortaliças' },
    { value: 'raízes', label: 'Raízes' },
    { value: 'ervas', label: 'Ervas' }
  ];

  // Locations
  const locations = [
    { value: 'all', label: 'Todas as Localizações' },
    { value: 'Beira, Sofala', label: 'Beira, Sofala' },
    { value: 'Maputo, Maputo', label: 'Maputo, Maputo' },
    { value: 'Nampula, Nampula', label: 'Nampula, Nampula' }
  ];

  // Sort options
  const sortOptions = [
    { value: 'rating', label: 'Melhor Avaliados' },
    { value: 'sales', label: 'Mais Vendidos' },
    { value: 'products', label: 'Mais Produtos' },
    { value: 'name', label: 'Nome A-Z' },
    { value: 'joined', label: 'Mais Recentes' }
  ];

  // Filter and sort sellers
  const filteredSellers = allSellers
    .filter(seller => {
      const matchesSearch = seller.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           seller.businessDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           seller.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || seller.category === selectedCategory;
      const matchesLocation = selectedLocation === 'all' || seller.location === selectedLocation;
      
      return matchesSearch && matchesCategory && matchesLocation;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'sales':
          return b.totalSales - a.totalSales;
        case 'products':
          return b.totalProducts - a.totalProducts;
        case 'name':
          return a.businessName.localeCompare(b.businessName);
        case 'joined':
          return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
        default:
          return 0;
      }
    });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-6">Carregando vendedores...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
                placeholder="Buscar vendedores..."
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
              {filteredSellers.length} vendedor{filteredSellers.length !== 1 ? 'es' : ''} encontrado{filteredSellers.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </section>

      {/* Sellers Grid/List */}
      <section className="py-12">
        <div className="container">
          {filteredSellers.length === 0 ? (
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
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch"
              : "space-y-4"
            }>
              {filteredSellers.map((seller) => (
                <SellerCard 
                  key={seller.id} 
                  seller={seller} 
                  showStats={viewMode === 'grid'}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-1">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {allSellers.length}+
              </div>
              <div className="text-gray-6">Vendedores Ativos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {allSellers.filter(s => s.isVerified).length}
              </div>
              <div className="text-gray-6">Vendedores Verificados</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">
                {allSellers.reduce((sum, seller) => sum + seller.totalProducts, 0)}+
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