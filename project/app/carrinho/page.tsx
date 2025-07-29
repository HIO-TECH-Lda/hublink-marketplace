'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Minus, X, Tag } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMarketplace } from '@/contexts/MarketplaceContext';

export default function ShoppingCartPage() {
  const { state, dispatch } = useMarketplace();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

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
          <span className="text-primary"> Carrinho de Compras</span>
        </nav>

        {/* Back Button */}
        <Link href="/loja" className="inline-flex items-center text-gray-6 hover:text-primary mb-6">
          <ArrowLeft size={16} className="mr-2" />
          Voltar à Loja
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h1 className="text-2xl font-bold text-gray-9 mb-6">Carrinho de Compras ({totalItems} itens)</h1>
              
              <div className="space-y-6">
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

              {/* Cart Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6 pt-6 border-t border-gray-2">
                <Link href="/loja">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                    <ArrowLeft size={16} className="mr-2" />
                    Voltar à Loja
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
              
              {/* Summary Details */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-6">Subtotal ({totalItems} itens)</span>
                  <span className="font-medium">R$ {subtotal.toFixed(2)}</span>
                </div>
                
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

                {appliedCoupon && (
                  <div className="flex justify-between">
                    <span className="text-gray-6">Desconto</span>
                    <span className="font-medium text-primary">-R$ {discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="border-t border-gray-2 pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-9">Total</span>
                    <span className="text-lg font-bold text-primary">R$ {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Coupon Section */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Tag size={16} className="text-gray-6" />
                  <span className="text-sm font-medium text-gray-9">Cupom de Desconto</span>
                </div>
                
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                    <span className="text-sm text-primary font-medium">{appliedCoupon}</span>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-primary hover:text-primary-hard"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Input
                      type="text"
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
                )}
              </div>

              {/* Checkout Button */}
              <Link href="/checkout" className="block">
                <Button className="w-full bg-primary hover:bg-primary-hard text-white py-3">
                  Prosseguir para o Checkout
                </Button>
              </Link>

              {/* Free Shipping Notice */}
              {shipping > 0 && (
                <div className="mt-4 p-3 bg-primary/10 rounded-lg text-center">
                  <p className="text-sm text-primary">
                    Adicione mais R$ {(50 - subtotal).toFixed(2)} para frete grátis!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 