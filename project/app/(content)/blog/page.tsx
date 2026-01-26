'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight, Filter, Loader2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useBlogPosts, useBlogCategories, useBlogTags, BlogPost } from '@/hooks/useBlog';

export default function BlogListPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSidebar, setShowSidebar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: postsData, isLoading: postsLoading } = useBlogPosts({
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    page: currentPage,
    limit: 10,
    sortBy: 'publishedAt',
    sortOrder: 'desc',
  });

  const { data: categories = [], isLoading: categoriesLoading } = useBlogCategories();
  const { data: tags = [], isLoading: tagsLoading } = useBlogTags();

  const posts = postsData?.posts || [];
  const pagination = postsData ? {
    page: postsData.page,
    limit: postsData.limit,
    total: postsData.total,
    totalPages: postsData.totalPages
  } : undefined;
  const recentPosts = posts.slice(0, 5).filter(post => post && post.authorName);

  return (
    <div className="min-h-screen bg-gray-1 overflow-x-hidden">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / 
          <span className="text-primary"> Blog</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-9 mb-2">Nosso Blog</h1>
            <p className="text-gray-6 text-sm sm:text-base">Dicas, receitas e novidades sobre alimentos orgânicos</p>
          </div>
          
          {/* Mobile Filter Button */}
          <div className="lg:hidden mt-4">
            <Button
              onClick={() => setShowSidebar(!showSidebar)}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              <Filter size={16} className="mr-2" />
              Filtrar
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar */}
          <div className={`lg:col-span-1 ${showSidebar ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 space-y-6 lg:space-y-8">
              {/* Categories */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-9 mb-3 sm:mb-4">Principais Categorias</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                      selectedCategory === 'all'
                        ? 'bg-primary text-white'
                        : 'text-gray-7 hover:bg-gray-1'
                    }`}
                  >
                    Todas as Categorias
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                        selectedCategory === category
                          ? 'bg-primary text-white'
                          : 'text-gray-7 hover:bg-gray-1'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Tags */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-9 mb-3 sm:mb-4">Tags Populares</h3>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 10).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 sm:px-3 py-1 bg-gray-1 text-gray-7 text-xs sm:text-sm rounded-full hover:bg-primary hover:text-white cursor-pointer transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recent Posts */}
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-9 mb-3 sm:mb-4">Adicionados Recentemente</h3>
                <div className="space-y-3 sm:space-y-4">
                  {recentPosts.length > 0 ? (
                    recentPosts.map((post) => (
                      <div key={post.id} className="flex space-x-3">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-1 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={post.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-9 text-xs sm:text-sm line-clamp-2 mb-1">
                            <Link href={`/blog/${post.slug}`} className="hover:text-primary">
                              {post.title}
                            </Link>
                          </h4>
                          <p className="text-xs text-gray-6">
                            {new Date(post.publishedAt || post.createdAt).toLocaleDateString('pt-MZ')}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-6">Nenhum post recente disponível.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Filter (Desktop) */}
            <div className="hidden lg:block mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm ${
                    selectedCategory === 'all'
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-7 hover:bg-gray-1 border border-gray-2'
                  }`}
                >
                  Todas
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm ${
                      selectedCategory === category
                        ? 'bg-primary text-white'
                        : 'bg-white text-gray-7 hover:bg-gray-1 border border-gray-2'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Loading State */}
            {postsLoading && (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}

            {/* Blog Posts Grid */}
            {!postsLoading && posts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {posts.filter((post): post is BlogPost => !!post && !!post.id && !!post.slug).map((post) => (
                  <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gray-1 overflow-hidden">
                      <img
                        src={post.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
                        alt={post.title || 'Blog post'}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 sm:p-6">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-6 mb-3">
                        <div className="flex items-center space-x-1">
                          <Calendar size={12} className="sm:w-3.5 sm:h-3.5" />
                          <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString('pt-MZ')}</span>
                        </div>
                        {post.authorName && (
                          <div className="flex items-center space-x-1">
                            <User size={12} className="sm:w-3.5 sm:h-3.5" />
                            <span className="truncate">{post.authorName}</span>
                          </div>
                        )}
                      </div>
                      
                      <h2 className="text-lg sm:text-xl font-bold text-gray-9 mb-3 line-clamp-2">
                        <Link href={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                          {post.title}
                        </Link>
                      </h2>
                      
                      {post.excerpt && (
                        <p className="text-gray-7 mb-4 line-clamp-3 text-sm sm:text-base">
                          {post.excerpt}
                        </p>
                      )}
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {(post.tags || []).slice(0, 2).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-1 text-gray-7 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <Link href={`/blog/${post.slug}`}>
                          <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white w-full sm:w-auto">
                            Ler Mais
                            <ArrowRight size={14} className="ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!postsLoading && posts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-2 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar size={24} className="sm:w-8 sm:h-8 text-gray-6" />
                </div>
                <h3 className="text-base sm:text-lg font-medium text-gray-9 mb-2">Nenhum post encontrado</h3>
                <p className="text-gray-6 mb-6 text-sm sm:text-base">Não encontramos posts para a categoria selecionada.</p>
                <Button
                  onClick={() => setSelectedCategory('all')}
                  className="bg-primary hover:bg-primary-hard text-white"
                >
                  Ver Todos os Posts
                </Button>
              </div>
            )}

            {/* Pagination */}
            {!postsLoading && posts.length > 0 && pagination && (
              <div className="mt-8 flex justify-center">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-gray-3 text-gray-7 hover:bg-gray-1"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  >
                    Anterior
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button 
                          key={pageNum}
                          size="sm" 
                          className={currentPage === pageNum ? "bg-primary text-white" : ""}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-gray-3 text-gray-7 hover:bg-gray-1"
                    disabled={currentPage >= pagination.totalPages}
                    onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 