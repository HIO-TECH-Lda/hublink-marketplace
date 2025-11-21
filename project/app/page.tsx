'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Truck, CreditCard, Headphones, Trophy, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/common/ProductCard';
import SellerCard from '@/components/common/SellerCard';
import NewsletterPopup from '@/components/popups/NewsletterPopup';
import CartPopup from '@/components/popups/CartPopup';
import QuickViewPopup from '@/components/popups/QuickViewPopup';
import { Button } from '@/components/ui/button';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useFeaturedProducts, useBestSellers, useNewArrivals } from '@/hooks/useProducts';

export default function HomePage() {
  const { state } = useMarketplace();

  // Use API hooks for real data
  const { data: featuredProducts, isLoading: featuredLoading } = useFeaturedProducts();
  const { data: bestSellerProducts, isLoading: bestSellerLoading } = useBestSellers();
  const { data: newArrivals, isLoading: newArrivalsLoading } = useNewArrivals();

  // Mock top sellers data
  const topSellers = [
    {
      id: 'seller1',
      businessName: 'Fazenda Verde',
      businessDescription: 'Produtos orgânicos frescos direto da fazenda. Cultivamos com amor e respeito pela natureza.',
      logo: 'https://placehold.co/64x64/00BE27/ffffff?text=FV',
      rating: 4.8,
      reviewCount: 127,
      totalProducts: 15,
      totalSales: 125000,
      location: 'Beira, Sofala',
      isVerified: true,
      isTopSeller: true,
      joinedDate: '2023-06-15'
    },
    {
      id: 'seller2',
      businessName: 'Horta Orgânica Silva',
      businessDescription: 'Especialistas em vegetais orgânicos frescos. Qualidade garantida desde 2020.',
      logo: 'https://placehold.co/64x64/00BE27/ffffff?text=HS',
      rating: 4.9,
      reviewCount: 89,
      totalProducts: 12,
      totalSales: 98000,
      location: 'Maputo, Maputo',
      isVerified: true,
      isTopSeller: true,
      joinedDate: '2020-03-10'
    },
    {
      id: 'seller3',
      businessName: 'Frutas Frescas Costa',
      businessDescription: 'As melhores frutas orgânicas da região. Sabor e qualidade em cada produto.',
      logo: 'https://placehold.co/64x64/00BE27/ffffff?text=FC',
      rating: 4.7,
      reviewCount: 156,
      totalProducts: 18,
      totalSales: 145000,
      location: 'Nampula, Nampula',
      isVerified: true,
      isTopSeller: false,
      joinedDate: '2022-08-22'
    },
    {
      id: 'seller4',
      businessName: 'Grãos Naturais',
      businessDescription: 'Grãos orgânicos de alta qualidade. Nutrição e sabor em cada grão.',
      logo: 'https://placehold.co/64x64/00BE27/ffffff?text=GN',
      rating: 4.6,
      reviewCount: 73,
      totalProducts: 8,
      totalSales: 67000,
      location: 'Beira, Sofala',
      isVerified: true,
      isTopSeller: false,
      joinedDate: '2023-01-15'
    }
  ];

  // Loading state
  if (featuredLoading || bestSellerLoading || newArrivalsLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando produtos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-50 to-blue-100 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg')] bg-cover bg-center opacity-10"></div>
        <div className="relative container py-12 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-9 leading-tight">
                VITRINE
                <span className="text-primary block">Tudo que Você Precisa</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-7 leading-relaxed">
                Marketplace completo com produtos de qualidade em todas as categorias. 
                Eletrônicos, moda, esportes, casa, beleza e muito mais. Tudo em um só lugar.
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
                  src="https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg"
                  alt="VITRINE - Marketplace Completo com Produtos Diversos"
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
              <p className="text-sm text-gray-6">Entrega gratuita em pedidos acima de 500 MZN</p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <CreditCard className="text-primary" size={32} />
              </div>
              <h3 className="font-semibold text-gray-9">Pagamento Seguro</h3>
              <p className="text-sm text-gray-6">M-Pesa, E-Mola e Cartão de Débito</p>
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
            <p className="text-gray-6">Descubra nossa seleção especial de produtos de qualidade</p>
          </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts?.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
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
                VITRINE
                <span className="block">100% Confiável</span>
              </h2>
              <p className="text-lg text-white/90">
                Nossos vendedores são verificados e seguem os mais rigorosos padrões 
                de qualidade para garantir que você receba apenas o melhor.
              </p>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">1000+</div>
                  <div className="text-sm text-white/80">Produtos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">50+</div>
                  <div className="text-sm text-white/80">Vendedores</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">10k+</div>
                  <div className="text-sm text-white/80">Clientes</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
                alt="VITRINE - Marketplace Confiável"
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
              {bestSellerProducts?.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-9 mb-4">Novidades</h2>
            <p className="text-gray-6">Os produtos mais recentes em nossa loja</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals?.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Sellers */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-9 mb-4">Melhores Vendedores</h2>
            <p className="text-gray-6">Conheça os produtores mais confiáveis e bem avaliados</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {topSellers.map((seller) => (
              <SellerCard key={seller.id} seller={seller} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/vendedores">
              <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white">
                Ver Todos os Vendedores
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News/Blog */}
      <section className="py-16 bg-gray-1">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-9 mb-4">Últimas Notícias</h2>
            <p className="text-gray-6">Mantenha-se atualizado com dicas e novidades</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: 1,
                image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg',
                date: '15 de Janeiro, 2024',
                title: 'Como Escolher os Melhores Produtos Online',
                description: 'Dicas essenciais para fazer compras inteligentes e encontrar produtos de qualidade no marketplace.',
                href: '/blog/1'
              },
              {
                id: 2,
                image: 'https://images.pexels.com/photos/3184460/pexels-photo-3184460.jpeg',
                date: '12 de Janeiro, 2024',
                title: 'Tendências de Moda e Tecnologia em 2024',
                description: 'Descubra as últimas tendências em moda, tecnologia e produtos que estão em alta este ano.',
                href: '/blog/2'
              },
              {
                id: 3,
                image: 'https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg',
                date: '10 de Janeiro, 2024',
                title: 'Guia Completo de Compras Online Seguras',
                description: 'Aprenda a proteger suas informações e fazer compras online com segurança e confiança.',
                href: '/blog/3'
              }
            ].map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="text-sm text-gray-5 mb-2">{post.date}</div>
                  <h3 className="font-semibold text-gray-9 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-6 text-sm mb-4 line-clamp-3">
                    {post.description}
                  </p>
                  <Link href={post.href} className="text-primary hover:text-primary-hard font-medium text-sm">
                    Ler Mais →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-9 mb-4">O Que Nossos Clientes Dizem</h2>
            <p className="text-gray-6">Avaliações reais de clientes satisfeitos</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: "Maria Silva",
                location: "Beira, Sofala",
                rating: 5,
                comment: "Produtos sempre frescos e de excelente qualidade. A entrega é rápida e o atendimento é impecável!"
              },
              {
                name: "João Santos",
                location: "Maputo, Maputo",
                rating: 5,
                comment: "Finalmente encontrei um marketplace que conecta diretamente com produtores locais. Recomendo!"
              },
              {
                name: "Ana Costa",
                location: "Nampula, Nampula",
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