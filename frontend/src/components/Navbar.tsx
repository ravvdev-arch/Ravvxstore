import { ArrowRight, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { scrollToId } from '../lib';

interface NavbarProps { storeName: string; }

const links = [
  ['Home', 'home'], ['Produk', 'produk'], ['Kategori', 'kategori'],
  ['Reseller', 'reseller'], ['FAQ', 'faq'], ['Kontak', 'kontak'],
] as const;

export function Brand({ storeName, inverse = false }: { storeName: string; inverse?: boolean }) {
  return <a className={`brand ${inverse ? 'inverse' : ''}`} href="#home" aria-label={`${storeName} Beranda`}>
    <span className="brand-mark">RX</span><span>{storeName}</span>
  </a>;
}

export default function Navbar({ storeName }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    handleScroll(); window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = (id: string) => { setOpen(false); scrollToId(id); };

  return <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
    <div className="container nav-wrap">
      <Brand storeName={storeName} />
      <nav className={`nav-links ${open ? 'open' : ''}`} aria-label="Navigasi utama">
        {links.map(([label, id]) => <button key={id} type="button" onClick={() => navigate(id)}>{label}</button>)}
        <button className="btn mobile-nav-action" type="button" onClick={() => navigate('produk')}>Belanja Sekarang <ArrowRight size={16} /></button>
      </nav>
      <button className="btn header-action" type="button" onClick={() => scrollToId('produk')}>Belanja Sekarang <ArrowRight size={16} /></button>
      <button className="nav-toggle" type="button" aria-label={open ? 'Tutup menu' : 'Buka menu'} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        {open ? <X size={19} /> : <Menu size={20} />}
      </button>
    </div>
  </header>;
}
