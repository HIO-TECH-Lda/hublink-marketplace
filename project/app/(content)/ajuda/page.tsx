'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Phone,
  Mail,
  MessageSquare,
  FileText,
  ShoppingBag,
  CreditCard,
  Truck,
  Shield,
  Store,
  RotateCcw,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { siteConfig } from '@/lib/site-config';

type FaqItem = { question: string; answer: string };
type FaqCategory = { id: string; name: string; icon: React.ElementType; items: FaqItem[] };

const faqCategories: FaqCategory[] = [
  {
    id: 'pedidos',
    name: 'Pedidos',
    icon: ShoppingBag,
    items: [
      {
        question: 'Como faço um pedido?',
        answer:
          'Pesquise o produto ou serviço que pretende, adicione ao carrinho e finalize o pedido com os seus dados de contacto e entrega. O pagamento poderá ser feito por M-Pesa, E-Mola, cartão, transferência ou no acto da entrega, conforme as opções disponíveis.',
      },
      {
        question: 'Posso cancelar o meu pedido?',
        answer:
          'Sim. O pedido pode ser cancelado antes da sua confirmação final, preparação ou envio para entrega. Depois dessa fase, o cancelamento poderá depender das condições do vendedor ou da natureza do produto.',
      },
      {
        question: 'Como acompanho o meu pedido?',
        answer:
          'Aceda à área Os Meus Pedidos, no seu painel de cliente, para consultar o estado do pedido, detalhes da compra e informações disponíveis sobre a entrega.',
      },
      {
        question: 'Posso alterar o endereço de entrega?',
        answer:
          'Sim, desde que o pedido ainda não esteja em preparação ou a caminho da entrega. Para pedidos já em processamento, contacte a equipa do Txova ou o vendedor para verificar se a alteração ainda é possível.',
      },
    ],
  },
  {
    id: 'pagamentos',
    name: 'Pagamentos',
    icon: CreditCard,
    items: [
      {
        question: 'Quais são as formas de pagamento aceites?',
        answer:
          'O Txova poderá aceitar pagamentos por M-Pesa, E-Mola, Imali, cartão de débito, cartão de crédito, transferência bancária, numerário e pagamento no acto da entrega, conforme as opções disponíveis para cada pedido, vendedor ou zona de entrega.',
      },
      {
        question: 'O pagamento é seguro?',
        answer:
          'Sim. As informações de pagamento são tratadas com segurança e utilizadas apenas para processar, confirmar ou acompanhar a transacção. Em pagamentos móveis ou por cartão, a confirmação poderá depender do respectivo provedor de pagamento.',
      },
      {
        question: 'Posso pagar no acto da entrega?',
        answer:
          'Sim. Sempre que esta opção estiver disponível, poderá pagar no momento da entrega por numerário, M-Pesa, E-Mola, cartão ou outro método aceite pelo vendedor ou pela equipa de entrega.',
      },
      {
        question: 'Posso pagar a minha compra em prestações?',
        answer:
          'Neste momento, o pagamento em prestações poderá não estar disponível para todos os pedidos. Caso esta opção venha a ser activada, será apresentada no momento da finalização da compra.',
      },
      {
        question: 'Como funciona o pagamento por M-Pesa?',
        answer:
          'Ao seleccionar M-Pesa como método de pagamento, deverá seguir as instruções apresentadas na plataforma. Poderá receber uma notificação no telemóvel, um pedido de confirmação ou instruções para concluir o pagamento. O pedido só será validado após a confirmação da transacção.',
      },
      {
        question: 'Como funciona o pagamento por E-Mola?',
        answer:
          'Ao escolher E-Mola, deverá confirmar o pagamento através da sua carteira móvel, seguindo as instruções apresentadas no momento da compra. A confirmação do pedido dependerá da validação da transacção.',
      },
      {
        question: 'O que acontece se o pagamento falhar?',
        answer:
          'Se o pagamento falhar, o pedido poderá ficar pendente até que a transacção seja concluída. Pode tentar novamente, escolher outro método de pagamento ou criar um pedido de apoio para receber assistência da equipa do Txova.',
      },
      {
        question: 'Recebo comprovativo do pagamento?',
        answer:
          'Sempre que possível, o Txova apresentará a confirmação do pagamento na sua conta. Também poderá guardar a mensagem de confirmação enviada pelo M-Pesa, E-Mola, banco ou outro provedor utilizado.',
      },
    ],
  },
  {
    id: 'entregas',
    name: 'Entregas',
    icon: Truck,
    items: [
      {
        question: 'Qual é o prazo de entrega?',
        answer:
          'O prazo de entrega pode variar conforme a localização do vendedor, a localização do cliente, o tipo de produto e a disponibilidade do serviço de entrega. Sempre que possível, a previsão de entrega será apresentada no momento da finalização do pedido.',
      },
      {
        question: 'O Txova entrega em toda a cidade?',
        answer:
          'A cobertura de entrega depende da zona do cliente, da localização do vendedor e das condições disponíveis para cada pedido. Em algumas áreas, a entrega poderá ser feita directamente pelo vendedor, por parceiros de entrega ou por equipa associada à plataforma.',
      },
      {
        question: 'Posso escolher o horário de entrega?',
        answer:
          'Sempre que esta opção estiver disponível, poderá indicar o período mais conveniente para receber o pedido, como manhã, tarde ou outro horário combinado. A confirmação dependerá da disponibilidade do vendedor ou da equipa de entrega.',
      },
      {
        question: 'Há taxa de entrega?',
        answer:
          'A taxa de entrega pode variar conforme a localização, o valor do pedido, o tipo de produto e as condições definidas pelo vendedor ou pela plataforma. Quando aplicável, o valor da entrega será apresentado antes da confirmação do pedido.',
      },
      {
        question: 'Posso alterar o endereço de entrega?',
        answer:
          'Sim, desde que o pedido ainda não esteja em preparação ou a caminho da entrega. Para pedidos já em processamento, deve contactar o vendedor ou criar um pedido de apoio para verificar se a alteração ainda é possível.',
      },
    ],
  },
  {
    id: 'conta',
    name: 'A Minha Conta',
    icon: Shield,
    items: [
      {
        question: 'Como crio uma conta no Txova?',
        answer:
          'Pode criar uma conta preenchendo os seus dados básicos, como nome, e-mail, telefone e palavra-passe. Depois de registado, poderá comprar, acompanhar pedidos, guardar produtos favoritos e criar pedidos de apoio.',
      },
      {
        question: 'Como actualizo os meus dados?',
        answer:
          'Aceda ao seu painel de cliente e entre em Configurações. Nessa área poderá actualizar os seus dados pessoais, telefone, endereço de entrega, endereço de facturação, preferências e palavra-passe.',
      },
      {
        question: 'Esqueci-me da palavra-passe. O que devo fazer?',
        answer:
          'Na página de entrada, seleccione a opção Esqueceu-se da palavra-passe? e siga as instruções para recuperar o acesso à sua conta.',
      },
      {
        question: 'Onde posso acompanhar os meus pedidos?',
        answer:
          'Pode acompanhar os seus pedidos na área Os Meus Pedidos, dentro do seu painel de cliente. Nessa página poderá consultar o estado do pedido, valores, produtos comprados e outras informações relevantes.',
      },
    ],
  },
  {
    id: 'produtos',
    name: 'Produtos e Serviços',
    icon: FileText,
    items: [
      {
        question: 'Que tipo de produtos e serviços posso encontrar no Txova?',
        answer:
          'No Txova pode encontrar produtos e serviços divulgados por vendedores locais, pequenos negócios, produtores, empreendedores informais e prestadores de serviços. As categorias podem incluir alimentação, moda, mobília, casa e jardim, acessórios, serviços locais e outras ofertas da comunidade.',
      },
      {
        question: 'O Txova vende directamente os produtos?',
        answer:
          'O Txova funciona como uma montra digital que aproxima compradores e vendedores. Os produtos e serviços são publicados pelos vendedores registados, que são responsáveis pelas informações, disponibilidade, qualidade e entrega, conforme as condições de cada pedido.',
      },
      {
        question: 'Como sei se um produto está disponível?',
        answer:
          'A disponibilidade é indicada na página do produto. No entanto, como alguns vendedores podem vender também por outros canais, recomenda-se confirmar a disponibilidade antes de finalizar o pedido, sempre que necessário.',
      },
      {
        question: 'Posso contactar o vendedor antes de comprar?',
        answer:
          'Sempre que esta opção estiver disponível, poderá contactar o vendedor para esclarecer dúvidas sobre o produto, preço, entrega, quantidade, estado ou condições de venda.',
      },
      {
        question: 'Como posso guardar produtos para ver mais tarde?',
        answer:
          'Pode adicionar produtos à sua Lista de Desejos para consultar, comparar ou comprar mais tarde.',
      },
    ],
  },
  {
    id: 'vendedores',
    name: 'Vendedores',
    icon: Store,
    items: [
      {
        question: 'Como posso vender no Txova?',
        answer:
          'Pode candidatar-se através da página Seja Vendedor no Txova. A plataforma aceita vendedores formais e informais, desde que respeitem as regras da plataforma, a legislação aplicável e os princípios de transparência e boa-fé.',
      },
      {
        question: 'Quem é responsável pelos produtos anunciados?',
        answer:
          'Os produtos e serviços são publicados pelos vendedores registados, que são responsáveis pelas informações, disponibilidade, qualidade e entrega, conforme as condições de cada pedido.',
      },
    ],
  },
  {
    id: 'reembolsos',
    name: 'Reembolsos',
    icon: RotateCcw,
    items: [
      {
        question: 'Como solicito um reembolso?',
        answer:
          'Pode criar um pedido de apoio na categoria Reembolso ou consultar a página Trocas e Devoluções para conhecer as condições aplicáveis ao seu caso.',
      },
      {
        question: 'Quando recebo o reembolso?',
        answer:
          'Quando aplicável, o reembolso poderá ser efectuado pelo mesmo método de pagamento utilizado ou por outro meio acordado entre as partes. O prazo e a aprovação dependerão da análise do caso, da confirmação do vendedor e das regras aplicáveis.',
      },
    ],
  },
];

