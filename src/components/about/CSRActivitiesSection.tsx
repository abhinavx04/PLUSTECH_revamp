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
    icon: '',
    color: 'from-blue-500 to-blue-700'
  },
  {
    id: 'green-manufacturing',
    title: 'Green Manufacturing Initiative',
    description: 'Implementing eco-friendly manufacturing processes, reducing carbon footprint, and promoting sustainable practices across all our operations.',
    category: 'environment',
    image: '/aboutus/Banner4-1536x1024.jpg',
    impact: '30% carbon reduction',
    year: '2023',
    icon: '',
    color: 'from-green-500 to-green-700'
  },
  {
    id: 'community-development',
    title: 'Community Development Programs',
    description: 'Supporting local communities through infrastructure development, skill training programs, and creating employment opportunities.',
    category: 'community',
    image: '/aboutus/2.png',
    impact: '15 villages supported',
    year: '2022',
    icon: '',
    color: 'from-purple-500 to-purple-700'
  },
  {
    id: 'healthcare-support',
    title: 'Healthcare Access Program',
    description: 'Providing medical facilities, health camps, and healthcare support to underprivileged communities in our operational areas.',
    category: 'healthcare',
    image: '/aboutus/Banner4-1536x1024.jpg',
    impact: '2000+ lives touched',
    year: '2023',
    icon: '',
    color: 'from-red-500 to-red-700'
  },
  {
    id: 'women-empowerment',
    title: 'Women Empowerment Initiative',
    description: 'Creating opportunities for women in manufacturing, providing technical training, and supporting women entrepreneurs.',
    category: 'community',
    image: '/aboutus/2.png',
    impact: '150+ women trained',
    year: '2022',
    icon: '',
    color: 'from-pink-500 to-pink-700'
  },
  {
    id: 'water-conservation',
    title: 'Water Conservation Project',
    description: 'Implementing water conservation techniques in manufacturing processes and supporting community water management initiatives.',
    category: 'environment',
    image: '/aboutus/Banner4-1536x1024.jpg',
    impact: '40% water savings',
    year: '2023',
    icon: '',
    color: 'from-cyan-500 to-cyan-700'
  }
];

const categoryColors = {
  education: 'bg-blue-100 text-blue-800 border-blue-200',
  environment: 'bg-green-100 text-green-800 border-green-200',
  community: 'bg-purple-100 text-purple-800 border-purple-200',
  healthcare: 'bg-red-100 text-red-800 border-red-200'
};

const CSRActivitiesSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [hoveredActivity, setHoveredActivity] = useState<string | null>(null);
  const isInView = useInView(sectionRef, { once: false, margin: "-100px" });

  const categories = ['all', ...Array.from(new Set(csrData.map(activity => activity.category)))];

  const filteredActivities = selectedCategory === 'all' 
    ? csrData 
    : csrData.filter(activity => activity.category === selectedCategory);

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
          CSR Policies & Activities
        </motion.h2>
        <motion.p 
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          We believe in giving back to society and creating positive impact through our 
          Corporate Social Responsibility initiatives across education, environment, and community development.
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
            {category === 'all' ? 'All Activities' : category.charAt(0).toUpperCase() + category.slice(1)}
          </motion.button>
        ))}
      </motion.div>

      {/* CSR Activities Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {filteredActivities.map((activity) => (
          <motion.div
            key={activity.id}
            variants={cardVariants}
            className="group cursor-pointer"
            onMouseEnter={() => setHoveredActivity(activity.id)}
            onMouseLeave={() => setHoveredActivity(null)}
            whileHover={{ 
              y: -10,
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <div className={`relative h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-2 ${
              hoveredActivity === activity.id ? 'border-[#00aeef]' : 'border-gray-100'
            }`}>
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={activity.image}
                  alt={activity.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${categoryColors[activity.category]}`}>
                    {activity.category}
                  </span>
                </div>
                
                {/* Year Badge */}
                <div className="absolute top-4 right-4 bg-[#00aeef] text-white px-3 py-1 rounded-full text-sm font-bold">
                  {activity.year}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold font-heading text-black mb-3">
                  {activity.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-4 text-sm">
                  {activity.description}
                </p>
                
                {/* Impact */}
                <div className="flex items-center justify-between">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${activity.color} text-white`}>
                    {activity.impact}
                  </div>
                  
                  {/* Learn More Button */}
                  <motion.button
                    className="text-[#00aeef] text-sm font-semibold hover:text-[#0099d4] transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Learn More →
                  </motion.button>
                </div>
              </div>
              
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${activity.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Impact Statistics */}
      <motion.div 
        className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        {[
          { label: 'Total Beneficiaries', value: '10,000+' },
          { label: 'Communities Served', value: '50+' },
          { label: 'Programs Active', value: '15+' },
          { label: 'Investment (₹ Cr)', value: '2.5+' }
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
            <div className="text-3xl font-bold text-[#00aeef] mb-2">
              {stat.value}
            </div>
            <div className="text-lg font-semibold text-gray-700">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* CSR Commitment */}
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
          Our CSR Commitment
        </motion.h3>
        <motion.p 
          className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          We are committed to creating sustainable value for all our stakeholders while making a positive 
          impact on society. Our CSR initiatives are aligned with the United Nations Sustainable Development Goals, 
          and we continuously strive to expand our social and environmental contributions.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default CSRActivitiesSection;
