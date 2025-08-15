import React from 'react';
import { Users, Shield, Heart } from 'lucide-react';
import '../styles/design-system.css';

const EnhancedAboutPage = () => {
  return (
    <div className="about-container">
      <div className="container">
        <h1 className="about-title">
          <Shield className="title-icon" size={32} />
          About Us
        </h1>
        <p className="about-description">
          At MicroAI Diagnostics, we leverage cutting-edge artificial intelligence to enhance the accuracy and speed of microscopic image analysis. Our mission is to empower medical professionals with the tools they need to make informed decisions quickly and confidently.
        </p>

        <h2 className="about-subtitle">Our Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <Users className="value-icon" size={24} />
            <h3>Collaboration</h3>
            <p>We believe in the power of teamwork and collaboration to achieve the best outcomes for our patients.</p>
          </div>
          <div className="value-card">
            <Heart className="value-icon" size={24} />
            <h3>Compassion</h3>
            <p>Our commitment to compassionate care drives us to prioritize the well-being of our patients.</p>
          </div>
          <div className="value-card">
            <Shield className="value-icon" size={24} />
            <h3>Integrity</h3>
            <p>We uphold the highest standards of integrity in all our actions and decisions.</p>
          </div>
        </div>

        <h2 className="about-subtitle">Our Technology</h2>
        <p className="about-description">
          Our AI algorithms are trained on thousands of medical images, ensuring high accuracy and reliability. We continuously update our models to incorporate the latest research and advancements in the field.
        </p>

        <h2 className="about-subtitle">Join Us</h2>
        <p className="about-description">
          We are always looking for talented individuals who share our passion for innovation in healthcare. If you're interested in joining our team, please reach out!
        </p>
      </div>
    </div>
  );
};

// Add enhanced styles
const style = document.createElement('style');
style.textContent = `
  .about-container {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--gray-50) 0%, white 100%);
    padding: 2rem 0;
  }

  .about-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    font-size: var(--text-3xl);
    font-weight: 700;
    color: var(--gray-900);
    margin-bottom: 1rem;
  }

  .title-icon {
    color: var(--primary-600);
  }

  .about-description {
    font-size: var(--text-lg);
    color: var(--gray-600);
    max-width: 800px;
    margin: 0 auto 2rem;
    text-align: center;
  }

  .about-subtitle {
    font-size: var(--text-2xl);
    font-weight: 600;
    color: var(--gray-900);
    margin: 2rem 0 1rem;
    text-align: center;
  }

  .values-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-bottom: 3rem;
  }

  .value-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    background: white;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
  }

  .value-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .value-icon {
    color: var(--primary-500);
    margin-bottom: 1rem;
  }

  @media (max-width: 768px) {
    .about-title {
      font-size: var(--text-2xl);
    }

    .about-description {
      font-size: var(--text-base);
    }
  }
`;

document.head.appendChild(style);

export default EnhancedAboutPage;
