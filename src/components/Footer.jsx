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

            {/* Live System Status Button in Footer */}
            <button
              onClick={onOpenStatus}
              className="pulse-badge"
              style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <span className="pulse-dot" />
              <span>{statusData.status || 'All Systems Operational'} ({statusData.uptime || '100%'})</span>
            </button>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', maxWidth: '350px' }}>
            AI assistant operating natively inside Apple iMessage. Designed for speed and absolute privacy since 07/24/2026.
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
        <div>© {new Date().getFullYear()} Jorgius. All rights reserved. 07/24/2026 Creation Release.</div>
        <div>Built natively for the Apple iMessage ecosystem</div>
      </div>
    </footer>
  );
}
