/* =========================================================
   EduStream Kids — logika utama
   ========================================================= */
(function () {
  "use strict";

  const CFG = window.SITE_CONFIG || {};
  const CATS = window.CATEGORIES || [];
  const VIDEOS = window.VIDEOS || [];
  const FACTS = window.FUN_FACTS || [];
  const PAGE = document.body.dataset.page || "home";
  const params = new URLSearchParams(location.search);

  /* ---------- Utilitas ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

  const store = {
    get(k, d) {
      try { const v = localStorage.getItem("eks_" + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; }
    },
    set(k, v) {
      try { localStorage.setItem("eks_" + k, JSON.stringify(v)); } catch (e) { /* abaikan */ }
    },
    remove(k) { try { localStorage.removeItem("eks_" + k); } catch (e) { /* abaikan */ } }
  };

  function todayKey() {
    const d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }

  const FALLBACK_CAT = { id: "lain", name: "Lainnya", emoji: "📺", color: "#8B5CF6", dark: "#6D3FE0" };
  const catById = (id) => CATS.find((c) => c.id === id) || FALLBACK_CAT;
  const videoById = (id) => VIDEOS.find((v) => v.id === id);
  const ageLabel = (a) => (a === "6-8" ? "6–8 tahun" : a === "9-12" ? "9–12 tahun" : "Semua umur");
  const isLight = (c) => ["lagu"].includes(c.id); // kategori berwarna terang → teks gelap

  /* ---------- Maskot: Oli si Burung Hantu ---------- */
  function mascot(mood) {
    const eyes = mood === "sleep"
      ? '<path d="M32 54 q10 8 20 0" stroke="#2B2D42" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M68 54 q10 8 20 0" stroke="#2B2D42" stroke-width="4" fill="none" stroke-linecap="round"/>'
      : '<circle cx="42" cy="52" r="15" fill="#fff"/><circle cx="78" cy="52" r="15" fill="#fff"/>' +
        '<circle cx="44" cy="54" r="7.5" fill="#2B2D42"/><circle cx="76" cy="54" r="7.5" fill="#2B2D42"/>' +
        '<circle cx="47" cy="51" r="2.6" fill="#fff"/><circle cx="79" cy="51" r="2.6" fill="#fff"/>';
    return '<svg viewBox="0 0 120 120" role="img" aria-label="Oli si burung hantu">' +
      '<ellipse cx="60" cy="112" rx="30" ry="5" fill="rgba(0,0,0,.12)"/>' +
      '<ellipse cx="20" cy="76" rx="11" ry="21" fill="#6D3FE0" transform="rotate(18 20 76)"/>' +
      '<ellipse cx="100" cy="76" rx="11" ry="21" fill="#6D3FE0" transform="rotate(-18 100 76)"/>' +
      '<ellipse cx="60" cy="66" rx="40" ry="44" fill="#8B5CF6"/>' +
      '<ellipse cx="60" cy="80" rx="25" ry="26" fill="#D9CCFF"/>' +
      '<path d="M50 78 q5 4 10 0 q5 4 10 0" stroke="#B9A6F5" stroke-width="3" fill="none"/>' +
      '<path d="M50 90 q5 4 10 0 q5 4 10 0" stroke="#B9A6F5" stroke-width="3" fill="none"/>' +
      eyes +
      '<path d="M53 64 L67 64 L60 74 Z" fill="#FFB020"/>' +
      '<ellipse cx="48" cy="108" rx="7" ry="4" fill="#FFB020"/><ellipse cx="72" cy="108" rx="7" ry="4" fill="#FFB020"/>' +
      '<path d="M28 26 L60 12 L92 26 L60 40 Z" fill="#2B2D42"/>' +
      '<rect x="44" y="28" width="32" height="10" rx="3" fill="#2B2D42"/>' +
      '<path d="M90 26 L94 44" stroke="#FFC93C" stroke-width="3" stroke-linecap="round"/><circle cx="94" cy="46" r="4" fill="#FFC93C"/>' +
      '<circle cx="30" cy="66" r="5" fill="#FF8FB8" opacity=".7"/><circle cx="90" cy="66" r="5" fill="#FF8FB8" opacity=".7"/>' +
      "</svg>";
  }

  /* ---------- Suara (dibuat dengan Web Audio, tanpa file) ---------- */
  const Sound = {
    ctx: null,
    get on() { return store.get("sound", true); },
    toggle() { store.set("sound", !this.on); },
    play(type) {
      if (!this.on) return;
      try {
        this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
        const ctx = this.ctx;
        const seq = {
          click: [[620, 0.05]],
          good: [[523, 0.09], [659, 0.09], [784, 0.16]],
          bad: [[330, 0.12], [247, 0.2]],
          star: [[784, 0.07], [988, 0.07], [1175, 0.07], [1568, 0.25]]
        }[type] || [[600, 0.05]];
        let t = ctx.currentTime;
        seq.forEach(([f, d]) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = "triangle";
          o.frequency.value = f;
          g.gain.setValueAtTime(0.0001, t);
          g.gain.exponentialRampToValueAtTime(0.14, t + 0.01);
          g.gain.exponentialRampToValueAtTime(0.0001, t + d);
          o.connect(g).connect(ctx.destination);
          o.start(t);
          o.stop(t + d + 0.02);
          t += d;
        });
      } catch (e) { /* audio tidak tersedia */ }
    }
  };

  /* ---------- Toast & konfeti ---------- */
  let toastTimer;
  function toast(msg) {
    let el = $(".toast");
    if (el) el.remove();
    el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    el.textContent = msg;
    document.body.append(el);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.remove(), 3200);
  }

  function confetti() {
    const colors = ["#FFC93C", "#FF6B6B", "#3BA9F5", "#2ECC71", "#8B5CF6", "#FF6FAE"];
    const box = document.createElement("div");
    box.className = "confetti";
    for (let i = 0; i < 70; i++) {
      const p = document.createElement("i");
      p.style.left = Math.random() * 100 + "vw";
      p.style.background = colors[i % colors.length];
      p.style.animationDuration = 1.8 + Math.random() * 1.8 + "s";
      p.style.animationDelay = Math.random() * 0.4 + "s";
      p.style.transform = "rotate(" + rand(0, 360) + "deg)";
      box.append(p);
    }
    document.body.append(box);
    setTimeout(() => box.remove(), 4200);
  }

  /* ---------- Modal ---------- */
  function openModal(html, opts = {}) {
    const closable = opts.closable !== false;
    const ov = document.createElement("div");
    ov.className = "overlay";
    if (opts.id) ov.id = opts.id;
    ov.innerHTML = '<div class="modal" role="dialog" aria-modal="true" tabindex="-1">' +
      (closable ? '<button class="close" type="button" aria-label="Tutup">✕</button>' : "") + html + "</div>";
    document.body.append(ov);
    const onKey = (e) => { if (e.key === "Escape" && closable) close(); };
    function close() {
      ov.remove();
      document.removeEventListener("keydown", onKey);
      if (opts.onClose) opts.onClose();
    }
    if (closable) {
      $(".close", ov).addEventListener("click", close);
      ov.addEventListener("click", (e) => { if (e.target === ov) close(); });
      document.addEventListener("keydown", onKey);
    }
    setTimeout(() => {
      const f = $("input", ov) || $(".modal", ov);
      if (f) f.focus();
    }, 60);
    return { el: ov, close };
  }

  /* ---------- Gerbang orang tua ---------- */
  const ANGKA = ["nol", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh",
    "sebelas", "dua belas", "tiga belas", "empat belas", "lima belas", "enam belas", "tujuh belas", "delapan belas", "sembilan belas"];

  function parentGate(onPass, onCancel) {
    const a = rand(12, 19), b = rand(4, 9);
    let passed = false;
    const m = openModal(
      '<div class="mascot-sm">' + mascot() + "</div>" +
      "<h2>Khusus Orang Tua 👪</h2>" +
      '<p class="muted">Untuk melanjutkan, tuliskan hasil dari:<br><b style="font-size:22px;color:var(--ink)">' +
      ANGKA[a] + " dikali " + ANGKA[b] + "</b></p>" +
      '<form id="gate-form"><label class="sr-only" for="gate-input">Jawaban</label>' +
      '<input id="gate-input" type="number" inputmode="numeric" autocomplete="off" placeholder="Jawaban">' +
      '<p class="err" id="gate-err" aria-live="polite"></p>' +
      '<button class="btn" type="submit" style="width:100%">Lanjutkan</button></form>' +
      (PAGE === "parent" ? '<a class="btn btn-ghost btn-sm" href="index.html" style="width:100%;margin-top:14px">🏠 Kembali ke Beranda</a>' : ""),
      { onClose: () => { if (!passed && onCancel) onCancel(); } }
    );
    $("#gate-form", m.el).addEventListener("submit", (e) => {
      e.preventDefault();
      if (parseInt($("#gate-input", m.el).value, 10) === a * b) {
        passed = true;
        try { sessionStorage.setItem("eks_parent_ok", "1"); } catch (err) { /* abaikan */ }
        m.close();
        onPass();
      } else {
        $("#gate-err", m.el).textContent = "Jawaban belum tepat. Coba lagi ya.";
        $("#gate-input", m.el).value = "";
      }
    });
  }

  /* ---------- Bintang & level ---------- */
  const LEVELS = [
    { min: 0, name: "Penjelajah Baru", e: "🐣" },
    { min: 5, name: "Murid Rajin", e: "📚" },
    { min: 15, name: "Bintang Kelas", e: "🌟" },
    { min: 30, name: "Juara Cilik", e: "🏆" },
    { min: 50, name: "Profesor Cilik", e: "🎓" },
    { min: 100, name: "Super Jenius", e: "🚀" }
  ];
  const levelOf = (n) => LEVELS.filter((l) => n >= l.min).pop();
  const nextLevel = (n) => LEVELS.find((l) => l.min > n);

  const Stars = {
    get count() { return store.get("stars", 0); },
    add(n, msg) {
      if (n <= 0) return;
      const before = levelOf(this.count);
      store.set("stars", this.count + n);
      const after = levelOf(this.count);
      updateStarPill(true);
      Sound.play("star");
      confetti();
      if (after !== before) {
        setTimeout(() => toast("🎉 Naik level! Kamu sekarang " + after.e + " " + after.name), 1600);
      }
      toast(msg || "Hore! Kamu dapat " + n + " ⭐");
    }
  };
  const watchedList = () => store.get("watched", []);
  const isWatched = (id) => watchedList().includes(id);

  function updateStarPill(bump) {
    const el = $("#star-count");
    if (el) el.textContent = Stars.count;
    const pill = $("#star-pill");
    if (pill && bump) {
      pill.classList.remove("bump");
      void pill.offsetWidth;
      pill.classList.add("bump");
    }
  }

  function showStarModal() {
    const n = Stars.count, lv = levelOf(n), nx = nextLevel(n);
    const pct = nx ? Math.round(((n - lv.min) / (nx.min - lv.min)) * 100) : 100;
    openModal(
      '<div class="mascot-sm">' + mascot() + "</div>" +
      "<h2>Bintangku</h2>" +
      '<div class="big-stars">⭐ ' + n + "</div>" +
      '<div class="level-name">' + lv.e + " " + esc(lv.name) + "</div>" +
      (nx
        ? '<p class="muted" style="margin:10px 0 6px">Kumpulkan ' + (nx.min - n) + " ⭐ lagi untuk jadi " + nx.e + " " + esc(nx.name) + "</p>" +
          '<div class="bar" style="border-color:var(--sun)"><span style="width:' + pct + '%"></span></div>'
        : '<p class="muted">Kamu sudah mencapai level tertinggi! Hebat! 🎉</p>') +
      '<p class="muted" style="margin-top:12px">📺 ' + watchedList().length + " video sudah ditonton</p>" +
      '<div class="badges">' + LEVELS.map((l) =>
        '<div class="badge ' + (n >= l.min ? "unlocked" : "locked") + '"><span class="e">' + l.e + "</span>" + esc(l.name) + "<br><small>" + l.min + " ⭐</small></div>"
      ).join("") + "</div>" +
      '<p class="muted" style="margin-top:14px;font-size:15px">Cara dapat bintang: tonton video sampai selesai dan jawab kuisnya!</p>'
    );
  }

  /* ---------- Header, navigasi bawah, footer ---------- */
  function renderChrome() {
    const name = CFG.siteName || "EduStream Kids";
    const parts = name.split(" ");
    const sub = parts.length > 1 ? parts.pop() : "";
    const header = $("#site-header");
    if (header) {
      header.className = "site-header";
      header.innerHTML =
        '<div class="container header-inner">' +
        '<a class="logo" href="index.html" aria-label="' + esc(name) + ' — Beranda">' + mascot() +
        '<span class="logo-text">' + esc(parts.join(" ")) + (sub ? "<span>" + esc(sub.toUpperCase()) + "</span>" : "") + "</span></a>" +
        '<form class="search" action="kategori.html" role="search">' +
        '<label class="sr-only" for="q">Cari video</label>' +
        '<input id="q" name="q" type="search" placeholder="Cari video seru…" value="' + esc(params.get("q") || "") + '">' +
        '<button type="submit" aria-label="Cari">🔍</button></form>' +
        '<div class="header-actions">' +
        '<button class="pill pill-stars" id="star-pill" type="button" aria-label="Lihat bintangku"><span class="star">⭐</span><span id="star-count">0</span></button>' +
        '<button class="icon-btn" id="sound-btn" type="button"></button>' +
        '<a class="icon-btn parent-link" href="orang-tua.html" aria-label="Pojok Orang Tua" title="Pojok Orang Tua">👪</a>' +
        "</div></div>";
      $("#star-pill").addEventListener("click", showStarModal);
      const sb = $("#sound-btn");
      const paintSound = () => {
        sb.textContent = Sound.on ? "🔊" : "🔇";
        sb.setAttribute("aria-label", Sound.on ? "Matikan suara" : "Nyalakan suara");
      };
      paintSound();
      sb.addEventListener("click", () => { Sound.toggle(); paintSound(); Sound.play("click"); });
      updateStarPill(false);
    }

    const nav = $("#bottom-nav");
    if (nav) {
      nav.className = "bottom-nav";
      nav.setAttribute("aria-label", "Navigasi utama");
      const item = (href, ico, label, active) =>
        '<a href="' + href + '"' + (active ? ' class="active" aria-current="page"' : "") + '><span class="ico">' + ico + "</span>" + label + "</a>";
      nav.innerHTML =
        item("index.html", "🏠", "Beranda", PAGE === "home") +
        item("kategori.html", "🧭", "Jelajah", PAGE === "category") +
        '<button type="button" id="nav-search"><span class="ico">🔍</span>Cari</button>' +
        '<button type="button" id="nav-stars"><span class="ico">⭐</span>Bintangku</button>';
      $("#nav-stars").addEventListener("click", showStarModal);
      $("#nav-search").addEventListener("click", () => {
        openModal(
          '<div class="mascot-sm">' + mascot() + "</div><h2>Mau cari video apa?</h2>" +
          '<form action="kategori.html"><label class="sr-only" for="q2">Cari video</label>' +
          '<input id="q2" name="q" type="text" placeholder="contoh: planet" autocomplete="off">' +
          '<button class="btn btn-sun" type="submit" style="width:100%">🔍 Cari</button></form>' +
          '<p class="muted" style="margin-top:14px">Coba: ' +
          ["hewan", "perkalian", "dongeng", "warna"].map((w) => '<a style="color:var(--primary-dark)" href="kategori.html?q=' + w + '">' + w + "</a>").join(" · ") + "</p>"
        );
      });
    }

    // Tombol kembali ke beranda di halaman yang tidak ada di navigasi utama
    const main = $("#main");
    if (main && (PAGE === "parent" || PAGE === "info" || PAGE === "studio")) {
      const back = document.createElement("a");
      back.className = "btn btn-ghost btn-sm back-btn";
      back.href = "index.html";
      back.innerHTML = "⬅️ Kembali ke Beranda";
      main.prepend(back);
    }

    const footer = $("#site-footer");
    if (footer) {
      footer.className = "site-footer";
      footer.innerHTML =
        '<div class="container"><div class="footer-grid">' +
        "<div><h3>" + esc(name) + "</h3><p>" + esc(CFG.tagline || "") +
        " Video edukasi pilihan untuk anak usia 6–12 tahun: matematika, sains, bahasa, dongeng, dan banyak lagi.</p></div>" +
        "<div><h3>Kategori</h3>" + CATS.slice(0, 5).map((c) => '<a href="kategori.html?c=' + c.id + '">' + c.emoji + " " + esc(c.name) + "</a>").join("") + "</div>" +
        '<div><h3>Info</h3><a href="orang-tua.html">👪 Pojok Orang Tua</a><a href="tentang.html">ℹ️ Tentang Kami</a><a href="privasi.html">🔒 Kebijakan Privasi</a>' +
        (CFG.contactEmail ? '<a href="mailto:' + esc(CFG.contactEmail) + '">✉️ Kontak</a>' : "") + "</div>" +
        '</div><div class="footer-note">© ' + new Date().getFullYear() + " " + esc(name) +
        ". Situs ini menampilkan iklan untuk mendukung biaya operasional. Iklan ditandai dengan label \"IKLAN\". " +
        "Dianjurkan anak menonton dengan pendampingan orang tua.</div></div>";
    }
  }

  /* ---------- Iklan Adsterra ---------- */
  const Ads = {
    nativeUsed: false,
    init() {
      const A = CFG.ads;
      const zones = $$(".ad-zone");
      if (!A || !A.enabled) { zones.forEach((z) => z.remove()); return; }
      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver((entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) { io.unobserve(e.target); this.fill(e.target); }
          });
        }, { rootMargin: "250px" });
        zones.forEach((z) => io.observe(z));
      } else {
        zones.forEach((z) => this.fill(z));
      }
    },
    clean: (s) => String(s || "").replace(/[^a-zA-Z0-9]/g, ""),
    fill(zone) {
      const A = CFG.ads;
      const type = zone.dataset.ad || "leaderboard";
      const avail = Math.max(zone.clientWidth, 300);
      zone.innerHTML = '<span class="ad-label">Iklan</span><div class="ad-slot"></div>';
      const slot = $(".ad-slot", zone);

      if (type === "native") {
        const n = A.native || {};
        if (!n.src || !n.containerId) {
          return this.placeholder(zone, slot, Math.min(avail, 728), 120, "Native Banner");
        }
        if (this.nativeUsed) { zone.remove(); return; } // satu native per halaman
        this.nativeUsed = true;
        slot.style.display = "block";
        const box = document.createElement("div");
        box.id = "container-" + this.clean(n.containerId);
        const s = document.createElement("script");
        s.async = true;
        s.setAttribute("data-cfasync", "false");
        s.src = String(n.src);
        slot.append(box, s);
        return;
      }

      const units = type === "rectangle"
        ? [A.banner300]
        : [A.banner728, A.banner468, A.banner320].filter((u) => u && u.width <= avail);
      const unit = units.find((u) => u && this.clean(u.key));
      if (!unit) {
        const u = units[0] || A.banner320 || { width: 320, height: 50 };
        return this.placeholder(zone, slot, u.width, u.height, u.width + "×" + u.height);
      }
      const key = this.clean(unit.key);
      const domain = String(unit.domain || A.bannerDomain || "www.highperformanceformat.com").replace(/[^a-zA-Z0-9.-]/g, "");
      // Kode Adsterra versi baru memberi alamat skrip lengkap (src); versi lama memakai domain/key/invoke.js
      let src = unit.src ? String(unit.src).trim() : "https://" + domain + "/" + key + "/invoke.js";
      if (src.startsWith("//")) src = "https:" + src;
      if (!/^https:\/\/[^\s"'<>]+$/.test(src)) { console.warn("Alamat skrip iklan tidak valid:", src); zone.remove(); return; }
      const w = parseInt(unit.width, 10), h = parseInt(unit.height, 10);
      // Setiap banner dimuat di iframe tersendiri agar variabel atOptions tidak saling bentrok
      const f = document.createElement("iframe");
      f.width = w;
      f.height = h;
      f.title = "Iklan";
      f.setAttribute("scrolling", "no");
      f.srcdoc = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>html,body{margin:0;padding:0;overflow:hidden;background:transparent}</style></head><body>' +
        "<script>atOptions={'key':'" + key + "','format':'iframe','height':" + h + ",'width':" + w + ",'params':{}};<\/script>" +
        '<script src="' + src + '"><\/script></body></html>';
      slot.style.minHeight = h + "px";
      slot.append(f);
    },
    placeholder(zone, slot, w, h, label) {
      if (!CFG.ads.showPlaceholder) { zone.remove(); return; }
      slot.innerHTML = '<div class="ad-placeholder" style="width:' + w + "px;height:" + h + 'px">Ruang Iklan ' + esc(label) + "</div>";
    }
  };

  /* ---------- Batas waktu layar (diatur orang tua) ---------- */
  const ScreenTime = {
    key: () => "time_" + todayKey(),
    used() { return store.get(this.key(), 0); },
    limitSec() {
      const m = store.get("limitMin", 0);
      return m > 0 ? (m + store.get("bonus_" + todayKey(), 0)) * 60 : 0;
    },
    cleanup() {
      try {
        const keep = ["eks_time_" + todayKey(), "eks_bonus_" + todayKey()];
        Object.keys(localStorage).forEach((k) => {
          if ((k.startsWith("eks_time_") || k.startsWith("eks_bonus_")) && !keep.includes(k)) localStorage.removeItem(k);
        });
      } catch (e) { /* abaikan */ }
    },
    start() {
      this.cleanup();
      if (PAGE === "parent" || PAGE === "info" || PAGE === "studio") return;
      this.check();
      setInterval(() => {
        if (document.visibilityState === "visible") {
          store.set(this.key(), this.used() + 10);
          this.check();
        }
      }, 10000);
    },
    check() {
      const L = this.limitSec();
      if (L && this.used() >= L) this.lock();
    },
    lock() {
      if ($("#lock-overlay")) return;
      try { if (window.__eksPlayer && window.__eksPlayer.pauseVideo) window.__eksPlayer.pauseVideo(); } catch (e) { /* abaikan */ }
      const v = $("video"); if (v) v.pause();
      const mins = Math.round(this.used() / 60);
      const m = openModal(
        '<div class="mascot-sm">' + mascot("sleep") + "</div>" +
        "<h2>Waktunya Istirahat! 🌙</h2>" +
        "<p>Kamu sudah belajar <b>" + mins + " menit</b> hari ini. Hebat sekali!</p>" +
        '<p class="muted">Yuk istirahatkan mata, minum air putih, dan bermain di luar. Sampai jumpa besok! 👋</p>' +
        '<button class="btn btn-ghost btn-sm" type="button" id="lock-extend">👪 Orang tua: tambah 15 menit</button>',
        { closable: false, id: "lock-overlay" }
      );
      $("#lock-extend", m.el).addEventListener("click", () => {
        parentGate(() => {
          store.set("bonus_" + todayKey(), store.get("bonus_" + todayKey(), 0) + 15);
          m.close();
          toast("Waktu ditambah 15 menit ⏰");
        });
      });
    }
  };

  /* ---------- Kartu video ---------- */
  function chipCat(c) {
    return '<span class="chip" style="background:' + c.color + "26;color:" + c.dark + '">' + c.emoji + " " + esc(c.name) + "</span>";
  }
  function chipOriginal(v) {
    return v.animation ? '<span class="chip chip-orig">🎨 Animasi Original</span>' : "";
  }
  function loadScript(src) {
    return new Promise((res, rej) => {
      if (document.querySelector('script[src="' + src + '"]')) return res();
      const s = document.createElement("script");
      s.src = src;
      s.onload = res;
      s.onerror = () => rej(new Error("Gagal memuat " + src));
      document.head.append(s);
    });
  }
  function thumbImg(v) {
    return v.youtubeId
      ? '<img src="https://i.ytimg.com/vi/' + encodeURIComponent(v.youtubeId) + '/hqdefault.jpg" alt="" loading="lazy" onerror="this.remove()">'
      : "";
  }
  function videoCard(v) {
    const c = catById(v.category);
    return '<a class="video-card" href="video.html?id=' + encodeURIComponent(v.id) + '" style="--c:' + c.color + '">' +
      '<div class="thumb"><span class="big-emoji" aria-hidden="true">' + (v.emoji || c.emoji) + "</span>" + thumbImg(v) +
      (v.isNew ? '<span class="badge-new">BARU!</span>' : "") +
      (isWatched(v.id) ? '<span class="watched">⭐ Sudah ditonton</span>' : "") +
      (v.duration ? '<span class="dur">' + esc(v.duration) + "</span>" : "") +
      '<span class="play" aria-hidden="true">▶</span></div>' +
      '<div class="video-body"><h3>' + esc(v.title) + '</h3><div class="meta">' + chipCat(c) +
      '<span class="chip chip-age">👦 ' + ageLabel(v.age) + "</span>" + chipOriginal(v) + "</div></div></a>";
  }
  function miniCard(v) {
    const c = catById(v.category);
    return '<a class="mini-card" href="video.html?id=' + encodeURIComponent(v.id) + '" style="--c:' + c.color + '">' +
      '<div class="thumb"><span class="big-emoji" aria-hidden="true">' + (v.emoji || c.emoji) + "</span>" + thumbImg(v) + "</div>" +
      "<div><h3>" + esc(v.title) + "</h3>" + chipCat(c) + "</div></a>";
  }
  function emptyState(msg) {
    return '<div class="empty"><div style="width:120px;margin:0 auto">' + mascot() + "</div><h3>" + msg + "</h3>" +
      '<a class="btn btn-sun btn-sm" href="kategori.html">🧭 Lihat semua video</a></div>';
  }

  const getAge = () => store.get("age", "all");
  const byAge = (list, age) => (age === "all" ? list : list.filter((v) => v.age === age));

  function ageButtons(container, className, onChange) {
    const opts = [["all", "🌈 Semua"], ["6-8", "🧒 6–8 tahun"], ["9-12", "🧑 9–12 tahun"]];
    const paint = () => {
      container.innerHTML = opts.map(([k, l]) =>
        '<button type="button" class="' + className + '" data-age="' + k + '" aria-pressed="' + (getAge() === k) + '">' + l + "</button>"
      ).join("");
    };
    paint();
    container.addEventListener("click", (e) => {
      const b = e.target.closest("[data-age]");
      if (!b) return;
      store.set("age", b.dataset.age);
      paint();
      onChange();
    });
  }

  /* ---------- Halaman: Beranda ---------- */
  function pageHome() {
    const h = new Date().getHours();
    const salam = h < 11 ? "Selamat pagi" : h < 15 ? "Selamat siang" : h < 18 ? "Selamat sore" : "Selamat malam";
    $("#hero-greet").textContent = salam + ", Teman Pintar! 👋";
    $("#hero-mascot").innerHTML = mascot();

    $("#cat-grid").innerHTML = CATS.map((c) => {
      const n = VIDEOS.filter((v) => v.category === c.id).length;
      return '<a class="cat-card' + (isLight(c) ? " dark-text" : "") + '" href="kategori.html?c=' + c.id + '" style="--c:' + c.color + ";--cd:" + c.dark + '">' +
        '<span class="count">' + n + " video</span>" +
        '<span class="emoji" aria-hidden="true">' + c.emoji + '</span><span class="name">' + esc(c.name) + '</span><span class="desc">' + esc(c.desc) + "</span></a>";
    }).join("");

    const start = new Date(new Date().getFullYear(), 0, 0);
    const day = Math.floor((Date.now() - start) / 86400000);
    if (FACTS.length) $("#fact-text").textContent = FACTS[day % FACTS.length];

    const renderGrids = () => {
      const age = getAge();
      const list = byAge(VIDEOS, age);
      let fresh = list.filter((v) => v.isNew);
      if (!fresh.length) fresh = list.slice(0, 4);
      $("#grid-new").innerHTML = fresh.slice(0, 4).map(videoCard).join("") || emptyState("Belum ada video baru");
      $("#grid-all").innerHTML = list.map(videoCard).join("") || emptyState("Belum ada video untuk umur ini");
      $("#all-title-age").textContent = age === "all" ? "" : "(" + ageLabel(age) + ")";
    };
    ageButtons($("#age-picker"), "age-btn", renderGrids);
    renderGrids();
  }

  /* ---------- Halaman: Kategori / Jelajah / Pencarian ---------- */
  function pageCategory() {
    const cid = params.get("c");
    const q = (params.get("q") || "").trim();
    const cat = cid ? CATS.find((c) => c.id === cid) : null;
    const banner = $("#page-banner");

    if (cat) {
      banner.style.setProperty("--c", cat.color);
      banner.style.setProperty("--cd", cat.dark);
      if (isLight(cat)) banner.style.color = "var(--ink)";
      banner.innerHTML = '<span class="emoji" aria-hidden="true">' + cat.emoji + "</span><div><h1>" + esc(cat.name) + "</h1><p>" + esc(cat.desc) + "</p></div>";
      document.title = cat.name + " – " + (CFG.siteName || "");
    } else if (q) {
      banner.innerHTML = '<span class="emoji" aria-hidden="true">🔍</span><div><h1>Hasil pencarian</h1><p>Kata kunci: “' + esc(q) + "”</p></div>";
      document.title = "Cari: " + q + " – " + (CFG.siteName || "");
    } else {
      banner.innerHTML = '<span class="emoji" aria-hidden="true">🧭</span><div><h1>Jelajah Semua Video</h1><p>Pilih kategori favoritmu!</p></div>';
    }

    $("#cat-scroller").innerHTML =
      '<a href="kategori.html" class="' + (!cat ? "active" : "") + '" style="--c:var(--ink)">🌈 Semua</a>' +
      CATS.map((c) => '<a href="kategori.html?c=' + c.id + '" class="' + (cat && cat.id === c.id ? "active" : "") + '" style="--c:' + c.color + '">' + c.emoji + " " + esc(c.name) + "</a>").join("");

    const norm = (s) => String(s || "").toLowerCase();
    const render = () => {
      let list = VIDEOS;
      if (cat) list = list.filter((v) => v.category === cat.id);
      if (q) {
        const words = norm(q).split(/\s+/).filter(Boolean);
        list = list.filter((v) => {
          const hay = norm(v.title + " " + v.description + " " + catById(v.category).name);
          return words.every((w) => hay.includes(w));
        });
      }
      list = byAge(list, getAge());
      $("#grid").innerHTML = list.length
        ? list.map(videoCard).join("")
        : emptyState(q ? "Ups, video “" + esc(q) + "” belum ada. Coba kata lain ya!" : "Belum ada video di sini. Coba pilih umur lain!");
      $("#result-count").textContent = list.length + " video";
    };
    ageButtons($("#age-filter"), "filter-btn", render);
    render();
  }

  /* ---------- Halaman: Tonton video ---------- */
  function parseDur(s) {
    const p = String(s || "").split(":").map(Number);
    if (p.some(isNaN)) return 0;
    return p.reduce((a, b) => a * 60 + b, 0);
  }

  function pageVideo() {
    const v = videoById(params.get("id"));
    const root = $("#watch-root");
    if (!v) {
      root.innerHTML = emptyState("Video tidak ditemukan 😕");
      return;
    }
    const c = catById(v.category);
    document.title = v.title + " – " + (CFG.siteName || "");
    root.style.setProperty("--c", c.color);

    const watched = isWatched(v.id);
    $("#player").innerHTML = (!v.youtubeId && !v.videoUrl && !v.animation)
      ? '<div class="player-empty"><div><div class="big-emoji">' + (v.emoji || c.emoji) + "</div><b>Video segera hadir!</b>" +
        "<small>(Admin: isi youtubeId untuk video ini di js/videos.js)</small></div></div>"
      : '<div id="yt-player"></div>';

    $("#watch-title").textContent = v.title;
    $("#watch-meta").innerHTML = chipCat(c) + '<span class="chip chip-age">👦 ' + ageLabel(v.age) + "</span>" + chipOriginal(v) +
      (v.duration ? '<span class="chip" style="background:#eee;color:var(--ink)">⏱️ ' + esc(v.duration) + "</span>" : "");
    $("#watch-desc").textContent = v.description || "";

    // Progres bintang
    const sp = $("#star-progress");
    const paintDone = () => {
      sp.classList.add("done");
      sp.innerHTML = '<span class="icon">✅</span><div style="flex:1"><b>Kamu sudah dapat ⭐ dari video ini!</b></div>';
    };
    if (watched) paintDone();
    else sp.innerHTML = '<span class="icon">⭐</span><div style="flex:1"><b>Tonton sampai selesai untuk dapat 1 bintang!</b>' +
      '<div class="bar" style="margin-top:6px"><span id="watch-bar"></span></div></div>';

    let awarded = watched;
    let played = 0;
    let required = parseDur(v.duration) * 0.8;
    const award = () => {
      if (awarded) return;
      awarded = true;
      const list = watchedList();
      if (!list.includes(v.id)) { list.push(v.id); store.set("watched", list); }
      Stars.add(1, "Hore! Kamu menonton sampai habis! +1 ⭐");
      paintDone();
    };
    const tick = () => {
      played += 1;
      const bar = $("#watch-bar");
      if (bar && required) bar.style.width = Math.min(100, (played / required) * 100) + "%";
      if (required && played >= required) award();
    };

    if (v.animation) {
      $("#player").innerHTML = '<div class="player-empty"><div><div class="big-emoji">⏳</div><b>Memuat animasi…</b></div></div>';
      loadScript("js/anim-player.js")
        .then(() => window.EduAnim.load(v.animation))
        .then((def) => {
          const ctrl = window.EduAnim.createPlayer($("#player"), def, { onEnded: award });
          window.__eksPlayer = ctrl;
          required = def.duration * 0.8;
          setInterval(() => { if (ctrl.playing && document.visibilityState === "visible") tick(); }, 1000);
        })
        .catch((err) => {
          console.error(err);
          $("#player").innerHTML = '<div class="player-empty"><div><div class="big-emoji">😕</div><b>Animasi gagal dimuat</b></div></div>';
        });
    } else if (v.youtubeId) {
      let playing = false;
      const fallback = () => {
        $("#player").innerHTML = '<iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(v.youtubeId) +
          '?rel=0&modestbranding=1&playsinline=1" title="' + esc(v.title) + '" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>';
      };
      const create = () => {
        try {
          window.__eksPlayer = new YT.Player("yt-player", {
            host: "https://www.youtube-nocookie.com",
            videoId: v.youtubeId,
            playerVars: { rel: 0, modestbranding: 1, playsinline: 1, iv_load_policy: 3 },
            events: {
              onReady: (e) => { const d = e.target.getDuration(); if (d) required = d * 0.8; },
              onStateChange: (e) => {
                playing = e.data === YT.PlayerState.PLAYING;
                if (e.data === YT.PlayerState.ENDED) award();
              }
            }
          });
          setInterval(() => { if (playing && document.visibilityState === "visible") tick(); }, 1000);
        } catch (err) { fallback(); }
      };
      if (window.YT && window.YT.Player) create();
      else {
        window.onYouTubeIframeAPIReady = create;
        const s = document.createElement("script");
        s.src = "https://www.youtube.com/iframe_api";
        s.onerror = fallback;
        document.head.append(s);
      }
    } else if (v.videoUrl) {
      $("#player").innerHTML = '<video controls playsinline preload="metadata" src="' + esc(v.videoUrl) + '"></video>';
      const el = $("#player video");
      el.addEventListener("loadedmetadata", () => { if (el.duration) required = el.duration * 0.8; });
      el.addEventListener("ended", award);
      setInterval(() => { if (!el.paused && !el.ended) tick(); }, 1000);
    }

    // Kuis
    if (v.quiz && v.quiz.length) renderQuiz(v);
    else $("#quiz").remove();

    // Video lainnya
    const others = VIDEOS.filter((x) => x.id !== v.id);
    const related = others.filter((x) => x.category === v.category)
      .concat(others.filter((x) => x.category !== v.category && x.age === v.age))
      .slice(0, 6);
    $("#related").innerHTML = related.map(miniCard).join("");
    const next = related[0];
    if (next) {
      const nb = $("#next-btn");
      nb.href = "video.html?id=" + encodeURIComponent(next.id);
      nb.hidden = false;
    }
  }

  function renderQuiz(v) {
    const box = $("#quiz");
    const done = store.get("quizDone", []).includes(v.id);
    let correct = 0, answered = 0;
    box.innerHTML = "<h2>🧠 Kuis Seru!</h2>" +
      '<p class="muted">' + (done ? "Kamu sudah pernah mengerjakan kuis ini. Boleh latihan lagi!" : "Jawab dengan benar dan dapatkan ⭐ untuk setiap jawaban benar!") + "</p>" +
      v.quiz.map((q, i) =>
        '<div class="quiz-item" data-i="' + i + '"><div class="quiz-q">' + (i + 1) + ". " + esc(q.q) + "</div>" +
        '<div class="quiz-options">' + q.options.map((o, j) => '<button type="button" class="quiz-opt" data-j="' + j + '">' + esc(o) + "</button>").join("") + "</div></div>"
      ).join("") + '<div class="quiz-result" id="quiz-result" aria-live="polite"></div>';

    box.addEventListener("click", (e) => {
      const b = e.target.closest(".quiz-opt");
      if (!b || b.disabled) return;
      const item = b.closest(".quiz-item");
      const q = v.quiz[+item.dataset.i];
      const opts = $$(".quiz-opt", item);
      opts.forEach((o) => (o.disabled = true));
      answered++;
      if (+b.dataset.j === q.answer) {
        b.classList.add("correct");
        b.textContent = "✅ " + b.textContent;
        correct++;
        Sound.play("good");
      } else {
        b.classList.add("wrong");
        opts[q.answer].classList.add("correct");
        Sound.play("bad");
      }
      if (answered === v.quiz.length) {
        const res = $("#quiz-result");
        const all = correct === v.quiz.length;
        res.innerHTML = (all ? "🎉 Sempurna! " : correct ? "👍 Bagus! " : "💪 Tidak apa-apa, coba lagi nanti ya! ") +
          "Kamu benar <b>" + correct + "</b> dari " + v.quiz.length + " soal." +
          ' <button type="button" class="btn btn-sm btn-sky" id="quiz-retry" style="margin-left:8px">🔄 Ulangi</button>';
        $("#quiz-retry").addEventListener("click", () => renderQuizFresh(v));
        const list = store.get("quizDone", []);
        if (!list.includes(v.id) && correct > 0) {
          list.push(v.id);
          store.set("quizDone", list);
          Stars.add(correct, "Kuis selesai! +" + correct + " ⭐");
        } else if (!list.includes(v.id)) {
          list.push(v.id);
          store.set("quizDone", list);
        }
      }
    });
  }
  function renderQuizFresh(v) {
    const old = $("#quiz");
    const fresh = old.cloneNode(false); // buang event listener lama
    old.replaceWith(fresh);
    renderQuiz(v);
  }

  /* ---------- Halaman: Pojok Orang Tua ---------- */
  function pageParent() {
    const root = $("#parent-root");
    let ok = false;
    try { ok = sessionStorage.getItem("eks_parent_ok") === "1"; } catch (e) { /* abaikan */ }
    const render = () => {
      const limit = store.get("limitMin", 0);
      const usedMin = Math.round(ScreenTime.used() / 60);
      const lv = levelOf(Stars.count);
      root.innerHTML =
        '<div class="panel"><h2>📊 Ringkasan Belajar</h2><div class="stats">' +
        '<div class="stat"><b>⭐ ' + Stars.count + "</b><span>Total bintang</span></div>" +
        '<div class="stat"><b>' + watchedList().length + "</b><span>Video ditonton sampai habis</span></div>" +
        '<div class="stat"><b>' + store.get("quizDone", []).length + "</b><span>Kuis dikerjakan</span></div>" +
        '<div class="stat"><b>' + usedMin + "</b><span>Menit di situs hari ini</span></div>" +
        '<div class="stat"><b>' + lv.e + "</b><span>" + esc(lv.name) + "</span></div>" +
        "</div></div>" +

        '<div class="panel"><h2>⏰ Batas Waktu Harian</h2>' +
        '<p class="muted">Saat batas tercapai, layar "Waktunya Istirahat" akan muncul dan video berhenti. Pengaturan tersimpan di perangkat ini.</p>' +
        '<div class="form-row"><label for="limit-sel">Batas per hari:</label><select id="limit-sel">' +
        [[0, "Tanpa batas"], [15, "15 menit"], [30, "30 menit"], [45, "45 menit"], [60, "1 jam"], [90, "1,5 jam"], [120, "2 jam"]]
          .map(([m, l]) => '<option value="' + m + '"' + (m === limit ? " selected" : "") + ">" + l + "</option>").join("") +
        '</select><button class="btn btn-sm btn-leaf" type="button" id="limit-save">Simpan</button>' +
        '<button class="btn btn-sm btn-ghost" type="button" id="limit-reset">Reset waktu hari ini</button></div></div>' +

        '<div class="panel"><h2>🧹 Data Anak</h2>' +
        '<p class="muted">Semua progres (bintang, riwayat tonton, kuis) hanya disimpan di browser perangkat ini — tidak dikirim ke server kami.</p>' +
        '<button class="btn btn-sm btn-coral" type="button" id="reset-all">Hapus semua progres</button></div>' +

        '<div class="panel prose"><h2>💡 Tips Pendampingan</h2><ul>' +
        "<li>Dampingi anak usia 6–8 tahun saat menonton, lalu ajak berdiskusi tentang isi video.</li>" +
        "<li>WHO dan IDAI menganjurkan waktu layar yang terbatas — gunakan fitur batas waktu di atas.</li>" +
        "<li>Kuis setelah video membantu anak mengingat pelajaran. Rayakan setiap bintang yang didapat!</li>" +
        "<li>Situs ini menampilkan iklan berlabel \"IKLAN\" untuk menutup biaya operasional. Ajarkan anak untuk tidak mengklik iklan dan selalu bertanya kepada orang tua.</li>" +
        "</ul></div>";

      $("#limit-save").addEventListener("click", () => {
        store.set("limitMin", parseInt($("#limit-sel").value, 10));
        toast("Batas waktu disimpan ✅");
      });
      $("#limit-reset").addEventListener("click", () => {
        store.remove("time_" + todayKey());
        store.remove("bonus_" + todayKey());
        toast("Waktu hari ini direset");
        render();
      });
      $("#reset-all").addEventListener("click", () => {
        if (!confirm("Hapus semua bintang, riwayat tonton, dan kuis? Tindakan ini tidak bisa dibatalkan.")) return;
        ["stars", "watched", "quizDone"].forEach((k) => store.remove(k));
        updateStarPill(false);
        toast("Progres dihapus");
        render();
      });
    };
    if (ok) render();
    else {
      root.innerHTML = '<div class="panel" style="text-align:center"><p>Halaman ini khusus orang tua.</p>' +
        '<div style="display:flex;flex-wrap:wrap;gap:12px;justify-content:center">' +
        '<button class="btn" type="button" id="open-gate">👪 Masuk sebagai Orang Tua</button>' +
        '<a class="btn btn-sun" href="index.html">🏠 Kembali ke Beranda</a></div></div>';
      const ask = () => parentGate(render);
      $("#open-gate").addEventListener("click", ask);
      ask();
    }
  }

  /* ---------- Inisialisasi ---------- */
  function init() {
    renderChrome();
    document.addEventListener("click", (e) => {
      if (e.target.closest(".btn, .age-btn, .filter-btn, .icon-btn, .pill, .bottom-nav button")) Sound.play("click");
    });
    try {
      if (PAGE === "home") pageHome();
      else if (PAGE === "category") pageCategory();
      else if (PAGE === "video") pageVideo();
      else if (PAGE === "parent") pageParent();
    } catch (err) {
      console.error(err);
    }
    Ads.init();
    ScreenTime.start();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
