'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Package, Truck, CheckCircle, Clock, MapPin, Calendar, ArrowLeft, Download, Printer } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
                </div>
              </div>
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
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-1 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-9 truncate">{item.name}</h4>
                          <p className="text-sm text-gray-6">Qtd: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-9">{formatCurrency(item.price * item.quantity * 100)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
    </div>
  );
} 