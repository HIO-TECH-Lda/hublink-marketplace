'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Heart, ShoppingCart, User, Menu, X, Phone, Mail, MapPin } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { cart, wishlist, user, setIsCartOpen } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-sm">
      {/* Top Bar */}
      <div className="bg-gray-1 py-2 hidden md:block">
        <div className="container flex justify-between items-center text-sm text-gray-7">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Rua São Paulo, 123 - Centro</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>contato@ecobazar.com</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>(11) 99999-9999</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">T</span>
            </div>
            <span className="text-2xl font-bold text-gray-9">Txova</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link href="/" className="text-gray-9 hover:text-primary transition-colors">
              Início
            </Link>
            <Link href="/loja" className="text-gray-9 hover:text-primary transition-colors">
              Loja
            </Link>
            <Link href="/blog" className="text-gray-9 hover:text-primary transition-colors">
              Blog
            </Link>
            <Link href="/sobre" className="text-gray-9 hover:text-primary transition-colors">
              Sobre
            </Link>
            <Link href="/contato" className="text-gray-9 hover:text-primary transition-colors">
              Contato
            </Link>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Buscar produtos..."
                className="w-full px-4 py-2 pr-10 border border-gray-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-5" />
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            <Link href="/lista-desejos" className="relative">
              <Heart className="w-6 h-6 text-gray-7 hover:text-primary transition-colors" />
              {wishlist.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative"
            >
              <ShoppingCart className="w-6 h-6 text-gray-7 hover:text-primary transition-colors" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {user ? (
              <Link href="/painel">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </Link>
            ) : (
              <Link href="/entrar">
                <User className="w-6 h-6 text-gray-7 hover:text-primary transition-colors" />
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-gray-7" />
              ) : (
                <Menu className="w-6 h-6 text-gray-7" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar produtos..."
              className="w-full px-4 py-2 pr-10 border border-gray-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-5" />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-3">
          <nav className="container py-4 space-y-4">
            <Link 
              href="/" 
              className="block text-gray-9 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Início
            </Link>
            <Link 
              href="/loja" 
              className="block text-gray-9 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Loja
            </Link>
            <Link 
              href="/blog" 
              className="block text-gray-9 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link 
              href="/sobre" 
              className="block text-gray-9 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link 
              href="/contato" 
              className="block text-gray-9 hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contato
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}