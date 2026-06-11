'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Calendar, ShoppingBag, Users } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/site-config';

export default function TermosPage() {
  const lastUpdated = '06 de Junho de 2026';

  return (
    <div className="min-h-screen bg-gray-1 overflow-x-hidden">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> /
          <span className="text-primary"> Termos de Utilização</span>
        </nav>

        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-9 mb-4">
            Termos de Utilização
          </h1>
          <p className="text-base sm:text-lg text-gray-7 max-w-3xl mx-auto px-4">
            Estes Termos de Utilização regulam o acesso e uso da plataforma Txova, incluindo o
            website, aplicações, serviços digitais e demais funcionalidades disponibilizadas aos
            utilizadores.
          </p>
          <p className="text-base sm:text-lg text-gray-7 max-w-3xl mx-auto px-4 mt-4">
            Ao aceder, navegar, registar-se ou utilizar a plataforma Txova, o utilizador declara que
            leu, compreendeu e aceita cumprir os presentes Termos de Utilização.
          </p>
          <div className="flex items-center justify-center space-x-2 mt-4 text-sm text-gray-6">
            <Calendar size={16} />
            <span>Última actualização: {lastUpdated}</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
            <div className="prose prose-lg max-w-none">

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">1. Aceitação dos Termos</h2>
                <p className="text-gray-7 mb-4">
                  Ao aceder e utilizar a plataforma Txova, o utilizador aceita cumprir os presentes
                  Termos de Utilização, bem como outras políticas aplicáveis, incluindo a Política de
                  Privacidade, Política de Trocas e Devoluções, regras de vendedores e demais
                  orientações publicadas na plataforma.
                </p>
                <p className="text-gray-7 mb-4">
                  Caso não concorde com qualquer disposição destes termos, o utilizador deverá
                  abster-se de utilizar a plataforma.
                </p>
                <p className="text-gray-7">
                  Estes termos aplicam-se a todos os utilizadores, incluindo compradores, vendedores,
                  visitantes, parceiros e demais entidades que interajam com o Txova.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">2. Definições</h2>
                <p className="text-gray-7 mb-4">
                  Para efeitos dos presentes Termos de Utilização, considera-se:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-7">
                  <li><strong>Plataforma:</strong> o website, aplicação, sistema ou serviço digital disponibilizado pelo Txova.</li>
                  <li><strong>Utilizador:</strong> qualquer pessoa singular ou colectiva que aceda ou utilize a plataforma.</li>
                  <li><strong>Comprador:</strong> utilizador que pesquisa, solicita, reserva ou adquire produtos e/ou serviços através da plataforma.</li>
                  <li><strong>Vendedor:</strong> utilizador, negócio local, empreendedor informal, produtor, prestador de serviços ou empresa que divulga produtos e/ou serviços na plataforma.</li>
                  <li><strong>Produto:</strong> qualquer bem disponibilizado por vendedores na plataforma.</li>
                  <li><strong>Serviço:</strong> qualquer actividade, prestação ou solução divulgada por prestadores de serviços na plataforma.</li>
                  <li><strong>Pedido:</strong> solicitação feita pelo comprador para aquisição de produtos ou serviços.</li>
                  <li><strong>Conta:</strong> área pessoal do utilizador na plataforma Txova.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">3. Registo de Conta</h2>

                <h3 className="text-lg font-medium text-gray-9 mb-3">3.1 Elegibilidade</h3>
                <p className="text-gray-7 mb-4">
                  Para criar uma conta e utilizar determinados serviços da plataforma, o utilizador
                  deve ter idade legal para celebrar contratos ou estar devidamente autorizado por um
                  representante legal.
                </p>

                <h3 className="text-lg font-medium text-gray-9 mb-3">3.2 Informações da Conta</h3>
                <p className="text-gray-7 mb-4">
                  O utilizador compromete-se a fornecer informações verdadeiras, completas e
                  actualizadas durante o processo de registo, incluindo nome, contacto, endereço,
                  e-mail e demais dados necessários.
                </p>

                <h3 className="text-lg font-medium text-gray-9 mb-3">3.3 Segurança da Conta</h3>
                <p className="text-gray-7 mb-4">
                  O utilizador é responsável por manter a confidencialidade dos seus dados de acesso,
                  incluindo palavra-passe e demais credenciais.
                </p>
                <p className="text-gray-7">
                  Qualquer actividade realizada através da conta será considerada da responsabilidade
                  do respectivo titular, salvo prova de uso indevido comunicado atempadamente ao Txova.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">4. Uso da Plataforma</h2>

                <h3 className="text-lg font-medium text-gray-9 mb-3">4.1 Uso Permitido</h3>
                <p className="text-gray-7 mb-4">
                  A plataforma Txova deve ser utilizada para fins lícitos, nomeadamente para:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-7 mb-4">
                  <li>Pesquisar produtos, serviços e vendedores locais;</li>
                  <li>Comprar ou solicitar produtos e serviços;</li>
                  <li>Divulgar produtos e serviços, no caso dos vendedores;</li>
                  <li>Interagir com vendedores, compradores e equipa de apoio;</li>
                  <li>Acompanhar pedidos, pagamentos, entregas e comunicações;</li>
                  <li>Criar pedidos de apoio quando necessário.</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-9 mb-3">4.2 Uso Proibido</h3>
                <p className="text-gray-7 mb-4">É proibido utilizar a plataforma para:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-7 mb-4">
                  <li>Actividades ilegais, abusivas, fraudulentas ou enganosas;</li>
                  <li>Publicar produtos ou serviços proibidos por lei;</li>
                  <li>Divulgar informações falsas, ofensivas ou discriminatórias;</li>
                  <li>Violar direitos de propriedade intelectual de terceiros;</li>
                  <li>Transmitir vírus, códigos maliciosos ou conteúdos prejudiciais;</li>
                  <li>Interferir no funcionamento da plataforma;</li>
                  <li>Recolher dados de outros utilizadores sem autorização;</li>
                  <li>Utilizar bots, scripts automatizados ou mecanismos que prejudiquem a segurança da plataforma;</li>
                  <li>Criar contas falsas ou utilizar identidade de terceiros.</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-9 mb-3">4.3 Conteúdo do Utilizador</h3>
                <p className="text-gray-7 mb-4">
                  O utilizador mantém a titularidade dos conteúdos que submeter à plataforma,
                  incluindo fotografias, descrições, preços, informações comerciais, avaliações,
                  mensagens e outros materiais.
                </p>
                <p className="text-gray-7">
                  Ao publicar conteúdos no Txova, o utilizador concede à plataforma autorização para
                  exibir, organizar, promover, adaptar e divulgar esses conteúdos no âmbito do
                  funcionamento do marketplace.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">5. Compra e Venda</h2>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-1 rounded-lg p-4">
                    <h4 className="font-medium text-gray-9 mb-2 flex items-center">
                      <ShoppingBag size={16} className="mr-2" />
                      5.1 Para Compradores
                    </h4>
                    <p className="text-gray-7 text-sm mb-2">O comprador compromete-se a:</p>
                    <ul className="text-gray-7 text-sm space-y-1">
                      <li>• Verificar a descrição, preço, imagens e condições do produto ou serviço;</li>
                      <li>• Confirmar os dados do pedido antes de finalizar;</li>
                      <li>• Fornecer informações correctas de contacto e entrega;</li>
                      <li>• Estar disponível para receber o pedido ou responder ao vendedor/equipa de entrega;</li>
                      <li>• Efectuar o pagamento conforme o método seleccionado;</li>
                      <li>• Utilizar a plataforma de forma responsável e respeitosa.</li>
                    </ul>
                  </div>

                  <div className="bg-gray-1 rounded-lg p-4">
                    <h4 className="font-medium text-gray-9 mb-2 flex items-center">
                      <Users size={16} className="mr-2" />
                      5.2 Para Vendedores
                    </h4>
                    <p className="text-gray-7 text-sm mb-2">O vendedor compromete-se a:</p>
                    <ul className="text-gray-7 text-sm space-y-1">
                      <li>• Publicar informações verdadeiras e actualizadas;</li>
                      <li>• Utilizar fotografias reais ou representativas dos produtos e serviços;</li>
                      <li>• Manter preços, disponibilidade e condições de entrega actualizados;</li>
                      <li>• Cumprir os prazos combinados com o comprador;</li>
                      <li>• Garantir atendimento respeitoso e profissional;</li>
                      <li>• Assumir responsabilidade pela qualidade, legalidade e entrega dos produtos ou serviços divulgados;</li>
                      <li>• Respeitar as regras da plataforma e a legislação aplicável.</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-lg font-medium text-gray-9 mb-3">5.3 Papel do Txova</h3>
                <p className="text-gray-7 mb-4">
                  O Txova actua como uma plataforma de divulgação, intermediação digital e aproximação
                  entre compradores e vendedores.
                </p>
                <p className="text-gray-7 mb-4">
                  Salvo quando expressamente indicado, o Txova não é o proprietário dos produtos ou
                  serviços anunciados, nem assume responsabilidade directa pela produção, fornecimento,
                  qualidade, garantia ou execução dos mesmos, sendo estes da responsabilidade dos
                  respectivos vendedores.
                </p>
                <p className="text-gray-7">
                  Sempre que possível, o Txova poderá apoiar na mediação de situações reportadas por
                  compradores ou vendedores.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">6. Preços e Pagamentos</h2>
                <p className="text-gray-7 mb-4">
                  Todos os preços apresentados na plataforma devem ser indicados em Meticais (MZN/MT).
                </p>
                <p className="text-gray-7 mb-4">Os métodos de pagamento disponíveis poderão incluir:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-7 mb-4">
                  <li>M-Pesa;</li>
                  <li>E-Mola;</li>
                  <li>Imali;</li>
                  <li>Cartão de débito;</li>
                  <li>Cartão de crédito;</li>
                  <li>Transferência bancária;</li>
                  <li>Numerário;</li>
                  <li>Pagamento no acto da entrega;</li>
                  <li>Outros métodos autorizados pela plataforma.</li>
                </ul>
                <p className="text-gray-7 mb-4">
                  Quando aplicável, o pagamento poderá ser realizado no acto da entrega, conforme as
                  condições definidas pelo vendedor, pelo serviço de entrega ou pela própria plataforma.
                </p>
                <p className="text-gray-7">
                  O Txova poderá, futuramente, introduzir sistemas de pagamento online, carteira digital,
                  comissões, taxas de serviço ou outros mecanismos financeiros, mediante comunicação
                  prévia aos utilizadores.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">7. Entrega</h2>
                <p className="text-gray-7 mb-4">
                  A entrega dos produtos poderá ser realizada pelo vendedor, por parceiros de entrega,
                  por equipa associada à plataforma ou por outros meios acordados entre as partes.
                </p>
                <p className="text-gray-7 mb-4">Os prazos, custos e áreas de cobertura podem variar conforme:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-7 mb-4">
                  <li>Localização do vendedor;</li>
                  <li>Localização do comprador;</li>
                  <li>Tipo de produto ou serviço;</li>
                  <li>Disponibilidade do serviço de entrega;</li>
                  <li>Condições logísticas no momento do pedido.</li>
                </ul>
                <p className="text-gray-7">
                  O comprador deve fornecer endereço correcto, ponto de referência e contacto activo
                  para facilitar a entrega.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">8. Cancelamentos, Trocas e Devoluções</h2>

                <h3 className="text-lg font-medium text-gray-9 mb-3">8.1 Cancelamento de Pedidos</h3>
                <p className="text-gray-7 mb-4">
                  O comprador poderá solicitar o cancelamento do pedido antes da sua confirmação final,
                  preparação ou envio para entrega.
                </p>
                <p className="text-gray-7 mb-4">
                  Após o envio ou preparação do pedido, o cancelamento poderá depender das condições do
                  vendedor ou da natureza do produto/serviço.
                </p>

                <h3 className="text-lg font-medium text-gray-9 mb-3">8.2 Trocas e Devoluções</h3>
                <p className="text-gray-7 mb-4">As trocas e devoluções serão analisadas conforme:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-7 mb-4">
                  <li>Tipo de produto ou serviço;</li>
                  <li>Estado do produto no momento da entrega;</li>
                  <li>Erro na descrição ou no envio;</li>
                  <li>Defeito ou inconformidade comprovada;</li>
                  <li>Política específica do vendedor;</li>
                  <li>Regras gerais da plataforma.</li>
                </ul>
                <p className="text-gray-7 mb-4">
                  Produtos perecíveis, personalizados, usados, digitais ou de natureza sensível poderão
                  estar sujeitos a regras específicas de devolução.
                </p>

                <h3 className="text-lg font-medium text-gray-9 mb-3">8.3 Reembolsos</h3>
                <p className="text-gray-7 mb-4">
                  Quando aplicável, o reembolso poderá ser efectuado pelo mesmo método de pagamento
                  utilizado ou por outro meio acordado entre as partes.
                </p>
                <p className="text-gray-7">
                  O prazo e a aprovação do reembolso dependerão da análise do caso, da confirmação do
                  vendedor, das condições da transacção e das regras aplicáveis.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">9. Qualidade dos Produtos e Serviços</h2>
                <p className="text-gray-7 mb-4">
                  O Txova incentiva os vendedores a apresentarem informações claras, imagens adequadas,
                  preços correctos e condições transparentes de venda.
                </p>
                <p className="text-gray-7 mb-4">
                  A responsabilidade pela qualidade, autenticidade, segurança e legalidade dos produtos
                  e serviços anunciados é do vendedor.
                </p>
                <p className="text-gray-7">
                  A plataforma poderá remover produtos, serviços ou contas que violem estes termos,
                  prejudiquem os utilizadores ou comprometam a confiança do marketplace.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">10. Vendedores e Negócios Informais</h2>
                <p className="text-gray-7 mb-4">
                  O Txova poderá aceitar vendedores formais e informais, desde que respeitem as regras
                  da plataforma, a legislação aplicável e os princípios de transparência, boa-fé,
                  qualidade de atendimento e responsabilidade perante os compradores.
                </p>
                <p className="text-gray-7 mb-4">
                  A plataforma poderá solicitar informações adicionais para validação, verificação ou
                  melhoria da confiança dos vendedores.
                </p>
                <p className="text-gray-7">
                  O Txova reserva-se o direito de aprovar, rejeitar, suspender ou remover vendedores que
                  não cumpram as regras da plataforma.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">11. Avaliações, Comentários e Comunicação</h2>
                <p className="text-gray-7 mb-4">
                  Os utilizadores poderão avaliar produtos, serviços ou vendedores, sempre que esta
                  funcionalidade esteja disponível.
                </p>
                <p className="text-gray-7 mb-4">
                  As avaliações devem ser verdadeiras, respeitosas e baseadas em experiências reais. O
                  Txova poderá moderar, ocultar ou remover avaliações ofensivas, falsas, abusivas,
                  discriminatórias ou que violem estes Termos de Utilização.
                </p>
                <p className="text-gray-7">
                  A comunicação entre compradores, vendedores e equipa de apoio deve respeitar os
                  princípios de cordialidade, boa-fé e transparência.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">12. Privacidade e Protecção de Dados</h2>
                <p className="text-gray-7 mb-4">
                  A utilização de dados pessoais dos utilizadores é regulada pela Política de Privacidade
                  do Txova.
                </p>
                <p className="text-gray-7 mb-4">
                  Ao utilizar a plataforma, o utilizador autoriza a recolha, tratamento e utilização
                  dos seus dados para fins relacionados com:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-7">
                  <li>Criação e gestão de conta;</li>
                  <li>Processamento de pedidos;</li>
                  <li>Comunicação entre compradores, vendedores e suporte;</li>
                  <li>Pagamentos;</li>
                  <li>Entregas;</li>
                  <li>Melhoria da plataforma;</li>
                  <li>Segurança;</li>
                  <li>Cumprimento de obrigações legais.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">13. Propriedade Intelectual</h2>
                <p className="text-gray-7 mb-4">
                  A marca Txova, logótipos, design, textos, estrutura, funcionalidades, software,
                  conteúdos institucionais e demais elementos da plataforma pertencem ao Txova ou aos
                  seus licenciadores.
                </p>
                <p className="text-gray-7 mb-4">
                  É proibida a cópia, reprodução, modificação, distribuição ou utilização não
                  autorizada de qualquer elemento da plataforma.
                </p>
                <p className="text-gray-7">
                  Os vendedores são responsáveis por garantir que os conteúdos que publicam, incluindo
                  imagens, marcas e descrições, não violam direitos de terceiros.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">14. Suspensão ou Encerramento de Conta</h2>
                <p className="text-gray-7 mb-4">
                  O Txova reserva-se o direito de suspender, limitar ou encerrar contas de utilizadores que:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-7 mb-4">
                  <li>Violem estes Termos de Utilização;</li>
                  <li>Publiquem conteúdos falsos, ilegais ou abusivos;</li>
                  <li>Pratiquem actos fraudulentos;</li>
                  <li>Prejudiquem outros utilizadores;</li>
                  <li>Comprometam a segurança ou reputação da plataforma;</li>
                  <li>Usem a plataforma de forma contrária à sua finalidade.</li>
                </ul>
                <p className="text-gray-7">
                  O utilizador poderá solicitar o encerramento da sua conta através das configurações da
                  plataforma ou mediante contacto com a equipa de apoio.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">15. Limitação de Responsabilidade</h2>
                <p className="text-gray-7 mb-4">
                  O Txova procura garantir o bom funcionamento da plataforma, mas não assegura que o
                  serviço estará sempre disponível, livre de falhas técnicas, interrupções ou erros.
                </p>
                <p className="text-gray-7 mb-4">O Txova não será responsável por:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-7 mb-4">
                  <li>Informações falsas ou incompletas publicadas por vendedores;</li>
                  <li>Incumprimento de prazos por parte dos vendedores;</li>
                  <li>Qualidade ou defeito de produtos ou serviços fornecidos por terceiros;</li>
                  <li>Perdas indirectas, lucros cessantes ou danos resultantes de uso indevido da plataforma;</li>
                  <li>Problemas decorrentes de falhas de internet, sistemas de pagamento, serviços de entrega ou terceiros.</li>
                </ul>
                <p className="text-gray-7">
                  Sempre que possível, o Txova poderá apoiar na mediação de conflitos entre compradores
                  e vendedores.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">16. Alterações aos Termos</h2>
                <p className="text-gray-7 mb-4">
                  O Txova poderá actualizar estes Termos de Utilização sempre que necessário,
                  nomeadamente por razões legais, técnicas, operacionais ou comerciais.
                </p>
                <p className="text-gray-7 mb-4">As alterações relevantes poderão ser comunicadas através de:</p>
                <ul className="list-disc list-inside space-y-2 text-gray-7 mb-4">
                  <li>Notificação na plataforma;</li>
                  <li>Envio de e-mail;</li>
                  <li>Actualização da data de revisão dos termos.</li>
                </ul>
                <p className="text-gray-7">
                  A continuação do uso da plataforma após a publicação das alterações constitui
                  aceitação dos novos termos.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">17. Lei Aplicável e Resolução de Conflitos</h2>
                <p className="text-gray-7 mb-4">
                  Os presentes Termos de Utilização são regidos pela legislação da República de
                  Moçambique.
                </p>
                <p className="text-gray-7 mb-4">
                  Em caso de litígio, as partes procurarão, sempre que possível, resolver a situação de
                  forma amigável.
                </p>
                <p className="text-gray-7">
                  Na impossibilidade de resolução consensual, qualquer disputa será submetida aos
                  tribunais competentes da cidade da Beira, salvo disposição legal em contrário.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">18. Contactos</h2>
                <div className="bg-gray-1 rounded-lg p-6">
                  <p className="text-gray-7 mb-4">
                    Para dúvidas, reclamações, pedidos de esclarecimento ou questões relacionadas com
                    estes Termos de Utilização, contacte-nos através de:
                  </p>
                  <div className="space-y-2 text-gray-7">
                    <p><strong>E-mail:</strong> {siteConfig.legalEmail}</p>
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
              Precisa de Esclarecimentos?
            </h2>
            <p className="text-gray-7 mb-6 max-w-2xl mx-auto">
              A equipa do Txova está disponível para esclarecer dúvidas sobre estes Termos de
              Utilização, funcionamento da plataforma, regras de vendedores, compras, pagamentos e
              entregas.
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
