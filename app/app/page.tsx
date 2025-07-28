'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Truck, Shield, Award, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import CartPopup from '@/components/CartPopup';
import NewsletterPopup from '@/components/NewsletterPopup';
import { Button } from '@/components/ui/button';
import { mockProducts, mockBlogPosts, mockTestimonials } from '@/data/mockData';

export default function HomePage() {
  const featuredProducts = mockProducts.slice(0, 4);
  const bestSellerProducts = mockProducts.slice(2, 6);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-gray-1 to-green-gray-2 py-16 lg:py-24">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-9 leading-tight">
                Alimentos Orgânicos<br />
                <span className="text-primary">Frescos & Saudáveis</span>
              </h1>
              <p className="text-lg text-gray-7 max-w-md">
                Descontos de até 25% em produtos orgânicos selecionados. 
                Qualidade garantida e entrega rápida na sua casa.
              </p>
              <Button className="bg-primary hover:bg-primary-hard text-white px-8 py-3 text-lg">
                <Link href="/loja">
                  Compre Agora
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <Image
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Alimentos Orgânicos"
                width={600}
                height={500}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-soft rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-9 mb-2">Entrega Grátis</h3>
              <p className="text-gray-6">Frete grátis para compras acima de R$ 100</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-soft rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-9 mb-2">100% Orgânico</h3>
              <p className="text-gray-6">Certificação orgânica em todos os produtos</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-soft rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-gray-9 mb-2">Qualidade Premium</h3>
              <p className="text-gray-6">Produtos selecionados com máxima qualidade</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-1">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-9 mb-4">
              Produtos em Destaque
            </h2>
            <p className="text-gray-6 max-w-2xl mx-auto">
              Descubra nossa seleção especial de produtos orgânicos frescos e saudáveis
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              <Link href="/loja">Ver Todos os Produtos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-16 bg-primary">
        <div className="container">
          <div className="text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Loja de Alimentos Orgânicos 100% Confiável
            </h2>
            <p className="text-lg text-primary-soft mb-8 max-w-2xl mx-auto">
              Mais de 10 anos fornecendo alimentos orgânicos de qualidade premium 
              para famílias em todo o Brasil
            </p>
            <Button className="bg-white text-primary hover:bg-gray-1">
              <Link href="/sobre">Saiba Mais</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-9 mb-4">
              Mais Vendidos
            </h2>
            <p className="text-gray-6 max-w-2xl mx-auto">
              Os produtos favoritos dos nossos clientes
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellerProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest News/Blog */}
      <section className="py-16 bg-gray-1">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-9 mb-4">
              Últimas Notícias
            </h2>
            <p className="text-gray-6 max-w-2xl mx-auto">
              Fique por dentro das novidades sobre alimentação saudável e sustentabilidade
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockBlogPosts.map(post => (
              <article key={post.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={400}
                  height={250}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="text-sm text-primary font-medium mb-2">{post.category}</div>
                  <h3 className="text-xl font-semibold text-gray-9 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-6 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <Link 
                    href={`/blog/${post.id}`}
                    className="text-primary hover:text-primary-hard font-medium inline-flex items-center"
                  >
                    Ler Mais
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              <Link href="/blog">Ver Todos os Posts</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-9 mb-4">
              Depoimentos de Clientes
            </h2>
            <p className="text-gray-6 max-w-2xl mx-auto">
              Veja o que nossos clientes dizem sobre nossos produtos
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockTestimonials.map(testimonial => (
              <div key={testimonial.id} className="bg-gray-1 rounded-lg p-6 text-center">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                />
                <div className="flex justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-warning fill-current" />
                  ))}
                </div>
                <p className="text-gray-7 mb-4 italic">
                  "{testimonial.comment}"
                </p>
                <h4 className="font-semibold text-gray-9">{testimonial.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <CartPopup />
      <NewsletterPopup />
    </div>
  );
}