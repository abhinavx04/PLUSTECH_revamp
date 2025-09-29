import React, { useEffect, useRef } from 'react';
import PillNav from '../components/PillNav';
import Threads from '../components/Threads';

const HomePage: React.FC = () => {
  const handRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<HTMLDivElement>(null);
  const handleCloudClick = () => {
    // Placeholder action; replace with navigation or callback
    console.log('Cloud clicked');
  };

  useEffect(() => {
    const robot = robotRef.current;
    const container = containerRef.current;
    if (!robot || !container) return;

    let rafId: number | null = null;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      target.x = x / 15;
      target.y = y / 15;
    };

    const onMouseOut = () => {
      target.x = 0;
      target.y = 0;
    };

    const tick = () => {
      // smooth follow
      current.x += (target.x - current.x) * 0.1;
      current.y += (target.y - current.y) * 0.1;
      const rotateZ = current.x * 0.5;
      const scale = 1 + Math.abs(current.x + current.y) * 0.001;
      robot.style.transform = `translate(${current.x}px, ${current.y}px) rotateZ(${rotateZ}deg) scale(${scale})`;
      rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseout", onMouseOut);
    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseout", onMouseOut);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col text-black font-body">
      {/* Top navbar/header with logo and company name */}
      <header className="w-full border-b" style={{
        // Stronger glass look: brighter top highlight, subtle transparency, deeper shadows
        background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 35%, rgba(255,255,255,0.02) 100%), rgba(0,0,0,0.82)',
        borderColor: 'rgba(255,255,255,0.16)',
        backdropFilter: 'saturate(140%) blur(20px)',
        WebkitBackdropFilter: 'saturate(140%) blur(20px)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(255,255,255,0.06)'
      }}>
        <div className="w-full h-16 grid grid-cols-3 items-center px-0">
          {/* Left: Logo and name */}
          <div className="flex items-center space-x-2 justify-start" style={{ paddingLeft: '56.7px' }}>
            <img src="/newlogo.png" alt="PlusTech Logo" className="h-12 w-auto brightness-110 contrast-110" />
            <span className="font-bold text-lg tracking-wider" style={{
              fontFamily: 'Orbitron, Arial, sans-serif',
              fontWeight: 800,
              letterSpacing: '0.1em',
              color: '#00aeef'
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
              baseColor="#000000"
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
      {/* Threads hero - full width and centered with overlay content */}
      <div className="w-screen flex items-center justify-center">
        <div className="w-screen h-[50vh] md:h-[60vh] relative">
          <div className="absolute inset-0 z-[2] flex items-center justify-center pointer-events-none">
            <div className="text-center px-4 md:px-6 lg:px-8 max-w-5xl">
              <h1 className="text-black/60 text-3xl md:text-6xl font-extrabold tracking-tight leading-tight font-heading" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                Building Intelligent Solutions for Modern Manufacturing
              </h1>
              <p className="mt-4 text-black/50 text-base md:text-lg max-w-3xl mx-auto font-body" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
                At PlusTech, we design, engineer, and deliver precision systems that connect
                people, processes, and products—so your operations run smarter, faster, and safer.
              </p>
            </div>
          </div>
          <Threads color={[0, 0.8, 1]} amplitude={2.4} enableMouseInteraction={true} />
        </div>
      </div>
      {/* CTAs below the wave - better positioned and visible */}
      <div className="w-full flex items-center justify-center mt-8 md:mt-12">
        <div className="flex items-center justify-center gap-6">
          <a href="#contact" className="px-8 md:px-10 py-4 rounded-full bg-white text-black font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:bg-white/90 transition-colors text-lg">
            Get Started
          </a>
          <a href="#about" className="px-8 md:px-10 py-4 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition-colors text-lg shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
            Learn More
          </a>
        </div>
      </div>
      
      {/* Main content area - reorganized layout */}
      <div className="w-full px-6 md:px-12 lg:px-16 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Content on the left */}
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-black">
                Welcome to Plustech
              </h2>
              <p className="text-lg md:text-xl text-gray-700 font-body leading-relaxed">
                We specialize in cutting-edge manufacturing solutions that integrate 
                advanced robotics, AI-driven automation, and precision engineering 
                to transform your production capabilities.
              </p>
              
              
            </div>

            {/* Robotic hand container on the right */}
            <div 
              ref={containerRef}
              className="flex justify-center items-start relative z-[1] pt-2"
            >
              <div ref={robotRef} className="will-change-transform relative">
                <img 
                  ref={handRef}
                  src="/home/file.svg" 
                  alt="Robotic Hand"
                  className="w-64 md:w-80"
                  style={{ filter: 'brightness(1.1) contrast(1.1)' }}
                />
                {/* Dreamy cloud bubble at a distance, clickable */}
                <div className="absolute -top-20 -right-28 md:-top-28 md:-right-40 z-[2] select-none">
                  {/* connector dots */}
                  <div className="absolute left-8 top-[72px] flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-black opacity-70"></span>
                    <span className="w-2 h-2 rounded-full bg-black opacity-70"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-black opacity-70"></span>
                  </div>
                  {/* cloud button */}
                  <button
                    onClick={handleCloudClick}
                    className="relative block animate-floaty focus:outline-none focus:ring-2 focus:ring-white/40"
                    aria-label="Click me"
                  >
                    <div className="relative w-36 h-16 md:w-48 md:h-20">
                      {/* cloud puffs */}
                      <span className="absolute left-2 top-6 w-8 h-8 rounded-full bg-black"></span>
                      <span className="absolute left-7 top-2 w-10 h-10 rounded-full bg-black"></span>
                      <span className="absolute left-16 top-0 w-12 h-12 rounded-full bg-black"></span>
                      <span className="absolute left-26 top-4 w-10 h-10 rounded-full bg-black"></span>
                      <span className="absolute left-10 top-7 w-16 h-8 rounded-full bg-black"></span>
                      {/* subtle gloss */}
                      <span className="absolute left-10 top-3 w-10 h-4 rounded-full bg-white/10"></span>
                      {/* text */}
                      <span className="absolute inset-0 flex items-center justify-center text-white text-xs md:text-sm font-semibold tracking-wide">
                        click me
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
