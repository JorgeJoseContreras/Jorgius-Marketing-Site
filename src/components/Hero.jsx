import React from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';

export default function Hero() {
  return (
    <section style={{ padding: '110px 20px 40px 20px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
      {/* Main Title */}
      <h1
        style={{
          fontSize: 'clamp(1.75rem, 3.8vw, 2.8rem)',
          fontWeight: '800',
          lineHeight: '1.15',
          letterSpacing: '-0.02em',
          maxWidth: '820px',
          margin: '0 auto 14px auto',
          fontFamily: 'var(--font-heading)',
        }}
      >
        Your <span className="hover-glow-text">iMessage</span>, Supercharged with{' '}
        <span className="text-shimmer">Autonomous Intelligence</span>
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: '0.98rem',
          color: 'var(--text-secondary)',
          maxWidth: '580px',
          margin: '0 auto 24px auto',
          lineHeight: '1.5',
          fontWeight: '400',
        }}
      >
        Meet <strong style={{ color: '#fff' }}>Jorgius</strong>, the personal AI companion living right inside your native iMessage app. Zero downloads. Just text, command, and automate.
      </p>

      {/* CTA Buttons - Arrow removed from Try Interactive Demo */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '36px' }}>
        <a href="#demo" className="btn-primary">
          <MessageSquare size={16} />
          <span>Try Interactive Demo</span>
        </a>
        <a href="#features" className="btn-secondary">
          <Sparkles size={15} color="#ffffff" />
          <span>Explore Capabilities</span>
        </a>
      </div>

      {/* Stat Badges Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '12px',
          maxWidth: '750px',
          margin: '0 auto',
        }}
      >
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: '12px 16px', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#ffffff', marginBottom: '2px' }}>&lt; 300ms</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Sub-Second iMessage Latency</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: '12px 16px', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#ffffff', marginBottom: '2px' }}>Zero Apps</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Native iOS & macOS iMessage</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: '12px 16px', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#ffffff', marginBottom: '2px' }}>E2E Private</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Encrypted & Secure Threads</div>
        </div>
      </div>
    </section>
  );
}
