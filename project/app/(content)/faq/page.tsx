'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/site-config';

const faqs = [
  {
    question: 'O que é o Txova?',
    answer:
      'O Txova é um marketplace moçambicano criado para dar visibilidade a negócios locais, vendedores informais, pequenos empreendedores, produtores e prestadores de serviços. A plataforma aproxima quem vende de quem procura, facilitando a divulgação, a compra e a venda de produtos e serviços locais.',
  },
  {
    question: 'Que tipo de produtos e serviços posso encontrar no Txova?',
    answer:
      'No Txova pode encontrar diferentes produtos e serviços divulgados por vendedores locais, incluindo alimentação, moda, mobília, artigos para casa, acessórios, produtos agrícolas, serviços locais e outras ofertas disponíveis na comunidade.',
  },
  {
    question: 'O Txova vende directamente os produtos?',
    answer:
      'O Txova funciona como uma montra digital e plataforma de aproximação entre compradores e vendedores. Os produtos e serviços são publicados pelos vendedores registados, que são responsáveis pela disponibilidade, qualidade, preço, entrega e atendimento, conforme as condições apresentadas.',
  },
  {
    question: 'Como posso comprar no Txova?',
    answer:
      'Pode pesquisar o produto ou serviço pretendido, consultar as informações disponíveis, seleccionar o vendedor e seguir os passos indicados para concluir o pedido.',
  },
  {
    question: 'Quais são as formas de pagamento aceites?',
    answer:
      'O Txova poderá aceitar pagamentos por M-Pesa, E-Mola, Imali, cartão de débito, cartão de crédito, transferência bancária, numerário e pagamento no acto da entrega, conforme as opções disponíveis para cada pedido, vendedor ou zona de entrega.',
  },
  {
    question: 'Como funciona o pagamento no acto da entrega?',
    answer:
      'Quando esta opção estiver disponível, o cliente poderá pagar apenas no momento da entrega, por numerário, M-Pesa, E-Mola, cartão ou outro método aceite pelo vendedor ou pela equipa de entrega.',
  },
  {
    question: 'Como funciona o processo de entrega?',
    answer:
      'A entrega pode variar conforme a localização do vendedor, a localização do cliente, o tipo de produto e a disponibilidade do serviço de entrega. Quando aplicável, o valor e as condições de entrega serão apresentados antes da confirmação do pedido.',
  },
  {
    question: 'O Txova entrega em toda a cidade?',
    answer:
      'A cobertura de entrega depende da zona do cliente, da localização do vendedor e das condições disponíveis para cada pedido. Em algumas situações, a entrega poderá ser feita pelo vendedor, por parceiros de entrega ou por equipa associada à plataforma.',
  },
  {
    question: 'Posso cancelar ou alterar o meu pedido?',
    answer:
      'Sim, desde que o pedido ainda não esteja confirmado, em preparação ou a caminho da entrega. Depois dessa fase, o cancelamento ou alteração poderá depender das condições do vendedor ou da natureza do produto ou serviço.',
  },
  {
    question: 'Como posso acompanhar o meu pedido?',
    answer:
      'Pode acompanhar o estado do seu pedido na área Os Meus Pedidos, dentro do seu painel de cliente. Nessa área poderá consultar detalhes da compra, estado do pedido, valores e outras informações relevantes.',
  },
  {
    question: 'Como sei se um vendedor é confiável?',
    answer:
      'O Txova incentiva a identificação clara dos vendedores, a apresentação de contactos, localização, avaliações de clientes e, sempre que possível, a verificação dos vendedores. Antes de comprar, consulte a descrição do produto, o perfil do vendedor e as condições de venda.',
  },
  {
    question: 'Os produtos têm garantia de qualidade?',
    answer:
      'A qualidade dos produtos e serviços é da responsabilidade dos vendedores. O Txova promove boas práticas de divulgação, transparência e atendimento, podendo apoiar na mediação de situações reportadas pelos clientes através dos pedidos de apoio.',
  },
  {
    question: 'Posso contactar o vendedor antes de comprar?',
    answer:
      'Sempre que esta opção estiver disponível, poderá contactar o vendedor para esclarecer dúvidas sobre preço, quantidade, disponibilidade, entrega, características do produto ou condições do serviço.',
  },
  {
    question: 'Como posso tornar-me vendedor no Txova?',
    answer:
      'Pode registar-se como vendedor, criar a sua banca digital e publicar os seus produtos ou serviços. O Txova aceita pequenos negócios, vendedores informais, produtores, prestadores de serviços e empreendedores que desejam ganhar mais visibilidade e alcançar novos clientes.',
  },
  {
    question: 'Preciso de ter empresa formalizada para vender no Txova?',
    answer:
      'Não necessariamente. O Txova também foi criado para apoiar vendedores informais e pequenos negócios. No entanto, todos os vendedores devem fornecer informações verdadeiras, cumprir as regras da plataforma e respeitar a legislação aplicável.',
  },
  {
    question: 'Como posso criar um pedido de apoio?',
    answer:
      'Aceda à área Ajuda ou ao seu painel de cliente e seleccione Criar Pedido de Apoio. Depois, descreva a situação com o máximo de detalhe possível para que a equipa do Txova possa analisar e responder.',
  },
];

