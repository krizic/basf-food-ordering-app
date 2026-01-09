import type { CartItem } from '../types';

const CART_KEY = 'food-delivery-cart';

export const cartStorage = {
  getCart: (): CartItem[] => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveCart: (items: CartItem[]) => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items));
    } catch {
      console.error('Failed to save cart');
    }
  },

  clearCart: () => {
    try {
      localStorage.removeItem(CART_KEY);
    } catch {
      console.error('Failed to clear cart');
    }
  },
};
