'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Award, Heart, Leaf, Star, Quote } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  // Mock team data
  const teamMembers = [
    {
      id: '1',
      name: 'Maria Silva',
      position: 'CEO & Fundadora',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      bio: 'Especialista em agricultura orgânica com mais de 15 anos de experiência.'
    },
    {
      id: '2',
      name: 'João Santos',
      position: 'Diretor de Operações',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      bio: 'Responsável por garantir a qualidade e sustentabilidade de todos os produtos.'
    },
    {
      id: '3',
      name: 'Ana Costa',
      position: 'Chef de Culinária',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      bio: 'Especialista em receitas orgânicas e alimentação saudável.'
    },
    {
      id: '4',
      name: 'Carlos Oliveira',
      position: 'Diretor de Tecnologia',
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
      bio: 'Desenvolvedor da plataforma que conecta produtores e consumidores.'
    }
  ];

  // Mock testimonials
  const testimonials = [
    {
      id: '1',
      name: 'Fernanda Lima',
      role: 'Cliente Fiel',
      content: 'O Ecobazar transformou minha alimentação! Os produtos são frescos, saborosos e eu sei exatamente de onde vêm.',
      rating: 5,
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
    },
    {
      id: '2',
      name: 'Roberto Almeida',
      role: 'Produtor Orgânico',
      content: 'Como produtor, o Ecobazar me deu a oportunidade de vender diretamente para os consumidores. É uma parceria incrível!',
      rating: 5,
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
    },
    {
      id: '3',
      name: 'Patrícia Mendes',
      role: 'Nutricionista',
      content: 'Recomendo o Ecobazar para todos os meus pacientes. A qualidade dos produtos orgânicos é excepcional.',
      rating: 5,
      image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-gray-1 to-green-gray-2 py-16 lg:py-24">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-9 leading-tight">
                Loja de Alimentos Orgânicos
                <span className="text-primary block">100% Confiável</span>
              </h1>
              <p className="text-lg text-gray-7 leading-relaxed">
                Somos uma plataforma que conecta produtores orgânicos certificados com consumidores 
                que valorizam qualidade, saúde e sustentabilidade. Nossa missão é democratizar o 
                acesso a alimentos orgânicos frescos e saudáveis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/loja">
                  <Button size="lg" className="bg-primary hover:bg-primary-hard text-white px-8 py-3">
                    Conheça Nossos Produtos
                  </Button>
                </Link>
                <Link href="/contato">
                  <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3">
                    Entre em Contato
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg"
                alt="Alimentos Orgânicos"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 lg:py-24">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg"
                alt="Nossa Missão"
                className="rounded-2xl shadow-lg"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-9">
                Nossa Missão
              </h2>
              <p className="text-lg text-gray-7 leading-relaxed">
                Conectar produtores orgânicos certificados com consumidores conscientes, 
                promovendo uma alimentação mais saudável e sustentável para todos.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Leaf size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-9 mb-2">Sustentabilidade</h3>
                    <p className="text-gray-7">Promovemos práticas agrícolas que preservam o meio ambiente.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Heart size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-9 mb-2">Saúde</h3>
                    <p className="text-gray-7">Oferecemos produtos livres de agrotóxicos e químicos nocivos.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-9 mb-2">Comunidade</h3>
                    <p className="text-gray-7">Fortalecendo produtores locais e criando conexões genuínas.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 lg:py-24 bg-gray-1">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-9 mb-4">Nossos Valores</h2>
            <p className="text-lg text-gray-7 max-w-2xl mx-auto">
              Acreditamos que a qualidade dos alimentos impacta diretamente na qualidade de vida 
              das pessoas e na saúde do planeta.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold text-gray-9 mb-2">Qualidade</h3>
              <p className="text-gray-7 text-sm">Produtos certificados e de alta qualidade</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold text-gray-9 mb-2">Sustentabilidade</h3>
              <p className="text-gray-7 text-sm">Práticas que preservam o meio ambiente</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold text-gray-9 mb-2">Transparência</h3>
              <p className="text-gray-7 text-sm">Rastreabilidade completa dos produtos</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold text-gray-9 mb-2">Comunidade</h3>
              <p className="text-gray-7 text-sm">Fortalecendo produtores locais</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 lg:py-24">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-9 mb-4">Nossa Equipe Incrível</h2>
            <p className="text-lg text-gray-7 max-w-2xl mx-auto">
              Conheça as pessoas apaixonadas que fazem o Ecobazar acontecer todos os dias.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-gray-9 mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.position}</p>
                <p className="text-gray-7 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 lg:py-24 bg-gray-1">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-9 mb-4">Depoimentos de Clientes</h2>
            <p className="text-lg text-gray-7 max-w-2xl mx-auto">
              Veja o que nossos clientes e parceiros dizem sobre o Ecobazar.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-9">{testimonial.name}</h4>
                    <p className="text-sm text-gray-6">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-gray-7 italic">
                  <Quote size={20} className="text-primary mb-2" />
                  "{testimonial.content}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-r from-primary to-primary-hard">
        <div className="container px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Nós Entregamos, Você Aproveita Seu Pedido
          </h2>
          <p className="text-lg text-green-gray-1 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já descobriram os benefícios dos alimentos orgânicos 
            através do Ecobazar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/loja">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-1 px-8 py-3">
                Começar a Comprar
              </Button>
            </Link>
            <Link href="/contato">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3">
                Fale Conosco
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 