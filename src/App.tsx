import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import AboutUsPage from './pages/AboutUsPage';
import CorporateBeliefsPage from './pages/about/CorporateBeliefsPage';
import IndustryFocusPage from './pages/about/IndustryFocusPage';
import CertificationsPage from './pages/about/CertificationsPage';
import HistoryPage from './pages/about/HistoryPage';
import AnnualReturnsPage from './pages/about/AnnualReturnsPage';
import CSRActivitiesPage from './pages/about/CSRActivitiesPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoutes';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import NewsPage from './pages/NewsPage';
import { OfficeTourPage } from './pages/OfficeTourPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/facility" element={<OfficeTourPage />} />
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
  );
}

export default App;