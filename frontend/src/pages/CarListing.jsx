import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import useDebounce from '../hooks/useDebounce';
import { useWishlist } from '../context/WishlistContext';
import { getCars } from '../services/carService';
import CarGrid from '../components/cars/CarGrid';
import CarFilterSidebar from '../components/cars/CarFilterSidebar';
import Modal from '../components/common/Modal';
import CarGallery from '../components/cars/CarGallery';
import formatCurrency from '../utils/formatCurrency';

const CATEGORIES = ['All', 'Super Sports', 'Super SUV', 'Limited Edition'];

export function CarListing() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [priceRange, setPriceRange] = useState(1000000);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [selectedCar, setSelectedCar] = useState(null);
  const { toggleWishlist, wishlistIds } = useWishlist();
  const navigate = useNavigate();

  const { data: cars = [], loading } = useFetch(
    () => getCars(),
    []
  );

  const filtered = useMemo(() => {
    let result = cars || [];

    if (activeCategory !== 'All') {
      result = result.filter((c) => c.category === activeCategory);
    }

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.engine?.toLowerCase().includes(q) ||
          c.blurb?.toLowerCase().includes(q) ||
          c.category?.toLowerCase().includes(q)
      );
    }

    if (priceRange < 1000000) {
      result = result.filter((c) => !c.startingPrice || c.startingPrice <= priceRange);
    }

    const sorted = [...result];
    switch (sortBy) {
      case 'price-asc':
        sorted.sort((a, b) => (a.startingPrice || 0) - (b.startingPrice || 0));
        break;
      case 'price-desc':
        sorted.sort((a, b) => (b.startingPrice || 0) - (a.startingPrice || 0));
        break;
      case 'power-desc':
        sorted.sort((a, b) => (parseFloat(b.power) || 0) - (parseFloat(a.power) || 0));
        break;
      case 'name-asc':
        sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
        break;
      default:
        break;
    }

    return sorted;
  }, [cars, activeCategory, sortBy, priceRange, debouncedSearch]);

  const handleResetFilters = () => {
    setActiveCategory('All');
    setSortBy('featured');
    setPriceRange(1000000);
    setSearch('');
  };

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
          Sant'Agata Bolognese Line-Up
        </span>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          fontWeight: 900,
          textTransform: 'uppercase',
          marginBottom: '0.75rem',
        }}>
          All Models
        </h1>
        <p style={{ color: 'var(--lambo-text-gray)', maxWidth: '620px', margin: '0 auto 2rem', lineHeight: 1.6, fontSize: '0.95rem' }}>
          Explore the complete range of Lamborghini super sports cars, Super SUVs, and limited editions.
        </p>
        <div style={{ maxWidth: '520px', margin: '0 auto' }}>
          <input
            type="text"
            placeholder="Search models, V12, hybrid, specs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              background: '#000',
              border: '1px solid var(--lambo-border, #222)',
              padding: '0.85rem 1.25rem',
              color: '#fff',
              fontSize: '0.9rem',
              outline: 'none',
              fontFamily: 'var(--font-base)',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--lambo-gold)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--lambo-border, #222)')}
          />
        </div>
      </section>

      <section style={{
        padding: '2.5rem 2rem 5rem',
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '270px 1fr',
        gap: '2.5rem',
        alignItems: 'flex-start',
      }}>
        <CarFilterSidebar
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          minMax={[150000, 1000000]}
          onReset={handleResetFilters}
        />

        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}>
            <p style={{
              fontSize: '0.75rem',
              fontFamily: 'var(--font-display)',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--lambo-text-gray)',
            }}>
              Showing <span style={{ color: '#fff', fontWeight: 800 }}>{filtered.length}</span> model{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>

          <CarGrid
            cars={filtered}
            loading={loading}
            onViewSpecs={setSelectedCar}
            onToggleWishlist={toggleWishlist}
            wishlistIds={wishlistIds}
            emptyMessage="No Lamborghini models match your current filters. Try resetting the filters or broadening your search."
          />
        </div>
      </section>

      <Modal
        isOpen={!!selectedCar}
        onClose={() => setSelectedCar(null)}
        title={selectedCar?.name}
        maxWidth="760px"
      >
        {selectedCar && (
          <div>
            <CarGallery
              primaryImage={selectedCar.image}
              images={selectedCar.gallery}
              alt={selectedCar.name}
            />
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ color: 'var(--lambo-gold)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.4rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
                {selectedCar.category}
              </p>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                {selectedCar.name}
              </h3>
              <p style={{ color: 'var(--lambo-text-gray)', lineHeight: 1.65, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                {selectedCar.blurb || selectedCar.description}
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '1px',
                background: 'var(--lambo-border, #222)',
                marginBottom: '1.5rem',
              }}>
                {[
                  ['Engine', selectedCar.engine],
                  ['Power', selectedCar.power],
                  ['0-100 km/h', selectedCar.zeroToHundred || selectedCar.zeroToSixty],
                  ['Top Speed', selectedCar.topSpeed],
                  ['Weight', selectedCar.weight],
                  ['Starting Price', formatCurrency(selectedCar.startingPrice)],
                ].map(([label, value]) => (
                  <div key={label} style={{ background: '#0a0a0a', padding: '0.9rem' }}>
                    <p style={{ fontSize: '0.6rem', color: 'var(--lambo-text-gray)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>
                      {label}
                    </p>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 800, color: label.includes('Price') ? 'var(--lambo-gold)' : '#fff' }}>
                      {value || '—'}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    const slug = selectedCar.slug;
                    setSelectedCar(null);
                    navigate(`/cars/${slug}`);
                  }}
                  className="lambo-btn-gold lambo-cut"
                  style={{ flex: 1, padding: '0.85rem' }}
                >
                  Full Vehicle Details
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const slug = selectedCar.slug;
                    setSelectedCar(null);
                    navigate(`/configurator/${slug}`);
                  }}
                  className="lambo-btn-outline"
                  style={{ flex: 1, padding: '0.85rem' }}
                >
                  Configure
                </button>
                <button
                  type="button"
                  onClick={() => toggleWishlist(selectedCar)}
                  className="lambo-btn-outline"
                  style={{
                    padding: '0.85rem 1.25rem',
                    borderColor: wishlistIds.includes(selectedCar._id) ? 'var(--lambo-gold)' : undefined,
                    color: wishlistIds.includes(selectedCar._id) ? 'var(--lambo-gold)' : undefined,
                  }}
                >
                  {wishlistIds.includes(selectedCar._id) ? '♥ Wishlisted' : '♡ Wishlist'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default CarListing;
