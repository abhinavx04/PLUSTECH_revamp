import React, { useRef, useEffect, useCallback } from 'react';

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
    { id: 25, src: '/company logos/motherson.png', alt: 'Motherson' },
    { id: 26, src: '/company logos/belrise-industries.png', alt: 'Belrise Industries' },
    { id: 27, src: '/company logos/orient-electric.png', alt: 'Orient Electric' },
    { id: 28, src: '/company logos/united-industires.png', alt: 'United Industries' },
    { id: 29, src: '/company logos/runner.png', alt: 'Runner' },
    { id: 30, src: '/company logos/hyundai.png', alt: 'Hyundai' },
  ];

  const trackRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const halfWidthRef = useRef(0);
  const startTimeRef = useRef(0);

  const SPEED = 80;

  const measure = useCallback(() => {
    if (trackRef.current) {
      halfWidthRef.current = Math.floor(trackRef.current.scrollWidth / 2);
    }
  }, []);

  useEffect(() => {
    measure();

    const images = trackRef.current?.querySelectorAll('img') ?? [];
    let loaded = 0;
    const total = images.length;
    const onLoad = () => {
      loaded++;
      if (loaded >= total) measure();
    };
    images.forEach((img) => {
      if (img.complete) loaded++;
      else img.addEventListener('load', onLoad);
    });
    if (loaded >= total) measure();

    window.addEventListener('resize', measure);

    const tick = (time: number) => {
      if (startTimeRef.current === 0) startTimeRef.current = time;

      if (halfWidthRef.current > 0) {
        const elapsed = time - startTimeRef.current;
        const pos = ((elapsed / 1000) * SPEED) % halfWidthRef.current;

        if (trackRef.current) {
          const dpr = window.devicePixelRatio || 1;
          const snapped = Math.round(pos * dpr) / dpr;
          trackRef.current.style.transform = `translate3d(${-snapped}px, 0, 0)`;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', measure);
      images.forEach((img) => img.removeEventListener('load', onLoad));
    };
  }, [measure]);

  const duplicatedLogos = [...logos, ...logos];

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4 sm:gap-6 px-4 sm:px-0 font-sans">
      <h2 className="text-black/70 text-center text-xl sm:text-2xl md:text-3xl font-semibold font-sans">
        Trusted by leading companies
      </h2>
      <div
        className="w-full mx-auto relative overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 z-10 bg-gradient-to-r from-blue-50 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 z-10 bg-gradient-to-l from-blue-50 to-transparent" />

        <div
          ref={trackRef}
          className="flex w-max py-4"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            willChange: 'transform',
            transform: 'translate3d(0, 0, 0)',
          }}
        >
          {duplicatedLogos.map((logo, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-32 xs:w-40 sm:w-52 md:w-56 h-16 xs:h-20 sm:h-24 md:h-28 mx-3 xs:mx-4 sm:mx-5 md:mx-6 flex items-center justify-center"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="max-h-full max-w-full object-contain"
                loading="eager"
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyAnimation;
