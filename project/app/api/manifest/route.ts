import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    name: 'VITRINE - Marketplace Completo',
    short_name: 'VITRINE',
    description: 'Marketplace completo com produtos de qualidade em todas as categorias',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563EB',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'pt-MZ',
    categories: ['shopping', 'business', 'lifestyle'],
    icons: [
      {
        src: '/icons/icon-72x72.png',
        sizes: '72x72',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-96x96.png',
        sizes: '96x96',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-128x128.png',
        sizes: '128x128',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-144x144.png',
        sizes: '144x144',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-152x152.png',
        sizes: '152x152',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'maskable any'
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable any'
      }
    ],
    shortcuts: [
      {
        name: 'Produtos em Destaque',
        short_name: 'Destaque',
        description: 'Explorar produtos em destaque',
        url: '/loja',
        icons: [
          {
            src: '/icons/shortcut-banca.png',
            sizes: '96x96'
          }
        ]
      },
      {
        name: 'Carrinho',
        short_name: 'Carrinho',
        description: 'Ver carrinho de compras',
        url: '/carrinho',
        icons: [
          {
            src: '/icons/shortcut-cart.png',
            sizes: '96x96'
          }
        ]
      },
      {
        name: 'Meu Painel',
        short_name: 'Painel',
        description: 'Acessar meu painel',
        url: '/painel',
        icons: [
          {
            src: '/icons/shortcut-dashboard.png',
            sizes: '96x96'
          }
        ]
      }
    ],
    screenshots: [
      {
        src: '/screenshots/homepage.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Página inicial da VITRINE'
      },
      {
        src: '/screenshots/shop.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Loja de produtos'
      },
      {
        src: '/screenshots/mobile-home.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Página inicial no mobile'
      },
      {
        src: '/screenshots/mobile-shop.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Loja no mobile'
      }
    ]
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
} 