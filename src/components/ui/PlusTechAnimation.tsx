import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PlusTechAnimation: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create arrays of span elements for the title
    const titleText = "PLUSTECH";
    const titleLetters = titleRef.current!.children;
    
    // Create arrays of span elements for the subtitle
    const subtitleText = "Developing Solutions • Delivering Quality";
    const subtitleLetters = subtitleRef.current!.children;

    // Title animation - This is the main GSAP animation for "PLUSTECH"
    gsap.fromTo(titleLetters, 
      {
        opacity: 0,
        scale: 0,
        y: 100,
        rotationX: 180
      },
      {
        duration: 1,
        opacity: 1,
        scale: 1,
        y: 0,
        rotationX: 0,
        stagger: 0.1,
        ease: "back.out(1.7)",
        transformOrigin: "0% 50% -50"
      }
    );

    // Subtitle animation
    gsap.fromTo(subtitleLetters,
      {
        opacity: 0,
        y: 20
      },
      {
        duration: 1,
        opacity: 1,
        y: 0,
        stagger: 0.05,
        ease: "power4.out",
        delay: 0.5
      }
    );

    // Removed breathing effect - keeping static title

  }, []);

  return (
    <>
      {/* Import Google Fonts - Eurostile-like alternatives */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Exo+2:wght@300;400;500;600;700;800&family=Rajdhani:wght@300;400;500;600;700&family=Audiowide&family=Chakra+Petch:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      
      <style>
        {`
          @keyframes gradient-shift {
            0%, 100% {
              background-size: 200% 200%;
              background-position: left center;
            }
            50% {
              background-size: 200% 200%;
              background-position: right center;
            }
          }

          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }

          .tagline-container {
            position: relative;
            min-height: 60vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            padding: 2rem;
          }

          .gradient-bg {
            position: absolute;
            inset: 0;
            background: transparent;
          }

          .main-title {
            font-size: clamp(3rem, 10vw, 9rem);
            font-weight: 700;
            margin-bottom: 1.5rem;
            line-height: 1.1;
            position: relative;
            z-index: 10;
            font-family: 'Audiowide', 'Orbitron', 'Exo 2', 'Rajdhani', 'Arial Black', sans-serif;
            letter-spacing: 0.1em;
            display: flex;
            justify-content: center;
            text-transform: uppercase;
          }

          .title-letter {
            display: inline-block;
            background: linear-gradient(to right, #00aeef, #00aeef);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
            filter: drop-shadow(0 0 30px rgba(0, 174, 239, 0.3));
          }

          .sub-title {
            font-size: clamp(1rem, 3vw, 1.875rem);
            color: rgb(216, 220, 227);
            letter-spacing: 0.2em;
            font-family: 'Syncopate', sans-serif;
            position: relative;
            z-index: 10;
            text-transform: uppercase;
            display: flex;
            justify-content: center;
            gap: 0.5rem;
          }

          .subtitle-letter {
            display: inline-block;
          }

          .blob {
            position: absolute;
            width: 16rem;
            height: 16rem;
            border-radius: 50%;
            filter: blur(40px);
            opacity: 0.4;
            pointer-events: none;
          }

          .blob-1 {
            top: 30%;
            left: 20%;
            background: rgba(0, 169, 157, 0.08);
            animation: blob 12s infinite;
          }

          .blob-2 {
            top: 60%;
            right: 20%;
            background: rgba(0, 169, 157, 0.06);
            animation: blob 12s infinite;
            animation-delay: 4s;
          }

          .blob-3 {
            bottom: 30%;
            left: 40%;
            background: rgba(0, 169, 157, 0.05);
            animation: blob 12s infinite;
            animation-delay: 8s;
          }

          .grain-overlay {
            position: absolute;
            inset: 0;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
            opacity: 0.05;
            pointer-events: none;
          }
        `}
      </style>

      <div className="tagline-container" ref={containerRef}>
        <div className="gradient-bg" />
        <div className="grain-overlay" />

        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />

        <div ref={titleRef} className="main-title">
          {"PLUSTECH".split('').map((letter, index) => (
            <span key={index} className="title-letter">{letter}</span>
          ))}
        </div>

        <div ref={subtitleRef} className="sub-title">
          {"Developing Solutions • Delivering Quality".split('').map((letter, index) => (
            <span key={index} className="subtitle-letter">
              {letter === ' ' ? '\u00A0' : letter}
            </span>
          ))}
        </div>
      </div>
    </>
  );
};

export default PlusTechAnimation;