const popularQuestions = [
  { label: 'O que é o Txova?', index: 0 },
  { label: 'Como posso comprar no Txova?', index: 3 },
  { label: 'Quais são as formas de pagamento aceites?', index: 4 },
  { label: 'Como funciona a entrega?', index: 6 },
  { label: 'Como posso tornar-me vendedor?', index: 13 },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const openPopularQuestion = (index: number) => {
    setOpenItems((prev) => (prev.includes(index) ? prev : [...prev, index]));
    document.getElementById(`faq-${index}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-gray-1">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> /
          <Link href="/ajuda" className="hover:text-primary"> Ajuda</Link> /
          <span className="text-primary"> Perguntas Frequentes</span>
        </nav>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-9 mb-2">
                Ajuda
              </h1>
              <p className="text-lg font-medium text-gray-8 mb-3">Como podemos ajudar?</p>
              <p className="text-lg text-gray-7">
                Encontre respostas sobre compras, vendas, pagamentos, entregas, pedidos, conta de utilizador
                e funcionamento do Txova. A nossa equipa está disponível para apoiar compradores,
                vendedores, pequenos negócios e parceiros.
              </p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={faq.question}
                  id={`faq-${index}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden scroll-mt-24"
                >
                  <button
                    type="button"
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

            <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
              <div className="text-center">
                <HelpCircle size={48} className="text-primary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-9 mb-2">
                  Não encontrou o que procurava?
                </h3>
                <p className="text-gray-7 mb-4">
                  A nossa equipa está disponível para apoiar compradores, vendedores e parceiros.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contato">
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                      Fale Connosco
                    </Button>
                  </Link>
                  <Link href="/suporte/novo-ticket">
                    <Button className="bg-primary hover:bg-primary-hard text-white">
                      Criar Pedido de Apoio
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-8">
              <div>
                <h3 className="text-lg font-bold text-gray-9 mb-4">Links Rápidos</h3>
                <div className="space-y-2">
                  <Link
                    href="/loja"
                    className="block px-3 py-2 text-gray-7 hover:text-primary hover:bg-gray-1 rounded-lg transition-colors"
                  >
                    Comprar
                  </Link>
                  <Link
                    href="/sobre"
                    className="block px-3 py-2 text-gray-7 hover:text-primary hover:bg-gray-1 rounded-lg transition-colors"
                  >
                    Sobre o Txova
                  </Link>
                  <Link
                    href="/blog"
                    className="block px-3 py-2 text-gray-7 hover:text-primary hover:bg-gray-1 rounded-lg transition-colors"
                  >
                    Novidades
                  </Link>
                  <Link
                    href="/contato"
                    className="block px-3 py-2 text-gray-7 hover:text-primary hover:bg-gray-1 rounded-lg transition-colors"
                  >
                    Contacto
                  </Link>
                  <Link
                    href="/ajuda"
                    className="block px-3 py-2 text-gray-7 hover:text-primary hover:bg-gray-1 rounded-lg transition-colors"
                  >
                    Ajuda
                  </Link>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-9 mb-4">Informações de Contacto</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-gray-9">Telefone</p>
                    <p className="text-gray-7">+258 84 999 9999</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-9">E-mail</p>
                    <p className="text-gray-7">{siteConfig.contactEmail}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-9">Horário de Atendimento</p>
                    <p className="text-gray-7">Segunda a Sexta-feira: 08h00 às 18h00</p>
                    <p className="text-gray-7">Sábado: 08h00 às 12h00</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-9 mb-4">Perguntas Populares</h3>
                <div className="space-y-3">
                  {popularQuestions.map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => openPopularQuestion(item.index)}
                      className="block text-left text-sm text-gray-7 hover:text-primary transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-primary/10 rounded-lg p-4">
                <h3 className="text-lg font-bold text-gray-9 mb-2">Fique por Dentro</h3>
                <p className="text-sm text-gray-7 mb-4">
                  Receba novidades, promoções, oportunidades e conteúdos úteis sobre produtos,
                  serviços e negócios locais disponíveis no Txova.
                </p>
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="Introduza o seu e-mail"
                    className="w-full px-3 py-2 border border-gray-3 rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                  <Button type="button" className="w-full bg-primary hover:bg-primary-hard text-white">
                    Subscrever
                  </Button>
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
