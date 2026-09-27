import { ArrowRight } from 'lucide-react';
import { formatRupiah } from '../lib';
import type { Product } from '../types';

interface PartnerProps { products: Product[]; onBuy: (product: Product) => void; }

export default function Partner({ products, onBuy }: PartnerProps) {
  return <section className="section spotlight" id="reseller" aria-labelledby="resellerTitle">
    <div className="container spotlight-grid">
      <div className="partner-copy reveal"><p className="eyebrow">Ruang partner</p><h2 className="section-title" id="resellerTitle">Mulai bangun bisnis digitalmu.</h2><p>Pilih level kerja sama yang sesuai ritmemu. Paket reseller dan partner dibuat agar kamu bisa mulai menjual dengan langkah yang lebih ringan.</p><button className="btn light" type="button" onClick={() => products[0] && onBuy(products[0])}>Gabung Sekarang <ArrowRight size={17} /></button><div className="partner-stats"><div><strong>6</strong><span>Pilihan akses</span></div><div><strong>Mulai 5K</strong><span>Harga terbuka</span></div></div></div>
      <div className="partner-grid reveal">{products.map((product) => <button className={`partner-card ${product.id === 'join-own' ? 'featured' : ''}`} type="button" key={product.id} onClick={() => onBuy(product)}><small>{product.id === 'join-own' ? 'Pilihan populer' : 'Partner access'}</small><h3>{product.name.replace('JOIN ', '')}</h3><strong>{formatRupiah(product.price)}</strong><span>+</span></button>)}</div>
    </div>
  </section>;
}
