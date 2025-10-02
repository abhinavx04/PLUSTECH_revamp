import React, { Component } from 'react';
import type { ReactNode } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoutes';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; message: string }> {
  state: { hasError: boolean; message: string } = { hasError: false, message: '' };
  static getDerivedStateFromError(error: unknown) {
    const message = error && typeof error === 'object' && 'message' in error ? String((error as { message?: string }).message) : String(error);
    return { hasError: true, message };
  }
  componentDidCatch(error: unknown, info: unknown) {
    console.error('App crashed:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-white p-6">
          <div className="text-center max-w-xl">
            <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-4">{this.state.message}</p>
            <button className="px-4 py-2 rounded bg-black text-white" onClick={() => window.location.reload()}>Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      
      {/* Protected Admin Routes */}
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;