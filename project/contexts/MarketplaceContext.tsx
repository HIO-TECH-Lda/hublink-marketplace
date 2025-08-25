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
    paymentKey: string;
    paymentMethod: string;
  };
  role: 'buyer' | 'seller' | 'admin';
}

interface ReturnRequest {
  orderId: string;
  items: string[];
  reason: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  createdAt: string;
  userId: string;
}

// Ticket System Interfaces
export enum TicketCategory {
  TECHNICAL_ISSUE = 'technical_issue',
  PAYMENT_PROBLEM = 'payment_problem',
  ORDER_ISSUE = 'order_issue',
  RETURN_REQUEST = 'return_request',
  ACCOUNT_ISSUE = 'account_issue',
  PRODUCT_ISSUE = 'product_issue',
  SHIPPING_PROBLEM = 'shipping_problem',
  GENERAL_INQUIRY = 'general_inquiry',
  FEATURE_REQUEST = 'feature_request',
  BUG_REPORT = 'bug_report'
}

export enum TicketPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum TicketStatus {
  OPEN = 'open',
  IN_PROGRESS = 'in_progress',
  WAITING_FOR_USER = 'waiting_for_user',
  WAITING_FOR_THIRD_PARTY = 'waiting_for_third_party',
  RESOLVED = 'resolved',
  CLOSED = 'closed'
}

