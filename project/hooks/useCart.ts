import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Cart, CartItem } from '@/types/api';
import { useAuth } from '@/contexts/AuthContext';
import {
  getGuestCart,
  addToGuestCart,
  updateGuestCartItem,
  removeFromGuestCart,
  guestCartToCartShape,
  type GuestCartItem,
} from '@/lib/guest-cart';

type RawCart = Cart | ReturnType<typeof guestCartToCartShape> | {
  items?: any[];
  totalItems?: number;
  totalPrice?: number;
  summary?: { itemCount?: number; subtotal?: number };
  _id?: string;
  user?: string;
  createdAt?: string;
  updatedAt?: string;
};

function normalizeItem(item: any): CartItem {
  const product = item.product ?? item.productId ?? {};
  const productObj = typeof product === 'object' ? product : { _id: product };
  const price = productObj.price ?? item.unitPrice ?? item.price ?? 0;
  return {
    _id: item._id ?? `item-${productObj._id ?? ''}`,
    product: {
      _id: productObj._id ?? item.productId ?? '',
      name: productObj.name,
      price,
      primaryImage: productObj.primaryImage,
      sellerName: productObj.sellerName,
    } as any,
    quantity: Number(item.quantity) || 0,
    addedAt: item.addedAt ?? new Date().toISOString(),
  };
}

function normalizeCart(cart: RawCart | null | undefined): Cart {
  const items: CartItem[] = (cart?.items ?? []).map(normalizeItem).filter((i) => i.quantity > 0);
  const summary = (cart as any)?.summary;
  const totalItems =
    cart?.totalItems ?? summary?.itemCount ?? items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice =
    cart?.totalPrice ?? summary?.subtotal ?? items.reduce((s, i) => s + (i.product?.price ?? 0) * i.quantity, 0);
  return {
    _id: (cart as Cart)?._id ?? 'guest',
    user: (cart as Cart)?.user ?? '',
    items,
    totalItems: Number(totalItems) || 0,
    totalPrice: Number(totalPrice) || 0,
    createdAt: (cart as Cart)?.createdAt ?? new Date().toISOString(),
    updatedAt: (cart as Cart)?.updatedAt ?? new Date().toISOString(),
  };
}

export const useCart = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['cart', isAuthenticated ? 'user' : 'guest'],
    queryFn: async (): Promise<Cart> => {
      if (isAuthenticated) {
        const response = await apiClient.get('/cart');
        const data = response.data?.data ?? response.data;
        const cartPayload = (data as any)?.cart ?? data;
        return normalizeCart(cartPayload);
      }
      const items = getGuestCart();
      return normalizeCart(guestCartToCartShape(items));
    },
    enabled: true,
  });
};

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: async ({
      productId,
      quantity,
      productSnapshot,
    }: {
      productId: string;
      quantity: number;
      productSnapshot?: { name?: string; price?: number; primaryImage?: string };
    }) => {
      if (isAuthenticated) {
        const response = await apiClient.post('/cart/add', { productId, quantity });
        const cart = response.data?.data?.cart ?? response.data?.cart;
        return normalizeCart(cart as Cart);
      }
      const item: GuestCartItem = {
        productId,
        quantity,
        name: productSnapshot?.name,
        price: productSnapshot?.price,
        primaryImage: productSnapshot?.primaryImage,
      };
      addToGuestCart(item);
      return normalizeCart(guestCartToCartShape(getGuestCart()));
    },
    onSuccess: (_, __, ctx) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      if (isAuthenticated) {
        const response = await apiClient.put('/cart/update', { productId, quantity });
        const cart = response.data?.data?.cart ?? response.data?.cart;
        return normalizeCart(cart as Cart);
      }
      updateGuestCartItem(productId, quantity);
      return normalizeCart(guestCartToCartShape(getGuestCart()));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: async (productId: string) => {
      if (isAuthenticated) {
        const response = await apiClient.delete('/cart/remove', { data: { productId } });
        const cart = response.data?.data?.cart ?? response.data?.cart;
        return normalizeCart(cart as Cart);
      }
      removeFromGuestCart(productId);
      return normalizeCart(guestCartToCartShape(getGuestCart()));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: async () => {
      if (isAuthenticated) {
        const response = await apiClient.delete('/cart/clear');
        const cart = response.data?.data?.cart ?? response.data?.cart;
        return normalizeCart(cart as Cart);
      }
      const { clearGuestCart } = await import('@/lib/guest-cart');
      clearGuestCart();
      return normalizeCart(guestCartToCartShape([]));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};
