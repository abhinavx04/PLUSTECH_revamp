import React from 'react';

// This component injects the necessary CSS keyframes and animation classes into the document's head.
// This is a common pattern for single-file components that need custom animations.
const AnimationStyles = () => {
  React.useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes scroll {
        to {
          /* This moves the container to the left by half of its total width, which is the width of one full set of logos. */
          transform: translate(-50%);
        }
      }
      .animate-scroll {
        /* The w-max class is important to allow the container to be wider than its parent. */
        animation: scroll 60s linear infinite;
      }
      /* A common UX pattern is to pause the animation on hover. */
      .group:hover .animate-scroll {
        animation-play-state: paused;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  return null;
};

// Company logos data with image paths
const companyLogos = [
  {
    id: 1,
    name: "ACE Designer",
    image: "/company logos/ace-designer-664-removebg-preview.png"
  },
  {
    id: 2,
    name: "Ashok Leyland",
    image: "/company logos/ashok-leyland-23-removebg-preview.png"
  },
  {
    id: 3,
    name: "Badve Group",
    image: "/company logos/badve-group-new-removebg-preview.png"
  },
  {
    id: 4,
    name: "Bajaj",
    image: "/company logos/bajaj_new-removebg-preview.png"
  },
  {
    id: 5,
    name: "Chaphekar",
    image: "/company logos/chaphekar_new-193-removebg-preview.png"
  },
  {
    id: 6,
    name: "Daimler",
    image: "/company logos/daimler_new-555-removebg-preview.png"
  },
  {
    id: 7,
    name: "Ford",
    image: "/company logos/ford-794-removebg-preview.png"
  },
  {
    id: 8,
    name: "General Motors",
    image: "/company logos/gm_new-792-removebg-preview.png"
  },
  {
    id: 9,
    name: "Jaguar",
    image: "/company logos/jagauarfinal.png"
  },
  {
    id: 10,
    name: "John Deere",
    image: "/company logos/john-deere_new-removebg-preview.png"
  },
  {
    id: 11,
    name: "Laxmi",
    image: "/company logos/laxmi_new-removebg-preview.png"
  },
  {
    id: 12,
    name: "Leyland Deere",
    image: "/company logos/leylanddeere_new-removebg-preview.png"
  },
  {
    id: 13,
    name: "Lumax DK",
    image: "/company logos/lumax-dk_new-449-removebg-preview.png"
  },
  {
    id: 14,
    name: "Mahindra",
    image: "/company logos/mahindra_new-removebg-preview.png"
  },
  {
    id: 15,
    name: "Metalman",
    image: "/company logos/metalman1-removebg-preview.png"
  },
  {
    id: 16,
    name: "Mother Sumi",
    image: "/company logos/mother-sumi-80-removebg-preview.png"
  },
  {
    id: 17,
    name: "Piaggio",
    image: "/company logos/piaggio-emblem-logo-png_seeklogo-275287-removebg-preview.png"
  },
  {
    id: 18,
    name: "Renault & Nissan",
    image: "/company logos/renault-and-nissan_new-936.jpg"
  },
  {
    id: 19,
    name: "Tata Ficosa",
    image: "/company logos/tata_ficosa_ltd-removebg-preview.png"
  },
  {
    id: 20,
    name: "Tata",
    image: "/company logos/tata-removebg-preview.png"
  },
  {
    id: 21,
    name: "Toyota",
    image: "/company logos/toyota-removebg-preview.png"
  },
  {
    id: 22,
    name: "Uttara",
    image: "/company logos/uttara_new-removebg-preview.png"
  },
  {
    id: 23,
    name: "Varroc",
    image: "/company logos/varroc_new-456-removebg-preview.png"
  },
  {
    id: 24,
    name: "Volkswagen",
    image: "/company logos/volkswagen-removebg-preview.png"
  }
];

// Logo Component
const LogoItem: React.FC<{ logo: typeof companyLogos[0] }> = ({ logo }) => (
  <div className="flex-shrink-0 w-56 sm:w-64 md:w-72 h-32 sm:h-36 md:h-40 mx-8 sm:mx-12 md:mx-16 flex items-center justify-center group relative">
    {/* Subtle glow effect */}
    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    
    {/* Logo */}
    <div className="relative z-10 transition-all duration-300 opacity-80 hover:opacity-100 w-full h-full flex items-center justify-center">
      <img
        src={logo.image}
        alt={logo.name}
        className="max-w-full max-h-full object-contain w-auto h-auto filter brightness-110 contrast-110"
        loading="lazy"
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
    </div>
    
    {/* Tooltip */}
    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
      <div className="bg-black/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md whitespace-nowrap border border-white/20">
        {logo.name}
      </div>
    </div>
  </div>
);

// --- Main Company Animation Component ---

const CompanyAnimation: React.FC = () => {
  // The key to the seamless loop is to duplicate the logos.
  // The animation moves the container by -50%, which is the exact width of the first set of logos.
  // When it resets, the second set is perfectly in place, creating a seamless effect.
  const duplicatedLogos = [...companyLogos, ...companyLogos];

  return (
    <>
      <AnimationStyles />
      <div className="w-full flex flex-col items-center justify-center gap-4 sm:gap-6 px-4 sm:px-0 py-8 sm:py-12" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
        <h2 className="text-gray-300 text-center text-xl sm:text-2xl md:text-3xl font-semibold drop-shadow-lg" style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}>
          Trusted by leading companies
        </h2>
        <div className="w-full mx-auto relative overflow-hidden group h-40 sm:h-44 md:h-48 rounded-2xl backdrop-blur-sm bg-black/10 border border-white/5"
             style={{ maskImage: 'linear-gradient(to right, transparent, white 10%, white 90%, transparent)' }}>
          <div className="flex w-max animate-scroll">
            {duplicatedLogos.map((logo, index) => (
              <LogoItem key={`${logo.id}-${index}`} logo={logo} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyAnimation;