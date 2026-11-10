# EduStream Kids 🦉

Website video edukasi untuk anak usia **6–12 tahun**, dibuat dengan HTML, CSS, dan JavaScript murni. Tidak perlu database atau server khusus, jadi bisa di-hosting gratis. Iklan memakai **Adsterra**.

## Fitur

| Untuk anak | Untuk orang tua | Untuk pemilik situs |
|---|---|---|
| Tombol besar & warna cerah | Gerbang orang tua (soal hitungan) | Slot iklan Adsterra siap pakai |
| Maskot "Oli" si burung hantu | Batas waktu layar harian | Banner responsif otomatis (728/468/320) |
| Filter umur 6–8 & 9–12 | Ringkasan progres belajar | Iklan dimuat saat terlihat (lazy-load) |
| ⭐ Bintang & level saat menonton | Hapus data progres | Tambah video cukup edit 1 file |
| Kuis setelah video | Kebijakan privasi (template) | Multi-halaman (bagus untuk SEO & tayangan iklan) |
| Efek suara (bisa dimatikan) | | |

## Struktur file

```
index.html        Beranda
kategori.html     Jelajah, kategori, dan hasil pencarian (?c=sains / ?q=planet)
video.html        Halaman tonton + kuis (?id=...)
orang-tua.html    Pojok orang tua
tentang.html      Tentang kami
privasi.html      Kebijakan privasi (TEMPLATE, sesuaikan!)
css/style.css     Tampilan
js/config.js      ⚙️ Nama situs, email, dan KODE IKLAN ADSTERRA
js/videos.js      🎬 Daftar kategori, video, kuis, dan fakta seru
js/app.js         Logika aplikasi
```

## 1. Menjalankan di komputer

Pemutar YouTube **tidak berfungsi** jika file dibuka langsung (`file://`). Jalankan lewat server lokal:

```bash
npx serve .
# atau di VS Code: klik kanan index.html → "Open with Live Server"
```

## 2. Menambah video

Buka `js/videos.js`, lalu isi `youtubeId` di setiap video:

```js
{
  id: "sains-planet",            // unik, tanpa spasi
  youtubeId: "AbCdEf12345",      // dari youtube.com/watch?v=AbCdEf12345
  category: "sains",
  age: "9-12",                   // "6-8" atau "9-12"
  title: "Mengenal 8 Planet di Tata Surya",
  duration: "10:15",
  emoji: "🪐",
  isNew: true,                   // tampil di "Video Terbaru"
  description: "...",
  quiz: [ { q: "Planet terbesar?", options: ["Bumi","Mars","Jupiter"], answer: 2 } ]
}
```

- Video yang `youtubeId`-nya masih kosong akan menampilkan "Video segera hadir!".
- Pilih video yang **mengizinkan embed**. Utamakan video buatan sendiri atau yang Anda punya izinnya.
- Bisa juga memakai video sendiri: isi `videoUrl: "https://.../video.mp4"`.

## 2b. Animasi original (tanpa YouTube) 🎨

**Ke-19 video di situs ini adalah animasi original** yang digambar langsung di browser, tanpa YouTube. Karakternya Oli si burung hantu dan Tetes si tetesan air.

```
js/anim-player.js          Mesin pemutar: play/jeda, geser, narasi, subtitle, musik, melodi lagu, layar penuh, rekam
js/anim-kit.js             Kit animasi: karakter, latar, dan jenis adegan siap pakai
js/animations/<id>.js      Satu file = satu animasi (id sama dengan id video)
studio.html                Pratinjau + rekam animasi menjadi file video (.mp4/.webm)
```

**Menambah animasi baru (cara cepat dengan kit):**
1. Salin salah satu file, misalnya `js/animations/mtk-penjumlahan.js`, menjadi `js/animations/<id-baru>.js`.
2. Ubah isi `EduKit.make("<id-baru>", { ... scenes: [...] })`. Jenis adegan yang tersedia: `title`, `talk`, `board` (papan tulis), `count` (berhitung), `grid` (perkalian), `fraction` (pizza pecahan), `list` (kartu), `groups`, `word` (suku kata), `story` (cerita dengan tokoh dan balon kata), `sing` (karaoke dengan melodi), `recap`, dan `custom` (gambar bebas). Penjelasan lengkapnya ada di bagian atas `js/anim-kit.js`.
3. Durasi tiap adegan dihitung otomatis dari panjang narasi (`say`).
4. Teks di dalam `{kurung kurawal}` dibacakan dengan suara bahasa Inggris, misalnya `"{Red}, merah"`.
5. Di `js/videos.js`, tambahkan video dengan `animation: "<id-baru>"`.

