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
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDE5MiAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiByeD0iMjQiIGZpbGw9IiMyNTYzRUIiLz4KPHN2ZyB4PSI0OCIgeT0iNDgiIHdpZHRoPSI5NiIgaGVpZ2h0PSI5NiIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJ3aGl0ZSI+CjxwYXRoIGQ9Ik0xMiAyTDIgN3YxMGMwIDUuNTUgNC40NSAxMCAxMCAxMGg0YzUuNTUgMCAxMC00LjQ1IDEwLTEwVjdMMTIgMnpNMTIgMTVjLTEuNjYgMC0zLTEuMzQtMy0zczEuMzQtMyAzLTMgMyAxLjM0IDMgMy0xLjM0IDMtMyAzem0wLTJjLjU1IDAgMS0uNDUgMS0xcy0uNDUtMS0xLTEtMSAuNDUtMSAxIC40NSAxIDEgMXoiLz4KPC9zdmc+Cjwvc3ZnPgo=',
        sizes: '192x192',
        type: 'image/svg+xml',
        purpose: 'maskable any'
      },
      {
        src: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiByeD0iNjQiIGZpbGw9IiMyNTYzRUIiLz4KPHN2ZyB4PSIxMjgiIHk9IjEyOCIgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPgo8cGF0aCBkPSJNMTIgMkwyIDd2MTBjMCA1LjU1IDQuNDUgMTAgMTAgMTBoNGE1LjU1IDAgMCAwIDEwLTEwVjdMMTIgMnpNMTIgMTVjLTEuNjYgMC0zLTEuMzQtMy0zczEuMzQtMyAzLTMgMyAxLjM0IDMgMy0xLjM0IDMtMyAzem0wLTJjLjU1IDAgMS0uNDUgMS0xcy0uNDUtMS0xLTEtMSAuNDUtMSAxIC40NSAxIDEgMXoiLz4KPC9zdmc+Cjwvc3ZnPgo=',
        sizes: '512x512',
        type: 'image/svg+xml',
        purpose: 'maskable any'
      }
    ],
    shortcuts: [
      {
        name: 'Produtos em Destaque',
        short_name: 'Destaques',
        description: 'Veja os produtos em destaque',
        url: '/loja'
      },
      {
        name: 'Carrinho',
        short_name: 'Carrinho',
        description: 'Acesse seu carrinho de compras',
        url: '/carrinho'
      },
      {
        name: 'Minha Conta',
        short_name: 'Conta',
        description: 'Acesse sua conta',
        url: '/configuracoes'
      }
    ],
    screenshots: [
      {
        src: '/screenshot-desktop.png',
        sizes: '1280x720',
        type: 'image/png',
        form_factor: 'wide',
        label: 'Tela inicial da VITRINE'
      },
      {
        src: '/screenshot-mobile.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'Tela inicial da VITRINE no mobile'
      }
    ],
    related_applications: [],
    prefer_related_applications: false
  };

  return NextResponse.json(manifest);
} 