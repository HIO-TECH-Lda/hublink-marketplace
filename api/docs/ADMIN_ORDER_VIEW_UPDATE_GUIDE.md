# Admin Order View & Update - Frontend Implementation Guide

## Overview

This guide provides detailed implementation examples for viewing and updating individual orders in the admin panel. It includes complete React components, form handling, and UI patterns.

---

## Table of Contents

1. [View Order Details](#view-order-details)
2. [Update Order Form](#update-order-form)
3. [Update Order Status](#update-order-status)
4. [Complete Example Components](#complete-example-components)
5. [Data Reference](#data-reference)

---

## View Order Details

### API Endpoint

```
GET /api/v1/admin/orders/:orderId
```

### Response Structure

```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "orderNumber": "ORD-2024-001",
    "status": "pending",
    "client": {
      "id": "507f1f77bcf86cd799439012",
      "name": "João Silva",
      "email": "joao.silva@email.com",
      "phone": "+258841234567"
    },
    "items": [
      {
        "productId": "507f1f77bcf86cd799439013",
        "productName": "Maçãs Orgânicas",
        "productImage": "https://...",
        "quantity": 2,
        "unitPrice": 150.00,
        "totalPrice": 300.00,
        "sellerName": "Fazenda Verde"
      }
    ],
    "shippingAddress": {
      "firstName": "João",
      "lastName": "Silva",
      "email": "joao.silva@email.com",
      "phone": "+258841234567",
      "address": "Avenida 25 de Setembro, 123",
      "city": "Maputo",
      "state": "Maputo",
      "country": "Mozambique",
      "zipCode": "1100"
    },
    "payment": {
      "method": "credit_card",
      "methodLabel": "Cartão de Crédito",
      "status": "completed",
      "statusLabel": "Pago",
      "amount": 425.00,
      "currency": "MZM"
    },
    "summary": {
      "itemCount": 2,
      "subtotal": 425.00,
      "tax": 0,
      "shipping": 0,
      "discount": 0,
      "total": 425.00
    },
    "timeline": [
      {
        "type": "order_created",
        "label": "Pedido Criado",
        "date": "2024-01-20T12:30:00.000Z",
        "color": "green"
      }
    ],
    "notes": "Please deliver before 5 PM",
    "createdAt": "2024-01-20T12:30:00.000Z",
    "updatedAt": "2024-01-20T12:30:00.000Z"
  }
}
```

### React Component Example

```typescript
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface OrderDetails {
  id: string;
  orderNumber: string;
  status: string;
  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  items: Array<{
    productName: string;
    productImage: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    sellerName: string;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  payment: {
    method: string;
    methodLabel: string;
    status: string;
    statusLabel: string;
    amount: number;
  };
  summary: {
    itemCount: number;
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
  };
  timeline: Array<{
    type: string;
    label: string;
    date: string;
    color: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

function OrderViewPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/v1/admin/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Order not found');
        }
        throw new Error('Failed to fetch order details');
      }

      const result = await response.json();
      if (result.success) {
        setOrder(result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-PT', {
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
      currency: 'MZN',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
      processing: 'bg-blue-100 text-blue-800 border-blue-300',
      shipped: 'bg-blue-100 text-blue-800 border-blue-300',
      delivered: 'bg-green-100 text-green-800 border-green-300',
      cancelled: 'bg-red-100 text-red-800 border-red-300',
      refunded: 'bg-gray-100 text-gray-800 border-gray-300'
    };

    const labels = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      processing: 'Processando',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado',
      refunded: 'Reembolsado'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={() => navigate('/admin/orders')}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Voltar para Lista
          </button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Detalhes do Pedido</h1>
          <p className="text-gray-600 mt-1">Pedido #{order.orderNumber}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(`/admin/orders/${orderId}/edit`)}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar Pedido
          </button>
          <button
            onClick={() => navigate('/admin/orders')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Status do Pedido
              </h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                {getStatusBadge(order.status)}
                <p className="text-sm text-gray-600 mt-2">
                  Última atualização: {formatDate(order.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Itens do Pedido
            </h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-gray-600">{item.sellerName}</p>
                      <p className="text-sm text-gray-500">
                        {item.quantity} x {formatCurrency(item.unitPrice)}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">{formatCurrency(item.totalPrice)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Endereço de Entrega
            </h2>
            <div className="text-gray-700">
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Client Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Cliente
            </h2>
            <div className="space-y-2">
              <p className="font-medium">{order.client.name}</p>
              <p className="text-sm text-gray-600">{order.client.email}</p>
              <p className="text-sm text-gray-600">{order.client.phone}</p>
              <button
                onClick={() => navigate(`/admin/users/${order.client.id}`)}
                className="mt-4 w-full px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
              >
                Ver Perfil
              </button>
            </div>
          </div>

          {/* Payment Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Pagamento
            </h2>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-600">Método</p>
                <p className="font-medium">{order.payment.methodLabel}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`inline-block px-2 py-1 rounded text-sm ${
                  order.payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.payment.statusLabel}
                </span>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(order.summary.total)}</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Timeline
            </h2>
            <div className="space-y-3">
              {order.timeline.map((event, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-1.5 ${
                    event.color === 'green' ? 'bg-green-500' :
                    event.color === 'blue' ? 'bg-blue-500' :
                    event.color === 'red' ? 'bg-red-500' : 'bg-gray-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-sm">{event.label}</p>
                    <p className="text-xs text-gray-600">{formatDate(event.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderViewPage;
```

---

## Update Order Form

### API Endpoint

```
PUT /api/v1/admin/orders/:orderId
```

### Request Body

```json
{
  "status": "confirmed",
  "paymentStatus": "completed",
  "clientInfo": {
    "firstName": "João",
    "lastName": "Silva",
    "email": "joao.silva@email.com",
    "phone": "+258841234567"
  },
  "shippingAddress": {
    "address": "Avenida 25 de Setembro, 123",
    "city": "Maputo",
    "state": "Maputo",
    "zipCode": "1100"
  },
  "notes": "Please deliver before 5 PM",
  "trackingNumber": "TRACK123456"
}
```

### React Component Example

```typescript
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface UpdateOrderFormData {
  status: string;
  paymentStatus: string;
  clientInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  notes?: string;
  trackingNumber?: string;
}

function OrderEditPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<UpdateOrderFormData>({
    status: 'pending',
    paymentStatus: 'pending',
    clientInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    },
    shippingAddress: {
      address: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });

  useEffect(() => {
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/v1/admin/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }

      const result = await response.json();
      if (result.success) {
        const order = result.data;
        setFormData({
          status: order.status,
          paymentStatus: order.payment?.status || 'pending',
          clientInfo: {
            firstName: order.shippingAddress?.firstName || '',
            lastName: order.shippingAddress?.lastName || '',
            email: order.shippingAddress?.email || '',
            phone: order.shippingAddress?.phone || ''
          },
          shippingAddress: {
            address: order.shippingAddress?.address || '',
            city: order.shippingAddress?.city || '',
            state: order.shippingAddress?.state || '',
            zipCode: order.shippingAddress?.zipCode || ''
          },
          notes: order.notes,
          trackingNumber: order.items[0]?.trackingNumber
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.startsWith('clientInfo.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        clientInfo: { ...prev.clientInfo, [field]: value }
      }));
    } else if (name.startsWith('shippingAddress.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        shippingAddress: { ...prev.shippingAddress, [field]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      setSaving(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/v1/admin/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to update order');
      }

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/admin/orders/${orderId}`);
        }, 1500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Editar Pedido</h1>
        <button
          onClick={() => navigate(`/admin/orders/${orderId}`)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
        >
          ← Voltar
        </button>
      </div>

      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-green-800">Pedido atualizado com sucesso!</p>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Status do Pedido</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status do Pedido
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="pending">Pendente</option>
                  <option value="confirmed">Confirmado</option>
                  <option value="processing">Processando</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregue</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status do Pagamento
                </label>
                <select
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="pending">Pendente</option>
                  <option value="processing">Processando</option>
                  <option value="completed">Pago</option>
                  <option value="failed">Falhou</option>
                  <option value="refunded">Reembolsado</option>
                </select>
              </div>
            </div>
          </div>

          {/* Client Info Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Informações do Cliente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                <input
                  type="text"
                  name="clientInfo.firstName"
                  value={formData.clientInfo.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sobrenome *</label>
                <input
                  type="text"
                  name="clientInfo.lastName"
                  value={formData.clientInfo.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  name="clientInfo.email"
                  value={formData.clientInfo.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone *</label>
                <input
                  type="tel"
                  name="clientInfo.phone"
                  value={formData.clientInfo.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Endereço de Entrega</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rua *</label>
                <input
                  type="text"
                  name="shippingAddress.address"
                  value={formData.shippingAddress.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cidade *</label>
                  <input
                    type="text"
                    name="shippingAddress.city"
                    value={formData.shippingAddress.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado *</label>
                  <input
                    type="text"
                    name="shippingAddress.state"
                    value={formData.shippingAddress.state}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CEP *</label>
                <input
                  type="text"
                  name="shippingAddress.zipCode"
                  value={formData.shippingAddress.zipCode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Order Summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Resumo do Pedido</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Número:</span>
                <span className="font-medium">#{orderId?.slice(-8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Itens:</span>
                <span className="font-medium">2</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-gray-600">Total:</span>
                <span className="font-bold text-lg">425,00 MTn</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <button
              type="submit"
              disabled={saving}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default OrderEditPage;
```

---

## Data Reference

### Order View Response

| UI Element | Data Source |
|------------|-------------|
| Order Number | `orderNumber` |
| Status Badge | `status` → Map to Portuguese label |
| Client Name | `client.name` |
| Client Email | `client.email` |
| Client Phone | `client.phone` |
| Order Items | `items[]` |
| Delivery Address | `shippingAddress` |
| Payment Method | `payment.methodLabel` |
| Payment Status | `payment.statusLabel` |
| Order Total | `summary.total` |
| Timeline Events | `timeline[]` |
| Last Update | `updatedAt` |

### Status Labels

**Order Status:**
- `pending` → "Pendente" (yellow)
- `confirmed` → "Confirmado" (blue)
- `processing` → "Processando" (blue)
- `shipped` → "Enviado" (blue)
- `delivered` → "Entregue" (green)
- `cancelled` → "Cancelado" (red)
- `refunded` → "Reembolsado" (gray)

**Payment Status:**
- `pending` → "Pendente" (yellow)
- `processing` → "Processando" (blue)
- `completed` → "Pago" (green)
- `failed` → "Falhou" (red)
- `refunded` → "Reembolsado" (gray)

---

This guide provides complete, production-ready examples for implementing order view and update features in your admin panel.

