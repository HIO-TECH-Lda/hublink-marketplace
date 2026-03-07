'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Eye, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { Product } from '@/types/api';
import { useAddToCart } from '@/hooks/useCart';
import { useAddToWishlist, useRemoveFromWishlist, useCheckWishlistStatus } from '@/hooks/useWishlist';
import { formatCurrency } from '@/lib/payment';
import { useToast } from '@/hooks/use-toast';


interface ProductCardProps {
  product: Product;
  showQuickView?: boolean;
}

export default function ProductCard({ product, showQuickView = true }: ProductCardProps) {
  const { state, dispatch } = useMarketplace();
  const { toast } = useToast();
  
  // API hooks
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const { data: isInWishlist } = useCheckWishlistStatus(product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart.mutate(
      {
        productId: product._id,
        quantity: 1,
        productSnapshot: {
          name: product.name,
          price: product.price,
          primaryImage: typeof product.primaryImage === 'string' ? product.primaryImage : (product.images?.[0] as any)?.url,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Produto adicionado",
            description: `${product.name} foi adicionado ao carrinho com sucesso.`,
            variant: "default",
          });
          // Show cart popup after successful add to cart
          dispatch({ type: 'SHOW_CART_POPUP' });
        },
        onError: (error: any) => {
          toast({
            title: "Erro",
            description: error?.response?.data?.error || error?.response?.data?.message || "Erro ao adicionar produto ao carrinho.",
            variant: "destructive",
          });
        }
      }
    );
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist) {
      removeFromWishlist.mutate(product._id);
    } else {
      addToWishlist.mutate(product._id);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Convert API Product to Context Product format
    const productImages = [
      ...(product.primaryImage ? [product.primaryImage] : []),
      ...(product.images?.map(img => typeof img === 'string' ? img : img.url) || [])
    ].filter(Boolean);
    
    const contextProduct = {
      id: product._id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: productImages[0] || '/placeholder.jpg',
      description: product.description,
      category: product.category,
      categoryId: (product as any).categoryId,
      brand: product.brand || '',
      rating: (product as any).averageRating || product.rating || 0,
      reviews: (product as any).totalReviews || product.reviews || 0,
      inStock: product.stock > 0,
      sellerId: typeof product.sellerId === 'object' ? (product.sellerId as any)._id : product.sellerId || '',
      sellerName: product.sellerName || '',
      sellerLogo: product.sellerLogo,
      tags: product.tags || [],
      sku: product.sku || '',
      weight: product.weight,
      color: product.color,
      stockStatus: product.stockStatus,
      type: product.type,
      images: productImages,
      primaryImage: product.primaryImage
    };
    
    dispatch({ type: 'SET_QUICK_VIEW', payload: contextProduct });
  };

  const handleSellerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Navigation will be handled by the Link component
  };

  // Ensure product._id is a string
  const productId = typeof product._id === 'string' ? product._id : String(product._id);
  
  // Get primary image from combined sources
  const primaryImage = product.primaryImage || 
    (product.images?.[0] ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url) : null) || 
    '/placeholder.jpg';
  
  return (
    <Link href={`/produto/${productId}`}>
      <div className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden relative">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Stock Badge */}
          {product.stock < 0 && (
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
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:block">
            <Button
              onClick={handleAddToCart}
              className="w-full bg-primary hover:bg-primary-hard text-white py-3 px-4 rounded-lg flex items-center justify-center space-x-2 font-medium shadow-lg"
              disabled={product.stock < 0}
            >
              <ShoppingCart size={18} />
              <span>{product.stock > 0 ? 'Adicionar ao Carrinho' : 'Fora de Estoque'}</span>
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Seller Info */}
          <div className="flex items-center space-x-2">
            {product.sellerLogo && (
              <img
                src={product.sellerLogo}
                alt={product.sellerName}
                className="w-6 h-6 rounded-full object-cover"
              />
            )}
            <span className="text-xs text-gray-6">por </span>
            <Link 
              href={`/vendedor/${typeof product.sellerId === 'object' ? (product.sellerId as any)._id : product.sellerId || ''}`}
              onClick={handleSellerClick}
              className="text-xs text-primary hover:text-primary-hard font-medium transition-colors"
            >
              {product.sellerName}
            </Link>
          </div>

          {/* Product Name */}
          <h3 className="font-medium text-gray-9 line-clamp-2 group-hover:text-primary transition-colors min-h-[2.5rem] flex items-start">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center space-x-1">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={i < Math.floor((product as any).averageRating || 0) ? 'text-warning fill-warning' : 'text-gray-3'}
                />
              ))}
            </div>
            <span className="text-sm text-gray-6">({(product as any).totalReviews || 0})</span>
          </div>

          {/* Price and Mobile Add to Cart */}
          <div className="space-y-3">
            {/* Price Section */}
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
                className="w-full bg-primary hover:bg-primary-hard text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2"
                disabled={product.stock < 0}
              >
                <ShoppingCart size={16} />
                <span>{product.stock > 0 ? 'Adicionar ao Carrinho' : 'Fora de Estoque'}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}