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
        animation: scroll 45s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  return null;
};


// --- Main Company Animation Component ---

const CompanyAnimation: React.FC = () => {
  const logos: { id: number; src: string; alt: string }[] = [
    { id: 1, src: '/company logos/bajaj_new-removebg-preview.png', alt: 'Bajaj' },
    { id: 2, src: '/company logos/piaggio_new-removebg-preview.png', alt: 'Piaggio' },
    { id: 3, src: '/company logos/uttara_new-removebg-preview.png', alt: 'Uttara' },
    { id: 4, src: '/company logos/badve-group-new-removebg-preview.png', alt: 'Badve Group' },
    { id: 5, src: '/company logos/tata_ficosa_ltd-removebg-preview.png', alt: 'Tata Ficosa Ltd' },
    { id: 6, src: '/company logos/metalman1-removebg-preview.png', alt: 'Metalman' },
    { id: 7, src: '/company logos/john-deere_new-removebg-preview.png', alt: 'John Deere' },
    { id: 8, src: '/company logos/lumax-dk_new-449-removebg-preview.png', alt: 'Lumax DK' },
    { id: 9, src: '/company logos/leylanddeere_new-removebg-preview.png', alt: 'Leyland Deere' },
    { id: 10, src: '/company logos/tata-removebg-preview.png', alt: 'Tata' },
    { id: 11, src: '/company logos/renault-and-nissan_new-936.jpg', alt: 'Renault and Nissan' },
    { id: 12, src: '/company logos/mahindra_new-removebg-preview.png', alt: 'Mahindra' },
    { id: 13, src: '/company logos/ashok-leyland-23-removebg-preview.png', alt: 'Ashok Leyland' },
    { id: 14, src: '/company logos/toyota-removebg-preview.png', alt: 'Toyota' },
    { id: 15, src: '/company logos/ford-794-removebg-preview.png', alt: 'Ford' },
    { id: 16, src: '/company logos/volkswagen-removebg-preview.png', alt: 'Volkswagen' },
    { id: 17, src: '/company logos/jagauarfinal.png', alt: 'Jaguar' },
    { id: 18, src: '/company logos/gm_new-792-removebg-preview.png', alt: 'General Motors' },
    { id: 19, src: '/company logos/daimler_new-555-removebg-preview.png', alt: 'Daimler' },
    { id: 20, src: '/company logos/varroc_new-456-removebg-preview.png', alt: 'Varroc' },
    { id: 21, src: '/company logos/mother-sumi-80-removebg-preview.png', alt: 'Motherson Sumi' },
    { id: 22, src: '/company logos/ace-designer-664-removebg-preview.png', alt: 'Ace Designers' },
    { id: 23, src: '/company logos/laxmi_new-removebg-preview.png', alt: 'Laxmi' },
    { id: 24, src: '/company logos/chaphekar_new-193-removebg-preview.png', alt: 'Chaphekar' },
  ];

  // The key to the seamless loop is to duplicate the logos.
  // The animation moves the container by -50%, which is the exact width of the first set of logos.
  // When it resets, the second set is perfectly in place, creating a seamless effect.
  const duplicatedLogos = [...logos, ...logos];

  return (
    <>
      <AnimationStyles />
      <div className="w-full flex flex-col items-center justify-center gap-4 sm:gap-6 px-4 sm:px-0" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
        <h2 className="text-black/70 text-center text-xl sm:text-2xl md:text-3xl font-semibold" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
          Trusted by leading companies
        </h2>
        <div className="w-full mx-auto relative overflow-hidden rounded-2xl border border-black/10 bg-black/5 shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
             style={{ maskImage: 'linear-gradient(to right, transparent, white 8%, white 92%, transparent)' }}>
          <div className="flex w-max animate-scroll py-4">
            {duplicatedLogos.map((logo, index) => (
              <div key={index} className="flex-shrink-0 w-40 sm:w-52 md:w-64 h-20 sm:h-24 md:h-28 mx-6 sm:mx-8 md:mx-12 flex items-center justify-center">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-full max-w-full object-contain drop-shadow"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyAnimation;
