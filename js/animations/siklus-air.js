/* =========================================================
   ANIMASI ORIGINAL: "Siklus Air — Perjalanan Setetes Hujan"
   Karakter: Tetes si tetesan air
   Durasi: 74 detik, 7 adegan
   ---------------------------------------------------------
   Tips gaya sendiri: ubah warna di objek COL, bentuk karakter
   di drawDrop(), dan teks narasi di bagian `scenes`.
   ========================================================= */
(function () {
  "use strict";
  const G = EduAnim.G;
  const { lerp, prog, clamp, ease, mix, win, PI } = G;

  const COL = {
    skyTop: "#6EC1F7", skyBot: "#D6F1FF", gloomTop: "#7D8FA3", gloomBot: "#C3CDD8",
    seaTop: "#3DB0F5", seaBot: "#1C7CC4",
    land: "#86D774", mountain: "#4FAE5E", sand: "#F5D58A",
    river: "#5CC2FF", riverEdge: "#2E9BEA",
    drop1: "#A6E0FF", drop2: "#2E9BEA", dropLine: "#1C84CF",
    ink: "#2B2D42", purple: "#8B5CF6"
  };

  /* ---------- Jalur sungai & perjalanan Tetes ---------- */
  const RIVER = [[440, 425], [485, 468], [450, 515], [520, 568], [640, 610], [760, 632], [870, 628]];
  const TPATH = [[430, 372], [485, 440], [450, 487], [520, 540], [640, 582], [760, 604], [870, 600], [940, 588]];

  function along(pts, p) {
    const seg = [];
    let total = 0;
    for (let i = 1; i < pts.length; i++) {
      const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      seg.push(d); total += d;
    }
    let target = clamp(p) * total;
    for (let i = 0; i < seg.length; i++) {
      if (target <= seg[i] || i === seg.length - 1) {
        const q = seg[i] ? clamp(target / seg[i]) : 0;
        const a = pts[i], b = pts[i + 1];
        return { x: lerp(a[0], b[0], q), y: lerp(a[1], b[1], q), a: Math.atan2(b[1] - a[1], b[0] - a[0]) };
      }
      target -= seg[i];
    }
    return { x: pts[0][0], y: pts[0][1], a: 0 };
  }

  function smoothPath(ctx, pts) {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length - 1; i++) {
      const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
      ctx.quadraticCurveTo(pts[i][0], pts[i][1], mx, my);
    }
    const l = pts[pts.length - 1];
    ctx.lineTo(l[0], l[1]);
  }

  /* ---------- Karakter: Tetes ---------- */
  function drawDrop(ctx, x, y, s, o = {}) {
    ctx.save();
    ctx.translate(x, y);
    if (o.rot) ctx.rotate(o.rot);
    const sq = o.squash || 1;
    ctx.scale(s * (2 - sq), s * sq);
    ctx.globalAlpha *= o.alpha == null ? 1 : o.alpha;

    const g = ctx.createLinearGradient(-30, -50, 30, 46);
    g.addColorStop(0, COL.drop1);
    g.addColorStop(1, COL.drop2);
    ctx.beginPath();
    ctx.moveTo(0, -52);
    ctx.bezierCurveTo(12, -32, 34, -12, 34, 12);
    ctx.arc(0, 12, 34, 0, PI);
    ctx.bezierCurveTo(-34, -12, -12, -32, 0, -52);
    ctx.closePath();
    ctx.fillStyle = g;
    ctx.fill();
    ctx.lineWidth = 4;
    ctx.strokeStyle = COL.dropLine;
    ctx.stroke();

    // kilau
    ctx.fillStyle = "rgba(255,255,255,.8)";
    ctx.beginPath();
    ctx.ellipse(-17, -4, 5, 11, 0.4, 0, 2 * PI);
    ctx.fill();

    if (!o.noFace) {
      const blink = o.t != null && (o.t % 3.2) < 0.13;
      ctx.lineCap = "round";
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = COL.ink;
      [-11, 11].forEach((ex) => {
        if (blink) {
          ctx.beginPath(); ctx.moveTo(ex - 5, 8); ctx.lineTo(ex + 5, 8); ctx.stroke();
        } else {
          ctx.fillStyle = COL.ink;
          ctx.beginPath(); ctx.arc(ex, 8, 5.5, 0, 2 * PI); ctx.fill();
          ctx.fillStyle = "#fff";
          ctx.beginPath(); ctx.arc(ex + 2, 6, 1.9, 0, 2 * PI); ctx.fill();
        }
      });
      if (o.mouth === "o") {
        ctx.fillStyle = "#C2185B";
        ctx.beginPath(); ctx.ellipse(0, 24, 5.5, 7, 0, 0, 2 * PI); ctx.fill();
      } else {
        ctx.beginPath(); ctx.arc(0, 17, 9, 0.15 * PI, 0.85 * PI); ctx.stroke();
      }
      ctx.fillStyle = "rgba(255,120,170,.5)";
      ctx.beginPath(); ctx.arc(-21, 20, 5, 0, 2 * PI); ctx.fill();
      ctx.beginPath(); ctx.arc(21, 20, 5, 0, 2 * PI); ctx.fill();
    }

    if (o.wave != null) {
      const a = -1.0 + Math.sin(o.wave * 9) * 0.45;
      const hx = 31 + Math.cos(a) * 24, hy = 12 + Math.sin(a) * 24;
      ctx.strokeStyle = COL.dropLine;
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(31, 12); ctx.lineTo(hx, hy); ctx.stroke();
      ctx.fillStyle = COL.drop1;
      ctx.beginPath(); ctx.arc(hx, hy, 6, 0, 2 * PI); ctx.fill(); ctx.stroke();
    }
    ctx.restore();
  }

  /* ---------- Benda-benda ---------- */
  function drawSun(ctx, x, y, r, t, glow) {
    ctx.save();
    ctx.translate(x, y);
    if (glow > 0) {
      for (let i = 3; i >= 1; i--) {
        ctx.fillStyle = "rgba(255,190,60," + (0.13 * glow) + ")";
        ctx.beginPath(); ctx.arc(0, 0, r * (1 + i * 0.4 + 0.06 * Math.sin(t * 3)), 0, 2 * PI); ctx.fill();
      }
    }
    ctx.save();
    ctx.rotate(t * 0.25);
    ctx.strokeStyle = "#FFB020";
    ctx.lineWidth = r * 0.17;
    ctx.lineCap = "round";
    for (let i = 0; i < 12; i++) {
      const a = (i * PI) / 6;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * r * 1.25, Math.sin(a) * r * 1.25);
      ctx.lineTo(Math.cos(a) * r * 1.6, Math.sin(a) * r * 1.6);
      ctx.stroke();
    }
    ctx.restore();
    ctx.fillStyle = "#FFC93C";
    ctx.strokeStyle = "#FFB020";
    ctx.lineWidth = r * 0.1;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, 2 * PI); ctx.fill(); ctx.stroke();
    ctx.strokeStyle = COL.ink;
    ctx.lineWidth = r * 0.07;
    ctx.lineCap = "round";
    ctx.beginPath(); ctx.arc(-r * 0.32, -r * 0.05, r * 0.13, PI * 1.1, PI * 1.9); ctx.stroke();
    ctx.beginPath(); ctx.arc(r * 0.32, -r * 0.05, r * 0.13, PI * 1.1, PI * 1.9); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, r * 0.12, r * 0.28, 0.15 * PI, 0.85 * PI); ctx.stroke();
    ctx.fillStyle = "rgba(255,120,120,.45)";
    ctx.beginPath(); ctx.arc(-r * 0.55, r * 0.22, r * 0.12, 0, 2 * PI); ctx.fill();
    ctx.beginPath(); ctx.arc(r * 0.55, r * 0.22, r * 0.12, 0, 2 * PI); ctx.fill();
    ctx.restore();
  }

  function drawCloud(ctx, x, y, s, color, alpha, face) {
    if (alpha <= 0 || s <= 0) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.globalAlpha *= alpha == null ? 1 : alpha;
    ctx.fillStyle = color;
    const parts = [[0, -10, 48], [-52, 10, 36], [52, 10, 38], [-26, -30, 34], [28, -34, 40], [0, 16, 40]];
    ctx.beginPath();
    parts.forEach(([px, py, r]) => { ctx.moveTo(px + r, py); ctx.arc(px, py, r, 0, 2 * PI); });
    ctx.fill();
    if (face) {
      ctx.fillStyle = COL.ink;
      ctx.beginPath(); ctx.arc(-16, 0, 5, 0, 2 * PI); ctx.fill();
      ctx.beginPath(); ctx.arc(16, 0, 5, 0, 2 * PI); ctx.fill();
      ctx.strokeStyle = COL.ink; ctx.lineWidth = 3.5; ctx.lineCap = "round";
      ctx.beginPath(); ctx.arc(0, 8, 8, 0.15 * PI, 0.85 * PI); ctx.stroke();
    }
    ctx.restore();
  }

  function drawTree(ctx, x, y, s) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    ctx.fillStyle = "#9C6B3F";
    G.rr(ctx, -8, -40, 16, 44, 6); ctx.fill();
    ctx.fillStyle = "#3FA04F";
    ctx.beginPath();
    [[0, -70, 34], [-24, -50, 24], [24, -50, 24]].forEach(([px, py, r]) => { ctx.moveTo(px + r, py); ctx.arc(px, py, r, 0, 2 * PI); });
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.18)";
    ctx.beginPath(); ctx.arc(-10, -80, 12, 0, 2 * PI); ctx.fill();
    ctx.restore();
  }

  function vapor(ctx, x, y, len, t, alpha) {
    if (alpha <= 0) return;
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255," + alpha + ")";
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    for (let k = 0; k <= len; k += 5) {
      const px = x + Math.sin(k * 0.09 + t * 4) * 8, py = y - k;
      k === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.stroke();
    ctx.restore();
  }

  function sparkle(ctx, x, y, r, a) {
    if (a <= 0) return;
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255," + a + ")";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    for (let i = 0; i < 3; i++) {
      const ang = (i * PI) / 3;
      ctx.beginPath();
      ctx.moveTo(x - Math.cos(ang) * r, y - Math.sin(ang) * r);
      ctx.lineTo(x + Math.cos(ang) * r, y + Math.sin(ang) * r);
      ctx.stroke();
    }
    ctx.restore();
  }

  /* ---------- Latar ---------- */
  const gloomAt = (t) => prog(t, 41, 44) * (1 - prog(t, 51, 54));

  function background(ctx, t) {
    const W = G.W, H = G.H, dk = gloomAt(t);
    const sky = ctx.createLinearGradient(0, 0, 0, 560);
    sky.addColorStop(0, mix(COL.skyTop, COL.gloomTop, dk));
    sky.addColorStop(1, mix(COL.skyBot, COL.gloomBot, dk));
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // awan kecil berjalan
    for (let i = 0; i < 4; i++) {
      const cx = ((t * 18 + i * 400) % 1600) - 160;
      drawCloud(ctx, cx, 80 + (i % 2) * 70, 0.5 + (i % 2) * 0.15, mix("#FFFFFF", "#B7C2CE", dk), 0.85);
    }

    // matahari (makin terik di adegan laut & penguapan)
    const hot = prog(t, 11, 14) * (1 - prog(t, 28, 31));
    ctx.save();
    ctx.globalAlpha = 1 - dk * 0.9;
    drawSun(ctx, 1110, 120, 58, t, hot);
    ctx.restore();

    // gunung
    ctx.fillStyle = mix(COL.mountain, "#5D7F68", dk * 0.5);
    ctx.beginPath();
    ctx.moveTo(-60, 560); ctx.lineTo(150, 330); ctx.lineTo(255, 420); ctx.lineTo(340, 300); ctx.lineTo(560, 560);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,.14)";
    ctx.beginPath(); ctx.moveTo(-60, 560); ctx.lineTo(150, 330); ctx.lineTo(185, 560); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(220, 560); ctx.lineTo(340, 300); ctx.lineTo(360, 560); ctx.closePath(); ctx.fill();

    // laut berombak
    const seaTop = 548;
    const sea = ctx.createLinearGradient(0, seaTop, 0, H);
    sea.addColorStop(0, mix(COL.seaTop, "#5B8DB3", dk * 0.5));
    sea.addColorStop(1, COL.seaBot);
    ctx.fillStyle = sea;
    ctx.beginPath();
    ctx.moveTo(0, H); ctx.lineTo(0, seaTop);
    for (let x = 0; x <= W; x += 16) ctx.lineTo(x, seaTop + Math.sin(x * 0.018 + t * 1.8) * 7);
    ctx.lineTo(W, H);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.45)";
    ctx.lineWidth = 4; ctx.lineCap = "round";
    for (let i = 0; i < 7; i++) {
      const x = 760 + ((i * 170 + t * 25) % 560), y = 600 + (i % 3) * 35;
      ctx.beginPath(); ctx.arc(x, y, 14, 1.15 * PI, 1.85 * PI); ctx.stroke();
    }

    // daratan + pantai
    ctx.fillStyle = mix(COL.land, "#7FA772", dk * 0.4);
    ctx.beginPath();
    ctx.moveTo(0, 522); ctx.lineTo(600, 532); ctx.quadraticCurveTo(840, 560, 790, 720); ctx.lineTo(0, 720);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = COL.sand; ctx.lineWidth = 14;
    ctx.beginPath(); ctx.moveTo(600, 532); ctx.quadraticCurveTo(840, 560, 790, 720); ctx.stroke();

    // sungai mengalir
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    smoothPath(ctx, RIVER); ctx.strokeStyle = COL.riverEdge; ctx.lineWidth = 30; ctx.stroke();
    smoothPath(ctx, RIVER); ctx.strokeStyle = COL.river; ctx.lineWidth = 22; ctx.stroke();
    ctx.save();
    ctx.setLineDash([18, 34]); ctx.lineDashOffset = -t * 70;
    smoothPath(ctx, RIVER); ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 5; ctx.stroke();
    ctx.restore();

    drawTree(ctx, 80, 545, 1);
    drawTree(ctx, 170, 560, 0.8);
    drawTree(ctx, 620, 545, 0.9);
  }

  /* ---------- Adegan-adegan ---------- */
  const seaPos = (t) => ({ x: 920 + Math.sin(t * 0.8) * 12, y: 592 + Math.sin(t * 2) * 5 });

  function seaFriends(ctx, t) {
    const a = win(t, 8, 19, 0.6);
    if (a <= 0) return;
    [[840, 632, 0], [1050, 622, 1.3], [1180, 602, 2.1]].forEach(([x, y, ph]) => {
      drawDrop(ctx, x, y + Math.sin(t * 2 + ph) * 4, 0.5, { alpha: a, t: t + ph });
    });
  }

  function evapField(ctx, t) {
    const a = win(t, 17.5, 31, 1);
    if (a <= 0) return;
    for (let i = 0; i < 12; i++) {
      const ph = (((t - 17) + i * 0.41) % 3.4) / 3.4;
      const x = 690 + i * 48 + Math.sin(i * 2.3) * 12;
      vapor(ctx, x, 560 - ph * 330, 50, t + i, a * Math.sin(ph * PI) * 0.8);
    }
  }

  function clouds(ctx, t) {
    const grow = ease.outBack(prog(t, 29, 33));
    const s = 1.3 * grow + 0.3 * prog(t, 41, 44);
    const a = 1 - prog(t, 52, 55);
    const color = mix("#FFFFFF", "#8E9BAA", prog(t, 41, 44));
    // awan samping saat hujan
    const sa = win(t, 41, 53, 1.5);
    drawCloud(ctx, 470, 200, 1.0, "#9AA7B5", sa);
    drawCloud(ctx, 840, 195, 1.1, "#9AA7B5", sa);
    if (t > 29) drawCloud(ctx, 640, 185, s, color, a);

    // teman-teman uap air berkumpul
    if (t > 30 && t < 37) {
      for (let i = 0; i < 8; i++) {
        const ang = (i / 8) * 2 * PI;
        const p = ease.inOut(prog(t, 30 + i * 0.25, 34 + i * 0.25));
        const fa = prog(t, 30 + i * 0.25, 30.6 + i * 0.25) * (1 - prog(t, 34.3 + i * 0.25, 35 + i * 0.25));
        const x = lerp(640 + Math.cos(ang) * 380, 640 + Math.cos(ang) * 60, p);
        const y = lerp(200 + Math.sin(ang) * 150, 185 + Math.sin(ang) * 25, p);
        drawDrop(ctx, x, y, 0.38, { alpha: fa * 0.75, t: t + i });
      }
    }
    // kilau dingin di sekitar awan
    const ka = win(t, 31, 41, 0.8);
    for (let i = 0; i < 7; i++) {
      const ang = (i / 7) * 2 * PI + t * 0.3;
      sparkle(ctx, 640 + Math.cos(ang) * 190, 185 + Math.sin(ang) * 95, 9, ka * (0.5 + 0.5 * Math.sin(t * 4 + i)));
    }
    // teman-teman yang duduk di awan
    const fa2 = win(t, 34, 44, 0.6);
    if (fa2 > 0) {
      drawDrop(ctx, 572, 190 + Math.sin(t * 2.2) * 3, 0.5, { alpha: fa2, t: t + 1 });
      drawDrop(ctx, 710, 192 + Math.sin(t * 2.2 + 1) * 3, 0.5, { alpha: fa2, t: t + 2 });
    }
  }

  function rain(ctx, t) {
    const a = prog(t, 42, 43) * (1 - prog(t, 51, 53));
    if (a <= 0) return;
    ctx.save();
    ctx.strokeStyle = "rgba(79,182,255," + 0.85 * a + ")";
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    for (let i = 0; i < 70; i++) {
      const x = 400 + ((i * 71) % 540) + Math.sin(i) * 8;
      const sp = 520 + (i % 5) * 40;
      const y = 250 + (((t - 41) * sp + i * 53) % 380);
      ctx.moveTo(x, y);
      ctx.lineTo(x - 6, y + 22);
    }
    ctx.stroke();
    ctx.restore();
  }

  const LABELS = [
    [18, 29.5, "1. Penguapan", "#FF9F43"],
    [30, 41.5, "2. Pengembunan", "#8B5CF6"],
    [42, 53, "3. Hujan", "#3BA9F5"],
    [53.5, 63, "4. Kembali ke Laut", "#2ECC71"]
  ];
  function labels(ctx, t) {
    LABELS.forEach(([a, b, txt, col]) => {
      if (t < a || t > b) return;
      G.pill(ctx, txt, 36, 34, col, ease.outBack(prog(t, a, a + 0.5)), 1 - prog(t, b - 0.4, b));
    });
  }

  function speech(ctx, x, y, txt, a) {
    if (a <= 0) return;
    ctx.save();
    ctx.globalAlpha *= a;
    ctx.font = G.font(36);
    const w = ctx.measureText(txt).width + 40;
    ctx.fillStyle = "#fff";
    G.rr(ctx, x, y - 30, w, 60, 26); ctx.fill();
    ctx.beginPath(); ctx.moveTo(x + 18, y + 26); ctx.lineTo(x + 4, y + 46); ctx.lineTo(x + 40, y + 28); ctx.fill();
    ctx.fillStyle = COL.ink; ctx.textBaseline = "middle";
    ctx.fillText(txt, x + 20, y + 2);
    ctx.restore();
  }

  function tetes(ctx, t) {
    if (t >= 64) return;
    let x, y, s = 1;
    const o = { t };
    o.alpha = 1 - 0.45 * prog(t, 18, 20) + 0.45 * prog(t, 31, 34);

    if (t < 8) {
      const p = ease.inOut(prog(t, 6.2, 8));
      const pop = ease.outBack(prog(t, 1.2, 2));
      const sp = seaPos(t);
      x = lerp(640, sp.x, p);
      y = lerp(495 - Math.abs(Math.sin(t * 3)) * 18, sp.y, p);
      s = lerp(1.9 * pop, 1, p);
      if (t > 2.5 && t < 6) o.wave = t;
    } else if (t < 19) {
      ({ x, y } = seaPos(t));
      if (t > 8.5 && t < 12) o.wave = t;
    } else if (t < 29) {
      const p = ease.inOut(prog(t, 19, 27));
      const sp = seaPos(19);
      x = lerp(sp.x, 640, p) + Math.sin(t * 3) * 18 * Math.sin(p * PI);
      y = lerp(sp.y, 190, p);
    } else if (t < 44) {
      x = 640;
      y = lerp(190, 172, prog(t, 31, 34)) + Math.sin(t * 2) * 3;
      s = lerp(1, 0.75, prog(t, 31, 34));
    } else if (t < 49.4) {
      const p = prog(t, 44, 48.5);
      x = lerp(640, 430, p);
      y = lerp(172, 370, p * p);
      s = 0.75;
      o.mouth = "o";
      o.squash = 1 - 0.3 * Math.sin(prog(t, 48.5, 49.4) * PI);
    } else if (t < 53.5) {
      x = 430; y = 370; s = 0.75;
    } else if (t < 60) {
      const pt = along(TPATH, ease.inOut(prog(t, 53.5, 60)));
      x = pt.x; y = pt.y; s = 0.75;
      o.rot = clamp(pt.a * 0.4, -0.4, 0.4);
      o.mouth = "o";
    } else {
      x = 940 + Math.sin(t * 0.8) * 10;
      y = 588 + Math.sin(t * 2) * 5;
      s = 0.75;
      if (t > 60.5) o.wave = t;
    }

    drawDrop(ctx, x, y, s, o);

    const va = win(t, 18, 32, 1);
    if (va > 0) {
      vapor(ctx, x - 48 * s, y + 30, 45, t, 0.65 * va);
      vapor(ctx, x + 48 * s, y + 30, 45, t + 1, 0.65 * va);
    }
    if (t > 55 && t < 59) speech(ctx, x + 40, y - 80, "Wiii!", win(t, 55, 59, 0.3));
  }

  /* ---------- Kartu judul ---------- */
  function titleCard(ctx, t) {
    const a = 1 - prog(t, 6, 7);
    if (a <= 0) return;
    ctx.save();
    ctx.globalAlpha = a;
    const g = ctx.createLinearGradient(0, 0, G.W, G.H);
    g.addColorStop(0, "#8B5CF6");
    g.addColorStop(1, "#3BA9F5");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, G.W, G.H);
    ctx.fillStyle = "rgba(255,255,255,.12)";
    ctx.beginPath(); ctx.arc(1150, 80, 200, 0, 2 * PI); ctx.fill();
    ctx.beginPath(); ctx.arc(90, 650, 160, 0, 2 * PI); ctx.fill();
    for (let i = 0; i < 14; i++) {
      sparkle(ctx, (i * 197) % 1280, 60 + ((i * 131) % 600), 8, 0.4 + 0.4 * Math.sin(t * 3 + i));
    }
    G.text(ctx, "EduStream Kids • Animasi Original", 640, 50, { size: 26, color: "rgba(255,255,255,.85)" });
    const p = ease.outBack(prog(t, 0.3, 1.1));
    if (p > 0) {
      ctx.save();
      ctx.translate(640, 150);
      ctx.scale(p, p);
      G.text(ctx, "Siklus Air", 0, 0, { size: 116, color: "#fff", stroke: "#6D3FE0", strokeW: 16 });
      ctx.restore();
    }
    ctx.globalAlpha = a * prog(t, 0.9, 1.6);
    G.text(ctx, "Perjalanan Setetes Hujan", 640, 250, { size: 48, color: "#FFE58A", stroke: "rgba(60,30,140,.5)", strokeW: 8 });
    ctx.restore();
  }

  /* ---------- Rangkuman ---------- */
  function recap(ctx, t) {
    const a = prog(t, 63, 64);
    if (a <= 0) return;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = "rgba(255,248,236,.96)";
    G.rr(ctx, 40, 24, 1200, 600, 40); ctx.fill();
    G.text(ctx, "Siklus Air", 220, 92, { size: 58, color: "#6D3FE0" });

    const cx = 640, cy = 335, R = 175;
    const nodes = [
      { ang: PI, label: "Penguapan", col: "#FF9F43", at: 64.2, icon: "sun" },
      { ang: 1.5 * PI, label: "Pengembunan", col: "#8B5CF6", at: 65.2, icon: "cloud" },
      { ang: 2 * PI, label: "Hujan", col: "#3BA9F5", at: 66.1, icon: "rain" },
      { ang: 2.5 * PI, label: "Kembali ke Laut", col: "#2ECC71", at: 67.0, icon: "sea" }
    ];

    // panah melingkar
    nodes.forEach((n) => {
      const q = prog(t, n.at + 0.3, n.at + 1.0);
      if (q <= 0) return;
      const gap = 0.42;
      const s0 = n.ang + gap, e = s0 + (PI / 2 - 2 * gap) * q;
      ctx.strokeStyle = "#C9B8F5";
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.beginPath(); ctx.arc(cx, cy, R, s0, e); ctx.stroke();
      if (q > 0.95) {
        const px = cx + Math.cos(e) * R, py = cy + Math.sin(e) * R;
        const tx = -Math.sin(e), ty = Math.cos(e);
        ctx.fillStyle = "#C9B8F5";
        ctx.beginPath();
        ctx.moveTo(px + tx * 22, py + ty * 22);
        ctx.lineTo(px - ty * 16, py + tx * 16);
        ctx.lineTo(px + ty * 16, py - tx * 16);
        ctx.closePath(); ctx.fill();
      }
    });

    // simpul
    nodes.forEach((n) => {
      const p = ease.outBack(prog(t, n.at, n.at + 0.5));
      if (p <= 0) return;
      const x = cx + Math.cos(n.ang) * R, y = cy + Math.sin(n.ang) * R;
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(p, p);
      ctx.fillStyle = "rgba(0,0,0,.15)";
      ctx.beginPath(); ctx.arc(0, 6, 58, 0, 2 * PI); ctx.fill();
      ctx.fillStyle = n.col;
      ctx.beginPath(); ctx.arc(0, 0, 58, 0, 2 * PI); ctx.fill();
      if (n.icon === "sun") drawSun(ctx, 0, 0, 22, t, 0);
      if (n.icon === "cloud") drawCloud(ctx, 0, 6, 0.45, "#FFFFFF", 1, true);
      if (n.icon === "rain") {
        drawCloud(ctx, 0, -6, 0.4, "#E3EAF1", 1);
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 4; ctx.lineCap = "round";
        [-18, 0, 18].forEach((dx, k) => {
          const yy = 22 + ((t * 40 + k * 7) % 14);
          ctx.beginPath(); ctx.moveTo(dx, yy); ctx.lineTo(dx - 3, yy + 10); ctx.stroke();
        });
      }
      if (n.icon === "sea") {
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 5; ctx.lineCap = "round";
        [-10, 10].forEach((dy) => {
          ctx.beginPath();
          for (let k = -30; k <= 30; k += 4) {
            const yy = dy + Math.sin(k * 0.2 + t * 3) * 5;
            k === -30 ? ctx.moveTo(k, yy) : ctx.lineTo(k, yy);
          }
          ctx.stroke();
        });
      }
      ctx.restore();
      const ly = n.icon === "cloud" ? y + 84 : y + 86;
      ctx.globalAlpha = a * clamp(p);
      G.text(ctx, n.label, x, ly, { size: 30, color: n.col, stroke: "#FFF8EC", strokeW: 8 });
      ctx.globalAlpha = a;
    });

    // Tetes di tengah & tetes kecil berkeliling
    drawDrop(ctx, cx, cy + 10 - Math.abs(Math.sin(t * 3)) * 12, 1.0, { t, wave: t > 69 ? t : null });
    if (t > 68.3) {
      const ang = PI + (t - 68.3) * 1.5;
      drawDrop(ctx, cx + Math.cos(ang) * R, cy + Math.sin(ang) * R, 0.32, { t, alpha: prog(t, 68.3, 68.8), rot: ang + PI });
    }

    const ea = ease.outBack(prog(t, 70.5, 71.2));
    if (ea > 0) {
      ctx.save();
      ctx.translate(1050, 92);
      ctx.scale(ea, ea);
      ctx.fillStyle = "#E04848";
      G.rr(ctx, -165, -32, 330, 72, 36); ctx.fill();
      ctx.fillStyle = "#FF6B6B";
      G.rr(ctx, -165, -38, 330, 72, 36); ctx.fill();
      G.text(ctx, "Ayo jawab kuisnya!", 0, -1, { size: 34, color: "#fff" });
      ctx.restore();
    }
    ctx.restore();
  }

  /* ---------- Daftarkan animasi ---------- */
  EduAnim.register("siklus-air", {
    title: "Siklus Air: Perjalanan Setetes Hujan",
    duration: 74,
    poster: 2.6,   // detik yang dipakai sebagai gambar sampul
    rate: 0.95,
    pitch: 1.15,
    scenes: [
      { start: 0, end: 7, say: "Halo teman-teman! Aku Tetes, setetes air yang suka berpetualang. Yuk, ikuti perjalananku!" },
      { start: 7, end: 17, say: "Aku tinggal di laut yang luas bersama jutaan teman tetes air. Suatu hari, matahari bersinar sangat terik." },
      { start: 17, end: 29, say: "Panas matahari membuat aku berubah menjadi uap air yang sangat ringan. Aku terbang naik ke langit! Ini disebut penguapan." },
      { start: 29, end: 41, say: "Di atas langit, udaranya dingin. Aku berkumpul dengan teman-teman uap air dan berubah menjadi awan. Ini disebut pengembunan." },
      { start: 41, end: 52, say: "Semakin banyak teman yang berkumpul, awan menjadi berat dan gelap. Akhirnya kami jatuh ke bumi sebagai hujan!" },
      { start: 52, end: 63, say: "Aku mendarat di gunung, lalu meluncur bersama air sungai, dan kembali lagi ke laut. Wiii, seru sekali!" },
      { start: 63, end: 74, say: "Itulah siklus air: penguapan, pengembunan, hujan, lalu kembali ke laut. Begitu terus berulang. Ayo hemat air, ya!" }
    ],
    draw(ctx, t) {
      background(ctx, t);
      evapField(ctx, t);
      seaFriends(ctx, t);
      clouds(ctx, t);
      rain(ctx, t);
      labels(ctx, t);
      titleCard(ctx, t);
      tetes(ctx, t);
      recap(ctx, t);
    }
  });
})();
