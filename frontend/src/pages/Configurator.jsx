import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';
import { getCars, getCarBySlug } from '../services/CarService';
import { createOrder } from '../services/AdminService';
import { getImageUrl, handleImageError } from '../utils/imageUrl';
import { useAuth } from '../context/AuthContext';
import '../styles/Home.css';

const fallbackCar = {
  _id: 'revuelto', name: 'Revuelto', slug: 'revuelto', category: 'Super Sports',
  power: '1015 CV', engine: 'V12 Hybrid', topSpeed: '> 350 km/h',
  zeroToHundred: '2.5 s', weight: '1,772 kg',
  image: '/uploads/revuelto.jpg',
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
  { id: 'w1', name: '20" Alloy — Dione', price: 0, image: '/uploads/wheel-dione.jpg' },
  { id: 'w2', name: '21" Forged — Leirion', price: 6800, image: '/uploads/wheel-leirion.jpg' },
  { id: 'w3', name: '22" Forged — Hek', price: 9200, image: '/uploads/wheel-hek.jpg' },
];

const INTERIORS = [
  { id: 'i1', name: 'Nero — Black Full-Grain Leather', hex: '#111111', price: 0 },
  { id: 'i2', name: 'Rosso Alala — Red Accent Alcantara', hex: '#8b0000', price: 4200 },
  { id: 'i3', name: 'Giallo Taurus — Yellow Stitching Duo', hex: '#d4af37', price: 5400 },
  { id: 'i4', name: 'Bianco Leda — White Sportiva Leather', hex: '#eaeaea', price: 6100 },
];

const OPTIONS = [
  { id: 'opt1', name: 'Carbon Ceramic Brakes with Colored Calipers', price: 7800, desc: 'Brembo CCM-R Plus with bespoke lacquer' },
  { id: 'opt2', name: 'Sensonum® Premium Audio System', price: 5200, desc: 'High-end 10-speaker 3D acoustics' },
  { id: 'opt3', name: 'Full Carbon Fiber Aerodynamics Pack', price: 18500, desc: 'Splitters, diffusers, mirror caps in gloss weave' },
  { id: 'opt4', name: 'Front Axle Lifting System', price: 3900, desc: 'Electro-hydraulic 45mm ride height boost' },
  { id: 'opt5', name: 'Telemetry & Track Telematics System', price: 4500, desc: 'GPS data logging with onboard HD video' },
];

const DEALERS = [
  'Sant\'Agata Bolognese — Flagship Store',
  'Milano — Via della Moscova',
  'Monaco — Port Hercule',
  'Dubai — Sheikh Zayed Road',
  'London — Berkeley Square, Mayfair',
  'New York — 57th Street, Manhattan',
  'Los Angeles — Sunset Boulevard, Beverly Hills',
  'Singapore — Scotts Road',
  'Tokyo — Aoyama Avenue',
  'Sydney — William Street, Woolloomooloo',
];

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(price || 0);
}

