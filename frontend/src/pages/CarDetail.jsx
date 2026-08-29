import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { getCarBySlug } from '../services/CarService';
import { getImageUrl, handleImageError } from '../utils/imageUrl';
import '../styles/Home.css';

const fallbackCar = {
  _id: '1',
  name: 'Revuelto',
  slug: 'revuelto',
  category: 'Super Sports',
  power: '1015 CV',
  engine: 'V12 Hybrid',
  topSpeed: '> 350 km/h',
  zeroToHundred: '2.5 s',
  weight: '1,772 kg',
  transmission: '8-speed Dual-clutch',
  drivetrain: 'AWD',
  image: 'https://images.unsplash.com/photo-1620223741726-7d39ff6e4e6c?auto=format&fit=crop&w=1920&q=80',
  blurb: 'The first V12 hybrid super sports car.',
  description: 'The Lamborghini Revuelto is a masterpiece of engineering, combining the legendary naturally aspirated V12 engine with three electric motors to deliver a combined output of 1015 horsepower.',
  startingPrice: 608358,
  features: [
    'Naturally Aspirated V12 Engine',
    'Three Electric Motors',
    '1015 CV Combined Power',
    'Carbon Fiber Monocoque',
    'Active Aerodynamics',
    'ADAS Advanced Driver Assistance',
  ],
  availableColors: [
    { name: 'Giallo Countach', hex: '#F9E000' },
    { name: 'Rosso Efesto', hex: '#C41E3A' },
    { name: 'Nero Aldebaran', hex: '#0A0A0A' },
    { name: 'Blu Caelum', hex: '#003366' },
    { name: 'Verde Mantis', hex: '#228B22' },
    { name: 'Arancio Xanto', hex: '#FF4500' },
  ],
};

function formatPrice(price) {
  if (!price) return 'Contact for pricing';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price);
}

const SPECS_GRID = [
  { key: 'engine', label: 'Engine', gold: true },
  { key: 'power', label: 'Max Power' },
  { key: 'zeroToHundred', label: '0-100 km/h' },
  { key: 'topSpeed', label: 'Top Speed', gold: true },
  { key: 'weight', label: 'Dry Weight' },
  { key: 'transmission', label: 'Transmission' },
  { key: 'drivetrain', label: 'Drivetrain' },
  { key: 'category', label: 'Category', gold: true },
];

