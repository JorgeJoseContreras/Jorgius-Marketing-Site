import React, { useState, useEffect } from 'react';
import { getSystemStatus } from '../utils/statusStore';

export default function Footer({ onOpenStatus }) {
  const [statusData, setStatusData] = useState(getSystemStatus());

  useEffect(() => {
    const handleUpdate = () => {
      setStatusData(getSystemStatus());
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('status-update', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('status-update', handleUpdate);
    };
  }, []);

  // Determine dot color based on current status code
  const getDotStyle = (statusCode) => {
    switch (statusCode) {
      case 'degraded':
        return { background: '#f59e0b', boxShadow: '0 0 8px #f59e0b' };
      case 'outage':
        return { background: '#ef4444', boxShadow: '0 0 8px #ef4444' };
      case 'maintenance':
        return { background: '#3b82f6', boxShadow: '0 0 8px #3b82f6' };
      default:
        return { background: '#22c55e', boxShadow: '0 0 8px #22c55e' }; // Green 100%
    }
  };

  const dotStyle = getDotStyle(statusData.statusCode);

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontWeight: '800', fontSize: '1.1rem', fontFamily: 'var(--font-heading)', color: '#fff' }}>
              Jorgius
            </span>

            {/* Version tag badge with status-colored glowing dot */}
            <button
              onClick={onOpenStatus}
              className="pulse-badge"
              style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <span className="pulse-dot" style={dotStyle} />
              <span>Jorgius v2.5 • Native Apple iMessage Assistant</span>
            </button>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', maxWidth: '350px' }}>
            AI assistant operating natively inside Apple iMessage. Designed for speed and absolute privacy since 07/01/2026.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
          <a href="#demo" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Demo</a>
          <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Features</a>
          <a href="#pricing" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.85rem' }}>Pricing</a>
          <button
            onClick={onOpenStatus}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              padding: 0,
            }}
          >
            System Status
          </button>
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
        <div>© {new Date().getFullYear()} Jorgius. All rights reserved. Launched 07/01/2026.</div>
        <div>Built natively for the Apple iMessage ecosystem</div>
      </div>
    </footer>
  );
}