export interface TicketAttachment {
  id: string;
  ticketId: string;
  messageId?: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  userId: string;
  userType: 'buyer' | 'seller' | 'admin';
  message: string;
  createdAt: string;
  isInternal: boolean;
  attachments?: TicketAttachment[];
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  userId: string;
  userType: 'buyer' | 'seller' | 'admin';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  attachments?: TicketAttachment[];
  messages: TicketMessage[];
  tags: string[];
  orderId?: string;
  productId?: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'support' | 'moderator';
  categories: TicketCategory[];
  maxTickets: number;
  isActive: boolean;
  skills: string[];
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'return_requested';
  items: CartItem[];
  userId: string;
  billingAddress: any;
  paymentMethod: string;
  shippingAddress?: any;
  orderNotes?: string;
  returnRequest?: ReturnRequest;
  user: User;
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
  tickets: Ticket[];
  agents: Agent[];
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
  | { type: 'SET_CURRENT_PAGE'; payload: string }
  | { type: 'ADD_TICKET'; payload: Ticket }
  | { type: 'UPDATE_TICKET'; payload: Ticket }
  | { type: 'DELETE_TICKET'; payload: string }
  | { type: 'ADD_BLOG_POST'; payload: BlogPost }
  | { type: 'UPDATE_BLOG_POST'; payload: BlogPost }
  | { type: 'DELETE_BLOG_POST'; payload: string };

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Tomates Orgânicos',
    price: 850,
    originalPrice: 1000,
    image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg',
    description: 'Tomates orgânicos frescos e saborosos, cultivados sem agrotóxicos.',
    category: 'Legumes',
    brand: 'Fazenda Verde',
    rating: 4.5,
    reviews: 12,
    inStock: true,
    sellerId: 'seller1',
    sellerName: 'Fazenda Verde',
    sellerLogo: 'https://placehold.co/40x40/00BE27/ffffff?text=FV',
    tags: ['orgânico', 'fresco', 'sem agrotóxicos'],
    sku: 'TOM-ORG-001',
    weight: '500g',
    color: 'Vermelho',
    stockStatus: 'Em estoque',
    type: 'Orgânico',
    images: [
      'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg',
      'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg'
    ]
  },
  {
    id: '2',
    name: 'Repolho Chinês Orgânico',
    price: 1299,
    originalPrice: 1599,
    image: 'https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg',
    description: 'Repolho chinês orgânico, rico em vitaminas e minerais.',
    category: 'Legumes',
    brand: 'Fazenda Verde',
    rating: 4.2,
    reviews: 8,
    inStock: true,
    sellerId: 'seller1',
    sellerName: 'Fazenda Verde',
    sellerLogo: 'https://placehold.co/40x40/00BE27/ffffff?text=FV',
    tags: ['orgânico', 'vitaminas', 'minerais'],
    sku: 'REP-CHI-001',
    weight: '300g',
    color: 'Verde',
    stockStatus: 'Em estoque',
    type: 'Orgânico',
    images: [
      'https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg'
    ]
  },
  {
    id: '3',
    name: 'Cenouras Orgânicas',
    price: 699,
    originalPrice: 899,
    image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg',
    description: 'Cenouras orgânicas frescas, ricas em betacaroteno.',
    category: 'Legumes',
    brand: 'Horta do Vale',
    rating: 4.7,
    reviews: 15,
    inStock: true,
    sellerId: 'seller2',
    sellerName: 'Horta do Vale',
    sellerLogo: 'https://placehold.co/40x40/00BE27/ffffff?text=HV',
    tags: ['orgânico', 'betacaroteno', 'vitamina A'],
    sku: 'CEN-ORG-001',
    weight: '400g',
    color: 'Laranja',
    stockStatus: 'Em estoque',
    type: 'Orgânico',
    images: [
      'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg'
    ]
  },
  {
    id: '4',
    name: 'Alface Crespa Orgânica',
    price: 450,
    image: 'https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg',
    description: 'Alface crespa orgânica, fresca e crocante.',
    category: 'Verduras',
    brand: 'Fazenda Verde',
    rating: 4.3,
    reviews: 9,
    inStock: true,
    sellerId: 'seller1',
    sellerName: 'Fazenda Verde',
    sellerLogo: 'https://placehold.co/40x40/00BE27/ffffff?text=FV',
    tags: ['orgânico', 'fresco', 'verde'],
    sku: 'ALC-CRE-001',
    weight: '200g',
    color: 'Verde',
    stockStatus: 'Em estoque',
    type: 'Orgânico'
  },
  {
    id: '5',
    name: 'Maçãs Fuji Orgânicas',
    price: 999,
    originalPrice: 1299,
    image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg',
    description: 'Maçãs Fuji orgânicas, doces e suculentas.',
    category: 'Frutas',
    brand: 'Pomar Orgânico',
    rating: 4.6,
    reviews: 18,
    inStock: true,
    sellerId: 'seller3',
    sellerName: 'Pomar Orgânico',
    sellerLogo: 'https://placehold.co/40x40/00BE27/ffffff?text=PO',
    tags: ['orgânico', 'doce', 'suculenta'],
    sku: 'MAC-FUJ-001',
    weight: '1kg',
    color: 'Vermelho',
    stockStatus: 'Em estoque',
    type: 'Orgânico'
  },
  {
    id: '6',
    name: 'Bananas Prata Orgânicas',
    price: 750,
    image: 'https://images.pexels.com/photos/47305/bananas-banana-bunch-fruit-yellow-47305.jpeg',
    description: 'Bananas prata orgânicas, ricas em potássio.',
    category: 'Frutas',
    brand: 'Fazenda Verde',
    rating: 4.4,
    reviews: 11,
    inStock: true,
    sellerId: 'seller1',
    sellerName: 'Fazenda Verde',
    sellerLogo: 'https://placehold.co/40x40/00BE27/ffffff?text=FV',
    tags: ['orgânico', 'potássio', 'energia'],
    sku: 'BAN-PRA-001',
    weight: '1kg',
    color: 'Amarelo',
    stockStatus: 'Em estoque',
    type: 'Orgânico'
  },
  {
    id: '7',
    name: 'Cebolas Roxas Orgânicas',
    price: 599,
    image: 'https://images.pexels.com/photos/144206/pexels-photo-144206.jpeg',
    description: 'Cebolas roxas orgânicas, saborosas e nutritivas.',
    category: 'Legumes',
    brand: 'Horta do Vale',
    rating: 4.1,
    reviews: 7,
    inStock: true,
    sellerId: 'seller2',
    sellerName: 'Horta do Vale',
    sellerLogo: 'https://placehold.co/40x40/00BE27/ffffff?text=HV',
    tags: ['orgânico', 'saboroso', 'nutritivo'],
    sku: 'CEB-ROX-001',
    weight: '300g',
    color: 'Roxo',
    stockStatus: 'Em estoque',
    type: 'Orgânico'
  },
  {
    id: '8',
    name: 'Batatas Doces Orgânicas',
    price: 899,
    image: 'https://images.pexels.com/photos/2286776/pexels-photo-2286776.jpeg',
    description: 'Batatas doces orgânicas, ricas em fibras e vitaminas.',
    category: 'Legumes',
    brand: 'Fazenda Verde',
    rating: 4.5,
    reviews: 14,
    inStock: true,
    sellerId: 'seller1',
    sellerName: 'Fazenda Verde',
    sellerLogo: 'https://placehold.co/40x40/00BE27/ffffff?text=FV',
    tags: ['orgânico', 'fibras', 'vitaminas'],
    sku: 'BAT-DOC-001',
    weight: '1kg',
    color: 'Laranja',
    stockStatus: 'Em estoque',
    type: 'Orgânico'
  },
  {
    id: '9',
    name: 'Espinafre Orgânico',
    price: 650,
    image: 'https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg',
    description: 'Espinafre orgânico, rico em ferro e vitaminas.',
    category: 'Verduras',
    brand: 'Horta do Vale',
    rating: 4.3,
    reviews: 10,
    inStock: true,
    sellerId: 'seller2',
    sellerName: 'Horta do Vale',
    sellerLogo: 'https://placehold.co/40x40/00BE27/ffffff?text=HV',
    tags: ['orgânico', 'ferro', 'vitaminas'],
    sku: 'ESP-ORG-001',
    weight: '250g',
    color: 'Verde',
    stockStatus: 'Em estoque',
    type: 'Orgânico'
  },
  {
    id: '10',
    name: 'Mangas Orgânicas',
    price: 1199,
    originalPrice: 1499,
    image: 'https://images.pexels.com/photos/4021659/pexels-photo-4021659.jpeg',
    description: 'Mangas orgânicas doces e suculentas.',
    category: 'Frutas',
    brand: 'Pomar Orgânico',
    rating: 4.8,
    reviews: 22,
    inStock: true,
    sellerId: 'seller3',
    sellerName: 'Pomar Orgânico',
    sellerLogo: 'https://placehold.co/40x40/00BE27/ffffff?text=PO',
    tags: ['orgânico', 'doce', 'suculenta'],
    sku: 'MAN-ORG-001',
    weight: '1kg',
    color: 'Amarelo',
    stockStatus: 'Em estoque',
    type: 'Orgânico'
  },
  {
    id: '11',
    name: 'Couve-Flor Orgânica',
    price: 950,
    image: 'https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg',
    description: 'Couve-flor orgânica, fresca e nutritiva.',
    category: 'Legumes',
    brand: 'Fazenda Verde',
    rating: 4.2,
    reviews: 8,
    inStock: true,
    sellerId: 'seller1',
    sellerName: 'Fazenda Verde',
    sellerLogo: 'https://placehold.co/40x40/00BE27/ffffff?text=FV',
    tags: ['orgânico', 'fresco', 'nutritivo'],
    sku: 'COU-FLO-001',
    weight: '400g',
    color: 'Branco',
    stockStatus: 'Em estoque',
    type: 'Orgânico'
  },
  {
    id: '12',
    name: 'Abacaxis Orgânicos',
    price: 1399,
    image: 'https://images.pexels.com/photos/47305/bananas-banana-bunch-fruit-yellow-47305.jpeg',
    description: 'Abacaxis orgânicos, doces e refrescantes.',
    category: 'Frutas',
    brand: 'Pomar Orgânico',
    rating: 4.6,
    reviews: 16,
    inStock: true,
    sellerId: 'seller3',
    sellerName: 'Pomar Orgânico',
    sellerLogo: 'https://placehold.co/40x40/00BE27/ffffff?text=PO',
    tags: ['orgânico', 'doce', 'refrescante'],
    sku: 'ABA-ORG-001',
    weight: '1.5kg',
    color: 'Amarelo',
    stockStatus: 'Em estoque',
    type: 'Orgânico'
  }
];

