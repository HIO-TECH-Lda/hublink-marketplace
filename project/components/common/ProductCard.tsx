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
  compact?: boolean;
}

export default function ProductCard({ product, showQuickView = true, compact = false }: ProductCardProps) {
  const { dispatch } = useMarketplace();
  const { toast } = useToast();

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
            title: 'Produto adicionado',
            description: `${product.name} foi adicionado ao carrinho com sucesso.`,
            variant: 'default',
          });
          dispatch({ type: 'SHOW_CART_POPUP' });
        },
        onError: (error: any) => {
          toast({
            title: 'Erro',
            description: error?.response?.data?.error || error?.response?.data?.message || 'Erro ao adicionar produto ao carrinho.',
            variant: 'destructive',
          });
        },
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

    const productImages = [
      ...(product.primaryImage ? [product.primaryImage] : []),
      ...(product.images?.map((img) => (typeof img === 'string' ? img : img.url)) || []),
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
      primaryImage: product.primaryImage,
    };

    dispatch({ type: 'SET_QUICK_VIEW', payload: contextProduct });
  };

  const productId = typeof product._id === 'string' ? product._id : String(product._id);
  const primaryImage =
    product.primaryImage ||
    (product.images?.[0] ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url) : null) ||
    '/placeholder.jpg';

  const rating = (product as any).averageRating || product.rating || 0;
  const reviews = (product as any).totalReviews || product.reviews || 0;
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPct = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <Link href={`/produto/${productId}`} className="block h-full">
      <div
        className={`group bg-white overflow-hidden relative h-full flex flex-col transition-shadow duration-200 hover:shadow-md ${
          compact ? 'border border-gray-2 rounded-sm' : 'border border-gray-2 rounded-md shadow-sm'
        }`}
      >
        <div className="relative aspect-square overflow-hidden bg-gray-1">
          <img
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {product.stock < 0 ? (
            <div className="absolute top-1.5 left-1.5 bg-danger text-white text-[10px] px-1.5 py-0.5 rounded">
              Esgotado
            </div>
          ) : hasDiscount ? (
            <div className="absolute top-1.5 left-1.5 bg-primary text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
              -{discountPct}%
            </div>
          ) : null}

          <button
            onClick={handleToggleWishlist}
            className={`absolute top-1.5 right-1.5 p-1.5 rounded-full shadow-sm transition-colors ${
              isInWishlist ? 'bg-danger text-white' : 'bg-white/90 text-gray-6 hover:text-danger'
            }`}
          >
            <Heart size={14} fill={isInWishlist ? 'currentColor' : 'none'} />
          </button>

          {showQuickView && !compact && (
            <button
              onClick={handleQuickView}
              className="absolute bottom-1.5 right-1.5 p-1.5 bg-white/90 text-gray-6 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
            >
              <Eye size={14} />
            </button>
          )}

          <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
            <Button
              onClick={handleAddToCart}
              size="sm"
              className="w-full h-7 bg-primary hover:bg-primary-hard text-white text-xs"
              disabled={product.stock < 0}
            >
              <ShoppingCart size={14} className="mr-1" />
              Adicionar
            </Button>
          </div>
        </div>

        <div className={`flex-1 flex flex-col ${compact ? 'p-2 gap-1' : 'p-2.5 gap-1.5'}`}>
          <h3 className="text-xs text-gray-8 line-clamp-2 leading-snug group-hover:text-primary transition-colors min-h-[2.25rem]">
            {product.name}
          </h3>

          <div className="flex items-center gap-0.5">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  className={i < Math.floor(rating) ? 'text-warning fill-warning' : 'text-gray-3'}
                />
              ))}
            </div>
            {reviews > 0 && <span className="text-[10px] text-gray-5">({reviews})</span>}
          </div>

          <div className="mt-auto space-y-1.5">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm font-bold text-primary">{formatCurrency(product.price)}</span>
              {hasDiscount && (
                <span className="text-[10px] text-gray-5 line-through">{formatCurrency(product.originalPrice!)}</span>
              )}
            </div>

            <Button
              onClick={handleAddToCart}
              size="sm"
              className="w-full h-7 bg-primary hover:bg-primary-hard text-white text-xs md:hidden"
              disabled={product.stock < 0}
            >
              <ShoppingCart size={14} className="mr-1" />
              {product.stock > 0 ? 'Adicionar' : 'Esgotado'}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
