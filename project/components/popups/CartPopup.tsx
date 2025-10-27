'use client';

import React from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/payment';
import { useCart, useUpdateCartItem, useRemoveFromCart } from '@/hooks/useCart';

export default function CartPopup() {
  const { state, dispatch } = useMarketplace();
  const router = useRouter();
  
  // Use API data instead of context state
  const { data: cartData, isLoading } = useCart();
  const updateCartItem = useUpdateCartItem();
  const removeFromCart = useRemoveFromCart();

  if (!state.showCartPopup) return null;

  const handleClose = () => {
    dispatch({ type: 'HIDE_CART_POPUP' });
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart.mutate(productId);
    } else {
      updateCartItem.mutate({ productId, quantity: newQuantity });
    }
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart.mutate(productId);
  };

  const handleCheckout = () => {
    dispatch({ type: 'HIDE_CART_POPUP' });
    router.push('/checkout');
  };

  const handleGoToCart = () => {
    dispatch({ type: 'HIDE_CART_POPUP' });
    router.push('/carrinho');
  };

  // Use API data for calculations
  const cartItems = cartData?.items || [];
  const subtotal = (cartData as any)?.summary?.subtotal || cartData?.totalPrice || 0;
  const totalItems = (cartData as any)?.summary?.itemCount || cartData?.totalItems || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50 animate-fade-in">
      <div className="bg-white w-full max-w-md h-full overflow-y-auto animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-2">
          <h2 className="text-lg font-semibold">
            Carrinho de Compras ({totalItems})
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-1 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-gray-6 mt-2">Carregando carrinho...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag size={48} className="mx-auto text-gray-4 mb-4" />
              <p className="text-gray-6">Seu carrinho está vazio</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item: any) => (
                <div key={item.productId?._id || item._id} className="flex items-center space-x-4 pb-4 border-b border-gray-1 last:border-b-0">
                  {/* Product Image */}
                  <img
                    src={item.productImage || item.productId?.primaryImage || item.product?.primaryImage || '/placeholder.jpg'}
                    alt={item.productName || item.product?.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.productName || item.product?.name}</h4>
                    <p className="text-xs text-gray-6 mb-1">por {item.sellerName || item.product?.sellerName}</p>
                    <p className="text-primary font-semibold">{formatCurrency(item.unitPrice || item.price || item.product?.price)}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.productId?._id || item.product?._id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-1 rounded transition-colors"
                      disabled={updateCartItem.isPending}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.productId?._id || item.product?._id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-1 rounded transition-colors"
                      disabled={updateCartItem.isPending}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.productId?._id || item.product?._id)}
                    className="p-1 hover:bg-gray-1 rounded transition-colors text-danger"
                    disabled={removeFromCart.isPending}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="border-t border-gray-2 p-6 space-y-4">
            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total de Produtos:</span>
                <span>{totalItems} itens</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Preço Total:</span>
                <span className="text-primary">{formatCurrency(subtotal)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button 
                onClick={handleCheckout}
                className="w-full bg-primary hover:bg-primary-hard text-white"
              >
                Finalizar Compra
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                onClick={handleGoToCart}
              >
                Ir para o Carrinho
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}