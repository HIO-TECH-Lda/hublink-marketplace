'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart, ShoppingCart, Share2, Facebook, Twitter, Instagram, X, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/common/ProductCard';
import { Button } from '@/components/ui/button';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { formatCurrency } from '@/lib/payment';

export default function WishlistPage() {
  const { state, dispatch } = useMarketplace();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  if (!state.isAuthenticated || !state.user) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Acesso Negado</h1>
          <p className="text-gray-6 mb-8">Você precisa estar logado para acessar esta página.</p>
          <Link href="/entrar">
            <Button className="bg-primary hover:bg-primary-hard text-white">
              Fazer Login
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = (product: any) => {
    dispatch({ 
      type: 'ADD_TO_CART', 
      payload: { product, quantity: 1 } 
    });
    dispatch({ type: 'SHOW_CART_POPUP' });
  };

  const handleRemoveFromWishlist = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: productId });
  };

  const handleShare = (product: any, platform: string) => {
    const url = `${window.location.origin}/produto/${product.id}`;
    const text = `Confira este produto incrível: ${product.name}`;
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing via URL
        alert('Para compartilhar no Instagram, copie o link do produto e cole na sua história!');
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const toggleItemExpansion = (productId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(productId)) {
      newExpanded.delete(productId);
    } else {
      newExpanded.add(productId);
    }
    setExpandedItems(newExpanded);
  };

  if (state.wishlist.length === 0) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        
        <div className="container py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-2 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={32} className="text-gray-6" />
            </div>
            <h1 className="text-2xl font-bold text-gray-9 mb-4">Sua lista de desejos está vazia</h1>
            <p className="text-gray-6 mb-8">Adicione produtos à sua lista de desejos para vê-los aqui!</p>
            <Link href="/loja">
              <Button className="bg-primary hover:bg-primary-hard text-white">
                Explorar Produtos
              </Button>
            </Link>
          </div>
        </div>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / 
          <Link href="/painel" className="hover:text-primary"> Meu Painel</Link> / 
          <span className="text-primary">Lista de Desejos</span>
        </nav>

        {/* Main Content */}
        <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          {/* Desktop Table View */}
          <div className="hidden lg:block bg-white rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-9">Lista de Desejos ({state.wishlist.length} itens)</h1>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-9">Produto</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-9">Preço</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-9">Status do Estoque</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-9">Ações</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-9">Compartilhar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {state.wishlist.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-1/50">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gray-1 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-9 mb-1">{product.name}</h3>
                            <div className="flex items-center space-x-2">
                              <img
                                src={product.sellerLogo || 'https://placehold.co/20x20/cccccc/000000?text=S'}
                                alt={product.sellerName}
                                className="w-4 h-4 rounded-full object-cover"
                              />
                              <span className="text-sm text-gray-6">Vendido por {product.sellerName}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {product.originalPrice && (
                            <div className="text-sm text-gray-6 line-through">
                              {formatCurrency(product.originalPrice)}
                            </div>
                          )}
                          <div className="font-medium text-primary">
                            {formatCurrency(product.price)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-primary' : 'bg-danger'}`}></div>
                          <span className="text-sm font-medium">
                            {product.inStock ? 'Em Estoque' : 'Fora de Estoque'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => handleAddToCart(product)}
                            disabled={!product.inStock}
                            size="sm"
                            className="bg-primary hover:bg-primary-hard text-white"
                          >
                            <ShoppingCart size={14} className="mr-1" />
                            Adicionar ao Carrinho
                          </Button>
                          <Button
                            onClick={() => handleRemoveFromWishlist(product.id)}
                            size="sm"
                            variant="outline"
                            className="border-danger text-danger hover:bg-danger hover:text-white"
                          >
                            <X size={14} />
                          </Button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleShare(product, 'facebook')}
                            className="p-2 text-gray-6 hover:text-blue-600 transition-colors"
                            title="Compartilhar no Facebook"
                          >
                            <Facebook size={16} />
                          </button>
                          <button
                            onClick={() => handleShare(product, 'twitter')}
                            className="p-2 text-gray-6 hover:text-blue-400 transition-colors"
                            title="Compartilhar no Twitter"
                          >
                            <Twitter size={16} />
                          </button>
                          <button
                            onClick={() => handleShare(product, 'instagram')}
                            className="p-2 text-gray-6 hover:text-pink-600 transition-colors"
                            title="Compartilhar no Instagram"
                          >
                            <Instagram size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden bg-white rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold text-gray-9 mb-6">Lista de Desejos ({state.wishlist.length} itens)</h1>
            <div className="space-y-4">
              {state.wishlist.map((product) => (
                <div key={product.id} className="border border-gray-2 rounded-lg overflow-hidden">
                  {/* Compact Header */}
                  <div className="p-4">
                    <div className="flex items-start space-x-3">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-gray-1 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-9 mb-1 line-clamp-2">{product.name}</h3>
                        
                        {/* Seller Info */}
                        <div className="flex items-center space-x-2 mb-2">
                          <img
                            src={product.sellerLogo || 'https://placehold.co/16x16/cccccc/000000?text=S'}
                            alt={product.sellerName}
                            className="w-3 h-3 rounded-full object-cover"
                          />
                          <span className="text-xs text-gray-6">Vendido por {product.sellerName}</span>
                        </div>

                        {/* Price and Stock Status */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {product.originalPrice && (
                              <span className="text-xs text-gray-6 line-through">
                                {formatCurrency(product.originalPrice)}
                              </span>
                            )}
                            <span className="font-medium text-primary text-sm">
                              {formatCurrency(product.price)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-primary' : 'bg-danger'}`}></div>
                            <span className="text-xs font-medium">
                              {product.inStock ? 'Em Estoque' : 'Fora de Estoque'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Expand/Collapse Button */}
                      <button
                        onClick={() => toggleItemExpansion(product.id)}
                        className="p-1 text-gray-6 hover:text-gray-9 transition-colors"
                      >
                        {expandedItems.has(product.id) ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedItems.has(product.id) && (
                    <div className="border-t border-gray-2 p-4 bg-gray-1">
                      <div className="space-y-4">
                        {/* Action Buttons */}
                        <div className="flex flex-col space-y-2">
                          <Button
                            onClick={() => handleAddToCart(product)}
                            disabled={!product.inStock}
                            className="w-full bg-primary hover:bg-primary-hard text-white"
                          >
                            <ShoppingCart size={14} className="mr-2" />
                            Adicionar ao Carrinho
                          </Button>
                          <Button
                            onClick={() => handleRemoveFromWishlist(product.id)}
                            variant="outline"
                            className="w-full border-danger text-danger hover:bg-danger hover:text-white"
                          >
                            <X size={14} className="mr-2" />
                            Remover da Lista
                          </Button>
                        </div>

                        {/* Share Section */}
                        <div className="border-t border-gray-2 pt-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-7">Compartilhar:</span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleShare(product, 'facebook')}
                                className="p-2 text-gray-6 hover:text-blue-600 transition-colors bg-white rounded"
                              >
                                <Facebook size={14} />
                              </button>
                              <button
                                onClick={() => handleShare(product, 'twitter')}
                                className="p-2 text-gray-6 hover:text-blue-400 transition-colors bg-white rounded"
                              >
                                <Twitter size={14} />
                              </button>
                              <button
                                onClick={() => handleShare(product, 'instagram')}
                                className="p-2 text-gray-6 hover:text-pink-600 transition-colors bg-white rounded"
                              >
                                <Instagram size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Cart Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6 pt-6 border-t border-gray-2">
            <Link href="/loja">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                <ArrowLeft size={16} className="mr-2" />
                Voltar para as Compras
              </Button>
            </Link>
          </div>

        </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 