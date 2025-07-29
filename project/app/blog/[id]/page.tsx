'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Share2, Facebook, Twitter, Instagram, Send } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useMarketplace } from '@/contexts/MarketplaceContext';

export default function SingleBlogPostPage() {
  const params = useParams();
  const { state } = useMarketplace();
  const [commentForm, setCommentForm] = useState({
    name: '',
    email: '',
    comment: ''
  });

  const post = state.blogPosts.find(p => p.id === params.id);
  const relatedPosts = state.blogPosts
    .filter(p => p.category === post?.category && p.id !== post?.id)
    .slice(0, 3);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-1">
        <Header />
        <div className="container py-16 px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-9 mb-4">Post não encontrado</h1>
          <Link href="/blog">
            <Button className="bg-primary hover:bg-primary-hard text-white">
              Voltar para o Blog
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle comment submission
    console.log('Comment submitted:', commentForm);
    alert('Comentário enviado com sucesso!');
    setCommentForm({ name: '', email: '', comment: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCommentForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleShare = (platform: string) => {
    const url = `${window.location.origin}/blog/${post.id}`;
    const text = `Confira este post incrível: ${post.title}`;
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
        break;
      case 'instagram':
        alert('Para compartilhar no Instagram, copie o link do post e cole na sua história!');
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  // Mock comments
  const comments = [
    {
      id: '1',
      name: 'Maria Silva',
      date: '10 de Janeiro, 2024',
      content: 'Excelente artigo! Muito informativo sobre os benefícios dos alimentos orgânicos.',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
    },
    {
      id: '2',
      name: 'João Santos',
      date: '8 de Janeiro, 2024',
      content: 'Adorei as dicas! Já comecei a implementar algumas mudanças na minha alimentação.',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / 
          <Link href="/blog" className="hover:text-primary"> Blog</Link> / 
          <span className="text-primary">{post.title}</span>
        </nav>

        {/* Back Button */}
        <Link href="/blog" className="inline-flex items-center text-gray-6 hover:text-primary mb-6">
          <ArrowLeft size={16} className="mr-2" />
          Voltar ao Blog
        </Link>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Article Header */}
            <article className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
              <div className="aspect-video bg-gray-1 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6 lg:p-8">
                {/* Meta Information */}
                <div className="flex items-center space-x-6 text-sm text-gray-6 mb-4">
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} />
                    <span>{post.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User size={16} />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                      {post.category}
                    </span>
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-9 mb-6 leading-tight">
                  {post.title}
                </h1>

                {/* Share Buttons */}
                <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-2">
                  <span className="text-sm text-gray-6">Compartilhar:</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="p-2 text-gray-6 hover:text-blue-600 transition-colors"
                      title="Compartilhar no Facebook"
                    >
                      <Facebook size={16} />
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="p-2 text-gray-6 hover:text-blue-400 transition-colors"
                      title="Compartilhar no Twitter"
                    >
                      <Twitter size={16} />
                    </button>
                    <button
                      onClick={() => handleShare('instagram')}
                      className="p-2 text-gray-6 hover:text-pink-600 transition-colors"
                      title="Compartilhar no Instagram"
                    >
                      <Instagram size={16} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="prose max-w-none">
                  <p className="text-lg text-gray-7 leading-relaxed mb-6">
                    {post.content}
                  </p>
                  
                  <p className="text-gray-7 leading-relaxed mb-6">
                    Os alimentos orgânicos são cultivados sem o uso de pesticidas sintéticos, fertilizantes químicos ou organismos geneticamente modificados. 
                    Esta abordagem natural não só beneficia o meio ambiente, mas também resulta em produtos mais nutritivos e saborosos.
                  </p>
                  
                  <h2 className="text-xl font-bold text-gray-9 mb-4">Benefícios dos Alimentos Orgânicos</h2>
                  
                  <p className="text-gray-7 leading-relaxed mb-6">
                    Estudos mostram que alimentos orgânicos contêm níveis mais altos de antioxidantes, vitaminas e minerais essenciais. 
                    Além disso, eles são livres de resíduos de agrotóxicos que podem ser prejudiciais à saúde a longo prazo.
                  </p>
                  
                  <h3 className="text-lg font-bold text-gray-9 mb-3">Como Identificar Produtos Orgânicos</h3>
                  
                  <p className="text-gray-7 leading-relaxed mb-6">
                    Procure por certificações orgânicas reconhecidas e compre de produtores locais confiáveis. 
                    Os produtos orgânicos geralmente têm aparência mais natural e podem ter pequenas imperfeições, 
                    o que é um sinal de que não foram tratados com produtos químicos.
                  </p>
                </div>

                {/* Tags */}
                <div className="mt-8 pt-6 border-t border-gray-2">
                  <h4 className="text-sm font-medium text-gray-9 mb-3">Tags:</h4>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-gray-1 text-gray-7 text-sm rounded-full hover:bg-primary hover:text-white cursor-pointer transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            {/* Comments Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
              <h2 className="text-xl font-bold text-gray-9 mb-6">Comentários ({comments.length})</h2>
              
              {/* Comment Form */}
              <form onSubmit={handleCommentSubmit} className="mb-8">
                <h3 className="text-lg font-medium text-gray-9 mb-4">Deixar um Comentário</h3>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-9 mb-2">
                      Nome *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={commentForm.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-9 mb-2">
                      E-mail *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={commentForm.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-9 mb-2">
                    Comentário *
                  </label>
                  <Textarea
                    id="comment"
                    name="comment"
                    value={commentForm.comment}
                    onChange={handleInputChange}
                    rows={4}
                    required
                    placeholder="Escreva seu comentário aqui..."
                  />
                </div>
                <Button type="submit" className="bg-primary hover:bg-primary-hard text-white">
                  <Send size={16} className="mr-2" />
                  Enviar Comentário
                </Button>
              </form>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="border-b border-gray-2 pb-6 last:border-b-0">
                    <div className="flex items-start space-x-4">
                      <img
                        src={comment.avatar}
                        alt={comment.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-9">{comment.name}</h4>
                          <span className="text-sm text-gray-6">{comment.date}</span>
                        </div>
                        <p className="text-gray-7 leading-relaxed">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
              {/* Related Posts */}
              <div>
                <h3 className="text-lg font-bold text-gray-9 mb-4">Posts Relacionados</h3>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <div key={relatedPost.id} className="flex space-x-3">
                      <div className="w-16 h-16 bg-gray-1 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-9 text-sm line-clamp-2 mb-1">
                          <Link href={`/blog/${relatedPost.id}`} className="hover:text-primary">
                            {relatedPost.title}
                          </Link>
                        </h4>
                        <p className="text-xs text-gray-6">{relatedPost.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-lg font-bold text-gray-9 mb-4">Categorias</h3>
                <div className="space-y-2">
                  {Array.from(new Set(state.blogPosts.map(p => p.category))).map((category) => (
                    <Link
                      key={category}
                      href={`/blog?category=${category}`}
                      className="block px-3 py-2 text-gray-7 hover:text-primary hover:bg-gray-1 rounded-lg transition-colors"
                    >
                      {category}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Popular Tags */}
              <div>
                <h3 className="text-lg font-bold text-gray-9 mb-4">Tags Populares</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-1 text-gray-7 text-sm rounded-full hover:bg-primary hover:text-white cursor-pointer transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="bg-primary/10 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-9 mb-2">Newsletter</h3>
                <p className="text-sm text-gray-7 mb-4">
                  Receba as últimas novidades sobre alimentos orgânicos diretamente no seu e-mail.
                </p>
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Seu e-mail"
                    className="w-full"
                  />
                  <Button className="w-full bg-primary hover:bg-primary-hard text-white">
                    Inscrever-se
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 