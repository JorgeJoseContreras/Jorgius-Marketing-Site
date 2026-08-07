import React from 'react';
import TiltCard from './TiltCard';
import { Check, Sparkles, Zap } from 'lucide-react';

export default function Pricing() {
  return (
    <section id="pricing" style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: '800', fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>
          Simple, Transparent <span className="text-shimmer">Pricing</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Start free forever. Upgrade anytime for unlimited queries.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        {/* Free Plan */}
        <TiltCard maxTilt={5}>
          <div style={{ padding: '24px 20px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>Free Starter</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '16px' }}>Perfect for daily casual queries.</p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '16px' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-heading)' }}>$0</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>/ month</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#cbd5e1' }}>
                <Check size={14} color="#06b6d4" /> 50 AI iMessages per month
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#cbd5e1' }}>
                <Check size={14} color="#06b6d4" /> Basic text & scheduling
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#cbd5e1' }}>
                <Check size={14} color="#06b6d4" /> Standard response speed
              </li>
            </ul>

            <button className="btn-secondary" style={{ width: '100%', padding: '8px 16px' }}>
              Get Started Free
            </button>
          </div>
        </TiltCard>

        {/* Pro Plan */}
        <TiltCard maxTilt={6}>
          <div
            style={{
              padding: '24px 20px',
              position: 'relative',
              background: 'linear-gradient(180deg, rgba(139,92,246,0.15) 0%, rgba(18,22,34,0.85) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.5)',
              borderRadius: '16px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-10px',
                right: '16px',
                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                padding: '2px 10px',
                borderRadius: '9999px',
                fontSize: '0.65rem',
                fontWeight: '800',
                color: '#fff',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Popular
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: '#fff', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Jorgius Pro <Sparkles size={14} color="#06b6d4" />
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '16px' }}>Unlimited power users.</p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '16px' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-heading)' }}>$9.99</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>/ month</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#fff' }}>
                <Check size={14} color="#8b5cf6" /> <strong>Unlimited</strong> iMessages & @mentions
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#fff' }}>
                <Check size={14} color="#8b5cf6" /> Sub-300ms ultra-fast priority
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#fff' }}>
                <Check size={14} color="#8b5cf6" /> Multimodal vision & AI image renders
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: '#fff' }}>
                <Check size={14} color="#8b5cf6" /> Live web browsing & calendar sync
              </li>
            </ul>

            <button className="btn-primary" style={{ width: '100%', padding: '8px 16px' }}>
              <Zap size={14} />
              <span>Upgrade to Pro</span>
            </button>
          </div>
        </TiltCard>
      </div>
    </section>
  );
}
