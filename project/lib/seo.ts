import { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export function generateMetadata(config: SEOConfig): Metadata {
  const baseUrl = siteConfig.appUrl;
  const defaultImage = '/images/og-image.jpg';
  
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    openGraph: {
      title: config.title,
      description: config.description,
      url: config.url ? `${baseUrl}${config.url}` : baseUrl,
      siteName: 'Txova',
      images: [
        {
          url: config.image || defaultImage,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
      locale: 'pt_MZ',
      type: config.type === 'product' ? 'website' : (config.type || 'website'),
      ...(config.publishedTime && { publishedTime: config.publishedTime }),
      ...(config.modifiedTime && { modifiedTime: config.modifiedTime }),
      ...(config.author && { authors: [{ name: config.author }] }),
      ...(config.section && { section: config.section }),
      ...(config.tags && { tags: config.tags }),
    },
    twitter: {
      card: 'summary_large_image',
      title: config.title,
      description: config.description,
      images: [config.image || defaultImage],
      site: '@txova',
      creator: '@txova',
    },
    alternates: {
      canonical: config.url ? `${baseUrl}${config.url}` : baseUrl,
    },
  };
}

// Predefined SEO configurations for common pages
export const seoConfigs = {
  home: {
    title: 'Txova - Marketplace Local da Beira',
    description: 'Marketplace moçambicano que aproxima compradores e vendedores locais. Compre e venda produtos e serviços da Beira.',
    keywords: [
      'marketplace',
      'Beira',
      'Moçambique',
      'produtos locais',
      'vendedores locais',
      'compras online',
      'serviços locais'
    ],
    url: '/',
  },
  
  shop: {
    title: 'Comprar | Txova',
    description: 'Explore produtos e serviços divulgados por vendedores locais no Txova. Encontre alimentação, moda, mobília, acessórios e muito mais.',
    keywords: [
      'comprar',
      'produtos locais',
      'loja online',
      'marketplace',
      'Beira',
      'compras online'
    ],
    url: '/loja',
  },
  
  about: {
    title: 'Sobre o Txova | Txova',
    description: 'Conheça o Txova, o marketplace moçambicano que dá visibilidade a negócios locais, vendedores informais e pequenos empreendedores.',
    keywords: [
      'sobre txova',
      'missão',
      'valores',
      'vendedores locais',
      'marketplace moçambicano'
    ],
    url: '/sobre',
  },
  
  contact: {
    title: 'Contacto | Txova',
    description: 'Entre em contacto com a Txova. A nossa equipa está disponível para dúvidas sobre compras, vendas, pagamentos e entregas.',
    keywords: [
      'contacto',
      'suporte',
      'ajuda',
      'dúvidas',
      'atendimento'
    ],
    url: '/contato',
  },
  
  blog: {
    title: 'Novidades | Txova',
    description: 'Leia novidades, conteúdos úteis e actualizações sobre produtos, serviços e negócios locais disponíveis no Txova.',
    keywords: [
      'novidades',
      'artigos',
      'marketplace',
      'negócios locais',
      'txova'
    ],
    url: '/blog',
  },
  
  faq: {
    title: 'Perguntas Frequentes | Txova',
    description: 'Encontre respostas às perguntas mais frequentes sobre compras, pagamentos, entregas, produtos, vendedores e funcionamento da plataforma Txova.',
    keywords: [
      'faq',
      'perguntas frequentes',
      'dúvidas',
      'ajuda',
      'como comprar'
    ],
    url: '/faq',
  },
  
  terms: {
    title: 'Termos de Utilização | Txova',
    description: 'Leia os Termos de Utilização da Txova. Conheça as políticas e condições para utilização do marketplace.',
    keywords: [
      'termos de utilização',
      'políticas',
      'condições',
      'legal'
    ],
    url: '/termos',
  },
  
  privacy: {
    title: 'Política de Privacidade | Txova',
    description: 'Conheça a Política de Privacidade da Txova. Saiba como recolhemos, utilizamos e protegemos os seus dados pessoais.',
    keywords: [
      'política de privacidade',
      'proteção de dados',
      'privacidade',
      'dados pessoais'
    ],
    url: '/privacidade',
  },
};

// Helper function to generate product-specific SEO
export function generateProductSEO(product: any) {
  return generateMetadata({
    title: `${product.name} | Txova`,
    description: product.description || `Compre ${product.name} na Txova. Produto disponível de vendedores locais na plataforma.`,
    keywords: [
      product.name,
      product.category,
      'produto local',
      'txova',
      'compras online'
    ],
    url: `/produto/${product.id}`,
    type: 'product',
    image: product.image,
  });
}

// Helper function to generate seller-specific SEO
export function generateSellerSEO(seller: any) {
  return generateMetadata({
    title: `${seller.businessName} | Vendedor Txova`,
    description: `Conheça ${seller.businessName} na Txova. Produtos e serviços de vendedores locais na plataforma.`,
    keywords: [
      seller.businessName,
      'vendedor',
      'vendedor local',
      'txova',
      'negócio local'
    ],
    url: `/vendedor/${seller.id}`,
    type: 'website',
    image: seller.logo,
  });
}

// Helper function to generate blog post SEO
export function generateBlogPostSEO(post: any) {
  return generateMetadata({
    title: `${post.title} | Novidades Txova`,
    description: post.excerpt || post.description,
    keywords: [
      ...(post.tags || []),
      'blog',
      'artigo',
      'txova',
      'negócios locais'
    ],
    url: `/blog/${post.id}`,
    type: 'article',
    image: post.image,
    publishedTime: post.date,
    author: post.author,
    section: post.category,
  });
} 