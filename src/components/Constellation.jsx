import React, { useEffect, useRef } from "react";

// Signature visual: a constellation of outlined triangles that assembles into
// the open "C" of Cidea. Decorative only — hidden from assistive tech.
// Respects prefers-reduced-motion (renders one static frame) and pauses
// when off-screen or when the tab is hidden.

const PALETTE = [
  ["#8052FF", 0.52],
  ["#B49CFF", 0.2],
  ["#F5F2FF", 0.15],
  ["#FFB829", 0.13],
];

function pickColor(r) {
  let acc = 0;
  for (const [c, w] of PALETTE) {
    acc += w;
    if (r <= acc) return c;
  }
  return PALETTE[0][0];
}

// Point generators for each shape, in a unit-ish space centred on 0.
const shapes = {
  // The open "C" of Cidea: a torus arc with a gap on the right.
  c(rand) {
    const gap = 0.62;
    const u = gap + rand() * (Math.PI * 2 - gap * 2);
    const v = rand() * Math.PI * 2;
    const tube = 0.34 * Math.sqrt(rand()) + 0.04;
    const R = 1 + (rand() - 0.5) * 0.06;
    return [(R + tube * Math.cos(v)) * Math.cos(u), (R + tube * Math.cos(v)) * Math.sin(u), tube * Math.sin(v)];
  },
  // A closed lens ring (search / visibility).
  ring(rand) {
    const u = rand() * Math.PI * 2;
    const v = rand() * Math.PI * 2;
    const tube = 0.22 * Math.sqrt(rand()) + 0.03;
    return [(0.95 + tube * Math.cos(v)) * Math.cos(u), (0.95 + tube * Math.cos(v)) * Math.sin(u), tube * Math.sin(v) * 1.4];
  },
  // A browser frame with a headline block inside (websites).
  frame(rand) {
    const w = 1.35;
    const h = 0.95;
    const r = rand();
    const jitter = () => (rand() - 0.5) * 0.07;
    if (r < 0.55) {
      const t = rand();
      const edge = Math.floor(rand() * 4);
      if (edge < 2) return [-w + 2 * w * t, (edge ? h : -h) + jitter(), jitter()];
      return [(edge === 2 ? -w : w) + jitter(), -h + 2 * h * t, jitter()];
    }
    if (r < 0.68) return [-w + rand() * 2 * w, -h + 0.22 + jitter() * 0.5, jitter()];
    const line = Math.floor(rand() * 3);
    const len = [1.6, 1.2, 0.8][line];
    return [-w + 0.25 + rand() * len, -0.2 + line * 0.32 + jitter(), jitter()];
  },
  // A signal wave (campaigns making noise).
  wave(rand) {
    const x = (rand() - 0.5) * 2.8;
    const z = (rand() - 0.5) * 0.9;
    const y = Math.sin(x * 2.2) * 0.42 * Math.cos(z * 1.4) + (rand() - 0.5) * 0.12;
    return [x, y, z];
  },
};

function makeParticles(count, seed, shape) {
  let s = seed;
  const rand = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const gen = shapes[shape] || shapes.c;
  const out = [];
  for (let i = 0; i < count; i++) {
    const [x, y, z] = gen(rand);
    out.push({
      x,
      y,
      z,
      sx: (rand() - 0.5) * 5,
      sy: (rand() - 0.5) * 5,
      sz: (rand() - 0.5) * 3,
      size: 1.6 + rand() * 3.2,
      rot: rand() * Math.PI * 2,
      spin: (rand() - 0.5) * 0.0012,
      phase: rand() * Math.PI * 2,
      delay: rand() * 0.45,
      color: pickColor(rand()),
    });
  }
  // Sparse ambient field around the mark.
  for (let i = 0; i < count * 0.06; i++) {
    out.push({
      x: (rand() - 0.5) * 3.6,
      y: (rand() - 0.5) * 2.8,
      z: (rand() - 0.5) * 1.5,
      sx: (rand() - 0.5) * 5,
      sy: (rand() - 0.5) * 5,
      sz: 0,
      size: 1.4 + rand() * 2.2,
      rot: rand() * Math.PI * 2,
      spin: (rand() - 0.5) * 0.0008,
      phase: rand() * Math.PI * 2,
      delay: rand() * 0.45,
      color: pickColor(rand()),
      ambient: true,
    });
  }
  return out;
}

