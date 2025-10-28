'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Header from './Header';
import Footer from './Footer';

interface BuyerLayoutProps {
  children: React.ReactNode;
}

export default function BuyerLayout({ children }: BuyerLayoutProps) {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-6 mt-2">Verificando autenticação...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Show access denied if not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Acesso Negado</h1>
          <p className="text-gray-6 mb-8">Você precisa estar logado para acessar esta página.</p>
          <Link href="/entrar">
            <Button className="bg-primary hover:bg-primary-hard text-white">
              Fazer Login
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Render the protected content
  return <>{children}</>;
}
