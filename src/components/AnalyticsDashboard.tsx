import React, { useMemo } from 'react';
import type { Project } from '../hooks/useProjectsFirestore';
import type { AnnualReturnData } from '../hooks/useAnnualReturnsFirestore';
import type { Certification } from '../hooks/useCertificationsFirestore';
import type { CSRActivity } from '../hooks/useCSRActivitiesFirestore';
import type { Milestone } from '../hooks/useMilestonesFirestore';

// Define NewsArticle locally since it's not exported
interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  featured: boolean;
  imageUrl?: string;
  tags: string[];
}

interface AnalyticsDashboardProps {
  projects: Project[];
  news: NewsArticle[];
  annualReturns: AnnualReturnData[];
  certifications: Certification[];
  csrActivities: CSRActivity[];
  milestones: Milestone[];
  isLoading: boolean;
  onNavigate: (tab: string) => void;
}

interface StatCardProps {
  title: string;
  published: number;
  draft: number;
  total: number;
  onClick: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, published, draft, total, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20 hover:border-[#00aeef]/50 cursor-pointer transition-all duration-200 group"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        <svg className="w-5 h-5 text-gray-400 group-hover:text-[#00aeef] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
      
      <div className="flex items-baseline gap-6">
        <div>
          <div className="text-3xl font-bold text-white">{total}</div>
          <div className="text-xs text-gray-400 mt-1">Total</div>
        </div>
        <div className="flex gap-4 text-sm">
          <div>
            <div className="text-lg font-semibold text-green-400">{published}</div>
            <div className="text-xs text-gray-400">Live</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-yellow-400">{draft}</div>
            <div className="text-xs text-gray-400">Draft</div>
          </div>
        </div>
      </div>
    </div>
  );
};


interface RecentActivityCardProps {
  projects: Project[];
  news: NewsArticle[];
  csrActivities: CSRActivity[];
  milestones: Milestone[];
}

