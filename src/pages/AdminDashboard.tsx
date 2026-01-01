import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';
import NewsManagerSimple from '../components/NewsManagerSimple';
import AnnualReturnManager from '../components/AnnualReturnManager';
import ProjectsManager from '../components/ProjectsManager';
import CertificationManager from '../components/CertificationManager';
import CSRManager from '../components/CSRManager';
import MilestonesManager from '../components/MilestonesManager';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import { useProjectsFirestore } from '../hooks/useProjectsFirestore';
import { useNewsFirestore } from '../hooks/useNewsFirestore';
import { useAnnualReturnsFirestore } from '../hooks/useAnnualReturnsFirestore';
import { useCertificationsFirestore } from '../hooks/useCertificationsFirestore';
import { useCSRActivitiesFirestore } from '../hooks/useCSRActivitiesFirestore';
import { useMilestonesFirestore } from '../hooks/useMilestonesFirestore';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'projects' | 'news' | 'annualReturns' | 'certifications' | 'csr' | 'milestones'
  >('dashboard');

  // Load live data for quick stats
  const { projects, loading: projectsLoading } = useProjectsFirestore();
  const { news, loading: newsLoading } = useNewsFirestore();
  const { annualReturns, loading: returnsLoading } = useAnnualReturnsFirestore();
  const { certifications, loading: certificationsLoading } = useCertificationsFirestore();
  const { activities: csrActivities, loading: csrLoading } = useCSRActivitiesFirestore();
  const { milestones, loading: milestonesLoading } = useMilestonesFirestore();

  const isStatsLoading =
    projectsLoading ||
    newsLoading ||
    returnsLoading ||
    certificationsLoading ||
    csrLoading ||
    milestonesLoading;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
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
                src="/PLUSTECH NEW.png" 
                alt="PlusTech Logo" 
                className="h-10 w-auto brightness-110 contrast-110"
                width="195"
                height="210"
                loading="eager"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-white text-sm">
                Welcome, {user?.email || 'Admin'}
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

      {/* Navigation Tabs */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-[#00aeef] text-[#00aeef]'
                  : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'projects'
                  ? 'border-[#00aeef] text-[#00aeef]'
                  : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'news'
                  ? 'border-[#00aeef] text-[#00aeef]'
                  : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
              }`}
            >
              News Management
            </button>
            <button
              onClick={() => setActiveTab('milestones')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'milestones'
                  ? 'border-[#00aeef] text-[#00aeef]'
                  : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
              }`}
            >
              Milestones
            </button>
            <button
              onClick={() => setActiveTab('annualReturns')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'annualReturns'
                  ? 'border-[#00aeef] text-[#00aeef]'
                  : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
              }`}
            >
              Annual Return
            </button>
            <button
              onClick={() => setActiveTab('certifications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'certifications'
                  ? 'border-[#00aeef] text-[#00aeef]'
                  : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
              }`}
            >
              Certifications
            </button>
            <button
              onClick={() => setActiveTab('csr')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'csr'
                  ? 'border-[#00aeef] text-[#00aeef]'
                  : 'border-transparent text-gray-300 hover:text-white hover:border-gray-300'
              }`}
            >
              CSR Activities
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
              <p className="text-gray-300">Comprehensive overview of your PlusTech website content</p>
            </div>

            <AnalyticsDashboard
              projects={projects}
              news={news}
              annualReturns={annualReturns}
              certifications={certifications}
              csrActivities={csrActivities}
              milestones={milestones}
              isLoading={isStatsLoading}
              onNavigate={(tab) => setActiveTab(tab as typeof activeTab)}
            />
          </>
        ) : activeTab === 'projects' ? (
          <ProjectsManager />
        ) : activeTab === 'news' ? (
          <NewsManagerSimple />
        ) : activeTab === 'milestones' ? (
          <MilestonesManager />
        ) : activeTab === 'annualReturns' ? (
          <AnnualReturnManager />
        ) : activeTab === 'certifications' ? (
          <CertificationManager />
        ) : (
          <CSRManager />
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;