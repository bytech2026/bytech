import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@workspace/api-client-react';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedStorage?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, selectedColor?: string, selectedStorage?: string) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}

export function getCartKey(productId: number, color?: string, storage?: string) {
  return `${productId}|${color || ""}|${storage || ""}`;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product: Product, quantity = 1, selectedColor?: string, selectedStorage?: string) => {
        set((state) => {
          const key = getCartKey(product.id, selectedColor, selectedStorage);
          const existingItem = state.items.find(
            (i) => getCartKey(i.product.id, i.selectedColor, i.selectedStorage) === key
          );
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                getCartKey(i.product.id, i.selectedColor, i.selectedStorage) === key
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return { items: [...state.items, { product, quantity, selectedColor, selectedStorage }] };
        });
      },

      removeItem: (key: string) => {
        set((state) => ({
          items: state.items.filter(
            (i) => getCartKey(i.product.id, i.selectedColor, i.selectedStorage) !== key
          ),
        }));
      },

      updateQuantity: (key: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(key);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            getCartKey(i.product.id, i.selectedColor, i.selectedStorage) === key
              ? { ...i, quantity }
              : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      getCartTotal: () => {
        return get().items.reduce((total, item) => {
          const price = item.product.salePrice ?? item.product.price;
          return total + price * item.quantity;
        }, 0);
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    { name: 'bytech-cart-v2' }
  )
);
