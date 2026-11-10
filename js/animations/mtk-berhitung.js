/* Animasi original: Belajar Berhitung 1 sampai 20 */
EduKit.make("mtk-berhitung", {
  title: "Belajar Berhitung 1 sampai 20",
  color: "#FF9F43", dark: "#E07B12", bg: "sky",
  scenes: [
    { type: "title", title: "Berhitung 1 sampai 20", subtitle: "Ayo hitung bersama Oli!", emoji: "🔢",
      say: "Halo teman-teman! Aku Oli. Hari ini kita belajar berhitung dari satu sampai dua puluh. Siap?" },
    { type: "count", title: "Hitung apel", items: [{ e: "🍎", n: 5 }],
      say: "Lihat, ada apel! Ayo hitung bersama. Satu, dua, tiga, empat, lima. Ada lima apel!" },
    { type: "count", title: "Hitung bintang", items: [{ e: "⭐", n: 10 }], from: 0.22,
      say: "Sekarang kita hitung bintang. Satu, dua, tiga, empat, lima, enam, tujuh, delapan, sembilan, sepuluh! Ada sepuluh bintang." },
    { type: "count", title: "Lanjut sampai 20", items: [{ e: "🎈", n: 20 }], pre: 10, from: 0.25,
      say: "Sepuluh balon sudah ada. Kita lanjut! Sebelas, dua belas, tiga belas, empat belas, lima belas, enam belas, tujuh belas, delapan belas, sembilan belas, dua puluh!" },
    { type: "board", lines: ["Urutan angka", "1  2  3  4  5  6  7  8  9", "9 ➜ 10", "Setelah 9 adalah 10!"],
      say: "Ingat ya, angka yang datang setelah sembilan adalah sepuluh. Sepuluh ditulis dengan angka satu dan nol." },
    { type: "count", title: "Bonus: menambah", items: [{ e: "🍎", n: 3 }, { e: "🍎", n: 2 }], op: "+",
      say: "Bonus! Kalau ada tiga apel, lalu ditambah dua apel lagi, semuanya jadi lima apel." },
    { type: "recap", points: ["🔢 Aku bisa berhitung 1 sampai 20", "🔟 Setelah 9 adalah 10", "🍎 3 apel + 2 apel = 5 apel"],
      say: "Hebat! Kamu sudah bisa berhitung sampai dua puluh. Sekarang, ayo jawab kuisnya!" }
  ]
});
