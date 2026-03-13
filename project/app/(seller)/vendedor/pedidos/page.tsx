'use client';

import React from 'react';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSellerOrders } from '@/hooks/useOrders';
import { Package, Calendar, DollarSign, Clock } from 'lucide-react';
import RecentOrdersTable from '@/components/seller/RecentOrdersTable';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import SellerSidebar from '../../components/SellerSidebar';

export default function SellerOrdersPage() {
  const { state } = useMarketplace();
  const { products, user } = state;
  const { isAuthenticated, user: authUser, loading } = useAuth();
  const { data: apiOrders, isLoading: ordersLoading } = useSellerOrders();

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

  if (!isAuthenticated || authUser?.role !== 'seller') {
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

  const sellerOrders = apiOrders || [];

  const getSellerTotalFromOrder = (order: any) => {
    const sellerItems = order.items || [];
    return sellerItems.reduce((total: number, item: any) => total + (item.totalPrice ?? (Number(item.unitPrice) * Number(item.quantity))), 0);
  };

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / 
          <Link href="/vendedor/painel" className="hover:text-primary"> Painel do Vendedor</Link> / 
          <span className="text-primary">Meus Pedidos</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <SellerSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <div className="bg-white rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total de Pedidos</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
                      {sellerOrders.length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Package className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Entregues</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
                      {sellerOrders.filter((order: any) => order.status === 'delivered').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Em Processamento</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
                      {sellerOrders.filter((order: any) => order.status === 'processing').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Valor Total</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
                      MTn {sellerOrders.reduce(
                        (total: number, order: any) => total + getSellerTotalFromOrder(order),
                        0
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Pedidos com Meus Produtos</h2>
              </div>
              
              {ordersLoading ? (
                <div className="px-6 py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-6">Carregando pedidos...</p>
                </div>
              ) : sellerOrders.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
                  <p className="text-gray-600 mb-6">Ainda não há pedidos contendo seus produtos.</p>
                  <Link 
                    href="/vendedor/produtos" 
                    className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hard"
                  >
                    Gerenciar Produtos
                  </Link>
                </div>
              ) : (
                <RecentOrdersTable
                  orders={sellerOrders}
                  isLoading={false}
                  showDetails={true}
                />
              )}
            </div>

            {/* Pagination */}
            {sellerOrders.length > 0 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">1</span> a <span className="font-medium">{sellerOrders.length}</span> de{' '}
                  <span className="font-medium">{sellerOrders.length}</span> resultados
                </div>
                <div className="flex space-x-2">
                  <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Anterior
                  </button>
                  <Button size="sm" className="px-3 py-2">
                    1
                  </Button>
                  <button className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Próximo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
} 