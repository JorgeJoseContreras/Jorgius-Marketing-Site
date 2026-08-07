import React from 'react';
import TiltCard from './TiltCard';
import { UserPlus, MessageSquare, Zap, Check } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    icon: <UserPlus size={24} color="#06b6d4" />,
    title: 'Add Contact',
    desc: 'Tap "Add to Contacts" or scan the QR code to save Jorgius as an iMessage contact on your iPhone or Mac.',
  },
  {
    num: '02',
    icon: <MessageSquare size={24} color="#8b5cf6" />,
    title: 'Text Naturally',
    desc: 'Open your iMessage app and start a conversation. Ask questions, send photos, or request smart actions.',
  },
  {
    num: '03',
    icon: <Zap size={24} color="#ec4899" />,
    title: 'Instant AI Superpower',
    desc: 'Receive instant responses, rich cards, calendar invites, and code outputs right in your native blue message bubbles.',
  },
];

export default function HowItWorks() {
  return (
    <section style={{ padding: '80px 24px', maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>
          3 Simple Steps to <span className="glow-heading">Get Started</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Zero onboarding friction. Up and running in under 30 seconds.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        {STEPS.map((s, idx) => (
          <TiltCard key={idx} maxTilt={10}>
            <div style={{ padding: '32px 24px', position: 'relative' }}>
              <div
                style={{
                  position: 'absolute',
                  top: '20px',
                  right: '24px',
                  fontSize: '2.5rem',
                  fontWeight: '900',
                  color: 'rgba(255, 255, 255, 0.05)',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                {s.num}
              </div>

              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(139, 92, 246, 0.15)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                {s.icon}
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff', marginBottom: '10px' }} className="hover-glow-text">
                {s.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>{s.desc}</p>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
