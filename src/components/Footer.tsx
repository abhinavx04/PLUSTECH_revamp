import { NAV_ITEMS } from './PageLayout';

const Footer = () => {
  return (
    <footer
      className="w-full border-t relative z-20"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 35%, rgba(255,255,255,0.02) 100%), rgba(0,0,0,0.82)',
        borderColor: 'rgba(255,255,255,0.16)',
        backdropFilter: 'saturate(140%) blur(20px)',
        WebkitBackdropFilter: 'saturate(140%) blur(20px)',
        boxShadow: '0 -10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-white">
          {/* Logo and Brand */}
          <div className="flex flex-col items-start space-y-2 md:col-span-2">
            <div className="flex items-center space-x-2">
              <img
                src="/PLUSTECH NEW.png"
                alt="Plustech Logo"
                className="h-10 w-auto brightness-110 contrast-110"
                width="184"
                height="40"
                loading="lazy"
                onError={(e) => {
                  // Fallback if image doesn't exist
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-2">
            <h2 className="text-sm md:text-base font-semibold text-white">Explore</h2>
            <ul className="space-y-1.5 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.link}
                    className="text-gray-300 hover:text-[#00aeef] transition-colors duration-200"
                    aria-label={`Navigate to ${item.label}`}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* About Subpages (from navbar submenu) */}
          <div className="flex flex-col space-y-2">
            <h2 className="text-sm md:text-base font-semibold text-white">About</h2>
            <ul className="space-y-1.5 text-sm">
              {NAV_ITEMS.find((item) => item.name === 'About')?.submenu?.map((subItem) => (
                <li key={subItem.title}>
                  <a
                    href={subItem.path}
                    className="text-gray-300 hover:text-[#00aeef] transition-colors duration-200"
                    aria-label={`Navigate to ${subItem.title}`}
                  >
                    {subItem.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info - Main Office */}
          <div className="flex flex-col space-y-2">
            <h2 className="text-sm md:text-base font-semibold text-white">Contact</h2>
            <ul className="space-y-1.5 text-xs text-gray-300">
              <li>
                <a
                  href="mailto:info@plustech.co.in"
                  className="hover:text-[#00aeef] transition-colors duration-200"
                  aria-label="Email Plustech"
                >
                  info@plustech.co.in
                </a>
              </li>
              <li>
                <a
                  href="tel:+912026114961"
                  className="hover:text-[#00aeef] transition-colors duration-200 inline-block min-h-[44px] min-w-[44px] flex items-center"
                  aria-label="Call Plustech"
                >
                  +91 20 26114961
                </a>
              </li>
              <li>
                <a
                  href="tel:+912026056366"
                  className="hover:text-[#00aeef] transition-colors duration-200 inline-block min-h-[44px] min-w-[44px] flex items-center"
                  aria-label="Call Plustech"
                >
                  +91 20 26056366
                </a>
              </li>
              <li>
                <a
                  href="tel:+918799908452"
                  className="hover:text-[#00aeef] transition-colors duration-200 inline-block min-h-[44px] min-w-[44px] flex items-center"
                  aria-label="Call Plustech"
                >
                  +91 87999 08452
                </a>
              </li>
              <li>
                <a
                  href="tel:+918799908453"
                  className="hover:text-[#00aeef] transition-colors duration-200 inline-block min-h-[44px] min-w-[44px] flex items-center"
                  aria-label="Call Plustech"
                >
                  +91 87999 08453
                </a>
              </li>
              <li className="text-gray-300 leading-tight">
                Office no. 412, Antariksh Towers, 9th Floor, Building B, Station Rd, opp. Old Zilla Parishad, Mangalwar Peth, Pune, Maharashtra 411011
              </li>
            </ul>
          </div>

          {/* Sales Office */}
          <div className="flex flex-col space-y-2">
            <h2 className="text-sm md:text-base font-semibold text-white">Sales Office</h2>
            <ul className="space-y-1.5 text-xs text-gray-300">
              <li>
                <a
                  href="tel:+919910115755"
                  className="hover:text-[#00aeef] transition-colors duration-200 inline-block min-h-[44px] min-w-[44px] flex items-center"
                  aria-label="Call Sales Office"
                >
                  +91 99 10115755
                </a>
              </li>
              <li className="text-gray-300 leading-tight">
                6.29, Level 6, Avanta Business Center, Park Centra, Block A, Sector 30, National Highway 8, Gurugram-122003
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media - Moved to bottom */}
        <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
          <div className="text-xs text-gray-400">
            © {new Date().getFullYear()} Plustech Systems and Solutions. All rights reserved.
          </div>
          <div className="flex space-x-4">
            {[
              {
                name: 'YouTube',
                href: 'https://www.youtube.com/@plustech',
                icon: (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                ),
              },
              {
                name: 'LinkedIn',
                href: 'https://www.linkedin.com/company/plustech',
                icon: (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-1.337-.03-3.06-1.866-3.06-1.867 0-2.152 1.458-2.152 2.966v5.698h-3v-11h2.884v1.508h.041c.402-.759 1.387-1.558 2.854-1.558 3.053 0 3.613 2.008 3.613 4.622v6.428z" />
                  </svg>
                ),
              },
              {
                name: 'Twitter',
                href: 'https://twitter.com/plustech',
                icon: (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.379 4.482 13.944 13.944 0 01-10.134-5.13 4.916 4.916 0 001.523 6.557 4.896 4.896 0 01-2.229-.616v.062a4.917 4.917 0 003.946 4.827 4.898 4.898 0 01-2.224.084 4.918 4.918 0 004.59 3.417 9.867 9.867 0 01-7.284 2.038 13.892 13.892 0 007.548 2.212c9.057 0 14.009-7.507 14.009-14.009 0-.213-.005-.426-.014-.637A10.012 10.012 0 0024 4.557z" />
                  </svg>
                ),
              },
              {
                name: 'Instagram',
                href: 'https://www.instagram.com/plustech',
                icon: (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.326 3.608 1.301.975.975 1.24 2.242 1.301 3.608.058 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.85c-.062 1.366-.326 2.633-1.301 3.608-.975.975-2.242 1.24-3.608 1.301-1.265.058-1.645.07-4.849.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.326-3.608-1.301-.975-.975-1.24-2.242-1.301-3.608-.058-1.265-.07-1.645-.07-4.849s.012-3.584.07-4.85c.062-1.366.326-2.633 1.301-3.608.975-.975 2.242-1.24 3.608-1.301 1.265-.058 1.645-.07 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.632.074-3.092.414-4.222 1.544-1.13 1.13-1.47 2.59-1.544 4.222-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.074 1.632.414 3.092 1.544 4.222 1.13 1.13 2.59 1.47 4.222 1.544 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.632-.074 3.092-.414 4.222-1.544 1.13-1.13 1.47-2.59 1.544-4.222.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.074-1.632-.414-3.092-1.544-4.222-1.13-1.13-2.59-1.47-4.222-1.544-1.28-.058-1.688-.072-4.947-.072zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100-2.88 1.44 1.44 0 000 2.88z" />
                  </svg>
                ),
              },
            ].map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-[#00aeef] transition-colors duration-200"
                aria-label={`Follow Plustech on ${social.name}`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;