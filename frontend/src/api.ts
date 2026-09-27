import type { CategoryId, OrderPayload, OrderResponse, Product, ProductSort, StoreConfig } from './types';

const API_ROOT = import.meta.env.VITE_API_BASE_URL ?? '/api';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_ROOT}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  });
  const body: unknown = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = typeof body === 'object' && body !== null && 'message' in body && typeof body.message === 'string'
      ? body.message : 'Terjadi kesalahan. Silakan coba lagi.';
    throw new Error(message);
  }
  return body as T;
}

export const storeApi = {
  getConfig: () => request<StoreConfig>('/config'),
  startAdminChat: () => request<{ whatsappUrl: string }>('/contact', { method: 'POST', body: '{}' }),
  getProducts: (filters: { category: CategoryId; query: string; sort: ProductSort }) => {
    const params = new URLSearchParams();
    if (filters.category !== 'all') params.set('category', filters.category);
    if (filters.query) params.set('q', filters.query);
    if (filters.sort !== 'default') params.set('sort', filters.sort);
    return request<{ data: Product[]; total: number }>(`/products?${params.toString()}`);
  },
  createOrder: (payload: OrderPayload) => request<OrderResponse>('/orders', {
    method: 'POST', body: JSON.stringify(payload),
  }),
};
