# NeighborLink

## Instansi
Politeknik Siber dan Sandi Negara

## Anggota Tim
- Ketua        : Jovan Diego Benedictus Situngkir
  - Anggota 1: Johanes Enda Panahatan Simorangkir
  - Anggota 2: Jonathan Kevin Binsar Pangaribuan

## Deskripsi Karya
NeighborLink lahir dari keresahan akan isolasi sosial di lingkungan tempat tinggal modern: tetangga yang tinggal berdampingan tapi jarang benar-benar saling mengenal, sementara banyak kebutuhan sehari-hari warga — mulai dari bantuan tenaga, keahlian, sampai sekadar teman bicara — sebenarnya bisa dipenuhi oleh tetangga sendiri jika saja ada ruang yang mempertemukan mereka.

Alih-alih dashboard komunitas yang datar, NeighborLink dibangun sebagai desa digital 3D yang bisa dijelajahi secara bebas. Seluruh situs hidup dalam satu dunia Three.js yang persisten: setiap "halaman" (Beranda, Tentang, Jelajahi Desa, Kontak) adalah destinasi kamera yang terbang sinematik, bukan reload halaman biasa. Di dalam desa, 40+ warga punya cerita, kebutuhan, dan rekomendasi pencocokan relawan masing-masing, sehingga menjelajah desa terasa seperti benar-benar berkeliling dan mengenal tetangga — bukan sekadar mengisi form.

Tujuan utama pembuatan sistem ini adalah menurunkan hambatan sosial untuk saling membantu antartetangga: mempermudah warga menemukan siapa di sekitarnya yang butuh bantuan, apa bantuan itu, dan bagaimana cara terlibat — baik merespons kebutuhan spesifik seseorang maupun mendaftar sebagai relawan umum sesuai minat.

Manfaat yang dihadirkan bagi masyarakat mencakup: mempercepat pertemuan antara warga yang butuh bantuan dengan warga yang mampu membantu, memperkuat rasa memiliki terhadap lingkungan lewat pengenalan wajah dan cerita tetangga, serta menyediakan saluran pelaporan masalah lingkungan (sampah, jalan rusak, lampu mati, dll.) yang mudah diakses lewat dashboard warga.

## Tautan / Link Deploy Website
https://neighbor-link-eight.vercel.app/

---

<details>
<summary><strong>📖 Dokumentasi teknis & panduan penggunaan lengkap</strong></summary>

## 🖥️ Menjalankan di Komputer Sendiri

```bash
npm install     # pasang semua dependency
npm run dev     # jalankan server pengembangan
```

Buka `http://localhost:5173` di browser (disarankan Chrome/Edge versi terbaru untuk performa 3D terbaik).

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Jalankan server pengembangan (dengan hot-reload) |
| `npm run build` | Cek tipe (`tsc`) lalu build untuk produksi ke folder `dist/` |
| `npm run preview` | Pratinjau hasil build produksi secara lokal |
| `npm run lint` | Jalankan linter (Oxlint) |

---

## 📖 Cara Menggunakan

### 1. Beranda (`/`)
Gerbang desa saat matahari terbit. Scroll ke bawah untuk baca kenapa NeighborLink dibuat, lihat preview 6 fitur utama, dan testimoni warga. Ada dua tombol: **"Mulai Jelajahi"** (langsung ke mode jelajah bebas) dan **"Selengkapnya"** (ke halaman Tentang).

### 2. Tentang (`/about`)
Kamera terbang ke Pohon Harapan di sebelah Balai Desa. Berisi filosofi platform, masalah yang coba diselesaikan (isolasi sosial), cara kerja dalam 3 langkah, 5 nilai inti, dan statistik desa yang animatif.

### 3. Jelajahi Desa (`/explore`) — inti dari pengalaman ini
Ini mode bebas jelajah. Kontrolnya:

| Aksi | Kontrol |
| --- | --- |
| **Geser pandangan** | Klik-tahan lalu drag dengan mouse kiri (atau geser jari di layar sentuh) |
| **Zoom in/out** | Scroll mouse (atau cubit dua jari) |
| **Putar sedikit** | Klik-tahan mouse kanan lalu drag |
| **Buka cerita warga** | Klik ikon warga yang melayang di atas sebuah rumah |
| **Kembali ke tampilan desa** | Tekan `Esc`, atau klik tombol "Kembali ke Desa" |
| **Ubah waktu desa** | Klik badge fase hari (🌅/☀️/🌇/🌙) di pojok kanan atas — akan loncat ke fase berikutnya |
| **Saring karakter** | Klik salah satu chip kategori di bawah navbar (Warga, Fasilitas Umum, UMKM & Pasar, Jasa & Kerajinan, Transportasi, Keamanan) |

