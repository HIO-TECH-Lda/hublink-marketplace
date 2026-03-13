# Guest cart (no-auth add to cart) – review and plan

## 1. Current state

### How cart works today
- **Source of truth**: Server only. All cart operations go through `hooks/useCart.ts` (GET/POST/PUT/DELETE `/cart`).
- **Auth gate**: `useCart()` has `enabled: isAuthenticated`. When not logged in:
  - Query does not run (no API call).
  - `cart` is `undefined` → badge count is 0, CartPopup/carrinho/checkout see empty cart.
- **Add to cart**: `useAddToCart()` always calls `POST /cart/add`. For guests this typically returns 401 → error toast, no item added.
- **UI**: Header (badge), CartPopup, ProductCard, `/carrinho`, `/checkout` all rely on `useCart()` and related API hooks. No guest path.

### Unused legacy
- **MarketplaceContext** has a full client-side cart (`state.cart`) with localStorage key `ecobazar_cart` and actions `ADD_TO_CART`, `REMOVE_FROM_CART`, etc. It is not used by the current cart UI; ProductCard and CartPopup use the API hooks only. We can either reuse this for guests or introduce a dedicated guest cart (see below).

---

## 2. Goals

- Allow **guests** to add to cart without logging in.
- **Persist** guest cart in **localStorage** (survives refresh/tab close).
- **Sync on login**: when the user logs in, merge guest cart into the server cart and then use server cart only.
- Keep a **single cart experience**: same UI (Header badge, CartPopup, carrinho, checkout) for both guest and logged-in users, with different data sources (local vs API).

---

## 3. Data model

### Server cart (existing)
- **Cart**: `{ _id, user, items: CartItem[], totalItems, totalPrice, createdAt, updatedAt }`
- **CartItem**: `{ _id, product: Product, quantity, addedAt }` (product can be populated).

### Guest cart (to introduce)
- Store a **minimal** shape in localStorage so we can sync later and display in UI:
  - `GuestCartItem`: `{ productId: string, quantity: number }`
  - Optional: `{ productId, quantity, name?, price?, primaryImage? }` for display without refetch (can be filled when adding from product card).
- **LocalStorage key**: e.g. `vitrine_guest_cart` (array of `GuestCartItem`). Avoid reusing `ecobazar_cart` if we want a clear separation from the legacy context cart.

---

## 4. Architecture options

### Option A – Guest cart inside existing hooks (recommended)
- **useCart()**:
  - If **authenticated**: keep current behavior (query key `['cart']`, fetch from API).
  - If **guest**: no API; read from localStorage and expose as a “virtual” cart (same shape as API cart as much as possible) so existing UI keeps working. Can use a small in-memory + localStorage state and a custom “query” that returns guest cart, or a dedicated `useGuestCart()` that returns `{ items, totalItems, totalPrice }` and have a thin `useCart()` wrapper that picks API vs guest based on `isAuthenticated`.
- **useAddToCart()**:
  - If **authenticated**: current behavior (POST `/cart/add`, then invalidate `['cart']`).
  - If **guest**: update localStorage (add/merge by productId), then update whatever feeds the cart UI (e.g. invalidate a guest-cart query or set state so Header/CartPopup re-render).
- **useUpdateCartItem()** / **useRemoveFromCart()**:
  - If **guest**: update/remove in localStorage and refresh guest cart.
- **Sync on login**: In `AuthContext` after successful login (or in a small effect when `user` becomes set and we have guest items), call the API for each guest item (e.g. `POST /cart/add` per item, or a future `POST /cart/sync` if backend supports it), then clear `vitrine_guest_cart` and invalidate `['cart']`.

**Pros**: One place for “current cart” (hooks); all existing consumers (Header, CartPopup, ProductCard, carrinho, checkout) can stay the same if we normalize the cart shape for guest.  
**Cons**: Slight complexity in `useCart()` to branch and optionally normalize guest data into something that looks like `Cart`.

### Option B – Reuse MarketplaceContext for guests
- When **not authenticated**: ProductCard dispatches `ADD_TO_CART` to context (and persist to a key like `vitrine_guest_cart`).
- Header: if guest, show `state.cart.length` from context; if logged in, show `useCart().data`.
- CartPopup / carrinho / checkout: when guest, read from context (and localStorage); when logged in, read from API.
- On login: same as above – sync guest context cart to server (e.g. loop and POST /cart/add), then clear context guest cart and optionally clear localStorage.

**Pros**: Reuses existing context and persistence.  
**Cons**: Two sources of truth (context for guest, API for auth); every component that shows cart must branch on auth and choose context vs API. More branching and risk of inconsistency.

**Recommendation**: Option A (guest cart handled inside cart hooks, single “cart” abstraction for UI).

---

## 5. Implementation plan (high level)

