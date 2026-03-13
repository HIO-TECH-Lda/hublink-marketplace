'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Mail, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  TrendingUp,
  Calendar,
  ArrowLeft,
  Plus,
  Tag,
  UserCheck,
  UserX,
  MoreVertical,
  Send,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  useAdminNewsletterStats,
  useAdminSubscribers,
  useAdminCampaigns,
  useUpdateSubscriberStatus,
  useDeleteSubscriber,
  useUpdateCampaignStatus,
  useDeleteCampaign
} from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';

export default function NewsletterManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('subscribers');
  
  // Subscribers filters
  const [subscriberSearch, setSubscriberSearch] = useState('');
  const [subscriberStatusFilter, setSubscriberStatusFilter] = useState<string>('all');
  const [subscriberOriginFilter, setSubscriberOriginFilter] = useState<string>('all');
  const [subscriberPage, setSubscriberPage] = useState(1);
  
  // Campaigns filters
  const [campaignSearch, setCampaignSearch] = useState('');
  const [campaignStatusFilter, setCampaignStatusFilter] = useState<string>('all');
  const [campaignTypeFilter, setCampaignTypeFilter] = useState<string>('all');
  const [campaignPage, setCampaignPage] = useState(1);
  
  const limit = 20;

  const { data: stats, isLoading: statsLoading } = useAdminNewsletterStats();
  const { data: subscribersData, isLoading: subscribersLoading } = useAdminSubscribers({
    page: subscriberPage,
    limit,
    search: subscriberSearch || undefined,
    status: subscriberStatusFilter === 'all' ? undefined : subscriberStatusFilter,
    origin: subscriberOriginFilter === 'all' ? undefined : subscriberOriginFilter,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });
  const { data: campaignsData, isLoading: campaignsLoading } = useAdminCampaigns({
    page: campaignPage,
    limit,
    search: campaignSearch || undefined,
    status: campaignStatusFilter === 'all' ? undefined : campaignStatusFilter,
    type: campaignTypeFilter === 'all' ? undefined : campaignTypeFilter,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const updateSubscriberStatus = useUpdateSubscriberStatus();
  const deleteSubscriber = useDeleteSubscriber();
  const updateCampaignStatus = useUpdateCampaignStatus();
  const deleteCampaign = useDeleteCampaign();

  const subscribers = subscribersData?.subscribers || [];
  const campaigns = campaignsData?.campaigns || [];
  const isLoading = statsLoading || subscribersLoading || campaignsLoading;

  const getSubscriberStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'unsubscribed': return 'text-red-600 bg-red-100';
      case 'bounced': return 'text-orange-600 bg-orange-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSubscriberStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Ativo';
      case 'unsubscribed': return 'Desinscrito';
      case 'bounced': return 'Rejeitado';
      case 'pending': return 'Pendente';
      default: return status;
    }
  };

  const getOriginText = (origin: string) => {
    switch (origin) {
      case 'popup': return 'Popup';
      case 'footer': return 'Rodapé';
      case 'signup': return 'Cadastro';
      case 'admin': return 'Admin';
      case 'import': return 'Importado';
      default: return origin;
    }
  };

  const getCampaignStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-green-600 bg-green-100';
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'sending': return 'text-purple-600 bg-purple-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCampaignStatusText = (status: string) => {
    switch (status) {
      case 'sent': return 'Enviada';
      case 'scheduled': return 'Agendada';
      case 'sending': return 'Enviando';
      case 'draft': return 'Rascunho';
      case 'cancelled': return 'Cancelada';
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
    return new Date(dateString).toLocaleDateString('pt-MZ');
  };

  const handleSubscriberSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscriberPage(1);
  };

  const handleCampaignSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCampaignPage(1);
  };

  const handleUpdateSubscriberStatus = (subscriberId: string, status: 'active' | 'unsubscribed' | 'bounced' | 'pending') => {
    updateSubscriberStatus.mutate({ subscriberId, status });
  };

  const handleDeleteSubscriber = (subscriberId: string, email: string) => {
    if (confirm(`Tem certeza que deseja excluir o assinante "${email}"?`)) {
      deleteSubscriber.mutate(subscriberId);
    }
  };

  const handleUpdateCampaignStatus = (campaignId: string, status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled') => {
    updateCampaignStatus.mutate({ campaignId, status });
  };

  const handleDeleteCampaign = (campaignId: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir a campanha "${name}"?`)) {
      deleteCampaign.mutate(campaignId);
    }
  };

  const subscribersTotalPages = subscribersData?.pagination.totalPages || 1;
  const campaignsTotalPages = campaignsData?.pagination.totalPages || 1;

  if (isLoading && !subscribersData && !campaignsData) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Gerenciamento de Newsletter</h1>
            <p className="text-gray-6">Gerencie assinantes e campanhas de email</p>
          </div>
          <div className="flex gap-2">
            {activeTab === 'subscribers' && (
              <Button onClick={() => router.push('/admin/newsletter/subscribers/novo')}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Assinante
              </Button>
            )}
            {activeTab === 'campaigns' && (
              <Button onClick={() => router.push('/admin/newsletter/campanhas/novo')}>
                <Plus className="w-4 h-4 mr-2" />
                Nova Campanha
              </Button>
            )}
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-7 gap-4 sm:gap-6 mb-6">
          <Card>
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-6 mb-1">Total</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-9 break-words">
                    {stats.totalSubscribers.toLocaleString()}
                  </p>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-gray-4" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-6 mb-1">Ativos</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600 break-words">
                    {stats.activeSubscribers.toLocaleString()}
                  </p>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserCheck className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-6 mb-1">Desinscritos</p>
                  <p className="text-xl sm:text-2xl font-bold text-red-600 break-words">
                    {stats.unsubscribed.toLocaleString()}
                  </p>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <UserX className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-6 mb-1">Rejeitados</p>
                  <p className="text-xl sm:text-2xl font-bold text-orange-600 break-words">
                    {stats.bounced.toLocaleString()}
                  </p>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-6 mb-1">Enviadas</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600 break-words">
                    {stats.campaignsSent.toLocaleString()}
                  </p>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Send className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-6 mb-1">Agendadas</p>
                  <p className="text-xl sm:text-2xl font-bold text-purple-600 break-words">
                    {stats.campaignsScheduled.toLocaleString()}
                  </p>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-gray-6 mb-1">Rascunhos</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-600 break-words">
                    {stats.campaignsDraft.toLocaleString()}
                  </p>
                </div>
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="subscribers">Assinantes</TabsTrigger>
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
        </TabsList>

        {/* Subscribers Tab */}
        <TabsContent value="subscribers" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <form onSubmit={handleSubscriberSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-4 w-4 h-4" />
                  <Input
                    placeholder="Buscar por email ou nome..."
                    value={subscriberSearch}
                    onChange={(e) => setSubscriberSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={subscriberStatusFilter} onValueChange={(v) => { setSubscriberStatusFilter(v); setSubscriberPage(1); }}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="unsubscribed">Desinscrito</SelectItem>
                    <SelectItem value="bounced">Rejeitado</SelectItem>
                    <SelectItem value="pending">Pendente</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={subscriberOriginFilter} onValueChange={(v) => { setSubscriberOriginFilter(v); setSubscriberPage(1); }}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Todas origens" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas origens</SelectItem>
                    <SelectItem value="popup">Popup</SelectItem>
                    <SelectItem value="footer">Rodapé</SelectItem>
                    <SelectItem value="signup">Cadastro</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="import">Importado</SelectItem>
                  </SelectContent>
                </Select>
                {(subscriberSearch || subscriberStatusFilter !== 'all' || subscriberOriginFilter !== 'all') && (
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSubscriberSearch('');
                      setSubscriberStatusFilter('all');
                      setSubscriberOriginFilter('all');
                      setSubscriberPage(1);
                    }}
                  >
                    Limpar
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Subscribers Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-9">
                Assinantes ({subscribersData?.pagination.total || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Nome</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Origem</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Engajamento</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Cadastrado em</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <p className="font-medium text-gray-9">{subscriber.email}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-gray-7">{subscriber.fullName || '—'}</p>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={getSubscriberStatusColor(subscriber.status)}>
                            {getSubscriberStatusText(subscriber.status)}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="outline" className="text-xs">
                            {getOriginText(subscriber.origin)}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          {subscriber.engagement ? (
                            <div className="text-sm">
                              <p className="text-gray-7">
                                {subscriber.engagement.openRate}% abertura
                              </p>
                              <p className="text-gray-5 text-xs">
                                {subscriber.engagement.emailsSent} enviados
                              </p>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-5">—</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-gray-6">{formatDate(subscriber.registeredAt || subscriber.createdAt)}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => router.push(`/admin/newsletter/subscribers/${subscriber.id}`)}
                              size="sm"
                              variant="outline"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => router.push(`/admin/newsletter/subscribers/${subscriber.id}/editar`)}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                {subscriber.status !== 'active' && (
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateSubscriberStatus(subscriber.id, 'active')}
                                    disabled={updateSubscriberStatus.isPending}
                                  >
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    Ativar
                                  </DropdownMenuItem>
                                )}
                                {subscriber.status !== 'unsubscribed' && (
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateSubscriberStatus(subscriber.id, 'unsubscribed')}
                                    disabled={updateSubscriberStatus.isPending}
                                  >
                                    <UserX className="w-4 h-4 mr-2" />
                                    Desinscrever
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => handleDeleteSubscriber(subscriber.id, subscriber.email)}
                                  className="text-red-600"
                                  disabled={deleteSubscriber.isPending}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {subscribers.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="w-12 h-12 text-gray-4 mx-auto mb-4" />
                <p className="text-gray-6">Nenhum assinante encontrado</p>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {subscribersTotalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <p className="text-sm text-gray-6">
                Página {subscriberPage} de {subscribersTotalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSubscriberPage(p => Math.max(1, p - 1))}
                  disabled={subscriberPage === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSubscriberPage(p => Math.min(subscribersTotalPages, p + 1))}
                  disabled={subscriberPage === subscribersTotalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <form onSubmit={handleCampaignSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-4 w-4 h-4" />
                  <Input
                    placeholder="Buscar por nome ou assunto..."
                    value={campaignSearch}
                    onChange={(e) => setCampaignSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={campaignStatusFilter} onValueChange={(v) => { setCampaignStatusFilter(v); setCampaignPage(1); }}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os status</SelectItem>
                    <SelectItem value="draft">Rascunho</SelectItem>
                    <SelectItem value="scheduled">Agendada</SelectItem>
                    <SelectItem value="sending">Enviando</SelectItem>
                    <SelectItem value="sent">Enviada</SelectItem>
                    <SelectItem value="cancelled">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={campaignTypeFilter} onValueChange={(v) => { setCampaignTypeFilter(v); setCampaignPage(1); }}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Todos tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos tipos</SelectItem>
                    <SelectItem value="newsletter">Newsletter</SelectItem>
                    <SelectItem value="promotional">Promocional</SelectItem>
                    <SelectItem value="announcement">Anúncio</SelectItem>
                    <SelectItem value="welcome">Boas-vindas</SelectItem>
                  </SelectContent>
                </Select>
                {(campaignSearch || campaignStatusFilter !== 'all' || campaignTypeFilter !== 'all') && (
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setCampaignSearch('');
                      setCampaignStatusFilter('all');
                      setCampaignTypeFilter('all');
                      setCampaignPage(1);
                    }}
                  >
                    Limpar
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Campaigns Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-9">
                Campanhas ({campaignsData?.pagination.total || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Nome</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Assunto</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Tipo</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Performance</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Enviada em</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-7">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {campaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <p className="font-medium text-gray-9">{campaign.name}</p>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-gray-7">{campaign.subject}</p>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant="outline" className="text-xs">
                            {getCampaignTypeText(campaign.type)}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={getCampaignStatusColor(campaign.status)}>
                            {getCampaignStatusText(campaign.status)}
                          </Badge>
                        </td>
                        <td className="py-4 px-4">
                          {campaign.performance ? (
                            <div className="text-sm">
                              <p className="text-gray-7">
                                {campaign.performance.openRate.toFixed(1)}% abertura
                              </p>
                              <p className="text-gray-5 text-xs">
                                {campaign.performance.clickRate.toFixed(1)}% cliques
                              </p>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-5">—</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {campaign.sentAt ? (
                            <span className="text-sm text-gray-6">{formatDate(campaign.sentAt)}</span>
                          ) : (
                            <span className="text-sm text-gray-5">—</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              onClick={() => router.push(`/admin/newsletter/campanhas/${campaign.id}`)}
                              size="sm"
                              variant="outline"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => router.push(`/admin/newsletter/campanhas/${campaign.id}/editar`)}
                                >
                                  <Edit className="w-4 h-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>
                                {campaign.status === 'draft' && (
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateCampaignStatus(campaign.id, 'scheduled')}
                                    disabled={updateCampaignStatus.isPending}
                                  >
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Agendar
                                  </DropdownMenuItem>
                                )}
                                {campaign.status === 'scheduled' && (
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateCampaignStatus(campaign.id, 'cancelled')}
                                    disabled={updateCampaignStatus.isPending}
                                  >
                                    <UserX className="w-4 h-4 mr-2" />
                                    Cancelar
                                  </DropdownMenuItem>
                                )}
                                {(campaign.status === 'draft' || campaign.status === 'cancelled') && (
                                  <DropdownMenuItem
                                    onClick={() => handleDeleteCampaign(campaign.id, campaign.name)}
                                    className="text-red-600"
                                    disabled={deleteCampaign.isPending}
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Excluir
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {campaigns.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Send className="w-12 h-12 text-gray-4 mx-auto mb-4" />
                <p className="text-gray-6">Nenhuma campanha encontrada</p>
              </CardContent>
            </Card>
          )}

          {/* Pagination */}
          {campaignsTotalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <p className="text-sm text-gray-6">
                Página {campaignPage} de {campaignsTotalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCampaignPage(p => Math.max(1, p - 1))}
                  disabled={campaignPage === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCampaignPage(p => Math.min(campaignsTotalPages, p + 1))}
                  disabled={campaignPage === campaignsTotalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </>
  );
}
