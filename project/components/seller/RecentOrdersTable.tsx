'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, User, Calendar, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Order } from '@/types/api';

interface RecentOrdersTableProps {
  orders: Order[];
  isLoading?: boolean;
  limit?: number;
  showDetails?: boolean;
}

export default function RecentOrdersTable({
  orders,
  isLoading = false,
  limit,
  showDetails = true,
}: RecentOrdersTableProps) {
  const displayOrders = limit ? orders.slice(0, limit) : orders;
  const [selectedOrder, setSelectedOrder] = React.useState<any | null>(null);

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

  const getSellerItemsFromOrder = (order: any) => {
    return order.items || [];
  };

  const getSellerTotalFromOrder = (order: any) => {
    const sellerItems = order.items || [];
    return sellerItems.reduce((total: number, item: any) => total + (item.totalPrice ?? (Number(item.unitPrice) * Number(item.quantity))), 0);
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-6">Carregando pedidos...</p>
      </div>
    );
  }

  if (displayOrders.length === 0) {
    return (
      <div className="py-12 text-center">
        <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-6">Nenhum pedido encontrado</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Pedido
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Cliente
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Data
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Meus Itens
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Meu Valor
            </th>
            {showDetails && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {displayOrders.map((order: any) => {
            const sellerItems = getSellerItemsFromOrder(order);
            const sellerTotal = getSellerTotalFromOrder(order);
            
            return (
              <tr key={order._id || order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {order.orderNumber || `#${(order._id || order.id)?.slice(-6)}`}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-900">
                      {order.userId?.fullName || `${order.billingAddress?.firstName || ''} ${order.billingAddress?.lastName || ''}`}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-900">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {new Date(order.createdAt || order.date).toLocaleDateString('pt-MZ')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {sellerItems.length} {sellerItems.length === 1 ? 'item' : 'itens'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  MTn {Number(sellerTotal).toFixed(2)}
                </td>
                {showDetails && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Dialog>
                      <DialogTrigger asChild>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center text-green-600 hover:text-green-900"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver Detalhes
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Pedido {order.orderNumber || `#${order._id || order.id}`}</DialogTitle>
                          <DialogDescription>Resumo do pedido para este vendedor</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-6">Cliente</p>
                              <p className="font-medium text-gray-9">{order.userId?.fullName}</p>
                            </div>
                            <div>
                              <p className="text-gray-6">Data</p>
                              <p className="font-medium text-gray-9">{new Date(order.createdAt || order.date).toLocaleString('pt-MZ')}</p>
                            </div>
                            <div>
                              <p className="text-gray-6">Status</p>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                              </span>
                            </div>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                              <thead>
                                <tr className="border-b border-gray-2">
                                  <th className="text-left py-2 px-2">Produto</th>
                                  <th className="text-left py-2 px-2">Qtd</th>
                                  <th className="text-left py-2 px-2">Preço</th>
                                  <th className="text-left py-2 px-2">Total</th>
                                </tr>
                              </thead>
                              <tbody>
                                {sellerItems.map((it: any) => (
                                  <tr key={it._id} className="border-b border-gray-1">
                                    <td className="py-2 px-2">{it.productName}</td>
                                    <td className="py-2 px-2">{it.quantity}</td>
                                    <td className="py-2 px-2">MTn {Number(it.unitPrice).toFixed(2)}</td>
                                    <td className="py-2 px-2 font-medium">MTn {Number(it.totalPrice ?? it.unitPrice * it.quantity).toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div>
                              <p className="text-gray-6">Pagamento</p>
                              <p className="font-medium text-gray-9">{order.payment?.method?.toUpperCase()} • {getStatusText(order.payment?.status)}</p>
                            </div>
                            <div>
                              <p className="text-gray-6">Subtotal</p>
                              <p className="font-medium text-gray-9">MTn {Number(order.subtotal).toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-gray-6">Total</p>
                              <p className="font-semibold text-gray-9">MTn {Number(order.total).toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

