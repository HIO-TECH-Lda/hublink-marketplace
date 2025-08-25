'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Mail, 
  ArrowLeft, 
  Edit, 
  Copy,
  TrendingUp,
  Eye,
  MousePointer,
  Users,
  Calendar,
  BarChart3,
  Download
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useMarketplace } from '@/contexts/MarketplaceContext';

interface NewsletterCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
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

export default function CampaignDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { state } = useMarketplace();
  const [campaign, setCampaign] = useState<NewsletterCampaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCampaign();
  }, [params.id]);

  const loadCampaign = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const mockCampaign: NewsletterCampaign = {
      id: params.id as string,
      name: 'Ofertas da Semana - Orgânicos',
      subject: '🍃 20% OFF em produtos orgânicos selecionados',
      content: '<h1>Conteúdo da campanha</h1><p>Este é um exemplo de conteúdo HTML da campanha.</p>',
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
    };

    setCampaign(mockCampaign);
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'sending': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent': return 'Enviado';
      case 'scheduled': return 'Agendado';
      case 'sending': return 'Enviando';
      case 'draft': return 'Rascunho';
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

  if (!campaign) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <Mail className="w-12 h-12 text-gray-4 mx-auto mb-4" />
          <p className="text-gray-6">Campanha não encontrada</p>
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
            <h1 className="text-2xl font-bold text-gray-9">{campaign.name}</h1>
            <p className="text-gray-6">Detalhes da campanha</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.push(`/admin/newsletter/campanhas/${campaign.id}/editar`)}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-6">Status</p>
                <Badge className={getStatusColor(campaign.status)}>
                  {getStatusText(campaign.status)}
                </Badge>
              </div>
              <Mail className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-6">Taxa de Abertura</p>
                <p className="text-2xl font-bold text-green-600">{campaign.stats.openRate}%</p>
              </div>
              <Eye className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-6">Taxa de Clique</p>
                <p className="text-2xl font-bold text-orange-600">{campaign.stats.clickRate}%</p>
              </div>
              <MousePointer className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-6">Assinantes</p>
                <p className="text-2xl font-bold text-blue-600">{campaign.stats.totalSubscribers.toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaign Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Campanha</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-7">Nome</p>
              <p className="text-gray-9">{campaign.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-7">Assunto</p>
              <p className="text-gray-9">{campaign.subject}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-7">Tipo</p>
              <p className="text-gray-9 capitalize">{campaign.type}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-7">Criado em</p>
              <p className="text-gray-9">{formatDate(campaign.createdAt)}</p>
            </div>
            {campaign.sentAt && (
              <div>
                <p className="text-sm font-medium text-gray-7">Enviado em</p>
                <p className="text-gray-9">{formatDate(campaign.sentAt)}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-7">Taxa de Entrega</span>
                <span className="text-gray-9 font-medium">
                  {((campaign.stats.emailsDelivered / campaign.stats.emailsSent) * 100).toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={(campaign.stats.emailsDelivered / campaign.stats.emailsSent) * 100} 
                className="h-2"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-7">Taxa de Abertura</span>
                <span className="text-gray-9 font-medium">{campaign.stats.openRate}%</span>
              </div>
              <Progress value={campaign.stats.openRate} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-7">Taxa de Clique</span>
                <span className="text-gray-9 font-medium">{campaign.stats.clickRate}%</span>
              </div>
              <Progress value={campaign.stats.clickRate} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content Preview */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Visualização do Conteúdo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-white">
            <div className="mb-4">
                              <p className="font-medium text-gray-9">De: VITRINE &lt;noreply@vitrine.com&gt;</p>
              <p className="font-medium text-gray-9">Para: [Assinante]</p>
              <p className="font-medium text-gray-9">Assunto: {campaign.subject}</p>
            </div>
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: campaign.content }}
            />
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
