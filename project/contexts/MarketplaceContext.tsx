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
  | { type: 'DELETE_TICKET'; payload: string };

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Smartphone Samsung Galaxy A54',
    price: 45000,
    originalPrice: 52000,
    image: 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg',
    description: 'Smartphone Samsung Galaxy A54 128GB, 8GB RAM, Tela 6.4", Câmera Tripla 50MP, Android 13.',
    category: 'Eletrônicos',
    brand: 'Samsung',
    rating: 4.5,
    reviews: 127,
    inStock: true,
    sellerId: 'seller1',
    sellerName: 'TechStore',
    sellerLogo: 'https://placehold.co/40x40/2563EB/ffffff?text=TS',
    tags: ['smartphone', 'samsung', 'android', 'câmera'],
    sku: 'SAMS-A54-001',
    weight: '202g',
    color: 'Preto',
    stockStatus: 'Em estoque',
    type: 'Smartphone',
    images: [
      'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg',
      'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg'
    ]
  },
  {
    id: '2',
    name: 'Fone de Ouvido Bluetooth JBL',
    price: 850,
    originalPrice: 1200,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
    description: 'Fone de ouvido Bluetooth JBL com cancelamento de ruído, bateria de 20h, resistente à água.',
    category: 'Eletrônicos',
    brand: 'JBL',
    rating: 4.3,
    reviews: 89,
    inStock: true,
    sellerId: 'seller2',
    sellerName: 'AudioPro',
    sellerLogo: 'https://placehold.co/40x40/2563EB/ffffff?text=AP',
    tags: ['bluetooth', 'jbl', 'sem fio', 'cancelamento de ruído'],
    sku: 'JBL-BT-001',
    weight: '250g',
    color: 'Azul',
    stockStatus: 'Em estoque',
    type: 'Fone de Ouvido'
  },
  {
    id: '3',
    name: 'Tênis Nike Air Max',
    price: 2500,
    originalPrice: 3200,
    image: 'https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg',
    description: 'Tênis Nike Air Max para corrida, tecnologia Air Max, solado de borracha, confortável e durável.',
    category: 'Esportes',
    brand: 'Nike',
    rating: 4.7,
    reviews: 156,
    inStock: true,
    sellerId: 'seller3',
    sellerName: 'SportStore',
    sellerLogo: 'https://placehold.co/40x40/2563EB/ffffff?text=SS',
    tags: ['nike', 'corrida', 'esporte', 'confortável'],
    sku: 'NIKE-AM-001',
    weight: '300g',
    color: 'Branco',
    stockStatus: 'Em estoque',
    type: 'Tênis'
  },
  {
    id: '4',
    name: 'Bolsa Feminina de Couro',
    price: 1200,
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg',
    description: 'Bolsa feminina de couro genuíno, múltiplos compartimentos, alça ajustável, elegante e prática.',
    category: 'Moda',
    brand: 'FashionBrand',
    rating: 4.4,
    reviews: 92,
    inStock: true,
    sellerId: 'seller1',
    sellerName: 'TechStore',
    sellerLogo: 'https://placehold.co/40x40/2563EB/ffffff?text=TS',
    tags: ['couro', 'feminina', 'elegante', 'prática'],
    sku: 'BOL-COU-001',
    weight: '500g',
    color: 'Marrom',
    stockStatus: 'Em estoque',
    type: 'Bolsa'
  },
  {
    id: '5',
    name: 'Relógio Smartwatch Xiaomi',
    price: 1800,
    originalPrice: 2200,
    image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
    description: 'Smartwatch Xiaomi com monitor cardíaco, GPS, resistente à água, bateria de 14 dias.',
    category: 'Eletrônicos',
    brand: 'Xiaomi',
    rating: 4.6,
    reviews: 203,
    inStock: true,
    sellerId: 'seller2',
    sellerName: 'AudioPro',
    sellerLogo: 'https://placehold.co/40x40/2563EB/ffffff?text=AP',
    tags: ['smartwatch', 'xiaomi', 'monitor cardíaco', 'gps'],
    sku: 'XIA-SW-001',
    weight: '35g',
    color: 'Preto',
    stockStatus: 'Em estoque',
    type: 'Smartwatch'
  },
  {
    id: '6',
    name: 'Camiseta Básica Algodão',
    price: 350,
    image: 'https://images.pexels.com/photos/991509/pexels-photo-991509.jpeg',
    description: 'Camiseta básica 100% algodão, confortável, respirabilidade natural, disponível em várias cores.',
    category: 'Moda',
    brand: 'BasicWear',
    rating: 4.2,
    reviews: 167,
    inStock: true,
    sellerId: 'seller3',
    sellerName: 'SportStore',
    sellerLogo: 'https://placehold.co/40x40/2563EB/ffffff?text=SS',
    tags: ['algodão', 'básica', 'confortável', 'respirável'],
    sku: 'CAM-BAS-001',
    weight: '150g',
    color: 'Branco',
    stockStatus: 'Em estoque',
    type: 'Camiseta'
  },
  {
    id: '7',
    name: 'Livro "O Poder do Hábito"',
    price: 450,
    image: 'https://images.pexels.com/photos/3747468/pexels-photo-3747468.jpeg',
    description: 'Livro "O Poder do Hábito" de Charles Duhigg, edição em português, capa dura.',
    category: 'Livros',
    brand: 'Editora',
    rating: 4.8,
    reviews: 78,
    inStock: true,
    sellerId: 'seller4',
    sellerName: 'BookStore',
    sellerLogo: 'https://placehold.co/40x40/2563EB/ffffff?text=BS',
    tags: ['livro', 'desenvolvimento pessoal', 'hábitos', 'português'],
    sku: 'LIV-POD-001',
    weight: '400g',
    color: 'Azul',
    stockStatus: 'Em estoque',
    type: 'Livro'
  },
  {
    id: '8',
    name: 'Kit de Maquiagem Profissional',
    price: 890,
    originalPrice: 1200,
    image: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg',
    description: 'Kit completo de maquiagem profissional com 24 cores, pincéis incluídos, paleta versátil.',
    category: 'Beleza',
    brand: 'BeautyPro',
    rating: 4.5,
    reviews: 134,
    inStock: true,
    sellerId: 'seller1',
    sellerName: 'TechStore',
    sellerLogo: 'https://placehold.co/40x40/2563EB/ffffff?text=TS',
    tags: ['maquiagem', 'profissional', '24 cores', 'pincéis'],
    sku: 'MAQ-KIT-001',
    weight: '300g',
    color: 'Multicolor',
    stockStatus: 'Em estoque',
    type: 'Maquiagem'
  },
  {
    id: '9',
    name: 'Bicicleta Mountain Bike',
    price: 8500,
    originalPrice: 12000,
    image: 'https://images.pexels.com/photos/2158963/pexels-photo-2158963.jpeg',
    description: 'Bicicleta Mountain Bike 21 marchas, quadro de aço, suspensão dianteira, ideal para trilhas.',
    category: 'Esportes',
    brand: 'BikePro',
    rating: 4.6,
    reviews: 67,
    inStock: true,
    sellerId: 'seller3',
    sellerName: 'SportStore',
    sellerLogo: 'https://placehold.co/40x40/2563EB/ffffff?text=SS',
    tags: ['bicicleta', 'mountain bike', '21 marchas', 'suspensão'],
    sku: 'BIC-MTB-001',
    weight: '15kg',
    color: 'Vermelho',
    stockStatus: 'Em estoque',
    type: 'Bicicleta'
  },
  {
    id: '10',
    name: 'Câmera DSLR Canon EOS',
    price: 15000,
    originalPrice: 18000,
    image: 'https://images.pexels.com/photos/51383/photo-camera-subject-photographer-51383.jpeg',
    description: 'Câmera DSLR Canon EOS Rebel T7, 24.1MP, Full HD, Wi-Fi, ideal para fotografia profissional.',
    category: 'Eletrônicos',
    brand: 'Canon',
    rating: 4.9,
    reviews: 89,
    inStock: true,
    sellerId: 'seller2',
    sellerName: 'AudioPro',
    sellerLogo: 'https://placehold.co/40x40/2563EB/ffffff?text=AP',
    tags: ['câmera', 'canon', 'dslr', 'profissional'],
    sku: 'CAN-EOS-001',
    weight: '475g',
    color: 'Preto',
    stockStatus: 'Em estoque',
    type: 'Câmera'
  },
  {
    id: '11',
    name: 'Perfume Masculino Importado',
    price: 1200,
    originalPrice: 1800,
    image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg',
    description: 'Perfume masculino importado, fragrância amadeirada, duração de 8 horas, elegante e sofisticado.',
    category: 'Beleza',
    brand: 'LuxuryScents',
    rating: 4.4,
    reviews: 112,
    inStock: true,
    sellerId: 'seller4',
    sellerName: 'BookStore',
    sellerLogo: 'https://placehold.co/40x40/2563EB/ffffff?text=BS',
    tags: ['perfume', 'masculino', 'importado', 'amadeirado'],
    sku: 'PER-MAS-001',
    weight: '100ml',
    color: 'Transparente',
    stockStatus: 'Em estoque',
    type: 'Perfume'
  },
  {
    id: '12',
    name: 'Jogo de Panelas Antiaderente',
    price: 1800,
    originalPrice: 2500,
    image: 'https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg',
    description: 'Jogo de panelas antiaderente 5 peças, cabo ergonômico, base reforçada, ideal para cozinha.',
    category: 'Casa',
    brand: 'KitchenPro',
    rating: 4.7,
    reviews: 156,
    inStock: true,
    sellerId: 'seller1',
    sellerName: 'TechStore',
    sellerLogo: 'https://placehold.co/40x40/2563EB/ffffff?text=TS',
    tags: ['panelas', 'antiaderente', '5 peças', 'cozinha'],
    sku: 'PAN-JOG-001',
    weight: '2.5kg',
    color: 'Preto',
    stockStatus: 'Em estoque',
    type: 'Utensílios'
  }
];

