import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="lambo-nav">
      <Link to="/" className="lambo-nav-logo">
        LAMBORGHINI
      </Link>
      <ul className="lambo-nav-links">
        <li><Link to="/cars">Models</Link></li>
        <li><Link to="/compare">Compare</Link></li>
        <li><Link to="/about">Experience</Link></li>
      </ul>
      <div>
        <Link to="/book-test-drive" className="lambo-btn-outline">
          Test Drive
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;