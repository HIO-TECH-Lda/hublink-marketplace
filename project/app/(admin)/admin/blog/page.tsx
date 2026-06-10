'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FileText, 
  Search, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  Calendar,
  User,
  Tag,
  ArrowLeft,
  MoreVertical,
  TrendingUp,
  BookOpen,
  Archive,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { 
  useAdminBlogStats, 
  useAdminBlogPosts, 
  useAdminBlogCategories,
  useUpdateBlogPostStatus, 
  useDeleteBlogPost,
  useToggleBlogPostFeatured
} from '@/hooks/useAdmin';
import { useToast } from '@/hooks/use-toast';

export default function BlogManagementPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [featuredFilter, setFeaturedFilter] = useState<boolean | undefined>(undefined);
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data: stats, isLoading: statsLoading } = useAdminBlogStats();
  const { data: categoriesData } = useAdminBlogCategories();
  const { data: postsData, isLoading: postsLoading } = useAdminBlogPosts({
    page,
    limit,
    search: searchTerm || undefined,
    status: statusFilter === 'all' ? undefined : statusFilter,
    category: categoryFilter === 'all' ? undefined : categoryFilter,
    isFeatured: featuredFilter,
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const updateStatus = useUpdateBlogPostStatus();
  const deletePost = useDeleteBlogPost();
  const toggleFeatured = useToggleBlogPostFeatured();

  const posts = postsData?.posts || [];
  const categories = categoriesData || [];
  const isLoading = statsLoading || postsLoading;

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
    return new Date(dateString).toLocaleDateString('pt-MZ');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleUpdateStatus = (postId: string, status: 'draft' | 'published' | 'archived') => {
    updateStatus.mutate({ postId, status });
  };

  const handleDeletePost = (postId: string, postTitle: string) => {
    if (confirm(`Tem certeza que deseja eliminar o post "${postTitle}"?`)) {
      deletePost.mutate(postId);
    }
  };

  const handleToggleFeatured = (postId: string, currentStatus: boolean) => {
    toggleFeatured.mutate({ postId, isFeatured: !currentStatus });
  };

  const totalPages = postsData?.totalPages || 1;

  if (isLoading && !postsData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-6">Carregando publicações...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Gestão de Novidades</h1>
            <p className="text-gray-6">Gira as publicações de novidades, dicas, histórias de vendedores, oportunidades, promoções e conteúdos informativos da plataforma Txova.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => router.push('/admin/blog/novo')}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Publicação
            </Button>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-6 mb-1">Total</p>
                  <p className="text-xl font-bold text-gray-9">{stats.total.toLocaleString()}</p>
                </div>
                <FileText className="w-5 h-5 text-gray-4" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-6 mb-1">Publicados</p>
                  <p className="text-xl font-bold text-green-600">{stats.published.toLocaleString()}</p>
                </div>
                <BookOpen className="w-5 h-5 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-6 mb-1">Rascunhos</p>
                  <p className="text-xl font-bold text-yellow-600">{stats.draft.toLocaleString()}</p>
                </div>
                <FileText className="w-5 h-5 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-6 mb-1">Arquivados</p>
                  <p className="text-xl font-bold text-gray-600">{stats.archived.toLocaleString()}</p>
                </div>
                <Archive className="w-5 h-5 text-gray-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-6 mb-1">Visualizações</p>
                  <p className="text-xl font-bold text-blue-600">{stats.totalViews.toLocaleString()}</p>
                </div>
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-6 mb-1">Categorias</p>
                  <p className="text-xl font-bold text-purple-600">{stats.totalCategories.toLocaleString()}</p>
                </div>
                <Tag className="w-5 h-5 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-4 w-4 h-4" />
              <Input
                placeholder="Buscar por título, conteúdo, autor, tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Estados</SelectItem>
                <SelectItem value="published">Publicado</SelectItem>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="archived">Arquivado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={(v) => { setCategoryFilter(v); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Todas categorias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas categorias</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </form>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featuredFilter === true}
                onChange={(e) => {
                  setFeaturedFilter(e.target.checked ? true : undefined);
                  setPage(1);
                }}
                className="w-4 h-4 text-primary rounded"
              />
              <Star className={`w-4 h-4 ${featuredFilter ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`} />
              <span className="text-sm font-medium">Apenas destaques</span>
            </label>
            {(searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || featuredFilter) && (
              <Button 
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                  setFeaturedFilter(undefined);
                  setPage(1);
                }}
              >
                Limpar filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-9">
            Publicações ({postsData?.total || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Publicação</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Autor</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Categoria</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Visualizações</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Publicado em</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-7">Acções</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-3 flex-shrink-0 overflow-hidden">
                          {post.image ? (
                            <img 
                              src={post.image} 
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FileText className="w-6 h-6 text-gray-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-9 truncate">{post.title}</p>
                          {post.excerpt && (
                            <p className="text-sm text-gray-6 line-clamp-1">{post.excerpt}</p>
                          )}
                          {post.isFeatured && (
                            <Badge variant="secondary" className="mt-1 text-xs">
                              Destaque
                            </Badge>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-gray-4 mr-1" />
                        <span className="text-sm text-gray-7">{post.author.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge className={getStatusColor(post.status)}>
                        {getStatusText(post.status)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 text-gray-4 mr-1" />
                        <span className="text-sm text-gray-7">{post.stats.views.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {post.publishedAt ? (
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 text-gray-4 mr-1" />
                          <span className="text-sm text-gray-6">{formatDate(post.publishedAt)}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-5">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => handleToggleFeatured(post.id, post.isFeatured)}
                          disabled={toggleFeatured.isPending}
                          size="sm"
                          variant="ghost"
                          className={`${post.isFeatured ? 'text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'}`}
                          title={post.isFeatured ? 'Remover dos destaques' : 'Marcar como destaque'}
                        >
                          <Star className={`w-4 h-4 ${post.isFeatured ? 'fill-current' : ''}`} />
                        </Button>
                        <Button
                          onClick={() => router.push(`/admin/blog/${post.id}`)}
                          size="sm"
                          variant="outline"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="outline">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/blog/${post.id}/editar`)}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            {post.status !== 'published' && (
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(post.id, 'published')}
                                disabled={updateStatus.isPending}
                              >
                                <BookOpen className="w-4 h-4 mr-2" />
                                Publicar
                              </DropdownMenuItem>
                            )}
                            {post.status !== 'draft' && (
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(post.id, 'draft')}
                                disabled={updateStatus.isPending}
                              >
                                <FileText className="w-4 h-4 mr-2" />
                                Mover para Rascunho
                              </DropdownMenuItem>
                            )}
                            {post.status !== 'archived' && (
                              <DropdownMenuItem
                                onClick={() => handleUpdateStatus(post.id, 'archived')}
                                disabled={updateStatus.isPending}
                              >
                                <Archive className="w-4 h-4 mr-2" />
                                Arquivar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => handleDeletePost(post.id, post.title)}
                              className="text-red-600"
                              disabled={deletePost.isPending}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {posts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-4 mx-auto mb-4" />
            <p className="text-gray-6">Nenhum post encontrado</p>
            {(searchTerm || statusFilter !== 'all' || categoryFilter !== 'all') && (
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                  setPage(1);
                }}
                variant="outline"
                className="mt-4"
              >
                Limpar Filtros
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <p className="text-sm text-gray-6">
            Página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
