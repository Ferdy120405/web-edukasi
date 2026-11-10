/* Animasi original: Menulis Cerita Pendek Pertamaku */
EduKit.make("bhs-menulis-cerita", {
  title: "Menulis Cerita Pendek Pertamaku",
  color: "#3BA9F5", dark: "#1C84CF", bg: "plain",
  scenes: [
    { type: "title", title: "Menulis Cerita Pendek", subtitle: "Jadi penulis cilik, yuk!", emoji: "✏️",
      say: "Halo, Penulis Cilik! Menulis cerita itu seru. Yuk belajar membuat cerita pendek pertamamu bersama Oli!" },
    { type: "list", title: "4 Bahan Cerita", numbered: true, cols: 4,
      items: [{ e: "🧒", label: "Tokoh", sub: "siapa?" }, { e: "🏡", label: "Tempat", sub: "di mana?" }, { e: "❓", label: "Masalah", sub: "ada apa?" }, { e: "💡", label: "Penyelesaian", sub: "bagaimana akhirnya?" }],
      say: "Cerita yang seru punya empat bahan: tokoh, tempat, masalah, dan penyelesaian." },
    { type: "talk", text: "Tokoh: Rani dan kucingnya, Belang", emoji: ["👧", "🐱"],
      say: "Pertama, tentukan tokoh. Misalnya, Rani dan kucingnya yang bernama Belang." },
    { type: "talk", text: "Tempat: halaman rumah Rani", emoji: ["🏡", "🌳"],
      say: "Kedua, tentukan tempat. Cerita kita terjadi di halaman rumah Rani." },
    { type: "story", bg: "village", caption: "Masalah",
      actors: [
        { e: "🌳", x: 640, y: 330, size: 330 },
        { e: "🐱", x: 660, y: 230, size: 80, bob: 3 },
        { e: "👧", x: 430, y: 520, size: 130 }
      ],
      bubbles: [{ a: 1, text: "Meong! Aku takut turun!" }, { a: 2, text: "Belang, bagaimana ini?" }],
      say: "Ketiga, buat masalah. Belang memanjat pohon tinggi dan tidak berani turun. Meong, meong!" },
    { type: "story", bg: "village", caption: "Penyelesaian",
      actors: [
        { e: "🌳", x: 640, y: 330, size: 330 },
        { e: "🪜", x: 640, y: 440, size: 170, at: 0.8 },
        { e: "🐱", x: 660, y: 230, size: 80, path: [[0, 660, 230], [3.5, 660, 230], [5.5, 520, 520]] },
        { e: "👨", x: 760, y: 520, size: 130, at: 0.4 },
        { e: "👧", x: 430, y: 520, size: 130 }
      ],
      bubbles: [{ a: 3, text: "Ayah bantu, ya!", at: 1.0 }, { a: 4, text: "Hore! Terima kasih, Ayah!", at: 6.0 }],
      say: "Keempat, penyelesaian. Rani meminta bantuan ayah. Ayah mengambil tangga dan menurunkan Belang dengan hati-hati." },
    { type: "board", lines: ["Tips menulis", "Awali: \"Pada suatu hari...\"", "Pakai: lalu, kemudian, akhirnya", "Beri judul yang menarik!"],
      say: "Tips menulis: awali dengan kalimat pada suatu hari, gunakan kata lalu, kemudian, dan akhirnya, lalu beri judul yang menarik!" },
    { type: "recap", points: ["🧒 Tokoh", "🏡 Tempat", "❓ Masalah", "💡 Penyelesaian"],
      cta: "Ayo tulis ceritamu!",
      say: "Sekarang giliranmu! Ambil kertas dan pensil, lalu tulis cerita pendekmu sendiri dengan empat bahan tadi." }
  ]
});
