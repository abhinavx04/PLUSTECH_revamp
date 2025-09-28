import React from 'react';
import { FaTwitter, FaFacebookF, FaLinkedinIn, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer 
      className="relative bg-black border-t border-white/10 py-16"
      style={{ fontFamily: 'Roboto Flex, sans-serif' }}
    >
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Company Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <img src="/newlogo.png" alt="PlusTech Logo" className="h-14 w-auto brightness-110 contrast-110" />
              <div className="flex flex-col justify-center">
                <span className="font-bold text-xl tracking-wider" style={{ fontFamily: 'Orbitron, Arial, sans-serif', fontWeight: '800', letterSpacing: '0.1em', color: '#00aeef' }}>
                  PLUSTECH
                </span>
                <p className="text-gray-400 text-xs mt-1">
                  Developing Solutions<br />
                  Delivering Quality
                </p>
              </div>
            </div>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/company/plustech-systems-solutions-private-limited/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-[#00ddff] hover:text-black transition-all duration-200">
                <FaLinkedinIn />
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-[#00ddff] hover:text-black transition-all duration-200">
                <FaTwitter />
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:bg-[#00ddff] hover:text-black transition-all duration-200">
                <FaFacebookF />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-white text-lg font-semibold">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-[#00ddff] transition-colors duration-200">Home</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#00ddff] transition-colors duration-200">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#00ddff] transition-colors duration-200">Services</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#00ddff] transition-colors duration-200">Projects</a></li>
              <li><a href="#" className="text-gray-400 hover:text-[#00ddff] transition-colors duration-200">Contact</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-white text-lg font-semibold">Head Office</h4>
            <address className="space-y-3 not-italic">
              <div className="flex items-start space-x-3 text-gray-400">
                <FaMapMarkerAlt className="flex-shrink-0 mt-1 text-[#00ddff]" />
                <span>"Antariksh Towers" Office Nos.412-418, 9th Floor, CTS No. 391,392, Near Narpatgiri Chowk, Pune– 411 011 (MS) India</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <FaPhone className="flex-shrink-0 text-[#00ddff]" />
                <span>+91 20 26114961</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <FaPhone className="flex-shrink-0 text-[#00ddff]" />
                <span>+91 20 26056366</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <FaEnvelope className="flex-shrink-0 text-[#00ddff]" />
                <span>info@plustech.com</span>
              </div>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} PlusTech Systems and Solutions. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-2">
            <a href="#" className="hover:text-[#00ddff] transition-colors duration-200">Privacy Policy</a>
            <a href="#" className="hover:text-[#00ddff] transition-colors duration-200">Terms of Service</a>
            <a href="#" className="hover:text-[#00ddff] transition-colors duration-200">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;