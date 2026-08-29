import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { getCarBySlug, addCarReview } from '../services/carService';
import CarGallery from '../components/cars/CarGallery';
import Loader from '../components/common/Loader';
import formatCurrency from '../utils/formatCurrency';

const fallbackCar = {
  _id: '1',
  name: 'Revuelto',
  slug: 'revuelto',
  category: 'Super Sports',
  power: '1015 CV',
  engine: 'V12 Hybrid',
  topSpeed: '> 350 km/h',
  zeroToHundred: '2.5 s',
  zeroToSixty: '2.3 s',
  weight: '1,772 kg',
  transmission: '8-speed Dual-clutch',
  drivetrain: 'AWD',
  image: 'https://images.unsplash.com/photo-1620223741726-7d39ff6e4e6c?auto=format&fit=crop&w=1920&q=80',
  gallery: [
    'https://images.unsplash.com/photo-1620223741726-7d39ff6e4e6c?auto=format&fit=crop&w=1920&q=80',
    'https://images.unsplash.com/photo-1526297293668-36b3f33a373b?auto=format&fit=crop&w=1920&q=80',
  ],
  blurb: 'The first V12 hybrid super sports car — three electric motors and naturally-aspirated V12 heart.',
  description: 'The Lamborghini Revuelto represents a paradigm shift in super sports automotive performance. Combining a naturally aspirated 6.5-liter V12 engine with three electric motors and an innovative 8-speed double-clutch gearbox, it delivers a total output of 1015 CV.',
  startingPrice: 608358,
  features: [
    'Naturally Aspirated 6.5L V12 Engine',
    'Three Electric Motors (Tri-Motor HPEV)',
    '1015 CV Combined Output',
    'Full Carbon Fiber Monocoque',
    'Active Aerodynamic Carbon Rear Wing',
    'Torque Vectoring AWD System',
    'ADAS Driver Assistance Suite',
    'ANIMA Driving Mode Selector',
  ],
  availableColors: [
    { name: 'Giallo Countach', hex: '#F9E000', price: 0 },
    { name: 'Rosso Efesto', hex: '#C41E3A', price: 8800 },
    { name: 'Nero Aldebaran', hex: '#0A0A0A', price: 0 },
    { name: 'Blu Caelum', hex: '#003366', price: 12500 },
    { name: 'Verde Mantis', hex: '#228B22', price: 10200 },
    { name: 'Arancio Xanto', hex: '#FF4500', price: 9600 },
  ],
  rating: 5.0,
  numReviews: 4,
  reviews: [],
};

const SPECS = [
  { key: 'engine', label: 'Engine' },
  { key: 'power', label: 'Max Power' },
  { key: 'zeroToHundred', label: '0-100 km/h' },
  { key: 'topSpeed', label: 'Top Speed' },
  { key: 'weight', label: 'Dry Weight' },
  { key: 'transmission', label: 'Transmission' },
  { key: 'drivetrain', label: 'Drivetrain' },
  { key: 'category', label: 'Category' },
];

