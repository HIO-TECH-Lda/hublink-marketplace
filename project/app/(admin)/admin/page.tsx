'use client';

import React, { useState, useEffect } from 'react';
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
  MessageSquare
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMarketplace } from '@/contexts/MarketplaceContext';

interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  averageRating: number;
  pendingOrders: number;
  activeSellers: number;
  totalReviews: number;
}

interface RecentActivity {
  id: string;
  type: 'order' | 'user' | 'product' | 'review';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { state } = useMarketplace();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    averageRating: 0,
    pendingOrders: 0,
    activeSellers: 0,
    totalReviews: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Calculate stats from context data and mock data
    const totalUsers = 1250; // Mock total users
    const totalOrders = state.orders?.length || 0;
    const totalRevenue = state.orders?.reduce((sum, order) => sum + order.total, 0) || 0;
    const totalProducts = state.products?.length || 0;
    const averageRating = 4.5; // Mock average rating
    const pendingOrders = state.orders?.filter(order => order.status === 'pending').length || 0;
    const activeSellers = 12; // Mock active sellers
    const totalReviews = 156; // Mock total reviews

    setStats({
      totalUsers,
      totalOrders,
      totalRevenue,
      totalProducts,
      averageRating,
      pendingOrders,
      activeSellers,
      totalReviews
    });

    // Mock recent activity
    const activity: RecentActivity[] = [
      {
        id: '1',
        type: 'order',
        title: 'Novo Pedido #ORD123456',
        description: 'Pedido de MTn 150,00 realizado por João Silva',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        status: 'pending'
      },
      {
        id: '2',
        type: 'user',
        title: 'Novo Usuário Registrado',
        description: 'Maria Santos criou uma nova conta',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        type: 'product',
        title: 'Produto Adicionado',
        description: 'Novo produto "Maçãs Orgânicas" adicionado por Fazenda Verde',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        type: 'review',
        title: 'Nova Avaliação',
        description: 'Avaliação 5 estrelas para "Tomates Orgânicos"',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        type: 'order',
        title: 'Pedido Entregue #ORD123455',
        description: 'Pedido de MTn 89,90 entregue com sucesso',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        status: 'delivered'
      }
    ];

    setRecentActivity(activity);
    setIsLoading(false);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <ShoppingCart className="w-4 h-4" />;
      case 'user':
        return <Users className="w-4 h-4" />;
      case 'product':
        return <Package className="w-4 h-4" />;
      case 'review':
        return <Star className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'text-blue-600 bg-blue-100';
      case 'user':
        return 'text-green-600 bg-green-100';
      case 'product':
        return 'text-purple-600 bg-purple-100';
      case 'review':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-MZ', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-9 mb-2">Dashboard</h1>
        <p className="text-gray-6">Visão geral da plataforma</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Total de Usuários</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">{stats.totalUsers}</div>
            <p className="text-xs text-gray-6">
              +12% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Total de Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">{stats.totalOrders}</div>
            <p className="text-xs text-gray-6">
              {stats.pendingOrders} pedidos pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Receita Total</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-gray-6">
              +8% em relação ao mês passado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Produtos</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">{stats.totalProducts}</div>
            <p className="text-xs text-gray-6">
              {stats.activeSellers} vendedores ativos
            </p>
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

          {/* System Status */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-9">Status do Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-6">Servidor</span>
                <Badge className="bg-green-100 text-green-800">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-6">Banco de Dados</span>
                <Badge className="bg-green-100 text-green-800">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-6">Pagamentos</span>
                <Badge className="bg-green-100 text-green-800">Online</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-6">Email</span>
                <Badge className="bg-green-100 text-green-800">Online</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-9">Atividade Recente</CardTitle>
              <CardDescription>
                Últimas atividades na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-9">{activity.title}</p>
                      <p className="text-sm text-gray-6">{activity.description}</p>
                      <p className="text-xs text-gray-5 mt-1">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                    {activity.status && (
                      <Badge 
                        variant={activity.status === 'pending' ? 'secondary' : 'default'}
                        className="ml-2"
                      >
                        {activity.status === 'pending' ? 'Pendente' : 'Entregue'}
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-9">Métricas de Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-9">{stats.averageRating}</div>
                  <div className="flex items-center justify-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(stats.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-6 mt-1">Avaliação Média</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-9">{stats.totalReviews}</div>
                  <p className="text-sm text-gray-6 mt-1">Total de Avaliações</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
} 