const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Os Benefícios dos Alimentos Orgânicos',
    excerpt: 'Descubra por que escolher alimentos orgânicos pode fazer toda a diferença na sua saúde e no meio ambiente.',
    content: 'Conteúdo completo sobre os benefícios dos alimentos orgânicos...',
    image: 'https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg',
    date: '2024-01-15',
    author: 'Dr. Maria Silva',
    category: 'Saúde',
    tags: ['orgânico', 'saúde', 'nutrição']
  },
  {
    id: '2',
    title: 'Como Cultivar sua Própria Horta Orgânica',
    excerpt: 'Aprenda técnicas simples para começar sua própria horta orgânica em casa.',
    content: 'Guia completo para cultivar horta orgânica...',
    image: 'https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg',
    date: '2024-01-10',
    author: 'João Santos',
    category: 'Cultivo',
    tags: ['horta', 'cultivo', 'orgânico']
  },
  {
    id: '3',
    title: 'Receitas Saudáveis com Produtos Orgânicos',
    excerpt: 'Receitas deliciosas e nutritivas usando apenas ingredientes orgânicos.',
    content: 'Coleção de receitas saudáveis...',
    image: 'https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg',
    date: '2024-01-05',
    author: 'Ana Costa',
    category: 'Receitas',
    tags: ['receitas', 'saudável', 'orgânico']
  },
  {
    id: '4',
    title: 'O Impacto Ambiental da Agricultura Orgânica',
    excerpt: 'Entenda como a agricultura orgânica contribui para a preservação do meio ambiente.',
    content: 'Análise do impacto ambiental...',
    image: 'https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg',
    date: '2023-12-28',
    author: 'Carlos Oliveira',
    category: 'Meio Ambiente',
    tags: ['meio ambiente', 'sustentabilidade', 'orgânico']
  },
  {
    id: '5',
    title: 'Dicas para Escolher os Melhores Produtos Orgânicos',
    excerpt: 'Saiba como identificar e escolher produtos orgânicos de qualidade.',
    content: 'Guia para escolher produtos orgânicos...',
    image: 'https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg',
    date: '2023-12-20',
    author: 'Lucia Ferreira',
    category: 'Dicas',
    tags: ['dicas', 'qualidade', 'orgânico']
  },
  {
    id: '6',
    title: 'A Importância da Estação dos Alimentos',
    excerpt: 'Descubra por que consumir alimentos da estação é melhor para sua saúde e para o planeta.',
    content: 'Sobre a importância da sazonalidade...',
    image: 'https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg',
    date: '2023-12-15',
    author: 'Pedro Lima',
    category: 'Saúde',
    tags: ['estação', 'sazonalidade', 'saúde']
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
    comment: 'Tomates deliciosos! Muito frescos e saborosos.',
    date: '2024-01-10'
  },
  {
    id: '2',
    productId: '1',
    userId: 'user2',
    userName: 'João Santos',
    userImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    rating: 4,
    comment: 'Ótima qualidade, recomendo!',
    date: '2024-01-08'
  },
  {
    id: '3',
    productId: '2',
    userId: 'user3',
    userName: 'Ana Costa',
    userImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    rating: 5,
    comment: 'Repolho muito fresco e saboroso.',
    date: '2024-01-12'
  },
  {
    id: '4',
    productId: '3',
    userId: 'user4',
    userName: 'Carlos Oliveira',
    userImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    rating: 4,
    comment: 'Cenouras orgânicas de excelente qualidade.',
    date: '2024-01-09'
  },
  {
    id: '5',
    productId: '5',
    userId: 'user5',
    userName: 'Lucia Ferreira',
    userImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    rating: 5,
    comment: 'Maçãs Fuji são as melhores que já provei!',
    date: '2024-01-11'
  },
  {
    id: '6',
    productId: '8',
    userId: 'user6',
    userName: 'Pedro Lima',
    userImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    rating: 4,
    comment: 'Batatas doces muito saborosas.',
    date: '2024-01-07'
  },
  {
    id: '7',
    productId: '10',
    userId: 'user7',
    userName: 'Fernanda Costa',
    userImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    rating: 5,
    comment: 'Laranjas suculentas e doces!',
    date: '2024-01-13'
  },
  {
    id: '8',
    productId: '12',
    userId: 'user8',
    userName: 'Roberto Silva',
    userImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    rating: 4,
    comment: 'Uvas verdes muito refrescantes.',
    date: '2024-01-06'
  }
];

