/* =========================================================
   DATA KATEGORI & VIDEO
   ---------------------------------------------------------
   Cara menambah video:
   - youtubeId : ID video YouTube. Contoh dari link
                 https://www.youtube.com/watch?v=AbCdEf12345
                 maka youtubeId = "AbCdEf12345"
   - videoUrl  : (opsional) link file .mp4 milik sendiri,
                 dipakai jika youtubeId kosong.
   - animation : (opsional) id animasi original buatan sendiri,
                 file-nya ada di js/animations/<id>.js
                 (contoh: "siklus-air"). Diutamakan di atas
                 youtubeId & videoUrl.
   - age       : "6-8" atau "9-12"
   - category  : salah satu id di CATEGORIES
   - quiz      : (opsional) pertanyaan setelah menonton.
                 answer = nomor urut jawaban benar (mulai 0).
   Pastikan Anda punya izin / video boleh di-embed.
   ========================================================= */

window.CATEGORIES = [
  { id: "matematika", name: "Matematika", emoji: "🔢", color: "#FF9F43", dark: "#E07B12", desc: "Berhitung, perkalian, pecahan" },
  { id: "sains",      name: "Sains",      emoji: "🔬", color: "#2ECC71", dark: "#1FA055", desc: "Alam, hewan, dan luar angkasa" },
  { id: "bahasa",     name: "Bahasa Indonesia", emoji: "📖", color: "#3BA9F5", dark: "#1C84CF", desc: "Membaca dan menulis" },
  { id: "inggris",    name: "Bahasa Inggris",   emoji: "🔤", color: "#8B5CF6", dark: "#6D3FE0", desc: "Kosakata & percakapan" },
  { id: "cerita",     name: "Dongeng",    emoji: "🧚", color: "#FF6FAE", dark: "#E04889", desc: "Cerita rakyat & legenda" },
  { id: "lagu",       name: "Lagu Anak",  emoji: "🎵", color: "#FFC93C", dark: "#E0A800", desc: "Bernyanyi sambil belajar" },
  { id: "seni",       name: "Seni & Kreasi", emoji: "🎨", color: "#20C3B0", dark: "#119C8C", desc: "Menggambar & prakarya" }
];

