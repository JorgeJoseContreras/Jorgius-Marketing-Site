import React, { useState, useEffect } from 'react';
import { supabase, supabaseAdmin } from '../utils/supabaseClient';
import TiltCard from './TiltCard';
import { LogOut, Save, Loader2, CheckCircle2, AlertCircle, Phone, Sparkles, Shield, User, Settings, HelpCircle, MessageSquare, Edit2, Users } from 'lucide-react';

const getWeb3FormsKey = () => atob("N2FhNTQxMzMtYWMzMS00MTY3LWI3N2YtY2MzOGRkNzNhMjIw");
const getHelpWeb3FormsKey = () => "6e12e079-3a7a-4550-9962-abca5fe691c9";

const formatPhoneNumber = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export default function Dashboard({ user, onSignOut }) {
  // Sidebar tab state: 'settings' | 'interactions' | 'users'
  const [activeTab, setActiveTab] = useState('settings');

  // Profile fields
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [plan, setPlan] = useState('demo');

  // Interactions fields
  const [knownName, setKnownName] = useState('');
  const [assistantName, setAssistantName] = useState('');
  
  // Help Form fields
  const [helpMsg, setHelpMsg] = useState('');
  
  // Admin View Users list
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); // User to edit
  const [editPlan, setEditPlan] = useState('demo');
  const [editPhone, setEditPhone] = useState('');
  const [editUsername, setEditUsername] = useState('');

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const isAdmin = user?.email === 'aghlc.nm@gmail.com';

  useEffect(() => {
    if (user) {
      const meta = user.user_metadata || {};
      
      // Retroactive action defaults for Admin account
      if (isAdmin) {
        setUsername(meta.username || 'Admin');
        setPhoneNumber(formatPhoneNumber(meta.phone_number || '9549997574'));
        setPlan(meta.plan || 'pro');
      } else {
        setUsername(meta.username || user.email.split('@')[0]);
        setPhoneNumber(formatPhoneNumber(meta.phone_number || ''));
        setPlan(meta.plan || 'demo');
      }

      setKnownName(meta.known_name || '');
      setAssistantName(meta.assistant_name || 'Jorgius');
    }
  }, [user, isAdmin]);

  // Load users list for Admin
  const fetchAllUsers = async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers();
      if (error) throw error;
      setAllUsers(data?.users || []);
    } catch (err) {
      setErrorMsg('Failed to load users: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'users' && isAdmin) {
      fetchAllUsers();
    }
  }, [activeTab]);

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
      const { error } = await supabase.auth.updateUser({
        data: {
          phone_number: rawDigits,
          plan: plan,
          username: username,
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

      setSuccessMsg('Account settings updated successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update account.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveInteractions = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          known_name: knownName,
          assistant_name: assistantName,
        },
      });

      if (error) throw error;

      setSuccessMsg('Interactions configuration saved successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save interactions.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendHelp = async (e) => {
    e.preventDefault();
    if (!helpMsg.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: getHelpWeb3FormsKey(),
          subject: `Jorgius Help Ticket: ${user.email}`,
          from_name: username,
          email: user.email,
          message: helpMsg,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSuccessMsg('Help message sent successfully! We will reach out to you shortly.');
        setHelpMsg('');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        throw new Error('Web3Forms message failed.');
      }
    } catch (err) {
      setErrorMsg('Failed to send help ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    if (onSignOut) onSignOut();
  };

  // Admin edit action
  const handleEditUserClick = (u) => {
    setSelectedUser(u);
    const meta = u.user_metadata || {};
    setEditPlan(meta.plan || 'demo');
    setEditPhone(formatPhoneNumber(meta.phone_number || ''));
    setEditUsername(meta.username || u.email.split('@')[0]);
  };

  const handleSaveUserEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const rawDigits = editPhone.replace(/\D/g, '');
      const { error } = await supabaseAdmin.auth.admin.updateUserById(selectedUser.id, {
        user_metadata: {
          ...selectedUser.user_metadata,
          plan: editPlan,
          phone_number: rawDigits,
          username: editUsername,
        },
      });

      if (error) throw error;

      setSuccessMsg(`User ${selectedUser.email} updated successfully.`);
      setSelectedUser(null);
      fetchAllUsers();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg('Failed to update user: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050608', color: '#fff', display: 'flex' }}>
      
      {/* SIDEBAR */}
      <aside
        style={{
          width: '240px',
          background: 'rgba(10, 11, 15, 0.95)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '40px 20px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flexShrink: 0,
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>Jorgius</span>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => {
                setActiveTab('settings');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'settings' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                color: activeTab === 'settings' ? '#fff' : 'var(--text-secondary)',
                fontWeight: activeTab === 'settings' ? '700' : '500',
                fontSize: '0.85rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              <Settings size={16} />
              <span>Settings</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('interactions');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '10px 12px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'interactions' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                color: activeTab === 'interactions' ? '#fff' : 'var(--text-secondary)',
                fontWeight: activeTab === 'interactions' ? '700' : '500',
                fontSize: '0.85rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              <MessageSquare size={16} />
              <span>Interactions</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => {
                  setActiveTab('users');
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: activeTab === 'users' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  color: activeTab === 'users' ? '#fff' : 'var(--text-secondary)',
                  fontWeight: activeTab === 'users' ? '700' : '500',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
              >
                <Users size={16} />
                <span>View Users</span>
              </button>
            )}
          </nav>
        </div>

        <button
          onClick={handleSignOut}
          className="btn-secondary"
          style={{ width: '100%', padding: '10px', fontSize: '0.82rem', gap: '8px' }}
        >
          <LogOut size={14} /> Log Out
        </button>
      </aside>

      {/* MAIN VIEW AREA */}
      <main style={{ flex: 1, padding: '40px', position: 'relative', zIndex: 10, overflowY: 'auto' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Account Portal
              </span>
              <h2 style={{ fontSize: '1.45rem', fontWeight: '800', color: '#fff', fontFamily: 'var(--font-heading)' }}>
                {activeTab === 'settings' && 'Account Settings'}
                {activeTab === 'interactions' && 'Jorgius Interactions'}
                {activeTab === 'users' && 'Admin User Management'}
              </h2>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Logged in as <strong style={{ color: '#fff' }}>{user?.email}</strong>
            </div>
          </div>

          {/* Success / Error Banners */}
          {successMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', borderRadius: '10px', color: '#4ade80', fontSize: '0.85rem', marginBottom: '20px' }}>
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '10px', color: '#f87171', fontSize: '0.85rem', marginBottom: '20px' }}>
              <AlertCircle size={16} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: SETTINGS */}
          {activeTab === 'settings' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {/* Form configuration */}
                <TiltCard maxTilt={3}>
                  <div style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                      Profile Configurations
                    </h3>
                    
                    <form onSubmit={handleSavePhone} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                          Username
                        </label>
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="form-input"
                          style={{ width: '100%' }}
                          required
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                          Active iMessage Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="(555) 000-0000"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                          className="form-input"
                          style={{ width: '100%', fontSize: '1rem' }}
                          maxLength={14}
                          required
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                          Subscription Plan
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

                      <button type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: 'flex-end', fontSize: '0.85rem' }}>
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /> Save Profile</>}
                      </button>
                    </form>
                  </div>
                </TiltCard>

                {/* Privileges Card */}
                <TiltCard maxTilt={3}>
                  <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                        Access Privileges
                      </h3>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Privilege Level</span>
                          <strong style={{ color: '#fff' }}>{isAdmin ? 'View all users' : plan === 'pro' ? 'Unlimited Pro Access' : 'Demo Mode'}</strong>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Support Priority</span>
                          <strong style={{ color: '#fff' }}>{plan === 'pro' ? 'Instant Priority' : 'Standard'}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Subtitle for Demo users */}
                    {plan === 'demo' && (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.1)', marginTop: '16px' }}>
                        💡 If you subscribed to Pro mode, your privileges should update soon.
                      </div>
                    )}
                  </div>
                </TiltCard>
              </div>

              {/* View Users Tile Button (Only for Admin, inside settings/overview as well) */}
              {isAdmin && (
                <button
                  onClick={() => setActiveTab('users')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                    padding: '20px 24px',
                    borderRadius: '16px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    color: '#fff',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <Users size={24} color="#ffffff" />
                    <div>
                      <strong style={{ display: 'block', fontSize: '1rem' }}>View Registered Users</strong>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Modify plan roles, phone numbers, and user metadata.</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', background: '#fff', color: '#000', padding: '6px 14px', borderRadius: '8px', fontWeight: '700' }}>Manage Users</span>
                </button>
              )}
            </div>
          )}

          {/* TAB 2: INTERACTIONS */}
          {activeTab === 'interactions' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                
                {/* Custom Names Setup */}
                <TiltCard maxTilt={3}>
                  <div style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                      Rename Configurations
                    </h3>

                    <form onSubmit={handleSaveInteractions} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                          What Jorgius calls you (Known Name)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Master, Boss, Chief"
                          value={knownName}
                          onChange={(e) => setKnownName(e.target.value)}
                          className="form-input"
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                          Jorgius' Name (Customize Assistant Name)
                        </label>
                        <input
                          type="text"
                          placeholder="Jorgius"
                          value={assistantName}
                          onChange={(e) => setAssistantName(e.target.value)}
                          className="form-input"
                          style={{ width: '100%' }}
                        />
                      </div>

                      <button type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: 'flex-end', fontSize: '0.85rem' }}>
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /> Save Names</>}
                      </button>
                    </form>
                  </div>
                </TiltCard>

                {/* Help Form */}
                <TiltCard maxTilt={3}>
                  <div style={{ padding: '24px' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                      Help & Support
                    </h3>

                    <form onSubmit={handleSendHelp} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <textarea
                        placeholder="Need help or found a bug? Type your support message here..."
                        value={helpMsg}
                        onChange={(e) => setHelpMsg(e.target.value)}
                        className="form-input"
                        rows={5}
                        style={{ width: '100%', resize: 'none' }}
                        required
                      />

                      <button type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: 'flex-end', fontSize: '0.85rem' }}>
                        {loading ? <Loader2 size={14} className="animate-spin" /> : 'Send Help Ticket'}
                      </button>
                    </form>
                  </div>
                </TiltCard>

              </div>
            </div>
          )}

          {/* TAB 3: ADMIN VIEW USERS */}
          {activeTab === 'users' && isAdmin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* User Edit Modal Overlay */}
              {selectedUser && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
                  <div style={{ width: '100%', maxWidth: '440px', background: '#0e1017', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', padding: '24px' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '14px', color: '#fff' }}>
                      Edit User Profile
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
                      Modifying settings for <strong style={{ color: '#fff' }}>{selectedUser.email}</strong>
                    </p>

                    <form onSubmit={handleSaveUserEdit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                          Username
                        </label>
                        <input
                          type="text"
                          value={editUsername}
                          onChange={(e) => setEditUsername(e.target.value)}
                          className="form-input"
                          style={{ width: '100%' }}
                          required
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={editPhone}
                          onChange={(e) => setEditPhone(formatPhoneNumber(e.target.value))}
                          className="form-input"
                          style={{ width: '100%' }}
                          maxLength={14}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                          Plan Role
                        </label>
                        <select
                          value={editPlan}
                          onChange={(e) => setEditPlan(e.target.value)}
                          className="form-input"
                          style={{ width: '100%', userSelect: 'auto' }}
                        >
                          <option value="demo">Demo Plan</option>
                          <option value="pro">Pro Plan</option>
                        </select>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <button type="button" onClick={() => setSelectedUser(null)} className="btn-secondary" style={{ fontSize: '0.82rem' }}>
                          Cancel
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading} style={{ fontSize: '0.82rem' }}>
                          {loading ? <Loader2 size={14} className="animate-spin" /> : 'Save Changes'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Users Grid Table */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>User Profiles Logs ({allUsers.length})</span>
                  <button onClick={fetchAllUsers} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                    Refresh
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                        <th style={{ padding: '12px 20px' }}>Email</th>
                        <th style={{ padding: '12px 20px' }}>Username</th>
                        <th style={{ padding: '12px 20px' }}>Phone Number</th>
                        <th style={{ padding: '12px 20px' }}>Plan</th>
                        <th style={{ padding: '12px 20px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers.map((u) => {
                        const meta = u.user_metadata || {};
                        return (
                          <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s ease' }} className="hover-row">
                            <td style={{ padding: '12px 20px', fontWeight: '500', color: '#fff' }}>{u.email}</td>
                            <td style={{ padding: '12px 20px', color: 'var(--text-secondary)' }}>{meta.username || '-'}</td>
                            <td style={{ padding: '12px 20px', color: 'var(--text-secondary)' }}>
                              {meta.phone_number ? formatPhoneNumber(meta.phone_number) : '-'}
                            </td>
                            <td style={{ padding: '12px 20px' }}>
                              <span style={{
                                fontSize: '0.7rem',
                                fontWeight: '700',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                background: meta.plan === 'pro' ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
                                border: meta.plan === 'pro' ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.05)',
                                color: '#fff',
                                textTransform: 'uppercase'
                              }}>
                                {meta.plan || 'demo'}
                              </span>
                            </td>
                            <td style={{ padding: '12px 20px', textAlign: 'right' }}>
                              <button
                                onClick={() => handleEditUserClick(u)}
                                className="btn-secondary"
                                style={{ padding: '4px 10px', fontSize: '0.75rem', gap: '4px' }}
                              >
                                <Edit2 size={11} /> Edit
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

    </div>
  );
}
