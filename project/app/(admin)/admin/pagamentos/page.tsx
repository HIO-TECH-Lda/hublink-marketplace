'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  DollarSign,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  User,
  Store,
  CreditCard,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAdminPayments } from '@/hooks/useAdmin';

export default function AdminPaymentsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [gatewayFilter, setGatewayFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState<any | null>(null);
  const limit = 20;

  const { data, isLoading } = useAdminPayments({
    page,
    limit,
    status: statusFilter === 'all' ? undefined : (statusFilter as any),
    method: methodFilter === 'all' ? undefined : methodFilter,
    gateway: gatewayFilter === 'all' ? undefined : gatewayFilter,
  });

  const payments = data?.items || [];
  const stats = data?.stats;
  const total = data?.total || 0;
  const currentPage = data?.page || page;
  const currentLimit = data?.limit || limit;
  const totalPages = Math.max(1, Math.ceil((total || 0) / currentLimit));

  const formatCurrency = (amount: number, currency: string) => {
    if (!amount && amount !== 0) return '-';
    try {
      return new Intl.NumberFormat('pt-MZ', {
        style: 'currency',
        currency: currency || 'MZN',
        minimumFractionDigits: 0,
      }).format(amount);
    } catch {
      return `${amount.toLocaleString()} ${currency || ''}`;
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-MZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeClasses = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'refunded':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'processing':
        return 'Processando';
      case 'completed':
        return 'Concluído';
      case 'failed':
        return 'Falhou';
      case 'refunded':
        return 'Reembolsado';
      default:
        return status;
    }
  };

  const handleClearFilters = () => {
    setStatusFilter('all');
    setMethodFilter('all');
    setGatewayFilter('all');
    setPage(1);
  };

  if (isLoading && !data) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-gray-6">Carregando pagamentos...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-9 mb-2">Pagamentos</h1>
        <p className="text-gray-6">
          Acompanhe e gerencie os pagamentos processados na plataforma
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-7 gap-4 sm:gap-6 mb-6">
          <Card>
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-6 mb-1">Total de Pagamentos</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-9 break-words">
                    {stats.total.toLocaleString()}
                  </p>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-gray-4" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-6 mb-1">Pendentes</p>
                  <p className="text-xl sm:text-2xl font-bold text-yellow-600 break-words">
                    {stats.pending.toLocaleString()}
                  </p>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <RefreshCcw className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-6 mb-1">Processando</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600 break-words">
                    {stats.processing.toLocaleString()}
                  </p>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-6 mb-1">Concluídos</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600 break-words">
                    {stats.completed.toLocaleString()}
                  </p>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-6 mb-1">Falhados</p>
                  <p className="text-xl sm:text-2xl font-bold text-red-600 break-words">
                    {stats.failed.toLocaleString()}
                  </p>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-6 mb-1">Reembolsados</p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-600 break-words">
                    {stats.refunded.toLocaleString()}
                  </p>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-6 mb-1">Receita Total</p>
                  <p className="text-lg sm:text-xl font-bold text-gray-9 break-words">
                    {formatCurrency(stats.totalRevenue, 'MZN')}
                  </p>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-4 w-4 h-4" />
              <Input
                placeholder="Filtre por status, método ou gateway usando os seletores ao lado"
                className="pl-10"
                readOnly
              />
            </div>

            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="processing">Processando</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="failed">Falhou</SelectItem>
                <SelectItem value="refunded">Reembolsado</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={methodFilter}
              onValueChange={(value) => {
                setMethodFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Método" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos métodos</SelectItem>
                <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="bank_transfer">Transferência Bancária</SelectItem>
                <SelectItem value="cash_on_delivery">Pagamento na Entrega</SelectItem>
                <SelectItem value="mpesa">M-Pesa</SelectItem>
                <SelectItem value="emola">E-Mola</SelectItem>
                <SelectItem value="imali">iMali</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={gatewayFilter}
              onValueChange={(value) => {
                setGatewayFilter(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Gateway" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos gateways</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
              </SelectContent>
            </Select>

            {(statusFilter !== 'all' ||
              methodFilter !== 'all' ||
              gatewayFilter !== 'all') && (
              <Button type="button" variant="outline" onClick={handleClearFilters}>
                <Filter className="w-4 h-4 mr-2" />
                Limpar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Pagamentos</CardTitle>
            <span className="text-sm text-gray-6">
              {total.toLocaleString()} registros
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {payments.length === 0 ? (
            <div className="text-center py-12 px-4">
              <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-9 mb-1">
                Nenhum pagamento encontrado
              </h3>
              <p className="text-sm text-gray-6">
                Ajuste os filtros para visualizar outros resultados.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-7">
                        Data
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-7">
                        Pedido
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-7">
                        Cliente
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-7">
                        Vendedor
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-7">
                        Valor
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-7">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-7">
                        Método / Gateway
                      </th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-7">
                        Transação
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-gray-7">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => {
                      const firstItem = payment.orderId?.items?.[0];
                      const sellerName = firstItem?.sellerName || '—';

                      return (
                        <tr
                          key={payment._id}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-3 px-4">
                            <span className="text-xs text-gray-7">
                              {formatDateTime(payment.createdAt)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {payment.orderId ? (
                              <button
                                onClick={() =>
                                  router.push(`/admin/pedidos/${payment.orderId._id}`)
                                }
                                className="flex items-center gap-1 text-sm text-primary hover:underline"
                              >
                                <ShoppingCart className="w-3 h-3" />
                                {payment.orderId.orderNumber}
                              </button>
                            ) : (
                              <span className="text-sm text-gray-5">—</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <User className="w-3 h-3 text-gray-4" />
                              <div>
                                <p className="text-sm font-medium text-gray-9">
                                  {payment.userId?.name || '—'}
                                </p>
                                <p className="text-xs text-gray-5">
                                  {payment.userId?.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Store className="w-3 h-3 text-gray-4" />
                              <span className="text-sm text-gray-7">{sellerName}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-sm text-gray-9">
                              {formatCurrency(payment.amount, payment.currency)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              className={`${getStatusBadgeClasses(
                                payment.status,
                              )} border text-xs`}
                            >
                              {getStatusLabel(payment.status)}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1 text-xs text-gray-7">
                                <CreditCard className="w-3 h-3 text-gray-4" />
                                <span>{payment.method || '—'}</span>
                              </div>
                              <span className="text-xs text-gray-5">
                                Gateway: {payment.gateway || '—'}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-xs font-mono text-gray-7 break-all">
                              {payment.gatewayTransactionId || '—'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedPayment(payment)}
                              >
                                Ver
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t border-gray-200 px-4 py-3">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-6">
                      Mostrando{' '}
                      <span className="font-medium text-gray-9">
                        {(currentPage - 1) * currentLimit + 1}
                      </span>{' '}
                      a{' '}
                      <span className="font-medium text-gray-9">
                        {Math.min(currentPage * currentLimit, total)}
                      </span>{' '}
                      de{' '}
                      <span className="font-medium text-gray-9">
                        {total.toLocaleString()}
                      </span>{' '}
                      pagamentos
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Anterior
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPage((prev) => Math.min(totalPages, prev + 1))
                        }
                        disabled={currentPage >= totalPages}
                      >
                        Próxima
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* View Payment Modal */}
      <Dialog open={!!selectedPayment} onOpenChange={(open) => !open && setSelectedPayment(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedPayment && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Pagamento #{selectedPayment._id?.slice(-8) || ''}
                </DialogTitle>
                <DialogDescription>
                  Detalhes completos do pagamento, pedido e gateway.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* High level info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4 space-y-1">
                      <p className="text-xs text-gray-6">Valor</p>
                      <p className="text-lg font-semibold text-gray-9">
                        {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                      </p>
                      <p className="text-xs text-gray-5">
                        Status:{' '}
                        <span className="font-medium">
                          {getStatusLabel(selectedPayment.status)}
                        </span>
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 space-y-1">
                      <p className="text-xs text-gray-6">Método / Gateway</p>
                      <p className="text-sm text-gray-9">
                        {selectedPayment.method || '—'} / {selectedPayment.gateway || '—'}
                      </p>
                      <p className="text-xs text-gray-5">
                        Criado em {formatDateTime(selectedPayment.createdAt)}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 space-y-1">
                      <p className="text-xs text-gray-6">Pedido</p>
                      {selectedPayment.orderId ? (
                        <button
                          onClick={() =>
                            router.push(`/admin/pedidos/${selectedPayment.orderId._id}`)
                          }
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          {selectedPayment.orderId.orderNumber}
                        </button>
                      ) : (
                        <p className="text-sm text-gray-5">—</p>
                      )}
                      {selectedPayment.refundAmount != null && (
                        <p className="text-xs text-gray-5">
                          Reembolso: {formatCurrency(selectedPayment.refundAmount, selectedPayment.currency)}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Buyer & seller */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Cliente</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-1 text-sm">
                      <p className="font-medium text-gray-9">
                        {selectedPayment.userId?.fullName ||
                          selectedPayment.userId?.name ||
                          '—'}
                      </p>
                      <p className="text-gray-6">{selectedPayment.userId?.email}</p>
                      <p className="text-gray-5">{selectedPayment.userId?.phone}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Vendedor / Itens</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-2 text-sm">
                      {selectedPayment.orderId?.items?.map((item: any) => (
                        <div
                          key={item._id || item.productId}
                          className="flex items-start justify-between gap-2 border-b last:border-none pb-2 last:pb-0"
                        >
                          <div>
                            <p className="font-medium text-gray-9">{item.productName}</p>
                            <p className="text-xs text-gray-6">
                              Vendedor: {item.sellerName || '—'}
                            </p>
                            <p className="text-xs text-gray-5">
                              Quantidade: {item.quantity} • Preço:{' '}
                              {formatCurrency(item.unitPrice, selectedPayment.currency)}
                            </p>
                          </div>
                          <p className="text-xs font-semibold text-gray-9">
                            {formatCurrency(item.totalPrice, selectedPayment.currency)}
                          </p>
                        </div>
                      )) || <p className="text-sm text-gray-5">Sem itens</p>}
                    </CardContent>
                  </Card>
                </div>

                {/* Addresses */}
                {selectedPayment.orderId && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Endereço de Cobrança</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 space-y-1">
                        <p className="font-medium text-gray-9">
                          {selectedPayment.orderId.billingAddress?.firstName}{' '}
                          {selectedPayment.orderId.billingAddress?.lastName}
                        </p>
                        <p className="text-gray-6">
                          {selectedPayment.orderId.billingAddress?.address}
                        </p>
                        <p className="text-gray-5">
                          {selectedPayment.orderId.billingAddress?.city},{' '}
                          {selectedPayment.orderId.billingAddress?.state}{' '}
                          {selectedPayment.orderId.billingAddress?.zipCode}
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Endereço de Entrega</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 space-y-1">
                        <p className="font-medium text-gray-9">
                          {selectedPayment.orderId.shippingAddress?.firstName}{' '}
                          {selectedPayment.orderId.shippingAddress?.lastName}
                        </p>
                        <p className="text-gray-6">
                          {selectedPayment.orderId.shippingAddress?.address}
                        </p>
                        <p className="text-gray-5">
                          {selectedPayment.orderId.shippingAddress?.city},{' '}
                          {selectedPayment.orderId.shippingAddress?.state}{' '}
                          {selectedPayment.orderId.shippingAddress?.zipCode}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Gateway response & raw JSON */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Resposta do Gateway</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      {selectedPayment.gatewayResponse ? (
                        <pre className="bg-gray-50 border border-gray-200 rounded-md p-3 overflow-x-auto whitespace-pre-wrap text-[11px] text-gray-800">
                          {JSON.stringify(selectedPayment.gatewayResponse, null, 2)}
                        </pre>
                      ) : (
                        <p className="text-gray-5">Nenhuma resposta registrada.</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Informações de Reembolso</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-1">
                      {selectedPayment.refundAmount != null ? (
                        <>
                          <p className="text-gray-7">
                            Valor reembolsado:{' '}
                            <span className="font-semibold">
                              {formatCurrency(
                                selectedPayment.refundAmount,
                                selectedPayment.currency,
                              )}
                            </span>
                          </p>
                          {selectedPayment.refundReason && (
                            <p className="text-gray-6">
                              Motivo: {selectedPayment.refundReason}
                            </p>
                          )}
                          {selectedPayment.refundedAt && (
                            <p className="text-gray-5">
                              Reembolsado em {formatDateTime(selectedPayment.refundedAt)}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-5">
                          Nenhuma informação de reembolso para este pagamento.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

