/* =========================================================
   KONFIGURASI SITUS — ubah bagian ini sesuai kebutuhan Anda
   ========================================================= */
window.SITE_CONFIG = {
  siteName: "EduStream Kids",
  tagline: "Belajar Seru, Nonton Jadi Pintar!",
  contactEmail: "halo@domainanda.com",
  siteUrl: "https://domainanda.com",

  /* ---------------------------------------------------------
     IKLAN ADSTERRA
     1. Daftar sebagai Publisher di adsterra.com, tambahkan situs Anda.
     2. Buat unit iklan "Banner" (728x90, 468x60, 320x50, 300x250)
        dan/atau "Native Banner".
     3. Dari kode yang diberikan Adsterra, salin nilai 'key'
        (contoh: atOptions = { 'key' : 'abc123...' }) ke bawah ini.
     4. Untuk Native Banner, salin URL lengkap dari atribut src
        (contoh: //pl12345678.effectivecpmrate.com/abc.../invoke.js)
        dan id container-nya (bagian setelah "container-").

     PENTING untuk situs anak: format Popunder, Social Bar, dan
     Direct Link SENGAJA tidak didukung, karena mengganggu dan
     mudah terklik tidak sengaja oleh anak-anak.
     --------------------------------------------------------- */
  ads: {
    enabled: true,

    // true = tampilkan kotak contoh "Ruang Iklan" selama key masih kosong
    // (berguna saat desain). Ubah ke false saat situs sudah live.
    showPlaceholder: false,

    // Domain skrip banner dari kode Adsterra Anda
    // (lihat baris <script src="//www.highperformanceformat.com/KEY/invoke.js">)
    bannerDomain: "www.highperformanceformat.com",

    // Jika domain skrip sebuah unit berbeda dari bannerDomain, tambahkan
    // domain: "..." pada unit itu, contoh: { key: "abc", width: 728, height: 90, domain: "www.contoh.com" }
    // Kode Adsterra versi baru: salin juga alamat lengkap di <script src="..."> ke `src`
    banner728: { key: "a1c15f7a9a7161f107e87db5463706e8", width: 728, height: 90,
                 src: "https://bauval.org/22/a1c15f7a9a7161f107e87db5463706e8" },   // desktop
    banner468: { key: "650818ec609da9dc74e34f6d227c00d1", width: 468, height: 60,
                 src: "https://bauval.org/22/650818ec609da9dc74e34f6d227c00d1" },   // tablet
    banner320: { key: "b98c615a5f0647d0b44e307d64fb0875", width: 320, height: 50,
                 src: "https://bauval.org/22/b98c615a5f0647d0b44e307d64fb0875" },   // ponsel
    banner300: { key: "0c5000ae7d49580daa5f9aa9061f4b08", width: 300, height: 250,
                 src: "https://bauval.org/22/0c5000ae7d49580daa5f9aa9061f4b08" },  // kotak samping / bawah video

    native: {
      src: "",          // contoh: "//pl12345678.effectivecpmrate.com/abcdef/invoke.js"
      containerId: ""   // contoh: "abcdef"  (dari <div id="container-abcdef">)
    }
  }
};