Arahkan kursor ke ikon warga untuk lihat nama singkatnya sebelum klik. Setiap ikon berdenyut pelan supaya kelihatan jelas mana yang bisa diklik.

- **Kiri layar** — panel ringkasan statistik desa, dengan tombol **"Gabung jadi Relawan"** langsung di situ.
- **Kanan bawah** — pelacak **"Progres Jelajah"**, menghitung berapa dari 40 warga yang sudah kamu temui, lengkap progress bar.

### 4. Kontak (`/contact`)
Kamera berhenti di Balai Desa saat senja. Ada form kontak (nama/email/pesan), kartu info kontak, FAQ yang bisa diklik untuk dibuka-tutup, dan link ke peta desa interaktif.

### 5. Masuk & Gabung Jadi Relawan
Klik **"Masuk"** di navigasi untuk login (form ini demo, tanpa server sungguhan):

```
Email    : demo@neighborlink.id
Password : neighbor123
```

Atau klik tombol **"Pakai akun demo"** di dalam form login untuk mengisi otomatis. Setelah login, form bantuan di mana pun akan otomatis terisi nama & emailmu.

Untuk jadi relawan ada dua jalur:
- **Dari cerita seorang warga** (tombol "Bantu {nama}" di panel cerita) — kamu akan lihat kartu tugas spesifiknya, lalu pilih kapan bisa bantu (Sekarang / Nanti sore / Besok pagi).
- **Umum** (tombol "Gabung Komunitas" di navigasi atau panel info) — kamu pilih bidang minat (kategori yang sama seperti filter di peta).

Setelah submit, kamu akan diarahkan ke Dashboard.

### 6. Dashboard Warga (`/dashboard`, perlu login)
Muncul di menu dropdown nama kamu di navigasi setelah login. Berisi:
- **Feed Kegiatan** — update terbaru dari tetangga.
- **Obrolan Tetangga** — chat sederhana, klik nama kontak di kiri untuk ganti percakapan, ketik pesan lalu kirim.
- **Lapor Masalah Lingkungan** — form dengan kategori (sampah, jalan rusak, lampu mati, dll.), lokasi, dan deskripsi.

> Chat dan laporan di sini bersifat lokal di browser kamu (demo/mockup) — belum tersambung ke server sungguhan.

### 7. Journey (`/journey`) — bonus
Pengalaman sinematik alternatif yang digerakkan oleh scroll (bukan drag bebas), menampilkan perjalanan kamera melewati beberapa titik desa secara berurutan. Bisa diakses langsung lewat URL.

---

## 🧩 Fitur Lengkap

- **Dunia 3D persisten** — Canvas Three.js satu-satunya yang hidup terus di belakang seluruh navigasi, jadi pindah "halaman" terasa seperti kamera terbang, bukan reload.
- **Siklus siang–malam otomatis** — langit, arah & warna cahaya matahari, kabut, lentera jalan, jendela rumah yang menyala, dan kunang-kunang semuanya berubah mengikuti waktu (siklus penuh ±8 menit di mode Jelajahi Desa, atau dikunci di jam tertentu untuk tiap halaman: Beranda = pagi, Tentang = siang, Kontak = senja).
- **40+ karakter warga yang bisa diklik**, masing-masing dengan potret 3D berputar, nama, usia, pekerjaan, kutipan, kebutuhan spesifik, rekomendasi pencocokan relawan dari AI (jumlah relawan + estimasi waktu), dan dampak positifnya.
- **Filter kategori** untuk menyaring 40+ karakter berdasarkan bidang.
- **Progres jelajah** — pelacak "X/40 warga ditemui" di pojok kanan bawah, biar eksplorasi terasa seperti misi kecil, bukan cuma jalan-jalan tanpa arah.
- **Alur relawan kontekstual** — beda antara merespons kebutuhan spesifik seorang warga vs. mendaftar jadi relawan umum.
- **Login demo** dengan penyimpanan sesi di `localStorage`, plus dashboard warga pasca-login.
- **Peta desa yang padat & hidup** — lihat bagian "Isi Desa" di bawah.
- **Mode gelap** dan navigasi yang tetap terbaca di atas latar 3D apa pun.
- **Aksesibel dari HP/tablet** — kontrol drag & zoom bekerja dengan sentuhan.