window.VIDEOS = [
  {
    id: "mtk-berhitung", animation: "mtk-berhitung", category: "matematika", age: "6-8",
    title: "Belajar Berhitung 1 sampai 20", duration: "1:02", emoji: "🔢", isNew: true,
    description: "Ayo berhitung bersama Oli! Kita akan menghitung buah, bintang, dan balon dari 1 sampai 20.",
    quiz: [
      { q: "Angka berapa yang datang setelah 9?", options: ["8", "10", "11"], answer: 1 },
      { q: "Ada 3 apel lalu ditambah 2 apel. Jadi berapa apel?", options: ["5", "4", "6"], answer: 0 }
    ]
  },
  {
    id: "mtk-penjumlahan", animation: "mtk-penjumlahan", category: "matematika", age: "6-8",
    title: "Penjumlahan Seru dengan Buah-buahan", duration: "1:02", emoji: "🍎",
    description: "Belajar menjumlahkan dengan cara yang menyenangkan memakai apel, jeruk, dan pisang.",
    quiz: [
      { q: "4 + 3 = ?", options: ["6", "7", "8"], answer: 1 },
      { q: "2 + 5 = ?", options: ["7", "6", "9"], answer: 0 }
    ]
  },
  {
    id: "mtk-perkalian", animation: "mtk-perkalian", category: "matematika", age: "9-12",
    title: "Rahasia Perkalian Cepat", duration: "1:15", emoji: "✖️", isNew: true,
    description: "Trik jitu menghafal perkalian 1 sampai 10 tanpa pusing. Cocok untuk kelas 3 ke atas!",
    quiz: [
      { q: "7 × 8 = ?", options: ["54", "56", "64"], answer: 1 },
      { q: "9 × 6 = ?", options: ["54", "45", "63"], answer: 0 },
      { q: "Berapa hasil 12 × 5?", options: ["50", "65", "60"], answer: 2 }
    ]
  },
  {
    id: "mtk-pecahan", animation: "mtk-pecahan", category: "matematika", age: "9-12",
    title: "Mengenal Pecahan dengan Pizza", duration: "1:08", emoji: "🍕",
    description: "Setengah, sepertiga, seperempat... Yuk pahami pecahan sambil membagi pizza!",
    quiz: [
      { q: "Pizza dibagi 4 sama besar. Satu potongnya adalah…", options: ["1/2", "1/4", "1/3"], answer: 1 }
    ]
  },
  {
    id: "sains-langit", animation: "sains-langit", category: "sains", age: "9-12",
    title: "Kenapa Langit Berwarna Biru?", duration: "1:00", emoji: "🌤️", isNew: true,
    description: "Cahaya matahari ternyata punya banyak warna! Temukan rahasia kenapa langit tampak biru.",
    quiz: [
      { q: "Cahaya matahari sebenarnya terdiri dari…", options: ["Satu warna", "Banyak warna", "Warna hitam"], answer: 1 }
    ]
  },
  {
    id: "sains-siklus-air", animation: "siklus-air", category: "sains", age: "6-8",
    title: "Siklus Air: Perjalanan Setetes Hujan", duration: "1:14", emoji: "💧", isNew: true,
    description: "Ikuti petualangan Tetes si tetesan air: menguap, menjadi awan, turun sebagai hujan, lalu kembali ke laut. Animasi original EduStream Kids!",
    quiz: [
      { q: "Air yang dipanaskan matahari akan…", options: ["Menguap", "Membeku", "Hilang selamanya"], answer: 0 },
      { q: "Uap air berkumpul di langit menjadi…", options: ["Pelangi", "Awan", "Bintang"], answer: 1 }
    ]
  },
  {
    id: "sains-planet", animation: "sains-planet", category: "sains", age: "9-12",
    title: "Mengenal 8 Planet di Tata Surya", duration: "1:14", emoji: "🪐",
    description: "Dari Merkurius sampai Neptunus — jelajahi planet-planet di sekitar Matahari!",
    quiz: [
      { q: "Planet terbesar di tata surya adalah…", options: ["Bumi", "Mars", "Jupiter"], answer: 2 },
      { q: "Planet yang kita tinggali adalah…", options: ["Bumi", "Venus", "Saturnus"], answer: 0 }
    ]
  },
  {
    id: "sains-hewan", animation: "sains-hewan", category: "sains", age: "6-8",
    title: "Hewan Pemakan Tumbuhan dan Daging", duration: "0:53", emoji: "🦁",
    description: "Herbivora, karnivora, omnivora — apa bedanya? Yuk kenali hewan-hewan di sekitar kita.",
    quiz: [
      { q: "Sapi makan rumput. Sapi termasuk hewan…", options: ["Karnivora", "Herbivora", "Omnivora"], answer: 1 }
    ]
  },
  {
    id: "bhs-suku-kata", animation: "bhs-suku-kata", category: "bahasa", age: "6-8",
    title: "Belajar Membaca: Suku Kata Ba Bi Bu Be Bo", duration: "0:42", emoji: "🅱️",
    description: "Latihan membaca suku kata dengan lagu dan gambar lucu. Pelan-pelan pasti bisa!",
    quiz: [
      { q: "Ba + Ju dibaca…", options: ["Baju", "Buju", "Biji"], answer: 0 }
    ]
  },
  {
    id: "bhs-menulis-cerita", animation: "bhs-menulis-cerita", category: "bahasa", age: "9-12",
    title: "Menulis Cerita Pendek Pertamaku", duration: "1:06", emoji: "✏️",
    description: "Tokoh, tempat, masalah, dan akhir cerita. Belajar menyusun cerita pendek yang seru!"
  },
  {
    id: "eng-colors", animation: "eng-colors", category: "inggris", age: "6-8",
    title: "Colors in English — Mengenal Warna", duration: "0:50", emoji: "🌈", isNew: true,
    description: "Red, blue, yellow, green! Belajar nama-nama warna dalam bahasa Inggris.",
    quiz: [
      { q: "\"Merah\" dalam bahasa Inggris adalah…", options: ["Blue", "Red", "Green"], answer: 1 },
      { q: "\"Yellow\" artinya…", options: ["Kuning", "Ungu", "Hijau"], answer: 0 }
    ]
  },
  {
    id: "eng-days", animation: "eng-days", category: "inggris", age: "6-8",
    title: "Days of the Week — Nama Hari", duration: "0:56", emoji: "📅",
    description: "Monday, Tuesday, Wednesday... Hafalkan nama hari dalam bahasa Inggris sambil bernyanyi.",
    quiz: [
      { q: "Hari setelah Monday adalah…", options: ["Sunday", "Tuesday", "Friday"], answer: 1 }
    ]
  },
  {
    id: "eng-intro", animation: "eng-intro", category: "inggris", age: "9-12",
    title: "Introduce Yourself — Memperkenalkan Diri", duration: "0:51", emoji: "👋",
    description: "\"Hello, my name is...\" Belajar memperkenalkan diri dengan percaya diri dalam bahasa Inggris."
  },
  {
    id: "cerita-kancil", animation: "cerita-kancil", category: "cerita", age: "6-8",
    title: "Dongeng Si Kancil dan Buaya", duration: "1:12", emoji: "🐊",
    description: "Kancil yang cerdik ingin menyeberang sungai. Bagaimana caranya melewati para buaya?",
    quiz: [
      { q: "Si Kancil terkenal karena sifatnya yang…", options: ["Cerdik", "Pemalas", "Penakut"], answer: 0 }
    ]
  },
  {
    id: "cerita-danau-toba", animation: "cerita-danau-toba", category: "cerita", age: "9-12",
    title: "Legenda Danau Toba", duration: "1:31", emoji: "🏞️",
    description: "Cerita rakyat dari Sumatera Utara tentang janji yang harus selalu ditepati."
  },
  {
    id: "lagu-bintang-kecil", animation: "lagu-bintang-kecil", category: "lagu", age: "6-8",
    title: "Lagu Anak: Bintang Mungil", duration: "1:09", emoji: "⭐",
    description: "Lagu original EduStream Kids tentang bintang mungil di langit malam. Ikuti bola yang melompat dan bernyanyi bersama!"
  },
  {
    id: "lagu-abc", animation: "lagu-abc", category: "lagu", age: "6-8",
    title: "Lagu Alfabet A sampai Z", duration: "1:02", emoji: "🔠",
    description: "Hafalkan huruf A sampai Z dengan lagu yang ceria!"
  },
  {
    id: "seni-origami", animation: "seni-origami", category: "seni", age: "6-8",
    title: "Membuat Kupu-kupu Kertas", duration: "1:02", emoji: "🦋",
    description: "Siapkan kertas warna-warni! Kita akan membuat kupu-kupu cantik dengan lipatan kipas, langkah demi langkah."
  },
  {
    id: "seni-menggambar", animation: "seni-menggambar", category: "seni", age: "9-12",
    title: "Menggambar Pemandangan Gunung", duration: "0:58", emoji: "⛰️",
    description: "Belajar menggambar dan mewarnai pemandangan gunung, sawah, dan matahari terbit."
  }
];

/* Fakta seru harian (berganti setiap hari) */
window.FUN_FACTS = [
  "Gurita punya 3 jantung dan darahnya berwarna biru! 🐙",
  "Lebah harus mengunjungi sekitar 2 juta bunga untuk membuat 1/2 kg madu. 🐝",
  "Matahari sangat besar — lebih dari 1 juta Bumi bisa muat di dalamnya! ☀️",
  "Komodo, kadal terbesar di dunia, hanya hidup di Indonesia. 🦎",
  "Jerapah tidur hanya sekitar 30 menit sampai 2 jam sehari. 🦒",
  "Siput bisa tidur selama 3 tahun! 🐌",
  "Pelangi sebenarnya berbentuk lingkaran penuh, tapi kita hanya melihat setengahnya. 🌈",
  "Indonesia punya lebih dari 17.000 pulau! 🏝️",
  "Jantung kita berdetak sekitar 100.000 kali setiap hari. ❤️",
  "Bunga Rafflesia arnoldii dari Indonesia adalah bunga tunggal terbesar di dunia. 🌺"
];
