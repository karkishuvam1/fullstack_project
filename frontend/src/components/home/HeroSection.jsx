import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1526297293668-36b3f33a373b?auto=format&fit=crop&w=1920&q=80';

const SPECS = [
  { label: 'Max Power', value: 1015, suffix: ' CV', gold: true },
  { label: 'Top Speed', value: 350, prefix: '> ', suffix: ' km/h', gold: false },
  { label: '0-100 km/h', value: 2.5, decimals: 1, suffix: ' s', gold: false },
  { label: 'Engine', display: 'V12 Hybrid', gold: true },
];

function useCountUp(target, start, decimals = 0, duration = 1400) {
  const [value, setValue] = useState(0);
  const frame = useRef(null);

  useEffect(() => {
    if (!start) return undefined;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Number((target * eased).toFixed(decimals)));
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      }
    };

    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [start, target, decimals, duration]);

  return value;
}

const SpecValue = ({ spec, start }) => {
  const count = useCountUp(spec.value ?? 0, start, spec.decimals ?? 0);
  if (spec.display) return <>{spec.display}</>;
  return (
    <>
      {spec.prefix}
      {count}
      {spec.suffix}
    </>
  );
};

export function HeroSection() {
  const bgRef = useRef(null);
  const [specsVisible, setSpecsVisible] = useState(false);
  const specsRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (bgRef.current) {
        const offset = window.scrollY * 0.25;
        bgRef.current.style.transform = `translateY(${offset}px)`;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSpecsVisible(true);
        }
      },
      { threshold: 0.3 }
    );
    if (specsRef.current) observer.observe(specsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="lambo-hero-wrapper">
      <section className="lambo-hero">
        <img
          ref={bgRef}
          src={HERO_IMAGE}
          alt="Lamborghini Revuelto"
          className="lambo-hero-bg"
        />
        <div className="lambo-hero-overlay" />

        <div className="lambo-hero-content">
          <span className="lambo-hero-subtitle">HPEV Super Sports Car</span>
          <h1 className="lambo-hero-title">Revuelto</h1>
          <p
            style={{
              color: 'var(--lambo-text-gray)',
              marginBottom: '2rem',
              fontSize: '1.05rem',
              fontWeight: 300,
              lineHeight: 1.6,
            }}
          >
            From near perfection to absolute perfection. The first High
            Performance Electrified Vehicle (HPEV) hybrid super sports car.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/cars/revuelto" className="lambo-btn-gold lambo-cut" style={{ padding: '0.9rem 2rem', fontSize: '0.85rem' }}>
              Explore Revuelto
            </Link>
            <Link to="/configurator/revuelto" className="lambo-btn-outline" style={{ padding: '0.9rem 2rem', fontSize: '0.85rem' }}>
              Configure Yours
            </Link>
          </div>
        </div>
      </section>

      {/* Floating Specs Bar */}
      <div className="lambo-specs-bar-overlap" ref={specsRef}>
        <div className="lambo-specs-grid lambo-cut">
          {SPECS.map((spec) => (
            <div className="spec-item" key={spec.label}>
              <p className="spec-label">{spec.label}</p>
              <p className={`spec-value${spec.gold ? ' gold' : ''}`}>
                <SpecValue spec={spec} start={specsVisible} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
