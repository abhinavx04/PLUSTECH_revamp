import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface CSRActivity {
  id: string;
  title: string;
  description: string;
  category: 'education' | 'environment' | 'community' | 'healthcare';
  image: string;
  impact: string;
  year: string;
  icon: string;
  color: string;
  metrics: {
    label: string;
    value: string;
  }[];
  status: 'active' | 'completed' | 'planned';
}

const csrData: CSRActivity[] = [
  {
    id: 'education-initiative',
    title: 'Technical Education Support',
    description: 'Partnering with engineering colleges to provide scholarships, equipment, and mentorship programs for students pursuing manufacturing and automation studies.',
    category: 'education',
    image: '/aboutus/2.png',
    impact: '500+ students benefited',
    year: '2023',
    icon: '🎓',
    color: 'from-blue-500 to-blue-700',
    metrics: [
      { label: 'Students Helped', value: '500+' },
      { label: 'Colleges Partnered', value: '8' },
      { label: 'Scholarships Given', value: '50' }
    ],
    status: 'active'
  },
  {
    id: 'environmental-sustainability',
    title: 'Green Manufacturing Initiative',
    description: 'Implementing eco-friendly manufacturing processes, reducing carbon footprint, and promoting sustainable practices across all operations.',
    category: 'environment',
    image: '/automated-customised-materialhandling/3.png',
    impact: '30% carbon reduction',
    year: '2023',
    icon: '🌱',
    color: 'from-green-500 to-green-700',
    metrics: [
      { label: 'Carbon Reduction', value: '30%' },
      { label: 'Green Projects', value: '15' },
      { label: 'Waste Reduction', value: '40%' }
    ],
    status: 'active'
  },
  {
    id: 'community-development',
    title: 'Rural Development Program',
    description: 'Supporting rural communities through infrastructure development, skill training programs, and creating employment opportunities in manufacturing.',
    category: 'community',
    image: '/digitization-smartfactory/1.jpg',
    impact: '1000+ families supported',
    year: '2022',
    icon: '🏘️',
    color: 'from-purple-500 to-purple-700',
    metrics: [
      { label: 'Families Supported', value: '1000+' },
      { label: 'Jobs Created', value: '200+' },
      { label: 'Villages Covered', value: '25' }
    ],
    status: 'completed'
  },
  {
    id: 'healthcare-support',
    title: 'Healthcare Access Program',
    description: 'Providing healthcare facilities, medical equipment, and health awareness programs to underserved communities and our workforce.',
    category: 'healthcare',
    image: '/digitization-smartfactory/2.jpg',
    impact: '5000+ people benefited',
    year: '2023',
    icon: '🏥',
    color: 'from-red-500 to-red-700',
    metrics: [
      { label: 'People Benefited', value: '5000+' },
      { label: 'Health Camps', value: '20' },
      { label: 'Medical Equipment', value: '50' }
    ],
    status: 'active'
  },
  {
    id: 'skill-development',
    title: 'Vocational Training Centers',
    description: 'Establishing skill development centers to provide technical training and certification programs for youth and women empowerment.',
    category: 'education',
    image: '/robotic/2-wheeler-fueltanks_plaSTIC.png',
    impact: '300+ trained individuals',
    year: '2022',
    icon: '🔧',
    color: 'from-orange-500 to-orange-700',
    metrics: [
      { label: 'Trained Individuals', value: '300+' },
      { label: 'Training Centers', value: '5' },
      { label: 'Certificates Issued', value: '250' }
    ],
    status: 'completed'
  },
  {
    id: 'disaster-relief',
    title: 'Disaster Relief Support',
    description: 'Providing immediate relief and long-term rehabilitation support during natural disasters and emergency situations.',
    category: 'community',
    image: '/robotic/scooter-metal_plastic-part.png',
    impact: '2000+ families helped',
    year: '2021',
    icon: '🚑',
    color: 'from-yellow-500 to-yellow-700',
    metrics: [
      { label: 'Families Helped', value: '2000+' },
      { label: 'Relief Operations', value: '8' },
      { label: 'Funds Contributed', value: '₹50L' }
    ],
    status: 'completed'
  }
];

