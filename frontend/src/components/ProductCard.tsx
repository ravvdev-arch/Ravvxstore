import { Globe2, Info, Smartphone } from 'lucide-react';
import { categoryLabels, formatRupiah } from '../lib';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onBuy: (product: Product) => void;
  onDetail: (product: Product) => void;
}

export default function ProductCard({ product, onBuy, onDetail }: ProductCardProps) {
  return <article className="product-card">
    <div className="product-top"><span className="category-chip">{categoryLabels[product.category]}</span>{product.badge && <span className="badge">{product.badge}</span>}</div>
    <div className="product-body"><h3>{product.name}</h3><p>{product.description}</p>{product.device && <span className="device-line">{product.category === 'nokos' ? <Globe2 size={12} /> : <Smartphone size={12} />}{product.device}</span>}</div>
    <div className="product-bottom"><div className="price-wrap"><small>{product.duration}</small><strong>{formatRupiah(product.price)}</strong></div><div className="card-actions"><button className="card-mini-btn" type="button" onClick={() => onDetail(product)}><Info size={12} />Detail</button><button className="card-mini-btn primary" type="button" onClick={() => onBuy(product)}>Beli<span> Sekarang</span></button></div></div>
  </article>;
}
