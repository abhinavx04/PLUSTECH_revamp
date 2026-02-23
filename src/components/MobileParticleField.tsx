import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  glowRadius: number;
  brightness: number;
  pulsePhase: number;
  isHub: boolean;
}

interface PulseRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
}

interface DataPacket {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
}

const MobileParticleField: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);
  const ringsRef = useRef<PulseRing[]>([]);
  const packetsRef = useRef<DataPacket[]>([]);
  const touchRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const dprRef = useRef(1);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprRef.current = dpr;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
    };

    const initNodes = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const count = 30;

      nodesRef.current = Array.from({ length: count }, (_, i) => {
        const isHub = i < 8;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: isHub ? 3.5 + Math.random() * 2 : 2 + Math.random() * 1.5,
          glowRadius: isHub ? 25 + Math.random() * 15 : 12 + Math.random() * 8,
          brightness: isHub ? 0.9 : 0.5 + Math.random() * 0.3,
          pulsePhase: Math.random() * Math.PI * 2,
          isHub,
        };
      });
    };

    resize();
    initNodes();
    window.addEventListener('resize', resize);

    const handleTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      touchRef.current = { x: touch.clientX - rect.left, y: touch.clientY - rect.top, active: true };
    };
    const handleTouchEnd = () => { touchRef.current.active = false; };

    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd);

    const CONNECT_DIST = 140;
    let nextRingTime = 0;
    let nextPacketTime = 0;

    const draw = (time: number) => {
      animationRef.current = requestAnimationFrame(draw);
      const t = time * 0.001;
      timeRef.current = t;

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;
      const touch = touchRef.current;

      // -- Update node positions --
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = w + 20;
        if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        if (n.y > h + 20) n.y = -20;

        if (touch.active) {
          const dx = n.x - touch.x;
          const dy = n.y - touch.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160 && dist > 0) {
            const force = (160 - dist) / 160;
            n.vx += (dx / dist) * force * 2;
            n.vy += (dy / dist) * force * 2;
          }
        }
        n.vx *= 0.98;
        n.vy *= 0.98;
      }

      // -- Spawn pulse rings from hubs --
      if (t > nextRingTime) {
        const hubs = nodes.filter(n => n.isHub);
        const hub = hubs[Math.floor(Math.random() * hubs.length)];
        ringsRef.current.push({ x: hub.x, y: hub.y, radius: hub.radius, maxRadius: 60 + Math.random() * 40, opacity: 0.5 });
        nextRingTime = t + 1.5 + Math.random() * 2;
      }

      // -- Spawn data packets along connections --
      if (t > nextPacketTime) {
        const pairs: [number, number][] = [];
        for (let i = 0; i < nodes.length; i++) {
          for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            if (Math.sqrt(dx * dx + dy * dy) < CONNECT_DIST) pairs.push([i, j]);
          }
        }
        if (pairs.length > 0) {
          const [a, b] = pairs[Math.floor(Math.random() * pairs.length)];
          packetsRef.current.push({ fromIdx: a, toIdx: b, progress: 0, speed: 0.8 + Math.random() * 0.6 });
        }
        nextPacketTime = t + 0.6 + Math.random() * 0.8;
      }

      // -- Draw connections --
      ctx.lineCap = 'round';
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.45;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0, 174, 239, ${alpha})`;
            ctx.lineWidth = (a.isHub || b.isHub) ? 1.5 : 0.8;
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // -- Draw pulse rings --
      const rings = ringsRef.current;
      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i];
        r.radius += 1.2;
        r.opacity *= 0.97;

        if (r.radius > r.maxRadius || r.opacity < 0.02) {
          rings.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 200, 255, ${r.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // -- Draw data packets --
      const packets = packetsRef.current;
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.progress += p.speed * 0.02;

        if (p.progress >= 1) {
          packets.splice(i, 1);
          continue;
        }

        const from = nodes[p.fromIdx];
        const to = nodes[p.toIdx];
        if (!from || !to) { packets.splice(i, 1); continue; }

        const px = from.x + (to.x - from.x) * p.progress;
        const py = from.y + (to.y - from.y) * p.progress;

        const glow = ctx.createRadialGradient(px, py, 0, px, py, 8);
        glow.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        glow.addColorStop(0.4, 'rgba(0, 220, 255, 0.5)');
        glow.addColorStop(1, 'rgba(0, 174, 239, 0)');
        ctx.beginPath();
        ctx.arc(px, py, 8, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
        ctx.fill();
      }

      // -- Draw nodes --
      for (const n of nodes) {
        const pulse = Math.sin(t * 2 + n.pulsePhase) * 0.2 + 0.8;
        const b = n.brightness * pulse;

        // Glow halo
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.glowRadius);
        glow.addColorStop(0, `rgba(0, 200, 255, ${b * 0.35})`);
        glow.addColorStop(0.5, `rgba(0, 174, 239, ${b * 0.1})`);
        glow.addColorStop(1, 'rgba(0, 174, 239, 0)');
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.glowRadius, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.isHub
          ? `rgba(150, 230, 255, ${b})`
          : `rgba(0, 200, 240, ${b * 0.8})`;
        ctx.fill();

        // Bright center point on hubs
        if (n.isHub) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${b})`;
          ctx.fill();
        }
      }
    };

    animationRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('touchmove', handleTouchMove);
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

export default MobileParticleField;
