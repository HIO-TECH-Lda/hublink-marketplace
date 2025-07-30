'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Minus, X, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMarketplace } from '@/contexts/MarketplaceContext';

export default function ShoppingCartPage() {
  const { state, dispatch } = useMarketplace();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
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

  const subtotal = state.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  const shipping = subtotal >= 50 ? 0 : 10; // Free shipping over R$ 50
  const discount = appliedCoupon ? subtotal * 0.1 : 0; // 10% discount for demo
  const total = subtotal + shipping - discount;
  const totalItems = state.cart.reduce((total, item) => total + item.quantity, 0);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
    } else {
      dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { productId, quantity: newQuantity } });
    }
  };

  const handleRemoveItem = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      setAppliedCoupon(couponCode);
      alert('Cupom aplicado com sucesso!');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
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

  if (state.cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        
        <div className="container py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-2 rounded-full flex items-center justify-center mx-auto mb-6">
              <X size={32} className="text-gray-6" />
            </div>
            <h1 className="text-2xl font-bold text-gray-9 mb-4">Seu carrinho está vazio</h1>
            <p className="text-gray-6 mb-8">Adicione alguns produtos para começar suas compras!</p>
            <Link href="/loja">
              <Button className="bg-primary hover:bg-primary-hard text-white">
                Continuar Comprando
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
          <span className="text-primary">Carrinho de Compras</span>
        </nav>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-9 mb-6">Carrinho de Compras ({totalItems} itens)</h1>
              
              {/* Desktop View */}
              <div className="hidden md:block space-y-6">
                {state.cart.map((item) => (
                  <div key={item.product.id} className="flex items-center space-x-4 p-4 border border-gray-2 rounded-lg">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-gray-1 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-9 mb-1 line-clamp-2">{item.product.name}</h3>
                      
                      {/* Seller Info */}
                      <div className="flex items-center space-x-2 mb-2">
                        <img
                          src={item.product.sellerLogo || 'https://placehold.co/20x20/cccccc/000000?text=S'}
                          alt={item.product.sellerName}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span className="text-xs text-gray-6">Vendido por {item.product.sellerName}</span>
                      </div>

                      {/* Price */}
                      <div className="flex items-center space-x-2">
                        {item.product.originalPrice && (
                          <span className="text-sm text-gray-6 line-through">
                            R$ {item.product.originalPrice.toFixed(2)}
                          </span>
                        )}
                        <span className="font-medium text-primary">
                          R$ {item.product.price.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-1 rounded transition-colors"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-1 rounded transition-colors"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-0">
                      <div className="font-medium text-gray-9">
                        R$ {(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.product.id)}
                      className="p-2 text-gray-6 hover:text-danger hover:bg-danger/5 rounded transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-4">
                {state.cart.map((item) => (
                  <div key={item.product.id} className="border border-gray-2 rounded-lg overflow-hidden">
                    {/* Compact Header */}
                    <div className="p-4">
                      <div className="flex items-start space-x-3">
                        {/* Product Image */}
                        <div className="w-16 h-16 bg-gray-1 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-9 mb-1 line-clamp-2">{item.product.name}</h3>
                          
                          {/* Seller Info */}
                          <div className="flex items-center space-x-2 mb-2">
                            <img
                              src={item.product.sellerLogo || 'https://placehold.co/16x16/cccccc/000000?text=S'}
                              alt={item.product.sellerName}
                              className="w-3 h-3 rounded-full object-cover"
                            />
                            <span className="text-xs text-gray-6">Vendido por {item.product.sellerName}</span>
                          </div>

                          {/* Price and Quantity */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {item.product.originalPrice && (
                                <span className="text-xs text-gray-6 line-through">
                                  R$ {item.product.originalPrice.toFixed(2)}
                                </span>
                              )}
                              <span className="font-medium text-primary text-sm">
                                R$ {item.product.price.toFixed(2)}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="font-medium text-gray-9 text-sm">
                                R$ {(item.product.price * item.quantity).toFixed(2)}
                              </div>
                              <div className="text-xs text-gray-6">Qtd: {item.quantity}</div>
                            </div>
                          </div>
                        </div>

                        {/* Expand/Collapse Button */}
                        <button
                          onClick={() => toggleItemExpansion(item.product.id)}
                          className="p-1 text-gray-6 hover:text-gray-9 transition-colors"
                        >
                          {expandedItems.has(item.product.id) ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedItems.has(item.product.id) && (
                      <div className="border-t border-gray-2 p-4 bg-gray-1">
                        <div className="space-y-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-7">Quantidade:</span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                                className="p-2 hover:bg-white rounded transition-colors border border-gray-2"
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                                className="p-2 hover:bg-white rounded transition-colors border border-gray-2"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveItem(item.product.id)}
                            className="w-full py-2 px-4 text-danger hover:bg-danger/5 rounded-lg border border-danger/20 transition-colors text-sm font-medium"
                          >
                            Remover do Carrinho
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Cart Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6 pt-6 border-t border-gray-2">
                <Link href="/loja">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                    <ArrowLeft size={16} className="mr-2" />
                    Voltar à Banca
                  </Button>
                </Link>
                <Button
                  onClick={() => {
                    // Update cart functionality
                    alert('Carrinho atualizado!');
                  }}
                  variant="outline"
                  className="border-gray-3 text-gray-7 hover:bg-gray-1"
                >
                  Atualizar Carrinho
                </Button>
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-9 mb-6">Resumo do Carrinho</h2>
              
              {/* Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-6">Subtotal ({totalItems} itens)</span>
                  <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>Desconto</span>
                    <span>-R$ {discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-6">Frete</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-primary">Grátis</span>
                    ) : (
                      `R$ ${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>

                <div className="border-t border-gray-2 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-9">Total</span>
                    <span className="text-lg font-bold text-primary">R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="text-sm text-gray-6 text-center p-3 bg-primary/5 rounded-lg">
                    Adicione mais R$ {(50 - subtotal).toFixed(2)} para frete grátis!
                  </div>
                )}
              </div>

              {/* Coupon Section */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-9 mb-3">Cupom de Desconto</h3>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Código do Cupom"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    disabled={!couponCode.trim()}
                    className="bg-primary hover:bg-primary-hard text-white"
                  >
                    Aplicar
                  </Button>
                </div>
                {appliedCoupon && (
                  <div className="mt-2 flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                    <span className="text-sm text-green-700">Cupom aplicado: {appliedCoupon}</span>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-green-700 hover:text-green-800"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link href="/checkout">
                  <Button className="w-full bg-primary hover:bg-primary-hard text-white py-3">
                    Prosseguir para o Checkout
                  </Button>
                </Link>
                
                {shipping > 0 && (
                  <Button
                    variant="outline"
                    className="w-full border-dashed border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Adicione mais R$ {(50 - subtotal).toFixed(2)} para frete grátis!
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 