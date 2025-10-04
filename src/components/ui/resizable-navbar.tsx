"use client";
import { useEffect } from "react";

// Utility function to combine class names
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface NavItemsProps {
  items: Array<{ name: string; link: string }>;
  className?: string;
}

interface NavbarLogoProps {
  className?: string;
}

interface NavbarButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  className?: string;
}

interface MobileNavProps {
  children: React.ReactNode;
}

interface MobileNavHeaderProps {
  children: React.ReactNode;
}

interface MobileNavToggleProps {
  isOpen: boolean;
  onClick: () => void;
}

interface MobileNavMenuProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

// Main Navbar Container
export const Navbar = ({ children, className }: NavbarProps) => {
  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 w-full",
        "border-b",
        "shadow-sm",
        className
      )}
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 35%, rgba(255,255,255,0.02) 100%), rgba(0,0,0,0.82)',
        borderColor: 'rgba(255,255,255,0.16)',
        backdropFilter: 'saturate(140%) blur(20px)',
        WebkitBackdropFilter: 'saturate(140%) blur(20px)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(255,255,255,0.06)'
      }}
    >
      {children}
    </nav>
  );
};

// Navbar Body (Desktop Layout)
export const NavBody = ({ children, className }: NavBodyProps) => {
  return (
    <div className={cn("hidden md:flex items-center justify-between px-6 lg:px-8 py-4", className)}>
      {children}
    </div>
  );
};

// Navigation Items
export const NavItems = ({ items, className }: NavItemsProps) => {
  return (
    <ul className={cn("flex items-center space-x-8", className)}>
      {items.map((item, idx) => (
        <li key={`nav-item-${idx}`}>
          <a
            href={item.link}
            className="relative text-white hover:text-[#00aeef] transition-colors duration-200 font-medium transform hover:scale-105 inline-block"
          >
            {item.name}
          </a>
        </li>
      ))}
    </ul>
  );
};

// Logo Component
export const NavbarLogo = ({ className }: NavbarLogoProps) => {
  return (
    <a href="/" className={cn("flex items-center space-x-3", className)}>
      <img
        src="/newlogo.png"
        alt="PlusTech Logo"
        className="h-8 w-auto brightness-110 contrast-110"
      />
      <span
        className="font-bold text-lg text-[#00aeef]"
        style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}
      >
        PLUSTECH
      </span>
    </a>
  );
};

// Navbar Button
export const NavbarButton = ({ 
  children, 
  variant = "primary", 
  onClick, 
  className 
}: NavbarButtonProps) => {
  const baseClasses = "px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105";
  
  const variants = {
    primary: "bg-[#00aeef] text-black hover:bg-[#0099d4] shadow-sm",
    secondary: "bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm"
  };

  return (
    <button
      onClick={onClick}
      className={cn(baseClasses, variants[variant], className)}
    >
      {children}
    </button>
  );
};

// Mobile Navigation Container
export const MobileNav = ({ children }: MobileNavProps) => {
  return (
    <div className="md:hidden">
      {children}
    </div>
  );
};

// Mobile Navigation Header
export const MobileNavHeader = ({ children }: MobileNavHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      {children}
    </div>
  );
};

// Mobile Navigation Toggle
export const MobileNavToggle = ({ isOpen, onClick }: MobileNavToggleProps) => {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
      aria-label="Toggle mobile menu"
    >
      <div className="w-6 h-6 flex flex-col justify-center space-y-1">
        <span
          className={cn(
            "block h-0.5 w-6 bg-white transition-all duration-300",
            isOpen && "rotate-45 translate-y-1.5"
          )}
        />
        <span
          className={cn(
            "block h-0.5 w-6 bg-white transition-all duration-300",
            isOpen && "opacity-0"
          )}
        />
        <span
          className={cn(
            "block h-0.5 w-6 bg-white transition-all duration-300",
            isOpen && "-rotate-45 -translate-y-1.5"
          )}
        />
      </div>
    </button>
  );
};

// Mobile Navigation Menu
export const MobileNavMenu = ({ children, isOpen, onClose }: MobileNavMenuProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}
      
      {/* Menu */}
      <div
        className={cn(
          "fixed top-0 left-0 h-screen w-80 shadow-xl z-50 transform transition-transform duration-300 ease-in-out border-r border-white/20 bg-black",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{
          background: 'rgba(0,0,0,1)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}
      >
        <div className="flex flex-col h-screen">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <NavbarLogo />
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </>
  );
};