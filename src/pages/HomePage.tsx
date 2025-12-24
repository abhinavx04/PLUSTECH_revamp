import React, { useRef, useEffect, useState } from 'react';
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


const HomePage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const robotRef = useRef<HTMLDivElement | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);

  const cn = (...classes: (string | undefined | null | false)[]): string => {
    return classes.filter(Boolean).join(' ');
  };

  const navItems = [
    { name: "Home", link: "/" },
    { 
      name: "About", 
      link: "/about",
      submenu: [
        { title: 'Corporate Beliefs', path: '/about/corporate-beliefs' },
        { title: 'Industry Focus', path: '/about/industry-focus' },
        { title: 'Certifications', path: '/about/certifications' },
        { title: 'History & Milestones', path: '/about/history' },
        { title: 'Annual Returns', path: '/about/annual-returns' },
        { title: 'CSR Activities', path: '/about/csr-activities' },
      ]
    },
    { name: "Projects", link: "/projects" },
    { name: "Services", link: "/services" },
    { name: "Contact", link: "/contact" },
  ];

  useEffect(() => {
    const robot = robotRef.current;
    const container = containerRef.current;
    if (!robot || !container) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;
    
    // Skip parallax animation for reduced motion
    if (prefersReducedMotion) return;

    // Tweakable proximity constants
    const PROXIMITY_MAX_DISTANCE_FACTOR = 0.8; // fraction of container diagonal for falloff
    const MOVE_SENSITIVITY_NEAR = isMobile ? 11 : 10;   // higher divisor => slightly less movement
    const MOVE_SENSITIVITY_FAR = isMobile ? 24 : 18;
    const ROTATION_NEAR = isMobile ? 0.85 : 1.0;
    const ROTATION_FAR = isMobile ? 0.32 : 0.45;
    const SCALE_NEAR = isMobile ? 0.0016 : 0.0018;
    const SCALE_FAR = isMobile ? 0.00065 : 0.0009;
    const ROTATION_SMOOTHING = 0.18;
    const MAX_ROTATION_DEG = 8;

    let rafId: number | null = null;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let moveSensitivity = MOVE_SENSITIVITY_FAR;
    let rotationIntensity = ROTATION_FAR;
    let scaleIntensity = SCALE_FAR;
    let rotationTarget = 0;
    let rotationCurrent = 0;

    const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

    const updateProximity = (clientX: number, clientY: number) => {
      const robotRect = robot.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const centerX = robotRect.left + robotRect.width / 2;
      const centerY = robotRect.top + robotRect.height / 2;
      const dx = clientX - centerX;
      const dy = clientY - centerY;
      const distance = Math.hypot(dx, dy);
      const maxDistance = Math.hypot(containerRect.width, containerRect.height) * 0.5 * PROXIMITY_MAX_DISTANCE_FACTOR;
      const proximity = clamp01(1 - distance / maxDistance);

      // Higher proximity => stronger reaction (lower move sensitivity divisor, higher rotation/scale multipliers)
      moveSensitivity = MOVE_SENSITIVITY_FAR - proximity * (MOVE_SENSITIVITY_FAR - MOVE_SENSITIVITY_NEAR);
      rotationIntensity = ROTATION_FAR + proximity * (ROTATION_NEAR - ROTATION_FAR);
      scaleIntensity = SCALE_FAR + proximity * (SCALE_NEAR - SCALE_FAR);

      // Rotate relative to robot center for better symmetry, with a mild dampener
      rotationTarget = dx / (moveSensitivity * 1.1);

      return { proximity, dx, dy, containerRect };
    };

    const resetDynamics = () => {
      moveSensitivity = MOVE_SENSITIVITY_FAR;
      rotationIntensity = ROTATION_FAR;
      scaleIntensity = SCALE_FAR;
    };

    const onMouseMove = (e: MouseEvent) => {
      const { containerRect } = updateProximity(e.clientX, e.clientY);
      const x = e.clientX - (containerRect.left + containerRect.width / 2);
      const y = e.clientY - (containerRect.top + containerRect.height / 2);
      target.x = x / moveSensitivity;
      target.y = y / moveSensitivity;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        const { containerRect } = updateProximity(touch.clientX, touch.clientY);
        const x = touch.clientX - (containerRect.left + containerRect.width / 2);
        const y = touch.clientY - (containerRect.top + containerRect.height / 2);
        target.x = x / moveSensitivity;
        target.y = y / moveSensitivity;
      }
    };

    const onMouseOut = () => {
      target.x = 0;
      target.y = 0;
      resetDynamics();
    };

    const onTouchEnd = () => {
      target.x = 0;
      target.y = 0;
      resetDynamics();
    };

    const tick = () => {
      current.x += (target.x - current.x) * 0.1;
      current.y += (target.y - current.y) * 0.1;
      rotationCurrent += (rotationTarget - rotationCurrent) * ROTATION_SMOOTHING;
      const rotateZRaw = rotationCurrent * rotationIntensity;
      const rotateZ = Math.max(-MAX_ROTATION_DEG, Math.min(MAX_ROTATION_DEG, rotateZRaw));
      const scale = 1 + Math.abs(current.x + current.y) * scaleIntensity;
      (robot as HTMLDivElement).style.transform = `translate(${current.x}px, ${current.y}px) rotateZ(${rotateZ}deg) scale(${scale})`;
      rafId = window.requestAnimationFrame(tick);
    };

    const startAnimation = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    const stopAnimation = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      resetDynamics();
      (robot as HTMLDivElement).style.transform = '';
    };

    // Add both mouse and touch event listeners scoped to the container
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseOut);
    container.addEventListener("touchmove", onTouchMove, { passive: true });
    container.addEventListener("touchend", onTouchEnd);
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          startAnimation();
        } else {
          stopAnimation();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(container);
    startAnimation(); // Kick off if already visible on mount

    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseOut);
      container.removeEventListener("touchmove", onTouchMove);
      container.removeEventListener("touchend", onTouchEnd);
      stopAnimation();
      observer.disconnect();
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
              {!isMobileMenuOpen && (
                <MobileNavToggle
                  isOpen={isMobileMenuOpen}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
              )}
            </MobileNavHeader>

            <MobileNavMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            >
              <div className="space-y-2">
                {navItems.map((item, idx) => {
                  const hasSubmenu = item.submenu && item.submenu.length > 0;
                  const isOpen = openMobileDropdown === item.name;
                  
                  return (
                    <div key={`mobile-link-${idx}`}>
                      <div
                        className="flex items-center justify-between text-[#222222] hover:text-[#333333] transition-colors py-4 px-4 rounded-lg hover:bg-black/5 font-semibold text-lg border-b cursor-pointer"
                        style={{ borderBottomColor: 'rgba(0,0,0,0.08)' }}
                        onClick={() => {
                          if (hasSubmenu) {
                            setOpenMobileDropdown(isOpen ? null : item.name);
                          } else {
                            setIsMobileMenuOpen(false);
                            window.location.href = item.link;
                          }
                        }}
                      >
                        <span>{item.name}</span>
                        {hasSubmenu && (
                          <svg 
                            className={cn(
                              "w-5 h-5 transition-transform duration-200",
                              isOpen && "rotate-180"
                            )} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </div>
                      {hasSubmenu && isOpen && (
                        <div className="pl-6 pr-4 pb-2 space-y-1">
                          {item.submenu.map((subItem, subIdx) => (
                            <a
                              key={`mobile-submenu-${idx}-${subIdx}`}
                              href={subItem.path}
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setOpenMobileDropdown(null);
                              }}
                              className="block text-[#666666] hover:text-[#00aeef] transition-colors py-2 px-4 rounded-lg hover:bg-black/5 text-base"
                            >
                              {subItem.title}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
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
              <p className="mt-4 text-black/50 text-base md:text-lg max-w-3xl mx-auto font-body text-justify" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.2)' }}>
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
          <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold font-heading text-black">
                Welcome to Plustech
              </h2>
              <p className="text-lg md:text-xl text-gray-700 font-body leading-relaxed text-justify">
                At Plustech, we design and build surface finishing plants for automotive and general
                industries. With expertise in engineering, automation, and commissioning, we deliver
                customized solutions that combine innovation, efficiency, and quality.
              </p>
            </div>
            <div className="flex justify-center items-start relative z-[0] pt-4 md:pt-2">
              <div ref={robotRef} className="will-change-transform relative">
                <img src="/home/file.svg" alt="Robotic Hand" className="w-52 md:w-80" style={{ filter: 'brightness(1.1) contrast(1.1)' }} />
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
              <div className="text-lg md:text-xl text-gray-800 font-body leading-relaxed space-y-4 text-justify">
                <p>
                  Plustech Systems and Solutions is a trusted partner in building integrated paintshops for automotive and general industry applications. With expertise spanning design, engineering, procurement, construction, and commissioning, we provide customized solutions tailored to each customer's unique requirements.
                </p>
                <p>
                  Our reputation has been built over the years on delivering paintshops that embody consistency, reliability, and robust performance. Whether semi-automatic or fully automatic, every solution reflects our commitment to continuous improvement, innovation, and long-term value for our clients.
                </p>
                <p>
                  At Plustech, we don't just build plants—we build partnerships that enable industries to achieve precision, efficiency, and excellence in finishing operations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Logos Animation – Trusted by leading companies */}
      <section className="w-full px-6 md:px-12 lg:px-16 py-8 md:py-12 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200">
        <div className="max-w-7xl mx-auto w-full">
          <CompanyAnimation />
        </div>
      </section>

      {/* News Section – Latest News & Updates (separate visual section) */}
      <div className="bg-slate-50 border-t border-slate-200">
        <SimpleNewsSection />
      </div>

      {/* Capabilities Section */}
      <div className="bg-white">
        <CapabilitiesSection />
          </div>

      <Footer />
    </div>
  );
};

export default HomePage;
