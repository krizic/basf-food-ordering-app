export interface MenuOption {
  id: string;
  name: string;
  choices: { name: string; priceDelta: number }[];
  isRequired: boolean;
  maxChoices?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
  options: MenuOption[];
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  customizations: Record<string, string>;
  unitPrice: number;
  totalPrice: number;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  postalCode: string;
  instructions?: string;
}

export interface Customer {
  email?: string;
  phone?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerEmail?: string;
  customerPhone?: string;
  deliveryAddress: DeliveryAddress;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  specialInstructions?: string;
  items: OrderItem[];
  createdAt: string;
}

export interface OrderItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  customizations: Record<string, string>;
}

export type OrderStatus = 
  | 'PENDING' 
  | 'CONFIRMED' 
  | 'PREPARING' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'CANCELLED';

export interface CreateOrderRequest {
  customer: Customer;
  deliveryAddress: DeliveryAddress;
  items: {
    menuItemId: string;
    quantity: number;
    customizations?: Record<string, string>;
  }[];
  specialInstructions?: string;
}

export interface CreateOrderResponse {
  orderId: string;
  orderNumber: string;
  total: number;
  estimatedDelivery: string;
}
