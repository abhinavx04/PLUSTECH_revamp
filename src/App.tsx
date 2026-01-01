import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoutes';

// Lazy load all page components for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const CorporateBeliefsPage = lazy(() => import('./pages/about/CorporateBeliefsPage'));
const IndustryFocusPage = lazy(() => import('./pages/about/IndustryFocusPage'));
const CertificationsPage = lazy(() => import('./pages/about/CertificationsPage'));
const HistoryPage = lazy(() => import('./pages/about/HistoryPage'));
const AnnualReturnsPage = lazy(() => import('./pages/about/AnnualReturnsPage'));
const CSRActivitiesPage = lazy(() => import('./pages/about/CSRActivitiesPage'));
const CSRActivityDetailPage = lazy(() => import('./pages/about/CSRActivityDetailPage'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const NewsPage = lazy(() => import('./pages/NewsPage'));
const OfficeTourPage = lazy(() => import('./pages/OfficeTourPage').then(module => ({ default: module.OfficeTourPage })));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00aeef] mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/facility" element={<OfficeTourPage />} />
      <Route path="/about/csr-activities/:activityId" element={<CSRActivityDetailPage />} />
      <Route path="/about" element={<AboutUsPage />}>
        <Route path="corporate-beliefs" element={<CorporateBeliefsPage />} />
        <Route path="industry-focus" element={<IndustryFocusPage />} />
        <Route path="certifications" element={<CertificationsPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="annual-returns" element={<AnnualReturnsPage />} />
        <Route path="csr-activities" element={<CSRActivitiesPage />} />
      </Route>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={
        <ProtectedRoute requireAdmin={true}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      </Routes>
    </Suspense>
  );
}

export default App;