'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePayoutBalance, usePayoutHistory, useRequestPayout } from '@/hooks/usePayouts';
import { DollarSign, Calendar, CheckCircle, Clock, AlertCircle, TrendingUp, Plus, X, Eye } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SellerSidebar from '../../components/SellerSidebar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function PayoutsPage() {
  const { isAuthenticated, user, loading } = useAuth();
  const { data: balance, isLoading: balanceLoading } = usePayoutBalance();
  const { data: historyData, isLoading: historyLoading } = usePayoutHistory({ page: 1, limit: 10 });
  const requestPayout = useRequestPayout();
  
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'bank_transfer' | 'emola'>('mpesa');
  const [selectedPayout, setSelectedPayout] = useState<any | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'processing':
        return 'text-blue-600 bg-blue-50';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluído';
      case 'processing':
        return 'Processando';
      case 'pending':
        return 'Pendente';
      case 'failed':
        return 'Falhou';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
        return <Clock className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getMethodText = (method: string) => {
    switch (method) {
      case 'mpesa':
        return 'M-Pesa';
      case 'bank_transfer':
        return 'Transferência Bancária';
      case 'emola':
        return 'E-Mola';
      default:
        return method;
    }
  };

  const handlePayoutRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(payoutAmount);
    
    if (isNaN(amount) || amount <= 0) {
      return;
    }
    
    if (balance && amount > balance.available) {
      return;
    }

    requestPayout.mutate(
      { amount, method: paymentMethod },
      {
        onSuccess: () => {
          setShowPayoutModal(false);
          setPayoutAmount('');
          setPaymentMethod('mpesa');
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
          <p className="text-gray-6 mb-8">Você precisa ser um vendedor para acessar esta página.</p>
          <Link href="/entrar">
            <Button className="bg-primary hover:bg-primary-hard text-white">Fazer Login</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const payouts = historyData?.payouts || [];
  const pagination = historyData?.pagination;

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / 
          <Link href="/vendedor/painel" className="hover:text-primary"> Painel do Vendedor</Link> / 
          <span className="text-primary">Repasses</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <SellerSidebar />
          </div>

          <div className="lg:col-span-3 space-y-8">
            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Saldo Disponível</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {balanceLoading ? '...' : `MTn ${(balance?.available || 0).toFixed(2)}`}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pendente</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {balanceLoading ? '...' : `MTn ${(balance?.pending || 0).toFixed(2)}`}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Ganho</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {balanceLoading ? '...' : `MTn ${(balance?.totalEarned || 0).toFixed(2)}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payouts Table */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Histórico de Repasses</h2>
                <Dialog open={showPayoutModal} onOpenChange={setShowPayoutModal}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Solicitar Repasse
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Solicitar Repasse</DialogTitle>
                      <DialogDescription>
                        Solicite um repasse do seu saldo disponível: MTn {(balance?.available || 0).toFixed(2)}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handlePayoutRequest} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-7 mb-2">
                          Valor do Repasse (MTn) *
                        </label>
                        <Input
                          type="number"
                          value={payoutAmount}
                          onChange={(e) => setPayoutAmount(e.target.value)}
                          placeholder="0.00"
                          min="0.01"
                          max={balance?.available || 0}
                          step="0.01"
                          required
                        />
                        {balance && parseFloat(payoutAmount) > balance.available && (
                          <p className="text-xs text-red-500 mt-1">
                            Valor excede o saldo disponível
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-7 mb-2">
                          Método de Pagamento *
                        </label>
                        <select
                          value={paymentMethod}
                          onChange={(e) => setPaymentMethod(e.target.value as 'mpesa' | 'bank_transfer' | 'emola')}
                          className="w-full px-3 py-2 border border-gray-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        >
                          <option value="mpesa">M-Pesa</option>
                          <option value="bank_transfer">Transferência Bancária</option>
                          <option value="emola">E-Mola</option>
                        </select>
                      </div>
                      <div className="flex justify-end space-x-3 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowPayoutModal(false)}
                        >
                          Cancelar
                        </Button>
                        <Button
                          type="submit"
                          disabled={requestPayout.isPending || (balance && parseFloat(payoutAmount) > balance.available)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {requestPayout.isPending ? 'Enviando...' : 'Solicitar Repasse'}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              {historyLoading ? (
                <div className="px-6 py-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-6">Carregando repasses...</p>
                </div>
              ) : payouts.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum repasse encontrado</h3>
                  <p className="text-gray-600 mb-6">Ainda não há repasses disponíveis para sua conta.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID do Repasse
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Período
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Método
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Valor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payouts.map((payout) => (
                        <tr key={payout._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              #{payout._id.slice(-8)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm text-gray-900">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              {new Date(payout.createdAt).toLocaleDateString('pt-MZ')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(payout.periodStart).toLocaleDateString('pt-MZ')} - {new Date(payout.periodEnd).toLocaleDateString('pt-MZ')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {getMethodText(payout.method)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            MTn {payout.netAmount.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payout.status)}`}>
                              {getStatusIcon(payout.status)}
                              <span className="ml-1">{getStatusText(payout.status)}</span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Dialog>
                              <DialogTrigger asChild>
                                <button
                                  onClick={() => setSelectedPayout(payout)}
                                  className="inline-flex items-center text-green-600 hover:text-green-900"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Ver Detalhes
                                </button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Detalhes do Repasse #{payout._id.slice(-8)}</DialogTitle>
                                  <DialogDescription>Informações completas sobre este repasse</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                      <p className="text-gray-6">Status</p>
                                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(payout.status)}`}>
                                        {getStatusIcon(payout.status)}
                                        <span className="ml-1">{getStatusText(payout.status)}</span>
                                      </span>
                                    </div>
                                    <div>
                                      <p className="text-gray-6">Método</p>
                                      <p className="font-medium text-gray-9 mt-1">{getMethodText(payout.method)}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-6">Valor</p>
                                      <p className="font-medium text-gray-9 mt-1">MTn {payout.netAmount.toFixed(2)}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="text-gray-6">Período Início</p>
                                      <p className="font-medium text-gray-9 mt-1">
                                        {new Date(payout.periodStart).toLocaleString('pt-MZ')}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-gray-6">Período Fim</p>
                                      <p className="font-medium text-gray-9 mt-1">
                                        {new Date(payout.periodEnd).toLocaleString('pt-MZ')}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                      <p className="text-gray-6">Taxa de Comissão</p>
                                      <p className="font-medium text-gray-9 mt-1">{payout.commissionRate}%</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-6">Comissão</p>
                                      <p className="font-medium text-gray-9 mt-1">MTn {payout.commissionAmount.toFixed(2)}</p>
                                    </div>
                                    <div>
                                      <p className="text-gray-6">Data de Criação</p>
                                      <p className="font-medium text-gray-9 mt-1">
                                        {new Date(payout.createdAt).toLocaleString('pt-MZ')}
                                      </p>
                                    </div>
                                  </div>

                                  {payout.processedAt && (
                                    <div>
                                      <p className="text-gray-6">Processado em</p>
                                      <p className="font-medium text-gray-9 mt-1">
                                        {new Date(payout.processedAt).toLocaleString('pt-MZ')}
                                      </p>
                                    </div>
                                  )}

                                  {payout.failureReason && (
                                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                      <p className="text-sm font-medium text-red-900">Motivo da Falha</p>
                                      <p className="text-sm text-red-700 mt-1">{payout.failureReason}</p>
                                    </div>
                                  )}

                                  {payout.orderIds && payout.orderIds.length > 0 && (
                                    <div>
                                      <h4 className="text-md font-medium text-gray-9 mb-3">
                                        Pedidos Incluídos ({payout.orderIds.length})
                                      </h4>
                                      <div className="overflow-x-auto">
                                        <table className="min-w-full text-sm">
                                          <thead>
                                            <tr className="border-b border-gray-2">
                                              <th className="text-left py-2 px-2">Número do Pedido</th>
                                              <th className="text-left py-2 px-2">Valor</th>
                                              <th className="text-left py-2 px-2">Status</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {payout.orderIds.map((order: any, index: number) => (
                                              <tr key={order._id || index} className="border-b border-gray-1">
                                                <td className="py-2 px-2">
                                                  {typeof order === 'string' ? order : order.orderNumber || order._id}
                                                </td>
                                                <td className="py-2 px-2">
                                                  {typeof order === 'string' ? '—' : `MTn ${(order.total || 0).toFixed(2)}`}
                                                </td>
                                                <td className="py-2 px-2">
                                                  {typeof order === 'string' ? '—' : (
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${getStatusColor(order.status || 'pending')}`}>
                                                      {getStatusText(order.status || 'pending')}
                                                    </span>
                                                  )}
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          </td>
                        </tr>
                      ))}
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
      <Footer />
    </div>
  );
}
