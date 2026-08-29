import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#080808',
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      textAlign: 'center',
      fontFamily: 'var(--font-base, sans-serif)',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'radial-gradient(ellipse at center, rgba(229,184,0,0.07) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <h1 style={{
          fontFamily: 'var(--font-display, sans-serif)',
          fontSize: 'clamp(5rem, 18vw, 12rem)',
          fontWeight: 900,
          lineHeight: 0.9,
          background: 'linear-gradient(180deg, #e5b800 0%, #c06a52 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          marginBottom: '1rem',
          letterSpacing: '0.05em',
        }}>404</h1>
        <p style={{
          color: 'var(--lambo-gold, #e5b800)',
          fontFamily: 'var(--font-display, sans-serif)',
          fontSize: '0.8rem',
          textTransform: 'uppercase',
          letterSpacing: '0.3em',
          marginBottom: '1.25rem',
        }}>
          Page Not Found
        </p>
        <h2 style={{
          fontFamily: 'var(--font-display, sans-serif)',
          fontSize: 'clamp(1.25rem, 3vw, 1.75rem)',
          textTransform: 'uppercase',
          marginBottom: '1rem',
        }}>
          You've Taken a Wrong Turn
        </h2>
        <p style={{
          color: 'var(--lambo-text-gray, #999)',
          maxWidth: '500px',
          margin: '0 auto 2.5rem',
          lineHeight: 1.65,
        }}>
          The page you are looking for doesn't exist, was moved, or has been retired.
          Navigate back to a proper road and continue your journey.
        </p>
        <div style={{
          display: 'flex',
          gap: '0.75rem',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <Link to="/home" className="lambo-btn-gold lambo-cut" style={{ textDecoration: 'none' }}>
            Return Home
          </Link>
          <Link to="/cars" className="lambo-btn-outline" style={{ textDecoration: 'none' }}>
            Browse Models
          </Link>
          <button onClick={() => window.history.back()} className="lambo-btn-outline" style={{ padding: '0.8rem 1.5rem' }}>
            Go Back
          </button>
        </div>
      </div>

      <style>{`
        .lambo-btn-gold.lambo-cut {
          background: var(--lambo-gold, #e5b800);
          color: #14110c;
          font-family: var(--font-display, sans-serif);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0.8rem 1.5rem;
          border: none;
          cursor: pointer;
          font-weight: 700;
          clip-path: polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%);
        }
        .lambo-btn-outline {
          background: transparent;
          border: 1px solid var(--lambo-gold, #e5b800);
          color: #fff;
          font-family: var(--font-display, sans-serif);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0.8rem 1.5rem;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.8rem;
          transition: all 0.2s ease;
        }
        .lambo-btn-outline:hover {
          background: rgba(229,184,0,0.12);
          color: var(--lambo-gold, #e5b800);
        }
      `}</style>
    </div>
  );
}

export default NotFound;
