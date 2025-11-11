import type { Order, OrderItem, Refund } from '@/types/api';

export const REFUND_STATUS_LABELS: Record<Refund['status'], string> = {
  pending: 'Pendente',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
};

export const REFUND_STATUS_COLORS: Record<Refund['status'], string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export const REFUND_STATUS_MESSAGES: Record<Refund['status'], string> = {
  pending: 'Solicitação de reembolso enviada · aguardando análise',
  approved: 'Reembolso aprovado',
  rejected: 'Solicitação rejeitada',
};

const getItemIdentifiers = (item: OrderItem) => {
  const rawItem = item as OrderItem & { id?: string };

  return {
    itemId: item?._id || rawItem?.id || undefined,
    productId:
      item?.productId?._id ||
      (item?.productId as unknown as string) ||
      item?.product?._id ||
      (item?.product as unknown as { id?: string })?.id ||
      undefined,
  };
};

export const findRefundForItem = (refunds: Refund[], item: OrderItem): Refund | undefined => {
  if (!refunds.length) return undefined;

  const { itemId, productId } = getItemIdentifiers(item);

  return refunds.find((refund) => {
    const refundOrderItemId =
      typeof refund.orderItemId === 'object' ? refund.orderItemId._id : refund.orderItemId;
    const refundProductId =
      typeof refund.productId === 'object' ? refund.productId._id : refund.productId;

    return (
      (!!refundOrderItemId && !!itemId && refundOrderItemId === itemId) ||
      (!!productId && refundProductId === productId)
    );
  });
};

export const canRequestRefundForItem = (
  order: Order | undefined,
  item: OrderItem,
  refunds: Refund[],
) => {
  if (!order || order.canRefund === false) return false;

  const existingRefund = findRefundForItem(refunds, item);
  const orderEligible = order.status === 'delivered' || order.status === 'confirmed';
  const paymentStatus = (order.payment?.status ?? order.paymentStatus) as string | undefined;
  const paymentEligible =
    !order.payment || paymentStatus === 'paid' || paymentStatus === 'completed';

  return (
    orderEligible &&
    paymentEligible &&
    (!existingRefund || existingRefund.status === 'rejected')
  );
};

export const hasRefundableOrderItems = (
  order: Order | undefined,
  items: OrderItem[],
  refunds: Refund[],
) => {
  if (!order || order.canRefund === false) return false;
  return items.some((item) => canRequestRefundForItem(order, item, refunds));
};

