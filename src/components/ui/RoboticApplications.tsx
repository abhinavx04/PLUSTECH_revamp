import { motion } from 'framer-motion';

// Plant images data for robotic applications
const plantImages = [
  {
    id: 1,
    title: "Automated Paint Line",
    description: "Robotic spray painting systems for automotive components",
    image: "/robotic/plant1.jpg", // Placeholder - will use high-quality industrial images
    category: "Automotive"
  },
  {
    id: 2,
    title: "Conveyor System Integration",
    description: "Automated material flow and robotic handling systems",
    image: "/robotic/plant2.jpg",
    category: "Material Handling"
  },
  {
    id: 3,
    title: "Quality Control Station",
    description: "Robotic inspection and quality assurance systems",
    image: "/robotic/plant3.jpg",
    category: "Quality Control"
  },
  {
    id: 4,
    title: "Drying and Curing Zone",
    description: "Automated temperature and humidity controlled environments",
    image: "/robotic/plant4.jpg",
    category: "Process Control"
  },
  {
    id: 5,
    title: "Surface Preparation",
    description: "Robotic cleaning and surface treatment systems",
    image: "/robotic/plant5.jpg",
    category: "Pre-treatment"
  }
];

// Animation variants for container
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

// Animation variants for individual cards
const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 60,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8
    }
  }
};

export default function RoboticApplications() {
  return (
    <section className="py-16 px-6 sm:px-8 lg:px-12 bg-black relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            style={{ fontFamily: 'Roboto Flex, sans-serif' }}
          >
            Robotic Applications
          </motion.h2>
          <motion.div 
            className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto mb-6"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            viewport={{ once: true }}
          />
          <motion.p 
            className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: 'Roboto Flex, sans-serif' }}
          >
            Advanced robotic systems for precision manufacturing, quality control, and automated processes 
            in industrial plant environments
          </motion.p>
        </motion.div>

        {/* Image Gallery Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {plantImages.map((plant, index) => (
            <motion.div
              key={plant.id}
              className="group relative"
              variants={cardVariants}
              initial={{ scale: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <motion.div
                className="relative bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-800/50 shadow-2xl backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20"
                    whileHover={{ 
                      scale: 1.1,
                      filter: "brightness(1) contrast(1.2)"
                    }}
                    initial={{
                      scale: 1,
                      filter: "brightness(0.8) contrast(1.1)"
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gray-800 flex items-center justify-center"
                    whileHover={{ 
                      scale: 1.1,
                      filter: "brightness(1) contrast(1.2)"
                    }}
                    initial={{
                      scale: 1,
                      filter: "brightness(0.8) contrast(1.1)"
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    {/* Placeholder with industrial icon */}
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                        </svg>
                      </div>
                      <p className="text-gray-400 text-sm">Industrial Plant {index + 1}</p>
                    </div>
                  </motion.div>
                  
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-black/70 text-cyan-400 text-xs font-semibold rounded-full backdrop-blur-sm border border-cyan-400/30">
                      {plant.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
                    {plant.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed" style={{ fontFamily: 'Roboto Flex, sans-serif' }}>
                    {plant.description}
                  </p>
                  
                  {/* Animated progress indicator */}
                  <motion.div 
                    className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                      initial={{ scaleX: 0, originX: 0 }}
                      whileInView={{ scaleX: 0.8 }}
                      transition={{ duration: 1.5, delay: 0.8 + index * 0.1 }}
                    />
                  </motion.div>
                </div>

                {/* Hover glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA Section */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all duration-300"
            style={{ fontFamily: 'Roboto Flex, sans-serif' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Our Robotic Solutions
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}