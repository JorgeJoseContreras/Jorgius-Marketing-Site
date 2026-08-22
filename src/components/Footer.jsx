import React, { useState, useEffect } from 'react';
import { getSystemStatus, getAppVersion } from '../utils/statusStore';

export default function Footer({ onOpenStatus, isLoggedIn, onAuthClick, onDashboardClick }) {
  const [statusData, setStatusData] = useState(getSystemStatus());
  const [appVersion, setAppVersion] = useState(getAppVersion());

  useEffect(() => {
    const handleUpdate = () => {
      setStatusData(getSystemStatus());
      setAppVersion(getAppVersion());
    };

    window.addEventListener('storage', handleUpdate);
    window.addEventListener('status-update', handleUpdate);
    window.addEventListener('version-update', handleUpdate);

    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('status-update', handleUpdate);
      window.removeEventListener('version-update', handleUpdate);
    };
  }, []);

  const getDotStyle = (statusCode) => {
    switch (statusCode) {
      case 'degraded':
        return { background: '#f59e0b', boxShadow: '0 0 8px #f59e0b' };
      case 'outage':
        return { background: '#ef4444', boxShadow: '0 0 8px #ef4444' };
      case 'maintenance':
        return { background: '#3b82f6', boxShadow: '0 0 8px #3b82f6' };
      default:
        return { background: '#22c55e', boxShadow: '0 0 8px #22c55e' };
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

            <button
              onClick={onOpenStatus}
              className="pulse-badge"
              style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            >
              <span className="pulse-dot" style={dotStyle} />
              <span>Jorgius {appVersion}</span>
            </button>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', maxWidth: '350px' }}>
            AI assistant operating natively inside Apple iMessage. Designed for speed and absolute privacy.
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
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          paddingTop: '20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
        }}
      >
        <div>
          © {new Date().getFullYear()} Jorgius AI. All rights reserved.
        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          {isLoggedIn ? (
            <button
              onClick={onDashboardClick}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}
            >
              Dashboard
            </button>
          ) : (
            <button
              onClick={onAuthClick}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}
            >
              Account Login
            </button>
          )}
          <a href="https://notification-assistant.onrender.com/privacy" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
            Privacy Policy
          </a>
          <a href="https://notification-assistant.onrender.com/terms" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
