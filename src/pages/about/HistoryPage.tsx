import React from 'react';
import HistoryMilestonesSection from '../../components/about/HistoryMilestonesSection';
import FloatingLines from '../../components/FloatingLines';

const HistoryPage: React.FC = () => {
  return (
    <>
      {/* FloatingLines Background - covers entire page from top */}
      <div 
        className="fixed inset-0 z-0"
        style={{ 
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'auto'
        }}
      >
        <div style={{ pointerEvents: 'auto', width: '100%', height: '100%' }}>
          <FloatingLines
            linesGradient={[
              '#E63946',   // Logo red
              '#FF6B6B',   // Lighter red
              '#9B59B6',   // Purple transition
              '#00aeef',   // Brand blue
              '#0099d4'    // Darker blue
            ]}
            enabledWaves={['top', 'middle', 'bottom']}
            lineCount={5}
            lineDistance={5}
            animationSpeed={0.8}
            interactive={true}
            bendRadius={5.0}
            bendStrength={-0.5}
            parallax={true}
            parallaxStrength={0.15}
            mixBlendMode="normal"
          />
        </div>
      </div>
      
      {/* Content Layer - above background */}
      <div className="relative z-10 w-full min-h-screen pb-20" style={{ pointerEvents: 'none' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-10" style={{ pointerEvents: 'auto' }}>
          <HistoryMilestonesSection />
        </div>
      </div>
    </>
  );
};

export default HistoryPage;


