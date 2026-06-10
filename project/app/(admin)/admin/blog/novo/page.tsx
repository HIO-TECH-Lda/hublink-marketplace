'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Tag,
  User,
  FileText,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { SingleImageUpload } from '@/components/ui/single-image-upload';
import { useCreateBlogPost, useAdminUsers } from '@/hooks/useAdmin';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import defaultCategories from '@/lib/blog-categories.json';

export default function CreateBlogPostPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const createPost = useCreateBlogPost();
  const { data: usersData } = useAdminUsers({ limit: 100 });
  const users = usersData?.users || [];

  const [categories, setCategories] = useState<string[]>(defaultCategories);
  const [newCategory, setNewCategory] = useState('');

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: null as File | null,
    authorId: user?.id || '',
    authorName: user ? `${user.firstName} ${user.lastName}` : '',
    category: '',
    tags: [] as string[],
    newTag: '',
    status: 'draft' as 'draft' | 'published' | 'archived',
    isFeatured: false,
    seoTitle: '',
    seoDescription: '',
    seoKeywords: [] as string[],
    newSeoKeyword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: formData.slug || generateSlug(title)
    });
  };

  const handleAuthorChange = (authorId: string) => {
    const selectedUser = users.find(u => u.id === authorId);
    setFormData({
      ...formData,
      authorId,
      authorName: selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : ''
    });
  };

  const handleAddTag = () => {
    if (formData.newTag.trim() && !formData.tags.includes(formData.newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, formData.newTag.trim()],
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

  const handleAddSeoKeyword = () => {
    if (formData.newSeoKeyword.trim() && !formData.seoKeywords.includes(formData.newSeoKeyword.trim())) {
      setFormData({
        ...formData,
        seoKeywords: [...formData.seoKeywords, formData.newSeoKeyword.trim()],
        newSeoKeyword: ''
      });
    }
  };

  const handleRemoveSeoKeyword = (keyword: string) => {
    setFormData({
      ...formData,
      seoKeywords: formData.seoKeywords.filter(k => k !== keyword)
    });
  };

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setFormData({ ...formData, category: newCategory.trim() });
      setNewCategory('');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Conteúdo é obrigatório';
    }
    if (!formData.authorId) {
      newErrors.authorId = 'Autor é obrigatório';
    }
    if (!formData.authorName.trim()) {
      newErrors.authorName = 'Nome do autor é obrigatório';
    }
    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }
    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug é obrigatório';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug deve conter apenas letras minúsculas, números e hífens';
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
      // If image is uploaded, create FormData
      if (formData.image) {
        const formDataToSend = new FormData();
        formDataToSend.append('title', formData.title);
        formDataToSend.append('slug', formData.slug);
        formDataToSend.append('content', formData.content);
        formDataToSend.append('authorId', formData.authorId);
        formDataToSend.append('authorName', formData.authorName);
        formDataToSend.append('category', formData.category);
        formDataToSend.append('status', formData.status);
        formDataToSend.append('isFeatured', formData.isFeatured.toString());
        
        if (formData.excerpt) formDataToSend.append('excerpt', formData.excerpt);
        if (formData.tags.length > 0) formDataToSend.append('tags', JSON.stringify(formData.tags));
        
        if (formData.seoTitle || formData.seoDescription || formData.seoKeywords.length > 0) {
          const seo: any = {};
          if (formData.seoTitle) seo.title = formData.seoTitle;
          if (formData.seoDescription) seo.description = formData.seoDescription;
          if (formData.seoKeywords.length > 0) seo.keywords = formData.seoKeywords;
          formDataToSend.append('seo', JSON.stringify(seo));
        }
        
        formDataToSend.append('image', formData.image);
        
        const newPost = await createPost.mutateAsync(formDataToSend);
        router.push(`/admin/blog/${newPost.id}`);
      } else {
        // No image, send as JSON
        const postData: any = {
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          authorId: formData.authorId,
          authorName: formData.authorName,
          category: formData.category,
          status: formData.status,
          isFeatured: formData.isFeatured
        };

        if (formData.excerpt) postData.excerpt = formData.excerpt;
        if (formData.tags.length > 0) postData.tags = formData.tags;

        if (formData.seoTitle || formData.seoDescription || formData.seoKeywords.length > 0) {
          postData.seo = {};
          if (formData.seoTitle) postData.seo.title = formData.seoTitle;
          if (formData.seoDescription) postData.seo.description = formData.seoDescription;
          if (formData.seoKeywords.length > 0) postData.seo.keywords = formData.seoKeywords;
        }

        const newPost = await createPost.mutateAsync(postData);
        router.push(`/admin/blog/${newPost.id}`);
      }
    } catch (error: any) {
      // Error is handled by the hook
    }
  };

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Criar Nova Publicação</h1>
            <p className="text-gray-6">Adicione um novo post ao blog da plataforma</p>
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
                  <FileText className="w-5 h-5 mr-2" />
                  Informações da Publicação
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Ex: Os Benefícios dos Alimentos Orgânicos"
                      className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      placeholder="os-beneficios-dos-alimentos-organicos"
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
                    <Label htmlFor="excerpt">Resumo</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                      placeholder="Breve descrição do post..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Conteúdo *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      placeholder="Conteúdo completo do post em HTML..."
                      rows={15}
                      className={errors.content ? 'border-red-500' : ''}
                    />
                    {errors.content && (
                      <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                    )}
                    <p className="text-xs text-gray-6 mt-1">
                      Use HTML para formatar o conteúdo
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Image */}
            <Card>
              <CardHeader>
                <CardTitle>Imagem da Publicação</CardTitle>
              </CardHeader>
              <CardContent>
                <SingleImageUpload
                  image={formData.image}
                  onChange={(file) => setFormData({...formData, image: file})}
                  label="Imagem"
                />
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
                    <Label htmlFor="seoTitle">Meta Título</Label>
                    <Input
                      id="seoTitle"
                      value={formData.seoTitle}
                      onChange={(e) => setFormData({...formData, seoTitle: e.target.value})}
                      placeholder="Título para SEO"
                    />
                  </div>
                  <div>
                    <Label htmlFor="seoDescription">Meta Descrição</Label>
                    <Textarea
                      id="seoDescription"
                      value={formData.seoDescription}
                      onChange={(e) => setFormData({...formData, seoDescription: e.target.value})}
                      placeholder="Descrição para SEO"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="seoKeywords">Palavras-chave SEO</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        id="seoKeywords"
                        value={formData.newSeoKeyword}
                        onChange={(e) => setFormData({...formData, newSeoKeyword: e.target.value})}
                        placeholder="Adicionar palavra-chave..."
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSeoKeyword())}
                      />
                      <Button type="button" onClick={handleAddSeoKeyword} variant="outline">
                        Adicionar
                      </Button>
                    </div>
                    {formData.seoKeywords.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.seoKeywords.map((keyword) => (
                          <Badge key={keyword} variant="secondary" className="flex items-center gap-1">
                            {keyword}
                            <button
                              type="button"
                              onClick={() => handleRemoveSeoKeyword(keyword)}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
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
            {/* Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Configurações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="authorId">Autor *</Label>
                    <Select 
                      value={formData.authorId} 
                      onValueChange={handleAuthorChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o autor" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.firstName} {user.lastName} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.authorId && (
                      <p className="text-red-500 text-sm mt-1">{errors.authorId}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="authorName">Nome do Autor *</Label>
                    <Input
                      id="authorName"
                      value={formData.authorName}
                      onChange={(e) => setFormData({...formData, authorName: e.target.value})}
                      placeholder="Nome completo do autor"
                      className={errors.authorName ? 'border-red-500' : ''}
                    />
                    {errors.authorName && (
                      <p className="text-red-500 text-sm mt-1">{errors.authorName}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="category">Categoria *</Label>
                    <div className="space-y-2">
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => setFormData({...formData, category: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex gap-2">
                        <Input
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          placeholder="Adicionar nova categoria..."
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCategory())}
                        />
                        <Button 
                          type="button" 
                          onClick={handleAddCategory} 
                          variant="outline"
                          disabled={!newCategory.trim() || categories.includes(newCategory.trim())}
                        >
                          <Tag className="w-4 h-4 mr-1" />
                          Adicionar
                        </Button>
                      </div>
                    </div>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="status">Estado</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value: any) => setFormData({...formData, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Rascunho</SelectItem>
                        <SelectItem value="published">Publicado</SelectItem>
                        <SelectItem value="archived">Arquivado</SelectItem>
                      </SelectContent>
                    </Select>
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

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags</CardTitle>
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

            {/* Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-6">Título:</span>
                    <span className="font-medium">{formData.title || 'Não definido'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Estado:</span>
                    <span className="font-medium">
                      {formData.status === 'published' ? 'Publicado' : 
                       formData.status === 'draft' ? 'Rascunho' : 'Arquivado'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-6">Em Destaque:</span>
                    <span className="font-medium">
                      {formData.isFeatured ? 'Sim' : 'Não'}
                    </span>
                  </div>
                  {formData.category && (
                    <div className="flex justify-between">
                      <span className="text-gray-6">Categoria:</span>
                      <span className="font-medium">{formData.category}</span>
                    </div>
                  )}
                  {formData.tags.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-6">Tags:</span>
                      <span className="font-medium">{formData.tags.length}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={createPost.isPending}
                >
                  {createPost.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Criando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Criar Publicação
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
