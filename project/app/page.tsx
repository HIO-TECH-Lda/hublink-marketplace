'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Truck, CreditCard, Headphones, Trophy, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/common/ProductCard';
import NewsletterPopup from '@/components/popups/NewsletterPopup';
import CartPopup from '@/components/popups/CartPopup';
import QuickViewPopup from '@/components/popups/QuickViewPopup';
import { Button } from '@/components/ui/button';
import { useMarketplace } from '@/contexts/MarketplaceContext';

export default function HomePage() {
  const { state } = useMarketplace();

  // Get featured products (first 8 products)
  const featuredProducts = state.products.slice(0, 8);
  const bestSellerProducts = state.products.slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-gray-1 to-green-gray-2 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg')] bg-cover bg-center opacity-10"></div>
        <div className="relative container py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-9 leading-tight">
                Alimentos Orgânicos
                <span className="text-primary block">Frescos e Saudáveis</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-7 leading-relaxed">
                Conectamos você diretamente com produtores locais de alimentos orgânicos. 
                Qualidade garantida, sabor autêntico e nutrição máxima para sua família.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="bg-primary hover:bg-primary-hard text-white px-6 sm:px-8 py-3 sm:py-4">
                  Compre Agora
                  <ArrowRight className="ml-2" size={20} />
                </Button>
                <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white px-6 sm:px-8 py-3 sm:py-4">
                  Seja um Vendedor
                </Button>
              </div>
            </div>
            <div className="relative order-first lg:order-last">
              <div className="aspect-square rounded-full bg-gradient-to-br from-primary/20 to-primary-soft/20 flex items-center justify-center">
                <img
                  src="https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg"
                  alt="Alimentos Orgânicos"
                  className="w-4/5 h-4/5 object-cover rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-1">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Truck className="text-primary" size={32} />
              </div>
              <h3 className="font-semibold text-gray-9">Entrega Grátis</h3>
              <p className="text-sm text-gray-6">Entrega gratuita em pedidos acima de R$ 50</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <CreditCard className="text-primary" size={32} />
              </div>
              <h3 className="font-semibold text-gray-9">Pagamento Seguro</h3>
              <p className="text-sm text-gray-6">Transações 100% seguras</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Headphones className="text-primary" size={32} />
              </div>
              <h3 className="font-semibold text-gray-9">Suporte 24/7</h3>
              <p className="text-sm text-gray-6">Atendimento sempre disponível</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="text-primary" size={32} />
              </div>
              <h3 className="font-semibold text-gray-9">Qualidade Garantida</h3>
              <p className="text-sm text-gray-6">Produtos certificados e frescos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-9 mb-4">Produtos em Destaque</h2>
            <p className="text-gray-6">Descubra nossa seleção especial de produtos orgânicos</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/loja">
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white">
                Ver Todos os Produtos
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-hard">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold">
                Loja de Alimentos Orgânicos
                <span className="block">100% Confiável</span>
              </h2>
              <p className="text-lg text-green-gray-1">
                Nossos produtores são certificados e seguem os mais rigorosos padrões 
                de qualidade para garantir que você receba apenas o melhor.
              </p>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">1000+</div>
                  <div className="text-sm text-green-gray-2">Produtos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-sm text-green-gray-2">Vendedores</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">10k+</div>
                  <div className="text-sm text-green-gray-2">Clientes</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg"
                alt="Alimentos Orgânicos Confiáveis"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Best Seller Products */}
      <section className="py-16 bg-gray-1">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-9 mb-4">Produtos Mais Vendidos</h2>
            <p className="text-gray-6">Os favoritos dos nossos clientes</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellerProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest News/Blog */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-9 mb-4">Últimas Notícias</h2>
            <p className="text-gray-6">Mantenha-se atualizado com dicas e novidades</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={`https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg`}
                  alt="Blog Post"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="text-sm text-gray-5 mb-2">15 de Janeiro, 2024</div>
                  <h3 className="font-semibold text-gray-9 mb-3 line-clamp-2">
                    Benefícios dos Alimentos Orgânicos para a Saúde
                  </h3>
                  <p className="text-gray-6 text-sm mb-4 line-clamp-3">
                    Descubra como os alimentos orgânicos podem transformar sua saúde 
                    e bem-estar com nutrientes mais potentes e livres de agrotóxicos.
                  </p>
                  <Link href="/blog/1" className="text-primary hover:text-primary-hard font-medium text-sm">
                    Ler Mais →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16 bg-gray-1">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-9 mb-4">O Que Nossos Clientes Dizem</h2>
            <p className="text-gray-6">Avaliações reais de clientes satisfeitos</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Maria Silva",
                location: "São Paulo, SP",
                rating: 5,
                comment: "Produtos sempre frescos e de excelente qualidade. A entrega é rápida e o atendimento é impecável!"
              },
              {
                name: "João Santos",
                location: "Rio de Janeiro, RJ",
                rating: 5,
                comment: "Finalmente encontrei um marketplace que conecta diretamente com produtores locais. Recomendo!"
              },
              {
                name: "Ana Costa",
                location: "Belo Horizonte, MG",
                rating: 5,
                comment: "A variedade de produtos orgânicos é incrível. Minha família está mais saudável desde que começamos a comprar aqui."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-warning fill-warning" />
                  ))}
                </div>
                <p className="text-gray-7 mb-4 italic">"{testimonial.comment}"</p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-primary font-semibold">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-9">{testimonial.name}</div>
                    <div className="text-sm text-gray-6">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <NewsletterPopup />
      <CartPopup />
      <QuickViewPopup />
    </div>
  );
}