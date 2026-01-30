'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, Package, Search, Filter } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useAuth } from '@/contexts/AuthContext';
import SellerSidebar from '../../components/SellerSidebar';
import { useMyProducts, useDeleteProduct } from '@/hooks/useProducts';
import { useToast } from '@/hooks/use-toast';
import RecentProductsTable from '@/components/seller/RecentProductsTable';

export default function SellerProductsPage() {
  const { state } = useMarketplace();
  const { isAuthenticated, user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { data: products, isLoading: productsLoading } = useMyProducts();
  const deleteProduct = useDeleteProduct();
  const { toast } = useToast();

  if (!isAuthenticated || user?.role !== 'seller') {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Acesso Negado</h1>
          <p className="text-gray-6 mb-8">Você precisa ser um vendedor para acessar esta página.</p>
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

  const sellerProducts = products || [];
  const categories = ['all', ...Array.from(new Set(sellerProducts.map((p: any) => p.category || p.categoryId?.name || 'Sem Categoria')))] as string[];

  const filteredProducts = sellerProducts.filter((product: any) => {
    const name = (product.name || '').toLowerCase();
    const desc = (product.description || '').toLowerCase();
    const cat = (product.category || product.categoryId?.name || '').toLowerCase();
    const matchesSearch = name.includes(searchTerm.toLowerCase()) || desc.includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || cat === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleDeleteProduct = (productId: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return;
    deleteProduct.mutate(productId, {
      onSuccess: () => {
        toast({ title: 'Produto excluído', description: 'O produto foi removido com sucesso.' });
      },
      onError: (error: any) => {
        const apiError = error?.response?.data?.error || error?.response?.data?.message || 'Erro ao excluir produto';
        toast({ title: 'Erro', description: apiError, variant: 'destructive' });
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / 
          <Link href="/vendedor/painel" className="hover:text-primary"> Painel do Vendedor</Link> / 
          <span className="text-primary">Meus Produtos</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <SellerSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats */}
            {sellerProducts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-6">Total de Produtos</p>
                      <p className="text-2xl font-bold text-gray-9">{sellerProducts.length}</p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Package size={24} className="text-primary" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-6">Em Estoque</p>
                      <p className="text-2xl font-bold text-gray-9">
                        {sellerProducts.filter((p: any) => p.inStock || (p.stock ?? 0) > 0).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Package size={24} className="text-green-500" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-6">Fora de Estoque</p>
                      <p className="text-2xl font-bold text-gray-9">
                        {sellerProducts.filter((p: any) => !(p.inStock || (p.stock ?? 0) > 0)).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-danger/10 rounded-lg flex items-center justify-center">
                      <Package size={24} className="text-danger" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-6">Categorias</p>
                      <p className="text-2xl font-bold text-gray-9">
                        {Array.from(new Set(sellerProducts.map((p: any) => p.category || p.categoryId?.name))).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Package size={24} className="text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-9 mb-2">Buscar Produto</label>
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-6" />
                    <Input
                      type="text"
                      placeholder="Nome ou descrição do produto"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-9 mb-2">Categoria</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-3 rounded-lg focus:outline-none focus:border-primary"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'Todas as Categorias' : category}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex items-end">
                  <Button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('all');
                    }}
                    variant="outline"
                    className="w-full border-gray-3 text-gray-7 hover:bg-gray-1"
                  >
                    <Filter size={16} className="mr-2" />
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Produtos ({filteredProducts.length})</h2>
                <Link href="/vendedor/produtos/novo">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary-hard">
                    <Plus size={16} className="mr-2" />
                    Adicionar Produto
                  </Button>
                </Link>
              </div>
              
              {productsLoading ? (
                <div className="px-6 py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-6">Carregando produtos...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm || selectedCategory !== 'all' ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchTerm || selectedCategory !== 'all' 
                      ? 'Tente ajustar os filtros de busca.' 
                      : 'Comece adicionando seu primeiro produto orgânico!'
                    }
                  </p>
                  <Link href="/vendedor/produtos/novo">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary-hard">
                      <Plus size={16} className="mr-2" />
                      Adicionar Primeiro Produto
                    </Button>
                  </Link>
                </div>
              ) : (
                <RecentProductsTable
                  products={filteredProducts}
                  isLoading={false}
                  onDelete={handleDeleteProduct}
                  showActions={true}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 