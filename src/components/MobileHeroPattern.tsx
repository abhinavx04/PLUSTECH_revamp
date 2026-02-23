import { useEffect, useRef } from 'react';

// --- Geometry primitives ---

interface Line { x1: number; y1: number; x2: number; y2: number; w: number; order: number }
interface Arc { cx: number; cy: number; r: number; startAngle: number; endAngle: number; w: number; order: number }
interface Dot { x: number; y: number; r: number; order: number; pulse?: boolean }

interface Pattern { lines: Line[]; arcs: Arc[]; dots: Dot[] }

type PatternFn = (w: number, h: number, cx: number, cy: number, safeR: number) => Pattern;

// --- Utility ---

const TAU = Math.PI * 2;
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function hexCorner(cx: number, cy: number, r: number, i: number): [number, number] {
  const angle = (TAU / 6) * i - Math.PI / 6;
  return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
}

function isInSafeZone(x: number, y: number, cx: number, cy: number, safeW: number, safeH: number) {
  return Math.abs(x - cx) < safeW / 2 && Math.abs(y - cy) < safeH / 2;
}

function lineInSafe(x1: number, y1: number, x2: number, y2: number, cx: number, cy: number, sw: number, sh: number) {
  return isInSafeZone(x1, y1, cx, cy, sw, sh) && isInSafeZone(x2, y2, cx, cy, sw, sh);
}

// --- Pattern 1: Hexagonal Network ---

const patternHex: PatternFn = (w, h, cx, cy, safeR) => {
  const lines: Line[] = [];
  const dots: Dot[] = [];
  const arcs: Arc[] = [];
  const cellR = Math.min(w, h) * 0.1;
  const sw = safeR * 2.4;
  const sh = safeR * 1.8;

  const centers: [number, number][] = [];
  for (let row = -3; row <= 3; row++) {
    for (let col = -3; col <= 3; col++) {
      const x = cx + col * cellR * 1.75 + (row % 2 !== 0 ? cellR * 0.875 : 0);
      const y = cy + row * cellR * 1.52;
      if (x < -cellR || x > w + cellR || y < -cellR || y > h + cellR) continue;
      centers.push([x, y]);
    }
  }

  let order = 0;
  const totalEdges = centers.length * 6;

  for (const [hx, hy] of centers) {
    for (let i = 0; i < 6; i++) {
      const [ax, ay] = hexCorner(hx, hy, cellR * 0.85, i);
      const [bx, by] = hexCorner(hx, hy, cellR * 0.85, (i + 1) % 6);
      if (lineInSafe(ax, ay, bx, by, cx, cy, sw, sh)) continue;

      const distFromCenter = Math.sqrt((hx - cx) ** 2 + (hy - cy) ** 2);
      const maxDist = Math.sqrt(cx ** 2 + cy ** 2);
      const o = Math.min(1, distFromCenter / maxDist);

      lines.push({ x1: ax, y1: ay, x2: bx, y2: by, w: 1.2, order: o });
      order++;
    }

    if (!isInSafeZone(hx, hy, cx, cy, sw * 0.8, sh * 0.8)) {
      dots.push({ x: hx, y: hy, r: 2.5, order: order / totalEdges, pulse: Math.random() > 0.7 });
    }
  }

  return { lines, arcs, dots };
};

// --- Pattern 2: Circuit Board Traces ---

const patternCircuit: PatternFn = (w, h, cx, cy, safeR) => {
  const lines: Line[] = [];
  const dots: Dot[] = [];
  const arcs: Arc[] = [];
  const sw = safeR * 2.4;
  const sh = safeR * 1.8;
  const step = Math.min(w, h) * 0.08;

  const gridW = Math.ceil(w / step);
  const gridH = Math.ceil(h / step);

  const rng = () => Math.random();

  for (let gx = 0; gx <= gridW; gx++) {
    for (let gy = 0; gy <= gridH; gy++) {
      const x = gx * step;
      const y = gy * step;

      if (isInSafeZone(x, y, cx, cy, sw, sh)) continue;

      if (rng() > 0.6) {
        const dir = rng() > 0.5;
        const len = step * (1 + Math.floor(rng() * 3));
        const ex = dir ? x + len : x;
        const ey = dir ? y : y + len;

        if (ex <= w && ey <= h && !lineInSafe(x, y, ex, ey, cx, cy, sw, sh)) {
          const distNorm = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / Math.sqrt(cx ** 2 + cy ** 2);
          lines.push({ x1: x, y1: y, x2: ex, y2: ey, w: rng() > 0.7 ? 2 : 1, order: distNorm });

          if (rng() > 0.5) dots.push({ x, y, r: rng() > 0.6 ? 3.5 : 2, order: distNorm, pulse: rng() > 0.7 });
          if (rng() > 0.6) dots.push({ x: ex, y: ey, r: 2, order: distNorm + 0.05 });
        }
      }
    }
  }

  return { lines, arcs, dots };
};

