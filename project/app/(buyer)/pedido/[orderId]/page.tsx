'use client';

import React, { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Package, Truck, CheckCircle, Clock, MapPin, Calendar, ArrowLeft, Download, Printer, RotateCcw, AlertCircle, X, CreditCard, Upload } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useCancelOrder, useOrder, useOrderTracking } from '@/hooks/useOrders';
import { useCreateRefundRequest } from '@/hooks/useRefunds';
import { formatCurrency, formatDate } from '@/lib/payment';
import { generateInvoiceHTML, InvoiceData } from '@/lib/invoice-generator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { RefundableItemsList } from '@/components/refund/RefundableItemsList';
import { RefundRequestsList } from '@/components/refund/RefundRequestsList';
import type { OrderItem, Refund } from '@/types/api';

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  
  const { data: order, isLoading, error } = useOrder(orderId);
  const { data: tracking, isLoading: trackingLoading } = useOrderTracking(orderId);
  const createRefundRequest = useCreateRefundRequest();
  const [invoice, setInvoice] = useState<any>(null);
  const cancelOrderMutation = useCancelOrder();

  // Refund request state
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<OrderItem | null>(null);
  const [refundReason, setRefundReason] = useState('');
  const [refundDescription, setRefundDescription] = useState('');
  const [refundImages, setRefundImages] = useState<File[]>([]);
  const [refundImagePreviews, setRefundImagePreviews] = useState<string[]>([]);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);


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
      case 'cancelled':
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

  // Generate unique item ID for order items
  const getItemUniqueId = (item: OrderItem, index: number) => {
    const rawItem = item as OrderItem & { id?: string; product?: { id?: string } };
    const productIdentifier =
      item.product?._id ||
      (typeof item.productId === 'object'
        ? item.productId._id
        : (rawItem as any)?.productId) ||
      (rawItem.product as any)?.id ||
      '';

    return (
      item?._id ||
      rawItem?.id ||
      `${order?._id || order?.id || ''}-${productIdentifier}-${index}`
    );
  };

  // Refunds associated with this order (from API response)
  const orderRefunds: Refund[] = (order?.refunds as Refund[] | undefined) ?? [];
  const orderItems: OrderItem[] = (order?.items as OrderItem[] | undefined) ?? [];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024 // 5MB limit
    );

    if (refundImages.length + validFiles.length > 5) {
      alert('Máximo de 5 imagens permitidas.');
      return;
    }

    setRefundImages(prev => [...prev, ...validFiles]);
    
    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setRefundImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setRefundImages(prev => prev.filter((_, i) => i !== index));
    setRefundImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const convertImagesToBase64 = async (files: File[]): Promise<string[]> => {
    return Promise.all(
      files.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
        });
      })
    );
  };

  const handleRefundRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem || !refundReason || !refundDescription) return;

    const productId =
      selectedItem.productId?._id ||
      selectedItem.productId ||
      selectedItem.product?._id ||
      (selectedItem.product as any)?.id;
    const orderItemId = selectedItem._id || (selectedItem as any)?.id;

    if (!productId) {
      alert('Não foi possível identificar o produto para o reembolso.');
      return;
    }
    
    // Convert images to base64 URLs
    const imageUrls = refundImages.length > 0 
      ? await convertImagesToBase64(refundImages)
      : [];
    
    createRefundRequest.mutate(
      {
        orderId: order?._id || order?.id || orderId,
        productId: productId || '',
        reason: refundReason,
        description: refundDescription,
        images: imageUrls,
        orderItemId,
      },
      {
        onSuccess: () => {
          setShowRefundModal(false);
          setSelectedItem(null);
          setRefundReason('');
          setRefundDescription('');
          setRefundImages([]);
          setRefundImagePreviews([]);
        },
      }
    );
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

  const canCancelOrder =
    order &&
    ['pending', 'confirmed', 'processing'].includes(order.status) &&
    !cancelOrderMutation.isPending;

  const handleCancelOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!order || cancelReason.trim().length < 10) return;

    await cancelOrderMutation.mutateAsync({
      orderId: order._id || (order as any).id || orderId,
      reason: cancelReason.trim(),
    });

    setShowCancelModal(false);
    setCancelReason('');
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
                <div className="flex items-center gap-2 flex-wrap">
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
                  {canCancelOrder && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-0 sm:ml-4 mt-2 sm:mt-0"
                      onClick={() => setShowCancelModal(true)}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancelar Pedido
                    </Button>
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
                    {order?.payment?.transactionId && (
                      <div className="flex justify-between">
                        <span className="text-gray-6">Transação:</span>
                        <span className="font-medium">{order.payment.transactionId}</span>
                      </div>
                    )}
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
                  <RefundableItemsList
                    order={order!}
                    items={orderItems}
                    refunds={orderRefunds}
                    onRequest={(item) => {
                      setSelectedItem(item);
                      setShowRefundModal(true);
                    }}
                    statusPlacement="details"
                    buttonProps={{ size: 'sm' }}
                    renderItemExtras={(item, _refund, index) => {
                      if (
                        order?.returnRequest &&
                        order.returnRequest.items.includes(getItemUniqueId(item, index))
                      ) {
                        return (
                          <Badge variant="outline" className="text-xs">
                            Retorno Solicitado
                          </Badge>
                        );
                      }
                      return null;
                    }}
                  />
                </CardContent>
              </Card>

              {/* Refund Requests Information */}
              {orderRefunds.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-gray-9 flex items-center gap-2">
                      <RotateCcw className="w-5 h-5" />
                      Solicitações de Reembolso
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RefundRequestsList refunds={orderRefunds} />
                  </CardContent>
                </Card>
              )}

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

      {/* Refund Request Modal */}
      <Dialog open={showRefundModal} onOpenChange={setShowRefundModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Solicitar Reembolso</DialogTitle>
            <DialogDescription>
              Preencha os detalhes abaixo para solicitar o reembolso
            </DialogDescription>
          </DialogHeader>
          
          {/* Product Information */}
          {selectedItem && (
            <div className="p-4 bg-gray-1 rounded-lg border border-gray-2 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gray-1 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={selectedItem.product?.primaryImage || selectedItem.productImage || '/placeholder.jpg'}
                    alt={selectedItem.product?.name || selectedItem.productName}
                               className="w-full h-full object-cover"
                             />
                           </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-9 truncate">
                    {selectedItem.product?.name || selectedItem.productName}
                  </h4>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-6">
                    <span>Quantidade: <strong className="text-gray-9">{selectedItem.quantity}</strong></span>
                    <span>Preço unitário: <strong className="text-gray-9">{formatCurrency(selectedItem.unitPrice || selectedItem.product?.price || 0)}</strong></span>
                  </div>
                           </div>
                           <div className="text-right">
                  <p className="text-sm text-gray-6">Total</p>
                  <p className="text-lg font-semibold text-primary">
                    {formatCurrency((selectedItem.unitPrice || selectedItem.product?.price || 0) * selectedItem.quantity)}
                  </p>
                           </div>
                         </div>
                   </div>
          )}

          <form onSubmit={handleRefundRequest} className="space-y-4">
                <div>
              <label className="block text-sm font-medium text-gray-7 mb-2">
                Motivo do Reembolso *
                  </label>
              <select
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="w-full px-3 py-2 border border-gray-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Selecione um motivo</option>
                <option value="Solicitado pelo cliente">Solicitado pelo cliente</option>
                <option value="Transação fraudulenta">Transação fraudulenta</option>
                <option value="Produto defeituoso">Produto defeituoso</option>
                <option value="Produto não recebido">Produto não recebido</option>
                <option value="Produto incorreto">Produto incorreto</option>
                <option value="Outro">Outro</option>
              </select>
                </div>
                <div>
              <label className="block text-sm font-medium text-gray-7 mb-2">
                Descrição Detalhada *
                  </label>
                  <Textarea
                value={refundDescription}
                onChange={(e) => setRefundDescription(e.target.value)}
                placeholder="Descreva detalhadamente o motivo do reembolso..."
                    rows={4}
                minLength={10}
                maxLength={1000}
                required
              />
              <p className="text-xs text-gray-5 mt-1">
                {refundDescription.length}/1000 caracteres (mínimo 10)
              </p>
            </div>
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-7 mb-2">
                Imagens de Suporte (Opcional)
              </label>
              <div className="space-y-3">
                <div className="border-2 border-dashed border-gray-3 rounded-lg p-4 text-center">
                  <Upload className="w-8 h-8 text-gray-4 mx-auto mb-2" />
                  <p className="text-sm text-gray-6 mb-2">
                    Arraste e solte imagens aqui ou clique para selecionar
                  </p>
                  <p className="text-xs text-gray-5 mb-2">
                    Máximo 5 imagens, 5MB cada
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="refund-image-upload"
                  />
                  <label htmlFor="refund-image-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" size="sm" className="mt-2">
                      Selecionar Imagens
                    </Button>
                  </label>
                </div>

                {/* Image Preview */}
                {refundImagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {refundImagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-1 rounded-lg overflow-hidden">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowRefundModal(false);
                  setSelectedItem(null);
                  setRefundReason('');
                  setRefundDescription('');
                  setRefundImages([]);
                  setRefundImagePreviews([]);
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createRefundRequest.isPending || !refundReason || refundDescription.length < 10}
                className="bg-primary hover:bg-primary-hard text-white"
              >
                {createRefundRequest.isPending ? 'Enviando...' : 'Solicitar Reembolso'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Cancel Order Modal */}
      <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Cancelar Pedido</DialogTitle>
            <DialogDescription>
              Informe o motivo do cancelamento. Seu pedido só poderá ser cancelado enquanto estiver
              em status de <strong>pendente</strong>, <strong>confirmado</strong> ou{' '}
              <strong>em processamento</strong>.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCancelOrder} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-7 mb-2">
                Motivo do cancelamento *
              </label>
              <Textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Explique por que deseja cancelar o pedido (mínimo 10 caracteres)..."
                rows={4}
                minLength={10}
                maxLength={500}
                required
              />
              <p className="text-xs text-gray-5 mt-1">
                {cancelReason.length}/500 caracteres (mínimo 10)
              </p>
            </div>
            {order && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md text-xs text-yellow-900 flex gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p>
                    Após o cancelamento, o status do pedido será atualizado e, se aplicável, o
                    reembolso será processado de acordo com a política da plataforma e do vendedor.
                  </p>
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                }}
              >
                Voltar
              </Button>
              <Button
                type="submit"
                variant="destructive"
                disabled={cancelReason.trim().length < 10 || cancelReason.trim().length > 500 || cancelOrderMutation.isPending}
              >
                {cancelOrderMutation.isPending ? 'Cancelando...' : 'Confirmar Cancelamento'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
