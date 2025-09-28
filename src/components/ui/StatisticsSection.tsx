import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface StatCardProps {
  number: string;
  label: string;
  icon: string;
  delay: number;
}

const StatCard: React.FC<StatCardProps> = ({ number, label, icon, delay }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set([numberRef.current, labelRef.current, iconRef.current], {
        opacity: 0,
        y: 30
      });

      gsap.set(cardRef.current, {
        opacity: 0,
        scale: 0.8,
        y: 50
      });

      // Scroll-triggered animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse"
        }
      });

      tl.to(cardRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: delay
      })
      .to(iconRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.4")
      .to(numberRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.3")
      .to(labelRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out"
      }, "-=0.2");

    }, cardRef);

    return () => ctx.revert();
  }, [delay]);

  return (
    <div 
      ref={cardRef}
      className="group relative p-8 rounded-2xl backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
      }}
    >
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute top-2 right-4 w-1 h-1 bg-cyan-400/30 rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 left-6 w-1.5 h-1.5 bg-cyan-400/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-2 w-0.5 h-0.5 bg-cyan-400/40 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Icon */}
        <div ref={iconRef} className="mb-4 flex justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400/20 to-cyan-600/20 flex items-center justify-center backdrop-blur-sm border border-cyan-400/30">
            <span className="text-2xl">{icon}</span>
          </div>
        </div>

        {/* Number */}
        <div ref={numberRef} className="mb-3">
          <span className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
            {number}
          </span>
        </div>

        {/* Label */}
        <div ref={labelRef}>
          <p className="text-gray-300 text-sm lg:text-base font-medium leading-relaxed" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
            {label}
          </p>
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );
};

const StatisticsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial state
      gsap.set(titleRef.current, {
        opacity: 0,
        y: 30
      });

      // Title animation
      gsap.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse"
        }
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const stats = [
    {
      number: "75+",
      label: "Projects Completed",
      icon: "⚙",
      delay: 0
    },
    {
      number: "17",
      label: "Years of Experience",
      icon: "◉",
      delay: 0.1
    },
    {
      number: "50+",
      label: "Countries Served",
      icon: "◯",
      delay: 0.2
    },
    {
      number: "99%",
      label: "Client Satisfaction",
      icon: "◐",
      delay: 0.3
    }
  ];

  return (
    <section ref={sectionRef} className="relative py-20 px-6 sm:px-8 lg:px-12" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 ref={titleRef} className="text-3xl lg:text-4xl font-bold text-white mb-4" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
            Our Impact in Numbers
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
            Delivering excellence across industries with proven results and unwavering commitment to quality.
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              number={stat.number}
              label={stat.label}
              icon={stat.icon}
              delay={stat.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatisticsSection;
