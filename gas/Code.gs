/**
 * PORTAL TAUTAN — Backend Google Apps Script
 * -----------------------------------------------------------------------
 * Fungsi: membaca daftar tautan dari Google Sheet lalu mengembalikannya
 * sebagai JSON, supaya isi tombol link bisa diedit lewat Spreadsheet
 * tanpa perlu mengubah kode frontend.
 *
 * CARA PAKAI
 * 1. Buat Google Sheet baru, beri nama sheet-nya "Links".
 * 2. Baris pertama = header, persis seperti ini (urutan bebas):
 *      Kategori | Judul | Deskripsi | URL | Ikon | Urutan | Aktif
 *    - Kategori : nama grup, mis. "Layanan Utama"
 *    - Judul    : teks tombol
 *    - Deskripsi: subteks kecil (boleh kosong)
 *    - URL      : tautan tujuan (wajib diawali https://)
 *    - Ikon     : satu emoji, mis. 🌐 📄 📷 (boleh kosong -> pakai 🔗)
 *    - Urutan   : angka untuk mengurutkan (boleh kosong)
 *    - Aktif    : TRUE / FALSE — baris FALSE tidak akan tampil
 * 3. Ekstensions -> Apps Script, tempel file ini sebagai Code.gs.
 * 4. Deploy -> New deployment -> Type: Web app
 *      - Execute as: Me
 *      - Who has access: Anyone
 *    Salin URL yang dihasilkan (diakhiri /exec).
 * 5. Tempel URL tersebut ke konstanta API_URL di app.js (frontend).
 * -----------------------------------------------------------------------
 */

const SHEET_NAME = "Links";

function doGet(e) {
  const data = getLinksGroupedByCategory_();
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getLinksGroupedByCategory_() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) return [];

  const values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];

  const headers = values[0].map(h => String(h).trim().toLowerCase());
  const idx = {
    kategori: headers.indexOf("kategori"),
    judul: headers.indexOf("judul"),
    deskripsi: headers.indexOf("deskripsi"),
    url: headers.indexOf("url"),
    ikon: headers.indexOf("ikon"),
    urutan: headers.indexOf("urutan"),
    aktif: headers.indexOf("aktif")
  };

  const rows = values.slice(1)
    .map(row => ({
      category: String(row[idx.kategori] || "Lainnya").trim(),
      title: String(row[idx.judul] || "").trim(),
      desc: String(row[idx.deskripsi] || "").trim(),
      url: String(row[idx.url] || "").trim(),
      icon: String(row[idx.ikon] || "🔗").trim(),
      order: idx.urutan > -1 && row[idx.urutan] !== "" ? Number(row[idx.urutan]) : 999,
      active: idx.aktif > -1 ? parseBoolean_(row[idx.aktif]) : true
    }))
    .filter(r => r.active && r.title && r.url);

  rows.sort((a, b) => a.order - b.order);

  const grouped = {};
  const orderOfCategories = [];
  rows.forEach(r => {
    if (!grouped[r.category]) {
      grouped[r.category] = [];
      orderOfCategories.push(r.category);
    }
    grouped[r.category].push({
      title: r.title,
      desc: r.desc,
      url: r.url,
      icon: r.icon
    });
  });

  return orderOfCategories.map(cat => ({ category: cat, items: grouped[cat] }));
}

function parseBoolean_(val) {
  if (typeof val === "boolean") return val;
  const s = String(val).trim().toLowerCase();
  return s === "true" || s === "1" || s === "ya" || s === "yes" || s === "";
}
