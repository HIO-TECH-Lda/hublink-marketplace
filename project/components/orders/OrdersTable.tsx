import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, DollarSign, Eye, Package } from 'lucide-react';
import type { Order } from '@/types/api';
import { formatCurrency } from '@/lib/payment';
import { Button } from '@/components/ui/button';

interface OrdersTableProps {
  orders: Order[];
  isLoading?: boolean;
  emptyMessage?: React.ReactNode;
  limit?: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'text-green-600 bg-green-50';
    case 'shipped':
      return 'text-blue-600 bg-blue-50';
    case 'processing':
      return 'text-yellow-600 bg-yellow-50';
    case 'canceled':
      return 'text-red-600 bg-red-50';
    case 'pending':
      return 'text-orange-600 bg-orange-50';
    case 'confirmed':
      return 'text-purple-600 bg-purple-50';
    case 'refunded':
      return 'text-teal-600 bg-teal-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'processing':
    case 'pending':
      return <Clock className="w-4 h-4" />;
    default:
      return <Package className="w-4 h-4" />;
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

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  isLoading,
  emptyMessage,
  limit,
}) => {
  if (isLoading) {
    return (
      <div className="px-6 py-12 text-center">
        <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
        <p className="text-gray-600">Carregando pedidos...</p>
      </div>
    );
  }

  const displayOrders = limit ? orders.slice(0, limit) : orders;

  if (!displayOrders.length) {
    return (
      <div className="px-6 py-12 text-center text-gray-600">
        {emptyMessage ?? 'Você ainda não realizou nenhum pedido.'}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Pedido
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Data
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Itens
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
              Acções
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {displayOrders.map((order) => (
            <tr key={order._id || order.id} className="hover:bg-gray-50">
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                #{order.orderNumber || order._id?.slice(-6)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {new Date(order.createdAt || order.date || '').toLocaleDateString('pt-BR')}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(
                    order.status,
                  )}`}
                >
                  {getStatusIcon(order.status)}
                  <span>{getStatusText(order.status)}</span>
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {formatCurrency(order.totalAmount || order.total || 0)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {order.items?.length ?? 0}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                <div className="flex items-center justify-end gap-2 flex-nowrap">
                  <Button asChild size="sm" variant="default" className="text-primary-foreground">
                    <Link href={`/pedido/${order._id || order.id}`} className="inline-flex items-center gap-1.5">
                      <Eye className="h-4 w-4" />
                      Ver Detalhes
                    </Link>
                  </Button>
                  {order.status === 'pending' && (
                    <Button asChild size="sm" variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50 hover:text-blue-700">
                      <Link href={`/pagamento/${order._id || order.id}`} className="inline-flex items-center gap-1.5">
                        <DollarSign className="h-4 w-4" />
                        Pagar Agora
                      </Link>
                    </Button>
                  )}
                  {(order.status === 'delivered' || order.status === 'shipped') && (
                    <Button asChild size="sm" variant="outline" className="border-amber-500 text-amber-700 hover:bg-amber-50 hover:text-amber-800">
                      <Link href={`/reembolso/${order._id || order.id}`} className="inline-flex items-center gap-1.5">
                        <ArrowLeft className="h-4 w-4" />
                        Solicitar Reembolso
                      </Link>
                    </Button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

OrdersTable.displayName = 'OrdersTable';

