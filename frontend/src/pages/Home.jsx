import React from 'react';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import HeroSection from '../home/HeroSection';
import FeaturedCars from '../home/FeaturedCars';
import Testimonials from '../home/Testimonials';
import Newsletter from '../home/Newsletter';
import '../styles/Home.css';

const Home = () => {
  return (
    /* This wrapper enforces home.css rules regardless of App.css changes */
    <div className="lambo-home-page">
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