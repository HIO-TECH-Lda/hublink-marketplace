'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Mail, 
  ArrowLeft, 
  Edit, 
  TrendingUp,
  Eye,
  MousePointer,
  Users,
  Calendar,
  BarChart3,
  Send,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminCampaign, useUpdateCampaignStatus } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';

export default function CampaignDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const campaignId = params.id as string;
  
  const { data: campaign, isLoading } = useAdminCampaign(campaignId);
  const updateStatus = useUpdateCampaignStatus();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'text-green-600 bg-green-100';
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      case 'sending': return 'text-purple-600 bg-purple-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent': return 'Enviada';
      case 'scheduled': return 'Agendada';
      case 'sending': return 'Enviando';
      case 'draft': return 'Rascunho';
      case 'cancelled': return 'Cancelada';
      default: return status;
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'newsletter': return 'Newsletter';
      case 'promotional': return 'Promocional';
      case 'announcement': return 'Anúncio';
      case 'welcome': return 'Boas-vindas';
      default: return type;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-MZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleUpdateStatus = (status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled') => {
    updateStatus.mutate({ campaignId, status });
  };

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando campanha...</p>
          </div>
        </div>
      </>
    );
  }

  if (!campaign) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Mail className="w-12 h-12 text-gray-4 mx-auto mb-4" />
            <p className="text-gray-6">Campanha não encontrada</p>
            <Button onClick={() => router.back()} className="mt-4">
              Voltar
            </Button>
          </div>
        </div>
      </>
    );
  }

  const stats = campaign.stats || {
    totalSubscribers: campaign.subscribers || 0,
    sent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    bounced: 0,
    unsubscribed: 0,
    deliveryRate: 0,
    openRate: campaign.performance?.openRate || 0,
    clickRate: campaign.performance?.clickRate || 0
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">{campaign.name}</h1>
            <p className="text-gray-6">{campaign.subject}</p>
          </div>
          <div className="flex gap-2">
            {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
              <Button onClick={() => router.push(`/admin/newsletter/campanhas/${campaignId}/editar`)}>
                <Edit className="w-4 h-4 mr-2" />
                Editar
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Estado</CardTitle>
            <Mail className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(campaign.status)}>
              {getStatusText(campaign.status)}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Taxa de Abertura</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">
              {stats.openRate.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-6 mt-1">
              {stats.opened} de {stats.delivered || stats.sent} abertos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Taxa de Cliques</CardTitle>
            <MousePointer className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">
              {stats.clickRate.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-6 mt-1">
              {stats.clicked} cliques
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Subscritores</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">
              {stats.totalSubscribers.toLocaleString()}
            </div>
            <p className="text-xs text-gray-6 mt-1">
              {stats.sent} enviados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Campaign Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Detalhes da Campanha
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-7">Nome</label>
                  <p className="text-gray-9 font-medium">{campaign.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-7">Assunto</label>
                  <p className="text-gray-9">{campaign.subject}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-7">Tipo</label>
                    <Badge variant="outline">{getTypeText(campaign.type)}</Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-7">Estado</label>
                    <div className="mt-1">
                      <Badge className={getStatusColor(campaign.status)}>
                        {getStatusText(campaign.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
                {campaign.scheduledAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-7">Agendada para</label>
                    <p className="text-gray-9">{formatDate(campaign.scheduledAt)}</p>
                  </div>
                )}
                {campaign.sentAt && (
                  <div>
                    <label className="text-sm font-medium text-gray-7">Enviada em</label>
                    <p className="text-gray-9">{formatDate(campaign.sentAt)}</p>
                  </div>
                )}
                {campaign.createdBy && (
                  <div>
                    <label className="text-sm font-medium text-gray-7">Criada por</label>
                    <p className="text-gray-9">{campaign.createdBy.name}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Content Preview */}
          {campaign.content && (
            <Card>
              <CardHeader>
                <CardTitle>Preview do Conteúdo</CardTitle>
              </CardHeader>
              <CardContent>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: campaign.content.html || '' }}
                />
              </CardContent>
            </Card>
          )}

          {/* Segmentation */}
          {campaign.segmentation && (
            <Card>
              <CardHeader>
                <CardTitle>Segmentação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaign.segmentation.subscriberStatus && (
                    <div>
                      <label className="text-sm font-medium text-gray-7">Estado dos Subscritores</label>
                      <p className="text-gray-9">
                        {campaign.segmentation.subscriberStatus === 'all' ? 'Todos' :
                         campaign.segmentation.subscriberStatus === 'active' ? 'Apenas Activos' :
                         campaign.segmentation.subscriberStatus === 'new' ? 'Novos (últimos 30 dias)' :
                         campaign.segmentation.subscriberStatus}
                      </p>
                    </div>
                  )}
                  {campaign.segmentation.tags && campaign.segmentation.tags.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-7">Tags</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {campaign.segmentation.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {campaign.segmentation.preferences && (
                    <div>
                      {campaign.segmentation.preferences.categories && campaign.segmentation.preferences.categories.length > 0 && (
                        <div className="mb-2">
                          <label className="text-sm font-medium text-gray-7">Categorias</label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {campaign.segmentation.preferences.categories.map((category, index) => (
                              <Badge key={index} variant="secondary">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      {campaign.segmentation.preferences.frequency && campaign.segmentation.preferences.frequency.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-gray-7">Frequência</label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {campaign.segmentation.preferences.frequency.map((freq, index) => (
                              <Badge key={index} variant="secondary">
                                {freq === 'daily' ? 'Diária' :
                                 freq === 'weekly' ? 'Semanal' :
                                 freq === 'monthly' ? 'Mensal' : freq}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-6">Total de Subscritores:</span>
                  <span className="font-medium">{stats.totalSubscribers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Enviados:</span>
                  <span className="font-medium">{stats.sent.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Entregues:</span>
                  <span className="font-medium">{stats.delivered.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Abertos:</span>
                  <span className="font-medium">{stats.opened.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Cliques:</span>
                  <span className="font-medium">{stats.clicked.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Rejeitados:</span>
                  <span className="font-medium">{stats.bounced.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Desinscritos:</span>
                  <span className="font-medium">{stats.unsubscribed.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Taxa de Entrega:</span>
                  <span className="font-medium">{stats.deliveryRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Taxa de Abertura:</span>
                  <span className="font-medium">{stats.openRate.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Taxa de Cliques:</span>
                  <span className="font-medium">{stats.clickRate.toFixed(1)}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-6">Criada em:</span>
                  <span className="font-medium text-xs">
                    {formatDate(campaign.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Actualizada em:</span>
                  <span className="font-medium text-xs">
                    {formatDate(campaign.updatedAt)}
                  </span>
                </div>
                {campaign.timezone && (
                  <div className="flex justify-between">
                    <span className="text-gray-6">Fuso Horário:</span>
                    <span className="font-medium text-xs">
                      {campaign.timezone}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          {(campaign.status === 'draft' || campaign.status === 'scheduled') && (
            <Card>
              <CardHeader>
                <CardTitle>Acções</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {campaign.status === 'draft' && (
                  <Button
                    onClick={() => handleUpdateStatus('scheduled')}
                    className="w-full"
                    disabled={updateStatus.isPending}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar Envio
                  </Button>
                )}
                {campaign.status === 'scheduled' && (
                  <Button
                    onClick={() => handleUpdateStatus('cancelled')}
                    variant="outline"
                    className="w-full"
                    disabled={updateStatus.isPending}
                  >
                    Cancelar Agendamento
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
