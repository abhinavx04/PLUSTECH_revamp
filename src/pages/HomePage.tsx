import React, { useState } from 'react';
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
        { title: 'About Us', path: '/about' },
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
                DEVELOPING SOLUTIONS<br />DELIVERING QUALITY
              </h1>
            </div>
          </div>
          <Threads color={[0, 0.8, 1]} amplitude={1.6} distance={0.7} animationSpeed={0.5} enableMouseInteraction={true} />
        </div>
      </div>

      {/* CTAs */}
      <div className="w-full hidden md:flex items-center justify-center mt-8 md:mt-12">
        <div className="flex items-center justify-center gap-6">
          <a href="#contact" className="px-8 md:px-10 py-4 rounded-full bg-[#00aeef] text-white font-semibold shadow-[0_8px_24px_rgba(0,174,239,0.3)] hover:bg-[#0099d4] transition-all duration-300 text-lg transform hover:scale-105">
            Get Started
          </a>
          <a href="/about" className="px-8 md:px-10 py-4 rounded-full bg-white text-[#00aeef] font-semibold hover:bg-gray-50 transition-all duration-300 text-lg shadow-[0_8px_24px_rgba(0,0,0,0.1)] border border-[#00aeef]/20 transform hover:scale-105">
            Learn More
          </a>
        </div>
      </div>

      {/* Welcome Section */}
      <div className="w-full px-6 md:px-12 lg:px-16 py-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
            <div className="flex justify-center items-center">
              <div className="w-full max-w-2xl aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <img 
                  src="/office/entrance/entrance.jpeg" 
                  alt="Plustech Entrance" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Capabilities Section */}
      <div className="bg-white">
        <CapabilitiesSection />
            </div>

      {/* Brand Promise Text moved below capabilities */}
      <div className="w-full px-6 md:px-12 lg:px-16 py-10 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-black/70 text-base md:text-lg font-body leading-relaxed" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
            At PlusTech, we design, engineer, and deliver precision systems that connect people, processes, and products—so your operations run smarter, faster, and safer.
                </p>
              </div>
            </div>

      {/* News Section – Latest News & Updates */}
      <div className="bg-slate-50 border-t border-slate-200">
        <SimpleNewsSection />
        </div>

      {/* Company Logos Animation – Trusted by leading companies */}
      <section className="w-full px-6 md:px-12 lg:px-16 py-8 md:py-12 bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200">
        <div className="max-w-7xl mx-auto w-full">
          <CompanyAnimation />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
