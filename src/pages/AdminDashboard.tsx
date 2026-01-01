import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../hooks/useAdminAuth';
import NewsManagerSimple from '../components/NewsManagerSimple';
import AnnualReturnManager from '../components/AnnualReturnManager';
import ProjectsManager from '../components/ProjectsManager';
import CertificationManager from '../components/CertificationManager';
import CSRManager from '../components/CSRManager';
import MilestonesManager from '../components/MilestonesManager';
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

  const publishedProjectsCount = projects.filter((p) => p.status === 'published').length;
  const publishedNewsCount = news.filter((n) => n.published).length;
  const publishedReturnsCount = annualReturns.filter((r) => r.status === 'published').length;
  const publishedCertificationsCount = certifications.filter((c) => c.published).length;
  const publishedCSRCount = csrActivities.filter((c) => c.published).length;
  const publishedMilestonesCount = milestones.filter((m) => m.published).length;
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
              <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
              <p className="text-gray-300">Manage your PlusTech website content</p>
            </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Projects Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Projects</h3>
            <p className="text-gray-300 mb-4">Manage company projects and portfolio</p>
            <button
              onClick={() => setActiveTab('projects')}
              className="w-full px-4 py-2 bg-[#00aeef] text-black rounded-lg hover:bg-[#0099d4] transition-colors duration-200"
            >
              Manage Projects
            </button>
          </div>

          {/* News Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">News & Updates</h3>
            <p className="text-gray-300 mb-4">Add company news and announcements</p>
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('news')}
                className="w-full px-4 py-2 bg-[#00aeef] text-black rounded-lg hover:bg-[#0099d4] transition-colors duration-200"
              >
                Manage News
              </button>
            </div>
          </div>

          {/* Milestones Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">History & Milestones</h3>
            <p className="text-gray-300 mb-4">Manage timeline entries from 2020 onwards</p>
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('milestones')}
                className="w-full px-4 py-2 bg-[#00aeef] text-black rounded-lg hover:bg-[#0099d4] transition-colors duration-200"
              >
                Manage Milestones
              </button>
            </div>
          </div>

          {/* Annual Return Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Annual Return</h3>
            <p className="text-gray-300 mb-4">Manage annual return filings and statutory disclosures</p>
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('annualReturns')}
                className="w-full px-4 py-2 bg-[#00aeef] text-black rounded-lg hover:bg-[#0099d4] transition-colors duration-200"
              >
                Manage Annual Returns
              </button>
            </div>
          </div>
          {/* Certifications Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">Certifications</h3>
            <p className="text-gray-300 mb-4">Manage compliance and accreditation data</p>
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('certifications')}
                className="w-full px-4 py-2 bg-[#00aeef] text-black rounded-lg hover:bg-[#0099d4] transition-colors duration-200"
              >
                Manage Certifications
              </button>
            </div>
          </div>
          {/* CSR Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold text-white mb-4">CSR Activities</h3>
            <p className="text-gray-300 mb-4">Manage CSR initiatives and impact stories</p>
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('csr')}
                className="w-full px-4 py-2 bg-[#00aeef] text-black rounded-lg hover:bg-[#0099d4] transition-colors duration-200"
              >
                Manage CSR
              </button>
            </div>
          </div>
        </div>

            {/* Quick Stats (live data) */}
            <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h2 className="text-2xl font-bold text-white mb-6">Quick Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#00aeef]">
                    {isStatsLoading ? '—' : publishedProjectsCount}
                  </div>
                  <div className="text-gray-300">Active Projects (published)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#00aeef]">
                    {isStatsLoading ? '—' : publishedNewsCount}
                  </div>
                  <div className="text-gray-300">Published News Articles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#00aeef]">
                    {isStatsLoading ? '—' : publishedMilestonesCount}
                  </div>
                  <div className="text-gray-300">Timeline Milestones (2020+)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#00aeef]">
                    {isStatsLoading ? '—' : publishedReturnsCount}
                  </div>
                  <div className="text-gray-300">Published Annual Returns</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#00aeef]">
                    {isStatsLoading ? '—' : publishedCertificationsCount}
                  </div>
                  <div className="text-gray-300">Published Certifications</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#00aeef]">
                    {isStatsLoading ? '—' : publishedCSRCount}
                  </div>
                  <div className="text-gray-300">Published CSR Activities</div>
                </div>
              </div>
            </div>
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