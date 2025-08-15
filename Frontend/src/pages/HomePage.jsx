import React from 'react';
import { Link } from 'react-router-dom';
import '../components/styles.css';

const HomePage = () => {
  return (
    <div className="container hero-section">
      <h1>Accelerate Diagnostics with AI</h1>
      <p>
        Harness the power of AI to provide rapid, accurate, and reliable microscopic image analysis. Our platform supports medical professionals in making faster, more confident decisions.
      </p>
      <Link to="/diagnose">
        <button className="button-primary">Start Diagnosis</button>
      </Link>
    </div>
  );
};

export default HomePage;