export default function CarDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(0);

  useEffect(() => {
    let mounted = true;
    async function fetchCar() {
      try {
        const data = await getCarBySlug(slug);
        if (mounted) setCar(data);
      } catch (error) {
        if (mounted) setCar(slug === 'revuelto' ? fallbackCar : { ...fallbackCar, name: slug.toUpperCase(), slug });
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchCar();
    return () => { mounted = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="lambo-home-page">
        <Navbar />
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '80vh',
          color: 'var(--lambo-gold)',
          fontFamily: 'var(--font-display)',
          fontSize: '1.2rem',
        }}>
          Loading model details...
        </div>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="lambo-home-page">
        <Navbar />
        <div style={{
          textAlign: 'center',
          padding: '8rem 2rem',
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>Model Not Found</h2>
          <p style={{ color: 'var(--lambo-text-gray)', marginBottom: '2rem' }}>
            The model you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/cars" className="lambo-btn-gold lambo-cut">
            View All Models
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="lambo-home-page">
      <Navbar />

      <main style={{ paddingTop: '80px' }}>
        <section style={{ position: 'relative', width: '100%', height: '70vh', minHeight: '480px', overflow: 'hidden' }}>
          <img
            src={getImageUrl(car.image, car.slug)}
            alt={`Lamborghini ${car.name}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
            onError={(e) => handleImageError(e, car.slug)}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, #080808 0%, rgba(0,0,0,0.6) 40%, transparent 100%)',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '4rem',
            left: '3rem',
            right: '3rem',
            maxWidth: '800px',
          }}>
            <span style={{
              color: 'var(--lambo-gold)',
              fontFamily: 'var(--font-display)',
              fontSize: '0.8rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              display: 'block',
              marginBottom: '0.75rem',
            }}>
              {car.category}
            </span>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontWeight: 900,
              textTransform: 'uppercase',
              lineHeight: 0.95,
              marginBottom: '1rem',
            }}>
              {car.name}
            </h1>
            <p style={{ color: 'var(--lambo-text-gray)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '600px' }}>
              {car.blurb}
            </p>
          </div>
        </section>

        <section style={{
          maxWidth: '1100px',
          margin: '-4rem auto 0',
          padding: '0 1rem',
          position: 'relative',
          zIndex: 10,
        }}>
          <div className="lambo-specs-grid lambo-cut" style={{
            gridTemplateColumns: 'repeat(4, 1fr)',
          }}>
            {SPECS_GRID.slice(0, 4).map((spec) => (
              <div className="spec-item" key={spec.key}>
                <p className="spec-label">{spec.label}</p>
                <p className={`spec-value${spec.gold ? ' gold' : ''}`}>
                  {car[spec.key]}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section style={{
          padding: '5rem 2rem',
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'start',
          }}>
            <div>
              <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Overview</h2>
              <p style={{ color: 'var(--lambo-text-gray)', lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                {car.description}
              </p>
              <p style={{ color: 'var(--lambo-text-gray)', lineHeight: 1.8, fontSize: '0.95rem' }}>
                Every Lamborghini is crafted with meticulous attention to detail in Sant'Agata Bolognese, Italy.
                The combination of cutting-edge technology, lightweight materials, and legendary design
                creates a driving experience that is truly unparalleled.
              </p>

              <div style={{ marginTop: '2.5rem', padding: '2rem', background: 'var(--lambo-card-bg)', border: '1px solid var(--lambo-border)', clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)' }}>
                <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--lambo-text-gray)', marginBottom: '0.5rem' }}>Starting from</p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 900, color: 'var(--lambo-gold)', marginBottom: '1rem' }}>
                  {formatPrice(car.startingPrice)}
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button className="lambo-btn-gold lambo-cut" onClick={() => navigate(`/configurator/${car.slug}`)}>
                    Configure Yours
                  </button>
                  <button className="lambo-btn-outline" onClick={() => navigate(`/book-test-drive/${car.slug}`)}>
                    Book Test Drive
                  </button>
                </div>
              </div>
            </div>

            <div>
              <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Specifications</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: 'var(--lambo-border)' }}>
                {SPECS_GRID.map((spec) => (
                  <div key={spec.key} style={{ background: 'var(--lambo-card-bg)', padding: '1.25rem' }}>
                    <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--lambo-text-gray)', marginBottom: '0.5rem' }}>
                      {spec.label}
                    </p>
                    <p style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1rem',
                      fontWeight: 700,
                      color: spec.gold ? 'var(--lambo-gold)' : '#fff',
                    }}>
                      {car[spec.key]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {car.features && car.features.length > 0 && (
          <section style={{
            padding: '4rem 2rem',
            background: '#040404',
            borderTop: '1px solid var(--lambo-border)',
            borderBottom: '1px solid var(--lambo-border)',
          }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              <h2 className="section-title">Key Features</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                {car.features.map((feature, idx) => (
                  <div key={idx} style={{
                    padding: '1.5rem',
                    background: 'var(--lambo-card-bg)',
                    border: '1px solid var(--lambo-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'rgba(229, 184, 0, 0.12)',
                      border: '1px solid var(--lambo-gold)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <span style={{ color: 'var(--lambo-gold)', fontWeight: 700 }}>{idx + 1}</span>
                    </div>
                    <span style={{ fontSize: '0.9rem', color: '#f0f0f0' }}>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {car.availableColors && car.availableColors.length > 0 && (
          <section style={{ padding: '5rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 className="section-title">Available Colors</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
              <div style={{ flex: '1', minWidth: '280px' }}>
                <div style={{
                  width: '100%',
                  height: '320px',
                  background: car.availableColors[selectedColor]?.hex || '#111',
                  borderRadius: '0',
                  border: '1px solid var(--lambo-border)',
                  position: 'relative',
                  overflow: 'hidden',
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)',
                  transition: 'background 0.4s ease',
                }}>
                  <img
                    src={getImageUrl(car.image, car.slug)}
                    alt={car.name}
                    onError={(e) => handleImageError(e, car.slug)}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      opacity: 0.55,
                      mixBlendMode: 'luminosity',
                    }}
                  />
                </div>
              </div>
              <div style={{ flex: '1', minWidth: '280px' }}>
                <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--lambo-text-gray)', marginBottom: '1.25rem' }}>
                  Select a paint color
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                  {car.availableColors.map((color, idx) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(idx)}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'var(--lambo-card-bg)',
                        border: selectedColor === idx ? '2px solid var(--lambo-gold)' : '1px solid var(--lambo-border)',
                        padding: '1rem 0.75rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: color.hex,
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)',
                      }} />
                      <span style={{
                        fontSize: '0.68rem',
                        fontFamily: 'var(--font-display)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        color: selectedColor === idx ? 'var(--lambo-gold)' : '#fff',
                      }}>
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--lambo-card-bg)', border: '1px solid var(--lambo-border)' }}>
                  <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--lambo-text-gray)', marginBottom: '0.4rem' }}>
                    Selected:
                  </p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--lambo-gold)' }}>
                    {car.availableColors[selectedColor]?.name}
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        <section style={{
          padding: '4rem 2rem',
          textAlign: 'center',
          background: 'linear-gradient(180deg, #080808 0%, #040404 100%)',
          borderTop: '1px solid var(--lambo-border)',
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Ready to Experience {car.name}?
          </h2>
          <p style={{ color: 'var(--lambo-text-gray)', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
            Book a private test drive at your nearest dealer or start configuring your dream Lamborghini today.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="lambo-btn-gold lambo-cut" onClick={() => navigate(`/configurator/${car.slug}`)}>
              Configure Yours
            </button>
            <button className="lambo-btn-outline" onClick={() => navigate(`/book-test-drive/${car.slug}`)}>
              Book Test Drive
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