Lagu "Bintang Mungil" dan bait penutup "Lagu Alfabet" memakai lirik original. Melodinya memakai lagu rakyat tradisional yang sudah menjadi domain publik.

**Suara:**
- Secara bawaan, narasi dibacakan suara otomatis berbahasa Indonesia dari browser, dan teksnya otomatis tampil sebagai subtitle.
- Supaya suaranya lebih khas, **rekam suara Anda sendiri** (satu file mp3 per adegan), lalu tambahkan `audio: "audio/siklus-air/1.mp3"` pada adegan tersebut.

**Membuat file video:** buka `http://localhost:8765/studio.html` (atau `domainanda.com/studio.html`), lalu tekan **Rekam & Unduh Video**. Hasilnya bisa diunggah ke YouTube, TikTok, atau Instagram sebagai promosi situs Anda. Catatan: suara otomatis tidak ikut terekam ke file, tetapi rekaman suara Anda sendiri (`audio:`) ikut terekam.

## 3. Memasang iklan Adsterra

1. Daftar di **adsterra.com** sebagai *Publisher*, lalu tambahkan domain situs Anda.
2. Buat unit iklan **Banner** dengan ukuran 728×90, 468×60, 320×50, dan 300×250. Jika mau, tambahkan juga **Native Banner**.
3. Adsterra memberi kode seperti ini:
   ```html
   <script type="text/javascript">
     atOptions = { 'key' : 'a1b2c3d4e5f6...', 'format' : 'iframe', 'height' : 90, 'width' : 728, 'params' : {} };
   </script>
   <script type="text/javascript" src="//www.highperformanceformat.com/a1b2c3d4e5f6.../invoke.js"></script>
   ```
   Salin nilai **key**-nya ke `js/config.js`:
   ```js
   banner728: { key: "a1b2c3d4e5f6...", width: 728, height: 90 },
   ```
   Jika domain di `src` berbeda dengan `www.highperformanceformat.com`, ubah juga `bannerDomain`.
4. Untuk Native Banner, salin URL `src` dan id container-nya (bagian setelah `container-`) ke `native`.
5. Setelah semua key terisi, ubah `showPlaceholder: false`.

Posisi iklan yang sudah disiapkan:
- **Beranda**: banner atas, native di tengah, dan banner bawah
- **Kategori**: banner atas dan native bawah
- **Video**: banner atas, kotak 300×250 di samping (bawah pada ponsel), dan native bawah

Ingin menambah slot? Taruh `<div class="ad-zone" data-ad="leaderboard"></div>` (atau `rectangle` / `native`) di HTML.

## 4. Online-kan situs (gratis)

- **Netlify**: buka app.netlify.com/drop, lalu seret folder ini ke sana.
- **Cloudflare Pages** / **GitHub Pages** / **Vercel**: unggah folder sebagai situs statis.
- Hubungkan domain sendiri (misalnya `.com` atau `.id`). Adsterra lebih mudah menyetujui situs yang memakai domain sendiri.

## ⚠️ Penting: situs anak & iklan

Situs untuk anak punya aturan yang lebih ketat. Sebelum live, mohon perhatikan hal berikut:

1. **Baca ketentuan Adsterra** tentang situs yang ditujukan untuk anak, dan konfirmasi ke manajer akun Adsterra Anda bahwa situs Anda diizinkan. Minta juga agar kategori iklan dewasa, judi, kencan, dan sejenisnya **diblokir**.
2. **Jangan memakai Popunder, Social Bar, atau Direct Link.** Format ini mudah terklik tanpa sengaja oleh anak dan bisa membuka halaman yang tidak pantas. Kode ini sengaja tidak mendukung format tersebut.
3. **Regulasi**: di Indonesia ada aturan perlindungan anak di ranah digital (PP No. 17/2025, "PP Tunas"). Jika pengunjung berasal dari AS, berlaku juga COPPA. Situs ini tidak mengumpulkan data pribadi anak, tetapi jaringan iklan bisa memakai cookie. Sesuaikan `privasi.html` dan pertimbangkan konsultasi hukum.
4. **Hak cipta video**: meng-embed video YouTube umumnya diperbolehkan jika pemiliknya mengizinkan embed. Namun konten orisinal milik sendiri jauh lebih aman untuk jangka panjang dan lebih disukai mesin pencari.
5. Pantau iklan yang tampil secara berkala dan laporkan iklan yang tidak pantas ke Adsterra.

## Kustomisasi cepat

- **Nama & email**: `js/config.js`
- **Warna**: variabel di bagian atas `css/style.css`
- **Kategori baru**: tambahkan ke `CATEGORIES` di `js/videos.js`
- **Level & lencana**: `LEVELS` di `js/app.js`
