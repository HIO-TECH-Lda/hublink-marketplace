'use client';

import React from 'react';
import Link from 'next/link';
import { Package, ShoppingBag, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import SellerSidebar from '../../components/SellerSidebar';
import { formatCurrency } from '@/lib/payment';
import { useMyProducts } from '@/hooks/useProducts';
import { useSellerOrders } from '@/hooks/useOrders';
import RecentProductsTable from '@/components/seller/RecentProductsTable';
import RecentOrdersTable from '@/components/seller/RecentOrdersTable';

export default function SellerDashboardPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const { data: products, isLoading: productsLoading } = useMyProducts();
  const { data: orders, isLoading: ordersLoading } = useSellerOrders();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-6">Verificando autenticação...</p>
        </div>
        <Footer />
      </div>
    );
  }

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
  const sellerOrders = orders || [];

  const getSellerTotalFromOrder = (order: any) => {
    const sellerItems = order.items || [];
    return sellerItems.reduce((total: number, item: any) => total + (item.totalPrice ?? (Number(item.unitPrice) * Number(item.quantity))), 0);
  };

  const totalSales = sellerOrders.reduce((total, order) => total + getSellerTotalFromOrder(order), 0);
  const pendingOrders = sellerOrders.filter(order => order.status === 'pending').length;
  const totalBalance = 0; // TODO: Integrate with payouts API when available

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
                  {/* <span className="text-primary">+12% este mês</span> */}
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
              
              <RecentProductsTable
                products={sellerProducts}
                isLoading={productsLoading}
                limit={5}
                showActions={true}
              />
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
              
              <RecentOrdersTable
                orders={sellerOrders}
                isLoading={ordersLoading}
                limit={5}
                showDetails={true}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 