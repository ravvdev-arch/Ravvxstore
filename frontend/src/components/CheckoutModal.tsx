import { Check, LockKeyhole, X } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { storeApi } from '../api';
import { categoryLabels, formatRupiah } from '../lib';
import type { Product } from '../types';

type ModalMode = 'detail' | 'checkout';

interface CheckoutModalProps {
  product: Product | null;
  mode: ModalMode;
  onClose: () => void;
  onCheckout: () => void;
  onNotify: (message: string, tone?: 'success' | 'info' | 'error') => void;
}

export default function CheckoutModal({ product, mode, onClose, onCheckout, onNotify }: CheckoutModalProps) {
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!product) return undefined;
    const onKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.body.classList.add('modal-open');
    document.addEventListener('keydown', onKeyDown);
    return () => { document.body.classList.remove('modal-open'); document.removeEventListener('keydown', onKeyDown); };
  }, [product, onClose]);

  useEffect(() => setSubmitting(false), [product, mode]);

  if (!product) return null;

  const submitOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setSubmitting(true);
    try {
      const result = await storeApi.createOrder({
        productId: product.id,
        buyerName: String(formData.get('buyerName') ?? ''),
        contact: String(formData.get('contact') ?? ''),
        note: String(formData.get('note') ?? ''),
      });
      onClose();
      if (result.whatsappUrl) window.open(result.whatsappUrl, '_blank', 'noopener,noreferrer');
      onNotify(result.whatsappUrl ? `Pesanan ${result.orderId} siap diteruskan ke WhatsApp.` : `Pesanan ${result.orderId} tersimpan. Admin WhatsApp belum dikonfigurasi.`, result.whatsappUrl ? 'success' : 'info');
    } catch (error) {
      onNotify(error instanceof Error ? error.message : 'Pesanan belum dapat dibuat.', 'error');
    } finally { setSubmitting(false); }
  };

  return <div className="modal open" role="dialog" aria-modal="true" aria-labelledby="modalTitle" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}>
    <div className="modal-dialog">
      <div className="modal-top"><div><p className="modal-kicker">{mode === 'detail' ? categoryLabels[product.category] : 'Pesan produk'}</p><h2 id="modalTitle">{mode === 'detail' ? product.name : 'Checkout sederhana'}</h2></div><button className="modal-close" type="button" aria-label="Tutup modal" onClick={onClose}><X size={18} /></button></div>
      <div className="modal-content">
        {mode === 'detail' ? <><div className="order-summary"><div><span>Harga</span><strong className="summary-price">{formatRupiah(product.price)}</strong></div><div><span>Durasi / paket</span><strong>{product.duration}</strong></div></div><p className="detail-info">{product.description} {product.device && <>Produk ini ditujukan untuk perangkat <b>{product.device}</b>.</>}</p><ul className="detail-list"><li><Check size={13} />Informasi paket tampil transparan</li><li><Check size={13} />Konfirmasi detail bersama admin</li><li><Check size={13} />Lanjut pesan lewat WhatsApp</li></ul><button className="btn detail-action" type="button" onClick={onCheckout}>Beli Sekarang</button></> : <><div className="order-summary"><div><span>Produk pilihan</span><strong>{product.name}</strong></div><div><span>{product.duration}</span><strong className="summary-price">{formatRupiah(product.price)}</strong></div></div><form className="checkout-form" onSubmit={submitOrder}><label className="field"><span>Nama pembeli</span><input name="buyerName" required minLength={2} placeholder="Nama kamu" autoComplete="name" /></label><label className="field"><span>Kontak pembeli</span><input name="contact" required minLength={4} placeholder="WhatsApp / email" autoComplete="tel" /></label><label className="field full"><span>Catatan <em>(opsional)</em></span><textarea name="note" maxLength={500} placeholder="Contoh: perangkat Android, atau pertanyaan lain." /></label><div className="field full"><p className="modal-footnote"><LockKeyhole size={14} />Data digunakan untuk membuat pesanan dan menyiapkan pesan ke admin.</p><button className="btn checkout-submit" disabled={submitting} type="submit">{submitting ? 'Memproses...' : 'Lanjutkan Pesanan'}</button></div></form></>}
      </div>
    </div>
  </div>;
}
