import React, { useRef, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from '../components/ui/resizable-navbar';
import Threads from '../components/Threads';
import CompanyAnimation from '../components/ui/CompanyAnimation';
import SimpleNewsSection from '../components/SimpleNewsSection';
import CapabilitiesSection from '../components/CapabilitiesSection';
import Footer from '../components/Footer';
// import FirebaseStatus from '../components/FirebaseStatus';


const HomePage: React.FC = () => {
  const handRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const robotRef = useRef<HTMLDivElement | null>(null);
  const cloudRef = useRef<HTMLButtonElement | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelOrigin, setPanelOrigin] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showWisp, setShowWisp] = useState(false);
  const [wispDirection, setWispDirection] = useState<'open' | 'close' | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Services", link: "/services" },
    { name: "Contact", link: "/contact" },
  ];

  const getWispPath = (origin: { x: number; y: number }) => {
    const startX = window.innerWidth / 2 + origin.x;
    const startY = window.innerHeight / 2 + origin.y;
    const endX = window.innerWidth / 2;
    const endY = window.innerHeight / 2;
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2 - 180;
    return `M ${startX},${startY} Q ${midX},${midY} ${endX},${endY}`;
  };

  const handleCloudClick = () => {
    const rect = cloudRef.current?.getBoundingClientRect();
    const isMobile = window.innerWidth < 768;
    
    if (rect) {
      // Adjust origin calculation for mobile devices
      const margin = isMobile ? 20 : 50;
      const startX = Math.max(-window.innerWidth / 2 + margin, Math.min(rect.left + rect.width / 2 - window.innerWidth / 2, window.innerWidth / 2 - margin));
      const startY = Math.max(-window.innerHeight / 2 + margin, Math.min(rect.top + rect.height / 2 - window.innerHeight / 2, window.innerHeight / 2 - margin));
      setPanelOrigin({ x: startX, y: startY });
    } else {
      setPanelOrigin({ x: 0, y: 0 });
    }
    setShowWisp(true);
    setWispDirection('open');
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setWispDirection('close');
    setShowWisp(true);
    setIsPanelOpen(false);
  };

  useEffect(() => {
    const robot = robotRef.current;
    const container = containerRef.current;
    if (!robot || !container) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    
    // Skip parallax animation for reduced motion
    if (prefersReducedMotion) return;

    let rafId: number | null = null;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    // Responsive sensitivity based on device type
    const sensitivity = isMobile ? 25 : 15;
    const rotationSensitivity = isMobile ? 0.3 : 0.5;
    const scaleSensitivity = isMobile ? 0.0005 : 0.001;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      target.x = x / sensitivity;
      target.y = y / sensitivity;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const rect = container.getBoundingClientRect();
        const x = touch.clientX - (rect.left + rect.width / 2);
        const y = touch.clientY - (rect.top + rect.height / 2);
        target.x = x / sensitivity;
        target.y = y / sensitivity;
      }
    };

    const onMouseOut = () => {
      target.x = 0;
      target.y = 0;
    };

    const onTouchEnd = () => {
      target.x = 0;
      target.y = 0;
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.1;
      current.y += (target.y - current.y) * 0.1;
      const rotateZ = current.x * rotationSensitivity;
      const scale = 1 + Math.abs(current.x + current.y) * scaleSensitivity;
      (robot as HTMLDivElement).style.transform = `translate(${current.x}px, ${current.y}px) rotateZ(${rotateZ}deg) scale(${scale})`;
      rafId = window.requestAnimationFrame(tick);
    };

    // Add both mouse and touch event listeners
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseout", onMouseOut);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);


  return (
    <div className="min-h-screen w-full flex flex-col text-black font-body overflow-x-hidden bg-gradient-to-b from-white via-blue-50 to-white">
      {/* Resizable Navbar */}
      <div className="relative w-full">
        <Navbar>
          {/* Desktop Navigation */}
          <NavBody>
            <NavbarLogo />
            <div className="flex-1 flex justify-center">
              <NavItems items={navItems} />
            </div>
            <div className="w-24"></div>
          </NavBody>

          {/* Mobile Navigation */}
          <MobileNav>
            <MobileNavHeader>
              <NavbarLogo />
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </MobileNavHeader>

            <MobileNavMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            >
              <div className="space-y-4">
                {navItems.map((item, idx) => (
                  <a
                    key={`mobile-link-${idx}`}
                    href={item.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-white hover:text-[#00aeef] transition-colors py-4 px-4 rounded-lg hover:bg-white/10 font-semibold text-lg border-b border-white/10 last:border-b-0"
                  >
                    {item.name}
                  </a>
                ))}
              </div>
            </MobileNavMenu>
          </MobileNav>
        </Navbar>
        </div>

      {/* Threads Hero */}
      <div className="w-full flex items-center justify-center pt-20">
        <div className="w-full h-[50vh] md:h-[60vh] relative">
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

      {/* CTAs */}
      <div className="w-full flex items-center justify-center mt-8 md:mt-12">
        <div className="flex items-center justify-center gap-6">
          <a href="#contact" className="px-8 md:px-10 py-4 rounded-full bg-[#00aeef] text-white font-semibold shadow-[0_8px_24px_rgba(0,174,239,0.3)] hover:bg-[#0099d4] transition-all duration-300 text-lg transform hover:scale-105">
            Get Started
          </a>
          <a href="#about" className="px-8 md:px-10 py-4 rounded-full bg-white text-[#00aeef] font-semibold hover:bg-gray-50 transition-all duration-300 text-lg shadow-[0_8px_24px_rgba(0,0,0,0.1)] border border-[#00aeef]/20 transform hover:scale-105">
            Learn More
          </a>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="w-full px-6 md:px-12 lg:px-16 py-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-black">
                Welcome to Plustech
              </h2>
              <p className="text-lg md:text-xl text-gray-700 font-body leading-relaxed">
                At Plustech, we design and build <strong>surface finishing plants</strong> for automotive and general
                industries. With expertise in engineering, automation, and commissioning, we deliver
                <strong> customized solutions</strong> that combine innovation, efficiency, and quality.
              </p>
            </div>
            <div ref={containerRef} className="flex justify-center items-start relative z-[1] pt-2">
              <div ref={robotRef} className="will-change-transform relative">
                <img ref={handRef} src="/home/file.svg" alt="Robotic Hand" className="w-64 md:w-80" style={{ filter: 'brightness(1.1) contrast(1.1)' }} />
                <div className="absolute -top-20 -right-28 md:-top-28 md:-right-40 z-[2] select-none">
                  <div className="absolute left-8 top-[72px] flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-black opacity-70"></span>
                    <span className="w-2 h-2 rounded-full bg-black opacity-70"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-black opacity-70"></span>
                  </div>
                  <button
                    ref={cloudRef}
                    onClick={handleCloudClick}
                    className="relative block animate-floaty focus:outline-none focus:ring-2 focus:ring-white/40"
                    aria-label="Click me"
                  >
                    <div className="relative w-36 h-16 md:w-48 md:h-20">
                      <span className="absolute left-2 top-6 w-8 h-8 rounded-full bg-black"></span>
                      <span className="absolute left-7 top-2 w-10 h-10 rounded-full bg-black"></span>
                      <span className="absolute left-16 top-0 w-12 h-12 rounded-full bg-black"></span>
                      <span className="absolute left-26 top-4 w-10 h-10 rounded-full bg-black"></span>
                      <span className="absolute left-10 top-7 w-16 h-8 rounded-full bg-black"></span>
                      <span className="absolute left-10 top-3 w-10 h-4 rounded-full bg-white/10"></span>
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

      {/* About Section */}
      <section id="about" className="w-full px-6 md:px-12 lg:px-16 py-12 bg-white">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="w-full">
              <video className="w-full rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.25)]" src="/home/aboutvideo.mp4" autoPlay muted loop playsInline />
            </div>
            <div className="space-y-5">
              <h3 className="text-3xl md:text-4xl font-heading font-bold text-black">ABOUT US</h3>
              <div className="text-lg md:text-xl text-gray-800 font-body leading-relaxed space-y-4">
                <p>
                  Plustech Systems and Solutions is a trusted partner in building <strong>integrated paintshops</strong> for automotive and general industry applications. With expertise spanning <strong>design, engineering, procurement, construction, and commissioning</strong>, we provide <strong>customized solutions</strong> tailored to each customer’s unique requirements.
                </p>
                <p>
                  Our reputation has been built over the years on delivering paintshops that embody <strong>consistency, reliability, and robust performance</strong>. Whether semi-automatic or fully automatic, every solution reflects our commitment to <strong>continuous improvement, innovation, and long-term value</strong> for our clients.
                </p>
                <p>
                  At Plustech, we don’t just build plants—we build partnerships that enable industries to achieve <strong>precision, efficiency, and excellence</strong> in finishing operations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Logos Animation */}
      <section className="w-full px-6 md:px-12 lg:px-16 py-8 md:py-12 bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="max-w-7xl mx-auto w-full">
          <CompanyAnimation />
        </div>
      </section>

      {/* News Section */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100">
        <SimpleNewsSection />
      </div>

      {/* Capabilities Section */}
      <div className="bg-white">
        <CapabilitiesSection />
          </div>

      <Footer />

      {/* Floating Panel */}
      <AnimatePresence>
        {(isPanelOpen || wispDirection === 'close') && (
          <div role="dialog" aria-modal="true" className="fixed inset-0 z-[2000] pointer-events-none">
            <button
              aria-label="Close overlay"
              onClick={closePanel}
              className="absolute inset-0 bg-transparent"
              style={{ pointerEvents: 'auto' }}
            />
            {showWisp && (
              <motion.svg
                key="wisp"
                className="fixed inset-0 w-full h-full z-[2100]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ pointerEvents: 'none' }}
              >
                <motion.path
                  d={getWispPath(panelOrigin)}
                  fill="none"
                  stroke="#00aeef"
                  strokeOpacity={0.95}
                  strokeWidth={8}
                  strokeLinecap="round"
                  initial={{ pathLength: wispDirection === 'close' ? 1 : 0 }}
                  animate={{ pathLength: wispDirection === 'close' ? 0 : 1 }}
                  transition={{ duration: 2.2, ease: 'easeOut' }}
                  onAnimationComplete={() => { setShowWisp(false); setWispDirection(null); }}
                />
              </motion.svg>
            )}
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
              <motion.div
                initial={{ x: panelOrigin.x, y: panelOrigin.y, scale: 0.4, opacity: 0 }}
                animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                exit={{ x: panelOrigin.x, y: panelOrigin.y, scale: 0.4, opacity: 0 }}
                transition={{ 
                  type: 'spring', 
                  stiffness: window.innerWidth < 768 ? 200 : 160, 
                  damping: window.innerWidth < 768 ? 20 : 18 
                }}
                onAnimationComplete={() => setShowWisp(false)}
                style={{ transformOrigin: 'center' }}
              >
                <div className="relative w-[95vw] sm:w-[92vw] max-w-6xl h-[80vh] sm:h-[70vh] md:h-[75vh] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] border border-black/10 overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between px-4 sm:px-5 md:px-6 py-3 md:py-4 border-b border-black/10 bg-black/5">
                    <h3 className="text-black font-heading text-base sm:text-lg md:text-xl font-semibold">Interaction Panel</h3>
                    <button
                      onClick={closePanel}
                      className="rounded-full px-3 py-1.5 text-sm font-semibold bg-black text-white hover:bg-gray-800 transition-colors touch-manipulation"
                      aria-label="Close"
                    >
                      Close
                    </button>
                  </div>
                  <div className="flex-1 overflow-auto p-4 sm:p-5 md:p-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="min-h-[150px] sm:min-h-[200px] rounded-xl bg-black/5 border border-black/10" />
                    <div className="min-h-[150px] sm:min-h-[200px] rounded-xl bg-black/5 border border-black/10" />
                    <div className="min-h-[150px] sm:min-h-[200px] rounded-xl bg-black/5 border border-black/10" />
                    <div className="min-h-[150px] sm:min-h-[200px] rounded-xl bg-black/5 border border-black/10" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
      {/* <FirebaseStatus /> */}
    </div>
  );
};

export default HomePage;
