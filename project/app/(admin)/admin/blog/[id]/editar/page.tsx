'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Tag,
  User,
  Calendar,
  FileText
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { useMarketplace } from '@/contexts/MarketplaceContext';

interface BlogPostForm {
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  category: string;
  tags: string;
}

export default function EditBlogPostPage() {
  const router = useRouter();
  const params = useParams();
  const { state, dispatch } = useMarketplace();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [post, setPost] = useState<any>(null);
  const [formData, setFormData] = useState<BlogPostForm>({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    author: '',
    category: '',
    tags: ''
  });

  const categories = [
    'Saúde',
    'Cultivo',
    'Receitas',
    'Meio Ambiente',
    'Dicas',
    'Nutrição',
    'Agricultura',
    'Sustentabilidade'
  ];

  useEffect(() => {
    loadPost();
  }, []);

  const loadPost = async () => {
    const postId = params.id as string;
    const foundPost = state.blogPosts.find(p => p.id === postId);
    
    if (!foundPost) {
      alert('Post não encontrado!');
      router.push('/admin/blog');
      return;
    }

    setPost(foundPost);
    setFormData({
      title: foundPost.title,
      excerpt: foundPost.excerpt,
      content: foundPost.content,
      image: foundPost.image,
      author: foundPost.author,
      category: foundPost.category,
      tags: foundPost.tags.join(', ')
    });
    setIsLoading(false);
  };

  const handleInputChange = (field: keyof BlogPostForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.excerpt || !formData.content || !formData.author || !formData.category) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedPost = {
        ...post,
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        image: formData.image || 'https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg',
        author: formData.author,
        category: formData.category,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : []
      };

      dispatch({ type: 'UPDATE_BLOG_POST', payload: updatedPost });
      
      alert('Post atualizado com sucesso!');
      router.push('/admin/blog');
    } catch (error) {
      alert('Erro ao atualizar post. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/blog');
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

  if (!post) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Post não encontrado</h1>
          <p className="text-gray-6 mb-8">O post que você está tentando editar não existe.</p>
          <Button onClick={handleCancel} className="bg-primary hover:bg-primary-hard text-white">
            <ArrowLeft size={16} className="mr-2" />
            Voltar ao Blog
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Editar Post</h1>
            <p className="text-gray-6">Edite as informações do post do blog</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="text-gray-6 hover:text-gray-9"
            >
              <ArrowLeft size={16} className="mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText size={20} />
                  <span>Informações do Post</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-gray-7">
                    Título do Post *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Digite o título do post..."
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt" className="text-sm font-medium text-gray-7">
                    Resumo *
                  </Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => handleInputChange('excerpt', e.target.value)}
                    placeholder="Digite um breve resumo do post..."
                    className="mt-1"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content" className="text-sm font-medium text-gray-7">
                    Conteúdo *
                  </Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Digite o conteúdo completo do post..."
                    className="mt-1"
                    rows={12}
                    required
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publish Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Configurações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="author" className="text-sm font-medium text-gray-7">
                    Autor *
                  </Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-4 w-4 h-4" />
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => handleInputChange('author', e.target.value)}
                      placeholder="Nome do autor"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category" className="text-sm font-medium text-gray-7">
                    Categoria *
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger className="mt-1">
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
                </div>

                <div>
                  <Label htmlFor="tags" className="text-sm font-medium text-gray-7">
                    Tags
                  </Label>
                  <div className="relative mt-1">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-4 w-4 h-4" />
                    <Input
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => handleInputChange('tags', e.target.value)}
                      placeholder="tag1, tag2, tag3"
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-gray-5 mt-1">
                    Separe as tags por vírgula
                  </p>
                </div>

                <ImageUpload
                  value={formData.image}
                  onChange={(value) => handleInputChange('image', value)}
                  label="Imagem do Post"
                  placeholder="Clique para fazer upload da imagem do post"
                />

                <div>
                  <Label className="text-sm font-medium text-gray-7">
                    Data de Criação
                  </Label>
                  <div className="flex items-center space-x-2 mt-1 text-sm text-gray-6">
                    <Calendar size={14} />
                    <span>{new Date(post.date).toLocaleDateString('pt-MZ')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>



            {/* Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-hard text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        Salvar Alterações
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
