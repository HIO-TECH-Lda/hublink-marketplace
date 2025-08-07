'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ShoppingCart, 
  User, 
  Package, 
  MapPin, 
  CreditCard,
  Truck,
  Calendar,
  ArrowLeft,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Star
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMarketplace } from '@/contexts/MarketplaceContext';

interface OrderItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
  };
  quantity: number;
  total: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  shippingAddress: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { state } = useMarketplace();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [params.id]);

  const loadOrder = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock order data
    const mockOrder: Order = {
      id: params.id as string,
      orderNumber: 'ORD123456',
      customer: {
        id: '1',
        firstName: 'João',
        lastName: 'Silva',
        email: 'joao.silva@email.com',
        phone: '(258) 84-123-4567'
      },
      items: [
        {
          id: '1',
          product: {
            id: '1',
            name: 'Maçãs Orgânicas',
            price: 150.00,
            image: '/images/apples.jpg'
          },
          quantity: 2,
          total: 300.00
        },
        {
          id: '2',
          product: {
            id: '2',
            name: 'Tomates Orgânicos',
            price: 125.00,
            image: '/images/tomates.jpg'
          },
          quantity: 1,
          total: 125.00
        }
      ],
      status: 'pending',
      total: 425.00,
      shippingAddress: {
        street: 'Avenida 25 de Setembro',
        number: '123',
        complement: 'Apto 45',
        neighborhood: 'Baixa',
        city: 'Maputo',
        state: 'Maputo',
        zipCode: '1100'
      },
      paymentMethod: 'Cartão de Crédito',
      paymentStatus: 'paid',
      createdAt: '2024-01-20T10:30:00Z',
      updatedAt: '2024-01-20T10:30:00Z'
    };

    setOrder(mockOrder);
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'shipped': return 'text-blue-600 bg-blue-100';
      case 'processing': return 'text-yellow-600 bg-yellow-100';
      case 'pending': return 'text-orange-600 bg-orange-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Entregue';
      case 'shipped': return 'Enviado';
      case 'processing': return 'Processando';
      case 'pending': return 'Pendente';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago';
      case 'pending': return 'Pendente';
      case 'failed': return 'Falhou';
      default: return status;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-MZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleUpdateStatus = (newStatus: string) => {
    if (order) {
      setOrder({
        ...order,
        status: newStatus as Order['status'],
        updatedAt: new Date().toISOString()
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando pedido...</p>
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
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Detalhes do Pedido</h1>
            <p className="text-gray-6">Pedido #{order.orderNumber}</p>
          </div>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Status do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Badge className={`${getStatusColor(order.status)} text-sm`}>
                    {getStatusText(order.status)}
                  </Badge>
                  <p className="text-sm text-gray-6 mt-2">
                    Última atualização: {formatDate(order.updatedAt)}
                  </p>
                </div>
                <Select value={order.status} onValueChange={handleUpdateStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="processing">Processando</SelectItem>
                    <SelectItem value="shipped">Enviado</SelectItem>
                    <SelectItem value="delivered">Entregue</SelectItem>
                    <SelectItem value="cancelled">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Itens do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4 flex items-center justify-center">
                        <Package className="w-8 h-8 text-gray-4" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-9">{item.product.name}</p>
                        <p className="text-sm text-gray-6">
                          Quantidade: {item.quantity} x {formatCurrency(item.product.price)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-9">{formatCurrency(item.total)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Endereço de Entrega
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-gray-9">
                  {order.shippingAddress.street}, {order.shippingAddress.number}
                  {order.shippingAddress.complement && `, ${order.shippingAddress.complement}`}
                </p>
                <p className="text-gray-6">{order.shippingAddress.neighborhood}</p>
                <p className="text-gray-6">
                  {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Cliente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="font-medium text-gray-9">
                    {order.customer.firstName} {order.customer.lastName}
                  </p>
                  <p className="text-sm text-gray-6">{order.customer.email}</p>
                  <p className="text-sm text-gray-6">{order.customer.phone}</p>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <User className="w-4 h-4 mr-2" />
                  Ver Perfil
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-6">Método:</span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Status:</span>
                  <Badge className={getPaymentStatusColor(order.paymentStatus)}>
                    {getPaymentStatusText(order.paymentStatus)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Total:</span>
                  <span className="font-bold text-lg">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="text-sm font-medium">Pedido Criado</p>
                    <p className="text-xs text-gray-6">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                {order.status !== 'pending' && (
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium">Processando</p>
                      <p className="text-xs text-gray-6">{formatDate(order.updatedAt)}</p>
                    </div>
                  </div>
                )}
                {order.status === 'delivered' && (
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium">Entregue</p>
                      <p className="text-xs text-gray-6">{formatDate(order.updatedAt)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
} 