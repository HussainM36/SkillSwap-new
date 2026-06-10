import React from "react";
import "./Landing.css";
import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="landing-container">
      {/* 🔹 Top Navigation */}
      <nav className="top-bar">
        <div className="logo">SkillSwap</div>

        <div className="auth-buttons">
          <Link to="/login" className="auth-button login">
            Login
          </Link>
          <Link to="/signup" className="auth-button signup">
            Sign Up
          </Link>
        </div>
      </nav>

      {/* 🔹 Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Learn. Teach. Connect.</h1>
          <p className="hero-subtitle">
            Join a vibrant community of learners and mentors who swap skills and grow together.
          </p>

          <div className="hero-actions">
            <Link to="/signup" className="cta-btn">
              Get Started
            </Link>
            <Link to="/dashboard" className="secondary-btn">
              Explore
            </Link>
          </div>
        </div>

        

      </section>

      {/* 🔹 Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why SkillSwap?</h2>

        <div className="features-grid">
          <div className="feature-card">
            <i className="fa-solid fa-users feature-icon"></i>
            <h3>Community-Driven</h3>
            <p>Connect with people who share your passion and interests.</p>
          </div>

          <div className="feature-card">
            <i className="fa-solid fa-lightbulb feature-icon"></i>
            <h3>Learn & Teach</h3>
            <p>Exchange your skills — teach what you know and learn what you love.</p>
          </div>

          <div className="feature-card">
            <i className="fa-solid fa-handshake feature-icon"></i>
            <h3>Match & Collaborate</h3>
            <p>Find perfect learning partners with our intelligent match system.</p>
          </div>
        </div>
      </section>

      {/* 🔹 Footer */}
      <footer className="landing-footer">
        <p>© {new Date().getFullYear()} SkillSwap. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
