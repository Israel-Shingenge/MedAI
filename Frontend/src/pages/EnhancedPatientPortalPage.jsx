import React, { useState } from 'react';
import { User, Calendar, FileText, Activity, TrendingUp, Shield } from 'lucide-react';
import '../styles/design-system.css';

const EnhancedPatientPortalPage = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const mockPatients = [
    {
      id: 1,
      name: "Sarah Johnson",
      age: 34,
      lastVisit: "2024-01-15",
      diagnosis: "Normal Cell Structure",
      confidence: 98.5,
      status: "Healthy",
      avatar: "SJ"
    },
    {
      id: 2,
      name: "Michael Chen",
      age: 45,
      lastVisit: "2024-01-14",
      diagnosis: "Benign Changes",
      confidence: 92.3,
      status: "Monitoring",
      avatar: "MC"
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      age: 28,
      lastVisit: "2024-01-13",
      diagnosis: "Inflammatory Response",
      confidence: 87.9,
      status: "Treatment",
      avatar: "ER"
    }
  ];

  const stats = [
    { label: "Total Patients", value: "1,247", icon: User, color: "blue" },
    { label: "This Month", value: "89", icon: Calendar, color: "green" },
    { label: "Active Cases", value: "23", icon: Activity, color: "orange" },
    { label: "Success Rate", value: "99.2%", icon: Shield, color: "purple" }
  ];

  return (
    <div className="patient-portal-container">
      <div className="container">
        <div className="portal-header">
          <h1 className="portal-title">
            <User className="title-icon" size={32} />
            Patient Portal
          </h1>
          <p className="portal-subtitle">
            Comprehensive patient management and diagnostic history
          </p>
        </div>

        <div className="stats-section">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`stat-card stat-${stat.color}`}>
                <Icon className="stat-icon" size={24} />
                <div className="stat-content">
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="portal-content">
          <div className="patients-list">
            <h2>Recent Patients</h2>
            <div className="patients-grid">
              {mockPatients.map((patient) => (
                <div 
                  key={patient.id} 
                  className={`patient-card ${selectedPatient?.id === patient.id ? 'selected' : ''}`}
                  onClick={() => setSelectedPatient(patient)}
                >
                  <div className="patient-avatar">{patient.avatar}</div>
                  <div className="patient-info">
                    <h3>{patient.name}</h3>
                    <p>Age: {patient.age}</p>
                    <p>Last Visit: {patient.lastVisit}</p>
                  </div>
                  <div className={`patient-status status-${patient.status.toLowerCase()}`}>
                    {patient.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedPatient && (
            <div className="patient-details">
              <div className="details-header">
                <h3>{selectedPatient.name}'s Details</h3>
                <div className="tabs">
                  <button 
                    className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
                    onClick={() => setActiveTab('overview')}
                  >
                    Overview
                  </button>
                  <button 
                    className={`tab ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                  >
                    History
                  </button>
                  <button 
                    className={`tab ${activeTab === 'reports' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reports')}
                  >
                    Reports
                  </button>
                </div>
              </div>

              <div className="details-content">
                {activeTab === 'overview' && (
                  <div className="overview-tab">
                    <div className="info-grid">
                      <div className="info-card">
                        <h4>Latest Diagnosis</h4>
                        <p>{selectedPatient.diagnosis}</p>
                        <div className="confidence-bar">
                          <div 
                            className="confidence-fill" 
                            style={{ width: `${selectedPatient.confidence}%` }}
                          />
                        </div>
                        <span>{selectedPatient.confidence}% Confidence</span>
                      </div>
                      <div className="info-card">
                        <h4>Patient Info</h4>
                        <p><strong>Age:</strong> {selectedPatient.age}</p>
                        <p><strong>Last Visit:</strong> {selectedPatient.lastVisit}</p>
                        <p><strong>Status:</strong> {selectedPatient.status}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'history' && (
                  <div className="history-tab">
                    <div className="timeline">
                      <div className="timeline-item">
                        <div className="timeline-date">{selectedPatient.lastVisit}</div>
                        <div className="timeline-content">
                          <h4>Initial Analysis</h4>
                          <p>{selectedPatient.diagnosis}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'reports' && (
                  <div className="reports-tab">
                    <div className="report-cards">
                      <div className="report-card">
                        <FileText className="report-icon" size={20} />
                        <div>
                          <h4>Latest Report</h4>
                          <p>Generated on {selectedPatient.lastVisit}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Add enhanced styles
const style = document.createElement('style');
style.textContent = `
  .patient-portal-container {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--gray-50) 0%, white 100%);
    padding: 2rem 0;
  }

  .portal-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .portal-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    font-size: var(--text-3xl);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: 0.5rem;
  }

  .title-icon {
    color: var(--primary-600);
  }

  .portal-subtitle {
    font-size: var(--text-lg);
    color: var(--gray-600);
  }

  .stats-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: white;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .stat-blue .stat-icon { color: var(--primary-500); }
  .stat-green .stat-icon { color: var(--success-500); }
  .stat-orange .stat-icon { color: var(--warning-500); }
  .stat-purple .stat-icon { color: var(--secondary-500); }

  .stat-content {
    display: flex;
    flex-direction: column;
  }

  .stat-value {
    font-size: var(--text-2xl);
    font-weight: 700;
    color: var(--gray-900);
  }

  .stat-label {
    font-size: var(--text-sm);
    color: var(--gray-600);
  }

  .portal-content {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .patients-list h2 {
    font-size: var(--text-2xl);
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: 1.5rem;
  }

  .patients-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .patient-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: white;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .patient-card:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .patient-card.selected {
    border: 2px solid var(--primary-500);
    background: var(--primary-50);
  }

  .patient-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: var(--primary-500);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
  }

  .patient-info h3 {
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: 0.25rem;
  }

  .patient-info p {
    color: var(--gray-600);
    margin: 0;
    font-size: var(--text-sm);
  }

  .patient-status {
    margin-left: auto;
    padding: 0.25rem 0.75rem;
    border-radius: var(--radius-full);
    font-size: var(--text-xs);
    font-weight: 500;
  }

  .status-healthy {
    background: var(--success-100);
    color: var(--success-700);
  }

  .status-monitoring {
    background: var(--warning-100);
    color: var(--warning-700);
  }

  .status-treatment {
    background: var(--primary-100);
    color: var(--primary-700);
  }

  .patient-details {
    background: white;
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-md);
    padding: 2rem;
  }

  .details-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--gray-200);
  }

  .details-header h3 {
    font-size: var(--text-xl);
    font-weight: 600;
    color: var(--gray-900);
  }

  .tabs {
    display: flex;
    gap: 0.5rem;
  }

  .tab {
    padding: 0.5rem 1rem;
    border: none;
    background: none;
    color: var(--gray-600);
    cursor: pointer;
    border-radius: var(--radius-md);
    transition: all 0.2s ease;
  }

  .tab.active {
    background: var(--primary-100);
    color: var(--primary-700);
  }

  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .info-card {
    padding: 1.5rem;
    background: var(--gray-50);
    border-radius: var(--radius-lg);
  }

  .info-card h4 {
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: 1rem;
  }

  .confidence-bar {
    width: 100%;
    height: 8px;
    background: var(--gray-200);
    border-radius: var(--radius-full);
    overflow: hidden;
    margin: 0.5rem 0;
  }

  .confidence-fill {
    height: 100%;
    background: var(--success-500);
    transition: width 0.3s ease;
  }

  .timeline {
    position: relative;
    padding-left: 2rem;
  }

  .timeline::before {
    content: '';
    position: absolute;
    left: 0.5rem;
    top: 0;
    bottom: 0;
    width: 2px;
    background: var(--gray-300);
  }

  .timeline-item {
    position: relative;
    margin-bottom: 1.5rem;
  }

  .timeline-date {
    font-size: var(--text-sm);
    color: var(--gray-600);
    margin-bottom: 0.5rem;
  }

  .timeline-content {
    background: var(--gray-50);
    padding: 1rem;
    border-radius: var(--radius-lg);
  }

  .report-cards {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .report-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--gray-50);
    border-radius: var(--radius-lg);
  }

  .report-icon {
    color: var(--primary-500);
  }

  @media (max-width: 768px) {
    .portal-content {
      grid-template-columns: 1fr;
    }

    .stats-section {
      grid-template-columns: repeat(2, 1fr);
    }

    .info-grid {
      grid-template-columns: 1fr;
    }
  }
`;

document.head.appendChild(style);

export default EnhancedPatientPortalPage;
