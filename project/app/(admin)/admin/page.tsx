'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Package, 
  DollarSign, 
  TrendingUp, 
  ShoppingCart, 
  Star, 
  AlertTriangle,
  BarChart3,
  Settings,
  Shield,
  FileText,
  MessageSquare,
  RotateCcw,
  Tag
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminDashboard } from '@/hooks/useAdmin';

export default function AdminDashboard() {
  const router = useRouter();
  const { data: dashboard, isLoading } = useAdminDashboard();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  if (isLoading || !dashboard) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-9 mb-2">Dashboard</h1>
        <p className="text-gray-6">Visão geral da plataforma</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">{dashboard.users.total.toLocaleString()}</div>
            <p className={`text-xs ${dashboard.users.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercent(dashboard.users.changePercent)} este mês
            </p>
            <p className="text-xs text-gray-5 mt-1">
              {dashboard.users.buyers} compradores • {dashboard.users.sellers} vendedores
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Total de Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">{dashboard.orders.total.toLocaleString()}</div>
            <p className="text-xs text-gray-6">
              {dashboard.orders.pending} pendentes • {dashboard.orders.recent} recentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">{formatCurrency(dashboard.revenue.total)}</div>
            <p className={`text-xs ${dashboard.revenue.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercent(dashboard.revenue.changePercent)} este mês
            </p>
            <p className="text-xs text-gray-5 mt-1">
              Este mês: {formatCurrency(dashboard.revenue.thisMonth)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Produtos</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">{dashboard.products.total.toLocaleString()}</div>
            <p className="text-xs text-gray-6">
              {dashboard.products.activeSellers} vendedores ativos
            </p>
            {(dashboard.products.lowStock > 0 || dashboard.products.outOfStock > 0) && (
              <p className="text-xs text-warning mt-1">
                {dashboard.products.lowStock} baixo estoque • {dashboard.products.outOfStock} sem estoque
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-gray-6">Avaliações</CardTitle>
            <Star className="h-3 w-3 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-gray-9">{dashboard.reviews.averageRating.toFixed(1)}</div>
            <p className="text-xs text-gray-5">{dashboard.reviews.total} total</p>
            {dashboard.reviews.pending > 0 && (
              <Badge 
                variant="secondary" 
                className="mt-1 text-xs cursor-pointer hover:bg-yellow-200"
                onClick={() => router.push('/admin/avaliacoes')}
              >
                {dashboard.reviews.pending} pendentes
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-gray-6">Reembolsos</CardTitle>
            <RotateCcw className="h-3 w-3 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-gray-9">{dashboard.refunds.total}</div>
            <p className="text-xs text-gray-5">{dashboard.refunds.pending} pendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-gray-6">Tickets</CardTitle>
            <MessageSquare className="h-3 w-3 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-gray-9">{dashboard.tickets.total}</div>
            <p className="text-xs text-gray-5">{dashboard.tickets.open} abertos</p>
            {dashboard.tickets.urgent > 0 && (
              <Badge className="mt-1 bg-red-100 text-red-800 text-xs">{dashboard.tickets.urgent} urgentes</Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-gray-6">Categorias</CardTitle>
            <Tag className="h-3 w-3 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-gray-9">{dashboard.categories.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-gray-6">Pagamentos</CardTitle>
            <DollarSign className="h-3 w-3 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-gray-9">{dashboard.payments.completed}</div>
            <p className="text-xs text-gray-5">{dashboard.payments.pending} pendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-gray-6">Blog Posts</CardTitle>
            <FileText className="h-3 w-3 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold text-gray-9">{dashboard.blogPosts.published}</div>
            <p className="text-xs text-gray-5">{dashboard.blogPosts.total} total</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-9">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => router.push('/admin/usuarios')}
                variant="outline" 
                className="w-full justify-start"
              >
                <Users className="w-4 h-4 mr-2" />
                Gerenciar Usuários
              </Button>
              <Button 
                onClick={() => router.push('/admin/pedidos')}
                variant="outline" 
                className="w-full justify-start"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Gerenciar Pedidos
              </Button>
              <Button 
                onClick={() => router.push('/admin/produtos')}
                variant="outline" 
                className="w-full justify-start"
              >
                <Package className="w-4 h-4 mr-2" />
                Gerenciar Produtos
              </Button>
              <Button 
                onClick={() => router.push('/admin/vendedores')}
                variant="outline" 
                className="w-full justify-start"
              >
                <Shield className="w-4 h-4 mr-2" />
                Gerenciar Vendedores
              </Button>
              <Button 
                onClick={() => router.push('/admin/blog')}
                variant="outline" 
                className="w-full justify-start"
              >
                <FileText className="w-4 h-4 mr-2" />
                Gerenciar Blog
              </Button>
              <Button 
                onClick={() => router.push('/admin/relatorios')}
                variant="outline" 
                className="w-full justify-start"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Relatórios
              </Button>
              <Button 
                onClick={() => router.push('/admin/configuracoes')}
                variant="outline" 
                className="w-full justify-start"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configurações
              </Button>
            </CardContent>
          </Card>

        </div>

        {/* Order Status Breakdown */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-9">Status dos Pedidos</CardTitle>
              <CardDescription>Distribuição de pedidos por status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-7">Entregues</span>
                  </div>
                  <span className="font-semibold text-gray-9">{dashboard.orders.delivered}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-gray-7">Enviados</span>
                  </div>
                  <span className="font-semibold text-gray-9">{dashboard.orders.shipped}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span className="text-sm text-gray-7">Em Processamento</span>
                  </div>
                  <span className="font-semibold text-gray-9">{dashboard.orders.processing}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    <span className="text-sm text-gray-7">Pendentes</span>
                  </div>
                  <span className="font-semibold text-gray-9">{dashboard.orders.pending}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm text-gray-7">Cancelados</span>
                  </div>
                  <span className="font-semibold text-gray-9">{dashboard.orders.cancelled}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts & Notifications */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-9">Alertas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {dashboard.tickets.urgent > 0 && (
                  <div className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-800">{dashboard.tickets.urgent} tickets urgentes</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => router.push('/admin/tickets')}>
                      Ver
                    </Button>
                  </div>
                )}
                {dashboard.reviews.pending > 0 && (
                  <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800">{dashboard.reviews.pending} avaliações pendentes</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => router.push('/admin/produtos')}>
                      Ver
                    </Button>
                  </div>
                )}
                {dashboard.refunds.pending > 0 && (
                  <div className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <RotateCcw className="w-4 h-4 text-orange-600" />
                      <span className="text-sm text-orange-800">{dashboard.refunds.pending} reembolsos pendentes</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => router.push('/admin/reembolsos')}>
                      Ver
                    </Button>
                  </div>
                )}
                {(dashboard.products.lowStock > 0 || dashboard.products.outOfStock > 0) && (
                  <div className="flex items-center justify-between p-2 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm text-yellow-800">
                        {dashboard.products.lowStock + dashboard.products.outOfStock} produtos com estoque baixo
                      </span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => router.push('/admin/produtos')}>
                      Ver
                    </Button>
                  </div>
                )}
                {dashboard.orders.pending > 0 && (
                  <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <ShoppingCart className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-800">{dashboard.orders.pending} pedidos pendentes</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => router.push('/admin/pedidos')}>
                      Ver
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
} 