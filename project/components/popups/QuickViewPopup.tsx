'use client';

import React, { useState } from 'react';
import { X, Heart, ShoppingCart, Plus, Minus, Star, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useAddToCart } from '@/hooks/useCart';
import { formatCurrency } from '@/lib/payment';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

export default function QuickViewPopup() {
  const { state, dispatch } = useMarketplace();
  const addToCart = useAddToCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = state.quickViewProduct;
  if (!product) return null;

  const productId = (product as any)._id ?? (product as any).id;
  const isInWishlist = state.wishlist.some(item => item.id === product.id);
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Combine primaryImage and images array, handling both string and object formats
  const productImages = [
    ...(product.primaryImage ? [product.primaryImage] : []),
    ...(product.images?.map(img => typeof img === 'string' ? img : (img as any).url) || [])
  ].filter(Boolean);
  const primaryImageUrl = productImages[0];

  const handleClose = () => {
    dispatch({ type: 'SET_QUICK_VIEW', payload: null });
  };

  const handleAddToCart = () => {
    if (!productId) return;
    addToCart.mutate(
      {
        productId,
        quantity,
        productSnapshot: {
          name: product.name,
          price: product.price,
          primaryImage: typeof primaryImageUrl === 'string' ? primaryImageUrl : undefined,
        },
      },
      {
        onSuccess: () => {
          toast({
            title: 'Adicionado ao carrinho',
            description: `${product.name} foi adicionado ao seu carrinho.`,
          });
          dispatch({ type: 'SHOW_CART_POPUP' });
          handleClose();
        },
        onError: (error: any) => {
          toast({
            title: 'Erro',
            description: error?.response?.data?.error || error?.response?.data?.message || 'Erro ao adicionar ao carrinho.',
            variant: 'destructive',
          });
        },
      }
    );
  };

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: product.id });
    } else {
      dispatch({ type: 'ADD_TO_WISHLIST', payload: product });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slide-in-right">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-2">
          <h2 className="text-xl font-semibold">Visualização Rápida</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-1 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-8 p-6">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square rounded-lg overflow-hidden border border-gray-2">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail Images */}
            <div className="flex space-x-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-primary' : 'border-gray-2'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Product Name and Seller */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                {product.sellerLogo && (
                  <img
                    src={product.sellerLogo}
                    alt={product.sellerName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                )}
                <span className="text-sm text-gray-6">por </span>
                <Link 
                  href={`/vendedor/${typeof product.sellerId === 'object' ? (product.sellerId as any)._id : product.sellerId || ''}`}
                  className="text-sm text-primary hover:text-primary-hard font-medium transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  {product.sellerName}
                </Link>
              </div>
              
              <h1 className="text-2xl font-bold text-gray-9 mb-2">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={i < Math.floor(product.rating || 0) ? 'text-warning fill-warning' : 'text-gray-3'}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-6">({product.reviews || 0} avaliações)</span>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl font-bold text-primary">
                  {formatCurrency(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-6 line-through">
                    {formatCurrency(product.originalPrice)}
                  </span>
                )}
                {discountPercentage > 0 && (
                  <span className="bg-primary text-white text-sm px-2 py-1 rounded">
                    -{discountPercentage}%
                  </span>
                )}
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Disponibilidade:</span>
              <span className={`text-sm ${product.inStock ? 'text-primary' : 'text-danger'}`}>
                {product.inStock ? 'Em Estoque' : 'Fora de Estoque'}
              </span>
            </div>

            {/* Brand */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Marca:</span>
              <span className="text-sm text-gray-6">{product.brand}</span>
            </div>

            {/* Share */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Compartilhar Item:</span>
              <div className="flex space-x-2">
                <button className="p-2 bg-gray-1 rounded-full hover:bg-primary hover:text-white transition-colors">
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-7 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              {/* Quantity */}
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">Quantidade:</span>
                <div className="flex items-center border border-gray-3 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-1 rounded-l-lg transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 text-center py-2 border-0 focus:outline-none"
                    min="1"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-1 rounded-r-lg transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={!product.inStock || addToCart.isPending}
                  className="flex-1 bg-primary hover:bg-primary-hard text-white py-3 flex items-center justify-center space-x-2"
                >
                  <ShoppingCart size={18} />
                  <span>{addToCart.isPending ? 'Adicionando...' : 'Adicionar ao Carrinho'}</span>
                </Button>
                <button
                  onClick={handleToggleWishlist}
                  className={`p-3 border rounded-lg transition-colors ${
                    isInWishlist 
                      ? 'bg-danger text-white border-danger' 
                      : 'border-gray-3 text-gray-6 hover:bg-danger hover:text-white hover:border-danger'
                  }`}
                >
                  <Heart size={18} fill={isInWishlist ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>

            {/* Category and Tags */}
            <div className="space-y-2 pt-4 border-t border-gray-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Categoria:</span>
                <span className="text-sm text-primary hover:underline cursor-pointer">
                  {product.categoryId?.name || product.category}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">Tags:</span>
                <div className="flex flex-wrap gap-1">
                  {product.tags.map((tag, index) => (
                    <span key={index} className="text-sm text-primary hover:underline cursor-pointer">
                      {tag}{index < product.tags.length - 1 && ','}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 