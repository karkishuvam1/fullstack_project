import { useState } from 'react';
import { subscribeNewsletter } from '../services/NewsletterService';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Enter your email to subscribe.');
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      setError('That email doesn\u2019t look right — check and try again.');
      return;
    }

    setError('');
    setStatus('loading');

    try {
      await subscribeNewsletter(email);
      setStatus('success');
      setEmail('');
    } catch (err) {
      const message = err.response?.data?.message || 'Subscription failed. Please try again.';
      setError(message);
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return (
      <section className="lambo-newsletter">
        <h2 className="section-title" style={{ borderLeft: 'none', paddingLeft: 0 }}>
          Stay Connected
        </h2>
        <p className="newsletter-success">
          You&rsquo;re on the list. Watch your inbox for what comes next.
        </p>
      </section>
    );
  }

  return (
    <section className="lambo-newsletter">
      <h2 className="section-title" style={{ borderLeft: 'none', paddingLeft: 0 }}>
        Stay Connected
      </h2>
      <p style={{ color: 'var(--lambo-text-gray)', fontSize: '0.85rem' }}>
        Subscribe to receive exclusive news, event invitations, and model reveals.
      </p>
      <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
        <input
          type="email"
          placeholder="ENTER YOUR EMAIL"
          className={`newsletter-input${error ? ' has-error' : ''}`}
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError('');
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? 'newsletter-error' : undefined}
          disabled={status === 'loading'}
        />
        <button type="submit" className="lambo-btn-gold" disabled={status === 'loading'}>
          {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
        </button>
      </form>
      {error && (
        <p id="newsletter-error" className="newsletter-error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
};

export default Newsletter;
