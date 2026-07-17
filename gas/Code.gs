/**
 * PORTAL TAUTAN — Backend Google Apps Script (versi auto-generate Sheet)
 * -----------------------------------------------------------------------
 * Versi ini TIDAK butuh kamu membuat Google Sheet secara manual.
 * Script ini yang akan membuat spreadsheet-nya sendiri, membuat sheet
 * "Links", lalu mengisinya dengan data tautan bawaan (DEFAULT_LINKS
 * di bawah) — kamu tinggal jalankan satu fungsi sekali saja.
 *
 * CARA PAKAI (ringkas — panduan lengkap ada di PANDUAN-PUBLISH.md)
 * 1. Buka script.google.com -> New project (TIDAK perlu buka Google
 *    Sheet dulu, project ini berdiri sendiri / standalone).
 * 2. Hapus kode default, tempel seluruh isi file ini.
 * 3. Di toolbar atas, pilih fungsi "setupSheet" dari dropdown, klik "Run".
 * 4. Setujui izin akses (Authorize access) saat diminta.
 * 5. Buka menu "Executions" / lihat log di bawah editor -> akan muncul
 *    URL spreadsheet yang baru dibuat. Klik untuk membukanya — di situ
 *    kamu bisa edit/tambah/hapus tautan kapan saja.
 * 6. Deploy -> New deployment -> Web app -> Execute as: Me ->
 *    Who has access: Anyone -> Deploy. Salin URL /exec ke app.js (API_URL).
 * -----------------------------------------------------------------------
 */

const SHEET_NAME = "Links";
const HEADERS = ["Kategori", "Judul", "Deskripsi", "URL", "Ikon", "Urutan", "Aktif"];

/**
 * Data tautan bawaan UP PMPTSP Kecamatan Pesanggrahan.
 * Ubah/tambah/hapus baris di sini kalau mau data awal berbeda —
 * ini hanya dipakai sekali saat setupSheet() / resetToDefaultData()
 * dijalankan. Setelah spreadsheet ada, edit sehari-hari dilakukan
 * langsung di Google Sheet-nya, bukan di sini.
 */
