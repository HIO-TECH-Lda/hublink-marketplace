'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Mail, 
  Edit, 
  ArrowLeft, 
  Calendar,
  User,
  Tag,
  TrendingUp,
  Eye,
  UserCheck,
  UserX,
  Globe,
  Monitor
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminSubscriber, useUpdateSubscriberStatus } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';

export default function SubscriberDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const subscriberId = params.id as string;
  
  const { data: subscriber, isLoading } = useAdminSubscriber(subscriberId);
  const updateStatus = useUpdateSubscriberStatus();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'unsubscribed': return 'text-red-600 bg-red-100';
      case 'bounced': return 'text-orange-600 bg-orange-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-MZ', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleUpdateStatus = (status: 'active' | 'unsubscribed' | 'bounced' | 'pending') => {
    updateStatus.mutate({ subscriberId, status });
  };

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-6">Carregando assinante...</p>
          </div>
        </div>
      </>
    );
  }

  if (!subscriber) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Mail className="w-12 h-12 text-gray-4 mx-auto mb-4" />
            <p className="text-gray-6">Assinante não encontrado</p>
            <Button onClick={() => router.back()} className="mt-4">
              Voltar
            </Button>
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
            <h1 className="text-3xl font-bold text-gray-9 mb-2">{subscriber.email}</h1>
            {subscriber.fullName && (
              <p className="text-gray-6">{subscriber.fullName}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.push(`/admin/newsletter/subscribers/${subscriberId}/editar`)}>
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Status</CardTitle>
            <Mail className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(subscriber.status)}>
              {getStatusText(subscriber.status)}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Emails Enviados</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">
              {subscriber.stats?.emailsSent || subscriber.engagement?.emailsSent || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Taxa de Abertura</CardTitle>
            <Eye className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">
              {subscriber.stats?.openRate || subscriber.engagement?.openRate || '0.0'}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Taxa de Cliques</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">
              {subscriber.stats?.clickRate || subscriber.engagement?.clickRate || '0.0'}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscriber Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Status do Assinante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Badge className={getStatusColor(subscriber.status)}>
                    {getStatusText(subscriber.status)}
                  </Badge>
                  {subscriber.unsubscribedAt && (
                    <p className="text-sm text-gray-6 mt-2">
                      Desinscrito em: {formatDate(subscriber.unsubscribedAt)}
                    </p>
                  )}
                  {subscriber.unsubscribedReason && (
                    <p className="text-sm text-gray-6 mt-1">
                      Motivo: {subscriber.unsubscribedReason}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {subscriber.status !== 'active' && (
                    <Button
                      onClick={() => handleUpdateStatus('active')}
                      disabled={updateStatus.isPending}
                    >
                      <UserCheck className="w-4 h-4 mr-2" />
                      Ativar
                    </Button>
                  )}
                  {subscriber.status !== 'unsubscribed' && (
                    <Button
                      onClick={() => handleUpdateStatus('unsubscribed')}
                      variant="outline"
                      disabled={updateStatus.isPending}
                    >
                      <UserX className="w-4 h-4 mr-2" />
                      Desinscrever
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                Informações de Contato
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-7">Email</label>
                  <p className="text-gray-9 font-medium">{subscriber.email}</p>
                </div>
                {subscriber.firstName && (
                  <div>
                    <label className="text-sm font-medium text-gray-7">Nome</label>
                    <p className="text-gray-9">{subscriber.firstName}</p>
                  </div>
                )}
                {subscriber.lastName && (
                  <div>
                    <label className="text-sm font-medium text-gray-7">Sobrenome</label>
                    <p className="text-gray-9">{subscriber.lastName}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-7">Origem</label>
                  <Badge variant="outline">{getOriginText(subscriber.origin)}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          {subscriber.preferences && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Preferências
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subscriber.preferences.categories && subscriber.preferences.categories.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-7">Categorias</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {subscriber.preferences.categories.map((category, index) => (
                          <Badge key={index} variant="secondary">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {subscriber.preferences.frequency && (
                    <div>
                      <label className="text-sm font-medium text-gray-7">Frequência</label>
                      <p className="text-gray-9">
                        {subscriber.preferences.frequency === 'daily' ? 'Diária' :
                         subscriber.preferences.frequency === 'weekly' ? 'Semanal' :
                         subscriber.preferences.frequency === 'monthly' ? 'Mensal' :
                         subscriber.preferences.frequency}
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-7">Promoções</label>
                      <p className="text-gray-9">{subscriber.preferences.promotions ? 'Sim' : 'Não'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-7">Atualizações de Produtos</label>
                      <p className="text-gray-9">{subscriber.preferences.productUpdates ? 'Sim' : 'Não'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-7">Posts do Blog</label>
                      <p className="text-gray-9">{subscriber.preferences.blogPosts ? 'Sim' : 'Não'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metadata */}
          {subscriber.metadata && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Monitor className="w-5 h-5 mr-2" />
                  Metadados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {subscriber.metadata.ipAddress && (
                    <div>
                      <label className="text-sm font-medium text-gray-7">Endereço IP</label>
                      <p className="text-gray-9">{subscriber.metadata.ipAddress}</p>
                    </div>
                  )}
                  {subscriber.metadata.referrer && (
                    <div>
                      <label className="text-sm font-medium text-gray-7">Referrer</label>
                      <p className="text-gray-9 break-all">{subscriber.metadata.referrer}</p>
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
                  <span className="text-gray-6">Emails Enviados:</span>
                  <span className="font-medium">
                    {subscriber.stats?.emailsSent || subscriber.engagement?.emailsSent || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Emails Abertos:</span>
                  <span className="font-medium">
                    {subscriber.stats?.emailsOpened || subscriber.engagement?.emailsOpened || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Cliques:</span>
                  <span className="font-medium">
                    {subscriber.stats?.emailsClicked || subscriber.engagement?.emailsClicked || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Taxa de Abertura:</span>
                  <span className="font-medium">
                    {subscriber.stats?.openRate || subscriber.engagement?.openRate || '0.0'}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Taxa de Cliques:</span>
                  <span className="font-medium">
                    {subscriber.stats?.clickRate || subscriber.engagement?.clickRate || '0.0'}%
                  </span>
                </div>
                {subscriber.stats?.lastOpened && (
                  <div className="flex justify-between">
                    <span className="text-gray-6">Última Abertura:</span>
                    <span className="font-medium text-xs">
                      {formatDate(subscriber.stats.lastOpened)}
                    </span>
                  </div>
                )}
                {subscriber.stats?.lastClicked && (
                  <div className="flex justify-between">
                    <span className="text-gray-6">Último Clique:</span>
                    <span className="font-medium text-xs">
                      {formatDate(subscriber.stats.lastClicked)}
                    </span>
                  </div>
                )}
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
                  <span className="text-gray-6">Cadastrado em:</span>
                  <span className="font-medium text-xs">
                    {formatDate(subscriber.registeredAt || subscriber.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Atualizado em:</span>
                  <span className="font-medium text-xs">
                    {formatDate(subscriber.updatedAt)}
                  </span>
                </div>
                {subscriber.tags && subscriber.tags.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-7 mb-2 block">Tags</label>
                    <div className="flex flex-wrap gap-2">
                      {subscriber.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

