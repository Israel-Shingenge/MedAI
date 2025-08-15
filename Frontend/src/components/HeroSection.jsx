import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, Brain, Zap, Shield } from 'lucide-react';
import '../styles/design-system.css';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced neural networks for precise microscopic image interpretation"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get diagnostic insights in seconds, not hours"
    },
    {
      icon: Shield,
      title: "99.9% Accuracy",
      description: "Validated against thousands of medical cases"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className={`hero-title ${isVisible ? 'animate-fade-in' : ''}`}>
              Accelerate Diagnostics with{' '}
              <span className="text-gradient">AI Precision</span>
            </h1>
            
            <p className={`hero-subtitle ${isVisible ? 'animate-slide-up' : ''}`}>
              Harness the power of advanced artificial intelligence to provide rapid, 
              accurate, and reliable microscopic image analysis. Our platform supports 
              medical professionals in making faster, more confident decisions.
            </p>

            <div className={`hero-features ${isVisible ? 'animate-scale-in' : ''}`}>
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index}
                    className={`feature-card ${index === currentFeature ? 'active' : ''}`}
                  >
                    <Icon className="feature-icon" size={24} />
                    <div className="feature-content">
                      <h3>{feature.title}</h3>
                      <p>{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={`hero-cta ${isVisible ? 'animate-slide-up' : ''}`}>
              <Link to="/diagnose" className="btn btn-primary btn-large">
                Start Diagnosis
                <ArrowRight size={20} />
              </Link>
              
              <Link to="/about" className="btn btn-secondary btn-large">
                Learn More
              </Link>
            </div>
          </div>

          <div className={`hero-visual ${isVisible ? 'animate-scale-in' : ''}`}>
            <div className="hero-image-container">
              <div className="hero-image-placeholder">
                <Activity size={64} className="hero-image-icon" />
                <p>Advanced AI Diagnostics</p>
              </div>
              
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">10K+</span>
                  <span className="stat-label">Images Analyzed</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">99.9%</span>
                  <span className="stat-label">Accuracy Rate</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Medical Professionals</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Add enhanced styles
const style = document.createElement('style');
style.textContent = `
  .hero-section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, var(--gray-50) 0%, var(--primary-50) 100%);
    padding: 4rem 0;
    position: relative;
  }

  .hero-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .hero-title {
    font-size: var(--text-5xl);
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    background: linear-gradient(135deg, var(--gray-900), var(--primary-600));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero-subtitle {
    font-size: var(--text-xl);
    color: var(--gray-600);
    margin-bottom: 2rem;
    line-height: 1.7;
  }

  .hero-features {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2.5rem;
  }

  .feature-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-radius: var(--radius-lg);
    background: white;
    box-shadow: var(--shadow-sm);
    transition: all 0.3s ease;
    opacity: 0.7;
  }

  .feature-card.active {
    opacity: 1;
    box-shadow: var(--shadow-md);
    transform: translateX(5px);
  }

  .feature-icon {
    color: var(--primary-600);
    flex-shrink: 0;
  }

  .feature-content h3 {
    font-size: var(--text-lg);
    font-weight: 600;
    color: var(--gray-900);
    margin-bottom: 0.25rem;
  }

  .feature-content p {
    font-size: var(--text-sm);
    color: var(--gray-600);
  }

  .hero-cta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .btn-large {
    padding: 1rem 2rem;
    font-size: var(--text-lg);
  }

  .hero-visual {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .hero-image-container {
    position: relative;
    width: 100%;
    max-width: 500px;
  }

  .hero-image-placeholder {
    background: linear-gradient(135deg, var(--primary-100), var(--primary-200));
    border-radius: var(--radius-2xl);
    padding: 3rem;
    text-align: center;
    box-shadow: var(--shadow-lg);
  }

  .hero-image-icon {
    color: var(--primary-600);
    margin-bottom: 1rem;
  }

  .hero-image-placeholder p {
    color: var(--primary-700);
    font-weight: 600;
  }

  .hero-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-top: 2rem;
  }

  .stat-item {
    text-align: center;
    padding: 1rem;
    background: white;
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
  }

  .stat-number {
    display: block;
    font-size: var(--text-2xl);
    font-weight: 700;
    color: var(--primary-600);
  }

  .stat-label {
    font-size: var(--text-sm);
    color: var(--gray-600);
  }

  @media (max-width: 768px) {
    .hero-section {
      padding: 2rem 0;
    }

    .hero-content {
      grid-template-columns: 1fr;
      gap: 2rem;
      text-align: center;
    }

    .hero-title {
      font-size: var(--text-4xl);
    }

    .hero-subtitle {
      font-size: var(--text-lg);
    }

    .hero-cta {
      flex-direction: column;
      align-items: center;
    }

    .hero-stats {
      grid-template-columns: 1fr;
    }
  }
`;

document.head.appendChild(style);

export default HeroSection;