const RecentActivityCard: React.FC<RecentActivityCardProps> = ({ projects, news, csrActivities, milestones }) => {
  const recentItems = useMemo(() => {
    const allItems: Array<{
      type: string;
      title: string;
      date: Date;
      status: string;
    }> = [
      ...projects.slice(0, 2).map(p => ({
        type: 'Project',
        title: p.title,
        date: p.updatedAt,
        status: p.status
      })),
      ...news.slice(0, 2).map(n => ({
        type: 'News',
        title: n.title,
        date: n.updatedAt,
        status: n.published ? 'published' : 'draft'
      })),
      ...csrActivities.slice(0, 1).map(c => ({
        type: 'CSR',
        title: c.title,
        date: c.updatedAt,
        status: c.published ? 'published' : 'draft'
      })),
      ...milestones.slice(0, 1).map(m => ({
        type: 'Milestone',
        title: m.title,
        date: m.updatedAt,
        status: m.published ? 'published' : 'draft'
      }))
    ];
    
    return allItems
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 6);
  }, [projects, news, csrActivities, milestones]);
  
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
      <h3 className="text-lg font-medium text-white mb-4">Recent Updates</h3>
      
      <div className="space-y-3">
        {recentItems.length === 0 ? (
          <div className="text-gray-400 text-sm">No recent activity</div>
        ) : (
          recentItems.map((item, idx) => (
            <div key={idx} className="flex items-start justify-between py-3 border-b border-white/10 last:border-0">
              <div className="flex-1 min-w-0">
                <div className="text-white text-sm font-medium truncate">{item.title}</div>
                <div className="text-gray-400 text-xs mt-1">
                  {item.type} • {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
              <span className={`ml-3 px-2 py-0.5 rounded text-xs flex-shrink-0 ${
                item.status === 'published' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              }`}>
                {item.status === 'published' ? 'Live' : 'Draft'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  projects,
  news,
  annualReturns,
  certifications,
  csrActivities,
  milestones,
  isLoading,
  onNavigate,
}) => {
  // Calculate stats
  const stats = useMemo(() => {
    const totalProjects = projects.length;
    const publishedProjects = projects.filter(p => p.status === 'published').length;
    const draftProjects = totalProjects - publishedProjects;
    
    const totalNews = news.length;
    const publishedNews = news.filter(n => n.published).length;
    const draftNews = totalNews - publishedNews;
    
    const totalReturns = annualReturns.length;
    const publishedReturns = annualReturns.filter(r => r.status === 'published').length;
    const draftReturns = totalReturns - publishedReturns;
    
    const totalCertifications = certifications.length;
    const publishedCertifications = certifications.filter(c => c.published).length;
    const draftCertifications = totalCertifications - publishedCertifications;
    
    const totalCSR = csrActivities.length;
    const publishedCSR = csrActivities.filter(c => c.published).length;
    const draftCSR = totalCSR - publishedCSR;
    
    const totalMilestones = milestones.length;
    const publishedMilestones = milestones.filter(m => m.published).length;
    const draftMilestones = totalMilestones - publishedMilestones;
    
    const totalContent = totalProjects + totalNews + totalReturns + totalCertifications + totalCSR + totalMilestones;
    const totalPublished = publishedProjects + publishedNews + publishedReturns + publishedCertifications + publishedCSR + publishedMilestones;
    const totalDrafts = draftProjects + draftNews + draftReturns + draftCertifications + draftCSR + draftMilestones;
    
    return {
      projects: { total: totalProjects, published: publishedProjects, draft: draftProjects },
      news: { total: totalNews, published: publishedNews, draft: draftNews },
      returns: { total: totalReturns, published: publishedReturns, draft: draftReturns },
      certifications: { total: totalCertifications, published: publishedCertifications, draft: draftCertifications },
      csr: { total: totalCSR, published: publishedCSR, draft: draftCSR },
      milestones: { total: totalMilestones, published: publishedMilestones, draft: draftMilestones },
      totals: { content: totalContent, published: totalPublished, drafts: totalDrafts }
    };
  }, [projects, news, annualReturns, certifications, csrActivities, milestones]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00aeef]"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Summary Banner */}
      <div className="bg-gradient-to-r from-[#00aeef]/10 to-purple-500/10 backdrop-blur-lg rounded-lg p-6 border border-white/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-gray-300 text-sm mb-1">Total Content</div>
            <div className="text-4xl font-bold text-white">{stats.totals.content}</div>
          </div>
          <div>
            <div className="text-gray-300 text-sm mb-1">Published</div>
            <div className="text-4xl font-bold text-green-400">{stats.totals.published}</div>
          </div>
          <div>
            <div className="text-gray-300 text-sm mb-1">Drafts</div>
            <div className="text-4xl font-bold text-yellow-400">{stats.totals.drafts}</div>
          </div>
        </div>
      </div>

      {/* Content Management Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Projects"
          published={stats.projects.published}
          draft={stats.projects.draft}
          total={stats.projects.total}
          onClick={() => onNavigate('projects')}
        />
        <StatCard
          title="News"
          published={stats.news.published}
          draft={stats.news.draft}
          total={stats.news.total}
          onClick={() => onNavigate('news')}
        />
        <StatCard
          title="Milestones"
          published={stats.milestones.published}
          draft={stats.milestones.draft}
          total={stats.milestones.total}
          onClick={() => onNavigate('milestones')}
        />
        <StatCard
          title="CSR Activities"
          published={stats.csr.published}
          draft={stats.csr.draft}
          total={stats.csr.total}
          onClick={() => onNavigate('csr')}
        />
        <StatCard
          title="Certifications"
          published={stats.certifications.published}
          draft={stats.certifications.draft}
          total={stats.certifications.total}
          onClick={() => onNavigate('certifications')}
        />
        <StatCard
          title="Annual Returns"
          published={stats.returns.published}
          draft={stats.returns.draft}
          total={stats.returns.total}
          onClick={() => onNavigate('annualReturns')}
        />
      </div>

      {/* Recent Activity */}
      <RecentActivityCard 
        projects={projects}
        news={news}
        csrActivities={csrActivities}
        milestones={milestones}
      />
    </div>
  );
};

