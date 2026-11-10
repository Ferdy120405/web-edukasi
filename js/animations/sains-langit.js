/* Animasi original: Kenapa Langit Berwarna Biru? */
(function () {
  const K = EduKit, G = K.G, PI = Math.PI;
  const RAINBOW = [["#FF3B3B", "merah"], ["#FF9F1C", "jingga"], ["#FFE11C", "kuning"], ["#2ECC71", "hijau"], ["#3BA9F5", "biru"], ["#4B4BD8", "nila"], ["#9B59F5", "ungu"]];

  function prism(ctx, lt, d, K, t) {
    K.skyGrad(ctx, "#1E2A5A", "#3A4C8C");
    K.stars(ctx, t, 40, 700);
    K.drawSun(ctx, 140, 330, 58, t);
    const beam = G.prog(lt, 0.4, 1.4);
    ctx.strokeStyle = "rgba(255,255,255,.95)"; ctx.lineWidth = 18; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(235, 330); ctx.lineTo(235 + (330) * beam, 330 + 10 * beam); ctx.stroke();
    ctx.fillStyle = "rgba(200,230,255,.35)"; ctx.strokeStyle = "#fff"; ctx.lineWidth = 5; ctx.lineJoin = "round";
    ctx.beginPath(); ctx.moveTo(620, 170); ctx.lineTo(740, 480); ctx.lineTo(500, 480); ctx.closePath(); ctx.fill(); ctx.stroke();
    RAINBOW.forEach(([c, name], i) => {
      const at = 1.8 + i * ((d * 0.78 - 1.8) / 7);
      const p = G.prog(lt, at, at + 0.6);
      if (p <= 0) return;
      const ty = 150 + i * 62;
      ctx.strokeStyle = c; ctx.lineWidth = 15;
      ctx.beginPath(); ctx.moveTo(670, 350); ctx.lineTo(G.lerp(670, 1080, p), G.lerp(350, ty, p)); ctx.stroke();
      if (p >= 1) G.text(ctx, name, 1170, ty, { size: 32, color: c, stroke: "#1E2A5A", strokeW: 6 });
    });
    G.pill(ctx, "Cahaya matahari = banyak warna", 36, 30, "#2ECC71", K.pop(lt, 0.1), 1);
  }

  const ZIG = [];
  for (let i = 0; i < 4; i++) {
    const pts = [[560, 380]];
    for (let k = 1; k < 5; k++) pts.push([150 + K.rnd(i * 10 + k) * 980, 340 + K.rnd(i * 10 + k + 5) * 150]);
    ZIG.push(pts);
  }
  function scatter(ctx, lt, d, K, t) {
    K.skyGrad(ctx, "#5AB4F2", "#CDEBFF");
    ctx.fillStyle = "rgba(255,255,255,.35)";
    ctx.beginPath(); ctx.arc(640, 1520, 1180, 0, 2 * PI); ctx.fill();
    ctx.fillStyle = "#4CAF50";
    ctx.beginPath(); ctx.arc(640, 1520, 1000, 0, 2 * PI); ctx.fill();
    ctx.fillStyle = "#3D8BD9";
    ctx.beginPath(); ctx.ellipse(1000, 640, 260, 60, -0.1, 0, 2 * PI); ctx.fill();
    for (let i = 0; i < 46; i++) {
      const x = 60 + K.rnd(i) * 1160, y = 360 + K.rnd(i + 70) * 150 + Math.sin(t * 2 + i) * 4;
      ctx.fillStyle = "rgba(255,255,255,.9)";
      ctx.beginPath(); ctx.arc(x, y, 5, 0, 2 * PI); ctx.fill();
    }
    K.drawSun(ctx, 130, 110, 50, t);
    const pr = G.prog(lt, 0.3, 1.8);
    ctx.lineCap = "round";
    ctx.strokeStyle = "#FF3B3B"; ctx.lineWidth = 9;
    ctx.beginPath(); ctx.moveTo(190, 150); ctx.lineTo(G.lerp(190, 900, pr), G.lerp(150, 560, pr)); ctx.stroke();
    const pb = G.prog(lt, 0.25 * d, 0.6 * d);
    if (pb > 0) {
      ctx.strokeStyle = "#1C6FE8"; ctx.lineWidth = 7;
      ctx.beginPath(); ctx.moveTo(190, 150); ctx.lineTo(560, 380); ctx.stroke();
      ZIG.forEach((pts) => {
        ctx.save();
        ctx.setLineDash([22, 14]);
        ctx.lineDashOffset = -t * 80;
        ctx.globalAlpha = pb;
        ctx.beginPath();
        const n = Math.max(1, Math.floor(pb * (pts.length - 1)) + 1);
        pts.slice(0, n + 1).forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
        ctx.stroke();
        ctx.restore();
      });
    }
    K.emoji(ctx, "🧒", 700, 520, 90);
    G.pill(ctx, "Biru memantul ke segala arah", 36, 30, "#3BA9F5", K.pop(lt, 0.1), 1);
    const pl = K.fade(lt, 0.2 * d);
    if (pl > 0) {
      ctx.save(); ctx.globalAlpha = pl;
      G.text(ctx, "partikel udara", 1080, 330, { size: 30, color: "#fff", stroke: "#1E5FA8", strokeW: 6 });
      ctx.restore();
    }
  }

  function sunset(ctx, lt, d, K, t) {
    const g = ctx.createLinearGradient(0, 0, 0, 470);
    g.addColorStop(0, "#5B3E96"); g.addColorStop(0.5, "#FF6B6B"); g.addColorStop(1, "#FFB347");
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1280, 720);
    const sy = G.lerp(380, 470, G.prog(lt, 0, d));
    ctx.fillStyle = "#FF8A3D";
    ctx.beginPath(); ctx.arc(640, sy, 95, 0, 2 * PI); ctx.fill();
    const sea = ctx.createLinearGradient(0, 470, 0, 720);
    sea.addColorStop(0, "#C0546B"); sea.addColorStop(1, "#3A2A6A");
    ctx.fillStyle = sea; ctx.fillRect(0, 470, 1280, 250);
    ctx.fillStyle = "rgba(255,180,90,.55)";
    for (let i = 0; i < 7; i++) {
      const w = 180 - i * 22 + Math.sin(t * 2 + i) * 10;
      G.rr(ctx, 640 - w / 2, 490 + i * 22, w, 8, 4); ctx.fill();
    }
    K.drawCloud(ctx, 260, 160, 0.8, "#FFC3A0", 0.85);
    K.drawCloud(ctx, 1020, 120, 0.7, "#FFB0A0", 0.85);
    K.emoji(ctx, "🌴", 140, 450, 170);
    K.emoji(ctx, "🌴", 1150, 460, 150, { flip: true });
    G.pill(ctx, "Saat senja: jingga & merah", 36, 30, "#FF6B6B", K.pop(lt, 0.1), 1);
  }

  EduKit.make("sains-langit", {
    title: "Kenapa Langit Berwarna Biru?",
    color: "#2ECC71", dark: "#1FA055", bg: "sky",
    scenes: [
      { type: "title", title: "Kenapa Langit Biru?", subtitle: "Rahasia cahaya matahari", emoji: "🌤️",
        say: "Halo, Ilmuwan Cilik! Pernahkah kamu bertanya, kenapa langit berwarna biru? Yuk cari tahu bersama Oli!" },
      { type: "custom", draw: prism,
        say: "Cahaya matahari terlihat putih, tapi sebenarnya terdiri dari banyak warna: merah, jingga, kuning, hijau, biru, nila, dan ungu. Seperti pelangi!" },
      { type: "custom", draw: scatter,
        say: "Udara di sekitar bumi penuh partikel yang sangat kecil. Saat cahaya matahari masuk, warna biru paling mudah terpantul ke segala arah." },
      { type: "talk", text: "Biru tersebar ke seluruh langit, jadi langit tampak biru!", emoji: ["👀", "💙", "🌍"],
        say: "Karena warna biru tersebar ke mana-mana, mata kita melihat langit berwarna biru!" },
      { type: "custom", draw: sunset,
        say: "Saat matahari terbenam, cahayanya menempuh jalan lebih jauh. Warna biru sudah tersebar di perjalanan, jadi langit tampak jingga dan merah." },
      { type: "recap", points: ["🌈 Cahaya matahari terdiri dari banyak warna", "💙 Biru paling mudah tersebar di udara", "🌇 Saat senja, langit jadi jingga"],
        say: "Sekarang kamu tahu rahasianya! Cahaya matahari punya banyak warna, dan biru paling mudah tersebar. Ayo jawab kuisnya!" }
    ]
  });
})();
