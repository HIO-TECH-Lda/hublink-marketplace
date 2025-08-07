'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ShoppingCart, 
  User, 
  Package, 
  MapPin, 
  CreditCard,
  Save,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  notes?: string;
}

export default function EditOrderPage() {
  const router = useRouter();
  const params = useParams();
  const { state } = useMarketplace();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form state
  const [formData, setFormData] = useState({
    status: '',
    paymentStatus: '',
    customerFirstName: '',
    customerLastName: '',
    customerEmail: '',
    customerPhone: '',
    shippingStreet: '',
    shippingNumber: '',
    shippingComplement: '',
    shippingNeighborhood: '',
    shippingCity: '',
    shippingState: '',
    shippingZipCode: '',
    notes: ''
  });

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
      updatedAt: '2024-01-20T10:30:00Z',
      notes: 'Cliente solicitou entrega no período da manhã.'
    };

    setOrder(mockOrder);
    
    // Populate form data
    setFormData({
      status: mockOrder.status,
      paymentStatus: mockOrder.paymentStatus,
      customerFirstName: mockOrder.customer.firstName,
      customerLastName: mockOrder.customer.lastName,
      customerEmail: mockOrder.customer.email,
      customerPhone: mockOrder.customer.phone,
      shippingStreet: mockOrder.shippingAddress.street,
      shippingNumber: mockOrder.shippingAddress.number,
      shippingComplement: mockOrder.shippingAddress.complement || '',
      shippingNeighborhood: mockOrder.shippingAddress.neighborhood,
      shippingCity: mockOrder.shippingAddress.city,
      shippingState: mockOrder.shippingAddress.state,
      shippingZipCode: mockOrder.shippingAddress.zipCode,
      notes: mockOrder.notes || ''
    });
    
    setIsLoading(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerFirstName.trim()) {
      newErrors.customerFirstName = 'Nome é obrigatório';
    }
    if (!formData.customerLastName.trim()) {
      newErrors.customerLastName = 'Sobrenome é obrigatório';
    }
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Email inválido';
    }
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = 'Telefone é obrigatório';
    }
    if (!formData.shippingStreet.trim()) {
      newErrors.shippingStreet = 'Rua é obrigatória';
    }
    if (!formData.shippingNumber.trim()) {
      newErrors.shippingNumber = 'Número é obrigatório';
    }
    if (!formData.shippingNeighborhood.trim()) {
      newErrors.shippingNeighborhood = 'Bairro é obrigatório';
    }
    if (!formData.shippingCity.trim()) {
      newErrors.shippingCity = 'Cidade é obrigatória';
    }
    if (!formData.shippingState.trim()) {
      newErrors.shippingState = 'Estado é obrigatório';
    }
    if (!formData.shippingZipCode.trim()) {
      newErrors.shippingZipCode = 'CEP é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update order with new data
      if (order) {
        const updatedOrder: Order = {
          ...order,
          status: formData.status as Order['status'],
          paymentStatus: formData.paymentStatus as Order['paymentStatus'],
          customer: {
            ...order.customer,
            firstName: formData.customerFirstName,
            lastName: formData.customerLastName,
            email: formData.customerEmail,
            phone: formData.customerPhone
          },
          shippingAddress: {
            street: formData.shippingStreet,
            number: formData.shippingNumber,
            complement: formData.shippingComplement || undefined,
            neighborhood: formData.shippingNeighborhood,
            city: formData.shippingCity,
            state: formData.shippingState,
            zipCode: formData.shippingZipCode
          },
          notes: formData.notes || undefined,
          updatedAt: new Date().toISOString()
        };

        setOrder(updatedOrder);
      }

      // Redirect to order details
      router.push(`/admin/pedidos/${params.id}`);
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(amount);
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
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Editar Pedido</h1>
            <p className="text-gray-6">Pedido #{order.orderNumber}</p>
          </div>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Status do Pedido</label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
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
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Status do Pagamento</label>
                    <Select value={formData.paymentStatus} onValueChange={(value) => setFormData({...formData, paymentStatus: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="paid">Pago</SelectItem>
                        <SelectItem value="failed">Falhou</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Informações do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Nome *</label>
                    <Input
                      value={formData.customerFirstName}
                      onChange={(e) => setFormData({...formData, customerFirstName: e.target.value})}
                      className={errors.customerFirstName ? 'border-red-500' : ''}
                    />
                    {errors.customerFirstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.customerFirstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Sobrenome *</label>
                    <Input
                      value={formData.customerLastName}
                      onChange={(e) => setFormData({...formData, customerLastName: e.target.value})}
                      className={errors.customerLastName ? 'border-red-500' : ''}
                    />
                    {errors.customerLastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.customerLastName}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Email *</label>
                    <Input
                      type="email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                      className={errors.customerEmail ? 'border-red-500' : ''}
                    />
                    {errors.customerEmail && (
                      <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Telefone *</label>
                    <Input
                      value={formData.customerPhone}
                      onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                      className={errors.customerPhone ? 'border-red-500' : ''}
                    />
                    {errors.customerPhone && (
                      <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>
                    )}
                  </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Rua *</label>
                    <Input
                      value={formData.shippingStreet}
                      onChange={(e) => setFormData({...formData, shippingStreet: e.target.value})}
                      className={errors.shippingStreet ? 'border-red-500' : ''}
                    />
                    {errors.shippingStreet && (
                      <p className="text-red-500 text-sm mt-1">{errors.shippingStreet}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Número *</label>
                    <Input
                      value={formData.shippingNumber}
                      onChange={(e) => setFormData({...formData, shippingNumber: e.target.value})}
                      className={errors.shippingNumber ? 'border-red-500' : ''}
                    />
                    {errors.shippingNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.shippingNumber}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Complemento</label>
                    <Input
                      value={formData.shippingComplement}
                      onChange={(e) => setFormData({...formData, shippingComplement: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Bairro *</label>
                    <Input
                      value={formData.shippingNeighborhood}
                      onChange={(e) => setFormData({...formData, shippingNeighborhood: e.target.value})}
                      className={errors.shippingNeighborhood ? 'border-red-500' : ''}
                    />
                    {errors.shippingNeighborhood && (
                      <p className="text-red-500 text-sm mt-1">{errors.shippingNeighborhood}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Cidade *</label>
                    <Input
                      value={formData.shippingCity}
                      onChange={(e) => setFormData({...formData, shippingCity: e.target.value})}
                      className={errors.shippingCity ? 'border-red-500' : ''}
                    />
                    {errors.shippingCity && (
                      <p className="text-red-500 text-sm mt-1">{errors.shippingCity}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Estado *</label>
                    <Input
                      value={formData.shippingState}
                      onChange={(e) => setFormData({...formData, shippingState: e.target.value})}
                      className={errors.shippingState ? 'border-red-500' : ''}
                    />
                    {errors.shippingState && (
                      <p className="text-red-500 text-sm mt-1">{errors.shippingState}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">CEP *</label>
                    <Input
                      value={formData.shippingZipCode}
                      onChange={(e) => setFormData({...formData, shippingZipCode: e.target.value})}
                      className={errors.shippingZipCode ? 'border-red-500' : ''}
                    />
                    {errors.shippingZipCode && (
                      <p className="text-red-500 text-sm mt-1">{errors.shippingZipCode}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Observações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Adicione observações sobre o pedido..."
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="w-5 h-5 mr-2" />
                  Resumo do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-6">Número:</span>
                    <span className="font-medium">{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Itens:</span>
                    <span className="font-medium">{order.items.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Total:</span>
                    <span className="font-bold text-lg">{formatCurrency(order.total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Método de Pagamento:</span>
                    <span className="font-medium">{order.paymentMethod}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Itens do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-gray-9">{item.product.name}</p>
                        <p className="text-sm text-gray-6">
                          {item.quantity} x {formatCurrency(item.product.price)}
                        </p>
                      </div>
                      <p className="font-medium text-gray-9">{formatCurrency(item.total)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Card>
              <CardContent className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
} 