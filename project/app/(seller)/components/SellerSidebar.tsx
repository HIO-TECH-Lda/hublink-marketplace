'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, ShoppingBag, DollarSign, Settings, LogOut, User, TrendingUp, RotateCcw, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SellerSidebarProps {
  className?: string;
}

export default function SellerSidebar({ className = '' }: SellerSidebarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
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
      href: '/vendedor/avaliacoes',
      label: 'Avaliações',
      icon: Star,
      active: pathname === '/vendedor/avaliacoes'
    },
    {
      href: '/vendedor/reembolsos',
      label: 'Reembolsos',
      icon: RotateCcw,
      active: pathname === '/vendedor/reembolsos'
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
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt="Profile"
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
            />
          ) : (
            <User className="text-primary" size={20} />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-9 text-sm sm:text-base truncate">
            {user?.firstName} {user?.lastName}
          </h3>
          <p className="text-xs sm:text-sm text-gray-6 truncate">{user?.email}</p>
          <p className="text-xs text-primary font-medium">Vendedor</p>
        </div>
      </div>

      {/* Store Info */}
      {user?.sellerProfile && (
        <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-2">
          <h4 className="font-medium text-gray-9 text-sm sm:text-base mb-2">Minha Banca</h4>
          <div className="space-y-1 text-xs sm:text-sm text-gray-6">
            <p className="font-medium text-gray-9">{user.sellerProfile.storeName || 'Minha Loja'}</p>
            <p className="text-gray-6">{user.email}</p>
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