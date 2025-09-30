import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import PillNav from '../components/PillNav';
import Threads from '../components/Threads';
// ScrollStack removed; capabilities now use static flex layouts
import CompanyAnimation from '../components/ui/CompanyAnimation';

const HomePage: React.FC = () => {
  const handRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const robotRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLButtonElement>(null);
  const roboticScrollerRef = useRef<HTMLDivElement>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [panelOrigin, setPanelOrigin] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showWisp, setShowWisp] = useState(false);
  const [wispDirection, setWispDirection] = useState<'open' | 'close' | null>(null);

  const getWispPath = (origin: { x: number; y: number }) => {
    const startX = window.innerWidth / 2 + origin.x;
    const startY = window.innerHeight / 2 + origin.y;
    const endX = window.innerWidth / 2;
    const endY = window.innerHeight / 2;
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2 - 180; // stronger arc upwards
    // Quadratic Bezier: single elegant curve from cloud to center
    return `M ${startX},${startY} Q ${midX},${midY} ${endX},${endY}`;
  };
  const handleCloudClick = () => {
    const rect = cloudRef.current?.getBoundingClientRect();
    if (rect) {
      // Clamp the start so the panel always flies in towards center and stays visible
      const startX = Math.max(-window.innerWidth / 2 + 50, Math.min(rect.left + rect.width / 2 - window.innerWidth / 2, window.innerWidth / 2 - 50));
      const startY = Math.max(-window.innerHeight / 2 + 50, Math.min(rect.top + rect.height / 2 - window.innerHeight / 2, window.innerHeight / 2 - 50));
      setPanelOrigin({ x: startX, y: startY });
    } else {
      setPanelOrigin({ x: 0, y: 0 });
    }
    setShowWisp(true);
    setWispDirection('open');
    setIsPanelOpen(true);
  };
  const closePanel = () => {
    // trigger reverse wisp then close
    setWispDirection('close');
    setShowWisp(true);
    setIsPanelOpen(false);
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
          {/* Center: PillNav (render on mobile too so hamburger shows) */}
          <div className="flex items-center justify-center">
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
                At Plustech, we design and build <strong>surface finishing plants</strong> for automotive and general
                industries. With expertise in engineering, automation, and commissioning, we deliver
                <strong> customized solutions</strong> that combine innovation, efficiency, and quality.
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
                    ref={cloudRef}
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

      {/* About Us - video left, text right */}
      <section id="about" className="w-full px-6 md:px-12 lg:px-16 py-12">
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

      {/* Company logos animation */}
      <section className="w-full px-6 md:px-12 lg:px-16 py-8 md:py-12">
        <div className="max-w-7xl mx-auto w-full">
          <CompanyAnimation />
        </div>
      </section>

      {/* Capabilities - static flex layout (no ScrollStack) */}
      <section id="highlights" className="w-full px-0 py-0">
        <div className="w-full">
          <div className="pt-2 pb-1 md:pt-3 md:pb-2 text-center">
            <h3 className="text-3xl md:text-4xl font-heading font-bold text-black">OUR CAPABILITIES</h3>
            <p className="mt-3 text-gray-600 font-body text-base md:text-lg">A quick story of how we deliver value — one card at a time.</p>
          </div>

          {/* Card 1: Material Handling */}
          <div className="w-full m-0 flex flex-col items-start justify-start px-4 md:px-8 py-6 md:py-10">
            <h4 className="mt-1 md:mt-2 text-3xl md:text-5xl font-heading font-semibold text-black antialiased">Automated and Customised Material Handling</h4>
            <p className="text-gray-700 font-body mt-4 text-lg md:text-xl antialiased max-w-5xl">
              Plustech deploys fully or partially automated Handling solutions across various sections and operations of Paint shops to boost productivity, efficiency and optimise the plant footprint.
            </p>
            <div className="mt-6 w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-center">
              <img src="/automated-customised-materialhandling/1.png" alt="Material handling 1" className="w-full h-auto object-contain max-h-[56vh] md:max-h-[60vh] rounded-2xl shadow-xl" />
              <img src="/automated-customised-materialhandling/2.png" alt="Material handling 2" className="w-full h-auto object-contain max-h-[56vh] md:max-h-[60vh] rounded-2xl shadow-xl" />
              <img src="/automated-customised-materialhandling/3.png" alt="Material handling 3" className="w-full h-auto object-contain max-h-[56vh] md:max-h-[60vh] rounded-2xl shadow-xl" />
            </div>
          </div>

          {/* Additional capability cards - flexboxes without animation */}
          <div className="w-full flex flex-col gap-6 md:gap-8 px-4 md:px-8 pb-10">
            <div className="flex items-center justify-center w-full bg-[#f7f7f9]/90 m-0 rounded-2xl border border-black/10">
              <div className="w-full max-w-6xl px-4 md:px-8 py-6 md:py-8">
                <h4 className="text-2xl md:text-3xl font-heading font-semibold text-black">Robotic applications</h4>
                <p className="text-gray-700 font-body mt-3 text-base md:text-lg">
                  We deliver state-of-the-art, high-precision robotic painting systems designed for blue-chip customers across a wide range of industries. Our solutions are trusted for major applications such as:
                </p>
                <ul className="list-disc pl-5 mt-3 text-gray-700 font-body space-y-1 text-base md:text-lg">
                  <li>Commercial vehicle cabins — interior and exterior painting, sealer, and underbody coating</li>
                  <li>Two-wheeler fuel tanks</li>
                  <li>Plastic components</li>
                  <li>General industrial parts</li>
                </ul>
                <p className="text-gray-700 font-body mt-4 text-base md:text-lg">
                  Each robotic system is expertly engineered to provide exceptional advantages: consistently superior finish quality, high-volume production capacity, and significantly reduced paint consumption. The result is a highly efficient, sustainable, and reliable painting process that meets the most demanding standards.
                </p>

                <div className="mt-6 relative">
                  <div
                    ref={roboticScrollerRef}
                    className="flex overflow-x-auto gap-4 md:gap-6 snap-x snap-mandatory px-1 md:px-2 hide-scrollbar"
                    style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                  >
                    <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}`}</style>
                    <div className="snap-center flex-shrink-0 w-[88vw] sm:w-[70vw] md:w-[55vw] lg:w-[40vw]">
                      <img src="/robotic/indoor-painting_and_door_opening.png" alt="Commercial vehicle cabin painting" className="w-full h-auto object-contain max-h-[56vh] md:max-h-[60vh] rounded-2xl shadow-xl" loading="lazy" />
                    </div>
                    <div className="snap-center flex-shrink-0 w-[88vw] sm:w-[70vw] md:w-[55vw] lg:w-[40vw]">
                      <img src="/robotic/2-wheeler-fueltanks_plaSTIC.png" alt="Two-wheeler fuel tanks" className="w-full h-auto object-contain max-h-[56vh] md:max-h-[60vh] rounded-2xl shadow-xl" loading="lazy" />
                    </div>
                    <div className="snap-center flex-shrink-0 w-[88vw] sm:w-[70vw] md:w-[55vw] lg:w-[40vw]">
                      <img src="/robotic/scooter-metal_plastic-part.png" alt="Plastic components" className="w-full h-auto object-contain max-h-[56vh] md:max-h-[60vh] rounded-2xl shadow-xl" loading="lazy" />
                    </div>
                    <div className="snap-center flex-shrink-0 w-[88vw] sm:w-[70vw] md:w-[55vw] lg:w-[40vw]">
                      <img src="/robotic/sealer_application.png" alt="Sealer application" className="w-full h-auto object-contain max-h-[56vh] md:max-h-[60vh] rounded-2xl shadow-xl" loading="lazy" />
                    </div>
                    <div className="snap-center flex-shrink-0 w-[88vw] sm:w-[70vw] md:w-[55vw] lg:w-[40vw]">
                      <img src="/robotic/underbody_application.png" alt="Underbody coating" className="w-full h-auto object-contain max-h-[56vh] md:max-h-[60vh] rounded-2xl shadow-xl" loading="lazy" />
                    </div>
                  </div>
                  <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-1 md:px-3">
                    <button
                      type="button"
                      aria-label="Scroll left"
                      onClick={() => {
                        const el = roboticScrollerRef.current;
                        if (el) el.scrollBy({ left: -el.clientWidth * 0.8, behavior: 'smooth' });
                      }}
                      className="pointer-events-auto hidden sm:inline-flex h-10 w-10 rounded-full bg-white/90 border border-black/10 shadow-md text-black items-center justify-center"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      aria-label="Scroll right"
                      onClick={() => {
                        const el = roboticScrollerRef.current;
                        if (el) el.scrollBy({ left: el.clientWidth * 0.8, behavior: 'smooth' });
                      }}
                      className="pointer-events-auto hidden sm:inline-flex h-10 w-10 rounded-full bg-white/90 border border-black/10 shadow-md text-black items-center justify-center"
                    >
                      ›
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center w-full min-h-[220px] bg-white m-0 rounded-2xl">
              <div className="max-w-3xl px-4">
                <h4 className="text-2xl md:text-3xl font-heading font-semibold text-black">Quality & Testing</h4>
                <p className="text-gray-700 font-body mt-2 text-base md:text-lg">Bath control, pretreatment checks, and end‑of‑line testing with data capture.</p>
              </div>
            </div>

            <div className="flex items-center justify-center w-full min-h-[220px] bg-[#f7f7f9]/90 m-0 rounded-2xl">
              <div className="max-w-3xl px-4">
                <h4 className="text-2xl md:text-3xl font-heading font-semibold text-black">Commissioning & Support</h4>
                <p className="text-gray-700 font-body mt-2 text-base md:text-lg">Site execution, ramp‑up assistance, and ongoing optimisation for throughput.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    {/* Floating large flexbox panel - genie from cloud */}
    
      
    <AnimatePresence>
      {(isPanelOpen || wispDirection === 'close') && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-[2000] pointer-events-none">
          {/* transparent backdrop for outside click, no blur/dim */}
          <button
            aria-label="Close overlay"
            onClick={closePanel}
            className="absolute inset-0 bg-transparent"
            style={{ pointerEvents: 'auto' }}
          />
          {/* Wisp trail from cloud to center */}
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
              transition={{ type: 'spring', stiffness: 160, damping: 18 }}
              onAnimationComplete={() => setShowWisp(false)}
              style={{ transformOrigin: 'center' }}
            >
              <div className="relative w-[92vw] max-w-6xl h-[70vh] md:h-[75vh] bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.35)] border border-black/10 overflow-hidden flex flex-col">
                <div className="flex items-center justify-between px-5 md:px-6 py-3 md:py-4 border-b border-black/10 bg-black/5">
                  <h3 className="text-black font-heading text-lg md:text-xl font-semibold">Interaction Panel</h3>
                  <button
                    onClick={closePanel}
                    className="rounded-full px-3 py-1.5 text-sm font-semibold bg-black text-white hover:bg-gray-800 transition-colors"
                    aria-label="Close"
                  >
                    Close
                  </button>
                </div>
                <div className="flex-1 overflow-auto p-5 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="min-h-[200px] rounded-xl bg-black/5 border border-black/10" />
                  <div className="min-h-[200px] rounded-xl bg-black/5 border border-black/10" />
                  <div className="min-h-[200px] rounded-xl bg-black/5 border border-black/10" />
                  <div className="min-h-[200px] rounded-xl bg-black/5 border border-black/10" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
    </div>
  );
};

export default HomePage;
