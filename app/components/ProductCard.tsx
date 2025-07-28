'use client';

import React from 'react';
import Image from 'next/image';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
  brand?: string;
  sku?: string;
  description?: string;
  tags?: string[];
}

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart, addToWishlist, wishlist } = useApp();
  
  const isInWishlist = wishlist.some(item => item.id === product.id);
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleToggleWishlist = () => {
    if (!isInWishlist) {
      addToWishlist(product);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-2 hover:shadow-lg transition-shadow duration-300 group">
      <div className="relative overflow-hidden rounded-t-lg">
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={250}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-danger text-white px-2 py-1 rounded text-sm font-medium">
            -{discountPercentage}%
          </div>
        )}

        {/* Stock Status */}
        {!product.inStock && (
          <div className="absolute top-3 right-3 bg-gray-7 text-white px-2 py-1 rounded text-sm">
            Esgotado
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleToggleWishlist}
            className={`p-2 rounded-full ${
              isInWishlist ? 'bg-danger text-white' : 'bg-white text-gray-7'
            } hover:bg-primary hover:text-white transition-colors shadow-md`}
          >
            <Heart className={`w-4 h-4 ${isInWishlist ? 'fill-current' : ''}`} />
          </button>
          {onQuickView && (
            <button
              onClick={() => onQuickView(product)}
              className="p-2 bg-white text-gray-7 hover:bg-primary hover:text-white transition-colors rounded-full shadow-md"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-medium text-gray-9 mb-2 line-clamp-2 h-12">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-warning fill-current'
                    : 'text-gray-3'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-6 ml-1">({product.rating})</span>
        </div>

        {/* Price */}
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-lg font-semibold text-gray-9">
            R$ {product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-6 line-through">
              R$ {product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full bg-primary hover:bg-primary-hard text-white disabled:bg-gray-4 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {product.inStock ? 'Adicionar ao Carrinho' : 'Indisponível'}
        </Button>
      </div>
    </div>
  );
}