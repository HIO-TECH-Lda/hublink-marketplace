'use client';

import React from 'react';
import { useUserOrders } from '@/hooks/useOrders';
import { Package, DollarSign, Clock, Truck, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import BuyerSidebar from '../components/BuyerSidebar';
import { formatCurrency } from '@/lib/payment';
import { OrdersTable } from '@/components/orders/OrdersTable';

export default function OrderHistoryPage() {
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
            {/* Stats — same responsive pattern as buyer painel: max 3 columns, wrap; centered stack avoids truncated currency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-8">
              <div className="min-w-0 bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <Package className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-9 break-words">
                  {stats?.total ?? userOrders.length}
                </h3>
                <p className="text-gray-6 text-xs sm:text-sm lg:text-base mt-1">Total de Pedidos</p>
              </div>

              <div className="min-w-0 bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <h3 className="text-base sm:text-lg lg:text-2xl font-bold text-gray-9 break-words leading-tight px-1">
                  {formatCurrency(
                    stats?.totalSpent ??
                      userOrders.reduce(
                        (total: number, order: any) =>
                          total + (order.totalAmount || order.total || 0),
                        0,
                      ),
                  )}
                </h3>
                <p className="text-gray-6 text-xs sm:text-sm lg:text-base mt-1">Total Gasto</p>
              </div>

              <div className="min-w-0 bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-9 break-words">
                  {stats?.pending ?? userOrders.filter((order: any) => order.status === 'pending').length}
                </h3>
                <p className="text-gray-6 text-xs sm:text-sm lg:text-base mt-1">Pendentes</p>
              </div>

              <div className="min-w-0 bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-9 break-words">
                  {(stats?.shipped ?? userOrders.filter((o: any) => o.status === 'shipped').length) +
                    (stats?.delivered ?? userOrders.filter((o: any) => o.status === 'delivered').length)}
                </h3>
                <p className="text-gray-6 text-xs sm:text-sm lg:text-base mt-1">Enviados / Entregues</p>
              </div>

              <div className="min-w-0 bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6 text-center sm:col-span-2 lg:col-span-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-9 break-words">
                  {(stats?.cancelled ?? userOrders.filter((o: any) => o.status === 'cancelled' || o.status === 'canceled').length) +
                    (stats?.refunded ?? userOrders.filter((o: any) => o.status === 'refunded').length)}
                </h3>
                <p className="text-gray-6 text-xs sm:text-sm lg:text-base mt-1">Cancelados / Reembolsados</p>
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