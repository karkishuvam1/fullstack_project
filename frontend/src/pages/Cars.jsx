import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { getCars } from '../services/CarService';
import '../styles/Home.css';

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
    blurb: 'The first V12 hybrid super sports car.',
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
    blurb: "The world's first Super SUV, now plug-in hybrid.",
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
    blurb: 'A new twin-turbo V8 paired with three electric motors.',
    startingPrice: 360000,
  },
];

const CATEGORIES = ['All', 'Super Sports', 'Super SUV', 'Limited Edition'];

function formatPrice(price) {
  if (!price) return 'Contact for pricing';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    let mounted = true;
    async function fetchCars() {
      try {
        const data = await getCars();
        if (mounted) setCars(data.length > 0 ? data : fallbackCars);
      } catch (error) {
        if (mounted) setCars(fallbackCars);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchCars();
    return () => { mounted = false; };
  }, []);

  const filteredCars = activeCategory === 'All'
    ? cars
    : cars.filter((car) => car.category === activeCategory);

  return (
    <div className="lambo-home-page">
      <Navbar />

      <main style={{ paddingTop: '80px' }}>
        <section style={{
          background: 'linear-gradient(180deg, #0a0a0a 0%, #080808 100%)',
          padding: '4rem 2rem 3rem',
          textAlign: 'center',
          borderBottom: '1px solid var(--lambo-border)',
        }}>
          <span style={{
            color: 'var(--lambo-gold)',
            fontFamily: 'var(--font-display)',
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontWeight: 500,
            display: 'block',
            marginBottom: '1rem',
          }}>
            Full Line-up
          </span>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '3rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>
            Models
          </h1>
          <p style={{
            color: 'var(--lambo-text-gray)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Discover the complete range of Lamborghini super sports cars and Super SUVs.
            Each model is a masterpiece of Italian design and engineering excellence.
          </p>
        </section>

        <section style={{
          padding: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '2.5rem',
            justifyContent: 'center',
          }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  fontFamily: 'var(--font-display)',
                  padding: '0.6rem 1.5rem',
                  background: activeCategory === cat ? 'var(--lambo-gold)' : 'transparent',
                  color: activeCategory === cat ? '#000' : '#fff',
                  border: '1px solid var(--lambo-gold)',
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  fontSize: '0.72rem',
                  letterSpacing: '0.08em',
                  fontWeight: 600,
                  transition: 'all 0.2s ease',
                  clipPath: activeCategory === cat
                    ? 'polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%)'
                    : 'none',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--lambo-gold)', fontFamily: 'var(--font-display)' }}>
              Loading models...
            </div>
          ) : filteredCars.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--lambo-text-gray)' }}>
              No models found in this category.
            </div>
          ) : (
            <div className="lambo-car-grid">
              {filteredCars.map((car) => (
                <Link
                  key={car._id}
                  to={`/cars/${car.slug}`}
                  className="lambo-car-card lambo-cut"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className="car-card-img-wrapper">
                    <img src={car.image} alt={`Lamborghini ${car.name}`} loading="lazy" />
                  </div>
                  <div className="car-card-content">
                    <span style={{
                      color: 'var(--lambo-gold)',
                      fontSize: '0.65rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.15em',
                      fontFamily: 'var(--font-display)',
                      display: 'block',
                      marginBottom: '0.5rem',
                    }}>
                      {car.category}
                    </span>
                    <h3 className="car-card-title">{car.name}</h3>
                    <p className="car-card-specs" style={{ marginBottom: '0.75rem' }}>
                      {car.engine} • {car.power}
                    </p>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '0.75rem',
                      marginBottom: '1.25rem',
                      paddingTop: '0.75rem',
                      borderTop: '1px solid var(--lambo-border)',
                    }}>
                      <div>
                        <p style={{ fontSize: '0.6rem', color: 'var(--lambo-text-gray)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>0-100</p>
                        <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700 }}>{car.zeroToHundred}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.6rem', color: 'var(--lambo-text-gray)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Top Speed</p>
                        <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700 }}>{car.topSpeed}</p>
                      </div>
                      <div>
                        <p style={{ fontSize: '0.6rem', color: 'var(--lambo-text-gray)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Price</p>
                        <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', fontWeight: 700, color: 'var(--lambo-gold)' }}>From</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="lambo-btn-gold lambo-cut"
                      style={{ width: '100%', fontSize: '0.72rem' }}
                    >
                      View Details
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
