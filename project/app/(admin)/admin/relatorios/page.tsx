'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  Download,
  Filter,
  ArrowLeft
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMarketplace } from '@/contexts/MarketplaceContext';

interface SalesData {
  date: string;
  sales: number;
  orders: number;
  customers: number;
}

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  units: number;
}

interface TopSeller {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  products: number;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const { state } = useMarketplace();
  const [timeRange, setTimeRange] = useState('30');
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [topSellers, setTopSellers] = useState<TopSeller[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, [timeRange]);

  const loadAnalyticsData = async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock sales data for the last 30 days
    const mockSalesData: SalesData[] = [];
    const days = parseInt(timeRange);
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      mockSalesData.push({
        date: date.toISOString().split('T')[0],
        sales: Math.floor(Math.random() * 50) + 10,
        orders: Math.floor(Math.random() * 20) + 5,
        customers: Math.floor(Math.random() * 15) + 3
      });
    }

    setSalesData(mockSalesData);

    // Mock top products
    const mockTopProducts: TopProduct[] = [
      {
        id: '1',
        name: 'Tomates Orgânicos',
        sales: 45,
        revenue: 2250.00,
        units: 150
      },
      {
        id: '2',
        name: 'Maçãs Orgânicas',
        sales: 38,
        revenue: 1900.00,
        units: 95
      },
      {
        id: '3',
        name: 'Bananas Orgânicas',
        sales: 32,
        revenue: 1280.00,
        units: 160
      },
      {
        id: '4',
        name: 'Alface Orgânica',
        sales: 28,
        revenue: 840.00,
        units: 70
      },
      {
        id: '5',
        name: 'Cenouras Orgânicas',
        sales: 25,
        revenue: 750.00,
        units: 75
      }
    ];

    setTopProducts(mockTopProducts);

    // Mock top sellers
    const mockTopSellers: TopSeller[] = [
      {
        id: '1',
        name: 'Fazenda Verde',
        sales: 120,
        revenue: 6000.00,
        products: 15
      },
      {
        id: '2',
        name: 'Horta Orgânica',
        sales: 95,
        revenue: 4750.00,
        products: 12
      },
      {
        id: '3',
        name: 'Produtos Naturais',
        sales: 78,
        revenue: 3900.00,
        products: 8
      },
      {
        id: '4',
        name: 'Campo Limpo',
        sales: 65,
        revenue: 3250.00,
        products: 10
      },
      {
        id: '5',
        name: 'Verduras Frescas',
        sales: 52,
        revenue: 2600.00,
        products: 6
      }
    ];

    setTopSellers(mockTopSellers);
    setIsLoading(false);
  };

  const calculateTotals = () => {
    const totalSales = salesData.reduce((sum, day) => sum + day.sales, 0);
    const totalOrders = salesData.reduce((sum, day) => sum + day.orders, 0);
    const totalRevenue = totalSales * 50; // Mock average order value
    const totalCustomers = salesData.reduce((sum, day) => sum + day.customers, 0);

    return { totalSales, totalOrders, totalRevenue, totalCustomers };
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const downloadReport = (type: string) => {
    // Mock report download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `relatorio-${type}-${timeRange}dias.pdf`;
    link.click();
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando relatórios...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const totals = calculateTotals();

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-9 mb-2">Relatórios e Analytics</h1>
        <p className="text-gray-6">Acompanhe o desempenho da plataforma</p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <label className="text-sm font-medium text-gray-7 mb-2 block">Período</label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 dias</SelectItem>
                    <SelectItem value="30">30 dias</SelectItem>
                    <SelectItem value="90">90 dias</SelectItem>
                    <SelectItem value="365">1 ano</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => downloadReport('vendas')}>
                <Download className="w-4 h-4 mr-2" />
                Exportar Vendas
              </Button>
              <Button variant="outline" onClick={() => downloadReport('produtos')}>
                <Download className="w-4 h-4 mr-2" />
                Exportar Produtos
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Vendas Totais</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">{totals.totalSales}</div>
            <p className="text-xs text-gray-6">
              {formatCurrency(totals.totalRevenue)} em receita
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">{totals.totalOrders}</div>
            <p className="text-xs text-gray-6">
              Média de {Math.round(totals.totalSales / totals.totalOrders)} itens por pedido
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Clientes</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">{totals.totalCustomers}</div>
            <p className="text-xs text-gray-6">
              Novos clientes no período
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Ticket Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">
              {formatCurrency(totals.totalRevenue / totals.totalOrders)}
            </div>
            <p className="text-xs text-gray-6">
              Por pedido
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-9">Vendas por Dia</CardTitle>
            <CardDescription>
              Evolução das vendas nos últimos {timeRange} dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {salesData.slice(-7).map((day) => (
                <div key={day.date} className="flex items-center justify-between">
                  <span className="text-sm text-gray-6">{formatDate(day.date)}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-9">{day.sales} vendas</span>
                    <div className="w-32 bg-gray-2 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(day.sales / Math.max(...salesData.map(d => d.sales))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-9">Produtos Mais Vendidos</CardTitle>
            <CardDescription>
              Top 5 produtos por receita
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-9">{product.name}</p>
                      <p className="text-sm text-gray-6">{product.units} unidades</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-9">{formatCurrency(product.revenue)}</p>
                    <p className="text-sm text-gray-6">{product.sales} vendas</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Sellers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-9">Vendedores em Destaque</CardTitle>
            <CardDescription>
              Top 5 vendedores por receita
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSellers.map((seller, index) => (
                <div key={seller.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-9">{seller.name}</p>
                      <p className="text-sm text-gray-6">{seller.products} produtos</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-9">{formatCurrency(seller.revenue)}</p>
                    <p className="text-sm text-gray-6">{seller.sales} vendas</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-9">Métricas de Performance</CardTitle>
            <CardDescription>
              Indicadores chave de desempenho
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-6">Taxa de Conversão</span>
                <span className="font-medium text-gray-9">3.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-6">Tempo Médio de Sessão</span>
                <span className="font-medium text-gray-9">4m 32s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-6">Taxa de Abandono</span>
                <span className="font-medium text-gray-9">68.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-6">Avaliação Média</span>
                <span className="font-medium text-gray-9">4.5/5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-6">Tempo Médio de Entrega</span>
                <span className="font-medium text-gray-9">2.3 dias</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
} 