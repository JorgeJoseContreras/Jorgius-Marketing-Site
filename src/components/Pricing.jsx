import React from 'react';
import TiltCard from './TiltCard';
import { Check, Sparkles, Zap } from 'lucide-react';

export default function Pricing() {
  return (
    <section id="pricing" style={{ padding: '80px 24px', maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>
          Simple, Transparent <span className="text-shimmer">Pricing</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Start free forever. Upgrade anytime for unlimited high-speed AI queries.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px' }}>
        {/* Free Plan */}
        <TiltCard maxTilt={10}>
          <div style={{ padding: '36px 30px' }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#fff', marginBottom: '8px' }}>Free Starter</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>Perfect for casual daily iMessage queries.</p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '24px' }}>
              <span style={{ fontSize: '3rem', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-heading)' }}>$0</span>
              <span style={{ color: 'var(--text-muted)' }}>/ month</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: '#cbd5e1' }}>
                <Check size={18} color="#06b6d4" /> 50 AI iMessages per month
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: '#cbd5e1' }}>
                <Check size={18} color="#06b6d4" /> Basic text & scheduling
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: '#cbd5e1' }}>
                <Check size={18} color="#06b6d4" /> Standard response speed
              </li>
            </ul>

            <button className="btn-secondary" style={{ width: '100%' }}>
              Get Started Free
            </button>
          </div>
        </TiltCard>

        {/* Pro Plan */}
        <TiltCard maxTilt={12}>
          <div
            style={{
              padding: '36px 30px',
              position: 'relative',
              background: 'linear-gradient(180deg, rgba(139,92,246,0.15) 0%, rgba(18,22,34,0.85) 100%)',
              border: '1px solid rgba(139, 92, 246, 0.5)',
              borderRadius: '24px',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '-14px',
                right: '24px',
                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                padding: '4px 14px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: '800',
                color: '#fff',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                boxShadow: '0 0 15px rgba(139,92,246,0.6)',
              }}
            >
              Most Popular
            </div>

            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#fff', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              Jorgius Pro <Sparkles size={18} color="#06b6d4" />
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>Unlimited supercharged AI for power users.</p>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '24px' }}>
              <span style={{ fontSize: '3rem', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-heading)' }}>$9.99</span>
              <span style={{ color: 'var(--text-muted)' }}>/ month</span>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: '#fff' }}>
                <Check size={18} color="#8b5cf6" /> <strong>Unlimited</strong> iMessages & group chat @mentions
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: '#fff' }}>
                <Check size={18} color="#8b5cf6" /> Sub-300ms ultra-fast priority response
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: '#fff' }}>
                <Check size={18} color="#8b5cf6" /> Multimodal vision & image generation
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: '#fff' }}>
                <Check size={18} color="#8b5cf6" /> Live web browsing & calendar sync
              </li>
            </ul>

            <button className="btn-primary" style={{ width: '100%' }}>
              <Zap size={18} />
              <span>Upgrade to Pro</span>
            </button>
          </div>
        </TiltCard>
      </div>
    </section>
  );
}
