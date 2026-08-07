import React, { useState, useEffect } from 'react';
import { supabase } from './utils/supabaseClient';
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
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';

export default function App() {
  const [planMode, setPlanMode] = useState('demo');
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  
  // App views: 'main' | 'admin' | 'auth' | 'dashboard'
  const [currentView, setCurrentView] = useState('main'); 
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check initial active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoggedIn(!!session?.user);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsLoggedIn(!!session?.user);
      if (session?.user) {
        if (window.location.hash === '#auth') {
          window.location.hash = '#dashboard';
        }
      } else {
        if (window.location.hash === '#dashboard') {
          window.location.hash = '';
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setCurrentView('admin');
      } else if (hash === '#auth') {
        setCurrentView('auth');
      } else if (hash === '#dashboard') {
        setCurrentView(isLoggedIn ? 'dashboard' : 'auth');
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
  }, [isLoggedIn]);

  const handleAuthSuccess = (authUser) => {
    setUser(authUser);
    setIsLoggedIn(true);
    window.location.hash = '#dashboard';
  };

  const handleSignOut = () => {
    setUser(null);
    setIsLoggedIn(false);
    window.location.hash = '';
  };

  // Admin view (separate layout)
  if (currentView === 'admin') {
    return (
      <AdminPanel
        onBack={() => {
          window.location.hash = '';
        }}
      />
    );
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Dynamic Animated Particle Canvas Background (Rendered on all views!) */}
      <BackgroundCanvas />

      {/* Conditionally Render Content based on hash route */}
      {currentView === 'auth' && (
        <Auth
          onBack={() => {
            window.location.hash = '';
          }}
          onAuthSuccess={handleAuthSuccess}
        />
      )}

      {currentView === 'dashboard' && (
        <Dashboard
          user={user}
          onSignOut={handleSignOut}
        />
      )}

      {currentView === 'main' && (
        <>
          {/* Navigation */}
          <Navbar
            isLoggedIn={isLoggedIn}
            onAuthClick={() => {
              window.location.hash = '#auth';
            }}
            onDashboardClick={() => {
              window.location.hash = '#dashboard';
            }}
          />

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
            isLoggedIn={isLoggedIn}
            onAuthClick={() => {
              window.location.hash = '#auth';
            }}
            onDashboardClick={() => {
              window.location.hash = '#dashboard';
            }}
          />
        </>
      )}

      {/* System Status Modal */}
      <SystemStatusModal
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

// Simple fallback naming map to match original component name exports
function SystemStatusModal(props) {
  return <StatusModal {...props} />;
}
