'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, Heart, ShoppingCart, Settings, LogOut, User, TrendingUp } from 'lucide-react';
import { useMarketplace } from '@/contexts/MarketplaceContext';

interface BuyerSidebarProps {
  className?: string;
}

export default function BuyerSidebar({ className = '' }: BuyerSidebarProps) {
  const { state, dispatch } = useMarketplace();
  const pathname = usePathname();

  const handleLogout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_AUTHENTICATED', payload: false });
    dispatch({ type: 'CLEAR_CART' });
  };

  const navigationItems = [
    {
      href: '/painel',
      label: 'Painel',
      icon: TrendingUp,
      active: pathname === '/painel'
    },
    {
      href: '/historico-pedidos',
      label: 'Histórico de Pedidos',
      icon: Package,
      active: pathname === '/historico-pedidos'
    },
    {
      href: '/configuracoes',
      label: 'Configurações',
      icon: Settings,
      active: pathname === '/configuracoes'
    }
  ];

  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 sm:p-6 ${className}`}>
      {/* User Profile */}
      <div className="flex items-center space-x-3 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-2">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
          {state.user?.profileImage ? (
            <img
              src={state.user.profileImage}
              alt="Profile"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
            />
          ) : (
            <User className="text-primary" size={20} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-9 text-sm sm:text-base truncate">
            {state.user?.firstName} {state.user?.lastName}
          </h3>
          <p className="text-xs sm:text-sm text-gray-6 truncate">{state.user?.email}</p>
          <p className="text-xs text-primary font-medium">Cliente</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-2">
        <h4 className="font-medium text-gray-9 text-sm sm:text-base mb-3">Resumo</h4>
        <div className="space-y-2 text-xs sm:text-sm text-gray-6">
          <div className="flex justify-between">
            <span>Pedidos:</span>
            <span className="font-medium text-gray-9">{state.orders.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Lista de Desejos:</span>
            <span className="font-medium text-gray-9">{state.wishlist.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Carrinho:</span>
            <span className="font-medium text-gray-9">{state.cart.length}</span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-1 sm:space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 lg:px-4 py-2 sm:py-3 rounded-lg transition-colors text-sm sm:text-base ${
                item.active
                  ? 'text-primary bg-primary/10 font-medium'
                  : 'text-gray-7 hover:text-primary hover:bg-primary/5'
              }`}
            >
              <Icon size={18} className="flex-shrink-0 sm:w-5 sm:h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Seller Link (if user is also a seller) */}
      {state.user?.isSeller && (
        <div className="mt-4 pt-4 border-t border-gray-2">
          <Link
            href="/vendedor/painel"
            className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-gray-7 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors text-sm sm:text-base"
          >
            <Package size={18} className="flex-shrink-0 sm:w-5 sm:h-5" />
            <span>Painel do Vendedor</span>
          </Link>
        </div>
      )}

      {/* Logout Button */}
      <div className="mt-6 pt-4 border-t border-gray-2">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 lg:px-4 py-2 sm:py-3 text-gray-7 hover:text-danger hover:bg-danger/5 rounded-lg transition-colors w-full text-left text-sm sm:text-base"
        >
          <LogOut size={18} className="flex-shrink-0 sm:w-5 sm:h-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
} 