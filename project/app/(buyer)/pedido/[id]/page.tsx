'use client';

import { useMarketplace } from '@/contexts/MarketplaceContext';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, User, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function OrderDetailsPage() {
  const { state } = useMarketplace();
  const { orders, products, user } = state;
  const params = useParams();
  const orderId = params.id as string;

  // Find the specific order
  const order = orders.find((order: any) => order.id === orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Pedido não encontrado</h1>
          <p className="text-gray-600 mb-6">O pedido que você está procurando não existe.</p>
          <Link 
            href="/historico-pedidos" 
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Histórico
          </Link>
        </div>
      </div>
    );
  }

  const getStatusStep = (status: string) => {
    switch (status) {
      case 'delivered':
        return 4;
      case 'shipped':
        return 3;
      case 'processing':
        return 2;
      case 'pending':
        return 1;
      default:
        return 1;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'Entregue';
      case 'shipped':
        return 'Em Trânsito';
      case 'processing':
        return 'Processando';
      case 'pending':
        return 'Pendente';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'shipped':
        return 'text-blue-600 bg-blue-50';
      case 'processing':
        return 'text-yellow-600 bg-yellow-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (step: number, currentStep: number) => {
    if (step < currentStep) {
      return <CheckCircle className="w-6 h-6 text-green-600" />;
    } else if (step === currentStep) {
      return <Clock className="w-6 h-6 text-blue-600" />;
    } else {
      return <Clock className="w-6 h-6 text-gray-300" />;
    }
  };

  const currentStep = getStatusStep(order.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/historico-pedidos" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Histórico
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Pedido #{order.id}</h1>
              <p className="text-gray-600 mt-2">
                Realizado em {new Date(order.date).toLocaleDateString('pt-BR')} • {order.items.length} {order.items.length === 1 ? 'item' : 'itens'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">R$ {order.total.toFixed(2)}</p>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Status do Pedido</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {getStatusIcon(1, currentStep)}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900">Pedido Recebido</p>
                    <p className="text-sm text-gray-500">Seu pedido foi recebido e está sendo processado</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {getStatusIcon(2, currentStep)}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900">Em Processamento</p>
                    <p className="text-sm text-gray-500">Estamos preparando seu pedido para envio</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {getStatusIcon(3, currentStep)}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900">Em Trânsito</p>
                    <p className="text-sm text-gray-500">Seu pedido está a caminho</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    {getStatusIcon(4, currentStep)}
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900">Entregue</p>
                    <p className="text-sm text-gray-500">Seu pedido foi entregue com sucesso</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Itens do Pedido</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {order.items.map((item: any) => {
                  const product = products.find((p: any) => p.id === item.product.id);
                  return (
                    <div key={item.product.id} className="px-6 py-4">
                      <div className="flex items-center">
                        <img 
                          src={product?.images?.[0] || product?.image || 'https://placehold.co/80x80/cccccc/000000?text=Produto'} 
                          alt={product?.name} 
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="ml-4 flex-1">
                          <h3 className="text-sm font-medium text-gray-900">{product?.name}</h3>
                          <p className="text-sm text-gray-500">Vendedor: {product?.sellerName}</p>
                          <p className="text-sm text-gray-500">Quantidade: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">R$ {item.product.price.toFixed(2)}</p>
                          <p className="text-sm text-gray-500">R$ {(item.product.price * item.quantity).toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo do Pedido</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">R$ {order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete</span>
                  <span className="text-gray-900">Grátis</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-gray-900">R$ {order.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Endereço de Entrega</h2>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-900">{order.shippingAddress.street}</p>
                      <p className="text-sm text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <User className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-900">{order.shippingAddress.firstName} {order.shippingAddress.lastName}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-sm text-gray-900">{order.shippingAddress.phone}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Método de Pagamento</h2>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-green-600 font-semibold text-sm">$</span>
                </div>
                <span className="text-sm text-gray-900">{order.paymentMethod}</span>
              </div>
            </div>

            {/* Order Notes */}
            {order.orderNotes && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Notas do Pedido</h2>
                <p className="text-sm text-gray-600">{order.orderNotes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 