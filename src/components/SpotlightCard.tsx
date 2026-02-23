import React, { useRef, useState } from 'react';

interface Position {
  x: number;
  y: number;
}

interface SpotlightCardProps extends React.PropsWithChildren {
  className?: string;
  spotlightColor?: `rgba(${number}, ${number}, ${number}, ${number})`;
  /** Light theme: white background, subtle gray border (for use on light pages) */
  variant?: 'dark' | 'light';
  /** Show brand blue accent bar on left edge (light variant only) */
  accentBar?: boolean;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({
  children,
  className = '',
  spotlightColor = 'rgba(255, 255, 255, 0.25)',
  variant = 'dark',
  accentBar = false
}) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState<number>(0);

  const handleMouseMove: React.MouseEventHandler<HTMLDivElement> = e => {
    if (!divRef.current || isFocused) return;

    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setIsFocused(true);
    setOpacity(1);
  };

  const handleBlur = () => {
    setIsFocused(false);
    setOpacity(0);
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  const baseClasses =
    variant === 'light'
      ? 'relative rounded-2xl border-2 border-[#cbd5e1] bg-[#ffffff] overflow-hidden p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)]'
      : 'relative rounded-3xl border border-neutral-800 bg-neutral-900 overflow-hidden p-8';

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`${baseClasses} ${className}`}
    >
      {variant === 'light' && accentBar && (
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#00aeef] rounded-l-2xl z-[5]" />
      )}
      <div
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 ease-out"
        style={{
          opacity,
          background: `radial-gradient(140px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 70%)`
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default SpotlightCard;
