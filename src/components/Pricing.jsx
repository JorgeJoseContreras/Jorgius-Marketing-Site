import React from 'react';
import TiltCard from './TiltCard';
import { Check, Zap } from 'lucide-react';

export default function Pricing() {
  return (
    <section id="pricing" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: '800', fontFamily: 'var(--font-heading)', marginBottom: '6px' }}>
          Access Plans
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          Test with a free demo, or unlock unlimited iMessage access.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        {/* Free Demo Plan */}
        <TiltCard maxTilt={4}>
          <div style={{ padding: '20px 18px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Demo Access</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '14px' }}>Try the core iMessage flow instantly.</p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '14px' }}>
              <span style={{ fontSize: '2rem', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-heading)' }}>Free</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                <Check size={14} color="#ffffff" /> Capped at 10 messages total
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                <Check size={14} color="#ffffff" /> Basic text & scheduling demo
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                <Check size={14} color="#ffffff" /> Standard response speed
              </li>
            </ul>

            <a href="#signup" className="btn-secondary" style={{ width: '100%', padding: '8px 16px', textDecoration: 'none', textAlign: 'center' }}>
              Try Free Demo
            </a>
          </div>
        </TiltCard>

        {/* Pro Plan */}
        <TiltCard maxTilt={5}>
          <div
            style={{
              padding: '20px 18px',
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
              Jorgius Pro
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '14px' }}>Unlimited AI for power users.</p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '14px' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-heading)' }}>$9.99</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>/ month</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#fff' }}>
                <Check size={14} color="#ffffff" /> <strong>Unlimited</strong> messages & requests
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#fff' }}>
                <Check size={14} color="#ffffff" /> Sub-300ms priority response
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#fff' }}>
                <Check size={14} color="#ffffff" /> Full live web search capabilities
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#fff' }}>
                <Check size={14} color="#ffffff" /> Full calendar integration
              </li>
            </ul>

            <a href="#signup" className="btn-primary" style={{ width: '100%', padding: '8px 16px', textDecoration: 'none', textAlign: 'center' }}>
              <Zap size={12} fill="#000" />
              <span>Get Pro Access</span>
            </a>
          </div>
        </TiltCard>
      </div>
    </section>
  );
}
