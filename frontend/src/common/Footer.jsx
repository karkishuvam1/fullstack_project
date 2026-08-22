import React from 'react';

const Footer = () => {
  return (
    <footer className="lambo-footer">
      <div className="footer-grid">
        <div className="footer-column">
          <h4 style={{ color: 'var(--lambo-gold)' }}>Lamborghini</h4>
          <p>Automobili Lamborghini S.p.A. - Pure Italian luxury super sports cars.</p>
        </div>
        <div className="footer-column">
          <h4>Models</h4>
          <ul>
            <li>Revuelto</li>
            <li>Urus</li>
            <li>Temerario</li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>Quick Links</h4>
          <ul>
            <li>Book Test Drive</li>
            <li>Configurator</li>
            <li>Dealer Locator</li>
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