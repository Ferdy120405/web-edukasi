/* Animasi original: Colors in English — Mengenal Warna */
EduKit.make("eng-colors", {
  title: "Colors in English — Mengenal Warna",
  color: "#8B5CF6", dark: "#6D3FE0", bg: "plain",
  scenes: [
    { type: "title", title: "Colors in English", subtitle: "Mengenal Warna", emoji: "🌈",
      say: "{Hello, friends!} Halo teman-teman! Ayo belajar nama-nama warna dalam bahasa Inggris bersama Oli!" },
    { type: "list", cols: 3, from: 0.12,
      items: [{ swatch: "#FF4D4D", e: "🍎", label: "Red", sub: "merah" }, { swatch: "#3B82F6", e: "🐳", label: "Blue", sub: "biru" }, { swatch: "#FFD43B", e: "🍌", label: "Yellow", sub: "kuning" }],
      say: "{Red}, merah, seperti apel. {Blue}, biru, seperti paus. {Yellow}, kuning, seperti pisang." },
    { type: "list", cols: 3, from: 0.12,
      items: [{ swatch: "#2ECC71", e: "🍃", label: "Green", sub: "hijau" }, { swatch: "#FF9F1C", e: "🍊", label: "Orange", sub: "jingga" }, { swatch: "#9B59F5", e: "🍇", label: "Purple", sub: "ungu" }],
      say: "{Green}, hijau, seperti daun. {Orange}, jingga, seperti jeruk. {Purple}, ungu, seperti anggur." },
    { type: "list", cols: 4, from: 0.12,
      items: [{ swatch: "#FF8FC8", e: "🌸", label: "Pink", sub: "merah muda" }, { swatch: "#8B5A2B", e: "🐻", label: "Brown", sub: "cokelat" }, { swatch: "#222", e: "🐈‍⬛", label: "Black", sub: "hitam" }, { swatch: "#FFFFFF", e: "☁️", label: "White", sub: "putih" }],
      say: "{Pink}, merah muda. {Brown}, cokelat. {Black}, hitam. Dan {white}, putih!" },
    { type: "talk", text: "Rainbow = Pelangi", emoji: ["🌈"],
      say: "Kalau banyak warna berkumpul di langit, jadilah {rainbow}, pelangi!" },
    { type: "talk", text: "What color is it? 🍓 ➜ Red!", emoji: ["🍓", "❓"],
      say: "Coba tebak! {What color is it?} Stroberi warnanya apa? {Red!} Hebat sekali!" },
    { type: "recap", points: ["🍎 Red = merah", "🍌 Yellow = kuning", "🍃 Green = hijau", "🐳 Blue = biru"],
      say: "{Great job!} Kamu sudah tahu banyak warna dalam bahasa Inggris. Ayo jawab kuisnya!" }
  ]
});