const mockPayouts: Payout[] = [
  {
    id: '1',
    date: '2024-01-15',
    period: '01-15 Jan 2024',
    amount: 98050,
    status: 'completed'
  },
  {
    id: '2',
    date: '2024-01-01',
    period: '16-31 Dez 2023',
    amount: 98050,
    status: 'completed'
  },
  {
    id: '3',
    date: '2023-12-15',
    period: '01-15 Dez 2023',
    amount: 145025,
    status: 'completed'
  },
  {
    id: '4',
    date: '2023-12-01',
    period: '16-30 Nov 2023',
    amount: 112080,
    status: 'completed'
  },
  {
    id: '5',
    date: '2023-11-15',
    period: '01-15 Nov 2023',
    amount: 89030,
    status: 'completed'
  },
  {
    id: '6',
    date: '2023-11-01',
    period: '16-31 Out 2023',
    amount: 134060,
    status: 'completed'
  },
  {
    id: '7',
    date: '2023-10-15',
    period: '01-15 Out 2023',
    amount: 167090,
    status: 'completed'
  },
  {
    id: '8',
    date: '2023-10-01',
    period: '16-30 Set 2023',
    amount: 92045,
    status: 'completed'
  },
  {
    id: '9',
    date: '2023-09-15',
    period: '01-15 Set 2023',
    amount: 158020,
    status: 'completed'
  },
  {
    id: '10',
    date: '2023-09-01',
    period: '16-31 Ago 2023',
    amount: 110075,
    status: 'completed'
  },
  {
    id: '11',
    date: '2024-01-30',
    period: '16-30 Jan 2024',
    amount: 185040,
    status: 'pending'
  },
  {
    id: '12',
    date: '2023-08-15',
    period: '01-15 Ago 2023',
    amount: 75025,
    status: 'failed'
  }
];