const tips = [
  {
    title: 'Verifique os dados do pedido antes de finalizar',
    description: 'Confirme o produto, quantidade, preço, contacto e endereço de entrega.',
  },
  {
    title: 'Mantenha os seus dados actualizados',
    description: 'Actualize o telefone, e-mail e endereço para facilitar o contacto e a entrega.',
  },
  {
    title: 'Acompanhe os seus pedidos pelo painel do cliente',
    description: 'Consulte o estado dos seus pedidos e mensagens importantes na sua conta.',
  },
  {
    title: 'Leia as informações do vendedor',
    description:
      'Antes de comprar, verifique a descrição do produto, condições de entrega e dados do vendedor.',
  },
  {
    title: 'Use os pedidos de apoio sempre que necessário',
    description:
      'Se tiver dúvidas, problemas ou reclamações, crie um pedido de apoio para que a equipa do Txova possa acompanhar o caso.',
  },
];

export default function AjudaPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('pedidos');

  const filteredFAQs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      return faqCategories
        .flatMap((category) => category.items)
        .filter(
          (faq) =>
            faq.question.toLowerCase().includes(query) || faq.answer.toLowerCase().includes(query),
        );
    }
    return faqCategories.find((category) => category.id === activeCategory)?.items ?? [];
  }, [searchQuery, activeCategory]);

  const contactMethods = [
    {
      icon: Phone,
      title: 'Telefone',
      description: 'Fale directamente com a nossa equipa de apoio.',
      contact: '+258 84 999 9999',
      action: 'Ligar Agora',
      href: 'tel:+258849999999',
    },
    {
      icon: Mail,
      title: 'E-mail',
      description: 'Envie a sua dúvida, reclamação ou pedido de esclarecimento por e-mail.',
      contact: siteConfig.supportEmail,
      action: 'Enviar E-mail',
      href: `mailto:${siteConfig.supportEmail}`,
    },
    {
      icon: MessageSquare,
      title: 'Pedido de Apoio',
      description: 'Crie um pedido de apoio e acompanhe a resposta através da sua conta.',
      contact: 'Disponível a qualquer momento',
      action: 'Criar Pedido de Apoio',
      href: '/suporte/novo-ticket',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-1 overflow-x-hidden">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> /
          <span className="text-primary"> Central de Ajuda</span>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-9 mb-4">
            Central de Ajuda
          </h1>
          <p className="text-base sm:text-lg text-gray-7 max-w-6xl mx-auto px-4 mb-8">
            Encontre respostas rápidas sobre compras, pagamentos, entregas, conta de utilizador,
            produtos, vendedores e funcionamento do Txova. Caso não encontre a informação que
            procura, pode contactar a nossa equipa ou criar um pedido de apoio.
          </p>

          <div className="mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-4" size={20} />
              <Input
                type="text"
                placeholder="Pesquisar na Central de Ajuda..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3"
              />
            </div>
            <p className="text-sm text-gray-6 mt-2">Digite a sua dúvida...</p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-9 mb-6 text-center">
            Precisa de Ajuda Imediata?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {contactMethods.map((method) => (
              <div key={method.title} className="bg-white rounded-lg p-6 shadow-sm text-center">
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

        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-9 mb-6 text-center">
            Perguntas Frequentes
          </h2>

          {!searchQuery.trim() && (
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {faqCategories.map((category) => {
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
          )}

          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              {filteredFAQs.length === 0 ? (
                <p className="text-gray-6 text-center py-8">
                  Nenhuma pergunta encontrada. Tente outro termo ou contacte a nossa equipa.
                </p>
              ) : (
                <div className="space-y-6">
                  {filteredFAQs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-2 pb-6 last:border-b-0">
                      <h3 className="font-semibold text-gray-9 mb-2 text-sm sm:text-base">
                        {faq.question}
                      </h3>
                      <p className="text-gray-7 text-sm sm:text-base">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="font-semibold text-gray-9 mb-4">Links Úteis</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/termos" className="text-primary hover:text-primary-hard text-sm">
                  Termos de Utilização
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
                  Seja Vendedor no Txova
                </Link>
              </li>
              <li>
                <Link href="/suporte/novo-ticket" className="text-primary hover:text-primary-hard text-sm">
                  Criar Pedido de Apoio
                </Link>
              </li>
              <li>
                <Link href="/suporte/meus-tickets" className="text-primary hover:text-primary-hard text-sm">
                  Os Meus Pedidos de Apoio
                </Link>
              </li>
            </ul>
          </div>

          <div className="bg-primary/5 rounded-lg p-6">
            <h3 className="font-semibold text-gray-9 mb-4">Ainda Precisa de Ajuda?</h3>
            <p className="text-gray-7 text-sm mb-4">
              A nossa equipa está disponível para apoiar compradores, vendedores e parceiros em
              dúvidas, problemas técnicos, pagamentos, entregas, reembolsos, produtos ou utilização
              da plataforma.
            </p>
            <div className="flex flex-col gap-3">
              <Link href="/contato">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary hover:text-white">
                  Fale Connosco
                </Button>
              </Link>
              <Link href="/suporte/novo-ticket">
                <Button className="bg-primary hover:bg-primary-hard text-white w-full">
                  Criar Pedido de Apoio
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h3 className="font-semibold text-gray-9 mb-4">Dicas para uma Melhor Experiência</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {tips.map((tip, index) => (
              <div key={tip.title} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary text-xs font-semibold">{index + 1}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-9 text-sm mb-1">{tip.title}</p>
                  <p className="text-gray-7 text-sm">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
