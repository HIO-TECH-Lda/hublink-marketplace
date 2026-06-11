'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, Loader2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useSubmitContactForm } from '@/hooks/useContact';
import { siteConfig } from '@/lib/site-config';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const submitContact = useSubmitContactForm();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitContact.mutateAsync(formData);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Endereço',
      content: 'Rua Companhia de Moçambique\nCidade da Beira, Sofala – Moçambique',
      color: 'text-primary'
    },
    {
      icon: Phone,
      title: 'Telefones',
      content: '+258 84 999 9999\n+258 84 888 8888',
      color: 'text-primary'
    },
    {
      icon: Mail,
      title: 'E-mail',
      content: `${siteConfig.contactEmail}\n${siteConfig.supportEmail}`,
      color: 'text-primary'
    },
    {
      icon: Clock,
      title: 'Horário de Atendimento',
      content: 'Segunda a Sexta-feira: 08h00 às 18h00\nSábado: 08h00 às 12h00',
      color: 'text-primary'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-1 overflow-x-hidden">
      <Header />

      <div className="container py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-6 mb-6">
          <a href="/" className="hover:text-primary">Início</a> / 
          <span className="text-primary"> Contacto</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-9 mb-4">Entre em Contacto</h1>
          <p className="text-base sm:text-lg text-gray-7 max-w-2xl mx-auto px-4">
            Tem alguma dúvida, sugestão ou pretende saber mais sobre o Txova? Estamos disponíveis
            para apoiar compradores, vendedores, parceiros e todos os que desejam fazer parte desta
            montra digital de negócios locais.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Information */}
          <div className="space-y-6 lg:space-y-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-9 mb-4 sm:mb-6">Informações de Contacto</h2>
              <div className="space-y-4 sm:space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-3 sm:space-x-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <info.icon size={20} className={`sm:w-6 sm:h-6 ${info.color}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-9 mb-1 sm:mb-2 text-sm sm:text-base">{info.title}</h3>
                      <p className="text-gray-7 whitespace-pre-line text-sm sm:text-base">{info.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Map */}
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-9 mb-3 sm:mb-4">A Nossa Localização</h3>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-video bg-gray-2 flex items-center justify-center">
                  <div className="text-center p-4">
                    <MapPin size={32} className="sm:w-12 sm:h-12 text-gray-4 mx-auto mb-3 sm:mb-4" />
                    <p className="text-gray-6 text-sm sm:text-base">Mapa interativo será carregado aqui</p>
                    <p className="text-xs sm:text-sm text-gray-5 mt-2">
                      Beira, Sofala – Moçambique
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-9 mb-3 sm:mb-4">Redes Sociais</h3>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <a
                  href="#"
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                >
                  <span className="text-primary hover:text-white font-semibold text-sm sm:text-base">f</span>
                </a>
                <a href="#" className="px-3 py-2 bg-primary/10 rounded-lg text-sm font-medium text-primary hover:bg-primary hover:text-white transition-colors">Instagram</a>
                <a href="#" className="px-3 py-2 bg-primary/10 rounded-lg text-sm font-medium text-primary hover:bg-primary hover:text-white transition-colors">TikTok</a>
                <a href="#" className="px-3 py-2 bg-primary/10 rounded-lg text-sm font-medium text-primary hover:bg-primary hover:text-white transition-colors">WhatsApp Channel</a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-9 mb-4 sm:mb-6">Apenas Diga Olá!</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-9 mb-2">
                    Nome *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="O seu nome completo"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-9 mb-2">
                    E-mail *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="seu@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-9 mb-2">
                  Assunto *
                </label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  placeholder="Qual é o assunto da mensagem?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-9 mb-2">
                  Mensagem *
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  placeholder="Escreva a sua mensagem aqui..."
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hard text-white py-3"
                disabled={submitContact.isPending}
              >
                {submitContact.isPending ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send size={16} className="mr-2" />
                    Enviar Mensagem
                  </>
                )}
              </Button>
            </form>

            {/* Additional Info */}
            <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gray-1 rounded-lg">
              <h4 className="font-semibold text-gray-9 mb-2 text-sm sm:text-base">Informações Importantes</h4>
              <ul className="text-xs sm:text-sm text-gray-7 space-y-1">
                <li>• Respondemos às mensagens no prazo máximo de 24 horas.</li>
                <li>• Para assuntos urgentes, contacte-nos directamente por telefone.</li>
                <li>• O atendimento decorre de Segunda a Sexta-feira, das 08h00 às 18h00.</li>
                <li>• Aos Sábados, o atendimento decorre das 08h00 às 12h00.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 sm:mt-16">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-9 mb-3 sm:mb-4">Perguntas Frequentes</h2>
            <p className="text-gray-7 text-sm sm:text-base px-4">
              Encontre respostas rápidas para as dúvidas mais comuns
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <h3 className="font-semibold text-gray-9 mb-2 text-sm sm:text-base">Como faço um pedido?</h3>
              <p className="text-gray-7 text-xs sm:text-sm">
                Navegue pelos produtos, adicione ao carrinho e finalize a compra. 
                Aceitamos M-Pesa, E-Mola, Imali, cartão e pagamento no acto da entrega.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <h3 className="font-semibold text-gray-9 mb-2 text-sm sm:text-base">Qual o prazo de entrega?</h3>
              <p className="text-gray-7 text-xs sm:text-sm">
                O prazo depende do vendedor, da zona e do tipo de pedido. 
                Para mais detalhes, consulte a nossa equipa ou a página de FAQ.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <h3 className="font-semibold text-gray-9 mb-2 text-sm sm:text-base">Como contacto um vendedor?</h3>
              <p className="text-gray-7 text-xs sm:text-sm">
                Pode ver os detalhes do vendedor na página do produto ou pedido.
                Para apoio adicional, utilize a Central de Ajuda ou abra um pedido de apoio.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <h3 className="font-semibold text-gray-9 mb-2 text-sm sm:text-base">Posso cancelar o meu pedido?</h3>
              <p className="text-gray-7 text-xs sm:text-sm">
                As condições de cancelamento dependem do estado do pedido e do vendedor. 
                Entre em contacto connosco ou consulte a página de Trocas e Devoluções.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 