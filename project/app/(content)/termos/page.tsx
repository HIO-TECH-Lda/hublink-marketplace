'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Calendar, Shield, Users, ShoppingBag, CreditCard } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

export default function TermosPage() {
  const lastUpdated = '15 de Janeiro de 2024';

  return (
    <div className="min-h-screen bg-gray-1 overflow-x-hidden">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / 
          <span className="text-primary"> Termos de Uso</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-9 mb-4">
            Termos de Uso
          </h1>
          <p className="text-base sm:text-lg text-gray-7 max-w-3xl mx-auto px-4">
            Estes termos governam o uso da plataforma Txova. Ao usar nossos serviços, 
            você concorda com estes termos.
          </p>
          <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-gray-6">
            <Calendar size={16} />
            <span>Última atualização: {lastUpdated}</span>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
            <div className="prose prose-lg max-w-none">
              
              {/* Introduction */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">1. Aceitação dos Termos</h2>
                <p className="text-gray-7 mb-4">
                  Ao acessar e usar a plataforma Txova ("Plataforma"), você aceita e concorda 
                  em cumprir estes Termos de Uso ("Termos"). Se você não concordar com qualquer 
                  parte destes termos, não deve usar nossos serviços.
                </p>
                <p className="text-gray-7">
                  Estes termos se aplicam a todos os usuários da plataforma, incluindo compradores, 
                  vendedores e visitantes.
                </p>
              </section>

              {/* Definitions */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">2. Definições</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-7">
                  <li><strong>"Plataforma"</strong> - O website e aplicativo Txova</li>
                  <li><strong>"Usuário"</strong> - Qualquer pessoa que acesse ou use a plataforma</li>
                  <li><strong>"Comprador"</strong> - Usuário que adquire produtos através da plataforma</li>
                  <li><strong>"Vendedor"</strong> - Usuário que vende produtos através da plataforma</li>
                  <li><strong>"Produto"</strong> - Qualquer item listado para venda na plataforma</li>
                  <li><strong>"Pedido"</strong> - Solicitação de compra de produtos</li>
                </ul>
              </section>

              {/* Account Registration */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">3. Registro de Conta</h2>
                
                <h3 className="text-lg font-medium text-gray-9 mb-3">3.1 Elegibilidade</h3>
                <p className="text-gray-7 mb-4">
                  Para usar nossos serviços, você deve ter pelo menos 18 anos de idade e capacidade 
                  legal para celebrar contratos. Se você for menor de idade, deve ter o consentimento 
                  de um responsável legal.
                </p>

                <h3 className="text-lg font-medium text-gray-9 mb-3">3.2 Informações da Conta</h3>
                <p className="text-gray-7 mb-4">
                  Você é responsável por fornecer informações precisas e atualizadas durante o registro 
                  e manter a confidencialidade de suas credenciais de acesso.
                </p>

                <h3 className="text-lg font-medium text-gray-9 mb-3">3.3 Segurança da Conta</h3>
                <p className="text-gray-7">
                  Você é responsável por todas as atividades que ocorrem em sua conta. Notifique-nos 
                  imediatamente sobre qualquer uso não autorizado.
                </p>
              </section>

              {/* Platform Use */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">4. Uso da Plataforma</h2>
                
                <h3 className="text-lg font-medium text-gray-9 mb-3">4.1 Uso Permitido</h3>
                <p className="text-gray-7 mb-4">
                  A plataforma deve ser usada apenas para fins legais e de acordo com estes termos. 
                  Você pode navegar, comprar e vender produtos orgânicos através da plataforma.
                </p>

                <h3 className="text-lg font-medium text-gray-9 mb-3">4.2 Uso Proibido</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-7 mb-4">
                  <li>Usar a plataforma para atividades ilegais ou fraudulentas</li>
                  <li>Violar direitos de propriedade intelectual</li>
                  <li>Transmitir vírus ou código malicioso</li>
                  <li>Interferir no funcionamento da plataforma</li>
                  <li>Coletar informações de outros usuários sem autorização</li>
                  <li>Usar bots ou scripts automatizados</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-9 mb-3">4.3 Conteúdo do Usuário</h3>
                <p className="text-gray-7">
                  Você mantém a propriedade do conteúdo que enviar, mas nos concede licença para 
                  usar, modificar e distribuir esse conteúdo na plataforma.
                </p>
              </section>

              {/* Buying and Selling */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">5. Compra e Venda</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-1 rounded-lg p-4">
                    <h4 className="font-medium text-gray-9 mb-2 flex items-center">
                      <ShoppingBag size={16} className="mr-2" />
                      Para Compradores
                    </h4>
                    <ul className="text-gray-7 text-sm space-y-1">
                      <li>• Verifique as descrições dos produtos</li>
                      <li>• Confirme preços antes de finalizar</li>
                      <li>• Forneça informações de entrega precisas</li>
                      <li>• Pague pelo pedido no momento da compra</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-1 rounded-lg p-4">
                    <h4 className="font-medium text-gray-9 mb-2 flex items-center">
                      <Users size={16} className="mr-2" />
                      Para Vendedores
                    </h4>
                    <ul className="text-gray-7 text-sm space-y-1">
                      <li>• Forneça descrições precisas dos produtos</li>
                      <li>• Mantenha estoque atualizado</li>
                      <li>• Cumpra prazos de entrega</li>
                      <li>• Garanta qualidade dos produtos</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-lg font-medium text-gray-9 mb-3">5.1 Preços e Pagamentos</h3>
                <p className="text-gray-7 mb-4">
                  Todos os preços são exibidos em Reais (MTn) e incluem impostos aplicáveis. 
                  Aceitamos M-Pesa, cartões de crédito/débito e dinheiro na entrega.
                </p>

                <h3 className="text-lg font-medium text-gray-9 mb-3">5.2 Entrega</h3>
                <p className="text-gray-7 mb-4">
                  Entregamos em até 24 horas na região metropolitana. Prazos podem variar 
                  conforme localização e disponibilidade.
                </p>

                <h3 className="text-lg font-medium text-gray-9 mb-3">5.3 Cancelamentos</h3>
                <p className="text-gray-7">
                  Pedidos podem ser cancelados até 2 horas antes da entrega programada. 
                  Reembolsos seguem nossa política de devoluções.
                </p>
              </section>

              {/* Product Quality */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">6. Qualidade dos Produtos</h2>
                
                <div className="bg-primary/5 rounded-lg p-6 mb-4">
                  <div className="flex items-start space-x-3">
                    <Shield size={20} className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-9 mb-2">Compromisso com Qualidade</h4>
                      <ul className="text-gray-7 text-sm space-y-1">
                        <li>• Todos os produtos são orgânicos certificados</li>
                        <li>• Controle rigoroso de qualidade</li>
                        <li>• Armazenamento adequado</li>
                        <li>• Entrega em condições ideais</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-7">
                  Trabalhamos apenas com produtores certificados e implementamos controles 
                  rigorosos para garantir a qualidade e frescor dos produtos.
                </p>
              </section>

              {/* Returns and Refunds */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">7. Trocas e Devoluções</h2>
                
                <h3 className="text-lg font-medium text-gray-9 mb-3">7.1 Política de Devolução</h3>
                <p className="text-gray-7 mb-4">
                  Aceitamos devoluções em até 24 horas após a entrega, desde que o produto 
                  esteja em condições adequadas e na embalagem original.
                </p>

                <h3 className="text-lg font-medium text-gray-9 mb-3">7.2 Processo de Devolução</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-7 mb-4">
                  <li>Entre em contato conosco em até 24h após a entrega</li>
                  <li>Descreva o motivo da devolução</li>
                  <li>Agende a coleta do produto</li>
                  <li>Receba o reembolso após análise</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-9 mb-3">7.3 Reembolsos</h3>
                <p className="text-gray-7">
                  Reembolsos são processados em até 5 dias úteis após a aprovação da devolução, 
                  no mesmo método de pagamento utilizado.
                </p>
              </section>

              {/* Privacy and Data */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">8. Privacidade e Dados</h2>
                
                <p className="text-gray-7 mb-4">
                  Sua privacidade é importante para nós. O uso de suas informações pessoais 
                  é regido por nossa Política de Privacidade, que faz parte destes termos.
                </p>
                
                <p className="text-gray-7">
                  Ao usar a plataforma, você concorda com a coleta e uso de suas informações 
                  conforme descrito em nossa Política de Privacidade.
                </p>
              </section>

              {/* Intellectual Property */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">9. Propriedade Intelectual</h2>
                
                <p className="text-gray-7 mb-4">
                  A plataforma e todo seu conteúdo, incluindo textos, imagens, logos e software, 
                  são propriedade da Txova ou de nossos licenciadores.
                </p>
                
                <p className="text-gray-7">
                  Você não pode copiar, modificar, distribuir ou criar trabalhos derivados 
                  sem nossa autorização expressa.
                </p>
              </section>

              {/* Limitation of Liability */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">10. Limitação de Responsabilidade</h2>
                
                <p className="text-gray-7 mb-4">
                  Em nenhuma circunstância a Txova será responsável por danos indiretos, 
                  incidentais, especiais ou consequenciais decorrentes do uso da plataforma.
                </p>
                
                <p className="text-gray-7">
                  Nossa responsabilidade total não excederá o valor pago pelo produto ou serviço 
                  que deu origem ao dano.
                </p>
              </section>

              {/* Termination */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">11. Rescisão</h2>
                
                <p className="text-gray-7 mb-4">
                  Podemos suspender ou encerrar sua conta a qualquer momento, com ou sem aviso, 
                  se você violar estes termos ou por qualquer outro motivo a nosso critério.
                </p>
                
                <p className="text-gray-7">
                  Você pode encerrar sua conta a qualquer momento através das configurações 
                  da plataforma ou entrando em contato conosco.
                </p>
              </section>

              {/* Governing Law */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">12. Lei Aplicável</h2>
                
                <p className="text-gray-7">
                  Estes termos são regidos pelas leis brasileiras. Qualquer disputa será 
                  resolvida nos tribunais da comarca de São Paulo, SP.
                </p>
              </section>

              {/* Changes to Terms */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">13. Alterações nos Termos</h2>
                
                <p className="text-gray-7 mb-4">
                  Reservamo-nos o direito de modificar estes termos a qualquer momento. 
                  Alterações significativas serão notificadas através de:
                </p>
                
                <ul className="list-disc list-inside space-y-2 text-gray-7 mb-4">
                  <li>E-mail para o endereço registrado</li>
                  <li>Notificação na plataforma</li>
                  <li>Atualização da data de "Última atualização"</li>
                </ul>
                
                <p className="text-gray-7">
                  O uso continuado da plataforma após as alterações constitui aceitação 
                  dos novos termos.
                </p>
              </section>

              {/* Contact Information */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">14. Entre em Contato</h2>
                
                <div className="bg-gray-1 rounded-lg p-6">
                  <p className="text-gray-7 mb-4">
                    Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco:
                  </p>
                  
                  <div className="space-y-2 text-gray-7">
                    <p><strong>E-mail:</strong> juridico@ecobazar.com</p>
                    <p><strong>Telefone:</strong> (11) 99999-9999</p>
                    <p><strong>Endereço:</strong> Rua das Flores, 123 - Centro, São Paulo, SP - 01234-567</p>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <div className="bg-primary/5 rounded-lg p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-9 mb-4">
              Precisa de esclarecimentos?
            </h2>
            <p className="text-gray-7 mb-6 max-w-2xl mx-auto">
              Nossa equipe jurídica está disponível para esclarecer qualquer dúvida 
              sobre nossos termos de uso.
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