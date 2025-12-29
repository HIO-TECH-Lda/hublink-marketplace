'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Save, 
  ArrowLeft, 
  User,
  MapPin,
  Shield,
  AlertCircle
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAdminOrder, useUpdateOrder } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';

interface UpdateOrderData {
  status?: string;
  paymentStatus?: string;
  clientInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  shippingAddress?: {
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  notes?: string;
  trackingNumber?: string;
}

export default function OrderEditPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const orderId = params.id as string;
  
  const { data: order, isLoading } = useAdminOrder(orderId);
  const updateOrder = useUpdateOrder();

  const [formData, setFormData] = useState<UpdateOrderData>({
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

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (order) {
      const orderData = order as any;
      setFormData({
        status: orderData.status || 'pending',
        paymentStatus: orderData.payment?.status || 'pending',
        clientInfo: {
          firstName: orderData.shippingAddress?.firstName || orderData.client?.name?.split(' ')[0] || '',
          lastName: orderData.shippingAddress?.lastName || orderData.client?.name?.split(' ').slice(1).join(' ') || '',
          email: orderData.shippingAddress?.email || orderData.client?.email || '',
          phone: orderData.shippingAddress?.phone || orderData.client?.phone || ''
        },
        shippingAddress: {
          address: orderData.shippingAddress?.address || '',
          city: orderData.shippingAddress?.city || '',
          state: orderData.shippingAddress?.state || '',
          zipCode: orderData.shippingAddress?.zipCode || ''
        },
        notes: orderData.notes || '',
        trackingNumber: orderData.items?.[0]?.trackingNumber || ''
      });
    }
  }, [order]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientInfo?.firstName?.trim()) {
      newErrors['clientInfo.firstName'] = 'Nome é obrigatório';
    }
    if (!formData.clientInfo?.lastName?.trim()) {
      newErrors['clientInfo.lastName'] = 'Sobrenome é obrigatório';
    }
    if (!formData.clientInfo?.email?.trim()) {
      newErrors['clientInfo.email'] = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientInfo.email)) {
      newErrors['clientInfo.email'] = 'Email inválido';
    }
    if (!formData.shippingAddress?.address?.trim()) {
      newErrors['shippingAddress.address'] = 'Endereço é obrigatório';
    }
    if (!formData.shippingAddress?.city?.trim()) {
      newErrors['shippingAddress.city'] = 'Cidade é obrigatória';
    }
    if (!formData.shippingAddress?.state?.trim()) {
      newErrors['shippingAddress.state'] = 'Estado é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await updateOrder.mutateAsync({
        orderId,
        data: formData
      });
      
      toast({
        title: 'Pedido atualizado',
        description: 'As alterações foram salvas com sucesso.',
      });
      
      router.push(`/admin/pedidos/${orderId}`);
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Falha ao atualizar pedido',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando dados do pedido...</p>
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
            <p className="text-gray-6">Pedido não encontrado</p>
            <Button onClick={() => router.push('/admin/pedidos')} className="mt-4">
              Voltar para Lista
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const orderData = order as any;
  const summary = orderData.summary || {
    itemCount: orderData.items?.length || 0,
    total: orderData.total || 0
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Editar Pedido</h1>
            <p className="text-gray-6">Pedido #{orderData.orderNumber || orderId}</p>
          </div>
          <Button onClick={() => router.push(`/admin/pedidos/${orderId}`)} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Status Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Status do Pedido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status do Pedido</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="confirmed">Confirmado</SelectItem>
                        <SelectItem value="processing">Processando</SelectItem>
                        <SelectItem value="shipped">Enviado</SelectItem>
                        <SelectItem value="delivered">Entregue</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                        <SelectItem value="refunded">Reembolsado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="paymentStatus">Status do Pagamento</Label>
                    <Select
                      value={formData.paymentStatus}
                      onValueChange={(value) => handleSelectChange('paymentStatus', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="processing">Processando</SelectItem>
                        <SelectItem value="completed">Pago</SelectItem>
                        <SelectItem value="failed">Falhou</SelectItem>
                        <SelectItem value="refunded">Reembolsado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Client Info Section */}
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
                    <Label htmlFor="clientInfo.firstName">Nome *</Label>
                    <Input
                      name="clientInfo.firstName"
                      value={formData.clientInfo?.firstName || ''}
                      onChange={handleChange}
                      className={errors['clientInfo.firstName'] ? 'border-red-500' : ''}
                    />
                    {errors['clientInfo.firstName'] && (
                      <p className="text-red-500 text-sm mt-1">{errors['clientInfo.firstName']}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="clientInfo.lastName">Sobrenome *</Label>
                    <Input
                      name="clientInfo.lastName"
                      value={formData.clientInfo?.lastName || ''}
                      onChange={handleChange}
                      className={errors['clientInfo.lastName'] ? 'border-red-500' : ''}
                    />
                    {errors['clientInfo.lastName'] && (
                      <p className="text-red-500 text-sm mt-1">{errors['clientInfo.lastName']}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="clientInfo.email">Email *</Label>
                    <Input
                      type="email"
                      name="clientInfo.email"
                      value={formData.clientInfo?.email || ''}
                      onChange={handleChange}
                      className={errors['clientInfo.email'] ? 'border-red-500' : ''}
                    />
                    {errors['clientInfo.email'] && (
                      <p className="text-red-500 text-sm mt-1">{errors['clientInfo.email']}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="clientInfo.phone">Telefone</Label>
                    <Input
                      type="tel"
                      name="clientInfo.phone"
                      value={formData.clientInfo?.phone || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Endereço de Entrega
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="shippingAddress.address">Rua *</Label>
                    <Input
                      name="shippingAddress.address"
                      value={formData.shippingAddress?.address || ''}
                      onChange={handleChange}
                      className={errors['shippingAddress.address'] ? 'border-red-500' : ''}
                    />
                    {errors['shippingAddress.address'] && (
                      <p className="text-red-500 text-sm mt-1">{errors['shippingAddress.address']}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="shippingAddress.city">Cidade *</Label>
                      <Input
                        name="shippingAddress.city"
                        value={formData.shippingAddress?.city || ''}
                        onChange={handleChange}
                        className={errors['shippingAddress.city'] ? 'border-red-500' : ''}
                      />
                      {errors['shippingAddress.city'] && (
                        <p className="text-red-500 text-sm mt-1">{errors['shippingAddress.city']}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="shippingAddress.state">Estado *</Label>
                      <Input
                        name="shippingAddress.state"
                        value={formData.shippingAddress?.state || ''}
                        onChange={handleChange}
                        className={errors['shippingAddress.state'] ? 'border-red-500' : ''}
                      />
                      {errors['shippingAddress.state'] && (
                        <p className="text-red-500 text-sm mt-1">{errors['shippingAddress.state']}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="shippingAddress.zipCode">CEP</Label>
                    <Input
                      name="shippingAddress.zipCode"
                      value={formData.shippingAddress?.zipCode || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Informações Adicionais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="trackingNumber">Número de Rastreamento</Label>
                    <Input
                      name="trackingNumber"
                      value={formData.trackingNumber || ''}
                      onChange={handleChange}
                      placeholder="TRACK123456"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notas</Label>
                    <Textarea
                      name="notes"
                      value={formData.notes || ''}
                      onChange={handleChange}
                      placeholder="Notas adicionais sobre o pedido..."
                      rows={4}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-6">Número:</span>
                    <span className="font-medium">{orderData.orderNumber || orderId.slice(-8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Itens:</span>
                    <span className="font-medium">{summary.itemCount}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-2">
                    <span className="text-gray-6">Total:</span>
                    <span className="font-bold text-lg">
                      {new Intl.NumberFormat('pt-MZ', {
                        style: 'currency',
                        currency: 'MZN'
                      }).format(summary.total)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={updateOrder.isPending}
                >
                  {updateOrder.isPending ? (
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
