# Maison Aurélia — Website Company Profile Premium

Website single-page premium untuk studio desain interior & lifestyle,
dibangun murni dengan **HTML5 + CSS3 + JavaScript (vanilla) + Bootstrap 5 + Bootstrap Icons**.
Tidak ada backend, database, atau framework lain — tinggal buka `index.html` di browser.

## Isi Folder

```
maison-aurelia/
├── index.html   → struktur halaman & seluruh konten section
├── style.css    → seluruh gaya visual, animasi, dark mode, responsive
├── script.js    → seluruh interaktivitas (navbar, filter, form, dll)
└── README.md    → file ini
```

## Cara Membuka

1. Ekstrak file ZIP ini.
2. Klik dua kali `index.html` — akan terbuka langsung di browser.
   (Tidak butuh server khusus. Untuk hasil terbaik, disarankan tetap
   terhubung internet karena font, ikon, Bootstrap, dan gambar contoh
   dimuat dari CDN/layanan gambar publik.)

## Bagian yang Wajib Anda Ganti Sebelum Publish

- **Nomor WhatsApp**: cari `6281234567890` di `index.html` dan `script.js`,
  ganti dengan nomor WhatsApp bisnis Anda (format `62xxxxxxxxxx` tanpa tanda `+`).
- **Email & alamat**: bagian "Kontak" dan "Footer" pada `index.html`.
- **Lokasi Google Maps**: ganti parameter `q=` pada src iframe di section Kontak.
- **Logo & nama brand**: cari `Maison Aurélia` / `Aurélia` bila ingin mengganti nama.
- **Gambar**: gambar produk/galeri saat ini memakai layanan placeholder
  `picsum.photos` (foto acak berkualitas tinggi, gratis dipakai untuk contoh).
  Ganti `src="https://picsum.photos/..."` dengan foto asli produk/proyek Anda.
- **Media sosial**: link `#` pada ikon Instagram/Facebook/TikTok/LinkedIn di
  navbar sidebar dan footer.

## Fitur yang Sudah Berfungsi

- Navbar melayang (glass effect) + mengecil saat scroll + scrollspy otomatis
- Sidebar/menu mobile dengan info kontak & jam operasional
- Mode gelap (dark mode) tersimpan otomatis di browser pengunjung
- Hero dengan efek mengetik, partikel, dan angka berjalan
- Kartu produk + modal detail + tombol tanya via WhatsApp otomatis
- Galeri dengan filter kategori + lightbox
- Artikel (12 artikel) dengan pencarian, filter kategori, dan pagination — 100% JavaScript, tanpa reload
- Testimoni slider otomatis, FAQ accordion, partner logo berjalan
- Form kontak dengan validasi + notifikasi toast
- Tombol kembali ke atas & tombol WhatsApp mengambang
- 100% responsif dari layar 320px hingga desktop lebar

## Catatan Jujur Soal Ukuran File

Brief awal meminta ukuran ZIP 1–10MB+. Kode pada proyek ini murni teks
(HTML/CSS/JS) dan sudah sangat lengkap secara fitur, sehingga ukurannya
wajar untuk kategori tersebut (lihat ukuran file ZIP yang dibagikan).
Menambah ukuran lebih jauh lagi biasanya berarti menambah file media
(gambar/video asli beresolusi tinggi) — bukan padding kode kosong,
karena itu justru akan memperlambat website (bertentangan dengan
requirement "cepat & ringan" di brief itu sendiri). Jika Anda ingin
menaikkan ukuran secara berarti, cara paling wajar adalah mengganti
gambar placeholder dengan foto produk/proyek asli beresolusi tinggi.
