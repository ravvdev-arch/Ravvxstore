export type CategoryId = 'all' | 'alight' | 'panel' | 'reseller' | 'nokos' | 'streaming';
export type ProductBadge = 'Popular' | 'Best Seller' | 'Premium';
export type ProductSort = 'default' | 'low' | 'high' | 'az';

export interface Product {
  id: string;
  name: string;
  category: Exclude<CategoryId, 'all'>;
  price: number;
  duration: string;
  description: string;
  device?: string;
  badge?: ProductBadge;
}

export interface StoreConfig {
  storeName: string;
  whatsappConfigured: boolean;
}

export interface OrderPayload {
  productId: string;
  buyerName: string;
  contact: string;
  note: string;
}

export interface OrderResponse {
  message: string;
  orderId: string;
  whatsappUrl: string | null;
  whatsappConfigured: boolean;
}

export interface ToastData {
  id: string;
  message: string;
  tone?: 'success' | 'info' | 'error';
}
