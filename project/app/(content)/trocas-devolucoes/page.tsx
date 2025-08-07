'use client';

import React from 'react';
import Link from 'next/link';
import { RefreshCw, Clock, CheckCircle, AlertCircle, Truck, CreditCard, Phone, Mail } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

export default function TrocasDevolucoesPage() {
  const lastUpdated = '15 de Janeiro de 2024';

  return (
    <div className="min-h-screen bg-gray-1 overflow-x-hidden">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / 
          <span className="text-primary"> Trocas e Devoluções</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <RefreshCw size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-9 mb-4">
            Trocas e Devoluções
          </h1>
          <p className="text-base sm:text-lg text-gray-7 max-w-3xl mx-auto px-4">
            Garantimos sua satisfação total. Conheça nossa política de trocas e devoluções 
            e como solicitar uma devolução.
          </p>
          <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-gray-6">
            <Clock size={16} />
            <span>Última atualização: {lastUpdated}</span>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={24} className="text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-9 mb-2">24 Horas</h3>
            <p className="text-gray-7 text-sm">Prazo para solicitar devolução</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={24} className="text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-9 mb-2">100% Garantido</h3>
            <p className="text-gray-7 text-sm">Satisfação ou seu dinheiro de volta</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck size={24} className="text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-9 mb-2">Coleta Gratuita</h3>
            <p className="text-gray-7 text-sm">Retiramos o produto em sua casa</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard size={24} className="text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-9 mb-2">5 Dias Úteis</h3>
            <p className="text-gray-7 text-sm">Prazo para processar reembolso</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
            <div className="prose prose-lg max-w-none">
              
              {/* Policy Overview */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">Nossa Política</h2>
                <p className="text-gray-7 mb-4">
                  Na Ecobazar, sua satisfação é nossa prioridade. Oferecemos uma política 
                  de devolução generosa para garantir que você sempre receba produtos de 
                  qualidade e fique satisfeito com sua compra.
                </p>
                <p className="text-gray-7">
                  Aceitamos devoluções em até 24 horas após a entrega, desde que o produto 
                  esteja em condições adequadas e na embalagem original.
                </p>
              </section>

              {/* When You Can Return */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">Quando Você Pode Devolver</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-medium text-green-800 mb-3 flex items-center">
                      <CheckCircle size={16} className="mr-2" />
                      Motivos Aceitos
                    </h3>
                    <ul className="text-green-700 text-sm space-y-2">
                      <li>• Produto danificado na entrega</li>
                      <li>• Produto diferente do pedido</li>
                      <li>• Produto fora da validade</li>
                      <li>• Qualidade inferior ao esperado</li>
                      <li>• Arrependimento da compra</li>
                    </ul>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-4">
                    <h3 className="font-medium text-red-800 mb-3 flex items-center">
                      <AlertCircle size={16} className="mr-2" />
                      Motivos Não Aceitos
                    </h3>
                    <ul className="text-red-700 text-sm space-y-2">
                      <li>• Produto consumido ou parcialmente usado</li>
                      <li>• Embalagem violada ou danificada</li>
                      <li>• Produto fora da validade por negligência</li>
                      <li>• Produto personalizado ou sob medida</li>
                      <li>• Produtos perecíveis após 24h</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Return Process */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">Como Solicitar uma Devolução</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-9 mb-2">Entre em Contato</h3>
                      <p className="text-gray-7 text-sm">
                        Ligue para (11) 99999-9999 ou envie um e-mail para suporte@ecobazar.com 
                        em até 24 horas após a entrega. Informe o número do pedido e o motivo da devolução.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-9 mb-2">Aguarde a Aprovação</h3>
                      <p className="text-gray-7 text-sm">
                        Nossa equipe analisará sua solicitação e entrará em contato em até 2 horas 
                        para confirmar a aprovação e agendar a coleta.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-9 mb-2">Prepare o Produto</h3>
                      <p className="text-gray-7 text-sm">
                        Mantenha o produto na embalagem original e em condições adequadas. 
                        Nossa equipe fará a coleta no endereço de entrega.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-9 mb-2">Receba o Reembolso</h3>
                      <p className="text-gray-7 text-sm">
                        Após a análise do produto, processaremos o reembolso em até 5 dias úteis 
                        no mesmo método de pagamento utilizado.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Refund Information */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">Informações sobre Reembolso</h2>
                
                <div className="bg-gray-1 rounded-lg p-6">
                  <h3 className="font-medium text-gray-9 mb-4">Prazos e Métodos de Reembolso</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-9 mb-2">M-Pesa</h4>
                      <p className="text-gray-7 text-sm mb-4">
                        Reembolso processado em até 24 horas após a aprovação da devolução.
                      </p>
                      
                      <h4 className="font-medium text-gray-9 mb-2">Cartão de Crédito</h4>
                      <p className="text-gray-7 text-sm mb-4">
                        Reembolso processado em até 2 faturas, dependendo da bandeira.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-9 mb-2">Cartão de Débito</h4>
                      <p className="text-gray-7 text-sm mb-4">
                        Reembolso processado em até 5 dias úteis.
                      </p>
                      
                      <h4 className="font-medium text-gray-9 mb-2">Dinheiro na Entrega</h4>
                      <p className="text-gray-7 text-sm">
                        Reembolso via M-Pesa ou transferência bancária em até 5 dias úteis.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Exchange Policy */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">Política de Trocas</h2>
                
                <p className="text-gray-7 mb-4">
                  Além de devoluções, também oferecemos a opção de troca por outro produto 
                  de valor equivalente ou superior (com complemento da diferença).
                </p>
                
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-medium text-blue-800 mb-3">Como Funciona a Troca</h3>
                  <ul className="text-blue-700 text-sm space-y-2">
                    <li>• Escolha um produto de valor igual ou superior</li>
                    <li>• Se o valor for superior, pague apenas a diferença</li>
                    <li>• Se o valor for inferior, receba o crédito na sua conta</li>
                    <li>• A troca é processada no mesmo dia da coleta</li>
                    <li>• O novo produto é entregue no próximo dia útil</li>
                  </ul>
                </div>
              </section>

              {/* Special Cases */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">Casos Especiais</h2>
                
                <div className="space-y-4">
                  <div className="border-l-4 border-yellow-400 pl-4">
                    <h3 className="font-medium text-gray-9 mb-2">Produtos Perecíveis</h3>
                    <p className="text-gray-7 text-sm">
                      Para produtos perecíveis (frutas, verduras, laticínios), aceitamos devoluções 
                      apenas se houver problemas de qualidade evidentes. Nestes casos, a devolução 
                      deve ser solicitada imediatamente após a entrega.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-green-400 pl-4">
                    <h3 className="font-medium text-gray-9 mb-2">Produtos Danificados</h3>
                    <p className="text-gray-7 text-sm">
                      Se o produto chegar danificado, tire fotos e entre em contato imediatamente. 
                      Nestes casos, oferecemos reembolso integral e, se possível, reenvio do produto.
                    </p>
                  </div>
                  
                  <div className="border-l-4 border-blue-400 pl-4">
                    <h3 className="font-medium text-gray-9 mb-2">Erro no Pedido</h3>
                    <p className="text-gray-7 text-sm">
                      Se você receber um produto diferente do pedido, entre em contato imediatamente. 
                      Oferecemos reenvio do produto correto ou reembolso integral.
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact Information */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">Entre em Contato</h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Phone size={24} className="text-primary" />
                    </div>
                    <h3 className="font-medium text-gray-9 mb-2">Telefone</h3>
                    <p className="text-gray-7 text-sm">(11) 99999-9999</p>
                    <p className="text-gray-6 text-xs">Segunda a Sexta, 8h às 18h</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Mail size={24} className="text-primary" />
                    </div>
                    <h3 className="font-medium text-gray-9 mb-2">E-mail</h3>
                    <p className="text-gray-7 text-sm">suporte@ecobazar.com</p>
                    <p className="text-gray-6 text-xs">Resposta em até 2 horas</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                      <RefreshCw size={24} className="text-primary" />
                    </div>
                    <h3 className="font-medium text-gray-9 mb-2">Chat Online</h3>
                    <p className="text-gray-7 text-sm">Disponível 24/7</p>
                    <p className="text-gray-6 text-xs">Atendimento instantâneo</p>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-9 mb-6 text-center">
            Perguntas Frequentes
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-9 mb-2">Posso devolver produtos perecíveis?</h3>
              <p className="text-gray-7 text-sm">
                Sim, desde que haja problemas evidentes de qualidade e a devolução seja solicitada 
                imediatamente após a entrega.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-9 mb-2">Quanto tempo leva para receber o reembolso?</h3>
              <p className="text-gray-7 text-sm">
                Depende do método de pagamento: M-Pesa (24h), cartão de débito (5 dias), 
                cartão de crédito (até 2 faturas).
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-9 mb-2">Posso trocar por outro produto?</h3>
              <p className="text-gray-7 text-sm">
                Sim! Oferecemos troca por produtos de valor igual ou superior, 
                com complemento da diferença se necessário.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-9 mb-2">A coleta é gratuita?</h3>
              <p className="text-gray-7 text-sm">
                Sim! Retiramos o produto em sua casa sem custo adicional, 
                desde que a devolução seja aprovada.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="bg-primary/5 rounded-lg p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-9 mb-4">
              Precisa de ajuda com uma devolução?
            </h2>
            <p className="text-gray-7 mb-6 max-w-2xl mx-auto">
              Nossa equipe está pronta para ajudar você com qualquer dúvida sobre 
              trocas e devoluções.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contato">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Fale Conosco
                </Button>
              </Link>
              <Link href="/ajuda">
                <Button className="bg-primary hover:bg-primary-hard text-white">
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