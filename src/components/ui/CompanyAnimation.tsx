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
        animation: scroll 25s linear infinite;
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


// --- Logo Components ---
// I've recreated the logos from the video using a mix of SVG and text for demonstration purposes.

const TclLogo = () => (
    <svg width="80" height="32" viewBox="0 0 100 40" className="text-gray-400" fill="currentColor">
        <path d="M0 0h40v40H0z M20 0h40v40H20z" />
    </svg>
);

const OoeLogo = () => (
    <div className="flex items-center space-x-2">
        <svg width="32" height="32" viewBox="0 0 40 40" className="text-gray-400" fill="currentColor">
            <path d="M20 0L0 34.64h40L20 0z" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
        <div className="text-gray-400 text-[10px] font-semibold uppercase leading-tight">
            Ooe<br/>Hightech<br/>Fonds
        </div>
    </div>
);

const AwsLogo = () => (
    <div className="flex items-center space-x-2">
        <div className="text-gray-400 text-[10px] text-right leading-tight">
            austria<br/>wirtschafts<br/>service
        </div>
        <div className="w-8 h-8 rounded-full border-2 border-gray-400 flex items-center justify-center text-gray-400 font-bold text-xs">
            aws
        </div>
    </div>
);

const WienLogo = () => (
    <div className="bg-gray-500/80 p-2 h-12 flex items-center justify-center">
        <div className="text-white text-[10px] text-center leading-tight">
            wirtschafts<br/>agentur<br/>wien
        </div>
    </div>
);

const FillLogo = () => (
    <svg width="64" height="24" viewBox="0 0 80 30" className="text-gray-400" fill="currentColor">
        <path d="M0 0h10v30H0z M15 0h50v10H15z M15 20h50v10H15z M70 0h10v30H70z" />
    </svg>
);

const IeLogo = () => (
    <div className="flex items-center space-x-1.5">
        <div className="text-gray-400 font-bold text-2xl tracking-tighter">
            iE
        </div>
        <div className="w-px h-6 bg-gray-400"></div>
        <div className="text-gray-400 text-[10px] uppercase leading-tight">
            Industri<br/>Engineering
        </div>
    </div>
);

const FFGLogo = () => (
    <div className="text-gray-400 font-extrabold text-3xl">
      FFG
    </div>
);

// --- Main Company Animation Component ---

const CompanyAnimation: React.FC = () => {
  const logos: { id: number; component: React.ReactNode }[] = [
    { id: 1, component: <TclLogo /> },
    { id: 2, component: <OoeLogo /> },
    { id: 3, component: <AwsLogo /> },
    { id: 4, component: <WienLogo /> },
    { id: 5, component: <FillLogo /> },
    { id: 6, component: <IeLogo /> },
    { id: 7, component: <FFGLogo /> },
  ];

  // The key to the seamless loop is to duplicate the logos.
  // The animation moves the container by -50%, which is the exact width of the first set of logos.
  // When it resets, the second set is perfectly in place, creating a seamless effect.
  const duplicatedLogos = [...logos, ...logos];

  return (
    <>
      <AnimationStyles />
      <div className="w-full flex flex-col items-center justify-center gap-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <h2 className="text-gray-300 text-center text-base font-semibold drop-shadow-lg">
          Trusted by leading companies
        </h2>
        <div className="w-full mx-auto relative overflow-hidden group"
             style={{ maskImage: 'linear-gradient(to right, transparent, white 10%, white 90%, transparent)' }}>
          <div className="flex w-max animate-scroll">
            {duplicatedLogos.map((logo, index) => (
              <div key={index} className="flex-shrink-0 w-48 h-16 mx-6 flex items-center justify-center">
                <div className="grayscale transition-all duration-300 opacity-60 group-hover:grayscale-0 group-hover:opacity-100">
                  {logo.component}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyAnimation;
