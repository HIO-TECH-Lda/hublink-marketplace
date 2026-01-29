'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
import { useUpdateBlogPost, useAdminBlogPost, useAdminUsers } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';
import defaultCategories from '@/lib/blog-categories.json';

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const postId = params.id as string;
  
  const { data: post, isLoading } = useAdminBlogPost(postId);
  const { data: usersData } = useAdminUsers({ limit: 100 });
  const users = usersData?.users || [];
  const updatePost = useUpdateBlogPost();

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
    imagePreview: '',
    authorId: '',
    authorName: '',
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

  useEffect(() => {
    if (post) {
      // Add post category to categories list if it doesn't exist
      if (post.category && !categories.includes(post.category)) {
        setCategories(prev => [...prev, post.category]);
      }
      
      setFormData({
        title: post.title || '',
        slug: post.slug || '',
        excerpt: post.excerpt || '',
        content: post.content || '',
        image: null,
        imagePreview: post.image || '',
        authorId: post.author.id || '',
        authorName: post.author.name || '',
        category: post.category || '',
        tags: post.tags || [],
        newTag: '',
        status: post.status || 'draft',
        isFeatured: post.isFeatured ?? false,
        seoTitle: post.seo?.title || '',
        seoDescription: post.seo?.description || '',
        seoKeywords: post.seo?.keywords || [],
        newSeoKeyword: ''
      });
    }
  }, [post]);

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
      // If new image is uploaded, create FormData
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
        
        await updatePost.mutateAsync({ postId, data: formDataToSend });
        router.push(`/admin/blog/${postId}`);
      } else {
        // No new image, send as JSON
        const updateData: any = {
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          authorId: formData.authorId,
          authorName: formData.authorName,
          category: formData.category,
          status: formData.status,
          isFeatured: formData.isFeatured
        };

        if (formData.excerpt) updateData.excerpt = formData.excerpt;
        if (formData.tags.length > 0) updateData.tags = formData.tags;

        if (formData.seoTitle || formData.seoDescription || formData.seoKeywords.length > 0) {
          updateData.seo = {};
          if (formData.seoTitle) updateData.seo.title = formData.seoTitle;
          if (formData.seoDescription) updateData.seo.description = formData.seoDescription;
          if (formData.seoKeywords.length > 0) updateData.seo.keywords = formData.seoKeywords;
        }

        await updatePost.mutateAsync({ postId, data: updateData });
        router.push(`/admin/blog/${postId}`);
      }
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
            <p className="text-gray-6">Carregando post...</p>
          </div>
        </div>
      </>
    );
  }

  if (!post) {
    return (
      <>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <FileText className="w-12 h-12 text-gray-4 mx-auto mb-4" />
            <p className="text-gray-6">Post não encontrado</p>
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
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Editar Post</h1>
            <p className="text-gray-6">{post.title}</p>
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
                  Informações do Post
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
                      className={errors.slug ? 'border-red-500' : ''}
                    />
                    {errors.slug && (
                      <p className="text-red-500 text-sm mt-1">{errors.slug}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="excerpt">Resumo</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Conteúdo *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      rows={15}
                      className={errors.content ? 'border-red-500' : ''}
                    />
                    {errors.content && (
                      <p className="text-red-500 text-sm mt-1">{errors.content}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Image */}
            <Card>
              <CardHeader>
                <CardTitle>Imagem do Post</CardTitle>
              </CardHeader>
              <CardContent>
                <SingleImageUpload
                  image={formData.image}
                  preview={formData.imagePreview}
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
                    />
                  </div>
                  <div>
                    <Label htmlFor="seoDescription">Meta Descrição</Label>
                    <Textarea
                      id="seoDescription"
                      value={formData.seoDescription}
                      onChange={(e) => setFormData({...formData, seoDescription: e.target.value})}
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
                    <span className="text-gray-6">Status:</span>
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
                  disabled={updatePost.isPending}
                >
                  {updatePost.isPending ? (
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
