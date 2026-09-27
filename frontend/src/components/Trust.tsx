import type { LucideIcon } from 'lucide-react';
import { BadgeCheck, Box, Headphones, LockKeyhole, Zap } from 'lucide-react';

const items: { icon: LucideIcon; title: string; text: string }[] = [
  { icon: Zap, title: 'Proses Cepat', text: 'Alur pesanan dibuat ringkas dan jelas.' },
  { icon: LockKeyhole, title: 'Transaksi Mudah', text: 'Pesan langsung melalui chat admin.' },
  { icon: Headphones, title: 'Admin Responsif', text: 'Bantuan tersedia saat kamu memerlukan.' },
  { icon: BadgeCheck, title: 'Produk Digital', text: 'Koleksi akses yang dipilih dengan rapi.' },
  { icon: Box, title: 'Banyak Pilihan', text: 'Dari panel, kreatif, hingga hiburan.' },
];

export default function Trust() {
  return <section className="section trust-section" aria-labelledby="trustTitle"><div className="container"><div className="section-top reveal"><div><p className="eyebrow">Dirancang untuk nyaman</p><h2 className="section-title" id="trustTitle">Kenapa belanja di sini?</h2></div><p className="section-lead">Pengalaman katalog yang fokus pada kejelasan informasi dan proses pemesanan yang ringkas.</p></div><div className="trust-grid">{items.map(({ icon: Icon, title, text }) => <article className="trust-card reveal" key={title}><div className="trust-icon"><Icon size={20} /></div><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>;
}
