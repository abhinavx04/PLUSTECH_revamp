import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PillNav from '../components/PillNav';
import Threads from '../components/Threads';
import CompanyAnimation from '../components/ui/CompanyAnimation';
import Footer from '../components/Footer';

// Modified GsapCoverSection to handle three sections
type ThreeSectionProps = {
  automated: React.ReactNode;
  robotic: React.ReactNode;
  digitization: React.ReactNode;
};

const GsapCoverSection: React.FC<ThreeSectionProps> = ({ automated, robotic, digitization }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const automatedRef = useRef<HTMLDivElement | null>(null);
  const roboticRef = useRef<HTMLDivElement | null>(null);
  const digitizationRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(automatedRef.current, { yPercent: 0, opacity: 1, scale: 1, zIndex: 3, pointerEvents: 'auto' });
      gsap.set(roboticRef.current, { yPercent: 100, opacity: 0, scale: 0.95, zIndex: 2, pointerEvents: 'none' });
      gsap.set(digitizationRef.current, { yPercent: 100, opacity: 0, scale: 0.95, zIndex: 1, pointerEvents: 'none' });

      // Responsive scroll trigger settings
      const scrollSettings = {
        trigger: containerRef.current,
        start: 'top top',
        end: isMobile ? '+=200%' : isTablet ? '+=250%' : '+=300%',
        scrub: prefersReducedMotion ? false : (isMobile ? 1.5 : isTablet ? 2 : 2.5),
        pin: true,
        anticipatePin: 1,
        markers: false,
        // Add touch support for mobile
        onUpdate: (self: { isActive: boolean; progress: number }) => {
          if (isMobile && self.isActive) {
            // Reduce animation intensity on mobile
            const progress = self.progress;
            if (progress < 0.5) {
              // First transition
              const localProgress = progress * 2;
              gsap.set(automatedRef.current, { 
                yPercent: -30 * localProgress, 
                scale: 1 - (0.05 * localProgress), 
                opacity: 1 - localProgress 
              });
              gsap.set(roboticRef.current, { 
                yPercent: 100 - (100 * localProgress), 
                scale: 0.95 + (0.05 * localProgress), 
                opacity: localProgress 
              });
            } else {
              // Second transition
              const localProgress = (progress - 0.5) * 2;
              gsap.set(roboticRef.current, { 
                yPercent: -30 * localProgress, 
                scale: 1 - (0.05 * localProgress), 
                opacity: 1 - localProgress 
              });
              gsap.set(digitizationRef.current, { 
                yPercent: 100 - (100 * localProgress), 
                scale: 0.95 + (0.05 * localProgress), 
                opacity: localProgress 
              });
            }
          }
        }
      };

      // Skip complex animations for reduced motion
      if (prefersReducedMotion) {
        // Simple fade transitions for reduced motion
        const tl = gsap.timeline({
          scrollTrigger: scrollSettings,
        });

        tl
          .to(automatedRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: 'none',
          }, 0)
          .to(roboticRef.current, {
            opacity: 1,
            duration: 0.5,
            ease: 'none',
          }, 0)
          .set(roboticRef.current, { pointerEvents: 'auto' }, 0.1)
          .set(automatedRef.current, { pointerEvents: 'none' }, 0.1)
          .to(roboticRef.current, {
            opacity: 0,
            duration: 0.5,
            ease: 'none',
          }, 0.5)
          .to(digitizationRef.current, {
            opacity: 1,
            duration: 0.5,
            ease: 'none',
          }, 0.5)
          .set(digitizationRef.current, { pointerEvents: 'auto' }, 0.6)
          .set(roboticRef.current, { pointerEvents: 'none' }, 0.6);
      } else {
        // Full animations for normal motion preference
        const tl = gsap.timeline({
          scrollTrigger: scrollSettings,
        });

        tl
          // Stage 1: Automated fades out, Robotic fades in
          .to(automatedRef.current, {
            yPercent: isMobile ? -20 : -30,
            scale: isMobile ? 0.98 : 0.95,
            opacity: 0,
            ease: 'power1.inOut',
            duration: 1,
          }, 0)
          .to(roboticRef.current, {
            yPercent: 0,
            scale: 1,
            opacity: 1,
            ease: 'power1.inOut',
            duration: 1,
          }, 0)
          // Enable interactions on Robotic once it is visible
          .set(roboticRef.current, { pointerEvents: 'auto' }, 0.2)
          .set(automatedRef.current, { pointerEvents: 'none' }, 0.2)
          // Stage 2: Robotic fades out, Digitization fades in
          .to(roboticRef.current, {
            yPercent: isMobile ? -20 : -30,
            scale: isMobile ? 0.98 : 0.95,
            opacity: 0,
            ease: 'power1.inOut',
            duration: 1,
          }, 1)
          .to(digitizationRef.current, {
            yPercent: 0,
            scale: 1,
            opacity: 1,
            ease: 'power1.inOut',
            duration: 1,
          }, 1)
          // Swap interactions to Digitization layer
          .set(digitizationRef.current, { pointerEvents: 'auto' }, 1.2)
          .set(roboticRef.current, { pointerEvents: 'none' }, 1.2);
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
      <section ref={containerRef} className="relative h-[200vh] sm:h-[250vh] lg:h-[300vh] overflow-hidden" style={{ perspective: '1000px' }}>
      <div
        ref={automatedRef}
        className="sticky top-0 h-screen w-full will-change-transform"
          style={{ backgroundColor: 'transparent', transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
      >
        {automated}
      </div>
      <div
        ref={roboticRef}
        className="fixed top-0 left-0 w-full h-screen will-change-transform"
          style={{ backgroundColor: 'transparent', transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
      >
        {robotic}
      </div>
      <div
        ref={digitizationRef}
        className="fixed top-0 left-0 w-full h-screen will-change-transform"
          style={{ backgroundColor: 'transparent', transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
      >
        {digitization}
      </div>
    </section>
  );
};

const HomePage: React.FC = () => {
  const handRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const robotRef = useRef<HTMLDivElement | null>(null);
  const cloudRef = useRef<HTMLButtonElement | null>(null);
  const roboticScrollerRef = useRef<HTMLDivElement | null>(null);

  const roboticImages = [
    { src: "/robotic/indoor-painting_and_door_opening.png", alt: "Commercial vehicle cabin painting" },
    { src: "/robotic/2-wheeler-fueltanks_plaSTIC.png", alt: "Two-wheeler fuel tanks" },
    { src: "/robotic/scooter-metal_plastic-part.png", alt: "Plastic components" },
    { src: "/robotic/sealer_application.png", alt: "Sealer application" },
    { src: "/robotic/underbody_application.png", alt: "Underbody coating" },
  ];
  const duplicatedRoboticImages = [...roboticImages, ...roboticImages, ...roboticImages];
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

  useEffect(() => {
    const scroller = roboticScrollerRef.current;
    if (!scroller) return;

    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    const setToMiddleBlock = () => {
      const blockWidth = scroller.scrollWidth / 3;
      scroller.scrollTo({ left: blockWidth, behavior: 'auto' });
    };

    setToMiddleBlock();

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const blockWidth = scroller.scrollWidth / 3;
        const left = scroller.scrollLeft;
        if (left < blockWidth * 0.1) {
          scroller.scrollTo({ left: left + blockWidth, behavior: 'auto' });
        } else if (left > blockWidth * 2.9) {
          scroller.scrollTo({ left: left - blockWidth, behavior: 'auto' });
        }
        ticking = false;
      });
    };

    scroller.addEventListener('scroll', onScroll as EventListener, { passive: true } as AddEventListenerOptions);

    // Allow vertical wheel/trackpad to move the horizontal carousel while section is pinned
    const onWheel = (e: WheelEvent) => {
      if (!scroller) return;
      const vertical = Math.abs(e.deltaY) > Math.abs(e.deltaX);
      if (vertical) {
        e.preventDefault();
        // Adjust scroll sensitivity based on device
        const sensitivity = isMobile ? 0.5 : isTablet ? 0.7 : 1;
        scroller.scrollLeft += e.deltaY * sensitivity;
      }
    };
    scroller.addEventListener('wheel', onWheel, { passive: false } as AddEventListenerOptions);

    // Enhanced touch support for mobile devices
    let touchStartX = 0;
    let touchStartY = 0;

    const onTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      
      const touchCurrentX = e.touches[0].clientX;
      const touchCurrentY = e.touches[0].clientY;
      const diffX = Math.abs(touchCurrentX - touchStartX);
      const diffY = Math.abs(touchCurrentY - touchStartY);

      // Determine if this is a horizontal scroll
      if (diffX > diffY && diffX > 10) {
        e.preventDefault();
      }
    };

    const onTouchEnd = () => {
      // Touch end handler - can be used for cleanup if needed
    };

    // Add touch event listeners for better mobile experience
    scroller.addEventListener('touchstart', onTouchStart, { passive: true });
    scroller.addEventListener('touchmove', onTouchMove, { passive: false });
    scroller.addEventListener('touchend', onTouchEnd, { passive: true });

    const onResize = () => setToMiddleBlock();
    window.addEventListener('resize', onResize);

    return () => {
      scroller.removeEventListener('scroll', onScroll as EventListener);
      scroller.removeEventListener('wheel', onWheel as EventListener);
      scroller.removeEventListener('touchstart', onTouchStart);
      scroller.removeEventListener('touchmove', onTouchMove);
      scroller.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col text-black font-body overflow-x-hidden">
      {/* Header */}
      <header className="w-full border-b" style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 35%, rgba(255,255,255,0.02) 100%), rgba(0,0,0,0.82)',
        borderColor: 'rgba(255,255,255,0.16)',
        backdropFilter: 'saturate(140%) blur(20px)',
        WebkitBackdropFilter: 'saturate(140%) blur(20px)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(255,255,255,0.06)'
      }}>
        <div className="w-full h-16 flex items-center justify-between px-4 md:px-0">
          {/* Left side - Mobile hamburger + Logo */}
          <div className="flex items-center gap-3">
            <div className="md:hidden">
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
            <div className="flex items-center gap-3 ml-2">
              <img src="/newlogo.png" alt="PlusTech Logo" className="h-12 w-auto brightness-110 contrast-110 block" />
              <img src="/PLUSTECH.png" alt="PLUSTECH Wordmark" className="h-6 md:h-8 w-auto block" />
            </div>
          </div>
          
          {/* Right side - Desktop navigation */}
          <div className="hidden md:flex items-center">
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
        </div>
      </header>

      {/* Threads Hero */}
      <div className="w-full flex items-center justify-center">
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
          <a href="#contact" className="px-8 md:px-10 py-4 rounded-full bg-white text-black font-semibold shadow-[0_8px_24px_rgba(0,0,0,0.2)] hover:bg-white/90 transition-colors text-lg">
            Get Started
          </a>
          <a href="#about" className="px-8 md:px-10 py-4 rounded-full bg-black text-white font-semibold hover:bg-gray-800 transition-colors text-lg shadow-[0_8px_24px_rgba(0,0,0,0.2)]">
            Learn More
          </a>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="w-full px-6 md:px-12 lg:px-16 py-12">
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

      {/* Company Logos Animation */}
      <section className="w-full px-6 md:px-12 lg:px-16 py-8 md:py-12">
        <div className="max-w-7xl mx-auto w-full">
          <CompanyAnimation />
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="highlights" className="w-full relative overflow-hidden">
        <div className="w-full">
          <div className="pt-2 pb-1 md:pt-3 md:pb-2 text-center">
            <h3 className="text-3xl md:text-4xl font-heading font-bold text-black">
              OUR CAPABILITIES
            </h3>
            <p className="mt-3 text-gray-600 font-body text-base md:text-lg">
              A quick story of how we deliver value — one card at a time.
            </p>
          </div>

           <GsapCoverSection
             automated={
               <div className="w-full h-full flex items-start justify-center" style={{
                 background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                 backdropFilter: 'blur(10px) saturate(120%)',
                 WebkitBackdropFilter: 'blur(10px) saturate(120%)',
                 border: '1px solid rgba(255,255,255,0.2)',
                 boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
               }}>
                <div className="w-full px-4 md:px-8 py-6 md:py-10">
                  <h4 className="mt-1 md:mt-2 text-3xl md:text-5xl font-heading font-semibold text-black">
                    Automated and Customised Material Handling
                  </h4>
                  <p className="text-gray-700 font-body mt-4 text-lg md:text-xl max-w-5xl">
                    Plustech deploys fully or partially automated Handling solutions across various sections and operations of Paint shops to boost productivity, efficiency, and optimize the plant footprint.
                  </p>
                  <div className="mt-6 w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-center">
                    <img src="/automated-customised-materialhandling/1.png" alt="Material handling 1" className="w-full h-auto object-contain max-h-[40vh] md:max-h-[50vh] rounded-2xl shadow-xl" loading="lazy" />
                    <img src="/automated-customised-materialhandling/2.png" alt="Material handling 2" className="w-full h-auto object-contain max-h-[40vh] md:max-h-[50vh] rounded-2xl shadow-xl" loading="lazy" />
                    <img src="/automated-customised-materialhandling/3.png" alt="Material handling 3" className="w-full h-auto object-contain max-h-[40vh] md:max-h-[50vh] rounded-2xl shadow-xl" loading="lazy" />
                  </div>
                </div>
              </div>
            }
             robotic={
               <div className="w-full h-full flex items-start justify-center" style={{
                 background: 'linear-gradient(180deg, rgba(59,130,246,0.15) 0%, rgba(37,99,235,0.1) 100%)',
                 backdropFilter: 'blur(10px) saturate(120%)',
                 WebkitBackdropFilter: 'blur(10px) saturate(120%)',
                 border: '1px solid rgba(59,130,246,0.2)',
                 boxShadow: '0 8px 32px rgba(59,130,246,0.1)'
               }}>
                <div className="w-full px-4 md:px-8 py-6 md:py-10">
                  <h4 className="mt-1 md:mt-2 text-3xl md:text-5xl font-heading font-semibold text-black">
                    Robotic Applications
                  </h4>
                  <p className="text-gray-700 font-body mt-3 text-base md:text-lg">
                    We deliver state-of-the-art, high-precision robotic painting systems designed for blue-chip customers across a wide range of industries.
                  </p>
                  <ul className="list-disc pl-5 mt-3 text-gray-700 font-body space-y-1 text-base md:text-lg">
                    <li>Commercial vehicle cabins — interior and exterior painting, sealer, and underbody coating</li>
                    <li>Two-wheeler fuel tanks</li>
                    <li>Plastic components</li>
                    <li>General industrial parts</li>
                  </ul>
                  <p className="text-gray-700 font-body mt-4 text-base md:text-lg">
                    Each robotic system is expertly engineered to provide exceptional advantages: consistently superior finish quality, high-volume production capacity, and significantly reduced paint consumption.
                  </p>
                  <div className="mt-6 relative w-full">
                    <div
                      ref={roboticScrollerRef}
                      className="flex overflow-x-auto gap-4 md:gap-6 snap-x snap-mandatory hide-scrollbar px-4 md:px-6"
                      style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                      <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}`}</style>
                      {duplicatedRoboticImages.map((img, i) => (
                        <div key={`robotic-img-${i}`} className="carousel-item snap-center flex-none w-full md:w-1/3 lg:w-1/3">
                          <img src={img.src} alt={img.alt} className="w-full h-auto object-contain max-h-[40vh] md:max-h-[50vh] rounded-2xl shadow-xl" loading="lazy" />
                        </div>
                      ))}
                    </div>
                    <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-1 md:px-3">
                      <button
                        type="button"
                        aria-label="Scroll left"
                        onClick={() => {
                          const el = roboticScrollerRef.current;
                          if (el) {
                             const item = el.querySelector('.carousel-item') as HTMLElement | null;
                             const delta = item ? item.offsetWidth + 16 : el.clientWidth / 3;
                            el.scrollBy({ left: -delta, behavior: 'smooth' });
                          }
                        }}
                        className="pointer-events-auto hidden sm:inline-flex h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/90 border border-black/10 shadow-md text-black items-center justify-center touch-manipulation hover:bg-white transition-colors"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        aria-label="Scroll right"
                        onClick={() => {
                          const el = roboticScrollerRef.current;
                          if (el) {
                             const item = el.querySelector('.carousel-item') as HTMLElement | null;
                             const delta = item ? item.offsetWidth + 16 : el.clientWidth / 3;
                            el.scrollBy({ left: delta, behavior: 'smooth' });
                          }
                        }}
                        className="pointer-events-auto hidden sm:inline-flex h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white/90 border border-black/10 shadow-md text-black items-center justify-center touch-manipulation hover:bg-white transition-colors"
                      >
                        ›
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
             digitization={
               <div className="w-full h-full flex items-start justify-center" style={{
                 background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.7) 100%)',
                 backdropFilter: 'blur(10px) saturate(120%)',
                 WebkitBackdropFilter: 'blur(10px) saturate(120%)',
                 border: '1px solid rgba(255,255,255,0.1)',
                 boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
               }}>
                <div className="w-full px-4 md:px-8 py-6 md:py-10">
                  <h4 className="mt-1 md:mt-2 text-3xl md:text-5xl font-heading font-semibold text-white">
                    Digitization and Smart Factory
                  </h4>
                  <p className="text-gray-200 font-body mt-4 text-lg md:text-xl max-w-5xl">
                    Empowering industry transformation through advanced digital solutions and Industry 4.0 technologies. Our smart factory implementations deliver real-time insights, optimize processes, and enable data-driven decision making.
                  </p>
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="space-y-4">
                      <h5 className="text-xl font-semibold text-white/90">Real-time Monitoring & Control</h5>
                      <ul className="list-disc pl-5 space-y-2 text-gray-300 text-base md:text-lg">
                        <li>Advanced process visualization and control systems</li>
                        <li>Real-time performance analytics and KPI tracking</li>
                        <li>Quality monitoring and traceability solutions</li>
                        <li>Energy consumption optimization</li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h5 className="text-xl font-semibold text-white/90">Smart Integration</h5>
                      <ul className="list-disc pl-5 space-y-2 text-gray-300 text-base md:text-lg">
                        <li>IoT sensor networks and data collection</li>
                        <li>Predictive maintenance systems</li>
                        <li>Automated reporting and analytics</li>
                        <li>Machine learning optimization</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-6 w-full grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-center">
                    <img src="/digitization/control-systems.png" alt="Digital Control Systems" className="w-full h-auto object-contain max-h-[40vh] md:max-h-[50vh] rounded-2xl shadow-xl" loading="lazy" />
                    <img src="/digitization/analytics-dashboard.png" alt="Data Analytics Dashboard" className="w-full h-auto object-contain max-h-[40vh] md:max-h-[50vh] rounded-2xl shadow-xl" loading="lazy" />
                    <img src="/digitization/iot-integration.png" alt="IoT Integration" className="w-full h-auto object-contain max-h-[40vh] md:max-h-[50vh] rounded-2xl shadow-xl" loading="lazy" />
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </section>

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
      <Footer />
    </div>
  );
};

export default HomePage;
