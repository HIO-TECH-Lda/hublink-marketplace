'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, ShoppingBag, DollarSign, Settings, LogOut, User, TrendingUp } from 'lucide-react';
import { useMarketplace } from '@/contexts/MarketplaceContext';

interface SellerSidebarProps {
  className?: string;
}

export default function SellerSidebar({ className = '' }: SellerSidebarProps) {
  const { state, dispatch } = useMarketplace();
  const pathname = usePathname();

  const handleLogout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_AUTHENTICATED', payload: false });
    dispatch({ type: 'CLEAR_CART' });
  };

  const navigationItems = [
    {
      href: '/vendedor/painel',
      label: 'Painel',
      icon: TrendingUp,
      active: pathname === '/vendedor/painel'
    },
    {
      href: '/vendedor/produtos',
      label: 'Meus Produtos',
      icon: Package,
      active: pathname === '/vendedor/produtos'
    },
    {
      href: '/vendedor/pedidos',
      label: 'Meus Pedidos',
      icon: ShoppingBag,
      active: pathname === '/vendedor/pedidos'
    },
    {
      href: '/vendedor/repasses',
      label: 'Repasses',
      icon: DollarSign,
      active: pathname === '/vendedor/repasses'
    },
    {
      href: '/vendedor/configuracoes',
      label: 'Configurações',
      icon: Settings,
      active: pathname === '/vendedor/configuracoes'
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
          <p className="text-xs text-primary font-medium">Vendedor</p>
        </div>
      </div>

      {/* Store Info */}
      {state.user?.storeSettings && (
        <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-2">
          <h4 className="font-medium text-gray-9 text-sm sm:text-base mb-2">Minha Loja</h4>
          <div className="space-y-1 text-xs sm:text-sm text-gray-6">
            <p className="font-medium text-gray-9">{state.user.storeSettings.storeName}</p>
            <p className="text-gray-6">{state.user.storeSettings.storeEmail}</p>
          </div>
        </div>
      )}

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