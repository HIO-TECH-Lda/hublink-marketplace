'use client';

import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface AdvancedFiltersProps {
  categories: FilterOption[];
  sellers: FilterOption[];
  tags: FilterOption[];
  priceRange: [number, number];
  onFiltersChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

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

export default function AdvancedFilters({
  categories,
  sellers,
  tags,
  priceRange,
  onFiltersChange,
  onClearFilters
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    categories: [],
    sellers: [],
    tags: [],
    priceRange: priceRange,
    rating: 0,
    inStock: false,
    onSale: false,
    organic: false
  });

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter(id => id !== categoryId);
    updateFilters({ categories: newCategories });
  };

  const handleSellerChange = (sellerId: string, checked: boolean) => {
    const newSellers = checked
      ? [...filters.sellers, sellerId]
      : filters.sellers.filter(id => id !== sellerId);
    updateFilters({ sellers: newSellers });
  };

  const handleTagChange = (tagId: string, checked: boolean) => {
    const newTags = checked
      ? [...filters.tags, tagId]
      : filters.tags.filter(id => id !== tagId);
    updateFilters({ tags: newTags });
  };

  const handlePriceRangeChange = (value: number[]) => {
    updateFilters({ priceRange: [value[0], value[1]] as [number, number] });
  };

  const handleRatingChange = (value: number[]) => {
    updateFilters({ rating: value[0] });
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      search: '',
      categories: [],
      sellers: [],
      tags: [],
      priceRange: priceRange,
      rating: 0,
      inStock: false,
      onSale: false,
      organic: false
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  const activeFiltersCount = [
    filters.categories.length,
    filters.sellers.length,
    filters.tags.length,
    filters.rating > 0 ? 1 : 0,
    filters.inStock ? 1 : 0,
    filters.onSale ? 1 : 0,
    filters.organic ? 1 : 0
  ].reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="space-y-2">
        <Label htmlFor="search" className="text-sm font-medium text-gray-7">
          Buscar Produtos
        </Label>
        <Input
          id="search"
          placeholder="Digite o nome do produto..."
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
        />
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-6">Filtros ativos:</span>
          {filters.categories.map(categoryId => {
            const category = categories.find(c => c.id === categoryId);
            return category ? (
              <Badge key={categoryId} variant="secondary" className="text-xs">
                {category.label}
                <button
                  onClick={() => handleCategoryChange(categoryId, false)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ) : null;
          })}
          {filters.rating > 0 && (
            <Badge variant="secondary" className="text-xs">
              {filters.rating}+ estrelas
              <button
                onClick={() => updateFilters({ rating: 0 })}
                className="ml-1 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {filters.inStock && (
            <Badge variant="secondary" className="text-xs">
              Em estoque
              <button
                onClick={() => updateFilters({ inStock: false })}
                className="ml-1 hover:text-red-500"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs text-primary hover:text-primary-hard"
          >
            Limpar todos
          </Button>
        </div>
      )}

      {/* Expand/Collapse Button */}
      <Button
        variant="outline"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between"
      >
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4" />
          <span>Filtros Avançados</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </Button>

      {/* Advanced Filters */}
      {isExpanded && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-9">
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Price Range */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-7">
                Faixa de Preço
              </Label>
              <div className="px-2">
                <Slider
                  value={filters.priceRange}
                  onValueChange={handlePriceRangeChange}
                  max={priceRange[1]}
                  min={priceRange[0]}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-5 mt-2">
                  <span>MTn {filters.priceRange[0]}</span>
                  <span>MTn {filters.priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-7">
                Avaliação Mínima
              </Label>
              <div className="px-2">
                <Slider
                  value={[filters.rating]}
                  onValueChange={handleRatingChange}
                  max={5}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-5 mt-2">
                  <span>Qualquer</span>
                  <span>{filters.rating > 0 ? `${filters.rating}+ estrelas` : 'Qualquer'}</span>
                </div>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-7">
                Opções
              </Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inStock"
                    checked={filters.inStock}
                    onCheckedChange={(checked) => updateFilters({ inStock: checked as boolean })}
                  />
                  <Label htmlFor="inStock" className="text-sm text-gray-7">
                    Apenas em estoque
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="onSale"
                    checked={filters.onSale}
                    onCheckedChange={(checked) => updateFilters({ onSale: checked as boolean })}
                  />
                  <Label htmlFor="onSale" className="text-sm text-gray-7">
                    Apenas em promoção
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="organic"
                    checked={filters.organic}
                    onCheckedChange={(checked) => updateFilters({ organic: checked as boolean })}
                  />
                  <Label htmlFor="organic" className="text-sm text-gray-7">
                    Apenas orgânicos
                  </Label>
                </div>
              </div>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-7">
                  Categorias
                </Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={filters.categories.includes(category.id)}
                        onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                      />
                      <Label htmlFor={`category-${category.id}`} className="text-sm text-gray-7 flex-1">
                        {category.label}
                      </Label>
                      {category.count && (
                        <span className="text-xs text-gray-5">({category.count})</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sellers */}
            {sellers.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-7">
                  Vendedores
                </Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {sellers.map((seller) => (
                    <div key={seller.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`seller-${seller.id}`}
                        checked={filters.sellers.includes(seller.id)}
                        onCheckedChange={(checked) => handleSellerChange(seller.id, checked as boolean)}
                      />
                      <Label htmlFor={`seller-${seller.id}`} className="text-sm text-gray-7 flex-1">
                        {seller.label}
                      </Label>
                      {seller.count && (
                        <span className="text-xs text-gray-5">({seller.count})</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {tags.length > 0 && (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-7">
                  Tags
                </Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {tags.map((tag) => (
                    <div key={tag.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag.id}`}
                        checked={filters.tags.includes(tag.id)}
                        onCheckedChange={(checked) => handleTagChange(tag.id, checked as boolean)}
                      />
                      <Label htmlFor={`tag-${tag.id}`} className="text-sm text-gray-7 flex-1">
                        {tag.label}
                      </Label>
                      {tag.count && (
                        <span className="text-xs text-gray-5">({tag.count})</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 