const ease = (t) => 1 - Math.pow(1 - t, 3);

export function Constellation({ className = "", shape = "c", density = 1 }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles = [];
    let frame = 0;
    let running = false;
    let visible = true;
    const start = performance.now();
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };

    function resize() {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      const count = Math.round((width < 520 ? 850 : width < 900 ? 1300 : 2000) * density);
      if (particles.length === 0 || Math.abs(particles.length - count * 1.06) > 50) particles = makeParticles(count, 7, shape);
      if (!running) draw(reduced ? Infinity : performance.now());
    }

    function draw(now) {
      const t = now - start;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;
      const time = reduced ? 0 : t;
      const yaw = Math.sin(time * 0.00011) * 0.42 + pointer.x * 0.35;
      const pitch = Math.sin(time * 0.00008) * 0.18 + pointer.y * 0.22;
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const unit = Math.min(width, height) * 0.38;
      const ox = width / 2;
      const oy = height / 2;
      const buckets = new Map();

      for (const p of particles) {
        const k = reduced ? 1 : ease(Math.min(1, Math.max(0, (t / 1900 - p.delay) / 0.75)));
        const wob = reduced ? 0 : Math.sin(time * 0.0009 + p.phase) * 0.012;
        let x = p.sx + (p.x - p.sx) * k + wob;
        let y = p.sy + (p.y - p.sy) * k + wob;
        let z = p.sz + (p.z - p.sz) * k;
        // rotate around Y then X
        const x1 = x * cy + z * sy;
        const z1 = -x * sy + z * cy;
        const y1 = y * cp - z1 * sp;
        const z2 = y * sp + z1 * cp;
        const persp = 3.4 / (3.4 + z2);
        const px = ox + x1 * unit * persp;
        const py = oy + y1 * unit * persp;
        if (px < -10 || px > width + 10 || py < -10 || py > height + 10) continue;
        const depth = Math.max(0, Math.min(1, (z2 + 0.5) / 1));
        const alphaBucket = p.ambient ? 0 : depth > 0.66 ? 1 : depth > 0.33 ? 2 : 3;
        const key = p.color + alphaBucket;
        if (!buckets.has(key)) buckets.set(key, { color: p.color, alpha: [0.28, 0.42, 0.75, 1][alphaBucket], pts: [] });
        const r = p.rot + (reduced ? 0 : time * p.spin);
        const s = p.size * persp;
        buckets.get(key).pts.push(px, py, s, r);
      }

      ctx.lineWidth = 1;
      ctx.lineJoin = "round";
      for (const b of buckets.values()) {
        ctx.strokeStyle = b.color;
        ctx.globalAlpha = b.alpha;
        ctx.beginPath();
        const a = b.pts;
        for (let i = 0; i < a.length; i += 4) {
          const [px, py, s, r] = [a[i], a[i + 1], a[i + 2], a[i + 3]];
          ctx.moveTo(px + Math.cos(r) * s, py + Math.sin(r) * s);
          ctx.lineTo(px + Math.cos(r + 2.094) * s, py + Math.sin(r + 2.094) * s);
          ctx.lineTo(px + Math.cos(r + 4.189) * s, py + Math.sin(r + 4.189) * s);
          ctx.closePath();
        }
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    function loop(now) {
      draw(now);
      frame = requestAnimationFrame(loop);
    }
    function play() {
      if (reduced || running || !visible || document.hidden) return;
      running = true;
      frame = requestAnimationFrame(loop);
    }
    function pause() {
      running = false;
      cancelAnimationFrame(frame);
    }

    const onPointer = (e) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onVisibility = () => (document.hidden ? pause() : play());
    const ro = new ResizeObserver(resize);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      visible ? play() : pause();
    });

    resize();
    ro.observe(canvas);
    io.observe(canvas);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    play();

    return () => {
      pause();
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [shape, density]);

  return <canvas ref={ref} className={"constellation " + className} aria-hidden="true" />;
}
