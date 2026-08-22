import React from 'react';

const cars = [
  { id: '1', name: 'Revuelto', power: '1015 CV', engine: 'V12 Hybrid', image: '/assets/revuelto.jpg' },
  { id: '2', name: 'Urus SE', power: '800 CV', engine: 'V8 Twin-Turbo', image: '/assets/urus.jpg' },
  { id: '3', name: 'Temerario', power: '920 CV', engine: 'V8 Hybrid', image: '/assets/temerario.jpg' },
];

const FeaturedCars = () => {
  return (
    <section className="lambo-featured-section">
      <h2 className="section-title">Models</h2>
      <div className="lambo-car-grid">
        {cars.map((car) => (
          <div key={car.id} className="lambo-car-card lambo-cut">
            <div className="car-card-img-wrapper">
              <img src={car.image} alt={car.name} />
            </div>
            <div className="car-card-content">
              <h3 className="car-card-title">{car.name}</h3>
              <p className="car-card-specs">{car.engine} • {car.power}</p>
              <button className="lambo-btn-outline" style={{ width: '100%' }}>
                View Specs
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCars;