import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/payment';
import {
  REFUND_STATUS_COLORS,
  REFUND_STATUS_LABELS,
  REFUND_STATUS_MESSAGES,
  canRequestRefundForItem,
  findRefundForItem,
} from '@/lib/refund-utils';
import type { Order, OrderItem, Refund } from '@/types/api';
import { cn } from '@/lib/utils';

type StatusPlacement = 'details' | 'actions';

interface RefundableItemsListProps {
  order: Order;
  items: OrderItem[];
  refunds: Refund[];
  onRequest: (item: OrderItem) => void;
  requestLabel?: string;
  buttonProps?: Pick<ButtonProps, 'size' | 'variant' | 'className'>;
  showStatusMessage?: boolean;
  notEligibleMessage?: string;
  renderItemExtras?: (item: OrderItem, refund: Refund | undefined, index: number) => React.ReactNode;
  statusPlacement?: StatusPlacement;
}

export const RefundableItemsList: React.FC<RefundableItemsListProps> = ({
  order,
  items,
  refunds,
  onRequest,
  requestLabel = 'Solicitar reembolso',
  buttonProps,
  showStatusMessage = false,
  notEligibleMessage = 'Este item não é elegível para reembolso.',
  renderItemExtras,
  statusPlacement = 'actions',
}) => {
  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const itemRefund = findRefundForItem(refunds, item);
        const eligible = canRequestRefundForItem(order, item, refunds);
        const productImage =
          item.product?.primaryImage || (item as any).productImage || '/placeholder.jpg';
        const productName = item.product?.name || (item as any).productName || 'Produto';
        const lineTotal =
          (item.unitPrice || item.product?.price || 0) * (item.quantity || 0);

        const statusBadge = itemRefund ? (
          <Badge className={REFUND_STATUS_COLORS[itemRefund.status]}>
            {REFUND_STATUS_LABELS[itemRefund.status]}
          </Badge>
        ) : null;

        const statusText =
          itemRefund && showStatusMessage ? REFUND_STATUS_MESSAGES[itemRefund.status] : null;
        const statusMessageNode = statusText ? (
          <span className="text-xs text-gray-600">{statusText}</span>
        ) : null;

        const detailExtras: React.ReactNode[] = [];

        if (statusPlacement === 'details' && statusBadge) {
          detailExtras.push(statusBadge);
          if (statusMessageNode) {
            detailExtras.push(
              <span key="status-message" className="text-xs text-gray-600">
                {statusText}
              </span>,
            );
          }
        }

        const customExtras = renderItemExtras?.(item, itemRefund, index);
        if (customExtras) {
          detailExtras.push(customExtras);
        }

        let actionNode: React.ReactNode;

        if (statusPlacement === 'actions' && statusBadge) {
          actionNode = (
            <>
              {statusBadge}
              {statusMessageNode}
            </>
          );
        } else if (eligible) {
          actionNode = (
            <Button
              variant={buttonProps?.variant ?? 'outline'}
              size={buttonProps?.size}
              className={cn(
                'whitespace-nowrap text-red-600 border-red-200 hover:bg-red-50',
                buttonProps?.className,
              )}
              onClick={() => onRequest(item)}
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              {requestLabel}
            </Button>
          );
        } else {
          actionNode = (
            <p className="max-w-[240px] text-xs text-gray-500">{notEligibleMessage}</p>
          );
        }

        return (
          <div
            key={item._id || (item as any)?.id || `${productName}-${index}`}
            className="flex flex-col gap-4 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center"
          >
            <div className="flex flex-1 items-center gap-3">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <img src={productImage} alt={productName} className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-medium text-gray-900">{productName}</p>
                <p className="text-sm text-gray-600">Qtd: {item.quantity}</p>
                <p className="text-sm text-gray-600">Total: {formatCurrency(lineTotal)}</p>
                {detailExtras.length > 0 && (
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {detailExtras.map((extra, extraIndex) => (
                      <React.Fragment key={extraIndex}>{extra}</React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-start gap-1 sm:items-end">
              {actionNode}
            </div>
          </div>
        );
      })}
      {items.length === 0 && (
        <p className="text-sm text-gray-500">Nenhum item disponível para reembolso.</p>
      )}
    </div>
  );
};

RefundableItemsList.displayName = 'RefundableItemsList';

