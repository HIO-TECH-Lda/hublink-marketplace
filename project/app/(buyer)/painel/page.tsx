'use client';

import React from 'react';
import { Package, Heart, ShoppingCart, Settings, LogOut, User, Edit, Eye } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import Link from 'next/link';
import BuyerSidebar from '../components/BuyerSidebar';

export default function UserDashboardPage() {
  const { state, dispatch } = useMarketplace();

  if (!state.isAuthenticated || !state.user) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Acesso Negado</h1>
          <p className="text-gray-6 mb-8">Você precisa estar logado para acessar esta página.</p>
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

  const handleLogout = () => {
    dispatch({ type: 'SET_USER', payload: null });
    dispatch({ type: 'SET_AUTHENTICATED', payload: false });
    dispatch({ type: 'CLEAR_CART' });
  };

  const recentOrders = [
    {
      id: '#ORD001',
      date: '15 Jan 2024',
      total: 45.90,
      status: 'Entregue',
      statusColor: 'text-primary'
    },
    {
      id: '#ORD002',
      date: '10 Jan 2024',
      total: 32.50,
      status: 'A caminho',
      statusColor: 'text-warning'
    },
    {
      id: '#ORD003',
      date: '05 Jan 2024',
      total: 78.20,
      status: 'Processando',
      statusColor: 'text-blue-600'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />
      
      <div className="container py-4 sm:py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-4 sm:mb-6">
          <span>Início</span> / <span className="text-primary">Meu Painel</span>
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
                Bem-vindo, {state.user.firstName}!
              </h1>
              <p className="text-gray-6 text-sm sm:text-base">
                Gerencie seus pedidos e configurações de conta aqui.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
              <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <Package className="text-primary" size={20} />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-9">{state.orders.length}</h3>
                <p className="text-gray-6 text-xs sm:text-sm lg:text-base">Total de Pedidos</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <Heart className="text-danger" size={20} />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-9">{state.wishlist.length}</h3>
                <p className="text-gray-6 text-xs sm:text-sm lg:text-base">Itens na Lista</p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 lg:p-6 text-center sm:col-span-2 lg:col-span-1">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <ShoppingCart className="text-warning" size={20} />
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-9">{state.cart.length}</h3>
                <p className="text-gray-6 text-xs sm:text-sm lg:text-base">Itens no Carrinho</p>
              </div>
            </div>

            {/* Billing Address */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 space-y-3 sm:space-y-0">
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-9">Endereço de Faturamento</h2>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                    <Edit size={14} className="mr-1 sm:mr-2" />
                    Editar Perfil
                  </Button>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                    <Edit size={14} className="mr-1 sm:mr-2" />
                    Editar Endereço
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h4 className="font-medium text-gray-9 mb-2 text-sm sm:text-base">Informações Pessoais</h4>
                  <div className="space-y-1 text-xs sm:text-sm text-gray-6">
                    <p><strong>Nome:</strong> {state.user.firstName} {state.user.lastName}</p>
                    <p><strong>E-mail:</strong> {state.user.email}</p>
                    <p><strong>Telefone:</strong> {state.user.phone || 'Não informado'}</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-9 mb-2 text-sm sm:text-base">Endereço</h4>
                  <div className="space-y-1 text-xs sm:text-sm text-gray-6">
                    {state.user.billingAddress ? (
                      <>
                        <p>{state.user.billingAddress.address}</p>
                        <p>{state.user.billingAddress.state}, {state.user.billingAddress.zipCode}</p>
                        <p>{state.user.billingAddress.country}</p>
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
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-9">Histórico de Pedidos Recentes</h2>
                <Link href="/historico-pedidos">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">Ver Todos</Button>
                </Link>
              </div>

              {recentOrders.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="border border-gray-2 rounded-lg p-3 sm:p-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 items-center">
                        <div className="col-span-2 sm:col-span-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-7">ID do Pedido</p>
                          <p className="text-sm sm:text-base font-medium text-gray-9">{order.id}</p>
                        </div>
                        <div className="col-span-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-7">Data</p>
                          <p className="text-sm sm:text-base text-gray-6">{order.date}</p>
                        </div>
                        <div className="col-span-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-7">Total</p>
                          <p className="text-sm sm:text-base text-gray-9">R$ {order.total.toFixed(2)}</p>
                        </div>
                        <div className="col-span-1">
                          <p className="text-xs sm:text-sm font-medium text-gray-7">Status</p>
                          <p className={`text-sm sm:text-base font-medium ${order.statusColor}`}>
                            {order.status}
                          </p>
                        </div>
                        <div className="col-span-2 sm:col-span-1 flex justify-end">
                          <Button variant="outline" size="sm" className="text-xs sm:text-sm w-full sm:w-auto">
                            <Eye size={12} className="mr-1 sm:mr-2" />
                            Ver Detalhes
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <Package size={40} className="mx-auto text-gray-4 mb-3 sm:mb-4" />
                  <p className="text-gray-6 text-sm sm:text-base">Você ainda não fez nenhum pedido</p>
                  <Link href="/loja">
                    <Button className="mt-3 sm:mt-4 bg-primary hover:bg-primary-hard text-white text-sm sm:text-base">
                      Começar a Comprar
                    </Button>
                  </Link>
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