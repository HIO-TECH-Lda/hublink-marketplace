'use client';

import React, { useState } from 'react';
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
  ArrowLeft,
  Star,
  Clock,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  useAdminReports,
  useExportSalesData,
  useExportProductsData
} from '@/hooks/useAdmin';
import { formatCurrency } from '@/lib/finance-utils';

export default function ReportsPage() {
  const [period, setPeriod] = useState<'7' | '30' | '90' | '365' | 'custom'>('30');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: reports, isLoading } = useAdminReports(
    period === 'custom' 
      ? { period: 'custom', startDate, endDate }
      : { period }
  );

  const exportSales = useExportSalesData();
  const exportProducts = useExportProductsData();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-MZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-MZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleExportSales = () => {
    if (!reports) return;
    exportSales.mutate({
      startDate: reports.period.startDate,
      endDate: reports.period.endDate
    });
  };

  const handleExportProducts = () => {
    if (!reports) return;
    exportProducts.mutate({
      startDate: reports.period.startDate,
      endDate: reports.period.endDate
    });
  };

  const getMaxRevenue = () => {
    if (!reports?.salesByDay || reports.salesByDay.length === 0) return 1;
    return Math.max(...reports.salesByDay.map(d => d.revenue));
  };

  const getMaxSales = () => {
    if (!reports?.salesByDay || reports.salesByDay.length === 0) return 1;
    return Math.max(...reports.salesByDay.map(d => d.sales));
  };

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando relatórios...</p>
          </div>
        </div>
      </>
    );
  }

  if (!reports) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-4 mx-auto mb-4" />
            <p className="text-gray-6">Nenhum dado disponível</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Relatórios e Analytics</h1>
            <p className="text-gray-6">Acompanhe o desempenho da plataforma</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
              <div>
                <Label htmlFor="period" className="mb-2 block">Período</Label>
                <Select value={period} onValueChange={(value: any) => setPeriod(value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Últimos 7 dias</SelectItem>
                    <SelectItem value="30">Últimos 30 dias</SelectItem>
                    <SelectItem value="90">Últimos 90 dias</SelectItem>
                    <SelectItem value="365">Último ano</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {period === 'custom' && (
                <>
                  <div>
                    <Label htmlFor="startDate" className="mb-2 block">Data Inicial</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-[180px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate" className="mb-2 block">Data Final</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-[180px]"
                    />
                  </div>
                </>
              )}
              {reports.period && (
                <div className="text-sm text-gray-6 mt-2 sm:mt-0">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {formatDate(reports.period.startDate)} - {formatDate(reports.period.endDate)}
                  <span className="ml-2">({reports.period.days} dias)</span>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleExportSales}
                disabled={exportSales.isPending}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar Vendas
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExportProducts}
                disabled={exportProducts.isPending}
              >
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
            <div className="text-2xl font-bold text-gray-9">
              {reports.metrics.totalSales.count.toLocaleString()}
            </div>
            <p className="text-xs text-gray-6 mt-1">
              {formatCurrency(reports.metrics.totalSales.revenue)} em receita
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">
              {reports.metrics.orders.count.toLocaleString()}
            </div>
            <p className="text-xs text-gray-6 mt-1">
              Média de {reports.metrics.orders.avgItemsPerOrder.toFixed(1)} itens por pedido
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Novos Clientes</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">
              {reports.metrics.customers.new.toLocaleString()}
            </div>
            <p className="text-xs text-gray-6 mt-1">
              Clientes registrados no período
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
              {formatCurrency(reports.metrics.averageTicket)}
            </div>
            <p className="text-xs text-gray-6 mt-1">
              Por pedido
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales by Day Chart */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-9">Vendas por Dia</CardTitle>
          <CardDescription>
            Evolução das vendas no período selecionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.salesByDay && reports.salesByDay.length > 0 ? (
              reports.salesByDay.map((day) => (
                <div key={day.date} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-7 font-medium">{formatDate(day.date)}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-9 font-medium">{day.sales} vendas</span>
                      <span className="text-gray-7">{formatCurrency(day.revenue)}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-2 rounded-full h-3">
                    <div 
                      className="bg-primary h-3 rounded-full transition-all" 
                      style={{ width: `${(day.revenue / getMaxRevenue()) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-6 text-center py-8">Nenhum dado de vendas disponível</p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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
              {reports.topProducts && reports.topProducts.length > 0 ? (
                reports.topProducts.map((product) => (
                  <div key={product.productId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">#{product.rank}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-9">{product.name}</p>
                        <p className="text-xs text-gray-6">
                          {product.units} unidades • {product.sales} vendas
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-9">{formatCurrency(product.revenue)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-6 text-center py-4">Nenhum produto encontrado</p>
              )}
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
              {reports.topSellers && reports.topSellers.length > 0 ? (
                reports.topSellers.map((seller) => (
                  <div key={seller.sellerId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-primary font-bold text-sm">#{seller.rank}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-9">{seller.name}</p>
                        <p className="text-xs text-gray-6">
                          {seller.products} produtos • {seller.sales} vendas
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-9">{formatCurrency(seller.revenue)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-6 text-center py-4">Nenhum vendedor encontrado</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-9">Métricas de Performance</CardTitle>
          <CardDescription>
            Indicadores de desempenho da plataforma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-9">{reports.performanceMetrics.conversionRate}%</p>
              <p className="text-xs text-gray-6 mt-1">Taxa de Conversão</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Clock className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-9">{reports.performanceMetrics.avgSessionTime}</p>
              <p className="text-xs text-gray-6 mt-1">Tempo Médio de Sessão</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <ShoppingCart className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-9">{reports.performanceMetrics.abandonmentRate}%</p>
              <p className="text-xs text-gray-6 mt-1">Taxa de Abandono</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Star className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-9">{reports.performanceMetrics.averageRating}</p>
              <p className="text-xs text-gray-6 mt-1">Avaliação Média</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Package className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-9">{reports.performanceMetrics.avgDeliveryTime} dias</p>
              <p className="text-xs text-gray-6 mt-1">Tempo Médio de Entrega</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
