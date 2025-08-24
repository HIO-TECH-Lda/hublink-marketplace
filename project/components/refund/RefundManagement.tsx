'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, DollarSign, Search, RefreshCw, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatCurrency, formatDate } from '@/lib/payment';

interface Refund {
  id: string;
  amount: number;
  reason: string;
  status: 'pending' | 'succeeded' | 'failed';
  createdAt: string;
  processedAt?: string;
  description?: string;
  orderId?: string;
  productName?: string;
  customer?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  seller?: {
    storeName: string;
  };
}

interface RefundManagementProps {
  title: string;
  description: string;
  refunds: Refund[];
  isLoading: boolean;
  error: string;
  onRefresh: () => void;
  onApprove?: (refundId: string) => void;
  onReject?: (refundId: string) => void;
  isProcessing?: boolean;
  showActions?: boolean;
}

export default function RefundManagement({
  title,
  description,
  refunds,
  isLoading,
  error,
  onRefresh,
  onApprove,
  onReject,
  isProcessing = false,
  showActions = false
}: RefundManagementProps) {
  const [filteredRefunds, setFilteredRefunds] = useState<Refund[]>([]);
  const [selectedRefund, setSelectedRefund] = useState<Refund | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });

  useEffect(() => {
    filterRefunds();
  }, [refunds, filters]);

  const filterRefunds = () => {
    let filtered = [...refunds];
    
    if (filters.status !== 'all') {
      filtered = filtered.filter(refund => refund.status === filters.status);
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(refund => 
        refund.id.toLowerCase().includes(searchTerm) ||
        refund.orderId?.toLowerCase().includes(searchTerm) ||
        refund.productName?.toLowerCase().includes(searchTerm) ||
        refund.customer?.firstName.toLowerCase().includes(searchTerm) ||
        refund.customer?.lastName.toLowerCase().includes(searchTerm) ||
        refund.customer?.email.toLowerCase().includes(searchTerm) ||
        refund.seller?.storeName.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredRefunds(filtered);
  };

  const getRefundStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRefundStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'succeeded': return 'Aprovado';
      case 'failed': return 'Rejeitado';
      default: return status;
    }
  };

  const getReasonText = (reason: string) => {
    switch (reason) {
      case 'requested_by_customer': return 'Solicitado pelo cliente';
      case 'fraudulent': return 'Transação fraudulenta';
      case 'duplicate': return 'Cobrança duplicada';
      case 'other': return 'Outro motivo';
      default: return reason;
    }
  };

  const stats = {
    total: refunds.length,
    pending: refunds.filter(r => r.status === 'pending').length,
    approved: refunds.filter(r => r.status === 'succeeded').length,
    rejected: refunds.filter(r => r.status === 'failed').length,
    totalAmount: refunds.reduce((sum, r) => sum + r.amount, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-9">{title}</h1>
          <p className="text-gray-6">{description}</p>
        </div>
        <Button onClick={onRefresh} disabled={isLoading} className="bg-primary hover:bg-primary-hard text-white">
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Atualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-6">Total</p>
                <p className="text-2xl font-bold text-gray-9">{stats.total}</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-6">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-6">Aprovados</p>
                <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-6">Rejeitados</p>
                <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-6">Valor Total</p>
                <p className="text-2xl font-bold text-gray-9">{formatCurrency(stats.totalAmount)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-4 w-4 h-4" />
              <Input
                placeholder="Buscar por ID, produto, cliente..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="pending">Pendentes</SelectItem>
                <SelectItem value="succeeded">Aprovados</SelectItem>
                <SelectItem value="failed">Rejeitados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Refunds List */}
      <Card>
        <CardHeader>
          <CardTitle>Reembolsos ({filteredRefunds.length})</CardTitle>
          <CardDescription>
            Lista de todas as solicitações de reembolso
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-6">Carregando reembolsos...</p>
            </div>
          ) : filteredRefunds.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-gray-4 mx-auto mb-4" />
              <p className="text-gray-6">Nenhum reembolso encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRefunds.map((refund) => (
                <div key={refund.id} className="border border-gray-2 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium text-gray-9">Reembolso #{refund.id}</h3>
                      <p className="text-sm text-gray-6">
                        {refund.orderId && `Pedido #${refund.orderId} • `}{formatDate(refund.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRefundStatusColor(refund.status)}>
                        {getRefundStatusText(refund.status)}
                      </Badge>
                      <span className="font-semibold text-gray-9">
                        {formatCurrency(refund.amount)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3 text-sm">
                    {refund.productName && (
                      <div>
                        <p className="text-gray-6">Produto</p>
                        <p className="font-medium text-gray-9">{refund.productName}</p>
                      </div>
                    )}
                    {refund.customer && (
                      <div>
                        <p className="text-gray-6">Cliente</p>
                        <p className="font-medium text-gray-9">
                          {refund.customer.firstName} {refund.customer.lastName}
                        </p>
                        <p className="text-gray-6">{refund.customer.email}</p>
                      </div>
                    )}
                    {refund.seller && (
                      <div>
                        <p className="text-gray-6">Vendedor</p>
                        <p className="font-medium text-gray-9">{refund.seller.storeName}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-6">
                      <p>Motivo: {getReasonText(refund.reason)}</p>
                      {refund.description && (
                        <p className="mt-1">{refund.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedRefund(refund)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Detalhes
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Detalhes do Reembolso #{refund.id}</DialogTitle>
                            <DialogDescription>
                              Informações completas sobre a solicitação de reembolso
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-gray-6">Status</p>
                                <Badge className={getRefundStatusColor(refund.status)}>
                                  {getRefundStatusText(refund.status)}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-sm text-gray-6">Valor</p>
                                <p className="font-medium">{formatCurrency(refund.amount)}</p>
                              </div>
                            </div>
                            {refund.productName && (
                              <div>
                                <p className="text-sm text-gray-6">Produto</p>
                                <p className="font-medium text-gray-9">{refund.productName}</p>
                              </div>
                            )}
                            {refund.customer && (
                              <div>
                                <p className="text-sm text-gray-6">Cliente</p>
                                <p className="font-medium text-gray-9">
                                  {refund.customer.firstName} {refund.customer.lastName}
                                </p>
                                <p className="text-gray-6">{refund.customer.email}</p>
                              </div>
                            )}
                            {refund.seller && (
                              <div>
                                <p className="text-sm text-gray-6">Vendedor</p>
                                <p className="font-medium text-gray-9">{refund.seller.storeName}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-sm text-gray-6">Motivo</p>
                              <p className="font-medium text-gray-9">{getReasonText(refund.reason)}</p>
                            </div>
                            {refund.description && (
                              <div>
                                <p className="text-sm text-gray-6">Descrição</p>
                                <p className="text-gray-9">{refund.description}</p>
                              </div>
                            )}
                            <div>
                              <p className="text-sm text-gray-6">Solicitado em</p>
                              <p className="text-gray-9">{formatDate(refund.createdAt)}</p>
                            </div>
                            {refund.processedAt && (
                              <div>
                                <p className="text-sm text-gray-6">Processado em</p>
                                <p className="text-gray-9">{formatDate(refund.processedAt)}</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>

                      {showActions && refund.status === 'pending' && onApprove && onReject && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => onApprove(refund.id)}
                            disabled={isProcessing}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => onReject(refund.id)}
                            disabled={isProcessing}
                          >
                            <XCircle className="w-4 h-4 mr-2" />
                            Rejeitar
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
