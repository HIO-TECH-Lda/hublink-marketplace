'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRefundStatistics, useSellerRefunds, useApproveRefund, useRejectRefund } from '@/hooks/useRefunds';
import { CheckCircle, XCircle, Clock, DollarSign, Search, Eye } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SellerSidebar from '../../components/SellerSidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

export default function SellerRefundsPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRefund, setSelectedRefund] = useState<any | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectDialog, setShowRejectDialog] = useState(false);

  const { data: statistics, isLoading: statsLoading } = useRefundStatistics();
  const { data: refundsData, isLoading: refundsLoading } = useSellerRefunds({
    page: 1,
    limit: 10,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: searchTerm || undefined,
  });
  const approveRefund = useApproveRefund();
  const rejectRefund = useRejectRefund();

  const refunds = refundsData?.refunds || [];
  const pagination = refundsData?.pagination;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'rejected':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'approved':
        return 'Aprovado';
      case 'rejected':
        return 'Rejeitado';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const handleApprove = (refundId: string) => {
    approveRefund.mutate(refundId);
  };

  const handleReject = (refundId: string) => {
    if (!rejectionReason.trim() || rejectionReason.length < 10) {
      return;
    }
    rejectRefund.mutate(
      { refundId, rejectionReason },
      {
        onSuccess: () => {
          setShowRejectDialog(false);
          setRejectionReason('');
          setSelectedRefund(null);
        },
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-6">Verificando autenticação...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'seller') {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Acesso Negado</h1>
          <p className="text-gray-6 mb-8">Você precisa estar logado como vendedor para acessar esta página.</p>
          <Link href="/entrar">
            <Button className="bg-primary hover:bg-primary-hard text-white">Fazer Login</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />
      
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / 
          <Link href="/vendedor/painel" className="hover:text-primary"> Painel do Vendedor</Link> / 
          <span className="text-primary">Reembolsos</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <SellerSidebar />
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-9">Os Meus Reembolsos</h1>
              <p className="text-gray-6">Acompanhe aqui os pedidos de reembolso relacionados com produtos da sua banca. Consulte o motivo apresentado pelo cliente, o estado de cada solicitação e o valor associado ao pedido.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 sm:gap-6">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-6">Total de Reembolsos</p>
                    <p className="text-2xl font-bold text-gray-9">
                      {statsLoading ? '...' : statistics?.total || 0}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-6">Reembolso Pendente</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {statsLoading ? '...' : statistics?.pending || 0}
                    </p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-6">Reembolso Aprovado</p>
                    <p className="text-2xl font-bold text-green-600">
                      {statsLoading ? '...' : statistics?.approved || 0}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-6">Reembolsos Rejeitados</p>
                    <p className="text-2xl font-bold text-red-600">
                      {statsLoading ? '...' : statistics?.rejected || 0}
                    </p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-6">Valor Total em Reembolsos</p>
                    <p className="text-2xl font-bold text-gray-9">
                      {statsLoading ? '...' : `MTn ${(statistics?.totalValue || 0).toFixed(2)}`}
                    </p>
                  </div>
                  <DollarSign className="w-8 h-8 text-primary" />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-4 w-4 h-4" />
                  <Input
                    placeholder="Pesquisar por produto, cliente, pedido ou motivo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="all">Todos os Estados</option>
                  <option value="pending">Pendentes</option>
                  <option value="approved">Aprovados</option>
                  <option value="rejected">Rejeitados</option>
                </select>
              </div>
            </div>

            {/* Refunds Table */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Reembolsos ({refunds.length})</h2>
              </div>
              
              {refundsLoading ? (
                <div className="px-6 py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-6">Carregando reembolsos...</p>
                </div>
              ) : refunds.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-6">Nenhum reembolso encontrado</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Produto
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cliente
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Pedido
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acções
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {refunds.map((refund) => {
                        const orderId = typeof refund.orderId === 'object' ? refund.orderId._id : refund.orderId;
                        const orderNumber = typeof refund.orderId === 'object' ? refund.orderId.orderNumber : orderId?.slice(-8);
                        const buyer = typeof refund.buyerId === 'object' ? refund.buyerId : null;
                        const product = typeof refund.productId === 'object' ? refund.productId : null;
                        
                        return (
                          <tr key={refund._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                {product?.primaryImage && (
                                  <img
                                    src={product.primaryImage}
                                    alt={refund.productName}
                                    className="w-10 h-10 rounded-lg object-cover mr-3"
                                  />
                                )}
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{refund.productName}</div>
                                  <div className="text-xs text-gray-500">{refund.reason}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {buyer ? `${buyer.firstName} ${buyer.lastName}` : '—'}
                              </div>
                              {buyer?.email && (
                                <div className="text-xs text-gray-500">{buyer.email}</div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {orderNumber || `#${orderId?.slice(-8)}`}
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(refund.requestedAt || refund.createdAt).toLocaleDateString('pt-MZ')}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              MTn {refund.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(refund.status)}`}>
                                {getStatusIcon(refund.status)}
                                <span className="ml-1">{getStatusText(refund.status)}</span>
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <button
                                      onClick={() => setSelectedRefund(refund)}
                                      className="inline-flex items-center text-green-600 hover:text-green-900"
                                    >
                                      <Eye className="w-4 h-4 mr-1" />
                                      Ver Detalhes
                                    </button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle>Detalhes do Reembolso #{refund._id.slice(-8)}</DialogTitle>
                                      <DialogDescription>Informações completas sobre a solicitação de reembolso</DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                          <p className="text-gray-6">Status</p>
                                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(refund.status)}`}>
                                            {getStatusIcon(refund.status)}
                                            <span className="ml-1">{getStatusText(refund.status)}</span>
                                          </span>
                                        </div>
                                        <div>
                                          <p className="text-gray-6">Valor</p>
                                          <p className="font-medium text-gray-9 mt-1">MTn {refund.amount.toFixed(2)}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-6">Moeda</p>
                                          <p className="font-medium text-gray-9 mt-1">{refund.currency}</p>
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <p className="text-gray-6">Produto</p>
                                          <p className="font-medium text-gray-9 mt-1">{refund.productName}</p>
                                        </div>
                                        <div>
                                          <p className="text-gray-6">Pedido</p>
                                          <p className="font-medium text-gray-9 mt-1">
                                            {orderNumber || `#${orderId?.slice(-8)}`}
                                          </p>
                                        </div>
                                      </div>

                                      <div>
                                        <p className="text-gray-6">Cliente</p>
                                        <p className="font-medium text-gray-9 mt-1">
                                          {buyer ? `${buyer.firstName} ${buyer.lastName}` : '—'}
                                        </p>
                                        {buyer?.email && (
                                          <p className="text-gray-6 text-sm mt-1">{buyer.email}</p>
                                        )}
                                      </div>

                                      <div>
                                        <p className="text-gray-6">Motivo</p>
                                        <p className="font-medium text-gray-9 mt-1">{refund.reason}</p>
                                      </div>

                                      <div>
                                        <p className="text-gray-6">Descrição</p>
                                        <p className="text-gray-9 mt-1">{refund.description}</p>
                                      </div>

                                      {refund.images && refund.images.length > 0 && (
                                        <div>
                                          <p className="text-gray-6 mb-2">Imagens de Apoio</p>
                                          <div className="grid grid-cols-2 gap-2">
                                            {refund.images.map((image: string, index: number) => (
                                              <img
                                                key={index}
                                                src={image}
                                                alt={`Imagem ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90"
                                                onClick={() => window.open(image, '_blank')}
                                              />
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                          <p className="text-gray-6">Solicitado em</p>
                                          <p className="font-medium text-gray-9 mt-1">
                                            {new Date(refund.requestedAt || refund.createdAt).toLocaleString('pt-MZ')}
                                          </p>
                                        </div>
                                        {refund.processedAt && (
                                          <div>
                                            <p className="text-gray-6">Processado em</p>
                                            <p className="font-medium text-gray-9 mt-1">
                                              {new Date(refund.processedAt).toLocaleString('pt-MZ')}
                                            </p>
                                          </div>
                                        )}
                                      </div>

                                      {refund.rejectionReason && (
                                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                          <p className="text-sm font-medium text-red-900">Motivo da Rejeição</p>
                                          <p className="text-sm text-red-700 mt-1">{refund.rejectionReason}</p>
                                        </div>
                                      )}

                                      {refund.status === 'pending' && (
                                        <div className="flex space-x-3 pt-4 border-t border-gray-200">
                                          <Button
                                            onClick={() => handleApprove(refund._id)}
                                            disabled={approveRefund.isPending}
                                            className="flex-1 bg-primary text-primary-foreground hover:bg-primary-hard"
                                          >
                                            <CheckCircle className="w-4 h-4 mr-2" />
                                            {approveRefund.isPending ? 'Aprovando...' : 'Aprovar'}
                                          </Button>
                                          <Button
                                            onClick={() => {
                                              setSelectedRefund(refund);
                                              setShowRejectDialog(true);
                                            }}
                                            disabled={rejectRefund.isPending}
                                            variant="outline"
                                            className="flex-1 border-red-600 text-red-600 hover:bg-red-50"
                                          >
                                            <XCircle className="w-4 h-4 mr-2" />
                                            Rejeitar
                                          </Button>
                                        </div>
                                      )}
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> a{' '}
                    <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> de{' '}
                    <span className="font-medium">{pagination.total}</span> resultados
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      disabled={pagination.page === 1}
                      onClick={() => {/* TODO: Implement pagination */}}
                    >
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      disabled={pagination.page === pagination.pages}
                      onClick={() => {/* TODO: Implement pagination */}}
                    >
                      Próximo
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeitar Reembolso</DialogTitle>
            <DialogDescription>
              Por favor, forneça um motivo para a rejeição (mínimo 10 caracteres)
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-7 mb-2">
                Motivo da Rejeição *
              </label>
              <Textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Digite o motivo da rejeição..."
                rows={4}
                minLength={10}
                maxLength={500}
                required
              />
              <p className="text-xs text-gray-5 mt-1">
                {rejectionReason.length}/500 caracteres (mínimo 10)
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectionReason('');
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={() => selectedRefund && handleReject(selectedRefund._id)}
                disabled={rejectRefund.isPending || rejectionReason.length < 10}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {rejectRefund.isPending ? 'Rejeitando...' : 'Rejeitar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
