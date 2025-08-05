'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, Package, Search, Filter } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import SellerSidebar from '../../components/SellerSidebar';

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
                  <Button className="bg-green-600 hover:bg-green-700 text-white">
                    <Plus size={16} className="mr-2" />
                    Adicionar Produto
                  </Button>
                </Link>
              </div>
              
              {filteredProducts.length === 0 ? (
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
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <Plus size={16} className="mr-2" />
                      Adicionar Primeiro Produto
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Produto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Categoria
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Preço
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estoque
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gray-1 rounded-lg overflow-hidden flex-shrink-0">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {product.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {product.description.length > 50 
                                    ? `${product.description.substring(0, 50)}...` 
                                    : product.description
                                  }
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {product.originalPrice && (
                                <div className="text-gray-500 line-through">
                                  MTn {product.originalPrice.toFixed(2)}
                                </div>
                              )}
                              <div className="font-medium text-green-600">
                                MTn {product.price.toFixed(2)}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-2 ${product.inStock ? 'bg-green-400' : 'bg-red-400'}`}></div>
                              <span className="text-sm text-gray-900">
                                {product.inStock ? 'Em Estoque' : 'Fora de Estoque'}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {product.inStock ? 'Ativo' : 'Inativo'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-2">
                              <Link href={`/produto/${product.id}`}>
                                <Button size="sm" variant="outline" className="w-8 h-8 p-0 border-gray-3 text-gray-7 hover:bg-gray-1 flex items-center justify-center">
                                  <Eye size={14} />
                                </Button>
                              </Link>
                              <Link href={`/vendedor/produtos/editar/${product.id}`}>
                                <Button size="sm" variant="outline" className="w-8 h-8 p-0 border-green-600 text-green-600 hover:bg-green-600 hover:text-white flex items-center justify-center">
                                  <Edit size={14} />
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-8 h-8 p-0 border-red-600 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center"
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
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 