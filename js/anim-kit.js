/* =========================================================
   EduKit — perlengkapan membuat animasi original dengan cepat
   ---------------------------------------------------------
   Satu animasi = daftar adegan (scenes). Durasi tiap adegan
   dihitung otomatis dari panjang narasi (say), atau tulis
   sendiri dengan `dur` (detik) / `min` (durasi minimum).

   EduKit.make("id-animasi", {
     title, color, dark, bg,
     scenes: [
       { type: "title",  title, subtitle, emoji, say },
       { type: "talk",   text, emoji: ["🍎","🍊"], say },
       { type: "board",  lines: ["Baris 1", "Baris 2"], say },
       { type: "count",  items: [{ e:"🍎", n:3 }, { e:"🍎", n:2 }], op:"+", say },
       { type: "grid",   e:"🍪", rows:3, cols:4, label:"3 × 4 = 12", say },
       { type: "fraction", parts:4, filled:1, say }  /  { compare:[[1,2],[1,4]] },
       { type: "list",   title, items:[{ e, label, sub, color }], numbered, say },
       { type: "groups", groups:[{ title, sub, color, food, emojis:[] }], say },
       { type: "word",   parts:["BA","JU"], emoji:"👕", say },
       { type: "story",  bg, caption, actors:[...], bubbles:[...], say },
       { type: "sing",   bpm, singer, lines:[{ text:"Bin-tang ...", notes:[...] }] },
       { type: "recap",  points:["🧠 ..."], cta, say },
       { type: "custom", draw(ctx, lt, d, K, t) { ... }, say }
     ]
   });
   Teks dalam {kurung kurawal} pada `say` dibaca dengan suara Inggris.
   ========================================================= */
