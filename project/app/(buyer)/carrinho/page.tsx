'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Minus, X, Tag, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart, useUpdateCartItem, useRemoveFromCart } from '@/hooks/useCart';
import { formatCurrency } from '@/lib/payment';
import { useToast } from '@/hooks/use-toast';
import BuyerLayout from '@/components/layout/BuyerLayout';

export default function ShoppingCartPage() {
  const { state, dispatch } = useMarketplace();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  
  // Use API data instead of context state
  const { data: cartData, isLoading } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();


  // Use API data for calculations
  const cartItems = cartData?.items || [];
  const subtotal = (cartData as any)?.summary?.subtotal || cartData?.totalPrice || 0;
  const shipping = subtotal >= 500 ? 0 : 100; // Free shipping over 500 MZN
  const discount = appliedCoupon ? subtotal * 0.1 : 0; // 10% discount for demo
  const total = subtotal + shipping - discount;
  const totalItems = (cartData as any)?.summary?.itemCount || cartData?.totalItems || 0;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart.mutate(productId, {
        onSuccess: () => {
          toast({
            title: "Item removido",
            description: "Produto removido do carrinho com sucesso.",
            variant: "default",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Erro",
            description: error?.response?.data?.error || error?.response?.data?.message || "Erro ao remover item do carrinho.",
            variant: "destructive",
          });
        }
      });
    } else {
      updateCartItem.mutate({ productId, quantity: newQuantity }, {
        onSuccess: () => {
          toast({
            title: "Quantidade atualizada",
            description: "Quantidade do produto atualizada com sucesso.",
            variant: "default",
          });
        },
        onError: (error: any) => {
          toast({
            title: "Erro",
            description: error?.response?.data?.error || error?.response?.data?.message || "Erro ao atualizar quantidade.",
            variant: "destructive",
          });
        }
      });
    }
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart.mutate(productId, {
      onSuccess: () => {
        toast({
          title: "Item removido",
          description: "Produto removido do carrinho com sucesso.",
          variant: "default",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Erro",
          description: error?.response?.data?.error || error?.response?.data?.message || "Erro ao remover item do carrinho.",
          variant: "destructive",
        });
      }
    });
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

  if (cartItems.length === 0 && !isLoading) {
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
    <BuyerLayout>
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
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-gray-6 mt-2">Carregando carrinho...</p>
                  </div>
                ) : cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-6">Seu carrinho está vazio</p>
                  </div>
                ) : (
                  cartItems.map((item: any) => (
                    <div key={item.productId?._id || item._id} className="flex items-center space-x-4 p-4 border border-gray-2 rounded-lg">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-1 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.productImage || item.productId?.primaryImage || item.product?.primaryImage || '/placeholder.jpg'}
                          alt={item.productName || item.product?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <h3 className="font-medium text-gray-9 line-clamp-2">{item.productName || item.product?.name}</h3>
                        
                        {/* Seller Info */}
                        <div className="flex items-center space-x-2">
                          <img
                            src={item.sellerLogo || item.product?.sellerLogo || 'https://placehold.co/20x20/cccccc/000000?text=S'}
                            alt={item.sellerName || item.product?.sellerName}
                            className="w-4 h-4 rounded-full object-cover"
                          />
                          <span className="text-xs text-gray-6">Vendido por {item.sellerName || item.product?.sellerName}</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center space-x-2">
                          {item.originalPrice && (
                            <span className="text-sm text-gray-6 line-through">
                              {formatCurrency(item.originalPrice)}
                            </span>
                          )}
                          <span className="font-medium text-primary">
                            {formatCurrency(item.unitPrice || item.price || item.product?.price)}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <button
                          onClick={() => handleQuantityChange(item.productId?._id || item.product?._id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-1 rounded transition-colors"
                          disabled={updateCartItem.isPending}
                        >
                        <Minus size={16} />
                      </button>
                      <span className="w-12 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.productId?._id || item.product?._id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-1 rounded transition-colors"
                        disabled={updateCartItem.isPending}
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="text-right min-w-0 flex-shrink-0">
                      <div className="font-medium text-gray-9">
                        {formatCurrency((item.unitPrice || item.price || item.product?.price) * item.quantity)}
                      </div>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.productId?._id || item.product?._id)}
                      className="p-2 text-gray-6 hover:text-danger hover:bg-danger/5 rounded transition-colors flex-shrink-0"
                      disabled={removeFromCart.isPending}
                    >
                      <X size={16} />
                    </button>
                  </div>
                  ))
                )}
              </div>

              {/* Mobile View */}
              <div className="md:hidden space-y-4">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="text-gray-6 mt-2">Carregando carrinho...</p>
                  </div>
                ) : cartItems.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-6">Seu carrinho está vazio</p>
                  </div>
                ) : (
                  cartItems.map((item: any) => (
                  <div key={item.productId?._id || item._id} className="border border-gray-2 rounded-lg overflow-hidden">
                    {/* Compact Header */}
                    <div className="p-4">
                      <div className="flex items-start space-x-3">
                        {/* Product Image */}
                        <div className="w-16 h-16 bg-gray-1 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.productImage || item.productId?.primaryImage || item.product?.primaryImage || '/placeholder.jpg'}
                            alt={item.productName || item.product?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <h3 className="font-medium text-gray-9 line-clamp-2">{item.productName || item.product?.name}</h3>
                          
                          {/* Seller Info */}
                          <div className="flex items-center space-x-2">
                            <img
                              src={item.sellerLogo || item.product?.sellerLogo || 'https://placehold.co/16x16/cccccc/000000?text=S'}
                              alt={item.sellerName || item.product?.sellerName}
                              className="w-3 h-3 rounded-full object-cover"
                            />
                            <span className="text-xs text-gray-6">Vendido por {item.sellerName || item.product?.sellerName}</span>
                          </div>

                          {/* Price and Quantity */}
                          <div className="space-y-2">
                            {/* Price Section */}
                            <div className="flex items-center space-x-2">
                              {item.originalPrice && (
                                <span className="text-xs text-gray-6 line-through">
                                  {formatCurrency(item.originalPrice)}
                                </span>
                              )}
                              <span className="font-medium text-primary text-sm">
                                {formatCurrency(item.unitPrice || item.price || item.product?.price)}
                              </span>
                            </div>
                            
                            {/* Quantity and Total Section */}
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-gray-6">Qtd: {item.quantity}</div>
                              <div className="font-medium text-gray-9 text-sm">
                                {formatCurrency((item.unitPrice || item.price || item.product?.price) * item.quantity)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expand/Collapse Button */}
                        <button
                          onClick={() => toggleItemExpansion(item.productId?._id || item._id)}
                          className="p-1 text-gray-6 hover:text-gray-9 transition-colors"
                        >
                          {expandedItems.has(item.productId?._id || item._id) ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedItems.has(item.productId?._id || item._id) && (
                      <div className="border-t border-gray-2 p-4 bg-gray-1">
                        <div className="space-y-4">
                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-7">Quantidade:</span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleQuantityChange(item.productId?._id || item.product?._id, item.quantity - 1)}
                                className="p-2 hover:bg-white rounded transition-colors border border-gray-2"
                                disabled={updateCartItem.isPending}
                              >
                                <Minus size={14} />
                              </button>
                              <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantityChange(item.productId?._id || item.product?._id, item.quantity + 1)}
                                className="p-2 hover:bg-white rounded transition-colors border border-gray-2"
                                disabled={updateCartItem.isPending}
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveItem(item.productId?._id || item.product?._id)}
                            className="w-full py-2 px-4 text-danger hover:bg-danger/5 rounded-lg border border-danger/20 transition-colors text-sm font-medium"
                            disabled={removeFromCart.isPending}
                          >
                            Remover do Carrinho
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  ))
                )}
              </div>

              {/* Cart Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-6 pt-6 border-t border-gray-2">
                <Link href="/loja">
                  <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                    <ArrowLeft size={16} className="mr-2" />
                    Voltar para as Compras
                  </Button>
                </Link>
                {/* <Button
                  onClick={() => {
                    // Update cart functionality
                    alert('Carrinho atualizado!');
                  }}
                  variant="outline"
                  className="border-gray-3 text-gray-7 hover:bg-gray-1"
                >
                  Atualizar Carrinho
                </Button> */}
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
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>Desconto</span>
                    <span>-{formatCurrency(discount)}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-6">Frete</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-primary">Grátis</span>
                    ) : (
                      formatCurrency(shipping)
                    )}
                  </span>
                </div>

                <div className="border-t border-gray-2 pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-9">Total</span>
                    <span className="text-lg font-bold text-primary">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              {shipping > 0 && (
                <div className="text-sm text-gray-6 text-center p-3 bg-primary/5 rounded-lg">
                  Adicione mais {formatCurrency(500 - subtotal)} para frete grátis!
                </div>
              )}

              {/* Coupon Section */}
              <div className="border-t border-gray-2 pt-4">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Código do cupom"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    variant="outline"
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Aplicar
                  </Button>
                </div>
                
                {appliedCoupon && (
                  <div className="mt-2 flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                    <span className="text-sm text-green-700">
                      Cupom aplicado: <strong>{appliedCoupon}</strong>
                    </span>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Checkout Button */}
              <Link href="/checkout">
                <Button className="w-full bg-primary hover:bg-primary-hard text-white py-3 mt-4 mb-4">
                  Finalizar Compra
                </Button>
              </Link>

              {/* Continue Shopping */}
              {shipping > 0 && (
                <Link href="/loja">
                  <Button
                    variant="outline"
                    className="w-full border-dashed border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Adicione mais {formatCurrency(500 - subtotal)} para frete grátis!
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
    </BuyerLayout>
  );
} 