'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, User, Tag, Share2, Heart, MessageCircle, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { useBlogPost } from '@/hooks/useBlog';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.id as string;

  const { data, isLoading, error } = useBlogPost(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Post não encontrado</h1>
          <p className="text-gray-6 mb-8">O post que você está procurando não existe.</p>
          <Link href="/blog">
            <Button className="bg-primary hover:bg-primary-hard text-white">
              <ArrowLeft size={16} className="mr-2" />
              Voltar ao Blog
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const post = data;
  const relatedPosts = data.relatedPosts || [];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / 
          <Link href="/blog" className="hover:text-primary"> Blog</Link> / 
          <span className="text-primary">{post.title}</span>
        </nav>

        {/* Article Header */}
        <article>
          {/* Post Meta */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-6 mb-4">
              <div className="flex items-center space-x-1">
                <Calendar size={14} />
                <span>{new Date(post.publishedAt || post.createdAt).toLocaleDateString('pt-MZ')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <User size={14} />
                <span>{post.authorName}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock size={14} />
                <span>5 min de leitura</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 mb-4">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {post.category}
              </span>
            </div>
          </div>

          {/* Post Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-9 mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Post Excerpt */}
          <p className="text-lg sm:text-xl text-gray-7 mb-8 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Featured Image */}
          <div className="mb-8">
            <img
              src={post.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
              alt={post.title}
              className="w-full h-auto rounded-2xl shadow-lg"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 bg-gray-1 rounded-lg">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-6 hover:text-primary transition-colors">
                <Heart size={16} />
                <span className="text-sm">Curtir</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-6 hover:text-primary transition-colors">
                <MessageCircle size={16} />
                <span className="text-sm">Comentar</span>
              </button>
            </div>
            <button className="flex items-center space-x-2 text-gray-6 hover:text-primary transition-colors">
              <Share2 size={16} />
              <span className="text-sm">Compartilhar</span>
            </button>
          </div>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none mb-12">
            {post.content ? (
              <div 
                className="text-gray-7 leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              <div className="text-gray-7 leading-relaxed space-y-6">
                <p>{post.excerpt}</p>
                <p className="text-gray-6 italic">Conteúdo completo não disponível.</p>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-9 mb-4">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-1 text-gray-7 rounded-full text-sm hover:bg-primary hover:text-white transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Author Info */}
          <div className="bg-gray-1 rounded-lg p-6 mb-12">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User size={24} className="text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-9">{post.authorName}</h3>
                <p className="text-gray-6 text-sm">Autor</p>
                <p className="text-gray-7 text-sm mt-2">
                  Especialista com anos de experiência em {post.category.toLowerCase()}. 
                  Compartilhando conhecimento e dicas valiosas para uma vida mais saudável.
                </p>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-9 mb-6">Posts Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-gray-1 overflow-hidden">
                    <img
                      src={relatedPost.image || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg'}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center space-x-2 text-xs text-gray-6 mb-2">
                      <Calendar size={12} />
                      <span>{new Date(relatedPost.publishedAt || relatedPost.createdAt).toLocaleDateString('pt-MZ')}</span>
                    </div>
                    
                    <h3 className="font-semibold text-gray-9 mb-2 line-clamp-2">
                      <Link href={`/blog/${relatedPost.slug}`} className="hover:text-primary transition-colors">
                        {relatedPost.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-7 text-sm line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Back to Blog Button */}
        <div className="mt-12 text-center">
          <Link href="/blog">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              <ArrowLeft size={16} className="mr-2" />
              Voltar ao Blog
            </Button>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
} 