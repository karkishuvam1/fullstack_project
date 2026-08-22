import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-neutral-800 text-white px-8 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-black tracking-widest uppercase text-yellow-500">
        LAMBORGHINI
      </Link>
      <ul className="hidden md:flex space-x-8 text-sm uppercase tracking-wider font-semibold">
        <li><Link to="/cars" className="hover:text-yellow-500 transition-colors">Models</Link></li>
        <li><Link to="/compare" className="hover:text-yellow-500 transition-colors">Compare</Link></li>
        <li><Link to="/about" className="hover:text-yellow-500 transition-colors">Experience</Link></li>
      </ul>
      <div className="flex items-center space-x-4">
        <Link to="/book-test-drive" className="border border-yellow-500 text-yellow-500 px-4 py-2 uppercase text-xs tracking-widest hover:bg-yellow-500 hover:text-black transition-all">
          Test Drive
        </Link>
        <Link to="/login" className="text-sm uppercase tracking-wider hover:text-yellow-500">
          Account
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;