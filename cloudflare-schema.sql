-- Jalankan di Cloudflare D1 Console setelah database dibuat.
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_price INTEGER NOT NULL,
  product_duration TEXT NOT NULL,
  buyer_name TEXT NOT NULL,
  buyer_contact TEXT NOT NULL,
  buyer_note TEXT NOT NULL DEFAULT '',
  payment_provider TEXT,
  payment_reference TEXT
);

CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
