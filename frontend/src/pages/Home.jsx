import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import HeroSection from '../home/HeroSection';
import FeaturedCars from '../home/FeaturedCars';
import Testimonials from '../home/Testimonials';
import Newsletter from '../home/Newsletter';

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedCars />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Home;