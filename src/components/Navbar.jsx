import React from 'react';

export default function Navbar({ isLoggedIn, onAuthClick, onDashboardClick }) {
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
      {/* Brand Title */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <a href="#" style={{ fontWeight: '800', fontSize: '1.2rem', fontFamily: 'var(--font-heading)', color: '#fff', letterSpacing: '-0.02em', textDecoration: 'none' }}>
          Jorgius
        </a>
      </div>

      {/* Navigation Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <a href="#demo" className="hover-glow-text" style={{ textDecoration: 'none', fontSize: '0.88rem', fontWeight: '500' }}>
          Live Demo
        </a>
        <a href="#features" className="hover-glow-text" style={{ textDecoration: 'none', fontSize: '0.88rem', fontWeight: '500' }}>
          Features
        </a>
        <a href="#pricing" className="hover-glow-text" style={{ textDecoration: 'none', fontSize: '0.88rem', fontWeight: '500' }}>
          Pricing
        </a>
        {isLoggedIn ? (
          <button
            onClick={onDashboardClick}
            className="btn-primary"
            style={{ padding: '6px 16px', fontSize: '0.85rem', cursor: 'pointer' }}
          >
            Dashboard
          </button>
        ) : (
          <button
            onClick={onAuthClick}
            className="btn-primary"
            style={{ padding: '6px 16px', fontSize: '0.85rem', cursor: 'pointer' }}
          >
            Log In / Sign Up
          </button>
        )}
      </div>
    </nav>
  );
}
