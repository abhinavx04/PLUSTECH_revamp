import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

interface CapabilityItem {
  id: string;
  title: string;
  description: string;
  features: string[];
  images: string[];
  bgColor: string;
  textColor: string;
  animationDirection: 'left' | 'right' | 'up';
}

const capabilitiesData: CapabilityItem[] = [
  {
    id: 'material-handling',
    title: 'Automated Material Handling',
    description: 'Plustech deploys fully or partially automated handling solutions across various sections and operations of paint shops to boost productivity, efficiency, and optimize the plant footprint.',
    features: [],
    images: [
      '/automated-customised-materialhandling/1.png',
      '/automated-customised-materialhandling/2.png',
      '/automated-customised-materialhandling/3.png'
    ],
    bgColor: 'bg-gray-50',
    textColor: 'text-black',
    animationDirection: 'left'
  },
  {
    id: 'robotic-applications',
    title: 'Robotic Applications',
    description: 'We deliver state-of-the-art, high-precision robotic painting systems designed for blue-chip customers across a wide range of industries.',
    features: [
      'Commercial vehicle cabins — interior and exterior painting, sealer, and underbody coating',
      'Two-wheeler fuel tanks',
      'Plastic components',
      'General industrial parts'
    ],
    images: [
      '/robotic/indoor-painting_and_door_opening.png',
      '/robotic/2-wheeler-fueltanks_plaSTIC.png',
      '/robotic/scooter-metal_plastic-part.png',
      '/robotic/sealer_application.png',
      '/robotic/underbody_application.png'
    ],
    bgColor: 'bg-white',
    textColor: 'text-black',
    animationDirection: 'right'
  },
  {
    id: 'digitization',
    title: 'Digitization & Smart Factory',
    description: 'Empowering industry transformation through advanced digital solutions and Industry 4.0 technologies. Our smart factory implementations deliver real-time insights, optimize processes, and enable data-driven decision making.',
    features: [
      'Advanced process visualization and control systems',
      'Real-time performance analytics and KPI tracking',
      'IoT sensor networks and data collection',
      'Predictive maintenance systems',
      'Machine learning optimization'
    ],
    images: [
      '/digitization-smartfactory/1.jpg',
      '/digitization-smartfactory/2.jpg'
    ],
    bgColor: 'bg-gray-900',
    textColor: 'text-white',
    animationDirection: 'up'
  }
];

const CapabilitiesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const getAnimationVariants = (direction: 'left' | 'right' | 'up') => {
    const baseVariants = {
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { duration: 0.8, ease: "easeOut" }
      }
    };

    switch (direction) {
      case 'left':
        return {
          ...baseVariants,
          hidden: { ...baseVariants.hidden, x: -100, rotateY: -15 },
          visible: { ...baseVariants.visible, x: 0, rotateY: 0 }
        };
      case 'right':
        return {
          ...baseVariants,
          hidden: { ...baseVariants.hidden, x: 100, rotateY: 15 },
          visible: { ...baseVariants.visible, x: 0, rotateY: 0 }
        };
      case 'up':
        return {
          ...baseVariants,
          hidden: { ...baseVariants.hidden, y: 50, rotateX: 10 },
          visible: { ...baseVariants.visible, y: 0, rotateX: 0 }
        };
      default:
        return baseVariants;
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <section ref={sectionRef} id="capabilities" className="w-full relative overflow-hidden">
      {/* Section Header */}
      <motion.div 
        className="text-center py-12 px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-4xl md:text-5xl font-bold font-heading text-black mb-4">
          OUR CAPABILITIES
        </h2>
        <p className="text-lg md:text-xl text-gray-600 font-body max-w-3xl mx-auto">
          Transforming industries through innovative automation and digital solutions
        </p>
      </motion.div>

      {/* Capability Items */}
      {capabilitiesData.map((capability) => (
        <CapabilityItem 
          key={capability.id}
          capability={capability}
          variants={getAnimationVariants(capability.animationDirection)}
          imageVariants={imageVariants}
        />
      ))}
    </section>
  );
};

interface CapabilityItemProps {
  capability: CapabilityItem;
  variants: any;
  imageVariants: any;
}

const CapabilityItem: React.FC<CapabilityItemProps> = ({ 
  capability, 
  variants, 
  imageVariants
}) => {
  const itemRef = useRef<HTMLDivElement>(null);
  const isItemInView = useInView(itemRef, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={itemRef}
      className={`w-full py-16 px-6 ${capability.bgColor}`}
      initial="hidden"
      animate={isItemInView ? "visible" : "hidden"}
      variants={variants}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div 
            className="space-y-6"
            variants={variants}
          >
            <h3 className={`text-3xl md:text-4xl font-bold font-heading ${capability.textColor}`}>
              {capability.title}
            </h3>
            <p className={`text-lg md:text-xl font-body ${capability.textColor === 'text-white' ? 'text-gray-200' : 'text-gray-700'}`}>
              {capability.description}
            </p>
            
            {capability.features.length > 0 && (
              <ul className={`space-y-3 ${capability.textColor === 'text-white' ? 'text-gray-300' : 'text-gray-600'}`}>
                {capability.features.map((feature, featureIndex) => (
                  <motion.li 
                    key={featureIndex}
                    className="flex items-start space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={isItemInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ delay: 0.3 + (featureIndex * 0.1), duration: 0.5 }}
                  >
                    <div className={`w-2 h-2 rounded-full mt-2 ${capability.textColor === 'text-white' ? 'bg-blue-400' : 'bg-[#00aeef]'}`} />
                    <span className="text-base md:text-lg">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>

          {/* Images */}
          <motion.div 
            className="space-y-4"
            variants={imageVariants}
          >
            {capability.id === 'robotic-applications' ? (
              // Horizontal scroll for robotic applications
              <RoboticImageCarousel images={capability.images} />
            ) : (
              // Grid layout for other capabilities
              <div className={`grid gap-4 ${capability.images.length === 2 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
                {capability.images.map((image, imageIndex) => (
                  <motion.div
                    key={imageIndex}
                    className="relative overflow-hidden rounded-2xl shadow-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isItemInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ delay: 0.2 + (imageIndex * 0.1), duration: 0.6 }}
                  >
                    <img 
                      src={image} 
                      alt={`${capability.title} ${imageIndex + 1}`}
                      className="w-full h-auto max-h-[300px] object-cover hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const RoboticImageCarousel: React.FC<{ images: string[] }> = ({ images }) => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const setToMiddleBlock = () => {
      const blockWidth = scroller.scrollWidth / 3;
      scroller.scrollTo({ left: blockWidth, behavior: 'auto' });
    };

    setToMiddleBlock();

    const onWheel = (e: WheelEvent) => {
      if (scroller) {
        e.preventDefault();
        const sensitivity = 0.5;
        scroller.scrollLeft += e.deltaY * sensitivity;
      }
    };

    scroller.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      scroller.removeEventListener('wheel', onWheel);
    };
  }, []);

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex overflow-x-auto gap-4 snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}`}</style>
        {images.map((image, i) => (
          <div key={i} className="snap-center flex-none w-full md:w-1/3">
            <img 
              src={image} 
              alt={`Robotic application ${i + 1}`}
              className="w-full h-auto max-h-[300px] object-cover rounded-2xl shadow-xl hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CapabilitiesSection;
