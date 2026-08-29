import React from 'react';

export function Button({
  children,
  variant = 'gold',
  size = 'md',
  type = 'button',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  style = {},
  ...props
}) {
  const isGold = variant === 'gold';
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';
  const isSecondary = variant === 'secondary';

  const baseStyle = {
    fontFamily: 'var(--font-display, sans-serif)',
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    fontWeight: 700,
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    opacity: disabled || loading ? 0.6 : 1,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease',
    border: 'none',
    textDecoration: 'none',
    clipPath: isGold || isDanger ? 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' : 'none',
  };

  const sizeStyles = {
    sm: { padding: '0.45rem 0.9rem', fontSize: '0.7rem' },
    md: { padding: '0.75rem 1.4rem', fontSize: '0.78rem' },
    lg: { padding: '0.95rem 2rem', fontSize: '0.85rem' },
  };

  const variantStyles = {
    gold: {
      background: 'var(--lambo-gold, #e5b800)',
      color: '#0f0d09',
    },
    outline: {
      background: 'transparent',
      border: '1px solid var(--lambo-border, #222)',
      color: '#ffffff',
    },
    secondary: {
      background: '#1a1a1a',
      border: '1px solid #333',
      color: '#ffffff',
    },
    danger: {
      background: 'rgba(192, 106, 82, 0.2)',
      border: '1px solid rgba(192, 106, 82, 0.5)',
      color: '#e57373',
    },
  };

  const combinedStyle = {
    ...baseStyle,
    ...(sizeStyles[size] || sizeStyles.md),
    ...(variantStyles[variant] || variantStyles.gold),
    ...style,
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={combinedStyle}
      className={className}
      {...props}
    >
      {loading && <span className="aur-spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}

export default Button;
