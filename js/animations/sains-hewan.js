/* Animasi original: Hewan Pemakan Tumbuhan dan Daging */
EduKit.make("sains-hewan", {
  title: "Hewan Pemakan Tumbuhan dan Daging",
  color: "#2ECC71", dark: "#1FA055", bg: "sky",
  scenes: [
    { type: "title", title: "Hewan Makan Apa, Ya?", subtitle: "Herbivora • Karnivora • Omnivora", emoji: "🦁",
      say: "Halo! Setiap hewan punya makanan kesukaan. Yuk kenali hewan pemakan tumbuhan, pemakan daging, dan pemakan segalanya!" },
    { type: "groups", groups: [{ title: "Herbivora", sub: "Pemakan tumbuhan", color: "#2ECC71", food: "🌿", emojis: ["🐄", "🐐", "🐇", "🦒"] }],
      say: "Hewan yang makan tumbuhan disebut herbivora. Contohnya sapi, kambing, kelinci, dan jerapah." },
    { type: "groups", groups: [{ title: "Karnivora", sub: "Pemakan daging", color: "#FF6B6B", food: "🍖", emojis: ["🦁", "🐯", "🐊", "🦅"] }],
      say: "Hewan yang makan daging disebut karnivora. Contohnya singa, harimau, buaya, dan elang. Gigi mereka tajam!" },
    { type: "groups", groups: [{ title: "Omnivora", sub: "Pemakan tumbuhan & daging", color: "#FF9F43", food: "🥗", emojis: ["🐻", "🐒", "🐔"] }],
      say: "Ada juga hewan yang makan tumbuhan dan daging. Namanya omnivora, contohnya beruang, monyet, dan ayam." },
    { type: "groups", bg: "plain", groups: [
        { title: "Herbivora", sub: "tumbuhan", color: "#2ECC71", food: "🌿", emojis: ["🐄", "🐐", "🐇", "🦒"] },
        { title: "Karnivora", sub: "daging", color: "#FF6B6B", food: "🍖", emojis: ["🦁", "🐯", "🐊", "🦅"] },
        { title: "Omnivora", sub: "keduanya", color: "#FF9F43", food: "🥗", emojis: ["🐻", "🐒", "🐔", "🐁"] }
      ],
      say: "Jadi ada tiga kelompok: herbivora, karnivora, dan omnivora. Sapi makan rumput, jadi sapi termasuk herbivora!" },
    { type: "recap", points: ["🌿 Herbivora: makan tumbuhan (sapi)", "🍖 Karnivora: makan daging (singa)", "🥗 Omnivora: makan keduanya (beruang)"],
      say: "Hebat! Sekarang kamu tahu bedanya herbivora, karnivora, dan omnivora. Ayo jawab kuisnya!" }
  ]
});