## 🏘️ Isi Desa

| Elemen | Jumlah / Detail |
| --- | --- |
| Rumah | 60+ rumah unik, 1–2 lantai, tersebar di seluruh area dalam pagar |
| Warga berlalu-lalang | 75+ figur animasi (jalan/idle/interaksi) di jalan dan halaman rumah |
| Karakter cerita | 40+ warga dengan cerita, tersebar merata di antara rumah-rumah |
| Sungai | 2 — mengalir di sisi timur dan barat desa, masing-masing dengan jembatan kayu |
| Sawah | 4 petak besar di luar pagar + 1 petak kecil di dalam |
| Pagar desa | Cincin melingkar penuh mengelilingi pusat desa, dengan 3 gerbang (utama, & dua jalur sungai) |
| Gerbang utama | Menghadap ke arah kamera default, dengan papan nama "Harmony Village", lentera, dan pos jaga |
| Jalan | Jaringan jalan tanah (bukan rumput polos) menghubungkan setiap klaster rumah ke pusat desa |
| Lentera | Menyala otomatis di malam hari — di sepanjang jalan & pagar |
| Hutan | Dua cincin pohon mengelilingi seluruh luar pagar desa |
| Hewan | Kucing, anjing, burung, kupu-kupu, kunang-kunang (malam hari) |
| Bangunan ikonik | Balai Desa, Puskesmas, Sekolah Dasar, Pasar Desa, Taman Desa, Community Farm, Pohon Harapan, Kincir Angin |
| Properti kecil | Bangku, sepeda, kebun mini, taman bermain, air mancur |

<details>
<summary><strong>👥 Lihat semua 40 karakter & pekerjaannya</strong></summary>

| Nama | Pekerjaan |
| --- | --- |
| Pak Budi | Petani Pensiunan |
| Bu Ani | Penjahit Pensiunan |
| Pak Andi | Guru SD |
| Bu Sari | Perawat Desa |
| Pak Slamet | Kepala Desa |
| Bu Wati | Pedagang Pasar |
| Dimas | Pelajar & Relawan Taman |
| Pak Joko | Petani Komunitas |
| Bu Yuli | Sesepuh Desa |
| Pak Tono | Penjaga Kincir Angin |
| Kang Dedi | Nelayan & Penjaga Sungai |
| Pak Karim | Tukang Cukur |
| Bu Siti | Penjahit |
| Pak Herman | Tukang Servis Elektronik |
| Bang Rudi | Montir Bengkel |
| Bu Nani | Tukang Cuci (Laundry) |
| Pak Wawan | Petugas Kebersihan |
| Pak Maman | Tukang Sol Sepatu |
| Pak Ateng | Tukang Pangkas Rumput & Kebun |
| Pak Iwan | Tukang Bangunan |
| Bang Yanto | Kuli Bangunan |
| Pak Dadang | Tukang Sumur & Sedot WC |
| Pak Asep | Pengrajin Mebel |
| Pak Ujang | Tukang Aluminium & Kanopi |
| Bu Farida | Pedagang Sayur & Bumbu |
| Pak Komar | Pedagang Kaki Lima |
| Bu Ida | Pemilik Warung Makan |
| Mira | Penjaga Toko Kelontong |
| Pak Bambang | Sales Keliling |
| Pak Rusdi | Pengrajin Tahu & Tempe |
| Pak Herry | Sopir Angkot |
| Bang Fajar | Driver Ojek & Kurir Online |
| Pak Anwar | Kernet / Kondektur |
| Pak Didin | Tukang Parkir |
| Bang Sobirin | Ojek Payung |
| Pak Jajang | Buruh Angkut / Kuli Panggul |
| Pak Gunawan | Satpam |
| Pak Warsito | Hansip / Linmas |
| Bripka Yusuf | Polisi (Bhabinkamtibmas) |
| Pak Solihin | Penjaga Perlintasan (Swakarsa) |

</details>

---

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

Model 3D low-poly dari [Kenney](https://kenney.nl) (CC0 — bebas pakai).

</details>
