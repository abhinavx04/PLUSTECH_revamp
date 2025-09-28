import React, { useState, useEffect } from 'react';

const HomepageAnimation: React.FC = () => {
  // State to hold the grid dimensions
  const [grid, setGrid] = useState({ cols: 0, rows: 0 });
  // State to hold the animation time
  const [time, setTime] = useState(0);

  // --- CONFIGURATION ---
  const DOT_SIZE = 1.5;      // The size of each dot in pixels
  const GAP = 18;          // The space between each dot
  const AMPLITUDE = 40;      // The height of the wave
  const FREQUENCY = 0.025;   // The density of the wave crests
  const ANIMATION_SPEED = 0.001; // How fast the wave moves

  // Effect to calculate grid size based on window dimensions
  useEffect(() => {
    const updateGrid = () => {
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      setGrid({
        cols: Math.floor(screenWidth / (DOT_SIZE + GAP)),
        rows: Math.floor(screenHeight / (DOT_SIZE + GAP)),
      });
    };

    updateGrid();
    window.addEventListener('resize', updateGrid);
    return () => window.removeEventListener('resize', updateGrid);
  }, []);

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

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {renderDots()}
    </div>
  );
};

export default HomepageAnimation;
