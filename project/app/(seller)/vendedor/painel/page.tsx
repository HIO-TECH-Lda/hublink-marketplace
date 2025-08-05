'use client';

import React from 'react';
import Link from 'next/link';
import { Package, ShoppingBag, DollarSign, TrendingUp, Eye, Edit, Plus, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import SellerSidebar from '../../components/SellerSidebar';
import { formatCurrency } from '@/lib/payment';

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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <SellerSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-6">Vendas Totais</p>
                    <p className="text-2xl font-bold text-gray-9">{formatCurrency(totalSales)}</p>
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
                    <p className="text-sm text-gray-6">Saldo Disponível</p>
                    <p className="text-2xl font-bold text-gray-9">{formatCurrency(totalBalance)}</p>
                  </div>
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <DollarSign size={24} className="text-success" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-gray-6">Pronto para saque</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-6">Produtos Ativos</p>
                    <p className="text-2xl font-bold text-gray-9">{sellerProducts.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center">
                    <Package size={24} className="text-info" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-gray-6">Em estoque</span>
                </div>
              </div>
            </div>

            {/* Recent Products */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-9">Produtos Recentes</h2>
                <Link href="/vendedor/produtos">
                  <Button variant="outline" size="sm">
                    Ver Todos
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                    <p className="text-sm text-gray-6 mb-2">{formatCurrency(product.price)}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        product.inStock 
                          ? 'bg-success/10 text-success' 
                          : 'bg-danger/10 text-danger'
                      }`}>
                        {product.inStock ? 'Em Estoque' : 'Fora de Estoque'}
                      </span>
                      <Link href={`/vendedor/produtos/editar/${product.id}`}>
                        <Button variant="ghost" size="sm">
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-9">Pedidos Recentes</h2>
                <Link href="/vendedor/pedidos">
                  <Button variant="outline" size="sm">
                    Ver Todos
                    <ArrowRight size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-2">
                      <th className="text-left py-3 px-4 font-medium text-gray-7">ID do Pedido</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Cliente</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Data</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Total</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => {
                      const sellerItems = order.items.filter(item => item.product.sellerId === state.user?.sellerId);
                      const sellerTotal = sellerItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
                      
                      return (
                        <tr key={order.id} className="border-b border-gray-1">
                          <td className="px-4 py-3 text-sm font-medium text-gray-9">{order.id}</td>
                          <td className="px-4 py-3 text-sm text-gray-6">
                            {order.billingAddress?.firstName} {order.billingAddress?.lastName}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-6">{order.date}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              order.status === 'delivered' ? 'bg-success/10 text-success' :
                              order.status === 'shipped' ? 'bg-warning/10 text-warning' :
                              order.status === 'processing' ? 'bg-info/10 text-info' :
                              'bg-gray-1 text-gray-6'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-primary">{formatCurrency(sellerTotal)}</td>
                          <td className="px-4 py-3">
                            <Button variant="ghost" size="sm">
                              <Eye size={14} />
                            </Button>
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