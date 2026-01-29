'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Mail,
  User,
  Tag,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useCreateSubscriber } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';

export default function CreateSubscriberPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createSubscriber = useCreateSubscriber();

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    status: 'active' as 'active' | 'unsubscribed' | 'bounced' | 'pending',
    origin: 'admin' as 'popup' | 'footer' | 'signup' | 'admin' | 'import',
    tags: [] as string[],
    newTag: '',
    categories: [] as string[],
    newCategory: '',
    frequency: 'weekly' as 'daily' | 'weekly' | 'monthly',
    promotions: true,
    productUpdates: true,
    blogPosts: true
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
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
      const subscriberData: any = {
        email: formData.email.toLowerCase(),
        status: formData.status,
        origin: formData.origin
      };

      if (formData.firstName) subscriberData.firstName = formData.firstName;
      if (formData.lastName) subscriberData.lastName = formData.lastName;
      if (formData.tags.length > 0) subscriberData.tags = formData.tags;

      if (formData.categories.length > 0 || formData.frequency || formData.promotions !== undefined || formData.productUpdates !== undefined || formData.blogPosts !== undefined) {
        subscriberData.preferences = {};
        if (formData.categories.length > 0) subscriberData.preferences.categories = formData.categories;
        if (formData.frequency) subscriberData.preferences.frequency = formData.frequency;
        subscriberData.preferences.promotions = formData.promotions;
        subscriberData.preferences.productUpdates = formData.productUpdates;
        subscriberData.preferences.blogPosts = formData.blogPosts;
      }

      const newSubscriber = await createSubscriber.mutateAsync(subscriberData);
      router.push(`/admin/newsletter/subscribers/${newSubscriber.id}`);
    } catch (error: any) {
      // Error is handled by the hook
    }
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Adicionar Assinante</h1>
            <p className="text-gray-6">Adicione um novo assinante à newsletter</p>
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
                  <User className="w-5 h-5 mr-2" />
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="email@exemplo.com"
                      className={errors.email ? 'border-red-500' : ''}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Nome</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        placeholder="Nome"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Sobrenome</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        placeholder="Sobrenome"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
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
                          <SelectItem value="active">Ativo</SelectItem>
                          <SelectItem value="pending">Pendente</SelectItem>
                          <SelectItem value="unsubscribed">Desinscrito</SelectItem>
                          <SelectItem value="bounced">Rejeitado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="origin">Origem</Label>
                      <Select 
                        value={formData.origin} 
                        onValueChange={(value: any) => setFormData({...formData, origin: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="popup">Popup</SelectItem>
                          <SelectItem value="footer">Rodapé</SelectItem>
                          <SelectItem value="signup">Cadastro</SelectItem>
                          <SelectItem value="import">Importado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Tag className="w-5 h-5 mr-2" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
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
                    <div className="flex flex-wrap gap-2">
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
              </CardContent>
            </Card>

            {/* Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Preferências</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="frequency">Frequência</Label>
                    <Select 
                      value={formData.frequency} 
                      onValueChange={(value: any) => setFormData({...formData, frequency: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Diária</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="monthly">Mensal</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Promoções</Label>
                        <p className="text-xs text-gray-6">Receber emails promocionais</p>
                      </div>
                      <Switch
                        checked={formData.promotions}
                        onCheckedChange={(checked) => setFormData({...formData, promotions: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Atualizações de Produtos</Label>
                        <p className="text-xs text-gray-6">Receber notificações de novos produtos</p>
                      </div>
                      <Switch
                        checked={formData.productUpdates}
                        onCheckedChange={(checked) => setFormData({...formData, productUpdates: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Posts do Blog</Label>
                        <p className="text-xs text-gray-6">Receber notificações de novos posts</p>
                      </div>
                      <Switch
                        checked={formData.blogPosts}
                        onCheckedChange={(checked) => setFormData({...formData, blogPosts: checked})}
                      />
                    </div>
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
                    <span className="text-gray-6">Email:</span>
                    <span className="font-medium">{formData.email || 'Não definido'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Nome:</span>
                    <span className="font-medium">
                      {formData.firstName && formData.lastName 
                        ? `${formData.firstName} ${formData.lastName}`
                        : formData.firstName || formData.lastName || 'Não definido'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Status:</span>
                    <span className="font-medium">
                      {formData.status === 'active' ? 'Ativo' :
                       formData.status === 'pending' ? 'Pendente' :
                       formData.status === 'unsubscribed' ? 'Desinscrito' : 'Rejeitado'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Origem:</span>
                    <span className="font-medium">
                      {formData.origin === 'admin' ? 'Admin' :
                       formData.origin === 'popup' ? 'Popup' :
                       formData.origin === 'footer' ? 'Rodapé' :
                       formData.origin === 'signup' ? 'Cadastro' : 'Importado'}
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
                  disabled={createSubscriber.isPending}
                >
                  {createSubscriber.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Criando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Criar Assinante
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

