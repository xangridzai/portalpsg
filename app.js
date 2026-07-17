/* =========================================================================
   PORTAL TAUTAN — app.js
   1. LINKS_CONFIG   -> data tautan (ganti API_URL untuk pakai Google Sheet)
   2. A11Y_FEATURES  -> definisi setiap fitur di panel aksesibilitas
   3. Renderer + Accessibility Engine (localStorage-backed)
   ========================================================================= */

/* -------------------------------------------------------------------------
   1) SUMBER DATA TAUTAN
   -------------------------------------------------------------------------
   Ganti API_URL dengan URL "Web App" hasil deploy Google Apps Script
   (lihat gas/Code.gs). Jika API_URL kosong / gagal diakses, aplikasi akan
   memakai FALLBACK_LINKS di bawah supaya halaman tetap berfungsi.
------------------------------------------------------------------------- */
const API_URL = "https://script.google.com/macros/s/AKfycbxcpecbFB-qO8C5AzzoGQj2zH3tmMqbIbFVv_eylbRK-sSJY_3k2g8gSbkzIBAoMEwq/exec"; // contoh: "https://script.google.com/macros/s/AKfycbxcpecbFB-qO8C5AzzoGQj2zH3tmMqbIbFVv_eylbRK-sSJY_3k2g8gSbkzIBAoMEwq/exec"

const FALLBACK_LINKS = [
  {
    category: "Profil & Kebijakan Mutu",
    items: [
      { title: "Profil PTSP", desc: "Dokumen resmi", url: "https://drive.google.com/file/d/1nnSjc0nV_c0q3xv6QeQBxNuEG0-WVvyU/view?usp=sharing", icon: "🏢" },
      { title: "Visi Misi", desc: "Dokumen resmi", url: "https://drive.google.com/file/d/17ktke6gHc01Rdm1ysb_YHgFIMMyRPRoa/view?usp=sharing", icon: "🎯" },
      { title: "Maklumat Pelayanan", desc: "Dokumen resmi", url: "https://drive.google.com/file/d/1VJzaZoDxjC0Qi3r0XBSd0NIYEJRPYrSq/view?usp=sharing", icon: "📜" },
      { title: "Kebijakan Mutu", desc: "Dokumen resmi", url: "https://drive.google.com/file/d/1IV-yOnMZkDtRUFYRkHe8EcbQvMKwj8hK/view?usp=sharing", icon: "✅" },
      { title: "Budaya Kerja", desc: "Dokumen resmi", url: "https://drive.google.com/file/d/1fAnIPq3EvWanlYmr28uVWzvcFylu9rlR/view?usp=drive_link", icon: "🤝" },
      { title: "Tata Nilai PTSP", desc: "Dokumen resmi", url: "https://drive.google.com/file/d/1Q28OCCNoYx4Xlw6iKHZe94FtLTCSeqDU/view?usp=sharing", icon: "⭐" },
      { title: "Pelaksanaan Kode Etik Penyelenggaraan PTSP", desc: "Dokumen resmi", url: "https://drive.google.com/file/d/1OtSigHTPlmPTR1lKh5jaaHmclqbZ9Kp4/view?usp=sharing", icon: "⚖️" },
      { title: "Pakta Integritas", desc: "Dokumen resmi", url: "https://drive.google.com/file/d/18ic5FJmfWZDA4ssemNCPn51sm9shMveZ/view?usp=sharing", icon: "🖋️" },
      { title: "Struktur Organisasi UP PMPTSP Kecamatan Pesanggrahan", desc: "Dokumen resmi", url: "https://drive.google.com/file/d/1aKDF75hO2ad0kVELaCaWEyiHD8e4CQj2/view?usp=sharing", icon: "🗂️" }
    ]
  },
  {
    category: "Layanan Perizinan",
    items: [
      { title: "Alur Proses Perizinan Makro", desc: "Dokumen resmi", url: "https://drive.google.com/file/d/1YRff_bRNR74RMVXBbr8ufpR6QHR6u3uU/view?usp=sharing", icon: "🔄" },
      { title: "Standar Pelayanan UP PMPTSP Kecamatan Pesanggrahan", desc: "Dokumen resmi", url: "https://drive.google.com/file/d/1p8AapbL1coRxWEKtvUB9ddnQ_fHkw50l/view?usp=sharing", icon: "📋" },
      { title: "Penyesuaian Pelaksanaan Perizinan dan Non Perizinan di Lingkungan DPMPTSP", desc: "Folder Google Drive", url: "https://drive.google.com/drive/folders/1AuRZc7hJ1q7uHg1Os9q4sHp-3LB24nUd?usp=sharing", icon: "🔧" },
      { title: "SOP Penerbitan Izin / Non Izin", desc: "Folder Google Drive", url: "https://drive.google.com/drive/folders/1Yxptmjv9TxHHrjkVUvCL1pkekdK-JJO7", icon: "📘" },
      { title: "SOP Pencabutan", desc: "Dokumen resmi", url: "https://drive.google.com/file/d/1dn5ZDgkIomdNgvt_YCH4dC4I3u4pLLyX/view", icon: "📕" },
      { title: "Cek Persyaratan Izin", desc: "Mal Pelayanan Publik Digital DKI Jakarta", url: "https://pelayanan.jakarta.go.id/mpp-digital", icon: "🔍" },
      { title: "Panduan LKPM Online", desc: "Dokumen resmi", url: "https://drive.google.com/file/d/1MRZg8FJygBZV7JULfkG5XaZwAIzZZ2sB/view?usp=sharing", icon: "📗" },
      { title: "Layanan Jasa Desain Gambar Arsitektur Gratis", desc: "Dokumen resmi", url: "https://drive.google.com/file/d/1kqpIcgGpyjJ2nvgUDLpjRfWvY9m7fvsV/view?usp=sharing", icon: "📐" }
    ]
  },
  {
    category: "Sistem & Aplikasi Online",
    items: [
      { title: "JAKEVO", desc: "Sistem elektronik Pemprov DKI Jakarta", url: "http://jakevo.jakarta.go.id/", icon: "💻" },
      { title: "OSS - Sistem Perizinan Berusaha (KBLI)", desc: "Online Single Submission", url: "https://oss.go.id/", icon: "🏛️" },
      { title: "Pesan Petugas AJIB (Antar Jemput Izin Bermotor)", desc: "dpmptsp-jkt.com", url: "https://dpmptsp-jkt.com/", icon: "🏍️" }
    ]
  },
  {
    category: "Konsultasi & Pengaduan",
    items: [
      { title: "Alur Pelayanan Konsultasi dan Pengaduan", desc: "Dokumen resmi", url: "https://drive.google.com/file/d/1mIcFape2Kj7rNYC8SnAWkAmAvH4_kirc/view?usp=sharing", icon: "🗣️" },
      { title: "WhatsApp Konsultasi", desc: "Chat langsung dengan petugas", url: "https://api.whatsapp.com/message/Y4HLXQEAAKONJ1?autoload=1&app_absent=0", icon: "💬" },
      { title: "Instagram", desc: "@ptsp.kec.pesanggrahan", url: "https://www.instagram.com/ptsp.kec.pesanggrahan?igsh=bjZkNG5kMWUwZzYy", icon: "📷" }
    ]
  },
  {
    category: "Survei Kepuasan",
    items: [
      { title: "Indeks Kepuasan Masyarakat", desc: "Dokumen resmi", url: "https://drive.google.com/file/d/1oJCNiG4JIfZC3BWbA-qoA5-hrA0htWJS/view?usp=sharing", icon: "📊" }
    ]
  }
];

