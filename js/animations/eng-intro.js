/* Animasi original: Introduce Yourself — Memperkenalkan Diri */
EduKit.make("eng-intro", {
  title: "Introduce Yourself — Memperkenalkan Diri",
  color: "#8B5CF6", dark: "#6D3FE0", bg: "plain",
  scenes: [
    { type: "title", title: "Introduce Yourself", subtitle: "Memperkenalkan Diri", emoji: "👋",
      say: "{Hello!} Hari ini kita belajar memperkenalkan diri dalam bahasa Inggris. Yuk, berani bicara!" },
    { type: "board", lines: ["Kalimat penting", "Hello! = Halo!", "My name is ... = Nama saya ...", "I am 10 years old = Umurku 10 tahun"],
      say: "{Hello}, artinya halo. {My name is}, artinya nama saya. {I am ten years old}, artinya umur saya sepuluh tahun." },
    { type: "board", lines: ["Kalimat penting", "I live in Jakarta", "= Saya tinggal di Jakarta", "Nice to meet you!", "= Senang bertemu denganmu!"],
      say: "{I live in Jakarta}, artinya saya tinggal di Jakarta. {Nice to meet you}, artinya senang bertemu denganmu." },
    { type: "story", bg: "sky", caption: "Ayo dengarkan!",
      actors: [
        { e: "oli", x: 360, y: 430, s: 1.7 },
        { e: "tetes", x: 920, y: 450, s: 1.5, bob: 4 }
      ],
      bubbles: [
        { a: 0, text: "Hello! My name is Oli." },
        { a: 1, text: "Hi, Oli! I am Tetes." },
        { a: 0, text: "I am ten years old." },
        { a: 1, text: "Nice to meet you!" }
      ],
      bubbleStart: 0.4,
      say: "{Hello! My name is Oli.} {Hi Oli! I am Tetes.} {I am ten years old.} {Nice to meet you!}" },
    { type: "talk", text: "Giliranmu: \"Hello, my name is ...\"", emoji: ["🎤", "😊"],
      say: "Sekarang giliranmu! Ucapkan dengan lantang: {Hello, my name is}, lalu sebutkan namamu!" },
    { type: "recap", points: ["👋 Hello! = Halo!", "🙋 My name is ... = Nama saya ...", "🎂 I am ... years old", "🤝 Nice to meet you!"],
      say: "{Excellent!} Sekarang kamu bisa memperkenalkan diri dalam bahasa Inggris. Ayo latihan dengan temanmu!" }
  ]
});