const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Como Escolher o Smartphone Ideal para Você',
    excerpt: 'Descubra os fatores mais importantes na hora de escolher seu próximo smartphone e faça a melhor escolha.',
    content: 'Conteúdo completo sobre como escolher smartphones...',
    image: 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg',
    date: '2024-01-15',
    author: 'Tech Expert',
    category: 'Tecnologia',
    tags: ['smartphone', 'tecnologia', 'dicas']
  },
  {
    id: '2',
    title: 'Guia Completo de Moda Sustentável',
    excerpt: 'Aprenda como fazer escolhas mais conscientes na moda e contribuir para um futuro mais sustentável.',
    content: 'Guia completo sobre moda sustentável...',
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg',
    date: '2024-01-10',
    author: 'Fashion Blogger',
    category: 'Moda',
    tags: ['moda', 'sustentável', 'consciência']
  },
  {
    id: '3',
    title: 'Dicas para Economizar nas Compras Online',
    excerpt: 'Aprenda estratégias inteligentes para economizar dinheiro em suas compras online.',
    content: 'Coleção de dicas para economizar...',
    image: 'https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg',
    date: '2024-01-05',
    author: 'Finance Expert',
    category: 'Finanças',
    tags: ['economia', 'compras', 'online']
  },
  {
    id: '4',
    title: 'Os Melhores Presentes para Cada Ocasião',
    excerpt: 'Descubra ideias criativas e personalizadas para presentear seus entes queridos em qualquer ocasião.',
    content: 'Guia de presentes para diferentes ocasiões...',
    image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg',
    date: '2023-12-28',
    author: 'Gift Expert',
    category: 'Lifestyle',
    tags: ['presentes', 'ocasiões', 'criatividade']
  },
  {
    id: '5',
    title: 'Como Organizar sua Casa com Produtos Inteligentes',
    excerpt: 'Descubra produtos inovadores que podem transformar sua casa em um espaço mais organizado e funcional.',
    content: 'Guia para organização com produtos inteligentes...',
    image: 'https://images.pexels.com/photos/2641886/pexels-photo-2641886.jpeg',
    date: '2023-12-20',
    author: 'Home Organizer',
    category: 'Casa',
    tags: ['organização', 'casa', 'produtos']
  },
  {
    id: '6',
    title: 'Tendências de Tecnologia para 2024',
    excerpt: 'Fique por dentro das principais tendências tecnológicas que vão dominar o mercado em 2024.',
    content: 'Análise das tendências tecnológicas...',
    image: 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg',
    date: '2023-12-15',
    author: 'Tech Analyst',
    category: 'Tecnologia',
    tags: ['tendências', 'tecnologia', '2024']
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
    comment: 'Smartphone excelente! Câmera incrível e bateria dura o dia todo.',
    date: '2024-01-10'
  },
  {
    id: '2',
    productId: '1',
    userId: 'user2',
    userName: 'João Santos',
    userImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    rating: 4,
    comment: 'Ótimo custo-benefício, recomendo!',
    date: '2024-01-08'
  },
  {
    id: '3',
    productId: '2',
    userId: 'user3',
    userName: 'Ana Costa',
    userImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    rating: 5,
    comment: 'Fone de ouvido muito bom, som cristalino!',
    date: '2024-01-12'
  },
  {
    id: '4',
    productId: '3',
    userId: 'user4',
    userName: 'Carlos Oliveira',
    userImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    rating: 4,
    comment: 'Tênis confortável e durável, perfeito para corrida.',
    date: '2024-01-09'
  },
  {
    id: '5',
    productId: '5',
    userId: 'user5',
    userName: 'Lucia Ferreira',
    userImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    rating: 5,
    comment: 'Smartwatch incrível! Monitor cardíaco muito preciso.',
    date: '2024-01-11'
  },
  {
    id: '6',
    productId: '8',
    userId: 'user6',
    userName: 'Pedro Lima',
    userImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    rating: 4,
    comment: 'Kit de maquiagem completo e de boa qualidade.',
    date: '2024-01-07'
  },
  {
    id: '7',
    productId: '10',
    userId: 'user7',
    userName: 'Fernanda Costa',
    userImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    rating: 5,
    comment: 'Câmera profissional incrível! Fotos de alta qualidade.',
    date: '2024-01-13'
  },
  {
    id: '8',
    productId: '12',
    userId: 'user8',
    userName: 'Roberto Silva',
    userImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    rating: 4,
    comment: 'Panelas de excelente qualidade, antiaderente perfeito.',
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
    phone: '(+258) 99999-9999',
    isSeller: false,
    role: 'buyer',
    sellerId: undefined,
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    billingAddress: {
      firstName: 'João',
      lastName: 'Silva',
      address: 'Rua das Flores, 123',
      country: 'Brasil',
      state: 'Sofala',
      zipCode: '01234-567',
      email: 'cliente@exemplo.com',
      phone: '(+258) 99999-9999'
    }
  },
  {
    id: 'user2',
    firstName: 'Maria',
    lastName: 'Santos',
    email: 'maria@exemplo.com',
    phone: '(+258) 88888-8888',
    isSeller: false,
    role: 'buyer',
    sellerId: undefined,
    profileImage: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg',
    billingAddress: {
      firstName: 'Maria',
      lastName: 'Santos',
      address: 'Avenida Principal, 456',
      country: 'Brasil',
      state: 'Sofala',
      zipCode: '04567-890',
      email: 'maria@exemplo.com',
      phone: '(+258) 88888-8888'
    }
  }
];

