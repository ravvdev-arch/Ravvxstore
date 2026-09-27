import { Circle } from 'lucide-react';
import { scrollToId } from '../lib';
import { Brand } from './Navbar';

interface FooterProps { storeName: string; onAdminChat: () => void; onCategory: (category: 'alight' | 'panel' | 'streaming' | 'nokos') => void; }

export default function Footer({ storeName, onAdminChat, onCategory }: FooterProps) {
  return <footer><div className="container"><div className="footer-grid"><div className="footer-about"><Brand storeName={storeName} inverse /><p>Kurasi produk digital premium dengan proses pemesanan yang sederhana, jelas, dan nyaman.</p></div><div className="footer-col"><h4>Navigasi</h4><button onClick={() => scrollToId('home')}>Home</button><button onClick={() => scrollToId('produk')}>Produk</button><button onClick={() => scrollToId('reseller')}>Reseller</button><button onClick={() => scrollToId('faq')}>FAQ</button></div><div className="footer-col"><h4>Kategori</h4><button onClick={() => onCategory('alight')}>Alight Motion</button><button onClick={() => onCategory('panel')}>Panel Bot</button><button onClick={() => onCategory('streaming')}>Streaming &amp; AI</button><button onClick={() => onCategory('nokos')}>Nokos</button></div><div className="footer-col"><h4>Kontak</h4><button onClick={onAdminChat}>WhatsApp Admin</button><button onClick={() => scrollToId('kontak')}>Butuh bantuan?</button><button onClick={() => scrollToId('faq')}>Pertanyaan umum</button></div></div><div className="footer-bottom"><span>© 2026 {storeName}. All rights reserved.</span><span className="footer-status"><Circle size={7} fill="currentColor" /> Katalog digital aktif</span></div></div></footer>;
}
