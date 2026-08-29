import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

export function MainLayout() {
  return (
    <div className="lambo-home-page">
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
