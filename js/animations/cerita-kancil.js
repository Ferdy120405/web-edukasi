/* Animasi original: Dongeng Si Kancil dan Buaya (cerita rakyat) */
(function () {
  const BANK_Y = 385, CROC_Y = 482;
  const CX = [440, 530, 620, 710, 800];
  const crocs = (at0, step) => CX.map((x, i) => ({ e: "croc", x, y: CROC_Y, size: 74, at: at0 == null ? 0 : at0 + i * step, bob: 3 }));

  EduKit.make("cerita-kancil", {
    title: "Dongeng Si Kancil dan Buaya",
    color: "#FF6FAE", dark: "#E04889", bg: "riverside",
    scenes: [
      { type: "title", title: "Si Kancil dan Buaya", subtitle: "Dongeng Nusantara", emoji: "🦌",
        say: "Halo, teman-teman! Dengarkan dongeng Si Kancil yang cerdik dan para buaya di sungai. Siap?" },
      { type: "story", caption: "Kancil yang lapar",
        actors: [{ e: "🦌", size: 120, flip: true, path: [[0, -80, BANK_Y], [2.5, 250, BANK_Y]], bob: 2 }],
        bubbles: [{ a: 0, text: "Wah, buahnya ranum sekali! Nyam...", at: 3 }],
        say: "Pada suatu hari, Si Kancil lapar. Di seberang sungai, ia melihat pohon dengan buah-buahan yang ranum. Tapi sungainya dalam dan banyak buaya!" },
      { type: "story", caption: "Buaya muncul!",
        actors: [
          { e: "🦌", x: 250, y: BANK_Y, size: 120, flip: true },
          { e: "croc", size: 105, path: [[0, 640, 600], [1.2, 640, CROC_Y]], bob: 3 },
          { e: "💡", x: 250, y: 270, size: 70, at: 5.6 }
        ],
        bubbles: [{ a: 1, text: "Hmm, makan siangku datang!", at: 1.4 }, { a: 0, text: "Aku harus cari akal...", at: 4.0 }],
        say: "Seekor buaya muncul. Hmm, ada kancil yang lezat, kata buaya. Kancil pun berpikir mencari akal." },
      { type: "story", caption: "Akal cerdik Kancil",
        actors: [
          { e: "🦌", x: 250, y: BANK_Y, size: 120, flip: true },
          { e: "croc", x: 640, y: CROC_Y, size: 105, bob: 3 }
        ],
        bubbles: [
          { a: 0, text: "Hai buaya! Raja Hutan menyuruhku menghitung kalian semua!" },
          { a: 0, text: "Ayo berbaris sampai ke seberang!" },
          { a: 1, text: "Baiklah, kami berbaris!" }
        ],
        say: "Kancil berkata, hai buaya, Raja Hutan memerintahkanku menghitung jumlah kalian. Ayo berbaris dari sini sampai seberang!" },
      { type: "story", caption: "Buaya berbaris",
        actors: [{ e: "🦌", x: 250, y: BANK_Y, size: 120, flip: true }].concat(crocs(0.6, 0.7)),
        say: "Buaya-buaya pun percaya. Mereka berbaris rapi, membentuk jembatan di atas sungai." },
      { type: "story", caption: "Satu, dua, tiga...",
        actors: crocs().concat([{ e: "🦌", size: 120, flip: true, hop: 80,
          path: [[3.6, 250, BANK_Y], [4.3, 440, 404], [5.0, 530, 404], [5.7, 620, 404], [6.4, 710, 404], [7.1, 800, 404], [8.0, 1010, BANK_Y]] }]),
        bubbles: ["Satu!", "Dua!", "Tiga!", "Empat!", "Lima!"].map((txt, i) => ({ a: 5, text: txt, at: 4.3 + i * 0.7, dur: 0.75 })),
        say: "Kancil melompat di atas punggung buaya sambil menghitung. Satu, dua, tiga, empat, lima!" },
      { type: "story", caption: "Kancil berhasil!",
        actors: crocs().concat([
          { e: "🦌", x: 1010, y: BANK_Y, size: 120, flip: true, bob: 3 },
          { e: "🍎", x: 1080, y: 410, size: 60, at: 0.5 }
        ]),
        bubbles: [{ a: 5, text: "Terima kasih, buaya! Hihi!", at: 0.8 }, { a: 2, text: "Hah?! Kita ditipu!" }],
        say: "Sampai di seberang, kancil tertawa. Terima kasih, buaya! Para buaya baru sadar mereka sudah ditipu." },
      { type: "recap", title: "Pesan cerita", points: ["🧠 Kancil cerdik memakai akalnya", "🚫 Tapi kita tidak boleh menipu", "💡 Gunakan kecerdasan untuk kebaikan"],
        say: "Si Kancil memang cerdik. Tapi ingat, kita tidak boleh menipu. Gunakan kecerdasan untuk hal-hal yang baik, ya!" }
    ]
  });
})();
