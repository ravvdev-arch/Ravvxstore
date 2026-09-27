export type CategoryId = 'alight' | 'panel' | 'reseller' | 'nokos' | 'streaming';

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  duration: string;
  description: string;
  device?: string;
  badge?: 'Popular' | 'Best Seller' | 'Premium';
}

export const categoryLabels: Record<CategoryId, string> = {
  alight: 'Alight Motion',
  panel: 'Panel Bot',
  reseller: 'Reseller',
  nokos: 'Nokos',
  streaming: 'Streaming & AI',
};

export const products: Product[] = [
  { id: 'am-android', name: 'Alight Motion Premium Privat Android', category: 'alight', price: 10000, duration: 'Akses Premium', device: 'Android', badge: 'Premium', description: 'Akses privat untuk perangkat Android.' },
  { id: 'am-ios', name: 'Alight Motion Premium Privat iOS', category: 'alight', price: 10000, duration: 'Akses Premium', device: 'iOS', badge: 'Premium', description: 'Akses privat untuk perangkat iOS.' },
  { id: 'panel-1', name: 'Panel Bot 1GB', category: 'panel', price: 1000, duration: 'per bulan', description: 'Paket panel ringan untuk kebutuhan awal.' },
  { id: 'panel-2', name: 'Panel Bot 2GB', category: 'panel', price: 2000, duration: 'per bulan', description: 'Ruang yang nyaman untuk bot sederhana.' },
  { id: 'panel-3', name: 'Panel Bot 3GB', category: 'panel', price: 3000, duration: 'per bulan', badge: 'Popular', description: 'Pilihan seimbang untuk bot aktif.' },
  { id: 'panel-4', name: 'Panel Bot 4GB', category: 'panel', price: 4000, duration: 'per bulan', description: 'Kapasitas lebih untuk kebutuhan harian.' },
  { id: 'panel-5', name: 'Panel Bot 5GB', category: 'panel', price: 5000, duration: 'per bulan', description: 'Kapasitas fleksibel untuk bot kamu.' },
  { id: 'panel-6', name: 'Panel Bot 6GB', category: 'panel', price: 6000, duration: 'per bulan', description: 'Performa lapang untuk penggunaan stabil.' },
  { id: 'panel-7', name: 'Panel Bot 7GB', category: 'panel', price: 7000, duration: 'per bulan', description: 'Pilihan kapasitas untuk aktivitas lebih tinggi.' },
  { id: 'panel-8', name: 'Panel Bot 8GB', category: 'panel', price: 8000, duration: 'per bulan', description: 'Ruang ekstra untuk kebutuhan bot.' },
  { id: 'panel-9', name: 'Panel Bot 9GB', category: 'panel', price: 9000, duration: 'per bulan', description: 'Kapasitas besar, tetap terjangkau.' },
  { id: 'panel-unlimited', name: 'Panel Bot Unlimited', category: 'panel', price: 10000, duration: 'per bulan', badge: 'Best Seller', description: 'Paket kapasitas maksimal untuk kebutuhan serius.' },
  { id: 'join-reseller', name: 'JOIN RESELLER PANEL', category: 'reseller', price: 5000, duration: 'Akses partner', description: 'Mulai perjalanan sebagai reseller panel.' },
  { id: 'join-adp', name: 'JOIN ADP', category: 'reseller', price: 15000, duration: 'Akses partner', description: 'Paket partner untuk langkah berikutnya.' },
  { id: 'join-own', name: 'JOIN OWN', category: 'reseller', price: 25000, duration: 'Akses partner', badge: 'Popular', description: 'Pilihan akses untuk perkembangan bisnis.' },
  { id: 'join-pt-biasa', name: 'JOIN PT BIASA', category: 'reseller', price: 35000, duration: 'Akses partner', description: 'Akses partner dengan benefit lanjutan.' },
  { id: 'join-pt-kiri', name: 'JOIN PT KIRI', category: 'reseller', price: 45000, duration: 'Akses partner', description: 'Paket partnership terarah.' },
  { id: 'join-pt-kanan', name: 'JOIN PT KANAN', category: 'reseller', price: 55000, duration: 'Akses partner', badge: 'Premium', description: 'Paket partner premium untuk kamu.' },
  { id: 'nokos-id', name: 'Nokos Indonesia', category: 'nokos', price: 7000, duration: 'Nomor tersedia', device: 'Indonesia', description: 'Nomor kosong wilayah Indonesia.' },
  { id: 'nokos-my', name: 'Nokos Malaysia', category: 'nokos', price: 8000, duration: 'Nomor tersedia', device: 'Malaysia', description: 'Nomor kosong wilayah Malaysia.' },
  { id: 'nokos-sg', name: 'Nokos Singapura', category: 'nokos', price: 11000, duration: 'Nomor tersedia', device: 'Singapura', description: 'Nomor kosong wilayah Singapura.' },
  { id: 'capcut-1m', name: 'CapCut 1 Bulan', category: 'streaming', price: 35000, duration: '1 Bulan', badge: 'Premium', description: 'Akses CapCut selama satu bulan.' },
  { id: 'capcut-7d', name: 'CapCut 7 Hari', category: 'streaming', price: 9000, duration: '7 Hari', description: 'Akses singkat CapCut untuk kebutuhanmu.' },
  { id: 'netflix-1p2u', name: 'Netflix 1P2U', category: 'streaming', price: 22000, duration: 'Sesuai paket', badge: 'Popular', description: 'Pilihan Netflix 1 profil 2 user.' },
  { id: 'netflix-1p1u', name: 'Netflix 1P1U', category: 'streaming', price: 35000, duration: 'Sesuai paket', description: 'Pilihan Netflix 1 profil 1 user.' },
  { id: 'spotify-1m', name: 'Spotify 1 Bulan', category: 'streaming', price: 29000, duration: '1 Bulan', description: 'Nikmati musik favorit selama satu bulan.' },
  { id: 'spotify-sharing', name: 'Spotify Sharing', category: 'streaming', price: 20000, duration: 'Sesuai paket', description: 'Paket Spotify sharing yang praktis.' },
  { id: 'youtube', name: 'YouTube Premium', category: 'streaming', price: 20000, duration: 'Sesuai paket', badge: 'Popular', description: 'Akses YouTube Premium pilihan.' },
  { id: 'wetv-1m', name: 'WeTV VIP 1 Bulan', category: 'streaming', price: 65000, duration: '1 Bulan', description: 'Akses WeTV VIP selama satu bulan.' },
  { id: 'wetv-3m', name: 'WeTV VIP 3 Bulan', category: 'streaming', price: 14000, duration: '3 Bulan', description: 'Akses WeTV VIP selama tiga bulan.' },
  { id: 'prime-1m', name: 'Prime Video 1 Bulan', category: 'streaming', price: 15000, duration: '1 Bulan', description: 'Akses Prime Video selama satu bulan.' },
  { id: 'vidio-1m', name: 'Vidio 1 Bulan', category: 'streaming', price: 30000, duration: '1 Bulan', description: 'Akses Vidio pilihan selama satu bulan.' },
  { id: 'viu-life', name: 'VIU Lifetime', category: 'streaming', price: 25000, duration: 'Lifetime', badge: 'Best Seller', description: 'Akses VIU jangka panjang.' },
  { id: 'picsart-1m', name: 'Picsart 1 Bulan', category: 'streaming', price: 12000, duration: '1 Bulan', description: 'Akses Picsart selama satu bulan.' },
  { id: 'zoom-1w', name: 'Zoom 1 Minggu', category: 'streaming', price: 6000, duration: '1 Minggu', description: 'Akses Zoom untuk satu minggu.' },
  { id: 'wink-7d', name: 'Wink 7 Hari', category: 'streaming', price: 8000, duration: '7 Hari', description: 'Akses Wink selama tujuh hari.' },
  { id: 'bstation-1m', name: 'BStation 1 Bulan', category: 'streaming', price: 50000, duration: '1 Bulan', description: 'Akses BStation selama satu bulan.' },
  { id: 'loklok-1m', name: 'Loklok 1 Bulan', category: 'streaming', price: 25000, duration: '1 Bulan', description: 'Akses Loklok selama satu bulan.' },
  { id: 'chatgpt-7d', name: 'ChatGPT 7 Hari', category: 'streaming', price: 6000, duration: '7 Hari', badge: 'Popular', description: 'Akses ChatGPT untuk satu minggu.' },
  { id: 'chatgpt-1m', name: 'ChatGPT 1 Bulan', category: 'streaming', price: 20000, duration: '1 Bulan', description: 'Akses ChatGPT selama satu bulan.' },
  { id: 'chatgpt-private', name: 'ChatGPT Private', category: 'streaming', price: 45000, duration: 'Private', badge: 'Premium', description: 'Akses ChatGPT dengan opsi private.' },
  { id: 'gemini-3m', name: 'Gemini 3 Bulan', category: 'streaming', price: 50000, duration: '3 Bulan', description: 'Akses Gemini selama tiga bulan.' },
];
