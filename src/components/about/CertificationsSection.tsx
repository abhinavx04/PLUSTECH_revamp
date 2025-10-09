import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface Certification {
  id: string;
  name: string;
  issuingBody: string;
  description: string;
  validUntil: string;
  category: 'quality' | 'financial' | 'compliance';
  icon: string;
  color: string;
  status: 'active' | 'pending' | 'renewed';
}

const certificationsData: Certification[] = [
  {
    id: 'crisil-rating',
    name: 'CRISIL Rated Organization',
    issuingBody: 'CRISIL Limited',
    description: 'CRISIL rated organization from 2019-20 for good financial strength, demonstrating our robust financial position and creditworthiness.',
    validUntil: '2024-12-31',
    category: 'financial',
    icon: '',
    color: 'from-blue-500 to-blue-700',
    status: 'active'
  },
  {
    id: 'iso-9001',
    name: 'ISO 9001:2015',
    issuingBody: 'International Organization for Standardization',
    description: 'Certified for Quality Management Systems, ensuring consistent quality in all our processes and deliverables across all operations.',
    validUntil: '2025-12-15',
    category: 'quality',
    icon: '',
    color: 'from-green-500 to-green-700',
    status: 'active'
  },
  {
    id: 'dun-bradstreet',
    name: 'Dun & Bradstreet Certification',
    issuingBody: 'Dun & Bradstreet India',
    description: 'Dun and Bradstreet certification for credit rating of 4A3, reflecting our strong financial credibility and business reliability.',
    validUntil: '2024-12-31',
    category: 'compliance',
    icon: '',
    color: 'from-purple-500 to-purple-700',
    status: 'active'
  }
];

const categoryColors = {
  quality: 'bg-green-100 text-green-800 border-green-200',
  financial: 'bg-blue-100 text-blue-800 border-blue-200',
  compliance: 'bg-purple-100 text-purple-800 border-purple-200'
};

const statusColors = {
  active: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  renewed: 'bg-blue-100 text-blue-800'
};

const CertificationsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

  const categories = ['all', ...Array.from(new Set(certificationsData.map(cert => cert.category)))];
  const statuses = ['all', ...Array.from(new Set(certificationsData.map(cert => cert.status)))];

  const filteredCertifications = certificationsData.filter(cert => {
    const categoryMatch = selectedCategory === 'all' || cert.category === selectedCategory;
    const statusMatch = selectedStatus === 'all' || cert.status === selectedStatus;
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
          Certifications Dashboard
        </motion.h2>
        <motion.p 
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Our certifications demonstrate our commitment to quality management, financial strength, and business reliability, 
          ensuring we meet the highest international and industry standards.
        </motion.p>
      </motion.div>

      {/* Dashboard Metrics */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        {[
          { label: 'Active Certifications', value: '3', color: 'bg-green-500' },
          { label: 'Years of Compliance', value: '5+', color: 'bg-blue-500' },
          { label: 'Credit Rating', value: '4A3', color: 'bg-purple-500' },
          { label: 'Renewal Success', value: '100%', color: 'bg-orange-500' }
        ].map((metric, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-xl shadow-lg p-6 text-center"
            whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
          >
            <div className={`w-12 h-12 ${metric.color} rounded-full mx-auto mb-4 flex items-center justify-center`}>
              <span className="text-white text-xl font-bold">{metric.value}</span>
            </div>
            <div className="text-sm text-gray-600 font-medium">{metric.label}</div>
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

      {/* Certifications Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {filteredCertifications.map((certification) => (
          <motion.div
            key={certification.id}
            variants={cardVariants}
            className="group cursor-pointer"
            whileHover={{ 
              y: -10,
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <div className="flex items-center justify-end mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[certification.status]}`}>
                    {certification.status}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold font-heading text-black mb-2">
                  {certification.name}
                </h3>
                
                <p className="text-sm text-gray-500 mb-4">
                  {certification.issuingBody}
                </p>
                
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${categoryColors[certification.category]}`}>
                  {certification.category}
                </span>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 leading-relaxed mb-6 text-sm">
                  {certification.description}
                </p>
                
                {/* Valid Until */}
                <div className="space-y-2">
                  <div className="text-xs text-gray-500">Valid Until:</div>
                  <div className="text-lg font-semibold text-[#00aeef]">
                    {new Date(certification.validUntil).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Validity</span>
                    <span>100%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${certification.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Compliance Summary */}
      <motion.div 
        className="mt-16 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        <div className="text-center">
          <h3 className="text-2xl font-bold font-heading text-black mb-4">
            Compliance Excellence
          </h3>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Our comprehensive certification portfolio ensures we maintain the highest standards 
            in quality management, financial transparency, and regulatory compliance across all operations.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CertificationsSection;
