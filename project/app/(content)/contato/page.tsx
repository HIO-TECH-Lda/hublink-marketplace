'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted:', formData);
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Endereço',
      content: 'Rua das Flores, 123 - Baixa\n Beira - 2100',
      color: 'text-primary'
    },
    {
      icon: Phone,
      title: 'Telefones',
      content: '+258 84 9999-9999\n+258 84 8888-8888',
      color: 'text-primary'
    },
    {
      icon: Mail,
      title: 'E-mail',
      content: 'contato@ecobazar.com\nsuporte@ecobazar.com',
      color: 'text-primary'
    },
    {
      icon: Clock,
      title: 'Horário de Funcionamento',
      content: 'Segunda a Sexta: 8h às 18h\nSábado: 8h às 12h',
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
          <span className="text-primary"> Contato</span>
        </nav>

        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-9 mb-4">Entre em Contato</h1>
          <p className="text-base sm:text-lg text-gray-7 max-w-2xl mx-auto px-4">
            Tem alguma dúvida, sugestão ou quer fazer um pedido especial? 
            Estamos aqui para ajudar você!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Information */}
          <div className="space-y-6 lg:space-y-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-9 mb-4 sm:mb-6">Informações de Contato</h2>
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
              <h3 className="text-lg sm:text-xl font-bold text-gray-9 mb-3 sm:mb-4">Nossa Localização</h3>
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="aspect-video bg-gray-2 flex items-center justify-center">
                  <div className="text-center p-4">
                    <MapPin size={32} className="sm:w-12 sm:h-12 text-gray-4 mx-auto mb-3 sm:mb-4" />
                    <p className="text-gray-6 text-sm sm:text-base">Mapa interativo será carregado aqui</p>
                    <p className="text-xs sm:text-sm text-gray-5 mt-2">
                      Rua das Flores, 123 - Baixa, Beira - 2100
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
                <a
                  href="#"
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                >
                  <span className="text-primary hover:text-white font-semibold text-sm sm:text-base">in</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                >
                  <span className="text-primary hover:text-white font-semibold text-sm sm:text-base">ig</span>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                >
                  <span className="text-primary hover:text-white font-semibold text-sm sm:text-base">yt</span>
                </a>
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
                    placeholder="Seu nome completo"
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
                  placeholder="Qual é o assunto da sua mensagem?"
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
                  placeholder="Escreva sua mensagem aqui..."
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hard text-white py-3"
              >
                <Send size={16} className="mr-2" />
                Enviar Mensagem
              </Button>
            </form>

            {/* Additional Info */}
            <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gray-1 rounded-lg">
              <h4 className="font-semibold text-gray-9 mb-2 text-sm sm:text-base">Informações Importantes</h4>
              <ul className="text-xs sm:text-sm text-gray-7 space-y-1">
                <li>• Respondemos todas as mensagens em até 24 horas</li>
                <li>• Para pedidos urgentes, ligue diretamente</li>
                <li>• Horário de atendimento: Segunda a Sexta, 8h às 18h</li>
                <li>• Sábados: 8h às 12h</li>
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
                Navegue pelos produtos, adicione ao carrinho e finalize sua compra. 
                Aceitamos M-Pesa, cartão de crédito e dinheiro na entrega.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <h3 className="font-semibold text-gray-9 mb-2 text-sm sm:text-base">Qual o prazo de entrega?</h3>
              <p className="text-gray-7 text-xs sm:text-sm">
                Entregamos em até 24 horas na região metropolitana. 
                Para outras localidades, consulte nossa equipe.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <h3 className="font-semibold text-gray-9 mb-2 text-sm sm:text-base">Os produtos são realmente orgânicos?</h3>
              <p className="text-gray-7 text-xs sm:text-sm">
                Sim! Todos os nossos produtores são certificados e passam por 
                rigorosos controles de qualidade.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <h3 className="font-semibold text-gray-9 mb-2 text-sm sm:text-base">Posso cancelar meu pedido?</h3>
              <p className="text-gray-7 text-xs sm:text-sm">
                Pedidos podem ser cancelados até 2 horas antes da entrega. 
                Entre em contato conosco para solicitar o cancelamento.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
} 