export default function Configurator() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [cars, setCars] = useState([]);
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedFeedback, setSavedFeedback] = useState(false);

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedWheel, setSelectedWheel] = useState(WHEELS[0].id);
  const [selectedInterior, setSelectedInterior] = useState(INTERIORS[0].id);
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Order modal state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [orderError, setOrderError] = useState('');
  const [orderForm, setOrderForm] = useState({
    dealer: DEALERS[0],
    paymentMethod: 'Reservation Deposit (€5,000)',
    notes: '',
    street: '',
    city: '',
    country: '',
  });

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
          detail = list.find((c) => c.slug === targetSlug) || list[0] || fallbackCar;
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

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setOrderSubmitting(true);
    setOrderError('');

    try {
      const orderPayload = {
        car: car._id || car.slug,
        basePrice: base,
        customizationPrice: colorPrice + wheelPrice + interiorPrice + optionsTotal,
        totalAmount: total,
        paymentMethod: orderForm.paymentMethod,
        deliveryAddress: {
          street: orderForm.street || orderForm.dealer,
          city: orderForm.city || orderForm.dealer.split(' — ')[0],
          country: orderForm.country || 'Dealership Handover',
        },
        notes: `Selected Paint: ${car.availableColors[selectedColor]?.name}. Wheel: ${WHEELS.find(w => w.id === selectedWheel)?.name}. Interior: ${INTERIORS.find(i => i.id === selectedInterior)?.name}. ${orderForm.notes ? `Client Notes: ${orderForm.notes}` : ''}`,
      };

      const result = await createOrder(orderPayload);
      setOrderSuccess(result?.order || result);
    } catch (err) {
      setOrderError(err.response?.data?.message || 'Failed to submit order reservation. Please try again.');
    } finally {
      setOrderSubmitting(false);
    }
  };

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
            </div>
          </div>
        </section>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) 380px',
          maxWidth: '1400px',
          margin: '0 auto',
          minHeight: 'calc(100vh - 170px)',
        }}>
          <div style={{ padding: '2rem 3rem 4rem', overflowY: 'auto' }}>
            <div style={{
              width: '100%',
              height: '460px',
              background: 'radial-gradient(ellipse at center, #1a1a1a 0%, #0a0a0a 70%)',
              border: '1px solid var(--lambo-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '3rem',
              position: 'relative',
              overflow: 'hidden',
              clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%)',
            }}>
              <div style={{
                position: 'absolute',
                bottom: '20px',
                width: '70%',
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
            </div>

            {/* STEP 1: EXTERIOR COLOR */}
            <section style={{ marginBottom: '3rem' }}>
              <h2 style={stepTitle}>Step 1 · Exterior Color</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '1rem' }}>
                {car.availableColors.map((col, idx) => {
                  const active = selectedColor === idx;
                  return (
                    <button
                      key={col.name}
                      onClick={() => setSelectedColor(idx)}
                      style={{
                        background: 'var(--lambo-card-bg)',
                        border: active ? '2px solid var(--lambo-gold)' : '1px solid var(--lambo-border)',
                        padding: '1rem',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: col.hex,
                        margin: '0 auto 0.75rem',
                        border: '2px solid rgba(255,255,255,0.2)',
                      }} />
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.72rem', textTransform: 'uppercase', color: active ? 'var(--lambo-gold)' : '#fff', fontWeight: 600, marginBottom: '0.25rem' }}>
                        {col.name}
                      </p>
                      <p style={{ fontSize: '0.65rem', color: 'var(--lambo-text-gray)' }}>
                        {col.price === 0 ? 'Included' : `+${formatPrice(col.price)}`}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* STEP 2: WHEELS */}
            <section style={{ marginBottom: '3rem' }}>
              <h2 style={stepTitle}>Step 2 · Wheels & Rims</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '1rem' }}>
                {WHEELS.map((w) => {
                  const active = selectedWheel === w.id;
                  return (
                    <button
                      key={w.id}
                      onClick={() => setSelectedWheel(w.id)}
                      style={{
                        background: 'var(--lambo-card-bg)',
                        border: active ? '2px solid var(--lambo-gold)' : '1px solid var(--lambo-border)',
                        padding: '1rem',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', textTransform: 'uppercase', color: active ? 'var(--lambo-gold)' : '#fff', fontWeight: 600, marginBottom: '0.35rem' }}>
                        {w.name}
                      </p>
                      <p style={{ fontSize: '0.65rem', color: 'var(--lambo-text-gray)' }}>
                        {w.price === 0 ? 'Included' : `+${formatPrice(w.price)}`}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* STEP 3: INTERIOR TRIM */}
            <section style={{ marginBottom: '3rem' }}>
              <h2 style={stepTitle}>Step 3 · Interior Upholstery</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                {INTERIORS.map((i) => {
                  const active = selectedInterior === i.id;
                  return (
                    <button
                      key={i.id}
                      onClick={() => setSelectedInterior(i.id)}
                      style={{
                        background: 'var(--lambo-card-bg)',
                        border: active ? '2px solid var(--lambo-gold)' : '1px solid var(--lambo-border)',
                        padding: '1rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <div style={{ width: '20px', height: '20px', background: i.hex, marginBottom: '0.75rem', border: '1px solid #444' }} />
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.72rem', textTransform: 'uppercase', color: active ? 'var(--lambo-gold)' : '#fff', fontWeight: 600, marginBottom: '0.25rem' }}>
                        {i.name}
                      </p>
                      <p style={{ fontSize: '0.65rem', color: 'var(--lambo-text-gray)' }}>
                        {i.price === 0 ? 'Included' : `+${formatPrice(i.price)}`}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* STEP 4: PACKAGES */}
            <section style={{ marginBottom: '3rem' }}>
              <h2 style={stepTitle}>Step 4 · Optional Equipment & Packages</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
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

          {/* SIDEBAR SUMMARY */}
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

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              padding: '1.25rem 0',
              borderTop: '1px solid var(--lambo-border)',
              marginTop: '1.5rem',
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
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => {
                  setOrderSuccess(null);
                  setOrderError('');
                  setShowOrderModal(true);
                }}
                className="lambo-btn-gold lambo-cut"
                style={{ width: '100%', padding: '1rem', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                ★ Reserve & Place Order
              </button>

              <Link
                to={`/book-test-drive/${car.slug}`}
                className="lambo-btn-outline"
                style={{ textAlign: 'center', textDecoration: 'none', padding: '0.85rem' }}
              >
                Book a Test Drive
              </Link>

              <button
                type="button"
                onClick={handleSaveConfiguration}
                className="lambo-btn-outline"
                style={{
                  padding: '0.75rem',
                  fontSize: '0.75rem',
                  borderColor: savedFeedback ? 'var(--lambo-gold)' : 'var(--lambo-border)',
                  color: savedFeedback ? 'var(--lambo-gold)' : '#fff',
                }}
              >
                {savedFeedback ? '✓ Configuration Saved!' : 'Save & Email Configuration'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ORDER RESERVATION MODAL */}
      {showOrderModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999,
            padding: '1.5rem',
          }}
        >
          <div
            style={{
              background: 'linear-gradient(180deg, #131316 0%, #0c0c0e 100%)',
              border: '1px solid rgba(229, 184, 0, 0.4)',
              borderRadius: '8px',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2.5rem',
              boxShadow: '0 25px 60px rgba(0,0,0,0.9)',
            }}
          >
            {orderSuccess ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  background: 'rgba(229, 184, 0, 0.15)',
                  border: '2px solid var(--lambo-gold)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  fontSize: '2rem',
                }}>
                  ✓
                </div>
                <span style={{ color: 'var(--lambo-gold)', fontFamily: 'var(--font-display)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                  Allocation Reserved
                </span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', textTransform: 'uppercase', margin: '0.5rem 0 1rem', color: '#fff' }}>
                  Order Confirmed
                </h2>
                <p style={{ color: 'var(--lambo-text-gray)', fontSize: '0.88rem', maxWidth: '480px', margin: '0 auto 2rem', lineHeight: 1.5 }}>
                  Your allocation request for the <strong style={{ color: '#fff' }}>{car.name}</strong> has been logged under reference{' '}
                  <strong style={{ color: 'var(--lambo-gold)' }}>#{orderSuccess.orderId || orderSuccess._id?.substring(0, 8)}</strong>. Our dealership concierge will contact you to finalize production scheduling.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      setShowOrderModal(false);
                      navigate('/dashboard?tab=my-orders');
                    }}
                    className="lambo-btn-gold lambo-cut"
                  >
                    View in My Dashboard
                  </button>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    className="lambo-btn-outline"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--lambo-border)', paddingBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.68rem', color: 'var(--lambo-gold)', textTransform: 'uppercase', letterSpacing: '0.15em', fontFamily: 'var(--font-display)' }}>
                      Vehicle Allocation Request
                    </span>
                    <h2 style={{ fontFamily: 'var(--font-display)', color: '#fff', margin: '0.2rem 0 0', fontSize: '1.5rem', textTransform: 'uppercase' }}>
                      Reserve {car.name}
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowOrderModal(false)}
                    style={{ background: 'transparent', border: 'none', color: '#aaa', fontSize: '1.8rem', cursor: 'pointer' }}
                  >
                    ×
                  </button>
                </div>

                {!isAuthenticated ? (
                  <div style={{
                    padding: '1.5rem',
                    background: 'rgba(229, 184, 0, 0.08)',
                    border: '1px solid rgba(229, 184, 0, 0.35)',
                    borderRadius: '4px',
                    textAlign: 'center',
                    marginBottom: '1.5rem',
                  }}>
                    <p style={{ color: 'var(--lambo-gold)', fontFamily: 'var(--font-display)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 0.5rem', fontWeight: 700 }}>
                      🔒 Client Account Required
                    </p>
                    <p style={{ color: '#ccc', fontSize: '0.85rem', margin: '0 0 1.25rem', lineHeight: 1.5 }}>
                      Vehicle reservation and order placements are linked directly to your authenticated client profile.
                    </p>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                      <Link to="/login" className="lambo-btn-gold lambo-cut" style={{ fontSize: '0.75rem', padding: '0.5rem 1.25rem', textDecoration: 'none' }}>
                        Sign In as Client
                      </Link>
                      <Link to="/register" className="lambo-btn-outline" style={{ fontSize: '0.75rem', padding: '0.5rem 1.25rem', textDecoration: 'none' }}>
                        Create Account
                      </Link>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handlePlaceOrder}>
                    {orderError && (
                      <div style={{ padding: '0.85rem 1rem', background: 'rgba(192, 106, 82, 0.15)', color: '#ff8b80', borderRadius: '4px', marginBottom: '1.25rem', fontSize: '0.82rem' }}>
                        {orderError}
                      </div>
                    )}

                    {/* Summary Box */}
                    <div style={{ background: '#08080a', border: '1px solid var(--border)', padding: '1rem 1.25rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '0.82rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <span style={{ color: 'var(--lambo-text-gray)' }}>Selected Specification:</span>
                        <strong style={{ color: '#fff' }}>{car.name} ({car.availableColors[selectedColor]?.name})</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <span style={{ color: 'var(--lambo-text-gray)' }}>Client Name:</span>
                        <strong style={{ color: '#fff' }}>{user?.name} ({user?.email})</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px dashed var(--lambo-border)' }}>
                        <span style={{ color: 'var(--lambo-gold)', fontWeight: 700 }}>Total MSRP Order Value:</span>
                        <strong style={{ color: 'var(--lambo-gold)', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>{formatPrice(total)}</strong>
                      </div>
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={{ display: 'block', fontSize: '0.68rem', color: 'var(--lambo-gold)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'var(--font-display)', marginBottom: '0.4rem', fontWeight: 600 }}>
                        Handover Flagship Dealership *
                      </label>
                      <select
                        value={orderForm.dealer}
                        onChange={(e) => setOrderForm(p => ({ ...p, dealer: e.target.value }))}
                        style={{ width: '100%', padding: '0.8rem', background: '#050505', border: '1px solid var(--lambo-border)', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                      >
                        {DEALERS.map((d) => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <label style={{ display: 'block', fontSize: '0.68rem', color: 'var(--lambo-gold)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'var(--font-display)', marginBottom: '0.4rem', fontWeight: 600 }}>
                        Payment / Deposit Preference *
                      </label>
                      <select
                        value={orderForm.paymentMethod}
                        onChange={(e) => setOrderForm(p => ({ ...p, paymentMethod: e.target.value }))}
                        style={{ width: '100%', padding: '0.8rem', background: '#050505', border: '1px solid var(--lambo-border)', color: '#fff', fontSize: '0.85rem', outline: 'none' }}
                      >
                        <option value="Reservation Deposit (€5,000 via Dealership Invoice)">Reservation Deposit (€5,000 via Dealership Invoice)</option>
                        <option value="Direct Bank Wire Transfer (Full MSRP)">Direct Bank Wire Transfer (Full MSRP)</option>
                        <option value="Official Dealership Finance / Lease">Official Dealership Finance / Lease</option>
                      </select>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', fontSize: '0.68rem', color: 'var(--lambo-gold)', textTransform: 'uppercase', letterSpacing: '0.12em', fontFamily: 'var(--font-display)', marginBottom: '0.4rem', fontWeight: 600 }}>
                        Special Delivery or Customization Notes (Optional)
                      </label>
                      <textarea
                        rows="2"
                        placeholder="Ad Personam special requests, personal delivery instructions..."
                        value={orderForm.notes}
                        onChange={(e) => setOrderForm(p => ({ ...p, notes: e.target.value }))}
                        style={{ width: '100%', padding: '0.8rem', background: '#050505', border: '1px solid var(--lambo-border)', color: '#fff', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                      <button
                        type="button"
                        onClick={() => setShowOrderModal(false)}
                        className="ap-btn ap-btn-ghost"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={orderSubmitting}
                        className="lambo-btn-gold lambo-cut"
                        style={{ padding: '0.85rem 1.75rem', fontSize: '0.82rem' }}
                      >
                        {orderSubmitting ? 'Processing Allocation...' : 'Confirm Vehicle Reservation'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      )}

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
