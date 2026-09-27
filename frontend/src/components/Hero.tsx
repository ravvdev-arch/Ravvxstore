import { ArrowRight, MessageCircle } from 'lucide-react';
import { scrollToId } from '../lib';

interface HeroProps { onAdminChat: () => void; }

export default function Hero({ onAdminChat }: HeroProps) {
  return <section className="hero" id="home" aria-labelledby="heroTitle">
    <div className="container hero-grid">
      <div className="hero-copy reveal">
        <p className="eyebrow">Digital store / curated 2026</p>
        <h1 id="heroTitle">Digital premium.<br /><span>Harga</span> terjangkau.</h1>
        <p className="hero-text">Temukan produk digital premium, panel bot, nomor kosong, dan layanan pilihan lain dengan proses pemesanan yang mudah dan nyaman.</p>
        <div className="hero-actions">
          <button type="button" className="btn" onClick={() => scrollToId('produk')}>Lihat Produk <ArrowRight size={17} /></button>
          <button type="button" className="btn ghost" onClick={onAdminChat}>Hubungi Admin <MessageCircle size={17} /></button>
        </div>
        <div className="hero-note"><span className="avatars" aria-hidden="true"><i>R</i><i>V</i><i>X</i></span><span>Transaksi praktis, katalog selalu berkembang.</span></div>
      </div>
      <div className="hero-art" aria-label="Ilustrasi akses digital premium" role="img">
        <div className="art-orbit" /><div className="dot-field" />
        <div className="art-tag"><i />Seleksi digital</div>
        <div className="art-core"><div className="art-top"><span>RAVX / SELECT</span><span>2026</span></div><p>01</p><small>Akses digital yang lebih sederhana.</small></div>
      </div>
    </div>
  </section>;
}
