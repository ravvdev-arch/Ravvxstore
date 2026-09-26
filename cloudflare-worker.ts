import { categoryLabels, products, type CategoryId, type Product } from './backend/src/data/products';

/**
 * RAVX STORE Cloudflare Worker API
 *
 * Secrets are configured only from Cloudflare Dashboard:
 * - ADMIN_WHATSAPP_NUMBER
 * - KLIKQRIS_API_KEY
 * - KLIKQRIS_MERCHANT_ID
 * - KLIKQRIS_WEBHOOK_SECRET
 *
 * KlikQRIS calls are intentionally not implemented until merchant API docs
 * provide the real endpoint, request schema, response schema and webhook signature.
 */
export interface Env {
  DB?: D1Database;
  STORE_NAME?: string;
  ALLOWED_ORIGIN?: string;
  ADMIN_WHATSAPP_NUMBER?: string;
  KLIKQRIS_API_KEY?: string;
  KLIKQRIS_MERCHANT_ID?: string;
  KLIKQRIS_WEBHOOK_SECRET?: string;
}

type SortId = 'default' | 'low' | 'high' | 'az';
interface OrderBody { productId?: unknown; buyerName?: unknown; contact?: unknown; note?: unknown; }

const categorySet = new Set<CategoryId>(Object.keys(categoryLabels) as CategoryId[]);
const idr = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
const jsonHeaders = { 'content-type': 'application/json; charset=UTF-8', 'cache-control': 'no-store' };

function corsHeaders(request: Request, env: Env): HeadersInit {
  const requestOrigin = request.headers.get('Origin');
  const allowedOrigin = env.ALLOWED_ORIGIN ?? 'https://ravvdev-arch.github.io';
  const origin = requestOrigin === allowedOrigin ? allowedOrigin : allowedOrigin;
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
    'access-control-max-age': '86400',
    vary: 'Origin',
  };
}

function response(request: Request, env: Env, data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: { ...jsonHeaders, ...corsHeaders(request, env) } });
}

function normalizeText(value: unknown, maxLength: number): string {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').slice(0, maxLength) : '';
}

function getProduct(id: string): Product | undefined { return products.find((product) => product.id === id); }