// --- Pattern 3: Concentric Arcs & Radials ---

const patternRadial: PatternFn = (w, h, cx, cy, safeR) => {
  const lines: Line[] = [];
  const dots: Dot[] = [];
  const arcs: Arc[] = [];
  const maxR = Math.max(w, h) * 0.55;
  const rings = [0.2, 0.35, 0.5, 0.7, 0.9];
  const spokes = 12;

  for (const ringPct of rings) {
    const r = maxR * ringPct;
    if (r < safeR * 1.1) continue;

    const segments = 3 + Math.floor(Math.random() * 3);
    for (let s = 0; s < segments; s++) {
      const startAngle = (TAU / segments) * s + Math.random() * 0.3;
      const span = (TAU / segments) * (0.5 + Math.random() * 0.4);
      arcs.push({ cx, cy, r, startAngle, endAngle: startAngle + span, w: ringPct > 0.6 ? 1 : 1.5, order: ringPct });
    }
  }

  for (let i = 0; i < spokes; i++) {
    const angle = (TAU / spokes) * i + Math.random() * 0.1;
    const innerR = safeR * 1.1 + Math.random() * safeR * 0.3;
    const outerR = maxR * (0.5 + Math.random() * 0.45);
    const x1 = cx + Math.cos(angle) * innerR;
    const y1 = cy + Math.sin(angle) * innerR;
    const x2 = cx + Math.cos(angle) * outerR;
    const y2 = cy + Math.sin(angle) * outerR;

    lines.push({ x1, y1, x2, y2, w: 1, order: 0.3 + Math.random() * 0.3 });
    dots.push({ x: x2, y: y2, r: 3, order: 0.6, pulse: i % 3 === 0 });
  }

  for (let i = 0; i < 8; i++) {
    const angle = Math.random() * TAU;
    const r = safeR * 1.3 + Math.random() * (maxR * 0.5);
    dots.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r, r: 2, order: 0.8 });
  }

  return { lines, arcs, dots };
};

// --- Pattern 4: Triangulated Mesh ---

const patternMesh: PatternFn = (w, h, cx, cy, safeR) => {
  const lines: Line[] = [];
  const dots: Dot[] = [];
  const arcs: Arc[] = [];
  const sw = safeR * 2.2;
  const sh = safeR * 1.6;

  const pts: [number, number][] = [];
  for (let i = 0; i < 40; i++) {
    const x = Math.random() * w;
    const y = Math.random() * h;
    if (isInSafeZone(x, y, cx, cy, sw * 0.7, sh * 0.7)) continue;
    pts.push([x, y]);
  }

  for (let i = 0; i < pts.length; i++) {
    const dists: { idx: number; d: number }[] = [];
    for (let j = 0; j < pts.length; j++) {
      if (i === j) continue;
      const dx = pts[i][0] - pts[j][0];
      const dy = pts[i][1] - pts[j][1];
      dists.push({ idx: j, d: Math.sqrt(dx * dx + dy * dy) });
    }
    dists.sort((a, b) => a.d - b.d);

    const neighbors = Math.min(3, dists.length);
    for (let n = 0; n < neighbors; n++) {
      const j = dists[n].idx;
      if (j < i) continue;
      const [x1, y1] = pts[i];
      const [x2, y2] = pts[j];
      if (lineInSafe(x1, y1, x2, y2, cx, cy, sw, sh)) continue;

      const distNorm = Math.sqrt(((x1 + x2) / 2 - cx) ** 2 + ((y1 + y2) / 2 - cy) ** 2) / Math.sqrt(cx ** 2 + cy ** 2);
      lines.push({ x1, y1, x2, y2, w: dists[n].d < 100 ? 1.5 : 0.8, order: distNorm });
    }

    const [px, py] = pts[i];
    if (!isInSafeZone(px, py, cx, cy, sw * 0.85, sh * 0.85)) {
      dots.push({ x: px, y: py, r: 3, order: 0.3 + Math.random() * 0.4, pulse: Math.random() > 0.65 });
    }
  }

  return { lines, arcs, dots };
};

