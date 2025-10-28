'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Package, Truck, CheckCircle, Clock, MapPin, Calendar, ArrowLeft, Download, Printer, RotateCcw, AlertCircle, X, CreditCard } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useOrder, useOrderTracking } from '@/hooks/useOrders';
import { formatCurrency, formatDate } from '@/lib/payment';
import { generateInvoiceHTML, InvoiceData } from '@/lib/invoice-generator';

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { state } = useMarketplace();
  const orderId = params.orderId as string;
  
  const { data: order, isLoading, error } = useOrder(orderId);
  const { data: tracking, isLoading: trackingLoading } = useOrderTracking(orderId);
  const [invoice, setInvoice] = useState<any>(null);
  
  // Return request state
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [returnDescription, setReturnDescription] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);


  const generateInvoice = (): InvoiceData | null => {
    if (!order) return null;
    
    return {
      id: `inv_${orderId}`,
      orderNumber: order.orderNumber || order._id,
      date: order.createdAt || order.date || new Date().toISOString(),
      status: order.payment?.status || 'pending',
      customer: {
        name: `${order.shippingAddress?.firstName || ''} ${order.shippingAddress?.lastName || ''}`.trim(),
        email: order.shippingAddress?.email || '',
        address: order.shippingAddress?.address || '',
        city: order.shippingAddress?.city || '',
        state: order.shippingAddress?.state || '',
        zipCode: order.shippingAddress?.zipCode || '',
        country: order.shippingAddress?.country || ''
      },
      items: order.items || [],
      subtotal: order.subtotal || order.totalAmount || 0,
      shipping: order.shipping || 0,
      discount: order.discount || 0,
      tax: order.tax || 0,
      total: order.totalAmount || order.total || 0,
      paymentMethod: order.payment?.method || 'N/A',
      notes: order.notes || ''
    };
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
    const invoice = generateInvoice();
    if (!invoice) return;

    const invoiceHTML = generateInvoiceHTML(invoice);

    // Create and download HTML file
    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fatura-${invoice.orderNumber}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const printInvoice = () => {
    const invoice = generateInvoice();
    if (!invoice) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const invoiceHTML = generateInvoiceHTML(invoice);

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    printWindow.print();
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
        orderId: order?._id || order?.id || '',
        items: selectedItems,
        reason: returnReason,
        description: returnDescription,
        status: 'pending',
        createdAt: new Date().toISOString(),
        userId: state.user?.id
      };

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
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
    return `${order?._id || order?.id || ''}-${item.product?.id || item.productId}-${index}`;
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

  if (error || (!isLoading && !order)) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Erro</h1>
          <p className="text-gray-6 mb-8">Pedido não encontrado.</p>
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

        <div className="space-y-6">
          {/* Order Header */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-9">
                    Pedido #{order?.orderNumber || order?._id?.slice(-6)}
                  </CardTitle>
                  <CardDescription className="text-gray-6">
                    Realizado em {formatDate(order?.createdAt || order?.date || '')}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(order?.status || '')}
                  <Badge className={getStatusColor(order?.status || '')}>
                    {getStatusText(order?.status || '')}
                  </Badge>
                  {getReturnStatus() && (
                    <Badge className={getReturnStatus()?.color}>
                      {getReturnStatus()?.text}
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Payment Action for Pending Orders */}
              {order?.payment?.status === 'pending' && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-yellow-800">Pagamento Pendente</h3>
                      <p className="text-sm text-yellow-700">Complete o pagamento para processar seu pedido</p>
                    </div>
                    <Button 
                      onClick={() => router.push(`/pagamento/${orderId}`)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Pagar Agora
                    </Button>
                  </div>
                </div>
              )}
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
              {trackingLoading ? (
                <Card>
                  <CardContent className="py-8">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                      <p className="text-gray-6">Carregando rastreamento...</p>
                    </div>
                  </CardContent>
                </Card>
              ) : tracking ? (
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
                    <CardDescription>
                      Status atual: <Badge className={getStatusColor(tracking.status)}>{getStatusText(tracking.status)}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {(tracking.statusHistory || []).map((event: any, index: number) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-9">{event.description}</p>
                            {event.trackingNumber && (
                              <p className="text-sm text-gray-6 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                Tracking: {event.trackingNumber}
                              </p>
                            )}
                            {event.reason && (
                              <p className="text-sm text-gray-6">
                                Reason: {event.reason}
                              </p>
                            )}
                            <p className="text-xs text-gray-5 mt-1">
                              {formatDate(event.date)}
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
              ) : null}

              {/* Order Notes */}
              {order?.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-9">
                      Notas do Pedido
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-6">{order?.notes}</p>
                  </CardContent>
                </Card>
              )}

              {/* Payment Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-9">
                    Informações de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-6">Método:</span>
                      <span className="font-medium">{order?.payment?.method?.toUpperCase() || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-6">Status:</span>
                      <Badge className={getStatusColor(order?.payment?.status || order?.status || '')}>
                        {getStatusText(order?.payment?.status || order?.status || '')}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-6">Valor:</span>
                      <span className="font-medium">{formatCurrency(order?.payment?.amount || order?.totalAmount || 0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-9">
                    Itens do Pedido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                                     <div className="space-y-4">
                    {(order?.items || []).map((item: any, index: number) => {
                       const uniqueItemId = getItemUniqueId(item, index);
                       return (
                         <div key={uniqueItemId} className="flex items-center gap-4">
                           <div className="w-16 h-16 bg-gray-1 rounded-lg overflow-hidden flex-shrink-0">
                             <img
                              src={item.product?.primaryImage || item.productImage || '/placeholder.jpg'}
                              alt={item.product?.name || item.productName}
                               className="w-full h-full object-cover"
                             />
                           </div>
                           <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-9 truncate">{item.product?.name || item.productName}</h4>
                             <p className="text-sm text-gray-6">Qtd: {item.quantity}</p>
                            {order?.returnRequest && order?.returnRequest.items.includes(uniqueItemId) && (
                               <Badge variant="outline" className="mt-1 text-xs">
                                 Retorno Solicitado
                               </Badge>
                             )}
                           </div>
                           <div className="text-right">
                            <p className="font-medium text-gray-9">{formatCurrency((item.unitPrice || item.product?.price || 0) * item.quantity)}</p>
                           </div>
                         </div>
                       );
                     })}
                   </div>
                </CardContent>
              </Card>

              {/* Return Request Information */}
              {order?.returnRequest && (
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
                        <p className="text-sm text-gray-6">{getReturnReasonText(order?.returnRequest.reason)}</p>
                      </div>
                      {order?.returnRequest.description && (
                        <div>
                          <h4 className="font-medium text-gray-9 mb-2">Descrição:</h4>
                          <p className="text-sm text-gray-6">{order?.returnRequest.description}</p>
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-gray-9 mb-2">Data da Solicitação:</h4>
                        <p className="text-sm text-gray-6">{formatDate(order?.returnRequest.createdAt)}</p>
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
                      <span className="text-gray-9">{formatCurrency(order?.subtotal || order?.totalAmount || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-6">Frete:</span>
                      <span className="text-gray-9">{formatCurrency(order?.shipping || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-6">Desconto:</span>
                      <span className="text-gray-9">{formatCurrency(order?.discount || 0)}</span>
                    </div>
                    {(order?.tax || 0) > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-6">Impostos:</span>
                        <span className="text-gray-9">{formatCurrency(order?.tax || 0)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-semibold border-t border-gray-2 pt-3">
                      <span className="text-gray-9">Total:</span>
                      <span className="text-primary">{formatCurrency(order?.totalAmount || order?.total || 0)}</span>
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
                      {order?.shippingAddress?.firstName} {order?.shippingAddress?.lastName}
                    </p>
                    <p>{order?.shippingAddress?.address}</p>
                    <p>{order?.shippingAddress?.city}, {order?.shippingAddress?.state} {order?.shippingAddress?.zipCode}</p>
                    <p>{order?.shippingAddress?.country}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Invoice Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-9">
                      Fatura
                    </CardTitle>
                    <CardDescription>
                    Status: <Badge variant="outline" className="ml-1">{getStatusText(order?.payment?.status || 'pending')}</Badge>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button 
                        onClick={downloadInvoice}
                        variant="outline" 
                        className="w-full"
                      disabled={!order?.payment?.status}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Baixar Fatura
                      </Button>
                      <Button 
                        onClick={printInvoice}
                        variant="outline" 
                        className="w-full"
                      disabled={!order?.payment?.status}
                      >
                        <Printer className="w-4 h-4 mr-2" />
                        Imprimir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
                    {(order?.items || []).map((item: any, index: number) => {
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
                               src={item.product?.primaryImage || item.productImage || '/placeholder.jpg'}
                               alt={item.product?.name || item.productName}
                               className="w-full h-full object-cover"
                             />
                           </div>
                           <div className="flex-1">
                             <label htmlFor={`item-${uniqueItemId}`} className="font-medium text-gray-900 cursor-pointer">
                               {item.product?.name || item.productName}
                             </label>
                             <p className="text-sm text-gray-600">Qtd: {item.quantity}</p>
                           </div>
                           <div className="text-right">
                             <p className="font-medium text-gray-900">{formatCurrency((item.unitPrice || item.product?.price || 0) * item.quantity)}</p>
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
