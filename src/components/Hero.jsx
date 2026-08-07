import React from 'react';
import { Sparkles, MessageSquare, ArrowRight, ShieldCheck, Zap, Bot } from 'lucide-react';

export default function Hero({ onExploreClick }) {
  return (
    <section style={{ padding: '140px 24px 80px 24px', textAlign: 'center', position: 'relative', zIndex: 2 }}>
      {/* Pulse Badge */}
      <div style={{ marginBottom: '24px', display: 'inline-block' }}>
        <div className="pulse-badge">
          <span className="pulse-dot" />
          <span>Jorgius v2.5 • Native Apple iMessage Assistant</span>
        </div>
      </div>

      {/* Main Title with Gradient Shimmer on Hover */}
      <h1
        style={{
          fontSize: 'clamp(2.8rem, 6vw, 4.8rem)',
          fontWeight: '800',
          lineHeight: '1.1',
          letterSpacing: '-0.03em',
          maxWidth: '900px',
          margin: '0 auto 24px auto',
          fontFamily: 'var(--font-heading)',
        }}
      >
        Your <span className="hover-glow-text">iMessage</span>, Supercharged with{' '}
        <span className="text-shimmer">Autonomous Intelligence</span>
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
          color: 'var(--text-secondary)',
          maxWidth: '680px',
          margin: '0 auto 40px auto',
          lineHeight: '1.6',
          fontWeight: '400',
        }}
      >
        Meet <strong style={{ color: '#fff' }}>Jorgius</strong> — the personal AI companion living right inside your native iMessage app. No downloads, no extra apps. Just text, command, and automate.
      </p>

      {/* CTA Buttons */}
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '60px' }}>
        <a href="#demo" className="btn-primary" onClick={onExploreClick}>
          <MessageSquare size={20} />
          <span>Try Interactive Demo</span>
          <ArrowRight size={18} />
        </a>
        <a href="#features" className="btn-secondary">
          <Sparkles size={18} color="#06b6d4" />
          <span>Explore Capabilities</span>
        </a>
      </div>

      {/* Stat Badges */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          maxWidth: '850px',
          margin: '0 auto',
        }}
      >
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: '20px', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#06b6d4', marginBottom: '4px' }}>&lt; 300ms</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Sub-Second iMessage Latency</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: '20px', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#8b5cf6', marginBottom: '4px' }}>Zero Apps</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Native iOS & macOS iMessage</div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', padding: '20px', borderRadius: '16px', backdropFilter: 'blur(10px)' }}>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ec4899', marginBottom: '4px' }}>E2E Private</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Encrypted & Secure Threads</div>
        </div>
      </div>
    </section>
  );
}