const DEFAULT_LINKS = [
  { kategori: "Profil & Kebijakan Mutu", judul: "Profil PTSP", deskripsi: "Dokumen resmi", url: "https://drive.google.com/file/d/1nnSjc0nV_c0q3xv6QeQBxNuEG0-WVvyU/view?usp=sharing", ikon: "🏢", urutan: 1, aktif: true },
  { kategori: "Profil & Kebijakan Mutu", judul: "Visi Misi", deskripsi: "Dokumen resmi", url: "https://drive.google.com/file/d/17ktke6gHc01Rdm1ysb_YHgFIMMyRPRoa/view?usp=sharing", ikon: "🎯", urutan: 2, aktif: true },
  { kategori: "Profil & Kebijakan Mutu", judul: "Maklumat Pelayanan", deskripsi: "Dokumen resmi", url: "https://drive.google.com/file/d/1VJzaZoDxjC0Qi3r0XBSd0NIYEJRPYrSq/view?usp=sharing", ikon: "📜", urutan: 3, aktif: true },
  { kategori: "Profil & Kebijakan Mutu", judul: "Kebijakan Mutu", deskripsi: "Dokumen resmi", url: "https://drive.google.com/file/d/1IV-yOnMZkDtRUFYRkHe8EcbQvMKwj8hK/view?usp=sharing", ikon: "✅", urutan: 4, aktif: true },
  { kategori: "Profil & Kebijakan Mutu", judul: "Budaya Kerja", deskripsi: "Dokumen resmi", url: "https://drive.google.com/file/d/1fAnIPq3EvWanlYmr28uVWzvcFylu9rlR/view?usp=drive_link", ikon: "🤝", urutan: 5, aktif: true },
  { kategori: "Profil & Kebijakan Mutu", judul: "Tata Nilai PTSP", deskripsi: "Dokumen resmi", url: "https://drive.google.com/file/d/1Q28OCCNoYx4Xlw6iKHZe94FtLTCSeqDU/view?usp=sharing", ikon: "⭐", urutan: 6, aktif: true },
  { kategori: "Profil & Kebijakan Mutu", judul: "Pelaksanaan Kode Etik Penyelenggaraan PTSP", deskripsi: "Dokumen resmi", url: "https://drive.google.com/file/d/1OtSigHTPlmPTR1lKh5jaaHmclqbZ9Kp4/view?usp=sharing", ikon: "⚖️", urutan: 7, aktif: true },
  { kategori: "Profil & Kebijakan Mutu", judul: "Pakta Integritas", deskripsi: "Dokumen resmi", url: "https://drive.google.com/file/d/18ic5FJmfWZDA4ssemNCPn51sm9shMveZ/view?usp=sharing", ikon: "🖋️", urutan: 8, aktif: true },
  { kategori: "Profil & Kebijakan Mutu", judul: "Struktur Organisasi UP PMPTSP Kecamatan Pesanggrahan", deskripsi: "Dokumen resmi", url: "https://drive.google.com/file/d/1aKDF75hO2ad0kVELaCaWEyiHD8e4CQj2/view?usp=sharing", ikon: "🗂️", urutan: 9, aktif: true },

  { kategori: "Layanan Perizinan", judul: "Alur Proses Perizinan Makro", deskripsi: "Dokumen resmi", url: "https://drive.google.com/file/d/1YRff_bRNR74RMVXBbr8ufpR6QHR6u3uU/view?usp=sharing", ikon: "🔄", urutan: 10, aktif: true },
  { kategori: "Layanan Perizinan", judul: "Standar Pelayanan UP PMPTSP Kecamatan Pesanggrahan", deskripsi: "Dokumen resmi", url: "https://drive.google.com/file/d/1p8AapbL1coRxWEKtvUB9ddnQ_fHkw50l/view?usp=sharing", ikon: "📋", urutan: 11, aktif: true },
  { kategori: "Layanan Perizinan", judul: "Penyesuaian Pelaksanaan Perizinan dan Non Perizinan di Lingkungan DPMPTSP", deskripsi: "Folder Google Drive", url: "https://drive.google.com/drive/folders/1AuRZc7hJ1q7uHg1Os9q4sHp-3LB24nUd?usp=sharing", ikon: "🔧", urutan: 12, aktif: true },
  { kategori: "Layanan Perizinan", judul: "SOP Penerbitan Izin / Non Izin", deskripsi: "Folder Google Drive", url: "https://drive.google.com/drive/folders/1Yxptmjv9TxHHrjkVUvCL1pkekdK-JJO7", ikon: "📘", urutan: 13, aktif: true },
  { kategori: "Layanan Perizinan", judul: "SOP Pencabutan", deskripsi: "Dokumen resmi", url: "https://drive.google.com/file/d/1dn5ZDgkIomdNgvt_YCH4dC4I3u4pLLyX/view", ikon: "📕", urutan: 14, aktif: true },
  { kategori: "Layanan Perizinan", judul: "Cek Persyaratan Izin", deskripsi: "Mal Pelayanan Publik Digital DKI Jakarta", url: "https://pelayanan.jakarta.go.id/mpp-digital", ikon: "🔍", urutan: 15, aktif: true },
  { kategori: "Layanan Perizinan", judul: "Panduan LKPM Online", deskripsi: "Dokumen resmi", url: "https://drive.google.com/file/d/1MRZg8FJygBZV7JULfkG5XaZwAIzZZ2sB/view?usp=sharing", ikon: "📗", urutan: 16, aktif: true },
  { kategori: "Layanan Perizinan", judul: "Layanan Jasa Desain Gambar Arsitektur Gratis", deskripsi: "Dokumen resmi", url: "https://drive.google.com/file/d/1kqpIcgGpyjJ2nvgUDLpjRfWvY9m7fvsV/view?usp=sharing", ikon: "📐", urutan: 17, aktif: true },

  { kategori: "Sistem & Aplikasi Online", judul: "JAKEVO", deskripsi: "Sistem elektronik Pemprov DKI Jakarta", url: "http://jakevo.jakarta.go.id/", ikon: "💻", urutan: 18, aktif: true },
  { kategori: "Sistem & Aplikasi Online", judul: "OSS - Sistem Perizinan Berusaha (KBLI)", deskripsi: "Online Single Submission", url: "https://oss.go.id/", ikon: "🏛️", urutan: 19, aktif: true },
  { kategori: "Sistem & Aplikasi Online", judul: "Pesan Petugas AJIB (Antar Jemput Izin Bermotor)", deskripsi: "dpmptsp-jkt.com", url: "https://dpmptsp-jkt.com/", ikon: "🏍️", urutan: 20, aktif: true },

  { kategori: "Konsultasi & Pengaduan", judul: "Alur Pelayanan Konsultasi dan Pengaduan", deskripsi: "Dokumen resmi", url: "https://drive.google.com/file/d/1mIcFape2Kj7rNYC8SnAWkAmAvH4_kirc/view?usp=sharing", ikon: "🗣️", urutan: 21, aktif: true },
  { kategori: "Konsultasi & Pengaduan", judul: "WhatsApp Konsultasi", deskripsi: "Chat langsung dengan petugas", url: "https://api.whatsapp.com/message/Y4HLXQEAAKONJ1?autoload=1&app_absent=0", ikon: "💬", urutan: 22, aktif: true },
  { kategori: "Konsultasi & Pengaduan", judul: "Instagram", deskripsi: "@ptsp.kec.pesanggrahan", url: "https://www.instagram.com/ptsp.kec.pesanggrahan?igsh=bjZkNG5kMWUwZzYy", ikon: "📷", urutan: 23, aktif: true },

  { kategori: "Survei Kepuasan", judul: "Indeks Kepuasan Masyarakat", deskripsi: "Dokumen resmi", url: "https://drive.google.com/file/d/1oJCNiG4JIfZC3BWbA-qoA5-hrA0htWJS/view?usp=sharing", ikon: "📊", urutan: 24, aktif: true }
];

