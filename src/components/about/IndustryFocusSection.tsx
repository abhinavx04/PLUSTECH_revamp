import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface IndustrySector {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  stats: {
    label: string;
    value: string;
  }[];
  image: string;
}

const industryData: IndustrySector[] = [
  {
    id: 'automotive-commercial',
    name: 'Automotive / Commercial Vehicles',
    description: 'Leading provider of integrated paint shop solutions for automotive and commercial vehicle manufacturers worldwide, specializing in PT CED and painting lines up to 40 UPH.',
    icon: '',
    color: 'from-blue-600 to-blue-800',
    stats: [
      { label: 'Projects Completed', value: '150+' },
      { label: 'Years Experience', value: '25+' },
      { label: 'Capacity Range', value: 'Up to 40 UPH' }
    ],
    image: '/robotic/indoor-painting_and_door_opening.png'
  },
  {
    id: 'two-wheeler-three-wheeler',
    name: '2-Wheelers & 3-Wheeler Plant Chassis and Parts',
    description: 'Specialized robotic painting systems for motorcycles, scooters, 3-wheelers, and bicycle manufacturers with precision coating applications.',
    icon: '',
    color: 'from-purple-600 to-purple-800',
    stats: [
      { label: 'Fuel Tank Projects', value: '75+' },
      { label: 'Precision Level', value: '99.9%' },
      { label: 'Efficiency Gain', value: '40%' }
    ],
    image: '/robotic/2-wheeler-fueltanks_plaSTIC.png'
  },
  {
    id: 'automotive-plastics',
    name: 'Automotive Plastics',
    description: 'Advanced surface finishing solutions for automotive plastic components with specialized coating technologies and robotic applications.',
    icon: '',
    color: 'from-green-600 to-green-800',
    stats: [
      { label: 'Plastic Components', value: '50+' },
      { label: 'Coating Types', value: '12+' },
      { label: 'Quality Rate', value: '99.5%' }
    ],
    image: '/robotic/scooter-metal_plastic-part.png'
  },
  {
    id: 'farm-construction',
    name: 'Farm and Construction Machinery',
    description: 'Heavy-duty painting and coating solutions for farm equipment, construction machinery, and agricultural vehicle manufacturers.',
    icon: '',
    color: 'from-orange-600 to-orange-800',
    stats: [
      { label: 'Machinery Types', value: '25+' },
      { label: 'Capacity Range', value: '1-50T' },
      { label: 'Durability Level', value: 'Premium' }
    ],
    image: '/robotic/underbody_application.png'
  },
  {
    id: 'consumer-durables',
    name: 'Consumer Durables',
    description: 'Customized surface finishing solutions for consumer durable goods manufacturing with energy-efficient and cost-effective processes.',
    icon: '',
    color: 'from-cyan-600 to-cyan-800',
    stats: [
      { label: 'Product Categories', value: '20+' },
      { label: 'Energy Savings', value: '30%' },
      { label: 'Cost Reduction', value: '25%' }
    ],
    image: '/automated-customised-materialhandling/1.png'
  },
  {
    id: 'general-industry',
    name: 'General Industry',
    description: 'Versatile surface finishing solutions for diverse industrial applications and sectors with customized automation and efficiency improvements.',
    icon: '',
    color: 'from-indigo-600 to-indigo-800',
    stats: [
      { label: 'Industries Served', value: '15+' },
      { label: 'Custom Solutions', value: '200+' },
      { label: 'Success Rate', value: '98%' }
    ],
    image: '/automated-customised-materialhandling/2.png'
  }
];

const IndustryFocusSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndustry, setActiveIndustry] = useState(0);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div ref={sectionRef} className="max-w-7xl mx-auto">
      {/* Section Header */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2 
          className="text-4xl md:text-5xl font-bold font-heading text-black mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Industry Focus
        </motion.h2>
        <motion.p 
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Our core expertise spans across automotive, commercial vehicles, 2-wheelers, farm machinery, 
          consumer durables, and general industry sectors with specialized surface finishing solutions.
        </motion.p>
      </motion.div>

      {/* Industry Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {industryData.map((industry, index) => (
          <motion.div
            key={industry.id}
            variants={itemVariants}
            className={`relative group cursor-pointer transition-all duration-500 ${
              activeIndustry === index ? 'scale-105 z-10' : 'scale-100'
            }`}
            onClick={() => setActiveIndustry(index)}
            whileHover={{ 
              y: -5,
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`relative h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 ${
              activeIndustry === index ? 'border-[#00aeef]' : 'border-gray-100 hover:border-gray-200'
            }`}>
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${industry.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
              
              {/* Content */}
              <div className="relative p-8 h-full flex flex-col">
                {/* Header */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold font-heading text-black">
                    {industry.name}
                  </h3>
                </div>
                
                {/* Description */}
                <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                  {industry.description}
                </p>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  {industry.stats.map((stat, statIndex) => (
                    <motion.div 
                      key={statIndex}
                      className="text-center p-3 bg-gray-50 rounded-lg"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: 0.3 + (statIndex * 0.1) 
                      }}
                    >
                      <div className={`text-xl font-bold bg-gradient-to-r ${industry.color} bg-clip-text text-transparent`}>
                        {stat.value}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {/* Active Indicator */}
                {activeIndustry === index && (
                  <motion.div 
                    className="absolute top-4 right-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <div className="w-3 h-3 bg-[#00aeef] rounded-full shadow-lg" />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Active Industry Showcase */}
      <motion.div 
        className="relative"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Image */}
            <motion.div 
              className="relative overflow-hidden rounded-xl shadow-lg"
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <img 
                src={industryData[activeIndustry].image}
                alt={industryData[activeIndustry].name}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </motion.div>
            
            {/* Content */}
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <h3 className="text-2xl lg:text-3xl font-bold font-heading text-black">
                {industryData[activeIndustry].name} Solutions
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                {industryData[activeIndustry].description}
              </p>
              
              {/* Key Benefits */}
              <div className="space-y-3">
                <h4 className="text-xl font-semibold text-black">Key Benefits:</h4>
                <ul className="space-y-2">
                  {industryData[activeIndustry].stats.map((stat, index) => (
                    <motion.li 
                      key={index}
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                      transition={{ duration: 0.5, delay: 1.2 + (index * 0.1) }}
                    >
                      <div className="w-2 h-2 bg-[#00aeef] rounded-full" />
                      <span className="text-gray-700">
                        <strong>{stat.value}</strong> {stat.label}
                      </span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default IndustryFocusSection;
