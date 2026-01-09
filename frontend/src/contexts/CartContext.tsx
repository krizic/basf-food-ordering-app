import { createContext, useContext, useReducer, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { CartItem, MenuItem } from '../types';
import { cartStorage } from '../services/cartStorage';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { menuItem: MenuItem; quantity: number; customizations: Record<string, string> } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const TAX_RATE = 0.08;
const DELIVERY_FEE = 3.99;

function calculateItemPrice(menuItem: MenuItem, customizations: Record<string, string>): number {
  let price = Number(menuItem.price);
  
  if (menuItem.options && customizations) {
    menuItem.options.forEach(option => {
      const selectedChoice = customizations[option.name];
      if (selectedChoice) {
        const choice = option.choices.find(c => c.name === selectedChoice);
        if (choice?.priceDelta) {
          price += Number(choice.priceDelta);
        }
      }
    });
  }
  
  return price;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { menuItem, quantity, customizations } = action.payload;
      const unitPrice = calculateItemPrice(menuItem, customizations);
      const customizationKey = JSON.stringify(customizations);
      
      // Check if item with same customizations exists
      const existingIndex = state.items.findIndex(
        item => item.menuItem.id === menuItem.id && 
                JSON.stringify(item.customizations) === customizationKey
      );

      let newItems: CartItem[];
      if (existingIndex >= 0) {
        newItems = state.items.map((item, index) => 
          index === existingIndex 
            ? { 
                ...item, 
                quantity: item.quantity + quantity,
                totalPrice: (item.quantity + quantity) * unitPrice
              }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: `${menuItem.id}-${Date.now()}`,
          menuItem,
          quantity,
          customizations,
          unitPrice,
          totalPrice: quantity * unitPrice,
        };
        newItems = [...state.items, newItem];
      }
      
      cartStorage.saveCart(newItems);
      return { ...state, items: newItems, isOpen: true };
    }
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        const newItems = state.items.filter(item => item.id !== id);
        cartStorage.saveCart(newItems);
        return { ...state, items: newItems };
      }
      
      const newItems = state.items.map(item =>
        item.id === id
          ? { ...item, quantity, totalPrice: quantity * item.unitPrice }
          : item
      );
      cartStorage.saveCart(newItems);
      return { ...state, items: newItems };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      cartStorage.saveCart(newItems);
      return { ...state, items: newItems };
    }
    
    case 'CLEAR_CART': {
      cartStorage.clearCart();
      return { ...state, items: [] };
    }
    
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    
    case 'LOAD_CART':
      return { ...state, items: action.payload };
    
    default:
      return state;
  }
}

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  itemCount: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  addItem: (menuItem: MenuItem, quantity: number, customizations: Record<string, string>) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });

  useEffect(() => {
    const savedCart = cartStorage.getCart();
    if (savedCart.length > 0) {
      dispatch({ type: 'LOAD_CART', payload: savedCart });
    }
  }, []);

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = state.items.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = subtotal * TAX_RATE;
  const deliveryFee = state.items.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + tax + deliveryFee;

  const value: CartContextType = {
    items: state.items,
    isOpen: state.isOpen,
    itemCount,
    subtotal,
    tax,
    deliveryFee,
    total,
    addItem: (menuItem, quantity, customizations) =>
      dispatch({ type: 'ADD_ITEM', payload: { menuItem, quantity, customizations } }),
    updateQuantity: (id, quantity) =>
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } }),
    removeItem: (id) => dispatch({ type: 'REMOVE_ITEM', payload: id }),
    clearCart: () => dispatch({ type: 'CLEAR_CART' }),
    toggleCart: () => dispatch({ type: 'TOGGLE_CART' }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
