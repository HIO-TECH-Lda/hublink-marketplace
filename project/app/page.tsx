'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Truck, CreditCard, Headphones, Trophy, Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/common/ProductCard';
import ProductCardSkeleton from '@/components/common/ProductCardSkeleton';
import SellerCard from '@/components/common/SellerCard';
import NewsletterPopup from '@/components/popups/NewsletterPopup';
import SellerPopup from '@/components/popups/SellerPopup';
import CartPopup from '@/components/popups/CartPopup';
import QuickViewPopup from '@/components/popups/QuickViewPopup';
import { Button } from '@/components/ui/button';
import { useMarketplace } from '@/contexts/MarketplaceContext';
import { useFeaturedProducts, useBestSellers, useNewArrivals } from '@/hooks/useProducts';
import { useTopSellers } from '@/hooks/useSellers';
import { useFeaturedPosts } from '@/hooks/useBlog';
import { Loader2 } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export default function HomePage() {
  const { state } = useMarketplace();

  // Use API hooks for real data
  const { data: featuredProducts, isLoading: featuredLoading } = useFeaturedProducts();
  const { data: bestSellerProducts, isLoading: bestSellerLoading } = useBestSellers();
  const { data: newArrivals, isLoading: newArrivalsLoading } = useNewArrivals();
  const { data: topSellers, isLoading: sellersLoading } = useTopSellers(4);
  const { data: featuredPostsData, isLoading: blogLoading } = useFeaturedPosts();
  
  const featuredBlogPosts = featuredPostsData?.posts || [];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-gray-1 to-green-gray-2 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/1300972/pexels-photo-1300972.jpeg')] bg-cover bg-center opacity-10"></div>
        <div className="relative container py-12 sm:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-9 leading-tight">
                Alimentos Orgânicos
                <span className="text-primary block">Frescos e Saudáveis</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-7 leading-relaxed">
                Conectamos você diretamente com produtores locais de alimentos orgânicos em Beira. 
                Qualidade garantida, sabor autêntico e nutrição máxima para sua família.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/loja">
                  <Button size="lg" className="bg-primary hover:bg-primary-hard text-white px-6 sm:px-8 py-3 sm:py-4">
                    Compre Agora
                    <ArrowRight className="ml-2" size={20} />
                  </Button>
                </Link>
                <Link href="/seja-vendedor">
                  <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white px-6 sm:px-8 py-3 sm:py-4">
                    Seja Vendedor no Txova
                  </Button>
                </Link>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
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
            <p className="text-gray-6">Descubra nossa seleção especial de produtos orgânicos</p>
          </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredLoading ? (
                <>
                  {[...Array(8)].map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </>
              ) : featuredProducts && featuredProducts.length > 0 ? (
                featuredProducts.slice(0, 8).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  Nenhum produto em destaque disponível
                </div>
              )}
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
                Marketplace de Alimentos Orgânicos
                <span className="block">100% Confiável</span>
              </h2>
              <p className="text-lg text-green-gray-1">
                Nossos produtores são certificados e seguem os mais rigorosos padrões 
                de qualidade para garantir que você receba apenas o melhor em Beira.
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
              {bestSellerLoading ? (
                <>
                  {[...Array(4)].map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </>
              ) : bestSellerProducts && bestSellerProducts.length > 0 ? (
                bestSellerProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-8 text-gray-500">
                  Nenhum produto mais vendido disponível
                </div>
              )}
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
            {newArrivalsLoading ? (
              <>
                {[...Array(4)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </>
            ) : newArrivals && newArrivals.length > 0 ? (
              newArrivals.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                Nenhuma novidade disponível
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Top Sellers */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-hard">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-medium mb-4">
              <Trophy size={18} />
              Destaque
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Melhores Vendedores</h2>
            <p className="text-white max-w-xl mx-auto">Conheça os produtores mais confiáveis e bem avaliados</p>
          </div>
          {sellersLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
          ) : topSellers && topSellers.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
                {topSellers.map((seller) => (
                  <SellerCard 
                    key={seller.id} 
                    seller={{
                      id: seller.id,
                      businessName: seller.businessName,
                      businessDescription: seller.description,
                      logo: seller.logo,
                      rating: seller.rating,
                      reviewCount: seller.totalReviews,
                      totalProducts: seller.totalProducts || 0,
                      totalSales: seller.totalSales,
                      location: seller.location,
                      isVerified: seller.isVerified,
                      isTopSeller: seller.isFeatured,
                      joinedDate: seller.memberSince
                    } as Parameters<typeof SellerCard>[0]['seller']}
                  />
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
            </>
          ) : (
            <p className="text-center text-white-6">Nenhum vendedor disponível no momento</p>
          )}
        </div>
      </section>

      {/* Latest News/Blog */}
      <section className="py-16 bg-gray-1">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-9 mb-4">Últimas Notícias</h2>
            <p className="text-gray-6">Mantenha-se atualizado com dicas e novidades</p>
          </div>
          {blogLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : featuredBlogPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {featuredBlogPosts.slice(0, 3).map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                    {post.image ? (
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary-soft/20 flex items-center justify-center">
                        <span className="text-4xl text-primary">📝</span>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="text-sm text-gray-5 mb-2">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('pt-MZ', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        }) : 'Data não disponível'}
                      </div>
                      <h3 className="font-semibold text-gray-9 mb-3 line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-gray-6 text-sm mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      <span className="text-primary hover:text-primary-hard font-medium text-sm">
                        Ler Mais →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-6">Nenhum artigo disponível no momento</p>
          )}
          {featuredBlogPosts.length > 0 && (
            <div className="text-center mt-12">
              <Link href="/blog">
                <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Ver Todos os Artigos
                  <ArrowRight className="ml-2" size={20} />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Customer Testimonials - Carousel (same as About page) */}
      <section className="py-16 lg:py-24 bg-gray-1">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-9 mb-4">O Que Nossos Clientes Dizem</h2>
            <p className="text-base sm:text-lg text-gray-7 max-w-2xl mx-auto px-4">
              Avaliações reais de clientes satisfeitos
            </p>
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-8">
            <Carousel opts={{ loop: true, align: 'start' }} autoplay={{ delay: 5000 }} className="w-full">
              <CarouselContent className="-ml-4">
                {[
                  {
                    id: '1',
                    name: 'Maria Silva',
                    role: 'Beira, Sofala',
                    content: 'Produtos sempre frescos e de excelente qualidade. A entrega é rápida e o atendimento é impecável!',
                    rating: 5,
                    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
                  },
                  {
                    id: '2',
                    name: 'João Santos',
                    role: 'Beira, Sofala',
                    content: 'Finalmente encontrei um marketplace que conecta diretamente com produtores locais. Recomendo!',
                    rating: 5,
                    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
                  },
                  {
                    id: '3',
                    name: 'Ana Costa',
                    role: 'Beira, Sofala',
                    content: 'A variedade de produtos orgânicos é incrível. Minha família está mais saudável desde que começamos a comprar aqui.',
                    rating: 5,
                    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
                  },
                ].map((testimonial) => (
                  <CarouselItem key={testimonial.id} className="pl-4 basis-full md:basis-1/2">
                    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm h-full">
                      <div className="flex items-center mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden mr-3 sm:mr-4 flex-shrink-0">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-9 text-sm sm:text-base">{testimonial.name}</h4>
                          <p className="text-xs sm:text-sm text-gray-6">{testimonial.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} size={14} className="sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-gray-7 italic text-sm sm:text-base">
                        <Quote size={16} className="sm:w-5 sm:h-5 text-primary mb-2" />
                        &quot;{testimonial.content}&quot;
                      </blockquote>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-2 sm:-left-12" />
              <CarouselNext className="-right-2 sm:-right-12" />
            </Carousel>
          </div>
        </div>
      </section>

      <Footer />
      {/* Popup selection controlled via NEXT_PUBLIC_ACTIVE_POPUP */}
      {process.env.NEXT_PUBLIC_ACTIVE_POPUP === 'SELLER' ? (
        <SellerPopup />
      ) : (
        <NewsletterPopup />
      )}
      <CartPopup />
      <QuickViewPopup />
    </div>
  );
}