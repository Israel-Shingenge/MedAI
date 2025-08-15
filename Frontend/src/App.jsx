
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import DiagnosePage from './pages/DiagnosisPage';
import ResultsPage from './pages/ResultsPage';
import AboutPage from './pages/AboutPage';
import DashboardPage from './pages/DashboardPage';
import PatientPortalPage from './pages/PatientPortalPage';
import ContactPage from './pages/ContactPage';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<HomePage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="diagnose" element={<DiagnosePage />} />
          <Route path="results" element={<ResultsPage />} />
          <Route path="patientportal" element={<PatientPortalPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
