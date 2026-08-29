import React from 'react';

export function Loader({ fullscreen = false, message = "Loading Lamborghini telemetry..." }) {
  if (fullscreen) {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(8, 8, 8, 0.95)',
        backdropFilter: 'blur(10px)',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
      }}>
        <div style={{
          width: '54px',
          height: '54px',
          border: '3px solid rgba(229, 184, 0, 0.15)',
          borderTopColor: 'var(--lambo-gold, #e5b800)',
          borderRadius: '50%',
          animation: 'aur-spin 0.8s linear infinite',
        }} />
        <p style={{
          fontFamily: 'var(--font-display, sans-serif)',
          fontSize: '0.8rem',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          color: 'var(--lambo-gold, #e5b800)',
        }}>
          {message}
        </p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 2rem',
      gap: '1rem',
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(229, 184, 0, 0.15)',
        borderTopColor: 'var(--lambo-gold, #e5b800)',
        borderRadius: '50%',
        animation: 'aur-spin 0.8s linear infinite',
      }} />
      <p style={{
        fontFamily: 'var(--font-display, sans-serif)',
        fontSize: '0.75rem',
        textTransform: 'uppercase',
        letterSpacing: '0.15em',
        color: 'var(--lambo-text-gray, #999)',
      }}>
        {message}
      </p>
    </div>
  );
}

export default Loader;
