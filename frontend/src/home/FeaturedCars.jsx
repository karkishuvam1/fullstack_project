import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useOnScreen from '../common/useonScreen';
import { getCars } from '../services/CarService';
import { getImageUrl, handleImageError } from '../utils/imageUrl';

const fallbackCars = [
  {
    _id: '1',
    name: 'Revuelto',
    slug: 'revuelto',
    power: '1015 CV',
    engine: 'V12 Hybrid',
    topSpeed: '> 350 km/h',
    zeroToHundred: '2.5 s',
    weight: '1,772 kg',
    image:
      'https://images.unsplash.com/photo-1620223741726-7d39ff6e4e6c?auto=format&fit=crop&w=1200&q=80',
    blurb:
      'The first V12 hybrid super sports car — three electric motors and a naturally-aspirated heart working as one.',
  },
  {
    _id: '2',
    name: 'Urus SE',
    slug: 'urus-se',
    power: '800 CV',
    engine: 'V8 Twin-Turbo Hybrid',
    topSpeed: '312 km/h',
    zeroToHundred: '3.4 s',
    weight: '2,150 kg',
    image:
      'https://images.unsplash.com/photo-1575650681837-c0ca3b1e7275?auto=format&fit=crop&w=1200&q=80',
    blurb:
      "The world's first Super SUV, now plug-in hybrid — everyday usability with a super sports car soul.",
  },
  {
    _id: '3',
    name: 'Temerario',
    slug: 'temerario',
    power: '920 CV',
    engine: 'V8 Hybrid',
    topSpeed: '343 km/h',
    zeroToHundred: '2.7 s',
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
        <img
          src={getImageUrl(car.image, car.slug)}
          alt={`Lamborghini ${car.name}`}
          loading="lazy"
          onError={(e) => handleImageError(e, car.slug)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </div>
      <div className="car-card-content">
        <h3 className="car-card-title">{car.name}</h3>
        <p className="car-card-specs">
          {car.engine} • {car.power} • 0-100: {car.zeroToHundred || car.zeroToSixty || '-- s'}
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
  const navigate = useNavigate();
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
        <img
          src={getImageUrl(car.image, car.slug)}
          alt={`Lamborghini ${car.name}`}
          className="lambo-modal-img"
          onError={(e) => handleImageError(e, car.slug)}
        />
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
              <p className="spec-value" style={{ fontSize: '1.1rem' }}>{car.zeroToHundred}</p>
            </div>
            <div className="spec-item">
              <p className="spec-label">Dry Weight</p>
              <p className="spec-value" style={{ fontSize: '1.1rem' }}>{car.weight}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
            <button
              type="button"
              className="lambo-btn-outline"
              style={{ flex: 1 }}
              onClick={() => {
                onClose();
                navigate(`/cars/${car.slug}`);
              }}
            >
              Full Details
            </button>
            <button
              type="button"
              className="lambo-btn-gold lambo-cut"
              style={{ flex: 1 }}
              onClick={() => {
                onClose();
                navigate(`/configurator/${car.slug}`);
              }}
            >
              Configure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturedCars = () => {
  const [activeCar, setActiveCar] = useState(null);
  const [headerRef, headerVisible] = useOnScreen();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchCars() {
      try {
        const data = await getCars();
        if (mounted && data && data.length > 0) {
          setCars(data);
        } else if (mounted) {
          setCars(fallbackCars);
        }
      } catch (error) {
        if (mounted) setCars(fallbackCars);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchCars();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="lambo-featured-section">
      <h2 className={`section-title reveal${headerVisible ? ' is-visible' : ''}`} ref={headerRef}>
        Models
      </h2>
      {loading ? (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          padding: '4rem',
          color: 'var(--lambo-gold)',
          fontFamily: 'var(--font-display)',
        }}>
          Loading models...
        </div>
      ) : (
        <div className="lambo-car-grid">
          {cars.map((car) => (
            <CarCard key={car._id} car={car} onViewSpecs={setActiveCar} />
          ))}
        </div>
      )}

      <SpecModal car={activeCar} onClose={() => setActiveCar(null)} />
    </section>
  );
};

export default FeaturedCars;
