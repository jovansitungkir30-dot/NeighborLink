# 🏡 Harmony Village — NeighborLink

**Bukan website biasa — ini desa 3D yang bisa dijelajahi.** Dibuat untuk **TECHSOFT 2026 · Humanity OS**, NeighborLink adalah platform yang menghubungkan tetangga lewat sebuah desa digital interaktif: setiap rumah punya cerita, setiap warga punya kebutuhan, dan setiap klik bisa jadi awal dari bantuan nyata.

![Tech](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black) ![Tech](https://img.shields.io/badge/Three.js-r185-000000?logo=three.js&logoColor=white) ![Tech](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white) ![Tech](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)

---

## ✨ Apa yang bikin ini beda?

Alih-alih halaman-halaman terpisah, seluruh situs hidup dalam **satu dunia 3D yang persisten**. Navigasi (Beranda / Tentang / Jelajahi Desa / Kontak) bukan pindah halaman, melainkan kamera yang terbang sinematik dari satu sudut desa ke sudut lainnya — dunia 3D-nya sendiri tidak pernah reload.

- 🗺️ **Desa 3D bebas jelajah** — geser untuk berkeliling, scroll untuk zoom, klik bangunan untuk masuk ke ceritanya. Dibangun dengan React Three Fiber + `camera-controls`.
- 🌅 **Siklus siang-malam otomatis** — langit, pencahayaan, lentera jalan, jendela rumah, dan kunang-kunang semua berubah mengikuti waktu, lengkap dengan badge fase hari yang bisa diklik untuk loncat waktu manual.
- 👥 **40+ karakter warga yang bisa diklik** — dari Pak Budi si petani sampai tukang cukur, sopir angkot, dan satpam — masing-masing punya potret 3D, cerita, kebutuhan, dan rekomendasi relawan dari AI.
- 🔍 **Filter kategori** — Warga, Fasilitas Umum, UMKM & Pasar, Jasa & Kerajinan, Transportasi, Keamanan — biar 40+ titik cerita tetap mudah dijelajahi.
- 🏘️ **Desa yang benar-benar hidup** — 60+ rumah, sungai di dua sisi, sawah, pagar melingkar, gerbang utama, jaringan jalan tanah, 75+ warga berlalu-lalang, dan hutan mengelilingi seluruh desa.
- 💬 **Dashboard warga** — begitu login, ada feed kegiatan tetangga, chat antar warga, dan form lapor masalah lingkungan.
- 🙋 **Alur relawan yang bermakna** — klik "Bantu" di cerita seorang warga membuka form dengan konteks tugas + pilihan waktu, bukan sekadar form generik.
- 🌗 **Mendukung mode gelap** dan didesain responsif.

## 🖥️ Coba sendiri

```bash
npm install
npm run dev
```

Buka `http://localhost:5173` — mulai dari Beranda, lalu klik **Jelajahi Desa** untuk masuk ke mode bebas jelajah.

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Jalankan server pengembangan |
| `npm run build` | Type-check (`tsc`) lalu build produksi |
| `npm run preview` | Pratinjau hasil build |
| `npm run lint` | Jalankan linter (Oxlint) |

## 🧭 Peta Situs

| Halaman | Isi |
| --- | --- |
| **Beranda** (`/`) | Gerbang desa saat matahari terbit — hero, alasan kenapa NeighborLink penting, preview fitur, testimoni warga |
| **Tentang** (`/about`) | Di bawah Pohon Harapan — filosofi, nilai-nilai inti, cara kerja 3 langkah, statistik desa |
| **Jelajahi Desa** (`/explore`) | Mode bebas jelajah — 40+ karakter warga, filter kategori, siklus hari otomatis |
| **Kontak** (`/contact`) | Balai Desa saat senja — form kontak, FAQ, peta interaktif |
| **Dashboard** (`/dashboard`) | Ruang warga setelah login — feed kegiatan, chat, lapor masalah lingkungan |
| **Journey** (`/journey`) | Flythrough sinematik alternatif (easter egg, scroll-driven) |

## 🛠️ Tumpukan Teknologi

- **React 19** + **TypeScript** + **Vite**
- **React Three Fiber** & **drei** — render dan helper Three.js dalam React
- **Tailwind CSS** — styling
- **Framer Motion** — animasi UI
- **GSAP** (ScrollTrigger) + **Lenis** — smooth scroll di halaman `/journey`
- **React Router** — navigasi antar destinasi
- Model 3D dari **Kenney** (CC0) — lihat `public/models/*/LICENSE.txt`

## 📁 Struktur Proyek (ringkas)

```
src/
├─ pages/              # Setiap "destinasi" (Home, About, Explore, Contact, Dashboard, Journey)
├─ context/            # State global: dunia desa, autentikasi, modal gabung
├─ three/              # Kamera, pencahayaan, siklus hari, komponen 3D inti
│  ├─ scenes/          # Bangunan besar (Balai Desa, Community Farm, Pohon Harapan)
│  └─ world/           # Elemen desa (rumah, jalan, pagar, sungai, hewan, dst.)
├─ data/               # Konten: cerita warga, statistik, fitur
└─ components/         # Komponen UI & layout yang dipakai di halaman non-desa
```

## 🙌 Kredit

Model 3D low-poly dari [Kenney](https://kenney.nl) (CC0 — bebas pakai). Dibuat dengan bantuan [Claude Code](https://claude.com/claude-code).

---

*Technology Connects. Humanity Lives Here.*
