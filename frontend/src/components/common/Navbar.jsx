import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';

const NAV_LINKS = [
  { to: '/cars', label: 'Models' },
  { to: '/compare', label: 'Compare' },
  { to: '/configurator', label: 'Configurator' },
  { to: '/dealers', label: 'Dealers' },
  { to: '/about', label: 'Heritage' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { count: wishlistCount } = useWishlist();

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
          <span>⚡</span> Lamborghini
        </Link>

        <ul className="lambo-nav-links">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={location.pathname === link.to || (link.to !== '/home' && location.pathname.startsWith(link.to)) ? 'is-active' : ''}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="lambo-nav-actions">
          <Link
            to="/wishlist"
            className="lambo-btn-outline"
            style={{ padding: '0.5rem 0.9rem', fontSize: '0.75rem', position: 'relative' }}
            title="Wishlist"
          >
            ♥
            {wishlistCount > 0 && (
              <span style={{
                marginLeft: '0.35rem',
                background: 'var(--lambo-gold)',
                color: '#000',
                padding: '0.1rem 0.4rem',
                borderRadius: '10px',
                fontSize: '0.65rem',
                fontWeight: 800,
              }}>
                {wishlistCount}
              </span>
            )}
          </Link>

          <Link to="/book-test-drive" className="lambo-btn-gold lambo-cut" style={{ padding: '0.55rem 1.1rem', fontSize: '0.75rem' }}>
            Test Drive
          </Link>

          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="lambo-btn-outline"
                onClick={() => setShowDropdown((prev) => !prev)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 0.8rem' }}
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
                  fontWeight: 900,
                }}>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
                <span style={{ fontSize: '0.75rem' }}>{user?.name?.split(' ')[0]}</span>
              </button>

              {showDropdown && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 0.5rem)',
                  background: '#0d0d0d',
                  border: '1px solid var(--lambo-border)',
                  minWidth: '200px',
                  zIndex: 200,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
                }}>
                  <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid var(--lambo-border)' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>{user?.name}</p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--lambo-text-gray)' }}>{user?.email}</p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    style={{
                      display: 'block',
                      padding: '0.75rem 1rem',
                      color: '#fff',
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-display)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229, 184, 0, 0.12)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    👤 My Profile & Orders
                  </Link>

                  <Link
                    to="/wishlist"
                    onClick={() => setShowDropdown(false)}
                    style={{
                      display: 'block',
                      padding: '0.75rem 1rem',
                      color: '#fff',
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-display)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229, 184, 0, 0.12)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    ♡ Saved Cars ({wishlistCount})
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setShowDropdown(false)}
                      style={{
                        display: 'block',
                        padding: '0.75rem 1rem',
                        color: 'var(--lambo-gold)',
                        fontSize: '0.78rem',
                        fontFamily: 'var(--font-display)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        borderTop: '1px solid var(--lambo-border)',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(229, 184, 0, 0.15)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      ⚙ Admin Console
                    </Link>
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
                      borderTop: '1px solid var(--lambo-border)',
                      textAlign: 'left',
                      fontSize: '0.78rem',
                      fontFamily: 'var(--font-display)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(192, 106, 82, 0.15)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="lambo-btn-outline" style={{ padding: '0.55rem 1.1rem', fontSize: '0.75rem' }}>
              Sign In
            </Link>
          )}

          <button
            type="button"
            className={`lambo-nav-burger${isMenuOpen ? ' is-open' : ''}`}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
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
        <Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>
          Wishlist ({wishlistCount})
        </Link>
        <Link to="/book-test-drive" onClick={() => setIsMenuOpen(false)}>
          Book Test Drive
        </Link>
        <Link to="/checkout" onClick={() => setIsMenuOpen(false)}>
          Reserve a Model
        </Link>
        {isAuthenticated ? (
          <>
            <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
              My Profile & Orders
            </Link>
            {isAdmin && (
              <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)} style={{ color: 'var(--lambo-gold)' }}>
                Admin Dashboard
              </Link>
            )}
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#e57373',
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                textTransform: 'uppercase',
                textAlign: 'left',
                padding: 0,
                cursor: 'pointer',
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link to="/login" className="lambo-btn-gold lambo-cut" onClick={() => setIsMenuOpen(false)} style={{ textAlign: 'center' }}>
            Sign In / Register
          </Link>
        )}
      </div>
    </>
  );
}

export default Navbar;
