import type { CategoryId } from './types';

export const formatRupiah = (amount: number) => new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
}).format(amount);

export const categoryLabels: Record<CategoryId, string> = {
  all: 'Semua',
  alight: 'Alight Motion',
  panel: 'Panel Bot',
  reseller: 'Reseller',
  nokos: 'Nokos',
  streaming: 'Streaming & AI',
};

export function scrollToId(id: string): void {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
