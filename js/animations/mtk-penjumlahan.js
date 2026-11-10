/* Animasi original: Penjumlahan Seru dengan Buah-buahan */
EduKit.make("mtk-penjumlahan", {
  title: "Penjumlahan Seru dengan Buah-buahan",
  color: "#FF9F43", dark: "#E07B12", bg: "sky",
  scenes: [
    { type: "title", title: "Penjumlahan Seru", subtitle: "dengan Buah-buahan", emoji: "🍎",
      say: "Halo! Aku Oli. Yuk belajar penjumlahan dengan buah-buahan yang segar!" },
    { type: "talk", text: "Menjumlahkan = menggabungkan lalu menghitung semuanya", emoji: ["🍎", "➕", "🍎"],
      say: "Menjumlahkan artinya menggabungkan dua kelompok benda, lalu menghitung semuanya." },
    { type: "count", title: "Apel", items: [{ e: "🍎", n: 2 }, { e: "🍎", n: 3 }], op: "+",
      say: "Ada dua apel merah, lalu datang tiga apel lagi. Kita hitung semua: satu, dua, tiga, empat, lima. Dua tambah tiga sama dengan lima!" },
    { type: "count", title: "Jeruk", items: [{ e: "🍊", n: 4 }, { e: "🍊", n: 3 }], op: "+",
      say: "Sekarang jeruk. Empat jeruk ditambah tiga jeruk. Kalau dihitung semua, jadi tujuh jeruk! Empat tambah tiga sama dengan tujuh." },
    { type: "count", title: "Pisang", items: [{ e: "🍌", n: 2 }, { e: "🍌", n: 5 }], op: "+",
      say: "Dua pisang ditambah lima pisang. Hitung semuanya... hasilnya tujuh pisang!" },
    { type: "board", lines: ["Trik: mulai dari angka besar", "5 + 2 = ?", "5 ➜ 6 ➜ 7", "5 + 2 = 7 ✔"],
      say: "Trik jitu: mulai dari angka yang besar, lalu hitung maju. Lima tambah dua, mulai dari lima, lalu enam, tujuh. Jadi tujuh!" },
    { type: "recap", points: ["➕ Menjumlah = menggabungkan", "🍊 4 + 3 = 7", "🍌 2 + 5 = 7", "💡 Mulai dari angka yang besar"],
      say: "Keren! Kamu sudah bisa menjumlahkan. Ingat triknya, mulai dari angka yang besar. Sekarang ayo jawab kuisnya!" }
  ]
});
