import React from 'react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/payment';
import {
  REFUND_STATUS_COLORS,
  REFUND_STATUS_LABELS,
} from '@/lib/refund-utils';
import type { Refund } from '@/types/api';

interface RefundRequestsListProps {
  refunds: Refund[];
  emptyMessage?: string;
}

export const RefundRequestsList: React.FC<RefundRequestsListProps> = ({
  refunds,
  emptyMessage,
}) => {
  if (!refunds.length) {
    return (
      <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center text-sm text-gray-600">
        {emptyMessage || 'Você ainda não enviou nenhuma solicitação de reembolso para este pedido.'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {refunds.map((refund) => {
        const product =
          typeof refund.productId === 'object' ? refund.productId : undefined;

        return (
          <div key={refund._id} className="rounded-lg border border-gray-200 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {product?.primaryImage && (
                  <img
                    src={product.primaryImage}
                    alt={refund.productName}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                )}
                <div>
                  <p className="font-medium text-gray-900">{refund.productName}</p>
                  <p className="text-sm text-gray-600">
                    Valor solicitado: {formatCurrency(refund.amount)}
                  </p>
                </div>
              </div>
              <Badge className={REFUND_STATUS_COLORS[refund.status]}>
                {REFUND_STATUS_LABELS[refund.status]}
              </Badge>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="text-gray-500">Motivo:</span> {refund.reason}
              </p>
              <p>
                <span className="text-gray-500">Descrição:</span> {refund.description}
              </p>
              <p>
                <span className="text-gray-500">Solicitado em:</span>{' '}
                {formatDate(refund.requestedAt || refund.createdAt)}
              </p>
              {refund.processedAt && (
                <p>
                  <span className="text-gray-500">Processado em:</span>{' '}
                  {formatDate(refund.processedAt)}
                </p>
              )}
              {refund.rejectionReason && (
                <div className="rounded border border-red-200 bg-red-50 p-2 text-red-700">
                  Motivo da rejeição: {refund.rejectionReason}
                </div>
              )}
              {refund.images && refund.images.length > 0 && (
                <div>
                  <span className="mb-2 block text-gray-500">Imagens enviadas:</span>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {refund.images.map((image, index) => (
                      <div
                        key={`${refund._id}-image-${index}`}
                        className="aspect-square overflow-hidden rounded-lg border border-gray-200"
                      >
                        <img src={image} alt={`Imagem ${index + 1}`} className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

RefundRequestsList.displayName = 'RefundRequestsList';