1. **Guest cart storage**
   - Define `GuestCartItem` and a small helper: `getGuestCart()`, `setGuestCart(items)` using `vitrine_guest_cart`.
   - Optional: when adding from product, store `productId`, `quantity`, and minimal product snapshot (name, price, image) for display without API.

2. **useCart()**
   - If authenticated: keep current `useQuery(['cart'], fetchFromApi, { enabled: true })`.
   - If not authenticated: either:
     - Return `useQuery(['cart', 'guest'], () => Promise.resolve(normalizeGuestCart(getGuestCart())), { enabled: true })`, or
     - Use a state + useEffect that reads from localStorage and builds a cart-like object so the rest of the app still sees `{ items, totalItems, totalPrice }`.
   - Goal: `cart` and `cartItemsCount` etc. work for both guest and logged-in users without each component checking auth.

3. **useAddToCart()**
   - If authenticated: current API mutation + invalidate `['cart']`.
   - If not authenticated: mutation fn that updates localStorage (add or increment by productId), then invalidate guest cart query / set state so UI updates; no API call.

4. **useUpdateCartItem() / useRemoveFromCart()**
   - Same pattern: when guest, update localStorage and refresh guest cart; when authenticated, call API and invalidate `['cart']`.

5. **Sync on login**
   - In `AuthContext`, after `setUser` (and tokens) on login:
     - Read `vitrine_guest_cart`.
     - If not empty: for each item, call `POST /cart/add` (or future sync endpoint), then clear `vitrine_guest_cart` and call `queryClient.removeQueries({ queryKey: ['cart'] })` and refetch so the next `useCart()` returns server data.
   - Ensure this runs only once per login (e.g. effect with `user` and a ref so we don’t sync on every render).

6. **UI**
   - **Header**: Already uses `useCart()`. Once useCart returns guest cart when not authenticated, badge count will show guest cart size.
   - **CartPopup**: Same; it uses `useCart()`, `useUpdateCartItem`, `useRemoveFromCart`. Branching inside hooks keeps CartPopup unchanged.
   - **ProductCard**: Uses `useAddToCart()`. No change needed if the mutation handles guest (writes to localStorage and refreshes cart).
   - **/carrinho**: Uses `useCart()` and update/remove hooks. No change if hooks handle guest.
   - **/checkout**: Uses `useCart()`. For guest checkout we have two sub-options:
     - **A)** Require login before checkout: if guest and cart has items, redirect to login with returnUrl=/checkout; after login, sync runs then redirect to checkout (server cart now has items).
     - **B)** Allow true guest checkout (collect email/address, no account). That’s a larger product decision and likely backend change; out of scope for this plan.
   - Recommendation: keep “must be logged in to checkout” and redirect guest to login when they click checkout; after login, sync then send them to checkout.

7. **Logout**
   - Today we clear server-related cache (e.g. `['cart']`). We do **not** clear `vitrine_guest_cart`. So after logout they see an empty cart until they add again, which is acceptable. Optionally we could clear guest cart on logout; document the choice.

8. **Edge cases**
   - **Same product in guest cart and server cart**: On sync, backend may add quantities (POST /cart/add often upserts). Confirm backend behavior; if it replaces, we may need to send “set quantity” or “add (current_guest_quantity)” depending on API.
   - **Product deleted or out of stock**: Sync can 404 or 400 for some items; skip or show toast and still clear guest cart for successful items.
   - **Storage quota**: localStorage is small; limit guest cart size (e.g. max 50 items) and optionally trim oldest.

---

## 6. Backend (optional)

- Current: no `/cart/sync` or `/cart/merge`. Sync can be done with multiple `POST /cart/add` (one per guest item).
- Future: `POST /cart/sync` body `{ items: [{ productId, quantity }] }` that merges with existing server cart (e.g. add quantities, create new lines) would reduce round-trips and make sync atomic. Not required for v1.

---

## 7. Summary

| Area              | Action |
|-------------------|--------|
| Storage           | New key `vitrine_guest_cart`, shape `{ productId, quantity }[]` (+ optional product snapshot). |
| useCart           | When guest, return cart built from localStorage (same shape as API cart as possible). |
| useAddToCart      | When guest, write to localStorage and refresh guest cart; when auth, keep API. |
| useUpdate/Remove  | When guest, update localStorage and refresh; when auth, keep API. |
| AuthContext       | On login, if guest cart not empty, call API per item (or sync endpoint), then clear guest cart and invalidate `['cart']`. |
| Checkout          | Keep “login required”; redirect guest to login with returnUrl; after login, sync then redirect to checkout. |
| UI components     | No change if hooks abstract guest vs auth. |

This gives no-auth add-to-cart, local persistence, and sync on login without duplicating cart logic across the app.
