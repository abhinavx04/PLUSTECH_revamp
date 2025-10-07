import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface FinancialYear {
  id: string;
  year: string;
  revenue: string;
  growth: string;
  projects: string;
  clients: string;
  description: string;
  highlights: string[];
  color: string;
}

const financialData: FinancialYear[] = [
  {
    id: '2023',
    year: '2023',
    revenue: '₹45.2 Cr',
    growth: '+12.5%',
    projects: '28',
    clients: '15',
    description: 'Strong growth driven by expansion in international markets and new technology implementations.',
    highlights: [
      'Launched Industry 4.0 solutions',
      'Expanded to 3 new countries',
      'Achieved 25-year milestone',
      'Increased R&D investment by 40%'
    ],
    color: 'from-blue-500 to-blue-700'
  },
  {
    id: '2022',
    year: '2022',
    revenue: '₹40.1 Cr',
    growth: '+8.3%',
    projects: '25',
    clients: '14',
    description: 'Resilient performance despite global challenges, with focus on digital transformation initiatives.',
    highlights: [
      'Digital transformation acceleration',
      'Sustainability initiatives launch',
      'New certification achievements',
      'Client satisfaction score: 98%'
    ],
    color: 'from-green-500 to-green-700'
  },
  {
    id: '2021',
    year: '2021',
    revenue: '₹37.0 Cr',
    growth: '+15.2%',
    projects: '22',
    clients: '12',
    description: 'Recovery and growth phase with emphasis on automation and efficiency improvements.',
    highlights: [
      'Robotic solutions expansion',
      'Supply chain optimization',
      'Quality certifications renewed',
      'Employee count increased by 25%'
    ],
    color: 'from-purple-500 to-purple-700'
  },
  {
    id: '2020',
    year: '2020',
    revenue: '₹32.1 Cr',
    growth: '-5.8%',
    projects: '18',
    clients: '10',
    description: 'Challenging year with COVID-19 impact, but maintained core operations and client relationships.',
    highlights: [
      'Remote operations implementation',
      'Client support continuity',
      'Cost optimization measures',
      'Digital infrastructure upgrade'
    ],
    color: 'from-orange-500 to-orange-700'
  },
  {
    id: '2019',
    year: '2019',
    revenue: '₹34.1 Cr',
    growth: '+18.7%',
    projects: '24',
    clients: '11',
    description: 'Strong performance with significant growth in international markets and new technology adoption.',
    highlights: [
      'International market expansion',
      'New technology partnerships',
      'Sustainability programs launch',
      'Innovation lab establishment'
    ],
    color: 'from-cyan-500 to-cyan-700'
  }
];

const AnnualReturnsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedYear, setSelectedYear] = useState(0);
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

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.9
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

  const currentYear = financialData[selectedYear];

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
          Annual Returns
        </motion.h2>
        <motion.p 
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Our financial performance reflects our commitment to sustainable growth, 
          innovation, and delivering value to our stakeholders.
        </motion.p>
      </motion.div>

      {/* Year Selection Tabs */}
      <motion.div 
        className="flex flex-wrap justify-center gap-4 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        {financialData.map((year, index) => (
          <motion.button
            key={year.id}
            onClick={() => setSelectedYear(index)}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              selectedYear === index
                ? 'bg-[#00aeef] text-white shadow-lg scale-105'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {year.year}
          </motion.button>
        ))}
      </motion.div>

      {/* Financial Overview Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {[
          { label: 'Revenue', value: currentYear.revenue, icon: '💰' },
          { label: 'Growth', value: currentYear.growth, icon: '📈' },
          { label: 'Projects', value: currentYear.projects, icon: '🏗️' },
          { label: 'Clients', value: currentYear.clients, icon: '👥' }
        ].map((metric, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 text-center border border-gray-100"
            whileHover={{ 
              y: -5,
              transition: { duration: 0.3 }
            }}
          >
            <div className="text-4xl mb-4">{metric.icon}</div>
            <div className="text-3xl font-bold text-[#00aeef] mb-2">
              {metric.value}
            </div>
            <div className="text-lg font-semibold text-gray-700">
              {metric.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Year Details */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        {/* Description */}
        <motion.div 
          className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-lg"
          key={selectedYear}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl font-bold font-heading text-black mb-6">
            {currentYear.year} Performance
          </h3>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            {currentYear.description}
          </p>
          
          {/* Growth Indicator */}
          <div className="flex items-center space-x-4">
            <div className={`px-4 py-2 rounded-full text-white font-semibold bg-gradient-to-r ${currentYear.color}`}>
              {currentYear.growth}
            </div>
            <span className="text-gray-600 font-medium">Year-over-year growth</span>
          </div>
        </motion.div>

        {/* Highlights */}
        <motion.div 
          className="space-y-6"
          key={`highlights-${selectedYear}`}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h4 className="text-2xl font-bold font-heading text-black mb-6">
            Key Highlights
          </h4>
          
          <div className="space-y-4">
            {currentYear.highlights.map((highlight, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-4 p-4 bg-white rounded-xl shadow-md border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
              >
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${currentYear.color} mt-2 flex-shrink-0`} />
                <span className="text-gray-700 leading-relaxed">{highlight}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Financial Chart Visualization */}
      <motion.div 
        className="mt-16 bg-white rounded-2xl shadow-lg p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <h3 className="text-2xl font-bold font-heading text-black mb-8 text-center">
          Revenue Trend (Last 5 Years)
        </h3>
        
        {/* Simple Bar Chart */}
        <div className="flex items-end justify-between space-x-4 h-64">
          {financialData.map((year, index) => {
            const maxRevenue = Math.max(...financialData.map(y => parseFloat(y.revenue.replace(/[₹,Cr]/g, ''))));
            const height = (parseFloat(year.revenue.replace(/[₹,Cr]/g, '')) / maxRevenue) * 100;
            
            return (
              <motion.div
                key={year.id}
                className="flex flex-col items-center space-y-2 flex-1"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 0.8, delay: 1.2 + (index * 0.1) }}
                whileHover={{ scale: 1.05 }}
              >
                {/* Bar */}
                <div 
                  className={`w-full bg-gradient-to-t ${year.color} rounded-t-lg relative cursor-pointer transition-all duration-300 ${
                    selectedYear === index ? 'ring-4 ring-[#00aeef] ring-opacity-50' : ''
                  }`}
                  style={{ height: `${height}%` }}
                  onClick={() => setSelectedYear(index)}
                >
                  {/* Value on hover */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-gray-700 opacity-0 hover:opacity-100 transition-opacity">
                    {year.revenue}
                  </div>
                </div>
                
                {/* Year Label */}
                <span className="text-sm font-semibold text-gray-600">
                  {year.year}
                </span>
              </motion.div>
            );
          })}
        </div>
        
        {/* Chart Legend */}
        <div className="mt-8 flex justify-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-[#00aeef] rounded"></div>
            <span className="text-sm text-gray-600">Revenue (₹ Cr)</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnnualReturnsSection;
