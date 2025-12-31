'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useCreateCampaign } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';

export default function CreateCampaignPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createCampaign = useCreateCampaign();

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
    if (formData.status === 'scheduled' && !formData.scheduledAt) {
      newErrors.scheduledAt = 'Data e hora são obrigatórias para campanhas agendadas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Erro de validação',
        description: 'Por favor, preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const campaignData: any = {
        name: formData.name.trim(),
        subject: formData.subject.trim(),
        type: formData.type,
        status: formData.status,
        content: {
          html: formData.htmlContent.trim()
        }
      };

      if (formData.plainTextContent && formData.plainTextContent.trim()) {
        campaignData.content.plainText = formData.plainTextContent.trim();
      }

      // Segmentation - only include if there are actual filters
      const hasSegmentation = formData.subscriberStatus !== 'all' || 
                             formData.tags.length > 0 || 
                             formData.categories.length > 0 || 
                             formData.frequencies.length > 0;

      if (hasSegmentation) {
        campaignData.segmentation = {};
        if (formData.subscriberStatus !== 'all') {
          campaignData.segmentation.subscriberStatus = formData.subscriberStatus;
        }
        if (formData.tags.length > 0) {
          campaignData.segmentation.tags = formData.tags;
        }
        if (formData.categories.length > 0 || formData.frequencies.length > 0) {
          campaignData.segmentation.preferences = {};
          if (formData.categories.length > 0) {
            campaignData.segmentation.preferences.categories = formData.categories;
          }
          if (formData.frequencies.length > 0) {
            campaignData.segmentation.preferences.frequency = formData.frequencies;
          }
        }
      }

      // Only include scheduledAt if status is scheduled and date is provided
      if (formData.status === 'scheduled' && formData.scheduledAt) {
        // Convert datetime-local to ISO string
        const date = new Date(formData.scheduledAt);
        if (!isNaN(date.getTime())) {
          campaignData.scheduledAt = date.toISOString();
        }
      }
      // Always include timezone if provided
      if (formData.timezone && formData.timezone.trim()) {
        campaignData.timezone = formData.timezone.trim();
      }

      console.log('Creating campaign with data:', JSON.stringify(campaignData, null, 2));
      
      const newCampaign = await createCampaign.mutateAsync(campaignData);
      
      console.log('Campaign created successfully:', newCampaign);
      
      if (newCampaign && newCampaign.id) {
        router.push(`/admin/newsletter/campanhas/${newCampaign.id}`);
      } else {
        // If no ID, redirect to campaigns list
        router.push('/admin/newsletter?tab=campaigns');
      }
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      // Error is handled by the hook, but we can add additional logging
      if (error?.response) {
        console.error('API Error Response:', error.response.data);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Nova Campanha</h1>
            <p className="text-gray-6">Crie uma nova campanha de email</p>
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
                      placeholder="Ex: Ofertas da Semana"
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
                      placeholder="Ex: 🌿 20% OFF em produtos orgânicos"
                      className={errors.subject ? 'border-red-500' : ''}
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">{errors.subject}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select 
                        value={formData.status} 
                        onValueChange={(value: any) => setFormData({...formData, status: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Rascunho</SelectItem>
                          <SelectItem value="scheduled">Agendada</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                      placeholder="<html><body><h1>Conteúdo da campanha</h1></body></html>"
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
                      placeholder="Versão em texto simples do email"
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
                    <Label htmlFor="subscriberStatus">Status dos Assinantes</Label>
                    <Select 
                      value={formData.subscriberStatus} 
                      onValueChange={(value: any) => setFormData({...formData, subscriberStatus: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="active">Apenas Ativos</SelectItem>
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
                    <Label htmlFor="scheduledAt">
                      Data e Hora {formData.status === 'scheduled' ? '*' : '(opcional)'}
                    </Label>
                    <Input
                      id="scheduledAt"
                      type="datetime-local"
                      value={formData.scheduledAt}
                      onChange={(e) => setFormData({...formData, scheduledAt: e.target.value})}
                      className={errors.scheduledAt ? 'border-red-500' : ''}
                      required={formData.status === 'scheduled'}
                    />
                    {errors.scheduledAt && (
                      <p className="text-red-500 text-sm mt-1">{errors.scheduledAt}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="timezone">Fuso Horário</Label>
                    <Input
                      id="timezone"
                      value={formData.timezone}
                      onChange={(e) => setFormData({...formData, timezone: e.target.value})}
                      placeholder="Africa/Maputo"
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
                    <span className="text-gray-6">Status:</span>
                    <span className="font-medium">
                      {formData.status === 'draft' ? 'Rascunho' : 'Agendada'}
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
                  disabled={createCampaign.isPending}
                >
                  {createCampaign.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Criando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Criar Campanha
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
