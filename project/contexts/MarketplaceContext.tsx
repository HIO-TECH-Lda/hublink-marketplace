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
}

interface MarketplaceState {
  products: Product[];
  cart: CartItem[];
  wishlist: Product[];
  user: User | null;
  orders: Order[];
  isAuthenticated: boolean;
  showNewsletterPopup: boolean;
  showCartPopup: boolean;
  quickViewProduct: Product | null;
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
  | { type: 'ADD_ORDER'; payload: Order };

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
    description: 'Repolho chinês orgânico fresquinho, cultivado sem agrotóxicos.',
    category: 'Verduras',
    brand: 'Orgânicos da Terra',
    rating: 4.5,
    reviews: 28,
    inStock: true,
    sellerId: 'seller1',
    sellerName: 'Fazenda Verde',
    sellerLogo: 'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg',
    tags: ['orgânico', 'fresco', 'local'],
    sku: 'VEG001'
  },
  {
    id: '2',
    name: 'Tomates Orgânicos',
    price: 8.50,
    image: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg',
    description: 'Tomates orgânicos maduros e suculentos.',
    category: 'Legumes',
    brand: 'Orgânicos da Terra',
    rating: 4.7,
    reviews: 42,
    inStock: true,
    sellerId: 'seller1',
    sellerName: 'Fazenda Verde',
    tags: ['orgânico', 'fresco'],
    sku: 'VEG002'
  },
  {
    id: '3',
    name: 'Cenouras Orgânicas',
    price: 6.99,
    originalPrice: 8.99,
    image: 'https://images.pexels.com/photos/1458622/pexels-photo-1458622.jpeg',
    description: 'Cenouras orgânicas doces e crocantes.',
    category: 'Legumes',
    brand: 'Horta Natural',
    rating: 4.3,
    reviews: 31,
    inStock: true,
    sellerId: 'seller2',
    sellerName: 'Horta do Vale',
    tags: ['orgânico', 'doce'],
    sku: 'VEG003'
  },
  {
    id: '4',
    name: 'Alface Orgânica',
    price: 4.99,
    image: 'https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg',
    description: 'Alface orgânica crocante e fresca.',
    category: 'Verduras',
    brand: 'Verde Natural',
    rating: 4.6,
    reviews: 19,
    inStock: true,
    sellerId: 'seller2',
    sellerName: 'Horta do Vale',
    tags: ['orgânico', 'crocante'],
    sku: 'VEG004'
  }
];

const initialState: MarketplaceState = {
  products: mockProducts,
  cart: [],
  wishlist: [],
  user: null,
  orders: [],
  isAuthenticated: false,
  showNewsletterPopup: true,
  showCartPopup: false,
  quickViewProduct: null,
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