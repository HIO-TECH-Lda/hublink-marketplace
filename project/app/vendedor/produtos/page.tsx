'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, Package, Search, Filter } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMarketplace } from '@/contexts/MarketplaceContext';

export default function SellerProductsPage() {
  const { state, dispatch } = useMarketplace();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (!state.isAuthenticated || !state.user || !state.user.isSeller) {
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

  const sellerProducts = state.products.filter(p => p.sellerId === state.user?.sellerId);
  const categories = ['all', ...Array.from(new Set(sellerProducts.map(p => p.category)))];

  const filteredProducts = sellerProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      dispatch({ type: 'DELETE_PRODUCT', payload: productId });
    }
  };

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / 
          <Link href="/painel-vendedor" className="hover:text-primary"> Painel do Vendedor</Link> / 
          <span className="text-primary">Meus Produtos</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-9 mb-2">Meus Produtos</h1>
            <p className="text-gray-6">Gerencie seus produtos orgânicos</p>
          </div>
          <Link href="/vendedor/produtos/novo">
            <Button className="bg-primary hover:bg-primary-hard text-white">
              <Plus size={16} className="mr-2" />
              Adicionar Produto
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
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
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-1">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-9">Produto</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-9">Categoria</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-9">Preço</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-9">Estoque</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-9">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-9">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-2">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-1/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gray-1 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-9 mb-1">{product.name}</h3>
                          <p className="text-sm text-gray-6 line-clamp-2">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {product.originalPrice && (
                          <div className="text-sm text-gray-6 line-through">
                            R$ {product.originalPrice.toFixed(2)}
                          </div>
                        )}
                        <div className="font-medium text-primary">
                          R$ {product.price.toFixed(2)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${product.inStock ? 'bg-primary' : 'bg-danger'}`}></div>
                        <span className="text-sm font-medium">
                          {product.inStock ? 'Em Estoque' : 'Fora de Estoque'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {product.inStock ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link href={`/produto/${product.id}`}>
                          <Button size="sm" variant="outline" className="border-gray-3 text-gray-7 hover:bg-gray-1">
                            <Eye size={14} />
                          </Button>
                        </Link>
                        <Link href={`/vendedor/produtos/editar/${product.id}`}>
                          <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                            <Edit size={14} />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-danger text-danger hover:bg-danger hover:text-white"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-2 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={32} className="text-gray-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-9 mb-2">
              {searchTerm || selectedCategory !== 'all' ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
            </h3>
            <p className="text-gray-6 mb-6">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Tente ajustar os filtros de busca.' 
                : 'Comece adicionando seu primeiro produto orgânico!'
              }
            </p>
            <Link href="/vendedor/produtos/novo">
              <Button className="bg-primary hover:bg-primary-hard text-white">
                <Plus size={16} className="mr-2" />
                Adicionar Primeiro Produto
              </Button>
            </Link>
          </div>
        )}

        {/* Stats */}
        {filteredProducts.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
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
                    {sellerProducts.filter(p => p.inStock).length}
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
                    {sellerProducts.filter(p => !p.inStock).length}
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
                    {Array.from(new Set(sellerProducts.map(p => p.category))).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Package size={24} className="text-primary" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
} 