function makeWhatsAppUrl(number: string, message: string): string {
  return `https://wa.me/${number.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
}

function filterProducts(url: URL): { data: Product[]; total: number } | { message: string } {
  const requestedCategory = url.searchParams.get('category') ?? 'all';
  const query = (url.searchParams.get('q') ?? '').trim().toLocaleLowerCase('id-ID');
  const sort = (url.searchParams.get('sort') ?? 'default') as SortId;
  if (requestedCategory !== 'all' && !categorySet.has(requestedCategory as CategoryId)) return { message: 'Kategori tidak valid.' };

  const data = products.filter((product) => {
    const categoryMatches = requestedCategory === 'all' || product.category === requestedCategory;
    const queryMatches = !query || `${product.name} ${product.description}`.toLocaleLowerCase('id-ID').includes(query);
    return categoryMatches && queryMatches;
  });
  if (sort === 'low') data.sort((a, b) => a.price - b.price);
  if (sort === 'high') data.sort((a, b) => b.price - a.price);
  if (sort === 'az') data.sort((a, b) => a.name.localeCompare(b.name, 'id'));
  return { data, total: data.length };
}

async function createOrder(request: Request, env: Env): Promise<Response> {
  let body: OrderBody;
  try { body = await request.json<OrderBody>(); }
  catch { return response(request, env, { message: 'Format pesanan tidak valid.' }, 400); }

  const productId = normalizeText(body.productId, 80);
  const buyerName = normalizeText(body.buyerName, 80);
  const contact = normalizeText(body.contact, 120);
  const note = normalizeText(body.note, 500);
  const product = getProduct(productId);
  if (!product) return response(request, env, { message: 'Produk tidak ditemukan.' }, 404);
  if (buyerName.length < 2 || contact.length < 4) return response(request, env, { message: 'Nama dan kontak pembeli wajib diisi dengan benar.' }, 422);

  // Persist orders before any payment gateway integration. This is essential for webhook validation.
  if (!env.DB) {
    return response(request, env, { message: 'Database pesanan belum dihubungkan. Buat D1 database dan binding bernama DB terlebih dahulu.' }, 503);
  }

  const id = `RVX-${crypto.randomUUID().split('-')[0].toUpperCase()}`;
  const createdAt = new Date().toISOString();
  await env.DB.prepare(`INSERT INTO orders (id, created_at, status, product_id, product_name, product_price, product_duration, buyer_name, buyer_contact, buyer_note) VALUES (?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?)`)
    .bind(id, createdAt, product.id, product.name, product.price, product.duration, buyerName, contact, note).run();

  const adminNumber = (env.ADMIN_WHATSAPP_NUMBER ?? '').replace(/\D/g, '');
  const message = [
    'Halo Admin, saya ingin membeli:', '',
    `Produk: ${product.name}`, `Harga: ${idr(product.price)}`, `Durasi/Paket: ${product.duration}`,
    `Nama: ${buyerName}`, `Kontak: ${contact}`, `Catatan: ${note || '-'}`, '', `Kode pesanan: ${id}`,
  ].join('\n');

  return response(request, env, {
    message: 'Pesanan berhasil disimpan.', orderId: id,
    whatsappUrl: adminNumber ? makeWhatsAppUrl(adminNumber, message) : null,
    whatsappConfigured: Boolean(adminNumber),
    // Real payment URL is only returned after KlikQRIS API contract is integrated safely.
    paymentConfigured: Boolean(env.KLIKQRIS_API_KEY && env.KLIKQRIS_MERCHANT_ID),
  }, 201);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(request, env) });
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, '') || '/';

    try {
      if (request.method === 'GET' && path === '/api/health') {
        return response(request, env, { ok: true, service: 'ravvxstore-cloudflare-worker', databaseConfigured: Boolean(env.DB) });
      }
      if (request.method === 'GET' && path === '/api/config') {
        return response(request, env, {
          storeName: env.STORE_NAME ?? 'RAVX STORE',
          whatsappConfigured: Boolean((env.ADMIN_WHATSAPP_NUMBER ?? '').replace(/\D/g, '')),
          paymentProvider: 'KlikQRIS',
          paymentConfigured: Boolean(env.KLIKQRIS_API_KEY && env.KLIKQRIS_MERCHANT_ID),
        });
      }
      if (request.method === 'GET' && path === '/api/categories') {
        return response(request, env, Object.entries(categoryLabels).map(([id, label]) => ({ id, label, productCount: products.filter((product) => product.category === id).length })));
      }
      if (request.method === 'GET' && path === '/api/products') {
        const result = filterProducts(url);
        return 'message' in result ? response(request, env, result, 400) : response(request, env, result);
      }
      if (request.method === 'GET' && path.startsWith('/api/products/')) {
        const product = getProduct(decodeURIComponent(path.slice('/api/products/'.length)));
        return product ? response(request, env, { data: product }) : response(request, env, { message: 'Produk tidak ditemukan.' }, 404);
      }
      if (request.method === 'POST' && path === '/api/orders') return createOrder(request, env);
      if (request.method === 'POST' && path === '/api/contact') {
        const number = (env.ADMIN_WHATSAPP_NUMBER ?? '').replace(/\D/g, '');
        if (!number) return response(request, env, { message: 'Nomor WhatsApp admin belum dikonfigurasi sebagai Worker Secret.' }, 503);
        return response(request, env, { whatsappUrl: makeWhatsAppUrl(number, 'Halo Admin, saya ingin menanyakan produk di RAVX STORE.') });
      }
      if (request.method === 'POST' && path === '/api/webhooks/klikqris') {
        return response(request, env, { message: 'Webhook KlikQRIS belum diaktifkan. Integrasi menunggu dokumentasi API merchant resmi.' }, 501);
      }
      return response(request, env, { message: 'Endpoint tidak ditemukan.' }, 404);
    } catch (error) {
      console.error('Worker error:', error);
      return response(request, env, { message: 'Terjadi kesalahan pada server.' }, 500);
    }
  },
} satisfies ExportedHandler<Env>;
