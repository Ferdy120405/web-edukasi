/* Animasi original: Menggambar Pemandangan Gunung */
(function () {
  const K = EduKit, G = K.G, PI = Math.PI;
  const PX = 230, PY = 70, PW = 820, PH = 520, HZ = 420;

  // Setiap lapisan: daftar garis (polyline) yang digambar pensil
  // Gunung kiri berhenti di titik potong (635,345) karena tertutup gunung kanan
  const MOUNTAINS = [[[300, HZ], [500, 190], [635, 345]], [[580, HZ], [770, 160], [980, HZ]]];
  const FILLS = [[[300, HZ], [500, 190], [700, HZ]], [[580, HZ], [770, 160], [980, HZ]]];
  const SUN = (() => { const p = []; for (let i = 0; i <= 20; i++) { const a = PI + (i / 20) * PI * 0.62; p.push([640 + Math.cos(a) * 60, 330 + Math.sin(a) * 60]); } return [p]; })();
  const ROAD = [[[600, 585], [620, 520], [660, 470], [645, HZ]], [[700, 585], [690, 520], [690, 470], [655, HZ]],
    [[260, 470], [520, 470]], [[260, 520], [560, 520]], [[260, 565], [580, 565]], [[760, 470], [1020, 470]], [[740, 520], [1020, 520]], [[720, 565], [1020, 565]]];
  const DECOR = [[[340, 440], [340, 400]], [[960, 440], [960, 400]], [[380, 120], [400, 105], [420, 120]], [[430, 140], [445, 128], [460, 140]], [[860, 110], [878, 96], [896, 110]]];

  const lenOf = (pl) => pl.reduce((s, p, i) => (i ? s + Math.hypot(p[0] - pl[i - 1][0], p[1] - pl[i - 1][1]) : 0), 0);
  function strokeLines(ctx, lines, p) {
    const total = lines.reduce((s, l) => s + lenOf(l), 0);
    let budget = total * p;
    ctx.strokeStyle = "#3A3A4A"; ctx.lineWidth = 6; ctx.lineCap = "round"; ctx.lineJoin = "round";
    let tip = null;
    lines.forEach((l) => {
      if (budget <= 0) return;
      ctx.beginPath(); ctx.moveTo(l[0][0], l[0][1]);
      for (let i = 1; i < l.length; i++) {
        const seg = Math.hypot(l[i][0] - l[i - 1][0], l[i][1] - l[i - 1][1]);
        if (budget >= seg) { ctx.lineTo(l[i][0], l[i][1]); budget -= seg; tip = l[i]; }
        else {
          const q = budget / seg;
          tip = [G.lerp(l[i - 1][0], l[i][0], q), G.lerp(l[i - 1][1], l[i][1], q)];
          ctx.lineTo(tip[0], tip[1]); budget = 0; break;
        }
      }
      ctx.stroke();
    });
    return tip;
  }

  function tree(ctx, x, y, a) { ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = "#3A3A4A"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x, y, 30, 0, 2 * PI); ctx.stroke(); ctx.restore(); }

  function art(ctx, stage, p, t) {
    K.card(ctx, PX, PY, PW, PH, { r: 12 });
    ctx.save();
    ctx.beginPath(); ctx.rect(PX, PY, PW, PH); ctx.clip();
    const cp = stage > 4 ? 1 : stage === 4 ? p : 0;
    if (cp > 0) {
      ctx.globalAlpha = cp;
      ctx.fillStyle = "#9FD8FF"; ctx.fillRect(PX, PY, PW, HZ - PY);
      ctx.fillStyle = "#FFD54A"; ctx.beginPath(); ctx.arc(640, 330, 60, 0, 2 * PI); ctx.fill();
      ctx.fillStyle = "#58B368";
      FILLS.forEach((m) => { ctx.beginPath(); ctx.moveTo(m[0][0], m[0][1]); ctx.lineTo(m[1][0], m[1][1]); ctx.lineTo(m[2][0], m[2][1]); ctx.closePath(); ctx.fill(); });
      ctx.fillStyle = "#8ED36F"; ctx.fillRect(PX, HZ, PW, PH - (HZ - PY));
      ctx.fillStyle = "#D9B48A"; ctx.beginPath(); ctx.moveTo(600, 585); ctx.lineTo(645, HZ); ctx.lineTo(655, HZ); ctx.lineTo(700, 585); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#2E8B57"; ctx.beginPath(); ctx.arc(340, 370, 30, 0, 2 * PI); ctx.arc(960, 370, 30, 0, 2 * PI); ctx.fill();
      ctx.fillStyle = "#fff"; [[420, 150], [880, 140]].forEach(([x, y]) => K.drawCloud(ctx, x, y, 0.45, "#fff", 1));
      ctx.globalAlpha = 1;
    }
    let tip = null;
    const L = [MOUNTAINS, SUN, ROAD, DECOR];
    L.forEach((lines, i) => {
      if (stage > i) strokeLines(ctx, lines, 1);
      else if (stage === i) tip = strokeLines(ctx, lines, p);
    });
    if (stage >= 3) { const a = stage > 3 ? 1 : G.prog(p, 0.3, 0.6); tree(ctx, 340, 370, a); tree(ctx, 960, 370, a); }
    if (stage >= 2 || (stage === 1 && p > 0.85)) {
      ctx.strokeStyle = "#3A3A4A"; ctx.lineWidth = 4;
      for (let i = 0; i < 8; i++) {
        const a = (PI * 1.05) + i * 0.13 * PI;
        ctx.beginPath(); ctx.moveTo(640 + Math.cos(a) * 75, 330 + Math.sin(a) * 75); ctx.lineTo(640 + Math.cos(a) * 100, 330 + Math.sin(a) * 100); ctx.stroke();
      }
    }
    ctx.restore();
    return tip;
  }

  function step(stage, text) {
    return function (ctx, lt, d, K, t) {
      const p = G.prog(lt, 0.4, 0.8 * d);
      const tip = art(ctx, stage, p, t);
      if (stage === 4 && p < 1) K.emoji(ctx, "🖍️", 640 + Math.sin(lt * 4) * 250, 300 + Math.cos(lt * 3) * 150, 80);
      else if (tip && p < 1) K.emoji(ctx, "✏️", tip[0] + 26, tip[1] - 26, 70);
      G.pill(ctx, stage < 4 ? "Langkah " + (stage + 1) : "Mewarnai", 36, 30, "#20C3B0", K.pop(lt, 0.1), 1);
      const a = K.fade(lt, 0.3);
      ctx.save(); ctx.globalAlpha = a;
      ctx.font = G.font(36);
      const w = ctx.measureText(text).width + 60;
      K.card(ctx, 640 - w / 2, 600 - 70, w, 64, { r: 32, fill: "#119C8C" });
      G.text(ctx, text, 640, 600 - 37, { size: 36, color: "#fff" });
      ctx.restore();
    };
  }

  EduKit.make("seni-menggambar", {
    title: "Menggambar Pemandangan Gunung",
    color: "#20C3B0", dark: "#119C8C", bg: "desk",
    scenes: [
      { type: "title", title: "Menggambar Pemandangan", subtitle: "Gunung, sawah, dan matahari", emoji: "⛰️",
        say: "Halo, Seniman Cilik! Siapkan pensil dan krayon. Kita akan menggambar pemandangan gunung yang indah!" },
      { type: "custom", draw: step(0, "Gambar dua gunung"), min: 6,
        say: "Langkah pertama, gambar dua gunung berbentuk segitiga di tengah kertas." },
      { type: "custom", draw: step(1, "Matahari di antara gunung"), min: 6,
        say: "Langkah kedua, gambar matahari yang mengintip di antara dua gunung, lengkap dengan sinarnya." },
      { type: "custom", draw: step(2, "Jalan berkelok & sawah"), min: 7,
        say: "Langkah ketiga, gambar jalan berkelok dari bawah menuju gunung, lalu garis-garis sawah di kiri dan kanan." },
      { type: "custom", draw: step(3, "Pohon & burung"), min: 6,
        say: "Langkah keempat, tambahkan pohon di kiri dan kanan, juga burung-burung yang terbang di langit." },
      { type: "custom", draw: step(4, "Warnai dengan ceria!"), min: 7,
        say: "Terakhir, warnai gambarmu! Langit biru, gunung hijau, matahari kuning cerah, dan jalan berwarna cokelat." },
      { type: "recap", title: "Gambarmu jadi!", points: ["⛰️ Dua gunung segitiga", "☀️ Matahari di tengah", "🛤️ Jalan & sawah", "🖍️ Warnai dengan ceria"], cta: "Ayo mulai menggambar!",
        say: "Bagus sekali! Ingat, jangan takut salah. Setiap gambar itu istimewa, karena kamu yang membuatnya!" }
    ]
  });
})();
