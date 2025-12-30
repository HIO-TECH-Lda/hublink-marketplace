'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign, 
  Search, 
  Eye,
  Filter,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Package,
  User,
  Store
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  useAdminRefunds, 
  useAdminRefundStats, 
  useApproveRefund, 
  useRejectRefund 
} from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';

export default function AdminRefundsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [selectedRefund, setSelectedRefund] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const limit = 20;

  const { data: stats } = useAdminRefundStats();
  const { data: refundsData, isLoading } = useAdminRefunds({
    page,
    limit,
    search: searchTerm || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  });

  const approveRefund = useApproveRefund();
  const rejectRefund = useRejectRefund();

  const refunds = refundsData?.refunds || [];
  const pagination = {
    page: refundsData?.page || 1,
    totalPages: refundsData?.totalPages || 1,
    total: refundsData?.total || 0,
    limit: refundsData?.limit || limit
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleDateString('pt-MZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getRefundStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getRefundStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Pendente',
      approved: 'Aprovado',
      rejected: 'Rejeitado'
    };
    return statusMap[status] || status;
  };

  const handleApproveRefund = async (refundId: string) => {
    try {
      await approveRefund.mutateAsync(refundId);
      toast({
        title: 'Reembolso aprovado',
        description: 'O reembolso foi aprovado com sucesso.',
      });
      setSelectedRefund(null);
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Falha ao aprovar reembolso',
        variant: 'destructive',
      });
    }
  };

  const handleRejectRefund = async (refundId: string) => {
    if (!rejectionReason.trim()) {
      toast({
        title: 'Erro',
        description: 'Por favor, forneça um motivo para a rejeição',
        variant: 'destructive',
      });
      return;
    }

    try {
      await rejectRefund.mutateAsync({ refundId, rejectionReason });
      toast({
        title: 'Reembolso rejeitado',
        description: 'O reembolso foi rejeitado com sucesso.',
      });
      setShowRejectDialog(false);
      setSelectedRefund(null);
      setRejectionReason('');
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Falha ao rejeitar reembolso',
        variant: 'destructive',
      });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const total = pagination.totalPages;
    const current = pagination.page;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(total);
      } else if (current >= total - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = total - 3; i <= total; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(total);
      }
    }
    return pages;
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando reembolsos...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-9 mb-2">Reembolsos</h1>
        <p className="text-gray-6">Gerencie solicitações de reembolso</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-6 mb-1">Total</p>
                <p className="text-xl font-bold text-gray-9">{stats?.total || 0}</p>
              </div>
              <DollarSign className="w-5 h-5 text-gray-4" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-6 mb-1">Pendentes</p>
                <p className="text-xl font-bold text-yellow-600">{stats?.pending || 0}</p>
              </div>
              <Clock className="w-5 h-5 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-6 mb-1">Aprovados</p>
                <p className="text-xl font-bold text-green-600">{stats?.approved || 0}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-6 mb-1">Rejeitados</p>
                <p className="text-xl font-bold text-red-600">{stats?.rejected || 0}</p>
              </div>
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-6 mb-1">Valor Total</p>
                <p className="text-lg font-bold text-gray-9">
                  {stats?.totalValue ? formatCurrency(stats.totalValue) : formatCurrency(0)}
                </p>
              </div>
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-4 w-4 h-4" />
              <Input
                placeholder="Buscar por ID, pedido, cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="approved">Aprovado</SelectItem>
                <SelectItem value="rejected">Rejeitado</SelectItem>
              </SelectContent>
            </Select>
            {(searchTerm || statusFilter !== 'all') && (
              <Button 
                type="button"
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setPage(1);
                }}
              >
                <Filter className="w-4 h-4 mr-2" />
                Limpar
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Refunds Table */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Reembolsos</CardTitle>
            <span className="text-sm text-gray-6">{pagination.total.toLocaleString()} total</span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {refunds.length === 0 ? (
            <div className="text-center py-12 px-4">
              <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-9 mb-1">Nenhum reembolso encontrado</h3>
              <p className="text-sm text-gray-6">Tente ajustar os filtros de busca</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-2 bg-gray-50">
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-7">Reembolso</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-7">Pedido</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-7">Cliente</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-7">Vendedor</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-7">Valor</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-7">Status</th>
                      <th className="text-left py-3 px-4 text-xs font-medium text-gray-7">Data</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-gray-7">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {refunds.map((refund: any) => (
                      <tr 
                        key={refund.id || refund._id} 
                        className="border-b border-gray-2 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-sm text-gray-9">
                              #{refund.refundNumber || refund.id?.slice(-8)}
                            </p>
                            {refund.reason && (
                              <p className="text-xs text-gray-5 mt-0.5">{refund.reason}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            onClick={() => router.push(`/admin/pedidos/${refund.orderId || refund.order?.id}`)}
                            className="text-sm text-primary hover:underline"
                          >
                            #{refund.order?.orderNumber || refund.orderId?.slice(-8)}
                          </button>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3 text-gray-4" />
                            <div>
                              <p className="text-sm font-medium text-gray-9">
                                {refund.client?.name || `${refund.client?.firstName || ''} ${refund.client?.lastName || ''}`.trim() || 'N/A'}
                              </p>
                              <p className="text-xs text-gray-5">{refund.client?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Store className="w-3 h-3 text-gray-4" />
                            <span className="text-sm text-gray-7">{refund.seller?.name || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-sm text-gray-9">
                            {formatCurrency(refund.amount)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={`${getRefundStatusColor(refund.status)} border`}>
                            {getRefundStatusText(refund.status)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs text-gray-6">
                            {formatDate(refund.requestedAt || refund.createdAt)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setSelectedRefund(refund)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>
                                    Reembolso #{refund.refundNumber || refund.id?.slice(-8)}
                                  </DialogTitle>
                                  <DialogDescription>
                                    Detalhes completos da solicitação
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-xs text-gray-6">Status</Label>
                                      <div className="mt-1">
                                        <Badge className={getRefundStatusColor(refund.status)}>
                                          {getRefundStatusText(refund.status)}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-xs text-gray-6">Valor</Label>
                                      <p className="mt-1 font-semibold text-gray-9">{formatCurrency(refund.amount)}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-xs text-gray-6">Pedido</Label>
                                      <button
                                        onClick={() => router.push(`/admin/pedidos/${refund.orderId || refund.order?.id}`)}
                                        className="mt-1 text-sm text-primary hover:underline block"
                                      >
                                        #{refund.order?.orderNumber || refund.orderId?.slice(-8)}
                                      </button>
                                      {refund.order?.date && (
                                        <p className="text-xs text-gray-5 mt-0.5">{formatDate(refund.order.date)}</p>
                                      )}
                                    </div>
                                    <div>
                                      <Label className="text-xs text-gray-6">Solicitado em</Label>
                                      <p className="mt-1 text-sm text-gray-9">{formatDate(refund.requestedAt || refund.createdAt)}</p>
                                    </div>
                                  </div>

                                  {refund.product && (
                                    <div>
                                      <Label className="text-xs text-gray-6 mb-2 block">Produto</Label>
                                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        {refund.product.image && (
                                          <img 
                                            src={refund.product.image} 
                                            alt={refund.product.name}
                                            className="w-16 h-16 object-cover rounded-md"
                                          />
                                        )}
                                        <div>
                                          <p className="font-medium text-sm text-gray-9">{refund.product.name}</p>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-xs text-gray-6 mb-2 block">Cliente</Label>
                                      <div className="space-y-1">
                                        <p className="text-sm font-medium text-gray-9">
                                          {refund.client?.name || `${refund.client?.firstName || ''} ${refund.client?.lastName || ''}`.trim()}
                                        </p>
                                        <p className="text-xs text-gray-6">{refund.client?.email}</p>
                                        {refund.client?.phone && (
                                          <p className="text-xs text-gray-6">{refund.client.phone}</p>
                                        )}
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-xs text-gray-6 mb-2 block">Vendedor</Label>
                                      <p className="text-sm font-medium text-gray-9">{refund.seller?.name || 'N/A'}</p>
                                    </div>
                                  </div>

                                  <div>
                                    <Label className="text-xs text-gray-6 mb-2 block">Motivo</Label>
                                    <p className="text-sm text-gray-9">{refund.reason || 'N/A'}</p>
                                  </div>

                                  {refund.description && (
                                    <div>
                                      <Label className="text-xs text-gray-6 mb-2 block">Descrição</Label>
                                      <p className="text-sm text-gray-9 whitespace-pre-wrap">{refund.description}</p>
                                    </div>
                                  )}

                                  {refund.images && refund.images.length > 0 && (
                                    <div>
                                      <Label className="text-xs text-gray-6 mb-2 block">Imagens</Label>
                                      <div className="grid grid-cols-3 gap-2">
                                        {refund.images.map((image: string, index: number) => (
                                          <img
                                            key={index}
                                            src={image}
                                            alt={`Imagem ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={() => window.open(image, '_blank')}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {refund.rejectionReason && (
                                    <div>
                                      <Label className="text-xs text-gray-6 mb-2 block">Motivo da Rejeição</Label>
                                      <p className="text-sm text-gray-9">{refund.rejectionReason}</p>
                                    </div>
                                  )}

                                  {refund.processedAt && (
                                    <div>
                                      <Label className="text-xs text-gray-6 mb-2 block">Processado em</Label>
                                      <p className="text-sm text-gray-9">{formatDate(refund.processedAt)}</p>
                                    </div>
                                  )}

                                  {refund.status === 'pending' && (
                                    <div className="pt-4 border-t space-y-3">
                                      <div>
                                        <Label htmlFor="rejectionReason">Motivo da Rejeição (se rejeitar)</Label>
                                        <Textarea
                                          id="rejectionReason"
                                          value={rejectionReason}
                                          onChange={(e) => setRejectionReason(e.target.value)}
                                          placeholder="Digite o motivo da rejeição..."
                                          rows={3}
                                          className="mt-2"
                                        />
                                      </div>
                                      <div className="flex gap-2">
                                        <Button
                                          className="flex-1 bg-green-600 hover:bg-green-700"
                                          onClick={() => handleApproveRefund(refund.id || refund._id)}
                                          disabled={approveRefund.isPending}
                                        >
                                          <CheckCircle className="w-4 h-4 mr-2" />
                                          Aprovar
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          className="flex-1"
                                          onClick={() => handleRejectRefund(refund.id || refund._id)}
                                          disabled={rejectRefund.isPending || !rejectionReason.trim()}
                                        >
                                          <XCircle className="w-4 h-4 mr-2" />
                                          Rejeitar
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>

                            {refund.status === 'pending' && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => handleApproveRefund(refund.id || refund._id)}
                                    disabled={approveRefund.isPending}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                    Aprovar
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedRefund(refund);
                                      setShowRejectDialog(true);
                                      setRejectionReason('');
                                    }}
                                  >
                                    <XCircle className="w-4 h-4 mr-2 text-red-600" />
                                    Rejeitar
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="border-t border-gray-2 px-4 py-3">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-6">
                      Mostrando {(pagination.page - 1) * pagination.limit + 1} a {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(1)}
                        disabled={pagination.page === 1}
                      >
                        Primeira
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={pagination.page === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      {getPageNumbers().map((pageNum, idx) => (
                        <Button
                          key={idx}
                          variant={pageNum === pagination.page ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => typeof pageNum === 'number' && setPage(pageNum)}
                          disabled={pageNum === '...'}
                          className="min-w-[40px]"
                        >
                          {pageNum}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                        disabled={pagination.page >= pagination.totalPages}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage(pagination.totalPages)}
                        disabled={pagination.page >= pagination.totalPages}
                      >
                        Última
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Reembolso</DialogTitle>
            <DialogDescription>
              Por favor, forneça um motivo para a rejeição
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectionReasonDialog">Motivo da Rejeição *</Label>
              <Textarea
                id="rejectionReasonDialog"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Digite o motivo da rejeição..."
                rows={4}
                className="mt-2"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectionReason('');
                  setSelectedRefund(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => selectedRefund && handleRejectRefund(selectedRefund.id || selectedRefund._id)}
                disabled={rejectRefund.isPending || !rejectionReason.trim()}
              >
                Confirmar Rejeição
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
