import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VideoAboutSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLHeadingElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([headerRef.current, titleRef.current, textRef.current, buttonRef.current], {
        opacity: 0,
        y: 50
      });

      gsap.set(videoContainerRef.current, {
        opacity: 0,
        scale: 0.8,
        rotationY: -15
      });

      // Removed container hover animation for stability

      // Scroll-triggered animations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
          onEnter: () => {
            // Video animation
            gsap.to(videoContainerRef.current, {
              opacity: 1,
              scale: 1,
              rotationY: 0,
              duration: 1.2,
              ease: "power3.out"
            });

            // Start video playback when scrolled into view
            if (videoRef.current) {
              videoRef.current.load(); // Ensure video is loaded
              videoRef.current.play().catch((error) => {
                console.log('Video autoplay prevented:', error);
                // If autoplay fails, try again after a small delay
                setTimeout(() => {
                  if (videoRef.current) {
                    videoRef.current.play().catch(console.error);
                  }
                }, 500);
              });
            }

            // Content animations
            gsap.to(headerRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out"
            });

            gsap.to(titleRef.current, {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              delay: 0.2
            });

            gsap.to(textRef.current, {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              delay: 0.4
            });

            gsap.to(buttonRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              delay: 0.6
            });
          }
        }
      });

      // Parallax effect on scroll
      gsap.to(containerRef.current, {
        y: -100,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

      // Removed hover animations for stable card
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background blur effect */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
      
      <div className="relative z-10 w-full">
        <div 
          ref={containerRef}
          className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center min-h-[600px] p-8 lg:p-12 rounded-none bg-black/30 backdrop-blur-sm border border-white/10 shadow-2xl"
        >
          
          {/* Left Side - Video/Image (40-45% width) */}
          <div ref={videoContainerRef} className="flex-1 lg:flex-[0.45] max-w-lg">
            <div className="relative w-full h-[400px] lg:h-[500px] rounded-xl overflow-hidden shadow-2xl">
              {/* Video Player */}
              <video 
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                src="/home/aboutvideo.mp4"
                loop 
                muted 
                playsInline
                autoPlay
              >
                Your browser does not support the video tag.
              </video>
              
              {/* Subtle overlay with dots pattern */}
              <div 
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                  backgroundSize: '20px 20px'
                }}
              ></div>
            </div>
          </div>
          
          {/* Right Side - Content (55-60% width) */}
          <div ref={contentRef} className="flex-1 lg:flex-[0.55] space-y-8">
            {/* Small "About us" header */}
            <h3 ref={headerRef} className="text-sm font-medium text-gray-400 uppercase tracking-wider">
              About us
            </h3>
            
            {/* Main headline */}
            <div className="space-y-4">
              <h2 ref={titleRef} className="text-4xl lg:text-6xl font-bold text-white leading-[1.1]">
                Industrial finishing solutions.
                <br />
                <span className="text-teal-400">Plustech delivers that.</span>
              </h2>
            </div>
            
            {/* Body text */}
            <div ref={textRef} className="space-y-6 max-w-2xl">
              <p className="text-gray-300 leading-relaxed text-lg">
                Plustech is a trusted name in the industrial finishing industry, specializing in the design, engineering, procurement, construction, and commissioning of surface finishing plants.
              </p>
              
              <p className="text-gray-300 leading-relaxed text-lg">
                We deliver semi-automatic and fully automatic plants, customized to meet each customer's unique requirements. Guided by the principle of continuous improvement, we focus on understanding client needs and providing the most effective engineered solutions.
              </p>
            </div>
            
            {/* CTA Button */}
            <div className="pt-4">
              <button 
                ref={buttonRef}
                className="group px-8 py-3 border border-teal-400 text-white font-medium rounded-lg hover:bg-teal-400 hover:text-black transition-all duration-300 relative overflow-hidden"
              >
                <span className="relative z-10">More about us</span>
                <div className="absolute inset-0 bg-teal-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default VideoAboutSection;