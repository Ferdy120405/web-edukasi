/* Animasi original: Legenda Danau Toba (cerita rakyat Sumatera Utara) */
(function () {
  const K = EduKit, G = K.G, PI = Math.PI;

  function flood(ctx, lt, d, K, t) {
    K.BG.lake(ctx, t);
    const dk = G.prog(lt, 0, 1.5) * (1 - G.prog(lt, d * 0.72, d * 0.9));
    ctx.fillStyle = "rgba(25,25,60," + 0.5 * dk + ")";
    ctx.fillRect(0, 0, 1280, 720);
    if (dk > 0) {
      ctx.strokeStyle = "rgba(160,200,255," + 0.8 * dk + ")"; ctx.lineWidth = 3; ctx.lineCap = "round";
      ctx.beginPath();
      for (let i = 0; i < 90; i++) {
        const x = K.rnd(i) * 1300, y = ((t * (600 + (i % 4) * 60) + i * 61) % 760) - 20;
        ctx.moveTo(x, y); ctx.lineTo(x - 7, y + 24);
      }
      ctx.stroke();
    }
    const lvl = G.lerp(650, 455, G.ease.inOut(G.prog(lt, 1.5, d * 0.68)));
    K.water(ctx, 0, 1280, lvl, 720, t, dk > 0.3);
    const pi = K.pop(lt, d * 0.6, 0.8);
    if (pi > 0) {
      ctx.save(); ctx.translate(640, lvl + 20); ctx.scale(pi, pi);
      ctx.fillStyle = "#6CBF5A"; ctx.beginPath(); ctx.ellipse(0, 0, 230, 48, 0, 0, 2 * PI); ctx.fill();
      ctx.fillStyle = "#86D774"; ctx.beginPath(); ctx.ellipse(0, -10, 200, 36, 0, 0, 2 * PI); ctx.fill();
      K.drawTree(ctx, -90, -10, 0.6); K.drawTree(ctx, 40, -14, 0.7); K.drawTree(ctx, 130, -8, 0.55);
      ctx.restore();
      G.pill(ctx, "Pulau Samosir", 520, lvl + 75, "#2ECC71", pi, 1);
    }
    const pt = K.pop(lt, d * 0.78, 0.6);
    if (pt > 0) {
      ctx.save(); ctx.translate(640, 120); ctx.scale(pt, pt);
      G.text(ctx, "Danau Toba", 0, 0, { size: 92, color: "#fff", stroke: "#1C84CF", strokeW: 14 });
      ctx.restore();
    }
  }

  EduKit.make("cerita-danau-toba", {
    title: "Legenda Danau Toba",
    color: "#FF6FAE", dark: "#E04889", bg: "lake",
    scenes: [
      { type: "title", title: "Legenda Danau Toba", subtitle: "Cerita Rakyat Sumatera Utara", emoji: "🏞️",
        say: "Halo! Ini adalah legenda Danau Toba dari Sumatera Utara, cerita tentang janji yang harus selalu ditepati." },
      { type: "story", caption: "Toba memancing",
        actors: [
          { e: "👨‍🌾", x: 250, y: 560, size: 140, flip: true },
          { e: "🎣", x: 370, y: 500, size: 100, flip: true },
          { e: "goldfish", size: 75, at: 4.5, glow: "rgba(255,210,60,.9)", sparkle: true, path: [[4.5, 560, 640], [5.4, 500, 470], [6.3, 430, 560]] }
        ],
        bubbles: [{ a: 0, text: "Wah, ikan emas yang indah sekali!", at: 6.6 }],
        say: "Dahulu kala, hiduplah seorang petani bernama Toba. Suatu hari ia memancing dan mendapat ikan berwarna keemasan yang sangat indah." },
      { type: "story", caption: "Keajaiban!",
        actors: [
          { e: "👨‍🌾", x: 250, y: 560, size: 140, flip: true },
          { e: "goldfish", x: 450, y: 560, size: 75, glow: "rgba(255,210,60,.9)", sparkle: true, out: 1.6 },
          { e: "👸", x: 470, y: 530, size: 150, at: 1.8, glow: "rgba(255,220,120,.7)", sparkle: true }
        ],
        bubbles: [
          { a: 2, text: "Terima kasih telah menolongku.", at: 3.0 },
          { a: 0, text: "Maukah kau menjadi istriku?" },
          { a: 2, text: "Mau, tapi ada satu syarat..." }
        ],
        say: "Ajaib! Ikan itu berubah menjadi seorang putri yang cantik. Toba ingin menikahinya, dan sang putri setuju dengan satu syarat." },
      { type: "talk", text: "Janji: jangan pernah menyebut asal-usulku dari seekor ikan!", emoji: ["🤝", "✨"],
        say: "Syaratnya: Toba tidak boleh menceritakan kepada siapa pun bahwa istrinya berasal dari seekor ikan. Toba pun berjanji." },
      { type: "story", bg: "village", caption: "Samosir",
        actors: [
          { e: "👨‍🌾", x: 760, y: 550, size: 130, out: 4.5 },
          { e: "👸", x: 880, y: 550, size: 130, out: 4.5 },
          { e: "👦", size: 110, bob: 4, path: [[0, 140, 570], [6.2, 140, 570], [11, 560, 570]], flip: true },
          { e: "🍱", size: 60, out: 11.4, path: [[0, 195, 560], [6.2, 195, 560], [11, 615, 560]], at: 0.6 }
        ],
        bubbles: [{ a: 2, text: "Nyam... enak sekali!", at: 11.4 }],
        say: "Mereka hidup bahagia dan dikaruniai seorang anak bernama Samosir. Suatu hari, Samosir disuruh mengantar makanan untuk ayahnya, tapi makanannya habis dimakan di jalan." },
      { type: "story", bg: "village", caption: "Janji yang dilanggar",
        actors: [
          { e: "👨‍🌾", x: 760, y: 550, size: 140 },
          { e: "👦", size: 110, path: [[0, 520, 570], [5.2, 520, 570], [6.8, 60, 570]], flip: false },
          { e: "😠", x: 760, y: 410, size: 70, at: 1.2 }
        ],
        bubbles: [{ a: 0, text: "Dasar anak ikan!", at: 2.4 }, { a: 1, text: "Huhu... Ibuuu!", at: 4.6 }],
        say: "Toba sangat lapar dan marah. Tanpa sadar ia berteriak, dasar anak ikan! Toba telah melanggar janjinya." },
      { type: "custom", draw: flood,
        say: "Seketika langit menjadi gelap dan hujan turun sangat deras. Sang putri dan Samosir menghilang. Air terus naik hingga membentuk danau yang luas, yaitu Danau Toba, dengan Pulau Samosir di tengahnya." },
      { type: "recap", title: "Pesan cerita", points: ["🤝 Janji harus selalu ditepati", "😌 Jangan mudah marah", "🏞️ Danau Toba ada di Sumatera Utara"],
        cta: "Ayo ceritakan ulang!",
        say: "Pesan dari cerita ini: janji harus selalu ditepati, dan jangan mudah marah. Danau Toba yang indah bisa kamu kunjungi di Sumatera Utara!" }
    ]
  });
})();
