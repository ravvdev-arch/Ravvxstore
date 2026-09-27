import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { storeApi } from './api';
import { scrollToId } from './lib';
import type { CategoryId, Product, ProductSort, StoreConfig, ToastData } from './types';
import Categories from './components/Categories';
import Catalog from './components/Catalog';
import CheckoutModal from './components/CheckoutModal';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import { AlightFeature, Contact, NokosFeature } from './components/Highlights';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Partner from './components/Partner';
import Toast from './components/Toast';
import Trust from './components/Trust';

const defaultConfig: StoreConfig = { storeName: 'RAVX STORE', whatsappConfigured: false };

export default function App() {
  const [config, setConfig] = useState<StoreConfig>(defaultConfig);
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<CategoryId>('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<ProductSort>('default');
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalMode, setModalMode] = useState<'detail' | 'checkout'>('checkout');
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const toastTimers = useRef<number[]>([]);

  const notify = useCallback((message: string, tone: ToastData['tone'] = 'success') => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, message, tone }]);
    const timer = window.setTimeout(() => setToasts((current) => current.filter((toast) => toast.id !== id)), 4400);
    toastTimers.current.push(timer);
  }, []);

  useEffect(() => () => toastTimers.current.forEach(window.clearTimeout), []);

  useEffect(() => {
    let current = true;
    Promise.all([storeApi.getConfig(), storeApi.getProducts({ category: 'all', query: '', sort: 'default' })])
      .then(([serverConfig, response]) => { if (current) { setConfig(serverConfig); setAllProducts(response.data); } })
      .catch(() => { if (current) notify('Server belum terhubung. Pastikan API berjalan.', 'info'); })
      .finally(() => { if (current) setInitialLoading(false); });
    return () => { current = false; };
  }, [notify]);

  useEffect(() => {
    let current = true;
    const debounce = window.setTimeout(() => {
      setLoading(true); setError(null);
      storeApi.getProducts({ category, query: search, sort })
        .then((response) => { if (current) { setProducts(response.data); if (category === 'all' && !search && sort === 'default') setAllProducts(response.data); } })
        .catch((requestError: unknown) => { if (current) setError(requestError instanceof Error ? requestError.message : 'Produk belum dapat dimuat.'); })
        .finally(() => { if (current) setLoading(false); });
    }, search ? 240 : 0);
    return () => { current = false; window.clearTimeout(debounce); };
  }, [category, search, sort, reloadKey]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('revealed'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [allProducts]);

  const selectCategory = (nextCategory: CategoryId) => {
    setCategory(nextCategory); setSearch(''); setSort('default'); scrollToId('produk');
  };
  const resetCatalog = () => { setCategory('all'); setSearch(''); setSort('default'); setReloadKey((key) => key + 1); };
  const openCheckout = (product: Product) => { setSelectedProduct(product); setModalMode('checkout'); };
  const openDetail = (product: Product) => { setSelectedProduct(product); setModalMode('detail'); };
  const closeModal = useCallback(() => setSelectedProduct(null), []);
  const startAdminChat = async () => {
    try { const { whatsappUrl } = await storeApi.startAdminChat(); window.open(whatsappUrl, '_blank', 'noopener,noreferrer'); }
    catch (requestError) { notify(requestError instanceof Error ? requestError.message : 'Admin belum dapat dihubungi.', 'info'); }
  };

  const alightProducts = useMemo(() => allProducts.filter((product) => product.category === 'alight'), [allProducts]);
  const partnerProducts = useMemo(() => allProducts.filter((product) => product.category === 'reseller'), [allProducts]);
  const nokosProducts = useMemo(() => allProducts.filter((product) => product.category === 'nokos'), [allProducts]);

  return <>
    {initialLoading && <div className="loader" aria-label="Memuat RAVX STORE"><div><b>RAVX STORE</b><i /></div></div>}
    <Navbar storeName={config.storeName} />
    <main>
      <Hero onAdminChat={startAdminChat} />
      <Categories onSelect={selectCategory} />
      <Catalog products={products} category={category} search={search} sort={sort} loading={loading} error={error} onCategory={selectCategory} onSearch={setSearch} onSort={setSort} onBuy={openCheckout} onDetail={openDetail} onReset={resetCatalog} />
      <Partner products={partnerProducts} onBuy={openCheckout} />
      <AlightFeature products={alightProducts} onBuy={openCheckout} onCategory={selectCategory} />
      <NokosFeature products={nokosProducts} onBuy={openCheckout} onAdminChat={startAdminChat} />
      <Trust />
      <FAQ onAdminChat={startAdminChat} />
      <Contact onAdminChat={startAdminChat} />
    </main>
    <Footer storeName={config.storeName} onAdminChat={startAdminChat} onCategory={selectCategory} />
    <CheckoutModal product={selectedProduct} mode={modalMode} onClose={closeModal} onCheckout={() => setModalMode('checkout')} onNotify={notify} />
    <div className="toast-stack" aria-live="polite">{toasts.map((toast) => <Toast key={toast.id} toast={toast} />)}</div>
  </>;
}