// Mock users for orders
const mockUsers: User[] = [
  {
    id: 'user1',
    firstName: 'João',
    lastName: 'Silva',
    email: 'cliente@exemplo.com',
    phone: '(11) 99999-9999',
    isSeller: false,
    role: 'buyer',
    sellerId: undefined,
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    billingAddress: {
      firstName: 'João',
      lastName: 'Silva',
      address: 'Rua das Flores, 123',
      country: 'Brasil',
      state: 'SP',
      zipCode: '01234-567',
      email: 'cliente@exemplo.com',
      phone: '(11) 99999-9999'
    }
  },
  {
    id: 'user2',
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'maria@exemplo.com',
    phone: '(11) 88888-8888',
    isSeller: false,
    role: 'buyer',
    sellerId: undefined,
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    billingAddress: {
      firstName: 'Maria',
      lastName: 'Santos',
      address: 'Avenida Principal, 456',
      country: 'Brasil',
      state: 'SP',
      zipCode: '04567-890',
      email: 'maria@exemplo.com',
      phone: '(11) 88888-8888'
    }
  }
];

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    date: '2024-01-20',
    total: 4550,
    status: 'delivered',
    userId: 'user1',
    user: mockUsers[0],
    items: [
      {
        product: {
          id: '1',
          name: 'Tomates Orgânicos',
          price: 850,
          originalPrice: 1000,
          image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg',
          description: 'Tomates orgânicos frescos e saborosos',
          category: 'Legumes',
          brand: 'Fazenda Verde',
          rating: 4.5,
          reviews: 128,
          inStock: true,
          sellerId: 'seller1',
          sellerName: 'Fazenda Verde',
          sellerLogo: 'https://placehold.co/40x40/4ade80/ffffff?text=FV',
          tags: ['orgânico', 'fresco', 'local'],
          sku: 'TOM-ORG-001',
          weight: '500g',
          color: 'Vermelho',
          stockStatus: 'Em estoque',
          type: 'Legume'
        },
        quantity: 2
      },
      {
        product: {
          id: '2',
          name: 'Repolho Chinês Orgânico',
          price: 1299,
          originalPrice: 1599,
          image: 'https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg',
          description: 'Repolho chinês orgânico crocante',
          category: 'Legumes',
          brand: 'Fazenda Verde',
          rating: 4.2,
          reviews: 89,
          inStock: true,
          sellerId: 'seller1',
          sellerName: 'Fazenda Verde',
          sellerLogo: 'https://placehold.co/40x40/4ade80/ffffff?text=FV',
          tags: ['orgânico', 'crocante', 'fresco'],
          sku: 'REP-CHI-001',
          weight: '800g',
          color: 'Verde',
          stockStatus: 'Em estoque',
          type: 'Legume'
        },
        quantity: 1
      }
    ],
    billingAddress: {
      firstName: 'João',
      lastName: 'Silva',
      address: 'Avenida 25 de Setembro, 123',
      country: 'Moçambique',
      state: 'Sofala',
      zipCode: '2100',
      email: 'joao@exemplo.com',
      phone: '+258 84 123 4567'
    },
    paymentMethod: 'M-Pesa',
    shippingAddress: {
      firstName: 'João',
      lastName: 'Silva',
      address: 'Avenida 25 de Setembro, 123',
      country: 'Moçambique',
      state: 'Sofala',
      zipCode: '2100'
    },
    orderNotes: 'Entregar após 18h',
    returnRequest: {
      orderId: 'ORD-001',
      items: ['ORD-001-1-0'],
      reason: 'defective',
      description: 'Os tomates chegaram danificados e com manchas.',
      status: 'pending',
      createdAt: '2024-01-22T10:30:00Z',
      userId: 'user1'
    }
  },
  {
    id: 'ORD-002',
    date: '2024-01-18',
    total: 3297,
    status: 'processing',
    userId: 'user2',
    user: mockUsers[1],
    items: [
      {
        product: {
          id: '3',
          name: 'Cenouras Orgânicas',
          price: 699,
          originalPrice: 899,
          image: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg',
          description: 'Cenouras orgânicas frescas',
          category: 'Legumes',
          brand: 'Horta do Vale',
          rating: 4.7,
          reviews: 156,
          inStock: true,
          sellerId: 'seller2',
          sellerName: 'Horta do Vale',
          sellerLogo: 'https://placehold.co/40x40/4ade80/ffffff?text=HV',
          tags: ['orgânico', 'fresco', 'vitamina A'],
          sku: 'CEN-ORG-001',
          weight: '400g',
          color: 'Laranja',
          stockStatus: 'Em estoque',
          type: 'Legume'
        },
        quantity: 2
      },
      {
        product: {
          id: '4',
          name: 'Alface Crespa Orgânica',
          price: 450,
          image: 'https://images.pexels.com/photos/1199562/pexels-photo-1199562.jpeg',
          description: 'Alface crespa orgânica fresca',
          category: 'Verduras',
          brand: 'Fazenda Verde',
          rating: 4.3,
          reviews: 92,
          inStock: true,
          sellerId: 'seller1',
          sellerName: 'Fazenda Verde',
          sellerLogo: 'https://placehold.co/40x40/4ade80/ffffff?text=FV',
          tags: ['orgânico', 'fresco', 'verde'],
          sku: 'ALC-CRE-001',
          weight: '200g',
          color: 'Verde',
          stockStatus: 'Em estoque',
          type: 'Verdura'
        },
        quantity: 3
      }
    ],
    billingAddress: {
      firstName: 'Maria',
      lastName: 'Santos',
      address: 'Rua da Beira, 456',
      country: 'Moçambique',
      state: 'Sofala',
      zipCode: '2100',
      email: 'maria@exemplo.com',
      phone: '+258 84 987 6543'
    },
    paymentMethod: 'E-Mola',
    shippingAddress: {
      firstName: 'Maria',
      lastName: 'Santos',
      address: 'Rua da Beira, 456',
      country: 'Moçambique',
      state: 'Sofala',
      zipCode: '2100'
    },
    orderNotes: 'Entregar de manhã'
  },
  {
    id: 'ORD-003',
    date: '2024-01-15',
    total: 1898,
    status: 'shipped',
    userId: 'user3',
    user: mockUsers[0], // Using user1 for this order
    items: [
      {
        product: {
          id: '5',
          name: 'Maçãs Fuji Orgânicas',
          price: 999,
          originalPrice: 1299,
          image: 'https://images.pexels.com/photos/102104/pexels-photo-102104.jpeg',
          description: 'Maçãs Fuji orgânicas doces',
          category: 'Frutas',
          brand: 'Pomar Orgânico',
          rating: 4.6,
          reviews: 203,
          inStock: true,
          sellerId: 'seller3',
          sellerName: 'Pomar Orgânico',
          sellerLogo: 'https://placehold.co/40x40/4ade80/ffffff?text=PO',
          tags: ['orgânico', 'doce', 'suculenta'],
          sku: 'MAC-FUJ-001',
          weight: '1kg',
          color: 'Vermelho',
          stockStatus: 'Em estoque',
          type: 'Fruta'
        },
        quantity: 1
      },
      {
        product: {
          id: '6',
          name: 'Bananas Prata Orgânicas',
          price: 750,
          image: 'https://images.pexels.com/photos/47305/bananas-banana-bunch-fruit-yellow-47305.jpeg',
          description: 'Bananas prata orgânicas',
          category: 'Frutas',
          brand: 'Fazenda Verde',
          rating: 4.4,
          reviews: 167,
          inStock: true,
          sellerId: 'seller1',
          sellerName: 'Fazenda Verde',
          sellerLogo: 'https://placehold.co/40x40/4ade80/ffffff?text=FV',
          tags: ['orgânico', 'potássio', 'energia'],
          sku: 'BAN-PRA-001',
          weight: '1kg',
          color: 'Amarelo',
          stockStatus: 'Em estoque',
          type: 'Fruta'
        },
        quantity: 1
      }
    ],
    billingAddress: {
      firstName: 'Ana',
      lastName: 'Costa',
      address: 'Avenida Samora Machel, 789',
      country: 'Moçambique',
      state: 'Sofala',
      zipCode: '2100',
      email: 'ana@exemplo.com',
      phone: '+258 84 555 1234'
    },
    paymentMethod: 'Cartão de Débito',
    shippingAddress: {
      firstName: 'Ana',
      lastName: 'Costa',
      address: 'Avenida Samora Machel, 789',
      country: 'Moçambique',
      state: 'Sofala',
      zipCode: '2100'
    },
    orderNotes: 'Entregar no portão'
  },
  {
    id: 'ORD-004',
    date: '2024-01-12',
    total: 1425,
    status: 'delivered',
    userId: 'user1',
    user: mockUsers[0],
    items: [
      {
        product: {
          id: '7',
          name: 'Cebolas Roxas Orgânicas',
          price: 599,
          image: 'https://images.pexels.com/photos/144206/pexels-photo-144206.jpeg',
          description: 'Cebolas roxas orgânicas',
          category: 'Legumes',
          brand: 'Horta do Vale',
          rating: 4.1,
          reviews: 78,
          inStock: true,
          sellerId: 'seller2',
          sellerName: 'Horta do Vale',
          sellerLogo: 'https://placehold.co/40x40/4ade80/ffffff?text=HV',
          tags: ['orgânico', 'saboroso', 'nutritivo'],
          sku: 'CEB-ROX-001',
          weight: '300g',
          color: 'Roxo',
          stockStatus: 'Em estoque',
          type: 'Legume'
        },
        quantity: 2
      },
      {
        product: {
          id: '8',
          name: 'Batatas Doces Orgânicas',
          price: 899,
          image: 'https://images.pexels.com/photos/2286776/pexels-photo-2286776.jpeg',
          description: 'Batatas doces orgânicas',
          category: 'Legumes',
          brand: 'Fazenda Verde',
          rating: 4.5,
          reviews: 134,
          inStock: true,
          sellerId: 'seller1',
          sellerName: 'Fazenda Verde',
          sellerLogo: 'https://placehold.co/40x40/4ade80/ffffff?text=FV',
          tags: ['orgânico', 'fibras', 'vitaminas'],
          sku: 'BAT-DOC-001',
          weight: '1kg',
          color: 'Laranja',
          stockStatus: 'Em estoque',
          type: 'Legume'
        },
        quantity: 1
      }
    ],
    billingAddress: {
      firstName: 'João',
      lastName: 'Silva',
      address: 'Avenida 25 de Setembro, 123',
      country: 'Moçambique',
      state: 'Sofala',
      zipCode: '2100',
      email: 'joao@exemplo.com',
      phone: '+258 84 123 4567'
    },
    paymentMethod: 'M-Pesa',
    shippingAddress: {
      firstName: 'João',
      lastName: 'Silva',
      address: 'Avenida 25 de Setembro, 123',
      country: 'Moçambique',
      state: 'Sofala',
      zipCode: '2100'
    },
    orderNotes: 'Entregar no fim de semana'
  }
];

