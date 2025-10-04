import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoutes';

const TestHome = () => (
  <div style={{ 
    minHeight: '100vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    fontFamily: 'Arial, sans-serif'
  }}>
    <div style={{ 
      textAlign: 'center',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        PlusTech - Homepage
      </h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Routing is working! This is the homepage.
      </p>
      <a 
        href="/test" 
        style={{
          display: 'inline-block',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          padding: '10px 20px',
          borderRadius: '4px',
          marginRight: '10px'
        }}
      >
        Go to Test Page
      </a>
      <a 
        href="/admin/login" 
        style={{
          display: 'inline-block',
          backgroundColor: '#28a745',
          color: 'white',
          textDecoration: 'none',
          padding: '10px 20px',
          borderRadius: '4px'
        }}
      >
        Admin Login
      </a>
    </div>
  </div>
);

const TestPage = () => (
  <div style={{ 
    minHeight: '100vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#e8f5e8',
    fontFamily: 'Arial, sans-serif'
  }}>
    <div style={{ 
      textAlign: 'center',
      padding: '20px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        Test Page Works!
      </h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        If you can see this, routing is working perfectly.
      </p>
      <a 
        href="/" 
        style={{
          display: 'inline-block',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          padding: '10px 20px',
          borderRadius: '4px'
        }}
      >
        Back to Home
      </a>
    </div>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route 
        path="/admin/dashboard" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;