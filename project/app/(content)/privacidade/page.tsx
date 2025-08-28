'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Eye, Lock, Users, FileText, Calendar } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';

export default function PrivacidadePage() {
  const lastUpdated = '15 de Janeiro de 2024';

  return (
    <div className="min-h-screen bg-gray-1 overflow-x-hidden">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> / 
          <span className="text-primary"> Política de Privacidade</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-9 mb-4">
            Política de Privacidade
          </h1>
          <p className="text-base sm:text-lg text-gray-7 max-w-3xl mx-auto px-4">
            Sua privacidade é importante para nós. Esta política descreve como coletamos, 
            usamos e protegemos suas informações pessoais.
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
                <h2 className="text-xl font-semibold text-gray-9 mb-4">1. Introdução</h2>
                <p className="text-gray-7 mb-4">
                  O Txova ("nós", "nosso", "a empresa") está comprometido em proteger sua privacidade. 
                  Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos 
                  suas informações pessoais quando você usa nossa plataforma.
                </p>
                <p className="text-gray-7">
                  Ao usar nossos serviços, você concorda com a coleta e uso de informações de acordo 
                  com esta política.
                </p>
              </section>

              {/* Information We Collect */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">2. Informações que Coletamos</h2>
                
                <h3 className="text-lg font-medium text-gray-9 mb-3">2.1 Informações Pessoais</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-7 mb-4">
                  <li>Nome completo e informações de contato</li>
                  <li>Endereço de e-mail e número de telefone</li>
                  <li>Endereço de entrega e faturamento</li>
                  <li>Informações de pagamento (processadas de forma segura)</li>
                  <li>Data de nascimento (quando necessário)</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-9 mb-3">2.2 Informações de Uso</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-7 mb-4">
                  <li>Histórico de pedidos e preferências</li>
                  <li>Produtos visualizados e favoritos</li>
                  <li>Interações com a plataforma</li>
                  <li>Dados de navegação e cookies</li>
                </ul>

                <h3 className="text-lg font-medium text-gray-9 mb-3">2.3 Informações Técnicas</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-7">
                  <li>Endereço IP e informações do dispositivo</li>
                  <li>Tipo de navegador e sistema operacional</li>
                  <li>Dados de localização (quando permitido)</li>
                  <li>Logs de acesso e erros</li>
                </ul>
              </section>

              {/* How We Use Information */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">3. Como Usamos Suas Informações</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-1 rounded-lg p-4">
                    <h4 className="font-medium text-gray-9 mb-2">Processamento de Pedidos</h4>
                    <p className="text-gray-7 text-sm">
                      Para processar e entregar seus pedidos, processar pagamentos e fornecer 
                      suporte ao cliente.
                    </p>
                  </div>
                  
                  <div className="bg-gray-1 rounded-lg p-4">
                    <h4 className="font-medium text-gray-9 mb-2">Melhorias do Serviço</h4>
                    <p className="text-gray-7 text-sm">
                      Para melhorar nossa plataforma, personalizar experiências e desenvolver 
                      novos recursos.
                    </p>
                  </div>
                  
                  <div className="bg-gray-1 rounded-lg p-4">
                    <h4 className="font-medium text-gray-9 mb-2">Comunicação</h4>
                    <p className="text-gray-7 text-sm">
                      Para enviar atualizações de pedidos, newsletters e informações importantes 
                      sobre nossos serviços.
                    </p>
                  </div>
                  
                  <div className="bg-gray-1 rounded-lg p-4">
                    <h4 className="font-medium text-gray-9 mb-2">Segurança</h4>
                    <p className="text-gray-7 text-sm">
                      Para detectar e prevenir fraudes, proteger contra atividades maliciosas 
                      e garantir a segurança da plataforma.
                    </p>
                  </div>
                </div>
              </section>

              {/* Information Sharing */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">4. Compartilhamento de Informações</h2>
                
                <p className="text-gray-7 mb-4">
                  Não vendemos, alugamos ou compartilhamos suas informações pessoais com terceiros, 
                  exceto nas seguintes situações:
                </p>
                
                <ul className="list-disc list-inside space-y-2 text-gray-7 mb-4">
                  <li><strong>Prestadores de serviços:</strong> Parceiros que nos ajudam a operar a plataforma (pagamentos, entregas, etc.)</li>
                  <li><strong>Vendedores:</strong> Informações necessárias para processar seus pedidos</li>
                  <li><strong>Obrigação legal:</strong> Quando exigido por lei ou para proteger nossos direitos</li>
                  <li><strong>Consentimento:</strong> Quando você autoriza explicitamente o compartilhamento</li>
                </ul>
              </section>

              {/* Data Security */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">5. Segurança dos Dados</h2>
                
                <div className="bg-primary/5 rounded-lg p-6 mb-4">
                  <div className="flex items-start space-x-3">
                    <Lock size={20} className="text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-gray-9 mb-2">Medidas de Segurança</h4>
                      <ul className="text-gray-7 text-sm space-y-1">
                        <li>• Criptografia SSL/TLS para transmissão de dados</li>
                        <li>• Armazenamento seguro em servidores protegidos</li>
                        <li>• Acesso restrito às informações pessoais</li>
                        <li>• Monitoramento contínuo de segurança</li>
                        <li>• Atualizações regulares de segurança</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-7">
                  Implementamos medidas técnicas e organizacionais apropriadas para proteger 
                  suas informações pessoais contra acesso não autorizado, alteração, divulgação 
                  ou destruição.
                </p>
              </section>

              {/* Cookies */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">6. Cookies e Tecnologias Similares</h2>
                
                <p className="text-gray-7 mb-4">
                  Utilizamos cookies e tecnologias similares para:
                </p>
                
                <ul className="list-disc list-inside space-y-2 text-gray-7 mb-4">
                  <li>Lembrar suas preferências e configurações</li>
                  <li>Analisar o uso da plataforma e melhorar nossos serviços</li>
                  <li>Personalizar conteúdo e anúncios</li>
                  <li>Garantir a segurança da plataforma</li>
                </ul>
                
                <p className="text-gray-7">
                  Você pode controlar o uso de cookies através das configurações do seu navegador, 
                  mas isso pode afetar a funcionalidade da plataforma.
                </p>
              </section>

              {/* Your Rights */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">7. Seus Direitos</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-1 rounded-lg p-4">
                    <h4 className="font-medium text-gray-9 mb-2">Acesso e Correção</h4>
                    <p className="text-gray-7 text-sm">
                      Você pode acessar, corrigir ou atualizar suas informações pessoais 
                      através do seu painel de usuário.
                    </p>
                  </div>
                  
                  <div className="bg-gray-1 rounded-lg p-4">
                    <h4 className="font-medium text-gray-9 mb-2">Exclusão</h4>
                    <p className="text-gray-7 text-sm">
                      Você pode solicitar a exclusão de suas informações pessoais, 
                      sujeito a certas exceções legais.
                    </p>
                  </div>
                  
                  <div className="bg-gray-1 rounded-lg p-4">
                    <h4 className="font-medium text-gray-9 mb-2">Portabilidade</h4>
                    <p className="text-gray-7 text-sm">
                      Você pode solicitar uma cópia de seus dados pessoais em formato 
                      estruturado e legível por máquina.
                    </p>
                  </div>
                  
                  <div className="bg-gray-1 rounded-lg p-4">
                    <h4 className="font-medium text-gray-9 mb-2">Oposição</h4>
                    <p className="text-gray-7 text-sm">
                      Você pode se opor ao processamento de seus dados pessoais 
                      para certas finalidades.
                    </p>
                  </div>
                </div>
              </section>

              {/* Data Retention */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">8. Retenção de Dados</h2>
                
                <p className="text-gray-7 mb-4">
                  Mantemos suas informações pessoais apenas pelo tempo necessário para:
                </p>
                
                <ul className="list-disc list-inside space-y-2 text-gray-7 mb-4">
                  <li>Fornecer nossos serviços</li>
                  <li>Cumprir obrigações legais</li>
                  <li>Resolver disputas</li>
                  <li>Fazer cumprir nossos acordos</li>
                </ul>
                
                <p className="text-gray-7">
                  Quando não precisarmos mais de suas informações, elas serão excluídas 
                  ou anonimizadas de forma segura.
                </p>
              </section>

              {/* Children's Privacy */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">9. Privacidade de Crianças</h2>
                
                <p className="text-gray-7">
                  Nossos serviços não são destinados a crianças menores de 13 anos. 
                  Não coletamos intencionalmente informações pessoais de crianças menores de 13 anos. 
                  Se você é pai ou responsável e acredita que seu filho nos forneceu informações 
                  pessoais, entre em contato conosco.
                </p>
              </section>

              {/* International Transfers */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">10. Transferências Internacionais</h2>
                
                <p className="text-gray-7">
                  Suas informações podem ser transferidas e processadas em países diferentes 
                  do seu país de residência. Garantimos que essas transferências são feitas 
                  de acordo com as leis de proteção de dados aplicáveis.
                </p>
              </section>

              {/* Changes to Policy */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">11. Alterações nesta Política</h2>
                
                <p className="text-gray-7 mb-4">
                  Podemos atualizar esta Política de Privacidade periodicamente. 
                  Notificaremos você sobre mudanças significativas através de:
                </p>
                
                <ul className="list-disc list-inside space-y-2 text-gray-7 mb-4">
                  <li>E-mail para o endereço registrado</li>
                  <li>Notificação na plataforma</li>
                  <li>Atualização da data de "Última atualização"</li>
                </ul>
                
                <p className="text-gray-7">
                  Recomendamos que você revise esta política regularmente para se manter 
                  informado sobre como protegemos suas informações.
                </p>
              </section>

              {/* Contact Information */}
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-9 mb-4">12. Entre em Contato</h2>
                
                <div className="bg-gray-1 rounded-lg p-6">
                  <p className="text-gray-7 mb-4">
                    Se você tiver dúvidas sobre esta Política de Privacidade ou sobre 
                    como tratamos suas informações pessoais, entre em contato conosco:
                  </p>
                  
                  <div className="space-y-2 text-gray-7">
                    <p><strong>E-mail:</strong> privacidade@ecobazar.com</p>
                    <p><strong>Telefone:</strong> (84) 99999-9999</p>
                    <p><strong>Endereço:</strong> Rua das Flores, 123 - Baixa, Beira - 2100</p>
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
              Ainda tem dúvidas?
            </h2>
            <p className="text-gray-7 mb-6 max-w-2xl mx-auto">
              Nossa equipe está pronta para esclarecer qualquer dúvida sobre privacidade 
              e proteção de dados.
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