const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    date: '2024-01-20',
    total: 46850,
    status: 'delivered',
    userId: 'user1',
    user: mockUsers[0],
    items: [
      {
        product: {
          id: '1',
          name: 'Smartphone Samsung Galaxy A54',
          price: 45000,
          originalPrice: 52000,
          image: 'https://images.pexels.com/photos/1647976/pexels-photo-1647976.jpeg',
          description: 'Smartphone Samsung Galaxy A54 128GB, 8GB RAM, Tela 6.4", Câmera Tripla 50MP, Android 13.',
          category: 'Eletrônicos',
          brand: 'Samsung',
          rating: 4.5,
          reviews: 127,
          inStock: true,
          sellerId: 'seller1',
          sellerName: 'TechStore',
          sellerLogo: 'https://placehold.co/40x40/2563EB/ffffff?text=TS',
          tags: ['smartphone', 'samsung', 'android', 'câmera'],
          sku: 'SAMS-A54-001',
          weight: '202g',
          color: 'Preto',
          stockStatus: 'Em estoque',
          type: 'Smartphone'
        },
        quantity: 1
      },
      {
        product: {
          id: '2',
          name: 'Fone de Ouvido Bluetooth JBL',
          price: 850,
          originalPrice: 1200,
          image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
          description: 'Fone de ouvido Bluetooth JBL com cancelamento de ruído, bateria de 20h, resistente à água.',
          category: 'Eletrônicos',
          brand: 'JBL',
          rating: 4.3,
          reviews: 89,
          inStock: true,
          sellerId: 'seller2',
          sellerName: 'AudioPro',
          sellerLogo: 'https://placehold.co/40x40/2563EB/ffffff?text=AP',
          tags: ['bluetooth', 'jbl', 'sem fio', 'cancelamento de ruído'],
          sku: 'JBL-BT-001',
          weight: '250g',
          color: 'Azul',
          stockStatus: 'Em estoque',
          type: 'Fone de Ouvido'
        },
        quantity: 2
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
      description: 'O smartphone chegou com a tela riscada.',
      status: 'pending',
      createdAt: '2024-01-22T10:30:00Z',
      userId: 'user1'
    }
  },
  {
    id: 'ORD-002',
    date: '2024-01-18',
    total: 2850,
    status: 'processing',
    userId: 'user2',
    user: mockUsers[1],
    items: [
      {
        product: {
          id: '3',
          name: 'Tênis Nike Air Max',
          price: 2500,
          originalPrice: 3200,
          image: 'https://images.pexels.com/photos/2526878/pexels-photo-2526878.jpeg',
          description: 'Tênis Nike Air Max para corrida, tecnologia Air Max, solado de borracha, confortável e durável.',
          category: 'Esportes',
          brand: 'Nike',
          rating: 4.7,
          reviews: 156,
          inStock: true,
          sellerId: 'seller3',
          sellerName: 'SportStore',
          sellerLogo: 'https://placehold.co/40x40/2563EB/ffffff?text=SS',
          tags: ['nike', 'corrida', 'esporte', 'confortável'],
          sku: 'NIKE-AM-001',
          weight: '300g',
          color: 'Branco',
          stockStatus: 'Em estoque',
          type: 'Tênis'
        },
        quantity: 1
      },
      {
        product: {
          id: '6',
          name: 'Camiseta Básica Algodão',
          price: 350,
          image: 'https://images.pexels.com/photos/991509/pexels-photo-991509.jpeg',
          description: 'Camiseta básica 100% algodão, confortável, respirabilidade natural, disponível em várias cores.',
          category: 'Moda',
          brand: 'BasicWear',
          rating: 4.2,
          reviews: 167,
          inStock: true,
          sellerId: 'seller3',
          sellerName: 'SportStore',
          sellerLogo: 'https://placehold.co/40x40/2563EB/ffffff?text=SS',
          tags: ['algodão', 'básica', 'confortável', 'respirável'],
          sku: 'CAM-BAS-001',
          weight: '150g',
          color: 'Branco',
          stockStatus: 'Em estoque',
          type: 'Camiseta'
        },
        quantity: 1
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
    total: 1800,
    status: 'shipped',
    userId: 'user3',
    user: mockUsers[0], // Using user1 for this order
    items: [
      {
        product: {
          id: '5',
          name: 'Relógio Smartwatch Xiaomi',
          price: 1800,
          originalPrice: 2200,
          image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg',
          description: 'Smartwatch Xiaomi com monitor cardíaco, GPS, resistente à água, bateria de 14 dias.',
          category: 'Eletrônicos',
          brand: 'Xiaomi',
          rating: 4.6,
          reviews: 203,
          inStock: true,
          sellerId: 'seller2',
          sellerName: 'AudioPro',
          sellerLogo: 'https://placehold.co/40x40/2563EB/ffffff?text=AP',
          tags: ['smartwatch', 'xiaomi', 'monitor cardíaco', 'gps'],
          sku: 'XIA-SW-001',
          weight: '35g',
          color: 'Preto',
          stockStatus: 'Em estoque',
          type: 'Smartwatch'
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
    total: 890,
    status: 'delivered',
    userId: 'user1',
    user: mockUsers[0],
    items: [
      {
        product: {
          id: '8',
          name: 'Kit de Maquiagem Profissional',
          price: 890,
          originalPrice: 1200,
          image: 'https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg',
          description: 'Kit completo de maquiagem profissional com 24 cores, pincéis incluídos, paleta versátil.',
          category: 'Beleza',
          brand: 'BeautyPro',
          rating: 4.5,
          reviews: 134,
          inStock: true,
          sellerId: 'seller1',
          sellerName: 'TechStore',
          sellerLogo: 'https://placehold.co/40x40/2563EB/ffffff?text=TS',
          tags: ['maquiagem', 'profissional', '24 cores', 'pincéis'],
          sku: 'MAQ-KIT-001',
          weight: '300g',
          color: 'Multicolor',
          stockStatus: 'Em estoque',
          type: 'Maquiagem'
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
const persistedCart = loadFromStorage('vitrine_cart', []);
const persistedWishlist = loadFromStorage('vitrine_wishlist', []);
const persistedUser = loadFromStorage('vitrine_user', null);
const persistedAuth = loadFromStorage('vitrine_authenticated', false);

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
      saveToStorage('vitrine_cart', newState.cart);
      return newState;

    case 'REMOVE_FROM_CART':
      newState = {
        ...state,
        cart: state.cart.filter(item => item.product.id !== action.payload),
      };
      saveToStorage('vitrine_cart', newState.cart);
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
      saveToStorage('vitrine_cart', newState.cart);
      return newState;

    case 'CLEAR_CART':
      newState = {
        ...state,
        cart: [],
      };
      saveToStorage('vitrine_cart', newState.cart);
      return newState;

    case 'ADD_TO_WISHLIST':
      if (state.wishlist.find(item => item.id === action.payload.id)) {
        return state;
      }
      newState = {
        ...state,
        wishlist: [...state.wishlist, action.payload],
      };
      saveToStorage('vitrine_wishlist', newState.wishlist);
      return newState;

    case 'REMOVE_FROM_WISHLIST':
      newState = {
        ...state,
        wishlist: state.wishlist.filter(item => item.id !== action.payload),
      };
      saveToStorage('vitrine_wishlist', newState.wishlist);
      return newState;

    case 'SET_USER':
      newState = {
        ...state,
        user: action.payload,
      };
      saveToStorage('vitrine_user', newState.user);
      return newState;

    case 'SET_AUTHENTICATED':
      newState = {
        ...state,
        isAuthenticated: action.payload,
      };
      saveToStorage('vitrine_authenticated', newState.isAuthenticated);
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