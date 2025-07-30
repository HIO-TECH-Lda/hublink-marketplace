'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, HelpCircle, Phone, Mail, MessageCircle, FileText, ShoppingBag, CreditCard, Truck, Shield } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AjudaPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('pedidos');

  const categories = [
    { id: 'pedidos', name: 'Pedidos', icon: ShoppingBag },
    { id: 'pagamento', name: 'Pagamento', icon: CreditCard },
    { id: 'entrega', name: 'Entrega', icon: Truck },
    { id: 'conta', name: 'Minha Conta', icon: Shield },
    { id: 'produtos', name: 'Produtos', icon: FileText }
  ];

  const faqs = {
    pedidos: [
      {
        question: 'Como faço um pedido?',
        answer: 'Navegue pelos produtos, adicione ao carrinho e finalize sua compra. Aceitamos PIX, cartão de crédito e dinheiro na entrega.'
      },
      {
        question: 'Posso cancelar meu pedido?',
        answer: 'Pedidos podem ser cancelados até 2 horas antes da entrega. Entre em contato conosco para solicitar o cancelamento.'
      },
      {
        question: 'Como acompanho meu pedido?',
        answer: 'Acesse "Meus Pedidos" no seu painel para acompanhar o status da entrega em tempo real.'
      },
      {
        question: 'Posso alterar o endereço de entrega?',
        answer: 'Alterações no endereço podem ser feitas até 4 horas antes da entrega programada.'
      }
    ],
    pagamento: [
      {
        question: 'Quais formas de pagamento vocês aceitam?',
        answer: 'Aceitamos PIX, cartões de crédito e débito, e dinheiro na entrega.'
      },
      {
        question: 'O pagamento é seguro?',
        answer: 'Sim! Utilizamos sistemas de pagamento seguros e seus dados estão protegidos.'
      },
      {
        question: 'Posso parcelar minha compra?',
        answer: 'Sim, aceitamos parcelamento em até 12x nos cartões de crédito.'
      },
      {
        question: 'Como funciona o PIX?',
        answer: 'Após finalizar o pedido, você receberá um QR Code para pagamento instantâneo via PIX.'
      }
    ],
    entrega: [
      {
        question: 'Qual o prazo de entrega?',
        answer: 'Entregamos em até 24 horas na região metropolitana. Para outras localidades, consulte nossa equipe.'
      },
      {
        question: 'Vocês entregam em toda a cidade?',
        answer: 'Atendemos toda a região metropolitana. Para locais mais distantes, entre em contato.'
      },
      {
        question: 'Posso escolher o horário de entrega?',
        answer: 'Sim! Você pode escolher entre manhã (8h-12h) ou tarde (14h-18h).'
      },
      {
        question: 'Há taxa de entrega?',
        answer: 'Entregas acima de R$ 50 são gratuitas. Abaixo desse valor, a taxa é de R$ 5.'
      }
    ],
    conta: [
      {
        question: 'Como crio minha conta?',
        answer: 'Clique em "Entrar" e depois "Cadastre-se" para criar sua conta gratuitamente.'
      },
      {
        question: 'Esqueci minha senha, o que faço?',
        answer: 'Use a opção "Esqueci minha senha" na página de login para redefinir.'
      },
      {
        question: 'Como altero meus dados pessoais?',
        answer: 'Acesse "Configurações" no seu painel para atualizar suas informações.'
      },
      {
        question: 'Posso ter múltiplos endereços?',
        answer: 'Sim! Você pode cadastrar vários endereços e escolher qual usar a cada pedido.'
      }
    ],
    produtos: [
      {
        question: 'Os produtos são realmente orgânicos?',
        answer: 'Sim! Todos os nossos produtores são certificados e passam por rigorosos controles de qualidade.'
      },
      {
        question: 'Como são armazenados os produtos?',
        answer: 'Utilizamos refrigeração adequada e embalagens especiais para manter a frescura.'
      },
      {
        question: 'Posso solicitar produtos específicos?',
        answer: 'Sim! Entre em contato conosco para solicitar produtos que não estão no catálogo.'
      },
      {
        question: 'Há garantia de qualidade?',
        answer: 'Sim! Se não estiver satisfeito, aceitamos trocas e devoluções em até 24h.'
      }
    ]
  };

  const filteredFAQs = faqs[activeCategory as keyof typeof faqs] || [];

  const contactMethods = [
    {
      icon: Phone,
      title: 'Telefone',
      description: 'Fale diretamente com nossa equipe',
      contact: '(11) 99999-9999',
      action: 'Ligar Agora',
      href: 'tel:+5511999999999'
    },
    {
      icon: Mail,
      title: 'E-mail',
      description: 'Envie sua dúvida por e-mail',
      contact: 'suporte@ecobazar.com.br',
      action: 'Enviar E-mail',
      href: 'mailto:suporte@ecobazar.com.br'
    },
    {
      icon: MessageCircle,
      title: 'Chat Online',
      description: 'Atendimento em tempo real',
      contact: 'Disponível 24/7',
      action: 'Iniciar Chat',
      href: '/contato'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-1 overflow-x-hidden">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / 
          <span className="text-primary"> Central de Ajuda</span>
        </nav>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-9 mb-4">
            Central de Ajuda
          </h1>
          <p className="text-base sm:text-lg text-gray-7 max-w-2xl mx-auto px-4 mb-8">
            Encontre respostas rápidas para suas dúvidas ou entre em contato conosco
          </p>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-4" size={20} />
              <Input
                type="text"
                placeholder="Digite sua dúvida..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3"
              />
            </div>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-9 mb-6 text-center">
            Precisa de Ajuda Imediata?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <method.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-semibold text-gray-9 mb-2">{method.title}</h3>
                <p className="text-gray-7 text-sm mb-3">{method.description}</p>
                <p className="text-primary font-medium mb-4">{method.contact}</p>
                <Link href={method.href}>
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                    {method.action}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-9 mb-6 text-center">
            Perguntas Frequentes
          </h2>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-primary text-white'
                      : 'bg-white text-gray-7 hover:bg-gray-2'
                  }`}
                >
                  <Icon size={16} />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>

          {/* FAQ List */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <div className="space-y-6">
                {filteredFAQs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-2 pb-6 last:border-b-0">
                    <h3 className="font-semibold text-gray-9 mb-2 text-sm sm:text-base">
                      {faq.question}
                    </h3>
                    <p className="text-gray-7 text-sm sm:text-base">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Help */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-9 mb-4">Links Úteis</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/termos" className="text-primary hover:text-primary-hard text-sm">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-primary hover:text-primary-hard text-sm">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/trocas-devolucoes" className="text-primary hover:text-primary-hard text-sm">
                  Trocas e Devoluções
                </Link>
              </li>
              <li>
                <Link href="/seja-vendedor" className="text-primary hover:text-primary-hard text-sm">
                  Seja um Vendedor
                </Link>
              </li>
            </ul>
          </div>

          {/* Still Need Help */}
          <div className="bg-primary/5 rounded-lg p-6">
            <h3 className="font-semibold text-gray-9 mb-4">Ainda Precisa de Ajuda?</h3>
            <p className="text-gray-7 text-sm mb-4">
              Nossa equipe está pronta para ajudar você com qualquer dúvida ou problema.
            </p>
            <Link href="/contato">
              <Button className="bg-primary hover:bg-primary-hard text-white w-full">
                <MessageCircle size={16} className="mr-2" />
                Fale Conosco
              </Button>
            </Link>
          </div>
        </div>

        {/* Tips Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-9 mb-4">Dicas para uma Melhor Experiência</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-xs font-semibold">1</span>
              </div>
              <p className="text-gray-7 text-sm">Faça pedidos com antecedência para garantir disponibilidade</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-xs font-semibold">2</span>
              </div>
              <p className="text-gray-7 text-sm">Mantenha seu endereço de entrega sempre atualizado</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-primary text-xs font-semibold">3</span>
              </div>
              <p className="text-gray-7 text-sm">Acompanhe seus pedidos pelo painel do cliente</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 