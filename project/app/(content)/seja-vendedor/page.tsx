'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Check,
  Star,
  Users,
  TrendingUp,
  Shield,
  Truck,
  Headphones,
  Store,
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function SejaVendedorPage() {
  const { toast } = useToast();
  const { register } = useAuth();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '+258',
    password: '',
    confirmPassword: '',
    nomeLoja: '',
    descricao: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    tipoProduto: '',
    experiencia: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Palavras-passe diferentes',
        description: 'A confirmação da palavra-passe não coincide.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: 'seller' as const,
        sellerProfile: {
          storeName: formData.nomeLoja,
          storeDescription: formData.descricao,
          address: formData.endereco,
          city: formData.cidade,
          province: formData.estado,
          postalCode: formData.cep || undefined,
          productTypes: formData.tipoProduto,
          experience: formData.experiencia || undefined,
        },
      };

      await register(payload as any);
      toast({
        title: 'Registo enviado',
        description: 'A sua candidatura de vendedor foi submetida com sucesso.',
      });
      router.push('/vendedor/painel');
    } catch (error: any) {
      const apiError = error?.message || 'Falha no registo. Verifique os dados e tente novamente.';
      toast({ title: 'Erro no registo', description: apiError, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const beneficios = [
    {
      icon: Star,
      title: 'Mais Visibilidade',
      description:
        'Divulgue os seus produtos ou serviços numa montra digital criada para promover negócios locais e aproximar vendedores de compradores.',
    },
    {
      icon: Users,
      title: 'Acesso a Novos Clientes',
      description:
        'Alcance pessoas que procuram produtos, serviços e soluções disponíveis na sua comunidade.',
    },
    {
      icon: Shield,
      title: 'Apoio à Formalização Progressiva',
      description:
        'Mesmo que o seu negócio ainda seja informal, o Txova pode ajudá-lo a organizar melhor a sua oferta, apresentar os seus produtos e ganhar mais confiança junto dos clientes.',
    },
    {
      icon: TrendingUp,
      title: 'Gestão Simples da Sua Banca',
      description:
        'Tenha acesso a um painel onde poderá adicionar produtos, actualizar preços, controlar stock, acompanhar pedidos, consultar avaliações e gerir as suas vendas.',
    },
    {
      icon: Truck,
      title: 'Pagamentos e Entregas Mais Organizados',
      description:
        'Disponibilize diferentes formas de pagamento e combine entregas conforme as condições do seu negócio, do cliente e da plataforma.',
    },
    {
      icon: Headphones,
      title: 'Apoio ao Vendedor',
      description:
        'Conte com orientação da equipa do Txova para melhorar a apresentação da sua banca, divulgar produtos e utilizar melhor a plataforma.',
    },
  ];

  const quemPodeVender = [
    'Vendedores informais',
    'Pequenos negócios locais',
    'Produtores',
    'Prestadores de serviços',
    'Lojas',
    'Bancas',
    'Artesãos',
    'Empreendedores individuais',
    'Negócios familiares',
    'Empresas locais',
  ];

  const requisitos = [
    'Nome completo',
    'Contacto telefónico',
    'E-mail',
    'Nome da banca ou negócio',
    'Localização do negócio',
    'Tipo de produtos ou serviços vendidos',
    'Documento de identificação, quando solicitado',
    'NUIT, quando aplicável',
    'Informações sobre experiência, actividade ou área de actuação',
    'Compromisso com informação verdadeira, atendimento responsável e qualidade dos produtos ou serviços divulgados',
  ];

  const passos = [
    {
      step: '01',
      title: 'Registo Inicial',
      description:
        'Preencha o formulário com os seus dados pessoais, contacto e informações sobre a sua banca ou negócio.',
    },
    {
      step: '02',
      title: 'Análise da Informação',
      description:
        'A equipa do Txova poderá analisar os dados submetidos para verificar se estão completos e se cumprem os requisitos básicos da plataforma.',
    },
    {
      step: '03',
      title: 'Activação da Banca',
      description:
        'Após validação, a sua banca poderá ser activada para começar a divulgar produtos ou serviços.',
    },
    {
      step: '04',
      title: 'Publicação de Produtos ou Serviços',
      description:
        'Adicione fotografias, descrições, preços, stock, categoria e condições de venda.',
    },
    {
      step: '05',
      title: 'Primeiros Pedidos',
      description:
        'Depois de publicar os seus produtos ou serviços, os clientes poderão encontrar a sua banca, fazer pedidos e entrar em contacto através da plataforma.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-1 overflow-x-hidden">
      <Header />

      <div className="container py-8 px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-gray-6 mb-6">
          <Link href="/" className="hover:text-primary">Início</Link> /
          <span className="text-primary"> Seja Vendedor no Txova</span>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-9 mb-4">
            Seja Vendedor no Txova
          </h1>
          <p className="text-base sm:text-lg text-gray-7 max-w-6xl mx-auto px-4">
            Junte-se ao Txova e dê mais visibilidade ao seu negócio. A nossa plataforma ajuda
            vendedores informais, pequenos empreendedores, produtores locais, prestadores de serviços
            e empresas a divulgarem produtos, alcançarem novos clientes e fortalecerem a sua presença
            no mercado local.
          </p>
        </div>

        <div className="mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-9 mb-8 text-center">
            Por que vender no Txova?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {beneficios.map((beneficio) => (
              <div key={beneficio.title} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <beneficio.icon size={24} className="text-primary" />
                </div>
                <h3 className="font-semibold text-gray-9 mb-2">{beneficio.title}</h3>
                <p className="text-gray-7 text-sm">{beneficio.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16 mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-9 mb-6 text-center">
            Quem Pode Vender no Txova?
          </h2>
          <div className="bg-white rounded-lg p-6 lg:p-8 shadow-sm">
            <p className="text-gray-7 mb-4">
              O Txova está aberto a diferentes tipos de vendedores, incluindo:
            </p>
            <ul className="grid sm:grid-cols-2 gap-3">
              {quemPodeVender.map((item) => (
                <li key={item} className="flex items-start space-x-3">
                  <Store size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-gray-7 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mx-auto">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-9 mb-6">
              Requisitos para Vendedores
            </h2>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <p className="text-gray-7 text-sm mb-4">
                Para se registar como vendedor, poderá ser necessário apresentar ou preencher:
              </p>
              <ul className="space-y-3">
                {requisitos.map((requisito) => (
                  <li key={requisito} className="flex items-start space-x-3">
                    <Check size={16} className="text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-gray-7 text-sm">{requisito}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-9 mb-4">Como Funciona</h3>
              <div className="space-y-4">
                {passos.map((passo) => (
                  <div key={passo.step} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {passo.step}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-9 text-sm">{passo.title}</h4>
                      <p className="text-gray-7 text-xs">{passo.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 lg:p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-9 mb-6">
              Cadastre-se como Vendedor
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-gray-9 mb-4">Dados Pessoais</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-9 mb-2">Nome *</label>
                    <Input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      placeholder="O seu nome"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-9 mb-2">Apelido *</label>
                    <Input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      placeholder="O seu apelido"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-9 mb-2">E-mail *</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="oseuemail@exemplo.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-9 mb-2">Telefone *</label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      pattern="^\+258[0-9]{9}$"
                      placeholder="+258"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-9 mb-2">Palavra-passe *</label>
                    <Input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      minLength={8}
                      placeholder="Crie uma palavra-passe segura"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-9 mb-2">
                      Confirmar Palavra-passe *
                    </label>
                    <Input
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      required
                      placeholder="Repita a palavra-passe"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-9 mb-4">Dados da Banca</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-9 mb-2">Nome da Banca *</label>
                    <Input
                      name="nomeLoja"
                      value={formData.nomeLoja}
                      onChange={handleInputChange}
                      required
                      placeholder="Ex.: Banca Helton, Loja Esperança, Serviços Maquinino"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-9 mb-2">
                      Descrição da Banca
                    </label>
                    <Textarea
                      name="descricao"
                      value={formData.descricao}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Descreva brevemente o seu negócio, os produtos ou serviços que oferece e aquilo que diferencia a sua banca."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-9 mb-2">Endereço *</label>
                    <Input
                      name="endereco"
                      value={formData.endereco}
                      onChange={handleInputChange}
                      required
                      placeholder="Rua, número, bairro ou ponto de referência"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-9 mb-2">Cidade *</label>
                      <Input
                        name="cidade"
                        value={formData.cidade}
                        onChange={handleInputChange}
                        required
                        placeholder="Beira"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-9 mb-2">Província *</label>
                      <Input
                        name="estado"
                        value={formData.estado}
                        onChange={handleInputChange}
                        required
                        placeholder="Sofala"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-9 mb-2">Código Postal</label>
                      <Input
                        name="cep"
                        value={formData.cep}
                        onChange={handleInputChange}
                        placeholder="2100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-9 mb-2">
                      Tipo de Produtos ou Serviços *
                    </label>
                    <Input
                      name="tipoProduto"
                      value={formData.tipoProduto}
                      onChange={handleInputChange}
                      required
                      placeholder="Ex.: moda, alimentação, mobília, acessórios, serviços técnicos, beleza, produtos agrícolas, decoração, entre outros."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-9 mb-2">
                      Experiência na Área
                    </label>
                    <Textarea
                      name="experiencia"
                      value={formData.experiencia}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Conte há quanto tempo vende, que tipo de clientes atende e qual é a sua experiência no mercado."
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-primary-hard text-white py-3"
              >
                {isSubmitting ? 'A enviar...' : 'Enviar Cadastro'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-gray-1 rounded-lg">
              <p className="text-sm text-gray-7">
                <strong>Nota Importante:</strong> Após o envio do cadastro, a equipa do Txova poderá
                entrar em contacto para confirmar informações, esclarecer dúvidas e orientar os
                próximos passos para activação da sua banca.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center mx-auto">
          <div className="bg-primary/5 rounded-lg p-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-9 mb-4">Pronto para Começar?</h2>
            <p className="text-gray-7 mb-6 max-w-2xl mx-auto">
              Faça parte do Txova e transforme a sua banca, loja, serviço ou pequeno negócio numa
              montra digital acessível, local e com maior capacidade de alcançar clientes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contato">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Falar com a Equipa do Txova
                </Button>
              </Link>
              <Link href="/sobre">
                <Button className="bg-primary hover:bg-primary-hard text-white">
                  Saber Mais
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
