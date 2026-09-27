import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, Box, Grid2X2, PlaySquare, Smartphone, Sparkles, UsersRound } from 'lucide-react';
import type { CategoryId } from '../types';

interface CategoriesProps { onSelect: (category: CategoryId) => void; }

const items: { id: CategoryId; title: string; icon: LucideIcon }[] = [
  { id: 'alight', title: 'Alight Motion', icon: Sparkles },
  { id: 'panel', title: 'Panel Bot', icon: Grid2X2 },
  { id: 'reseller', title: 'Reseller / Partner', icon: UsersRound },
  { id: 'nokos', title: 'Nokos', icon: Smartphone },
  { id: 'streaming', title: 'Streaming & AI', icon: PlaySquare },
  { id: 'all', title: 'Produk Lainnya', icon: Box },
];

export default function Categories({ onSelect }: CategoriesProps) {
  return <section className="section category-section" id="kategori" aria-labelledby="categoryTitle">
    <div className="container">
      <div className="section-top reveal"><div><p className="eyebrow">Eksplorasi katalog</p><h2 className="section-title" id="categoryTitle">Pilih yang kamu butuhkan.</h2></div><p className="section-lead">Koleksi yang ditata ringkas untuk memudahkan kamu menemukan layanan digital yang tepat.</p></div>
      <div className="category-grid">
        {items.map(({ id, title, icon: Icon }) => <button key={id} type="button" className="category-card reveal" onClick={() => onSelect(id)}>
          <span className="category-icon"><Icon size={21} /></span><strong>{title}</strong><ArrowUpRight className="card-arrow" size={16} />
        </button>)}
      </div>
    </div>
  </section>;
}
