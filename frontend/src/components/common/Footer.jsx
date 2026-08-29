import React from 'react';
import { Link } from 'react-router-dom';

const MODELS = [
  { name: 'Revuelto', slug: 'revuelto' },
  { name: 'Urus SE', slug: 'urus-se' },
  { name: 'Temerario', slug: 'temerario' },
  { name: 'Sián FKP 37', slug: 'sian-fkp-37' },
];

const QUICK_LINKS = [
  { label: 'All Models', to: '/cars' },
  { label: 'Compare Models', to: '/compare' },
  { label: 'Ad Personam Configurator', to: '/configurator' },
  { label: 'Book Private Test Drive', to: '/book-test-drive' },
  { label: 'Authorized Dealers', to: '/dealers' },
  { label: 'Heritage & Experience', to: '/about' },
];

export function Footer() {
  return (
    <footer className="lambo-footer">
      <div className="footer-grid">
        <div className="footer-column">
          <h4 style={{ color: 'var(--lambo-gold)', fontSize: '1.1rem', letterSpacing: '0.1em' }}>
            ⚡ Lamborghini
          </h4>
          <p style={{ marginTop: '0.75rem', marginBottom: '1.25rem' }}>
            Automobili Lamborghini S.p.A. — Sant'Agata Bolognese, Italy.
            Pure Italian craftsmanship, unparalleled aerodynamic design, and electrified super sports performance.
          </p>
          <div className="footer-socials">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">IG</a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="YouTube">YT</a>
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X">X</a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">IN</a>
          </div>
        </div>

        <div className="footer-column">
          <h4>Models</h4>
          <ul>
            {MODELS.map((model) => (
              <li key={model.slug}>
                <Link to={`/cars/${model.slug}`}>
                  {model.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-column">
          <h4>Experience</h4>
          <ul>
            {QUICK_LINKS.map((link) => (
              <li key={link.label}>
                <Link to={link.to}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-column">
          <h4>Client Services</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--lambo-text-gray)', marginBottom: '0.75rem' }}>
            Sant'Agata Bolognese Flagship Concierge:
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--lambo-gold)', marginBottom: '1rem' }}>
            +39 051 6817611
          </p>
          <p style={{ fontSize: '0.75rem', color: '#888' }}>
            Fuel consumption and emission figures for all models are determined according to the WLTP official testing procedure.
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Automobili Lamborghini S.p.A. A subsidiary of AUDI AG. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
