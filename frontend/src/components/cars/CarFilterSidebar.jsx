import React from 'react';
import formatCurrency from '../../utils/formatCurrency';

export function CarFilterSidebar({
  categories = ['All', 'Super Sports', 'Super SUV', 'Limited Edition'],
  activeCategory = 'All',
  onCategoryChange,
  sortBy = 'featured',
  onSortChange,
  priceRange = 1000000,
  onPriceRangeChange,
  minMax = [150000, 1000000],
  onReset,
}) {
  return (
    <aside
      style={{
        background: 'var(--lambo-card-bg, #0d0d0d)',
        border: '1px solid var(--lambo-border, #222)',
        padding: '1.5rem',
        clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)',
        position: 'sticky',
        top: '100px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--lambo-border, #222)', paddingBottom: '0.75rem' }}>
        <h3 style={{
          fontFamily: 'var(--font-display, sans-serif)',
          fontSize: '0.85rem',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          color: 'var(--lambo-gold, #e5b800)',
          margin: 0,
        }}>
          Filters
        </h3>
        {onReset && (
          <button
            onClick={onReset}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--lambo-text-gray, #999)',
              fontSize: '0.7rem',
              cursor: 'pointer',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Reset
          </button>
        )}
      </div>

      <div style={{ marginBottom: '1.75rem' }}>
        <label style={labelStyle}>Category</label>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange && onCategoryChange(cat)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.55rem 0.75rem',
                  background: isActive ? 'rgba(229, 184, 0, 0.12)' : 'transparent',
                  border: `1px solid ${isActive ? 'var(--lambo-gold, #e5b800)' : 'transparent'}`,
                  color: isActive ? 'var(--lambo-gold, #e5b800)' : '#cccccc',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--font-display, sans-serif)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{cat}</span>
                {isActive && <span style={{ fontSize: '0.7rem' }}>✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: '1.75rem' }}>
        <label style={labelStyle}>Sort By</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange && onSortChange(e.target.value)}
          style={{
            width: '100%',
            background: '#000000',
            border: '1px solid var(--lambo-border, #222)',
            color: '#ffffff',
            padding: '0.65rem 0.8rem',
            fontFamily: 'var(--font-base, sans-serif)',
            fontSize: '0.82rem',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="featured">Featured / Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="power-desc">Power: Max First</option>
          <option value="name-asc">Model Name (A-Z)</option>
        </select>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
          <label style={{ ...labelStyle, marginBottom: 0 }}>Max Price</label>
          <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '0.78rem', color: 'var(--lambo-gold, #e5b800)', fontWeight: 700 }}>
            {priceRange >= minMax[1] ? 'No limit' : formatCurrency(priceRange)}
          </span>
        </div>
        <input
          type="range"
          min={minMax[0]}
          max={minMax[1]}
          step={25000}
          value={priceRange}
          onChange={(e) => onPriceRangeChange && onPriceRangeChange(Number(e.target.value))}
          style={{
            width: '100%',
            accentColor: 'var(--lambo-gold, #e5b800)',
            cursor: 'pointer',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', color: 'var(--lambo-text-gray, #999)', marginTop: '0.25rem' }}>
          <span>{formatCurrency(minMax[0])}</span>
          <span>{formatCurrency(minMax[1])}+</span>
        </div>
      </div>
    </aside>
  );
}

const labelStyle = {
  display: 'block',
  fontFamily: 'var(--font-mono, monospace)',
  fontSize: '0.65rem',
  textTransform: 'uppercase',
  letterSpacing: '0.15em',
  color: 'var(--lambo-text-gray, #999)',
  marginBottom: '0.65rem',
};

export default CarFilterSidebar;
