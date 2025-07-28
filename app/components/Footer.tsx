import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Footer() {
  return (
    <footer className="bg-gray-9 text-white">
      {/* Newsletter Section */}
      <div className="bg-primary py-12">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">
              Assine Nossa Newsletter
            </h3>
            <p className="text-primary-soft mb-6">
              Receba ofertas especiais e novidades sobre nossos produtos orgânicos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Digite seu e-mail"
                className="flex-1 px-4 py-3 rounded-lg text-gray-9 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <Button className="bg-white text-primary hover:bg-gray-1 px-8">
                Assinar
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-2xl font-bold">Ecobazar</span>
            </div>
            <p className="text-gray-4 mb-6">
              Sua loja de alimentos orgânicos 100% confiável. Produtos frescos e saudáveis direto do produtor.
            </p>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5 text-gray-4 hover:text-primary cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 text-gray-4 hover:text-primary cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 text-gray-4 hover:text-primary cursor-pointer transition-colors" />
              <Youtube className="w-5 h-5 text-gray-4 hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Links Rápidos</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/minha-conta" className="text-gray-4 hover:text-white transition-colors">
                  Minha Conta
                </Link>
              </li>
              <li>
                <Link href="/lista-desejos" className="text-gray-4 hover:text-white transition-colors">
                  Lista de Desejos
                </Link>
              </li>
              <li>
                <Link href="/carrinho" className="text-gray-4 hover:text-white transition-colors">
                  Carrinho de Compras
                </Link>
              </li>
              <li>
                <Link href="/historico-pedidos" className="text-gray-4 hover:text-white transition-colors">
                  Pedidos
                </Link>
              </li>
              <li>
                <Link href="/ajuda" className="text-gray-4 hover:text-white transition-colors">
                  Ajuda
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Categorias</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/loja?categoria=frutas" className="text-gray-4 hover:text-white transition-colors">
                  Frutas & Verduras
                </Link>
              </li>
              <li>
                <Link href="/loja?categoria=carnes" className="text-gray-4 hover:text-white transition-colors">
                  Carnes Orgânicas
                </Link>
              </li>
              <li>
                <Link href="/loja?categoria=laticinios" className="text-gray-4 hover:text-white transition-colors">
                  Laticínios
                </Link>
              </li>
              <li>
                <Link href="/loja?categoria=graos" className="text-gray-4 hover:text-white transition-colors">
                  Grãos & Cereais
                </Link>
              </li>
              <li>
                <Link href="/loja?categoria=bebidas" className="text-gray-4 hover:text-white transition-colors">
                  Bebidas
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contato</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <span className="text-gray-4">
                  Rua São Paulo, 123<br />
                  Centro - São Paulo/SP<br />
                  CEP: 01000-000
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-gray-4">(11) 99999-9999</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-gray-4">contato@ecobazar.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-7">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-4 text-sm mb-4 md:mb-0">
              © 2024 Ecobazar. Todos os direitos reservados.
            </p>
            <div className="flex items-center space-x-4">
              <span className="text-gray-4 text-sm">Aceitamos:</span>
              <div className="flex space-x-2">
                <div className="w-8 h-5 bg-gray-4 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-9">VISA</span>
                </div>
                <div className="w-8 h-5 bg-gray-4 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-9">MC</span>
                </div>
                <div className="w-8 h-5 bg-gray-4 rounded flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-9">PIX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}