// Mock agents for ticket system
const mockAgents: Agent[] = [
  {
    id: 'agent1',
    name: 'Maria Silva',
    email: 'maria@marketplace.com',
    role: 'admin',
    categories: [TicketCategory.PAYMENT_PROBLEM, TicketCategory.ORDER_ISSUE, TicketCategory.RETURN_REQUEST],
    maxTickets: 50,
    isActive: true,
    skills: ['Pagamentos', 'Pedidos', 'Devoluções']
  },
  {
    id: 'agent2',
    name: 'João Santos',
    email: 'joao@marketplace.com',
    role: 'support',
    categories: [TicketCategory.TECHNICAL_ISSUE, TicketCategory.ACCOUNT_ISSUE, TicketCategory.GENERAL_INQUIRY],
    maxTickets: 30,
    isActive: true,
    skills: ['Suporte Técnico', 'Contas', 'Geral']
  },
  {
    id: 'agent3',
    name: 'Ana Costa',
    email: 'ana@marketplace.com',
    role: 'moderator',
    categories: [TicketCategory.PRODUCT_ISSUE, TicketCategory.SHIPPING_PROBLEM, TicketCategory.BUG_REPORT],
    maxTickets: 25,
    isActive: true,
    skills: ['Produtos', 'Envio', 'Bugs']
  }
];