/* -------------------------------------------------------------------------
   2) DEFINISI FITUR AKSESIBILITAS
   type: "cycle"  -> menekan tombol memutar ke level berikutnya (mis. ukuran teks)
   type: "toggle" -> menekan tombol hanya on/off
------------------------------------------------------------------------- */
const ICONS = {
  textSize: '<path d="M4 7V5h11v2"/><path d="M9.5 5v14"/><path d="M7 19h5"/><path d="M15 13l3.5-3.5L22 13"/><path d="M18.5 9.5V19"/>',
  spacing: '<path d="M3 12h4"/><path d="M17 12h4"/><path d="M9 8l-3 4 3 4"/><path d="M15 8l3 4-3 4"/>',
  lineHeight: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/><path d="M2 6l0 0"/>',
  align: '<path d="M4 6h16"/><path d="M4 12h10"/><path d="M4 18h16"/>',
  dyslexia: '<path d="M6 4v16"/><path d="M6 4h6a4 4 0 0 1 0 8H6"/><path d="M6 12h7a4 4 0 0 1 0 8H6"/>',
  contrast: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" stroke="none"/>',
  saturation: '<path d="M12 3c3.5 4 6 7.2 6 10.5A6 6 0 0 1 6 13.5C6 10.2 8.5 7 12 3z"/>',
  hideImage: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 16l5-5 4 4 3-3 6 6"/><path d="M4 4l16 16"/>',
  pause: '<rect x="7" y="5" width="3" height="14" rx="1"/><rect x="14" y="5" width="3" height="14" rx="1"/>',
  link: '<path d="M9 15l6-6"/><path d="M10 6l1-1a4 4 0 0 1 6 6l-1 1"/><path d="M14 18l-1 1a4 4 0 0 1-6-6l1-1"/>',
  cursor: '<path d="M4 3l7 18 2.5-7.5L21 11z"/>',
  guide: '<rect x="3" y="4" width="18" height="4" rx="1"/><rect x="3" y="10" width="12" height="4" rx="1"/><rect x="3" y="16" width="16" height="4" rx="1"/>',
  reading: '<path d="M4 5c3-1.5 6-1.5 8 0v14c-2-1.5-5-1.5-8 0z"/><path d="M20 5c-3-1.5-6-1.5-8 0v14c2-1.5 5-1.5 8 0z"/>'
};

