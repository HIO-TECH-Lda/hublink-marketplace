'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ShoppingCart, 
  Search, 
  Eye, 
  DollarSign,
  CheckCircle,
  XCircle,
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAdminOrders, useAdminOrderStats } from '@/hooks/useAdmin';

export default function OrderManagementPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: stats } = useAdminOrderStats();
  const { data: ordersData, isLoading } = useAdminOrders({
    page,
    limit,
    search: searchTerm || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  const orders = ordersData?.orders || [];
  const pagination = {
    page: ordersData?.page || 1,
    totalPages: ordersData?.totalPages || 1,
    total: ordersData?.total || 0,
    limit: ordersData?.limit || limit
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      processing: 'Processando',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado',
      refunded: 'Reembolsado'
    };
    return statusMap[status] || status;
  };

  const getPaymentStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Pendente',
      processing: 'Processando',
      completed: 'Completo',
      failed: 'Falhou',
      refunded: 'Reembolsado'
    };
    return statusMap[status] || status;
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando pedidos...</p>
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
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Gerenciamento de Pedidos</h1>
            <p className="text-gray-6">Gerencie todos os pedidos da plataforma</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <Card>
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-6 mb-1">Total de Pedidos</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-9 break-words">
                  {stats?.total.toLocaleString() || 0}
                </p>
                <p className="text-xs sm:text-sm text-gray-6">
                  {stats?.pending || 0} pendentes
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-6 mb-1">Receita Total</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-9 break-words">
                  {stats?.totalRevenue ? formatCurrency(stats.totalRevenue) : formatCurrency(0)}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-6 mb-1">Pedidos Entregues</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-9 break-words">
                  {stats?.delivered.toLocaleString() || 0}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-6 mb-1">Pedidos Cancelados</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-9 break-words">
                  {stats?.cancelled.toLocaleString() || 0}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-7 mb-2 block">Buscar</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-4 w-4 h-4" />
                <Input
                  placeholder="Número do pedido, cliente, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-7 mb-2 block">Status</label>
              <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="confirmed">Confirmado</SelectItem>
                  <SelectItem value="processing">Processando</SelectItem>
                  <SelectItem value="shipped">Enviado</SelectItem>
                  <SelectItem value="delivered">Entregue</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                  <SelectItem value="refunded">Reembolsado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <Button type="submit" variant="outline" className="flex-1">
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
              {(searchTerm || statusFilter !== 'all') && (
                <Button 
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setPage(1);
                  }}
                  variant="outline"
                >
                  <Filter className="w-4 h-4" />
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-9">
            Pedidos ({pagination.total.toLocaleString()})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-2">
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Pedido</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Cliente</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Total</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Pagamento</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Data</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-7">Ações</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order.id || order._id} className="border-b border-gray-2 hover:bg-gray-1/50">
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-9">{order.orderNumber}</p>
                      <p className="text-xs text-gray-5">{order.itemCount || 0} itens</p>
                    </td>
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-9">
                          {order.client?.name || `${order.client?.firstName || ''} ${order.client?.lastName || ''}`.trim()}
                        </p>
                        <p className="text-sm text-gray-6">{order.client?.email}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-medium text-gray-9">
                        {formatCurrency(order.total)}
                      </p>
                      {order.currency && order.currency !== 'MZN' && (
                        <p className="text-xs text-gray-5">{order.currency}</p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-7">
                        {getPaymentStatusText(order.paymentStatus || 'pending')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <p className="text-sm text-gray-7">{formatDate(order.date || order.createdAt)}</p>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Button
                        onClick={() => router.push(`/admin/pedidos/${order.id || order._id}`)}
                        size="sm"
                        variant="outline"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {orders.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-9 mb-2">Nenhum pedido encontrado</h3>
              <p className="text-gray-6">Tente ajustar os filtros de busca</p>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-2">
              <div className="text-sm text-gray-6">
                Página {pagination.page} de {pagination.totalPages} • {pagination.total} total
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={pagination.page === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Próxima
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
