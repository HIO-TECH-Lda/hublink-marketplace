'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Mail, 
  Save, 
  ArrowLeft, 
  Eye,
  Calendar,
  Users,
  Tag,
  Settings,
  Send,
  Clock
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { useMarketplace } from '@/contexts/MarketplaceContext';

interface CampaignForm {
  name: string;
  subject: string;
  type: 'newsletter' | 'promotional' | 'announcement' | 'welcome';
  content: string;
  plainText: string;
  segment: {
    tags: string[];
    categories: string[];
    status: 'all' | 'active' | 'new';
  };
  schedule: {
    scheduledAt?: string;
    timezone: string;
  };
}

export default function CreateCampaignPage() {
  const router = useRouter();
  const { state } = useMarketplace();
  const [activeTab, setActiveTab] = useState('content');
  const [isLoading, setIsLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<CampaignForm>({
    name: '',
    subject: '',
    type: 'newsletter',
    content: '',
    plainText: '',
    segment: {
      tags: [],
      categories: [],
      status: 'all'
    },
    schedule: {
      timezone: 'Africa/Maputo'
    }
  });

  const availableTags = [
    'organic', 'vegetables', 'fruits', 'dairy', 'bakery', 'promotional', 
    'new-customer', 'returning-customer', 'high-value', 'inactive'
  ];

  const availableCategories = [
    'vegetables', 'fruits', 'dairy', 'bakery', 'grains', 'beverages', 
    'snacks', 'condiments', 'frozen', 'fresh'
  ];

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [section, key] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...(prev[section as keyof CampaignForm] as any),
          [key]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      segment: {
        ...prev.segment,
        tags: prev.segment.tags.includes(tag)
          ? prev.segment.tags.filter(t => t !== tag)
          : [...prev.segment.tags, tag]
      }
    }));
  };

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      segment: {
        ...prev.segment,
        categories: prev.segment.categories.includes(category)
          ? prev.segment.categories.filter(c => c !== category)
          : [...prev.segment.categories, category]
      }
    }));
  };

  const handleSaveDraft = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    alert('Rascunho salvo com sucesso!');
  };

  const handleSchedule = async () => {
    if (!formData.schedule.scheduledAt) {
      alert('Por favor, selecione uma data e hora para agendar a campanha.');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    alert('Campanha agendada com sucesso!');
    router.push('/admin/newsletter');
  };

  const handleSendNow = async () => {
    if (!formData.name || !formData.subject || !formData.content) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    alert('Campanha enviada com sucesso!');
    router.push('/admin/newsletter');
  };

  const estimatedSubscribers = 1250; // Mock data

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
            <h1 className="text-2xl font-bold text-gray-9">Nova Campanha</h1>
            <p className="text-gray-6">Crie uma nova campanha de newsletter</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Ocultar' : 'Visualizar'}
          </Button>
          <Button variant="outline" onClick={handleSaveDraft} disabled={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            Salvar Rascunho
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Conteúdo</TabsTrigger>
              <TabsTrigger value="segment">Segmentação</TabsTrigger>
              <TabsTrigger value="schedule">Agendamento</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              {/* Campaign Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Detalhes da Campanha</CardTitle>
                  <CardDescription>
                    Configure as informações básicas da campanha
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome da Campanha *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Ex: Ofertas da Semana - Orgânicos"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Assunto do Email *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      placeholder="Ex: 🍃 20% OFF em produtos orgânicos selecionados"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Tipo de Campanha</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newsletter">Newsletter</SelectItem>
                        <SelectItem value="promotional">Promocional</SelectItem>
                        <SelectItem value="announcement">Anúncio</SelectItem>
                        <SelectItem value="welcome">Boas-vindas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Email Content */}
              <Card>
                <CardHeader>
                  <CardTitle>Conteúdo do Email</CardTitle>
                  <CardDescription>
                    Escreva o conteúdo da sua campanha
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="content">Conteúdo HTML *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="Digite o conteúdo HTML da campanha..."
                      className="mt-1 min-h-[300px] font-mono text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="plainText">Versão Texto Simples</Label>
                    <Textarea
                      id="plainText"
                      value={formData.plainText}
                      onChange={(e) => handleInputChange('plainText', e.target.value)}
                      placeholder="Versão em texto simples para compatibilidade..."
                      className="mt-1 min-h-[150px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="segment" className="space-y-6">
              {/* Audience Segmentation */}
              <Card>
                <CardHeader>
                  <CardTitle>Segmentação de Audiência</CardTitle>
                  <CardDescription>
                    Defina quem receberá esta campanha
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>Status do Assinante</Label>
                    <Select 
                      value={formData.segment.status} 
                      onValueChange={(value) => handleInputChange('segment.status', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Assinantes</SelectItem>
                        <SelectItem value="active">Apenas Ativos</SelectItem>
                        <SelectItem value="new">Novos Assinantes (últimos 30 dias)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* <div>
                    <Label>Tags</Label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {availableTags.map((tag) => (
                        <div key={tag} className="flex items-center space-x-2">
                          <Checkbox
                            id={tag}
                            checked={formData.segment.tags.includes(tag)}
                            onCheckedChange={() => handleTagToggle(tag)}
                          />
                          <Label htmlFor={tag} className="text-sm font-normal">
                            {tag}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Categorias de Interesse</Label>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {availableCategories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={category}
                            checked={formData.segment.categories.includes(category)}
                            onCheckedChange={() => handleCategoryToggle(category)}
                          />
                          <Label htmlFor={category} className="text-sm font-normal">
                            {category}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div> */}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6">
              {/* Scheduling */}
              <Card>
                <CardHeader>
                  <CardTitle>Agendamento</CardTitle>
                  <CardDescription>
                    Configure quando a campanha será enviada
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="scheduledAt">Data e Hora de Envio</Label>
                    <Input
                      id="scheduledAt"
                      type="datetime-local"
                      value={formData.schedule.scheduledAt}
                      onChange={(e) => handleInputChange('schedule.scheduledAt', e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="timezone">Fuso Horário</Label>
                    <Select 
                      value={formData.schedule.timezone} 
                      onValueChange={(value) => handleInputChange('schedule.timezone', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Africa/Maputo">Maputo (GMT+2)</SelectItem>
                        <SelectItem value="America/Sao_Paulo">São Paulo (GMT-3)</SelectItem>
                        <SelectItem value="UTC">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Campaign Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo da Campanha</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-7">Nome</p>
                <p className="text-gray-9">{formData.name || 'Não definido'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-7">Assunto</p>
                <p className="text-gray-9">{formData.subject || 'Não definido'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-7">Tipo</p>
                <p className="text-gray-9 capitalize">{formData.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-7">Assinantes Estimados</p>
                <p className="text-gray-9">{estimatedSubscribers.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={handleSendNow} 
                disabled={isLoading}
                className="w-full"
              >
                <Send className="w-4 h-4 mr-2" />
                Enviar Agora
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSchedule} 
                disabled={isLoading}
                className="w-full"
              >
                <Clock className="w-4 h-4 mr-2" />
                Agendar Envio
              </Button>
            </CardContent>
          </Card>

          {/* Preview */}
          {showPreview && (
            <Card>
              <CardHeader>
                <CardTitle>Visualização</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-white">
                  <div className="mb-4">
                    <p className="font-medium text-gray-9">De: Txova &lt;noreply@txova.com&gt;</p>
                    <p className="font-medium text-gray-9">Para: [Assinante]</p>
                    <p className="font-medium text-gray-9">Assunto: {formData.subject || 'Assunto do email'}</p>
                  </div>
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: formData.content || '<p>Conteúdo da campanha aparecerá aqui...</p>' }}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
