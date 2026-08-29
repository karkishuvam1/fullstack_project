import React from 'react';
import HeroSection from '../components/home/HeroSection';
import FeaturedCars from '../components/home/FeaturedCars';
import Testimonials from '../components/home/Testimonials';
import Newsletter from '../components/home/Newsletter';

export function Home() {
  return (
    <div style={{ width: '100%' }}>
      <HeroSection />
      <FeaturedCars />
      <Testimonials />
      <Newsletter />
    </div>
  );
}

export default Home;