import React from 'react';
import { Link } from 'react-router-dom';

const MODELS = ['Revuelto', 'Urus', 'Temerario', 'Huracán'];
const QUICK_LINKS = [
  { label: 'Book Test Drive', to: '/book-test-drive' },
  { label: 'Configurator', to: '/configurator' },
  { label: 'Dealer Locator', to: '/dealers' },
];

const SOCIALS = [
  {
    label: 'YouTube',
    href: 'https://youtu.be/1E4CDn4B7wo?si=EjOXU_rKGMi-NBdF',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="5" width="20" height="14" rx="4" />
        <path d="M10 9.5v5l5-2.5-5-2.5z" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

const Footer = () => {
  return (
    <footer className="lambo-footer">
      <div className="footer-grid">
        <div className="footer-column">
          <h4 style={{ color: 'var(--lambo-gold)' }}>Lamborghini</h4>
          <p>Automobili Lamborghini S.p.A. — Pure Italian luxury super sports cars.</p>
          <div className="footer-socials">
            {SOCIALS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-column">
          <h4>Models</h4>
          <ul>
            {MODELS.map((model) => (
              <li key={model}>
                <Link to={`/cars/${model.toLowerCase().replace(' ', '-')}`} className="footer-link" style={{ textDecoration: 'none', color: 'inherit' }}>
                  {model}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            {QUICK_LINKS.map((link) => (
              <li key={link.label}>
                <Link to={link.to} style={{ textDecoration: 'none', color: 'inherit' }}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        © {new Date().getFullYear()} Automobili Lamborghini S.p.A. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
