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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span>© {new Date().getFullYear()} Jorgius AI. All rights reserved.</span>
          <a
            href="https://github.com/JorgeJoseContreras/notification-assistant"
            target="_blank"
            rel="noreferrer"
            title="GitHub Repository"
            aria-label="GitHub Repository"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              transition: 'color 0.2s ease, opacity 0.2s ease, transform 0.2s ease',
              opacity: 0.7,
              textDecoration: 'none',
              marginLeft: '2px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'scale(1.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.opacity = '0.7';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <svg
              height="15"
              width="15"
              viewBox="0 0 16 16"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
        </div>

        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
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
