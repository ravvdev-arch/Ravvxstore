UPDATE CLOUDFLARE WORKER — RAVX STORE

Isi ZIP ini harus di-upload ke ROOT repository GitHub Ravvxstore (sejajar dengan folder frontend dan backend).

File yang di-upload:
1. cloudflare-worker.ts
2. wrangler.toml
3. cloudflare-schema.sql

JANGAN upload API key KlikQRIS ke GitHub.

SETELAH TIGA FILE BERHASIL ADA DI ROOT REPOSITORY:

A. Kembali ke halaman Cloudflare yang tadi.
- Path: /
- Deploy command: npx wrangler deploy
- Preview command: npx wrangler preview (biarkan saja)
- API token: pilih Create new token. Token ini adalah token Cloudflare untuk proses deploy, BUKAN API key KlikQRIS.
- Tekan Deploy.

B. Setelah berhasil, Cloudflare memberi URL seperti:
https://ravvxstore-api.NAMA-AKUN.workers.dev

C. GitHub repository → Settings → Secrets and variables → Actions → Variables.
Buat variable:
Name: VITE_API_BASE_URL
Value: https://ravvxstore-api.NAMA-AKUN.workers.dev/api

D. Jalankan ulang workflow 'Deploy frontend to GitHub Pages' melalui tab Actions.

E. Untuk checkout/pesanan, setelah Worker aktif, buat D1 database melalui:
Cloudflare → Workers & Pages → D1 SQL Database → Create database.
Lalu pada Worker: Settings → Bindings → Add → D1 database.
Nama variable binding WAJIB: DB

Setelah DB ada, buka SQL Console D1 dan jalankan isi file cloudflare-schema.sql.
