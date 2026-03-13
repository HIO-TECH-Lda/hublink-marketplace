'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserOrders } from '@/hooks/useOrders';
import { ArrowLeft, Package, Calendar, DollarSign, Clock, CheckCircle, Truck, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import BuyerSidebar from '../components/BuyerSidebar';
import { formatCurrency } from '@/lib/payment';
import { OrdersTable } from '@/components/orders/OrdersTable';

export default function OrderHistoryPage() {
  const { user } = useAuth();
  const { data, isLoading } = useUserOrders();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-6">Carregando pedidos...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const userOrders = data?.orders || [];
  const stats = data?.stats;

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / 
          <Link href="/painel" className="hover:text-primary"> Meu Painel</Link> / 
          <span className="text-primary">Histórico de Pedidos</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <BuyerSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 sm:gap-6 mb-8">
              <div className="bg-white rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total de Pedidos</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
                      {stats?.total ?? userOrders.length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Gasto</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
                      {formatCurrency(
                        stats?.totalSpent ??
                          userOrders.reduce(
                            (total: number, order: any) =>
                              total + (order.totalAmount || order.total || 0),
                            0,
                          ),
                      )}
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
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Pendentes</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
                      {stats?.pending ?? userOrders.filter((order: any) => order.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Enviados / Entregues</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
                      {(stats?.shipped ?? userOrders.filter((o: any) => o.status === 'shipped').length) +
                        (stats?.delivered ?? userOrders.filter((o: any) => o.status === 'delivered').length)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Cancelados / Reembolsados</p>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 break-words">
                      {(stats?.cancelled ?? userOrders.filter((o: any) => o.status === 'cancelled' || o.status === 'canceled').length) +
                        (stats?.refunded ?? userOrders.filter((o: any) => o.status === 'refunded').length)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Todos os Pedidos</h2>
              </div>
              
              {userOrders.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
                  <p className="text-gray-600 mb-6">Você ainda não realizou nenhum pedido.</p>
                  <Link 
                    href="/loja" 
                    className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hard"
                  >
                    Fazer Primeira Compra
                  </Link>
                </div>
              ) : (
                <OrdersTable orders={userOrders} />
              )}
            </div>

            {/* Pagination */}
            {userOrders.length > 0 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">1</span> a <span className="font-medium">{userOrders.length}</span> de{' '}
                  <span className="font-medium">{userOrders.length}</span> resultados
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