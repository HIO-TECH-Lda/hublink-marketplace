'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Truck, CreditCard, Headphones, Trophy } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/common/ProductCard';
import ProductCardSkeleton from '@/components/common/ProductCardSkeleton';
import SellerCard from '@/components/common/SellerCard';
import CategoryStrip from '@/components/home/CategoryStrip';
import NewsletterPopup from '@/components/popups/NewsletterPopup';
import SellerPopup from '@/components/popups/SellerPopup';
import CartPopup from '@/components/popups/CartPopup';
import QuickViewPopup from '@/components/popups/QuickViewPopup';
import { useFeaturedProducts, useBestSellers, useNewArrivals } from '@/hooks/useProducts';
import { useTopSellers } from '@/hooks/useSellers';
import { Loader2 } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';

const PRODUCT_GRID = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3';

const bannerSlides = [
  {
    id: '1',
    title: 'Ofertas da Semana',
    subtitle: 'Descontos em produtos selecionados',
    href: '/loja',
    image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg',
  },
  {
    id: '2',
    title: 'Novos Vendedores',
    subtitle: 'Descubra lojas verificadas',
    href: '/vendedores',
    image: 'https://images.pexels.com/photos/3769747/pexels-photo-3769747.jpeg',
  },
];

function SectionHeader({ title, href, linkLabel = 'Ver tudo' }: { title: string; href?: string; linkLabel?: string }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-base sm:text-lg font-semibold text-gray-9">{title}</h2>
      {href && (
        <Link href={href} className="text-xs sm:text-sm text-primary hover:text-primary-hard font-medium flex items-center gap-1">
          {linkLabel}
          <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}

export default function HomePage() {
  const { data: featuredProducts, isLoading: featuredLoading } = useFeaturedProducts();
  const { data: bestSellerProducts, isLoading: bestSellerLoading } = useBestSellers();
  const { data: newArrivals, isLoading: newArrivalsLoading } = useNewArrivals();
  const { data: topSellers, isLoading: sellersLoading } = useTopSellers(4);

  const offerProducts = [...(featuredProducts || []), ...(bestSellerProducts || [])]
    .filter((p, i, arr) => p.originalPrice && p.originalPrice > p.price && arr.findIndex((x) => x._id === p._id) === i)
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />

      {/* Thin Banner */}
      <section className="bg-white">
        <div className="container px-4 sm:px-6 lg:px-8 pt-3">
          <Carousel opts={{ loop: true }} autoplay={{ delay: 5000 }} className="w-full">
            <CarouselContent>
              {bannerSlides.map((slide) => (
                <CarouselItem key={slide.id}>
                  <Link href={slide.href} className="block relative h-28 sm:h-36 rounded-md overflow-hidden">
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center px-6">
                      <div className="text-white">
                        <p className="text-lg sm:text-xl font-bold">{slide.title}</p>
                        <p className="text-xs sm:text-sm text-white/80">{slide.subtitle}</p>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      <CategoryStrip />

      {/* Ofertas - compact horizontal scroll */}
      {offerProducts.length > 0 && (
        <section className="container px-4 sm:px-6 lg:px-8 py-4">
          <SectionHeader title="Ofertas" href="/loja" />
          <div className="flex gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-1">
            {offerProducts.map((product) => (
              <div key={product._id} className="w-[140px] sm:w-[160px] flex-shrink-0">
                <ProductCard product={product} compact showQuickView={false} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Produtos em Destaque */}
      <section className="container px-4 sm:px-6 lg:px-8 py-4">
        <SectionHeader title="Produtos em Destaque" href="/loja" />
        <div className={PRODUCT_GRID}>
          {featuredLoading ? (
            [...Array(12)].map((_, i) => <ProductCardSkeleton key={i} />)
          ) : featuredProducts && featuredProducts.length > 0 ? (
            featuredProducts.slice(0, 12).map((product) => <ProductCard key={product._id} product={product} />)
          ) : (
            <div className="col-span-full text-center py-6 text-gray-5 text-sm">Nenhum produto em destaque disponível</div>
          )}
        </div>
      </section>

      {/* Mais Vendidos */}
      <section className="container px-4 sm:px-6 lg:px-8 py-4">
        <SectionHeader title="Mais Vendidos" href="/loja" />
        <div className={PRODUCT_GRID}>
          {bestSellerLoading ? (
            [...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)
          ) : bestSellerProducts && bestSellerProducts.length > 0 ? (
            bestSellerProducts.slice(0, 6).map((product) => <ProductCard key={product._id} product={product} />)
          ) : (
            <div className="col-span-full text-center py-6 text-gray-5 text-sm">Nenhum produto disponível</div>
          )}
        </div>
      </section>

      {/* Novidades */}
      <section className="container px-4 sm:px-6 lg:px-8 py-4">
        <SectionHeader title="Novidades" href="/loja" />
        <div className={PRODUCT_GRID}>
          {newArrivalsLoading ? (
            [...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)
          ) : newArrivals && newArrivals.length > 0 ? (
            newArrivals.slice(0, 6).map((product) => <ProductCard key={product._id} product={product} />)
          ) : (
            <div className="col-span-full text-center py-6 text-gray-5 text-sm">Nenhuma novidade disponível</div>
          )}
        </div>
      </section>

      {/* Vendedores */}
      <section className="container px-4 sm:px-6 lg:px-8 py-4 pb-6">
        <SectionHeader title="Vendedores" href="/vendedores" />
        {sellersLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : topSellers && topSellers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
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
                  joinedDate: seller.memberSince,
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-5 text-sm py-4">Nenhum vendedor disponível</p>
        )}
      </section>

      {/* Features - single compact row */}
      <section className="bg-white border-t border-gray-2 py-4">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { icon: Truck, title: 'Entrega Grátis', desc: 'Acima de 500 MZN' },
              { icon: CreditCard, title: 'Pagamento Seguro', desc: 'M-Pesa, E-Mola, Cartão' },
              { icon: Headphones, title: 'Suporte 24/7', desc: 'Sempre disponível' },
              { icon: Trophy, title: 'Qualidade', desc: 'Produtos certificados' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-2.5 p-2">
                <div className="w-9 h-9 bg-primary-lighter rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon className="text-primary" size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-9">{title}</p>
                  <p className="text-[10px] text-gray-6 truncate">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      {process.env.NEXT_PUBLIC_ACTIVE_POPUP === 'SELLER' ? <SellerPopup /> : <NewsletterPopup />}
      <CartPopup />
      <QuickViewPopup />
    </div>
  );
}
