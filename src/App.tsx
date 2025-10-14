import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
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

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutUsPage />}>
        <Route index element={<Navigate to="corporate-beliefs" replace />} />
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