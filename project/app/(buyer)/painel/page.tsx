'use client';

import React from 'react';
import { Package, Heart, ShoppingCart, Settings, LogOut, User, Edit } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUserOrders } from '@/hooks/useOrders';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { formatCurrency } from '@/lib/payment';
import Link from 'next/link';
import BuyerSidebar from '../components/BuyerSidebar';
import { OrdersTable } from '@/components/orders/OrdersTable';

export default function UserDashboardPage() {
  const { user } = useAuth();
  const { data: ordersData, isLoading: ordersLoading } = useUserOrders({ limit: 5 });
  const { data: cart } = useCart();
  const { data: wishlist } = useWishlist();

  const dashboardOrders = ordersData?.orders ?? [];

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />
      
      <div className="container py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-4 sm:mb-6">
          <span>Início</span> / <span className="text-primary">O Meu Painel</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <BuyerSidebar />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2 space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Welcome Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-9 mb-2">
                Bem-vindo, {user?.firstName}!
              </h1>
              <p className="text-gray-6 text-sm sm:text-base">
                Aqui pode acompanhar os seus pedidos, gerir os seus dados pessoais, actualizar o endereço de entrega e aceder ao seu Painel do Vendedor para acompanhar produtos, vendas e desempenho da sua loja no Txova.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <Package className="text-primary" size={20} />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-9">
                  {ordersData?.stats?.total ?? dashboardOrders.length}
                </h3>
                <p className="text-gray-6 text-xs sm:text-sm lg:text-base">Total de Pedidos</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <Heart className="text-danger" size={20} />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-9">{wishlist?.length || 0}</h3>
                <p className="text-gray-6 text-xs sm:text-sm lg:text-base">Itens na Lista de Desejos</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6 text-center sm:col-span-2 lg:col-span-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <ShoppingCart className="text-warning" size={20} />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-9">{cart?.totalItems || cart?.items?.length || 0}</h3>
                <p className="text-gray-6 text-xs sm:text-sm lg:text-base">Itens no Carrinho</p>
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-9">Endereço de Facturação</h2>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                  <Link href="/configuracoes" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto text-xs sm:text-sm"
                    >
                      <Edit size={14} className="mr-1 sm:mr-2" />
                      Editar Perfil
                    </Button>
                  </Link>
                  <Link href="/configuracoes" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto text-xs sm:text-sm"
                    >
                      <Edit size={14} className="mr-1 sm:mr-2" />
                      Editar Endereço
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h4 className="font-medium text-gray-9 mb-2 text-sm sm:text-base">Informações Pessoais</h4>
                  <div className="space-y-1 text-xs sm:text-sm text-gray-6">
                    <p><strong>Nome:</strong> {user?.firstName} {user?.lastName}</p>
                    <p><strong>E-mail:</strong> {user?.email}</p>
                    <p><strong>Telefone:</strong> {user?.phone || 'Não informado'}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-9 mb-2 text-sm sm:text-base">Endereço</h4>
                  <div className="space-y-1 text-xs sm:text-sm text-gray-6">
                    {(user as any)?.billingAddress ? (
                      <>
                        <p>{(user as any).billingAddress.address}</p>
                        <p>{(user as any).billingAddress.state}, {(user as any).billingAddress.zipCode}</p>
                        <p>{(user as any).billingAddress.country}</p>
                      </>
                    ) : (
                      <p className="text-gray-5 italic">Endereço não cadastrado</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Order History */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-9">Os Meus Pedidos Recentes</h2>
                <Link href="/historico-pedidos">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">Ver Todos</Button>
                </Link>
              </div>

              <OrdersTable
                orders={dashboardOrders}
                isLoading={ordersLoading}
                limit={5}
                emptyMessage={
                  <div className="text-center">
                    <Package size={40} className="mx-auto text-gray-4 mb-3 sm:mb-4" />
                    <p className="text-gray-6 text-sm sm:text-base">Você ainda não fez nenhum pedido</p>
                    <Link href="/loja">
                      <Button className="mt-3 sm:mt-4 bg-primary hover:bg-primary-hard text-white text-sm sm:text-base">
                        Ir às Compras
                      </Button>
                    </Link>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}