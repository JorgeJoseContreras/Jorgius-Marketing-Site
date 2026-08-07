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

      {/* Interactive iMessage Playground / Demo */}
      <section id="demo" style={{ padding: '60px 24px 100px 24px', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div className="pulse-badge" style={{ marginBottom: '16px' }}>
            <span>Interactive Playground</span>
          </div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>
            Experience Jorgius <span className="text-shimmer">Live in Action</span>
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '540px', margin: '0 auto' }}>
            Click prompt pills below to simulate sending messages to Jorgius directly inside the iMessage interface.
          </p>
        </div>

        <IMessageDemo />
      </section>

      {/* Features Showcase with 3D Tilt Cards */}
      <Features />

      {/* How It Works */}
      <HowItWorks />

      {/* Pricing Tiers */}
      <Pricing />

      {/* Footer */}
      <Footer />
    </div>
  );
}
