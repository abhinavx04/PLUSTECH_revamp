import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CircularGallery from './CircularGallery';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const OurOfficeSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation
      gsap.fromTo(titleRef.current, 
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1,
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Subtitle animation
      gsap.fromTo(subtitleRef.current, 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8,
          delay: 0.2,
          scrollTrigger: {
            trigger: subtitleRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Office images data - you can replace these with your actual office photos
  const officeImages = [
    {
      image: '/office/office1.jpg', // Replace with your office photo paths
      text: 'Main Office'
    },
    {
      image: '/office/office2.jpg',
      text: 'Conference Room'
    },
    {
      image: '/office/office3.jpg',
      text: 'Design Studio'
    },
    {
      image: '/office/office4.jpg',
      text: 'Engineering Lab'
    },
    {
      image: '/office/office5.jpg',
      text: 'Production Floor'
    },
    {
      image: '/office/office6.jpg',
      text: 'Quality Control'
    },
    {
      image: '/office/office7.jpg',
      text: 'Client Meeting Room'
    },
    {
      image: '/office/office8.jpg',
      text: 'Innovation Center'
    }
  ];

  return (
    <section ref={sectionRef} className="relative py-20 px-6 sm:px-8 lg:px-12" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/5 to-transparent"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-3xl lg:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
            Our Office
          </h2>
          <p ref={subtitleRef} className="text-gray-400 text-lg max-w-3xl mx-auto" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
            Take a virtual tour of our state-of-the-art facilities where innovation meets precision in industrial finishing solutions.
          </p>
        </div>

        {/* Circular Gallery Container */}
        <div className="relative">
          <div style={{ height: '600px', position: 'relative' }}>
            <CircularGallery 
              items={officeImages}
              bend={0} 
              textColor="#ffffff" 
              borderRadius={0.05} 
              scrollSpeed={1}
              scrollEase={0.14}
              font="bold 24px Roboto Flex"
            />
          </div>
          
        </div>

        {/* Office Information */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-gray-900/30 rounded-lg border border-white/10">
            <div className="w-16 h-16 bg-[#00ddff]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏢</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
              Modern Facilities
            </h3>
            <p className="text-gray-400" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
              State-of-the-art office spaces designed for collaboration and innovation in industrial solutions.
            </p>
          </div>

          <div className="text-center p-6 bg-gray-900/30 rounded-lg border border-white/10">
            <div className="w-16 h-16 bg-[#00ddff]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔬</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
              Research & Development
            </h3>
            <p className="text-gray-400" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
              Dedicated labs and testing facilities for developing cutting-edge paintshop technologies.
            </p>
          </div>

          <div className="text-center p-6 bg-gray-900/30 rounded-lg border border-white/10">
            <div className="w-16 h-16 bg-[#00ddff]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤝</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
              Client Collaboration
            </h3>
            <p className="text-gray-400" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
              Professional meeting spaces designed for productive client consultations and project discussions.
            </p>
          </div>
        </div>

        {/* Visit CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-6" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
            Interested in visiting our facilities?
          </p>
          <button className="group px-8 py-3 border border-[#00ddff] text-[#00ddff] font-medium rounded-lg hover:bg-[#00ddff] hover:text-black transition-all duration-300 relative overflow-hidden">
            <span className="relative z-10" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>Schedule a Visit</span>
            <div className="absolute inset-0 bg-[#00ddff] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default OurOfficeSection;
