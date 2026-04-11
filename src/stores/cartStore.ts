import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, CartItem } from '@/types/product';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number, size?: string, color?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product, quantity = 1, size, color) => {
        const items = get().items;
        const existing = items.find(
          (item) => item.product.id === product.id && item.size === size && item.color === color
        );
        if (existing) {
          set({
            items: items.map((item) =>
              item.product.id === product.id && item.size === size && item.color === color
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          });
        } else {
          set({ items: [...items, { product, quantity, size, color }] });
        }
      },
      removeItem: (productId) =>
        set({ items: get().items.filter((item) => item.product.id !== productId) }),
      updateQuantity: (productId, quantity) =>
        set({
          items: quantity <= 0
            ? get().items.filter((item) => item.product.id !== productId)
            : get().items.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
              ),
        }),
      clearCart: () => set({ items: [] }),
      toggleCart: () => set({ isOpen: !get().isOpen }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      totalPrice: () =>
        get().items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    }),
    { name: 'maison-cart' }
  )
);
