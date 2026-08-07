import React from 'react';
import TiltCard from './TiltCard';
import { UserPlus, MessageSquare, Zap } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    icon: <UserPlus size={18} color="#06b6d4" />,
    title: 'Add Contact',
    desc: 'Save Jorgius to iMessage contacts on iPhone or Mac.',
  },
  {
    num: '02',
    icon: <MessageSquare size={18} color="#8b5cf6" />,
    title: 'Text Naturally',
    desc: 'Ask questions, send photos, or @mention in group chats.',
  },
  {
    num: '03',
    icon: <Zap size={18} color="#ec4899" />,
    title: 'Instant Superpowers',
    desc: 'Receive instant blue-bubble smart responses & actions.',
  },
];

export default function HowItWorks() {
  return (
    <section style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: '800', fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>
          3 Steps to <span className="glow-heading">Get Started</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Zero onboarding friction. Up and running in 30 seconds.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {STEPS.map((s, idx) => (
          <TiltCard key={idx} maxTilt={5}>
            <div style={{ padding: '20px 18px', position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '16px',
                  fontSize: '1.8rem',
                  fontWeight: '900',
                  color: 'rgba(255, 255, 255, 0.05)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {s.num}
              </div>

              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(139, 92, 246, 0.15)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                }}
              >
                {s.icon}
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', marginBottom: '4px' }} className="hover-glow-text">
                {s.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: '1.4' }}>{s.desc}</p>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
