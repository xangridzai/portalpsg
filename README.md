# Portal Tautan Layanan

Portal tautan (mirip linktr.ee) dengan **menu aksesibilitas** bawaan
(bukan widget pihak ketiga seperti UserWay — semua kode ditulis sendiri
supaya gratis, ringan, dan bisa dikustomisasi bebas).

```
portal-app/
├─ index.html          → halaman utama
├─ style.css            → desain (token warna, tipografi, panel aksesibilitas)
├─ app.js                → render tautan + logika aksesibilitas
├─ manifest.json         → agar bisa "diinstal" seperti aplikasi
├─ sw.js                 → service worker (offline + installable)
├─ icons/                → ikon aplikasi (192px & 512px)
└─ gas/Code.gs            → backend Google Apps Script (sumber data tautan)
```

## 1. Cara kerja arsitekturnya

- **Frontend** (HTML/CSS/JS murni, tanpa framework) di-hosting di **Cloudflare Pages** — gratis, cepat, otomatis pakai HTTPS & CDN global.
- **Daftar tautan** disimpan di **Google Sheet**, dilayani sebagai JSON oleh **Google Apps Script** (`doGet`). Jadi Anda bisa ubah/tambah link cukup edit spreadsheet, tanpa deploy ulang.
- Kalau `API_URL` di `app.js` dikosongkan atau gagal diakses, aplikasi otomatis memakai `FALLBACK_LINKS` (data contoh di dalam `app.js`) — jadi web tetap jalan meski backend belum di-setup.

## 2. Setup backend (Google Apps Script)

1. Buka [sheets.google.com](https://sheets.google.com) → buat spreadsheet baru.
2. Ganti nama sheet pertama menjadi **`Links`**.
3. Isi header persis begini di baris 1:

   | Kategori | Judul | Deskripsi | URL | Ikon | Urutan | Aktif |
   |---|---|---|---|---|---|---|
   | Layanan Utama | Website Resmi | Informasi & berita | https://... | 🌐 | 1 | TRUE |

4. Menu **Extensions → Apps Script**. Hapus isi default, tempel isi `gas/Code.gs`.
5. Klik **Deploy → New deployment**:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Salin URL yang diakhiri `/exec`.
7. Buka `app.js`, isi:
   ```js
   const API_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";
   ```

## 3. Deploy frontend ke Cloudflare Pages

**Opsi A — lewat dashboard (paling mudah):**
1. Push folder `portal-app/` ini ke repo GitHub/GitLab.
2. Di [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages → Create → Pages → Connect to Git**.
3. Pilih repo. Build settings: **Framework preset: None**, **Build command: (kosongkan)**, **Output directory: `/`** (root, karena ini situs statis biasa).
4. Deploy. Anda akan dapat domain `nama-project.pages.dev`, bisa disambungkan ke domain sendiri di tab **Custom domains**.

**Opsi B — lewat CLI (Wrangler):**
```bash
npm install -g wrangler
cd portal-app
wrangler pages deploy . --project-name=portal-tautan
```

## 4. Mengedit daftar tautan

- Cukup buka Google Sheet → tambah/ubah baris. Perubahan langsung muncul saat pengguna memuat ulang halaman (tidak perlu deploy ulang situs).
- Set kolom **Aktif** ke `FALSE` untuk menyembunyikan sebuah tautan tanpa menghapusnya.

## 5. Menjadikan situs ini "seperti aplikasi" di Android

Situs ini sudah dilengkapi `manifest.json` + `sw.js`, artinya sudah menjadi
**PWA (Progressive Web App)**:

- Di Chrome Android, setelah situs dibuka 1–2 kali, akan muncul prompt
  **"Tambahkan ke layar utama" / "Instal aplikasi"** secara otomatis.
  Pengguna juga bisa memicunya manual lewat menu (⋮) → **Instal aplikasi**.
- Setelah diinstal, ikon muncul di home screen, terbuka tanpa address bar
  (seperti app biasa), dan bisa dibuka walau koneksi lemah (berkat `sw.js`).

**Catatan penting soal "jadi APK":**
PWA **bukan** file `.apk` yang bisa diklik-instal manual di luar Play Store —
ia terpasang lewat browser seperti di atas, dan itu sudah cukup untuk
pengalaman "seperti aplikasi terinstal". Jika Anda betul-betul butuh file
`.apk`/`.aab` (misalnya untuk diunggah ke Google Play Store), langkah
tambahannya:

1. Gunakan **[PWABuilder.com](https://www.pwabuilder.com)** — masukkan URL
   situs Cloudflare Pages Anda, klik **Package for stores → Android**, ia
   akan membungkus PWA ini menjadi APK/AAB (teknologi **TWA — Trusted Web
   Activity**) secara otomatis.
2. Atau pakai **Bubblewrap CLI** dari Google jika ingin kontrol build manual.

Kedua cara ini tidak perlu menulis ulang kode — mereka membungkus PWA yang
sudah dibuat di sini.

## 6. Menyesuaikan tampilan

- Warna & tipografi: ubah variabel di bagian `:root` pada `style.css`.
- Logo/avatar: ganti isi `.brand-avatar` di `index.html` dengan `<img>` jika punya logo asli.
- Ikon aplikasi: ganti `icons/icon-192.png` dan `icons/icon-512.png` dengan logo resmi (ukuran sama).

## 7. Fitur aksesibilitas yang tersedia

| Fitur | Jenis |
|---|---|
| Ukuran Teks (4 level) | Cycle |
| Spasi Teks (3 level) | Cycle |
| Tinggi Garis (3 level) | Cycle |
| Perataan Teks | Cycle |
| Ramah Disleksia | Toggle |
| Kontras Tinggi | Toggle |
| Kejenuhan Warna (grayscale) | Toggle |
| Sembunyikan Gambar | Toggle |
| Jeda Animasi | Toggle |
| Sorot Tautan | Toggle |
| Kursor Besar | Toggle |
| Panduan Baca (outline saat hover/focus) | Toggle |

Semua pengaturan disimpan di `localStorage` perangkat pengguna, jadi
preferensi tetap tersimpan di kunjungan berikutnya. Tersedia juga tombol
**"Atur Ulang Semua"** di dalam panel.
