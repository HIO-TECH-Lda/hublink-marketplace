'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Mail, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Users,
  TrendingUp,
  Calendar,
  ArrowLeft,
  Plus,
  Tag,
  UserCheck,
  UserX
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMarketplace } from '@/contexts/MarketplaceContext';

interface NewsletterSubscriber {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  status: 'active' | 'unsubscribed' | 'bounced' | 'pending';
  source: 'popup' | 'footer' | 'signup' | 'admin';
  tags: string[];
  preferences: {
    categories: string[];
    frequency: string;
    language: string;
  };
  stats: {
    emailsSent: number;
    emailsOpened: number;
    emailsClicked: number;
    lastOpened?: string;
    lastClicked?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface NewsletterCampaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
  type: 'newsletter' | 'promotional' | 'announcement' | 'welcome';
  stats: {
    totalSubscribers: number;
    emailsSent: number;
    emailsDelivered: number;
    emailsOpened: number;
    emailsClicked: number;
    unsubscribes: number;
    bounces: number;
    openRate: number;
    clickRate: number;
  };
  sentAt?: string;
  createdAt: string;
}

export default function NewsletterManagementPage() {
  const router = useRouter();
  const { state } = useMarketplace();
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('subscribers');

  const filterSubscribers = useCallback(() => {
    let filtered = subscribers;

    if (searchTerm) {
      filtered = filtered.filter(subscriber =>
        subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscriber.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscriber.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(subscriber => subscriber.status === statusFilter);
    }

    if (sourceFilter !== 'all') {
      filtered = filtered.filter(subscriber => subscriber.source === sourceFilter);
    }

    setFilteredSubscribers(filtered);
  }, [subscribers, searchTerm, statusFilter, sourceFilter]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterSubscribers();
  }, [filterSubscribers]);

  const loadData = async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock subscriber data
    const mockSubscribers: NewsletterSubscriber[] = [
      {
        id: '1',
        email: 'joao.silva@email.com',
        firstName: 'João',
        lastName: 'Silva',
        status: 'active',
        source: 'popup',
        tags: ['eletronicos', 'tecnologia'],
        preferences: {
          categories: ['eletronicos', 'moda'],
          frequency: 'weekly',
          language: 'pt-MZ'
        },
        stats: {
          emailsSent: 12,
          emailsOpened: 8,
          emailsClicked: 3,
          lastOpened: '2024-01-20T14:25:00Z',
          lastClicked: '2024-01-18T10:30:00Z'
        },
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-20T14:25:00Z'
      },
      {
        id: '2',
        email: 'maria.santos@email.com',
        firstName: 'Maria',
        lastName: 'Santos',
        status: 'active',
        source: 'footer',
        tags: ['moda', 'promocional'],
        preferences: {
          categories: ['moda', 'beleza'],
          frequency: 'monthly',
          language: 'pt-MZ'
        },
        stats: {
          emailsSent: 8,
          emailsOpened: 6,
          emailsClicked: 2,
          lastOpened: '2024-01-19T16:45:00Z',
          lastClicked: '2024-01-15T11:20:00Z'
        },
        createdAt: '2024-01-10T09:15:00Z',
        updatedAt: '2024-01-19T16:45:00Z'
      },
      {
        id: '3',
        email: 'pedro.oliveira@email.com',
        status: 'unsubscribed',
        source: 'signup',
        tags: ['esportes'],
        preferences: {
          categories: ['esportes'],
          frequency: 'weekly',
          language: 'pt-MZ'
        },
        stats: {
          emailsSent: 5,
          emailsOpened: 2,
          emailsClicked: 0,
          lastOpened: '2024-01-12T10:30:00Z'
        },
        createdAt: '2024-01-05T11:20:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '4',
        email: 'ana.costa@email.com',
        firstName: 'Ana',
        lastName: 'Costa',
        status: 'bounced',
        source: 'popup',
        tags: ['casa'],
        preferences: {
          categories: ['casa', 'decoracao'],
          frequency: 'promocional',
          language: 'pt-MZ'
        },
        stats: {
          emailsSent: 3,
          emailsOpened: 0,
          emailsClicked: 0
        },
        createdAt: '2024-01-08T14:20:00Z',
        updatedAt: '2024-01-12T09:15:00Z'
      }
    ];

    // Mock campaign data
    const mockCampaigns: NewsletterCampaign[] = [
      {
        id: '1',
        name: 'Ofertas da Semana - Eletrônicos',
        subject: '🔥 30% OFF em smartphones selecionados',
        status: 'sent',
        type: 'promotional',
        stats: {
          totalSubscribers: 1250,
          emailsSent: 1250,
          emailsDelivered: 1180,
          emailsOpened: 590,
          emailsClicked: 147,
          unsubscribes: 8,
          bounces: 70,
          openRate: 47.2,
          clickRate: 11.8
        },
        sentAt: '2024-01-20T10:00:00Z',
        createdAt: '2024-01-19T14:30:00Z'
      },
      {
        id: '2',
        name: 'Newsletter Mensal - Janeiro',
        subject: '📰 Novidades e ofertas da VITRINE',
        status: 'scheduled',
        type: 'newsletter',
        stats: {
          totalSubscribers: 1250,
          emailsSent: 0,
          emailsDelivered: 0,
          emailsOpened: 0,
          emailsClicked: 0,
          unsubscribes: 0,
          bounces: 0,
          openRate: 0,
          clickRate: 0
        },
        createdAt: '2024-01-21T09:00:00Z'
      },
      {
        id: '3',
        name: 'Bem-vindo à VITRINE',
        subject: '🎉 Bem-vindo! Comece sua jornada de compras',
        status: 'sent',
        type: 'welcome',
        stats: {
          totalSubscribers: 45,
          emailsSent: 45,
          emailsDelivered: 42,
          emailsOpened: 38,
          emailsClicked: 25,
          unsubscribes: 1,
          bounces: 3,
          openRate: 84.4,
          clickRate: 55.6
        },
        sentAt: '2024-01-18T16:00:00Z',
        createdAt: '2024-01-18T15:30:00Z'
      }
    ];

    setSubscribers(mockSubscribers);
    setCampaigns(mockCampaigns);
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'unsubscribed': return 'bg-red-100 text-red-800';
      case 'bounced': return 'bg-orange-100 text-orange-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'unsubscribed': return 'Cancelado';
      case 'bounced': return 'Bounce';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  const getSourceText = (source: string) => {
    switch (source) {
      case 'popup': return 'Popup';
      case 'footer': return 'Rodapé';
      case 'signup': return 'Cadastro';
      case 'admin': return 'Admin';
      default: return source;
    }
  };

  const getCampaignStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'sending': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCampaignStatusText = (status: string) => {
    switch (status) {
      case 'sent': return 'Enviado';
      case 'scheduled': return 'Agendado';
      case 'sending': return 'Enviando';
      case 'draft': return 'Rascunho';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const getCampaignTypeText = (type: string) => {
    switch (type) {
      case 'newsletter': return 'Newsletter';
      case 'promotional': return 'Promocional';
      case 'announcement': return 'Anúncio';
      case 'welcome': return 'Boas-vindas';
      default: return type;
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-MZ', {
      style: 'currency',
      currency: 'MZN'
    }).format(value);
  };

  const handleExportSubscribers = () => {
    // Mock export functionality
    alert('Exportando lista de assinantes...');
  };

  const handleCreateCampaign = () => {
    router.push('/admin/newsletter/campanhas/novo');
  };

  const handleEditCampaign = (campaignId: string) => {
    router.push(`/admin/newsletter/campanhas/${campaignId}/editar`);
  };

  const handleViewCampaign = (campaignId: string) => {
    router.push(`/admin/newsletter/campanhas/${campaignId}`);
  };

  const handleUnsubscribe = (subscriberId: string) => {
    // Mock unsubscribe functionality
    setSubscribers(prev => prev.map(sub => 
      sub.id === subscriberId 
        ? { ...sub, status: 'unsubscribed' as const }
        : sub
    ));
    alert('Assinante cancelado com sucesso!');
  };

  const handleResubscribe = (subscriberId: string) => {
    // Mock resubscribe functionality
    setSubscribers(prev => prev.map(sub => 
      sub.id === subscriberId 
        ? { ...sub, status: 'active' as const }
        : sub
    ));
    alert('Assinante reativado com sucesso!');
  };

  const stats = {
    totalSubscribers: subscribers.length,
    activeSubscribers: subscribers.filter(s => s.status === 'active').length,
    unsubscribedSubscribers: subscribers.filter(s => s.status === 'unsubscribed').length,
    bouncedSubscribers: subscribers.filter(s => s.status === 'bounced').length,
    totalCampaigns: campaigns.length,
    sentCampaigns: campaigns.filter(c => c.status === 'sent').length,
    scheduledCampaigns: campaigns.filter(c => c.status === 'scheduled').length
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-gray-6 hover:text-gray-9"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-9">Gerenciamento de Newsletter</h1>
            <p className="text-gray-6">Gerencie assinantes e campanhas de email</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-6">Total de Assinantes</p>
                <p className="text-2xl font-bold text-gray-9">{stats.totalSubscribers}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-6">Assinantes Ativos</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeSubscribers}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-6">Campanhas Enviadas</p>
                <p className="text-2xl font-bold text-blue-600">{stats.sentCampaigns}</p>
              </div>
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-6">Campanhas Agendadas</p>
                <p className="text-2xl font-bold text-orange-600">{stats.scheduledCampaigns}</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="subscribers">Assinantes</TabsTrigger>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
        </TabsList>

        <TabsContent value="subscribers" className="space-y-6">
          {/* Subscribers Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Assinantes da Newsletter</CardTitle>
                  <CardDescription>
                    Gerencie a lista de assinantes e suas preferências
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={handleExportSubscribers}>
                    <Download className="w-4 h-4 mr-2" />
                    Exportar
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Buscar por email ou nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Status</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="unsubscribed">Cancelado</SelectItem>
                    <SelectItem value="bounced">Bounce</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Origem" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Origens</SelectItem>
                    <SelectItem value="popup">Popup</SelectItem>
                    <SelectItem value="footer">Rodapé</SelectItem>
                    <SelectItem value="signup">Cadastro</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Subscribers Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-2">
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Assinante</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Origem</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Tags</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Engajamento</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Cadastro</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="border-b border-gray-2 hover:bg-gray-1/50">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-9">
                              {subscriber.firstName && subscriber.lastName 
                                ? `${subscriber.firstName} ${subscriber.lastName}`
                                : 'Nome não informado'
                              }
                            </p>
                            <p className="text-sm text-gray-6">{subscriber.email}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={getStatusColor(subscriber.status)}>
                            {getStatusText(subscriber.status)}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-9">
                            {getSourceText(subscriber.source)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-wrap gap-1">
                            {subscriber.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {subscriber.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{subscriber.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <p className="text-gray-9">
                              {subscriber.stats.emailsOpened}/{subscriber.stats.emailsSent} abertos
                            </p>
                            <p className="text-gray-6">
                              {subscriber.stats.emailsClicked} cliques
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-6">
                            {formatDate(subscriber.createdAt)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            {subscriber.status === 'active' ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUnsubscribe(subscriber.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <UserX className="w-3 h-3 mr-1" />
                                Cancelar
                              </Button>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleResubscribe(subscriber.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <UserCheck className="w-3 h-3 mr-1" />
                                Reativar
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredSubscribers.length === 0 && (
                <div className="text-center py-8">
                  <Mail className="w-12 h-12 text-gray-4 mx-auto mb-4" />
                  <p className="text-gray-6">Nenhum assinante encontrado</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          {/* Campaigns Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Campanhas de Email</CardTitle>
                  <CardDescription>
                    Gerencie campanhas de newsletter e marketing
                  </CardDescription>
                </div>
                <Button onClick={handleCreateCampaign}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Campanha
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Campaigns Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-2">
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Campanha</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Tipo</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Assinantes</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Performance</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Data</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b border-gray-2 hover:bg-gray-1/50">
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-gray-9">{campaign.name}</p>
                            <p className="text-sm text-gray-6">{campaign.subject}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="outline">
                            {getCampaignTypeText(campaign.type)}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={getCampaignStatusColor(campaign.status)}>
                            {getCampaignStatusText(campaign.status)}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-9">
                            {campaign.stats.totalSubscribers.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <p className="text-gray-9">
                              Taxa de abertura: {campaign.stats.openRate}%
                            </p>
                            <p className="text-gray-6">
                              Taxa de clique: {campaign.stats.clickRate}%
                            </p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-6">
                            {campaign.sentAt ? formatDate(campaign.sentAt) : formatDate(campaign.createdAt)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewCampaign(campaign.id)}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Ver
                            </Button>
                            {campaign.status === 'draft' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditCampaign(campaign.id)}
                              >
                                <Edit className="w-3 h-3 mr-1" />
                                Editar
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {campaigns.length === 0 && (
                <div className="text-center py-8">
                  <Mail className="w-12 h-12 text-gray-4 mx-auto mb-4" />
                  <p className="text-gray-6">Nenhuma campanha encontrada</p>
                  <Button onClick={handleCreateCampaign} className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeira Campanha
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
