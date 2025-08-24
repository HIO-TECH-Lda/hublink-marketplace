'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Package, Truck, CheckCircle, Clock, MapPin, Calendar, ArrowLeft, Download, Printer, RotateCcw, AlertCircle, X } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { OrderTrackingService, InvoiceService, formatCurrency, formatDate } from '@/lib/payment';

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { state } = useMarketplace();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<any>(null);
  const [tracking, setTracking] = useState<any>(null);
  const [invoice, setInvoice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Return request state
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [returnDescription, setReturnDescription] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);

  useEffect(() => {
    loadOrderData();
  }, [orderId]);

  const loadOrderData = async () => {
    try {
      // Find order from context
      const foundOrder = state.orders.find(o => o.id === orderId);
      if (!foundOrder) {
        setError('Pedido não encontrado.');
        setIsLoading(false);
        return;
      }
      
      setOrder(foundOrder);

      // Load tracking information
      const trackingData = await OrderTrackingService.getOrderTracking(orderId);
      setTracking(trackingData);

      // Load invoice
      const invoiceData = await InvoiceService.getInvoice(`inv_${orderId}`);
      setInvoice(invoiceData);

    } catch (err) {
      setError('Erro ao carregar dados do pedido.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'shipped':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'processing':
        return <Package className="w-5 h-5 text-orange-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-orange-100 text-orange-800';
      case 'confirmed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'confirmed':
        return 'Confirmado';
      case 'processing':
        return 'Em Processamento';
      case 'shipped':
        return 'Enviado';
      case 'delivered':
        return 'Entregue';
      case 'canceled':
        return 'Cancelado';
      case 'refunded':
        return 'Reembolsado';
      default:
        return status;
    }
  };

  const downloadInvoice = () => {
    // Mock invoice download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `invoice-${orderId}.pdf`;
    link.click();
  };

  const printInvoice = () => {
    window.print();
  };

  // Return request functions
  const handleReturnRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingReturn(true);

    try {
      // Validate form
      if (!returnReason || selectedItems.length === 0) {
        alert('Por favor, selecione um motivo e pelo menos um item para retorno.');
        return;
      }

      // Create return request
      const returnRequest = {
        orderId: order.id,
        items: selectedItems,
        reason: returnReason,
        description: returnDescription,
        status: 'pending',
        createdAt: new Date().toISOString(),
        userId: state.user?.id
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update order status
      const updatedOrder = {
        ...order,
        status: 'return_requested',
        returnRequest
      };
      setOrder(updatedOrder);
      
      // Close modal and show success message
      setShowReturnModal(false);
      setReturnReason('');
      setReturnDescription('');
      setSelectedItems([]);
      alert('Solicitação de retorno enviada com sucesso!');
      
    } catch (error) {
      console.error('Error submitting return request:', error);
      alert('Erro ao enviar solicitação de retorno. Tente novamente.');
    } finally {
      setIsSubmittingReturn(false);
    }
  };

  const handleItemSelection = (itemId: string) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  // Generate unique item ID for order items
  const getItemUniqueId = (item: any, index: number) => {
    return `${order.id}-${item.product.id}-${index}`;
  };

  const canRequestReturn = () => {
    return order?.status === 'delivered' && !order?.returnRequest;
  };

  const getReturnStatus = () => {
    if (order?.returnRequest) {
      switch (order.returnRequest.status) {
        case 'pending':
          return { text: 'Retorno Solicitado', color: 'bg-yellow-100 text-yellow-800' };
        case 'approved':
          return { text: 'Retorno Aprovado', color: 'bg-green-100 text-green-800' };
        case 'rejected':
          return { text: 'Retorno Rejeitado', color: 'bg-red-100 text-red-800' };
        case 'completed':
          return { text: 'Retorno Concluído', color: 'bg-blue-100 text-blue-800' };
        default:
          return { text: 'Retorno Pendente', color: 'bg-gray-100 text-gray-800' };
      }
    }
    return null;
  };

  const getReturnReasonText = (reason: string) => {
    switch (reason) {
      case 'defective':
        return 'Produto com defeito';
      case 'wrong_item':
        return 'Item incorreto recebido';
      case 'damaged':
        return 'Produto danificado';
      case 'not_as_described':
        return 'Não corresponde à descrição';
      case 'size_issue':
        return 'Problema com tamanho';
      case 'quality_issue':
        return 'Problema de qualidade';
      case 'changed_mind':
        return 'Mudei de ideia';
      case 'other':
        return 'Outro motivo';
      default:
        return reason;
    }
  };

  if (!state.isAuthenticated || !state.user) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Acesso Negado</h1>
          <p className="text-gray-6 mb-8">Você precisa estar logado para acessar esta página.</p>
          <Button onClick={() => router.push('/entrar')} className="bg-primary hover:bg-primary-hard text-white">
            Fazer Login
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-6">Carregando pedido...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Erro</h1>
          <p className="text-gray-6 mb-8">{error || 'Pedido não encontrado.'}</p>
          <Button onClick={() => router.push('/historico-pedidos')} className="bg-primary hover:bg-primary-hard text-white">
            Voltar aos Pedidos
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />
      
      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-6">
          <Button variant="ghost" onClick={() => router.push('/historico-pedidos')} className="p-0 h-auto text-gray-6 hover:text-primary">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Meus Pedidos
          </Button>
        </nav>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Order Header */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-9">
                    Pedido #{order.id}
                  </CardTitle>
                  <CardDescription className="text-gray-6">
                    Realizado em {formatDate(order.createdAt)}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(tracking?.status || order.status)}
                  <Badge className={getStatusColor(tracking?.status || order.status)}>
                    {getStatusText(tracking?.status || order.status)}
                  </Badge>
                  {getReturnStatus() && (
                    <Badge className={getReturnStatus()?.color}>
                      {getReturnStatus()?.text}
                    </Badge>
                  )}
                </div>
              </div>
              {canRequestReturn() && (
                <div className="mt-4">
                  <Button 
                    onClick={() => setShowReturnModal(true)}
                    variant="outline"
                    className="text-orange-600 border-orange-200 hover:bg-orange-50"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Solicitar Retorno
                  </Button>
                </div>
              )}
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Tracking Timeline */}
              {tracking && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-9">
                      Acompanhamento do Pedido
                    </CardTitle>
                    {tracking.trackingNumber && (
                      <CardDescription>
                        Código de rastreio: <span className="font-mono">{tracking.trackingNumber}</span>
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tracking.events.map((event: any, index: number) => (
                        <div key={event.id} className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-9">{event.description}</p>
                            {event.location && (
                              <p className="text-sm text-gray-6 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {event.location}
                              </p>
                            )}
                            <p className="text-xs text-gray-5 mt-1">
                              {formatDate(event.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {tracking.estimatedDelivery && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-900">
                            Entrega estimada: {formatDate(tracking.estimatedDelivery)}
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-9">
                    Itens do Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                                     <div className="space-y-4">
                     {order.items.map((item: any, index: number) => {
                       const uniqueItemId = getItemUniqueId(item, index);
                       return (
                         <div key={uniqueItemId} className="flex items-center gap-4">
                           <div className="w-16 h-16 bg-gray-1 rounded-lg overflow-hidden flex-shrink-0">
                             <img
                               src={item.product.image}
                               alt={item.product.name}
                               className="w-full h-full object-cover"
                             />
                           </div>
                           <div className="flex-1 min-w-0">
                             <h4 className="font-medium text-gray-9 truncate">{item.product.name}</h4>
                             <p className="text-sm text-gray-6">Qtd: {item.quantity}</p>
                             {order.returnRequest && order.returnRequest.items.includes(uniqueItemId) && (
                               <Badge variant="outline" className="mt-1 text-xs">
                                 Retorno Solicitado
                               </Badge>
                             )}
                           </div>
                           <div className="text-right">
                             <p className="font-medium text-gray-9">{formatCurrency(item.product.price * item.quantity * 100)}</p>
                           </div>
                         </div>
                       );
                     })}
                   </div>
                </CardContent>
              </Card>

              {/* Return Request Information */}
              {order.returnRequest && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-9 flex items-center gap-2">
                      <RotateCcw className="w-5 h-5" />
                      Solicitação de Retorno
                    </CardTitle>
                    <CardDescription>
                      Status: <Badge className={getReturnStatus()?.color}>{getReturnStatus()?.text}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-9 mb-2">Motivo do Retorno:</h4>
                        <p className="text-sm text-gray-6">{getReturnReasonText(order.returnRequest.reason)}</p>
                      </div>
                      {order.returnRequest.description && (
                        <div>
                          <h4 className="font-medium text-gray-9 mb-2">Descrição:</h4>
                          <p className="text-sm text-gray-6">{order.returnRequest.description}</p>
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-gray-9 mb-2">Data da Solicitação:</h4>
                        <p className="text-sm text-gray-6">{formatDate(order.returnRequest.createdAt)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-9">
                    Resumo do Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-6">Subtotal:</span>
                      <span className="text-gray-9">{formatCurrency(order.subtotal * 100)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-6">Frete:</span>
                      <span className="text-gray-9">{formatCurrency(order.shipping * 100)}</span>
                    </div>
                    {order.tax > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-6">Impostos:</span>
                        <span className="text-gray-9">{formatCurrency(order.tax * 100)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-semibold border-t border-gray-2 pt-3">
                      <span className="text-gray-9">Total:</span>
                      <span className="text-primary">{formatCurrency(order.total * 100)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-9">
                    Endereço de Entrega
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-6 space-y-1">
                    <p className="font-medium text-gray-9">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Invoice Actions */}
              {invoice && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-9">
                      Fatura
                    </CardTitle>
                    <CardDescription>
                      Status: <Badge variant="outline" className="ml-1">{invoice.status}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button 
                        onClick={downloadInvoice}
                        variant="outline" 
                        className="w-full"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Baixar Fatura
                      </Button>
                      <Button 
                        onClick={printInvoice}
                        variant="outline" 
                        className="w-full"
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Imprimir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />

      {/* Return Request Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <RotateCcw className="w-5 h-5" />
                Solicitar Retorno
              </h3>
              <button 
                onClick={() => setShowReturnModal(false)} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              <form onSubmit={handleReturnRequest} className="space-y-6">
                {/* Select Items */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Selecione os itens para retorno *
                  </label>
                                     <div className="space-y-3">
                     {order.items.map((item: any, index: number) => {
                       const uniqueItemId = getItemUniqueId(item, index);
                       return (
                         <div key={uniqueItemId} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                           <input
                             type="checkbox"
                             id={`item-${uniqueItemId}`}
                             checked={selectedItems.includes(uniqueItemId)}
                             onChange={() => handleItemSelection(uniqueItemId)}
                             className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                           />
                           <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                             <img
                               src={item.product.image}
                               alt={item.product.name}
                               className="w-full h-full object-cover"
                             />
                           </div>
                           <div className="flex-1">
                             <label htmlFor={`item-${uniqueItemId}`} className="font-medium text-gray-900 cursor-pointer">
                               {item.product.name}
                             </label>
                             <p className="text-sm text-gray-600">Qtd: {item.quantity}</p>
                           </div>
                           <div className="text-right">
                             <p className="font-medium text-gray-900">{formatCurrency(item.product.price * item.quantity * 100)}</p>
                           </div>
                         </div>
                       );
                     })}
                   </div>
                </div>

                {/* Return Reason */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Motivo do Retorno *
                  </label>
                  <Select value={returnReason} onValueChange={setReturnReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="defective">Produto com defeito</SelectItem>
                      <SelectItem value="wrong_item">Item incorreto recebido</SelectItem>
                      <SelectItem value="damaged">Produto danificado</SelectItem>
                      <SelectItem value="not_as_described">Não corresponde à descrição</SelectItem>
                      <SelectItem value="size_issue">Problema com tamanho</SelectItem>
                      <SelectItem value="quality_issue">Problema de qualidade</SelectItem>
                      <SelectItem value="changed_mind">Mudei de ideia</SelectItem>
                      <SelectItem value="other">Outro motivo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição Adicional
                  </label>
                  <Textarea
                    value={returnDescription}
                    onChange={(e) => setReturnDescription(e.target.value)}
                    placeholder="Descreva detalhadamente o problema ou motivo do retorno..."
                    rows={4}
                  />
                </div>

                {/* Return Policy Info */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-900 mb-1">Política de Retorno</h4>
                      <ul className="text-xs text-blue-800 space-y-1">
                        <li>• Retornos devem ser solicitados dentro de 30 dias após a entrega</li>
                        <li>• Produtos devem estar em condições originais e com embalagem intacta</li>
                        <li>• Custos de envio do retorno podem ser cobrados</li>
                        <li>• Reembolso será processado após aprovação e recebimento do item</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
              <Button
                type="button"
                onClick={() => setShowReturnModal(false)}
                variant="outline"
                className="px-4 py-2 text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleReturnRequest}
                disabled={isSubmittingReturn || selectedItems.length === 0 || !returnReason}
                className="px-4 py-2 text-sm font-medium bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingReturn ? 'Enviando...' : 'Solicitar Retorno'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
