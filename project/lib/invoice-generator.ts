import { formatCurrency, formatDate } from './payment';

export interface InvoiceData {
  id: string;
  orderNumber: string;
  date: string;
  status: string;
  customer: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: any[];
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  notes: string;
}

export const generateInvoiceHTML = (invoice: InvoiceData): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Fatura - ${invoice.orderNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .invoice-details { margin-bottom: 20px; }
        .customer-info { margin-bottom: 20px; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .items-table th { background-color: #f2f2f2; }
        .totals { text-align: right; margin-top: 20px; }
        .status { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
        .status.paid { background-color: #d4edda; color: #155724; }
        .status.pending { background-color: #fff3cd; color: #856404; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>TXOVA</h1>
        <h2>Fatura #${invoice.orderNumber}</h2>
        <p>Data: ${formatDate(invoice.date)}</p>
      </div>
      
      <div class="invoice-details">
        <h3>Informações do Cliente</h3>
        <p><strong>Nome:</strong> ${invoice.customer.name}</p>
        <p><strong>Email:</strong> ${invoice.customer.email}</p>
        <p><strong>Endereço:</strong> ${invoice.customer.address}</p>
        <p><strong>Cidade:</strong> ${invoice.customer.city}, ${invoice.customer.state} ${invoice.customer.zipCode}</p>
        <p><strong>País:</strong> ${invoice.customer.country}</p>
      </div>

      <table class="items-table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Preço Unitário</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items.map((item: any) => `
            <tr>
              <td>${item.product?.name || item.productName}</td>
              <td>${item.quantity}</td>
              <td>${formatCurrency(item.unitPrice || item.product?.price || 0)}</td>
              <td>${formatCurrency((item.unitPrice || item.product?.price || 0) * item.quantity)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="totals">
        <p><strong>Subtotal:</strong> ${formatCurrency(invoice.subtotal)}</p>
        <p><strong>Frete:</strong> ${formatCurrency(invoice.shipping)}</p>
        <p><strong>Desconto:</strong> ${formatCurrency(invoice.discount)}</p>
        <p><strong>Impostos:</strong> ${formatCurrency(invoice.tax)}</p>
        <p><strong>Total:</strong> ${formatCurrency(invoice.total)}</p>
      </div>

      <div class="payment-info">
        <p><strong>Método de Pagamento:</strong> ${invoice.paymentMethod.toUpperCase()}</p>
        <p><strong>Status:</strong> <span class="status ${invoice.status}">${getStatusText(invoice.status)}</span></p>
      </div>

      ${invoice.notes ? `<div class="notes"><p><strong>Notas:</strong> ${invoice.notes}</p></div>` : ''}
    </body>
    </html>
  `;
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
