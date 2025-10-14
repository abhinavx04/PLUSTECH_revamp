import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface CountUpProps {
  to: number;
  durationMs?: number;
  delayMs?: number;
  className?: string;
  startOnVisible?: boolean;
}

const CountUp: React.FC<CountUpProps> = ({ to, durationMs = 1400, delayMs = 0, className, startOnVisible = true }) => {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(spanRef, { margin: '-20% 0px -20% 0px' });

  useEffect(() => {
    let timeoutId: number | null = null;

    const step = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(Math.round(eased * to));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    const start = () => {
      // reset to restart from 0
      startRef.current = null;
      setValue(0);
      rafRef.current = requestAnimationFrame(step);
    };

    const maybeStart = () => {
      if (!startOnVisible || isInView) {
        if (delayMs > 0) {
          timeoutId = window.setTimeout(start, delayMs);
        } else {
          start();
        }
      }
    };

    maybeStart();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [to, durationMs, delayMs, isInView, startOnVisible]);

  return <span ref={spanRef} className={className}>{value}</span>;
};

export default CountUp;


