import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EnhancedNavbar from './components/EnhancedNavbar';
import HeroSection from './components/HeroSection';
import EnhancedDiagnosisPage from './pages/EnhancedDiagnosisPage';
import ResultsPage from './pages/ResultsPage';
import EnhancedAboutPage from './pages/EnhancedAboutPage';
import DashboardPage from './pages/DashboardPage';
import EnhancedPatientPortalPage from './pages/EnhancedPatientPortalPage';
import ContactPage from './pages/ContactPage';
import './styles/design-system.css';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EnhancedNavbar />}>
          <Route index element={
            <div>
              <HeroSection />
            </div>
          } />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="diagnose" element={<EnhancedDiagnosisPage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="patientportal" element={<EnhancedPatientPortalPage />} />
          <Route path="about" element={<EnhancedAboutPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
