'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Mail,
  FileText,
  Users,
  Tag,
  Calendar,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useUpdateCampaign, useAdminCampaign } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';

export default function EditCampaignPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const campaignId = params.id as string;
  
  const { data: campaign, isLoading } = useAdminCampaign(campaignId);
  const updateCampaign = useUpdateCampaign();

  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    type: 'newsletter' as 'newsletter' | 'promotional' | 'announcement' | 'welcome',
    status: 'draft' as 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled',
    htmlContent: '',
    plainTextContent: '',
    subscriberStatus: 'all' as 'all' | 'active' | 'new',
    tags: [] as string[],
    newTag: '',
    categories: [] as string[],
    newCategory: '',
    frequencies: [] as string[],
    scheduledAt: '',
    timezone: 'Africa/Maputo'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (campaign) {
      setFormData({
        name: campaign.name || '',
        subject: campaign.subject || '',
        type: campaign.type || 'newsletter',
        status: campaign.status || 'draft',
        htmlContent: campaign.content?.html || '',
        plainTextContent: campaign.content?.plainText || '',
        subscriberStatus: campaign.segmentation?.subscriberStatus || 'all',
        tags: campaign.segmentation?.tags || [],
        newTag: '',
        categories: campaign.segmentation?.preferences?.categories || [],
        newCategory: '',
        frequencies: campaign.segmentation?.preferences?.frequency || [],
        scheduledAt: campaign.scheduledAt ? new Date(campaign.scheduledAt).toISOString().slice(0, 16) : '',
        timezone: campaign.timezone || 'Africa/Maputo'
      });
    }
  }, [campaign]);

  const handleAddTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim().toLowerCase())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.newTag.trim().toLowerCase()],
        newTag: ''
      });
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const handleAddCategory = () => {
    if (formData.newCategory.trim() && !formData.categories.includes(formData.newCategory.trim())) {
      setFormData({
        ...formData,
        categories: [...formData.categories, formData.newCategory.trim()],
        newCategory: ''
      });
    }
  };

  const handleRemoveCategory = (category: string) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter(c => c !== category)
    });
  };

  const handleToggleFrequency = (freq: string) => {
    setFormData({
      ...formData,
      frequencies: formData.frequencies.includes(freq)
        ? formData.frequencies.filter(f => f !== freq)
        : [...formData.frequencies, freq]
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Assunto é obrigatório';
    }
    if (!formData.htmlContent.trim()) {
      newErrors.htmlContent = 'Conteúdo HTML é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const updateData: any = {
        name: formData.name,
        subject: formData.subject,
        type: formData.type,
        content: {
          html: formData.htmlContent
        }
      };

      if (formData.plainTextContent) {
        updateData.content.plainText = formData.plainTextContent;
      }

      // Segmentation
      const hasSegmentation = formData.subscriberStatus !== 'all' || 
                             formData.tags.length > 0 || 
                             formData.categories.length > 0 || 
                             formData.frequencies.length > 0;

      if (hasSegmentation) {
        updateData.segmentation = {};
        if (formData.subscriberStatus !== 'all') {
          updateData.segmentation.subscriberStatus = formData.subscriberStatus;
        }
        if (formData.tags.length > 0) {
          updateData.segmentation.tags = formData.tags;
        }
        if (formData.categories.length > 0 || formData.frequencies.length > 0) {
          updateData.segmentation.preferences = {};
          if (formData.categories.length > 0) {
            updateData.segmentation.preferences.categories = formData.categories;
          }
          if (formData.frequencies.length > 0) {
            updateData.segmentation.preferences.frequency = formData.frequencies;
          }
        }
      }

      if (formData.scheduledAt) {
        updateData.scheduledAt = formData.scheduledAt;
      }
      if (formData.timezone) {
        updateData.timezone = formData.timezone;
      }

      await updateCampaign.mutateAsync({ campaignId, data: updateData });
      router.push(`/admin/newsletter/campanhas/${campaignId}`);
    } catch (error: any) {
      // Error is handled by the hook
    }
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

  // Only allow editing draft or scheduled campaigns
  if (campaign.status !== 'draft' && campaign.status !== 'scheduled') {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Mail className="w-12 h-12 text-gray-4 mx-auto mb-4" />
            <p className="text-gray-6">Apenas campanhas em rascunho ou agendadas podem ser editadas</p>
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
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Editar Campanha</h1>
            <p className="text-gray-6">{campaign.name}</p>
          </div>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome da Campanha *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="subject">Assunto do Email *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      className={errors.subject ? 'border-red-500' : ''}
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="type">Tipo</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value: any) => setFormData({...formData, type: value})}
                    >
                      <SelectTrigger>
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
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Conteúdo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="htmlContent">Conteúdo HTML *</Label>
                    <Textarea
                      id="htmlContent"
                      value={formData.htmlContent}
                      onChange={(e) => setFormData({...formData, htmlContent: e.target.value})}
                      rows={10}
                      className={errors.htmlContent ? 'border-red-500' : ''}
                    />
                    {errors.htmlContent && (
                      <p className="text-red-500 text-sm mt-1">{errors.htmlContent}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="plainTextContent">Versão Texto Simples (opcional)</Label>
                    <Textarea
                      id="plainTextContent"
                      value={formData.plainTextContent}
                      onChange={(e) => setFormData({...formData, plainTextContent: e.target.value})}
                      rows={6}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Segmentation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Segmentação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="subscriberStatus">Estado dos Subscritores</Label>
                    <Select 
                      value={formData.subscriberStatus} 
                      onValueChange={(value: any) => setFormData({...formData, subscriberStatus: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="active">Apenas Activos</SelectItem>
                        <SelectItem value="new">Novos (últimos 30 dias)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Tags</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={formData.newTag}
                        onChange={(e) => setFormData({...formData, newTag: e.target.value})}
                        placeholder="Adicionar tag..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                      />
                      <Button type="button" onClick={handleAddTag} variant="outline">
                        Adicionar
                      </Button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label>Categorias de Interesse</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={formData.newCategory}
                        onChange={(e) => setFormData({...formData, newCategory: e.target.value})}
                        placeholder="Adicionar categoria..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                      />
                      <Button type="button" onClick={handleAddCategory} variant="outline">
                        Adicionar
                      </Button>
                    </div>
                    {formData.categories.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.categories.map((category) => (
                          <Badge key={category} variant="secondary" className="flex items-center gap-1">
                            {category}
                            <button
                              type="button"
                              onClick={() => handleRemoveCategory(category)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label>Frequência</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {['daily', 'weekly', 'monthly'].map((freq) => (
                        <Badge
                          key={freq}
                          variant={formData.frequencies.includes(freq) ? 'default' : 'outline'}
                          className="cursor-pointer"
                          onClick={() => handleToggleFrequency(freq)}
                        >
                          {freq === 'daily' ? 'Diária' :
                           freq === 'weekly' ? 'Semanal' : 'Mensal'}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Agendamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="scheduledAt">Data e Hora (opcional)</Label>
                    <Input
                      id="scheduledAt"
                      type="datetime-local"
                      value={formData.scheduledAt}
                      onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="timezone">Fuso Horário</Label>
                    <Input
                      id="timezone"
                      value={formData.timezone}
                      onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-6">Nome:</span>
                    <span className="font-medium">{formData.name || 'Não definido'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Tipo:</span>
                    <span className="font-medium">
                      {formData.type === 'newsletter' ? 'Newsletter' :
                       formData.type === 'promotional' ? 'Promocional' :
                       formData.type === 'announcement' ? 'Anúncio' : 'Boas-vindas'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Estado:</span>
                    <span className="font-medium">
                      {formData.status === 'draft' ? 'Rascunho' :
                       formData.status === 'scheduled' ? 'Agendada' :
                       formData.status === 'sending' ? 'Enviando' :
                       formData.status === 'sent' ? 'Enviada' : 'Cancelada'}
                    </span>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-6">Tags:</span>
                      <span className="font-medium">{formData.tags.length}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={updateCampaign.isPending}
                >
                  {updateCampaign.isPending ? (
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
    </>
  );
}

