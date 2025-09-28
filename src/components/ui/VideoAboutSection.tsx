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
    <section ref={sectionRef} className="relative pt-8 pb-32 overflow-hidden" style={{ fontFamily: 'Poppins, sans-serif' }}>
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
          <div ref={contentRef} className="flex-1 lg:flex-[0.55] space-y-8 flex flex-col justify-center">
            {/* Small "About us" header */}
            <h3 ref={headerRef} className="text-sm font-medium text-gray-400 uppercase tracking-wider text-left">
              About us
            </h3>
            
            {/* Main headline */}
            <div className="space-y-6">
              <h2 ref={titleRef} className="text-4xl lg:text-5xl font-bold text-white leading-[1.2] text-left">
                About Us
              </h2>
            </div>
            
            {/* Body text */}
            <div ref={textRef} className="space-y-6 max-w-2xl">
              <p className="text-gray-300 leading-relaxed text-lg text-left">
                At Plustech Systems and Solutions, we specialize in building advanced, fully integrated paintshops for both the Automotive sector and a wide range of General Industry applications.
              </p>
              
              <p className="text-gray-300 leading-relaxed text-lg text-left">
                Our core strength lies in delivering customized, end-to-end solutions — from concept and detailed design to engineering, procurement, construction, and final commissioning. Every paintshop we create is tailored to meet the unique requirements of our customers, ensuring optimal efficiency, reliability, and long-term performance.
              </p>

              <p className="text-gray-300 leading-relaxed text-lg text-left">
                Over the years, Plustech has earned a reputation for consistency, dependability, and robust engineering. This trust has become our seal of success, as we continue to provide paintshops that not only meet but exceed client expectations.
              </p>

              <p className="text-gray-300 leading-relaxed text-lg text-left">
                Driven by the principles of innovation and continuous improvement, we work closely with our customers to understand their goals and challenges. By combining technical expertise with practical insights, we deliver solutions that enhance productivity, reduce downtime, and add real value to their operations.
              </p>

              <p className="text-gray-300 leading-relaxed text-lg text-left">
                At Plustech, our mission is simple: to be a trusted partner in surface finishing solutions, empowering industries with paintshops that perform today and evolve for tomorrow.
              </p>
            </div>
            
            {/* CTA Button */}
            <div className="pt-6">
              <button 
                ref={buttonRef}
                className="group px-8 py-3 border border-teal-400 text-white font-medium rounded-lg hover:bg-teal-400 hover:text-black transition-all duration-300 relative overflow-hidden text-left"
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