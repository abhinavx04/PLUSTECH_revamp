import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/services" element={<AboutPage />} />
        <Route path="/projects" element={<AboutPage />} />
        <Route path="/contact" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