const categoryColors = {
  education: 'bg-blue-100 text-blue-800 border-blue-200',
  environment: 'bg-green-100 text-green-800 border-green-200',
  community: 'bg-purple-100 text-purple-800 border-purple-200',
  healthcare: 'bg-red-100 text-red-800 border-red-200'
};

const statusColors = {
  active: 'bg-green-100 text-green-800',
  completed: 'bg-blue-100 text-blue-800',
  planned: 'bg-yellow-100 text-yellow-800'
};

const CSRActivitiesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

  const categories = ['all', ...Array.from(new Set(csrData.map(activity => activity.category)))];
  const statuses = ['all', ...Array.from(new Set(csrData.map(activity => activity.status)))];

  const filteredActivities = csrData.filter(activity => {
    const categoryMatch = selectedCategory === 'all' || activity.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || activity.status === selectedStatus;
    return categoryMatch && statusMatch;
  });

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
          CSR Activities Dashboard
        </motion.h2>
        <motion.p 
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Our commitment to corporate social responsibility drives us to create positive impact 
          in education, environment, community development, and healthcare sectors.
        </motion.p>
      </motion.div>

      {/* Impact Metrics */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        {[
          { label: 'Total Beneficiaries', value: '10,000+', icon: '👥', color: 'bg-blue-500' },
          { label: 'Communities Served', value: '50+', icon: '🏘️', color: 'bg-green-500' },
          { label: 'Programs Active', value: '15+', icon: '📋', color: 'bg-purple-500' },
          { label: 'Investment (₹ Cr)', value: '2.5+', icon: '💰', color: 'bg-orange-500' }
        ].map((metric, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-6 text-center"
            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
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

      {/* Filter Controls */}
      <motion.div 
        className="flex flex-wrap justify-center gap-4 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-semibold text-gray-600 mr-4">Category:</span>
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-[#00aeef] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category === 'all' ? 'All' : category.charAt(0).toUpperCase() + category.slice(1)}
            </motion.button>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-semibold text-gray-600 mr-4">Status:</span>
          {statuses.map((status) => (
            <motion.button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                selectedStatus === status
                  ? 'bg-[#00aeef] text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Masonry Layout Grid */}
      <motion.div 
        className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {filteredActivities.map((activity) => (
          <motion.div
            key={activity.id}
            variants={cardVariants}
            className="break-inside-avoid mb-8"
            whileHover={{ 
              y: -10,
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden group cursor-pointer border border-gray-100">
              {/* Image Header */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${categoryColors[activity.category]}`}>
                    {activity.category}
                  </span>
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[activity.status]}`}>
                    {activity.status}
                  </span>
                </div>
                
                {/* Year Badge */}
                <div className="absolute bottom-4 left-4 bg-[#00aeef] text-white px-3 py-1 rounded-full text-sm font-bold">
                  {activity.year}
                </div>
                
                {/* Impact Badge */}
                <div className="absolute bottom-4 right-4 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                  {activity.impact}
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Icon and Title */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="text-2xl">{activity.icon}</div>
                  <h3 className="text-xl font-bold font-heading text-black">
                    {activity.title}
                  </h3>
                </div>
                
                <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                  {activity.description}
                </p>
                
                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3">
                  {activity.metrics.map((metric, index) => (
                    <motion.div
                      key={index}
                      className="text-center p-3 bg-gray-50 rounded-lg"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="text-lg font-bold text-[#00aeef] mb-1">
                        {metric.value}
                      </div>
                      <div className="text-xs text-gray-600">
                        {metric.label}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${activity.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* CSR Vision */}
      <motion.div 
        className="mt-16 text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-12"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <motion.h3 
          className="text-3xl font-bold font-heading text-black mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          Our CSR Vision
        </motion.h3>
        <motion.p 
          className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          We believe in creating sustainable impact through our corporate social responsibility initiatives. 
          Our commitment extends beyond business success to building stronger communities and a better future for all.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default CSRActivitiesSection;

