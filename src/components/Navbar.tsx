import React, { useState } from 'react';
import GooeyNav from './GooeyNav';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Projects', href: '/projects' },
    { name: 'Contact', href: '/contact' }
  ];

  // GooeyNav items
  const gooeyItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" }
  ];

  return (
    <nav 
      className="fixed top-0 left-0 right-0 border-b shadow-lg"
      style={{
        background: '#FFF9FB',
        borderColor: '#D3D4D9',
        zIndex: 9999,
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        width: '100%',
            height: '64px',
        display: 'block',
        visibility: 'visible',
        opacity: '1'
      }}
    >
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
            <div className="flex items-center justify-between h-16">
          {/* Logo and Company Name - Left */}
          <div className="flex items-center space-x-2">
                <img 
                  src="/newlogo.png" 
                  alt="PlusTech Logo" 
                  className="h-12 w-auto brightness-110 contrast-110"
                />
                <span 
                  className="font-bold text-lg tracking-wider"
                  style={{ 
                    fontFamily: 'Orbitron, Arial, sans-serif',
                    fontWeight: '800',
                    letterSpacing: '0.1em',
                    color: '#00aeef'
                  }}
                >
                  PLUSTECH
                </span>
          </div>

              {/* Desktop Navigation - Center with GooeyNav */}
              <div className="hidden md:block w-96 h-16 flex items-center justify-center">
            <GooeyNav
              items={gooeyItems}
              particleCount={15}
              particleDistances={[90, 10]}
              particleR={100}
              initialActiveIndex={0}
              animationTime={600}
              timeVariance={300}
              colors={[1, 2, 3, 1, 2, 3, 1, 4]}
            />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-[#252627] hover:text-[#4B88A2] focus:outline-none focus:text-[#4B88A2]"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#FFF9FB] rounded-lg mt-2 border" style={{ borderColor: '#D3D4D9' }}>
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-[#252627] hover:text-[#4B88A2] block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
