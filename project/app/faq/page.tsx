'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "O que são alimentos orgânicos?",
      answer: "Alimentos orgânicos são cultivados sem o uso de pesticidas sintéticos, fertilizantes químicos ou organismos geneticamente modificados. Eles seguem práticas agrícolas que promovem a saúde do solo, biodiversidade e sustentabilidade ambiental."
    },
    {
      question: "Como posso ter certeza de que os produtos são realmente orgânicos?",
      answer: "Todos os nossos produtores são certificados por órgãos reconhecidos e passam por rigorosos controles de qualidade. Você pode rastrear a origem de cada produto através do código QR ou número de lote."
    },
    {
      question: "Qual a diferença entre produtos orgânicos e convencionais?",
      answer: "Produtos orgânicos são cultivados sem agrotóxicos, têm maior teor de nutrientes, são mais saborosos e não contêm resíduos químicos prejudiciais à saúde. Além disso, promovem a sustentabilidade ambiental."
    },
    {
      question: "Como funciona o processo de entrega?",
      answer: "Após confirmar seu pedido, nossos parceiros de entrega farão a coleta dos produtos diretamente dos produtores e entregarão na sua casa no horário agendado. Entregamos em até 24 horas na região metropolitana."
    },
    {
      question: "Quais são as formas de pagamento aceitas?",
      answer: "Aceitamos PIX, cartão de crédito, cartão de débito e dinheiro na entrega. Todos os pagamentos são processados de forma segura através de nossa plataforma."
    },
    {
      question: "Posso cancelar ou alterar meu pedido?",
      answer: "Sim! Pedidos podem ser cancelados ou alterados até 2 horas antes da entrega. Entre em contato conosco através do telefone ou chat online para solicitar as alterações."
    },
    {
      question: "Os produtos têm garantia de qualidade?",
      answer: "Sim! Garantimos a qualidade de todos os produtos. Se você não ficar satisfeito, devolvemos seu dinheiro ou trocamos o produto sem questionamentos."
    },
    {
      question: "Como posso me tornar um produtor parceiro?",
      answer: "Para se tornar um produtor parceiro, você precisa ter certificação orgânica e seguir nossas diretrizes de qualidade. Entre em contato conosco para mais informações sobre o processo de cadastro."
    },
    {
      question: "Vocês entregam em toda a cidade?",
      answer: "Atualmente entregamos na região metropolitana de São Paulo. Para outras localidades, consulte nossa equipe de atendimento para verificar a disponibilidade."
    },
    {
      question: "Como posso rastrear meu pedido?",
      answer: "Após a confirmação do pedido, você receberá um código de rastreamento por e-mail e SMS. Você também pode acompanhar o status do seu pedido através da sua conta no site."
    },
    {
      question: "Os produtos são frescos?",
      answer: "Sim! Todos os produtos são colhidos no dia da entrega ou no máximo 24 horas antes, garantindo máxima frescura e qualidade."
    },
    {
      question: "Vocês têm produtos para pessoas com restrições alimentares?",
      answer: "Sim! Oferecemos produtos sem glúten, sem lactose, veganos e para outras restrições alimentares. Use nossos filtros de busca para encontrar produtos específicos."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-6">
          <a href="/" className="hover:text-primary">Início</a> / 
          <span className="text-primary"> FAQ</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-9 mb-4">
                Bem-vindo, Vamos Falar Sobre Nosso Ecobazar
              </h1>
              <p className="text-lg text-gray-7">
                Encontre respostas para as perguntas mais frequentes sobre nossos produtos, 
                serviços e como funciona nossa plataforma.
              </p>
            </div>

            {/* FAQ Accordion */}
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-1 transition-colors"
                  >
                    <h3 className="font-semibold text-gray-9 pr-4">{faq.question}</h3>
                    {openItems.includes(index) ? (
                      <ChevronUp size={20} className="text-primary flex-shrink-0" />
                    ) : (
                      <ChevronDown size={20} className="text-gray-6 flex-shrink-0" />
                    )}
                  </button>
                  
                  {openItems.includes(index) && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-7 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Contact Section */}
            <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
              <div className="text-center">
                <HelpCircle size={48} className="text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-9 mb-2">
                  Não encontrou o que procurava?
                </h3>
                <p className="text-gray-7 mb-4">
                  Nossa equipe está sempre pronta para ajudar você.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/contato"
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-hard text-white rounded-lg transition-colors"
                  >
                    Entre em Contato
                  </a>
                  <a
                    href="tel:+551199999999"
                    className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg transition-colors"
                  >
                    Ligue Agora
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
              {/* Quick Links */}
              <div>
                <h3 className="text-lg font-bold text-gray-9 mb-4">Links Rápidos</h3>
                <div className="space-y-2">
                  <a
                    href="/loja"
                    className="block px-3 py-2 text-gray-7 hover:text-primary hover:bg-gray-1 rounded-lg transition-colors"
                  >
                    Nossos Produtos
                  </a>
                  <a
                    href="/sobre"
                    className="block px-3 py-2 text-gray-7 hover:text-primary hover:bg-gray-1 rounded-lg transition-colors"
                  >
                    Sobre Nós
                  </a>
                  <a
                    href="/blog"
                    className="block px-3 py-2 text-gray-7 hover:text-primary hover:bg-gray-1 rounded-lg transition-colors"
                  >
                    Blog
                  </a>
                  <a
                    href="/contato"
                    className="block px-3 py-2 text-gray-7 hover:text-primary hover:bg-gray-1 rounded-lg transition-colors"
                  >
                    Contato
                  </a>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-bold text-gray-9 mb-4">Informações de Contato</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-9">Telefone</p>
                    <p className="text-gray-7">+55 (11) 9999-9999</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-9">E-mail</p>
                    <p className="text-gray-7">contato@ecobazar.com.br</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-9">Horário</p>
                    <p className="text-gray-7">Segunda a Sexta: 8h às 18h</p>
                    <p className="text-gray-7">Sábado: 8h às 12h</p>
                  </div>
                </div>
              </div>

              {/* Popular Questions */}
              <div>
                <h3 className="text-lg font-bold text-gray-9 mb-4">Perguntas Populares</h3>
                <div className="space-y-3">
                  <a
                    href="#"
                    onClick={() => toggleItem(0)}
                    className="block text-sm text-gray-7 hover:text-primary transition-colors"
                  >
                    O que são alimentos orgânicos?
                  </a>
                  <a
                    href="#"
                    onClick={() => toggleItem(1)}
                    className="block text-sm text-gray-7 hover:text-primary transition-colors"
                  >
                    Como posso ter certeza da qualidade?
                  </a>
                  <a
                    href="#"
                    onClick={() => toggleItem(2)}
                    className="block text-sm text-gray-7 hover:text-primary transition-colors"
                  >
                    Qual a diferença dos produtos convencionais?
                  </a>
                  <a
                    href="#"
                    onClick={() => toggleItem(3)}
                    className="block text-sm text-gray-7 hover:text-primary transition-colors"
                  >
                    Como funciona a entrega?
                  </a>
                </div>
              </div>

              {/* Newsletter */}
              <div className="bg-primary/10 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-9 mb-2">Fique por Dentro</h3>
                <p className="text-sm text-gray-7 mb-4">
                  Receba dicas sobre alimentação orgânica e novidades do Ecobazar.
                </p>
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="Seu e-mail"
                    className="w-full px-3 py-2 border border-gray-3 rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                  <button className="w-full px-3 py-2 bg-primary hover:bg-primary-hard text-white rounded-lg text-sm transition-colors">
                    Inscrever-se
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 