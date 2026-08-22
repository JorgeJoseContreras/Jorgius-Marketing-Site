import React, { useState } from 'react';
import TiltCard from './TiltCard';
import { Send, CheckCircle, Loader2, Zap, Crown, MessageSquare, AlertCircle } from 'lucide-react';


const getWeb3FormsKey = () => atob("N2FhNTQxMzMtYWMzMS00MTY3LWI3N2YtY2MzOGRkNzNhMjIw");

// Format digits as (XXX) XXX-XXXX
const formatPhoneNumber = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export default function HowItWorks({ planMode = 'demo', onPlanChange }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const isDemo = planMode === 'demo';
  const isPro = planMode === 'pro';
  const isUltra = planMode === 'ultra';

  const handlePhoneInput = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rawDigits = phoneNumber.replace(/\D/g, '');

    if (rawDigits.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const planLabel = isUltra ? 'Ultra' : isPro ? 'Pro' : 'Demo';
    const payloadSubject = `Jorgius ${planLabel}: ${phoneNumber}`;

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
          
          {/* Top Segmented Mode Switcher with Smooth Animated Sliding Pill */}
          <div
            style={{
              position: 'relative',
              display: 'inline-flex',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '4px',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              marginBottom: '24px',
              width: '290px',
            }}
          >
            {/* Sliding Pill Background Indicator */}
            <div
              style={{
                position: 'absolute',
                top: '4px',
                bottom: '4px',
                left: isDemo ? '4px' : isPro ? 'calc(33.3% + 2px)' : 'calc(66.6% + 2px)',
                width: 'calc(33.3% - 6px)',
                background: '#ffffff',
                borderRadius: '9999px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                zIndex: 1,
              }}
            />

            {/* Demo Button */}
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setErrorMsg('');
                if (onPlanChange) onPlanChange('demo');
              }}
              style={{
                position: 'relative',
                zIndex: 2,
                flex: 1,
                padding: '6px 12px',
                borderRadius: '9999px',
                border: 'none',
                background: 'transparent',
                color: isDemo ? '#07080a' : 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <MessageSquare size={13} color={isDemo ? '#07080a' : 'var(--text-secondary)'} />
              <span>Demo</span>
            </button>

            {/* Pro Button */}
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setErrorMsg('');
                if (onPlanChange) onPlanChange('pro');
              }}
              style={{
                position: 'relative',
                zIndex: 2,
                flex: 1,
                padding: '6px 12px',
                borderRadius: '9999px',
                border: 'none',
                background: 'transparent',
                color: isPro ? '#07080a' : 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Zap size={13} color={isPro ? '#07080a' : 'var(--text-secondary)'} />
              <span>Pro</span>
            </button>

            {/* Ultra Button */}
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setErrorMsg('');
                if (onPlanChange) onPlanChange('ultra');
              }}
              style={{
                position: 'relative',
                zIndex: 2,
                flex: 1,
                padding: '6px 12px',
                borderRadius: '9999px',
                border: 'none',
                background: 'transparent',
                color: isUltra ? '#07080a' : 'var(--text-secondary)',
                fontWeight: '700',
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <Crown size={13} color={isUltra ? '#07080a' : 'var(--text-secondary)'} />
              <span>Ultra</span>
            </button>
          </div>

          {!submitted ? (
            <>
              {/* Dynamic Title */}
              <h2 style={{ fontSize: '1.45rem', fontWeight: '800', fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>
                {isUltra ? 'Activate Jorgius Ultra' : isPro ? 'Activate Jorgius Pro' : 'Activate Jorgius Demo'}
              </h2>

              {/* Dynamic Subtitle */}
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '22px', lineHeight: '1.45' }}>
                {isUltra
                  ? 'Enter your phone number below. Jorgius will send you a text message with a secure payment link to complete Ultra setup.'
                  : isPro
                  ? 'Enter your phone number below. Jorgius will send you a text message with a secure payment link to complete Pro setup.'
                  : 'Enter your phone number below. You will receive an activation text message from Jorgius instantly. You can upgrade to Pro at any time by asking Jorgius.'}
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                  type="tel"
                  placeholder="555-000-0000"
                  value={phoneNumber}
                  onChange={handlePhoneInput}
                  className="form-input"
                  style={{ textAlign: 'center', fontSize: '1.1rem', letterSpacing: '0.05em' }}
                  maxLength={14}
                  required
                />

                {errorMsg && (
                  <div style={{ color: '#ef4444', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    <AlertCircle size={14} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      <Send size={16} />
                      <span>{isUltra ? 'Get Jorgius Ultra Link' : isPro ? 'Get Jorgius Pro Link' : 'Start Texting Jorgius'}</span>
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
                {isDemo ? 'You\'re All Set!' : 'Payment Link Sent!'}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.45' }}>
                Jorgius will reach out shortly to <strong style={{ color: '#fff' }}>{phoneNumber}</strong>.
              </p>
            </div>
          )}
        </div>
      </TiltCard>
    </section>
  );
}

