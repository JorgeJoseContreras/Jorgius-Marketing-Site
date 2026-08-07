import React from 'react';
import TiltCard from './TiltCard';
import { MessageCircle, Calendar, Compass, Shield, Users, Image, Zap, Cpu } from 'lucide-react';

const FEATURES_DATA = [
  {
    icon: <MessageCircle size={20} color="#06b6d4" />,
    title: 'Native iMessage Integration',
    desc: 'No third-party apps to install. Text Jorgius like a friend in blue bubbles.',
    tag: 'Apple Ecosystem',
  },
  {
    icon: <Users size={20} color="#8b5cf6" />,
    title: 'Group Chat Copilot',
    desc: 'Add @Jorgius to family or team group chats. Settle debates & summarize threads.',
    tag: 'Multi-User',
  },
  {
    icon: <Calendar size={20} color="#ec4899" />,
    title: 'Smart Calendar & Reminders',
    desc: 'Set reminders & book meetings automatically synced to Apple Calendar.',
    tag: 'Automated Sync',
  },
  {
    icon: <Compass size={20} color="#38bdf8" />,
    title: 'Live Web & Places Search',
    desc: 'Real-time web lookups, restaurant recommendations & flight tracking.',
    tag: 'Live Web Data',
  },
  {
    icon: <Image size={20} color="#a855f7" />,
    title: 'On-Demand Image & Vision AI',
    desc: 'Send photos for instant object analysis or request AI artwork generation.',
    tag: 'Multimodal Vision',
  },
  {
    icon: <Shield size={20} color="#10b981" />,
    title: 'Bank-Grade Privacy',
    desc: 'Messages are processed with enterprise privacy. Data is never sold.',
    tag: 'Private & Secure',
  },
];

export default function Features() {
  return (
    <section id="features" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: '800', fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>
          Engineered for <span className="text-shimmer">Unmatched Power</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '500px', margin: '0 auto' }}>
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
          <TiltCard key={i} maxTilt={6}>
            <div style={{ padding: '20px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
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
                    fontSize: '0.68rem',
                    fontWeight: '700',
                    color: '#94a3b8',
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
                  fontSize: '1.05rem',
                  fontWeight: '700',
                  color: '#f8fafc',
                  marginBottom: '6px',
                  fontFamily: 'var(--font-heading)',
                }}
                className="hover-glow-text"
              >
                {feat.title}
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: '1.45' }}>
                {feat.desc}
              </p>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
