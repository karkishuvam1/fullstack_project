import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-neutral-400 py-12 border-t border-neutral-800 px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 className="text-white text-lg font-bold uppercase mb-4 tracking-widest">Lamborghini</h3>
          <p className="text-sm">Automobili Lamborghini S.p.A. - Pure Italian luxury super sports cars.</p>
        </div>
        <div>
          <h4 className="text-white text-sm uppercase font-semibold mb-3">Models</h4>
          <ul className="space-y-2 text-sm">
            <li>Revuelto</li>
            <li>Urus</li>
            <li>Temerario</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-sm uppercase font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>Book Test Drive</li>
            <li>Configurator</li>
            <li>Dealer Locator</li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-sm uppercase font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li>Privacy Policy</li>
            <li>Cookie Settings</li>
            <li>Terms of Use</li>
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-neutral-600 border-t border-neutral-900 pt-6">
        © {new Date().getFullYear()} Automobili Lamborghini S.p.A. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;