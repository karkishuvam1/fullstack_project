import React from 'react';

const HeroSection = () => {
  return (
    <div className="lambo-hero-wrapper">
      <section className="lambo-hero">
        <img
          src="/assets/hero-bg.jpg"
          alt="Lamborghini Revuelto"
          className="lambo-hero-bg"
        />
        <div className="lambo-hero-overlay" />

        <div className="lambo-hero-content">
          <span className="lambo-hero-subtitle">
            HPEV Super Sports Car
          </span>
          <h1 className="lambo-hero-title">REVUELTO</h1>
          <p style={{ color: 'var(--lambo-text-gray)', marginBottom: '2rem', fontSize: '1rem', fontWeight: 300 }}>
            From near perfection to absolute perfection. The first High Performance Electrified Vehicle hybrid super sports car.
          </p>
          <button className="lambo-btn-gold lambo-cut">
            Explore Model
          </button>
        </div>
      </section>

      {/* Floating Specs Bar */}
      <div className="lambo-specs-bar-overlap">
        <div className="lambo-specs-grid lambo-cut">
          <div className="spec-item">
            <p className="spec-label">Max Power</p>
            <p className="spec-value gold">1015 CV</p>
          </div>
          <div className="spec-item">
            <p className="spec-label">Top Speed</p>
            <p className="spec-value">&gt; 350 km/h</p>
          </div>
          <div className="spec-item">
            <p className="spec-label">0-100 km/h</p>
            <p className="spec-value">2.5 s</p>
          </div>
          <div className="spec-item">
            <p className="spec-label">Engine</p>
            <p className="spec-value gold">V12 Hybrid</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;