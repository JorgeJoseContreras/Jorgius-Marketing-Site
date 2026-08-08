import React, { useState, useEffect } from 'react';
import { supabase, supabaseAdmin } from '../utils/supabaseClient';
import { createStripeCheckoutSession } from '../utils/stripeClient';
import TiltCard from './TiltCard';
import { LogOut, Save, Loader2, CheckCircle2, AlertCircle, Phone, Sparkles, Shield, User, Settings, HelpCircle, MessageSquare, Edit2, Users, CreditCard, Zap, XCircle, Send } from 'lucide-react';

const getWeb3FormsKey = () => atob("N2FhNTQxMzMtYWMzMS00MTY3LWI3N2YtY2MzOGRkNzNhMjIw");
const getHelpWeb3FormsKey = () => "6e12e079-3a7a-4550-9962-abca5fe691c9";

const formatPhoneNumber = (value) => {
  let digits = (value || '').replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('1')) {
    digits = digits.slice(1);
  }
  digits = digits.slice(0, 10);
  if (digits.length === 0) return '';
  if (digits.length <= 3) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};


export default function Dashboard({ user, onSignOut }) {
  // Sidebar tab state: 'settings' | 'interactions' | 'subscription' | 'users'
  const [activeTab, setActiveTab] = useState('settings');

  // Profile fields
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [plan, setPlan] = useState('demo');

  // Interactions fields
  const [knownName, setKnownName] = useState('');
  const [assistantName, setAssistantName] = useState('');
  const [assistantStyle, setAssistantStyle] = useState('default');
  
  // Help Form fields
  const [helpMsg, setHelpMsg] = useState('');

  // Admin Direct Messaging
  const [adminMsgPhone, setAdminMsgPhone] = useState('');
  const [adminCustomPhone, setAdminCustomPhone] = useState('');
  const [adminMsgText, setAdminMsgText] = useState('');
  const [adminSending, setAdminSending] = useState(false);
  
  // Checkout & Cancel Modals
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

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
      
      // Retroactive action defaults for Admin and VIP Pro accounts (Justin 9546816129)
      const userPhoneDigits = (meta.phone_number || '').replace(/\D/g, '');
      const isJustin = userPhoneDigits.includes('9546816129');

      if (isAdmin || isJustin) {
        setUsername(meta.username || (isAdmin ? 'Admin' : 'Justin'));
        setPhoneNumber(formatPhoneNumber(meta.phone_number || (isAdmin ? '9549997574' : '9546816129')));
        setPlan('pro');
        // Auto-upgrade Supabase user metadata if not already set to pro
        if (meta.plan !== 'pro') {
          supabase.auth.updateUser({ data: { plan: 'pro', known_name: 'Justin' } });
        }
      } else {
        setUsername(meta.username || user.email.split('@')[0]);
        setPhoneNumber(formatPhoneNumber(meta.phone_number || ''));
        setPlan(meta.plan || 'demo');
      }

      setKnownName(meta.known_name || (isJustin ? 'Justin' : ''));
      setAssistantName(meta.assistant_name || 'Jorgius');
      setAssistantStyle(meta.assistant_style || 'default');



      // Auto-detect returning from Stripe payment upgrade redirect
      if (window.location.search.includes('upgraded=true') || window.location.hash.includes('upgraded=true')) {
        activateProPlan();
      }
    }
  }, [user, isAdmin]);

  const activateProPlan = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { plan: 'pro' }
      });
      if (error) throw error;
      setPlan('pro');
      setSuccessMsg('🎉 Stripe payment successful! Your Pro Membership is now active.');

      // Send instant owner notification email via Web3Forms
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: getWeb3FormsKey(),
          subject: `🎉 NEW PRO SUBSCRIBER: ${user.email}`,
          from_name: 'Jorgius Billing',
          email: user.email,
          message: `NEW PRO SUBSCRIPTION CONFIRMED!\n\nUser Email: ${user.email}\nUsername: ${user.user_metadata?.username || 'N/A'}\nPhone Number: ${user.user_metadata?.phone_number || 'N/A'}\nPlan: PRO ($4.99/mo)`,
        }),
      });

      // Clean URL hash
      if (window.location.hash.includes('upgraded=true')) {
        window.location.hash = '#dashboard';
      }
      setTimeout(() => setSuccessMsg(''), 6000);
    } catch (err) {
      setErrorMsg('Failed to activate Pro plan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load users list for Admin (both Supabase Auth and Database AllowedUsers)
  const fetchAllUsers = async () => {
    if (!isAdmin) return;
    setLoading(true);
    try {
      // 1. Fetch Supabase Auth users
      const { data: subData } = await supabaseAdmin.auth.admin.listUsers();
      const supUsers = subData?.users || [];

      // 2. Fetch Database AllowedUsers (includes Justin 9546816129 and DB roster)
      let dbUsers = [];
      try {
        const res = await fetch('https://notification-assistant.onrender.com/api/admin/users');
        const dbJson = await res.json();
        if (dbJson.ok && dbJson.users) {
          dbUsers = dbJson.users;
        }
      } catch (dbErr) {
        console.warn('Error fetching DB users:', dbErr);
      }

      // Combine Supabase Auth + Database users into a unified list
      const combined = [...supUsers];
      
      dbUsers.forEach((dbu) => {
        const dbuPhone = dbu.phone_number?.replace(/\D/g, '') || '';
        const exists = combined.some((u) => {
          const uPhone = (u.user_metadata?.phone_number || '').replace(/\D/g, '');
          return uPhone && dbuPhone && uPhone.slice(-10) === dbuPhone.slice(-10);
        });

        if (!exists) {
          combined.push({
            id: 'db-' + (dbu.phone_number || dbu.name),
            email: dbu.phone_number,
            user_metadata: {
              username: dbu.name || dbu.known_name || 'Authorized User',
              phone_number: dbu.phone_number,
              plan: dbu.plan || (dbuPhone.includes('9546816129') ? 'pro' : 'demo')
            }
          });
        }
      });


      setAllUsers(combined);
    } catch (err) {
      setErrorMsg('Failed to load users: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAllUsers();
    }
  }, [isAdmin, activeTab]);


  const handleDeleteUser = async (u) => {
    const targetVal = u.user_metadata?.phone_number || u.email;
    const nameLabel = u.user_metadata?.username || u.email;
    if (!window.confirm(`Are you sure you want to delete user '${nameLabel}' silently? (No text or notification will be sent)`)) {
      return;
    }
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      if (u.id && !u.id.startsWith('db-')) {
        await supabaseAdmin.auth.admin.deleteUser(u.id);
      }
      await fetch('https://notification-assistant.onrender.com/api/admin/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone_number: targetVal })
      });
      setSuccessMsg(`User '${nameLabel}' deleted silently.`);
      fetchAllUsers();
    } catch (err) {
      setErrorMsg('Failed to delete user: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

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

  const handleAdminSendMessage = async (e) => {
    e.preventDefault();
    setAdminSending(true);
    setErrorMsg('');
    setSuccessMsg('');

    const target = adminCustomPhone.trim() || adminMsgPhone.trim();
    if (!target) {
      setErrorMsg('Please select a user or enter a custom recipient phone number.');
      setAdminSending(false);
      return;
    }
    if (!adminMsgText.trim()) {
      setErrorMsg('Message content cannot be empty.');
      setAdminSending(false);
      return;
    }

    try {
      const res = await fetch('https://notification-assistant.onrender.com/api/admin/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: target,
          message: adminMsgText.trim()
        })
      });
      const data = await res.json();
      if (data.ok) {
        setSuccessMsg(`🚀 Message sent from Jorgius to ${target}!`);
        setAdminMsgText('');
        setAdminCustomPhone('');
      } else {
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (err) {
      setErrorMsg('Admin Message Error: ' + err.message);
    } finally {
      setAdminSending(false);
    }
  };


  const handleLaunchStripeCheckout = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // Create official Stripe checkout session and get hosted URL
      const checkoutUrl = await createStripeCheckoutSession(user?.email);
      // Redirect user directly to Stripe's subscription checkout page
      window.location.href = checkoutUrl;
    } catch (err) {
      setErrorMsg('Stripe Checkout Error: ' + err.message);
      setLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const { error } = await supabase.auth.updateUser({
        data: { plan: 'demo' }
      });
      if (error) throw error;
      setPlan('demo');
      setShowCancelModal(false);
      setSuccessMsg('Your subscription has been canceled. You will not be billed again.');

      // Send owner cancellation notification email via Web3Forms
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: getWeb3FormsKey(),
          subject: `⚠️ SUBSCRIPTION CANCELED: ${user.email}`,
          from_name: 'Jorgius Billing System',
          email: user.email,
          message: `PRO SUBSCRIPTION CANCELED!\n\nUser Email: ${user.email}\nUsername: ${user.user_metadata?.username || 'N/A'}\nPhone Number: ${user.user_metadata?.phone_number || 'N/A'}\nStatus: REVERTED TO DEMO (NO FURTHER BILLING)`,
        }),
      });

      setTimeout(() => setSuccessMsg(''), 6000);
    } catch (err) {
      setErrorMsg('Failed to cancel plan: ' + err.message);
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
          assistant_style: assistantStyle,
        },
      });

      if (error) throw error;

      // Sync with Assistant Bot API & trigger iMessage confirmation text
      const rawDigits = phoneNumber.replace(/\D/g, '') || (isAdmin ? '9549997574' : '');
      const botApiUrl = window.location.hostname.includes('localhost') 
        ? 'http://localhost:10000/api/user/rename-config'
        : 'https://notification-assistant.onrender.com/api/user/rename-config';

      try {
        await fetch(botApiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone_number: rawDigits,
            known_name: knownName,
            assistant_name: assistantName,
            assistant_style: assistantStyle
          }),
        });
      } catch (botErr) {
        console.warn('Bot API Sync Warning:', botErr);
      }


      setSuccessMsg('Interactions configuration saved & synced with Jorgius bot! Check your texts for confirmation.');
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
      const isDbUser = selectedUser.id && selectedUser.id.startsWith('db-');

      if (!isDbUser) {
        const { error } = await supabaseAdmin.auth.admin.updateUserById(selectedUser.id, {
          user_metadata: {
            ...selectedUser.user_metadata,
            plan: editPlan,
            phone_number: rawDigits,
            username: editUsername,
          },
        });
        if (error) throw error;
      }

      // Sync/update database record on backend via /api/admin/update-user
      try {
        await fetch('https://notification-assistant.onrender.com/api/admin/update-user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone_number: rawDigits || selectedUser.email,
            known_name: editUsername,
            plan: editPlan
          })
        });
      } catch (backendErr) {
        console.warn('Backend update warning:', backendErr);
      }

      setSuccessMsg('User profile updated successfully.');
      setSelectedUser(null);
      fetchAllUsers();
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

            <button
              onClick={() => {
                setActiveTab('subscription');
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
                background: activeTab === 'subscription' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                color: activeTab === 'subscription' ? '#fff' : 'var(--text-secondary)',
                fontWeight: activeTab === 'subscription' ? '700' : '500',
                fontSize: '0.85rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s ease',
              }}
            >
              <CreditCard size={16} />
              <span>Manage Subscription</span>
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', alignItems: 'center' }}>
          <button
            onClick={handleSignOut}
            className="btn-secondary"
            style={{ width: '100%', padding: '10px', fontSize: '0.82rem', gap: '8px' }}
          >
            <LogOut size={14} /> Log Out
          </button>
          <a
            href="/"
            style={{
              fontSize: '0.78rem',
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              transition: 'color 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.target.style.color = '#fff'}
            onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
          >
            Back to Home
          </a>
        </div>
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
                {activeTab === 'subscription' && 'Manage Subscription'}
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
                        
                        {/* ONLY Admin can select plan via dropdown. Regular users must subscribe */}
                        {isAdmin ? (
                          <select
                            value={plan}
                            onChange={(e) => setPlan(e.target.value)}
                            className="form-input"
                            style={{ width: '100%', userSelect: 'auto' }}
                          >
                            <option value="demo">Free Demo Plan</option>
                            <option value="pro">Pro Unlimited Plan ($4.99/mo)</option>
                          </select>
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>
                              {plan === 'pro' ? 'Pro Unlimited Plan ($4.99/mo)' : 'Free Demo Plan'}
                            </span>
                            {plan === 'demo' && (
                              <button
                                type="button"
                                onClick={() => setActiveTab('subscription')}
                                className="btn-primary"
                                style={{ padding: '6px 12px', fontSize: '0.78rem' }}
                              >
                                Upgrade to Pro
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      <button type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: 'flex-end', fontSize: '0.85rem', marginTop: '6px' }}>
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

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                          Assistant Talking Style (Personality Mode)
                        </label>
                        <select
                          value={assistantStyle}
                          onChange={(e) => setAssistantStyle(e.target.value)}
                          className="form-input"
                          style={{ width: '100%', userSelect: 'auto', cursor: 'pointer' }}
                        >
                          <option value="default">Default (Normal, Friendly & Direct)</option>
                          <option value="gangster">Gangster Mode (Street-Smart Slang)</option>
                          <option value="short">Keep it Short (Ultra-Concise, Fewest Words)</option>
                          <option value="executive">Executive (Formal & Professional)</option>
                          <option value="genz">Gen Z Mode (Hype & Internet Slang)</option>
                          <option value="sarcastic">Sarcastic (Playfully Witty)</option>
                        </select>

                      </div>

                      <button type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: 'flex-end', fontSize: '0.85rem' }}>
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /> Save Interactions</>}
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

          {/* TAB 3: MANAGE SUBSCRIPTION */}
          {activeTab === 'subscription' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Active Plan Overview Card */}
              <TiltCard maxTilt={2}>
                <div style={{ padding: '28px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Current Subscription Status
                      </span>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {plan === 'ultra' ? 'Ultra Premium Plan' : plan === 'pro' ? 'Pro Membership Plan' : 'Free Demo Plan'}

                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: '700',
                          padding: '3px 10px',
                          borderRadius: '20px',
                          background: (plan === 'pro' || plan === 'ultra') ? 'rgba(34, 197, 94, 0.15)' : 'rgba(255, 255, 255, 0.1)',
                          border: (plan === 'pro' || plan === 'ultra') ? '1px solid rgba(34, 197, 94, 0.4)' : '1px solid rgba(255, 255, 255, 0.2)',
                          color: (plan === 'pro' || plan === 'ultra') ? '#4ade80' : '#fff'
                        }}>
                          {plan === 'ultra' ? 'ACTIVE ($19.99/mo)' : plan === 'pro' ? 'ACTIVE ($4.99/mo)' : 'LIMITED DEMO'}
                        </span>
                      </h3>
                    </div>

                    <div>
                      {plan === 'pro' || plan === 'ultra' ? (
                        <button
                          onClick={() => setShowCancelModal(true)}
                          className="btn-secondary"
                          style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', fontSize: '0.85rem' }}
                        >
                          <XCircle size={14} /> Cancel Membership
                        </button>
                      ) : (
                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => setShowCheckoutModal(true)}
                            className="btn-primary"
                            style={{ fontSize: '0.88rem', padding: '10px 20px', gap: '8px' }}
                          >
                            <Zap size={16} /> Upgrade to Pro ($4.99/mo)
                          </button>
                          <a
                            href="https://buy.stripe.com/5kQ9ATccU5ew4BE9UraVa01"
                            className="btn-primary"
                            style={{
                              fontSize: '0.88rem',
                              padding: '10px 20px',
                              gap: '8px',
                              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                              border: 'none',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Zap size={16} fill="#000" /> Upgrade to Ultra ($19.99/mo)
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block' }}>Billing Cycle</span>
                      <strong style={{ fontSize: '0.92rem', color: '#fff' }}>
                        {plan === 'ultra' ? 'Monthly ($19.99/month)' : plan === 'pro' ? 'Monthly ($4.99/month)' : 'Free Tier'}
                      </strong>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block' }}>iMessage AI Responses</span>
                      <strong style={{ fontSize: '0.92rem', color: '#fff' }}>
                        {plan === 'ultra' || plan === 'pro' ? 'Unlimited Messages' : '10 Trial Messages'}
                      </strong>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block' }}>Priority Support</span>
                      <strong style={{ fontSize: '0.92rem', color: '#fff' }}>
                        {plan === 'ultra' ? 'VIP 24/7 SLA' : plan === 'pro' ? 'Included' : 'Standard'}
                      </strong>
                    </div>
                  </div>
                </div>
              </TiltCard>


              {/* Upgrade Checkout Modal */}
              {showCheckoutModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
                  <div style={{ width: '100%', maxWidth: '480px', background: '#0e1017', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', padding: '28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Sparkles size={20} color="#fff" /> Upgrade to Jorgius Pro
                      </h3>
                      <button onClick={() => setShowCheckoutModal(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
                      Get unlimited native iMessage AI assistant capabilities, custom prompt routines, smart search, and priority 24/7 support.
                    </p>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span>Jorgius Pro Monthly</span>
                        <strong style={{ color: '#fff' }}>$4.99 / mo</strong>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        Processed securely via Stripe Official Subscription Checkout.
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <button
                        onClick={handleLaunchStripeCheckout}
                        className="btn-primary"
                        disabled={loading}
                        style={{ width: '100%', padding: '12px', fontSize: '0.92rem', justifyContent: 'center' }}
                      >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : 'Confirm & Proceed to Stripe Payment →'}
                      </button>

                      <button
                        onClick={() => setShowCheckoutModal(false)}
                        className="btn-secondary"
                        style={{ width: '100%', padding: '10px', fontSize: '0.85rem', justifyContent: 'center' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Cancel Membership Modal */}
              {showCancelModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
                  <div style={{ width: '100%', maxWidth: '460px', background: '#0e1017', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '16px', padding: '28px' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '12px', color: '#ef4444' }}>
                      Cancel Pro Membership?
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.5' }}>
                      Are you sure you want to cancel your Pro membership? <strong style={{ color: '#fff' }}>You will not be billed again</strong>, and your account will be reverted to the Free Demo tier.
                    </p>

                    <div style={{ background: 'rgba(239, 68, 68, 0.05)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '20px', fontSize: '0.78rem', color: '#f87171' }}>
                      ℹ️ Your subscription status will update immediately and future recurring billing will stop.
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button onClick={() => setShowCancelModal(false)} className="btn-secondary" style={{ fontSize: '0.85rem' }}>
                        Keep Pro Plan
                      </button>
                      <button onClick={handleConfirmCancel} className="btn-primary" disabled={loading} style={{ background: '#ef4444', borderColor: '#ef4444', fontSize: '0.85rem' }}>
                        {loading ? <Loader2 size={14} className="animate-spin" /> : 'Confirm Cancellation'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 4: ADMIN VIEW USERS & MESSAGING */}
          {activeTab === 'users' && isAdmin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Admin Direct Message Sender Card */}
              <TiltCard maxTilt={2}>
                <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Send size={18} color="#fff" /> Send Direct Message / Text as Jorgius
                  </h3>

                  <form onSubmit={handleAdminSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                          Select Registered Recipient
                        </label>
                        <select
                          value={adminMsgPhone}
                          onChange={(e) => setAdminMsgPhone(e.target.value)}
                          className="form-input"
                          style={{ width: '100%', userSelect: 'auto' }}
                        >
                          <option value="">-- Choose Authorized User --</option>
                          {allUsers.map((u) => {
                            const p = u.user_metadata?.phone_number || '';
                            const un = u.user_metadata?.username || u.email;
                            return (
                              <option key={u.id} value={p || u.email}>
                                {un} ({p || u.email})
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                          Or Custom Phone Number / Email (Overrides selection)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. +19549997574 or user@icloud.com"
                          value={adminCustomPhone}
                          onChange={(e) => setAdminCustomPhone(e.target.value)}
                          className="form-input"
                          style={{ width: '100%' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                        Message Content (Text / iMessage from Jorgius)
                      </label>
                      <textarea
                        placeholder="Type message to send to user..."
                        value={adminMsgText}
                        onChange={(e) => setAdminMsgText(e.target.value)}
                        className="form-input"
                        rows={3}
                        style={{ width: '100%', resize: 'vertical' }}
                        required
                      />
                    </div>

                    <button type="submit" className="btn-primary" disabled={adminSending} style={{ alignSelf: 'flex-end', fontSize: '0.85rem' }}>
                      {adminSending ? <Loader2 size={14} className="animate-spin" /> : <><Send size={14} /> Send Message from Jorgius</>}
                    </button>
                  </form>
                </div>
              </TiltCard>

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
                              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                <button
                                  onClick={() => handleEditUserClick(u)}
                                  className="btn-secondary"
                                  style={{ padding: '4px 10px', fontSize: '0.75rem', gap: '4px' }}
                                >
                                  <Edit2 size={11} /> Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteUser(u)}
                                  className="btn-secondary"
                                  style={{ padding: '4px 10px', fontSize: '0.75rem', gap: '4px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                                >
                                  Delete
                                </button>
                              </div>
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