// --- Pattern 5: HUD / Tech Frame ---

const patternHUD: PatternFn = (w, h, cx, cy, safeR) => {
  const lines: Line[] = [];
  const dots: Dot[] = [];
  const arcs: Arc[] = [];
  const m = 20;
  const cornerLen = Math.min(w, h) * 0.18;

  const corners = [
    [m, m, 1, 1], [w - m, m, -1, 1], [m, h - m, 1, -1], [w - m, h - m, -1, -1]
  ] as const;

  corners.forEach(([x, y, dx, dy], ci) => {
    lines.push({ x1: x, y1: y, x2: x + cornerLen * dx, y2: y, w: 2, order: ci * 0.08 });
    lines.push({ x1: x, y1: y, x2: x, y2: y + cornerLen * dy, w: 2, order: ci * 0.08 + 0.03 });
    dots.push({ x, y, r: 3.5, order: ci * 0.08, pulse: true });
  });

  const midLines = [
    [cx - safeR * 1.6, m + 10, cx - safeR * 1.2, m + 10],
    [cx + safeR * 1.2, m + 10, cx + safeR * 1.6, m + 10],
    [cx - safeR * 1.6, h - m - 10, cx - safeR * 1.2, h - m - 10],
    [cx + safeR * 1.2, h - m - 10, cx + safeR * 1.6, h - m - 10],
    [m + 10, cy - safeR * 0.6, m + 10, cy - safeR * 0.3],
    [w - m - 10, cy - safeR * 0.6, w - m - 10, cy - safeR * 0.3],
    [m + 10, cy + safeR * 0.3, m + 10, cy + safeR * 0.6],
    [w - m - 10, cy + safeR * 0.3, w - m - 10, cy + safeR * 0.6],
  ];
  midLines.forEach(([x1, y1, x2, y2], i) => {
    lines.push({ x1, y1, x2, y2, w: 1, order: 0.3 + i * 0.04 });
  });

  for (let i = 0; i < 4; i++) {
    const angle = (TAU / 4) * i + Math.PI / 4;
    const r1 = safeR * 1.4;
    const r2 = safeR * 1.8 + Math.random() * safeR * 0.4;
    lines.push({
      x1: cx + Math.cos(angle) * r1, y1: cy + Math.sin(angle) * r1,
      x2: cx + Math.cos(angle) * r2, y2: cy + Math.sin(angle) * r2,
      w: 1, order: 0.5
    });
    dots.push({ x: cx + Math.cos(angle) * r2, y: cy + Math.sin(angle) * r2, r: 2.5, order: 0.55 });
  }

  arcs.push({ cx, cy, r: safeR * 1.35, startAngle: -0.4, endAngle: 0.4, w: 1.2, order: 0.6 });
  arcs.push({ cx, cy, r: safeR * 1.35, startAngle: Math.PI - 0.4, endAngle: Math.PI + 0.4, w: 1.2, order: 0.6 });

  return { lines, arcs, dots };
};

// --- All patterns ---
const PATTERNS: PatternFn[] = [patternHex, patternCircuit, patternRadial, patternMesh, patternHUD];

// ==================== Component ====================

