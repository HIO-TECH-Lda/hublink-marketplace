'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ShoppingCart, 
  Edit, 
  ArrowLeft, 
  Package,
  Calendar,
  User,
  MapPin,
  CreditCard,
  Activity,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminOrder, useUpdateOrderStatus } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const orderId = params.id as string;
  
  const { data: order, isLoading } = useAdminOrder(orderId);
  const updateStatus = useUpdateOrderStatus();

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-blue-100 text-blue-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      processing: 'Processando',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado',
      refunded: 'Reembolsado'
    };
    return statusMap[status] || status;
  };

  const getPaymentStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Pendente',
      processing: 'Processando',
      completed: 'Pago',
      failed: 'Falhou',
      refunded: 'Reembolsado'
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleString('pt-MZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(amount);
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStatus.mutateAsync({
        orderId,
        status: newStatus
      });
      toast({
        title: 'Status atualizado',
        description: 'O status do pedido foi atualizado com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Falha ao atualizar status',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando detalhes do pedido...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <ShoppingCart className="w-12 h-12 text-gray-4 mx-auto mb-4" />
            <p className="text-gray-6">Pedido não encontrado</p>
            <Button onClick={() => router.push('/admin/pedidos')} className="mt-4">
              Voltar para Lista
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const orderData = order as any;
  const items = orderData.items || [];
  const summary = orderData.summary || {
    itemCount: items.length,
    subtotal: orderData.subtotal || orderData.total,
    tax: orderData.tax || 0,
    shipping: orderData.shipping || 0,
    discount: orderData.discount || 0,
    total: orderData.total
  };
  const timeline = orderData.timeline || [];

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Detalhes do Pedido</h1>
            <p className="text-gray-6">Pedido #{orderData.orderNumber || orderId}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={() => router.push('/admin/pedidos')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button onClick={() => router.push(`/admin/pedidos/${orderId}/editar`)}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Status do Pedido
                </CardTitle>
                <Select
                  value={orderData.status}
                  onValueChange={handleStatusChange}
                  disabled={updateStatus.isPending}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="confirmed">Confirmado</SelectItem>
                    <SelectItem value="processing">Processando</SelectItem>
                    <SelectItem value="shipped">Enviado</SelectItem>
                    <SelectItem value="delivered">Entregue</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                    <SelectItem value="refunded">Reembolsado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge className={getStatusColor(orderData.status)}>
                  {getStatusText(orderData.status)}
                </Badge>
                <p className="text-sm text-gray-6">
                  Última atualização: {formatDate(orderData.updatedAt)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Itens do Pedido ({summary.itemCount})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {items.length === 0 ? (
                  <p className="text-gray-6 text-center py-4">Nenhum item encontrado</p>
                ) : (
                  items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between border-b border-gray-2 pb-4 last:border-0">
                      <div className="flex items-center gap-4">
                        {item.productImage && (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-gray-9">{item.productName}</p>
                          {item.sellerName && (
                            <p className="text-sm text-gray-6">{item.sellerName}</p>
                          )}
                          <p className="text-sm text-gray-5">
                            {item.quantity} x {formatCurrency(item.unitPrice || 0)}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-9">
                        {formatCurrency(item.totalPrice || item.unitPrice * item.quantity)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address */}
          {orderData.shippingAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-gray-7 space-y-1">
                  <p>
                    {orderData.shippingAddress.firstName} {orderData.shippingAddress.lastName}
                  </p>
                  <p>{orderData.shippingAddress.address}</p>
                  <p>
                    {orderData.shippingAddress.city}, {orderData.shippingAddress.state} - {orderData.shippingAddress.zipCode}
                  </p>
                  <p>{orderData.shippingAddress.country}</p>
                  {orderData.shippingAddress.phone && (
                    <p className="mt-2">{orderData.shippingAddress.phone}</p>
                  )}
                  {orderData.shippingAddress.email && (
                    <p>{orderData.shippingAddress.email}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {orderData.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-7">{orderData.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Client Card */}
          {orderData.client && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium text-gray-9">{orderData.client.name}</p>
                  <p className="text-sm text-gray-6">{orderData.client.email}</p>
                  {orderData.client.phone && (
                    <p className="text-sm text-gray-6">{orderData.client.phone}</p>
                  )}
                  {orderData.client.id && (
                    <Button
                      onClick={() => router.push(`/admin/usuarios/${orderData.client.id}`)}
                      variant="outline"
                      className="w-full mt-4"
                      size="sm"
                    >
                      Ver Perfil
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Payment Card */}
          {orderData.payment && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-6">Método</p>
                    <p className="font-medium text-gray-9">
                      {orderData.payment.methodLabel || orderData.payment.method}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-6">Status</p>
                    <Badge className={getPaymentStatusColor(orderData.payment.status)}>
                      {orderData.payment.statusLabel || getPaymentStatusText(orderData.payment.status)}
                    </Badge>
                  </div>
                  {orderData.payment.transactionId && (
                    <div>
                      <p className="text-sm text-gray-6">ID da Transação</p>
                      <p className="text-xs font-mono text-gray-7">{orderData.payment.transactionId}</p>
                    </div>
                  )}
                  {orderData.payment.paidAt && (
                    <div>
                      <p className="text-sm text-gray-6">Pago em</p>
                      <p className="text-sm text-gray-7">{formatDate(orderData.payment.paidAt)}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-6">Subtotal:</span>
                  <span className="font-medium">{formatCurrency(summary.subtotal)}</span>
                </div>
                {summary.tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-6">Imposto:</span>
                    <span className="font-medium">{formatCurrency(summary.tax)}</span>
                  </div>
                )}
                {summary.shipping > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-6">Envio:</span>
                    <span className="font-medium">{formatCurrency(summary.shipping)}</span>
                  </div>
                )}
                {summary.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-6">Desconto:</span>
                    <span className="font-medium text-red-600">-{formatCurrency(summary.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-2">
                  <span className="text-gray-9 font-medium">Total:</span>
                  <span className="font-bold text-lg text-gray-9">{formatCurrency(summary.total)}</span>
                </div>
                {orderData.currency && orderData.currency !== 'MZN' && (
                  <p className="text-xs text-gray-5 text-right">{orderData.currency}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          {timeline.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {timeline.map((event: any, index: number) => (
                    <div key={index} className="flex items-start gap-3">
                      <div
                        className={`w-3 h-3 rounded-full mt-1.5 ${
                          event.color === 'green'
                            ? 'bg-green-500'
                            : event.color === 'blue'
                            ? 'bg-blue-500'
                            : event.color === 'red'
                            ? 'bg-red-500'
                            : 'bg-gray-500'
                        }`}
                      ></div>
                      <div>
                        <p className="font-medium text-sm text-gray-9">{event.label}</p>
                        <p className="text-xs text-gray-6">{formatDate(event.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-6">Criado em:</span>
                  <span className="text-gray-7">{formatDate(orderData.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Atualizado em:</span>
                  <span className="text-gray-7">{formatDate(orderData.updatedAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
