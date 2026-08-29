import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { getCars } from '../services/CarService';
import '../styles/Home.css';

const fallbackCars = [
  {
    _id: '1', name: 'Revuelto', slug: 'revuelto', category: 'Super Sports',
    power: '1015 CV', engine: 'V12 Hybrid', topSpeed: '> 350 km/h',
    zeroToHundred: '2.5 s', weight: '1,772 kg',
    transmission: '8-speed Dual-clutch', drivetrain: 'AWD',
    image: 'https://images.unsplash.com/photo-1620223741726-7d39ff6e4e6c?auto=format&fit=crop&w=600&q=80',
    startingPrice: 608358,
  },
  {
    _id: '2', name: 'Urus SE', slug: 'urus-se', category: 'Super SUV',
    power: '800 CV', engine: 'V8 Twin-Turbo Hybrid', topSpeed: '312 km/h',
    zeroToHundred: '3.4 s', weight: '2,150 kg',
    transmission: '8-speed Automatic', drivetrain: 'AWD',
    image: 'https://images.unsplash.com/photo-1575650681837-c0ca3b1e7275?auto=format&fit=crop&w=600&q=80',
    startingPrice: 280000,
  },
  {
    _id: '3', name: 'Temerario', slug: 'temerario', category: 'Super Sports',
    power: '920 CV', engine: 'V8 Hybrid', topSpeed: '343 km/h',
    zeroToHundred: '2.7 s', weight: '1,690 kg',
    transmission: '8-speed Dual-clutch', drivetrain: 'AWD',
    image: 'https://images.unsplash.com/photo-1776690061399-d2e7f7e88751?auto=format&fit=crop&w=600&q=80',
    startingPrice: 360000,
  },
];

const COMPARE_SPECS = [
  { key: 'category', label: 'Category' },
  { key: 'engine', label: 'Engine' },
  { key: 'power', label: 'Max Power' },
  { key: 'zeroToHundred', label: '0-100 km/h' },
  { key: 'topSpeed', label: 'Top Speed' },
  { key: 'weight', label: 'Dry Weight' },
  { key: 'transmission', label: 'Transmission' },
  { key: 'drivetrain', label: 'Drivetrain' },
  { key: 'startingPrice', label: 'Starting Price', isPrice: true },
];