const A11Y_FEATURES = [
  {
    id: "fontSize", type: "cycle", icon: ICONS.textSize, label: "Ukuran Teks",
    levels: [1, 1.15, 1.3, 1.45], levelNames: ["Normal", "Besar", "Lebih Besar", "Terbesar"],
    apply: (root, level) => root.style.setProperty("--a11y-font-scale", A11Y_FEATURES[0].levels[level])
  },
  {
    id: "spacing", type: "cycle", icon: ICONS.spacing, label: "Spasi Teks",
    levels: [0, 0.03, 0.06], levelNames: ["Normal", "Lebar", "Lebih Lebar"],
    apply: (root, level) => {
      const f = A11Y_FEATURES.find(x => x.id === "spacing");
      root.style.setProperty("--a11y-letter-spacing", f.levels[level] + "em");
      root.style.setProperty("--a11y-word-spacing", (f.levels[level] * 3) + "em");
    }
  },
  {
    id: "lineHeight", type: "cycle", icon: ICONS.lineHeight, label: "Tinggi Garis",
    levels: [1.55, 1.9, 2.2], levelNames: ["Normal", "Renggang", "Sangat Renggang"],
    apply: (root, level) => root.style.setProperty("--a11y-line-height", A11Y_FEATURES.find(x => x.id === "lineHeight").levels[level])
  },
  {
    id: "align", type: "cycle", icon: ICONS.align, label: "Perataan Teks",
    levels: ["left", "justify"], levelNames: ["Kiri", "Rata Kiri-Kanan"],
    apply: (root, level) => root.style.setProperty("--a11y-text-align", A11Y_FEATURES.find(x => x.id === "align").levels[level])
  },
  {
    id: "dyslexia", type: "toggle", icon: ICONS.dyslexia, label: "Ramah Disleksia", cls: "a11y-dyslexia"
  },
  {
    id: "contrast", type: "toggle", icon: ICONS.contrast, label: "Kontras Tinggi", cls: "a11y-contrast"
  },
  {
    id: "desaturate", type: "toggle", icon: ICONS.saturation, label: "Kejenuhan Warna", cls: "a11y-desaturate"
  },
  {
    id: "hideImages", type: "toggle", icon: ICONS.hideImage, label: "Sembunyikan Gambar", cls: "a11y-hide-images"
  },
  {
    id: "pause", type: "toggle", icon: ICONS.pause, label: "Jeda Animasi", cls: "a11y-pause"
  },
  {
    id: "highlightLinks", type: "toggle", icon: ICONS.link, label: "Sorot Tautan", cls: "a11y-highlight-links"
  },
  {
    id: "bigCursor", type: "toggle", icon: ICONS.cursor, label: "Kursor Besar", cls: "a11y-big-cursor"
  },
  {
    id: "readingGuide", type: "toggle", icon: ICONS.guide, label: "Panduan Baca", cls: "a11y-reading-guide"
  }
];

const STORAGE_KEY = "portalA11ySettings";

/* -------------------------------------------------------------------------
   3) STATE
------------------------------------------------------------------------- */
function loadA11yState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore corrupted storage */ }
  const state = {};
  A11Y_FEATURES.forEach(f => { state[f.id] = f.type === "cycle" ? 0 : false; });
  return state;
}

function saveA11yState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* storage may be unavailable */ }
}

let a11yState = loadA11yState();

function applyA11yState() {
  const root = document.documentElement;
  A11Y_FEATURES.forEach(f => {
    if (f.type === "cycle") {
      f.apply(root, a11yState[f.id] || 0);
    } else {
      root.classList.toggle(f.cls, !!a11yState[f.id]);
    }
  });
}

