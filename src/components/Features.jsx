import React from 'react';
import TiltCard from './TiltCard';
import { MessageCircle, Calendar, Compass, Shield } from 'lucide-react';

const FEATURES_DATA = [
  {
    icon: <MessageCircle size={18} color="#ffffff" />,
    title: 'Native iMessage Integration',
    desc: 'No third-party apps to install. Text Jorgius like a friend in standard blue bubbles.',
    tag: 'Apple Ecosystem',
  },
  {
    icon: <Calendar size={18} color="#ffffff" />,
    title: 'Smart Calendar & Reminders',
    desc: 'Set reminders and book meetings automatically synced to your Apple Calendar.',
    tag: 'Automated Sync',
  },
  {
    icon: <Compass size={18} color="#ffffff" />,
    title: 'Live Web & Places Search',
    desc: 'Real-time web lookups, restaurant recommendations, and active flight tracking.',
    tag: 'Live Web Data',
  },
  {
    icon: <Shield size={18} color="#ffffff" />,
    title: 'Bank-Grade Privacy',
    desc: 'Messages are processed securely. Your data is private and never sold or shared.',
    tag: 'Private & Secure',
  },
];

export default function Features() {
  return (
    <section id="features" style={{ padding: '30px 20px', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: '800', fontFamily: 'var(--font-heading)', marginBottom: '6px' }}>
          Engineered for <span className="text-shimmer">Simplicity & Speed</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '500px', margin: '0 auto' }}>
          Ground-up design built specifically for Apple's native messaging infrastructure.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
        }}
      >
        {FEATURES_DATA.map((feat, i) => (
          <TiltCard key={i} maxTilt={5}>
            <div style={{ padding: '18px 16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {feat.icon}
                </div>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: '700',
                    color: '#86868b',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  {feat.tag}
                </span>
              </div>

              <h3
                style={{
                  fontSize: '1rem',
                  fontWeight: '700',
                  color: '#f5f5f7',
                  marginBottom: '4px',
                  fontFamily: 'var(--font-heading)',
                }}
                className="hover-glow-text"
              >
                {feat.title}
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4' }}>
                {feat.desc}
              </p>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
