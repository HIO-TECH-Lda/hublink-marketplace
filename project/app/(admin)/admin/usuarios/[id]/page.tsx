'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  User, 
  Edit, 
  ArrowLeft, 
  Package,
  Calendar,
  ShoppingCart,
  Star,
  CreditCard,
  Activity,
  Mail,
  Phone,
  MapPin,
  Shield,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAdminUser, useUpdateUserStatus } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const userId = params.id as string;
  
  const { data: user, isLoading } = useAdminUser(userId);
  const updateStatus = useUpdateUserStatus();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      active: 'Ativo',
      inactive: 'Inativo',
      suspended: 'Suspenso'
    };
    return statusMap[status] || status;
  };

  const getRoleText = (role: string) => {
    const roleMap: Record<string, string> = {
      buyer: 'Comprador',
      seller: 'Vendedor',
      admin: 'Administrador',
      support: 'Suporte'
    };
    return roleMap[role] || role;
  };

  const getOrderStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      delivered: 'bg-green-100 text-green-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800';
  };

  const getOrderStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      processing: 'Processando',
      shipped: 'Enviado',
      delivered: 'Entregue',
      cancelled: 'Cancelado'
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Nunca';
    return new Date(dateString).toLocaleString('pt-MZ', {
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
      currency: 'MZN'
    }).format(amount);
  };

  const handleStatusChange = async (newStatus: 'active' | 'inactive' | 'suspended') => {
    try {
      await updateStatus.mutateAsync({ userId, status: newStatus });
      toast({
        title: 'Status atualizado',
        description: 'O status do usuário foi atualizado com sucesso.',
      });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.message || 'Falha ao atualizar status',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando detalhes do usuário...</p>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <User className="w-12 h-12 text-gray-4 mx-auto mb-4" />
            <p className="text-gray-6">Usuário não encontrado</p>
            <Button onClick={() => router.push('/admin/usuarios')} className="mt-4">
              Voltar para Lista
            </Button>
          </div>
        </div>
      </>
    );
  }

  const statistics = (user as any).statistics || {
    totalOrders: (user as any).orderCount || 0,
    deliveredOrders: 0,
    totalSpent: (user as any).totalSpent || 0,
    averageRating: 0,
    totalReviews: 0
  };

  const orders = (user as any).orders || [];
  const reviews = (user as any).reviews || [];
  const activities = (user as any).activities || [];

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-6">ID: {user._id || user.id}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={() => router.push('/admin/usuarios')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button onClick={() => router.push(`/admin/usuarios/${userId}/editar`)}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Total de Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">{statistics.totalOrders}</div>
            <p className="text-xs text-gray-6">
              {statistics.deliveredOrders} entregues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Total Gasto</CardTitle>
            <CreditCard className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">
              {formatCurrency(statistics.totalSpent)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Avaliação Média</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">
              {statistics.averageRating > 0 ? statistics.averageRating.toFixed(1) : '0.0'}
            </div>
            <p className="text-xs text-gray-6">{statistics.totalReviews} avaliações</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Status</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(user.status)}>
              {getStatusText(user.status)}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* User Information and Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">Perfil</TabsTrigger>
              <TabsTrigger value="orders">Pedidos ({orders.length})</TabsTrigger>
              <TabsTrigger value="reviews">Avaliações ({reviews.length})</TabsTrigger>
              <TabsTrigger value="activity">Atividade</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-gray-7">Nome Completo</label>
                      <p className="text-gray-9">{user.firstName} {user.lastName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-7">Email</label>
                      <div className="flex items-center gap-2">
                        <p className="text-gray-9">{user.email}</p>
                        {user.emailVerified ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-7">Telefone</label>
                      <div className="flex items-center gap-2">
                        <p className="text-gray-9">{user.phone}</p>
                        {user.phoneVerified ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-7">Função</label>
                      <Badge variant="outline">{getRoleText(user.role)}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              {(user.billingAddress || user.shippingAddress) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2" />
                      Endereços
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {user.billingAddress && (
                        <div>
                          <h3 className="font-medium mb-2">Endereço de Cobrança</h3>
                          <div className="text-sm text-gray-6 space-y-1">
                            <p>{user.billingAddress.street || user.billingAddress.address}</p>
                            <p>
                              {user.billingAddress.city}, {user.billingAddress.state}
                            </p>
                            <p>
                              {user.billingAddress.postalCode || user.billingAddress.zipCode}
                            </p>
                            <p>{user.billingAddress.country}</p>
                          </div>
                        </div>
                      )}
                      {user.shippingAddress && (
                        <div>
                          <h3 className="font-medium mb-2">Endereço de Entrega</h3>
                          <div className="text-sm text-gray-6 space-y-1">
                            <p>{user.shippingAddress.street || user.shippingAddress.address}</p>
                            <p>
                              {user.shippingAddress.city}, {user.shippingAddress.state}
                            </p>
                            <p>
                              {user.shippingAddress.postalCode || user.shippingAddress.zipCode}
                            </p>
                            <p>{user.shippingAddress.country}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Seller Profile */}
              {user.sellerProfile && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Perfil de Vendedor
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-7">Nome da Loja</label>
                        <p className="text-gray-9">{user.sellerProfile.storeName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-7">Cidade</label>
                        <p className="text-gray-9">{user.sellerProfile.city}</p>
                      </div>
                      {user.sellerProfile.storeDescription && (
                        <div className="md:col-span-2">
                          <label className="text-sm font-medium text-gray-7">Descrição</label>
                          <p className="text-gray-9">{user.sellerProfile.storeDescription}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Preferences */}
              {user.preferences && (
                <Card>
                  <CardHeader>
                    <CardTitle>Preferências</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {user.preferences.language && (
                        <div>
                          <label className="text-sm font-medium text-gray-7">Idioma</label>
                          <p className="text-gray-9">{user.preferences.language}</p>
                        </div>
                      )}
                      {user.preferences.currency && (
                        <div>
                          <label className="text-sm font-medium text-gray-7">Moeda</label>
                          <p className="text-gray-9">{user.preferences.currency}</p>
                        </div>
                      )}
                      {user.preferences.notifications && (
                        <div>
                          <label className="text-sm font-medium text-gray-7">Notificações</label>
                          <div className="space-y-1 text-sm text-gray-6">
                            <p>Email: {user.preferences.notifications.email ? 'Ativado' : 'Desativado'}</p>
                            <p>SMS: {user.preferences.notifications.sms ? 'Ativado' : 'Desativado'}</p>
                            <p>Push: {user.preferences.notifications.push ? 'Ativado' : 'Desativado'}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Os Meus Pedidos</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-9 mb-2">Nenhum pedido encontrado</h3>
                      <p className="text-gray-6">Este usuário ainda não realizou pedidos.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order: any) => (
                        <div key={order.id || order._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <ShoppingCart className="w-6 h-6 text-gray-4" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-9">{order.orderNumber}</h3>
                                <p className="text-sm text-gray-6">Vendedor: {order.vendor}</p>
                                <p className="text-sm text-gray-6">{order.itemCount} itens</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-9">{formatCurrency(order.amount)}</p>
                              <Badge className={getOrderStatusColor(order.status)}>
                                {getOrderStatusText(order.status)}
                              </Badge>
                              <p className="text-xs text-gray-6 mt-1">{formatDate(order.date)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Avaliações</CardTitle>
                </CardHeader>
                <CardContent>
                  {reviews.length === 0 ? (
                    <div className="text-center py-8">
                      <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-9 mb-2">Nenhuma avaliação encontrada</h3>
                      <p className="text-gray-6">Este usuário ainda não deixou avaliações.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review: any) => (
                        <div key={review.id || review._id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start gap-4">
                            {review.productImage && (
                              <img
                                src={review.productImage}
                                alt={review.productName}
                                className="w-16 h-16 rounded-lg object-cover"
                              />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-medium text-gray-9">{review.productName}</h3>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < review.rating
                                          ? 'text-yellow-500 fill-current'
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              {review.title && (
                                <p className="font-medium text-gray-9 mb-1">{review.title}</p>
                              )}
                              {review.comment && (
                                <p className="text-gray-7 mb-2">{review.comment}</p>
                              )}
                              <p className="text-xs text-gray-6">{formatDate(review.date)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                </CardHeader>
                <CardContent>
                  {activities.length === 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="text-sm text-gray-9">Último login</p>
                          <p className="text-xs text-gray-6">{formatDate((user as any).lastLogin)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="text-sm text-gray-9">Conta criada</p>
                          <p className="text-xs text-gray-6">{formatDate(user.createdAt)}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div>
                          <p className="text-sm text-gray-9">Última atualização</p>
                          <p className="text-xs text-gray-6">{formatDate(user.updatedAt)}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activities.map((activity: any, index: number) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              activity.color === 'green'
                                ? 'bg-green-500'
                                : activity.color === 'blue'
                                ? 'bg-blue-500'
                                : activity.color === 'purple'
                                ? 'bg-purple-500'
                                : 'bg-gray-500'
                            }`}
                          ></div>
                          <div>
                            <p className="text-sm text-gray-9">{activity.label}</p>
                            <p className="text-xs text-gray-6">{formatDate(activity.date)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* User Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo do Usuário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-6">ID:</span>
                  <span className="font-medium text-xs">{user._id || user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Status:</span>
                  <Badge className={getStatusColor(user.status)}>
                    {getStatusText(user.status)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Função:</span>
                  <span className="font-medium">{getRoleText(user.role)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Membro desde:</span>
                  <span className="font-medium text-sm">{formatDate(user.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Último login:</span>
                  <span className="font-medium text-sm">{formatDate((user as any).lastLogin)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => router.push(`/admin/usuarios/${userId}/editar`)}
                className="w-full"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar Usuário
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
