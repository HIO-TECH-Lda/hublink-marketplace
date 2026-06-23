'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import Logo from '@/components/common/Logo';
import { siteConfig } from '@/lib/site-config';

const maisLinks = [
  { href: '/sobre', label: 'Sobre' },
  { href: '/blog', label: 'Blog' },
  { href: '/contato', label: 'Contato' },
  { href: '/faqs', label: 'FAQs' },
];

export default function Header() {
  const router = useRouter();
  const { state, dispatch } = useMarketplace();
  const { user, isAuthenticated } = useAuth();
  const { data: cartData } = useCart();
  const { data: wishlistData } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartCount = cartData?.items?.length || state.cart.length;
  const wishlistCount = wishlistData?.length || state.wishlist.length;
  const userAvatar = user?.profileImage || user?.avatar;
  const userInitials = user
    ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.trim() ||
      user.email?.charAt(0).toUpperCase()
    : '';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/loja?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  };

  const handleCartClick = () => {
    dispatch({ type: 'SHOW_CART_POPUP' });
  };

  const handleWishlistClick = () => {
    router.push('/lista-desejos');
  };

  const handleUserClick = () => {
    if (isAuthenticated) {
      router.push('/painel');
    } else {
      router.push('/entrar');
    }
  };

  return (
    <header className="sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-gray-1 border-b border-gray-3">
        <div className="container flex justify-between items-center py-1.5 px-4 sm:px-6 lg:px-8 text-xs sm:text-sm text-gray-7">
          <div className="flex items-center gap-4">
            <span>+244 923 456 789</span>
            <span className="hidden sm:inline">{siteConfig.contactEmail}</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-primary shadow-sm">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 sm:gap-4 py-2.5 sm:py-3">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo
                variant="white"
                width={100}
                height={36}
                className="h-8 sm:h-9 w-auto"
                brandNameClassName="text-white font-bold text-sm sm:text-base"
                priority
              />
            </div>

            {/* Home link - desktop */}
            <Link
              href="/"
              className="hidden lg:block text-white/90 hover:text-white text-sm font-medium whitespace-nowrap"
            >
              Home
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 min-w-0 max-w-3xl mx-auto">
              <div className="relative flex">
                <Input
                  type="text"
                  placeholder="Pesquisar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 sm:h-10 rounded-l-md rounded-r-none border-0 bg-white text-gray-9 text-sm pr-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                <Button
                  type="submit"
                  className="h-9 sm:h-10 rounded-l-none rounded-r-md bg-primary-hard hover:bg-primary-hard/90 text-white px-4 border-0"
                >
                  <Search size={18} />
                </Button>
              </div>
            </form>

            {/* Action Icons */}
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button
                onClick={handleWishlistClick}
                className="relative p-2 text-white hover:bg-white/10 rounded-md transition-colors"
                aria-label="Lista de desejos"
              >
                <Heart size={22} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-white text-primary text-[10px] rounded-full min-w-[16px] h-4 flex items-center justify-center font-bold px-0.5">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button
                onClick={handleCartClick}
                className="relative p-2 text-white hover:bg-white/10 rounded-md transition-colors"
                aria-label="Carrinho"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-white text-primary text-[10px] rounded-full min-w-[16px] h-4 flex items-center justify-center font-bold px-0.5">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={handleUserClick}
                className="p-1.5 text-white hover:bg-white/10 rounded-md transition-colors"
                aria-label="Conta"
              >
                {isAuthenticated && userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={user?.firstName ? `${user.firstName} ${user.lastName}` : 'Perfil'}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-white/80"
                  />
                ) : isAuthenticated && user ? (
                  <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 border-2 border-white/80 flex items-center justify-center text-xs font-bold text-white">
                    {userInitials}
                  </span>
                ) : (
                  <User size={22} className="m-0.5" />
                )}
              </button>

              {/* Mais dropdown - desktop */}
              <DropdownMenu>
                <DropdownMenuTrigger className="hidden lg:flex items-center gap-1 text-white/90 hover:text-white text-sm font-medium px-2 py-1.5 rounded-md hover:bg-white/10 outline-none">
                  Mais
                  <ChevronDown size={14} />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {maisLinks.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link href={link.href}>{link.label}</Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-white hover:bg-white/10 rounded-md"
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-3 shadow-md">
          <nav className="container px-4 py-3 space-y-1">
            <Link
              href="/"
              className="block py-2 text-gray-9 hover:text-primary font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/loja"
              className="block py-2 text-gray-9 hover:text-primary font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Comprar Agora
            </Link>
            <div className="pt-2 pb-1 text-xs font-semibold text-gray-6 uppercase tracking-wide">
              Mais
            </div>
            {maisLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 pl-3 text-gray-8 hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
