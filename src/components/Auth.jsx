import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import TiltCard from './TiltCard';
import { Mail, Lock, User, Loader2, AlertCircle, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Auth({ onBack, onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setInfoMsg('');

    try {
      if (isSignUp) {
        // Sign Up Flow
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username || email.split('@')[0],
              phone_number: '',
              plan: 'demo',
            },
          },
        });

        if (error) throw error;

        if (data?.user?.identities?.length === 0) {
          // User already exists
          setErrorMsg('An account with this email already exists. Try logging in.');
        } else {
          setInfoMsg('Account created successfully! Welcome to Jorgius.');
          setTimeout(() => {
            if (onAuthSuccess) onAuthSuccess(data.user);
          }, 1500);
        }
      } else {
        // Log In Flow
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (onAuthSuccess) onAuthSuccess(data.user);
      }
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('504') || msg.includes('timeout') || err.status === 504) {
        setErrorMsg('Email server timed out (504). Please turn off "Confirm Email" in Supabase Dashboard -> Auth -> Providers -> Email.');
      } else {
        setErrorMsg(msg || 'Authentication failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', background: '#050608', position: 'relative', zIndex: 10 }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        
        {/* Back Button */}
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '20px',
          }}
        >
          <ArrowLeft size={14} /> Back to Landing Page
        </button>

        <TiltCard maxTilt={4}>
          <div style={{ padding: '32px 24px' }}>
            
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '12px' }}>
                <ShieldCheck size={24} color="#ffffff" />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
                {isSignUp ? 'Create your Account' : 'Log In to Jorgius'}
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '4px' }}>
                {isSignUp ? 'Get started with your personal iMessage assistant' : 'Access your dashboard and configurations'}
              </p>
            </div>

            {/* Error / Success Alerts */}
            {errorMsg && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171', fontSize: '0.8rem', marginBottom: '16px' }}>
                <AlertCircle size={14} style={{ flexShrink: 0 }} />
                <span>{errorMsg}</span>
              </div>
            )}

            {infoMsg && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '8px', color: '#4ade80', fontSize: '0.8rem', marginBottom: '16px' }}>
                <ShieldCheck size={14} style={{ flexShrink: 0 }} />
                <span>{infoMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {isSignUp && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                    Username
                  </label>
                  <div style={{ position: 'relative' }}>
                    <User size={14} color="#86868b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="jorgius_fan"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="form-input"
                      style={{ width: '100%', paddingLeft: '36px' }}
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={14} color="#86868b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '36px' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={14} color="#86868b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', paddingLeft: '36px' }}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: '6px' }}>
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <span>{isSignUp ? 'Create Account' : 'Log In'}</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            {/* Form Toggle */}
            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {isSignUp ? 'Already have an account?' : "Don't have an account yet?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setErrorMsg('');
                  setInfoMsg('');
                }}
                style={{ background: 'none', border: 'none', color: '#fff', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {isSignUp ? 'Log In' : 'Sign Up'}
              </button>
            </div>

          </div>
        </TiltCard>

      </div>
    </div>
  );
}
