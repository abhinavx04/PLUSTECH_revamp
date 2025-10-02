import React from 'react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img 
                src="/newlogo.png" 
                alt="PlusTech Logo" 
                className="h-10 w-auto brightness-110 contrast-110"
              />
              <span 
                className="font-bold text-lg text-[#00aeef]"
                style={{ fontFamily: 'Orbitron, Arial, sans-serif' }}
              >
                PLUSTECH ADMIN
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-white text-sm">
                Welcome, {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-300">Manage your PlusTech website content</p>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Projects Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Projects</h3>
            <p className="text-gray-300 mb-4">Manage company projects and portfolio</p>
            <button className="w-full px-4 py-2 bg-[#00aeef] text-black rounded-lg hover:bg-[#0099d4] transition-colors duration-200">
              Manage Projects
            </button>
          </div>

          {/* News Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">News & Updates</h3>
            <p className="text-gray-300 mb-4">Add company news and announcements</p>
            <button className="w-full px-4 py-2 bg-[#00aeef] text-black rounded-lg hover:bg-[#0099d4] transition-colors duration-200">
              Manage News
            </button>
          </div>

          {/* Analytics Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Analytics</h3>
            <p className="text-gray-300 mb-4">View website analytics and stats</p>
            <button className="w-full px-4 py-2 bg-[#00aeef] text-black rounded-lg hover:bg-[#0099d4] transition-colors duration-200">
              View Analytics
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00aeef]">12</div>
              <div className="text-gray-300">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00aeef]">245</div>
              <div className="text-gray-300">Website Visits</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00aeef]">8</div>
              <div className="text-gray-300">News Articles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00aeef]">98%</div>
              <div className="text-gray-300">Uptime</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;