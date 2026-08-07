import React, { useState, useEffect } from 'react';
import BackgroundCanvas from './components/BackgroundCanvas';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import IMessageDemo from './components/IMessageDemo';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Pricing from './components/Pricing';
import Footer from './components/Footer';
import StatusModal from './components/StatusModal';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [planMode, setPlanMode] = useState('demo');
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [currentView, setCurrentView] = useState('main'); // 'main' | 'admin'

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setCurrentView('admin');
      } else if (hash === '#status') {
        setIsStatusOpen(true);
        setCurrentView('main');
      } else {
        setCurrentView('main');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (currentView === 'admin') {
    return (
      <AdminPanel
        onBack={() => {
          window.location.hash = '';
          setCurrentView('main');
        }}
      />
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Dynamic Animated Particle Canvas Background */}
      <BackgroundCanvas />

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero />

      {/* Interactive iMessage Playground */}
      <section id="demo" style={{ padding: '24px 20px 48px 20px', position: 'relative', zIndex: 2, maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)', fontWeight: '800', fontFamily: 'var(--font-heading)', marginBottom: '6px' }}>
            Test Jorgius
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '500px', margin: '0 auto' }}>
            Click prompt pills below to simulate sending messages to Jorgius in iMessage.
          </p>
        </div>

        <IMessageDemo />
      </section>

      {/* Features Grid */}
      <Features />

      {/* One-Step Activation Signup Form with Demo/Pro Switcher */}
      <HowItWorks planMode={planMode} onPlanChange={setPlanMode} />

      {/* Access Pricing Plans */}
      <Pricing onSelectPlan={setPlanMode} />

      {/* Footer */}
      <Footer
        onOpenStatus={() => setIsStatusOpen(true)}
        onOpenAdmin={() => {
          window.location.hash = '#admin';
          setCurrentView('admin');
        }}
      />

      {/* System Status Modal */}
      <StatusModal
        isOpen={isStatusOpen}
        onClose={() => {
          setIsStatusOpen(false);
          if (window.location.hash === '#status') {
            window.location.hash = '';
          }
        }}
      />
    </div>
  );
}
