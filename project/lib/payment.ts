// Mock Payment Gateway Integration
// In production, this would integrate with real payment providers like Stripe or PayPal

export interface PaymentMethod {
  id: string;
  type: 'card' | 'pix' | 'bank_transfer';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}

export interface Refund {
  id: string;
  paymentIntentId: string;
  amount: number;
  reason: 'requested_by_customer' | 'fraudulent' | 'duplicate' | 'other';
  status: 'pending' | 'succeeded' | 'failed';
  createdAt: string;
  processedAt?: string;
}

export interface Invoice {
  id: string;
  orderId: string;
  customerId: string;
  amount: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'canceled';
  dueDate: string;
  paidAt?: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface OrderTracking {
  orderId: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'canceled' | 'refunded';
  trackingNumber?: string;
  carrier?: string;
  events: TrackingEvent[];
  estimatedDelivery?: string;
  deliveredAt?: string;
}

export interface TrackingEvent {
  id: string;
  status: string;
  description: string;
  location?: string;
  timestamp: string;
}

// Mock Payment Methods
export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm_1',
    type: 'card',
    last4: '4242',
    brand: 'visa',
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true
  },
  {
    id: 'pm_2',
    type: 'card',
    last4: '5555',
    brand: 'mastercard',
    expiryMonth: 8,
    expiryYear: 2026,
    isDefault: false
  },
  {
    id: 'pm_3',
    type: 'pix',
    isDefault: false
  }
];

// Mock Payment Processing
export class PaymentService {
  static async createPaymentIntent(amount: number, currency: string = 'BRL'): Promise<PaymentIntent> {
    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: `pi_${Date.now()}`,
      amount,
      currency,
      status: 'pending',
      paymentMethod: mockPaymentMethods[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  static async confirmPayment(paymentIntentId: string, paymentMethodId: string): Promise<PaymentIntent> {
    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate 95% success rate
    const isSuccess = Math.random() > 0.05;
    
    return {
      id: paymentIntentId,
      amount: 15000, // Mock amount
      currency: 'BRL',
      status: isSuccess ? 'succeeded' : 'failed',
      paymentMethod: mockPaymentMethods.find(pm => pm.id === paymentMethodId) || mockPaymentMethods[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  static async getPaymentMethods(customerId: string): Promise<PaymentMethod[]> {
    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockPaymentMethods;
  }

  static async addPaymentMethod(customerId: string, paymentMethod: Omit<PaymentMethod, 'id'>): Promise<PaymentMethod> {
    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newPaymentMethod: PaymentMethod = {
      ...paymentMethod,
      id: `pm_${Date.now()}`
    };
    
    mockPaymentMethods.push(newPaymentMethod);
    return newPaymentMethod;
  }

  static async removePaymentMethod(paymentMethodId: string): Promise<boolean> {
    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = mockPaymentMethods.findIndex(pm => pm.id === paymentMethodId);
    if (index > -1) {
      mockPaymentMethods.splice(index, 1);
      return true;
    }
    return false;
  }
}

// Mock Invoice Service
export class InvoiceService {
  static async generateInvoice(orderId: string, customerId: string, items: any[], subtotal: number, tax: number, shipping: number): Promise<Invoice> {
    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const total = subtotal + tax + shipping;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30); // 30 days from now
    
    const invoice: Invoice = {
      id: `inv_${Date.now()}`,
      orderId,
      customerId,
      amount: total,
      currency: 'BRL',
      status: 'sent',
      dueDate: dueDate.toISOString(),
      items: items.map(item => ({
        id: `item_${Date.now()}_${Math.random()}`,
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        total: item.price * item.quantity
      })),
      subtotal,
      tax,
      shipping,
      total,
      createdAt: new Date().toISOString()
    };
    
    return invoice;
  }

  static async getInvoice(invoiceId: string): Promise<Invoice | null> {
    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock invoice
    return {
      id: invoiceId,
      orderId: 'order_123',
      customerId: 'customer_123',
      amount: 15000,
      currency: 'BRL',
      status: 'paid',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      paidAt: new Date().toISOString(),
      items: [
        {
          id: 'item_1',
          productId: 'prod_1',
          name: 'Tomates Orgânicos',
          quantity: 2,
          unitPrice: 7500,
          total: 15000
        }
      ],
      subtotal: 15000,
      tax: 0,
      shipping: 0,
      total: 15000,
      createdAt: new Date().toISOString()
    };
  }

  static async markInvoiceAsPaid(invoiceId: string): Promise<Invoice> {
    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const invoice = await this.getInvoice(invoiceId);
    if (!invoice) throw new Error('Invoice not found');
    
    return {
      ...invoice,
      status: 'paid',
      paidAt: new Date().toISOString()
    };
  }
}

// Mock Refund Service
export class RefundService {
  static async createRefund(paymentIntentId: string, amount: number, reason: Refund['reason']): Promise<Refund> {
    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const refund: Refund = {
      id: `re_${Date.now()}`,
      paymentIntentId,
      amount,
      reason,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // Simulate processing delay
    setTimeout(() => {
      refund.status = 'succeeded';
      refund.processedAt = new Date().toISOString();
    }, 2000);
    
    return refund;
  }

  static async getRefund(refundId: string): Promise<Refund | null> {
    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      id: refundId,
      paymentIntentId: 'pi_123',
      amount: 15000,
      reason: 'requested_by_customer',
      status: 'succeeded',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      processedAt: new Date().toISOString()
    };
  }

  static async getRefundsByPaymentIntent(paymentIntentId: string): Promise<Refund[]> {
    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      {
        id: 're_1',
        paymentIntentId,
        amount: 15000,
        reason: 'requested_by_customer',
        status: 'succeeded',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        processedAt: new Date().toISOString()
      }
    ];
  }
}

// Mock Order Tracking Service
export class OrderTrackingService {
  static async getOrderTracking(orderId: string): Promise<OrderTracking> {
    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const now = new Date();
    const estimatedDelivery = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
    
    return {
      orderId,
      status: 'shipped',
      trackingNumber: 'BR123456789BR',
      carrier: 'Correios',
      estimatedDelivery: estimatedDelivery.toISOString(),
      events: [
        {
          id: 'ev_1',
          status: 'order_confirmed',
          description: 'Pedido confirmado',
          location: 'São Paulo, SP',
          timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'ev_2',
          status: 'processing',
          description: 'Produto em processamento',
          location: 'São Paulo, SP',
          timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'ev_3',
          status: 'shipped',
          description: 'Produto enviado',
          location: 'São Paulo, SP',
          timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'ev_4',
          status: 'in_transit',
          description: 'Em trânsito',
          location: 'Rio de Janeiro, RJ',
          timestamp: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString()
        }
      ]
    };
  }

  static async updateOrderStatus(orderId: string, status: OrderTracking['status']): Promise<OrderTracking> {
    // Mock API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const tracking = await this.getOrderTracking(orderId);
    return {
      ...tracking,
      status,
      events: [
        ...tracking.events,
        {
          id: `ev_${Date.now()}`,
          status,
          description: `Status atualizado para: ${status}`,
          location: 'Sistema',
          timestamp: new Date().toISOString()
        }
      ]
    };
  }
}

// Utility functions
export const formatCurrency = (amount: number, currency: string = 'BRL'): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency
  }).format(amount / 100); // Convert from cents
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}; 