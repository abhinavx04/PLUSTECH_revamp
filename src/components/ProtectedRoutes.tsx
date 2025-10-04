import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const location = useLocation();

  // Simple demo authentication check
  // In a real app, this would check actual authentication state
  const isAuthenticated = localStorage.getItem('demo-logged-in') === 'true';
  const isAdmin = true; // Demo mode - always admin

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Access Denied</h2>
          <p className="text-gray-400 mb-6">You don't have admin privileges.</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-[#00aeef] text-black rounded-lg hover:bg-[#0099d4] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;