// Mock tickets
const mockTickets: Ticket[] = [
  {
    id: 'TICK-001',
    title: 'Problema com pagamento M-Pesa',
    description: 'Não consegui finalizar o pagamento usando M-Pesa. O sistema mostra erro de conexão.',
    category: TicketCategory.PAYMENT_PROBLEM,
    priority: TicketPriority.HIGH,
    status: TicketStatus.IN_PROGRESS,
    userId: 'user1',
    userType: 'buyer',
    assignedTo: 'agent1',
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T14:15:00Z',
    tags: ['pagamento', 'm-pesa', 'erro'],
    attachments: [],
    messages: [
      {
        id: 'msg1',
        ticketId: 'TICK-001',
        userId: 'user1',
        userType: 'buyer',
        message: 'Não consegui finalizar o pagamento usando M-Pesa. O sistema mostra erro de conexão.',
        createdAt: '2024-01-20T10:30:00Z',
        isInternal: false,
        attachments: []
      },
      {
        id: 'msg2',
        ticketId: 'TICK-001',
        userId: 'agent1',
        userType: 'admin',
        message: 'Olá! Vou verificar o problema com o M-Pesa. Pode me informar qual erro específico aparece na tela?',
        createdAt: '2024-01-20T11:00:00Z',
        isInternal: false,
        attachments: []
      },
      {
        id: 'msg3',
        ticketId: 'TICK-001',
        userId: 'user1',
        userType: 'buyer',
        message: 'Aparece "Erro de conexão. Tente novamente." quando clico em pagar.',
        createdAt: '2024-01-20T11:30:00Z',
        isInternal: false,
        attachments: []
      }
    ]
  },
  {
    id: 'TICK-002',
    title: 'Produto não chegou no prazo',
    description: 'Fiz um pedido há 5 dias e ainda não recebi. O status mostra "em trânsito" há 3 dias.',
    category: TicketCategory.SHIPPING_PROBLEM,
    priority: TicketPriority.MEDIUM,
    status: TicketStatus.WAITING_FOR_THIRD_PARTY,
    userId: 'user2',
    userType: 'buyer',
    assignedTo: 'agent3',
    createdAt: '2024-01-19T15:45:00Z',
    updatedAt: '2024-01-20T09:20:00Z',
    orderId: 'ORD-002',
    tags: ['envio', 'atraso', 'pedido'],
    messages: [
      {
        id: 'msg4',
        ticketId: 'TICK-002',
        userId: 'user2',
        userType: 'buyer',
        message: 'Fiz um pedido há 5 dias e ainda não recebi. O status mostra "em trânsito" há 3 dias.',
        createdAt: '2024-01-19T15:45:00Z',
        isInternal: false
      },
      {
        id: 'msg5',
        ticketId: 'TICK-002',
        userId: 'agent3',
        userType: 'admin',
        message: 'Vou verificar com a transportadora. Pode me informar o número do pedido?',
        createdAt: '2024-01-19T16:00:00Z',
        isInternal: false
      }
    ]
  },
  {
    id: 'TICK-003',
    title: 'Solicitação de devolução',
    description: 'Recebi o produto com defeito. Gostaria de solicitar uma devolução.',
    category: TicketCategory.RETURN_REQUEST,
    priority: TicketPriority.MEDIUM,
    status: TicketStatus.OPEN,
    userId: 'user1',
    userType: 'buyer',
    assignedTo: 'agent1',
    createdAt: '2024-01-20T16:00:00Z',
    updatedAt: '2024-01-20T16:00:00Z',
    orderId: 'ORD-001',
    tags: ['devolução', 'defeito'],
    messages: [
      {
        id: 'msg6',
        ticketId: 'TICK-003',
        userId: 'user1',
        userType: 'buyer',
        message: 'Recebi o produto com defeito. Gostaria de solicitar uma devolução.',
        createdAt: '2024-01-20T16:00:00Z',
        isInternal: false
      }
    ]
  }
];