function formatPrice(price) {
  if (!price) return 'Contact';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function Compare() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function fetchCars() {
      try {
        const data = await getCars();
        const list = data.length > 0 ? data : fallbackCars;
        if (mounted) {
          setCars(list);
          setSelected(list.slice(0, 2).map((c) => c._id));
        }
      } catch (error) {
        if (mounted) {
          setCars(fallbackCars);
          setSelected(fallbackCars.slice(0, 2).map((c) => c._id));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchCars();
    return () => { mounted = false; };
  }, []);

  const toggleCar = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const selectedCars = cars.filter((c) => selected.includes(c._id));

  return (
    <div className="lambo-home-page">
      <Navbar />

      <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
        <section style={{
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
            display: 'block',
            marginBottom: '1rem',
          }}>
            Side by Side
          </span>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '3rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            marginBottom: '1rem',
          }}>
            Compare Models
          </h1>
          <p style={{
            color: 'var(--lambo-text-gray)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Select up to 3 models to compare specifications, performance, and pricing.
          </p>
        </section>

        <section style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--lambo-gold)' }}>Loading...</div>
          ) : (
            <>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '3rem',
                justifyContent: 'center',
              }}>
                {cars.map((car) => {
                  const isSelected = selected.includes(car._id);
                  const canAdd = selected.length < 3 || isSelected;
                  return (
                    <button
                      key={car._id}
                      onClick={() => canAdd && toggleCar(car._id)}
                      disabled={!canAdd && !isSelected}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1.25rem',
                        background: isSelected ? 'var(--lambo-gold)' : 'var(--lambo-card-bg)',
                        border: '1px solid',
                        borderColor: isSelected ? 'var(--lambo-gold)' : 'var(--lambo-border)',
                        color: isSelected ? '#000' : '#fff',
                        cursor: canAdd ? 'pointer' : 'not-allowed',
                        opacity: canAdd ? 1 : 0.4,
                        fontFamily: 'var(--font-display)',
                        fontSize: '0.78rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        fontWeight: 600,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: isSelected ? '#000' : 'transparent',
                        border: `2px solid ${isSelected ? '#000' : 'var(--lambo-border)'}`,
                      }} />
                      {car.name}
                    </button>
                  );
                })}
              </div>

              {selectedCars.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--lambo-text-gray)' }}>
                  Select at least one model to compare.
                </div>
              ) : (
                <div style={{
                  overflowX: 'auto',
                  border: '1px solid var(--lambo-border)',
                  clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: selectedCars.length * 240 + 200 }}>
                    <thead>
                      <tr>
                        <th style={{
                          padding: '1.5rem',
                          background: 'var(--lambo-card-bg)',
                          borderBottom: '1px solid var(--lambo-border)',
                          textAlign: 'left',
                          fontFamily: 'var(--font-display)',
                          fontSize: '0.7rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.12em',
                          color: 'var(--lambo-text-gray)',
                          fontWeight: 500,
                          position: 'sticky',
                          left: 0,
                          zIndex: 2,
                          minWidth: '180px',
                        }}>
                          Model
                        </th>
                        {selectedCars.map((car) => (
                          <th key={car._id} style={{
                            padding: '1.5rem 1rem',
                            background: 'var(--lambo-card-bg)',
                            borderBottom: '1px solid var(--lambo-border)',
                            textAlign: 'center',
                            minWidth: '220px',
                          }}>
                            <Link to={`/cars/${car.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                              <img
                                src={car.image}
                                alt={car.name}
                                style={{
                                  width: '100%',
                                  height: '130px',
                                  objectFit: 'cover',
                                  marginBottom: '1rem',
                                  border: '1px solid var(--lambo-border)',
                                }}
                              />
                              <h3 style={{
                                fontFamily: 'var(--font-display)',
                                fontSize: '1.3rem',
                                textTransform: 'uppercase',
                                marginBottom: '0.4rem',
                              }}>
                                {car.name}
                              </h3>
                              <p style={{
                                fontSize: '0.65rem',
                                color: 'var(--lambo-gold)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                              }}>
                                {car.category}
                              </p>
                            </Link>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {COMPARE_SPECS.map((spec, idx) => (
                        <tr key={spec.key}>
                          <td style={{
                            padding: '1rem 1.5rem',
                            background: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                            borderBottom: '1px solid var(--lambo-border)',
                            fontFamily: 'var(--font-display)',
                            fontSize: '0.72rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            color: 'var(--lambo-text-gray)',
                            position: 'sticky',
                            left: 0,
                            zIndex: 1,
                          }}>
                            {spec.label}
                          </td>
                          {selectedCars.map((car) => {
                            const best = selectedCars.reduce((acc, c) => {
                              if (spec.key === 'zeroToHundred') {
                                const av = parseFloat(c[spec.key]);
                                const bv = parseFloat(acc[spec.key]);
                                return av < bv ? c : acc;
                              }
                              if (spec.key === 'startingPrice') {
                                return c[spec.key] < acc[spec.key] ? c : acc;
                              }
                              if (spec.key === 'power' || spec.key === 'topSpeed') {
                                const av = parseFloat(c[spec.key]);
                                const bv = parseFloat(acc[spec.key]);
                                return av > bv ? c : acc;
                              }
                              return acc;
                            }, selectedCars[0]);
                            const isBest = best._id === car._id && selectedCars.length > 1;
                            let value = car[spec.key];
                            if (spec.isPrice) value = formatPrice(value);
                            return (
                              <td
                                key={car._id}
                                style={{
                                  padding: '1rem',
                                  background: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                                  borderBottom: '1px solid var(--lambo-border)',
                                  textAlign: 'center',
                                  fontFamily: 'var(--font-display)',
                                  fontSize: '0.9rem',
                                  fontWeight: 600,
                                  color: isBest ? 'var(--lambo-gold)' : '#fff',
                                }}
                              >
                                {value || '—'}
                                {isBest && (
                                  <div style={{
                                    marginTop: '0.3rem',
                                    fontSize: '0.55rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    color: 'var(--lambo-gold)',
                                    opacity: 0.8,
                                  }}>
                                    Best
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                      <tr>
                        <td style={{ padding: '1.5rem' }} />
                        {selectedCars.map((car) => (
                          <td key={car._id} style={{ padding: '1.5rem 1rem', textAlign: 'center' }}>
                            <Link
                              to={`/configurator/${car.slug}`}
                              className="lambo-btn-gold lambo-cut"
                              style={{ textDecoration: 'none', display: 'inline-block', fontSize: '0.7rem', padding: '0.7rem 1.4rem' }}
                            >
                              Configure
                            </Link>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
