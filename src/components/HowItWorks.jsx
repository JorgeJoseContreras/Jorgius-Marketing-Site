import React, { useState } from 'react';
import TiltCard from './TiltCard';
import { Send, CheckCircle, Loader2, Zap, MessageSquare } from 'lucide-react';

const getWeb3FormsKey = () => atob("N2FhNTQxMzMtYWMzMS00MTY3LWI3N2YtY2MzOGRkNzNhMjIw");

export default function HowItWorks({ planMode = 'demo', onPlanChange }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const isPro = planMode === 'pro';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber.trim() || loading) return;

    setLoading(true);

    const payloadSubject = isPro ? `Jorgius Pro: ${phoneNumber}` : `Jorgius Demo: ${phoneNumber}`;

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: getWeb3FormsKey(),
          subject: payloadSubject,
          from_name: 'Jorgius Website',
          phone: phoneNumber,
          message: payloadSubject,
        }),
      });

      const result = await response.json();
      if (result.success) {
        console.log("Web3Forms notification sent successfully.");
      }
    } catch (err) {
      console.error("Web3Forms Submission Error:", err);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <section id="signup" style={{ padding: '50px 20px', maxWidth: '620px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
      <TiltCard maxTilt={4}>
        <div style={{ padding: '32px 24px', textAlign: 'center' }}>
          
          {/* Top Segmented Mode Switcher */}
          <div
            style={{
              display: 'inline-flex',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '4px',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              marginBottom: '24px',
              gap: '4px',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                if (onPlanChange) onPlanChange('demo');
              }}
              style={{
                padding: '6px 16px',
                borderRadius: '9999px',
                border: 'none',
                background: !isPro ? '#ffffff' : 'transparent',
                color: !isPro ? '#07080a' : 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <MessageSquare size={13} />
              <span>Demo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                if (onPlanChange) onPlanChange('pro');
              }}
              style={{
                padding: '6px 16px',
                borderRadius: '9999px',
                border: 'none',
                background: isPro ? '#ffffff' : 'transparent',
                color: isPro ? '#07080a' : 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Zap size={13} />
              <span>Pro</span>
            </button>
          </div>

          {!submitted ? (
            <>
              {/* Dynamic Title */}
              <h2 style={{ fontSize: '1.45rem', fontWeight: '800', fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>
                {isPro ? 'Activate Jorgius Pro' : 'Activate Jorgius Demo'}
              </h2>

              {/* Dynamic Subtitle */}
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '22px', lineHeight: '1.45' }}>
                {isPro
                  ? 'Enter your phone number below. Jorgius will send you a text message with a secure payment link to complete setup.'
                  : 'Enter your phone number below. You will receive an activation text message from Jorgius instantly. You can upgrade to Pro at any time by asking Jorgius.'}
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
                <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={16} />
                      <span>{isPro ? 'Get Jorgius Pro Link' : 'Start Texting Jorgius'}</span>
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div style={{ padding: '10px 0' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', marginBottom: '14px' }}>
                <CheckCircle size={24} color="#ffffff" />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '6px' }}>
                {isPro ? 'Payment Link Sent!' : 'Check your Messages!'}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.4' }}>
                {isPro
                  ? `Jorgius sent a payment setup text to `
                  : `Activation code sent to `}
                <strong style={{ color: '#fff' }}>{phoneNumber}</strong>. Reply to start using your assistant.
              </p>
            </div>
          )}
        </div>
      </TiltCard>
    </section>
  );
}
