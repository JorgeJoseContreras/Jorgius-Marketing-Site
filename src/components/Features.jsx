import React from 'react';
import TiltCard from './TiltCard';
import { MessageCircle, Calendar, Compass, Shield, Users, Image, Terminal, Cpu } from 'lucide-react';

const FEATURES_DATA = [
  {
    icon: <MessageCircle size={28} color="#06b6d4" />,
    title: 'Native iMessage Integration',
    desc: 'No third-party apps or cumbersome web logins. Add Jorgius as a contact and start chatting immediately in blue bubbles.',
    tag: 'Apple Ecosystem',
  },
  {
    icon: <Users size={28} color="#8b5cf6" />,
    title: 'Group Chat Copilot',
    desc: 'Add @Jorgius to any family, friends, or work group chat. Settle debates, summarize long threads, or plan trips together.',
    tag: 'Multi-User Aware',
  },
  {
    icon: <Calendar size={28} color="#ec4899" />,
    title: 'Smart Calendar & Reminders',
    desc: 'Tell Jorgius "Remind me to call Mom when I reach home" or "Book sync for tomorrow". Syncs directly with Apple Calendar.',
    tag: 'Automated Sync',
  },
  {
    icon: <Compass size={28} color="#38bdf8" />,
    title: 'Live Web & Places Search',
    desc: 'Real-time web browsing, restaurant recommendations, flight tracking, and weather reports served right inside your text thread.',
    tag: 'Live Web Data',
  },
  {
    icon: <Image size={28} color="#a855f7" />,
    title: 'On-Demand Image & Vision AI',
    desc: 'Send a photo to ask "What plant is this?" or text "Generate a cyberpunk avatar" to receive high-res AI image renders in chat.',
    tag: 'Multimodal Vision',
  },
  {
    icon: <Shield size={28} color="#10b981" />,
    title: 'Bank-Grade Privacy',
    desc: 'Your text messages are processed with enterprise-grade privacy controls. Data is never sold or used for public training.',
    tag: 'Private & Secure',
  },
];

export default function Features() {
  return (
    <section id="features" style={{ padding: '80px 24px', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', fontFamily: 'var(--font-heading)', marginBottom: '16px' }}>
          Engineered for <span className="text-shimmer">Unmatched Power</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Experience the sleekest AI assistant built ground-up for Apple's native messaging infrastructure.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        {FEATURES_DATA.map((feat, i) => (
          <TiltCard key={i} maxTilt={12}>
            <div style={{ padding: '32px 28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
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
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: '#94a3b8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    padding: '4px 10px',
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
                  fontSize: '1.35rem',
                  fontWeight: '700',
                  color: '#f8fafc',
                  marginBottom: '12px',
                  fontFamily: 'var(--font-heading)',
                }}
                className="hover-glow-text"
              >
                {feat.title}
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                {feat.desc}
              </p>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
