'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  description: string;
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  sellerId: string;
  sellerName: string;
  sellerLogo?: string;
  tags: string[];
  sku: string;
  weight?: string;
  color?: string;
  stockStatus?: string;
  type?: string;
  images?: string[];
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isSeller: boolean;
  sellerId?: string;
  profileImage?: string;
  billingAddress?: {
    firstName: string;
    lastName: string;
    company?: string;
    address: string;
    country: string;
    state: string;
    zipCode: string;
    email: string;
    phone: string;
  };
  storeSettings?: {
    storeName: string;
    storeDescription: string;
    storeEmail: string;
    storePhone: string;
    bankName: string;
    accountNumber: string;
    agencyNumber: string;
    pixKey: string;
    paymentMethod: string;
  };
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: CartItem[];
  userId: string;
  billingAddress: any;
  paymentMethod: string;
  shippingAddress?: any;
  orderNotes?: string;
}

interface Payout {
  id: string;
  date: string;
  period: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
}

interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  date: string;
}

interface MarketplaceState {
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  user: User | null;
  orders: Order[];
  payouts: Payout[];
  blogPosts: BlogPost[];
  reviews: Review[];
  isAuthenticated: boolean;
  showNewsletterPopup: boolean;
  showCartPopup: boolean;
  quickViewProduct: Product | null;
  currentPage: string;
}

type MarketplaceAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'ADD_TO_WISHLIST'; payload: Product }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'HIDE_NEWSLETTER_POPUP' }
  | { type: 'SHOW_CART_POPUP' }
  | { type: 'HIDE_CART_POPUP' }
  | { type: 'SET_QUICK_VIEW'; payload: Product | null }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: Order['status'] } }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'UPDATE_PRODUCT'; payload: Product }
  | { type: 'DELETE_PRODUCT'; payload: string }
  | { type: 'SET_CURRENT_PAGE'; payload: string };

