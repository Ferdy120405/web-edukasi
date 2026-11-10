/* =========================================================
   EduAnim — mesin pemutar animasi original EduStream Kids
   ---------------------------------------------------------
   Animasi digambar di <canvas> 1280x720 berdasarkan waktu (t),
   sehingga bisa diputar, dijeda, digeser, dan direkam menjadi
   file video. Setiap animasi didaftarkan lewat:

     EduAnim.register("id-animasi", {
       title: "...",
       duration: 74,                 // detik
       scenes: [ { start, end, say, audio? } ],
       draw(ctx, t) { ... }          // gambar 1 frame pada detik t
     });

   - say   : teks narasi (dibacakan suara otomatis + jadi subtitle)
   - audio : (opsional) file rekaman suara Anda sendiri untuk
             adegan itu, mis. "audio/siklus-air/1.mp3". Jika ada,
             file ini dipakai menggantikan suara otomatis dan
             IKUT TEREKAM saat membuat file video di Studio.
   ========================================================= */
(function () {
  "use strict";

  const W = 1280, H = 720;
  const PI = Math.PI;
  const registry = {};
  const CHAR_SEC = 0.068; // perkiraan durasi baca per huruf (untuk subtitle)

  /* ---------- Alat bantu menggambar (dipakai file animasi) ---------- */
  const G = {
    W, H, PI,
    clamp: (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)),
    lerp: (a, b, p) => a + (b - a) * p,
    prog: (t, a, b) => G.clamp((t - a) / (b - a)),
    // 0→1 saat masuk rentang [a,b], 1→0 saat keluar (fade in/out)
    win: (t, a, b, f = 0.5) => G.prog(t, a, a + f) * (1 - G.prog(t, b - f, b)),
    ease: {
      inOut: (p) => (p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2),
      out: (p) => 1 - Math.pow(1 - p, 3),
      in: (p) => p * p * p,
      outBack: (p) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); }
    },
    mix(c1, c2, p) {
      const a = parseInt(c1.slice(1), 16), b = parseInt(c2.slice(1), 16);
      const r = Math.round(G.lerp((a >> 16) & 255, (b >> 16) & 255, p));
      const g = Math.round(G.lerp((a >> 8) & 255, (b >> 8) & 255, p));
      const bl = Math.round(G.lerp(a & 255, b & 255, p));
      return "rgb(" + r + "," + g + "," + bl + ")";
    },
    rr(ctx, x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    },
    font: (size, weight, fam) => (weight || 800) + " " + size + "px " + (fam || '"Baloo 2", "Nunito", sans-serif'),
    text(ctx, str, x, y, o = {}) {
      ctx.save();
      ctx.font = G.font(o.size || 40, o.weight, o.family);
      ctx.textAlign = o.align || "center";
      ctx.textBaseline = o.baseline || "middle";
      if (o.stroke) {
        ctx.lineJoin = "round";
        ctx.lineWidth = o.strokeW || 8;
        ctx.strokeStyle = o.stroke;
        ctx.strokeText(str, x, y);
      }
      ctx.fillStyle = o.color || "#2B2D42";
      ctx.fillText(str, x, y);
      ctx.restore();
    },
    // label berbentuk pil (kiri-atas di x,y), p = progres muncul, a = opasitas
    pill(ctx, str, x, y, color, p, a) {
      if (p <= 0 || a <= 0) return;
      ctx.save();
      ctx.globalAlpha *= a;
      ctx.font = G.font(38);
      const w = ctx.measureText(str).width + 56, h = 70;
      ctx.translate(x, y + h / 2);
      ctx.scale(p, p);
      ctx.fillStyle = "rgba(0,0,0,.18)";
      G.rr(ctx, 0, -h / 2 + 6, w, h, h / 2); ctx.fill();
      ctx.fillStyle = color;
      G.rr(ctx, 0, -h / 2, w, h, h / 2); ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.textBaseline = "middle";
      ctx.fillText(str, 28, 2);
      ctx.restore();
    }
  };

  function wrapLines(ctx, text, maxW) {
    const words = text.split(/\s+/);
    const lines = [];
    let line = "";
    words.forEach((w) => {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
      else line = test;
    });
    if (line) lines.push(line);
    return lines;
  }

  /* ---------- Pemuat skrip ---------- */
  function loadScript(src) {
    return new Promise((res, rej) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = res;
      s.onerror = () => rej(new Error("Gagal memuat " + src));
      document.head.append(s);
    });
  }

  let kitPromise = null;
  function load(id) {
    if (registry[id]) return Promise.resolve(registry[id]);
    if (!kitPromise) kitPromise = window.EduKit ? Promise.resolve() : loadScript("js/anim-kit.js");
    return kitPromise.then(() => loadScript("js/animations/" + encodeURIComponent(id) + ".js")).then(() => {
      if (!registry[id]) throw new Error("Animasi " + id + " tidak terdaftar");
      return registry[id];
    });
  }

  /* ---------- Suara narator otomatis (Text-to-Speech) ---------- */
  let idVoice = null, enVoice = null;
  function pickVoice() {
    if (!("speechSynthesis" in window)) return;
    const all = speechSynthesis.getVoices();
    const vs = all.filter((v) => /^id|^in[-_]/i.test(v.lang));
    idVoice = vs.find((v) => /natural|online/i.test(v.name) && /gadis|female|wanita/i.test(v.name)) ||
      vs.find((v) => /natural|online|google/i.test(v.name)) || vs[0] || null;
    const en = all.filter((v) => /^en[-_]US/i.test(v.lang));
    enVoice = en.find((v) => /natural|online/i.test(v.name) && /aria|jenny|ana|female/i.test(v.name)) ||
      en.find((v) => /natural|online|google/i.test(v.name)) || en[0] || null;
  }
  // Teks di dalam {kurung kurawal} dibacakan dengan suara bahasa Inggris
  function segments(say) {
    const out = [];
    let last = 0, m;
    const re = /\{([^}]*)\}/g;
    while ((m = re.exec(say))) {
      if (m.index > last) out.push({ text: say.slice(last, m.index), en: false });
      out.push({ text: m[1], en: true });
      last = re.lastIndex;
    }
    if (last < say.length) out.push({ text: say.slice(last), en: false });
    return out.filter((s) => s.text.replace(/[\s.,!?:;-]/g, "").length);
  }
  const plainSay = (s) => String(s || "").replace(/[{}]/g, "");
  if ("speechSynthesis" in window) {
    pickVoice();
    speechSynthesis.addEventListener("voiceschanged", pickVoice);
  }

  const fmt = (s) => Math.floor(s / 60) + ":" + String(Math.floor(s % 60)).padStart(2, "0");

  /* ---------- Pemutar ---------- */
  function createPlayer(container, def, opts = {}) {
    container.classList.add("is-anim");
    container.innerHTML =
      '<div class="anim-stage"><canvas width="' + W + '" height="' + H + '" aria-label="' + (def.title || "Animasi") + '"></canvas>' +
      '<button type="button" class="anim-big-play" aria-label="Putar animasi">▶</button></div>' +
      '<div class="anim-controls">' +
      '<button type="button" class="anim-btn" data-act="play" aria-label="Putar">▶</button>' +
      '<input type="range" class="anim-seek" min="0" max="' + def.duration + '" step="0.1" value="0" aria-label="Posisi animasi">' +
      '<span class="anim-time">0:00 / ' + fmt(def.duration) + "</span>" +
      '<button type="button" class="anim-btn" data-act="voice" aria-pressed="true" title="Suara narator">🗣️</button>' +
      '<button type="button" class="anim-btn" data-act="music" aria-pressed="true" title="Musik latar">🎵</button>' +
      '<button type="button" class="anim-btn" data-act="cc" aria-pressed="true" title="Subtitle">CC</button>' +
      '<button type="button" class="anim-btn" data-act="fs" title="Layar penuh">⛶</button>' +
      "</div>";

    const canvas = container.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    const bigPlay = container.querySelector(".anim-big-play");
    const btnPlay = container.querySelector('[data-act="play"]');
    const seekEl = container.querySelector(".anim-seek");
    const timeEl = container.querySelector(".anim-time");

    let t = 0, playing = false, started = false, sceneIdx = -1, raf = 0, last = performance.now();
    let voiceOn = true, musicOn = true, ccOn = true, dragging = false, recording = null, destroyed = false;
    let actx = null, master = null, musicGain = null, voiceGain = null, nextStep = -1;
    const audioEls = {};

    /* --- audio --- */
    function ensureAudio() {
      if (actx) { if (actx.state === "suspended") actx.resume(); return; }
      try {
        actx = new (window.AudioContext || window.webkitAudioContext)();
        master = actx.createGain(); master.gain.value = 1; master.connect(actx.destination);
        musicGain = actx.createGain(); musicGain.gain.value = 0.9; musicGain.connect(master);
        voiceGain = actx.createGain(); voiceGain.gain.value = 1; voiceGain.connect(master);
      } catch (e) { actx = null; }
    }

    // Musik latar ceria: arpeggio C - G - Am - F (dibuat dengan Web Audio)
    const STEP = 0.3;
    const CHORDS = [[261.6, 329.6, 392.0], [196.0, 246.9, 293.7], [220.0, 261.6, 329.6], [174.6, 220.0, 261.6]];
    const PATTERN = [0, 1, 2, 1, 0, 2, 1, 2];
    function pluck(when, f, vol) {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = "triangle"; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, when);
      g.gain.exponentialRampToValueAtTime(vol, when + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, when + 0.5);
      o.connect(g).connect(musicGain);
      o.start(when); o.stop(when + 0.55);
    }
    // Nada melodi lagu (def.notes: [{t, f, d, v, type}]) — dipakai adegan bernyanyi
    let noteIdx = -1;
    function tone(when, n) {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = n.type || "triangle"; o.frequency.value = n.f;
      const v = n.v || 0.08, d = Math.max(0.12, n.d || 0.4);
      g.gain.setValueAtTime(0.0001, when);
      g.gain.exponentialRampToValueAtTime(v, when + 0.02);
      g.gain.setValueAtTime(v, when + d * 0.6);
      g.gain.exponentialRampToValueAtTime(0.0001, when + d);
      o.connect(g).connect(musicGain);
      o.start(when); o.stop(when + d + 0.05);
    }
    function scheduleNotes() {
      const N = def.notes;
      if (noteIdx < 0) { noteIdx = N.findIndex((n) => n.t >= t); if (noteIdx < 0) noteIdx = N.length; }
      while (noteIdx < N.length && N[noteIdx].t < t + 0.35) {
        tone(actx.currentTime + Math.max(0, N[noteIdx].t - t), N[noteIdx]);
        noteIdx++;
      }
    }
    function scheduleMusic() {
      if (!actx || !musicOn || !playing) return;
      if (def.notes) scheduleNotes();
      const cur = def.scenes[sceneAt(t)];
      if (def.music === false || (cur && cur.song)) { nextStep = -1; return; }
      if (nextStep < 0) nextStep = Math.ceil(t / STEP);
      while (nextStep * STEP < t + 0.35) {
        const when = actx.currentTime + Math.max(0, nextStep * STEP - t);
        const bar = Math.floor(nextStep / 8) % 4, k = nextStep % 8;
        const chord = CHORDS[bar];
        pluck(when, chord[PATTERN[k]] * 2, 0.028);
        if (k === 0) pluck(when, chord[0] / 2, 0.05);
        nextStep++;
      }
    }

    /* --- narasi --- */
    function stopVoice() {
      if ("speechSynthesis" in window) speechSynthesis.cancel();
      Object.values(audioEls).forEach((a) => { try { a.pause(); } catch (e) { /* abaikan */ } });
    }
    function narrate(i) {
      stopVoice();
      if (!voiceOn || i < 0) return;
      const s = def.scenes[i];
      if (s.audio) {
        let a = audioEls[i];
        if (!a) {
          a = audioEls[i] = new Audio(s.audio);
          if (actx) { try { actx.createMediaElementSource(a).connect(voiceGain); } catch (e) { /* abaikan */ } }
        }
        a.currentTime = 0;
        a.play().catch(() => {});
      } else if (s.say && "speechSynthesis" in window) {
        segments(s.say).forEach((seg) => {
          const u = new SpeechSynthesisUtterance(seg.text);
          u.lang = seg.en ? "en-US" : "id-ID";
          const v = seg.en ? enVoice : idVoice;
          if (v) u.voice = v;
          u.rate = (def.rate || 0.95) * (seg.en ? 0.9 : 1);
          u.pitch = def.pitch || 1.15;
          speechSynthesis.speak(u);
        });
      }
    }
    const sceneAt = (time) => def.scenes.findIndex((s) => time >= s.start && time < s.end);
    function syncScene() {
      const i = sceneAt(t);
      // ucapkan narasi hanya jika posisi masih dekat awal adegan
      sceneIdx = (i >= 0 && t - def.scenes[i].start < 2) ? -1 : i;
    }

    /* --- subtitle --- */
    function drawSubtitle() {
      const i = sceneAt(t);
      if (i < 0) return;
      const s = def.scenes[i];
      if (!s.say || t < s.start + 0.2) return;
      if (!s._sents) { const p = plainSay(s.say); s._sents = (p.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [p]).map((x) => x.trim()); }
      let acc = s.start + 0.2, cur = s._sents[s._sents.length - 1];
      for (const sent of s._sents) {
        const d = sent.length * CHAR_SEC;
        if (t < acc + d) { cur = sent; break; }
        acc += d;
      }
      ctx.save();
      ctx.font = G.font(34, 800, '"Nunito", sans-serif');
      const lines = wrapLines(ctx, cur, 1040);
      const lh = 44, bh = lines.length * lh + 26;
      const bw = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 60;
      const by = H - 28 - bh;
      ctx.fillStyle = "rgba(20,18,40,.72)";
      G.rr(ctx, (W - bw) / 2, by, bw, bh, 22); ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      lines.forEach((l, k) => ctx.fillText(l, W / 2, by + 13 + lh / 2 + k * lh));
      ctx.restore();
    }

    /* --- render loop --- */
    function render() {
      // Sebelum diputar, tampilkan frame sampul (def.poster detik)
      const showPoster = !started && def.poster != null;
      ctx.save();
      ctx.clearRect(0, 0, W, H);
      try { def.draw(ctx, showPoster ? def.poster : t, G); } catch (e) { console.error(e); }
      ctx.restore();
      if (ccOn && !showPoster) drawSubtitle();
    }
    function frame(now) {
      if (destroyed) return;
      // timestamp rAF bisa sedikit lebih awal dari performance.now(), jadi jangan biarkan negatif
      const dt = Math.max(0, Math.min(0.1, (now - last) / 1000));
      last = now;
      if (playing) {
        t += dt;
        if (t >= def.duration) { t = def.duration; end(); }
        const i = sceneAt(t);
        if (playing && i !== sceneIdx) { sceneIdx = i; narrate(i); }
        scheduleMusic();
      }
      render();
      if (!dragging) seekEl.value = t.toFixed(1);
      timeEl.textContent = fmt(t) + " / " + fmt(def.duration);
      raf = requestAnimationFrame(frame);
    }

    function paintButtons() {
      btnPlay.textContent = playing ? "⏸" : "▶";
      btnPlay.setAttribute("aria-label", playing ? "Jeda" : "Putar");
      bigPlay.hidden = playing;
      bigPlay.textContent = t >= def.duration ? "🔄" : "▶";
    }
    function play() {
      if (t >= def.duration) t = 0;
      started = true;
      ensureAudio();
      syncScene();
      nextStep = -1; noteIdx = -1;
      playing = true;
      paintButtons();
    }
    function pause() {
      playing = false;
      stopVoice();
      paintButtons();
    }
    function end() {
      playing = false;
      stopVoice();
      paintButtons();
      if (opts.onEnded) opts.onEnded();
      if (recording) { const r = recording; recording = null; setTimeout(() => r.stop(), 700); }
    }
    function seek(v) {
      t = G.clamp(+v, 0, def.duration);
      started = true;
      stopVoice();
      nextStep = -1; noteIdx = -1;
      if (playing) syncScene();
      paintButtons();
    }

    /* --- kontrol --- */
    bigPlay.addEventListener("click", play);
    canvas.addEventListener("click", () => (playing ? pause() : play()));
    container.querySelector(".anim-controls").addEventListener("click", (e) => {
      const b = e.target.closest("[data-act]");
      if (!b) return;
      const act = b.dataset.act;
      if (act === "play") playing ? pause() : play();
      else if (act === "voice") { voiceOn = !voiceOn; b.setAttribute("aria-pressed", voiceOn); if (!voiceOn) stopVoice(); }
      else if (act === "music") { musicOn = !musicOn; b.setAttribute("aria-pressed", musicOn); nextStep = -1; noteIdx = -1; }
      else if (act === "cc") { ccOn = !ccOn; b.setAttribute("aria-pressed", ccOn); }
      else if (act === "fs") {
        if (document.fullscreenElement) document.exitFullscreen();
        else if (container.requestFullscreen) container.requestFullscreen().catch(() => {});
      }
    });
    seekEl.addEventListener("pointerdown", () => (dragging = true));
    seekEl.addEventListener("pointerup", () => (dragging = false));
    seekEl.addEventListener("input", () => seek(seekEl.value));
    document.addEventListener("visibilitychange", () => {
      if (document.hidden && playing && !recording) pause();
    });

    /* --- rekam menjadi file video --- */
    function record(onProgress) {
      return new Promise((resolve, reject) => {
        if (!canvas.captureStream || !window.MediaRecorder) {
          reject(new Error("Browser ini belum mendukung perekaman. Gunakan Chrome atau Edge terbaru."));
          return;
        }
        ensureAudio();
        const stream = canvas.captureStream(30);
        let dest = null;
        if (actx) {
          dest = actx.createMediaStreamDestination();
          master.connect(dest);
          dest.stream.getAudioTracks().forEach((tr) => stream.addTrack(tr));
        }
        const types = ["video/mp4;codecs=avc1.42E01E,mp4a.40.2", "video/mp4", "video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"];
        const mime = types.find((m) => MediaRecorder.isTypeSupported(m)) || "";
        const rec = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: 6000000 } : {});
        const chunks = [];
        rec.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
        const timer = setInterval(() => onProgress && onProgress(t, def.duration), 250);
        rec.onstop = () => {
          clearInterval(timer);
          if (dest) { try { master.disconnect(dest); } catch (e) { /* abaikan */ } }
          const type = rec.mimeType || mime || "video/webm";
          resolve({ blob: new Blob(chunks, { type }), ext: /mp4/.test(type) ? "mp4" : "webm" });
        };
        recording = rec;
        seek(0);
        rec.start(500);
        play();
      });
    }

    function destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
      stopVoice();
      if (actx) actx.close();
    }

    paintButtons();
    const fontsReady = document.fonts && document.fonts.load
      ? Promise.race([
          Promise.all([document.fonts.load(G.font(40)), document.fonts.load(G.font(34, 800, '"Nunito"'))]),
          new Promise((r) => setTimeout(r, 1500))
        ])
      : Promise.resolve();
    fontsReady.then(() => { last = performance.now(); raf = requestAnimationFrame(frame); });

    return {
      play, pause, seek, record, destroy, canvas,
      pauseVideo: pause,
      get playing() { return playing; },
      get time() { return t; },
      get duration() { return def.duration; }
    };
  }

  window.EduAnim = { G, register: (id, def) => (registry[id] = def), load, createPlayer, registry };
})();
