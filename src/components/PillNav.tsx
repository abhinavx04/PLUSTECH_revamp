import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

export type PillNavItem = {
  label: string;
  href: string;
  ariaLabel?: string;
};

export interface PillNavProps {
  logo: string;
  logoAlt?: string;
  items: PillNavItem[];
  activeHref?: string;
  className?: string;
  ease?: string;
  baseColor?: string;
  pillColor?: string;
  hoveredPillTextColor?: string;
  pillTextColor?: string;
  onMobileMenuClick?: () => void;
  initialLoadAnimation?: boolean;
  placement?: 'top' | 'center';
  position?: 'absolute' | 'static';
  showLogo?: boolean;
  pillGap?: number | string;
  pillPaddingX?: number | string;
}

const PillNav: React.FC<PillNavProps> = ({
  logo,
  logoAlt = 'Logo',
  items,
  activeHref,
  className = '',
  ease = 'power3.easeOut',
  baseColor = '#fff',
  pillColor = '#060010',
  hoveredPillTextColor = '#060010',
  pillTextColor,
  onMobileMenuClick,
  initialLoadAnimation = true,
  placement = 'top',
  position = 'absolute',
  showLogo = true,
  pillGap,
  pillPaddingX
}) => {
  const resolvedPillTextColor = pillTextColor ?? baseColor;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const circleRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const tlRefs = useRef<Array<gsap.core.Timeline | null>>([]);
  const activeTweenRefs = useRef<Array<gsap.core.Tween | null>>([]);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const logoTweenRef = useRef<gsap.core.Tween | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const navItemsRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLAnchorElement | HTMLElement | null>(null);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    const layout = () => {
      circleRefs.current.forEach(circle => {
        if (!circle?.parentElement) return;

        const pill = circle.parentElement as HTMLElement;
        const rect = pill.getBoundingClientRect();
        const { width: w, height: h } = rect;
        const R = ((w * w) / 4 + h * h) / (2 * h);
        const D = Math.ceil(2 * R) + 2;
        const delta = Math.ceil(R - Math.sqrt(Math.max(0, R * R - (w * w) / 4))) + 1;
        const originY = D - delta;

        circle.style.width = `${D}px`;
        circle.style.height = `${D}px`;
        circle.style.bottom = `-${delta}px`;

        gsap.set(circle, {
          xPercent: -50,
          scale: 0,
          transformOrigin: `50% ${originY}px`
        });

        const label = pill.querySelector<HTMLElement>('.pill-label');
        const white = pill.querySelector<HTMLElement>('.pill-label-hover');

        if (label) gsap.set(label, { y: 0 });
        if (white) gsap.set(white, { y: h + 12, opacity: 0 });

        const index = circleRefs.current.indexOf(circle);
        if (index === -1) return;

        tlRefs.current[index]?.kill();
        const tl = gsap.timeline({ paused: true });

        // Adjust animation duration based on device and motion preference
        const animationDuration = prefersReducedMotion ? 0.1 : (isMobile ? 1.5 : 2);

        tl.to(circle, { 
          scale: prefersReducedMotion ? 1 : 1.2, 
          xPercent: -50, 
          duration: animationDuration, 
          ease: prefersReducedMotion ? 'none' : ease, 
          overwrite: 'auto' 
        }, 0);

        if (label) {
          tl.to(label, { 
            y: prefersReducedMotion ? 0 : -(h + 8), 
            duration: animationDuration, 
            ease: prefersReducedMotion ? 'none' : ease, 
            overwrite: 'auto' 
          }, 0);
        }

        if (white) {
          gsap.set(white, { y: Math.ceil(h + 100), opacity: 0 });
          tl.to(white, { 
            y: prefersReducedMotion ? h + 100 : 0, 
            opacity: prefersReducedMotion ? 0 : 1, 
            duration: animationDuration, 
            ease: prefersReducedMotion ? 'none' : ease, 
            overwrite: 'auto' 
          }, 0);
        }

        tlRefs.current[index] = tl;
      });
    };

    layout();

    const onResize = () => layout();
    window.addEventListener('resize', onResize);

    if (document.fonts) {
      document.fonts.ready.then(layout).catch(() => {});
    }

    const menu = mobileMenuRef.current;
    if (menu) {
      gsap.set(menu, { visibility: 'hidden', opacity: 0, x: -320, scaleX: 0.8 });
    }

    if (initialLoadAnimation && !prefersReducedMotion) {
      const logo = logoRef.current;
      const navItems = navItemsRef.current;

      if (logo) {
        gsap.set(logo, { scale: 0 });
        gsap.to(logo, {
          scale: 1,
          duration: isMobile ? 0.4 : 0.6,
          ease
        });
      }

      if (navItems) {
        gsap.set(navItems, { width: 0, overflow: 'hidden' });
        gsap.to(navItems, {
          width: 'auto',
          duration: isMobile ? 0.4 : 0.6,
          ease
        });
      }
    }

    return () => window.removeEventListener('resize', onResize);
  }, [items, ease, initialLoadAnimation]);

  const handleEnter = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(tl.duration(), {
      duration: 0.3,
      ease,
      overwrite: 'auto'
    });
  };

  const handleLeave = (i: number) => {
    const tl = tlRefs.current[i];
    if (!tl) return;
    activeTweenRefs.current[i]?.kill();
    activeTweenRefs.current[i] = tl.tweenTo(0, {
      duration: 0.2,
      ease,
      overwrite: 'auto'
    });
  };

  const handleLogoEnter = () => {
    const img = logoImgRef.current;
    if (!img) return;
    logoTweenRef.current?.kill();
    gsap.set(img, { rotate: 0 });
    logoTweenRef.current = gsap.to(img, {
      rotate: 360,
      duration: 0.2,
      ease,
      overwrite: 'auto'
    });
  };

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    const hamburger = hamburgerRef.current;
    const menu = mobileMenuRef.current;

    if (hamburger) {
      const lines = hamburger.querySelectorAll('.hamburger-line');
      const duration = prefersReducedMotion ? 0.1 : (isMobile ? 0.2 : 0.3);
      
      if (newState) {
        gsap.to(lines[0], { 
          rotation: 45, 
          y: 3, 
          duration, 
          ease: prefersReducedMotion ? 'none' : ease 
        });
        gsap.to(lines[1], { 
          rotation: -45, 
          y: -3, 
          duration, 
          ease: prefersReducedMotion ? 'none' : ease 
        });
      } else {
        gsap.to(lines[0], { 
          rotation: 0, 
          y: 0, 
          duration, 
          ease: prefersReducedMotion ? 'none' : ease 
        });
        gsap.to(lines[1], { 
          rotation: 0, 
          y: 0, 
          duration, 
          ease: prefersReducedMotion ? 'none' : ease 
        });
      }
    }

    if (menu) {
      if (newState) {
        gsap.set(menu, { visibility: 'visible' });
        
        if (prefersReducedMotion) {
          gsap.set(menu, { opacity: 1, x: 0, scaleX: 1 });
        } else {
          gsap.fromTo(
            menu,
            { opacity: 0, x: -320, scaleX: 0.8 },
            {
              opacity: 1,
              x: 0,
              scaleX: 1,
              duration: isMobile ? 0.3 : 0.4,
              ease,
              transformOrigin: 'left center'
            }
          );
        }
      } else {
        if (prefersReducedMotion) {
          gsap.set(menu, { opacity: 0, visibility: 'hidden' });
        } else {
          gsap.to(menu, {
            opacity: 0,
            x: -320,
            scaleX: 0.8,
            duration: isMobile ? 0.2 : 0.3,
            ease,
            transformOrigin: 'left center',
            onComplete: () => {
              gsap.set(menu, { visibility: 'hidden' });
            }
          });
        }
      }
    }

    onMobileMenuClick?.();
  };

  const isExternalLink = (href: string) =>
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('#');

  const isRouterLink = (href?: string) => href && !isExternalLink(href);

  const cssVars = {
    ['--base']: baseColor,
    ['--pill-bg']: pillColor,
    ['--hover-text']: hoveredPillTextColor,
    ['--pill-text']: resolvedPillTextColor,
    ['--nav-h']: '42px',
    ['--logo']: '36px',
    ['--pill-pad-x']: pillPaddingX !== undefined ? (typeof pillPaddingX === 'number' ? `${pillPaddingX}px` : pillPaddingX) : '18px',
    ['--pill-gap']: pillGap !== undefined ? (typeof pillGap === 'number' ? `${pillGap}px` : pillGap) : '3px'
  } as React.CSSProperties;

  const wrapperClass = position === 'static'
    ? (placement === 'center'
        ? 'w-auto'
        : 'w-auto')
    : (placement === 'center'
        ? 'absolute top-[1em] left-1/2 -translate-x-1/2 z-[1000] md:w-auto'
        : 'absolute top-[1em] z-[1000] w-full left-0 md:w-auto md:left-auto');

  return (
    <div className={wrapperClass}>
      <nav
        className={`w-full md:w-max flex items-center justify-between md:justify-start box-border px-4 md:px-0 ${className}`}
        aria-label="Primary"
        style={cssVars}
      >
        {/* Mobile hamburger menu - moved to left */}
        <button
          ref={hamburgerRef}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
          aria-expanded={isMobileMenuOpen}
          className="md:hidden rounded-full border-0 flex flex-col items-center justify-center gap-1 cursor-pointer p-0 relative"
          style={{
            width: 'var(--nav-h)',
            height: 'var(--nav-h)',
            background: 'var(--base, #000)'
          }}
        >
          <span
            className="hamburger-line w-4 h-0.5 rounded origin-center transition-all duration-&lsqb;10ms&rsqb; ease-&lsqb;cubic-bezier(0.25,0.1,0.25,1)&rsqb;"
            style={{ background: 'var(--pill-bg, #fff)' }}
          />
          <span
            className="hamburger-line w-4 h-0.5 rounded origin-center transition-all duration-&lsqb;10ms&rsqb; ease-&lsqb;cubic-bezier(0.25,0.1,0.25,1)&rsqb;"
            style={{ background: 'var(--pill-bg, #fff)' }}
          />
        </button>

        {showLogo && (isRouterLink(items?.[0]?.href) ? (
          <Link
            to={items[0].href}
            aria-label="Home"
            onMouseEnter={handleLogoEnter}
            role="menuitem"
            ref={el => {
              logoRef.current = el;
            }}
            className="rounded-full p-2 inline-flex items-center justify-center overflow-hidden"
            style={{
              width: 'var(--nav-h)',
              height: 'var(--nav-h)',
              background: 'var(--base, #000)'
            }}
          >
            <img src={logo} alt={logoAlt} ref={logoImgRef} className="w-full h-full object-cover block" />
          </Link>
        ) : (
          <a
            href={items?.[0]?.href || '#'}
            aria-label="Home"
            onMouseEnter={handleLogoEnter}
            ref={el => {
              logoRef.current = el;
            }}
            className="rounded-full p-2 inline-flex items-center justify-center overflow-hidden"
            style={{
              width: 'var(--nav-h)',
              height: 'var(--nav-h)',
              background: 'var(--base, #000)'
            }}
          >
            <img src={logo} alt={logoAlt} ref={logoImgRef} className="w-full h-full object-cover block" />
          </a>
        ))}

        <div
          ref={navItemsRef}
          className="relative items-center rounded-full hidden md:flex ml-2"
          style={{
            height: 'var(--nav-h)',
            background: 'var(--base, #000)'
          }}
        >
          <ul
            role="menubar"
            className="list-none flex items-stretch m-0 p-[3px] h-full"
            style={{ gap: 'var(--pill-gap)' }}
          >
            {items.map((item, i) => {
              const isActive = activeHref === item.href;

              const pillStyle: React.CSSProperties = {
                background: 'var(--pill-bg, #fff)',
                color: 'var(--pill-text, var(--base, #000))',
                paddingLeft: 'var(--pill-pad-x)',
                paddingRight: 'var(--pill-pad-x)'
              };

              const PillContent = (
                <>
                  <span
                    className="hover-circle absolute left-1/2 bottom-0 rounded-full z-[1] block pointer-events-none"
                    style={{
                      background: 'var(--base, #000)',
                      willChange: 'transform'
                    }}
                    aria-hidden="true"
                    ref={el => {
                      circleRefs.current[i] = el;
                    }}
                  />
                  <span className="label-stack relative inline-block leading-[1] z-[2]">
                    <span
                      className="pill-label relative z-[2] inline-block leading-[1]"
                      style={{ willChange: 'transform' }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="pill-label-hover absolute left-0 top-0 z-[3] inline-block"
                      style={{
                        color: 'var(--hover-text, #fff)',
                        willChange: 'transform, opacity'
                      }}
                      aria-hidden="true"
                    >
                      {item.label}
                    </span>
                  </span>
                  {isActive && (
                    <span
                      className="absolute left-1/2 -bottom-[6px] -translate-x-1/2 w-3 h-3 rounded-full z-[4]"
                      style={{ background: 'var(--base, #000)' }}
                      aria-hidden="true"
                    />
                  )}
                </>
              );

              const basePillClasses =
                'relative overflow-hidden inline-flex items-center justify-center h-full no-underline rounded-full box-border font-semibold text-[16px] leading-[0] uppercase tracking-[0.2px] whitespace-nowrap cursor-pointer px-0';

              return (
                <li key={item.href} role="none" className="flex h-full">
                  {isRouterLink(item.href) ? (
                    <Link
                      role="menuitem"
                      to={item.href}
                      className={basePillClasses}
                      style={pillStyle}
                      aria-label={item.ariaLabel || item.label}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                    >
                      {PillContent}
                    </Link>
                  ) : (
                    <a
                      role="menuitem"
                      href={item.href}
                      className={basePillClasses}
                      style={pillStyle}
                      aria-label={item.ariaLabel || item.label}
                      onMouseEnter={() => handleEnter(i)}
                      onMouseLeave={() => handleLeave(i)}
                    >
                      {PillContent}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Side menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-[999]"
          onClick={toggleMobileMenu}
        />
      )}
      
      <div
        ref={mobileMenuRef}
        className="md:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] rounded-r-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] z-[1000] origin-left"
        style={{
          ...cssVars,
          background: 'rgba(37,99,235,0.96)'
        }}
      >
        <div className="p-6 pt-20 relative">
          <div className="absolute top-4 right-4">
            <button
              onClick={toggleMobileMenu}
              aria-label="Close menu"
              className="rounded-full bg-white/90 text-blue-700 w-9 h-9 inline-flex items-center justify-center text-lg font-bold shadow hover:bg-white transition-colors"
            >
              ‹
            </button>
          </div>
          <h3 className="text-lg font-semibold mb-6 text-white">Menu</h3>
          <ul className="list-none m-0 flex flex-col gap-2">
            {items.map(item => {
              const defaultStyle: React.CSSProperties = {
                background: 'transparent',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.12)'
              };
              const hoverIn = (e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.92)';
                (e.currentTarget as HTMLElement).style.color = '#1e3a8a';
              };
              const hoverOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
                e.currentTarget.style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.color = '#ffffff';
              };

              const linkClasses =
                'block py-4 px-6 text-[16px] font-medium rounded-xl transition-all duration-200 ease-&lsqb;cubic-bezier(0.25,0.1,0.25,1)&rsqb; touch-manipulation backdrop-blur-[1px]';

            return (
              <li key={item.href}>
                {isRouterLink(item.href) ? (
                  <Link
                    to={item.href}
                    className={linkClasses}
                    style={defaultStyle}
                    onMouseEnter={hoverIn}
                    onMouseLeave={hoverOut}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    className={linkClasses}
                    style={defaultStyle}
                    onMouseEnter={hoverIn}
                    onMouseLeave={hoverOut}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                )}
              </li>
            );
          })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PillNav;
