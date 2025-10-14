import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface IndustrySector {
  id: string;
  name: string;
  description: string;
  percentage: number;
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
    percentage: 35,
    color: '#3B82F6',
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
    percentage: 25,
    color: '#8B5CF6',
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
    percentage: 15,
    color: '#10B981',
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
    percentage: 12,
    color: '#F59E0B',
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
    percentage: 8,
    color: '#06B6D4',
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
    percentage: 5,
    color: '#6366F1',
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
  const [selectedSector, setSelectedSector] = useState(0);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });


  const currentSector = industryData[selectedSector];

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
          Industry Focus Dashboard
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Interactive Pie Chart */}
        <motion.div 
          className="relative"
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold font-heading text-black mb-6 text-center">
              Industry Distribution
            </h3>
            
            {/* Pie Chart */}
            <div className="relative w-80 h-80 mx-auto mb-8">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                {industryData.map((sector, index) => {
                  const startAngle = industryData.slice(0, index).reduce((sum, s) => sum + s.percentage, 0) * 3.6;
                  const endAngle = startAngle + sector.percentage * 3.6;
                  const largeArcFlag = sector.percentage > 50 ? 1 : 0;
                  
                  const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
                  const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
                  const x2 = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180);
                  const y2 = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180);
                  
                  const pathData = [
                    `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
                  ].join(' ');
                  
                  return (
                    <motion.path
                      key={sector.id}
                      d={pathData}
                      fill={sector.color}
                      className={`cursor-pointer transition-all duration-300 ${
                        selectedSector === index ? 'opacity-100' : 'opacity-70 hover:opacity-90'
                      }`}
                      onClick={() => setSelectedSector(index)}
                      whileHover={{ scale: 1.05 }}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.8 + (index * 0.1) }}
                    />
                  );
                })}
                
                {/* Center Circle */}
                <circle cx="50" cy="50" r="15" fill="white" stroke="#e5e7eb" strokeWidth="2" />
                <text x="50" y="55" textAnchor="middle" className="text-xs font-bold text-gray-600">
                  Total
                </text>
              </svg>
            </div>
            
            {/* Legend */}
            <div className="space-y-3">
              {industryData.map((sector, index) => (
                <motion.div
                  key={sector.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedSector === index ? 'bg-gray-100 border-2 border-[#00aeef]' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedSector(index)}
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 1 + (index * 0.1) }}
                >
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: sector.color }}
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-800">{sector.name}</div>
                    <div className="text-xs text-gray-500">{sector.percentage}% of business</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Selected Sector Details */}
        <motion.div 
          className="space-y-6"
          key={selectedSector}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center space-x-4 mb-6">
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center text-white text-2xl font-bold"
                style={{ backgroundColor: currentSector.color }}
              >
                {currentSector.percentage}%
              </div>
              <div>
                <h3 className="text-2xl font-bold font-heading text-black">
                  {currentSector.name}
                </h3>
                <div className="text-sm text-gray-500">Industry Focus</div>
              </div>
            </div>
            
            <p className="text-gray-600 leading-relaxed mb-6">
              {currentSector.description}
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {currentSector.stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center p-4 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div 
                    className="text-2xl font-bold mb-1"
                    style={{ color: currentSector.color }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-600">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Industry Image */}
          <motion.div 
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <img 
              src={currentSector.image}
              alt={currentSector.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h4 className="text-lg font-semibold text-black mb-2">
                {currentSector.name} Solutions
              </h4>
              <p className="text-sm text-gray-600">
                Specialized surface finishing solutions tailored for this industry sector.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default IndustryFocusSection;

