'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-1">
      <Header />

      <div className="container py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="relative">
              <div className="text-8xl sm:text-9xl font-bold text-gray-3 mb-4">404</div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                  <Search size={64} className="text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-9 mb-4">
              Ops! Página não encontrada
            </h1>
            <p className="text-lg text-gray-7 leading-relaxed">
              A página que você está procurando não existe ou foi movida. 
              Não se preocupe, você pode voltar para a página inicial ou 
              explorar nossos produtos orgânicos.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/">
              <Button size="lg" className="bg-primary hover:bg-primary-hard text-white px-8 py-3">
                <Home size={20} className="mr-2" />
                Voltar para a Página Inicial
              </Button>
            </Link>
            <Link href="/loja">
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3">
                <ArrowLeft size={20} className="mr-2" />
                Explorar Produtos
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-9 mb-4">
              Páginas Populares
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/loja"
                className="p-4 border border-gray-2 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
              >
                <h3 className="font-semibold text-gray-9 mb-1">Nossos Produtos</h3>
                <p className="text-sm text-gray-6">Descubra nossa seleção de alimentos orgânicos</p>
              </Link>
              
              <Link
                href="/sobre"
                className="p-4 border border-gray-2 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
              >
                <h3 className="font-semibold text-gray-9 mb-1">Sobre Nós</h3>
                <p className="text-sm text-gray-6">Conheça nossa história e missão</p>
              </Link>
              
              <Link
                href="/blog"
                className="p-4 border border-gray-2 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
              >
                <h3 className="font-semibold text-gray-9 mb-1">Blog</h3>
                <p className="text-sm text-gray-6">Dicas e receitas com alimentos orgânicos</p>
              </Link>
              
              <Link
                href="/contato"
                className="p-4 border border-gray-2 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-left"
              >
                <h3 className="font-semibold text-gray-9 mb-1">Contato</h3>
                <p className="text-sm text-gray-6">Entre em contato conosco</p>
              </Link>
            </div>
          </div>

          {/* Search Suggestion */}
          <div className="mt-8 p-6 bg-primary/10 rounded-lg">
            <h3 className="font-semibold text-gray-9 mb-2">
              Não encontrou o que procurava?
            </h3>
            <p className="text-gray-7 mb-4">
              Use nossa busca para encontrar produtos específicos ou navegue pelas categorias.
            </p>
            <Link href="/loja">
              <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                <Search size={16} className="mr-2" />
                Buscar Produtos
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 