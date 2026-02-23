import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  isHub: boolean;
  pulsePhase: number;
}

interface PulseRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  life: number;
}

interface DataPacket {
  fromIdx: number;
  toIdx: number;
  progress: number;
  speed: number;
}

const CONNECT_DIST = 130;

const MobileParticleField: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);
  const ringsRef = useRef<PulseRing[]>([]);
  const packetsRef = useRef<DataPacket[]>([]);
  const touchRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const dprRef = useRef(1);

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

      nodesRef.current = Array.from({ length: 35 }, (_, i) => {
        const isHub = i < 10;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: isHub ? 4 + Math.random() * 2.5 : 2.5 + Math.random() * 1.5,
          isHub,
          pulsePhase: Math.random() * Math.PI * 2,
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

    let nextRingTime = 0;
    let nextPacketTime = 0;

    const draw = (time: number) => {
      animationRef.current = requestAnimationFrame(draw);
      const t = time * 0.001;

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;
      const touch = touchRef.current;

      // Update positions
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
          if (dist < 150 && dist > 0) {
            const force = (150 - dist) / 150;
            n.vx += (dx / dist) * force * 2;
            n.vy += (dy / dist) * force * 2;
          }
        }
        n.vx *= 0.98;
        n.vy *= 0.98;
      }

      // Spawn pulse rings
      if (t > nextRingTime) {
        const hubs = nodes.filter(n => n.isHub);
        const hub = hubs[Math.floor(Math.random() * hubs.length)];
        ringsRef.current.push({ x: hub.x, y: hub.y, radius: hub.radius, maxRadius: 70 + Math.random() * 50, life: 1 });
        nextRingTime = t + 1.2 + Math.random() * 1.5;
      }

      // Spawn data packets
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
          packetsRef.current.push({ fromIdx: a, toIdx: b, progress: 0, speed: 0.6 + Math.random() * 0.5 });
        }
        nextPacketTime = t + 0.5 + Math.random() * 0.7;
      }

      // -- Draw connections (bold, dark) --
      ctx.lineCap = 'round';
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST);
            const bothHubs = a.isHub && b.isHub;
            const anyHub = a.isHub || b.isHub;

            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);

            if (bothHubs) {
              ctx.strokeStyle = `rgba(0, 140, 210, ${alpha * 0.55})`;
              ctx.lineWidth = 2;
            } else if (anyHub) {
              ctx.strokeStyle = `rgba(0, 155, 220, ${alpha * 0.4})`;
              ctx.lineWidth = 1.5;
            } else {
              ctx.strokeStyle = `rgba(0, 130, 190, ${alpha * 0.25})`;
              ctx.lineWidth = 1;
            }
            ctx.stroke();
          }
        }
      }

      // -- Draw pulse rings (cyan, visible on white) --
      const rings = ringsRef.current;
      for (let i = rings.length - 1; i >= 0; i--) {
        const r = rings[i];
        r.radius += 1.5;
        r.life *= 0.975;

        if (r.radius > r.maxRadius || r.life < 0.02) {
          rings.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 160, 230, ${r.life * 0.5})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // -- Draw data packets (bright, high-contrast) --
      const packets = packetsRef.current;
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.progress += p.speed * 0.02;

        if (p.progress >= 1) { packets.splice(i, 1); continue; }

        const from = nodes[p.fromIdx];
        const to = nodes[p.toIdx];
        if (!from || !to) { packets.splice(i, 1); continue; }

        const px = from.x + (to.x - from.x) * p.progress;
        const py = from.y + (to.y - from.y) * p.progress;

        // Bright glow
        const glow = ctx.createRadialGradient(px, py, 0, px, py, 10);
        glow.addColorStop(0, 'rgba(0, 174, 239, 0.7)');
        glow.addColorStop(0.5, 'rgba(0, 174, 239, 0.2)');
        glow.addColorStop(1, 'rgba(0, 174, 239, 0)');
        ctx.beginPath();
        ctx.arc(px, py, 10, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(px, py, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 120, 200, 0.9)';
        ctx.fill();
      }

      // -- Draw nodes --
      for (const n of nodes) {
        const pulse = Math.sin(t * 2 + n.pulsePhase) * 0.15 + 0.85;

        if (n.isHub) {
          // Hub: dark navy core with visible cyan glow ring
          const glow = ctx.createRadialGradient(n.x, n.y, n.radius, n.x, n.y, n.radius * 5);
          glow.addColorStop(0, `rgba(0, 155, 230, ${0.25 * pulse})`);
          glow.addColorStop(1, 'rgba(0, 155, 230, 0)');
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius * 5, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();

          // Dark solid core
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(10, 50, 90, ${0.85 * pulse})`;
          ctx.fill();

          // Inner bright spot
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 174, 239, ${0.7 * pulse})`;
          ctx.fill();
        } else {
          // Small nodes: medium opacity
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(20, 70, 120, ${0.55 * pulse})`;
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
