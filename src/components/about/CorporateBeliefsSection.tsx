import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface BeliefCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
}

const beliefsData: BeliefCard[] = [
  {
    id: 'customer-satisfaction',
    title: 'Customer Satisfaction',
    description: 'Since inception, Plustech has made "customer satisfaction" and "relationships" as the foundation of our business principle. We derive immense satisfaction when customers recall our brand and entrust us with successive projects.',
    icon: '',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'vision',
    title: 'Our Vision',
    description: 'To become a dominant and internationally acknowledged player in surface finishing plant and equipment by adopting greener technologies and best business practices.',
    icon: '',
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'mission',
    title: 'Our Mission',
    description: 'To be the most preferred supplier for surface finishing plant by offering customized solutions in setting up energy efficient plants with consistently good quality. We believe in not just meeting customer expectations but exceeding them.',
    icon: '',
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'quality-policy',
    title: 'Quality Policy',
    description: 'To provide professional & efficient service to customers by delivering high quality surface finishing process plants on time and at optimum price. We are committed to continual improvement and ISO 9001:2015 standards.',
    icon: '',
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'peace-usp',
    title: 'PEACE USP',
    description: 'Our USP outlined under the acronym PEACE (Productivity, Efficiency, Affordability, Cost and Environment) focuses on delivering best value proposition to customers for long lasting relationships.',
    icon: '',
    color: 'from-indigo-500 to-blue-500'
  },
  {
    id: 'future-plans',
    title: 'Future Plans',
    description: 'Plustech is steering geographical expansion drive to serve global industry with greener technologies and best engineering practices. We are coming up with a Technical Center and elegant office in a new business district.',
    icon: '',
    color: 'from-teal-500 to-cyan-500'
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
          Our Corporate Beliefs
        </motion.h2>
        <motion.p 
          className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Since inception, Plustech Systems and Solutions has made "customer satisfaction" and "relationships" 
          as the foundation of our business principle. These values guide every decision we make and every solution we create.
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
              
              {/* Content */}
              <div className="relative p-8 h-full flex flex-col">
                
                {/* Title */}
                <h3 className="text-2xl font-bold font-heading text-black mb-4 text-center">
                  {belief.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 leading-relaxed text-center flex-grow">
                  {belief.description}
                </p>
                
                {/* Hover Effect Line */}
                <motion.div 
                  className={`h-1 bg-gradient-to-r ${belief.color} rounded-full mt-6`}
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-4 right-4 w-2 h-2 bg-[#00aeef] rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 left-4 w-1 h-1 bg-[#00aeef] rounded-full opacity-40 group-hover:opacity-80 transition-opacity duration-300" />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Bottom Quote */}
      <motion.div 
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        <blockquote className="text-2xl md:text-3xl font-light text-gray-700 italic max-w-4xl mx-auto">
          "Our associates take pride and comfort in their engagement with Plustech. 
          We believe in not just meeting customer expectations but exceeding them."
        </blockquote>
        <cite className="block mt-6 text-lg text-gray-500 font-semibold">
          — Plustech Systems and Solutions
        </cite>
      </motion.div>
    </div>
  );
};

export default CorporateBeliefsSection;
