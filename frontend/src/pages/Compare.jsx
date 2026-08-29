import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCars } from '../services/carService';
import Loader from '../components/common/Loader';
import formatCurrency from '../utils/formatCurrency';

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
    transmission: '8-speed Dual-clutch',
    drivetrain: 'AWD',
    image: 'https://images.unsplash.com/photo-1620223741726-7d39ff6e4e6c?auto=format&fit=crop&w=1200&q=80',
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
    transmission: '8-speed Automatic',
    drivetrain: 'AWD',
    image: 'https://images.unsplash.com/photo-1575650681837-c0ca3b1e7275?auto=format&fit=crop&w=1200&q=80',
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
    transmission: '8-speed Dual-clutch',
    drivetrain: 'AWD',
    image: 'https://images.unsplash.com/photo-1776690061399-d2e7f7e88751?auto=format&fit=crop&w=1200&q=80',
    startingPrice: 360000,
  },
];

const METRICS = [
  { key: 'category', label: 'Category' },
  { key: 'engine', label: 'Engine Type' },
  { key: 'power', label: 'Max Power Output', highlight: 'max-power' },
  { key: 'zeroToHundred', label: '0-100 km/h (Acceleration)', highlight: 'min-accel' },
  { key: 'topSpeed', label: 'Top Speed', highlight: 'max-speed' },
  { key: 'weight', label: 'Dry Weight' },
  { key: 'transmission', label: 'Transmission' },
  { key: 'drivetrain', label: 'Drivetrain' },
  { key: 'startingPrice', label: 'Starting Price', format: (v) => formatCurrency(v) },
];

export function Compare() {
  const [allCars, setAllCars] = useState([]);
  const [selectedIds, setSelectedIds] = useState(['1', '2', '3']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getCars();
        if (data && data.length > 0) {
          setAllCars(data);
          setSelectedIds(data.slice(0, 3).map((c) => c._id));
        } else {
          setAllCars(fallbackCars);
          setSelectedIds(fallbackCars.map((c) => c._id));
        }
      } catch (err) {
        setAllCars(fallbackCars);
        setSelectedIds(fallbackCars.map((c) => c._id));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleSelectSlot = (slotIndex, newId) => {
    setSelectedIds((prev) => {
      const copy = [...prev];
      copy[slotIndex] = newId;
      return copy;
    });
  };

  const selectedCars = selectedIds
    .map((id) => allCars.find((c) => c._id === id))
    .filter(Boolean);

  if (loading) {
    return <div style={{ paddingTop: '80px' }}><Loader fullscreen message="Calculating comparison dynamics..." /></div>;
  }

  return (
    <div style={{ paddingTop: '80px' }}>
      <section style={{
        background: 'linear-gradient(180deg, #0a0a0a 0%, #080808 100%)',
        padding: '3.5rem 2rem 2.5rem',
        textAlign: 'center',
        borderBottom: '1px solid var(--lambo-border, #222)',
      }}>
        <span style={{
          color: 'var(--lambo-gold)',
          fontFamily: 'var(--font-display)',
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          display: 'block',
          marginBottom: '0.75rem',
          fontWeight: 700,
        }}>
          Side-by-Side Analysis
        </span>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          fontWeight: 900,
          textTransform: 'uppercase',
          marginBottom: '0.75rem',
        }}>
          Compare Models
        </h1>
        <p style={{ color: 'var(--lambo-text-gray)', maxWidth: '620px', margin: '0 auto', lineHeight: 1.6, fontSize: '0.95rem' }}>
          Evaluate engineering specifications, telemetry, and track metrics across the Lamborghini portfolio.
        </p>
      </section>

      <section style={{ padding: '3.5rem 2rem 5rem', maxWidth: '1400px', margin: '0 auto', overflowX: 'auto' }}>
        {/* Model Selection Headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `240px repeat(${selectedCars.length}, minmax(280px, 1fr))`,
          gap: '1.5rem',
          marginBottom: '2rem',
          minWidth: '900px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1rem' }}>
            <p style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', color: 'var(--lambo-gold)', letterSpacing: '0.1em' }}>
              Select Models
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--lambo-text-gray)' }}>
              Choose up to {selectedCars.length} models for comparison:
            </p>
          </div>

          {selectedCars.map((car, idx) => (
            <div key={idx} style={{
              background: '#0d0d0d',
              border: '1px solid var(--lambo-border, #222)',
              padding: '1.5rem',
              clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
            }}>
              <select
                value={car._id}
                onChange={(e) => handleSelectSlot(idx, e.target.value)}
                style={{
                  width: '100%',
                  background: '#000',
                  border: '1px solid var(--lambo-border)',
                  color: '#fff',
                  padding: '0.6rem',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-display)',
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                }}
              >
                {allCars.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <div style={{ width: '100%', height: '160px', overflow: 'hidden', background: '#040404', marginBottom: '1rem' }}>
                <img src={car.image} alt={car.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                {car.name}
              </h3>
              <p style={{ color: 'var(--lambo-gold)', fontSize: '0.85rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
                {formatCurrency(car.startingPrice)}
              </p>
            </div>
          ))}
        </div>

        {/* Comparison Specs Table */}
        <div style={{
          background: '#0a0a0a',
          border: '1px solid var(--lambo-border, #222)',
          minWidth: '900px',
        }}>
          {METRICS.map((metric, i) => (
            <div
              key={metric.key}
              style={{
                display: 'grid',
                gridTemplateColumns: `240px repeat(${selectedCars.length}, minmax(280px, 1fr))`,
                gap: '1.5rem',
                padding: '1.25rem 1.5rem',
                background: i % 2 === 0 ? '#0d0d0d' : '#080808',
                borderBottom: '1px solid #1a1a1a',
                alignItems: 'center',
              }}
            >
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                textTransform: 'uppercase',
                letterSpacing: '0.12em',
                color: 'var(--lambo-text-gray)',
              }}>
                {metric.label}
              </div>

              {selectedCars.map((car) => {
                const val = car[metric.key];
                const displayVal = metric.format ? metric.format(val) : (val || '—');
                return (
                  <div
                    key={car._id}
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      color: '#ffffff',
                    }}
                  >
                    {displayVal}
                  </div>
                );
              })}
            </div>
          ))}

          {/* Action CTAs row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `240px repeat(${selectedCars.length}, minmax(280px, 1fr))`,
            gap: '1.5rem',
            padding: '1.5rem',
            background: '#040404',
          }}>
            <div />
            {selectedCars.map((car) => (
              <div key={car._id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Link to={`/cars/${car.slug}`} className="lambo-btn-gold lambo-cut" style={{ textAlign: 'center', padding: '0.7rem' }}>
                  Explore Details
                </Link>
                <Link to={`/configurator/${car.slug}`} className="lambo-btn-outline" style={{ textAlign: 'center', padding: '0.7rem' }}>
                  Configure
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Compare;
