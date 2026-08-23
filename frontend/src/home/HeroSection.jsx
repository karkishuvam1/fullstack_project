import React, { useEffect, useRef, useState } from 'react';
import useOnScreen from '../common/useonScreen';

// Real, freely-licensed (Unsplash License) photo of a matte black Aventador —
// stand-in until real Revuelto marketing assets are wired up from the CMS/API.
const HERO_IMAGE =
  'https://images.unsplash.com/photo-1526297293668-36b3f33a373b?auto=format&fit=crop&w=1920&q=80';

// One entry per stat: numeric stats animate with useCountUp, the rest render as-is.
const SPECS = [
  { label: 'Max Power', value: 1015, suffix: ' CV', gold: true },
  { label: 'Top Speed', value: 350, prefix: '> ', suffix: ' km/h', gold: false },
  { label: '0-100 km/h', value: 2.5, decimals: 1, suffix: ' s', gold: false },
  { label: 'Engine', display: 'V12 Hybrid', gold: true },
];

/** Counts a number up from 0 once `start` flips true. */
function useCountUp(target, start, decimals = 0, duration = 1400) {
  const [value, setValue] = useState(0);
  const frame = useRef(null);

  useEffect(() => {
    if (!start) return undefined;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // ease-out cubic, so the count settles rather than stopping abruptly
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

const HeroSection = () => {
  const bgRef = useRef(null);
  const [specsRef, specsVisible] = useOnScreen({ threshold: 0.4 });

  // Lightweight parallax: the hero image drifts slower than the page scroll.
  useEffect(() => {
    const handleScroll = () => {
      if (!bgRef.current) return;
      const offset = window.scrollY * 0.25;
      bgRef.current.style.transform = `translateY(${offset}px)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="lambo-hero-wrapper">
      <section className="lambo-hero">
        <img
          ref={bgRef}
          src={HERO_IMAGE}
          alt="Lamborghini Revuelto in motion"
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
              fontSize: '1rem',
              fontWeight: 300,
              lineHeight: 1.6,
            }}
          >
            From near perfection to absolute perfection. The first High
            Performance Electrified Vehicle hybrid super sports car.
          </p>
          <button type="button" className="lambo-btn-gold lambo-cut">
            Explore Model
          </button>
        </div>
      </section>

      {/* Floating Specs Bar — numbers count up once scrolled into view */}
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
};

export default HeroSection;
