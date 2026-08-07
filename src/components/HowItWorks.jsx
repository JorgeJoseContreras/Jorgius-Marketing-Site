import React, { useState } from 'react';
import TiltCard from './TiltCard';
import { Send, CheckCircle } from 'lucide-react';

export default function HowItWorks() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    // Simulate phone activation
    setSubmitted(true);
  };

  return (
    <section id="signup" style={{ padding: '40px 20px', maxWidth: '600px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
      <TiltCard maxTilt={4}>
        <div style={{ padding: '30px 24px', textAlign: 'center' }}>
          {!submitted ? (
            <>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>
                Activate Jorgius
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px', lineHeight: '1.4' }}>
                Enter your phone number below. You will receive an activation text message from Jorgius instantly.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="form-input"
                  style={{ textAlign: 'center', fontSize: '1.1rem', letterSpacing: '0.05em' }}
                  required
                />
                <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  <Send size={16} />
                  <span>Start Texting Jorgius</span>
                </button>
              </form>
            </>
          ) : (
            <div style={{ padding: '10px 0' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', marginBottom: '14px' }}>
                <CheckCircle size={24} color="#ffffff" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '6px' }}>Check your Messages!</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.4' }}>
                Activation code sent to <strong style={{ color: '#fff' }}>{phoneNumber}</strong>. Reply to the message to start using your assistant.
              </p>
            </div>
          )}
        </div>
      </TiltCard>
    </section>
  );
}
