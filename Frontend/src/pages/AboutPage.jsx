import React from 'react';
import '../components/styles.css';

const AboutPage = () => {
  return (
    <div className="container">
      <h2>About MicroAI Diagnostics</h2>
      <div className="card">
        <p>
          MicroAI Diagnostics is a leading-edge platform designed to assist medical professionals by leveraging advanced artificial intelligence for microscopic image analysis. Our mission is to accelerate the diagnostic process, improve accuracy, and enable more efficient workflows in laboratories and clinics.
        </p>
        <p>
          Our technology is built on a foundation of robust machine learning models trained on vast datasets of microscopic images. This allows our system to quickly identify potential pathogens, abnormal cell structures, and other critical diagnostic indicators with high confidence, while always emphasizing the importance of expert human review.
        </p>
        <p>
          We are committed to building a reliable tool that supports better healthcare outcomes.
        </p>
      </div>
    </div>
  );
};

export default AboutPage;