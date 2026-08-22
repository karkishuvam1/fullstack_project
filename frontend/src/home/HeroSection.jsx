import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full flex items-center justify-start px-8 md:px-20 bg-neutral-950 overflow-hidden">
      {/* Background Overlay / Video Placeholder */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10" />
      <img
        src="/assets/hero-bg.jpg"
        alt="Lamborghini Hero"
        className="absolute inset-0 w-full h-full object-cover z-0 opacity-70"
      />

      <div className="relative z-20 max-w-2xl text-white space-y-6">
        <span className="text-yellow-500 font-semibold tracking-widest uppercase text-sm">
          From Now On
        </span>
        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-none">
          REVUELTO
        </h1>
        <p className="text-lg text-neutral-300 font-light">
          From near perfection to absolute perfection. The first HPEV (High Performance Electrified Vehicle) hybrid super sports car.
        </p>
        <div className="flex space-x-4 pt-4">
          <button className="bg-yellow-500 text-black px-8 py-3 uppercase text-sm font-bold tracking-widest hover:bg-yellow-400 transition-colors">
            Explore Model
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;