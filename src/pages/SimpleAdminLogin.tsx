import React from 'react';

const SimpleAdminLogin: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#1a1a1a',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        textAlign: 'center',
        padding: '40px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '12px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <h1 style={{ color: 'white', marginBottom: '20px', fontSize: '24px' }}>
          Admin Login
        </h1>
        <p style={{ color: '#ccc', marginBottom: '30px' }}>
          Simple admin login form
        </p>
        <div style={{ marginBottom: '20px' }}>
          <input 
            type="email" 
            placeholder="Email"
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '15px',
              borderRadius: '6px',
              border: '1px solid #555',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '16px'
            }}
          />
          <input 
            type="password" 
            placeholder="Password"
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '20px',
              borderRadius: '6px',
              border: '1px solid #555',
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '16px'
            }}
          />
        </div>
        <button 
          style={{
            width: '100%',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '12px',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
            marginBottom: '15px'
          }}
          onClick={() => alert('Login clicked!')}
        >
          Sign In
        </button>
        <a 
          href="/" 
          style={{
            color: '#ccc',
            textDecoration: 'none',
            fontSize: '14px'
          }}
        >
          ← Back to Home
        </a>
      </div>
    </div>
  );
};

export default SimpleAdminLogin;
