// src/components/Navbar.jsx

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import './styles.css';

const Navbar = () => {
  return (
    <div className="app-layout">
      <nav className="navbar">
        <div className="logo-section">
          MicroAI Diagnostics
        </div>
        <ul className="nav-links">
          <li>
            <NavLink to="/">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard">
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/diagnose">
              Diagnose
            </NavLink>
          </li>
          <li>
            <NavLink to="/patientportal">
              Patient Portal
            </NavLink>
          </li>
          <li>
            <NavLink to="/about">
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact">
              Contact Us
            </NavLink>
          </li>
        </ul>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Navbar;
