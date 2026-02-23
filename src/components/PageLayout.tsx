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
} from './ui/resizable-navbar';

export interface NavItem {
  name: string;
  link: string;
  submenu?: Array<{ title: string; path: string }>;
}

// Shared navigation items - defined once, used everywhere
export const NAV_ITEMS: NavItem[] = [
  { name: 'Home', link: '/' },
  {
    name: 'About',
    link: '/about',
    submenu: [
      { title: 'About Us', path: '/about' },
      { title: 'Corporate Beliefs', path: '/about/corporate-beliefs' },
      { title: 'Industry Focus', path: '/about/industry-focus' },
      { title: 'Certifications', path: '/about/certifications' },
      { title: 'History & Milestones', path: '/about/history' },
      { title: 'Facilities', path: '/facility' },
      { title: 'Annual Returns', path: '/about/annual-returns' },
      { title: 'CSR Activities', path: '/about/csr-activities' },
    ],
  },
  { name: 'Projects', link: '/projects' },
  { name: 'News & Events', link: '/news' },
  { name: 'Services', link: '/services' },
  { name: 'Careers', link: '/careers' },
  { name: 'Contact', link: '/contact' },
];

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const PageLayout: React.FC<PageLayoutProps> = ({ children, className }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);

  return (
    <div className={cn('min-h-screen w-full flex flex-col text-black font-body overflow-x-hidden', className)}>
      <div className="relative w-full">
        <Navbar>
          {/* Desktop Navigation */}
          <NavBody>
            <NavbarLogo />
            <div className="flex-1 flex justify-center min-w-0 mr-12 lg:mr-24">
              <NavItems items={NAV_ITEMS} />
            </div>
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
                {NAV_ITEMS.map((item, idx) => {
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
                              'w-5 h-5 transition-transform duration-200',
                              isOpen && 'rotate-180'
                            )}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        )}
                      </div>
                      {hasSubmenu && isOpen && item.submenu && (
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
      {children}
    </div>
  );
};