export function CarDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  // Reviews state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { data: car, loading, refetch } = useFetch(() => {
    return getCarBySlug(slug).catch(() => {
      return slug === 'revuelto' ? fallbackCar : { ...fallbackCar, slug, name: slug.toUpperCase() };
    });
  }, [slug]);

  useEffect(() => {
    setSelectedColorIdx(0);
    setReviewMsg('');
    setComment('');
  }, [slug]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!comment.trim()) return;

    setSubmittingReview(true);
    try {
      await addCarReview(car._id, { rating, comment });
      setReviewMsg('Thank you for submitting your client review.');
      setComment('');
      refetch();
    } catch (err) {
      setReviewMsg(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading || !car) {
    return <div style={{ paddingTop: '80px' }}><Loader fullscreen message="Accessing model blueprint..." /></div>;
  }

  const colors = car.availableColors && car.availableColors.length ? car.availableColors : fallbackCar.availableColors;
  const color = colors[selectedColorIdx] || colors[0];
  const wishlisted = isInWishlist(car._id);

  return (
    <div style={{ paddingTop: '80px' }}>
      {/* Hero Banner */}
      <section style={{ position: 'relative', width: '100%', height: '68vh', minHeight: '480px', overflow: 'hidden' }}>
        <img
          src={car.image}
          alt={`Lamborghini ${car.name}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, #080808 0%, rgba(0,0,0,0.5) 45%, transparent 100%)',
        }} />
        <div style={{ position: 'absolute', bottom: '3.5rem', left: '3rem', right: '3rem', maxWidth: '850px' }}>
          <span style={{
            color: 'var(--lambo-gold)', fontFamily: 'var(--font-display)',
            fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.2em',
            display: 'block', marginBottom: '0.75rem', fontWeight: 700,
          }}>
            {car.category}
          </span>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.5rem, 6vw, 5.2rem)',
            fontWeight: 900, textTransform: 'uppercase', lineHeight: 0.95,
            marginBottom: '0.75rem',
          }}>
            {car.name}
          </h1>
          <p style={{ color: 'var(--lambo-text-gray)', lineHeight: 1.65, maxWidth: '640px', fontSize: '1rem' }}>
            {car.blurb}
          </p>
        </div>
      </section>

      {/* Floating Telemetry Specs Bar */}
      <section style={{
        maxWidth: '1200px', margin: '-3.5rem auto 0', padding: '0 1.5rem', position: 'relative', zIndex: 10,
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px',
          background: 'var(--lambo-border, #222)',
          clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)',
          boxShadow: '0 15px 40px rgba(0,0,0,0.7)',
        }}>
          {SPECS.slice(0, 4).map((s) => (
            <div key={s.key} style={{ background: 'var(--lambo-card-bg)', padding: '1.4rem', textAlign: 'center' }}>
              <p style={{ fontSize: '0.62rem', color: 'var(--lambo-text-gray)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.35rem', fontFamily: 'var(--font-mono)' }}>
                {s.label}
              </p>
              <p style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.2rem', fontWeight: 900,
                color: ['engine', 'topSpeed', 'power'].includes(s.key) ? 'var(--lambo-gold)' : '#fff',
              }}>
                {car[s.key] || '—'}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Overview & Pricing Box */}
      <section style={{ padding: '5rem 2rem 4rem', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '4rem', alignItems: 'start' }}>
          <div>
            <CarGallery primaryImage={car.image} images={car.gallery} alt={car.name} />
          </div>
          <div>
            <span style={{ color: 'var(--lambo-gold)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
              Sant'Agata Bolognese Heritage
            </span>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: '2rem', textTransform: 'uppercase',
              margin: '0.35rem 0 1.25rem',
            }}>
              Overview
            </h2>
            <p style={{ color: 'var(--lambo-text-gray)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '1.25rem' }}>
              {car.description}
            </p>
            <p style={{ color: 'var(--lambo-text-gray)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '2rem' }}>
              Every Lamborghini is handcrafted with meticulous attention to detail in Sant'Agata Bolognese, Italy.
              Lightweight carbon-fiber monocoque chassis engineering pairs with hybrid propulsion to deliver unmatched driving dynamics.
            </p>

            <div style={{
              padding: '2rem',
              background: 'var(--color-card, #111)',
              border: '1px solid var(--lambo-border, #222)',
              clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)',
            }}>
              <p style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--lambo-text-gray)', marginBottom: '0.35rem', fontFamily: 'var(--font-mono)' }}>
                Indicative Starting Price
              </p>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '2.4rem', fontWeight: 900, color: 'var(--lambo-gold)', marginBottom: '1.5rem' }}>
                {formatCurrency(car.startingPrice)}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <Link to={`/configurator/${car.slug}`} className="lambo-btn-gold lambo-cut" style={{ textDecoration: 'none', padding: '0.9rem 1.6rem', fontSize: '0.8rem' }}>
                  Configure Yours
                </Link>
                <Link to={`/book-test-drive/${car.slug}`} className="lambo-btn-outline" style={{ textDecoration: 'none', padding: '0.9rem 1.6rem', fontSize: '0.8rem' }}>
                  Book Test Drive
                </Link>
                <Link to={`/checkout/${car.slug}`} className="lambo-btn-outline" style={{ textDecoration: 'none', padding: '0.9rem 1.6rem', fontSize: '0.8rem', borderColor: 'var(--lambo-gold)', color: 'var(--lambo-gold)' }}>
                  Reserve Model
                </Link>
                <button
                  type="button"
                  onClick={() => toggleWishlist(car)}
                  className="lambo-btn-outline"
                  style={{
                    padding: '0.9rem 1.4rem',
                    fontSize: '0.8rem',
                    borderColor: wishlisted ? 'var(--lambo-gold)' : undefined,
                    color: wishlisted ? 'var(--lambo-gold)' : undefined,
                  }}
                >
                  {wishlisted ? '♥ In Wishlist' : '♡ Add to Wishlist'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full Specifications Grid */}
      <section style={{ padding: '4rem 2rem', background: '#040404', borderTop: '1px solid var(--lambo-border, #222)', borderBottom: '1px solid var(--lambo-border, #222)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.6rem', textTransform: 'uppercase',
            borderLeft: '3px solid var(--lambo-gold)', paddingLeft: '0.85rem', marginBottom: '2rem',
          }}>
            Technical Specifications
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1px', background: 'var(--lambo-border, #222)' }}>
            {SPECS.map((s) => (
              <div key={s.key} style={{ background: 'var(--color-card, #111)', padding: '1.35rem' }}>
                <p style={{ fontSize: '0.62rem', color: 'var(--lambo-text-gray)', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.35rem', fontFamily: 'var(--font-mono)' }}>
                  {s.label}
                </p>
                <p style={{
                  fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 800,
                  color: s.key === 'engine' || s.key === 'topSpeed' ? 'var(--lambo-gold)' : '#fff',
                }}>
                  {car[s.key] || '—'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      {car.features && car.features.length > 0 && (
        <section style={{ padding: '4.5rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.6rem', textTransform: 'uppercase',
            borderLeft: '3px solid var(--lambo-gold)', paddingLeft: '0.85rem', marginBottom: '2rem',
          }}>
            Key Engineering Features
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {car.features.map((feature, i) => (
              <div key={i} style={{
                padding: '1.35rem', background: 'var(--color-card, #111)',
                border: '1px solid var(--lambo-border, #222)',
                display: 'flex', alignItems: 'center', gap: '1rem',
              }}>
                <div style={{
                  width: '38px', height: '38px', borderRadius: '50%',
                  background: 'rgba(229, 184, 0, 0.12)',
                  border: '1px solid var(--lambo-gold)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--lambo-gold)',
                  flexShrink: 0,
                  fontSize: '0.85rem',
                }}>{i + 1}</div>
                <span style={{ fontSize: '0.88rem', color: '#f0f0f0', fontWeight: 500 }}>{feature}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Available Paint Colors */}
      {colors && colors.length > 0 && (
        <section style={{ padding: '4rem 2rem', background: '#050505', borderTop: '1px solid var(--lambo-border, #222)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <h2 style={{
              fontFamily: 'var(--font-display)', fontSize: '1.6rem', textTransform: 'uppercase',
              borderLeft: '3px solid var(--lambo-gold)', paddingLeft: '0.85rem', marginBottom: '2rem',
            }}>
              Ad Personam Paint Options
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2.5rem' }}>
              <div style={{
                flex: '1 1 340px', height: '340px', background: color?.hex || '#111',
                border: '1px solid var(--lambo-border, #222)', position: 'relative', overflow: 'hidden',
                clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)',
              }}>
                <img src={car.image} alt={car.name} style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover', opacity: 0.55, mixBlendMode: 'luminosity',
                }} />
                <div style={{
                  position: 'absolute', bottom: '1.25rem', left: '1.25rem',
                  background: 'rgba(0,0,0,0.7)', padding: '0.5rem 0.85rem',
                  backdropFilter: 'blur(6px)', border: '1px solid var(--lambo-border)',
                }}>
                  <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--lambo-text-gray)' }}>Selected</p>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: '#fff' }}>{color?.name}</p>
                </div>
              </div>

              <div style={{ flex: '1 1 340px' }}>
                <p style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--lambo-text-gray)', marginBottom: '1.25rem', fontFamily: 'var(--font-mono)' }}>
                  Select a bespoke finish
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                  {colors.map((c, idx) => (
                    <button
                      key={c.name} type="button"
                      onClick={() => setSelectedColorIdx(idx)}
                      style={{
                        padding: '1rem 0.5rem',
                        background: 'var(--color-card, #111)',
                        border: selectedColorIdx === idx ? '2px solid var(--lambo-gold)' : '1px solid var(--lambo-border, #222)',
                        cursor: 'pointer',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '50%',
                        background: c.hex, border: '1px solid rgba(255,255,255,0.1)',
                      }} />
                      <span style={{
                        fontSize: '0.68rem', fontFamily: 'var(--font-display)',
                        textTransform: 'uppercase', letterSpacing: '0.05em',
                        color: selectedColorIdx === idx ? 'var(--lambo-gold)' : '#fff',
                      }}>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section style={{ padding: '4.5rem 2rem', maxWidth: '1280px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: '1.6rem', textTransform: 'uppercase',
          borderLeft: '3px solid var(--lambo-gold)', paddingLeft: '0.85rem', marginBottom: '2rem',
        }}>
          Owner & Track Driving Impressions ({car.reviews?.length || 0})
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '3rem', alignItems: 'start' }}>
          <div>
            {(!car.reviews || car.reviews.length === 0) ? (
              <div style={{ padding: '2.5rem', background: '#0d0d0d', border: '1px dashed var(--lambo-border)', textAlign: 'center' }}>
                <p style={{ color: 'var(--lambo-text-gray)', fontSize: '0.9rem' }}>
                  Be the first client to leave a verified driving impression for the {car.name}.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {car.reviews.map((r, idx) => (
                  <div key={r._id || idx} style={{
                    padding: '1.5rem', background: '#0d0d0d', border: '1px solid var(--lambo-border)',
                    clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{r.userName}</p>
                      <p style={{ color: 'var(--lambo-gold)', fontSize: '0.85rem' }}>{'★'.repeat(r.rating)}</p>
                    </div>
                    <p style={{ color: 'var(--lambo-text-gray)', fontSize: '0.85rem', lineHeight: 1.6 }}>{r.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Leave a review form */}
          <div style={{
            padding: '2rem', background: '#0d0d0d', border: '1px solid var(--lambo-border)',
            clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)',
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', textTransform: 'uppercase', marginBottom: '1rem' }}>
              Add Your Impression
            </h3>

            {reviewMsg && (
              <div style={{ padding: '0.75rem', background: 'rgba(229,184,0,0.1)', border: '1px solid var(--lambo-gold)', color: 'var(--lambo-gold)', fontSize: '0.8rem', marginBottom: '1rem' }}>
                {reviewMsg}
              </div>
            )}

            <form onSubmit={handleReviewSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--lambo-text-gray)', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                  Rating (1-5 Stars)
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  style={{ width: '100%', background: '#000', border: '1px solid var(--lambo-border)', color: '#fff', padding: '0.65rem', outline: 'none' }}
                >
                  <option value="5">★★★★★ - 5 Stars (Exceptional)</option>
                  <option value="4">★★★★☆ - 4 Stars (Excellent)</option>
                  <option value="3">★★★☆☆ - 3 Stars (Great)</option>
                  <option value="2">★★☆☆☆ - 2 Stars (Average)</option>
                  <option value="1">★☆☆☆☆ - 1 Star</option>
                </select>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--lambo-text-gray)', marginBottom: '0.4rem', fontFamily: 'var(--font-mono)' }}>
                  Your Driving Review
                </label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your driving impressions, acoustic emotion, or vehicle dynamics..."
                  required
                  style={{ width: '100%', background: '#000', border: '1px solid var(--lambo-border)', color: '#fff', padding: '0.75rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <button
                type="submit"
                className="lambo-btn-gold lambo-cut"
                disabled={submittingReview}
                style={{ width: '100%', padding: '0.85rem' }}
              >
                {submittingReview ? 'Submitting Review…' : isAuthenticated ? 'Submit Impression' : 'Sign In to Review'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{
        padding: '5rem 2rem', textAlign: 'center',
        background: 'linear-gradient(180deg, #080808 0%, #040404 100%)',
        borderTop: '1px solid var(--lambo-border, #222)',
      }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
          Ready to Experience the {car.name}?
        </h2>
        <p style={{ color: 'var(--lambo-text-gray)', maxWidth: '520px', margin: '0 auto 2rem', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Schedule a private appointment at your nearest authorized dealership or configure your dream bespoke model.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to={`/configurator/${car.slug}`} className="lambo-btn-gold lambo-cut" style={{ textDecoration: 'none', padding: '0.95rem 2rem' }}>
            Configure Yours
          </Link>
          <Link to={`/book-test-drive/${car.slug}`} className="lambo-btn-outline" style={{ textDecoration: 'none', padding: '0.95rem 2rem' }}>
            Book Test Drive
          </Link>
        </div>
      </section>
    </div>
  );
}

export default CarDetails;
