import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { getCars, getCarBySlug } from '../services/CarService';
import { getImageUrl, handleImageError } from '../utils/imageUrl';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

const fallbackCar = {
  _id: '1', name: 'Revuelto', slug: 'revuelto', category: 'Super Sports',
  power: '1015 CV', engine: 'V12 Hybrid', topSpeed: '> 350 km/h',
  zeroToHundred: '2.5 s', weight: '1,772 kg',
  image: 'https://images.unsplash.com/photo-1620223741726-7d39ff6e4e6c?auto=format&fit=crop&w=1600&q=80',
  description: 'The first V12 hybrid super sports car.',
  startingPrice: 608358,
  availableColors: [
    { name: 'Giallo Countach', hex: '#F9E000', price: 0 },
    { name: 'Rosso Efesto', hex: '#C41E3A', price: 8800 },
    { name: 'Nero Aldebaran', hex: '#0A0A0A', price: 0 },
    { name: 'Blu Caelum', hex: '#003366', price: 12500 },
    { name: 'Verde Mantis', hex: '#228B22', price: 10200 },
    { name: 'Arancio Xanto', hex: '#FF4500', price: 9600 },
  ],
};

const WHEELS = [
  { id: 'w1', name: '20" Alloy — Dione', price: 0, image: 'https://images.unsplash.com/photo-1607859600776-a0229c5c0c47?auto=format&fit=crop&w=400&q=80' },
  { id: 'w2', name: '21" Forged — Leirion', price: 6800, image: 'https://images.unsplash.com/photo-1592197935497-364af94a50ed?auto=format&fit=crop&w=400&q=80' },
  { id: 'w3', name: '22" Forged — Hek', price: 9200, image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=400&q=80' },
];

const INTERIORS = [
  { id: 'i1', name: 'Nero — Black Full-Grain Leather', price: 0 },
  { id: 'i2', name: 'Testa di Moro — Brown Alcantara', price: 5400 },
  { id: 'i3', name: 'Giallo Taurus — Yellow Contrast Stitch', price: 3200 },
  { id: 'i4', name: 'Rosso Alala — Red Sportivo Leather', price: 7600 },
  { id: 'i5', name: 'Forged Carbon Fiber Package', price: 18400 },
];

const OPTIONS = [
  { id: 'o1', name: 'Carbon Ceramic Brakes (CCB)', price: 19800, desc: '420mm carbon-ceramic discs with 10-piston calipers' },
  { id: 'o2', name: 'Lifting System', price: 7200, desc: 'Hydraulic front axle lift for speed bumps and driveways' },
  { id: 'o3', name: 'Premium Sound — 3D Bang & Olufsen', price: 9600, desc: '21-speaker 1,700W audio system with 3D sound' },
  { id: 'o4', name: 'Glass Engine Bonnet', price: 11200, desc: 'Showcase the V12 with tempered glass and LED lighting' },
  { id: 'o5', name: 'Sport Exhaust — Titanium', price: 15400, desc: 'Lightweight titanium exhaust with active bypass valves' },
  { id: 'o6', name: 'ADAS Driver Assistance Pack', price: 12800, desc: 'Cruise control, lane assist, surround-view cameras' },
];

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function Configurator() {
  const { slug } = useParams();
  const { user, isAuthenticated } = useAuth();
  const [cars, setCars] = useState([]);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedWheel, setSelectedWheel] = useState(WHEELS[0].id);
  const [selectedInterior, setSelectedInterior] = useState(INTERIORS[0].id);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSaveConfiguration = () => {
    const configData = {
      model: car?.name,
      slug: car?.slug,
      paint: car?.availableColors?.[selectedColor]?.name,
      wheel: WHEELS.find((w) => w.id === selectedWheel)?.name,
      interior: INTERIORS.find((i) => i.id === selectedInterior)?.name,
      options: selectedOptions.map((id) => OPTIONS.find((o) => o.id === id)?.name),
      estimatedTotal: total,
      savedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem('saved_supercar_config', JSON.stringify(configData));
    } catch (_) {}
    setSavedFeedback(true);
    setTimeout(() => setSavedFeedback(false), 5000);
  };

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const allCars = await getCars();
        const list = allCars.length > 0 ? allCars : [fallbackCar];
        if (mounted) setCars(list);

        const targetSlug = slug || list[0]?.slug;
        let detail;
        try {
          detail = await getCarBySlug(targetSlug);
        } catch (_) {
          detail = targetSlug === 'revuelto' ? fallbackCar : { ...fallbackCar, slug: targetSlug, name: targetSlug.toUpperCase() };
        }
        if (!detail.availableColors || detail.availableColors.length === 0) {
          detail.availableColors = fallbackCar.availableColors;
        }
        if (mounted) setCar(detail);
      } catch (error) {
        if (mounted) {
          setCars([fallbackCar]);
          setCar(fallbackCar);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [slug]);

  useEffect(() => {
    setSelectedColor(0);
    setSelectedWheel(WHEELS[0].id);
    setSelectedInterior(INTERIORS[0].id);
    setSelectedOptions([]);
  }, [slug]);

  const toggleOption = (id) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  if (loading || !car) {
    return (
      <div className="lambo-home-page">
        <Navbar />
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          minHeight: '80vh', color: 'var(--lambo-gold)', fontFamily: 'var(--font-display)',
        }}>
          Loading Configurator...
        </div>
      </div>
    );
  }

  const colorPrice = car.availableColors[selectedColor]?.price || 0;
  const wheelPrice = WHEELS.find((w) => w.id === selectedWheel)?.price || 0;
  const interiorPrice = INTERIORS.find((i) => i.id === selectedInterior)?.price || 0;
  const optionsTotal = OPTIONS.filter((o) => selectedOptions.includes(o.id)).reduce((s, o) => s + o.price, 0);
  const base = car.startingPrice || fallbackCar.startingPrice;
  const total = base + colorPrice + wheelPrice + interiorPrice + optionsTotal;

  return (
    <div className="lambo-home-page">
      <Navbar />

      <main style={{ paddingTop: '80px' }}>
        <section style={{
          padding: '2rem 2rem 1rem',
          background: '#0a0a0a',
          borderBottom: '1px solid var(--lambo-border)',
          position: 'sticky',
          top: '80px',
          zIndex: 50,
        }}>
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
          }}>
            <div>
              <span style={{
                color: 'var(--lambo-gold)',
                fontFamily: 'var(--font-display)',
                fontSize: '0.65rem',
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
              }}>
                Ad Personam Studio
              </span>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.75rem',
                fontWeight: 900,
                textTransform: 'uppercase',
                marginTop: '0.25rem',
              }}>
                Configure Your {car.name}
              </h1>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}>
              <select
                value={car.slug}
                onChange={(e) => {
                  window.location.href = `/configurator/${e.target.value}`;
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid var(--lambo-border)',
                  color: '#fff',
                  padding: '0.5rem 0.85rem',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                }}
              >
                {cars.map((c) => (
                  <option key={c._id} value={c.slug} style={{ background: '#111' }}>
                    {c.name}
                  </option>
                ))}
              </select>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.6rem', color: 'var(--lambo-text-gray)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Estimated Total
                </p>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.6rem',
                  fontWeight: 900,
                  color: 'var(--lambo-gold)',
                }}>
                  {formatPrice(total)}
                </p>
              </div>
            </div>
          </div>
        </section>

        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.5fr) minmax(320px, 1fr)',
          gap: '0',
          minHeight: 'calc(100vh - 200px)',
        }}>
          <div style={{ padding: '2rem', background: 'linear-gradient(180deg, #080808 0%, #040404 100%)' }}>
            <div style={{
              height: '480px',
              background: `radial-gradient(ellipse at center, ${car.availableColors[selectedColor]?.hex || '#111'}22 0%, transparent 65%)`,
              border: '1px solid var(--lambo-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
              marginBottom: '1.5rem',
            }}>
              <div style={{
                position: 'absolute',
                bottom: '60px',
                width: '80%',
                height: '40px',
                background: 'radial-gradient(ellipse, rgba(229, 184, 0, 0.15) 0%, transparent 70%)',
                filter: 'blur(8px)',
              }} />
              <img
                src={getImageUrl(car.image, car.slug)}
                alt={car.name}
                onError={(e) => handleImageError(e, car.slug)}
                style={{
                  maxWidth: '90%',
                  maxHeight: '420px',
                  position: 'relative',
                  zIndex: 1,
                  filter: `saturate(1.1) drop-shadow(0 20px 30px rgba(0,0,0,0.7))`,
                }}
              />
              <div style={{
                position: 'absolute',
                top: '1.5rem',
                left: '1.5rem',
                background: 'rgba(0,0,0,0.5)',
                padding: '0.5rem 0.85rem',
                backdropFilter: 'blur(6px)',
                border: '1px solid var(--lambo-border)',
              }}>
                <p style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--lambo-text-gray)' }}>
                  Paint
                </p>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: '#fff' }}>
                  {car.availableColors[selectedColor]?.name}
                </p>
              </div>
            </div>

            <section style={{ marginBottom: '2.5rem' }}>
              <h3 style={stepTitle}>Step 1 · Exterior Color</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {car.availableColors.map((color, idx) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(idx)}
                    style={{
                      background: 'var(--lambo-card-bg)',
                      border: selectedColor === idx ? '2px solid var(--lambo-gold)' : '1px solid var(--lambo-border)',
                      padding: '0.75rem',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                      minWidth: '120px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: color.hex,
                      boxShadow: 'inset 0 4px 10px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.05)',
                    }} />
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '0.68rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em', color: selectedColor === idx ? 'var(--lambo-gold)' : '#fff' }}>
                        {color.name}
                      </p>
                      <p style={{ fontSize: '0.62rem', color: 'var(--lambo-text-gray)', marginTop: '2px' }}>
                        {(color.price || 0) === 0 ? 'Included' : `+${formatPrice(color.price || 0)}`}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h3 style={stepTitle}>Step 2 · Wheels</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                {WHEELS.map((w) => (
                  <button
                    key={w.id}
                    onClick={() => setSelectedWheel(w.id)}
                    style={{
                      background: 'var(--lambo-card-bg)',
                      border: selectedWheel === w.id ? '2px solid var(--lambo-gold)' : '1px solid var(--lambo-border)',
                      padding: '1rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{
                      height: '90px',
                      background: '#050505',
                      marginBottom: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}>
                      <img src={w.image} alt={w.name} style={{ width: '80%', height: '80%', objectFit: 'cover', borderRadius: '50%' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    </div>
                    <p style={{ fontSize: '0.72rem', fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.05em', color: selectedWheel === w.id ? 'var(--lambo-gold)' : '#fff', marginBottom: '0.25rem' }}>
                      {w.name}
                    </p>
                    <p style={{ fontSize: '0.65rem', color: 'var(--lambo-text-gray)' }}>
                      {w.price === 0 ? 'Included' : `+${formatPrice(w.price)}`}
                    </p>
                  </button>
                ))}
              </div>
            </section>

            <section style={{ marginBottom: '2.5rem' }}>
              <h3 style={stepTitle}>Step 3 · Interior & Trim</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {INTERIORS.map((i) => (
                  <button
                    key={i.id}
                    onClick={() => setSelectedInterior(i.id)}
                    style={{
                      background: 'var(--lambo-card-bg)',
                      border: selectedInterior === i.id ? '2px solid var(--lambo-gold)' : '1px solid var(--lambo-border)',
                      padding: '0.9rem 1.1rem',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '1rem',
                      transition: 'all 0.2s ease',
                      textAlign: 'left',
                    }}
                  >
                    <span style={{
                      fontSize: '0.82rem',
                      color: selectedInterior === i.id ? 'var(--lambo-gold)' : '#fff',
                      fontFamily: 'var(--font-base)',
                      fontWeight: 500,
                    }}>
                      {i.name}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--lambo-text-gray)', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' }}>
                      {i.price === 0 ? 'Included' : `+${formatPrice(i.price)}`}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section style={{ marginBottom: '1rem' }}>
              <h3 style={stepTitle}>Step 4 · Options & Packages</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
                {OPTIONS.map((o) => {
                  const checked = selectedOptions.includes(o.id);
                  return (
                    <button
                      key={o.id}
                      onClick={() => toggleOption(o.id)}
                      style={{
                        background: 'var(--lambo-card-bg)',
                        border: checked ? '2px solid var(--lambo-gold)' : '1px solid var(--lambo-border)',
                        padding: '1rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        gap: '0.85rem',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid',
                        borderColor: checked ? 'var(--lambo-gold)' : 'var(--lambo-border)',
                        background: checked ? 'var(--lambo-gold)' : 'transparent',
                        flexShrink: 0,
                        marginTop: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#000',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                      }}>
                        {checked ? '✓' : ''}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontSize: '0.82rem', color: checked ? 'var(--lambo-gold)' : '#fff', fontWeight: 600 }}>{o.name}</span>
                          <span style={{ fontSize: '0.68rem', color: 'var(--lambo-text-gray)', fontFamily: 'var(--font-display)', whiteSpace: 'nowrap' }}>+{formatPrice(o.price)}</span>
                        </div>
                        <p style={{ fontSize: '0.72rem', color: 'var(--lambo-text-gray)', lineHeight: 1.45 }}>{o.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          <div style={{
            padding: '2rem',
            background: 'var(--lambo-card-bg)',
            borderLeft: '1px solid var(--lambo-border)',
            position: 'sticky',
            top: '170px',
            height: 'calc(100vh - 170px)',
            overflowY: 'auto',
          }}>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              borderBottom: '1px solid var(--lambo-border)',
              paddingBottom: '1rem',
              marginBottom: '1.25rem',
            }}>
              Your Configuration
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.85rem' }}>
              <Line label={`${car.name} — Base Price`} value={formatPrice(base)} bold />
              <Line label={`Paint · ${car.availableColors[selectedColor]?.name}`} value={colorPrice === 0 ? 'Included' : formatPrice(colorPrice)} />
              <Line label={`Wheels · ${WHEELS.find(w => w.id === selectedWheel)?.name}`} value={wheelPrice === 0 ? 'Included' : formatPrice(wheelPrice)} />
              <Line label={`Interior · ${INTERIORS.find(i => i.id === selectedInterior)?.name}`} value={interiorPrice === 0 ? 'Included' : formatPrice(interiorPrice)} />
              {selectedOptions.map((id) => {
                const opt = OPTIONS.find((o) => o.id === id);
                return <Line key={id} label={`Option · ${opt.name}`} value={formatPrice(opt.price)} />;
              })}
            </div>

            {selectedOptions.length > 0 && (
              <p style={{
                fontSize: '0.72rem',
                color: 'var(--lambo-text-gray)',
                marginTop: '0.75rem',
                marginBottom: '1.5rem',
                paddingTop: '0.75rem',
                borderTop: '1px solid var(--lambo-border)',
              }}>
                {selectedOptions.length} option{selectedOptions.length > 1 ? 's' : ''} selected — total extras: {formatPrice(colorPrice + wheelPrice + interiorPrice + optionsTotal)}
              </p>
            )}
            {(selectedOptions.length === 0 && (colorPrice + wheelPrice + interiorPrice) === 0) && (
              <div style={{ height: '2.25rem', borderTop: '1px solid var(--lambo-border)', marginTop: '1rem' }} />
            )}

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              padding: '1.25rem 0',
              borderTop: '1px solid var(--lambo-border)',
              marginBottom: '1.5rem',
            }}>
              <div>
                <p style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--lambo-text-gray)', marginBottom: '0.3rem' }}>
                  Estimated Total
                </p>
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2rem',
                  fontWeight: 900,
                  color: 'var(--lambo-gold)',
                  lineHeight: 1,
                }}>
                  {formatPrice(total)}
                </p>
              </div>
              <div style={{
                width: '0px',
                height: '0px',
                borderStyle: 'solid',
                borderWidth: '0 0 36px 36px',
                borderColor: 'transparent transparent var(--lambo-gold) transparent',
                opacity: 0.25,
              }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link
                to={`/book-test-drive/${car.slug}`}
                className="lambo-btn-gold lambo-cut"
                style={{ textAlign: 'center', textDecoration: 'none', padding: '0.95rem' }}
              >
                Book a Test Drive
              </Link>
              <button
                type="button"
                onClick={handleSaveConfiguration}
                className="lambo-btn-outline"
                style={{
                  padding: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  borderColor: savedFeedback ? 'var(--lambo-gold)' : 'var(--lambo-border)',
                  color: savedFeedback ? 'var(--lambo-gold)' : '#fff',
                }}
              >
                {savedFeedback ? '✓ Configuration Saved!' : 'Save & Email Configuration'}
              </button>
              {savedFeedback && (
                <p style={{
                  fontSize: '0.72rem',
                  color: 'var(--lambo-gold)',
                  textAlign: 'center',
                  margin: '0.2rem 0 0',
                  lineHeight: 1.4,
                }}>
                  {isAuthenticated
                    ? `Build specification sent to ${user?.email || 'your email'}.`
                    : 'Configuration copied! Sign in to save to your personal garage.'}
                </p>
              )}
              <Link
                to="/dealers"
                style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--lambo-text-gray)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.5rem' }}
              >
                Contact a Dealer →
              </Link>
            </div>

            <div style={{
              marginTop: '2rem',
              padding: '1rem',
              background: 'rgba(229, 184, 0, 0.06)',
              border: '1px solid rgba(229, 184, 0, 0.15)',
              fontSize: '0.72rem',
              color: 'var(--lambo-text-gray)',
              lineHeight: 1.55,
            }}>
              <strong style={{ color: 'var(--lambo-gold)' }}>Note:</strong> Final pricing,
              availability, and delivery timelines are confirmed with your local dealer.
              This configuration reflects current MSRP and does not include taxes,
              registration, or destination fees.
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

const stepTitle = {
  fontFamily: 'var(--font-display)',
  fontSize: '0.8rem',
  textTransform: 'uppercase',
  letterSpacing: '0.15em',
  marginBottom: '1rem',
  color: 'var(--lambo-gold)',
  fontWeight: 600,
};

function Line({ label, value, bold }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      gap: '1rem',
      paddingBottom: '0.5rem',
      borderBottom: bold ? '1px solid var(--lambo-border)' : 'none',
      paddingTop: bold ? '0.25rem' : 0,
    }}>
      <span style={{ color: 'var(--lambo-text-gray)', fontSize: '0.8rem', lineHeight: 1.4 }}>{label}</span>
      <span style={{
        color: '#fff',
        fontFamily: bold ? 'var(--font-display)' : 'var(--font-base)',
        fontWeight: bold ? 700 : 500,
        fontSize: bold ? '0.95rem' : '0.8rem',
        whiteSpace: 'nowrap',
      }}>{value}</span>
    </div>
  );
}
