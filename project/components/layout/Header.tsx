'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Heart, ShoppingCart, User, Menu, X, Phone, Mail } from 'lucide-react';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { state, dispatch } = useMarketplace();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemsCount = state.cart.reduce((total, item) => total + item.quantity, 0);
  const wishlistCount = state.wishlist.length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) return;
    
    // Navigate to shop page with search query
    const searchParams = new URLSearchParams({ q: searchQuery.trim() });
    router.push(`/loja?${searchParams.toString()}`);
    
    // Close search modal after search
    setIsSearchModalOpen(false);
    setSearchQuery('');
  };

  const handleSearchSuggestion = (suggestion: string) => {
    // Navigate to shop page with search query
    const searchParams = new URLSearchParams({ q: suggestion });
    router.push(`/loja?${searchParams.toString()}`);
    
    // Close search modal
    setIsSearchModalOpen(false);
    setSearchQuery('');
  };

  const handleCartClick = () => {
    dispatch({ type: 'SHOW_CART_POPUP' });
  };

  const handleSearchIconClick = () => {
    setIsSearchModalOpen(true);
  };

  const handleCloseSearchModal = () => {
    setIsSearchModalOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="w-full">
      {/* Top Bar */}
      <div className="bg-gray-1 border-b border-gray-3 hidden sm:block">
        <div className="container py-2 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm text-gray-8">
            <div className="flex items-center space-x-4 sm:space-x-6">
              <div className="flex items-center space-x-2">
                <Phone size={14} />
                <span className="hidden md:inline">(11) 99999-9999</span>
                <span className="md:hidden">(11) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={14} />
                <span className="hidden lg:inline">contato@ecobazar.com.br</span>
                <span className="lg:hidden">contato@ecobazar.com.br</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="hidden sm:inline">Siga-nos:</span>
              <div className="flex space-x-2">
                <Link href="#" className="hover:text-primary transition-colors text-xs sm:text-sm">Facebook</Link>
                <Link href="#" className="hover:text-primary transition-colors text-xs sm:text-sm">Instagram</Link>
                <Link href="#" className="hover:text-primary transition-colors text-xs sm:text-sm">Twitter</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="container py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-gray-9">Ecobazar</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <Link href="/" className="hover:text-primary transition-colors">Início</Link>
              <Link href="/loja" className="hover:text-primary transition-colors">Banca</Link>
              <Link href="/sobre" className="hover:text-primary transition-colors">Sobre</Link>
              <Link href="/blog" className="hover:text-primary transition-colors">Blog</Link>
              <Link href="/contato" className="hover:text-primary transition-colors">Contato</Link>
              <Link href="/faqs" className="hover:text-primary transition-colors">FAQs</Link>
            </nav>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-4 lg:mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-3 rounded-l-lg focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-4 bg-primary text-white rounded-r-lg hover:bg-primary-hard transition-colors"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            {/* Action Icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search - Mobile */}
              <button 
                onClick={handleSearchIconClick}
                className="md:hidden p-2 hover:bg-gray-1 rounded-lg transition-colors"
              >
                <Search size={20} />
              </button>

              {/* Wishlist */}
              <Link href="/lista-desejos" className="relative p-2 hover:bg-gray-1 rounded-lg transition-colors">
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-danger text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button 
                onClick={handleCartClick}
                className="relative p-2 hover:bg-gray-1 rounded-lg transition-colors"
              >
                <ShoppingCart size={20} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </button>

              {/* User Account */}
              <div className="relative">
                {state.isAuthenticated ? (
                  <Link 
                    href={state.user?.isSeller ? '/vendedor/painel' : '/painel'} 
                    className="flex items-center space-x-2 p-2 hover:bg-gray-1 rounded-lg transition-colors"
                  >
                    <User size={20} />
                    <span className="hidden sm:inline">
                      {state.user?.isSeller ? 'Painel Vendedor' : 'Minha Conta'}
                    </span>
                  </Link>
                ) : (
                  <Link href="/entrar" className="flex items-center space-x-2 p-2 hover:bg-gray-1 rounded-lg transition-colors">
                    <User size={20} />
                    <span className="hidden sm:inline">Entrar</span>
                  </Link>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-1 rounded-lg transition-colors"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-3">
              <nav className="flex flex-col space-y-2 mt-4">
                <Link href="/" className="px-4 py-2 hover:bg-gray-1 rounded-lg transition-colors">Início</Link>
                <Link href="/loja" className="px-4 py-2 hover:bg-gray-1 rounded-lg transition-colors">Banca</Link>
                <Link href="/sobre" className="px-4 py-2 hover:bg-gray-1 rounded-lg transition-colors">Sobre</Link>
                <Link href="/blog" className="px-4 py-2 hover:bg-gray-1 rounded-lg transition-colors">Blog</Link>
                <Link href="/contato" className="px-4 py-2 hover:bg-gray-1 rounded-lg transition-colors">Contato</Link>
                <Link href="/faqs" className="px-4 py-2 hover:bg-gray-1 rounded-lg transition-colors">FAQs</Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Search Modal */}
      {isSearchModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mt-20">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Buscar Produtos</h3>
              <button 
                onClick={handleCloseSearchModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="p-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Digite o que você procura..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-base"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-md hover:bg-primary-hard transition-colors"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            {/* Quick Search Suggestions */}
            <div className="px-4 pb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Busquedas Populares</h4>
              <div className="flex flex-wrap gap-2">
                {['Tomates Orgânicos', 'Frutas Frescas', 'Verduras', 'Legumes', 'Produtos Orgânicos'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSearchSuggestion(suggestion)}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}