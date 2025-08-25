'use client';

import React, { useState, useEffect } from 'react';
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
  Filter,
  ArrowLeft,
  MoreHorizontal
} from 'lucide-react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMarketplace } from '@/contexts/MarketplaceContext';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
}

export default function BlogManagementPage() {
  const router = useRouter();
  const { state, dispatch } = useMarketplace();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBlogPosts();
  }, []);

  useEffect(() => {
    filterPosts();
  }, [blogPosts, searchTerm, categoryFilter]);

  const loadBlogPosts = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setBlogPosts(state.blogPosts);
    setIsLoading(false);
  };

  const filterPosts = () => {
    let filtered = blogPosts;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(post => post.category === categoryFilter);
    }

    setFilteredPosts(filtered);
  };

  const handleDeletePost = (postId: string) => {
    if (confirm('Tem certeza que deseja excluir este post?')) {
      dispatch({ type: 'DELETE_BLOG_POST', payload: postId });
      setBlogPosts(prev => prev.filter(post => post.id !== postId));
      alert('Post excluído com sucesso!');
    }
  };

  const handleViewPost = (postId: string) => {
    router.push(`/blog/${postId}`);
  };

  const handleEditPost = (postId: string) => {
    router.push(`/admin/blog/${postId}/editar`);
  };

  const handleCreatePost = () => {
    router.push('/admin/blog/novo');
  };

  const categories = ['all', ...Array.from(new Set(blogPosts.map(post => post.category)))];

  const stats = {
    totalPosts: blogPosts.length,
    publishedPosts: blogPosts.length,
    categories: categories.length - 1, // Exclude 'all'
    totalViews: blogPosts.reduce((sum, post) => sum + Math.floor(Math.random() * 1000), 0)
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

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-9 mb-2">Gerenciamento do Blog</h1>
            <p className="text-gray-6">Gerencie os posts do blog da plataforma</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleCreatePost} className="bg-primary hover:bg-primary-hard text-white">
              <Plus size={16} className="mr-2" />
              Novo Post
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-6">Total de Posts</p>
                <p className="text-2xl font-bold text-gray-9">{stats.totalPosts}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-6">Posts Publicados</p>
                <p className="text-2xl font-bold text-gray-9">{stats.publishedPosts}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-6">Categorias</p>
                <p className="text-2xl font-bold text-gray-9">{stats.categories}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Tag className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-6">Total de Visualizações</p>
                <p className="text-2xl font-bold text-gray-9">{stats.totalViews.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-4 w-4 h-4" />
                <Input
                  placeholder="Buscar posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'Todas as Categorias' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blog Posts List */}
      <Card>
        <CardHeader>
          <CardTitle>Posts do Blog</CardTitle>
          <CardDescription>
            {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} encontrado{filteredPosts.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-4 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-9 mb-2">Nenhum post encontrado</h3>
              <p className="text-gray-6 mb-4">
                {searchTerm || categoryFilter !== 'all' 
                  ? 'Tente ajustar os filtros de busca.' 
                  : 'Comece criando seu primeiro post do blog.'
                }
              </p>
              {!searchTerm && categoryFilter === 'all' && (
                <Button onClick={handleCreatePost} className="bg-primary hover:bg-primary-hard text-white">
                  <Plus size={16} className="mr-2" />
                  Criar Primeiro Post
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-9 truncate">{post.title}</h3>
                      <p className="text-gray-6 text-sm line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-5">
                        <div className="flex items-center space-x-1">
                          <Calendar size={12} />
                          <span>{new Date(post.date).toLocaleDateString('pt-MZ')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User size={12} />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Tag size={12} />
                          <span>{post.category}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewPost(post.id)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Eye size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditPost(post.id)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <Edit size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
