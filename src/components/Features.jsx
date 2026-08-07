import React from 'react';
import TiltCard from './TiltCard';
import { 
  MessageSquare, 
  Send, 
  Package, 
  Key, 
  CheckSquare, 
  TrendingUp, 
  Mic, 
  Camera, 
  BellRing, 
  Mail, 
  Globe 
} from 'lucide-react';

const FEATURES_DATA = [
  {
    icon: <MessageSquare size={18} color="#ffffff" />,
    title: 'iMessage and Telegram Chat',
    desc: 'Talk to your assistant naturally on the messaging apps you use every day.',
    tag: 'Multi-Platform',
  },
  {
    icon: <Send size={18} color="#ffffff" />,
    title: 'Smart Message Relay',
    desc: 'Send texts to friends through Jorgius, matching your exact tone, slang, and energy.',
    tag: 'Tone Matching',
  },
  {
    icon: <Package size={18} color="#ffffff" />,
    title: 'Package Watchdog',
    desc: 'Snap a picture of a shipping label or text a tracking number to get instant delivery updates.',
    tag: 'Live Tracking',
  },
  {
    icon: <Key size={18} color="#ffffff" />,
    title: 'Instant Verification Codes',
    desc: 'Verification codes sent to your emails are forwarded to your text messages instantly.',
    tag: '2FA Relay',
  },
  {
    icon: <CheckSquare size={18} color="#ffffff" />,
    title: 'Isolated To-Do Lists',
    desc: 'Keep your personal tasks organized and private, managed entirely over text.',
    tag: 'Task Manager',
  },
  {
    icon: <TrendingUp size={18} color="#ffffff" />,
    title: 'Stock and Crypto Price Alerts',
    desc: 'Get text alerts the moment your favorite stocks or crypto hit your target price.',
    tag: 'Market Alerts',
  },
  {
    icon: <Mic size={18} color="#ffffff" />,
    title: 'Voice Message Processing',
    desc: 'Send a voice note and Jorgius will transcribe it and execute your commands.',
    tag: 'Voice AI',
  },
  {
    icon: <Camera size={18} color="#ffffff" />,
    title: 'Vision Photo Actions',
    desc: 'Turn photos of flyers into calendar events and screenshots of bills into reminders.',
    tag: 'Vision AI',
  },
  {
    icon: <BellRing size={18} color="#ffffff" />,
    title: 'Shared Reminders',
    desc: 'Schedule automated reminders for yourself or send them directly to friends.',
    tag: 'Automation',
  },
  {
    icon: <Mail size={18} color="#ffffff" />,
    title: 'Smart Email Summaries',
    desc: 'Receive quick text summaries of your Gmail and Outlook inboxes with one admin toggle to pause alerts.',
    tag: 'Inbox Digest',
  },
  {
    icon: <Globe size={18} color="#ffffff" />,
    title: 'Web Builder & Financial Reports',
    desc: 'Create custom web pages and stock valuation PDFs published directly to your site.',
    tag: 'PDF & Web',
  },
];

export default function Features() {
  return (
    <section id="features" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <h2 style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.2rem)', fontWeight: '800', fontFamily: 'var(--font-heading)', marginBottom: '6px' }}>
          Engineered for <span className="text-shimmer">Ultimate Utility</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '540px', margin: '0 auto' }}>
          Powerful autonomous capabilities operating directly inside your text threads.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
        }}
      >
        {FEATURES_DATA.map((feat, i) => (
          <TiltCard key={i} maxTilt={5}>
            <div style={{ padding: '20px 18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
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