(function () {
  "use strict";
  const G = EduAnim.G;
  const { lerp, prog, clamp, ease, mix, PI } = G;
  const W = 1280, H = 720;
  const INK = "#2B2D42";
  const EMOJI_FONT = '"Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif';
  const BODY = '"Nunito", sans-serif';

  /* ---------- Utilitas ---------- */
  const pop = (lt, at, dur = 0.45) => (lt < at ? 0 : ease.outBack(prog(lt, at, at + dur)));
  const fade = (lt, at, dur = 0.4) => prog(lt, at, at + dur);
  const plain = (s) => String(s || "").replace(/[{}]/g, "");
  const speakLen = (sc) => plain(sc.say).length * 0.068 + 0.4;
  const talking = (sc, lt) => lt < speakLen(sc);
  const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

  function emoji(ctx, e, x, y, size, o = {}) {
    if (!e || size <= 1 || o.alpha === 0) return;
    ctx.save();
    ctx.translate(x, y);
    if (o.rot) ctx.rotate(o.rot);
    if (o.flip) ctx.scale(-1, 1);
    if (o.alpha != null) ctx.globalAlpha *= o.alpha;
    ctx.font = Math.round(size) + "px " + EMOJI_FONT;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000"; // emoji berwarna ikut memakai alpha fillStyle, jadi harus pekat
    ctx.fillText(e, 0, size * 0.06);
    ctx.restore();
  }

  function fitSize(ctx, text, maxW, size, weight, fam) {
    let s = size;
    ctx.font = G.font(s, weight, fam);
    while (s > 14 && ctx.measureText(text).width > maxW) { s -= 2; ctx.font = G.font(s, weight, fam); }
    return s;
  }

  function wrap(ctx, text, maxW) {
    const words = String(text).split(/\s+/);
    const lines = [];
    let line = "";
    words.forEach((w) => {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; } else line = test;
    });
    if (line) lines.push(line);
    return lines;
  }

  function card(ctx, x, y, w, h, o = {}) {
    const r = o.r == null ? 26 : o.r;
    if (o.shadow !== false) {
      ctx.fillStyle = o.shadowColor || "rgba(0,0,0,.16)";
      G.rr(ctx, x, y + 7, w, h, r); ctx.fill();
    }
    ctx.fillStyle = o.fill || "#fff";
    G.rr(ctx, x, y, w, h, r); ctx.fill();
    if (o.stroke) { ctx.lineWidth = o.sw || 5; ctx.strokeStyle = o.stroke; ctx.stroke(); }
  }

  function bubble(ctx, tx, ty, text, a) {
    if (a <= 0 || !text) return;
    ctx.save();
    ctx.globalAlpha *= clamp(a);
    ctx.font = G.font(30, 800, BODY);
    const lines = wrap(ctx, text, 360);
    const lh = 38;
    const w = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 44;
    const h = lines.length * lh + 26;
    const bx = clamp(tx - w / 2, 16, W - 16 - w);
    const by = Math.max(10, ty - 22 - h) + (1 - clamp(a)) * 12;
    ctx.fillStyle = "rgba(0,0,0,.15)";
    G.rr(ctx, bx, by + 5, w, h, 22); ctx.fill();
    ctx.fillStyle = "#fff";
    G.rr(ctx, bx, by, w, h, 22); ctx.fill();
    const tailX = clamp(tx, bx + 26, bx + w - 26);
    ctx.beginPath();
    ctx.moveTo(tailX - 14, by + h - 2); ctx.lineTo(tailX + 14, by + h - 2); ctx.lineTo(tx, Math.max(by + h + 4, ty - 4));
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = INK;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    lines.forEach((l, i) => ctx.fillText(l, bx + w / 2, by + 13 + lh / 2 + i * lh));
    ctx.restore();
  }

  function headPill(ctx, text, th, lt, x = 36, y = 30) {
    if (!text) return;
    G.pill(ctx, text, x, y, th.color, pop(lt, 0.1), 1);
  }

  function numBadge(ctx, n, x, y, r, color) {
    if (r <= 2) return;
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * PI); ctx.fill();
    G.text(ctx, String(n), x, y + r * 0.08, { size: r * 1.2, color: "#fff" });
  }

  function fracText(ctx, num, den, x, y, size, color) {
    G.text(ctx, String(num), x, y - size * 0.62, { size, color });
    ctx.fillStyle = color;
    G.rr(ctx, x - size * 0.55, y - size * 0.07, size * 1.1, size * 0.14, size * 0.07); ctx.fill();
    G.text(ctx, String(den), x, y + size * 0.66, { size, color });
  }

  function sparkle(ctx, x, y, r, a, color) {
    if (a <= 0) return;
    ctx.save();
    ctx.globalAlpha *= clamp(a);
    ctx.strokeStyle = color || "#fff";
    ctx.lineWidth = Math.max(2, r * 0.3);
    ctx.lineCap = "round";
    for (let i = 0; i < 4; i++) {
      const ang = (i * PI) / 4;
      const rr = i % 2 ? r * 0.6 : r;
      ctx.beginPath();
      ctx.moveTo(x - Math.cos(ang) * rr, y - Math.sin(ang) * rr);
      ctx.lineTo(x + Math.cos(ang) * rr, y + Math.sin(ang) * rr);
      ctx.stroke();
    }
    ctx.restore();
  }

  /* ---------- Karakter: Oli si burung hantu ---------- */
  function drawOli(ctx, x, y, s, o = {}) {
    if (s <= 0.01) return;
    const t = o.t || 0;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s * (o.flip ? -1 : 1), s);
    if (o.rot) ctx.rotate(o.rot);
    ctx.translate(-60, -60);
    const ell = (cx, cy, rx, ry, fill, rot) => {
      ctx.fillStyle = fill; ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, rot || 0, 0, 2 * PI); ctx.fill();
    };
    ell(60, 112, 30, 5, "rgba(0,0,0,.13)");
    ell(20, 76, 11, 21, "#6D3FE0", 0.32);
    if (o.wave) {
      const a = -0.6 + Math.sin(t * 8) * 0.45;
      ctx.save(); ctx.translate(92, 62); ctx.rotate(a);
      ell(14, -6, 11, 22, "#6D3FE0", -1.2);
      ctx.restore();
    } else ell(100, 76, 11, 21, "#6D3FE0", -0.32);
    ell(60, 66, 40, 44, "#8B5CF6");
    ell(60, 80, 25, 26, "#D9CCFF");
    ctx.strokeStyle = "#B9A6F5"; ctx.lineWidth = 3;
    [78, 90].forEach((yy) => {
      ctx.beginPath(); ctx.moveTo(50, yy); ctx.quadraticCurveTo(55, yy + 4, 60, yy); ctx.quadraticCurveTo(65, yy + 4, 70, yy); ctx.stroke();
    });
    const blink = (t % 3.7) < 0.12;
    if (blink) {
      ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineCap = "round";
      ctx.beginPath(); ctx.moveTo(32, 54); ctx.lineTo(52, 54); ctx.moveTo(68, 54); ctx.lineTo(88, 54); ctx.stroke();
    } else {
      ell(42, 52, 15, 15, "#fff"); ell(78, 52, 15, 15, "#fff");
      ell(44, 54, 7.5, 7.5, INK); ell(76, 54, 7.5, 7.5, INK);
      ell(47, 51, 2.6, 2.6, "#fff"); ell(79, 51, 2.6, 2.6, "#fff");
    }
    ctx.fillStyle = "#FFB020";
    if (o.talk && Math.sin(t * 17) > -0.2) {
      ctx.beginPath(); ctx.moveTo(53, 62); ctx.lineTo(67, 62); ctx.lineTo(60, 68); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#7A2E1C";
      ctx.beginPath(); ctx.moveTo(55, 68); ctx.lineTo(65, 68); ctx.lineTo(60, 73); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#FFB020";
      ctx.beginPath(); ctx.moveTo(55, 71); ctx.lineTo(65, 71); ctx.lineTo(60, 77); ctx.closePath(); ctx.fill();
    } else {
      ctx.beginPath(); ctx.moveTo(53, 64); ctx.lineTo(67, 64); ctx.lineTo(60, 74); ctx.closePath(); ctx.fill();
    }
    ell(48, 108, 7, 4, "#FFB020"); ell(72, 108, 7, 4, "#FFB020");
    ctx.fillStyle = INK;
    ctx.beginPath(); ctx.moveTo(28, 26); ctx.lineTo(60, 12); ctx.lineTo(92, 26); ctx.lineTo(60, 40); ctx.closePath(); ctx.fill();
    G.rr(ctx, 44, 28, 32, 10, 3); ctx.fill();
    ctx.strokeStyle = "#FFC93C"; ctx.lineWidth = 3; ctx.lineCap = "round";
    const sw = Math.sin(t * 3) * 2;
    ctx.beginPath(); ctx.moveTo(90, 26); ctx.lineTo(94 + sw, 44); ctx.stroke();
    ell(94 + sw, 46, 4, 4, "#FFC93C");
    ell(30, 66, 5, 5, "rgba(255,143,184,.7)"); ell(90, 66, 5, 5, "rgba(255,143,184,.7)");
    ctx.restore();
  }

  /* ---------- Karakter: Tetes si tetesan air ---------- */
  function drawTetes(ctx, x, y, s, o = {}) {
    if (s <= 0.01) return;
    const t = o.t || 0;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s * (o.flip ? -1 : 1), s);
    const g = ctx.createLinearGradient(-30, -50, 30, 46);
    g.addColorStop(0, "#A6E0FF"); g.addColorStop(1, "#2E9BEA");
    ctx.beginPath();
    ctx.moveTo(0, -52);
    ctx.bezierCurveTo(12, -32, 34, -12, 34, 12);
    ctx.arc(0, 12, 34, 0, PI);
    ctx.bezierCurveTo(-34, -12, -12, -32, 0, -52);
    ctx.closePath();
    ctx.fillStyle = g; ctx.fill();
    ctx.lineWidth = 4; ctx.strokeStyle = "#1C84CF"; ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,.8)";
    ctx.beginPath(); ctx.ellipse(-17, -4, 5, 11, 0.4, 0, 2 * PI); ctx.fill();
    ctx.fillStyle = INK; ctx.strokeStyle = INK; ctx.lineWidth = 3.5; ctx.lineCap = "round";
    if ((t % 3.2) < 0.13) {
      ctx.beginPath(); ctx.moveTo(-16, 8); ctx.lineTo(-6, 8); ctx.moveTo(6, 8); ctx.lineTo(16, 8); ctx.stroke();
    } else {
      [-11, 11].forEach((ex) => {
        ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(ex, 8, 5.5, 0, 2 * PI); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(ex + 2, 6, 1.9, 0, 2 * PI); ctx.fill();
      });
    }
    if (o.talk && Math.sin(t * 17) > -0.2) {
      ctx.fillStyle = "#C2185B"; ctx.beginPath(); ctx.ellipse(0, 22, 6, 6, 0, 0, 2 * PI); ctx.fill();
    } else {
      ctx.beginPath(); ctx.arc(0, 17, 9, 0.15 * PI, 0.85 * PI); ctx.stroke();
    }
    ctx.fillStyle = "rgba(255,120,170,.5)";
    ctx.beginPath(); ctx.arc(-21, 20, 5, 0, 2 * PI); ctx.fill();
    ctx.beginPath(); ctx.arc(21, 20, 5, 0, 2 * PI); ctx.fill();
    ctx.restore();
  }

  /* ---------- Karakter hewan buatan sendiri ---------- */
  // Buaya berbaring di permukaan air (menghadap kiri; flip = menghadap kanan)
  function drawCroc(ctx, x, y, s, o = {}) {
    const t = o.t || 0;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s * (o.flip ? -1 : 1), s * 1.4);
    ctx.fillStyle = "#3E9E5B";
    ctx.beginPath();
    ctx.moveTo(-95, 2);
    ctx.quadraticCurveTo(-90, -14, -55, -14);
    ctx.quadraticCurveTo(-20, -30, 30, -22);
    ctx.quadraticCurveTo(70, -16, 120, -4 + Math.sin(t * 3) * 4);
    ctx.quadraticCurveTo(70, 8, 30, 12);
    ctx.lineTo(-60, 12);
    ctx.quadraticCurveTo(-92, 12, -95, 2);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#2F7F48";
    for (let i = 0; i < 6; i++) {
      const bx = -30 + i * 20;
      ctx.beginPath(); ctx.moveTo(bx - 7, -20 + i * 1.5); ctx.lineTo(bx, -31 + i * 1.5); ctx.lineTo(bx + 7, -20 + i * 1.5); ctx.closePath(); ctx.fill();
    }
    ctx.fillStyle = "#A8E6B8";
    ctx.beginPath(); ctx.ellipse(-30, 8, 40, 5, 0, 0, 2 * PI); ctx.fill();
    ctx.fillStyle = "#3E9E5B";
    ctx.beginPath(); ctx.arc(-48, -18, 9, 0, 2 * PI); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(-48, -19, 6, 0, 2 * PI); ctx.fill();
    ctx.fillStyle = INK;
    if ((t + (o.seed || 0)) % 3.3 < 0.12) ctx.fillRect(-53, -19, 10, 2.5);
    else { ctx.beginPath(); ctx.arc(-49, -19, 3, 0, 2 * PI); ctx.fill(); }
    ctx.strokeStyle = "#1F5A33"; ctx.lineWidth = 2.5; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(-92, 2); ctx.quadraticCurveTo(-70, 6, -52, 2); ctx.stroke();
    ctx.fillStyle = "#fff";
    [-85, -76, -67].forEach((tx) => { ctx.beginPath(); ctx.moveTo(tx, 2); ctx.lineTo(tx + 3, 7); ctx.lineTo(tx + 6, 2); ctx.closePath(); ctx.fill(); });
    ctx.restore();
  }

  // Ikan emas berkilau (menghadap kiri; flip = menghadap kanan)
  function drawFish(ctx, x, y, s, o = {}) {
    const t = o.t || 0;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s * (o.flip ? -1 : 1), s);
    const wag = Math.sin(t * 10) * 0.25;
    ctx.save(); ctx.translate(38, 0); ctx.rotate(wag);
    ctx.fillStyle = "#F5A623";
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(34, -26); ctx.quadraticCurveTo(26, 0, 34, 26); ctx.closePath(); ctx.fill();
    ctx.restore();
    const g = ctx.createLinearGradient(0, -30, 0, 30);
    g.addColorStop(0, "#FFE066"); g.addColorStop(1, "#F5A623");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.ellipse(0, 0, 46, 30, 0, 0, 2 * PI); ctx.fill();
    ctx.fillStyle = "#F08C00";
    ctx.beginPath(); ctx.moveTo(-6, -26); ctx.quadraticCurveTo(10, -46, 22, -24); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(240,140,0,.6)"; ctx.lineWidth = 3;
    [0, 12, 24].forEach((sx) => { ctx.beginPath(); ctx.arc(sx, 0, 14, -1, 1); ctx.stroke(); });
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(-24, -6, 8, 0, 2 * PI); ctx.fill();
    ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(-26, -6, 4, 0, 2 * PI); ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(-34, 6, 6, 0.1 * PI, 0.7 * PI); ctx.stroke();
    ctx.restore();
  }

  /* ---------- Benda latar ---------- */
  function drawTree(ctx, x, y, s, fruit) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.fillStyle = "#9C6B3F";
    G.rr(ctx, -9, -44, 18, 48, 6); ctx.fill();
    ctx.fillStyle = "#3FA04F";
    ctx.beginPath();
    [[0, -78, 38], [-28, -54, 27], [28, -54, 27]].forEach(([px, py, r]) => { ctx.moveTo(px + r, py); ctx.arc(px, py, r, 0, 2 * PI); });
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.17)";
    ctx.beginPath(); ctx.arc(-12, -90, 13, 0, 2 * PI); ctx.fill();
    ctx.restore();
    if (fruit) [[-20, -70], [18, -82], [26, -52], [-30, -48], [2, -100]].forEach(([fx, fy]) => emoji(ctx, fruit, x + fx * s, y + fy * s, 26 * s));
  }

  function drawCloud(ctx, x, y, s, color, alpha) {
    if (alpha <= 0) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.globalAlpha *= alpha == null ? 1 : alpha;
    ctx.fillStyle = color || "#fff";
    ctx.beginPath();
    [[0, -10, 48], [-52, 10, 36], [52, 10, 38], [-26, -30, 34], [28, -34, 40], [0, 16, 40]].forEach(([px, py, r]) => {
      ctx.moveTo(px + r, py); ctx.arc(px, py, r, 0, 2 * PI);
    });
    ctx.fill();
    ctx.restore();
  }

  function drawSun(ctx, x, y, r, t) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(t * 0.25);
    ctx.strokeStyle = "#FFB020"; ctx.lineWidth = r * 0.16; ctx.lineCap = "round";
    for (let i = 0; i < 12; i++) {
      const a = (i * PI) / 6;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r * 1.25, Math.sin(a) * r * 1.25);
      ctx.lineTo(Math.cos(a) * r * 1.6, Math.sin(a) * r * 1.6);
      ctx.stroke();
    }
    ctx.rotate(-t * 0.25);
    ctx.fillStyle = "#FFC93C";
    ctx.beginPath(); ctx.arc(0, 0, r, 0, 2 * PI); ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = r * 0.07;
    ctx.beginPath(); ctx.arc(-r * 0.32, -r * 0.05, r * 0.13, PI * 1.1, PI * 1.9); ctx.stroke();
    ctx.beginPath(); ctx.arc(r * 0.32, -r * 0.05, r * 0.13, PI * 1.1, PI * 1.9); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, r * 0.12, r * 0.28, 0.15 * PI, 0.85 * PI); ctx.stroke();
    ctx.restore();
  }

  function skyGrad(ctx, top, bot, h = H) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, top); g.addColorStop(1, bot);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function driftClouds(ctx, t, n = 3, y0 = 80) {
    for (let i = 0; i < n; i++) {
      const cx = ((t * 16 + i * 470) % 1600) - 160;
      drawCloud(ctx, cx, y0 + (i % 2) * 60, 0.5 + (i % 2) * 0.12, "#fff", 0.9);
    }
  }

  function stars(ctx, t, n, maxY) {
    for (let i = 0; i < n; i++) {
      const x = rnd(i) * W, y = rnd(i + 99) * maxY;
      const a = 0.35 + 0.65 * Math.abs(Math.sin(t * (0.8 + rnd(i + 7)) + i));
      ctx.fillStyle = "rgba(255,255,255," + a + ")";
      ctx.beginPath(); ctx.arc(x, y, 1 + rnd(i + 3) * 2.2, 0, 2 * PI); ctx.fill();
    }
  }

  function water(ctx, x0, x1, y0, y1, t, dark) {
    const g = ctx.createLinearGradient(0, y0, 0, y1);
    g.addColorStop(0, dark ? "#2E7FB8" : "#4DB8F5"); g.addColorStop(1, dark ? "#164E7A" : "#1C7CC4");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x0, y1);
    for (let x = x0; x <= x1; x += 16) ctx.lineTo(x, y0 + Math.sin(x * 0.02 + t * 1.8) * 5);
    ctx.lineTo(x1, y1);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.4)"; ctx.lineWidth = 4; ctx.lineCap = "round";
    for (let i = 0; i < 8; i++) {
      const x = x0 + ((i * 157 + t * 22) % Math.max(60, x1 - x0));
      const y = y0 + 25 + (i % 3) * ((y1 - y0 - 40) / 3);
      ctx.beginPath(); ctx.arc(x, y, 12, 1.15 * PI, 1.85 * PI); ctx.stroke();
    }
  }

  /* ---------- Latar belakang ---------- */
  const BG = {
    plain(ctx) {
      ctx.fillStyle = "#FFF8EC"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#FFE9C7";
      for (let x = 14; x < W; x += 28) for (let y = 14; y < H; y += 28) { ctx.beginPath(); ctx.arc(x, y, 2, 0, 2 * PI); ctx.fill(); }
    },
    stage(ctx, t, th) {
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, th.color); g.addColorStop(1, th.dark);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(255,255,255,.12)";
      ctx.beginPath(); ctx.arc(1160, 70, 210, 0, 2 * PI); ctx.fill();
      ctx.beginPath(); ctx.arc(80, 660, 170, 0, 2 * PI); ctx.fill();
      for (let i = 0; i < 16; i++) sparkle(ctx, rnd(i) * W, 40 + rnd(i + 40) * 600, 8, 0.3 + 0.4 * Math.sin(t * 2.5 + i));
    },
    sky(ctx, t) {
      skyGrad(ctx, "#74C4F7", "#DDF4FF", 560);
      drawSun(ctx, 1140, 100, 46, t);
      driftClouds(ctx, t);
      ctx.fillStyle = "#94DB80";
      ctx.beginPath(); ctx.ellipse(300, 640, 620, 170, 0, 0, 2 * PI); ctx.fill();
      ctx.fillStyle = "#7CCF68";
      ctx.beginPath(); ctx.ellipse(1050, 660, 560, 170, 0, 0, 2 * PI); ctx.fill();
      for (let i = 0; i < 9; i++) {
        const fx = 60 + i * 140, fy = 560 + (i % 3) * 30;
        ctx.fillStyle = ["#FF6FAE", "#FFC93C", "#fff"][i % 3];
        ctx.beginPath(); ctx.arc(fx, fy, 7, 0, 2 * PI); ctx.fill();
      }
    },
    class(ctx) {
      ctx.fillStyle = "#FCE7C8"; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(255,255,255,.35)";
      for (let x = 0; x < W; x += 80) ctx.fillRect(x, 0, 40, 560);
      ctx.fillStyle = "#E2BE92"; ctx.fillRect(0, 560, W, 160);
      ctx.fillStyle = "#A86F3D"; G.rr(ctx, 130, 40, 1020, 470, 26); ctx.fill();
      ctx.fillStyle = "#2F6B4F"; G.rr(ctx, 150, 60, 980, 430, 16); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.04)";
      ctx.beginPath(); ctx.ellipse(400, 200, 200, 60, 0.2, 0, 2 * PI); ctx.fill();
      ctx.beginPath(); ctx.ellipse(850, 380, 220, 50, -0.1, 0, 2 * PI); ctx.fill();
      ctx.fillStyle = "#8B5A2B"; G.rr(ctx, 170, 494, 940, 14, 6); ctx.fill();
      ctx.fillStyle = "#fff"; G.rr(ctx, 260, 486, 44, 10, 4); ctx.fill();
      ctx.fillStyle = "#FFE58A"; G.rr(ctx, 320, 486, 34, 10, 4); ctx.fill();
    },
    night(ctx, t) {
      skyGrad(ctx, "#141A46", "#3B2C78");
      stars(ctx, t, 70, 520);
      ctx.fillStyle = "#FFF3B0";
      ctx.beginPath(); ctx.arc(1130, 110, 52, 0, 2 * PI); ctx.fill();
      ctx.fillStyle = "rgba(230,210,140,.6)";
      ctx.beginPath(); ctx.arc(1115, 95, 9, 0, 2 * PI); ctx.arc(1145, 125, 7, 0, 2 * PI); ctx.fill();
      ctx.fillStyle = "#1E1A4A";
      ctx.beginPath(); ctx.ellipse(250, 720, 520, 140, 0, 0, 2 * PI); ctx.fill();
      ctx.beginPath(); ctx.ellipse(1050, 730, 560, 150, 0, 0, 2 * PI); ctx.fill();
    },
    space(ctx, t) {
      const g = ctx.createRadialGradient(640, 360, 50, 640, 360, 820);
      g.addColorStop(0, "#2A1A5E"); g.addColorStop(1, "#070716");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "rgba(255,111,174,.08)";
      ctx.beginPath(); ctx.ellipse(300, 200, 260, 120, 0.4, 0, 2 * PI); ctx.fill();
      ctx.fillStyle = "rgba(59,169,245,.08)";
      ctx.beginPath(); ctx.ellipse(1000, 520, 300, 130, -0.3, 0, 2 * PI); ctx.fill();
      stars(ctx, t, 140, H);
    },
    forest(ctx, t) {
      skyGrad(ctx, "#7CCBF8", "#E0F6FF", 520);
      driftClouds(ctx, t, 3, 70);
      ctx.fillStyle = "#A6DD8F";
      ctx.beginPath(); ctx.ellipse(640, 560, 900, 160, 0, 0, 2 * PI); ctx.fill();
      for (let i = 0; i < 9; i++) drawTree(ctx, 40 + i * 150, 500 + (i % 2) * 12, 0.9 + (i % 3) * 0.1);
      ctx.fillStyle = "#86D774"; ctx.fillRect(0, 510, W, 210);
      ctx.fillStyle = "#74C863";
      for (let i = 0; i < 30; i++) { ctx.beginPath(); ctx.arc(rnd(i) * W, 540 + rnd(i + 5) * 170, 10, PI, 2 * PI); ctx.fill(); }
    },
    riverside(ctx, t) {
      skyGrad(ctx, "#7CCBF8", "#E0F6FF", 470);
      drawSun(ctx, 1160, 90, 40, t);
      driftClouds(ctx, t, 3, 70);
      water(ctx, 340, 940, 470, H, t);
      ctx.fillStyle = "#86D774";
      ctx.beginPath(); ctx.moveTo(0, 440); ctx.lineTo(380, 440); ctx.quadraticCurveTo(420, 560, 360, 720); ctx.lineTo(0, 720); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(1280, 440); ctx.lineTo(900, 440); ctx.quadraticCurveTo(860, 560, 920, 720); ctx.lineTo(1280, 720); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#6CBF5A"; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.moveTo(0, 444); ctx.lineTo(380, 444); ctx.moveTo(900, 444); ctx.lineTo(1280, 444); ctx.stroke();
      drawTree(ctx, 70, 445, 1);
      drawTree(ctx, 180, 450, 0.75);
      drawTree(ctx, 1150, 445, 1.35, "🍎");
    },
    lake(ctx, t) {
      skyGrad(ctx, "#8CCFF7", "#E6F7FF", 400);
      driftClouds(ctx, t, 3, 70);
      ctx.fillStyle = "#6FA88A";
      ctx.beginPath(); ctx.moveTo(-40, 400); ctx.lineTo(220, 200); ctx.lineTo(420, 330); ctx.lineTo(600, 180); ctx.lineTo(840, 340); ctx.lineTo(1040, 210); ctx.lineTo(1320, 400); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,.12)";
      ctx.beginPath(); ctx.moveTo(220, 200); ctx.lineTo(170, 400); ctx.lineTo(260, 400); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(600, 180); ctx.lineTo(560, 400); ctx.lineTo(640, 400); ctx.closePath(); ctx.fill();
      water(ctx, 0, W, 390, 640, t);
      ctx.fillStyle = "#86D774";
      ctx.beginPath(); ctx.moveTo(0, 600); ctx.quadraticCurveTo(640, 560, 1280, 610); ctx.lineTo(1280, 720); ctx.lineTo(0, 720); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#4E9E45"; ctx.lineWidth = 4;
      for (let i = 0; i < 14; i++) {
        const x = 30 + i * 92;
        ctx.beginPath(); ctx.moveTo(x, 610); ctx.quadraticCurveTo(x + 6, 580, x + 2 + Math.sin(t * 2 + i) * 4, 560); ctx.stroke();
      }
    },
    village(ctx, t) {
      skyGrad(ctx, "#7CCBF8", "#E0F6FF", 460);
      drawSun(ctx, 160, 100, 44, t);
      driftClouds(ctx, t, 3, 80);
      ctx.fillStyle = "#9AD98A";
      ctx.beginPath(); ctx.ellipse(640, 500, 900, 120, 0, 0, 2 * PI); ctx.fill();
      const bands = ["#8ED36F", "#7FCB5F", "#93D877", "#78C457", "#8BD06B"];
      bands.forEach((c, i) => { ctx.fillStyle = c; ctx.fillRect(0, 470 + i * 50, W, 50); });
      ctx.strokeStyle = "rgba(60,120,40,.35)"; ctx.lineWidth = 3;
      for (let i = 0; i < 5; i++) { ctx.beginPath(); ctx.moveTo(0, 470 + i * 50); ctx.lineTo(W, 470 + i * 50); ctx.stroke(); }
      ctx.fillStyle = "#F4D6A0"; ctx.fillRect(900, 330, 230, 150);
      ctx.fillStyle = "#C0504D";
      ctx.beginPath(); ctx.moveTo(870, 335); ctx.lineTo(1015, 240); ctx.lineTo(1160, 335); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#8B5A2B"; ctx.fillRect(990, 400, 50, 80);
      ctx.fillStyle = "#7EC8F8"; ctx.fillRect(925, 360, 46, 40); ctx.fillRect(1062, 360, 46, 40);
      drawTree(ctx, 780, 470, 1.1);
      drawTree(ctx, 1220, 475, 0.9);
    },
    sea(ctx, t) {
      skyGrad(ctx, "#74C4F7", "#DDF4FF", 420);
      drawSun(ctx, 1120, 100, 48, t);
      driftClouds(ctx, t);
      water(ctx, 0, W, 420, H, t);
      ctx.fillStyle = "#F5D58A";
      ctx.beginPath(); ctx.moveTo(0, 600); ctx.quadraticCurveTo(500, 560, 1280, 640); ctx.lineTo(1280, 720); ctx.lineTo(0, 720); ctx.closePath(); ctx.fill();
    },
    desk(ctx) {
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, "#DDA56C"); g.addColorStop(1, "#C08048");
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = "rgba(120,70,30,.18)"; ctx.lineWidth = 3;
      for (let i = 0; i < 12; i++) {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 40) { const y = 30 + i * 62 + Math.sin(x * 0.01 + i) * 8; x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); }
        ctx.stroke();
      }
      emoji(ctx, "✏️", 90, 120, 70, { rot: -0.5 });
      emoji(ctx, "📏", 1190, 600, 70, { rot: 0.4 });
    }
  };
  const TYPE_BG = { title: "stage", board: "class", recap: "stage", sing: "night" };

  /* ---------- Penggambar adegan ---------- */
  const R = {};

  R.title = (ctx, sc, lt, d, t, th) => {
    G.text(ctx, "EduStream Kids • Animasi Original", 640, 44, { size: 26, color: "rgba(255,255,255,.88)" });
    const p = pop(lt, 0.2, 0.6);
    if (p > 0) {
      ctx.save();
      ctx.translate(640, 160);
      ctx.scale(p, p);
      const sz = fitSize(ctx, sc.title, 1180, 96);
      G.text(ctx, sc.title, 0, 0, { size: sz, color: "#fff", stroke: th.dark, strokeW: 14 });
      ctx.restore();
    }
    if (sc.subtitle) {
      ctx.save();
      ctx.globalAlpha = fade(lt, 0.7, 0.5);
      G.text(ctx, sc.subtitle, 640, 258, { size: 46, color: "#FFE58A", stroke: "rgba(40,20,90,.45)", strokeW: 8 });
      ctx.restore();
    }
    emoji(ctx, sc.emoji || "⭐", 500, 450 - Math.abs(Math.sin(t * 2.6)) * 16, 180 * pop(lt, 1.0, 0.5));
    drawOli(ctx, 790, 450, 1.9 * pop(lt, 1.3, 0.5), { t, wave: true, talk: talking(sc, lt) });
  };

  R.talk = (ctx, sc, lt, d, t, th) => {
    drawOli(ctx, 200, 420, 2.1, { t, talk: talking(sc, lt), wave: sc.wave });
    let top = 60;
    if (sc.text) {
      const a = fade(lt, 0.15, 0.4);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.font = G.font(44);
      const lines = wrap(ctx, sc.text, 740);
      const h = lines.length * 56 + 40;
      card(ctx, 400, 50 + (1 - a) * 20, 820, h, { stroke: th.color, sw: 6 });
      lines.forEach((l, i) => G.text(ctx, l, 810, 50 + (1 - a) * 20 + 20 + 28 + i * 56, { size: 44, color: th.dark }));
      ctx.restore();
      top = 50 + h + 20;
    }
    const ems = Array.isArray(sc.emoji) ? sc.emoji : sc.emoji ? [sc.emoji] : [];
    const n = ems.length;
    if (!n) return;
    const size = sc.size || (n === 1 ? 210 : n === 2 ? 170 : n === 3 ? 140 : 115);
    const sp = size * 1.18;
    const cy = top + (580 - top) / 2;
    ems.forEach((e, k) => {
      const x = 810 + (k - (n - 1) / 2) * sp;
      emoji(ctx, e, x, cy + Math.sin(t * 2 + k) * 10, size * pop(lt, 0.35 + k * 0.35));
    });
  };

  R.board = (ctx, sc, lt, d, t, th) => {
    const lines = sc.lines.map((l) => (typeof l === "string" ? { text: l } : l));
    const n = lines.length;
    const top = 85, bottom = 475;
    const lh = Math.min(96, (bottom - top) / n);
    const base = sc.size || Math.min(62, lh * 0.7);
    const from = (sc.from == null ? 0.04 : sc.from) * d, to = (sc.to == null ? 0.78 : sc.to) * d;
    const offY = ((bottom - top) - lh * n) / 2;
    lines.forEach((ln, i) => {
      const at = ln.at != null ? ln.at : from + (i * (to - from)) / n;
      const p = prog(lt, at, at + 0.7);
      if (p <= 0) return;
      const y = top + offY + lh * (i + 0.5);
      const size = fitSize(ctx, ln.text, 900, ln.size || base);
      ctx.save();
      ctx.font = G.font(size);
      const w = ctx.measureText(ln.text).width;
      ctx.beginPath();
      ctx.rect(640 - w / 2 - 30, y - size, (w + 60) * p, size * 2);
      ctx.clip();
      const head = i === 0 && sc.head !== false;
      G.text(ctx, ln.text, 640, y, { size, color: ln.color || (head ? "#FFE58A" : "#F4F1E8") });
      ctx.restore();
    });
    drawOli(ctx, 1175, 525, 1.25, { t, talk: talking(sc, lt) });
  };

  function drawGroup(ctx, grp, cx, cy, lt, t0, t1, t, th) {
    const n = grp.n, per = n <= 3 ? n : 3, rows = Math.ceil(n / per);
    const size = 88, sp = 106;
    for (let k = 0; k < n; k++) {
      const at = t0 + (k * (t1 - t0)) / n;
      const p = pop(lt, at);
      if (p <= 0) continue;
      const inRow = Math.min(per, n - Math.floor(k / per) * per);
      const x = cx + ((k % per) - (inRow - 1) / 2) * sp;
      const y = cy + (Math.floor(k / per) - (rows - 1) / 2) * sp;
      emoji(ctx, grp.e, x, y + Math.sin(t * 3 + k) * 3, size * p);
    }
    return rows;
  }

  R.count = (ctx, sc, lt, d, t, th) => {
    headPill(ctx, sc.title, th, lt);
    const g = sc.items;
    if (g.length === 1) {
      const { e, n } = g[0];
      const pre = sc.pre || 0;
      const per = sc.perRow || (n <= 5 ? n : n <= 10 ? 5 : 10);
      const rows = Math.ceil(n / per);
      const size = per >= 10 ? 72 : n <= 5 ? 120 : 92;
      const sp = size * 1.3;
      const gx = 640 - ((per - 1) * sp) / 2;
      const gy = 320 - ((rows - 1) * sp * 1.2) / 2;
      const from = (sc.from == null ? 0.3 : sc.from) * d, to = (sc.to == null ? 0.84 : sc.to) * d;
      let shown = 0;
      for (let k = 0; k < n; k++) {
        const at = k < pre ? 0.15 : from + ((k - pre) * (to - from)) / Math.max(1, n - pre);
        const p = pop(lt, at);
        if (p <= 0) continue;
        shown = k + 1;
        const x = gx + (k % per) * sp, y = gy + Math.floor(k / per) * sp * 1.2;
        emoji(ctx, e, x, y + Math.sin(t * 3 + k) * 3, size * p);
        numBadge(ctx, k + 1, x, y + size * 0.66, size * 0.24 * clamp(p), th.color);
      }
      ctx.fillStyle = "rgba(0,0,0,.15)";
      ctx.beginPath(); ctx.arc(1150, 118, 70, 0, 2 * PI); ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(1150, 110, 70, 0, 2 * PI); ctx.fill();
      ctx.lineWidth = 7; ctx.strokeStyle = th.color; ctx.stroke();
      G.text(ctx, String(shown), 1150, 114, { size: 72, color: th.dark });
      return;
    }
    const A = g[0], B = g[1], tot = A.n + B.n;
    const tA1 = 0.3 * d, tB0 = 0.38 * d, tB1 = 0.6 * d, tEq = 0.7 * d;
    drawGroup(ctx, A, 300, 290, lt, 0.08 * d, tA1, t, th);
    const pp = pop(lt, 0.33 * d);
    if (pp > 0) G.text(ctx, "+", 560, 290, { size: 110 * pp, color: th.dark });
    drawGroup(ctx, B, 800, 290, lt, tB0, tB1, t, th);
    const pe = pop(lt, tEq);
    if (pe > 0) {
      G.text(ctx, "=", 1010, 290, { size: 110 * pe, color: th.dark });
      ctx.fillStyle = th.color;
      ctx.beginPath(); ctx.arc(1140, 290, 78 * pe, 0, 2 * PI); ctx.fill();
      G.text(ctx, String(tot), 1140, 295, { size: 92 * pe, color: "#fff" });
    }
    let eq = "";
    if (lt >= tA1) eq += A.n;
    if (lt >= tB1) eq += " + " + B.n;
    if (lt >= tEq) eq += " = " + tot;
    if (eq) {
      ctx.save();
      ctx.font = G.font(60);
      const w = ctx.measureText(eq).width + 70;
      card(ctx, 640 - w / 2, 500, w, 86, { stroke: th.color, sw: 6, r: 43 });
      ctx.restore();
      G.text(ctx, eq, 640, 545, { size: 60, color: INK });
    }
  };

  R.grid = (ctx, sc, lt, d, t, th) => {
    headPill(ctx, sc.title, th, lt);
    const rows = sc.rows, cols = sc.cols, size = sc.size || 78, sp = size * 1.28;
    const gx = 560 - ((cols - 1) * sp) / 2, gy = 285 - ((rows - 1) * sp) / 2;
    const from = 0.12 * d, to = 0.62 * d;
    for (let r = 0; r < rows; r++) {
      const at = from + (r * (to - from)) / rows;
      for (let c = 0; c < cols; c++) {
        const p = pop(lt, at + c * 0.12);
        if (p > 0) emoji(ctx, sc.e, gx + c * sp, gy + r * sp, size * p);
      }
      const pl = pop(lt, at + cols * 0.12 + 0.15);
      if (pl > 0) {
        const lx = gx + (cols - 1) * sp + sp * 0.9 + 40, ly = gy + r * sp;
        ctx.fillStyle = th.color;
        G.rr(ctx, lx - 50 * pl, ly - 32 * pl, 100 * pl, 64 * pl, 32 * pl); ctx.fill();
        G.text(ctx, String(cols * (r + 1)), lx, ly + 2, { size: 44 * pl, color: "#fff" });
      }
    }
    const pf = pop(lt, 0.72 * d);
    if (pf > 0 && sc.label) {
      ctx.save();
      ctx.translate(640, 548);
      ctx.scale(pf, pf);
      ctx.font = G.font(64);
      const w = ctx.measureText(sc.label).width + 80;
      card(ctx, -w / 2, -45, w, 90, { fill: th.color, r: 45, shadowColor: "rgba(0,0,0,.2)" });
      G.text(ctx, sc.label, 0, 2, { size: 64, color: "#fff" });
      ctx.restore();
    }
  };

  function pizza(ctx, x, y, r, parts, filled, cut, hl, t) {
    const a0 = -PI / 2, step = (2 * PI) / parts;
    const drawWhole = () => {
      ctx.fillStyle = "#E9A23B"; ctx.beginPath(); ctx.arc(0, 0, r, 0, 2 * PI); ctx.fill();
      ctx.fillStyle = "#FFD36B"; ctx.beginPath(); ctx.arc(0, 0, r * 0.86, 0, 2 * PI); ctx.fill();
      for (let i = 0; i < 9; i++) {
        const ang = rnd(i) * 2 * PI, dd = (0.25 + rnd(i + 20) * 0.5) * r;
        ctx.fillStyle = "#D9534F";
        ctx.beginPath(); ctx.arc(Math.cos(ang) * dd, Math.sin(ang) * dd, r * 0.09, 0, 2 * PI); ctx.fill();
      }
      ctx.fillStyle = "#4CAF50";
      for (let i = 0; i < 6; i++) {
        const ang = rnd(i + 50) * 2 * PI, dd = (0.2 + rnd(i + 60) * 0.55) * r;
        ctx.beginPath(); ctx.ellipse(Math.cos(ang) * dd, Math.sin(ang) * dd, r * 0.05, r * 0.025, ang, 0, 2 * PI); ctx.fill();
      }
    };
    ctx.save();
    ctx.translate(x, y);
    for (let i = 0; i < parts; i++) {
      const s0 = a0 + i * step, mid = s0 + step / 2;
      const isF = i < filled;
      const off = isF ? 16 * hl : 0;
      ctx.save();
      ctx.translate(Math.cos(mid) * off, Math.sin(mid) * off);
      ctx.beginPath();
      if (parts > 1) ctx.moveTo(0, 0);
      ctx.arc(0, 0, r, s0, s0 + step);
      ctx.closePath();
      ctx.save(); ctx.clip(); drawWhole();
      if (!isF && hl > 0) { ctx.fillStyle = "rgba(255,248,236," + 0.6 * hl + ")"; ctx.fillRect(-r, -r, 2 * r, 2 * r); }
      ctx.restore();
      if (isF && hl > 0) { ctx.lineWidth = 6; ctx.strokeStyle = "rgba(255,255,255," + hl + ")"; ctx.stroke(); }
      ctx.restore();
    }
    if (parts > 1) {
      ctx.strokeStyle = "#8B5A2B"; ctx.lineWidth = 5; ctx.lineCap = "round";
      for (let i = 0; i < parts; i++) {
        const ang = a0 + i * step, q = clamp(cut * parts - i);
        if (q <= 0) continue;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(Math.cos(ang) * r * q, Math.sin(ang) * r * q); ctx.stroke();
      }
    }
    ctx.restore();
  }

  R.fraction = (ctx, sc, lt, d, t, th) => {
    headPill(ctx, sc.title, th, lt);
    if (sc.compare) {
      const [[n1, d1], [n2, d2]] = sc.compare;
      const p = pop(lt, 0.2, 0.6);
      [[360, n1, d1], [920, n2, d2]].forEach(([x, nn, dd], k) => {
        const cut = prog(lt, 0.6 + k * 0.4, 1.4 + k * 0.4);
        const hl = prog(lt, 1.6 + k * 0.6, 2.2 + k * 0.6);
        if (p > 0) {
          ctx.save(); ctx.translate(x, 270); ctx.scale(p, p);
          pizza(ctx, 0, 0, 160, dd, nn, cut, hl, t);
          ctx.restore();
        }
        if (hl > 0) fracText(ctx, nn, dd, x, 520, 54, th.dark);
      });
      const ps = pop(lt, 0.66 * d);
      if (ps > 0) G.text(ctx, sc.symbol || ">", 640, 280, { size: 140 * ps, color: th.color, stroke: "#fff", strokeW: 10 });
      return;
    }
    const parts = sc.parts, filled = sc.filled;
    const p = pop(lt, 0.15, 0.6);
    const cut = prog(lt, 0.2 * d, 0.38 * d);
    const hl = prog(lt, 0.42 * d, 0.55 * d);
    if (p > 0) {
      ctx.save(); ctx.translate(470, 320); ctx.scale(p, p);
      pizza(ctx, 0, 0, 210, parts, filled, cut, hl, t);
      ctx.restore();
    }
    const pl = pop(lt, 0.6 * d);
    if (pl > 0) {
      ctx.save(); ctx.translate(930, 300); ctx.scale(pl, pl);
      card(ctx, -150, -190, 300, 380, { stroke: th.color, sw: 7 });
      fracText(ctx, filled, parts, 0, -10, 96, th.dark);
      if (sc.word) G.text(ctx, sc.word, 0, 150, { size: fitSize(ctx, sc.word, 270, 40), color: INK });
      ctx.restore();
    }
  };

  R.list = (ctx, sc, lt, d, t, th) => {
    if (sc.title) {
      const p = pop(lt, 0.05);
      if (p > 0) {
        ctx.save(); ctx.translate(640, 58); ctx.scale(p, p);
        ctx.font = G.font(46);
        const w = ctx.measureText(sc.title).width + 70;
        card(ctx, -w / 2, -36, w, 72, { fill: th.color, r: 36 });
        G.text(ctx, sc.title, 0, 2, { size: 46, color: "#fff" });
        ctx.restore();
      }
    }
    const items = sc.items, n = items.length;
    const x0 = 50, x1 = 1230, y0 = sc.title ? 120 : 50, y1 = 590;
    const cols = sc.cols || (n <= 4 ? n : Math.ceil(n / 2));
    const rows = Math.ceil(n / cols);
    const gap = 22;
    const cw = (x1 - x0 - gap * (cols - 1)) / cols;
    const ch = Math.min(rows === 1 ? 330 : 240, (y1 - y0 - gap * (rows - 1)) / rows);
    const ys = y0 + ((y1 - y0) - (rows * ch + gap * (rows - 1))) / 2;
    const from = (sc.from == null ? 0.06 : sc.from) * d, to = (sc.to == null ? 0.82 : sc.to) * d;
    let current = -1;
    items.forEach((it, i) => { const at = it.at != null ? it.at : from + (i * (to - from)) / n; if (lt >= at) current = i; });
    items.forEach((it, i) => {
      const at = it.at != null ? it.at : from + (i * (to - from)) / n;
      const p = pop(lt, at);
      if (p <= 0) return;
      const r = Math.floor(i / cols), c = i % cols;
      const inRow = Math.min(cols, n - r * cols);
      const rowOff = ((cols - inRow) * (cw + gap)) / 2;
      const x = x0 + rowOff + c * (cw + gap), y = ys + r * (ch + gap);
      const cur = i === current;
      ctx.save();
      ctx.translate(x + cw / 2, y + ch / 2 + (cur ? Math.sin(t * 4) * 3 : 0));
      ctx.scale(p, p);
      const col = it.color && !it.swatch ? it.color : th.color;
      card(ctx, -cw / 2, -ch / 2, cw, ch, { stroke: cur ? col : "#F1E3CB", sw: cur ? 7 : 4 });
      const hasSub = !!it.sub;
      const only = !it.label && !hasSub; // kartu tanpa label: isi di tengah
      const visH = only ? ch * 0.8 : ch * (hasSub ? 0.5 : 0.58);
      const vy = only ? 0 : -ch / 2 + 14 + visH / 2;
      if (it.swatch) {
        ctx.fillStyle = it.swatch;
        ctx.beginPath(); ctx.arc(0, vy, Math.min(visH, cw) * 0.42, 0, 2 * PI); ctx.fill();
        ctx.lineWidth = 4; ctx.strokeStyle = "rgba(0,0,0,.15)"; ctx.stroke();
        if (it.e) emoji(ctx, it.e, Math.min(visH, cw) * 0.36, vy + visH * 0.28, visH * 0.42);
      } else if (it.e) emoji(ctx, it.e, 0, vy, Math.min(visH * 0.92, cw * 0.6));
      else if (it.big) G.text(ctx, it.big, 0, vy, { size: fitSize(ctx, it.big, cw - 30, visH * 0.8), color: col });
      if (sc.numbered) numBadge(ctx, i + 1, -cw / 2 + 26, -ch / 2 + 26, 20, th.color);
      const ly = -ch / 2 + 14 + visH + (ch - visH - 14) * (hasSub ? 0.35 : 0.45);
      if (it.label) G.text(ctx, it.label, 0, ly, { size: fitSize(ctx, it.label, cw - 24, Math.min(40, ch * 0.17)), color: INK });
      if (hasSub) G.text(ctx, it.sub, 0, ly + Math.min(40, ch * 0.17) * 0.95, { size: fitSize(ctx, it.sub, cw - 24, Math.min(30, ch * 0.13), 700, BODY), color: "#5C607A", family: BODY, weight: 700 });
      ctx.restore();
    });
  };

  R.groups = (ctx, sc, lt, d, t, th) => {
    const gs = sc.groups, n = gs.length;
    if (n === 1) {
      const gr = gs[0];
      const p = pop(lt, 0.1);
      if (p > 0) {
        ctx.save(); ctx.translate(640, 70); ctx.scale(p, p);
        ctx.font = G.font(52);
        const w = ctx.measureText(gr.title).width + 80;
        card(ctx, -w / 2, -40, w, 80, { fill: gr.color, r: 40 });
        G.text(ctx, gr.title, 0, 2, { size: 52, color: "#fff" });
        ctx.restore();
      }
      if (gr.sub) { ctx.save(); ctx.globalAlpha = fade(lt, 0.4); G.text(ctx, gr.sub, 640, 148, { size: 34, color: INK, family: BODY }); ctx.restore(); }
      const pf = pop(lt, 0.6);
      if (pf > 0) {
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(190, 350, 110 * pf, 0, 2 * PI); ctx.fill();
        ctx.lineWidth = 7; ctx.strokeStyle = gr.color; ctx.stroke();
        emoji(ctx, gr.food, 190, 350, 120 * pf);
        G.text(ctx, "➜", 350, 350, { size: 90 * pf, color: gr.color });
      }
      const m = gr.emojis.length;
      gr.emojis.forEach((e, k) => {
        const at = 0.25 * d + (k * 0.5 * d) / m;
        const x = m === 1 ? 830 : 520 + (k * 660) / (m - 1);
        emoji(ctx, e, x, 350 + Math.sin(t * 2.5 + k) * 8, 150 * pop(lt, at));
      });
      return;
    }
    const cw = (1180 - 24 * (n - 1)) / n;
    gs.forEach((gr, i) => {
      const x = 50 + i * (cw + 24);
      const p = pop(lt, 0.1 + i * 0.25 * d / n);
      if (p <= 0) return;
      ctx.save();
      ctx.translate(x + cw / 2, 320);
      ctx.scale(p, p);
      card(ctx, -cw / 2, -270, cw, 540, { stroke: gr.color, sw: 6 });
      ctx.fillStyle = gr.color;
      G.rr(ctx, -cw / 2, -270, cw, 90, 26); ctx.fill();
      ctx.fillRect(-cw / 2, -210, cw, 30);
      G.text(ctx, gr.title, 0, -228, { size: fitSize(ctx, gr.title, cw - 30, 44), color: "#fff" });
      if (gr.sub) G.text(ctx, gr.sub, 0, -150, { size: fitSize(ctx, gr.sub, cw - 30, 26, 700, BODY), color: "#5C607A", family: BODY, weight: 700 });
      emoji(ctx, gr.food, 0, -80, 64);
      gr.emojis.slice(0, 4).forEach((e, k) => emoji(ctx, e, (k % 2 ? 1 : -1) * cw * 0.22, 40 + Math.floor(k / 2) * 120 + Math.sin(t * 2 + k) * 4, 100));
      ctx.restore();
    });
  };

  R.word = (ctx, sc, lt, d, t, th) => {
    const parts = sc.parts, n = parts.length;
    const cols = ["#FF6B6B", "#3BA9F5", "#2ECC71", "#FF9F43"];
    ctx.font = G.font(110);
    const widths = parts.map((p) => ctx.measureText(p).width + 70);
    const joined = widths.reduce((a, b) => a + b, 0);
    const gapS = 150;
    const spread = joined + gapS * (n - 1);
    const q = ease.inOut(prog(lt, 0.42 * d, 0.6 * d));
    const total = lerp(spread, joined, q);
    let x = 640 - total / 2;
    const cy = 400;
    parts.forEach((pt, i) => {
      const p = pop(lt, 0.08 * d + i * 0.14 * d);
      const w = widths[i];
      if (p > 0) {
        ctx.save();
        ctx.translate(x + w / 2, cy);
        ctx.scale(p, p);
        card(ctx, -w / 2, -95, w, 190, { fill: cols[i % cols.length], r: q > 0.98 ? 18 : 30 });
        G.text(ctx, pt, 0, 4, { size: 110, color: "#fff" });
        ctx.restore();
      }
      if (i < n - 1 && q < 0.6) {
        const pp = pop(lt, 0.08 * d + (i + 0.6) * 0.14 * d) * (1 - q / 0.6);
        if (pp > 0) G.text(ctx, "+", x + w + lerp(gapS, 0, q) / 2, cy, { size: 90 * pp, color: th.dark });
      }
      x += w + lerp(gapS, 0, q);
    });
    const pe = pop(lt, 0.64 * d);
    if (pe > 0) {
      if (sc.emoji) emoji(ctx, sc.emoji, 640, 160 + Math.sin(t * 3) * 8, 170 * pe);
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * 2 * PI + t;
        sparkle(ctx, 640 + Math.cos(ang) * 150, 160 + Math.sin(ang) * 90, 10, pe * (0.5 + 0.5 * Math.sin(t * 5 + i)), "#FFC93C");
      }
      if (sc.word) G.text(ctx, sc.word, 640, 540, { size: 56 * pe, color: th.dark, stroke: "#fff", strokeW: 10 });
    }
  };

  /* --- cerita: aktor & balon kata --- */
  function actorPos(a, lt, t, i) {
    let x = a.x, y = a.y, hopY = 0;
    if (a.path) {
      const P = a.path;
      if (lt <= P[0][0]) { x = P[0][1]; y = P[0][2]; }
      else if (lt >= P[P.length - 1][0]) { x = P[P.length - 1][1]; y = P[P.length - 1][2]; }
      else {
        for (let k = 0; k < P.length - 1; k++) {
          if (lt >= P[k][0] && lt < P[k + 1][0]) {
            const q = (lt - P[k][0]) / (P[k + 1][0] - P[k][0]);
            const e = a.hop ? q : ease.inOut(q);
            x = lerp(P[k][1], P[k + 1][1], e);
            y = lerp(P[k][2], P[k + 1][2], e);
            if (a.hop) hopY = -Math.sin(q * PI) * a.hop;
            break;
          }
        }
      }
    }
    const bob = a.bob ? Math.sin(t * 2.4 + i) * a.bob : 0;
    return { x, y: y + hopY + bob };
  }

  R.story = (ctx, sc, lt, d, t, th) => {
    const actors = sc.actors || [];
    const pos = actors.map((a, i) => actorPos(a, lt, t, i));
    actors.forEach((a, i) => {
      const at = a.at || 0;
      let alpha = a.at ? fade(lt, at, 0.4) : 1;
      if (a.out != null) alpha *= 1 - fade(lt, a.out, 0.5);
      if (alpha <= 0) return;
      const s = a.at && a.popIn !== false ? pop(lt, at) : 1;
      const { x, y } = pos[i];
      ctx.save();
      ctx.globalAlpha *= alpha;
      if (a.glow) {
        const r = (a.size || 110) * 0.75;
        const g = ctx.createRadialGradient(x, y, 5, x, y, r);
        g.addColorStop(0, a.glow); g.addColorStop(1, "rgba(255,255,255,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * PI); ctx.fill();
      }
      const speaking = (sc._bub || []).some((b) => b.a === i && lt >= b.at && lt < b.at + b.dur);
      if (a.e === "oli") drawOli(ctx, x, y, (a.s || 1.4) * s, { t, flip: a.flip, talk: speaking, wave: a.wave });
      else if (a.e === "tetes") drawTetes(ctx, x, y, (a.s || 1.2) * s, { t, flip: a.flip, talk: speaking });
      else if (a.e === "croc") drawCroc(ctx, x, y, ((a.size || 110) / 110) * s, { t, flip: a.flip, seed: i });
      else if (a.e === "goldfish") drawFish(ctx, x, y, ((a.size || 110) / 110) * s, { t, flip: a.flip });
      else emoji(ctx, a.e, x, y, (a.size || 110) * s, { flip: a.flip, rot: a.rot });
      if (a.sparkle) for (let k = 0; k < 6; k++) {
        const ang = (k / 6) * 2 * PI + t * 1.5;
        sparkle(ctx, x + Math.cos(ang) * (a.size || 110) * 0.7, y + Math.sin(ang) * (a.size || 110) * 0.6, 9, 0.5 + 0.5 * Math.sin(t * 6 + k), "#FFE58A");
      }
      ctx.restore();
    });
    (sc._bub || []).forEach((b) => {
      if (lt < b.at || lt > b.at + b.dur) return;
      const a = actors[b.a];
      const p = pos[b.a];
      const sz = a.e === "oli" ? 120 * (a.s || 1.4) / 1.4 : a.e === "tetes" ? 70 * (a.s || 1.2) : a.e === "croc" ? (a.size || 110) * 0.45 : (a.size || 110);
      bubble(ctx, p.x, p.y - sz * 0.6, b.text, Math.min(fade(lt, b.at, 0.25), 1 - fade(lt, b.at + b.dur - 0.25, 0.25)));
    });
    if (sc.caption) headPill(ctx, sc.caption, th, lt);
    if (sc.draw) sc.draw(ctx, lt, d, K, t);
  };

  /* --- bernyanyi (karaoke) --- */
  const NOTE = { C: -9, D: -7, E: -5, F: -4, G: -2, A: 0, B: 2 };
  function freq(name) {
    const m = /^([A-G])(#|b)?(\d)$/.exec(name);
    if (!m) return 440;
    const semi = NOTE[m[1]] + (m[2] === "#" ? 1 : m[2] === "b" ? -1 : 0) + (parseInt(m[3], 10) - 4) * 12;
    return 440 * Math.pow(2, semi / 12);
  }
  const BASS_OF = { C: "C3", D: "G2", E: "C3", F: "F2", G: "C3", A: "F2", B: "G2" };

  function prepSing(sc) {
    const beat = 60 / (sc.bpm || 100);
    const lead = sc.lead == null ? 1.6 : sc.lead;
    let cur = lead;
    sc._lines = sc.lines.map((ln) => {
      const words = ln.text.split(" ").map((w) => w.split("-"));
      const syl = [];
      words.forEach((w, wi) => w.forEach((s, si) => syl.push({ s, wordEnd: si === w.length - 1, wi })));
      const beats = ln.beats || syl.map((_, i) => (i === syl.length - 1 ? 2 : 1));
      syl.forEach((sy, i) => {
        sy.note = ln.notes[i] || ln.notes[ln.notes.length - 1];
        sy.t0 = cur;
        sy.dur = beats[i] * beat;
        cur += sy.dur;
      });
      return { syl, t0: syl[0].t0, t1: cur };
    });
    sc._len = cur + (sc.tail == null ? 1.4 : sc.tail);
    sc._beat = beat;
  }

  R.sing = (ctx, sc, lt, d, t, th) => {
    const lines = sc._lines;
    let L = 0;
    lines.forEach((ln, i) => { if (lt >= ln.t0 - 0.5) L = i; });
    const ln = lines[L];
    // penyanyi
    const sway = Math.sin(t * PI * (1 / sc._beat) / 2) * 0.08;
    if (sc.singer === "star") {
      drawStar(ctx, 640, 170, 85, t, sway);
    } else drawOli(ctx, 640, 170, 1.15, { t, rot: sway, talk: lt > ln.t0 && lt < ln.t1 });
    // not musik melayang
    for (let i = 0; i < 6; i++) {
      const ph = ((t * 0.35 + i / 6) % 1);
      ctx.save();
      ctx.globalAlpha = Math.sin(ph * PI) * 0.8;
      G.text(ctx, i % 2 ? "♪" : "♫", 120 + i * 210 + Math.sin(t + i) * 20, 560 - ph * 420, { size: 44, color: "#FFE58A", family: "sans-serif" });
      ctx.restore();
    }
    // baris lirik
    const drawLine = (line, y, size, active) => {
      ctx.font = G.font(size);
      const space = size * 0.35;
      const ws = line.syl.map((s) => ctx.measureText(s.s).width);
      let total = 0;
      line.syl.forEach((s, i) => { total += ws[i] + (s.wordEnd && i < line.syl.length - 1 ? space : 0); });
      const scale = Math.min(1, 1100 / total);
      let x = 640 - (total * scale) / 2;
      const centers = [];
      line.syl.forEach((s, i) => {
        const w = ws[i] * scale;
        const cx = x + w / 2;
        centers.push(cx);
        const sung = active && lt >= s.t0;
        const now = active && lt >= s.t0 && lt < s.t0 + s.dur;
        const sz = size * scale * (now ? 1.12 : 1);
        G.text(ctx, s.s, cx, y, { size: sz, color: sung ? "#FFD54A" : active ? "#fff" : "rgba(255,255,255,.55)", stroke: "rgba(20,10,60,.55)", strokeW: 10 });
        x += w + (s.wordEnd ? space * scale : 0);
      });
      return centers;
    };
    const centers = drawLine(ln, 400, 78, true);
    if (lines[L + 1]) drawLine(lines[L + 1], 500, 46, false);
    // bola memantul
    const syl = ln.syl;
    let j = syl.findIndex((s) => lt >= s.t0 && lt < s.t0 + s.dur);
    if (lt < ln.t0) {
      const q = clamp((lt - (ln.t0 - 0.5)) / 0.5);
      const bx = centers[0], by = 330 - Math.sin(q * PI) * 40;
      ballAt(ctx, bx, by);
    } else if (j >= 0) {
      const q = (lt - syl[j].t0) / syl[j].dur;
      const nx = j < syl.length - 1 ? centers[j + 1] : centers[j];
      ballAt(ctx, lerp(centers[j], nx, ease.inOut(q)), 330 - Math.sin(q * PI) * 45);
    }
    if (lt < lines[0].t0 - 0.3) {
      const n = Math.ceil(lines[0].t0 - 0.3 - lt);
      if (n <= 3) G.text(ctx, String(n), 640, 570, { size: 70, color: "#FFE58A" });
    }
  };
  function ballAt(ctx, x, y) {
    ctx.fillStyle = "rgba(0,0,0,.25)";
    ctx.beginPath(); ctx.ellipse(x, 362, 16, 5, 0, 0, 2 * PI); ctx.fill();
    const g = ctx.createRadialGradient(x - 6, y - 6, 2, x, y, 20);
    g.addColorStop(0, "#FFF6C2"); g.addColorStop(1, "#FF9F43");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, 18, 0, 2 * PI); ctx.fill();
  }
  function drawStar(ctx, x, y, r, t, rot) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot || 0);
    const glow = ctx.createRadialGradient(0, 0, r * 0.3, 0, 0, r * 1.8);
    glow.addColorStop(0, "rgba(255,230,120,.5)"); glow.addColorStop(1, "rgba(255,230,120,0)");
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(0, 0, r * 1.8, 0, 2 * PI); ctx.fill();
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -PI / 2 + (i * PI) / 5, rr = i % 2 ? r * 0.48 : r;
      i ? ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.fillStyle = "#FFD54A"; ctx.fill();
    ctx.lineJoin = "round"; ctx.lineWidth = 6; ctx.strokeStyle = "#FFB020"; ctx.stroke();
    ctx.fillStyle = INK;
    const blink = (t % 3.5) < 0.12;
    if (blink) { ctx.fillRect(-r * 0.3, -r * 0.05, r * 0.16, 4); ctx.fillRect(r * 0.14, -r * 0.05, r * 0.16, 4); }
    else { ctx.beginPath(); ctx.arc(-r * 0.2, -r * 0.05, r * 0.08, 0, 2 * PI); ctx.arc(r * 0.2, -r * 0.05, r * 0.08, 0, 2 * PI); ctx.fill(); }
    ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(0, r * 0.08, r * 0.17, 0.15 * PI, 0.85 * PI); ctx.stroke();
    ctx.fillStyle = "rgba(255,120,120,.5)";
    ctx.beginPath(); ctx.arc(-r * 0.36, r * 0.12, r * 0.08, 0, 2 * PI); ctx.arc(r * 0.36, r * 0.12, r * 0.08, 0, 2 * PI); ctx.fill();
    ctx.restore();
  }

  R.recap = (ctx, sc, lt, d, t, th) => {
    const p = pop(lt, 0.05);
    if (p > 0) {
      ctx.save(); ctx.translate(640, 62); ctx.scale(p, p);
      const title = sc.title || "Ingat, ya!";
      ctx.font = G.font(50);
      const w = ctx.measureText(title).width + 80;
      card(ctx, -w / 2, -40, w, 80, { fill: "#fff", r: 40 });
      G.text(ctx, title, 0, 2, { size: 50, color: th.dark });
      ctx.restore();
    }
    drawOli(ctx, 175, 400, 1.9, { t, wave: true, talk: talking(sc, lt) });
    const pts = sc.points || [];
    const n = pts.length;
    const lh = Math.min(108, 400 / Math.max(1, n));
    const y0 = 150 + (400 - lh * n) / 2;
    pts.forEach((pt, i) => {
      const at = 0.1 * d + (i * 0.55 * d) / Math.max(1, n);
      const pp = pop(lt, at);
      if (pp <= 0) return;
      const y = y0 + i * lh;
      ctx.save();
      ctx.translate(800, y + lh / 2 - 8);
      ctx.scale(pp, pp);
      card(ctx, -440, -(lh - 22) / 2, 880, lh - 22, { r: 24 });
      const sz = fitSize(ctx, pt, 820, Math.min(38, lh * 0.38));
      G.text(ctx, pt, -410, 2, { size: sz, color: INK, align: "left" });
      ctx.restore();
    });
    if (sc.cta !== false) {
      const pc = pop(lt, 0.72 * d);
      if (pc > 0) {
        ctx.save(); ctx.translate(800, 572); ctx.scale(pc, pc);
        const txt = sc.cta || "Ayo jawab kuisnya!";
        ctx.font = G.font(40);
        const w = ctx.measureText(txt).width + 80;
        card(ctx, -w / 2, -36, w, 72, { fill: "#FF6B6B", r: 36, shadowColor: "#E04848" });
        G.text(ctx, txt, 0, 2, { size: 40, color: "#fff" });
        ctx.restore();
      }
    }
  };

  R.custom = (ctx, sc, lt, d, t, th) => { if (sc.draw) sc.draw(ctx, lt, d, K, t, th); };

  /* ---------- Penyusun animasi ---------- */
  function autoBubbles(sc) {
    let cur = sc.bubbleStart == null ? 0.3 : sc.bubbleStart;
    sc._bub = (sc.bubbles || []).map((b) => {
      const dur = b.dur || Math.max(1.8, plain(b.text).length * 0.075 + 0.5);
      const at = b.at != null ? b.at : cur;
      cur = at + dur;
      return { a: b.a || 0, text: b.text, at, dur };
    });
  }

  function make(id, spec) {
    const th = { color: spec.color || "#8B5CF6", dark: spec.dark || "#6D3FE0" };
    let t0 = 0;
    const scenes = spec.scenes.map((src, i) => {
      const sc = Object.assign({}, src);
      if (sc.type === "sing") { prepSing(sc); sc.song = true; }
      if (sc.type === "story") autoBubbles(sc);
      let dur = sc.dur || Math.max(sc.min || 4.5, plain(sc.say).length * 0.07 + 1.8);
      if (sc.type === "sing") dur = sc._len;
      if (sc._bub && sc._bub.length) dur = Math.max(dur, sc._bub[sc._bub.length - 1].at + sc._bub[sc._bub.length - 1].dur + 0.6);
      sc.start = t0; sc.end = t0 + dur; sc.d = dur; sc.idx = i;
      t0 += dur;
      return sc;
    });
    const notes = [];
    scenes.forEach((sc) => {
      if (!sc._lines) return;
      sc._lines.forEach((ln) => ln.syl.forEach((sy, k) => {
        notes.push({ t: sc.start + sy.t0, f: freq(sy.note), d: sy.dur * 0.92, v: 0.085, type: "triangle" });
        if (k % 2 === 0) notes.push({ t: sc.start + sy.t0, f: freq(BASS_OF[sy.note[0]] || "C3"), d: sc._beat * 1.9, v: 0.06, type: "sine" });
      }));
    });
    notes.sort((a, b) => a.t - b.t);
    const def = {
      title: spec.title,
      duration: t0,
      poster: spec.poster == null ? 2.4 : spec.poster,
      rate: spec.rate || 0.95,
      pitch: spec.pitch || 1.15,
      scenes,
      notes: notes.length ? notes : null,
      draw(ctx, t) {
        let i = scenes.findIndex((s) => t >= s.start && t < s.end);
        if (i < 0) i = scenes.length - 1;
        const sc = scenes[i];
        const lt = t - sc.start;
        const bg = sc.bg || TYPE_BG[sc.type] || spec.bg || "plain";
        (BG[bg] || BG.plain)(ctx, t, th, sc);
        (R[sc.type] || R.custom)(ctx, sc, lt, sc.d, t, th);
        if (i > 0 && lt < 0.35) {
          ctx.fillStyle = "rgba(255,255,255," + (1 - lt / 0.35) * 0.9 + ")";
          ctx.fillRect(0, 0, W, H);
        }
      }
    };
    EduAnim.register(id, def);
    return def;
  }

  const K = {
    G, W, H, INK, pop, fade, emoji, fitSize, wrap, card, bubble, numBadge, fracText, sparkle, rnd,
    drawOli, drawTetes, drawCroc, drawFish, drawTree, drawCloud, drawSun, drawStar, skyGrad, driftClouds, stars, water, BG, talking
  };
  window.EduKit = Object.assign({ make }, K);
})();
