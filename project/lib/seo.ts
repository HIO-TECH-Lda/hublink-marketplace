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
  const baseUrl = 'https://vitrine.com';
  const defaultImage = '/images/og-image.jpg';
  
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    openGraph: {
      title: config.title,
      description: config.description,
      url: config.url ? `${baseUrl}${config.url}` : baseUrl,
      siteName: 'VITRINE',
      images: [
        {
          url: config.image || defaultImage,
          width: 1200,
          height: 630,
          alt: config.title,
        },
      ],
      locale: 'pt_BR',
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
      site: '@vitrine',
      creator: '@vitrine',
    },
    alternates: {
      canonical: config.url ? `${baseUrl}${config.url}` : baseUrl,
    },
  };
}

// Predefined SEO configurations for common pages
export const seoConfigs = {
  home: {
    title: 'VITRINE - Marketplace Completo',
    description: 'VITRINE - Marketplace completo com produtos de qualidade em todas as categorias: eletrônicos, moda, esportes, casa e muito mais.',
    keywords: [
      'marketplace',
      'eletrônicos',
      'moda',
      'esportes',
      'casa',
      'beleza',
      'compras online',
      'vendedores',
      'produtos'
    ],
    url: '/',
  },
  
  shop: {
    title: 'Loja | VITRINE',
    description: 'Explore nossa loja com produtos de qualidade em todas as categorias. Encontre eletrônicos, moda, esportes, casa e muito mais.',
    keywords: [
      'loja',
      'produtos',
      'eletrônicos',
      'moda',
      'esportes',
      'compras online'
    ],
    url: '/loja',
  },
  
  about: {
    title: 'Sobre Nós | VITRINE',
    description: 'Conheça a VITRINE, o marketplace que conecta vendedores confiáveis com compradores em busca de qualidade.',
    keywords: [
      'sobre vitrine',
      'nossa história',
      'missão',
      'valores',
      'vendedores'
    ],
    url: '/sobre',
  },
  
  contact: {
    title: 'Contato | VITRINE',
    description: 'Entre em contato com a VITRINE. Estamos aqui para ajudar com suas dúvidas sobre produtos e nosso marketplace.',
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
    title: 'Blog | VITRINE - Dicas e Notícias',
    description: 'Leia artigos sobre tecnologia, moda, esportes, dicas de compras online e muito mais no blog da VITRINE.',
    keywords: [
      'blog',
      'artigos',
      'tecnologia',
      'moda',
      'esportes',
      'dicas'
    ],
    url: '/blog',
  },
  
  faq: {
    title: 'Perguntas Frequentes | VITRINE',
    description: 'Encontre respostas para as perguntas mais frequentes sobre a VITRINE, nossos produtos e como fazer compras.',
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
    title: 'Termos de Uso | VITRINE',
    description: 'Leia os termos de uso da VITRINE. Conheça nossas políticas e condições para uso do marketplace.',
    keywords: [
      'termos de uso',
      'políticas',
      'condições',
      'legal'
    ],
    url: '/termos',
  },
  
  privacy: {
    title: 'Política de Privacidade | VITRINE',
    description: 'Conheça nossa política de privacidade. Saiba como a VITRINE protege e utiliza seus dados pessoais.',
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
    title: `${product.name} | VITRINE`,
    description: product.description || `Compre ${product.name} na VITRINE. Produto de qualidade com garantia.`,
    keywords: [
      product.name,
      product.category,
      'produto',
      'vitrine',
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
    title: `${seller.businessName} | Vendedor VITRINE`,
    description: `Conheça ${seller.businessName} na VITRINE. Produtos de qualidade e confiabilidade.`,
    keywords: [
      seller.businessName,
      'vendedor',
      'produtos',
      'vitrine',
      'loja'
    ],
    url: `/vendedor/${seller.id}`,
    type: 'website',
    image: seller.logo,
  });
}

// Helper function to generate blog post SEO
export function generateBlogPostSEO(post: any) {
  return generateMetadata({
    title: `${post.title} | Blog VITRINE`,
    description: post.excerpt || post.description,
    keywords: [
      ...(post.tags || []),
      'blog',
      'artigo',
      'vitrine',
      'tecnologia',
      'moda',
      'esportes'
    ],
    url: `/blog/${post.id}`,
    type: 'article',
    image: post.image,
    publishedTime: post.date,
    author: post.author,
    section: post.category,
  });
} 