const MobileHeroPattern: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const patternRef = useRef<Pattern | null>(null);
  const patternIdxRef = useRef(Math.floor(Math.random() * PATTERNS.length));
  const touchRef = useRef<{ x: number; y: number; active: boolean; time: number }>({ x: 0, y: 0, active: false, time: 0 });
  const dprRef = useRef(1);
  const startTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprRef.current = dpr;

    const generate = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const w = rect.width;
      const h = rect.height;
      const cx = w / 2;
      const cy = h * 0.4;
      const safeR = Math.min(w, h) * 0.28;
      patternRef.current = PATTERNS[patternIdxRef.current](w, h, cx, cy, safeR);
    };

    generate();
    window.addEventListener('resize', generate);

    const handleTouchStart = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      touchRef.current = { x: touch.clientX - rect.left, y: touch.clientY - rect.top, active: true, time: 0 };
    };
    const handleTouchEnd = () => { touchRef.current.active = false; };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd);

    startTimeRef.current = performance.now();

    const DRAW_DURATION = 2.5;

    const draw = (time: number) => {
      animationRef.current = requestAnimationFrame(draw);

      const elapsed = (time - startTimeRef.current) * 0.001;
      const drawProgress = Math.min(1, elapsed / DRAW_DURATION);
      const eased = 1 - Math.pow(1 - drawProgress, 3);

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const pattern = patternRef.current;
      if (!pattern) return;

      const t = elapsed;
      const cx = w / 2;
      const cy = h * 0.4;

      ctx.lineCap = 'round';

      // Draw lines with progressive reveal
      for (const line of pattern.lines) {
        const lineProgress = Math.max(0, Math.min(1, (eased - line.order * 0.6) / 0.4));
        if (lineProgress <= 0) continue;

        const ex = lerp(line.x1, line.x2, lineProgress);
        const ey = lerp(line.y1, line.y2, lineProgress);

        const dist = Math.sqrt(((line.x1 + line.x2) / 2 - cx) ** 2 + ((line.y1 + line.y2) / 2 - cy) ** 2);
        const maxDist = Math.sqrt(cx ** 2 + cy ** 2);
        const fadeNear = Math.min(1, dist / (maxDist * 0.25));
        const alpha = 0.55 * fadeNear * (drawProgress < 1 ? lineProgress : 1);

        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(ex, ey);
        ctx.strokeStyle = `rgba(10, 60, 110, ${alpha})`;
        ctx.lineWidth = line.w;
        ctx.stroke();
      }

      // Draw arcs
      for (const arc of pattern.arcs) {
        const arcProgress = Math.max(0, Math.min(1, (eased - arc.order * 0.6) / 0.4));
        if (arcProgress <= 0) continue;

        const span = arc.endAngle - arc.startAngle;
        const endAngle = arc.startAngle + span * arcProgress;

        ctx.beginPath();
        ctx.arc(arc.cx, arc.cy, arc.r, arc.startAngle, endAngle);
        ctx.strokeStyle = `rgba(0, 140, 210, ${0.45 * arcProgress})`;
        ctx.lineWidth = arc.w;
        ctx.stroke();
      }

      // Draw dots
      for (const dot of pattern.dots) {
        const dotProgress = Math.max(0, Math.min(1, (eased - dot.order * 0.6) / 0.3));
        if (dotProgress <= 0) continue;

        const dist = Math.sqrt((dot.x - cx) ** 2 + (dot.y - cy) ** 2);
        const maxDist = Math.sqrt(cx ** 2 + cy ** 2);
        const fadeNear = Math.min(1, dist / (maxDist * 0.25));

        const pulse = dot.pulse ? Math.sin(t * 2.5 + dot.x * 0.01) * 0.2 + 0.8 : 1;
        const r = dot.r * dotProgress * pulse;
        const alpha = 0.7 * fadeNear * dotProgress;

        // Glow
        if (dot.r > 2.5) {
          const glow = ctx.createRadialGradient(dot.x, dot.y, r, dot.x, dot.y, r * 4);
          glow.addColorStop(0, `rgba(0, 160, 230, ${alpha * 0.3})`);
          glow.addColorStop(1, 'rgba(0, 160, 230, 0)');
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, r * 4, 0, TAU);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        // Core
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, r, 0, TAU);
        ctx.fillStyle = `rgba(10, 55, 100, ${alpha})`;
        ctx.fill();

        // Bright center
        if (dot.r > 2.5) {
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, r * 0.35, 0, TAU);
          ctx.fillStyle = `rgba(0, 174, 239, ${alpha * 0.8})`;
          ctx.fill();
        }
      }

      // Post-draw: subtle ambient pulse wave from a random dot every ~3s
      if (drawProgress >= 1 && pattern.dots.length > 0) {
        const pulseIdx = Math.floor(t / 3) % pattern.dots.length;
        const pulseDot = pattern.dots[pulseIdx];
        const pulseT = (t % 3) / 3;
        if (pulseT < 0.8) {
          const pr = pulseT * 50;
          const pa = (1 - pulseT / 0.8) * 0.3;
          ctx.beginPath();
          ctx.arc(pulseDot.x, pulseDot.y, pr, 0, TAU);
          ctx.strokeStyle = `rgba(0, 155, 220, ${pa})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      }
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', generate);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ touchAction: 'pan-y' }}
    />
  );
};

export default MobileHeroPattern;
