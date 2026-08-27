import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { to: '/cars', label: 'Models' },
  { to: '/compare', label: 'Compare' },
  { to: '/about', label: 'Experience' },
  { to: '/dealers', label: 'Dealers' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    setIsMenuOpen(false);
    navigate('/home');
  };

  return (
    <>
      <nav className={`lambo-nav${isScrolled ? ' is-scrolled' : ''}`}>
        <Link to="/home" className="lambo-nav-logo">
          Lamborghini
        </Link>

        <ul className="lambo-nav-links">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={location.pathname === link.to || location.pathname.startsWith(link.to + '/') ? 'is-active' : ''}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="lambo-nav-actions">
          <Link to="/book-test-drive" className="lambo-btn-outline" style={{ marginRight: '0.5rem' }}>
            Test Drive
          </Link>

          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="lambo-btn-outline"
                onClick={() => setShowDropdown((prev) => !prev)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--lambo-gold)',
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                }}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
                {user?.name?.split(' ')[0]}
              </button>
              {showDropdown && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 0.5rem)',
                  background: 'var(--lambo-card-bg, #111)',
                  border: '1px solid var(--lambo-border, #222)',
                  borderRadius: '4px',
                  minWidth: '180px',
                  zIndex: 200,
                  overflow: 'hidden',
                }}>
                  <Link
                    to="/dashboard"
                    onClick={() => setShowDropdown(false)}
                    style={{
                      display: 'block',
                      padding: '0.75rem 1rem',
                      color: '#fff',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-base)',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(229, 184, 0, 0.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    My Dashboard
                  </Link>
                  {user?.role === 'admin' && (
                    <div style={{ borderTop: '1px solid var(--lambo-border, #222)' }}>
                      <div style={{
                        padding: '0.5rem 1rem',
                        fontSize: '0.65rem',
                        color: 'var(--lambo-gold)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontFamily: 'var(--font-display)',
                      }}>
                        Admin
                      </div>
                      <Link
                        to="/dashboard?tab=bookings"
                        onClick={() => setShowDropdown(false)}
                        style={{
                          display: 'block',
                          padding: '0.75rem 1rem',
                          color: '#fff',
                          textDecoration: 'none',
                          fontSize: '0.8rem',
                          fontFamily: 'var(--font-base)',
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(229, 184, 0, 0.15)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        Manage Bookings
                      </Link>
                    </div>
                  )}
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '0.75rem 1rem',
                      color: '#fff',
                      background: 'transparent',
                      border: 'none',
                      borderTop: '1px solid var(--lambo-border, #222)',
                      textAlign: 'left',
                      fontSize: '0.8rem',
                      fontFamily: 'var(--font-base)',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(192, 106, 82, 0.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="lambo-btn-outline">
              Join us
            </Link>
          )}

          <button
            type="button"
            className={`lambo-nav-burger${isMenuOpen ? ' is-open' : ''}`}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div className={`lambo-nav-mobile-panel${isMenuOpen ? ' is-open' : ''}`}>
        {NAV_LINKS.map((link) => (
          <Link key={link.to} to={link.to} onClick={() => setIsMenuOpen(false)}>
            {link.label}
          </Link>
        ))}
        <Link to="/book-test-drive" onClick={() => setIsMenuOpen(false)}>
          Book Test Drive
        </Link>
        <Link to="/configurator" onClick={() => setIsMenuOpen(false)}>
          Configurator
        </Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
              My Dashboard
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontFamily: 'var(--font-display)',
                fontSize: '1.4rem',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                cursor: 'pointer',
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link to="/login" className="lambo-btn-gold lambo-cut" onClick={() => setIsMenuOpen(false)}>
            Sign In
          </Link>
        )}
      </div>
    </>
  );
};

export default Navbar;
