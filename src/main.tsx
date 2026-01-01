import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'

// Add error handling for root rendering
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

// Log initialization for debugging
console.log('[App] Initializing application...');
console.log('[App] Environment:', import.meta.env.MODE);
console.log('[App] Firebase config available:', !!import.meta.env.VITE_FIREBASE_API_KEY);

try {
  createRoot(rootElement).render(
    <StrictMode>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </StrictMode>,
  );
  console.log('[App] Application rendered successfully');
} catch (error) {
  console.error('[App] Failed to render application:', error);
  rootElement.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; font-family: system-ui; text-align: center; padding: 20px;">
      <div>
        <h1 style="color: #dc2626; margin-bottom: 16px;">Application Error</h1>
        <p style="color: #6b7280; margin-bottom: 24px;">${error instanceof Error ? error.message : 'Failed to initialize application'}</p>
        <button onclick="window.location.reload()" style="padding: 12px 24px; background: #00aeef; color: white; border: none; border-radius: 8px; cursor: pointer;">
          Reload Page
        </button>
      </div>
    </div>
  `;
}
