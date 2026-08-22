import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import HeroSection from '../components/home/HeroSection';
import FeaturedCars from '../components/home/FeaturedCars';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';

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