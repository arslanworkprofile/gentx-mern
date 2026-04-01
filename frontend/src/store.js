import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── AUTH STORE ──────────────────────────────────────────────────────────────
export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: 'gentx_user' }
  )
);

// ── CART STORE ───────────────────────────────────────────────────────────────
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, qty = 1, size = '', color = '') => {
        const items = get().items;
        const existing = items.find(
          (i) => i._id === product._id && i.size === size && i.color === color
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i._id === product._id && i.size === size && i.color === color
                ? { ...i, qty: i.qty + qty }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...product, qty, size, color }] });
        }
      },

      removeItem: (id, size, color) =>
        set({ items: get().items.filter((i) => !(i._id === id && i.size === size && i.color === color)) }),

      updateQty: (id, size, color, qty) =>
        set({
          items: get().items.map((i) =>
            i._id === id && i.size === size && i.color === color ? { ...i, qty } : i
          ),
        }),

      clearCart: () => set({ items: [] }),

      get total() {
        return get().items.reduce((sum, i) => sum + (i.salePrice || i.price) * i.qty, 0);
      },

      get count() {
        return get().items.reduce((sum, i) => sum + i.qty, 0);
      },
    }),
    { name: 'gentx_cart' }
  )
);

// ── WISHLIST STORE ────────────────────────────────────────────────────────────
export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      toggle: (product) => {
        const items = get().items;
        const exists = items.find((i) => i._id === product._id);
        set({ items: exists ? items.filter((i) => i._id !== product._id) : [...items, product] });
      },
      has: (id) => get().items.some((i) => i._id === id),
    }),
    { name: 'gentx_wishlist' }
  )
);