/* =========================================================================
   SETUP — jalankan sekali dari editor Apps Script (pilih fungsi ini di
   dropdown toolbar, lalu klik "Run")
   ========================================================================= */

/**
 * Membuat spreadsheet baru (kalau belum pernah dibuat sebelumnya oleh
 * script ini) beserta sheet "Links" dan mengisinya dengan DEFAULT_LINKS.
 * Aman dijalankan berkali-kali: kalau spreadsheet & datanya sudah ada,
 * fungsi ini TIDAK menimpa data yang sudah kamu ubah — hanya melapor lewat
 * log. Untuk sengaja mengembalikan ke data bawaan, pakai resetToDefaultData().
 */
function setupSheet() {
  const props = PropertiesService.getScriptProperties();
  let ssId = props.getProperty("SPREADSHEET_ID");
  let ss = null;

  if (ssId) {
    try {
      ss = SpreadsheetApp.openById(ssId);
    } catch (e) {
      ss = null; // ID tersimpan tapi spreadsheet-nya sudah tidak ada/dihapus
    }
  }

  if (!ss) {
    ss = SpreadsheetApp.create("Data Portal Tautan - dibuat otomatis");
    props.setProperty("SPREADSHEET_ID", ss.getId());
    Logger.log("Spreadsheet baru dibuat.");
  }

  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    // pakai sheet pertama yang otomatis ada di spreadsheet baru, ganti namanya
    sheet = ss.getSheets()[0];
    sheet.setName(SHEET_NAME);
  }

  if (sheet.getLastRow() < 1) {
    writeHeaderAndData_(sheet);
    Logger.log("Data bawaan (" + DEFAULT_LINKS.length + " tautan) berhasil ditulis.");
  } else {
    Logger.log("Sheet '" + SHEET_NAME + "' sudah berisi data — tidak ditimpa, supaya perubahanmu tidak hilang.");
  }

  Logger.log("========================================");
  Logger.log("Buka spreadsheet-nya di sini:");
  Logger.log(ss.getUrl());
  Logger.log("========================================");
  return ss.getUrl();
}

/**
 * Menghapus SEMUA isi sheet "Links" lalu menulis ulang dari DEFAULT_LINKS.
 * Jalankan manual kalau memang sengaja ingin kembali ke data bawaan
 * (misalnya data di sheet sudah kacau / salah edit).
 */
function resetToDefaultData() {
  const ss = getSpreadsheet_();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  sheet.clearContents();
  writeHeaderAndData_(sheet);
  Logger.log("Data dikembalikan ke bawaan (" + DEFAULT_LINKS.length + " tautan).");
  Logger.log("Spreadsheet: " + ss.getUrl());
}

/** Menampilkan lagi URL spreadsheet yang sudah dibuat, kapan pun dibutuhkan. */
function showSheetUrl() {
  const ss = getSpreadsheet_();
  Logger.log(ss.getUrl());
  return ss.getUrl();
}

function writeHeaderAndData_(sheet) {
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight("bold");
  const rows = DEFAULT_LINKS.map(r => [r.kategori, r.judul, r.deskripsi, r.url, r.ikon, r.urutan, r.aktif]);
  if (rows.length) {
    sheet.getRange(2, 1, rows.length, HEADERS.length).setValues(rows);
  }
  sheet.setFrozenRows(1);
  sheet.autoResizeColumns(1, HEADERS.length);
}

function getSpreadsheet_() {
  const props = PropertiesService.getScriptProperties();
  const ssId = props.getProperty("SPREADSHEET_ID");
  if (!ssId) {
    throw new Error("Spreadsheet belum dibuat. Jalankan fungsi setupSheet() dulu dari editor Apps Script (pilih di dropdown toolbar, klik Run).");
  }
  return SpreadsheetApp.openById(ssId);
}

/* =========================================================================
   WEB APP ENDPOINT — dipanggil otomatis oleh frontend (app.js)
   ========================================================================= */

function doGet(e) {
  const data = getLinksGroupedByCategory_();
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getLinksGroupedByCategory_() {
  const ss = getSpreadsheet_();
  const sheet = ss.getSheetByName(SHEET_NAME);
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
