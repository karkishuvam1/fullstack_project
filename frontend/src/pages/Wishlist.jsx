import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import formatCurrency from '../utils/formatCurrency';

export function Wishlist() {
  const { items, removeFromWishlist, clearWishlist } = useWishlist();

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
          Saved Garage
        </span>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          fontWeight: 900,
          textTransform: 'uppercase',
          marginBottom: '0.75rem',
        }}>
          My Saved Models ({items.length})
        </h1>
        <p style={{ color: 'var(--lambo-text-gray)', maxWidth: '580px', margin: '0 auto', lineHeight: 1.6, fontSize: '0.95rem' }}>
          Your private collection of saved Lamborghini configurations, ready for comparison or bespoke ordering.
        </p>
      </section>

      <section style={{ padding: '3.5rem 2rem 5rem', maxWidth: '1280px', margin: '0 auto' }}>
        {items.length === 0 ? (
          <div style={{
            padding: '5rem 2rem',
            textAlign: 'center',
            background: '#0d0d0d',
            border: '1px dashed var(--lambo-border, #222)',
            maxWidth: '650px',
            margin: '0 auto',
            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)',
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--lambo-gold)' }}>♡</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              Your garage is empty
            </h2>
            <p style={{ color: 'var(--lambo-text-gray)', marginBottom: '2rem', fontSize: '0.9rem' }}>
              Explore our super sports car lineup and click the heart icon on any model to save it here.
            </p>
            <Link to="/cars" className="lambo-btn-gold lambo-cut" style={{ padding: '0.85rem 2rem' }}>
              Explore All Models
            </Link>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
              <button
                onClick={clearWishlist}
                className="lambo-btn-outline"
                style={{ fontSize: '0.72rem', padding: '0.5rem 1rem' }}
              >
                Clear Entire Garage
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
              {items.map((car) => (
                <div
                  key={car._id}
                  style={{
                    background: '#0d0d0d',
                    border: '1px solid var(--lambo-border, #222)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)',
                  }}
                >
                  <button
                    onClick={() => removeFromWishlist(car._id)}
                    aria-label="Remove from wishlist"
                    style={{
                      position: 'absolute',
                      top: '0.75rem',
                      right: '0.75rem',
                      background: 'rgba(0,0,0,0.7)',
                      border: '1px solid #333',
                      color: '#e57373',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    ✕
                  </button>

                  <div style={{ width: '100%', height: '220px', background: '#040404', overflow: 'hidden' }}>
                    <img src={car.image} alt={car.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ color: 'var(--lambo-gold)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                      {car.category}
                    </span>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', textTransform: 'uppercase', margin: '0.3rem 0 0.5rem' }}>
                      {car.name}
                    </h3>
                    <p style={{ color: 'var(--lambo-text-gray)', fontSize: '0.8rem', marginBottom: '1.25rem' }}>
                      {car.engine} • {car.power}
                    </p>

                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900, color: 'var(--lambo-gold)', marginBottom: '1.5rem' }}>
                      {formatCurrency(car.startingPrice)}
                    </p>

                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                      <Link to={`/cars/${car.slug}`} className="lambo-btn-gold lambo-cut" style={{ flex: 1, textAlign: 'center', padding: '0.7rem' }}>
                        View Details
                      </Link>
                      <Link to={`/checkout/${car.slug}`} className="lambo-btn-outline" style={{ flex: 1, textAlign: 'center', padding: '0.7rem' }}>
                        Reserve
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Wishlist;