// Helper functions for localStorage
const loadFromStorage = (key: string, defaultValue: any) => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToStorage = (key: string, value: any) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

// Load persisted data
const persistedCart = loadFromStorage('ecobazar_cart', []);
const persistedWishlist = loadFromStorage('ecobazar_wishlist', []);
const persistedUser = loadFromStorage('ecobazar_user', null);
const persistedAuth = loadFromStorage('ecobazar_authenticated', false);

const initialState: MarketplaceState = {
  products: mockProducts,
  cart: persistedCart,
  wishlist: persistedWishlist,
  user: persistedUser,
  orders: mockOrders,
  payouts: mockPayouts,
  blogPosts: mockBlogPosts,
  reviews: mockReviews,
  tickets: mockTickets,
  agents: mockAgents,
  isAuthenticated: persistedAuth,
  showNewsletterPopup: true,
  showCartPopup: false,
  quickViewProduct: null,
  currentPage: 'home'
};

function marketplaceReducer(state: MarketplaceState, action: MarketplaceAction): MarketplaceState {
  let newState: MarketplaceState;

  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.product.id === action.payload.product.id);
      if (existingItem) {
        newState = {
          ...state,
          cart: state.cart.map(item =>
            item.product.id === action.payload.product.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      } else {
        newState = {
          ...state,
          cart: [...state.cart, { product: action.payload.product, quantity: action.payload.quantity }],
        };
      }
      saveToStorage('ecobazar_cart', newState.cart);
      return newState;

    case 'REMOVE_FROM_CART':
      newState = {
        ...state,
        cart: state.cart.filter(item => item.product.id !== action.payload),
      };
      saveToStorage('ecobazar_cart', newState.cart);
      return newState;

    case 'UPDATE_CART_QUANTITY':
      newState = {
        ...state,
        cart: state.cart.map(item =>
          item.product.id === action.payload.productId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
      saveToStorage('ecobazar_cart', newState.cart);
      return newState;

    case 'CLEAR_CART':
      newState = {
        ...state,
        cart: [],
      };
      saveToStorage('ecobazar_cart', newState.cart);
      return newState;

    case 'ADD_TO_WISHLIST':
      if (state.wishlist.find(item => item.id === action.payload.id)) {
        return state;
      }
      newState = {
        ...state,
        wishlist: [...state.wishlist, action.payload],
      };
      saveToStorage('ecobazar_wishlist', newState.wishlist);
      return newState;

    case 'REMOVE_FROM_WISHLIST':
      newState = {
        ...state,
        wishlist: state.wishlist.filter(item => item.id !== action.payload),
      };
      saveToStorage('ecobazar_wishlist', newState.wishlist);
      return newState;

    case 'SET_USER':
      newState = {
        ...state,
        user: action.payload,
      };
      saveToStorage('ecobazar_user', newState.user);
      return newState;

    case 'SET_AUTHENTICATED':
      newState = {
        ...state,
        isAuthenticated: action.payload,
      };
      saveToStorage('ecobazar_authenticated', newState.isAuthenticated);
      return newState;

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

    case 'ADD_TICKET':
      return {
        ...state,
        tickets: [...state.tickets, action.payload],
      };

    case 'UPDATE_TICKET':
      return {
        ...state,
        tickets: state.tickets.map(ticket =>
          ticket.id === action.payload.id ? action.payload : ticket
        ),
      };

    case 'DELETE_TICKET':
      return {
        ...state,
        tickets: state.tickets.filter(ticket => ticket.id !== action.payload),
      };

    case 'ADD_BLOG_POST':
      return {
        ...state,
        blogPosts: [...state.blogPosts, action.payload],
      };

    case 'UPDATE_BLOG_POST':
      return {
        ...state,
        blogPosts: state.blogPosts.map(post =>
          post.id === action.payload.id ? action.payload : post
        ),
      };

    case 'DELETE_BLOG_POST':
      return {
        ...state,
        blogPosts: state.blogPosts.filter(post => post.id !== action.payload),
      };

    default:
      return state;
  }
}

const MarketplaceContext = createContext<{
  state: MarketplaceState;
  dispatch: React.Dispatch<MarketplaceAction>;
} | null>(null);

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