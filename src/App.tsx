import { lazy, Suspense, Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoutes';

// Error Boundary Component
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#00aeef] text-white rounded-lg hover:bg-[#0099d4]"
            >
              Reload Page
            </button>
            {import.meta.env.DEV && (
              <pre className="mt-4 text-xs text-left bg-gray-100 p-4 rounded overflow-auto">
                {this.state.error?.stack}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

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
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;