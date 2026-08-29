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
  const { user, isAuthenticated, isAdmin, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setShowDropdown(false);
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
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderColor: isAdmin ? 'var(--lambo-gold, #e5b800)' : 'var(--lambo-border)',
                }}
              >
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: isAdmin ? '#e5b800' : 'var(--lambo-gold)',
                  color: '#000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                }}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
                <span>{user?.name?.split(' ')[0]}</span>
                {isAdmin && (
                  <span style={{
                    fontSize: '0.58rem',
                    background: 'rgba(229, 184, 0, 0.2)',
                    color: '#e5b800',
                    padding: '0.15rem 0.35rem',
                    borderRadius: '2px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}>
                    Admin
                  </span>
                )}
              </button>

              {showDropdown && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 0.5rem)',
                  background: 'var(--lambo-card-bg, #111)',
                  border: '1px solid var(--lambo-border, #222)',
                  borderRadius: '4px',
                  minWidth: '200px',
                  zIndex: 300,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                  overflow: 'hidden',
                }}>
                  {isAdmin ? (
                    <>
                      <div style={{
                        padding: '0.65rem 1rem',
                        fontSize: '0.65rem',
                        color: 'var(--lambo-gold, #e5b800)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        fontFamily: 'var(--font-display)',
                        borderBottom: '1px solid #222',
                        background: '#0d0d0f',
                      }}>
                        ★ Admin Management
                      </div>
                      <DropdownLink to="/admin" label="Dashboard Overview" onClick={() => setShowDropdown(false)} />
                      <DropdownLink to="/admin/cars" label="Manage Inventory" onClick={() => setShowDropdown(false)} />
                      <DropdownLink to="/admin/orders" label="Manage Orders" onClick={() => setShowDropdown(false)} />
                      <DropdownLink to="/admin/users" label="Manage Users" onClick={() => setShowDropdown(false)} />
                      <div style={{ borderTop: '1px solid #222' }} />
                      <DropdownLink to="/dashboard" label="My Bookings View" onClick={() => setShowDropdown(false)} />
                    </>
                  ) : (
                    <>
                      <div style={{
                        padding: '0.65rem 1rem',
                        fontSize: '0.65rem',
                        color: '#888',
                        textTransform: 'uppercase',
                        letterSpacing: '0.15em',
                        fontFamily: 'var(--font-display)',
                        borderBottom: '1px solid #222',
                        background: '#0d0d0f',
                      }}>
                        Client Account
                      </div>
                      <DropdownLink to="/dashboard" label="My Dashboard" onClick={() => setShowDropdown(false)} />
                      <DropdownLink to="/profile" label="Personal Profile" onClick={() => setShowDropdown(false)} />
                      <DropdownLink to="/configurator" label="Car Configurator" onClick={() => setShowDropdown(false)} />
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '0.75rem 1rem',
                      color: '#e57373',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Link to="/login" className="lambo-btn-outline">
                Sign In
              </Link>
              <Link
                to="/admin/login"
                style={{
                  color: 'var(--lambo-gold, #e5b800)',
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontFamily: 'var(--font-display)',
                  padding: '0.45rem 0.6rem',
                  border: '1px solid rgba(229, 184, 0, 0.25)',
                  borderRadius: '2px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(229, 184, 0, 0.15)';
                  e.currentTarget.style.borderColor = '#e5b800';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.borderColor = 'rgba(229, 184, 0, 0.25)';
                }}
              >
                Admin
              </Link>
            </div>
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
            {isAdmin && (
              <Link to="/admin" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--lambo-gold)' }}>
                ★ Admin Console
              </Link>
            )}
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
          <>
            <Link to="/login" className="lambo-btn-gold lambo-cut" onClick={() => setIsMenuOpen(false)}>
              Sign In
            </Link>
            <Link to="/admin/login" onClick={() => setIsMenuOpen(false)} style={{ fontSize: '0.85rem', color: '#e5b800' }}>
              Administrator Portal →
            </Link>
          </>
        )}
      </div>
    </>
  );
};

function DropdownLink({ to, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      style={{
        display: 'block',
        padding: '0.7rem 1rem',
        color: '#fff',
        textDecoration: 'none',
        fontSize: '0.78rem',
        fontFamily: 'var(--font-base)',
        transition: 'background 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229, 184, 0, 0.15)')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      {label}
    </Link>
  );
}

export default Navbar;
