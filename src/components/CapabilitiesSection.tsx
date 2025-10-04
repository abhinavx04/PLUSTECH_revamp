import React, { useRef, useState } from 'react';
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
    bgColor: 'bg-white',
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
    bgColor: 'bg-gradient-to-r from-blue-50 to-blue-100',
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
    bgColor: 'bg-white',
    textColor: 'text-black',
    animationDirection: 'up'
  }
];

const CapabilitiesSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

  const getAnimationVariants = (direction: 'left' | 'right' | 'up') => {
    const baseVariants = {
      hidden: { 
        opacity: 0,
        transition: { duration: 0.6, ease: "easeIn" }
      },
      visible: { 
        opacity: 1,
        transition: { duration: 0.8, ease: "easeOut" }
      }
    };

    switch (direction) {
      case 'left':
        return {
          hidden: { 
            ...baseVariants.hidden, 
            x: -100, 
            rotateY: -15 
          },
          visible: { 
            ...baseVariants.visible, 
            x: 0, 
            rotateY: 0 
          }
        };
      case 'right':
        return {
          hidden: { 
            ...baseVariants.hidden, 
            x: 100, 
            rotateY: 15 
          },
          visible: { 
            ...baseVariants.visible, 
            x: 0, 
            rotateY: 0 
          }
        };
      case 'up':
        return {
          hidden: { 
            ...baseVariants.hidden, 
            y: 50, 
            rotateX: 10 
          },
          visible: { 
            ...baseVariants.visible, 
            y: 0, 
            rotateX: 0 
          }
        };
      default:
        return baseVariants;
    }
  };

  const imageVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.5, ease: "easeIn" }
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <div ref={sectionRef} id="capabilities" className="w-full relative overflow-hidden">
      {/* Section Header */}
      <motion.div 
        className="text-center py-12 px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-3xl md:text-4xl font-bold font-heading text-black mb-4">
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
    </div>
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
  const isItemInView = useInView(itemRef, { once: false, margin: "-50px" });

  return (
    <motion.div
      ref={itemRef}
      className={`w-full py-16 px-6 ${capability.bgColor}`}
      initial="hidden"
      animate={isItemInView ? "visible" : "hidden"}
      variants={variants}
    >
      <div className="max-w-7xl mx-auto">
        <div className="space-y-16">
          {/* Content Section */}
          <motion.div 
            className="text-left max-w-5xl mx-auto"
            variants={variants}
          >
            <div className="space-y-6">
              <h3 className={`text-3xl md:text-4xl font-bold font-heading leading-tight ${capability.textColor}`}>
                {capability.title}
              </h3>
              <p className={`text-lg md:text-xl font-body leading-relaxed ${capability.textColor === 'text-white' ? 'text-gray-200' : 'text-gray-700'}`}>
                {capability.description}
              </p>
            </div>
            
            {capability.features.length > 0 && (
              <div className="mt-12 space-y-6">
                <h4 className={`text-xl font-semibold ${capability.textColor === 'text-white' ? 'text-white' : 'text-gray-800'}`}>
                  Key Features
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {capability.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      className={`flex items-start space-x-4 p-4 rounded-xl ${capability.textColor === 'text-white' ? 'bg-white/10' : 'bg-gray-100'}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={isItemInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                      transition={{ 
                        delay: isItemInView ? 0.3 + (featureIndex * 0.1) : 0,
                        duration: 0.5,
                        ease: isItemInView ? "easeOut" : "easeIn"
                      }}
                    >
                      <div className={`w-3 h-3 rounded-full mt-2 flex-shrink-0 ${capability.textColor === 'text-white' ? 'bg-blue-400' : 'bg-[#00aeef]'}`} />
                      <span className={`text-base leading-relaxed ${capability.textColor === 'text-white' ? 'text-gray-200' : 'text-gray-700'}`}>{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Images Section */}
          <motion.div 
            className="relative"
            variants={imageVariants}
          >
            {capability.id === 'robotic-applications' ? (
              // Horizontal scroll for robotic applications (5 images)
              <RoboticImageCarousel images={capability.images} />
            ) : capability.id === 'material-handling' ? (
              // 3-column grid for material handling (3 images)
              <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-4">
                {capability.images.map((image, imageIndex) => (
                  <motion.div
                    key={imageIndex}
                    className="relative overflow-hidden rounded-2xl shadow-2xl group"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isItemInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ 
                      delay: isItemInView ? 0.2 + (imageIndex * 0.1) : 0,
                      duration: 0.6,
                      ease: isItemInView ? "easeOut" : "easeIn"
                    }}
                    style={{ width: '450px', minWidth: '450px' }}
                  >
                    <img 
                      src={image} 
                      alt={`${capability.title} ${imageIndex + 1}`}
                      className="w-full h-[400px] md:h-[450px] object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                ))}
              </div>
            ) : (
              // Large 2-column grid for digitization (2 images)
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {capability.images.map((image, imageIndex) => (
                  <motion.div
                    key={imageIndex}
                    className="relative overflow-hidden rounded-2xl shadow-2xl group"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isItemInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ 
                      delay: isItemInView ? 0.2 + (imageIndex * 0.1) : 0,
                      duration: 0.6,
                      ease: isItemInView ? "easeOut" : "easeIn"
                    }}
                  >
                    <img 
                      src={image} 
                      alt={`${capability.title} ${imageIndex + 1}`}
                      className="w-full h-[400px] md:h-[450px] object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToImage = (index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    
    const imageWidth = 450; // w-[450px] on mobile
    const gap = 24; // gap-6 = 24px
    const scrollPosition = index * (imageWidth + gap);
    
    scroller.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
    setCurrentIndex(index);
  };

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    scrollToImage(nextIndex);
  };

  const prevImage = () => {
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    scrollToImage(prevIndex);
  };

  return (
    <div className="relative">
      {/* Navigation Buttons */}
      <button
        onClick={prevImage}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 transition-all duration-200"
        aria-label="Previous image"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextImage}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white rounded-full p-3 transition-all duration-200"
        aria-label="Next image"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Image Counter */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Carousel Container */}
      <div
        ref={scrollerRef}
        className="flex overflow-hidden gap-6"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}`}</style>
        {images.map((image, i) => (
          <div key={i} className="flex-none w-[450px] md:w-[550px]">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
              <img 
                src={image} 
                alt={`Robotic application ${i + 1}`}
                className="w-full h-[350px] md:h-[400px] object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CapabilitiesSection;
