/* Animasi original: Mengenal 8 Planet di Tata Surya */
(function () {
  const K = EduKit, G = K.G, PI = Math.PI;
  const PL = [
    ["Merkurius", 11, "#B5A9A0"], ["Venus", 16, "#E8C27A"], ["Bumi", 17, "#3B82F6"], ["Mars", 13, "#E0603F"],
    ["Jupiter", 46, "#D8A86B"], ["Saturnus", 36, "#E9D59A"], ["Uranus", 24, "#7FD8E8"], ["Neptunus", 23, "#3D5BD9"]
  ];
  const XS = [255, 330, 410, 490, 615, 790, 950, 1090];

  function drawPlanet(ctx, x, y, r, name, col, t) {
    if (name === "Saturnus") {
      ctx.strokeStyle = "rgba(240,220,160,.9)"; ctx.lineWidth = r * 0.18;
      ctx.beginPath(); ctx.ellipse(x, y, r * 1.9, r * 0.55, -0.3, PI, 2 * PI); ctx.stroke();
    }
    ctx.save();
    ctx.beginPath(); ctx.arc(x, y, r, 0, 2 * PI); ctx.clip();
    ctx.fillStyle = col; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
    if (name === "Jupiter" || name === "Saturnus") {
      for (let i = -3; i <= 3; i++) {
        ctx.fillStyle = i % 2 ? "rgba(150,90,40,.35)" : "rgba(255,255,255,.18)";
        ctx.fillRect(x - r, y + i * r * 0.28, 2 * r, r * 0.14);
      }
      if (name === "Jupiter") { ctx.fillStyle = "#C0573A"; ctx.beginPath(); ctx.ellipse(x + r * 0.35, y + r * 0.3, r * 0.22, r * 0.12, 0, 0, 2 * PI); ctx.fill(); }
    }
    if (name === "Bumi") {
      ctx.fillStyle = "#4CAF50";
      const sh = (t * r * 0.15) % (r * 2);
      [[-0.4, -0.3, 0.45, 0.3], [0.3, 0.2, 0.35, 0.4], [-0.1, 0.55, 0.3, 0.18]].forEach(([dx, dy, rx, ry]) => {
        ctx.beginPath(); ctx.ellipse(x + ((dx * r + sh + r) % (2.4 * r)) - r * 1.1, y + dy * r, rx * r, ry * r, 0.4, 0, 2 * PI); ctx.fill();
      });
      ctx.fillStyle = "rgba(255,255,255,.75)";
      ctx.beginPath(); ctx.ellipse(x, y - r * 0.9, r * 0.6, r * 0.18, 0, 0, 2 * PI); ctx.fill();
    }
    if (name === "Mars") {
      ctx.fillStyle = "rgba(120,40,20,.35)";
      ctx.beginPath(); ctx.arc(x - r * 0.3, y + r * 0.2, r * 0.25, 0, 2 * PI); ctx.arc(x + r * 0.4, y - r * 0.3, r * 0.18, 0, 2 * PI); ctx.fill();
    }
    const sh = ctx.createRadialGradient(x - r * 0.4, y - r * 0.4, r * 0.1, x, y, r * 1.1);
    sh.addColorStop(0, "rgba(255,255,255,.25)"); sh.addColorStop(1, "rgba(0,0,0,.4)");
    ctx.fillStyle = sh; ctx.fillRect(x - r, y - r, 2 * r, 2 * r);
    ctx.restore();
    if (name === "Saturnus") {
      ctx.strokeStyle = "rgba(240,220,160,.95)"; ctx.lineWidth = r * 0.18;
      ctx.beginPath(); ctx.ellipse(x, y, r * 1.9, r * 0.55, -0.3, 0, PI); ctx.stroke();
    }
  }

  function sun(ctx, x, y, r, t) {
    const g = ctx.createRadialGradient(x, y, r * 0.2, x, y, r * 1.5);
    g.addColorStop(0, "rgba(255,230,120,1)"); g.addColorStop(0.65, "rgba(255,160,40,1)"); g.addColorStop(1, "rgba(255,120,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r * (1.5 + 0.03 * Math.sin(t * 3)), 0, 2 * PI); ctx.fill();
  }

  function orbit(ctx, lt, d, K, t) {
    const cx = -60, cy = 330;
    sun(ctx, cx, cy, 230, t);
    G.text(ctx, "Matahari", 70, 600, { size: 34, color: "#FFE58A" });
    PL.forEach(([name, r, col], i) => {
      const at = 0.4 * d + i * (0.48 * d / 8);
      ctx.strokeStyle = "rgba(255,255,255,.12)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, cy, XS[i] - cx, -0.55, 0.55); ctx.stroke();
      const p = K.pop(lt, at);
      if (p <= 0) return;
      const y = cy + Math.sin(t * 0.6 + i) * 8;
      ctx.save(); ctx.translate(XS[i], y); ctx.scale(p, p); drawPlanet(ctx, 0, 0, r, name, col, t); ctx.restore();
      const ly = i % 2 ? y + r + 40 : y - r - 34;
      G.text(ctx, name, XS[i], ly, { size: 26 * Math.min(1, p), color: "#fff", stroke: "#1A1240", strokeW: 6 });
    });
    G.pill(ctx, "Tata Surya Kita", 36, 30, "#2ECC71", K.pop(lt, 0.1), 1);
  }

  function spot(idx, facts) {
    const [name, , col] = PL[idx];
    return function (ctx, lt, d, K, t) {
      const p = K.pop(lt, 0.15, 0.6);
      if (p > 0) {
        ctx.save(); ctx.translate(360, 330); ctx.scale(p, p);
        drawPlanet(ctx, 0, 0, name === "Saturnus" ? 120 : 165, name, col, t);
        ctx.restore();
      }
      const pc = K.pop(lt, 0.4);
      if (pc <= 0) return;
      ctx.save(); ctx.translate(950, 320); ctx.scale(pc, pc);
      K.card(ctx, -290, -230, 580, 460, { stroke: col, sw: 7 });
      G.text(ctx, name, 0, -170, { size: 64, color: "#2B2D42" });
      facts.forEach((f, i) => {
        const a = K.fade(lt, 0.8 + i * (0.5 * d / facts.length));
        ctx.globalAlpha = a;
        ctx.font = G.font(32, 800, '"Nunito", sans-serif');
        const lines = K.wrap(ctx, f, 500);
        lines.forEach((l, k) => G.text(ctx, l, -255, -80 + i * 110 + k * 40, { size: 32, color: "#2B2D42", align: "left", family: '"Nunito", sans-serif' }));
        ctx.globalAlpha = 1;
      });
      ctx.restore();
    };
  }

  EduKit.make("sains-planet", {
    title: "Mengenal 8 Planet di Tata Surya",
    color: "#2ECC71", dark: "#1FA055", bg: "space",
    scenes: [
      { type: "title", title: "8 Planet di Tata Surya", subtitle: "Petualangan luar angkasa!", emoji: "🪐", bg: "space",
        say: "Halo, Penjelajah Antariksa! Ayo naik roket bersama Oli dan mengenal delapan planet di tata surya kita!" },
      { type: "custom", draw: orbit,
        say: "Pusat tata surya adalah Matahari. Planet-planet berputar mengelilinginya: Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, dan Neptunus." },
      { type: "custom", draw: spot(2, ["🌍 Planet ke-3 dari Matahari", "💧 Punya air & udara", "🏡 Rumah kita semua!"]),
        say: "Bumi adalah planet ketiga dari Matahari. Inilah rumah kita, satu-satunya planet yang diketahui punya makhluk hidup." },
      { type: "custom", draw: spot(3, ["🔴 Disebut planet merah", "🏜️ Tanahnya berdebu kemerahan", "🚀 Sering dikunjungi robot penjelajah"]),
        say: "Mars disebut planet merah karena tanahnya berwarna kemerahan. Robot penjelajah dari Bumi sudah dikirim ke sana!" },
      { type: "custom", draw: spot(4, ["👑 Planet TERBESAR", "🌍 Lebih dari 1.000 Bumi bisa muat", "🌀 Punya badai raksasa"]),
        say: "Jupiter adalah planet terbesar di tata surya. Lebih dari seribu Bumi bisa muat di dalamnya!" },
      { type: "custom", draw: spot(5, ["💍 Punya cincin yang indah", "🧊 Cincinnya dari es & batu", "🎈 Sangat ringan"]),
        say: "Saturnus terkenal dengan cincinnya yang indah. Cincin itu terbuat dari bongkahan es dan batu." },
      { type: "board", lines: ["Cara mudah menghafal", "Me - Ve - Bu - Ma", "Ju - Sa - U - Ne"],
        say: "Supaya mudah diingat, hafalkan singkatan ini: Me, Ve, Bu, Ma, Ju, Sa, U, Ne!" },
      { type: "recap", bg: "space", points: ["☀️ Pusat tata surya: Matahari", "🌍 Kita tinggal di Bumi", "👑 Jupiter planet terbesar", "💍 Saturnus punya cincin"],
        say: "Keren! Kamu sudah mengenal delapan planet. Ingat, planet terbesar adalah Jupiter, dan kita tinggal di Bumi. Ayo jawab kuisnya!" }
    ]
  });
})();
