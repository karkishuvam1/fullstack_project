import React from 'react';
import CarCard from './CarCard';

export function CarGrid({
  cars = [],
  onViewSpecs,
  onToggleWishlist,
  wishlistIds = [],
  loading = false,
  emptyMessage = 'No Lamborghini models found matching your criteria.',
}) {
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem 2rem',
        gap: '1rem',
        color: 'var(--lambo-gold)',
        fontFamily: 'var(--font-display, sans-serif)',
      }}>
        <div className="aur-spinner" style={{ width: '32px', height: '32px', borderWidth: '3px' }} />
        <p style={{ letterSpacing: '0.15em', textTransform: 'uppercase', fontSize: '0.8rem' }}>Loading line-up telemetry...</p>
      </div>
    );
  }

  if (!cars || cars.length === 0) {
    return (
      <div style={{
        padding: '4rem 2rem',
        textAlign: 'center',
        background: 'var(--lambo-card-bg, #0d0d0d)',
        border: '1px dashed var(--lambo-border, #222)',
      }}>
        <p style={{ color: 'var(--lambo-text-gray, #999)', fontSize: '0.9rem' }}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="lambo-car-grid">
      {cars.map((car) => (
        <CarCard
          key={car._id || car.slug}
          car={car}
          onViewSpecs={onViewSpecs}
          onToggleWishlist={onToggleWishlist}
          isWishlisted={wishlistIds.includes(car._id)}
        />
      ))}
    </div>
  );
}

export default CarGrid;
