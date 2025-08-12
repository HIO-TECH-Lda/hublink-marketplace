import { Metadata } from 'next';

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
  const baseUrl = 'https://txova.co.mz';
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
    title: 'Txova - Marketplace de Alimentos Orgânicos em Beira',
    description: 'Marketplace moçambicano de alimentos orgânicos frescos e saudáveis em Beira, Sofala. Conectamos produtores locais com consumidores conscientes.',
    keywords: [
      'alimentos orgânicos',
      'marketplace',
      'Beira',
      'Moçambique',
      'produtos frescos',
      'produtores locais',
      'comida saudável'
    ],
    url: '/',
  },
  
  shop: {
    title: 'Banca de Produtos Orgânicos | Txova',
    description: 'Explore nossa banca de produtos orgânicos frescos e saudáveis. Encontre vegetais, frutas, grãos e muito mais diretamente dos produtores locais.',
    keywords: [
      'produtos orgânicos',
      'banca',
      'vegetais',
      'frutas',
      'grãos',
      'compras online'
    ],
    url: '/loja',
  },
  
  about: {
    title: 'Sobre Nós | Txova',
    description: 'Conheça a Txova, o marketplace que conecta produtores locais de alimentos orgânicos com consumidores conscientes em Beira, Moçambique.',
    keywords: [
      'sobre txova',
      'nossa história',
      'missão',
      'valores',
      'produtores locais'
    ],
    url: '/sobre',
  },
  
  contact: {
    title: 'Contato | Txova',
    description: 'Entre em contato com a Txova. Estamos aqui para ajudar com suas dúvidas sobre produtos orgânicos e nosso marketplace.',
    keywords: [
      'contato',
      'suporte',
      'ajuda',
      'dúvidas',
      'atendimento'
    ],
    url: '/contato',
  },
  
  blog: {
    title: 'Blog | Txova - Dicas e Notícias sobre Alimentos Orgânicos',
    description: 'Leia artigos sobre alimentação saudável, dicas de culinária, notícias sobre produtos orgânicos e muito mais no blog da Txova.',
    keywords: [
      'blog',
      'artigos',
      'alimentação saudável',
      'dicas culinárias',
      'produtos orgânicos'
    ],
    url: '/blog',
  },
  
  faq: {
    title: 'Perguntas Frequentes | Txova',
    description: 'Encontre respostas para as perguntas mais frequentes sobre a Txova, nossos produtos orgânicos e como fazer compras.',
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
    title: 'Termos de Uso | Txova',
    description: 'Leia os termos de uso da Txova. Conheça nossas políticas e condições para uso do marketplace.',
    keywords: [
      'termos de uso',
      'políticas',
      'condições',
      'legal'
    ],
    url: '/termos',
  },
  
  privacy: {
    title: 'Política de Privacidade | Txova',
    description: 'Conheça nossa política de privacidade. Saiba como a Txova protege e utiliza seus dados pessoais.',
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
    description: product.description || `Compre ${product.name} orgânico na Txova. Produto fresco e saudável diretamente do produtor.`,
    keywords: [
      product.name,
      'orgânico',
      product.category,
      'produto fresco',
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
    description: `Conheça ${seller.businessName} na Txova. Produtos orgânicos frescos e de qualidade.`,
    keywords: [
      seller.businessName,
      'vendedor',
      'produtos orgânicos',
      'txova',
      'produtor local'
    ],
    url: `/vendedor/${seller.id}`,
    type: 'website',
    image: seller.logo,
  });
}

// Helper function to generate blog post SEO
export function generateBlogPostSEO(post: any) {
  return generateMetadata({
    title: `${post.title} | Blog Txova`,
    description: post.excerpt || post.description,
    keywords: [
      ...(post.tags || []),
      'blog',
      'artigo',
      'txova',
      'alimentação saudável'
    ],
    url: `/blog/${post.id}`,
    type: 'article',
    image: post.image,
    publishedTime: post.date,
    author: post.author,
    section: post.category,
  });
} 