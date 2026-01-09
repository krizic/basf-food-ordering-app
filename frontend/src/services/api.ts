const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Menu
  getMenu: (category?: string) => 
    request<{ categories: string[]; items: any[] }>(`/api/menu${category ? `?category=${category}` : ''}`),
  
  getMenuItem: (id: string) =>
    request<any>(`/api/menu/${id}`),
  
  searchMenu: (query: string) => 
    request<{ items: any[] }>(`/api/menu/search?q=${encodeURIComponent(query)}`),

  // Orders
  createOrder: (data: any) => 
    request<any>('/api/orders', { method: 'POST', body: JSON.stringify(data) }),
  
  getOrder: (orderNumber: string, email?: string) => 
    request<any>(`/api/orders/${orderNumber}${email ? `?email=${encodeURIComponent(email)}` : ''}`),

  // Discounts
  validateDiscount: (code: string, subtotal: number) =>
    request<{
      valid: boolean;
      message?: string;
      discountType?: string;
      discountValue?: number;
      discountAmount?: number;
      description?: string;
    }>('/api/discounts/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    }),
};
