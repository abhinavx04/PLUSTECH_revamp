import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <>
      <style>
        {`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}
      </style>
      <section className="py-20 px-4 bg-[#D3D4D9]/30 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: '#252627' }}>
            About Us
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-blue-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-lg text-[#252627]/70 leading-relaxed">
                Welcome to <span 
                  className="font-semibold relative inline-block"
                  style={{
                    background: 'linear-gradient(45deg, #C0C0C0, #E8E8E8, #C0C0C0, #F0F0F0)',
                    backgroundSize: '200% 200%',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    textShadow: '0 0 20px rgba(192, 192, 192, 0.5)',
                    animation: 'shimmer 3s ease-in-out infinite'
                  }}
                >Plustech</span>. We value your time and appreciate your interest in our company.
              </p>
              
              <p className="text-[#252627]/70 leading-relaxed">
                Plustech is a trusted name in the industrial finishing industry, specializing in the design, engineering, procurement, construction, and commissioning of surface finishing plants. Our expertise covers solutions for both automotive and general-purpose painting applications.
              </p>
              
              <p className="text-[#252627]/70 leading-relaxed">
                We deliver semi-automatic and fully automatic plants, customized to meet each customer's unique requirements. Guided by the principle of continuous improvement, we focus on understanding client needs and providing the most effective engineered solutions.
              </p>
            </div>
            
            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-[#D3D4D9]/40 p-4 rounded-lg border" style={{ borderColor: '#D3D4D9' }}>
                <h4 className="font-semibold text-[#252627] mb-2">Design & Engineering</h4>
                <p className="text-sm text-[#252627]/70">Custom solutions for your specific needs</p>
              </div>
              <div className="bg-[#D3D4D9]/40 p-4 rounded-lg border" style={{ borderColor: '#D3D4D9' }}>
                <h4 className="font-semibold text-[#252627] mb-2">Automated Systems</h4>
                <p className="text-sm text-[#252627]/70">Semi & fully automatic plants</p>
              </div>
              <div className="bg-[#D3D4D9]/40 p-4 rounded-lg border" style={{ borderColor: '#D3D4D9' }}>
                <h4 className="font-semibold text-[#252627] mb-2">End-to-End Service</h4>
                <p className="text-sm text-[#252627]/70">From design to commissioning</p>
              </div>
              <div className="bg-[#D3D4D9]/40 p-4 rounded-lg border" style={{ borderColor: '#D3D4D9' }}>
                <h4 className="font-semibold text-[#252627] mb-2">Industry Expertise</h4>
                <p className="text-sm text-[#252627]/70">Automotive & general applications</p>
              </div>
            </div>
          </div>
          
          {/* Right side - Visual Elements */}
          <div className="relative">
            <div className="bg-[#D3D4D9]/30 rounded-2xl p-8 border" style={{ borderColor: '#D3D4D9' }}>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#4B88A2] rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#FFF9FB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[#252627] font-semibold">Innovation</h3>
                    <p className="text-[#252627]/70 text-sm">Cutting-edge solutions</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#4B88A2] rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#FFF9FB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[#252627] font-semibold">Efficiency</h3>
                    <p className="text-[#252627]/70 text-sm">Optimized processes</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#4B88A2] rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-[#FFF9FB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[#252627] font-semibold">Quality</h3>
                    <p className="text-[#252627]/70 text-sm">Reliable deliverables</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  );
};

export default AboutSection;
