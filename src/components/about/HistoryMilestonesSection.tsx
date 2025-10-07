import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface Milestone {
  id: string;
  year: string;
  title: string;
  description: string;
  category: 'founding' | 'expansion' | 'innovation' | 'achievement';
  icon: string;
  color: string;
  metrics: {
    label: string;
    value: string;
  }[];
}

const milestonesData: Milestone[] = [
  {
    id: 'founding',
    year: '1998',
    title: 'Company Founded',
    description: 'PlusTech Systems and Solutions was established with a vision to revolutionize surface finishing in manufacturing.',
    category: 'founding',
    icon: '🚀',
    color: 'from-blue-500 to-blue-700',
    metrics: [
      { label: 'Initial Team', value: '5' },
      { label: 'First Office', value: '1' },
      { label: 'Vision', value: 'Innovation' }
    ]
  },
  {
    id: 'first-project',
    year: '2001',
    title: 'First Major Project',
    description: 'Successfully delivered our first integrated paint shop for a leading automotive manufacturer.',
    category: 'achievement',
    icon: '🏆',
    color: 'from-green-500 to-green-700',
    metrics: [
      { label: 'Projects', value: '1' },
      { label: 'Clients', value: '1' },
      { label: 'Success Rate', value: '100%' }
    ]
  },
  {
    id: 'iso-certification',
    year: '2005',
    title: 'ISO 9001 Certification',
    description: 'Achieved ISO 9001:2000 certification, establishing our commitment to quality management systems.',
    category: 'achievement',
    icon: '📜',
    color: 'from-purple-500 to-purple-700',
    metrics: [
      { label: 'Certification', value: 'ISO 9001' },
      { label: 'Quality Level', value: 'International' },
      { label: 'Standards', value: 'Global' }
    ]
  },
  {
    id: 'expansion',
    year: '2008',
    title: 'International Expansion',
    description: 'Expanded operations internationally, establishing partnerships with global manufacturing leaders.',
    category: 'expansion',
    icon: '🌍',
    color: 'from-orange-500 to-orange-700',
    metrics: [
      { label: 'Countries', value: '3+' },
      { label: 'Partnerships', value: '10+' },
      { label: 'Global Reach', value: 'International' }
    ]
  },
  {
    id: 'robotics-introduction',
    year: '2012',
    title: 'Robotic Solutions Launch',
    description: 'Introduced advanced robotic painting systems, revolutionizing precision coating applications.',
    category: 'innovation',
    icon: '🤖',
    color: 'from-cyan-500 to-cyan-700',
    metrics: [
      { label: 'Robotic Systems', value: '15+' },
      { label: 'Precision', value: '99.9%' },
      { label: 'Innovation', value: 'Cutting-edge' }
    ]
  },
  {
    id: 'digitization',
    year: '2016',
    title: 'Digital Transformation',
    description: 'Launched Industry 4.0 solutions and smart factory implementations for connected manufacturing.',
    category: 'innovation',
    icon: '💻',
    color: 'from-indigo-500 to-indigo-700',
    metrics: [
      { label: 'Digital Solutions', value: '25+' },
      { label: 'IoT Systems', value: '50+' },
      { label: 'Efficiency Gain', value: '40%' }
    ]
  },
  {
    id: 'sustainability',
    year: '2019',
    title: 'Sustainability Initiative',
    description: 'Implemented comprehensive sustainability programs and eco-friendly manufacturing solutions.',
    category: 'innovation',
    icon: '🌱',
    color: 'from-teal-500 to-teal-700',
    metrics: [
      { label: 'Carbon Reduction', value: '30%' },
      { label: 'Green Projects', value: '20+' },
      { label: 'Sustainability', value: 'Eco-friendly' }
    ]
  },
  {
    id: '25-years',
    year: '2023',
    title: '25 Years of Excellence',
    description: 'Celebrated 25 years of innovation, delivering over 200 successful projects across multiple industries.',
    category: 'achievement',
    icon: '🎉',
    color: 'from-pink-500 to-pink-700',
    metrics: [
      { label: 'Total Projects', value: '200+' },
      { label: 'Years', value: '25' },
      { label: 'Industries', value: '6+' }
    ]
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
  const [selectedMilestone, setSelectedMilestone] = useState(0);
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

  const currentMilestone = milestonesData[selectedMilestone];

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
          History & Milestones Dashboard
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

      {/* Timeline Navigation */}
      <motion.div 
        className="mb-12 overflow-x-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <div className="flex space-x-4 min-w-max pb-4">
          {milestonesData.map((milestone, index) => (
            <motion.button
              key={milestone.id}
              onClick={() => setSelectedMilestone(index)}
              className={`flex-shrink-0 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                selectedMilestone === index
                  ? 'bg-[#00aeef] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {milestone.year}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Selected Milestone Details */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mb-16"
        key={selectedMilestone}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Milestone Info */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-8"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${currentMilestone.color} flex items-center justify-center text-4xl`}>
              {currentMilestone.icon}
            </div>
            <div>
              <div className="text-3xl font-bold text-[#00aeef] mb-1">
                {currentMilestone.year}
              </div>
              <h3 className="text-2xl font-bold font-heading text-black">
                {currentMilestone.title}
              </h3>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border mt-2 ${categoryColors[currentMilestone.category]}`}>
                {currentMilestone.category}
              </span>
            </div>
          </div>
          
          <p className="text-gray-600 leading-relaxed mb-8">
            {currentMilestone.description}
          </p>
          
          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4">
            {currentMilestone.metrics.map((metric, index) => (
              <motion.div
                key={index}
                className="text-center p-4 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-2xl font-bold text-[#00aeef] mb-1">
                  {metric.value}
                </div>
                <div className="text-xs text-gray-600">
                  {metric.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline Visualization */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-8"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h4 className="text-xl font-bold font-heading text-black mb-6">
            Journey Timeline
          </h4>
          
          {/* Progress Bar */}
          <div className="space-y-4">
            {milestonesData.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                className={`flex items-center space-x-4 p-3 rounded-lg cursor-pointer transition-all duration-300 ${
                  selectedMilestone === index ? 'bg-[#00aeef]/10 border-2 border-[#00aeef]' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedMilestone(index)}
                whileHover={{ scale: 1.02 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div 
                  className={`w-4 h-4 rounded-full ${
                    selectedMilestone >= index ? 'bg-[#00aeef]' : 'bg-gray-300'
                  }`}
                />
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-800">
                    {milestone.year} - {milestone.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    {milestone.category}
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${milestone.color}`} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Achievement Summary */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-8"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        {[
          { label: 'Years of Excellence', value: '25+', color: 'bg-blue-500' },
          { label: 'Projects Completed', value: '200+', color: 'bg-green-500' },
          { label: 'Global Clients', value: '50+', color: 'bg-purple-500' },
          { label: 'Countries Served', value: '15+', color: 'bg-orange-500' }
        ].map((stat, index) => (
          <motion.div 
            key={index}
            className="text-center p-8 bg-white rounded-2xl shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.5, 
              delay: 1 + (index * 0.1) 
            }}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.3 }
            }}
          >
            <div className={`w-16 h-16 ${stat.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
              <span className="text-white text-2xl font-bold">{stat.value}</span>
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

