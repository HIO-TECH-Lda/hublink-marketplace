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
                Sobre o Txova
              </h1>
              <p className="text-lg sm:text-xl text-primary font-semibold">
                O marketplace que dá visibilidade aos negócios locais
              </p>
              <p className="text-base sm:text-lg text-gray-7 leading-relaxed">
                O Txova é uma plataforma moçambicana criada para aproximar consumidores, vendedores
                informais, pequenos negócios, produtores locais e prestadores de serviços, através de uma
                montra digital simples, acessível e orientada para a valorização do comércio local.
              </p>
              <p className="text-base sm:text-lg text-gray-7 leading-relaxed">
                No Txova, cada negócio pode divulgar os seus produtos e serviços, alcançar novos clientes e
                fortalecer a sua presença no mercado. Ao mesmo tempo, os consumidores encontram, num só
                lugar, uma diversidade de opções locais, desde produtos alimentares, moda, mobília e artigos
                para casa, até serviços prestados na comunidade.
              </p>
              <p className="text-base font-medium text-gray-8">
                Mais visibilidade para quem vende. Mais opções para quem compra.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/loja">
                  <Button size="lg" className="bg-primary hover:bg-primary-hard text-white px-6 sm:px-8 py-3">
                    Conheça os Produtos e Serviços
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
                Aproximar vendedores locais, pequenos negócios, empreendedores informais, produtores,
                prestadores de serviços e consumidores através de uma plataforma digital simples, acessível e
                de confiança, promovendo maior visibilidade, divulgação e oportunidades de negócio no
                mercado local.
              </p>
              <p className="text-base sm:text-lg text-gray-7 leading-relaxed">
                O Txova contribui para a promoção dos negócios locais, apoiando a transição digital de
                pequenos empreendedores e reforçando a ligação entre vendedores e consumidores.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 lg:py-24 bg-gray-1">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-9">A Nossa Visão</h2>
            <p className="text-base sm:text-lg text-gray-7 leading-relaxed">
              Transformar o Txova numa referência moçambicana em comércio local digital, criando uma
              plataforma onde pequenos negócios, vendedores informais, produtores e prestadores de
              serviços possam crescer, ganhar visibilidade e alcançar novos clientes de forma simples,
              acessível e sustentável.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-9 mb-4">Os Nossos Valores</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 lg:gap-8">
            {[
              { title: 'Proximidade', text: 'Valorizamos a ligação directa entre vendedores e clientes, promovendo relações comerciais mais humanas, simples e próximas da realidade local.', icon: Users },
              { title: 'Confiança', text: 'Incentivamos informação clara sobre produtos, serviços, preços, contactos, localização e condições de entrega.', icon: Award },
              { title: 'Inclusão', text: 'Acreditamos que todos os negócios, formais ou informais, pequenos ou em crescimento, devem ter oportunidade de ganhar presença digital.', icon: Heart },
              { title: 'Valorização Local', text: 'Promovemos o que é produzido, vendido e prestado localmente, contribuindo para fortalecer a economia da comunidade.', icon: Leaf },
              { title: 'Simplicidade', text: 'Defendemos uma experiência fácil de usar, tanto para quem compra como para quem vende, reduzindo barreiras de acesso ao mercado digital.', icon: Star },
            ].map((value) => (
              <div key={value.title} className="bg-gray-1 rounded-lg p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon size={24} className="sm:w-8 sm:h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-9 mb-2 text-sm sm:text-base">{value.title}</h3>
                <p className="text-gray-7 text-xs sm:text-sm">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section - Carousel */}
      <section className="py-16 lg:py-24 bg-gray-1">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-9 mb-4">Os Nossos Parceiros</h2>
            <p className="text-base sm:text-lg text-gray-7 max-w-2xl mx-auto px-4">
              Organizações, empresas e instituições que apoiam o Txova na promoção dos negócios locais,
              na inclusão económica e na valorização dos empreendedores da nossa comunidade.
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
              Conheça as pessoas comprometidas que trabalham todos os dias para tornar o Txova uma
              plataforma simples, acessível e útil para vendedores, compradores, parceiros e negócios locais.
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
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-9 mb-4">Testemunhos de Clientes</h2>
            <p className="text-base sm:text-lg text-gray-7 max-w-2xl mx-auto px-4">
              Veja o que compradores, vendedores e parceiros dizem sobre a sua experiência com o Txova
              e sobre o impacto da plataforma na promoção dos negócios locais.
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
            Nós Aproximamos, Você Escolhe
          </h2>
          <p className="text-base sm:text-lg text-green-gray-1 mb-8 max-w-2xl mx-auto px-4">
            Junte-se aos clientes que já utilizam o Txova para descobrir produtos, serviços e negócios
            locais de forma simples, acessível e conveniente.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/loja">
              <Button size="lg" className="bg-white text-primary hover:bg-primary hover:text-white hover:scale-105 hover:shadow-xl active:scale-100 transition-all duration-200 px-6 sm:px-8 py-3">
                Começar a Comprar
              </Button>
            </Link>
            <Link href="/contato">
              <Button variant="outline" size="lg" className="border-white bg-transparent text-white hover:bg-white hover:text-primary hover:scale-105 hover:shadow-xl active:scale-100 transition-all duration-200 px-6 sm:px-8 py-3">
                Fale Connosco
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 