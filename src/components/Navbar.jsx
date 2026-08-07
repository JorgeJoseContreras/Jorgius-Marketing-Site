import React from 'react';
import { Sparkles, MessageSquare, Github } from 'lucide-react';

export default function Navbar() {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '70px',
        background: 'rgba(7, 8, 12, 0.75)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
      }}
    >
      {/* Brand Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)',
          }}
        >
          <MessageSquare size={20} color="#fff" />
        </div>
        <span style={{ fontWeight: '800', fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: '#fff' }}>
          Jorgius<span style={{ color: '#06b6d4' }}>.ai</span>
        </span>
      </div>

      {/* Navigation Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        <a href="#demo" className="hover-glow-text" style={{ textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>
          Live Demo
        </a>
        <a href="#features" className="hover-glow-text" style={{ textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>
          Features
        </a>
        <a href="#pricing" className="hover-glow-text" style={{ textDecoration: 'none', fontSize: '0.95rem', fontWeight: '500' }}>
          Pricing
        </a>
        <a
          href="https://github.com/Jorgius-Marketing-Site"
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: '#cbd5e1',
            textDecoration: 'none',
            fontSize: '0.9rem',
            padding: '6px 14px',
            borderRadius: '9999px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.2s ease',
          }}
        >
          <Github size={16} /> GitHub Repo
        </a>
      </div>
    </nav>
  );
}
