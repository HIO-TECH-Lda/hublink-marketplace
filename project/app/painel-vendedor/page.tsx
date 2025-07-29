'use client';

import React from 'react';
import Link from 'next/link';
import { Package, ShoppingBag, DollarSign, TrendingUp, Eye, Edit, Plus, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useMarketplace } from '@/contexts/MarketplaceContext';

export default function SellerDashboardPage() {
  const { state, dispatch } = useMarketplace();

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

  // Mock data for seller dashboard
  const sellerProducts = state.products.filter(p => p.sellerId === state.user?.sellerId);
  const sellerOrders = state.orders.filter(order => 
    order.items.some(item => item.product.sellerId === state.user?.sellerId)
  );

  const totalSales = sellerOrders.reduce((total, order) => {
    const sellerItems = order.items.filter(item => item.product.sellerId === state.user?.sellerId);
    return total + sellerItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }, 0);

  const pendingOrders = sellerOrders.filter(order => order.status === 'pending').length;
  const totalBalance = state.payouts.reduce((total, payout) => total + payout.amount, 0);

  const recentProducts = sellerProducts.slice(0, 4);
  const recentOrders = sellerOrders.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / 
          <Link href="/painel" className="hover:text-primary"> Painel</Link> / 
          <span className="text-primary">Painel do Vendedor</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-9 mb-2">Painel do Vendedor</h1>
            <p className="text-gray-6">Bem-vindo de volta, {state.user.firstName}!</p>
          </div>
          <Link href="/vendedor/produtos/novo">
            <Button className="bg-primary hover:bg-primary-hard text-white">
              <Plus size={16} className="mr-2" />
              Adicionar Produto
            </Button>
          </Link>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <nav className="space-y-2">
                <Link
                  href="/painel-vendedor"
                  className="flex items-center space-x-3 px-3 py-2 text-primary bg-primary/10 rounded-lg font-medium"
                >
                  <Package size={18} />
                  <span>Painel</span>
                </Link>
                <Link
                  href="/vendedor/produtos"
                  className="flex items-center space-x-3 px-3 py-2 text-gray-7 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  <Package size={18} />
                  <span>Meus Produtos</span>
                </Link>
                <Link
                  href="/vendedor/pedidos"
                  className="flex items-center space-x-3 px-3 py-2 text-gray-7 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  <ShoppingBag size={18} />
                  <span>Meus Pedidos</span>
                </Link>
                <Link
                  href="/vendedor/repasses"
                  className="flex items-center space-x-3 px-3 py-2 text-gray-7 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  <DollarSign size={18} />
                  <span>Repasses</span>
                </Link>
                <Link
                  href="/vendedor/configuracoes"
                  className="flex items-center space-x-3 px-3 py-2 text-gray-7 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  <Package size={18} />
                  <span>Configurações</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-6">Vendas Totais</p>
                    <p className="text-2xl font-bold text-gray-9">R$ {totalSales.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <DollarSign size={24} className="text-primary" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp size={16} className="text-primary mr-1" />
                  <span className="text-primary">+12% este mês</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-6">Pedidos Pendentes</p>
                    <p className="text-2xl font-bold text-gray-9">{pendingOrders}</p>
                  </div>
                  <div className="w-12 h-12 bg-warning/10 rounded-lg flex items-center justify-center">
                    <ShoppingBag size={24} className="text-warning" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-gray-6">Aguardando processamento</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-6">Produtos Ativos</p>
                    <p className="text-2xl font-bold text-gray-9">{sellerProducts.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Package size={24} className="text-primary" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-gray-6">Em estoque</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-6">Saldo a Receber</p>
                    <p className="text-2xl font-bold text-gray-9">R$ {totalBalance.toFixed(2)}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <DollarSign size={24} className="text-green-500" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-gray-6">Próximo repasse: 15/02</span>
                </div>
              </div>
            </div>

            {/* Recent Products */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-9">Meus Produtos Recentes</h2>
                <Link href="/vendedor/produtos">
                  <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white">
                    Ver Todos
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {recentProducts.map((product) => (
                  <div key={product.id} className="border border-gray-2 rounded-lg p-4">
                    <div className="aspect-square bg-gray-1 rounded-lg overflow-hidden mb-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-medium text-gray-9 mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-gray-6 mb-2">R$ {product.price.toFixed(2)}</p>
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
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-9">Pedidos Recentes</h2>
                <Link href="/vendedor/pedidos">
                  <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white">
                    Ver Todos
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-1">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-9">ID do Pedido</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-9">Data</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-9">Cliente</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-9">Total</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-9">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-9">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-2">
                    {recentOrders.map((order) => {
                      const sellerItems = order.items.filter(item => item.product.sellerId === state.user?.sellerId);
                      const sellerTotal = sellerItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
                      
                      return (
                        <tr key={order.id} className="hover:bg-gray-1/50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-9">{order.id}</td>
                          <td className="px-4 py-3 text-sm text-gray-6">{new Date(order.date).toLocaleDateString('pt-BR')}</td>
                          <td className="px-4 py-3 text-sm text-gray-6">Cliente {order.userId}</td>
                          <td className="px-4 py-3 text-sm font-medium text-primary">R$ {sellerTotal.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {order.status === 'pending' ? 'Pendente' :
                               order.status === 'processing' ? 'Processando' :
                               order.status === 'shipped' ? 'Enviado' :
                               order.status === 'delivered' ? 'Entregue' :
                               'Cancelado'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <Link href={`/vendedor/pedidos/${order.id}`}>
                              <Button size="sm" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                                Ver Detalhes
                              </Button>
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 