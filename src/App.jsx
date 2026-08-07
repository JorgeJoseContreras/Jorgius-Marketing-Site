import React from 'react';
import BackgroundCanvas from './components/BackgroundCanvas';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import IMessageDemo from './components/IMessageDemo';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import Footer from './components/Footer';

export default function App() {
  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Dynamic Animated Particle Canvas Background */}
      <BackgroundCanvas />

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Interactive iMessage Playground & Feature Grid Side-by-Side on wide screens */}
      <section id="demo" style={{ padding: '30px 20px 60px 20px', position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div className="pulse-badge" style={{ marginBottom: '10px' }}>
            <span>Live Interactive iMessage Playground</span>
          </div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: '800', fontFamily: 'var(--font-heading)', marginBottom: '6px' }}>
            Test Jorgius <span className="text-shimmer">In Real-Time</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto' }}>
            Click prompt pills below to simulate iMessage AI queries.
          </p>
        </div>

        <IMessageDemo />
      </section>

      {/* Features Showcase */}
      <Features />

      {/* Compact Quick Specs Comparison Table */}
      <section style={{ padding: '30px 20px', maxWidth: '1000px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
            Quick Comparison Specs
          </h3>
        </div>
        <div
          style={{
            background: 'rgba(18, 22, 34, 0.6)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '16px 20px',
            backdropFilter: 'blur(12px)',
            overflowX: 'auto',
          }}
        >
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', color: '#cbd5e1', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}>
                <th style={{ padding: '10px 12px' }}>Capability</th>
                <th style={{ padding: '10px 12px' }}>Standard Web Chat</th>
                <th style={{ padding: '10px 12px', color: '#06b6d4' }}>Jorgius iMessage AI</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '10px 12px', fontWeight: '600', color: '#fff' }}>Interface</td>
                <td style={{ padding: '10px 12px', color: '#94a3b8' }}>Browser App / Separate Tab</td>
                <td style={{ padding: '10px 12px', color: '#38bdf8', fontWeight: '600' }}>Native iMessage App (Blue Bubbles)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '10px 12px', fontWeight: '600', color: '#fff' }}>Group Chat Support</td>
                <td style={{ padding: '10px 12px', color: '#94a3b8' }}>❌ No native SMS/iMessage integration</td>
                <td style={{ padding: '10px 12px', color: '#38bdf8', fontWeight: '600' }}>✅ @Jorgius in any Apple Group Chat</td>
              </tr>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '10px 12px', fontWeight: '600', color: '#fff' }}>Apple Calendar Sync</td>
                <td style={{ padding: '10px 12px', color: '#94a3b8' }}>Manual export .ics files</td>
                <td style={{ padding: '10px 12px', color: '#38bdf8', fontWeight: '600' }}>✅ Automatic 1-tap iMessage Invites</td>
              </tr>
              <tr>
                <td style={{ padding: '10px 12px', fontWeight: '600', color: '#fff' }}>Offline Queueing</td>
                <td style={{ padding: '10px 12px', color: '#94a3b8' }}>Fails on connection loss</td>
                <td style={{ padding: '10px 12px', color: '#38bdf8', fontWeight: '600' }}>✅ Native iMessage SMS failover</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Pricing Tiers */}
      <Pricing />

      {/* Footer */}
      <Footer />
    </div>
  );
}
