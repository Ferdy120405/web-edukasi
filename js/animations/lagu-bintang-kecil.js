/* Lagu original: "Bintang Mungil"
   Lirik: original EduStream Kids. Melodi: lagu rakyat tradisional (domain publik). */
(function () {
  const L1 = ["C4", "C4", "G4", "G4", "A4", "A4", "G4"];
  const L2 = ["F4", "F4", "E4", "E4", "D4", "D4", "C4"];
  const L3 = ["G4", "G4", "F4", "F4", "E4", "E4", "D4"];
  EduKit.make("lagu-bintang-kecil", {
    title: "Lagu Anak: Bintang Mungil",
    color: "#FFC93C", dark: "#E0A800", bg: "night",
    scenes: [
      { type: "title", bg: "night", title: "Bintang Mungil", subtitle: "Lagu Original EduStream Kids", emoji: "⭐",
        say: "Halo! Ayo bernyanyi bersama lagu Bintang Mungil. Ikuti bola yang melompat, ya!" },
      { type: "sing", bpm: 96, singer: "star",
        lines: [
          { text: "Bin-tang mu-ngil ber-ki-lau", notes: L1 },
          { text: "Ka-u ber-si-nar te-rang", notes: L2 },
          { text: "Te-man-i a-ku ti-dur", notes: L3 },
          { text: "Ber-mim-pi sam-pai pa-gi", notes: L3 },
          { text: "Bin-tang mu-ngil ber-ki-lau", notes: L1 },
          { text: "Ka-u ber-si-nar te-rang", notes: L2 }
        ] },
      { type: "talk", bg: "night", text: "Tahukah kamu? Bintang adalah matahari yang sangat jauh!", emoji: ["⭐", "☀️"],
        say: "Tahukah kamu? Bintang di langit sebenarnya adalah matahari yang sangat, sangat jauh. Karena jauh, bintang terlihat kecil." },
      { type: "sing", bpm: 104, singer: "star", lead: 1.0,
        lines: [
          { text: "Bin-tang mu-ngil ber-ki-lau", notes: L1 },
          { text: "Ka-u ber-si-nar te-rang", notes: L2 }
        ] },
      { type: "recap", bg: "night", title: "Hebat!", points: ["🎵 Kamu sudah bernyanyi!", "⭐ Bintang = matahari yang jauh", "🌙 Ayo nyanyi bersama keluarga"], cta: "Nyanyi lagi, yuk!",
        say: "Suaramu merdu sekali! Ayo nyanyikan lagu Bintang Mungil bersama teman dan keluarga." }
    ]
  });
})();
