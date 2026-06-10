'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  FileText, 
  Edit, 
  ArrowLeft, 
  Calendar,
  User,
  Tag,
  Eye,
  TrendingUp,
  Heart,
  Share2,
  BookOpen,
  Archive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAdminBlogPost, useUpdateBlogPostStatus } from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';

export default function BlogPostDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const postId = params.id as string;
  
  const { data: post, isLoading } = useAdminBlogPost(postId);
  const updateStatus = useUpdateBlogPostStatus();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'text-green-600 bg-green-100';
      case 'draft': return 'text-yellow-600 bg-yellow-100';
      case 'archived': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'published': return 'Publicado';
      case 'draft': return 'Rascunho';
      case 'archived': return 'Arquivado';
      default: return status;
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

  const handleUpdateStatus = (status: 'draft' | 'published' | 'archived') => {
    updateStatus.mutate({ postId, status });
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
            <p className="text-gray-6">Publicação não encontrada</p>
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
            <h1 className="text-3xl font-bold text-gray-9 mb-2">{post.title}</h1>
            {post.excerpt && (
              <p className="text-gray-6">{post.excerpt}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.push(`/admin/blog/${postId}/editar`)}>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Estado</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <Badge className={getStatusColor(post.status)}>
              {getStatusText(post.status)}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Visualizações</CardTitle>
            <Eye className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">{post.stats.views.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Curtidas</CardTitle>
            <Heart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">{post.stats.likes.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-6">Compartilhamentos</CardTitle>
            <Share2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-9">{post.stats.shares.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Post Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Estado da Publicação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Badge className={getStatusColor(post.status)}>
                    {getStatusText(post.status)}
                  </Badge>
                  {post.publishedAt && (
                    <p className="text-sm text-gray-6 mt-2">
                      Publicado em: {formatDate(post.publishedAt)}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  {post.status !== 'published' && (
                    <Button
                      onClick={() => handleUpdateStatus('published')}
                      disabled={updateStatus.isPending}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Publicar
                    </Button>
                  )}
                  {post.status !== 'draft' && (
                    <Button
                      onClick={() => handleUpdateStatus('draft')}
                      variant="outline"
                      disabled={updateStatus.isPending}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Mover para Rascunho
                    </Button>
                  )}
                  {post.status !== 'archived' && (
                    <Button
                      onClick={() => handleUpdateStatus('archived')}
                      variant="outline"
                      disabled={updateStatus.isPending}
                    >
                      <Archive className="w-4 h-4 mr-2" />
                      Arquivar
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Post Content */}
          {post.image && (
            <Card>
              <CardContent className="p-0">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-64 object-cover rounded-t-lg"
                />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Conteúdo</CardTitle>
            </CardHeader>
            <CardContent>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </CardContent>
          </Card>

          {/* SEO Information */}
          {post.seo && (
            <Card>
              <CardHeader>
                <CardTitle>SEO</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {post.seo.title && (
                    <div>
                      <label className="text-sm font-medium text-gray-7">Meta Título</label>
                      <p className="text-gray-9">{post.seo.title}</p>
                    </div>
                  )}
                  {post.seo.description && (
                    <div>
                      <label className="text-sm font-medium text-gray-7">Meta Descrição</label>
                      <p className="text-gray-9">{post.seo.description}</p>
                    </div>
                  )}
                  {post.seo.keywords && post.seo.keywords.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-7">Palavras-chave</label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {post.seo.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
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
              <CardTitle>Informações</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-7">Autor</label>
                  <div className="flex items-center mt-1">
                    <User className="w-4 h-4 text-gray-4 mr-2" />
                    <p className="text-gray-9">{post.author.name}</p>
                  </div>
                  {post.author.email && (
                    <p className="text-sm text-gray-6 mt-1">{post.author.email}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-7">Categoria</label>
                  <div className="flex items-center mt-1">
                    <Tag className="w-4 h-4 text-gray-4 mr-2" />
                    <Badge variant="outline">{post.category}</Badge>
                  </div>
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-7">Tags</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {post.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-7">Criado em</label>
                  <div className="flex items-center mt-1">
                    <Calendar className="w-4 h-4 text-gray-4 mr-2" />
                    <p className="text-gray-9">{formatDate(post.createdAt)}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-7">Actualizado em</label>
                  <div className="flex items-center mt-1">
                    <Calendar className="w-4 h-4 text-gray-4 mr-2" />
                    <p className="text-gray-9">{formatDate(post.updatedAt)}</p>
                  </div>
                </div>
                {post.isFeatured && (
                  <div>
                    <Badge variant="secondary">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Em Destaque
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estatísticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-6">Visualizações:</span>
                  <span className="font-medium">{post.stats.views.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Curtidas:</span>
                  <span className="font-medium">{post.stats.likes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-6">Compartilhamentos:</span>
                  <span className="font-medium">{post.stats.shares.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

