import React from 'react';
import { 
  SiToyota, 
  SiFord, 
  SiVolkswagen, 
  SiRenault, 
  SiNissan,
  SiJaguar,
  SiLandrover,
  SiMahindra
} from 'react-icons/si';

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
// Company logos as text-based representations

const BajajLogo = () => (
    <div className="text-gray-400 font-bold text-xl">
        BAJAJ
    </div>
);

const PiaggioLogo = () => (
    <div className="text-gray-400 font-bold text-lg">
        PIAGGIO
    </div>
);

const UttaraLogo = () => (
    <div className="text-gray-400 font-bold text-lg">
        UTTARA
    </div>
);

const BadveGroupLogo = () => (
    <div className="text-gray-400 font-bold text-lg">
        BADVE GROUP
    </div>
);

const TataFicosaLogo = () => (
    <div className="text-gray-400 font-bold text-lg">
        TATA FICOSA LTD
    </div>
);

const MetalmanLogo = () => (
    <div className="text-gray-400 font-bold text-lg">
        METALMAN
    </div>
);

const JohnDeereLogo = () => (
    <div className="text-gray-400 font-bold text-lg">
        JOHN DEERE
    </div>
);

const LumaxDkLogo = () => (
    <div className="text-gray-400 font-bold text-lg">
        LUMAX DK
    </div>
);

const LeylandDeereLogo = () => (
    <div className="text-gray-400 font-bold text-lg">
        LEYLAND DEERE
    </div>
);

const TataLogo = () => (
    <div className="text-gray-400 font-bold text-2xl">
        TATA
    </div>
);

const RenaultNissanLogo = () => (
    <div className="text-gray-400 flex items-center justify-center space-x-3">
        <SiRenault size={48} />
        <SiNissan size={48} />
    </div>
);

const MahindraRiseLogo = () => (
    <div className="text-gray-400 flex items-center justify-center">
        <SiMahindra size={72} />
    </div>
);

const AshokLeylandLogo = () => (
    <div className="text-gray-400 font-bold text-lg">
        ASHOK LEYLAND
    </div>
);

const ToyotaLogo = () => (
    <div className="text-gray-400 flex items-center justify-center">
        <SiToyota size={72} />
    </div>
);

const FordLogo = () => (
    <div className="text-gray-400 flex items-center justify-center">
        <SiFord size={72} />
    </div>
);

const VolkswagenLogo = () => (
    <div className="text-gray-400 flex items-center justify-center">
        <SiVolkswagen size={72} />
    </div>
);

const JaguarLogo = () => (
    <div className="text-gray-400 flex items-center justify-center">
        <SiJaguar size={72} />
    </div>
);

const LandRoverLogo = () => (
    <div className="text-gray-400 flex items-center justify-center">
        <SiLandrover size={72} />
    </div>
);

// --- Main Company Animation Component ---

const CompanyAnimation: React.FC = () => {
  const logos: { id: number; component: React.ReactNode }[] = [
    { id: 1, component: <BajajLogo /> },
    { id: 2, component: <PiaggioLogo /> },
    { id: 3, component: <UttaraLogo /> },
    { id: 4, component: <BadveGroupLogo /> },
    { id: 5, component: <TataFicosaLogo /> },
    { id: 6, component: <MetalmanLogo /> },
    { id: 7, component: <JohnDeereLogo /> },
    { id: 8, component: <LumaxDkLogo /> },
    { id: 9, component: <LeylandDeereLogo /> },
    { id: 10, component: <TataLogo /> },
    { id: 11, component: <RenaultNissanLogo /> },
    { id: 12, component: <MahindraRiseLogo /> },
    { id: 13, component: <AshokLeylandLogo /> },
    { id: 14, component: <ToyotaLogo /> },
    { id: 15, component: <FordLogo /> },
    { id: 16, component: <VolkswagenLogo /> },
    { id: 17, component: <JaguarLogo /> },
    { id: 18, component: <LandRoverLogo /> },
  ];

  // The key to the seamless loop is to duplicate the logos.
  // The animation moves the container by -50%, which is the exact width of the first set of logos.
  // When it resets, the second set is perfectly in place, creating a seamless effect.
  const duplicatedLogos = [...logos, ...logos];

  return (
    <>
      <AnimationStyles />
      <div className="w-full flex flex-col items-center justify-center gap-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <h2 className="text-gray-300 text-center text-3xl font-semibold drop-shadow-lg">
          Trusted by leading companies
        </h2>
        <div className="w-full mx-auto relative overflow-hidden group"
             style={{ maskImage: 'linear-gradient(to right, transparent, white 10%, white 90%, transparent)' }}>
          <div className="flex w-max animate-scroll">
            {duplicatedLogos.map((logo, index) => (
              <div key={index} className="flex-shrink-0 w-96 h-32 mx-12 flex items-center justify-center">
                <div className="grayscale transition-all duration-300 opacity-60 group-hover:grayscale-0 group-hover:opacity-100 scale-150">
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
