import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface Certification {
  id: string;
  name: string;
  issuingBody: string;
  description: string;
  validUntil: string;
  category: 'quality' | 'safety' | 'environmental' | 'technical';
  icon: string;
  color: string;
}

const certificationsData: Certification[] = [
  {
    id: 'crisil-rating',
    name: 'CRISIL Rated Organization',
    issuingBody: 'CRISIL Limited',
    description: 'CRISIL rated organization from 2019-20 for good financial strength, demonstrating our robust financial position and creditworthiness.',
    validUntil: '2024-12-31',
    category: 'quality',
    icon: '',
    color: 'from-blue-500 to-blue-700'
  },
  {
    id: 'iso-9001',
    name: 'ISO 9001:2015',
    issuingBody: 'International Organization for Standardization',
    description: 'Certified for Quality Management Systems, ensuring consistent quality in all our processes and deliverables across all operations.',
    validUntil: '2025-12-15',
    category: 'quality',
    icon: '',
    color: 'from-green-500 to-green-700'
  },
  {
    id: 'dun-bradstreet',
    name: 'Dun & Bradstreet Certification',
    issuingBody: 'Dun & Bradstreet India',
    description: 'Dun and Bradstreet certification for credit rating of 4A3, reflecting our strong financial credibility and business reliability.',
    validUntil: '2024-12-31',
    category: 'quality',
    icon: '',
    color: 'from-purple-500 to-purple-700'
  }
];

const categoryColors = {
  quality: 'bg-blue-100 text-blue-800',
  safety: 'bg-red-100 text-red-800',
  environmental: 'bg-green-100 text-green-800',
  technical: 'bg-purple-100 text-purple-800'
};

const CertificationsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredCert, setHoveredCert] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

  const categories = ['all', ...Array.from(new Set(certificationsData.map(cert => cert.category)))];

  const filteredCertifications = selectedCategory === 'all' 
    ? certificationsData 
    : certificationsData.filter(cert => cert.category === selectedCategory);

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
      y: 50,
      rotateY: -15
    },
    visible: { 
      opacity: 1, 
      y: 0,
      rotateY: 0,
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
          Our Certifications
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

      {/* Category Filter */}
      <motion.div 
        className="flex flex-wrap justify-center gap-4 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        {categories.map((category) => (
          <motion.button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
              selectedCategory === category
                ? 'bg-[#00aeef] text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category === 'all' ? 'All Certifications' : category.charAt(0).toUpperCase() + category.slice(1)}
          </motion.button>
        ))}
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
            onMouseEnter={() => setHoveredCert(certification.id)}
            onMouseLeave={() => setHoveredCert(null)}
            whileHover={{ 
              y: -10,
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <div className={`relative h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 ${
              hoveredCert === certification.id ? 'border-[#00aeef]' : 'border-gray-100'
            }`}>
              {/* Flip Animation Container */}
              <div className="relative h-full w-full">
                {/* Front Side */}
                <motion.div 
                  className="absolute inset-0 p-8 flex flex-col justify-center items-center text-center"
                  animate={{ 
                    rotateY: hoveredCert === certification.id ? 180 : 0,
                    opacity: hoveredCert === certification.id ? 0 : 1
                  }}
                  transition={{ duration: 0.6 }}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold font-heading text-black mb-2">
                    {certification.name}
                  </h3>
                  
                  {/* Issuing Body */}
                  <p className="text-sm text-gray-500 mb-4">
                    {certification.issuingBody}
                  </p>
                  
                  {/* Category Badge */}
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[certification.category]}`}>
                    {certification.category}
                  </span>
                </motion.div>

                {/* Back Side */}
                <motion.div 
                  className="absolute inset-0 p-8 flex flex-col justify-center"
                  animate={{ 
                    rotateY: hoveredCert === certification.id ? 0 : -180,
                    opacity: hoveredCert === certification.id ? 1 : 0
                  }}
                  transition={{ duration: 0.6 }}
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  {/* Title */}
                  <h3 className="text-xl font-bold font-heading text-black mb-4">
                    {certification.name}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed mb-6 flex-grow">
                    {certification.description}
                  </p>
                  
                  {/* Valid Until */}
                  <div className="space-y-2">
                    <div className="text-sm text-gray-500">Valid Until:</div>
                    <div className="text-lg font-semibold text-[#00aeef]">
                      {new Date(certification.validUntil).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${certification.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
              
              {/* Corner Accent */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-[#00aeef] rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        {[
          { label: 'Active Certifications', value: '3' },
          { label: 'Years of Compliance', value: '5+' },
          { label: 'Credit Rating', value: '4A3' }
        ].map((stat, index) => (
          <motion.div 
            key={index}
            className="text-center p-6 bg-white rounded-xl shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ 
              duration: 0.5, 
              delay: 1 + (index * 0.1) 
            }}
          >
            <div className="text-3xl font-bold text-[#00aeef] mb-2">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CertificationsSection;
