'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Tag, 
  Save, 
  ArrowLeft, 
  Image as ImageIcon
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useCreateCategory, useAdminCategories } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';

export default function AdminCreateCategoryPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createCategory = useCreateCategory();
  const { data: categoriesData } = useAdminCategories({ limit: 100 });
  const allCategories = categoriesData?.categories || [];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    parentId: '',
    image: '',
    icon: '',
    isActive: true,
    isFeatured: false,
    sortOrder: 0,
    metaTitle: '',
    metaDescription: '',
    keywords: [] as string[],
    newKeyword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Auto-generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: formData.slug || generateSlug(name)
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug é obrigatório';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug deve conter apenas letras minúsculas, números e hífens';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddKeyword = () => {
    if (formData.newKeyword.trim() && !formData.keywords.includes(formData.newKeyword.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, formData.newKeyword.trim()],
        newKeyword: ''
      });
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter(k => k !== keyword)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const categoryData: any = {
        name: formData.name,
        slug: formData.slug,
        isActive: formData.isActive,
        isFeatured: formData.isFeatured
      };

      if (formData.description) categoryData.description = formData.description;
      if (formData.parentId) categoryData.parentId = formData.parentId;
      if (formData.icon) categoryData.icon = formData.icon;
      if (formData.sortOrder) categoryData.sortOrder = formData.sortOrder;
      if (formData.metaTitle) categoryData.metaTitle = formData.metaTitle;
      if (formData.metaDescription) categoryData.metaDescription = formData.metaDescription;
      if (formData.keywords.length > 0) categoryData.keywords = formData.keywords;

      if (formData.image) categoryData.image = formData.image;

      const newCategory = await createCategory.mutateAsync(categoryData);
      router.push(`/admin/categorias/${newCategory.id}`);
    } catch (error: any) {
      // Error is handled by the hook
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Criar Nova Categoria</h1>
            <p className="text-gray-6">Adicione uma nova categoria de produtos</p>
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
                  <Tag className="w-5 h-5 mr-2" />
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nome *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Ex: Frutas"
                      className={errors.name ? 'border-red-500' : ''}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      placeholder="frutas"
                      className={errors.slug ? 'border-red-500' : ''}
                    />
                    {errors.slug && (
                      <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                    )}
                    <p className="text-xs text-gray-6 mt-1">
                      URL-friendly identifier (gerado automaticamente se deixado em branco)
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Descreva a categoria..."
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Image */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Imagem da Categoria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Label htmlFor="image">URL da Imagem</Label>
                  <Input
                    id="image"
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="https://example.com/categoria.jpg"
                  />
                  {formData.image && (
                    <div className="mt-4">
                      <img 
                        src={formData.image} 
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="parentId">Categoria Pai</Label>
                    <Select 
                      value={formData.parentId || 'none'} 
                      onValueChange={(value) => setFormData({...formData, parentId: value === 'none' ? '' : value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Nenhuma (Categoria Principal)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhuma (Categoria Principal)</SelectItem>
                        {allCategories
                          .filter(cat => cat.id !== formData.parentId)
                          .map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="icon">Ícone</Label>
                    <Input
                      id="icon"
                      value={formData.icon}
                      onChange={(e) => setFormData({...formData, icon: e.target.value})}
                      placeholder="tag"
                    />
                    <p className="text-xs text-gray-6 mt-1">
                      Nome do ícone (ex: tag, package, etc.)
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="sortOrder">Ordem de Exibição</Label>
                    <Input
                      id="sortOrder"
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData({...formData, sortOrder: parseInt(e.target.value) || 0})}
                      min="0"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Ativo</Label>
                      <p className="text-xs text-gray-6">Categoria visível na plataforma</p>
                    </div>
                    <Switch
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Em Destaque</Label>
                      <p className="text-xs text-gray-6">Exibir na página inicial</p>
                    </div>
                    <Switch
                      checked={formData.isFeatured}
                      onCheckedChange={(checked) => setFormData({...formData, isFeatured: checked})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card>
              <CardHeader>
                <CardTitle>SEO (Opcional)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="metaTitle">Meta Título</Label>
                    <Input
                      id="metaTitle"
                      value={formData.metaTitle}
                      onChange={(e) => setFormData({...formData, metaTitle: e.target.value})}
                      placeholder="Frutas - Txova"
                    />
                  </div>
                  <div>
                    <Label htmlFor="metaDescription">Meta Descrição</Label>
                    <Textarea
                      id="metaDescription"
                      value={formData.metaDescription}
                      onChange={(e) => setFormData({...formData, metaDescription: e.target.value})}
                      placeholder="Compre frutas frescas..."
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="keywords">Palavras-chave</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        id="keywords"
                        value={formData.newKeyword}
                        onChange={(e) => setFormData({...formData, newKeyword: e.target.value})}
                        placeholder="Adicionar palavra-chave..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                      />
                      <Button type="button" onClick={handleAddKeyword} variant="outline">
                        Adicionar
                      </Button>
                    </div>
                    {formData.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.keywords.map((keyword) => (
                          <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                            {keyword}
                            <button
                              type="button"
                              onClick={() => handleRemoveKeyword(keyword)}
                              className="ml-1 hover:text-red-500"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
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
                    <span className="text-gray-6">Slug:</span>
                    <span className="font-medium font-mono">{formData.slug || 'Não definido'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Status:</span>
                    <span className="font-medium">
                      {formData.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Em Destaque:</span>
                    <span className="font-medium">
                      {formData.isFeatured ? 'Sim' : 'Não'}
                    </span>
                  </div>
                  {formData.parentId && (
                    <div className="flex justify-between">
                      <span className="text-gray-6">Categoria Pai:</span>
                      <span className="font-medium">
                        {allCategories.find(c => c.id === formData.parentId)?.name || 'N/A'}
                      </span>
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
                  disabled={createCategory.isPending}
                >
                  {createCategory.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Criando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Criar Categoria
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

