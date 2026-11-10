/* Animasi original: Mengenal Pecahan dengan Pizza */
EduKit.make("mtk-pecahan", {
  title: "Mengenal Pecahan dengan Pizza",
  color: "#FF9F43", dark: "#E07B12", bg: "plain",
  scenes: [
    { type: "title", title: "Mengenal Pecahan", subtitle: "dengan Pizza", emoji: "🍕",
      say: "Halo! Siapa yang suka pizza? Yuk belajar pecahan sambil membagi pizza bersama Oli!" },
    { type: "fraction", title: "Setengah", parts: 2, filled: 1, word: "setengah",
      say: "Pizza ini dibagi menjadi dua bagian yang sama besar. Satu bagiannya disebut setengah, ditulis satu per dua." },
    { type: "fraction", title: "Seperempat", parts: 4, filled: 1, word: "seperempat",
      say: "Kalau dibagi empat sama besar, satu potongnya disebut seperempat, ditulis satu per empat." },
    { type: "fraction", title: "Tiga per empat", parts: 4, filled: 3, word: "tiga per empat",
      say: "Kalau kita ambil tiga potong dari empat, itu namanya tiga per empat." },
    { type: "fraction", title: "Sepertiga", parts: 3, filled: 1, word: "sepertiga",
      say: "Dibagi tiga sama besar? Satu potongnya disebut sepertiga, ditulis satu per tiga." },
    { type: "board", lines: ["Nama bagian pecahan", "1  ➜  pembilang (diambil)", "—", "4  ➜  penyebut (semua bagian)"],
      say: "Angka atas disebut pembilang, yaitu bagian yang diambil. Angka bawah disebut penyebut, yaitu jumlah semua bagian." },
    { type: "fraction", title: "Mana yang lebih besar?", compare: [[1, 2], [1, 4]], symbol: ">",
      say: "Mana yang lebih besar, setengah atau seperempat? Setengah lebih besar, karena pizzanya dibagi menjadi lebih sedikit potongan!" },
    { type: "recap", points: ["🍕 1/2 = setengah", "🍕 1/4 = seperempat", "⬆️ Atas: pembilang, ⬇️ bawah: penyebut", "⚖️ 1/2 lebih besar dari 1/4"],
      say: "Hebat! Sekarang kamu kenal pecahan. Pizza dibagi empat, satu potongnya adalah seperempat. Ayo jawab kuisnya!" }
  ]
});
