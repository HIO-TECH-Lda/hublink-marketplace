'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Clock, DollarSign, Search, RefreshCw, Eye } from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { formatCurrency, formatDate } from '@/lib/payment';

export default function AdminRefundsPage() {
  const router = useRouter();
  const { state } = useMarketplace();
  const [refunds, setRefunds] = useState<any[]>([]);
  const [filteredRefunds, setFilteredRefunds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [selectedRefund, setSelectedRefund] = useState<any | null>(null);
  const [filters, setFilters] = useState({
    status: 'all',
    search: ''
  });

  useEffect(() => {
    loadRefunds();
  }, []);

  useEffect(() => {
    filterRefunds();
  }, [refunds, filters]);

  const loadRefunds = async () => {
    try {
      setIsLoading(true);
             // Mock data
       const mockRefunds = [
         {
           id: 're_1',
           amount: 2097, // 1198 + 899
           reason: 'requested_by_customer',
           status: 'pending',
           createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                       description: 'Os produtos chegaram danificados. As cebolas estavam murchas e as batatas doces tinham manchas escuras. Não estão em condições de consumo.',
            orderId: 'ord_123',
            customer: { firstName: 'João', lastName: 'Silva', email: 'joao@email.com' },
            seller: { storeName: 'Banca da Maria' },
            images: [
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=',
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
            ],
           returnItems: [
             {
               id: 'item_1',
               name: 'Cebolas Roxas Orgânicas',
               quantity: 2,
               price: 1198,
               image: '/images/onions.jpg'
             },
             {
               id: 'item_2', 
               name: 'Batatas Doces Orgânicas',
               quantity: 1,
               price: 899,
               image: '/images/sweet-potatoes.jpg'
             }
           ]
         },
         {
           id: 're_2',
           amount: 2500,
           reason: 'fraudulent',
           status: 'succeeded',
           createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
           processedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
           description: 'Transação suspeita detectada pelo sistema de segurança.',
           orderId: 'ord_124',
           customer: { firstName: 'Ana', lastName: 'Costa', email: 'ana@email.com' },
           seller: { storeName: 'Banca do Pedro' },
           returnItems: [
             {
               id: 'item_3',
               name: 'Calça Jeans',
               quantity: 1,
               price: 2500,
               image: '/images/jeans.jpg'
             }
           ]
         }
       ];
      setRefunds(mockRefunds);
    } catch (err) {
      setError('Erro ao carregar reembolsos.');
    } finally {
      setIsLoading(false);
    }
  };

  const filterRefunds = () => {
    let filtered = [...refunds];
    if (filters.status !== 'all') {
      filtered = filtered.filter(refund => refund.status === filters.status);
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(refund => 
        refund.id.toLowerCase().includes(searchTerm) ||
        refund.orderId.toLowerCase().includes(searchTerm) ||
        refund.customer.firstName.toLowerCase().includes(searchTerm) ||
        refund.customer.lastName.toLowerCase().includes(searchTerm)
      );
    }
    setFilteredRefunds(filtered);
  };

  const handleApproveRefund = async (refundId: string) => {
    try {
      setIsProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRefunds(prev => prev.map(refund => 
        refund.id === refundId 
          ? { ...refund, status: 'succeeded', processedAt: new Date().toISOString() }
          : refund
      ));
    } catch (err) {
      setError('Erro ao aprovar reembolso.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectRefund = async (refundId: string) => {
    try {
      setIsProcessing(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRefunds(prev => prev.map(refund => 
        refund.id === refundId 
          ? { ...refund, status: 'failed', processedAt: new Date().toISOString() }
          : refund
      ));
    } catch (err) {
      setError('Erro ao rejeitar reembolso.');
    } finally {
      setIsProcessing(false);
    }
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
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-9">Gestão de Reembolsos</h1>
            <p className="text-gray-6">Gerencie todas as solicitações de reembolso</p>
          </div>
          <Button onClick={loadRefunds} disabled={isLoading} className="bg-primary hover:bg-primary-hard text-white">
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

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

        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-4 w-4 h-4" />
                <Input
                  placeholder="Buscar por ID, cliente..."
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

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Reembolsos ({filteredRefunds.length})</CardTitle>
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
                          Pedido #{refund.orderId} • {formatDate(refund.createdAt)}
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
                      <div>
                        <p className="text-gray-6">Cliente</p>
                        <p className="font-medium text-gray-9">
                          {refund.customer.firstName} {refund.customer.lastName}
                        </p>
                        <p className="text-gray-6">{refund.customer.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-6">Vendedor</p>
                        <p className="font-medium text-gray-9">{refund.seller.storeName}</p>
                      </div>
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
                                                               <div>
                                  <p className="text-sm text-gray-6">Pedido</p>
                                  <p className="font-medium text-gray-9">#{refund.orderId}</p>
                                </div>
                                {refund.returnItems && refund.returnItems.length > 0 && (
                                  <div>
                                    <p className="text-sm text-gray-6 mb-2">Itens para Retorno</p>
                                    <div className="space-y-3">
                                      {refund.returnItems.map((item: any) => (
                                        <div key={item.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                          <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                                            {item.image ? (
                                              <img 
                                                src={item.image} 
                                                alt={item.name}
                                                className="w-12 h-12 object-cover rounded-md"
                                              />
                                            ) : (
                                              <span className="text-gray-500 text-xs">IMG</span>
                                            )}
                                          </div>
                                          <div className="flex-1">
                                            <p className="font-medium text-gray-9 text-sm">{item.name}</p>
                                            <p className="text-gray-6 text-xs">Qtd: {item.quantity}</p>
                                          </div>
                                          <div className="text-right">
                                            <p className="font-medium text-gray-9 text-sm">{formatCurrency(item.price)}</p>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                               <div>
                                 <p className="text-sm text-gray-6">Cliente</p>
                                 <p className="font-medium text-gray-9">
                                   {refund.customer.firstName} {refund.customer.lastName}
                                 </p>
                                 <p className="text-gray-6">{refund.customer.email}</p>
                               </div>
                               <div>
                                 <p className="text-sm text-gray-6">Vendedor</p>
                                 <p className="font-medium text-gray-9">{refund.seller.storeName}</p>
                               </div>
                               <div>
                                 <p className="text-sm text-gray-6">Motivo</p>
                                 <p className="font-medium text-gray-9">{getReasonText(refund.reason)}</p>
                               </div>
                                                               {refund.description && (
                                  <div>
                                    <p className="text-sm text-gray-6">Descrição Detalhada</p>
                                    <p className="text-gray-9">{refund.description}</p>
                                  </div>
                                )}
                                {refund.images && refund.images.length > 0 && (
                                  <div>
                                    <p className="text-sm text-gray-6 mb-2">Imagens de Apoio</p>
                                    <div className="grid grid-cols-2 gap-2">
                                      {refund.images.map((image: string, index: number) => (
                                        <div key={index} className="relative">
                                          <img
                                            src={image}
                                            alt={`Imagem de apoio ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                                            onClick={() => {
                                              // Open image in full screen (you can implement a modal here)
                                              window.open(image, '_blank');
                                            }}
                                          />
                                          <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                                            {index + 1}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    <p className="text-xs text-gray-5 mt-1">Clique nas imagens para ampliar</p>
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

                         {refund.status === 'pending' && (
                           <div className="flex gap-2">
                             <Button
                               size="sm"
                               className="bg-green-600 hover:bg-green-700 text-white"
                               onClick={() => handleApproveRefund(refund.id)}
                               disabled={isProcessing}
                             >
                               <CheckCircle className="w-4 h-4 mr-2" />
                               Aprovar
                             </Button>
                             <Button
                               size="sm"
                               variant="destructive"
                               onClick={() => handleRejectRefund(refund.id)}
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
    </AdminLayout>
  );
}
