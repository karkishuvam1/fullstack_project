import React from 'react';

const cars = [
  { id: '1', name: 'Revuelto', power: '1015 CV', engine: 'V12 Hybrid', image: '/assets/revuelto.jpg' },
  { id: '2', name: 'Urus SE', power: '800 CV', engine: 'V8 Twin-Turbo', image: '/assets/urus.jpg' },
  { id: '3', name: 'Temerario', power: '920 CV', engine: 'V8 Hybrid', image: '/assets/temerario.jpg' },
];

const FeaturedCars = () => {
  return (
    <section className="py-20 bg-neutral-900 text-white px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-wider mb-12 border-l-4 border-yellow-500 pl-4">
          Models
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cars.map((car) => (
            <div key={car.id} className="bg-black border border-neutral-800 group hover:border-yellow-500 transition-all overflow-hidden">
              <div className="h-64 overflow-hidden">
                <img src={car.image} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold uppercase mb-2">{car.name}</h3>
                <p className="text-neutral-400 text-sm mb-4">{car.engine} • {car.power}</p>
                <button className="w-full py-2 border border-neutral-700 text-sm uppercase tracking-wider hover:bg-yellow-500 hover:text-black transition-colors">
                  View Specs
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;