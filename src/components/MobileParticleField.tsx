import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseOpacity: number;
  pulseOffset: number;
}

interface MobileParticleFieldProps {
  className?: string;
}

const PARTICLE_COUNT = 70;
const CONNECTION_DIST = 110;
const NODE_COLOR = [0, 174, 239] as const; // #00aeef
const ACCENT_COLOR = [0, 130, 200] as const;

const MobileParticleField: React.FC<MobileParticleFieldProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const nodesRef = useRef<Node[]>([]);
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
      nodesRef.current = Array.from({ length: PARTICLE_COUNT }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 2 + 1,
        baseOpacity: Math.random() * 0.4 + 0.4,
        pulseOffset: Math.random() * Math.PI * 2,
      }));
    };

    resize();
    initNodes();
    window.addEventListener('resize', resize);

    const handleTouchMove = (e: TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      touchRef.current = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
        active: true,
      };
    };
    const handleTouchEnd = () => { touchRef.current.active = false; };

    canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd);

    let lastTime = 0;
    const frameInterval = 1000 / 30;

    const draw = (time: number) => {
      if (time - lastTime < frameInterval) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }
      lastTime = time;
      timeRef.current = time * 0.001;

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const nodes = nodesRef.current;
      const touch = touchRef.current;
      const t = timeRef.current;

      // Update positions
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < -10) { n.x = w + 10; }
        if (n.x > w + 10) { n.x = -10; }
        if (n.y < -10) { n.y = h + 10; }
        if (n.y > h + 10) { n.y = -10; }

        if (touch.active) {
          const dx = n.x - touch.x;
          const dy = n.y - touch.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140 && dist > 0) {
            const force = (140 - dist) / 140;
            n.vx += (dx / dist) * force * 1.2;
            n.vy += (dy / dist) * force * 1.2;
          }
        }

        n.vx *= 0.985;
        n.vy *= 0.985;
      }

      // Draw connections
      ctx.lineCap = 'round';
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.35;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${NODE_COLOR[0]}, ${NODE_COLOR[1]}, ${NODE_COLOR[2]}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes with pulsing glow
      for (const n of nodes) {
        const pulse = Math.sin(t * 1.5 + n.pulseOffset) * 0.15 + 0.85;
        const opacity = n.baseOpacity * pulse;

        // Outer glow
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius * 4);
        grad.addColorStop(0, `rgba(${NODE_COLOR[0]}, ${NODE_COLOR[1]}, ${NODE_COLOR[2]}, ${opacity * 0.3})`);
        grad.addColorStop(1, `rgba(${NODE_COLOR[0]}, ${NODE_COLOR[1]}, ${NODE_COLOR[2]}, 0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius * 4, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Core dot
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${ACCENT_COLOR[0]}, ${ACCENT_COLOR[1]}, ${ACCENT_COLOR[2]}, ${opacity})`;
        ctx.fill();
      }

      // Draw a couple of larger "hub" nodes (first 5) with extra prominence
      for (let i = 0; i < Math.min(5, nodes.length); i++) {
        const n = nodes[i];
        const pulse = Math.sin(t * 0.8 + n.pulseOffset) * 0.2 + 0.8;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${NODE_COLOR[0]}, ${NODE_COLOR[1]}, ${NODE_COLOR[2]}, ${0.7 * pulse})`;
        ctx.fill();

        const ring = ctx.createRadialGradient(n.x, n.y, 2, n.x, n.y, 12);
        ring.addColorStop(0, `rgba(${NODE_COLOR[0]}, ${NODE_COLOR[1]}, ${NODE_COLOR[2]}, ${0.15 * pulse})`);
        ring.addColorStop(1, `rgba(${NODE_COLOR[0]}, ${NODE_COLOR[1]}, ${NODE_COLOR[2]}, 0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, 12, 0, Math.PI * 2);
        ctx.fillStyle = ring;
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
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
