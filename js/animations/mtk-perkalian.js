/* Animasi original: Rahasia Perkalian Cepat */
EduKit.make("mtk-perkalian", {
  title: "Rahasia Perkalian Cepat",
  color: "#FF9F43", dark: "#E07B12", bg: "plain",
  scenes: [
    { type: "title", title: "Rahasia Perkalian Cepat", subtitle: "Trik jitu tanpa pusing!", emoji: "✖️",
      say: "Halo, Juara! Aku Oli. Hari ini aku punya trik rahasia supaya perkalian jadi mudah dan cepat!" },
    { type: "grid", title: "Perkalian = penjumlahan berulang", e: "🍪", rows: 3, cols: 4, label: "3 × 4 = 12",
      say: "Perkalian adalah penjumlahan berulang. Tiga kali empat artinya empat ditambah empat ditambah empat. Hasilnya dua belas!" },
    { type: "board", lines: ["Trik × 5", "5 × 6 = ?", "10 × 6 = 60", "60 : 2 = 30", "5 × 6 = 30 ✔"],
      say: "Trik pertama, perkalian lima. Kalikan dulu dengan sepuluh, lalu bagi dua. Lima kali enam: sepuluh kali enam sama dengan enam puluh, dibagi dua jadi tiga puluh!" },
    { type: "board", lines: ["Trik × 9", "9 × 6 = ?", "Puluhan: 6 − 1 = 5", "Satuan: 10 − 6 = 4", "9 × 6 = 54 ✔"],
      say: "Trik kedua, perkalian sembilan. Untuk sembilan kali enam, angka puluhannya enam kurang satu, yaitu lima. Satuannya sepuluh kurang enam, yaitu empat. Jadi lima puluh empat!" },
    { type: "board", lines: ["Trik 5 - 6 - 7 - 8", "5  6  7  8", "56 = 7 × 8", "7 × 8 = 56 ✔"],
      say: "Trik ketiga, ingat urutan angka lima, enam, tujuh, delapan. Lima puluh enam sama dengan tujuh kali delapan!" },
    { type: "board", lines: ["Pecah angka besar", "12 × 5 = ?", "10 × 5 = 50", "2 × 5 = 10", "50 + 10 = 60 ✔"],
      say: "Untuk angka besar, pecah saja! Dua belas kali lima: sepuluh kali lima sama dengan lima puluh, ditambah dua kali lima sama dengan sepuluh. Jadi enam puluh!" },
    { type: "recap", points: ["🍪 3 × 4 = 4 + 4 + 4 = 12", "✋ × 5: kali 10, lalu bagi 2", "9️⃣ 9 × 6 = 54", "🎯 7 × 8 = 56", "🧩 12 × 5 = 60"],
      say: "Luar biasa! Sekarang kamu punya trik perkalian cepat. Ayo buktikan dengan menjawab kuisnya!" }
  ]
});
