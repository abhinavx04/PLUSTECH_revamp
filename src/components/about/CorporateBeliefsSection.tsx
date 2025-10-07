import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface BeliefCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  stats: string[];
}

const beliefsData: BeliefCard[] = [
  {
    id: 'customer-satisfaction',
    title: 'Customer Satisfaction',
    description: 'Since inception, Plustech has made "customer satisfaction" and "relationships" as the foundation of our business principle. We derive immense satisfaction when customers recall our brand and entrust us with successive projects.',
    icon: '👥',
    color: 'from-blue-500 to-blue-700',
    stats: ['Foundation Principle', 'Brand Recognition', 'Successive Projects']
  },
  {
    id: 'vision',
    title: 'Our Vision',
    description: 'To become a dominant and internationally acknowledged player in surface finishing plant and equipment by adopting greener technologies and best business practices.',
    icon: '🎯',
    color: 'from-green-500 to-green-700',
    stats: ['International Recognition', 'Green Technologies', 'Best Practices']
  },
  {
    id: 'mission',
    title: 'Our Mission',
    description: 'To be the most preferred supplier for surface finishing plant by offering customized solutions in setting up energy efficient plants with consistently good quality. We believe in not just meeting customer expectations but exceeding them.',
    icon: '🚀',
    color: 'from-purple-500 to-purple-700',
    stats: ['Preferred Supplier', 'Energy Efficient', 'Exceed Expectations']
  },
  {
    id: 'quality-policy',
    title: 'Quality Policy',
    description: 'To provide professional & efficient service to customers by delivering high quality surface finishing process plants on time and at optimum price. We are committed to continual improvement and ISO 9001:2015 standards.',
    icon: '⭐',
    color: 'from-orange-500 to-orange-700',
    stats: ['Professional Service', 'ISO 9001:2015', 'Continual Improvement']
  },
  {
    id: 'peace-usp',
    title: 'PEACE USP',
    description: 'Our USP outlined under the acronym PEACE (Productivity, Efficiency, Affordability, Cost and Environment) focuses on delivering best value proposition to customers for long lasting relationships.',
    icon: '🌱',
    color: 'from-indigo-500 to-indigo-700',
    stats: ['Productivity', 'Efficiency', 'Affordability']
  },
  {
    id: 'future-plans',
    title: 'Future Plans',
    description: 'Plustech is steering geographical expansion drive to serve global industry with greener technologies and best engineering practices. We are coming up with a Technical Center and elegant office in a new business district.',
    icon: '🏢',
    color: 'from-teal-500 to-teal-700',
    stats: ['Global Expansion', 'Technical Center', 'Green Technologies']
  }
];

const CorporateBeliefsSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
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
          Corporate Beliefs Dashboard
        </motion.h2>
        <motion.p 
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Since inception, Plustech Systems and Solutions has made "customer satisfaction" and "relationships" 
          as the foundation of our business principle.
        </motion.p>
      </motion.div>

      {/* Beliefs Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {beliefsData.map((belief) => (
          <motion.div
            key={belief.id}
            variants={cardVariants}
            className="group cursor-pointer"
            whileHover={{ 
              y: -10,
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100">
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${belief.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
              
              {/* Icon Header */}
              <div className="relative p-6 bg-gradient-to-r from-gray-50 to-gray-100">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center text-3xl">
                    {belief.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold font-heading text-black">
                      {belief.title}
                    </h3>
                    <div className={`h-1 w-16 bg-gradient-to-r ${belief.color} rounded-full mt-2`} />
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 leading-relaxed mb-6">
                  {belief.description}
                </p>
                
                {/* Key Points */}
                <div className="space-y-2">
                  {belief.stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      className="flex items-center space-x-3"
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                      transition={{ duration: 0.5, delay: 0.3 + (index * 0.1) }}
                    >
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${belief.color}`} />
                      <span className="text-sm text-gray-600 font-medium">{stat}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              
              {/* Hover Effect Line */}
              <motion.div 
                className={`h-1 bg-gradient-to-r ${belief.color} rounded-full`}
                initial={{ width: 0 }}
                whileHover={{ width: "100%" }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Summary Quote */}
      <motion.div 
        className="mt-16 text-center bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-12"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <motion.h3 
          className="text-2xl font-bold font-heading text-black mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          Our Commitment
        </motion.h3>
        <motion.blockquote 
          className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed italic"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          "Our associates take pride and comfort in their engagement with Plustech. 
          We believe in not just meeting customer expectations but exceeding them."
        </motion.blockquote>
        <motion.cite 
          className="block mt-6 text-lg text-gray-500 font-semibold"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          — Plustech Systems and Solutions
        </motion.cite>
      </motion.div>
    </div>
  );
};

export default CorporateBeliefsSection;

