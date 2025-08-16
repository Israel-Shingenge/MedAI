import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Menu, X, Activity, Phone, Info } from 'lucide-react';
import '../styles/design-system.css';

const EnhancedNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: 'Home', icon: Activity },
    { path: '/dashboard', label: 'Dashboard', icon: Activity },
    { path: '/diagnose', label: 'Diagnose', icon: Activity },
    { path: '/patientportal', label: 'Patients', icon: Activity },
    { path: '/about', label: 'About', icon: Info },
    { path: '/contact', label: 'Contact', icon: Phone },
  ];

  return (
    <div className="app-layout">
      <nav className={`navbar ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container">
          <div className="navbar-content">
            <div className="logo-section">
              <Activity className="logo-icon" size={28} />
              <span className="logo-text">MicroAI Diagnostics</span>
            </div>

            {/* Desktop Navigation */}
            <ul className="nav-links-desktop">
              {navLinks.map(({ path, label }) => (
                <li key={path}>
                  <NavLink 
                    to={path} 
                    className={({ isActive }) => 
                      `nav-link ${isActive ? 'nav-link-active' : ''}`
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Mobile Menu Button */}
            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="mobile-menu">
              <ul className="nav-links-mobile">
                {navLinks.map(({ path, label }) => (
                  <li key={path}>
                    <NavLink 
                      to={path} 
                      className={({ isActive }) => 
                        `nav-link-mobile ${isActive ? 'nav-link-mobile-active' : ''}`
                      }
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

// Add enhanced styles
const style = document.createElement('style');
style.textContent = `
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--gray-200);
    z-index: 1000;
    transition: all 0.3s ease;
  }

  .navbar-scrolled {
    background: rgba(255, 255, 255, 0.98);
    box-shadow: var(--shadow-lg);
  }

  .navbar-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.1rem 0;
  }

  .logo-section {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 700;
    font-size: 1.5rem;
    color: var(--primary-600);
  }

  .logo-icon {
    color: var(--primary-600);
  }

  .nav-links-desktop {
    display: flex;
    list-style: none;
    gap: 2rem;
    margin: 0;
    padding: 0;
  }

  .nav-link {
    color: var(--gray-600);
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: var(--radius-lg);
    transition: all 0.2s ease;
    position: relative;
  }

  .nav-link:hover {
    color: var(--primary-600);
    background: var(--primary-50);
  }

  .nav-link-active {
    color: var(--primary-600);
    background: var(--primary-100);
  }

  .mobile-menu-btn {
    display: none;
    background: none;
    border: none;
    color: var(--gray-600);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: var(--radius-md);
    transition: all 0.2s ease;
  }

  .mobile-menu-btn:hover {
    background: var(--gray-100);
    color: var(--gray-800);
  }

  .mobile-menu {
    display: none;
    padding: 1rem 0;
    border-top: 1px solid var(--gray-200);
  }

  .nav-links-mobile {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .nav-link-mobile {
    display: block;
    color: var(--gray-600);
    text-decoration: none;
    font-weight: 500;
    padding: 0.75rem 1rem;
    border-radius: var(--radius-md);
    transition: all 0.2s ease;
  }

  .nav-link-mobile:hover {
    color: var(--primary-600);
    background: var(--primary-50);
  }

  .nav-link-mobile-active {
    color: var(--primary-600);
    background: var(--primary-100);
  }

  .main-content {
    margin-top: 30px;
    min-height: calc(100vh - 60px);
  }

  @media (max-width: 768px) {
    .nav-links-desktop {
      display: none;
    }

    .mobile-menu-btn {
      display: block;
    }

    .mobile-menu {
      display: block;
    }

    .navbar-content {
      padding: 0.75rem 0;
    }

    .logo-text {
      font-size: 1.25rem;
    }
  }
`;

document.head.appendChild(style);

export default EnhancedNavbar;
