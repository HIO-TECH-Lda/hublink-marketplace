'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  User, 
  Edit, 
  ArrowLeft, 
  Package,
  Calendar,
  TrendingUp,
  Eye,
  Mail,
  Phone,
  MapPin,
  Shield,
  ShoppingCart,
  Heart,
  Star,
  CreditCard,
  Lock,
  Activity
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMarketplace } from '@/contexts/MarketplaceContext';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  role: 'buyer' | 'seller' | 'admin';
  avatar?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  preferences: {
    newsletter: boolean;
    notifications: boolean;
    language: string;
  };
  stats: {
    totalOrders: number;
    totalSpent: number;
    favoriteProducts: number;
    reviews: number;
    averageRating: number;
  };
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: number;
  createdAt: string;
  seller: string;
}

interface Review {
  id: string;
  productName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function UserDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { state } = useMarketplace();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserDetails();
  }, [params.id]);

  const loadUserDetails = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockUser: User = {
      id: params.id as string,
      firstName: 'João',
      lastName: 'Silva',
      email: 'joao.silva@email.com',
      phone: '+258 84 123 4567',
      status: 'active',
      role: 'buyer',
      address: {
        street: 'Rua Principal, nº 123',
        city: 'Maputo',
        state: 'Maputo',
        zipCode: '1100',
        country: 'Moçambique'
      },
      preferences: {
        newsletter: true,
        notifications: true,
        language: 'pt-MZ'
      },
      stats: {
        totalOrders: 15,
        totalSpent: 2500.75,
        favoriteProducts: 8,
        reviews: 12,
        averageRating: 4.2
      },
      createdAt: '2023-06-15T10:30:00Z',
      updatedAt: '2024-01-20T14:25:00Z',
      lastLogin: '2024-01-20T08:15:00Z'
    };

    const mockOrders: Order[] = [
      {
        id: '1',
        orderNumber: 'ORD-2024-001',
        status: 'delivered',
        total: 125.90,
        items: 3,
        createdAt: '2024-01-15T10:30:00Z',
        seller: 'Fazenda Verde'
      },
      {
        id: '2',
        orderNumber: 'ORD-2024-002',
        status: 'processing',
        total: 89.50,
        items: 2,
        createdAt: '2024-01-18T14:20:00Z',
        seller: 'Horta Orgânica'
      },
      {
        id: '3',
        orderNumber: 'ORD-2024-003',
        status: 'pending',
        total: 156.75,
        items: 4,
        createdAt: '2024-01-20T09:15:00Z',
        seller: 'Produtos Naturais'
      }
    ];

    const mockReviews: Review[] = [
      {
        id: '1',
        productName: 'Maçãs Orgânicas',
        rating: 5,
        comment: 'Excelente qualidade! Frutas muito frescas e saborosas.',
        createdAt: '2024-01-16T16:45:00Z'
      },
      {
        id: '2',
        productName: 'Bananas Prata',
        rating: 4,
        comment: 'Muito boas, entrega rápida e produtos de qualidade.',
        createdAt: '2024-01-14T11:20:00Z'
      },
      {
        id: '3',
        productName: 'Tomates Orgânicos',
        rating: 4,
        comment: 'Tomates frescos e saborosos. Recomendo!',
        createdAt: '2024-01-12T13:30:00Z'
      }
    ];

    setUser(mockUser);
    setOrders(mockOrders);
    setReviews(mockReviews);
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'inactive': return 'text-gray-600 bg-gray-100';
      case 'suspended': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'suspended': return 'Suspenso';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case 'buyer': return 'Comprador';
      case 'seller': return 'Vendedor';
      case 'admin': return 'Administrador';
      default: return role;
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'shipped': return 'text-purple-600 bg-purple-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case 'delivered': return 'Entregue';
      case 'processing': return 'Processando';
      case 'shipped': return 'Enviado';
      case 'pending': return 'Pendente';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-MZ', {
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

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando detalhes do usuário...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <User className="w-12 h-12 text-gray-4 mx-auto mb-4" />
            <p className="text-gray-6">Usuário não encontrado</p>
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
            <h1 className="text-3xl font-bold text-gray-9 mb-2">
              {user.firstName} {user.lastName}
            </h1>
            <p className="text-gray-6">Detalhes do usuário</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <Button onClick={() => router.push(`/admin/usuarios/${user.id}/editar`)}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Total de Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">{user.stats.totalOrders}</div>
            <p className="text-xs text-gray-6">
              {orders.filter(o => o.status === 'delivered').length} entregues
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
              {formatCurrency(user.stats.totalSpent)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Avaliação Média</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">{user.stats.averageRating}</div>
            <p className="text-xs text-gray-6">{user.stats.reviews} avaliações</p>
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
              <TabsTrigger value="orders">Pedidos</TabsTrigger>
              <TabsTrigger value="reviews">Avaliações</TabsTrigger>
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
                      <p className="text-gray-9">{user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-7">Telefone</label>
                      <p className="text-gray-9">{user.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-7">Função</label>
                      <Badge variant="outline">{getRoleText(user.role)}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Endereço
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-gray-9">{user.address.street}</p>
                    <p className="text-gray-9">
                      {user.address.city}, {user.address.state} {user.address.zipCode}
                    </p>
                    <p className="text-gray-9">{user.address.country}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="w-5 h-5 mr-2" />
                    Preferências
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-7">Newsletter</label>
                      <p className="text-gray-9">
                        {user.preferences.newsletter ? 'Ativado' : 'Desativado'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-7">Notificações</label>
                      <p className="text-gray-9">
                        {user.preferences.notifications ? 'Ativado' : 'Desativado'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-7">Idioma</label>
                      <p className="text-gray-9">{user.preferences.language}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Pedidos</CardTitle>
                  <CardDescription>
                    Todos os pedidos realizados por este usuário
                  </CardDescription>
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
                      {orders.map((order) => (
                        <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                <ShoppingCart className="w-6 h-6 text-gray-4" />
                              </div>
                              <div>
                                <h3 className="font-medium text-gray-9">{order.orderNumber}</h3>
                                <p className="text-sm text-gray-6">Vendedor: {order.seller}</p>
                                <p className="text-sm text-gray-6">{order.items} itens</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-9">{formatCurrency(order.total)}</p>
                              <Badge className={getOrderStatusColor(order.status)}>
                                {getOrderStatusText(order.status)}
                              </Badge>
                              <p className="text-xs text-gray-6 mt-1">{formatDate(order.createdAt)}</p>
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
                  <CardDescription>
                    Avaliações deixadas por este usuário
                  </CardDescription>
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
                      {reviews.map((review) => (
                        <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="font-medium text-gray-9">{review.productName}</h3>
                                <div className="flex items-center">
                                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                  <span className="text-sm text-gray-7 ml-1">{review.rating}</span>
                                </div>
                              </div>
                              <p className="text-gray-7">{review.comment}</p>
                              <p className="text-xs text-gray-6 mt-2">{formatDate(review.createdAt)}</p>
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
                  <CardDescription>
                    Últimas atividades do usuário
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm text-gray-9">Último login</p>
                        <p className="text-xs text-gray-6">{formatDate(user.lastLogin)}</p>
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
                  <span className="font-medium">{user.id}</span>
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
                  <span className="font-medium">{formatDate(user.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Último login:</span>
                  <span className="font-medium">{formatDate(user.lastLogin)}</span>
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
                onClick={() => router.push(`/admin/usuarios/${user.id}/editar`)}
                className="w-full"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar Usuário
              </Button>
              <Button 
                variant="outline"
                className="w-full"
              >
                <Mail className="w-4 h-4 mr-2" />
                Enviar Email
              </Button>
              <Button 
                variant="outline"
                className="w-full"
              >
                <Shield className="w-4 h-4 mr-2" />
                Alterar Status
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
