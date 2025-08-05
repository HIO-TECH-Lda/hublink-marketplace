'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { formatCurrency } from '@/lib/payment';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  sellerId: string;
  sellerName: string;
  sellerLogo?: string;
  tags: string[];
  sku: string;
  weight?: string;
  color?: string;
  stockStatus?: string;
  type?: string;
  images?: string[];
}

interface ProductCardProps {
  product: Product;
  showQuickView?: boolean;
}

export default function ProductCard({ product, showQuickView = true }: ProductCardProps) {
  const { state, dispatch } = useMarketplace();
  
  const isInWishlist = state.wishlist.some(item => item.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch({ 
      type: 'ADD_TO_CART', 
      payload: { product, quantity: 1 } 
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id });
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch({ type: 'SET_QUICK_VIEW', payload: product });
  };

  return (
    <Link href={`/produto/${product.id}`}>
      <div className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Stock Badge */}
          {!product.inStock && (
            <div className="absolute top-3 left-3 bg-danger text-white text-xs px-2 py-1 rounded-full">
              Fora de Estoque
            </div>
          )}

          {/* Action Buttons - Desktop (Hover Only) */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
            <button
              onClick={handleToggleWishlist}
              className={`p-2 rounded-full shadow-md transition-colors ${
                isInWishlist ? 'bg-danger text-white' : 'bg-white text-gray-6'
              }`}
            >
              <Heart size={16} fill={isInWishlist ? 'currentColor' : 'none'} />
            </button>
            
            {showQuickView && (
              <button
                onClick={handleQuickView}
                className="p-2 bg-white text-gray-6 rounded-full shadow-md"
              >
                <Eye size={16} />
              </button>
            )}
          </div>

          {/* Action Buttons - Mobile (Always Visible) */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2 md:hidden">
            <button
              onClick={handleToggleWishlist}
              className={`p-2 rounded-full shadow-md transition-colors ${
                isInWishlist ? 'bg-danger text-white' : 'bg-white text-gray-6'
              }`}
            >
              <Heart size={16} fill={isInWishlist ? 'currentColor' : 'none'} />
            </button>
            
            {showQuickView && (
              <button
                onClick={handleQuickView}
                className="p-2 bg-white text-gray-6 rounded-full shadow-md"
              >
                <Eye size={16} />
              </button>
            )}
          </div>

          {/* Add to Cart Button - Desktop (Hover Only) */}
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-primary hover:bg-primary-hard text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2"
              disabled={!product.inStock}
            >
              <ShoppingCart size={16} />
              <span>{product.inStock ? 'Adicionar ao Carrinho' : 'Fora de Estoque'}</span>
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Seller Info */}
          <div className="flex items-center space-x-2 mb-2">
            {product.sellerLogo && (
              <img
                src={product.sellerLogo}
                alt={product.sellerName}
                className="w-6 h-6 rounded-full object-cover"
              />
            )}
            <span className="text-xs text-gray-6">por {product.sellerName}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-medium text-gray-9 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-1 mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.floor(product.rating) ? 'text-warning fill-warning' : 'text-gray-3'}
                />
              ))}
            </div>
            <span className="text-sm text-gray-6">({product.reviews})</span>
          </div>

          {/* Price and Mobile Add to Cart */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-primary">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-5 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            
            {/* Mobile Add to Cart Button */}
            <div className="md:hidden">
              <Button
                onClick={handleAddToCart}
                size="sm"
                className="bg-primary hover:bg-primary-hard text-white px-3 py-1 rounded-lg flex items-center space-x-1"
                disabled={!product.inStock}
              >
                <ShoppingCart size={14} />
                <span className="text-xs">{product.inStock ? 'Adicionar' : 'Indisponível'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}