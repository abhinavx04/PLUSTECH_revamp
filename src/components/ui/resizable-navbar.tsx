"use client";
import React, { useEffect, useState } from "react";

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

export interface NavItem {
  name: string;
  link: string;
  submenu?: Array<{ title: string; path: string }>;
}

interface NavItemsProps {
  items: Array<NavItem>;
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
        className
      )}
      style={{
        background: 'linear-gradient(180deg, rgba(248,248,248,0.75) 0%, rgba(245,245,245,0.68) 55%, rgba(240,240,240,0.6) 100%)',
        borderColor: 'rgba(0,0,0,0.08)',
        backdropFilter: 'saturate(140%) blur(14px)',
        WebkitBackdropFilter: 'saturate(140%) blur(14px)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.10)'
      }}
    >
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
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

// Navigation Items with Dropdown Support
export const NavItems = ({ items, className }: NavItemsProps) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openDropdown]);

  return (
    <ul className={cn("flex items-center space-x-4 lg:space-x-6 xl:space-x-8", className)}>
      {items.map((item, idx) => {
        const hasSubmenu = item.submenu && item.submenu.length > 0;
        const isOpen = openDropdown === item.name;

        return (
          <li 
            key={`nav-item-${idx}`} 
            className="relative dropdown-container shrink-0"
          >
            <a
              href={item.link}
              onClick={(e) => {
                if (hasSubmenu) {
                  e.preventDefault();
                  setOpenDropdown(isOpen ? null : item.name);
                }
              }}
              className={cn(
                "relative text-[#222222] hover:text-[#333333] transition-colors duration-200 font-medium transform hover:scale-105 inline-flex items-center gap-1 whitespace-nowrap",
                isOpen && "text-[#00aeef]"
              )}
            >
              {item.name}
              {hasSubmenu && (
                <svg 
                  className={cn(
                    "w-4 h-4 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </a>
            
            {hasSubmenu && isOpen && item.submenu && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 opacity-100 translate-y-0 transition-all duration-200 ease-out max-h-[80vh] overflow-y-auto">
                {item.submenu.map((subItem, subIdx) => (
                  <a
                    key={`submenu-${idx}-${subIdx}`}
                    href={subItem.path}
                    className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#00aeef] transition-colors duration-150 whitespace-nowrap"
                    onClick={() => setOpenDropdown(null)}
                  >
                    {subItem.title}
                  </a>
                ))}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};

// Logo Component
export const NavbarLogo = ({ className }: NavbarLogoProps) => {
  return (
    <a href="/" className={cn("flex items-center space-x-3", className)}>
      <img
        src="/PLUSTECH NEW.png"
        alt="Plustech Logo"
        className="h-8 w-auto brightness-110 contrast-110"
        width="147"
        height="32"
        loading="eager"
        onError={(e) => {
          // Fallback if image doesn't exist
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
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
      className="p-2 rounded-lg hover:bg-black/5 transition-colors"
      aria-label="Toggle mobile menu"
    >
      <div className="w-6 h-6 flex flex-col justify-center space-y-1">
        <span
          className={cn(
            "block h-0.5 w-6 bg-[#222222] transition-all duration-300",
            isOpen && "rotate-45 translate-y-1.5"
          )}
        />
        <span
          className={cn(
            "block h-0.5 w-6 bg-[#222222] transition-all duration-300",
            isOpen && "opacity-0"
          )}
        />
        <span
          className={cn(
            "block h-0.5 w-6 bg-[#222222] transition-all duration-300",
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
          "fixed top-0 left-0 h-screen w-80 shadow-xl z-50 transform transition-transform duration-300 ease-in-out border-r",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{
          background: '#F8F8F8',
          borderRightColor: 'rgba(0,0,0,0.08)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)'
        }}
      >
        <div className="flex flex-col h-screen">
          <div className="p-6 border-b" style={{ borderBottomColor: 'rgba(0,0,0,0.08)' }}>
            <div className="flex items-center justify-between">
              <NavbarLogo />
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-black/5 transition-colors text-[#222222]"
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