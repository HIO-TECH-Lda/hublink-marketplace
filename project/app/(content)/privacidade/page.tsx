'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Lock, Calendar } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/site-config';

export default function PrivacidadePage() {
  const lastUpdated = '15 de Janeiro de 2024';

  return (
    <div className="min-h-screen bg-gray-1 overflow-x-hidden">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> /
          <span className="text-primary"> Política de Privacidade</span>
        </nav>

        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-9 mb-4">
            Política de Privacidade
          </h1>
          <p className="text-base sm:text-lg text-gray-7 max-w-6xl mx-auto px-4">
            A sua privacidade é importante para o Txova. Esta Política de Privacidade explica como
            recolhemos, utilizamos, armazenamos, protegemos e tratamos os seus dados pessoais quando
            acede ou utiliza a nossa plataforma.
          </p>
          <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-gray-6">
            <Calendar size={16} />
            <span>Última actualização: {lastUpdated}</span>
          </div>
        </div>

        <div className="mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
            <div className="prose prose-lg max-w-none">

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">1. Introdução</h2>
                <p className="text-gray-7 mb-4">
                  O Txova é uma plataforma moçambicana que aproxima compradores, vendedores locais,
                  pequenos negócios, empreendedores informais, produtores e prestadores de serviços.
                </p>
                <p className="text-gray-7 mb-4">
                  Ao utilizar a plataforma Txova, o utilizador reconhece que leu e compreendeu esta
                  Política de Privacidade e aceita o tratamento dos seus dados pessoais nos termos aqui
                  descritos.
                </p>
                <p className="text-gray-7">
                  Esta política aplica-se a compradores, vendedores, visitantes, parceiros e demais
                  utilizadores da plataforma.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">2. Dados que Recolhemos</h2>

                <h3 className="text-lg font-medium text-gray-9 mb-3">2.1 Dados Pessoais</h3>
                <p className="text-gray-7 mb-4">
                  Podemos recolher dados pessoais fornecidos directamente pelo utilizador, incluindo:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-7 mb-4">
                  <li>Nome completo;</li>
                  <li>E-mail;</li>
                  <li>Número de telefone;</li>
                  <li>Endereço de entrega;</li>
                  <li>Endereço de facturação;</li>
                  <li>Dados de conta;</li>
                  <li>Informações necessárias para compras, vendas, entregas, pagamentos e apoio ao cliente.</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-9 mb-3">2.2 Dados de Compras e Utilização</h3>
                <p className="text-gray-7 mb-4">
                  Podemos recolher informações relacionadas com a utilização da plataforma, tais como:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-7 mb-4">
                  <li>Histórico de pedidos;</li>
                  <li>Produtos ou serviços visualizados;</li>
                  <li>Produtos guardados na lista de desejos;</li>
                  <li>Interacções com vendedores;</li>
                  <li>Pedidos de apoio;</li>
                  <li>Preferências de navegação;</li>
                  <li>Avaliações, comentários ou mensagens enviadas através da plataforma.</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-9 mb-3">2.3 Dados Técnicos</h3>
                <p className="text-gray-7 mb-4">
                  Também podemos recolher dados técnicos necessários para o funcionamento, segurança e
                  melhoria da plataforma, incluindo:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-7">
                  <li>Endereço IP;</li>
                  <li>Tipo de dispositivo;</li>
                  <li>Navegador utilizado;</li>
                  <li>Sistema operativo;</li>
                  <li>Dados de localização, quando permitidos pelo utilizador;</li>
                  <li>Registos de acesso;</li>
                  <li>Erros técnicos;</li>
                  <li>Cookies e tecnologias semelhantes.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">3. Como Utilizamos os Seus Dados</h2>
                <p className="text-gray-7 mb-4">O Txova utiliza os dados recolhidos para:</p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-1 rounded-lg p-4">
                    <h4 className="font-medium text-gray-9 mb-2">Processamento de Pedidos</h4>
                    <p className="text-gray-7 text-sm">
                      Utilizamos os dados para registar pedidos, confirmar compras, facilitar pagamentos,
                      organizar entregas e permitir a comunicação entre compradores, vendedores e equipa
                      de apoio.
                    </p>
                  </div>

                  <div className="bg-gray-1 rounded-lg p-4">
                    <h4 className="font-medium text-gray-9 mb-2">Gestão da Conta</h4>
                    <p className="text-gray-7 text-sm">
                      Utilizamos os dados para criar, autenticar, actualizar e proteger a conta do
                      utilizador.
                    </p>
                  </div>

                  <div className="bg-gray-1 rounded-lg p-4">
                    <h4 className="font-medium text-gray-9 mb-2">Apoio ao Cliente</h4>
                    <p className="text-gray-7 text-sm">
                      Utilizamos os dados para responder a dúvidas, reclamações, pedidos de apoio,
                      reembolsos, problemas técnicos e outras solicitações.
                    </p>
                  </div>

                  <div className="bg-gray-1 rounded-lg p-4">
                    <h4 className="font-medium text-gray-9 mb-2">Melhoria da Plataforma</h4>
                    <p className="text-gray-7 text-sm">
                      Utilizamos informações de utilização para melhorar funcionalidades, corrigir
                      erros, optimizar a experiência do utilizador e desenvolver novos recursos.
                    </p>
                  </div>

                  <div className="bg-gray-1 rounded-lg p-4">
                    <h4 className="font-medium text-gray-9 mb-2">Comunicação</h4>
                    <p className="text-gray-7 text-sm">
                      Podemos utilizar os seus dados para enviar notificações sobre pedidos, pagamentos,
                      entregas, alterações na conta, novidades da plataforma, campanhas, promoções e
                      conteúdos úteis, sempre respeitando as opções de comunicação escolhidas pelo
                      utilizador.
                    </p>
                  </div>

                  <div className="bg-gray-1 rounded-lg p-4">
                    <h4 className="font-medium text-gray-9 mb-2">Segurança</h4>
                    <p className="text-gray-7 text-sm">
                      Utilizamos dados para prevenir fraudes, detectar acessos indevidos, proteger
                      contas, investigar actividades suspeitas e garantir a segurança da plataforma.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">4. Partilha de Dados</h2>
                <p className="text-gray-7 mb-4">
                  O Txova não vende os dados pessoais dos utilizadores.
                </p>
                <p className="text-gray-7 mb-4">
                  Os dados poderão ser partilhados apenas quando necessário para o funcionamento da
                  plataforma, nomeadamente com:
                </p>

                <h3 className="text-lg font-medium text-gray-9 mb-3">Vendedores</h3>
                <p className="text-gray-7 mb-4">
                  Podemos partilhar com vendedores os dados necessários para processar pedidos,
                  confirmar produtos, organizar entregas e prestar atendimento ao comprador.
                </p>

                <h3 className="text-lg font-medium text-gray-9 mb-3">Prestadores de Serviços</h3>
                <p className="text-gray-7 mb-4">
                  Podemos partilhar dados com parceiros que apoiam a operação da plataforma, incluindo
                  serviços de pagamento, entrega, alojamento, suporte técnico, comunicação, segurança e
                  análise.
                </p>

                <h3 className="text-lg font-medium text-gray-9 mb-3">Autoridades Competentes</h3>
                <p className="text-gray-7 mb-4">
                  Podemos divulgar dados quando tal seja exigido por lei, ordem judicial, autoridade
                  competente ou para defesa dos direitos e interesses legítimos do Txova.
                </p>

                <h3 className="text-lg font-medium text-gray-9 mb-3">Com Consentimento do Utilizador</h3>
                <p className="text-gray-7">
                  Podemos partilhar dados quando o utilizador autorizar expressamente essa partilha.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">5. Segurança dos Dados</h2>
                <p className="text-gray-7 mb-4">
                  O Txova adopta medidas técnicas e organizacionais para proteger os dados pessoais contra
                  acesso não autorizado, perda, alteração, divulgação indevida ou utilização abusiva.
                </p>

                <div className="bg-primary/5 rounded-lg p-6 mb-4">
                  <div className="flex items-start space-x-3">
                    <Lock size={20} className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-9 mb-2">Medidas de Segurança</h4>
                      <p className="text-gray-7 text-sm mb-2">
                        Entre as medidas de segurança poderão incluir-se:
                      </p>
                      <ul className="text-gray-7 text-sm space-y-1">
                        <li>• Protecção da transmissão de dados;</li>
                        <li>• Controlo de acesso às informações;</li>
                        <li>• Armazenamento seguro;</li>
                        <li>• Monitorização de segurança;</li>
                        <li>• Actualizações regulares da plataforma;</li>
                        <li>• Restrição de acesso apenas a pessoas autorizadas.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <p className="text-gray-7">
                  Apesar dos esforços de segurança, nenhum sistema digital é totalmente imune a riscos.
                  Por isso, o utilizador também deve proteger as suas credenciais de acesso e comunicar
                  qualquer suspeita de uso indevido da conta.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">6. Pagamentos e Dados Financeiros</h2>
                <p className="text-gray-7 mb-4">
                  Os dados relacionados com pagamentos poderão ser tratados por provedores de pagamento,
                  bancos, carteiras móveis ou outros serviços autorizados.
                </p>
                <p className="text-gray-7 mb-4">
                  O Txova poderá recolher ou processar informações necessárias para confirmar pagamentos,
                  validar transacções, emitir comprovativos, acompanhar reembolsos e prevenir fraudes.
                </p>
                <p className="text-gray-7">
                  Sempre que o pagamento for feito por M-Pesa, E-Mola, Imali, cartão, transferência
                  bancária ou pagamento no acto da entrega, poderão aplicar-se também as políticas e
                  condições dos respectivos provedores.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">7. Cookies e Tecnologias Semelhantes</h2>
                <p className="text-gray-7 mb-4">
                  O Txova poderá utilizar cookies e tecnologias semelhantes para:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-7 mb-4">
                  <li>Guardar preferências do utilizador;</li>
                  <li>Melhorar a navegação;</li>
                  <li>Manter sessões iniciadas;</li>
                  <li>Analisar a utilização da plataforma;</li>
                  <li>Melhorar conteúdos, funcionalidades e segurança;</li>
                  <li>Personalizar a experiência do utilizador.</li>
                </ul>
                <p className="text-gray-7">
                  O utilizador pode gerir ou bloquear cookies através das definições do navegador. No
                  entanto, algumas funcionalidades da plataforma poderão ficar limitadas.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">8. Direitos do Utilizador</h2>
                <p className="text-gray-7 mb-4">
                  O utilizador poderá, nos termos aplicáveis, solicitar:
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-1 rounded-lg p-4">
                    <h4 className="font-medium text-gray-9 mb-2">Acesso aos Dados</h4>
                    <p className="text-gray-7 text-sm">
                      Pode solicitar informação sobre os dados pessoais tratados pelo Txova.
                    </p>
                  </div>

                  <div className="bg-gray-1 rounded-lg p-4">
                    <h4 className="font-medium text-gray-9 mb-2">Correcção de Dados</h4>
                    <p className="text-gray-7 text-sm">
                      Pode actualizar, corrigir ou completar dados pessoais incorrectos ou
                      desactualizados.
                    </p>
                  </div>

                  <div className="bg-gray-1 rounded-lg p-4">
                    <h4 className="font-medium text-gray-9 mb-2">Eliminação de Dados</h4>
                    <p className="text-gray-7 text-sm">
                      Pode solicitar a eliminação dos seus dados pessoais, salvo quando a conservação
                      seja necessária por razões legais, contratuais, fiscais, de segurança ou
                      resolução de disputas.
                    </p>
                  </div>

                  <div className="bg-gray-1 rounded-lg p-4">
                    <h4 className="font-medium text-gray-9 mb-2">Oposição ao Tratamento</h4>
                    <p className="text-gray-7 text-sm">
                      Pode opor-se ao tratamento dos seus dados para determinadas finalidades,
                      nomeadamente comunicações promocionais.
                    </p>
                  </div>

                  <div className="bg-gray-1 rounded-lg p-4 md:col-span-2">
                    <h4 className="font-medium text-gray-9 mb-2">Cancelamento de Comunicações</h4>
                    <p className="text-gray-7 text-sm">
                      Pode cancelar a subscrição de newsletters, campanhas ou comunicações promocionais,
                      quando aplicável.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">9. Conservação dos Dados</h2>
                <p className="text-gray-7 mb-4">
                  O Txova conserva os dados pessoais apenas durante o período necessário para:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-7 mb-4">
                  <li>Prestar os serviços da plataforma;</li>
                  <li>Processar pedidos;</li>
                  <li>Cumprir obrigações legais;</li>
                  <li>Resolver reclamações ou disputas;</li>
                  <li>Prevenir fraudes;</li>
                  <li>Fazer cumprir os Termos de Utilização;</li>
                  <li>Melhorar a segurança e funcionamento da plataforma.</li>
                </ul>
                <p className="text-gray-7">
                  Quando os dados deixarem de ser necessários, poderão ser eliminados, anonimizados ou
                  arquivados de forma segura.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">10. Dados de Menores</h2>
                <p className="text-gray-7 mb-4">
                  A plataforma Txova destina-se a utilizadores com capacidade legal para realizar
                  compras, vender produtos ou celebrar acordos comerciais.
                </p>
                <p className="text-gray-7">
                  Caso sejam identificados dados pessoais de menores recolhidos sem autorização
                  adequada, o Txova poderá proceder à sua eliminação ou solicitar confirmação do
                  representante legal.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">11. Transferência e Armazenamento de Dados</h2>
                <p className="text-gray-7 mb-4">
                  Os dados poderão ser armazenados em servidores próprios ou de terceiros contratados
                  para apoiar o funcionamento da plataforma.
                </p>
                <p className="text-gray-7">
                  Quando houver transferência ou armazenamento fora de Moçambique, o Txova procurará
                  assegurar medidas adequadas de protecção, de acordo com as normas aplicáveis e boas
                  práticas de segurança digital.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">12. Alterações a Esta Política</h2>
                <p className="text-gray-7 mb-4">
                  O Txova poderá actualizar esta Política de Privacidade sempre que necessário, por
                  motivos legais, técnicos, operacionais ou comerciais.
                </p>
                <p className="text-gray-7 mb-4">As alterações relevantes poderão ser comunicadas através de:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-7 mb-4">
                  <li>Notificação na plataforma;</li>
                  <li>E-mail enviado ao utilizador;</li>
                  <li>Actualização da data de revisão desta política.</li>
                </ul>
                <p className="text-gray-7">
                  A continuação da utilização da plataforma após a publicação das alterações constitui
                  aceitação da versão actualizada.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">13. Contactos</h2>
                <div className="bg-gray-1 rounded-lg p-6">
                  <p className="text-gray-7 mb-4">
                    Para dúvidas, pedidos de esclarecimento ou solicitações relacionadas com privacidade
                    e protecção de dados, contacte-nos através de:
                  </p>
                  <div className="space-y-2 text-gray-7">
                    <p><strong>E-mail:</strong> {siteConfig.privacyEmail}</p>
                    <p><strong>Telefone:</strong> +258 84 999 9999</p>
                    <p><strong>Endereço:</strong> Beira, Sofala – Moçambique</p>
                  </div>
                </div>
              </section>

            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="bg-primary/5 rounded-lg p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-9 mb-4">
              Ainda Tem Dúvidas?
            </h2>
            <p className="text-gray-7 mb-6 max-w-2xl mx-auto">
              A equipa do Txova está disponível para esclarecer questões relacionadas com privacidade,
              dados pessoais, segurança da conta e utilização da plataforma.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contato">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Fale Connosco
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
