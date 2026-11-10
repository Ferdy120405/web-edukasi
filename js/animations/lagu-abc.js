/* Lagu Alfabet A sampai Z
   Lirik penutup: original EduStream Kids. Melodi: lagu rakyat tradisional (domain publik). */
(function () {
  const L1 = ["C4", "C4", "G4", "G4", "A4", "A4", "G4"];
  const L2 = ["F4", "F4", "E4", "E4", "D4", "D4", "C4"];
  const L3 = ["G4", "G4", "F4", "F4", "E4", "E4", "D4"];
  EduKit.make("lagu-abc", {
    title: "Lagu Alfabet A sampai Z",
    color: "#FFC93C", dark: "#E0A800", bg: "stage",
    scenes: [
      { type: "title", title: "Lagu Alfabet", subtitle: "A sampai Z", emoji: "🔠",
        say: "Halo! Ayo bernyanyi lagu alfabet dari A sampai Z. Ikuti bola yang melompat!" },
      { type: "sing", bg: "stage", bpm: 100, singer: "oli",
        lines: [
          { text: "A B C D E F G", notes: L1 },
          { text: "H I J K L M N", notes: L2 },
          { text: "O P Q R S T U", notes: L3 },
          { text: "V W X Y Z ho-re", notes: L3 },
          { text: "A-yo ki-ta be-la-jar", notes: L1 },
          { text: "Hu-ruf a-sik se-ka-li", notes: L2 }
        ] },
      { type: "list", title: "Huruf vokal", cols: 5, from: 0.25,
        items: [{ big: "A", color: "#FF6B6B" }, { big: "I", color: "#FF9F43" }, { big: "U", color: "#2ECC71" }, { big: "E", color: "#3BA9F5" }, { big: "O", color: "#8B5CF6" }],
        say: "Dari dua puluh enam huruf, ada lima huruf vokal: A, I, U, E, O. Huruf lainnya disebut konsonan." },
      { type: "talk", text: "Huruf apa awal namamu?", emoji: ["🔤", "😊"],
        say: "Sekarang coba pikirkan, huruf apa yang menjadi awal namamu? Ayo tuliskan!" },
      { type: "recap", title: "Hebat!", points: ["🔠 Alfabet ada 26 huruf", "🅰️ Huruf vokal: A I U E O", "🎵 Nyanyikan setiap hari!"], cta: "Nyanyi lagi, yuk!",
        say: "Hebat! Sekarang kamu tahu dua puluh enam huruf alfabet. Nyanyikan lagi bersama teman-temanmu, ya!" }
    ]
  });
})();
