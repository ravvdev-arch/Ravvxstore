import { RotateCcw, Search } from 'lucide-react';
import { categoryLabels } from '../lib';
import type { CategoryId, Product, ProductSort } from '../types';
import ProductCard from './ProductCard';

interface CatalogProps {
  products: Product[];
  category: CategoryId;
  search: string;
  sort: ProductSort;
  loading: boolean;
  error: string | null;
  onCategory: (category: CategoryId) => void;
  onSearch: (value: string) => void;
  onSort: (value: ProductSort) => void;
  onBuy: (product: Product) => void;
  onDetail: (product: Product) => void;
  onReset: () => void;
}
const filterIds: CategoryId[] = ['all', 'alight', 'panel', 'reseller', 'nokos', 'streaming'];

export default function Catalog(props: CatalogProps) {
  const changed = props.category !== 'all' || Boolean(props.search) || props.sort !== 'default';
  return <section className="section catalog-section" id="produk" aria-labelledby="productsTitle">
    <div className="container">
      <div className="section-top reveal"><div><p className="eyebrow">Katalog pilihan</p><h2 className="section-title" id="productsTitle">Produk, tanpa kerumitan.</h2></div><p className="section-lead">Cari, bandingkan, lalu lanjutkan pesanan langsung ke admin. Semua harga tampil transparan.</p></div>
      <div className="catalog-tools"><label className="search-box" htmlFor="productSearch"><Search size={18} /><input id="productSearch" type="search" value={props.search} onChange={(event) => props.onSearch(event.target.value)} placeholder="Cari produk..." /></label><select className="sort-select" value={props.sort} onChange={(event) => props.onSort(event.target.value as ProductSort)} aria-label="Urutkan produk"><option value="default">Urutkan: Rekomendasi</option><option value="low">Harga: Terendah</option><option value="high">Harga: Tertinggi</option><option value="az">Nama: A–Z</option></select></div>
      <div className="filter-row" role="group" aria-label="Filter kategori">{filterIds.map((id) => <button key={id} type="button" className={`filter ${props.category === id ? 'active' : ''}`} aria-pressed={props.category === id} onClick={() => props.onCategory(id)}>{categoryLabels[id]}</button>)}</div>
      <div className="catalog-meta"><span aria-live="polite">{props.loading ? 'Memuat produk...' : `${props.products.length} produk ditemukan`}</span>{changed && <button type="button" onClick={props.onReset}><RotateCcw size={13} /> Reset filter</button>}</div>
      {props.error ? <div className="catalog-error"><strong>Katalog belum bisa dimuat.</strong><span>{props.error}</span><button type="button" className="btn small" onClick={props.onReset}>Coba lagi</button></div> : props.loading ? <div className="products-grid skeleton-grid">{Array.from({ length: 8 }, (_, index) => <div key={index} className="product-skeleton" />)}</div> : props.products.length ? <div className="products-grid">{props.products.map((product) => <ProductCard key={product.id} product={product} onBuy={props.onBuy} onDetail={props.onDetail} />)}</div> : <div className="empty-state"><Search size={24} /><h3>Produk tidak ditemukan</h3><p>Coba gunakan kata kunci atau filter yang berbeda.</p><button className="btn small" type="button" onClick={props.onReset}>Reset pencarian</button></div>}
    </div>
  </section>;
}
