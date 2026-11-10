/* Animasi original: Membuat Kupu-kupu dari Kertas Lipat */
(function () {
  const K = EduKit, G = K.G, PI = Math.PI;
  const SQ = [[490, 160], [640, 160], [790, 160], [790, 460], [640, 460], [490, 460]];
  const STRIP = [[440, 290], [640, 290], [840, 290], [840, 330], [640, 330], [440, 330]];
  const BOW = [[450, 190], [640, 300], [830, 190], [830, 430], [640, 320], [450, 430]];
  const PAPER = "#FF8FC8", PAPER_D = "#E05FA0";

  const mixPts = (A, B, p) => A.map((a, i) => [G.lerp(a[0], B[i][0], p), G.lerp(a[1], B[i][1], p)]);
  function poly(ctx, P) { ctx.beginPath(); P.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); }

  function paper(ctx, P, pleat, flap) {
    ctx.save();
    if (flap != null) { ctx.translate(640, 310); ctx.scale(flap, 1); ctx.translate(-640, -310); }
    ctx.fillStyle = "rgba(0,0,0,.15)";
    ctx.save(); ctx.translate(0, 8); poly(ctx, P); ctx.fill(); ctx.restore();
    poly(ctx, P);
    ctx.fillStyle = PAPER; ctx.fill();
    if (pleat > 0) {
      ctx.save(); poly(ctx, P); ctx.clip();
      const ys = Math.min(...P.map((p) => p[1])), ye = Math.max(...P.map((p) => p[1]));
      const n = 12, h = (ye - ys) / n;
      for (let i = 0; i < n * pleat; i++) {
        if (i % 2) { ctx.fillStyle = "rgba(160,30,100,.18)"; ctx.fillRect(400, ys + i * h, 480, h); }
      }
      ctx.restore();
    }
    ctx.lineWidth = 4; ctx.strokeStyle = PAPER_D; ctx.lineJoin = "round"; poly(ctx, P); ctx.stroke();
    ctx.restore();
  }

  function body(ctx, a, flap) {
    if (a <= 0) return;
    ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = "#5B3E96"; G.rr(ctx, 625, 255, 30, 120, 15); ctx.fill();
    ctx.strokeStyle = "#5B3E96"; ctx.lineWidth = 6; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(632, 262); ctx.quadraticCurveTo(600, 200, 585, 215); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(648, 262); ctx.quadraticCurveTo(680, 200, 695, 215); ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(633, 280, 4, 0, 2 * PI); ctx.arc(647, 280, 4, 0, 2 * PI); ctx.fill();
    ctx.restore();
  }

  function dots(ctx, a, flap) {
    if (a <= 0) return;
    ctx.save();
    ctx.translate(640, 310); ctx.scale(flap, 1); ctx.translate(-640, -310);
    ctx.globalAlpha = a;
    [[520, 250, "#FFE58A"], [760, 250, "#FFE58A"], [530, 380, "#7EC8F8"], [750, 380, "#7EC8F8"], [575, 300, "#fff"], [705, 300, "#fff"]].forEach(([x, y, c]) => {
      ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, 18, 0, 2 * PI); ctx.fill();
    });
    ctx.restore();
  }

  function step(n, text, fn) {
    return function (ctx, lt, d, K, t) {
      fn(ctx, lt, d, t);
      G.pill(ctx, "Langkah " + n, 36, 30, "#20C3B0", K.pop(lt, 0.1), 1);
      const a = K.fade(lt, 0.3);
      ctx.save(); ctx.globalAlpha = a;
      ctx.font = G.font(40);
      const w = ctx.measureText(text).width + 60;
      K.card(ctx, 640 - w / 2, 505, w, 74, { r: 37 });
      G.text(ctx, text, 640, 543, { size: 40, color: "#119C8C" });
      ctx.restore();
    };
  }

  const s1 = step(1, "Siapkan kertas persegi", (ctx, lt) => {
    const p = K.pop(lt, 0.3, 0.6);
    ctx.save(); ctx.translate(640, 310); ctx.scale(p, p); ctx.translate(-640, -310);
    paper(ctx, SQ, 0); ctx.restore();
    K.emoji(ctx, "✂️", 900, 200, 80 * K.pop(lt, 1.2));
  });
  const s2 = step(2, "Lipat zig-zag seperti kipas", (ctx, lt, d) => {
    const pl = G.prog(lt, 0.4, 0.45 * d);
    const sq = G.ease.inOut(G.prog(lt, 0.5 * d, 0.8 * d));
    paper(ctx, mixPts(SQ, STRIP, sq), Math.max(pl, sq > 0 ? 1 : 0));
    K.emoji(ctx, "👆", 640 + Math.sin(lt * 3) * 120, G.lerp(170, 440, pl), 70);
  });
  const s3 = step(3, "Jepit bagian tengahnya", (ctx, lt, d) => {
    const q = G.ease.inOut(G.prog(lt, 0.3 * d, 0.7 * d));
    paper(ctx, mixPts(STRIP, BOW, q), 1);
    K.emoji(ctx, "🤏", 640, G.lerp(240, 200, q), 80);
  });
  const s4 = step(4, "Ikat dengan kawat bulu", (ctx, lt, d) => {
    paper(ctx, BOW, 1);
    body(ctx, K.fade(lt, 0.3 * d, 0.8));
    K.emoji(ctx, "🧵", 900, 200, 80);
  });
  const s5 = step(5, "Hias dan terbangkan!", (ctx, lt, d, t) => {
    const fly = G.prog(lt, 0.5 * d, d);
    const flap = 0.72 + 0.28 * Math.abs(Math.sin(t * (fly > 0 ? 7 : 2)));
    ctx.save();
    ctx.translate(0, -Math.sin(fly * PI) * 60);
    paper(ctx, BOW, 1, flap);
    dots(ctx, K.fade(lt, 0.2 * d, 0.8), flap);
    body(ctx, 1);
    ctx.restore();
    K.emoji(ctx, "🖍️", 880, 420, 80 * (1 - fly));
    for (let i = 0; i < 6; i++) K.sparkle(ctx, 640 + Math.cos(i + t) * 260, 300 + Math.sin(i * 2 + t) * 150, 10, fly, "#FFE58A");
  });

  EduKit.make("seni-origami", {
    title: "Membuat Kupu-kupu Kertas",
    color: "#20C3B0", dark: "#119C8C", bg: "desk",
    scenes: [
      { type: "title", title: "Kupu-kupu Kertas", subtitle: "Prakarya seru & mudah", emoji: "🦋",
        say: "Halo, Seniman Cilik! Siapkan selembar kertas persegi berwarna. Kita akan membuat kupu-kupu yang cantik!" },
      { type: "list", title: "Bahan-bahan", cols: 3,
        items: [{ e: "🟪", label: "Kertas persegi" }, { e: "🧵", label: "Kawat bulu / benang" }, { e: "🖍️", label: "Krayon / spidol" }],
        say: "Bahan yang kita perlukan: kertas persegi, kawat bulu atau benang, dan krayon untuk menghias." },
      { type: "custom", bg: "desk", draw: s1, say: "Langkah pertama, letakkan kertas persegi di atas meja." },
      { type: "custom", bg: "desk", draw: s2, min: 7, say: "Langkah kedua, lipat kertas bolak-balik seperti kipas, dari atas sampai bawah." },
      { type: "custom", bg: "desk", draw: s3, min: 6, say: "Langkah ketiga, jepit bagian tengah kertas, sampai bentuknya seperti dasi kupu-kupu." },
      { type: "custom", bg: "desk", draw: s4, min: 6, say: "Langkah keempat, ikat bagian tengah dengan kawat bulu. Lengkungkan ujungnya menjadi antena." },
      { type: "custom", bg: "desk", draw: s5, min: 8, say: "Langkah terakhir, buka sayapnya dan hias dengan warna-warni. Kupu-kupumu siap terbang!" },
      { type: "recap", title: "Langkah-langkahnya", points: ["1️⃣ Siapkan kertas persegi", "2️⃣ Lipat zig-zag seperti kipas", "3️⃣ Jepit & ikat bagian tengah", "4️⃣ Hias sayapnya!"], cta: "Ayo coba buat!",
        say: "Mudah, kan? Ayo minta bantuan orang tua untuk menyiapkan bahannya, lalu buat kupu-kupumu sendiri!" }
    ]
  });
})();
