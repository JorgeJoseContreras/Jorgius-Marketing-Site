import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import TiltCard from './TiltCard';
import { LogOut, Save, Loader2, CheckCircle2, AlertCircle, Phone, Sparkles, Shield, User } from 'lucide-react';

const getWeb3FormsKey = () => atob("N2FhNTQxMzMtYWMzMS00MTY3LWI3N2YtY2MzOGRkNzNhMjIw");

const formatPhoneNumber = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export default function Dashboard({ user, onSignOut }) {
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [plan, setPlan] = useState('demo');
  
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (user) {
      const meta = user.user_metadata || {};
      setUsername(meta.username || user.email.split('@')[0]);
      setPhoneNumber(formatPhoneNumber(meta.phone_number || ''));
      setPlan(meta.plan || 'demo');
    }
  }, [user]);

  const handleSavePhone = async (e) => {
    e.preventDefault();
    const rawDigits = phoneNumber.replace(/\D/g, '');

    if (rawDigits.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // Update User Metadata in Supabase Auth
      const { data, error } = await supabase.auth.updateUser({
        data: {
          phone_number: rawDigits,
          plan: plan,
        },
      });

      if (error) throw error;

      // Submit notification email to owner via Web3Forms
      const payloadSubject = `Jorgius Profile Update: ${user.email}`;
      await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: getWeb3FormsKey(),
          subject: payloadSubject,
          from_name: 'Jorgius Dashboard',
          email: user.email,
          message: `User Profile Updated:\nEmail: ${user.email}\nUsername: ${username}\nPhone Number: ${phoneNumber}\nPlan: ${plan.toUpperCase()}`,
        }),
      });

      setSuccessMsg('Phone number updated successfully! Jorgius will sync configurations.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update phone number.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    if (onSignOut) onSignOut();
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050608', color: '#fff', padding: '60px 20px', position: 'relative', zIndex: 10 }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        
        {/* Top Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '36px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>Jorgius</span>
              <span style={{ fontSize: '0.65rem', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', padding: '2px 6px', borderRadius: '4px', color: 'var(--text-secondary)' }}>User Dashboard</span>
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>
              Welcome back, {username}!
            </h1>
          </div>

          <button onClick={handleSignOut} className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.82rem', gap: '6px' }}>
            <LogOut size={13} /> Log Out
          </button>
        </div>

        {successMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '10px', color: '#4ade80', fontSize: '0.85rem', marginBottom: '24px' }}>
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', color: '#f87171', fontSize: '0.85rem', marginBottom: '24px' }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
          {/* Main Account Settings Card */}
          <TiltCard maxTilt={3}>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
                <Phone size={16} color="#ffffff" />
                <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>iMessage Activation Settings</h2>
              </div>

              <form onSubmit={handleSavePhone} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Linked Email
                  </label>
                  <input
                    type="text"
                    value={user?.email || ''}
                    disabled
                    className="form-input"
                    style={{ width: '100%', opacity: 0.6, cursor: 'not-allowed' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Active iMessage Phone Number
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.92rem', color: 'var(--text-secondary)' }}>📱</span>
                    <input
                      type="tel"
                      placeholder="(555) 000-0000"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(formatPhoneNumber(e.target.value));
                        setErrorMsg('');
                      }}
                      className="form-input"
                      style={{ width: '100%', paddingLeft: '40px', fontSize: '1rem' }}
                      maxLength={14}
                      required
                    />
                  </div>
                  <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Jorgius will use this number to link your commands inside your native iMessage chat.
                  </span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Selected Plan Tier
                  </label>
                  <select
                    value={plan}
                    onChange={(e) => setPlan(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', userSelect: 'auto' }}
                  >
                    <option value="demo">Free Demo Plan</option>
                    <option value="pro">Pro Unlimited Plan ($4.99/mo)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button type="submit" className="btn-primary" disabled={loading} style={{ fontSize: '0.85rem' }}>
                    {loading ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /> Save Configuration</>}
                  </button>
                </div>
              </form>
            </div>
          </TiltCard>

          {/* Quick Actions / Integration Card */}
          <TiltCard maxTilt={3}>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
                <Sparkles size={16} color="#ffffff" />
                <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Active Account Privileges</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Usage Limit</span>
                  <strong style={{ color: '#fff' }}>{plan === 'pro' ? 'Unlimited iMessage Queries' : '10 Message Demo Cap'}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Priority Access</span>
                  <strong style={{ color: '#fff' }}>{plan === 'pro' ? 'Sub-300ms Priority' : 'Standard Queue'}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Status Logs</span>
                  <strong style={{ color: '#fff' }}>Connected & Operational</strong>
                </div>
              </div>
            </div>
          </TiltCard>
        </div>

      </div>
    </div>
  );
}
