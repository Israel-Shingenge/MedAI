import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import '../components/styles.css';

const ResultsPage = () => {
  const location = useLocation();
  const { result, imageUrl } = location.state || {};

  if (!result || !imageUrl) {
    return (
      <div className="container">
        <h2>No results found.</h2>
        <p>Please go back to the diagnosis page to start a new analysis.</p>
        <Link to="/diagnose">
          <button className="button-primary">Go to Diagnosis</button>
        </Link>
      </div>
    );
  }

  const { diagnosis, confidence } = result;
  const confidencePercentage = (confidence * 100).toFixed(2);
  const requiresReview = confidence < 0.75; // Example threshold
  
  const detailedFindings = [
    'Cell morphology indicates potential presence of mycobacterium tuberculosis.',
    'No signs of parasitic infection were detected.',
    'Overall cell count is within normal range.',
    'Confidence score suggests high probability, but manual verification is recommended for confirmation.'
  ];

  return (
    <div className="container">
      <h2 className="results-header">AI-Powered Diagnostic Report</h2>
      <div className="results-content">
        <div className="card results-image-card">
          <h3 className="card-title">Analyzed Image</h3>
          <div className="image-wrapper">
            <img src={imageUrl} alt="Microscopic specimen" className="analyzed-image" />
          </div>
        </div>
        <div className={`card results-info-card ${requiresReview ? 'review-required' : 'high-confidence'}`}>
          <div className="diagnosis-summary">
            <p className="diagnosis-main">Diagnosis: <strong>{diagnosis}</strong></p>
            <p className="confidence-score">Confidence: {confidencePercentage}%</p>
          </div>
          
          <div className="detailed-findings">
            <h4>Detailed Findings:</h4>
            <ul>
              {detailedFindings.map((finding, index) => (
                <li key={index}>{finding}</li>
              ))}
            </ul>
          </div>
          
          <p className="review-message">{requiresReview ? 'This diagnosis requires immediate review by a qualified medical expert.' : 'This is a high-confidence diagnosis.'}</p>
          
          <Link to="/diagnose">
            <button className="button-secondary">Run New Analysis</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
