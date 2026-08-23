import React, { useRef, useState } from 'react';
import useOnScreen from '../common/useonScreen';

// All photos below are real cars sourced free-to-use under the Unsplash
// License — swap for official Lamborghini press-kit assets in production.
const cars = [
  {
    id: '1',
    name: 'Revuelto',
    power: '1015 CV',
    engine: 'V12 Hybrid',
    topSpeed: '> 350 km/h',
    zeroToSixty: '2.5 s',
    weight: '1,772 kg',
    image:
      'https://images.unsplash.com/photo-1620223741726-7d39ff6e4e6c?auto=format&fit=crop&w=1200&q=80',
    blurb:
      'The first V12 hybrid super sports car — three electric motors and a naturally-aspirated heart working as one.',
  },
  {
    id: '2',
    name: 'Urus SE',
    power: '800 CV',
    engine: 'V8 Twin-Turbo Hybrid',
    topSpeed: '312 km/h',
    zeroToSixty: '3.4 s',
    weight: '2,150 kg',
    image:
      'https://images.unsplash.com/photo-1575650681837-c0ca3b1e7275?auto=format&fit=crop&w=1200&q=80',
    blurb:
      "The world's first Super SUV, now plug-in hybrid — everyday usability with a super sports car soul.",
  },
  {
    id: '3',
    name: 'Temerario',
    power: '920 CV',
    engine: 'V8 Hybrid',
    topSpeed: '343 km/h',
    zeroToSixty: '2.7 s',
    weight: '1,690 kg',
    image:
      'https://images.unsplash.com/photo-1776690061399-d2e7f7e88751?auto=format&fit=crop&w=1200&q=80',
    blurb:
      'A new twin-turbo V8 paired with three electric motors — the next chapter of the V8 Huracán line.',
  },
];

/** A car card that tilts toward the cursor in 3D — released with a spring-back on leave. */
const CarCard = ({ car, onViewSpecs }) => {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const node = cardRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0 -> 1
    const py = (e.clientY - rect.top) / rect.height; // 0 -> 1
    const rotateY = (px - 0.5) * 14; // left/right tilt
    const rotateX = (0.5 - py) * 10; // up/down tilt
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div
      key={car.id}
      ref={cardRef}
      className="lambo-car-card lambo-cut"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.4s ease' : 'none',
      }}
    >
      <div className="car-card-img-wrapper">
        <img src={car.image} alt={`Lamborghini ${car.name}`} loading="lazy" />
      </div>
      <div className="car-card-content">
        <h3 className="car-card-title">{car.name}</h3>
        <p className="car-card-specs">
          {car.engine} • {car.power}
        </p>
        <button
          type="button"
          className="lambo-btn-outline"
          style={{ width: '100%' }}
          onClick={() => onViewSpecs(car)}
        >
          View Specs
        </button>
      </div>
    </div>
  );
};

const SpecModal = ({ car, onClose }) => {
  if (!car) return null;
  return (
    <div className="lambo-modal-backdrop" onClick={onClose}>
      <div
        className="lambo-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${car.name} specifications`}
        onClick={(e) => e.stopPropagation()}
      >
        <img src={car.image} alt={`Lamborghini ${car.name}`} className="lambo-modal-img" />
        <div className="lambo-modal-body">
          <button type="button" className="lambo-modal-close" onClick={onClose} aria-label="Close">
            &times;
          </button>
          <h3 className="car-card-title">{car.name}</h3>
          <p style={{ color: 'var(--lambo-text-gray)', marginTop: '0.75rem', lineHeight: 1.6 }}>
            {car.blurb}
          </p>
          <div className="lambo-modal-specs">
            <div className="spec-item">
              <p className="spec-label">Engine</p>
              <p className="spec-value gold" style={{ fontSize: '1.1rem' }}>{car.engine}</p>
            </div>
            <div className="spec-item">
              <p className="spec-label">Max Power</p>
              <p className="spec-value" style={{ fontSize: '1.1rem' }}>{car.power}</p>
            </div>
            <div className="spec-item">
              <p className="spec-label">Top Speed</p>
              <p className="spec-value" style={{ fontSize: '1.1rem' }}>{car.topSpeed}</p>
            </div>
            <div className="spec-item">
              <p className="spec-label">0-100 km/h</p>
              <p className="spec-value" style={{ fontSize: '1.1rem' }}>{car.zeroToSixty}</p>
            </div>
            <div className="spec-item">
              <p className="spec-label">Dry Weight</p>
              <p className="spec-value" style={{ fontSize: '1.1rem' }}>{car.weight}</p>
            </div>
          </div>
          <button type="button" className="lambo-btn-gold lambo-cut" style={{ width: '100%' }}>
            Configure {car.name}
          </button>
        </div>
      </div>
    </div>
  );
};

const FeaturedCars = () => {
  const [activeCar, setActiveCar] = useState(null);
  const [headerRef, headerVisible] = useOnScreen();

  return (
    <section className="lambo-featured-section">
      <h2 className={`section-title reveal${headerVisible ? ' is-visible' : ''}`} ref={headerRef}>
        Models
      </h2>
      <div className="lambo-car-grid">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} onViewSpecs={setActiveCar} />
        ))}
      </div>

      <SpecModal car={activeCar} onClose={() => setActiveCar(null)} />
    </section>
  );
};

export default FeaturedCars;
