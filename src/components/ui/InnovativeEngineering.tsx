import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const InnovativeEngineering: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const roboticRef = useRef<HTMLDivElement>(null);
  const automatedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([titleRef.current, roboticRef.current, automatedRef.current], {
        opacity: 0,
        y: 50
      });

      // Scroll-triggered animations
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
          onEnter: () => {
            // Title animation
            gsap.to(titleRef.current, {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out"
            });

            // Robotic section animation
            gsap.to(roboticRef.current, {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: "power3.out",
              delay: 0.2
            });

            // Automated section animation
            gsap.to(automatedRef.current, {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: "power3.out",
              delay: 0.4
            });
          }
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-16 overflow-hidden bg-gray-900/40 backdrop-blur-sm" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
      {/* Background blur effect */}
      <div className="absolute inset-0 backdrop-blur-[1px]"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#00aeef' }}>
            Innovative Engineering
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-blue-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Robotic Applications */}
          <div ref={roboticRef} className="space-y-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-teal-500/10 rounded-2xl p-8 border border-gray-700/30 h-full">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Robotic Applications</h3>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-teal-400 to-blue-400 mt-2"></div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-gray-300 leading-relaxed text-base">
                  State-of-the-art high precision Robotic painting plants for major applications for blue chip customers such as:
                </p>

                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">Commercial Vehicle Cabins</h4>
                      <p className="text-gray-400 text-xs">Interior and Exterior painting, Sealer and Underbody application</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">2 Wheeler Fuel Tanks</h4>
                      <p className="text-gray-400 text-xs">Specialized coating solutions for automotive fuel systems</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold text-white text-sm">Plastic Parts & General Industry</h4>
                      <p className="text-gray-400 text-xs">Versatile applications across various industrial sectors</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-lg border border-teal-500/30">
                  <div className="flex items-center space-x-3 mb-2">
                    <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h4 className="font-semibold text-white text-sm">Key Advantages</h4>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    A well-crafted / engineered Robotic system offers tremendous advantages with their consistently 
                    <span className="text-teal-400 font-medium"> high-quality, high-volume output</span> with 
                    <span className="text-teal-400 font-medium"> minimum paint wastage</span>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Automated Material Handling */}
          <div ref={automatedRef} className="space-y-6">
            <div className="bg-gradient-to-br from-teal-500/10 to-blue-500/10 rounded-2xl p-8 border border-gray-700/30 h-full">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Automated & Customised Material Handling</h3>
                  <div className="w-16 h-0.5 bg-gradient-to-r from-blue-400 to-teal-400 mt-2"></div>
                </div>
              </div>

              <div className="space-y-6">
                <p className="text-gray-300 leading-relaxed text-base">
                  Plustech deploys fully or partially automated Handling solutions across various sections and operations of Paint shops to boost productivity, efficiency and optimise the plant footprint.
                </p>

                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Boost Productivity</h4>
                      <p className="text-gray-400 text-sm">Streamlined operations with automated workflows</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Enhance Efficiency</h4>
                      <p className="text-gray-400 text-sm">Optimized material flow and reduced manual intervention</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-blue-500 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">Optimize Plant Footprint</h4>
                      <p className="text-gray-400 text-sm">Intelligent space utilization and layout optimization</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-lg border border-blue-500/30">
                  <div className="flex items-center space-x-3 mb-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h4 className="font-semibold text-white text-sm">Solution Coverage</h4>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    Our automated handling solutions span across <span className="text-blue-400 font-medium">various sections and operations</span> of Paint shops, 
                    providing comprehensive coverage from material input to finished product handling.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InnovativeEngineering;