import 'dotenv/config';
import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { randomUUID } from 'node:crypto';
import { categoryLabels, products, type CategoryId, type Product } from './data/products.js';

const app = express();
const port = Number(process.env.PORT ?? 4000);
const storeName = process.env.STORE_NAME?.trim() || 'RAVX STORE';
const adminWhatsAppNumber = (process.env.ADMIN_WHATSAPP_NUMBER ?? '').replace(/\D/g, '');
// Set DATA_DIR=/var/data on Render if you attach a persistent disk.
const dataDir = resolve(process.env.DATA_DIR ?? resolve(process.cwd(), 'data'));
const ordersFile = resolve(dataDir, 'orders.json');
const validCategories = new Set<CategoryId>(Object.keys(categoryLabels) as CategoryId[]);

interface CreateOrderBody {
  productId?: unknown;
  buyerName?: unknown;
  contact?: unknown;
  note?: unknown;
}

interface StoredOrder {
  id: string;
  createdAt: string;
  status: 'pending';
  buyer: { name: string; contact: string; note: string };
  product: Pick<Product, 'id' | 'name' | 'price' | 'duration' | 'category'>;
}

app.disable('x-powered-by');
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(',') ?? true }));
app.use(express.json({ limit: '20kb' }));

const formatIdr = (amount: number) => new Intl.NumberFormat('id-ID', {
  style: 'currency', currency: 'IDR', maximumFractionDigits: 0,
}).format(amount);

const normalizeText = (value: unknown, maxLength: number) => typeof value === 'string'
  ? value.trim().replace(/\s+/g, ' ').slice(0, maxLength)
  : '';

async function readOrders(): Promise<StoredOrder[]> {
  await mkdir(dataDir, { recursive: true });
  try {
    const raw = await readFile(ordersFile, 'utf8');
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as StoredOrder[] : [];
  } catch {
    return [];
  }
}

async function saveOrder(order: StoredOrder): Promise<void> {
  const orders = await readOrders();
  orders.push(order);
  await writeFile(ordersFile, JSON.stringify(orders, null, 2), 'utf8');
}

function makeWhatsAppUrl(order: StoredOrder): string | null {
  if (!adminWhatsAppNumber) return null;
  const message = [
    'Halo Admin, saya ingin membeli:',
    '',
    `Produk: ${order.product.name}`,
    `Harga: ${formatIdr(order.product.price)}`,
    `Durasi/Paket: ${order.product.duration}`,
    `Nama: ${order.buyer.name}`,
    `Kontak: ${order.buyer.contact}`,
    `Catatan: ${order.buyer.note || '-'}`,
    '',
    `Kode pesanan: ${order.id}`,
  ].join('\n');
  return `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(message)}`;
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'ravx-store-api' });
});

app.get('/api/config', (_req, res) => {
  res.json({ storeName, whatsappConfigured: Boolean(adminWhatsAppNumber) });
});

app.get('/api/categories', (_req, res) => {
  res.json(Object.entries(categoryLabels).map(([id, label]) => ({
    id,
    label,
    productCount: products.filter((product) => product.category === id).length,
  })));
});

app.get('/api/products', (req, res) => {
  const requestedCategory = typeof req.query.category === 'string' ? req.query.category : 'all';
  const query = typeof req.query.q === 'string' ? req.query.q.trim().toLocaleLowerCase('id-ID') : '';
  const sort = typeof req.query.sort === 'string' ? req.query.sort : 'default';

  if (requestedCategory !== 'all' && !validCategories.has(requestedCategory as CategoryId)) {
    res.status(400).json({ message: 'Kategori tidak valid.' });
    return;
  }

  const data = products.filter((product) => {
    const categoryMatches = requestedCategory === 'all' || product.category === requestedCategory;
    const queryMatches = !query || `${product.name} ${product.description}`.toLocaleLowerCase('id-ID').includes(query);
    return categoryMatches && queryMatches;
  });

  if (sort === 'low') data.sort((a, b) => a.price - b.price);
  if (sort === 'high') data.sort((a, b) => b.price - a.price);
  if (sort === 'az') data.sort((a, b) => a.name.localeCompare(b.name, 'id'));

  res.json({ data, total: data.length });
});

app.post('/api/contact', (_req, res) => {
  if (!adminWhatsAppNumber) {
    res.status(503).json({ message: 'Nomor WhatsApp admin belum dikonfigurasi pada server.' });
    return;
  }
  const message = encodeURIComponent('Halo Admin, saya ingin menanyakan produk di RAVX STORE.');
  res.json({ whatsappUrl: `https://wa.me/${adminWhatsAppNumber}?text=${message}` });
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find((item) => item.id === req.params.id);
  if (!product) {
    res.status(404).json({ message: 'Produk tidak ditemukan.' });
    return;
  }
  res.json({ data: product });
});

app.post('/api/orders', async (req: Request<unknown, unknown, CreateOrderBody>, res, next) => {
  try {
    const productId = normalizeText(req.body.productId, 80);
    const buyerName = normalizeText(req.body.buyerName, 80);
    const contact = normalizeText(req.body.contact, 120);
    const note = normalizeText(req.body.note, 500);
    const product = products.find((item) => item.id === productId);

    if (!product) {
      res.status(404).json({ message: 'Produk tidak ditemukan.' });
      return;
    }
    if (buyerName.length < 2 || contact.length < 4) {
      res.status(422).json({ message: 'Nama dan kontak pembeli wajib diisi dengan benar.' });
      return;
    }

    const order: StoredOrder = {
      id: `RVX-${randomUUID().split('-')[0].toUpperCase()}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      buyer: { name: buyerName, contact, note },
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        duration: product.duration,
        category: product.category,
      },
    };

    await saveOrder(order);
    res.status(201).json({
      message: 'Pesanan berhasil disiapkan.',
      orderId: order.id,
      whatsappUrl: makeWhatsAppUrl(order),
      whatsappConfigured: Boolean(adminWhatsAppNumber),
    });
  } catch (error) {
    next(error);
  }
});

app.use((_req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan.' });
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(error);
  res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`RAVX Store API berjalan di http://0.0.0.0:${port}`);
});
