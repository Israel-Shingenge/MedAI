// src/pages/DashboardPage.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import '../components/styles.css';

const DashboardPage = () => {
  return (
    <div className="container">
      <h2 style={{ textAlign: 'center' }}>Welcome to your Dashboard</h2>
      <p style={{ textAlign: 'center', color: '#718096', marginBottom: '2rem' }}>
        Here you can get a quick overview of your activities and navigate to key features.
      </p>

      {/* Quick Stats Section */}
      <h3 style={{ marginBottom: '1rem', color: '#2b6cb0' }}>Quick Stats</h3>
      <div className="dashboard-grid" style={{ marginBottom: '3rem' }}>
        <div className="card dashboard-card" style={{ padding: '1.5rem', backgroundColor: '#ebf8ff', border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '2.5rem', fontWeight: 600, color: '#2b6cb0', margin: 0 }}>24</p>
          <p style={{ fontSize: '0.9rem', color: '#4a5568', margin: 0 }}>Analyses this month</p>
        </div>
        <div className="card dashboard-card" style={{ padding: '1.5rem', backgroundColor: '#f0fff4', border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '2.5rem', fontWeight: 600, color: '#38a169', margin: 0 }}>4</p>
          <p style={{ fontSize: '0.9rem', color: '#4a5568', margin: 0 }}>New patients</p>
        </div>
        <div className="card dashboard-card" style={{ padding: '1.5rem', backgroundColor: '#fff5f5', border: '1px solid #e2e8f0' }}>
          <p style={{ fontSize: '2.5rem', fontWeight: 600, color: '#e53e3e', margin: 0 }}>2</p>
          <p style={{ fontSize: '0.9rem', color: '#4a5568', margin: 0 }}>Analyses requiring review</p>
        </div>
      </div>

      {/* Main Action Cards Section */}
      <div className="dashboard-grid">
        {/* Card for Recent Analyses */}
        <Link to="/results" className="card dashboard-card" style={{ textDecoration: 'none' }}>
          <div className="card-icon" style={{ marginBottom: '1rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-folder-open">
              <path d="M6 14L4 12V4a2 2 0 0 1 2-2h4l2 2h4a2 2 0 0 1 2 2v3.7a2 2 0 0 0-.25 1c-.1.3-.25.5-.4.7l-4.5 5c-.1.1-.2.2-.3.3H6a2 2 0 0 1-2-2z" />
            </svg>
          </div>
          <h3>Recent Analyses</h3>
          <p style={{ color: '#4a5568' }}>View your most recent diagnostic reports and patient data.</p>
        </Link>
        {/* Card for Patient Portal */}
        <Link to="/patientportal" className="card dashboard-card" style={{ textDecoration: 'none' }}>
          <div className="card-icon" style={{ marginBottom: '1rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-check">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <polyline points="16 11 18 13 22 9" />
            </svg>
          </div>
          <h3>Patient Portal</h3>
          <p style={{ color: '#4a5568' }}>Access and manage patient information securely.</p>
        </Link>
        {/* Card for New Diagnosis */}
        <Link to="/diagnose" className="card dashboard-card" style={{ textDecoration: 'none' }}>
          <div className="card-icon" style={{ marginBottom: '1rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2b6cb0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-microscope">
              <path d="M6 18h8" />
              <path d="M3 22h18" />
              <path d="M14 22a7 7 0 1 0 0-14h-1" />
              <path d="M9 14h2" />
              <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
              <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
            </svg>
          </div>
          <h3>Start New Diagnosis</h3>
          <p style={{ color: '#4a5568' }}>Upload a new microscopic image for analysis.</p>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
