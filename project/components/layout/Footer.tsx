import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Footer() {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
  };

  return (
    <footer className="bg-gray-9 text-white">
      {/* Newsletter Section */}
      <div className="bg-gray-8 py-12">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <h3 className="text-xl sm:text-2xl font-semibold mb-2">Assine Nossa Newsletter</h3>
              <p className="text-gray-3 text-sm sm:text-base">Receba ofertas especiais e novidades diretamente no seu e-mail</p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Digite seu e-mail"
                className="flex-1 bg-white text-gray-9 min-w-0"
                required
              />
              <Button type="submit" className="bg-primary hover:bg-primary-hard px-6 sm:px-8 whitespace-nowrap">
                Assinar
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-12">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <Link href="/" className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                <span className="text-xl sm:text-2xl font-bold">Txova</span>
              </Link>
              <p className="text-gray-4 mb-6 text-sm sm:text-base leading-relaxed">
                Marketplace moçambicano de alimentos orgânicos frescos e saudáveis. 
                Conectamos produtores locais com consumidores conscientes em Beira.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin size={16} className="flex-shrink-0" />
                  <span className="break-words">Beira, Sofala - Moçambique</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={16} className="flex-shrink-0" />
                  <span>+258 84 123 4567</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail size={16} className="flex-shrink-0" />
                  <span className="break-all">contato@ecobazar.co.mz</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-lg mb-6">Links Rápidos</h4>
              <ul className="space-y-3">
                <li><Link href="/sobre" className="text-gray-4 hover:text-primary transition-colors text-sm sm:text-base">Sobre Nós</Link></li>
                <li><Link href="/loja" className="text-gray-4 hover:text-primary transition-colors text-sm sm:text-base">Comprar Agora</Link></li>
                <li><Link href="/contato" className="text-gray-4 hover:text-primary transition-colors text-sm sm:text-base">Contato</Link></li>
                <li><Link href="/blog" className="text-gray-4 hover:text-primary transition-colors text-sm sm:text-base">Blog</Link></li>
                <li><Link href="/faq" className="text-gray-4 hover:text-primary transition-colors text-sm sm:text-base">FAQs</Link></li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="font-semibold text-lg mb-6">Minha Conta</h4>
              <ul className="space-y-3">
                <li><Link href="/painel" className="text-gray-4 hover:text-primary transition-colors text-sm sm:text-base">Meu Painel</Link></li>
                <li><Link href="/historico-pedidos" className="text-gray-4 hover:text-primary transition-colors text-sm sm:text-base">Meus Pedidos</Link></li>
                <li><Link href="/lista-desejos" className="text-gray-4 hover:text-primary transition-colors text-sm sm:text-base">Lista de Desejos</Link></li>
                <li><Link href="/configuracoes" className="text-gray-4 hover:text-primary transition-colors text-sm sm:text-base">Configurações</Link></li>
                <li><Link href="/entrar" className="text-gray-4 hover:text-primary transition-colors text-sm sm:text-base">Entrar</Link></li>
              </ul>
            </div>

            {/* Help & Support */}
            <div>
              <h4 className="font-semibold text-lg mb-6">Ajuda & Suporte</h4>
              <ul className="space-y-3">
                <li><Link href="/ajuda" className="text-gray-4 hover:text-primary transition-colors text-sm sm:text-base">Central de Ajuda</Link></li>
                <li><Link href="/privacidade" className="text-gray-4 hover:text-primary transition-colors text-sm sm:text-base">Política de Privacidade</Link></li>
                <li><Link href="/termos" className="text-gray-4 hover:text-primary transition-colors text-sm sm:text-base">Termos de Uso</Link></li>
                <li><Link href="/trocas-devolucoes" className="text-gray-4 hover:text-primary transition-colors text-sm sm:text-base">Trocas e Devoluções</Link></li>
                <li><Link href="/seja-vendedor" className="text-gray-4 hover:text-primary transition-colors text-sm sm:text-base">Seja um Vendedor</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-7 py-6">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <p className="text-gray-4 text-sm text-center lg:text-left">
              © 2024 Txova. Todos os direitos reservados.
            </p>
            
            {/* Social Media */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-gray-4 text-sm">Siga-nos:</span>
              <div className="flex space-x-3">
                <Link href="#" className="p-2 bg-gray-8 rounded-full hover:bg-primary transition-colors">
                  <Facebook size={16} />
                </Link>
                <Link href="#" className="p-2 bg-gray-8 rounded-full hover:bg-primary transition-colors">
                  <Instagram size={16} />
                </Link>
                <Link href="#" className="p-2 bg-gray-8 rounded-full hover:bg-primary transition-colors">
                  <Twitter size={16} />
                </Link>
                <Link href="#" className="p-2 bg-gray-8 rounded-full hover:bg-primary transition-colors">
                  <Youtube size={16} />
                </Link>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <span className="text-gray-4 text-sm">Pagamento:</span>
              <div className="flex flex-wrap gap-2">
                <div className="px-2 py-1 bg-gray-8 rounded text-xs">M-Pesa</div>
                <div className="px-2 py-1 bg-gray-8 rounded text-xs">E-Mola</div>
                <div className="px-2 py-1 bg-gray-8 rounded text-xs">Débito</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}