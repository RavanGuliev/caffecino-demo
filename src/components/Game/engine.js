// "Dənləri tut!" — canvas oyun mühərriki (React-dan asılı deyil)
// Fincan barmaqla/siçanla/oxlarla idarə olunur, yuxarıdan dənlər düşür.

import { disposeHaptics, haptic } from "./haptics";

export const GAME_TIME = 60; // saniyə
const LIVES = 3;

const COLORS = {
  bgTop: "#1d4736",
  bgBottom: "#0d241b",
  cream: "#f7f5ee",
  band: "#2e6f54",
  coffee: "#3b2416",
  crema: "#c8a464",
  bean: "#6b3e26",
  beanDark: "#3e2214",
  gold: "#e3c27a",
  goldDark: "#a8823f",
  love: "#e5484d",
};

const rand = (a, b) => a + Math.random() * (b - a);
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function createGame(canvas, { onUpdate, onEnd }) {
  const ctx = canvas.getContext("2d");
  let W = 0;
  let H = 0;
  let raf = 0;
  let last = 0;
  let clock = 0; // dekorativ animasiyalar üçün
  let mode = "idle"; // idle | playing | paused | over
  let keyDir = 0;
  let lastEmitted = "";
  let s = null;

  const bokeh = Array.from({ length: 14 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: rand(18, 70),
    a: rand(0.03, 0.08),
    v: rand(0.004, 0.012),
  }));

  function cupY() {
    return H - Math.max(64, H * 0.11);
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth;
    H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (s) {
      s.cup.y = cupY();
      s.cup.w = clamp(W * 0.2, 64, 92);
      s.cup.x = clamp(s.cup.x, s.cup.w / 2, W - s.cup.w / 2);
      s.cup.tx = clamp(s.cup.tx, s.cup.w / 2, W - s.cup.w / 2);
    }
    draw();
  }

  function newState() {
    const w = clamp(W * 0.2, 64, 92);
    return {
      score: 0,
      caught: 0,
      time: GAME_TIME,
      lives: LIVES,
      combo: 0,
      elapsed: 0,
      spawnIn: 0.5,
      shake: 0,
      flash: 0, // buza dəyəndə qırmızı yanıb-sönmə
      items: [],
      particles: [],
      texts: [],
      cup: { x: W / 2, tx: W / 2, y: cupY(), w, h: w * 0.72, squash: 0, hurt: 0 },
    };
  }

  const multiplier = () => (s.combo >= 20 ? 3 : s.combo >= 10 ? 2 : 1);

  function emit(force = false) {
    const data = {
      score: s.score,
      time: Math.max(0, Math.ceil(s.time)),
      lives: s.lives,
      multiplier: multiplier(),
      caught: s.caught,
    };
    const key = JSON.stringify(data);
    if (force || key !== lastEmitted) {
      lastEmitted = key;
      onUpdate?.(data);
    }
  }

  // ---------- Məntiq ----------
  function spawn() {
    const d = clamp(s.elapsed / GAME_TIME, 0, 1);
    const roll = Math.random();
    const iceChance = lerp(0.14, 0.27, d);
    const type = roll < iceChance ? "ice" : roll < iceChance + 0.06 ? "gold" : "bean";
    const r = type === "ice" ? 15 : type === "gold" ? 13 : 12;
    s.items.push({
      type,
      r,
      x: rand(r + 6, W - r - 6),
      y: -r * 2,
      vy: lerp(170, 440, d) * rand(0.85, 1.15) * (type === "gold" ? 1.15 : 1),
      sway: type === "ice" ? 0 : rand(0, Math.PI * 2),
      rot: rand(0, Math.PI * 2),
      vr: rand(-3, 3),
    });
  }

  function burst(x, y, color, count = 10) {
    for (let i = 0; i < count; i++) {
      const a = rand(-Math.PI, 0);
      const sp = rand(80, 240);
      s.particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, life: rand(0.35, 0.7), max: 0.7, r: rand(2, 4), color });
    }
  }

  function floatText(x, y, text, color) {
    s.texts.push({ x, y, text, color, life: 0.9 });
  }

  function catchItem(it) {
    const { cup } = s;
    if (it.type === "ice") {
      s.lives -= 1;
      s.combo = 0;
      s.shake = 0.35;
      s.flash = 1;
      cup.hurt = 1;
      burst(it.x, cup.y - cup.h / 2, "#cdeaff", 14);
      floatText(it.x, cup.y - cup.h, "−1 ♥", COLORS.love);
      haptic("heavy");
      if (s.lives <= 0) return end("lives");
      return;
    }
    s.combo += 1;
    s.caught += 1;
    const before = multiplier();
    const pts = (it.type === "gold" ? 5 : 1) * before;
    s.score += pts;
    cup.squash = 1;
    if (it.type === "gold") haptic("light");
    burst(it.x, cup.y - cup.h / 2, it.type === "gold" ? COLORS.gold : COLORS.crema, it.type === "gold" ? 16 : 9);
    floatText(it.x, cup.y - cup.h, `+${pts}`, it.type === "gold" ? COLORS.gold : COLORS.cream);
    if (s.combo === 10 || s.combo === 20) {
      floatText(W / 2, H * 0.35, `x${multiplier()} COMBO!`, COLORS.gold);
      haptic("light");
    }
  }

  function update(dt) {
    s.elapsed += dt;
    s.time -= dt;
    if (s.time <= 0) {
      s.time = 0;
      return end("time");
    }

    const d = clamp(s.elapsed / GAME_TIME, 0, 1);
    s.spawnIn -= dt;
    if (s.spawnIn <= 0) {
      spawn();
      s.spawnIn = lerp(0.68, 0.27, d) * rand(0.75, 1.25);
    }

    const { cup } = s;
    if (keyDir) cup.tx = clamp(cup.tx + keyDir * 560 * dt, cup.w / 2, W - cup.w / 2);
    cup.x += (cup.tx - cup.x) * Math.min(1, dt * 18);
    cup.squash = Math.max(0, cup.squash - dt * 5);
    cup.hurt = Math.max(0, cup.hurt - dt * 2.5);
    s.shake = Math.max(0, s.shake - dt);
    s.flash = Math.max(0, s.flash - dt * 3);

    const mouthTop = cup.y - cup.h / 2;
    for (let i = s.items.length - 1; i >= 0; i--) {
      const it = s.items[i];
      it.y += it.vy * dt;
      it.rot += it.vr * dt;
      if (it.type !== "ice") it.x += Math.sin(clock * 3 + it.sway) * 18 * dt;

      const inMouth = it.y + it.r >= mouthTop && it.y - it.r <= mouthTop + 20 && Math.abs(it.x - cup.x) <= cup.w / 2;
      if (inMouth) {
        s.items.splice(i, 1);
        catchItem(it);
        if (mode !== "playing") return;
      } else if (it.y - it.r > H) {
        s.items.splice(i, 1);
        if (it.type !== "ice") s.combo = 0; // buraxılan dən kombonu sıfırlayır
      }
    }

    for (let i = s.particles.length - 1; i >= 0; i--) {
      const p = s.particles[i];
      p.life -= dt;
      p.vy += 520 * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      if (p.life <= 0) s.particles.splice(i, 1);
    }
    for (let i = s.texts.length - 1; i >= 0; i--) {
      const t = s.texts[i];
      t.life -= dt;
      t.y -= 46 * dt;
      if (t.life <= 0) s.texts.splice(i, 1);
    }
    emit();
  }

  // ---------- Çəkmə ----------
  function drawBackground() {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, COLORS.bgTop);
    g.addColorStop(1, COLORS.bgBottom);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    for (const b of bokeh) {
      const y = ((b.y + clock * b.v) % 1.2) - 0.1;
      ctx.beginPath();
      ctx.arc(b.x * W, (1 - y) * H, b.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(163, 203, 182, ${b.a})`;
      ctx.fill();
    }
  }

  function drawBean(it) {
    const gold = it.type === "gold";
    ctx.save();
    ctx.translate(it.x, it.y);
    ctx.rotate(it.rot);
    if (gold) {
      ctx.shadowColor = "rgba(227, 194, 122, 0.85)";
      ctx.shadowBlur = 18;
    }
    const g = ctx.createRadialGradient(-it.r * 0.3, -it.r * 0.4, 1, 0, 0, it.r * 1.2);
    g.addColorStop(0, gold ? "#fff1c9" : "#9a5d3b");
    g.addColorStop(0.55, gold ? COLORS.gold : COLORS.bean);
    g.addColorStop(1, gold ? COLORS.goldDark : COLORS.beanDark);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, 0, it.r * 0.78, it.r, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    // dənin ortasındakı xətt
    ctx.strokeStyle = gold ? "rgba(120, 85, 30, 0.8)" : "rgba(30, 14, 6, 0.85)";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(0, -it.r * 0.78);
    ctx.bezierCurveTo(it.r * 0.35, -it.r * 0.2, -it.r * 0.35, it.r * 0.2, 0, it.r * 0.78);
    ctx.stroke();
    ctx.restore();
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function drawIce(it) {
    const size = it.r * 2;
    ctx.save();
    ctx.translate(it.x, it.y);
    ctx.rotate(it.rot * 0.4);
    roundRect(-size / 2, -size / 2, size, size, 6);
    const g = ctx.createLinearGradient(-size / 2, -size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(235, 248, 255, 0.85)");
    g.addColorStop(1, "rgba(160, 205, 235, 0.55)");
    ctx.fillStyle = g;
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    roundRect(-size / 2 + 4, -size / 2 + 4, size * 0.35, 4, 2);
    ctx.fill();
    ctx.restore();
  }

  function drawCup() {
    const { cup } = s || { cup: { x: W / 2, y: cupY(), w: clamp(W * 0.2, 64, 92), h: clamp(W * 0.2, 64, 92) * 0.72, squash: 0, hurt: 0 } };
    const { x, y, w, h } = cup;
    const sq = cup.squash;
    ctx.save();
    ctx.translate(x, y + h / 2);
    ctx.scale(1 + sq * 0.09, 1 - sq * 0.09);
    ctx.translate(0, -h / 2);

    // buxar
    ctx.strokeStyle = "rgba(247, 245, 238, 0.22)";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    for (let i = -1; i <= 1; i++) {
      const ox = i * w * 0.2;
      ctx.beginPath();
      for (let k = 0; k <= 12; k++) {
        const py = -h / 2 - 8 - k * 3;
        const px = ox + Math.sin(clock * 3 + k * 0.6 + i) * 4;
        k ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      }
      ctx.stroke();
    }

    // nəlbəki
    ctx.fillStyle = "rgba(247, 245, 238, 0.9)";
    ctx.beginPath();
    ctx.ellipse(0, h / 2 + 4, w * 0.68, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // qulp
    ctx.strokeStyle = COLORS.cream;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(w / 2 - 2, 0, h * 0.24, -Math.PI / 2.2, Math.PI / 2.2);
    ctx.stroke();

    // gövdə
    const top = -h / 2;
    const bottom = h / 2;
    ctx.beginPath();
    ctx.moveTo(-w / 2, top);
    ctx.lineTo(w / 2, top);
    ctx.quadraticCurveTo(w * 0.44, bottom, w * 0.22, bottom);
    ctx.lineTo(-w * 0.22, bottom);
    ctx.quadraticCurveTo(-w * 0.44, bottom, -w / 2, top);
    ctx.closePath();
    ctx.fillStyle = cup.hurt > 0 ? `rgb(247, ${Math.round(245 - cup.hurt * 90)}, ${Math.round(238 - cup.hurt * 90)})` : COLORS.cream;
    ctx.fill();

    // yaşıl zolaq
    ctx.save();
    ctx.clip();
    ctx.fillStyle = COLORS.band;
    ctx.fillRect(-w / 2, -h * 0.02, w, h * 0.2);
    ctx.restore();

    // qəhvə səthi + krema
    ctx.fillStyle = COLORS.crema;
    ctx.beginPath();
    ctx.ellipse(0, top, w / 2, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.coffee;
    ctx.beginPath();
    ctx.ellipse(0, top + 1, w / 2 - 5, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function draw() {
    if (!W || !H) return;
    ctx.save();
    if (s?.shake > 0) ctx.translate(rand(-6, 6) * s.shake, rand(-6, 6) * s.shake);
    drawBackground();
    if (s) {
      for (const it of s.items) (it.type === "ice" ? drawIce : drawBean)(it);
    }
    drawCup();
    if (s) {
      for (const p of s.particles) {
        ctx.globalAlpha = Math.max(0, p.life / p.max);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.textAlign = "center";
      for (const t of s.texts) {
        ctx.globalAlpha = Math.min(1, t.life * 1.6);
        ctx.fillStyle = t.color;
        ctx.font = `800 ${t.text.includes("COMBO") ? 26 : 18}px Montserrat, sans-serif`;
        ctx.fillText(t.text, t.x, t.y);
      }
      ctx.globalAlpha = 1;
    }
    ctx.restore();
    if (s?.flash > 0) {
      // ekranın kənarlarında qırmızı parıltı
      const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.25, W / 2, H / 2, Math.max(W, H) * 0.75);
      g.addColorStop(0, "rgba(229, 72, 77, 0)");
      g.addColorStop(1, `rgba(229, 72, 77, ${0.55 * s.flash})`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }
  }

  function frame(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    clock += dt;
    if (mode === "playing") update(dt);
    draw();
    raf = requestAnimationFrame(frame);
  }

  function end(reason) {
    mode = "over";
    emit(true);
    onEnd?.({ score: s.score, caught: s.caught, reason });
  }

  // ---------- İdarəetmə ----------
  const setTarget = (clientX) => {
    if (!s || mode !== "playing") return;
    const rect = canvas.getBoundingClientRect();
    s.cup.tx = clamp(clientX - rect.left, s.cup.w / 2, W - s.cup.w / 2);
  };
  const onPointer = (e) => setTarget(e.clientX);
  const onKey = (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      if (mode === "playing") e.preventDefault();
      keyDir = e.type === "keydown" ? (e.key === "ArrowLeft" ? -1 : 1) : 0;
    }
  };
  const onVisibility = () => document.hidden && api.pause();

  canvas.addEventListener("pointerdown", onPointer);
  canvas.addEventListener("pointermove", onPointer);
  window.addEventListener("keydown", onKey);
  window.addEventListener("keyup", onKey);
  document.addEventListener("visibilitychange", onVisibility);
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();
  raf = requestAnimationFrame((t) => {
    last = t;
    frame(t);
  });

  const api = {
    start() {
      s = newState();
      mode = "playing";
      emit(true);
    },
    pause() {
      if (mode === "playing") {
        mode = "paused";
        onUpdate?.({ paused: true });
      }
    },
    resume() {
      if (mode === "paused") {
        mode = "playing";
        onUpdate?.({ paused: false });
      }
    },
    get mode() {
      return mode;
    },
    destroy() {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onPointer);
      canvas.removeEventListener("pointermove", onPointer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onKey);
      document.removeEventListener("visibilitychange", onVisibility);
      disposeHaptics();
    },
  };
  return api;
}
