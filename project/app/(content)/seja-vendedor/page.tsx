'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Star, Users, TrendingUp, Shield, Truck, Zap } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function SejaVendedorPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    nomeLoja: '',
    descricao: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    tipoProduto: '',
    experiencia: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Seller registration submitted:', formData);
    alert('Obrigado pelo interesse! Entraremos em contato em breve para discutir os próximos passos.');
    setFormData({
      nome: '', email: '', telefone: '', nomeLoja: '', descricao: '', 
      endereco: '', cidade: '', estado: '', cep: '', tipoProduto: '', experiencia: ''
    });
  };

  const beneficios = [
    {
      icon: Users,
      title: 'Alcance Ampliado',
      description: 'Conecte-se com milhares de clientes interessados em produtos orgânicos'
    },
    {
      icon: TrendingUp,
      title: 'Crescimento Garantido',
      description: 'Aumente suas vendas com nossa plataforma especializada'
    },
    {
      icon: Shield,
      title: 'Segurança Total',
      description: 'Pagamentos seguros e proteção para suas transações'
    },
    {
      icon: Truck,
      title: 'Logística Simplificada',
      description: 'Sistema de entrega integrado e suporte logístico'
    },
    {
      icon: Zap,
      title: 'Ferramentas Avançadas',
      description: 'Dashboard completo para gerenciar seus produtos e vendas'
    },
    {
      icon: Star,
      title: 'Suporte Dedicado',
      description: 'Equipe especializada para ajudar no seu sucesso'
    }
  ];

  const requisitos = [
    'Produtos orgânicos certificados ou de produção própria',
    'Documentação legal (CNPJ ou CPF)',
    'Localização para armazenamento adequado',
    'Compromisso com qualidade e frescor',
    'Disponibilidade para entregas regulares',
    'Adesão aos padrões de qualidade da plataforma'
  ];

  const passos = [
    {
      step: '01',
      title: 'Cadastro Inicial',
      description: 'Preencha o formulário com suas informações básicas'
    },
    {
      step: '02',
      title: 'Análise da Documentação',
      description: 'Nossa equipe analisa sua documentação e produtos'
    },
    {
      step: '03',
      title: 'Entrevista e Visita',
      description: 'Conversamos sobre sua operação e fazemos uma visita técnica'
    },
    {
      step: '04',
      title: 'Aprovação e Onboarding',
      description: 'Após aprovado, você recebe treinamento e acesso à plataforma'
    },
    {
      step: '05',
      title: 'Primeiras Vendas',
      description: 'Comece a vender e crescer seu negócio conosco!'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-1 overflow-x-hidden">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / 
          <span className="text-primary"> Seja um Vendedor</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-9 mb-4">
            Seja um Vendedor Ecobazar
          </h1>
          <p className="text-base sm:text-lg text-gray-7 max-w-3xl mx-auto px-4">
            Junte-se à nossa comunidade de produtores orgânicos e alcance milhares de clientes 
            que valorizam qualidade, frescor e sustentabilidade.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-9 mb-8 text-center">
            Por que vender no Ecobazar?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {beneficios.map((beneficio, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <beneficio.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-semibold text-gray-9 mb-2">{beneficio.title}</h3>
                <p className="text-gray-7 text-sm">{beneficio.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Requirements Section */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-9 mb-6">
              Requisitos para Vendedores
            </h2>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <ul className="space-y-3">
                {requisitos.map((requisito, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <Check size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-gray-7 text-sm">{requisito}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Process Steps */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-9 mb-4">Como Funciona</h3>
              <div className="space-y-4">
                {passos.map((passo, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {passo.step}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-9 text-sm">{passo.title}</h4>
                      <p className="text-gray-7 text-xs">{passo.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-9 mb-6">
              Cadastre-se como Vendedor
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-9 mb-2">
                    Nome Completo *
                  </label>
                  <Input
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    required
                    placeholder="Seu nome completo"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-9 mb-2">
                    E-mail *
                  </label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-9 mb-2">
                    Telefone *
                  </label>
                  <Input
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleInputChange}
                    required
                    placeholder="(11) 99999-9999"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-9 mb-2">
                    Nome da Loja *
                  </label>
                  <Input
                    name="nomeLoja"
                    value={formData.nomeLoja}
                    onChange={handleInputChange}
                    required
                    placeholder="Ex: Fazenda Verde"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-9 mb-2">
                  Descrição da Loja
                </label>
                <Textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Conte um pouco sobre sua produção e produtos..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-9 mb-2">
                  Endereço *
                </label>
                <Input
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  required
                  placeholder="Rua, número, bairro"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-9 mb-2">
                    Cidade *
                  </label>
                  <Input
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleInputChange}
                    required
                    placeholder="São Paulo"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-9 mb-2">
                    Estado *
                  </label>
                  <Input
                    name="estado"
                    value={formData.estado}
                    onChange={handleInputChange}
                    required
                    placeholder="SP"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-9 mb-2">
                    CEP *
                  </label>
                  <Input
                    name="cep"
                    value={formData.cep}
                    onChange={handleInputChange}
                    required
                    placeholder="01234-567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-9 mb-2">
                  Tipo de Produtos *
                </label>
                <Input
                  name="tipoProduto"
                  value={formData.tipoProduto}
                  onChange={handleInputChange}
                  required
                  placeholder="Ex: Hortaliças, Frutas, Legumes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-9 mb-2">
                  Experiência na Área
                </label>
                <Textarea
                  name="experiencia"
                  value={formData.experiencia}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Conte sobre sua experiência com produção orgânica..."
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hard text-white py-3"
              >
                Enviar Cadastro
              </Button>
            </form>

            <div className="mt-6 p-4 bg-gray-1 rounded-lg">
              <p className="text-sm text-gray-7">
                <strong>Importante:</strong> Entraremos em contato em até 48 horas para 
                discutir os próximos passos e agendar uma visita técnica.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-primary/5 rounded-lg p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-9 mb-4">
              Pronto para começar?
            </h2>
            <p className="text-gray-7 mb-6 max-w-2xl mx-auto">
              Junte-se a centenas de produtores que já estão vendendo no Ecobazar e 
              crescendo seus negócios conosco.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contato">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Falar com Consultor
                </Button>
              </Link>
              <Link href="/sobre">
                <Button className="bg-primary hover:bg-primary-hard text-white">
                  Conhecer Mais
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 