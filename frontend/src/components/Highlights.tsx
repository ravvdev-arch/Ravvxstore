import { ArrowRight, Globe2, MessageCircle, Sparkles } from 'lucide-react';
import { formatRupiah, scrollToId } from '../lib';
import type { Product } from '../types';

interface HighlightsProps {
  products: Product[];
  onBuy: (product: Product) => void;
  onAdminChat: () => void;
  onCategory: (category: 'alight') => void;
}

export function AlightFeature({ products, onBuy, onCategory }: Omit<HighlightsProps, 'onAdminChat'>) {
  return <section className="feature-section" id="alight-motion" aria-labelledby="alightTitle"><div className="container feature-grid"><article className="feature-main reveal"><p className="eyebrow">Alight Motion premium</p><h3 id="alightTitle">Kreasi tetap lancar, di perangkat pilihanmu.</h3><p>Akses privat tersedia untuk Android dan iOS. Pilih sesuai perangkat yang kamu gunakan sebelum melanjutkan pesanan.</p><div className="feature-pricing">{products.map((product) => <button type="button" className="mini-price" key={product.id} onClick={() => onBuy(product)}><span>{product.device}</span><strong>{formatRupiah(product.price)}</strong></button>)}</div></article><aside className="feature-aside reveal"><div className="icon-box"><Sparkles size={24} /></div><h3>Privat dan lebih personal.</h3><p>Keterangan perangkat ditampilkan jelas, agar pesananmu lebih tepat sejak awal.</p><button className="btn light small" type="button" onClick={() => onCategory('alight')}>Lihat Alight Motion <ArrowRight size={15} /></button></aside></div></section>;
}

export function NokosFeature({ products, onBuy, onAdminChat }: Pick<HighlightsProps, 'products' | 'onBuy' | 'onAdminChat'>) {
  const codes: Record<string, string> = { 'Nokos Indonesia': 'ID', 'Nokos Malaysia': 'MY', 'Nokos Singapura': 'SG' };
  return <section className="section" id="nokos" aria-labelledby="nokosTitle"><div className="container"><div className="nokos-wrap reveal"><div className="nokos-head"><h3 id="nokosTitle">NOKOS / Nomor Kosong</h3><p>Butuh negara lain? Jika nomor yang kamu cari belum tersedia di katalog, admin siap mengecek ketersediaannya untukmu.</p></div><div className="nokos-layout">{products.map((product) => <button type="button" className="country-card" key={product.id} onClick={() => onBuy(product)}><span>{codes[product.name]}</span><h4>{product.name.replace('Nokos ', '')}</h4><strong>{formatRupiah(product.price)}</strong></button>)}<article className="help-card"><Globe2 size={19} /><h4>Butuh negara lain?</h4><p>Hubungi admin untuk mengecek ketersediaan nomor negara lain.</p><button type="button" onClick={onAdminChat}>Hubungi Admin <ArrowRight size={13} /></button></article></div></div></div></section>;
}

export function Contact({ onAdminChat }: { onAdminChat: () => void }) {
  return <section className="section contact-section" id="kontak" aria-labelledby="contactTitle"><div className="container"><div className="contact-card reveal"><p className="eyebrow">Hubungi kami</p><h2 id="contactTitle">Butuh bantuan memilih produk?</h2><p>Jika produk yang kamu cari belum tersedia di katalog, hubungi admin untuk menanyakan ketersediaan dan rekomendasi yang sesuai.</p><button type="button" className="btn light" onClick={onAdminChat}><MessageCircle size={17} /> Chat Admin</button></div></div></section>;
}

export function jumpToCatalog(): void { scrollToId('produk'); }
