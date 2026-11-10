/* Animasi original: Days of the Week — Nama Hari (dengan lagu original) */
EduKit.make("eng-days", {
  title: "Days of the Week — Nama Hari",
  color: "#8B5CF6", dark: "#6D3FE0", bg: "plain",
  scenes: [
    { type: "title", title: "Days of the Week", subtitle: "Nama-nama Hari", emoji: "📅",
      say: "{Hello!} Satu minggu ada tujuh hari. Yuk hafalkan nama hari dalam bahasa Inggris!" },
    { type: "list", numbered: true, cols: 4, from: 0.1,
      items: [{ e: "📘", label: "Monday", sub: "Senin" }, { e: "📗", label: "Tuesday", sub: "Selasa" }, { e: "📙", label: "Wednesday", sub: "Rabu" }, { e: "📕", label: "Thursday", sub: "Kamis" }],
      say: "{Monday}, Senin. {Tuesday}, Selasa. {Wednesday}, Rabu. {Thursday}, Kamis." },
    { type: "list", cols: 3, from: 0.1,
      items: [{ e: "🕌", label: "Friday", sub: "Jumat" }, { e: "⚽", label: "Saturday", sub: "Sabtu" }, { e: "🏖️", label: "Sunday", sub: "Minggu" }],
      say: "{Friday}, Jumat. {Saturday}, Sabtu. {Sunday}, Minggu." },
    { type: "talk", text: "Ayo bernyanyi! Ikuti bola yang melompat", emoji: ["🎵", "📅"],
      say: "Sekarang ayo bernyanyi bersama! Ikuti bola yang melompat, ya." },
    { type: "sing", bpm: 104, singer: "oli",
      lines: [
        { text: "Mon-day Tues-day Wed-nes-day", notes: ["C4", "C4", "E4", "E4", "G4", "G4", "E4"] },
        { text: "Thurs-day Fri-day Sat-ur-day", notes: ["F4", "F4", "D4", "D4", "B3", "B3", "G3"] },
        { text: "Sun-day Sun-day ye ye ye", notes: ["C4", "E4", "G4", "E4", "A4", "G4", "C5"] },
        { text: "Se-ven days in a week", notes: ["G4", "G4", "E4", "C4", "D4", "D4", "C4"] }
      ] },
    { type: "board", lines: ["Ingat urutannya!", "Monday ➜ Tuesday", "Hari setelah Monday = Tuesday"],
      say: "Ingat ya, hari setelah {Monday} adalah {Tuesday}." },
    { type: "recap", points: ["📘 Monday = Senin", "📗 Tuesday = Selasa", "🏖️ Sunday = Minggu", "7️⃣ Satu minggu = 7 hari"],
      say: "{Well done!} Kamu sudah hafal nama-nama hari. Ayo jawab kuisnya!" }
  ]
});
