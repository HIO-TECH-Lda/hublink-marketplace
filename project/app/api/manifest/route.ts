import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    name: 'VITRINE - Marketplace Completo',
    short_name: 'VITRINE',
    description: 'VITRINE - Marketplace completo com produtos de qualidade em todas as categorias: eletrônicos, moda, esportes, casa e muito mais.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2563EB',
    orientation: 'portrait-primary',
    scope: '/',
    lang: 'pt-BR',
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
        short_name: 'Destaques',
        description: 'Veja os produtos em destaque',
        url: '/loja',
        icons: [
          {
            src: '/icons/icon-96x96.png',
            sizes: '96x96'
          }
        ]
      },
      {
        name: 'Carrinho',
        short_name: 'Carrinho',
        description: 'Acesse seu carrinho de compras',
        url: '/carrinho',
        icons: [
          {
            src: '/icons/icon-96x96.png',
            sizes: '96x96'
          }
        ]
      },
      {
        name: 'Minha Conta',
        short_name: 'Conta',
        description: 'Acesse sua conta',
        url: '/conta',
        icons: [
          {
            src: '/icons/icon-96x96.png',
            sizes: '96x96'
          }
        ]
      }
    ],
    screenshots: [
      {
        src: '/screenshots/desktop-1.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Tela inicial da VITRINE'
      },
      {
        src: '/screenshots/mobile-1.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Tela inicial da VITRINE no mobile'
      }
    ],
    related_applications: [],
    prefer_related_applications: false,
    edge_side_panel: {
      preferred_width: 400
    },
    launch_handler: {
      client_mode: 'navigate-existing'
    }
  };

  return NextResponse.json(manifest);
} 