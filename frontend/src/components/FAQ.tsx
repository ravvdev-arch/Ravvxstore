import { ArrowRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const questions = [
  ['Bagaimana cara membeli produk?', 'Pilih produk dari katalog, tekan tombol beli, isi data singkat di form checkout, lalu lanjutkan pesanan ke WhatsApp admin.'],
  ['Bagaimana proses pembayaran?', 'Setelah pesanan dikirim ke WhatsApp, admin akan memberi arahan pembayaran dan mengonfirmasi detail pesananmu.'],
  ['Berapa lama proses pesanan?', 'Waktu proses dapat berbeda sesuai produk dan antrean. Admin akan memberikan informasi estimasi setelah pesanan diterima.'],
  ['Apakah tersedia produk lain?', 'Ya, katalog terus berkembang. Jika produk yang kamu cari belum ada, hubungi admin untuk menanyakan ketersediaannya.'],
  ['Bagaimana cara menghubungi admin?', 'Gunakan tombol Chat Admin atau Hubungi Admin pada halaman ini. Pesanmu akan disiapkan langsung untuk WhatsApp admin.'],
  ['Apakah tersedia nokos negara lain?', 'Ketersediaan negara lain dapat berubah. Hubungi admin untuk pengecekan stok nokos negara yang kamu butuhkan.'],
];

export default function FAQ({ onAdminChat }: { onAdminChat: () => void }) {
  const [openIndex, setOpenIndex] = useState(0);
  return <section className="section" id="faq" aria-labelledby="faqTitle"><div className="container faq-grid"><div className="faq-side reveal"><p className="eyebrow">Pertanyaan umum</p><h2 className="section-title" id="faqTitle">Biar makin yakin sebelum pesan.</h2><p>Masih ada pertanyaan yang belum terjawab? Tim admin selalu siap membantu.</p><button className="btn ghost small" type="button" onClick={onAdminChat}>Chat Admin <ArrowRight size={15} /></button></div><div className="faq-list reveal">{questions.map(([question, answer], index) => { const active = index === openIndex; return <article className={`faq-item ${active ? 'active' : ''}`} key={question}><button type="button" className="faq-question" aria-expanded={active} onClick={() => setOpenIndex(active ? -1 : index)}><span>{question}</span><ChevronDown size={18} /></button><div className="faq-answer"><div><p>{answer}</p></div></div></article>; })}</div></div></section>;
}