const MarketplaceContext = createContext<{
  state: MarketplaceState;
  dispatch: React.Dispatch<MarketplaceAction>;
} | null>(null);

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Repolho Chinês Orgânico',
    price: 12.99,
    originalPrice: 15.99,
    image: 'https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg',
    images: [
      'https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg',
      'https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg',
      'https://images.pexels.com/photos/1458694/pexels-photo-1458694.jpeg'
    ],
    description: 'Repolho chinês orgânico fresquinho, cultivado sem agrotóxicos. Rico em vitaminas e minerais essenciais para uma alimentação saudável.',
    category: 'Verduras',
    brand: 'Orgânicos da Terra',
    rating: 4.5,
    reviews: 28,
    inStock: true,
    sellerId: 'seller1',
    sellerName: 'Fazenda Verde',
    sellerLogo: 'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg',
    tags: ['orgânico', 'fresco', 'local'],
    sku: 'VEG001',
    weight: '500g',
    color: 'Verde claro',
    stockStatus: 'Em estoque',
    type: 'Vegetal'
  },
  {
    id: '2',
    name: 'Tomates Orgânicos',
    price: 8.50,
    image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg',
    images: [
      'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg',
      'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg'
    ],
    description: 'Tomates orgânicos maduros e suculentos, perfeitos para saladas e molhos.',
    category: 'Legumes',
    brand: 'Orgânicos da Terra',
    rating: 4.7,
    reviews: 42,
    inStock: true,
    sellerId: 'seller1',
    sellerName: 'Fazenda Verde',
    tags: ['orgânico', 'fresco'],
    sku: 'VEG002',
    weight: '1kg',
    color: 'Vermelho',
    stockStatus: 'Em estoque',
    type: 'Legume'
  },
  {
    id: '3',
    name: 'Cenouras Orgânicas',
    price: 6.99,
    originalPrice: 8.99,
    image: 'https://images.pexels.com/photos/1458622/pexels-photo-1458622.jpeg',
    images: [
      'https://images.pexels.com/photos/1458622/pexels-photo-1458622.jpeg',
      'https://images.pexels.com/photos/1458622/pexels-photo-1458622.jpeg'
    ],
    description: 'Cenouras orgânicas doces e crocantes, ideais para sucos e saladas.',
    category: 'Legumes',
    brand: 'Horta Natural',
    rating: 4.3,
    reviews: 31,
    inStock: true,
    sellerId: 'seller2',
    sellerName: 'Horta do Vale',
    tags: ['orgânico', 'doce'],
    sku: 'VEG003',
    weight: '750g',
    color: 'Laranja',
    stockStatus: 'Em estoque',
    type: 'Legume'
  },
  {
    id: '4',
    name: 'Alface Orgânica',
    price: 4.99,
    image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg',
    images: [
      'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg',
      'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg'
    ],
    description: 'Alface orgânica crocante e fresca, cultivada com carinho e sem agrotóxicos.',
    category: 'Verduras',
    brand: 'Verde Natural',
    rating: 4.6,
    reviews: 19,
    inStock: true,
    sellerId: 'seller2',
    sellerName: 'Horta do Vale',
    tags: ['orgânico', 'crocante'],
    sku: 'VEG004',
    weight: '300g',
    color: 'Verde',
    stockStatus: 'Em estoque',
    type: 'Verdura'
  },
  {
    id: '5',
    name: 'Maçãs Orgânicas',
    price: 9.99,
    originalPrice: 12.99,
    image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg',
    images: [
      'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg',
      'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg'
    ],
    description: 'Maçãs orgânicas doces e suculentas, perfeitas para lanches saudáveis.',
    category: 'Frutas',
    brand: 'Pomar Orgânico',
    rating: 4.8,
    reviews: 56,
    inStock: true,
    sellerId: 'seller3',
    sellerName: 'Pomar da Serra',
    tags: ['orgânico', 'doce', 'fruta'],
    sku: 'FRU001',
    weight: '1kg',
    color: 'Vermelho',
    stockStatus: 'Em estoque',
    type: 'Fruta'
  },
  {
    id: '6',
    name: 'Bananas Orgânicas',
    price: 7.50,
    image: 'https://images.pexels.com/photos/47305/bananas-banana-bunch-fruit-yellow-47305.jpeg',
    images: [
      'https://images.pexels.com/photos/47305/bananas-banana-bunch-fruit-yellow-47305.jpeg',
      'https://images.pexels.com/photos/47305/bananas-banana-bunch-fruit-yellow-47305.jpeg'
    ],
    description: 'Bananas orgânicas maduras e doces, ricas em potássio e energia.',
    category: 'Frutas',
    brand: 'Frutas Naturais',
    rating: 4.4,
    reviews: 38,
    inStock: true,
    sellerId: 'seller3',
    sellerName: 'Pomar da Serra',
    tags: ['orgânico', 'doce', 'energético'],
    sku: 'FRU002',
    weight: '1.2kg',
    color: 'Amarelo',
    stockStatus: 'Em estoque',
    type: 'Fruta'
  },
  {
    id: '7',
    name: 'Arroz Integral Orgânico',
    price: 15.99,
    originalPrice: 19.99,
    image: 'https://images.pexels.com/photos/4110225/pexels-photo-4110225.jpeg',
    images: [
      'https://images.pexels.com/photos/4110225/pexels-photo-4110225.jpeg',
      'https://images.pexels.com/photos/4110225/pexels-photo-4110225.jpeg'
    ],
    description: 'Arroz integral orgânico rico em fibras e nutrientes essenciais.',
    category: 'Grãos',
    brand: 'Grãos Naturais',
    rating: 4.6,
    reviews: 24,
    inStock: true,
    sellerId: 'seller4',
    sellerName: 'Grãos do Vale',
    tags: ['orgânico', 'integral', 'fibras'],
    sku: 'GRA001',
    weight: '1kg',
    color: 'Marrom',
    stockStatus: 'Em estoque',
    type: 'Grão'
  },
  {
    id: '8',
    name: 'Quinoa Orgânica',
    price: 22.99,
    image: 'https://images.pexels.com/photos/4110225/pexels-photo-4110225.jpeg',
    images: [
      'https://images.pexels.com/photos/4110225/pexels-photo-4110225.jpeg',
      'https://images.pexels.com/photos/4110225/pexels-photo-4110225.jpeg'
    ],
    description: 'Quinoa orgânica rica em proteínas e aminoácidos essenciais.',
    category: 'Grãos',
    brand: 'Grãos Naturais',
    rating: 4.9,
    reviews: 67,
    inStock: true,
    sellerId: 'seller4',
    sellerName: 'Grãos do Vale',
    tags: ['orgânico', 'proteína', 'superalimento'],
    sku: 'GRA002',
    weight: '500g',
    color: 'Bege',
    stockStatus: 'Em estoque',
    type: 'Grão'
  }
];

const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Benefícios dos Alimentos Orgânicos para a Saúde',
    excerpt: 'Descubra como os alimentos orgânicos podem transformar sua saúde e bem-estar com nutrientes mais potentes e livres de agrotóxicos.',
    content: 'Os alimentos orgânicos são cultivados sem o uso de pesticidas sintéticos, fertilizantes químicos ou organismos geneticamente modificados...',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    date: '15 de Janeiro, 2024',
    author: 'Dr. Maria Silva',
    category: 'Saúde',
    tags: ['orgânico', 'saúde', 'nutrição']
  },
  {
    id: '2',
    title: 'Como Cultivar sua Própria Horta Orgânica',
    excerpt: 'Aprenda técnicas simples para cultivar alimentos orgânicos em casa, mesmo em espaços pequenos.',
    content: 'Cultivar sua própria horta orgânica é uma experiência gratificante que conecta você com a natureza...',
    image: 'https://images.pexels.com/photos/2255935/pexels-photo-2255935.jpeg',
    date: '12 de Janeiro, 2024',
    author: 'João Santos',
    category: 'Cultivo',
    tags: ['horta', 'cultivo', 'orgânico']
  },
  {
    id: '3',
    title: 'Receitas Saudáveis com Produtos Orgânicos',
    excerpt: 'Inspire-se com receitas deliciosas e nutritivas usando apenas ingredientes orgânicos frescos.',
    content: 'Cozinhar com ingredientes orgânicos frescos não só é mais saudável, mas também mais saboroso...',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
    date: '10 de Janeiro, 2024',
    author: 'Chef Ana Costa',
    category: 'Receitas',
    tags: ['receitas', 'orgânico', 'culinária']
  }
];

