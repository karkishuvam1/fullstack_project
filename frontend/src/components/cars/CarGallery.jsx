import React, { useState } from 'react';

export function CarGallery({ primaryImage, images = [], alt = "Lamborghini vehicle" }) {
  const allImages = [primaryImage, ...(images || [])].filter(Boolean);
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (allImages.length === 0) {
    return (
      <div style={{ height: '300px', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--lambo-border, #222)' }}>
        <p style={{ color: 'var(--lambo-text-gray, #999)' }}>No gallery images available.</p>
      </div>
    );
  }

  const activeSrc = allImages[selectedIdx] || allImages[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '380px',
          background: '#050505',
          border: '1px solid var(--lambo-border, #222)',
          overflow: 'hidden',
          clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)',
        }}
      >
        <img
          src={activeSrc}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s ease',
          }}
        />
      </div>

      {allImages.length > 1 && (
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {allImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelectedIdx(i)}
              style={{
                width: '74px',
                height: '48px',
                padding: 0,
                border: `2px solid ${selectedIdx === i ? 'var(--lambo-gold, #e5b800)' : 'var(--lambo-border, #222)'}`,
                background: '#000',
                cursor: 'pointer',
                flexShrink: 0,
                overflow: 'hidden',
                transition: 'border-color 0.15s ease',
              }}
            >
              <img src={img} alt={`${alt} thumb ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default CarGallery;
