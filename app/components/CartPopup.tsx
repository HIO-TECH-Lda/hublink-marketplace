'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';

export default function CartPopup() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQuantity, 
    removeFromCart 
  } = useApp();

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => setIsCartOpen(false)}
      />
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl animate-slide-in-right">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-2">
            <h2 className="text-lg font-semibold text-gray-9">
              Carrinho de Compras ({totalItems})
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 hover:bg-gray-1 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-7" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-6 mb-4">Seu carrinho está vazio</p>
                <Button 
                  onClick={() => setIsCartOpen(false)}
                  className="bg-primary hover:bg-primary-hard text-white"
                >
                  <Link href="/loja">Continuar Comprando</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 border border-gray-2 rounded-lg">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-9 text-sm line-clamp-2">
                        {item.name}
                      </h4>
                      <p className="text-primary font-semibold">
                        R$ {item.price.toFixed(2)}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-1 rounded"
                        >
                          <Minus className="w-4 h-4 text-gray-6" />
                        </button>
                        <span className="px-2 py-1 bg-gray-1 rounded text-sm min-w-[40px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-1 rounded"
                        >
                          <Plus className="w-4 h-4 text-gray-6" />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 hover:bg-red-100 rounded text-danger"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-gray-2">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium text-gray-9">Total de Produtos:</span>
                <span className="font-semibold text-gray-9">{totalItems}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium text-gray-9">Preço Total:</span>
                <span className="font-bold text-lg text-primary">R$ {total.toFixed(2)}</span>
              </div>
              
              <div className="space-y-2">
                <Button className="w-full bg-primary hover:bg-primary-hard text-white">
                  <Link href="/checkout">Finalizar Compra</Link>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                >
                  <Link href="/carrinho">Ir para o Carrinho</Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}