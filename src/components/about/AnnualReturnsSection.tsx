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
  metrics: {
    label: string;
    value: string;
    change: string;
    trend: 'up' | 'down' | 'stable';
  }[];
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
    color: 'from-blue-500 to-blue-700',
    metrics: [
      { label: 'Revenue Growth', value: '12.5%', change: '+2.3%', trend: 'up' },
      { label: 'Project Count', value: '28', change: '+3', trend: 'up' },
      { label: 'Client Satisfaction', value: '98%', change: '+2%', trend: 'up' }
    ]
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
    color: 'from-green-500 to-green-700',
    metrics: [
      { label: 'Revenue Growth', value: '8.3%', change: '-2.1%', trend: 'down' },
      { label: 'Project Count', value: '25', change: '+2', trend: 'up' },
      { label: 'Client Satisfaction', value: '96%', change: '+1%', trend: 'up' }
    ]
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
    color: 'from-purple-500 to-purple-700',
    metrics: [
      { label: 'Revenue Growth', value: '15.2%', change: '+8.5%', trend: 'up' },
      { label: 'Project Count', value: '22', change: '+4', trend: 'up' },
      { label: 'Client Satisfaction', value: '95%', change: '+3%', trend: 'up' }
    ]
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
    color: 'from-orange-500 to-orange-700',
    metrics: [
      { label: 'Revenue Growth', value: '-5.8%', change: '-12.3%', trend: 'down' },
      { label: 'Project Count', value: '18', change: '-4', trend: 'down' },
      { label: 'Client Satisfaction', value: '92%', change: '-2%', trend: 'down' }
    ]
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
    color: 'from-cyan-500 to-cyan-700',
    metrics: [
      { label: 'Revenue Growth', value: '18.7%', change: '+5.2%', trend: 'up' },
      { label: 'Project Count', value: '24', change: '+6', trend: 'up' },
      { label: 'Client Satisfaction', value: '94%', change: '+2%', trend: 'up' }
    ]
  }
];

const AnnualReturnsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedYear, setSelectedYear] = useState(0);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

  const currentYear = financialData[selectedYear];

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

  const widgetVariants = {
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

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return '↗️';
      case 'down': return '↘️';
      case 'stable': return '➡️';
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600 bg-green-100';
      case 'down': return 'text-red-600 bg-red-100';
      case 'stable': return 'text-gray-600 bg-gray-100';
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
          Annual Returns Dashboard
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

      {/* Year Selection */}
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
                ? 'bg-[#00aeef] text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {year.year}
          </motion.button>
        ))}
      </motion.div>

      {/* Financial Overview Widgets */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {[
          { label: 'Revenue', value: currentYear.revenue, icon: '💰', color: 'bg-blue-500' },
          { label: 'Growth', value: currentYear.growth, icon: '📈', color: 'bg-green-500' },
          { label: 'Projects', value: currentYear.projects, icon: '🏗️', color: 'bg-purple-500' },
          { label: 'Clients', value: currentYear.clients, icon: '👥', color: 'bg-orange-500' }
        ].map((metric, index) => (
          <motion.div
            key={index}
            variants={widgetVariants}
            className="bg-white rounded-2xl shadow-lg p-6 text-center"
            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
          >
            <div className={`w-16 h-16 ${metric.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
              <span className="text-white text-2xl">{metric.icon}</span>
            </div>
            <div className="text-3xl font-bold text-[#00aeef] mb-2">
              {metric.value}
            </div>
            <div className="text-lg font-semibold text-gray-700">
              {metric.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Performance Metrics */}
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        {/* Key Metrics */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-8"
          key={`metrics-${selectedYear}`}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold font-heading text-black mb-6">
            {currentYear.year} Performance Metrics
          </h3>
          
          <div className="space-y-4">
            {currentYear.metrics.map((metric, index) => (
              <motion.div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div>
                  <div className="font-semibold text-gray-800">{metric.label}</div>
                  <div className="text-2xl font-bold text-[#00aeef]">{metric.value}</div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-semibold ${getTrendColor(metric.trend)}`}>
                    <span>{getTrendIcon(metric.trend)}</span>
                    <span>{metric.change}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Year Highlights */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-8"
          key={`highlights-${selectedYear}`}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-2xl font-bold font-heading text-black mb-6">
            {currentYear.year} Highlights
          </h3>
          
          <p className="text-gray-600 leading-relaxed mb-6">
            {currentYear.description}
          </p>
          
          <div className="space-y-3">
            {currentYear.highlights.map((highlight, index) => (
              <motion.div
                key={index}
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentYear.color} mt-2 flex-shrink-0`} />
                <span className="text-gray-700 text-sm">{highlight}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Financial Chart Visualization */}
      <motion.div 
        className="bg-white rounded-2xl shadow-lg p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <h3 className="text-2xl font-bold font-heading text-black mb-8 text-center">
          Revenue Trend (Last 5 Years)
        </h3>
        
        {/* Bar Chart */}
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

