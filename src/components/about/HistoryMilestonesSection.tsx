import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
  category: 'founding' | 'expansion' | 'innovation' | 'achievement';
  icon: string;
  color: string;
}

const milestonesData: Milestone[] = [
  {
    id: 'founding',
    year: '1998',
    title: 'Company Founded',
    description: 'PlusTech Systems and Solutions was established with a vision to revolutionize surface finishing in manufacturing.',
    category: 'founding',
    icon: '',
    color: 'from-blue-500 to-blue-700'
  },
  {
    id: 'first-project',
    year: '2001',
    title: 'First Major Project',
    description: 'Successfully delivered our first integrated paint shop for a leading automotive manufacturer.',
    category: 'achievement',
    icon: '',
    color: 'from-green-500 to-green-700'
  },
  {
    id: 'iso-certification',
    year: '2005',
    title: 'ISO 9001 Certification',
    description: 'Achieved ISO 9001:2000 certification, establishing our commitment to quality management systems.',
    category: 'achievement',
    icon: '',
    color: 'from-purple-500 to-purple-700'
  },
  {
    id: 'expansion',
    year: '2008',
    title: 'International Expansion',
    description: 'Expanded operations internationally, establishing partnerships with global manufacturing leaders.',
    category: 'expansion',
    icon: '',
    color: 'from-orange-500 to-orange-700'
  },
  {
    id: 'robotics-introduction',
    year: '2012',
    title: 'Robotic Solutions Launch',
    description: 'Introduced advanced robotic painting systems, revolutionizing precision coating applications.',
    category: 'innovation',
    icon: '',
    color: 'from-cyan-500 to-cyan-700'
  },
  {
    id: 'digitization',
    year: '2016',
    title: 'Digital Transformation',
    description: 'Launched Industry 4.0 solutions and smart factory implementations for connected manufacturing.',
    category: 'innovation',
    icon: '',
    color: 'from-indigo-500 to-indigo-700'
  },
  {
    id: 'sustainability',
    year: '2019',
    title: 'Sustainability Initiative',
    description: 'Implemented comprehensive sustainability programs and eco-friendly manufacturing solutions.',
    category: 'innovation',
    icon: '',
    color: 'from-teal-500 to-teal-700'
  },
  {
    id: '25-years',
    year: '2023',
    title: '25 Years of Excellence',
    description: 'Celebrated 25 years of innovation, delivering over 200 successful projects across multiple industries.',
    category: 'achievement',
    icon: '',
    color: 'from-pink-500 to-pink-700'
  }
];

const categoryColors = {
  founding: 'bg-blue-100 text-blue-800 border-blue-200',
  expansion: 'bg-orange-100 text-orange-800 border-orange-200',
  innovation: 'bg-purple-100 text-purple-800 border-purple-200',
  achievement: 'bg-green-100 text-green-800 border-green-200'
};

const HistoryMilestonesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      x: -50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      x: 0,
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
          History & Milestones
        </motion.h2>
        <motion.p 
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Our journey spans over two decades of innovation, growth, and excellence in 
          delivering cutting-edge manufacturing solutions.
        </motion.p>
      </motion.div>

      {/* Timeline Container */}
      <div className="relative">
        {/* Timeline Line */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00aeef] via-blue-300 to-gray-300 transform -translate-x-1/2" />
        
        {/* Milestones */}
        <motion.div 
          className="space-y-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {milestonesData.map((milestone, index) => (
            <motion.div
              key={milestone.id}
              variants={itemVariants}
              className={`relative flex flex-col md:flex-row items-center ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } gap-8`}
            >
              {/* Timeline Node */}
              <div className="relative z-10 flex-shrink-0">
                <motion.div 
                  className="relative w-16 h-16 bg-white rounded-full shadow-lg border-4 border-[#00aeef] flex items-center justify-center"
                  whileHover={{ 
                    scale: 1.2,
                    transition: { duration: 0.3 }
                  }}
                >
                  {/* Year Badge */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <div className="bg-[#00aeef] text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                      {milestone.year}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Content Card */}
              <motion.div 
                className={`flex-1 max-w-md ${
                  index % 2 === 0 ? 'md:text-right' : 'md:text-left'
                }`}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 p-8 border border-gray-100">
                  {/* Category Badge */}
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border mb-4 ${categoryColors[milestone.category]}`}>
                    {milestone.category}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold font-heading text-black mb-4">
                    {milestone.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed">
                    {milestone.description}
                  </p>
                  
                  {/* Gradient Accent */}
                  <div className={`mt-4 h-1 bg-gradient-to-r ${milestone.color} rounded-full`} />
                </div>
              </motion.div>

              {/* Connecting Line for Mobile */}
              <div className="md:hidden absolute left-8 top-8 bottom-0 w-0.5 bg-gradient-to-b from-[#00aeef] to-transparent" />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Achievement Stats */}
      <motion.div 
        className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-8"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        {[
          { label: 'Years of Excellence', value: '25+' },
          { label: 'Projects Completed', value: '200+' },
          { label: 'Global Clients', value: '50+' },
          { label: 'Countries Served', value: '15+' }
        ].map((stat, index) => (
          <motion.div 
            key={index}
            className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ 
              duration: 0.5, 
              delay: 1 + (index * 0.1) 
            }}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.3 }
            }}
          >
            <div className="text-4xl font-bold text-[#00aeef] mb-2">
              {stat.value}
            </div>
            <div className="text-lg font-semibold text-gray-700">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Future Vision */}
      <motion.div 
        className="mt-16 text-center bg-gradient-to-r from-[#00aeef]/10 to-blue-100 rounded-2xl p-12"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <motion.h3 
          className="text-3xl font-bold font-heading text-black mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          Looking Forward
        </motion.h3>
        <motion.p 
          className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          As we continue our journey, we remain committed to pushing the boundaries of innovation, 
          embracing emerging technologies, and delivering solutions that shape the future of manufacturing.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default HistoryMilestonesSection;
