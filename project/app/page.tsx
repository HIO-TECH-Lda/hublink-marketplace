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

export default function HomePage() {
  const { state } = useMarketplace();

  // Get featured products (first 8 products)
  const featuredProducts = state.products.slice(0, 8);
  const bestSellerProducts = state.products.slice(0, 4);

  // Mock top sellers data
  const topSellers = [
    {
      id: 'seller1',
      businessName: 'TechStore',
      businessDescription: 'Especialistas em tecnologia e eletrônicos. Os melhores produtos com os melhores preços.',
      logo: 'https://placehold.co/64x64/2563EB/ffffff?text=TS',
      rating: 4.8,
      reviewCount: 127,
      totalProducts: 45,
      totalSales: 125000,
      location: 'Beira, Sofala',
      isVerified: true,
      isTopSeller: true,
      joinedDate: '2023-06-15'
    },
    {
      id: 'seller2',
      businessName: 'AudioPro',
      businessDescription: 'Produtos de áudio de alta qualidade. Som profissional para todos os gostos.',
      logo: 'https://placehold.co/64x64/2563EB/ffffff?text=AP',
      rating: 4.9,
      reviewCount: 89,
      totalProducts: 32,
      totalSales: 98000,
      location: 'Maputo, Maputo',
      isVerified: true,
      isTopSeller: true,
      joinedDate: '2020-03-10'
    },
    {
      id: 'seller3',
      businessName: 'SportStore',
      businessDescription: 'Equipamentos esportivos e roupas para todos os tipos de atividade física.',
      logo: 'https://placehold.co/64x64/2563EB/ffffff?text=SS',
      rating: 4.7,
      reviewCount: 156,
      totalProducts: 58,
      totalSales: 145000,
      location: 'Nampula, Nampula',
      isVerified: true,
      isTopSeller: false,
      joinedDate: '2022-08-22'
    },
    {
      id: 'seller4',
      businessName: 'BookStore',
      businessDescription: 'Livros, perfumes e produtos de beleza. Qualidade e variedade em um só lugar.',
      logo: 'https://placehold.co/64x64/2563EB/ffffff?text=BS',
      rating: 4.6,
      reviewCount: 73,
      totalProducts: 28,
      totalSales: 67000,
      location: 'Beira, Sofala',
      isVerified: true,
      isTopSeller: false,
      joinedDate: '2023-01-15'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-gray-1 to-blue-gray-2 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg')] bg-cover bg-center opacity-10"></div>
        <div className="relative container py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-9 leading-tight">
                VITRINE
                <span className="text-primary block">Tudo que Você Precisa</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-7 leading-relaxed">
                Encontre produtos de qualidade em todas as categorias: eletrônicos, moda, esportes, casa e muito mais. 
                Milhares de vendedores confiáveis, preços competitivos e entrega rápida.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="bg-primary hover:bg-primary-hard text-white px-6 sm:px-8 py-3 sm:py-4">
                  Compre Agora
                  <ArrowRight className="ml-2" size={20} />
                </Button>
                <Link href="/seja-vendedor">
                  <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white px-6 sm:px-8 py-3 sm:py-4">
                    Seja um Vendedor
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative order-first lg:order-last">
              <div className="aspect-square rounded-full bg-gradient-to-br from-primary/20 to-primary-soft/20 flex items-center justify-center">
                <img
                  src="https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg"
                  alt="Marketplace Completo"
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
              <h3 className="font-semibold text-gray-9">Entrega Rápida</h3>
              <p className="text-sm text-gray-6">Entrega em até 24h em pedidos acima de 1000 MZN</p>
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
              <p className="text-sm text-gray-6">Produtos verificados e vendedores confiáveis</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-9 mb-4">Produtos em Destaque</h2>
            <p className="text-gray-6">Descubra nossa seleção especial de produtos em todas as categorias</p>
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
                VITRINE
                <span className="block">100% Seguro</span>
              </h2>
              <p className="text-lg text-blue-gray-1">
                Nossos vendedores são verificados e seguem os mais rigorosos padrões 
                de qualidade para garantir que você receba apenas o melhor.
              </p>
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">10k+</div>
                  <div className="text-sm text-blue-gray-2">Produtos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm text-blue-gray-2">Vendedores</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">50k+</div>
                  <div className="text-sm text-blue-gray-2">Clientes</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg"
                alt="VITRINE Confiável"
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

      {/* Top Sellers */}
      <section className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-9 mb-4">Melhores Vendedores</h2>
            <p className="text-gray-6">Conheça os vendedores mais confiáveis e bem avaliados</p>
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
            {[1, 2, 3].map((item) => (
              <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={`https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg`}
                  alt="Blog Post"
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="text-sm text-gray-5 mb-2">15 de Janeiro, 2024</div>
                  <h3 className="font-semibold text-gray-9 mb-3 line-clamp-2">
                    Como Escolher o Smartphone Ideal para Você
                  </h3>
                  <p className="text-gray-6 text-sm mb-4 line-clamp-3">
                    Descubra os fatores mais importantes na hora de escolher seu próximo smartphone 
                    e faça a melhor escolha para suas necessidades.
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
                comment: "Produtos sempre de qualidade e entrega rápida. O atendimento é impecável!"
              },
              {
                name: "João Santos",
                location: "Maputo, Maputo",
                rating: 5,
                comment: "Finalmente encontrei a VITRINE com tudo que preciso. Recomendo!"
              },
              {
                name: "Ana Costa",
                location: "Nampula, Nampula",
                rating: 5,
                comment: "A variedade de produtos é incrível. Preços competitivos e vendedores confiáveis."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-warning fill-warning" />
                  ))}
                </div>
                <p className="text-gray-7 mb-4 italic">&quot;{testimonial.comment}&quot;</p>
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