/* -------------------------------------------------------------------------
   Render accessibility panel cards
------------------------------------------------------------------------- */
function renderA11yPanel() {
  const grid = document.getElementById("a11yGrid");
  grid.innerHTML = "";
  A11Y_FEATURES.forEach(f => {
    const isOn = f.type === "cycle" ? (a11yState[f.id] || 0) > 0 : !!a11yState[f.id];
    const stateLabel = f.type === "cycle" ? f.levelNames[a11yState[f.id] || 0] : (isOn ? "Aktif" : "Nonaktif");

    const card = document.createElement("button");
    card.type = "button";
    card.className = "a11y-card";
    card.setAttribute("aria-pressed", String(isOn));
    card.setAttribute("data-id", f.id);
    card.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${f.icon}</svg>
      <span class="label">${f.label}</span>
      <span class="state">${stateLabel}</span>
    `;
    card.addEventListener("click", () => {
      if (f.type === "cycle") {
        a11yState[f.id] = ((a11yState[f.id] || 0) + 1) % f.levels.length;
      } else {
        a11yState[f.id] = !a11yState[f.id];
      }
      saveA11yState(a11yState);
      applyA11yState();
      renderA11yPanel();
    });
    grid.appendChild(card);
  });
}

/* -------------------------------------------------------------------------
   Panel open / close
------------------------------------------------------------------------- */
const fab = document.getElementById("a11yFab");
const overlay = document.getElementById("a11yOverlay");
const panel = document.getElementById("a11yPanel");
const closeBtn = document.getElementById("a11yClose");
const resetBtn = document.getElementById("a11yReset");

function openPanel() {
  overlay.classList.add("open");
  panel.classList.add("open");
  panel.setAttribute("aria-hidden", "false");
  fab.setAttribute("aria-expanded", "true");
  closeBtn.focus();
  document.addEventListener("keydown", onPanelKeydown);
}
function closePanel() {
  overlay.classList.remove("open");
  panel.classList.remove("open");
  panel.setAttribute("aria-hidden", "true");
  fab.setAttribute("aria-expanded", "false");
  fab.focus();
  document.removeEventListener("keydown", onPanelKeydown);
}
function onPanelKeydown(e) {
  if (e.key === "Escape") closePanel();
}

fab.addEventListener("click", openPanel);
closeBtn.addEventListener("click", closePanel);
overlay.addEventListener("click", closePanel);
resetBtn.addEventListener("click", () => {
  a11yState = {};
  A11Y_FEATURES.forEach(f => { a11yState[f.id] = f.type === "cycle" ? 0 : false; });
  saveA11yState(a11yState);
  applyA11yState();
  renderA11yPanel();
});

/* -------------------------------------------------------------------------
   Render link list
------------------------------------------------------------------------- */
function renderLinks(categories) {
  const container = document.getElementById("link-container");
  container.innerHTML = "";

  if (!categories || !categories.length) {
    container.innerHTML = '<p class="state-msg">Belum ada tautan untuk ditampilkan.</p>';
    return;
  }

  categories.forEach(group => {
    const heading = document.createElement("h2");
    heading.className = "link-category";
    heading.textContent = group.category;
    container.appendChild(heading);

    const list = document.createElement("ul");
    list.className = "link-list";

    (group.items || []).forEach(item => {
      const li = document.createElement("li");
      li.className = "link-item";
      li.innerHTML = `
        <a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">
          <span class="link-icon" aria-hidden="true">${item.icon || "🔗"}</span>
          <span class="link-text">
            <span class="link-title">${escapeHtml(item.title)}</span>
            ${item.desc ? `<span class="link-desc">${escapeHtml(item.desc)}</span>` : ""}
          </span>
          <span class="link-arrow" aria-hidden="true">→</span>
        </a>
      `;
      list.appendChild(li);
    });

    container.appendChild(list);
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[s]));
}

/* -------------------------------------------------------------------------
   Load link data: coba API_URL (Google Apps Script), fallback ke data lokal
------------------------------------------------------------------------- */
async function loadLinks() {
  if (API_URL) {
    try {
      const res = await fetch(API_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("Gagal memuat dari API");
      const data = await res.json();
      renderLinks(data);
      return;
    } catch (err) {
      console.warn("Gagal memuat tautan dari API_URL, memakai data cadangan.", err);
    }
  }
  renderLinks(FALLBACK_LINKS);
}

/* -------------------------------------------------------------------------
   Init
------------------------------------------------------------------------- */
document.getElementById("year").textContent = new Date().getFullYear();
applyA11yState();
renderA11yPanel();
loadLinks();

/* Register service worker for installability (PWA) */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(err => console.warn("SW gagal didaftarkan:", err));
  });
}
