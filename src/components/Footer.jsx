import React from 'react';
import { MessageSquare, Heart, Github, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '60px 24px 40px 24px',
        position: 'relative',
        zIndex: 2,
        background: '#040508',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '40px',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MessageSquare size={18} color="#fff" />
            </div>
            <span style={{ fontWeight: '800', fontSize: '1.2rem', fontFamily: 'var(--font-heading)', color: '#fff' }}>
              Jorgius iMessage Assistant
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '380px' }}>
            Next-generation AI assistant operating natively inside Apple iMessage. Designed for speed, elegance, and extreme privacy.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <a href="#demo" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Demo</a>
          <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Features</a>
          <a href="#pricing" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>Pricing</a>
          <a href="https://github.com/Jorgius-Marketing-Site" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>
            GitHub Repository
          </a>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          paddingTop: '24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.82rem',
          color: 'var(--text-muted)',
        }}
      >
        <div>© {new Date().getFullYear()} Jorgius AI. Built with React & Vite.</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          Crafted with <Heart size={14} color="#ec4899" fill="#ec4899" /> for iMessage Power Users
        </div>
      </div>
    </footer>
  );
}
