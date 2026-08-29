import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import formatCurrency from '../../utils/formatCurrency';

export function CarCard({
  car,
  onViewSpecs,
  onToggleWishlist,
  isWishlisted = false,
  enableTilt = true,
}) {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  if (!car) return null;

  const handleMouseMove = (e) => {
    if (!enableTilt) return;
    const node = cardRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 12;
    const rotateX = (0.5 - py) * 9;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    if (!enableTilt) return;
    setTilt({ x: 0, y: 0 });
  };

  return (
    <article
      ref={cardRef}
      className="lambo-car-card lambo-cut"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        position: 'relative',
        transform: enableTilt ? `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : 'none',
        transition: tilt.x === 0 && tilt.y === 0 ? 'transform 0.4s ease, border-color 0.25s, box-shadow 0.25s' : 'border-color 0.25s, box-shadow 0.25s',
      }}
    >
      {onToggleWishlist && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist(car);
          }}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          style={{
            position: 'absolute',
            top: '0.85rem',
            right: '0.85rem',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.65)',
            border: `1px solid ${isWishlisted ? 'var(--lambo-gold, #e5b800)' : 'rgba(255,255,255,0.2)'}`,
            color: isWishlisted ? 'var(--lambo-gold, #e5b800)' : '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            backdropFilter: 'blur(6px)',
            zIndex: 10,
            fontSize: '1rem',
            transition: 'all 0.15s ease',
          }}
        >
          {isWishlisted ? '♥' : '♡'}
        </button>
      )}

      <Link to={`/cars/${car.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div className="car-card-img-wrapper">
          <img src={car.image} alt={`Lamborghini ${car.name}`} loading="lazy" />
        </div>
        <div className="car-card-content">
          {car.category && (
            <span style={{
              color: 'var(--lambo-gold)',
              fontSize: '0.65rem',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontFamily: 'var(--font-display)',
              display: 'block',
              marginBottom: '0.4rem',
              fontWeight: 700,
            }}>
              {car.category}
            </span>
          )}
          <h3 className="car-card-title" style={{ marginBottom: '0.35rem' }}>
            {car.name}
          </h3>
          <p className="car-card-specs" style={{ marginBottom: '0.9rem' }}>
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
              <p style={{ fontSize: '0.6rem', color: 'var(--lambo-text-gray)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>
                0-100
              </p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 800 }}>
                {car.zeroToHundred || car.zeroToSixty || '— s'}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.6rem', color: 'var(--lambo-text-gray)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>
                Top Speed
              </p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 800 }}>
                {car.topSpeed || '—'}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.6rem', color: 'var(--lambo-text-gray)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>
                From
              </p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.82rem', fontWeight: 800, color: 'var(--lambo-gold)' }}>
                {formatCurrency(car.startingPrice)}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
            <button
              type="button"
              className="lambo-btn-gold lambo-cut"
              style={{ flex: 1, fontSize: '0.7rem', padding: '0.65rem' }}
              onClick={(e) => {
                e.preventDefault();
                if (onViewSpecs) onViewSpecs(car);
                else navigate(`/cars/${car.slug}`);
              }}
            >
              View Specs
            </button>
            <button
              type="button"
              className="lambo-btn-outline"
              style={{ flex: 1, fontSize: '0.7rem', padding: '0.65rem' }}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/configurator/${car.slug}`);
              }}
            >
              Configure
            </button>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default CarCard;
