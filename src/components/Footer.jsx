import React from 'react';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '40px 24px 30px 24px',
        position: 'relative',
        zIndex: 2,
        background: '#040506',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '30px',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontWeight: '800', fontSize: '1.1rem', fontFamily: 'var(--font-heading)', color: '#fff' }}>
              Jorgius
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', maxWidth: '350px' }}>
            AI assistant operating natively inside Apple iMessage. Designed for speed and absolute privacy.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <a href="#demo" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Demo</a>
          <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Features</a>
          <a href="#pricing" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Pricing</a>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
        }}
      >
        <div>© {new Date().getFullYear()} Jorgius. All rights reserved.</div>
        <div>Built natively for the Apple iMessage ecosystem</div>
      </div>
    </footer>
  );
}
