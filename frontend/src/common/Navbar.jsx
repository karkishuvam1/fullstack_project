import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/cars', label: 'Models' },
  { to: '/compare', label: 'Compare' },
  { to: '/about', label: 'Experience' },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Solid background only kicks in once the visitor scrolls past the hero,
  // so the hero image reads full-bleed on load.
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav className={`lambo-nav${isScrolled ? ' is-scrolled' : ''}`}>
        <Link to="/" className="lambo-nav-logo">
          Lamborghini
        </Link>

        <ul className="lambo-nav-links">
          {NAV_LINKS.map((link) => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={location.pathname === link.to ? 'is-active' : ''}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="lambo-nav-actions">
          <Link to="/book-test-drive" className="lambo-btn-outline">
            Test Drive
          </Link>
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
          <Link key={link.to} to={link.to}>
            {link.label}
          </Link>
        ))}
        <Link to="/book-test-drive" className="lambo-btn-gold lambo-cut">
          Test Drive
        </Link>
      </div>
    </>
  );
};

export default Navbar;
