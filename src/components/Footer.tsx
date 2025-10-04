
const Footer = () => {
  return (
    <footer
      className="w-full border-t"
      style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 35%, rgba(255,255,255,0.02) 100%), rgba(0,0,0,0.82)',
        borderColor: 'rgba(255,255,255,0.16)',
        backdropFilter: 'saturate(140%) blur(20px)',
        WebkitBackdropFilter: 'saturate(140%) blur(20px)',
        boxShadow: '0 -10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.18), inset 0 -1px 0 rgba(255,255,255,0.06)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-white">
          {/* Logo and Brand */}
          <div className="flex flex-col items-start space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src="/newlogo.png"
                alt="Plustech Logo"
                className="h-12 w-auto brightness-110 contrast-110"
                loading="lazy"
              />
              <span
                className="font-bold text-lg tracking-wider"
                style={{
                  fontFamily: 'Orbitron, Arial, sans-serif',
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  color: '#00aeef',
                }}
              >
                PLUSTECH
              </span>
            </div>
            <p className="text-sm text-gray-300">
              Building intelligent solutions for modern manufacturing.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-lg md:text-xl font-semibold text-white">Explore</h4>
            <ul className="space-y-2 text-base md:text-lg">
              {[
                { label: 'Home', href: '/' },
                { label: 'About', href: '/about' },
                { label: 'Services', href: '/services' },
                { label: 'Contact', href: '/contact' },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-gray-300 hover:text-[#00aeef] transition-colors duration-200 transform hover:scale-105 inline-block"
                    aria-label={`Navigate to ${item.label}`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-lg md:text-xl font-semibold text-white">Contact Us</h4>
            <ul className="space-y-2 text-base md:text-lg text-gray-300">
              <li>
                <a
                  href="mailto:info@plustech.com"
                  className="hover:text-[#00aeef] transition-colors duration-200"
                  aria-label="Email Plustech"
                >
                  info@plustech.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+1-800-123-4567"
                  className="hover:text-[#00aeef] transition-colors duration-200"
                  aria-label="Call Plustech"
                >
                  +1-800-123-4567
                </a>
              </li>
              <li className="text-gray-300">
                1234 Innovation Drive,
                <br />
                Tech City, TC 12345
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-lg md:text-xl font-semibold text-white">Follow Us</h4>
            <div className="flex space-x-4">
              {[
                {
                  name: 'LinkedIn',
                  href: '#',
                  icon: (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-1.337-.03-3.06-1.866-3.06-1.867 0-2.152 1.458-2.152 2.966v5.698h-3v-11h2.884v1.508h.041c.402-.759 1.387-1.558 2.854-1.558 3.053 0 3.613 2.008 3.613 4.622v6.428z" />
                    </svg>
                  ),
                },
                {
                  name: 'Twitter',
                  href: '#',
                  icon: (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.916 4.916 0 00-8.379 4.482 13.944 13.944 0 01-10.134-5.13 4.916 4.916 0 001.523 6.557 4.896 4.896 0 01-2.229-.616v.062a4.917 4.917 0 003.946 4.827 4.898 4.898 0 01-2.224.084 4.918 4.918 0 004.59 3.417 9.867 9.867 0 01-7.284 2.038 13.892 13.892 0 007.548 2.212c9.057 0 14.009-7.507 14.009-14.009 0-.213-.005-.426-.014-.637A10.012 10.012 0 0024 4.557z" />
                    </svg>
                  ),
                },
                {
                  name: 'Instagram',
                  href: '#',
                  icon: (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.326 3.608 1.301.975.975 1.24 2.242 1.301 3.608.058 1.265.07 1.645.07 4.849s-.012 3.584-.07 4.85c-.062 1.366-.326 2.633-1.301 3.608-.975.975-2.242 1.24-3.608 1.301-1.265.058-1.645.07-4.849.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.326-3.608-1.301-.975-.975-1.24-2.242-1.301-3.608-.058-1.265-.07-1.645-.07-4.849s.012-3.584.07-4.85c.062-1.366.326-2.633 1.301-3.608.975-.975 2.242-1.24 3.608-1.301 1.265-.058 1.645-.07 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-1.632.074-3.092.414-4.222 1.544-1.13 1.13-1.47 2.59-1.544 4.222-.058 1.28-.072 1.688-.072 4.947s.014 3.667.072 4.947c.074 1.632.414 3.092 1.544 4.222 1.13 1.13 2.59 1.47 4.222 1.544 1.28.058 1.688.072 4.947.072s3.667-.014 4.947-.072c1.632-.074 3.092-.414 4.222-1.544 1.13-1.13 1.47-2.59 1.544-4.222.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.074-1.632-.414-3.092-1.544-4.222-1.13-1.13-2.59-1.47-4.222-1.544-1.28-.058-1.688-.072-4.947-.072zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100-2.88 1.44 1.44 0 000 2.88z" />
                    </svg>
                  ),
                },
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-300 hover:text-[#00aeef] transition-colors duration-200 transform hover:scale-125"
                  aria-label={`Follow Plustech on ${social.name}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm text-gray-400">
          © 2025 Plustech Systems and Solutions. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;