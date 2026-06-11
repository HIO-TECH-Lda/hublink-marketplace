'use client';

import React from 'react';
import Link from 'next/link';
import {
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Search,
  Package,
  CreditCard,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/site-config';

export default function TrocasDevolucoesPage() {
  const lastUpdated = '15 de Janeiro de 2024';

  return (
    <div className="min-h-screen bg-gray-1 overflow-x-hidden">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> /
          <span className="text-primary"> Trocas e Devoluções</span>
        </nav>

        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-9 mb-4">
            Trocas e Devoluções
          </h1>
          <p className="text-base sm:text-lg text-gray-7 max-w-6xl mx-auto px-4">
            Conheça as condições gerais para solicitar troca, devolução ou reembolso de produtos
            adquiridos através do Txova. As solicitações são analisadas conforme o tipo de produto, o
            estado da entrega, as condições do vendedor e as regras da plataforma.
          </p>
          <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-gray-6">
            <Calendar size={16} />
            <span>Última actualização: {lastUpdated}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 mx-auto">
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={24} className="text-primary" />
            </div>
            <h3 className="font-semibold text-gray-9 mb-2">24 horas</h3>
            <p className="text-gray-7 text-sm">
              Prazo recomendado para comunicar problemas após a entrega
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-9 mb-2">Análise do Pedido</h3>
            <p className="text-gray-7 text-sm">
              Cada solicitação é avaliada conforme o produto, o vendedor e o motivo apresentado
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={24} className="text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-9 mb-2">Produto em Boas Condições</h3>
            <p className="text-gray-7 text-sm">
              Sempre que aplicável, o produto deve ser devolvido sem uso indevido e com embalagem
              original
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard size={24} className="text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-9 mb-2">Reembolso ou Troca</h3>
            <p className="text-gray-7 text-sm">
              Quando aprovado, o caso poderá resultar em troca, crédito ou reembolso
            </p>
          </div>
        </div>

        <div className="mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
            <div className="prose prose-lg max-w-none">

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">A Nossa Política</h2>
                <p className="text-gray-7 mb-4">
                  O Txova procura promover uma experiência de compra transparente e segura,
                  aproximando compradores e vendedores locais. Como marketplace, o Txova não é
                  necessariamente o proprietário dos produtos vendidos, mas poderá apoiar na
                  mediação de situações relacionadas com trocas, devoluções, reembolsos ou problemas na
                  entrega.
                </p>
                <p className="text-gray-7 mb-4">
                  As solicitações devem ser feitas, preferencialmente, até 24 horas após a entrega,
                  especialmente em casos de produtos danificados, errados, perecíveis ou com problemas
                  evidentes de qualidade.
                </p>
                <p className="text-gray-7 mb-4">Cada pedido será analisado de acordo com:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-7">
                  <li>Tipo de produto ou serviço;</li>
                  <li>Estado do produto no momento da entrega;</li>
                  <li>Motivo apresentado pelo cliente;</li>
                  <li>Condições definidas pelo vendedor;</li>
                  <li>Disponibilidade de substituição;</li>
                  <li>Evidências apresentadas, como fotografias ou mensagens;</li>
                  <li>Regras gerais da plataforma Txova.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">
                  Quando Pode Solicitar Troca ou Devolução
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-primary/5 rounded-lg p-4">
                    <h3 className="font-medium text-gray-9 mb-3 flex items-center">
                      <CheckCircle size={16} className="mr-2 text-primary" />
                      Motivos Aceites
                    </h3>
                    <p className="text-gray-7 text-sm mb-3">
                      A solicitação poderá ser considerada quando ocorrer uma das seguintes situações:
                    </p>
                    <ul className="text-gray-7 text-sm space-y-2">
                      <li>• Produto danificado no momento da entrega;</li>
                      <li>• Produto diferente do pedido;</li>
                      <li>• Produto com defeito comprovado;</li>
                      <li>• Produto incompleto ou em quantidade diferente da solicitada;</li>
                      <li>• Produto fora das condições anunciadas;</li>
                      <li>• Problema evidente de qualidade;</li>
                      <li>• Erro no envio ou na preparação do pedido;</li>
                      <li>• Outro motivo analisado e aceite pelo vendedor ou pela equipa do Txova.</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 rounded-lg p-4">
                    <h3 className="font-medium text-red-800 mb-3 flex items-center">
                      <AlertCircle size={16} className="mr-2" />
                      Motivos que Podem Não Ser Aceites
                    </h3>
                    <p className="text-red-800 text-sm mb-3">
                      A troca ou devolução poderá não ser aceite quando:
                    </p>
                    <ul className="text-red-700 text-sm space-y-2">
                      <li>• O produto tiver sido consumido, usado ou alterado pelo cliente;</li>
                      <li>• A embalagem estiver danificada por uso indevido;</li>
                      <li>• O problema resultar de má conservação após a entrega;</li>
                      <li>• O produto for personalizado, feito por encomenda ou sob medida;</li>
                      <li>• O produto for perecível e a reclamação for feita fora do prazo razoável;</li>
                      <li>• Não houver evidência suficiente do problema reportado;</li>
                      <li>• A solicitação contrariar as condições previamente apresentadas pelo vendedor.</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">
                  Como Solicitar uma Troca ou Devolução
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-9 mb-2">Crie um Pedido de Apoio</h3>
                      <p className="text-gray-7 text-sm">
                        Aceda à área Ajuda ou ao seu painel de cliente e seleccione Criar Pedido de
                        Apoio. Indique o número do pedido, o produto em causa e o motivo da
                        solicitação. Também pode contactar a equipa do Txova através dos canais de
                        apoio disponíveis.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-9 mb-2">Apresente as Informações Necessárias</h3>
                      <p className="text-gray-7 text-sm mb-2">Para facilitar a análise, envie:</p>
                      <ul className="text-gray-7 text-sm space-y-1 list-disc list-inside">
                        <li>Número do pedido;</li>
                        <li>Nome do produto;</li>
                        <li>Motivo da troca ou devolução;</li>
                        <li>Fotografias, quando aplicável;</li>
                        <li>Descrição clara do problema;</li>
                        <li>Contacto actualizado para seguimento.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-9 mb-2">Aguarde a Análise</h3>
                      <p className="text-gray-7 text-sm">
                        A equipa do Txova ou o vendedor analisará a solicitação e poderá entrar em
                        contacto para confirmar informações, solicitar evidências adicionais ou
                        propor uma solução.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-9 mb-2">Confirmação da Solução</h3>
                      <p className="text-gray-7 text-sm mb-2">
                        Quando a solicitação for aprovada, poderá ser definida uma das seguintes
                        soluções:
                      </p>
                      <ul className="text-gray-7 text-sm space-y-1 list-disc list-inside">
                        <li>Troca por produto igual ou equivalente;</li>
                        <li>Substituição por outro produto;</li>
                        <li>Crédito para compra futura;</li>
                        <li>Reembolso parcial ou total;</li>
                        <li>Outra solução acordada entre comprador, vendedor e plataforma.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">Informações sobre Reembolsos</h2>
                <p className="text-gray-7 mb-4">
                  O reembolso, quando aplicável, dependerá da aprovação da solicitação e do método de
                  pagamento utilizado.
                </p>

                <div className="bg-gray-1 rounded-lg p-6 space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-9 mb-2">M-Pesa ou E-Mola</h4>
                    <p className="text-gray-7 text-sm">
                      O reembolso poderá ser efectuado para o número utilizado no pagamento ou para
                      outro número confirmado pelo cliente.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-9 mb-2">Cartão de Débito ou Crédito</h4>
                    <p className="text-gray-7 text-sm">
                      O prazo poderá depender do banco, emissor do cartão ou provedor de pagamento.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-9 mb-2">Transferência Bancária</h4>
                    <p className="text-gray-7 text-sm">
                      O reembolso poderá ser feito para a conta bancária indicada pelo cliente, após
                      confirmação dos dados.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-9 mb-2">Pagamento no Acto da Entrega</h4>
                    <p className="text-gray-7 text-sm">
                      Quando o pagamento tiver sido feito em numerário ou por outro método no momento
                      da entrega, o reembolso poderá ser feito por M-Pesa, E-Mola, transferência
                      bancária ou outro meio acordado.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">Política de Trocas</h2>
                <p className="text-gray-7 mb-4">Quando a troca for aprovada, o cliente poderá receber:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-7 mb-4">
                  <li>O mesmo produto, caso esteja disponível;</li>
                  <li>Produto equivalente;</li>
                  <li>Produto de valor superior, mediante pagamento da diferença;</li>
                  <li>Crédito para compra futura, quando aplicável.</li>
                </ul>
                <p className="text-gray-7">
                  Caso o novo produto tenha valor inferior, a diferença poderá ser tratada conforme
                  acordo entre as partes e regras da plataforma.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">Casos Especiais</h2>

                <div className="space-y-4">
                  <div className="border-l-4 border-yellow-400 pl-4">
                    <h3 className="font-medium text-gray-9 mb-2">Produtos Perecíveis</h3>
                    <p className="text-gray-7 text-sm">
                      Produtos perecíveis, como alimentos frescos, produtos agrícolas ou outros itens
                      sensíveis, devem ser verificados no acto da entrega. Qualquer problema deve ser
                      comunicado imediatamente ou no prazo mais curto possível.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4">
                    <h3 className="font-medium text-gray-9 mb-2">Produtos Danificados</h3>
                    <p className="text-gray-7 text-sm">
                      Se o produto chegar danificado, o cliente deve tirar fotografias e comunicar a
                      situação através de um pedido de apoio. Sempre que confirmado o problema,
                      poderá ser proposta troca, substituição ou reembolso.
                    </p>
                  </div>

                  <div className="border-l-4 border-blue-400 pl-4">
                    <h3 className="font-medium text-gray-9 mb-2">Erro no Pedido</h3>
                    <p className="text-gray-7 text-sm">
                      Se o cliente receber um produto diferente do pedido, deverá comunicar a
                      situação o mais rapidamente possível. O caso poderá resultar em substituição,
                      troca ou reembolso, conforme a disponibilidade e análise do vendedor.
                    </p>
                  </div>

                  <div className="border-l-4 border-purple-400 pl-4">
                    <h3 className="font-medium text-gray-9 mb-2">Serviços Locais</h3>
                    <p className="text-gray-7 text-sm">
                      No caso de serviços contratados através do Txova, as reclamações serão
                      analisadas conforme a natureza do serviço, as condições combinadas, a execução
                      realizada e as evidências apresentadas.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">Contactos de Apoio</h2>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center bg-gray-1 rounded-lg p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Phone size={24} className="text-primary" />
                    </div>
                    <h3 className="font-medium text-gray-9 mb-2">Telefone</h3>
                    <p className="text-gray-7 text-sm">+258 84 999 9999</p>
                    <p className="text-gray-6 text-xs mt-1">Segunda a Sexta-feira, das 08h00 às 18h00</p>
                  </div>

                  <div className="text-center bg-gray-1 rounded-lg p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Mail size={24} className="text-primary" />
                    </div>
                    <h3 className="font-medium text-gray-9 mb-2">E-mail</h3>
                    <p className="text-gray-7 text-sm">{siteConfig.supportEmail}</p>
                    <p className="text-gray-6 text-xs mt-1">
                      Resposta conforme disponibilidade da equipa de apoio
                    </p>
                  </div>

                  <div className="text-center bg-gray-1 rounded-lg p-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageSquare size={24} className="text-primary" />
                    </div>
                    <h3 className="font-medium text-gray-9 mb-2">Pedido de Apoio</h3>
                    <p className="text-gray-7 text-sm">
                      Crie um pedido de apoio através da sua conta para acompanhar o estado da
                      solicitação.
                    </p>
                    <Link href="/suporte/novo-ticket" className="inline-block mt-3">
                      <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-white">
                        Criar Pedido de Apoio
                      </Button>
                    </Link>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>

        <div className="mt-12 mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-9 mb-6 text-center">
            Perguntas Frequentes
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-9 mb-2">Posso devolver produtos perecíveis?</h3>
              <p className="text-gray-7 text-sm">
                Sim, desde que exista problema evidente de qualidade, erro no pedido ou dano
                identificado no momento da entrega. A comunicação deve ser feita imediatamente ou no
                prazo mais curto possível.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-9 mb-2">Quanto tempo demora o reembolso?</h3>
              <p className="text-gray-7 text-sm">
                O prazo depende do método de pagamento, da confirmação do vendedor e da análise da
                solicitação. A equipa do Txova informará o cliente sobre o seguimento do caso.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-9 mb-2">Posso trocar por outro produto?</h3>
              <p className="text-gray-7 text-sm">
                Sim, quando a troca for aprovada e houver disponibilidade do produto. Caso o novo
                produto tenha valor superior, o cliente poderá pagar a diferença.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-9 mb-2">A recolha do produto é gratuita?</h3>
              <p className="text-gray-7 text-sm">
                A recolha, quando necessária, poderá depender da localização, do vendedor, da equipa de
                entrega e do motivo da devolução. Quando houver custos associados, estes deverão ser
                comunicados antes da confirmação.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm md:col-span-2">
              <h3 className="font-semibold text-gray-9 mb-2">E se o vendedor não responder?</h3>
              <p className="text-gray-7 text-sm">
                O cliente poderá criar um pedido de apoio para que a equipa do Txova acompanhe o caso
                e tente mediar a situação.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center mx-auto">
          <div className="bg-primary/5 rounded-lg p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-9 mb-4">
              Precisa de Ajuda com uma Troca ou Devolução?
            </h2>
            <p className="text-gray-7 mb-6 max-w-2xl mx-auto">
              A equipa do Txova está disponível para apoiar compradores e vendedores na resolução de
              situações relacionadas com trocas, devoluções, reembolsos e problemas na entrega.
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
              <Link href="/ajuda">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Central de Ajuda
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
