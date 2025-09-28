import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const IndustryApplications: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

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

      // Cards animation
      cardsRef.current.forEach((card, index) => {
        gsap.fromTo(card,
          { opacity: 0, y: 60, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play none none reverse"
            }
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const applications = [
    {
      title: "Automotive Sector",
      description: "Advanced paintshop solutions for automotive manufacturing, including body shops, assembly lines, and specialized coating applications.",
      features: [
        "High-volume production lines",
        "Multi-stage coating processes",
        "Quality control systems",
        "Environmental compliance"
      ],
      icon: "🚗",
      gradient: "from-blue-500/20 to-cyan-500/20"
    },
    {
      title: "General Industry",
      description: "Versatile paintshop systems for diverse industrial applications, from heavy machinery to consumer goods manufacturing.",
      features: [
        "Custom industrial solutions",
        "Heavy-duty equipment coating",
        "Specialized surface treatments",
        "Flexible production layouts"
      ],
      icon: "⚙️",
      gradient: "from-purple-500/20 to-pink-500/20"
    },
    {
      title: "Aerospace & Defense",
      description: "Precision coating systems for aerospace components, military equipment, and high-performance applications.",
      features: [
        "Precision coating systems",
        "Military-grade specifications",
        "Advanced material handling",
        "Strict quality standards"
      ],
      icon: "✈️",
      gradient: "from-green-500/20 to-emerald-500/20"
    },
    {
      title: "Marine & Offshore",
      description: "Corrosion-resistant coating solutions for marine vessels, offshore platforms, and maritime equipment.",
      features: [
        "Corrosion-resistant systems",
        "Marine-grade materials",
        "Offshore platform solutions",
        "Long-term durability"
      ],
      icon: "🚢",
      gradient: "from-orange-500/20 to-red-500/20"
    }
  ];

  return (
    <section ref={sectionRef} className="relative py-20 px-6 sm:px-8 lg:px-12" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-3xl lg:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
            Industry Applications
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
            Specialized paintshop solutions tailored for diverse industries, delivering precision, efficiency, and reliability across all sectors.
          </p>
        </div>

        {/* Applications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {applications.map((app, index) => (
            <div
              key={index}
              ref={el => { if (el) cardsRef.current[index] = el; }}
              className="group relative bg-gray-900/40 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${app.gradient} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-white/20 transition-colors duration-300">
                  <span className="text-2xl">{app.icon}</span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-white mb-3" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
                  {app.title}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4 leading-relaxed" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
                  {app.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {app.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-300 text-sm">
                      <span className="w-1.5 h-1.5 bg-[#00ddff] rounded-full mr-3 flex-shrink-0"></span>
                      <span style={{ fontFamily: 'Roboto Flex, sans-serif' }}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-6" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
            Need a custom solution for your industry?
          </p>
          <button className="group px-8 py-3 border border-[#00ddff] text-[#00ddff] font-medium rounded-lg hover:bg-[#00ddff] hover:text-black transition-all duration-300 relative overflow-hidden">
            <span className="relative z-10" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>Discuss Your Project</span>
            <div className="absolute inset-0 bg-[#00ddff] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default IndustryApplications;