const mockReviews: Review[] = [
  {
    id: '1',
    productId: '1',
    userId: 'user1',
    userName: 'Maria Silva',
    userImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    rating: 5,
    comment: 'Excelente qualidade! O repolho chinês chegou muito fresco e saboroso. Recomendo muito!',
    date: '10 de Janeiro, 2024'
  },
  {
    id: '2',
    productId: '1',
    userId: 'user2',
    userName: 'João Santos',
    userImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    rating: 4,
    comment: 'Produto de boa qualidade, chegou bem embalado. Só não dei 5 estrelas porque demorou um pouco para chegar.',
    date: '8 de Janeiro, 2024'
  },
  {
    id: '3',
    productId: '2',
    userId: 'user3',
    userName: 'Ana Costa',
    userImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    rating: 5,
    comment: 'Tomates deliciosos! Muito maduros e saborosos. Com certeza vou comprar novamente.',
    date: '12 de Janeiro, 2024'
  }
];

const mockPayouts: Payout[] = [
  {
    id: 'PAY001',
    date: '15 de Janeiro, 2024',
    period: '01-15 Jan 2024',
    amount: 1250.50,
    status: 'completed'
  },
  {
    id: 'PAY002',
    date: '01 de Janeiro, 2024',
    period: '16-31 Dez 2023',
    amount: 980.75,
    status: 'completed'
  },
  {
    id: 'PAY003',
    date: '15 de Dezembro, 2023',
    period: '01-15 Dez 2023',
    amount: 1450.25,
    status: 'completed'
  }
];

const initialState: MarketplaceState = {
  products: mockProducts,
  cart: [],
  wishlist: [],
  user: null,
  orders: [],
  payouts: mockPayouts,
  blogPosts: mockBlogPosts,
  reviews: mockReviews,
  isAuthenticated: false,
  showNewsletterPopup: true,
  showCartPopup: false,
  quickViewProduct: null,
  currentPage: 'home'
};

function marketplaceReducer(state: MarketplaceState, action: MarketplaceAction): MarketplaceState {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.product.id === action.payload.product.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.product.id === action.payload.product.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return {
        ...state,
        cart: [...state.cart, { product: action.payload.product, quantity: action.payload.quantity }],
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        cart: state.cart.filter(item => item.product.id !== action.payload),
      };

    case 'UPDATE_CART_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        cart: [],
      };

    case 'ADD_TO_WISHLIST':
      if (state.wishlist.find(item => item.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        wishlist: [...state.wishlist, action.payload],
      };

    case 'REMOVE_FROM_WISHLIST':
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.id !== action.payload),
      };

    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
      };

    case 'SET_AUTHENTICATED':
      return {
        ...state,
        isAuthenticated: action.payload,
      };

    case 'HIDE_NEWSLETTER_POPUP':
      return {
        ...state,
        showNewsletterPopup: false,
      };

    case 'SHOW_CART_POPUP':
      return {
        ...state,
        showCartPopup: true,
      };

    case 'HIDE_CART_POPUP':
      return {
        ...state,
        showCartPopup: false,
      };

    case 'SET_QUICK_VIEW':
      return {
        ...state,
        quickViewProduct: action.payload,
      };

    case 'ADD_ORDER':
      return {
        ...state,
        orders: [...state.orders, action.payload],
      };

    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? { ...order, status: action.payload.status }
            : order
        ),
      };

    case 'ADD_PRODUCT':
      return {
        ...state,
        products: [...state.products, action.payload],
      };

    case 'UPDATE_PRODUCT':
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? action.payload : product
        ),
      };

    case 'DELETE_PRODUCT':
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload),
      };

    case 'SET_CURRENT_PAGE':
      return {
        ...state,
        currentPage: action.payload,
      };

    default:
      return state;
  }
}

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(marketplaceReducer, initialState);

  useEffect(() => {
    // Check if newsletter popup should be hidden from sessionStorage
    const hideNewsletter = sessionStorage.getItem('hideNewsletterPopup');
    if (hideNewsletter === 'true') {
      dispatch({ type: 'HIDE_NEWSLETTER_POPUP' });
    }

    // Auto-show newsletter popup after 3 seconds if it should be shown
    const timer = setTimeout(() => {
      if (state.showNewsletterPopup && !hideNewsletter) {
        // Popup is already shown by default
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <MarketplaceContext.Provider value={{ state, dispatch }}>
      {children}
    </MarketplaceContext.Provider>
  );
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error('useMarketplace must be used within a MarketplaceProvider');
  }
  return context;
}