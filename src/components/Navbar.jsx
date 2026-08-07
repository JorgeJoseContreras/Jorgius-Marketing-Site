import React from 'react';

export default function Navbar() {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: 'rgba(7, 8, 10, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
      }}
    >
      {/* Brand Title (Plain text, no logo) */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ fontWeight: '800', fontSize: '1.2rem', fontFamily: 'var(--font-heading)', color: '#fff', letterSpacing: '-0.02em' }}>
          Jorgius
        </span>
      </div>

      {/* Navigation Links (No GitHub Link) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <a href="#demo" className="hover-glow-text" style={{ textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
          Live Demo
        </a>
        <a href="#features" className="hover-glow-text" style={{ textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
          Features
        </a>
        <a href="#pricing" className="hover-glow-text" style={{ textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>
          Pricing
        </a>
      </div>
    </nav>
  );
}
