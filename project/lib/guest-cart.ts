const KEY = 'vitrine_guest_cart';
const MAX_ITEMS = 50;

export interface GuestCartItem {
  productId: string;
  quantity: number;
  name?: string;
  price?: number;
  primaryImage?: string;
}

function load(): GuestCartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.slice(0, MAX_ITEMS) : [];
  } catch {
    return [];
  }
}

function save(items: GuestCartItem[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
  } catch {}
}

export function getGuestCart(): GuestCartItem[] {
  return load();
}

export function addToGuestCart(item: GuestCartItem): GuestCartItem[] {
  const items = load();
  const i = items.findIndex((x) => x.productId === item.productId);
  if (i >= 0) {
    items[i].quantity += item.quantity;
  } else {
    items.push({ ...item });
  }
  save(items);
  return items;
}

export function updateGuestCartItem(productId: string, quantity: number): GuestCartItem[] {
  const items = load();
  const i = items.findIndex((x) => x.productId === productId);
  if (i < 0) return items;
  if (quantity <= 0) {
    items.splice(i, 1);
  } else {
    items[i].quantity = quantity;
  }
  save(items);
  return items;
}

export function removeFromGuestCart(productId: string): GuestCartItem[] {
  const items = load().filter((x) => x.productId !== productId);
  save(items);
  return items;
}

export function clearGuestCart(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEY);
}

/** Build a Cart-like object for UI (items with product shape, totalItems, totalPrice) */
export function guestCartToCartShape(items: GuestCartItem[]): {
  items: Array<{ _id: string; product: { _id: string; name?: string; price?: number; primaryImage?: string }; quantity: number; addedAt: string }>;
  totalItems: number;
  totalPrice: number;
} {
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + (i.price ?? 0) * i.quantity, 0);
  return {
    items: items.map((i) => ({
      _id: `guest-${i.productId}`,
      product: { _id: i.productId, name: i.name, price: i.price, primaryImage: i.primaryImage },
      quantity: i.quantity,
      addedAt: new Date().toISOString(),
    })),
    totalItems,
    totalPrice,
  };
}
