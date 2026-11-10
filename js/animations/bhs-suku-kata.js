/* Animasi original: Belajar Membaca Suku Kata Ba Bi Bu Be Bo */
EduKit.make("bhs-suku-kata", {
  title: "Belajar Membaca: Suku Kata Ba Bi Bu Be Bo",
  color: "#3BA9F5", dark: "#1C84CF", bg: "plain",
  scenes: [
    { type: "title", title: "Membaca Suku Kata", subtitle: "Ba • Bi • Bu • Be • Bo", emoji: "📖",
      say: "Halo! Aku Oli. Ayo belajar membaca suku kata. Pelan-pelan, pasti bisa!" },
    { type: "word", parts: ["B", "A"], word: "dibaca: BA",
      say: "Huruf B bertemu huruf A, dibaca... ba!" },
    { type: "list", title: "Ayo baca bersama!", cols: 5, from: 0.2,
      items: [{ big: "BA", color: "#FF6B6B" }, { big: "BI", color: "#FF9F43" }, { big: "BU", color: "#2ECC71" }, { big: "BE", color: "#3BA9F5" }, { big: "BO", color: "#8B5CF6" }],
      say: "Sekarang kita baca bersama: ba, bi, bu, be, bo!" },
    { type: "word", parts: ["BA", "JU"], emoji: "👕", word: "BAJU",
      say: "Ba ditambah ju, dibaca baju!" },
    { type: "word", parts: ["BU", "KU"], emoji: "📘", word: "BUKU",
      say: "Bu ditambah ku, dibaca buku!" },
    { type: "word", parts: ["BO", "LA"], emoji: "⚽", word: "BOLA",
      say: "Bo ditambah la, dibaca bola!" },
    { type: "word", parts: ["BE", "BEK"], emoji: "🦆", word: "BEBEK",
      say: "Be ditambah bek, dibaca bebek! Kwek, kwek!" },
    { type: "recap", points: ["🔤 B + A = BA", "👕 BA + JU = BAJU", "📘 BU + KU = BUKU", "⚽ BO + LA = BOLA"],
      say: "Pintar sekali! Kamu sudah bisa membaca suku kata. Ayo latihan terus, lalu jawab kuisnya!" }
  ]
});
