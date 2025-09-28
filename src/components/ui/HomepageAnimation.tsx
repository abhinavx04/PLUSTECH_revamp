import React, { useState, useEffect, useRef } from 'react';

const HomepageAnimation: React.FC = () => {
  // 1. Create a ref for the container
  const containerRef = useRef<HTMLDivElement>(null);

  // State to hold the grid dimensions
  const [grid, setGrid] = useState({ cols: 0, rows: 0 });
  // State to hold the animation time
  const [time, setTime] = useState(0);

  // --- CONFIGURATION ---
  const DOT_SIZE = 1.5;      // The size of each dot in pixels
  const GAP = 12;          // Use the denser gap from before
  const AMPLITUDE = 40;      // The height of the wave
  const FREQUENCY = 0.025;   // The density of the wave crests
  const ANIMATION_SPEED = 0.001; // How fast the wave moves

  // 2. Update the grid calculation effect
  useEffect(() => {
    const updateGrid = () => {
      // Check if the ref is attached to an element
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        
        setGrid({
          cols: Math.floor(containerWidth / (DOT_SIZE + GAP)),
          rows: Math.floor(containerHeight / (DOT_SIZE + GAP)),
        });
      }
    };

    updateGrid();
    window.addEventListener('resize', updateGrid); // Keep it responsive
    return () => window.removeEventListener('resize', updateGrid);
  }, []); // This effect still runs once on mount

  // Effect to run the animation loop
  useEffect(() => {
    let animationFrameId;
    const animate = (timestamp: number) => {
      setTime(timestamp * ANIMATION_SPEED);
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Function to render all the dots
  const renderDots = () => {
    const dots = [];
    for (let i = 0; i < grid.cols; i++) {
      for (let j = 0; j < grid.rows; j++) {
        // The core wave calculation creates a diagonal wave
        const yOffset = AMPLITUDE * Math.sin((j + i) * FREQUENCY + time);
        
        // A second, faster wave calculation modulates the opacity for a shimmering effect
        const opacityValue = 0.4 + (Math.sin((j * 0.1 + i * 0.05) + time * 2) + 1) / 4;

        dots.push(
          <div
            key={`${i}-${j}`}
            className="absolute rounded-full bg-cyan-300"
            style={{
              width: `${DOT_SIZE}px`,
              height: `${DOT_SIZE}px`,
              // Position the dot in the grid
              left: `${i * (DOT_SIZE + GAP)}px`,
              top: `${j * (DOT_SIZE + GAP)}px`,
              // Apply dynamic opacity and vertical translation
              opacity: opacityValue,
              transform: `translateY(${yOffset}px)`,
            }}
          />
        );
      }
    }
    return dots;
  };

  // 3. Attach the ref to the main div
  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
    >
      {renderDots()}
    </div>
  );
};

export default HomepageAnimation;
