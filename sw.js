/* Service worker: cache aset inti agar aplikasi bisa di-"instal"
   (Add to Home Screen) dan tetap terbuka saat koneksi lemah/offline.

   PENTING: setiap kali kamu mengubah file (html/css/js), naikkan angka
   di CACHE_NAME (v2 -> v3 -> dst) supaya versi lama otomatis dibersihkan
   dan pengguna dapat versi terbaru. Kalau lupa dinaikkan, perubahan bisa
   tidak langsung terlihat karena masih memakai cache lama. */

const CACHE_NAME = "portal-tautan-v2";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .catch((err) => console.warn("Gagal cache sebagian aset saat install:", err))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Hanya tangani GET ke http/https — biarkan request lain (POST, chrome-extension://, dll)
  // ditangani browser secara normal, jangan diintervensi sama sekali.
  if (req.method !== "GET" || !req.url.startsWith("http")) return;

  const isApiCall = req.url.includes("script.google.com");

  if (isApiCall) {
    // Data tautan: selalu coba jaringan dulu (biar terbaru). Kalau gagal,
    // pakai cache. Kalau cache juga kosong, balas JSON kosong yang VALID
    // (bukan undefined) supaya frontend jatuh ke FALLBACK_LINKS dengan mulus.
    event.respondWith(
      fetch(req).catch(() =>
        caches.match(req).then((cached) =>
          cached || new Response("[]", { headers: { "Content-Type": "application/json" } })
        )
      )
    );
    return;
  }

  // Aset situs (html/css/js/ikon): coba jaringan dulu supaya selalu dapat
  // versi terbaru, simpan ke cache untuk cadangan offline, dan kalau
  // jaringan gagal baru pakai cache. Untuk navigasi halaman, kalau cache
  // juga tidak ada, fallback terakhir ke index.html dari cache — TIDAK
  // PERNAH membalas dengan respons kosong.
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok) {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone)).catch(() => {});
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((cached) => {
          if (cached) return cached;
          if (req.mode === "navigate") {
            return caches.match("./index.html").then((fallback) => fallback || Response.error());
          }
          return Response.error();
        })
      )
  );
});
