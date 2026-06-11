'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Award, Heart, Leaf, Star, Quote } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function AboutPage() {
  // Mock team data
  const teamMembers = [
    {
      id: '1',
      name: 'Maria Silva',
      position: 'CEO & Fundadora',
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg',
      bio: 'Especialista em negócios locais e economia comunitária com mais de 15 anos de experiência.'
    },
    {
      id: '2',
      name: 'João Santos',
      position: 'Diretor de Operações',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg',
      bio: 'Responsável por garantir a qualidade e sustentabilidade de todos os produtos.'
    },
    {
      id: '3',
      name: 'Ana Costa',
      position: 'Chef de Culinária',
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      bio: 'Especialista em experiência do cliente e comunicação com a comunidade local.'
    },
    {
      id: '4',
      name: 'Carlos Oliveira',
      position: 'Diretor de Tecnologia',
      image: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg',
      bio: 'Responsável pela plataforma que aproxima compradores e vendedores locais.'
    }
  ];

  // Mock partners
  const partners = [
    {
      id: '1',
      name: 'Agricultura Verde',
      logo: 'https://images.pexels.com/photos/30179958/pexels-photo-30179958.jpeg',
      description: 'Parceiro em apoio a negócios locais',
    },
    {
      id: '2',
      name: 'Cooperativa Sul',
      logo: 'https://images.pexels.com/photos/30464933/pexels-photo-30464933.jpeg',
      description: 'Rede de vendedores locais',
    },
    {
      id: '3',
      name: 'Bio Cert',
      logo: 'https://images.pexels.com/photos/30275079/pexels-photo-30275079.jpeg',
      description: 'Comércio informal e formal',
    },
    {
      id: '4',
      name: 'Logística Verde',
      logo: 'https://images.pexels.com/photos/4482900/pexels-photo-4482900.jpeg',
      description: 'Compras e pagamentos digitais',
    },
  ];

  // Mock testimonials
  const testimonials = [
    {
      id: '1',
      name: 'Fernanda Lima',
      role: 'Cliente Fiel',
      content: 'O Txova facilitou as minhas compras locais! Encontro produtos variados e sei exactamente quem vende.',
      rating: 5,
      image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg'
    },
    {
      id: '2',
      name: 'Roberto Almeida',
      role: 'Vendedor Local',
      content: 'Como vendedor, o Txova deu-me visibilidade para chegar a mais clientes na minha zona. É uma parceria incrível!',
      rating: 5,
      image: 'https://images.pexels.com/photos/30464933/pexels-photo-30464933.jpeg'
    },
    {
      id: '3',
      name: 'Patrícia Mendes',
      role: 'Compradora',
      content: 'Recomendo o Txova para quem procura apoiar negócios locais com um processo de compra simples e transparente.',
      rating: 5,
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg'
    }
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-gray-1 to-green-gray-2 py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-9 leading-tight">
                O Marketplace Local
                <span className="text-primary block">da Beira</span>
              </h1>
              <p className="text-base sm:text-lg text-gray-7 leading-relaxed">
                O Txova é uma plataforma moçambicana que aproxima compradores de vendedores locais,
                pequenos negócios, bancas e prestadores de serviços. A nossa missão é dar visibilidade
                à economia local e facilitar compras e vendas online.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/loja">
                  <Button size="lg" className="bg-primary hover:bg-primary-hard text-white px-6 sm:px-8 py-3">
                    Explorar a Plataforma
                  </Button>
                </Link>
                <Link href="/contato">
                  <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white px-6 sm:px-8 py-3">
                    Entre em Contacto
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative order-first lg:order-last">
              <img
                src="https://images.pexels.com/photos/30179958/pexels-photo-30179958.jpeg"
                alt="Mercado local no Txova"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative order-first lg:order-last">
              <img
                src="https://images.pexels.com/photos/30275079/pexels-photo-30275079.jpeg"
                alt="A nossa missão"
                className="w-full h-auto rounded-2xl shadow-lg"
              />
            </div>
            <div className="space-y-6 order-last lg:order-first">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-9">
                A Nossa Missão
              </h2>
              <p className="text-base sm:text-lg text-gray-7 leading-relaxed">
                Aproximar quem vende de quem compra, promovendo o comércio local, a confiança
                entre clientes e vendedores e o crescimento de pequenos negócios em Moçambique.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Leaf size={24} className="text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-9 mb-2">Sustentabilidade</h3>
                    <p className="text-gray-7 text-sm sm:text-base">Apoiamos negócios locais com impacto positivo na comunidade.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart size={24} className="text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-9 mb-2">Saúde</h3>
                    <p className="text-gray-7 text-sm sm:text-base">Facilitamos compras com informação clara sobre produtos e vendedores.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users size={24} className="text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-9 mb-2">Comunidade</h3>
                    <p className="text-gray-7 text-sm sm:text-base">Fortalecendo vendedores locais e criando ligações genuínas.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24 bg-gray-1">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-9 mb-4">Os Nossos Valores</h2>
            <p className="text-base sm:text-lg text-gray-7 mx-auto px-4">
              Acreditamos que o comércio local fortalece comunidades, cria oportunidades
              e aproxima quem produz ou vende de quem precisa de comprar.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            <div className="bg-white rounded-lg p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award size={24} className="sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-9 mb-2 text-sm sm:text-base">Qualidade</h3>
              <p className="text-gray-7 text-xs sm:text-sm">Produtos e serviços apresentados com informação clara</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf size={24} className="sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-9 mb-2 text-sm sm:text-base">Sustentabilidade</h3>
              <p className="text-gray-7 text-xs sm:text-sm">Práticas que preservam o meio ambiente</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={24} className="sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-9 mb-2 text-sm sm:text-base">Transparência</h3>
              <p className="text-gray-7 text-xs sm:text-sm">Rastreabilidade completa dos produtos</p>
            </div>
            
            <div className="bg-white rounded-lg p-4 sm:p-6 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={24} className="sm:w-8 sm:h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-9 mb-2 text-sm sm:text-base">Comunidade</h3>
              <p className="text-gray-7 text-xs sm:text-sm">Fortalecendo vendedores locais</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section - Carousel */}
      <section className="py-16 lg:py-24 bg-gray-1">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-9 mb-4">Os Nossos Parceiros</h2>
            <p className="text-base sm:text-lg text-gray-7 max-w-2xl mx-auto px-4">
              Organizações que apoiam e fortalecem o ecossistema Txova.
            </p>
          </div>
          <div className=" mx-auto px-4 sm:px-8">
            <Carousel opts={{ loop: true, align: 'start' }} autoplay={{ delay: 5000 }} className="w-full">
              <CarouselContent className="-ml-4">
                {partners.map((partner) => (
                  <CarouselItem key={partner.id} className="pl-4 basis-full md:basis-1/2">
                    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm h-full flex flex-col items-center text-center">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden mb-4 flex-shrink-0">
                        <img
                          src={partner.logo}
                          alt={partner.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold text-gray-9 mb-1 text-sm sm:text-base">{partner.name}</h3>
                      <p className="text-gray-6 text-xs sm:text-sm">{partner.description}</p>
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

      {/* Team Section - Carousel */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-9 mb-4">A Nossa Equipa</h2>
            <p className="text-base sm:text-lg text-gray-7 mx-auto px-4">
              Conheça as pessoas apaixonadas que fazem o Txova acontecer todos os dias.
            </p>
          </div>
          <div className="mx-auto px-4 sm:px-8">
            <Carousel opts={{ loop: true, align: 'start' }} className="w-full">
              <CarouselContent className="-ml-4">
                {teamMembers.map((member) => (
                  <CarouselItem key={member.id} className="pl-4 basis-full md:basis-1/2">
                    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm h-full text-center md:border md:border-gray-2">
                      <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-4 rounded-full overflow-hidden">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-semibold text-gray-9 mb-1 text-sm sm:text-base">{member.name}</h3>
                      <p className="text-primary font-medium mb-3 text-xs sm:text-sm">{member.position}</p>
                      <p className="text-gray-7 text-xs sm:text-sm px-2">{member.bio}</p>
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

      {/* Testimonials Section - Carousel */}
      <section className="py-16 lg:py-24 bg-gray-1">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-9 mb-4">Depoimentos de Clientes</h2>
            <p className="text-base sm:text-lg text-gray-7 max-w-2xl mx-auto px-4">
              Veja o que os nossos clientes e parceiros dizem sobre o Txova.
            </p>
          </div>

          <div className=" mx-auto px-4 sm:px-8">
            <Carousel opts={{ loop: true, align: 'start' }} autoplay={{ delay: 5000 }} className="w-full">
              <CarouselContent className="-ml-4">
                {testimonials.map((testimonial) => (
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

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-primary to-primary-hard">
        <div className="container text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 px-4">
            Compre Localmente com o Txova
          </h2>
          <p className="text-base sm:text-lg text-green-gray-1 mb-8 max-w-2xl mx-auto px-4">
            Junte-se a quem já descobriu uma forma simples de comprar e apoiar negócios locais
            através do Txova.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/loja">
              <Button size="lg" className="bg-white text-primary hover:bg-primary hover:text-white hover:scale-105 hover:shadow-xl active:scale-100 transition-all duration-200 px-6 sm:px-8 py-3">
                Começar a Comprar
              </Button>
            </Link>
            <Link href="/contato">
              <Button variant="outline" size="lg" className="border-white bg-transparent text-white hover:bg-white hover:text-primary hover:scale-105 hover:shadow-xl active:scale-100 transition-all duration-200 px-6 sm:px-8 py-3">
                Entre em Contacto
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 