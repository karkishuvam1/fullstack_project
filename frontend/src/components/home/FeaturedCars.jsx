import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCars } from '../../services/carService';
import { useWishlist } from '../../context/WishlistContext';
import CarCard from '../cars/CarCard';
import Modal from '../common/Modal';
import formatCurrency from '../../utils/formatCurrency';

const fallbackCars = [
  {
    _id: '1',
    name: 'Revuelto',
    slug: 'revuelto',
    category: 'Super Sports',
    power: '1015 CV',
    engine: 'V12 Hybrid',
    topSpeed: '> 350 km/h',
    zeroToHundred: '2.5 s',
    weight: '1,772 kg',
    image: 'https://images.unsplash.com/photo-1620223741726-7d39ff6e4e6c?auto=format&fit=crop&w=1200&q=80',
    blurb: 'The first V12 hybrid super sports car — three electric motors and a naturally-aspirated heart working as one.',
    description: 'The Lamborghini Revuelto combines the legendary V12 with three electric motors for 1015 CV.',
    startingPrice: 608358,
  },
  {
    _id: '2',
    name: 'Urus SE',
    slug: 'urus-se',
    category: 'Super SUV',
    power: '800 CV',
    engine: 'V8 Twin-Turbo Hybrid',
    topSpeed: '312 km/h',
    zeroToHundred: '3.4 s',
    weight: '2,150 kg',
    image: 'https://images.unsplash.com/photo-1575650681837-c0ca3b1e7275?auto=format&fit=crop&w=1200&q=80',
    blurb: "The world's first Super SUV, now plug-in hybrid — everyday usability with a super sports car soul.",
    description: 'The Urus SE produces 800 CV with up to 60 km of pure electric driving range.',
    startingPrice: 280000,
  },
  {
    _id: '3',
    name: 'Temerario',
    slug: 'temerario',
    category: 'Super Sports',
    power: '920 CV',
    engine: 'V8 Hybrid',
    topSpeed: '343 km/h',
    zeroToHundred: '2.7 s',
    weight: '1,690 kg',
    image: 'https://images.unsplash.com/photo-1776690061399-d2e7f7e88751?auto=format&fit=crop&w=1200&q=80',
    blurb: 'A new twin-turbo V8 paired with three electric motors — the next chapter of the V8 Huracán line.',
    description: 'The Temerario revs to 10,000 RPM delivering 920 horsepower with all-wheel drive precision.',
    startingPrice: 360000,
  },
];

export function FeaturedCars() {
  const [activeCar, setActiveCar] = useState(null);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toggleWishlist, wishlistIds } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await getCars();
        if (mounted) {
          setCars(data && data.length > 0 ? data.slice(0, 3) : fallbackCars);
        }
      } catch (err) {
        if (mounted) setCars(fallbackCars);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <section className="lambo-featured-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span style={{
            color: 'var(--lambo-gold)',
            fontFamily: 'var(--font-display)',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 700,
          }}>
            Sant'Agata Bolognese Line-Up
          </span>
          <h2 className="section-title" style={{ margin: 0 }}>
            Featured Models
          </h2>
        </div>
        <Link to="/cars" className="lambo-btn-outline" style={{ textDecoration: 'none' }}>
          View All Models &rarr;
        </Link>
      </div>

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
            <CarCard
              key={car._id}
              car={car}
              onViewSpecs={setActiveCar}
              onToggleWishlist={toggleWishlist}
              isWishlisted={wishlistIds.includes(car._id)}
            />
          ))}
        </div>
      )}

      <Modal
        isOpen={!!activeCar}
        onClose={() => setActiveCar(null)}
        title={activeCar?.name}
        maxWidth="720px"
      >
        {activeCar && (
          <div>
            <img
              src={activeCar.image}
              alt={activeCar.name}
              style={{ width: '100%', height: '260px', objectFit: 'cover', marginBottom: '1.25rem', border: '1px solid var(--lambo-border)' }}
            />
            <span style={{ color: 'var(--lambo-gold)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'var(--font-display)' }}>
              {activeCar.category}
            </span>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', textTransform: 'uppercase', margin: '0.35rem 0 0.75rem 0' }}>
              {activeCar.name}
            </h3>
            <p style={{ color: 'var(--lambo-text-gray)', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {activeCar.blurb || activeCar.description}
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '1px',
              background: 'var(--lambo-border)',
              marginBottom: '1.5rem',
            }}>
              {[
                ['Engine', activeCar.engine],
                ['Power', activeCar.power],
                ['0-100 km/h', activeCar.zeroToHundred || activeCar.zeroToSixty],
                ['Top Speed', activeCar.topSpeed],
                ['Starting Price', formatCurrency(activeCar.startingPrice)],
              ].map(([label, val]) => (
                <div key={label} style={{ background: '#0a0a0a', padding: '0.85rem' }}>
                  <p style={{ fontSize: '0.6rem', color: 'var(--lambo-text-gray)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>{label}</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 800, color: label.includes('Price') ? 'var(--lambo-gold)' : '#fff' }}>{val || '—'}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="lambo-btn-gold lambo-cut"
                style={{ flex: 1, padding: '0.8rem' }}
                onClick={() => {
                  const slug = activeCar.slug;
                  setActiveCar(null);
                  navigate(`/cars/${slug}`);
                }}
              >
                Full Vehicle Details
              </button>
              <button
                type="button"
                className="lambo-btn-outline"
                style={{ flex: 1, padding: '0.8rem' }}
                onClick={() => {
                  const slug = activeCar.slug;
                  setActiveCar(null);
                  navigate(`/configurator/${slug}`);
                }}
              >
                Configure
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}

export default FeaturedCars;
