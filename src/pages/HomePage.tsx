import React, { useEffect, useRef } from 'react';
import PillNav from '../components/PillNav';

const HomePage: React.FC = () => {
  const handRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hand = handRef.current;
    const container = containerRef.current;

    if (!hand || !container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left; // mouse X inside container
      const y = e.clientY - rect.top;  // mouse Y inside container

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate offset movement (limited range)
      const moveX = (x - centerX) / 15; // smaller divisor = more movement
      const moveY = (y - centerY) / 15;

      // Add slight rotation based on movement
      const rotateZ = moveX * 0.5; // subtle rotation
      const scale = 1 + Math.abs(moveX + moveY) * 0.001; // subtle scaling

      hand.style.transform = `translate(${moveX}px, ${moveY}px) rotateZ(${rotateZ}deg) scale(${scale})`;
    };

    const handleMouseLeave = () => {
      if (hand) {
        hand.style.transform = "translate(0, 0) rotateZ(0deg) scale(1)";
      }
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col text-black font-sans">
      {/* Top navbar/header with logo and company name */}
      <header className="w-full border-b" style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.65), rgba(0,0,0,0.25))',
        borderColor: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxShadow: '0 6px 18px rgba(0,0,0,0.16)'
      }}>
        <div className="w-full h-16 grid grid-cols-3 items-center px-0">
          {/* Left: Logo and name */}
          <div className="flex items-center space-x-2 justify-start" style={{ paddingLeft: '56.7px' }}>
            <img src="/newlogo.png" alt="PlusTech Logo" className="h-12 w-auto brightness-110 contrast-110" />
            <span className="font-bold text-lg tracking-wider" style={{
              fontFamily: 'Orbitron, Arial, sans-serif',
              fontWeight: 800,
              letterSpacing: '0.1em',
              color: '#7DD3FC'
            }}>
              PLUSTECH
            </span>
          </div>
          {/* Center: PillNav */}
          <div className="hidden md:flex items-center justify-center">
            <PillNav
              logo={'/newlogo.png'}
              logoAlt="Company Logo"
              items={[
                { label: 'Home', href: '/' },
                { label: 'About', href: '/about' },
                { label: 'Services', href: '/services' },
                { label: 'Contact', href: '/contact' }
              ]}
              activeHref="/"
              className="shadow-md ring-1 ring-white/10 rounded-full"
              placement="center"
              position="static"
              showLogo={false}
              ease="power2.easeOut"
              baseColor="#0b0f19"
              pillColor="#ffffff"
              hoveredPillTextColor="#ffffff"
              pillTextColor="#000000"
              pillGap={28}
              pillPaddingX={26}
            />
          </div>
          {/* Right: Invisible spacer to balance layout */}
          <div className="flex items-center justify-end opacity-0 pointer-events-none select-none">
            <div className="flex items-center space-x-2">
              <img src="/newlogo.png" alt="Spacer" className="h-12 w-auto" />
              <span className="font-bold text-lg">PLUSTECH</span>
            </div>
          </div>
        </div>
      </header>
      {/* Main content area */}
      <div className="flex-1 w-full flex justify-between items-center p-10">
        {/* Content on the left */}
        <div className="w-1/2 pr-10">
          <h1 className="text-4xl font-bold mb-6">Welcome to PlusTech</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Here is some content on the left side. The robotic hand on the right will 
            follow your mouse when you hover near it, making it feel alive and interactive.
          </p>
        </div>

        {/* Robotic hand container on the right */}
        <div 
          ref={containerRef}
          className="w-1/2 flex justify-center items-center relative"
        >
          <img 
            ref={handRef}
            src="/home/file.svg" 
            alt="Robotic Hand"
            className="w-64 transition-transform duration-200 ease-out"
            style={{ filter: 'brightness(1.1) contrast(1.1)' }}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
