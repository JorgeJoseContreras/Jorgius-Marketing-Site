import React, { useState, useEffect, useRef } from 'react';
import { supabase, supabaseAdmin } from '../utils/supabaseClient';
import { createStripeCheckoutSession } from '../utils/stripeClient';
import { getAppVersion } from '../utils/statusStore';
import TiltCard from './TiltCard';
import CustomSelect from './CustomSelect';
import AdminPanel from './AdminPanel';
import { LogOut, Save, Loader2, CheckCircle2, AlertCircle, Phone, Sparkles, Shield, User, Settings, HelpCircle, MessageSquare, Edit2, Users, CreditCard, Zap, Crown, XCircle, Send, Cpu, UserPlus, Gift, Copy, Check, Activity, BarChart3, ShieldAlert, Mail, Lock, ShieldCheck, Trash2, RefreshCw, ExternalLink, Brain, BookOpen, Database, Tag, Plus, Calendar, Receipt } from 'lucide-react';

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


const defaultUserStats = {
  lifetimeTotal: 0,
  userSent: 0,
  aiResponses: 0,
  avgResponseSpeed: '0.8s',
  monthlyBreakdown: [{ month: 'August 2026', count: 0 }],
};

export default function Dashboard({ user, onSignOut, onOpenStatus }) {
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
  const [voiceName, setVoiceName] = useState('Adam');
  
  // Help Form fields
  const [helpMsg, setHelpMsg] = useState('');

  // Custom Integration fields
  const [integrationMsg, setIntegrationMsg] = useState('');

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

  // Invite Users & Referral program fields
  const [invitePhone, setInvitePhone] = useState('');
  const [adminInvitePhone, setAdminInvitePhone] = useState('');
  const [copiedRef, setCopiedRef] = useState(false);
  const [inviteSending, setInviteSending] = useState(false);

  // Connected Email Accounts state
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [loadingAccounts, setLoadingAccounts] = useState(false);
  const [disconnectingEmail, setDisconnectingEmail] = useState(null);

  // Apple iCloud Calendar state
  const [appleEmail, setAppleEmail] = useState('');
  const [applePassword, setApplePassword] = useState('');
  const [appleInfo, setAppleInfo] = useState({ connected: false, apple_id: null, calendars: [] });
  const [loadingApple, setLoadingApple] = useState(false);
  const [connectingApple, setConnectingApple] = useState(false);
  const [appleMsg, setAppleMsg] = useState('');

  // Contacts & Address Book state
  const [contacts, setContacts] = useState([]);
  const [loadingContacts, setLoadingContacts] = useState(false);
  const [contactSearch, setContactSearch] = useState('');
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactNotes, setNewContactNotes] = useState('');
  const [editingContactId, setEditingContactId] = useState(null);

  // Expenses & Receipts state
  const [expenses, setExpenses] = useState([]);
  const [expensesTotal, setExpensesTotal] = useState(0);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [isPlayingVoiceSample, setIsPlayingVoiceSample] = useState(false);

  // Call Logs & Transcripts state
  const [calls, setCalls] = useState([]);
  const [loadingCalls, setLoadingCalls] = useState(false);
  const [expandedCallId, setExpandedCallId] = useState(null);

  // Memory & Knowledge Bank state
  const [memories, setMemories] = useState([]);
  const [loadingMemories, setLoadingMemories] = useState(false);
  const [memorySearch, setMemorySearch] = useState('');
  const [memoryCategoryFilter, setMemoryCategoryFilter] = useState('all');
  const [showAddMemoryModal, setShowAddMemoryModal] = useState(false);
  const [newMemoryText, setNewMemoryText] = useState('');
  const [newMemoryCategory, setNewMemoryCategory] = useState('general');
  const [savingMemory, setSavingMemory] = useState(false);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const isAdmin = user?.email === 'aghlc.nm@gmail.com';

  const [appVersion, setAppVersion] = useState(getAppVersion());

  useEffect(() => {
    const handleVersionUpdate = () => {
      setAppVersion(getAppVersion());
    };
    window.addEventListener('version-update', handleVersionUpdate);
    return () => window.removeEventListener('version-update', handleVersionUpdate);
  }, []);

  const [navPillStyle, setNavPillStyle] = useState({ top: 0, height: 40 });
  const navItemRefs = useRef({});

  const [userMessageStats, setUserMessageStats] = useState(defaultUserStats);

  // Fetch real-time live message stats from backend database
  useEffect(() => {
    let isMounted = true;
    async function fetchLiveStats() {
      if (!user) return;
      const meta = user.user_metadata || {};
      const rawPhone = phoneNumber || meta.phone_number || (isAdmin ? '+19549997574' : '');
      const cleanDigits = (rawPhone || '').replace(/\D/g, '');
      const userParam = cleanDigits ? `+1${cleanDigits.slice(-10)}` : (user.email || '');

      if (!userParam) return;

      try {
        const res = await fetch(`https://notification-assistant.onrender.com/api/user/analytics?user_id=${encodeURIComponent(userParam)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.ok && isMounted) {
            setUserMessageStats({
              lifetimeTotal: data.lifetimeTotal ?? 0,
              userSent: data.userSent ?? 0,
              aiResponses: data.aiResponses ?? 0,
              avgResponseSpeed: data.avgResponseSpeed || '0.8s',
              monthlyBreakdown: (data.monthlyBreakdown && data.monthlyBreakdown.length > 0) 
                ? data.monthlyBreakdown 
                : [{ month: 'August 2026', count: 0 }],
            });
          }
        }
      } catch (err) {
        console.warn('Unable to fetch live analytics from backend:', err);
      }
    }

    fetchLiveStats();
    const interval = setInterval(fetchLiveStats, 20000); // Live poll every 20s
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [user, phoneNumber, isAdmin]);

  const fetchContacts = async () => {
    setLoadingContacts(true);
    try {
      const meta = user?.user_metadata || {};
      const rawPhone = phoneNumber || meta.phone_number || (isAdmin ? '+19549997574' : '');
      const res = await fetch(`https://notification-assistant.onrender.com/api/user/contacts?phone=${encodeURIComponent(rawPhone)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.ok) setContacts(data.contacts || []);
      }
    } catch (e) {
      console.error('Error fetching contacts:', e);
    } finally {
      setLoadingContacts(false);
    }
  };

  const fetchCalls = async () => {
    setLoadingCalls(true);
    try {
      const meta = user?.user_metadata || {};
      const rawPhone = phoneNumber || meta.phone_number || (isAdmin ? '+19549997574' : '');
      const res = await fetch(`https://notification-assistant.onrender.com/api/user/calls?phone=${encodeURIComponent(rawPhone)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.ok) setCalls(data.calls || []);
      }
    } catch (e) {
      console.error('Error fetching calls:', e);
    } finally {
      setLoadingCalls(false);
    }
  };

  const handleSaveContact = async (e) => {
    e.preventDefault();
    if (!newContactName.trim()) return;
    try {
      const meta = user?.user_metadata || {};
      const rawPhone = phoneNumber || meta.phone_number || (isAdmin ? '+19549997574' : '');
      const res = await fetch('https://notification-assistant.onrender.com/api/user/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingContactId,
          name: newContactName,
          phone: newContactPhone,
          email: newContactEmail,
          notes: newContactNotes,
          user_phone: rawPhone
        })
      });
      if (res.ok) {
        setShowAddContactModal(false);
        setNewContactName('');
        setNewContactPhone('');
        setNewContactEmail('');
        setNewContactNotes('');
        setEditingContactId(null);
        await fetchContacts();
      }
    } catch (err) {
      console.error('Error saving contact:', err);
    }
  };

  const handleDeleteContact = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name} from your contacts?`)) return;
    try {
      const res = await fetch(`https://notification-assistant.onrender.com/api/user/contacts/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchContacts();
      }
    } catch (err) {
      console.error('Error deleting contact:', err);
    }
  };

  const fetchMemories = async () => {
    const rawDigits = (phoneNumber || '').replace(/\D/g, '');
    const phoneParam = rawDigits ? `+1${rawDigits}` : (user?.email || '+19549997574');
    setLoadingMemories(true);
    try {
      const res = await fetch(`https://notification-assistant.onrender.com/api/user/memories?phone=${encodeURIComponent(phoneParam)}`);
      if (res.ok) {
        const data = await res.json();
        setMemories(data.memories || []);
      }
    } catch (err) {
      console.error('Error fetching memories:', err);
    } finally {
      setLoadingMemories(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'knowledge') {
      fetchMemories();
    } else if (activeTab === 'expenses') {
      fetchExpenses();
    }
  }, [activeTab, phoneNumber, user]);

  const handleAddMemory = async (e) => {
    e.preventDefault();
    if (!newMemoryText.trim()) return;
    setSavingMemory(true);
    const rawDigits = (phoneNumber || '').replace(/\D/g, '');
    const phoneParam = rawDigits ? `+1${rawDigits}` : (user?.email || '+19549997574');
    try {
      const res = await fetch('https://notification-assistant.onrender.com/api/user/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneParam,
          fact_text: newMemoryText.trim(),
          category: newMemoryCategory
        })
      });
      if (res.ok) {
        setNewMemoryText('');
        setShowAddMemoryModal(false);
        await fetchMemories();
      }
    } catch (err) {
      console.error('Error adding memory:', err);
    } finally {
      setSavingMemory(false);
    }
  };

  const handleDeleteMemory = async (factId, text) => {
    if (!window.confirm(`Delete this learned memory from Jorgius Knowledge Bank?\n\n"${text}"`)) return;
    try {
      const res = await fetch(`https://notification-assistant.onrender.com/api/user/memories?id=${factId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        await fetchMemories();
      }
    } catch (err) {
      console.error('Error deleting memory:', err);
    }
  };

  const navTabs = [
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'interactions', label: 'Interactions', icon: MessageSquare },
    { id: 'voice', label: 'Voice & Phone Calls', icon: Phone, isUltra: true },
    { id: 'contacts', label: 'Contacts & Address Book', icon: Users, isUltra: true },
    { id: 'expenses', label: 'Receipts & Expenses', icon: Receipt, isUltra: true },
    { id: 'knowledge', label: 'Memory & Knowledge Bank', icon: Brain, isUltra: true },
    { id: 'email', label: 'Email Analysis', icon: Mail, isUltra: true },
    { id: 'subscription', label: 'Manage Subscription', icon: CreditCard },
    { id: 'invite', label: 'Invite Users', icon: UserPlus },
    { id: 'support', label: 'Help & Support', icon: HelpCircle },
    { id: 'integrations', label: 'Custom Integrations', icon: Cpu },
    ...(isAdmin ? [
      { id: 'users', label: 'View Users', icon: Users },
      { id: 'status', label: 'System Status Editor', icon: ShieldAlert },
    ] : []),
  ];

  useEffect(() => {
    const activeEl = navItemRefs.current[activeTab];
    if (activeEl) {
      setNavPillStyle({
        top: activeEl.offsetTop,
        height: activeEl.offsetHeight,
      });
    }
  }, [activeTab, isAdmin]);

  useEffect(() => {
    if (user) {
      const meta = user.user_metadata || {};
      
      // Retroactive action defaults for Admin and VIP Pro accounts (Justin 9546816129)
      const userPhoneDigits = (meta.phone_number || '').replace(/\D/g, '');
      const isJustin = userPhoneDigits.includes('9546816129');

      if (isAdmin || isJustin) {
        setUsername(meta.username || (isAdmin ? 'Admin' : 'Justin'));
        setPhoneNumber(formatPhoneNumber(meta.phone_number || (isAdmin ? '9549997574' : '9546816129')));
        setPlan(meta.plan || 'pro');
        // Initial setup for VIP accounts if plan metadata hasn't been initialized yet
        if (!meta.plan) {
          supabase.auth.updateUser({ data: { plan: 'pro', known_name: isJustin ? 'Justin' : 'Admin' } });
        }
      } else {
        setUsername(meta.username || user.email.split('@')[0]);
        setPhoneNumber(formatPhoneNumber(meta.phone_number || ''));
        setPlan(meta.plan || 'demo');
      }

      setKnownName(meta.known_name || (isJustin ? 'Justin' : ''));
      setAssistantName(meta.assistant_name || 'Jorgius');
      setAssistantStyle(meta.assistant_style || 'default');
      if (meta.voice_name) setVoiceName(meta.voice_name);
      fetchVoice();



      // Auto-detect returning from Stripe payment upgrade redirect
      if (window.location.search.includes('upgraded=true') || window.location.hash.includes('upgraded=true')) {
        const fullUrl = window.location.href;
        const targetPlan = fullUrl.includes('plan=ultra') ? 'ultra' : 'pro';
        activatePlan(targetPlan);
      }
    }
  }, [user, isAdmin]);

  // Fetch connected email accounts (Gmail / Outlook) from backend
  const fetchConnectedAccounts = async (isManual = false) => {
    if (!user) return;
    setLoadingAccounts(true);
    const startTime = Date.now();
    try {
      const meta = user.user_metadata || {};
      const rawPhone = phoneNumber || meta.phone_number || (isAdmin ? '+19549997574' : '');
      const userEmail = user.email || '';
      const res = await fetch(`https://notification-assistant.onrender.com/api/user/connected-accounts?phone=${encodeURIComponent(rawPhone)}&email=${encodeURIComponent(userEmail)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.ok) {
          setConnectedAccounts(data.accounts || []);
        }
      }
    } catch (err) {
      console.warn('Error fetching connected accounts:', err);
    } finally {
      if (isManual) {
        const elapsed = Date.now() - startTime;
        const delay = Math.max(0, 600 - elapsed);
        setTimeout(() => setLoadingAccounts(false), delay);
      } else {
        setLoadingAccounts(false);
      }
    }
  };

  const fetchAppleInfo = async () => {
    setLoadingApple(true);
    try {
      const meta = user?.user_metadata || {};
      const rawPhone = phoneNumber || meta.phone_number || (isAdmin ? '+19549997574' : '');
      const res = await fetch(`https://notification-assistant.onrender.com/api/user/apple-credentials?phone=${encodeURIComponent(rawPhone)}`);
      if (res.ok) {
        const data = await res.json();
        setAppleInfo(data);
        if (data.apple_id) setAppleEmail(data.apple_id);
      }
    } catch (e) {
      console.error('Error fetching Apple info:', e);
    } finally {
      setLoadingApple(false);
    }
  };

  const fetchVoice = async () => {
    if (!user) return;
    try {
      const meta = user.user_metadata || {};
      const rawPhone = phoneNumber || meta.phone_number || (isAdmin ? '+19549997574' : '');
      const res = await fetch(`https://notification-assistant.onrender.com/api/user/voice?phone=${encodeURIComponent(rawPhone)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.current_voice?.name) {
          setVoiceName(data.current_voice.name);
        }
      }
    } catch (err) {
      console.warn('Error fetching voice preference:', err);
    }
  };

  const handleSaveVoice = async (selectedVoiceName) => {
    setVoiceName(selectedVoiceName);
    try {
      const meta = user?.user_metadata || {};
      const rawPhone = phoneNumber || meta.phone_number || (isAdmin ? '+19549997574' : '');
      await fetch('https://notification-assistant.onrender.com/api/user/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: rawPhone,
          voice: selectedVoiceName,
          user_id: user?.email || rawPhone
        })
      });
      await supabase.auth.updateUser({
        data: { voice_name: selectedVoiceName }
      });
    } catch (e) {
      console.error("Error updating voice:", e);
    }
  };

  const playVoiceSample = (targetVoice) => {
    const vName = targetVoice || voiceName || 'Adam';
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(`Hello! I am ${assistantName || 'Jorgius'}, speaking with your selected ${vName} voice persona.`);
      if (['Sarah', 'Alice', 'Lily', 'Rachel', 'Freya', 'Nova', 'Domi', 'Dorothy', 'Shimmer'].includes(vName)) {
        utterance.pitch = 1.15;
        utterance.rate = 0.98;
      } else if (['Adam', 'Josh', 'Arnold', 'Onyx'].includes(vName)) {
        utterance.pitch = 0.82;
        utterance.rate = 1.02;
      } else {
        utterance.pitch = 1.0;
        utterance.rate = 1.05;
      }
      setIsPlayingVoiceSample(true);
      utterance.onend = () => setIsPlayingVoiceSample(false);
      utterance.onerror = () => setIsPlayingVoiceSample(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const fetchExpenses = async () => {
    if (!user) return;
    setLoadingExpenses(true);
    try {
      const meta = user.user_metadata || {};
      const rawPhone = phoneNumber || meta.phone_number || (isAdmin ? '+19549997574' : '');
      const res = await fetch(`https://notification-assistant.onrender.com/api/user/expenses?phone=${encodeURIComponent(rawPhone)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.ok) {
          setExpenses(data.expenses || []);
          setExpensesTotal(data.total || 0);
        }
      }
    } catch (err) {
      console.warn('Error fetching expenses:', err);
    } finally {
      setLoadingExpenses(false);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const res = await fetch(`https://notification-assistant.onrender.com/api/user/expenses?id=${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setExpenses(prev => prev.filter(e => e.id !== id));
        setExpensesTotal(prev => Math.max(0, prev - (expenses.find(e => e.id === id)?.amount || 0)));
      }
    } catch (err) {
      console.error('Error deleting expense:', err);
    }
  };

  const handleConnectApple = async (e) => {
    e.preventDefault();
    if (!appleEmail.trim() || !applePassword.trim()) {
      setAppleMsg('Please provide both your Apple ID email and 16-character App-Specific Password.');
      return;
    }
    setConnectingApple(true);
    setAppleMsg('');
    try {
      const meta = user?.user_metadata || {};
      const rawPhone = phoneNumber || meta.phone_number || (isAdmin ? '+19549997574' : '');
      const res = await fetch('https://notification-assistant.onrender.com/api/user/apple-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: rawPhone,
          apple_id: appleEmail.trim(),
          app_password: applePassword.trim()
        })
      });
      const data = await res.json();
      if (data.success) {
        setAppleInfo({ connected: true, apple_id: data.apple_id, calendars: data.calendars || [] });
        setApplePassword('');
        setSuccessMsg(`🍏 ${data.message}`);
        await fetchConnectedAccounts();
        setTimeout(() => setSuccessMsg(''), 6000);
      } else {
        setAppleMsg(data.error || 'Failed to connect Apple Calendar.');
      }
    } catch (err) {
      setAppleMsg('Connection error: ' + err.message);
    } finally {
      setConnectingApple(false);
    }
  };

  const handleDisconnectApple = async () => {
    if (!window.confirm('Disconnect your Apple iCloud Calendar? Jorgius will no longer auto-sync calendar events.')) return;
    setConnectingApple(true);
    try {
      const meta = user?.user_metadata || {};
      const rawPhone = phoneNumber || meta.phone_number || (isAdmin ? '+19549997574' : '');
      const res = await fetch(`https://notification-assistant.onrender.com/api/user/apple-credentials?phone=${encodeURIComponent(rawPhone)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setAppleInfo({ connected: false, apple_id: null, calendars: [] });
        setApplePassword('');
        setSuccessMsg('🍏 Disconnected Apple iCloud Calendar.');
        await fetchConnectedAccounts();
        setTimeout(() => setSuccessMsg(''), 5000);
      }
    } catch (err) {
      setErrorMsg('Error disconnecting: ' + err.message);
    } finally {
      setConnectingApple(false);
    }
  };

  // Eagerly pre-load connected accounts & Apple info on initial render and when tab switches
  useEffect(() => {
    fetchConnectedAccounts();
    fetchAppleInfo();
  }, [user, phoneNumber, isAdmin, activeTab]);

  const handleSetDefaultEmail = async (accountEmail, accountType) => {
    try {
      const meta = user?.user_metadata || {};
      const rawPhone = phoneNumber || meta.phone_number || (isAdmin ? '+19549997574' : '');
      const res = await fetch('https://notification-assistant.onrender.com/api/user/set-default-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: accountEmail, type: accountType, phone: rawPhone }),
      });
      if (res.ok) {
        await fetchConnectedAccounts();
      }
    } catch (err) {
      console.error('Error setting default email:', err);
    }
  };

  const handleDisconnectAccount = async (accountEmail, accountType) => {
    if (!window.confirm(`Are you sure you want to disconnect ${accountEmail}?`)) return;
    setDisconnectingEmail(accountEmail);
    try {
      const res = await fetch('https://notification-assistant.onrender.com/api/user/disconnect-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: accountEmail, type: accountType }),
      });
      if (res.ok) {
        await fetchConnectedAccounts();
      }
    } catch (err) {
      console.error('Error disconnecting account:', err);
    } finally {
      setDisconnectingEmail(null);
    }
  };

  const activatePlan = async (targetPlan = 'pro') => {
    setLoading(true);
    const selectedPlan = targetPlan === 'ultra' ? 'ultra' : 'pro';
    const planName = selectedPlan === 'ultra' ? 'Ultra Premium' : 'Pro Unlimited';
    try {
      const { error } = await supabase.auth.updateUser({
        data: { plan: selectedPlan }
      });
      if (error) throw error;
      setPlan(selectedPlan);
      setSuccessMsg(`🎉 Stripe payment successful! Your ${planName} Membership is now active.`);

      // Send instant owner notification email via Web3Forms
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: getWeb3FormsKey(),
          subject: `🎉 NEW ${selectedPlan.toUpperCase()} SUBSCRIBER: ${user.email}`,
          from_name: 'Jorgius Billing',
          email: user.email,
          message: `NEW ${selectedPlan.toUpperCase()} SUBSCRIPTION CONFIRMED!\n\nUser Email: ${user.email}\nUsername: ${user.user_metadata?.username || 'N/A'}\nPhone Number: ${user.user_metadata?.phone_number || 'N/A'}\nPlan: ${selectedPlan.toUpperCase()}`,
        }),
      });

      // Clean URL parameters
      if (window.location.search.includes('upgraded=true') || window.location.hash.includes('upgraded=true')) {
        window.history.replaceState({}, document.title, window.location.pathname + '#dashboard');
      }
      setTimeout(() => setSuccessMsg(''), 6000);
    } catch (err) {
      setErrorMsg(`Failed to activate ${selectedPlan} plan: ` + err.message);
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

      // Combine Supabase Auth + Database users into a unified list, strictly deduplicated
      const combined = [];
      const seenKeys = new Set();

      supUsers.forEach((u) => {
        const uEmail = (u.email || '').toLowerCase();
        const uUsername = (u.user_metadata?.username || '').toLowerCase();
        const key = uEmail || uUsername || u.id;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          combined.push(u);
        }
      });

      dbUsers.forEach((dbu) => {
        const dbuPhone = dbu.phone_number?.replace(/\D/g, '') || '';
        const dbuEmail = (dbu.phone_number || '').toLowerCase();
        const dbuUsername = (dbu.name || dbu.known_name || '').toLowerCase();

        const exists = combined.some((u) => {
          const uPhone = (u.user_metadata?.phone_number || '').replace(/\D/g, '');
          const uEmail = (u.email || '').toLowerCase();
          const uUsername = (u.user_metadata?.username || '').toLowerCase();
          
          const matchPhone = uPhone && dbuPhone && uPhone.slice(-10) === dbuPhone.slice(-10);
          const matchEmail = uEmail && dbuEmail && uEmail === dbuEmail;
          const matchUsername = uUsername && dbuUsername && uUsername === dbuUsername;

          return matchPhone || matchEmail || matchUsername;
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

      // Submit notification email to owner via Web3Forms (for non-admin user updates)
      if (!isAdmin) {
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
      }

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

  const handleSendUserInvite = async (e) => {
    e.preventDefault();
    const rawDigits = invitePhone.replace(/\D/g, '');
    if (rawDigits.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit phone number for the iMessage invite.');
      return;
    }
    setInviteSending(true);
    setErrorMsg('');
    setSuccessMsg('');

    const refCode = user?.id ? user.id.slice(0, 8) : 'vip';
    const refLink = `https://jorgius.com/?ref=${refCode}`;
    const inviteMessage = `Hey! ${username || 'Your friend'} invited you to try Jorgius AI. Sign up using their link to get started: ${refLink}`;

    try {
      await fetch('https://notification-assistant.onrender.com/api/admin/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: rawDigits,
          message: inviteMessage
        })
      });
      setSuccessMsg(`🚀 Referral iMessage invite sent to ${formatPhoneNumber(rawDigits)}!`);
      setInvitePhone('');
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setErrorMsg('Failed to send iMessage invite: ' + err.message);
    } finally {
      setInviteSending(false);
    }
  };

  const handleSendAdminInvite = async (e) => {
    e.preventDefault();
    const rawDigits = adminInvitePhone.replace(/\D/g, '');
    if (rawDigits.length !== 10) {
      setErrorMsg('Please enter a valid 10-digit phone number for the iMessage invite.');
      return;
    }
    setInviteSending(true);
    setErrorMsg('');
    setSuccessMsg('');

    const inviteMessage = `Hey! You've been invited by Admin to create your account on Jorgius AI. Sign up here to activate your access: https://jorgius.com/#pricing`;

    try {
      await fetch('https://notification-assistant.onrender.com/api/admin/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: rawDigits,
          message: inviteMessage
        })
      });
      setSuccessMsg(`🚀 Admin iMessage invite sent to ${formatPhoneNumber(rawDigits)}!`);
      setAdminInvitePhone('');
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      setErrorMsg('Failed to send Admin iMessage invite: ' + err.message);
    } finally {
      setInviteSending(false);
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
          access_key: 'dd12f643-2cc8-4b82-ba8d-309d1fcb4329',
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

  const handleDowngradeToPro = async () => {
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const { error } = await supabase.auth.updateUser({
        data: { plan: 'pro' }
      });
      if (error) throw error;
      setPlan('pro');
      setSuccessMsg('Your plan has been updated to Pro Unlimited ($4.99/mo).');

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: 'dd12f643-2cc8-4b82-ba8d-309d1fcb4329',
          subject: `📉 PLAN DOWNGRADED TO PRO: ${user.email}`,
          from_name: 'Jorgius Billing System',
          email: user.email,
          message: `SUBSCRIPTION CHANGED TO PRO!\n\nUser Email: ${user.email}\nUsername: ${user.user_metadata?.username || 'N/A'}\nPhone Number: ${user.user_metadata?.phone_number || 'N/A'}\nStatus: PRO UNLIMITED ($4.99/MO)`,
        }),
      });

      setTimeout(() => setSuccessMsg(''), 6000);
    } catch (err) {
      setErrorMsg('Failed to change plan: ' + err.message);
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

  const handleSendIntegrationRequest = async (e) => {
    e.preventDefault();
    if (plan !== 'ultra') return;
    if (!integrationMsg.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: 'ef6d4437-3491-485e-aba3-d70abbf4676d',
          subject: `🔧 CUSTOM INTEGRATION REQUEST: ${user.email}`,
          from_name: username || 'Jorgius User',
          email: user.email,
          message: `CUSTOM INTEGRATION REQUEST!\n\nUser Email: ${user.email}\nUsername: ${username || 'N/A'}\nPhone Number: ${phoneNumber || 'N/A'}\nPlan: ${plan}\n\nRequest Details:\n${integrationMsg}`,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setSuccessMsg('Your custom integration request has been submitted successfully!');
        setIntegrationMsg('');
        setTimeout(() => setSuccessMsg(''), 5000);
      } else {
        throw new Error(result.message || 'Failed to submit request.');
      }
    } catch (err) {
      setErrorMsg('Error submitting request: ' + err.message);
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
          <div style={{ marginBottom: '28px' }}>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', fontFamily: 'var(--font-heading)', color: '#fff', display: 'block' }}>Jorgius</span>
            <button
              type="button"
              onClick={() => {
                if (onOpenStatus) {
                  onOpenStatus();
                }
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                fontSize: '0.72rem',
                color: 'var(--text-secondary)',
                fontWeight: '500',
                marginTop: '4px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              title="Click to view live System Status"
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
              <span>{appVersion}</span>
            </button>
          </div>

          <nav style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* Smooth Sliding Active Indicator Pill */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: `${navPillStyle.height}px`,
                transform: `translateY(${navPillStyle.top}px)`,
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '8px',
                transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1), height 0.2s ease',
                pointerEvents: 'none',
                zIndex: 1,
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            />

            {navTabs.map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              const isLocked = tab.isUltra && plan !== 'ultra' && !isAdmin;

              return (
                <button
                  key={tab.id}
                  ref={(el) => (navItemRefs.current[tab.id] = el)}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  style={{
                    position: 'relative',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'transparent',
                    color: isActive ? '#ffffff' : isLocked ? '#777788' : 'var(--text-secondary)',
                    fontWeight: isActive ? '700' : '500',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    opacity: isLocked && !isActive ? 0.65 : 1,
                    transition: 'all 0.25s ease',
                  }}
                >
                  <IconComp size={16} color={isActive ? '#ffffff' : isLocked ? '#666677' : 'var(--text-secondary)'} style={{ transition: 'color 0.25s ease' }} />
                  <span>{tab.label}</span>
                  {isLocked && <Lock size={12} color="#777788" style={{ marginLeft: 'auto', flexShrink: 0 }} />}
                </button>
              );
            })}
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
                {activeTab === 'voice' && 'Voice Calls & Phone Logs'}
                {activeTab === 'contacts' && 'Contacts & Address Book'}
                {activeTab === 'expenses' && 'Receipts & Expense Tracker'}
                {activeTab === 'knowledge' && 'Memory & Knowledge Bank'}
                {activeTab === 'email' && 'Email Intelligence & Sync'}
                {activeTab === 'subscription' && 'Manage Subscription'}
                {activeTab === 'invite' && 'Invite Users & Referrals'}
                {activeTab === 'support' && 'Help & Support'}
                {activeTab === 'integrations' && 'Custom Integrations'}
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
                          <CustomSelect
                            value={plan}
                            onChange={(val) => setPlan(val)}
                            options={[
                              { value: 'demo', label: 'Free Demo Plan' },
                              { value: 'pro', label: 'Pro Unlimited Plan ($0.99/mo)' },
                              { value: 'ultra', label: 'Jorgius Ultra Plan ($4.99/mo)' },
                            ]}
                          />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>
                              {plan === 'ultra' ? 'Ultra Premium Plan ($4.99/mo)' : plan === 'pro' ? 'Pro Unlimited Plan ($0.99/mo)' : 'Free Demo Plan'}
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
                          <strong style={{ color: '#fff' }}>{isAdmin ? 'View all users' : plan === 'ultra' ? 'Ultra VIP Access' : plan === 'pro' ? 'Unlimited Pro Access' : 'Demo Mode'}</strong>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Support Priority</span>
                          <strong style={{ color: '#fff' }}>{(plan === 'pro' || plan === 'ultra' || isAdmin) ? 'Instant Priority' : 'Standard'}</strong>
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
                        <CustomSelect
                          value={assistantStyle}
                          onChange={(val) => setAssistantStyle(val)}
                          options={[
                            { value: 'default', label: 'Default (Normal, Friendly & Direct)' },
                            { value: 'gangster', label: 'Gangster Mode (Street-Smart Slang)' },
                            { value: 'short', label: 'Keep it Short (Ultra-Concise, Fewest Words)' },
                            { value: 'executive', label: 'Executive (Formal & Professional)' },
                            { value: 'genz', label: 'Gen Z Mode (Hype & Internet Slang)' },
                            { value: 'sarcastic', label: 'Sarcastic (Playfully Witty)' },
                          ]}
                        />

                      </div>

                      <button type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: 'flex-end', fontSize: '0.85rem' }}>
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <><Save size={14} /> Save Interactions</>}
                      </button>
                    </form>
                  </div>
                </TiltCard>
              </div>
            </div>
          )}


          {/* TAB: VOICE & PHONE CALLS (ULTRA EXCLUSIVE) */}
          {activeTab === 'voice' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Feature Banner Card */}
              <TiltCard maxTilt={2}>
                <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{ padding: '10px', background: 'rgba(52, 211, 153, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Phone size={22} color="#34d399" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff' }}>
                        Live Voice AI & Inbound Phone Calls
                      </h3>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        Call Jorgius anytime over the phone to talk, check emails, listen to calendar agenda, or ask questions in real-time.
                      </p>
                    </div>
                  </div>
                </div>
              </TiltCard>

              {/* Ultra Gating Check */}
              {plan !== 'ultra' && !isAdmin ? (
                <TiltCard maxTilt={3}>
                  <div style={{ padding: '32px 24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                      <Crown size={24} color="#f59e0b" />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
                      Ultra Exclusive Feature
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '520px', margin: '0 auto 24px auto', lineHeight: '1.5' }}>
                      Live 2-way Voice AI phone calls are exclusive to <strong>Jorgius Ultra ($4.99/mo)</strong>. Upgrade your membership to get your personal Jorgius phone number.
                    </p>
                    <a
                      href="https://buy.stripe.com/dRm5kD0uc8qIgkm1nVaVa03"
                      className="btn-ultra"
                      style={{ padding: '12px 28px', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                    >
                      <Crown size={15} fill="#000" />
                      <span>Upgrade to Jorgius Ultra ($4.99/mo)</span>
                    </a>
                  </div>
                </TiltCard>
              ) : (
                /* Ultra / Admin Active Voice Controls */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                  
                  {/* Phone Call Card */}
                  <TiltCard maxTilt={3}>
                    <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(52, 211, 153, 0.1)', border: '1px solid rgba(52, 211, 153, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Phone size={18} color="#34d399" />
                          </div>
                          <div>
                            <h4 style={{ fontSize: '0.98rem', fontWeight: '700', color: '#fff' }}>Jorgius Live Phone Number</h4>
                            <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: '600' }}>● Active & Ready to Answer</span>
                          </div>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px', textAlign: 'center' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                            Direct Phone Number
                          </div>
                          <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', letterSpacing: '0.05em', fontFamily: 'var(--font-heading)' }}>
                            +1 (716) 670-2614
                          </div>
                        </div>

                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.45' }}>
                          Save this number to your iPhone/Android contacts. Call anytime to talk naturally with Jorgius, ask about your emails, check your calendar agenda, or send texts by voice.
                        </p>
                      </div>

                      <a
                        href="tel:+17166702614"
                        className="btn-primary"
                        style={{ width: '100%', padding: '12px', justifyContent: 'center', fontSize: '0.88rem', gap: '8px', textDecoration: 'none', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                      >
                        <Phone size={16} />
                        <span>Call +1 (716) 670-2614 Now</span>
                      </a>
                    </div>
                  </TiltCard>

                  {/* Voice Persona & Style Selection Card */}
                  <TiltCard maxTilt={3}>
                    <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Sparkles size={18} color="#818cf8" />
                          </div>
                          <div>
                            <h4 style={{ fontSize: '0.98rem', fontWeight: '700', color: '#fff' }}>Assistant Voice Persona</h4>
                            <span style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: '600' }}>● Dedicated To Your Account</span>
                          </div>
                        </div>

                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: '1.45' }}>
                          Select your preferred voice persona for phone calls and scheduled voice briefings.
                        </p>

                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                            Active Voice
                          </label>
                          <CustomSelect
                            value={voiceName}
                            onChange={(val) => handleSaveVoice(val)}
                            options={[
                              { value: 'Adam', label: 'Adam (Deep, Smooth Male - Default)' },
                              { value: 'Sarah', label: 'Sarah (Soft, Calm Female)' },
                              { value: 'Alice', label: 'Alice (Gentle, Whispery British Female)' },
                              { value: 'Charlie', label: 'Charlie (Soft-Spoken, Friendly Male)' },
                              { value: 'Lily', label: 'Lily (Warm, Soft British Female)' },
                              { value: 'Rachel', label: 'Rachel (Warm, Engaging Female)' },
                              { value: 'Freya', label: 'Freya (Modern, Expressive Female)' },
                              { value: 'Josh', label: 'Josh (Deep, Authoritative Male)' },
                              { value: 'Daniel', label: 'Daniel (Authoritative British Male)' },
                              { value: 'George', label: 'George (Classic British Storyteller)' },
                              { value: 'Antoni', label: 'Antoni (Energetic, Upbeat Male)' },
                              { value: 'Domi', label: 'Domi (Strong, Energetic Female)' },
                              { value: 'Nova', label: 'Nova (Upbeat, Natural Female)' },
                              { value: 'Onyx', label: 'Onyx (Deep Baritone Male)' }
                            ]}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => playVoiceSample(voiceName)}
                          disabled={isPlayingVoiceSample}
                          className="btn-ghost"
                          style={{ width: '100%', padding: '9px 12px', fontSize: '0.8rem', gap: '6px', justifyContent: 'center', background: 'rgba(99, 102, 241, 0.08)', border: '1px solid rgba(99, 102, 241, 0.2)', color: '#a5b4fc', borderRadius: '10px' }}
                        >
                          <span>{isPlayingVoiceSample ? "🔊 Playing Sample..." : `▶️ Listen to ${voiceName} Voice Sample`}</span>
                        </button>
                      </div>

                      <div style={{ marginTop: '12px', padding: '10px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', fontSize: '0.76rem', color: 'var(--text-secondary)' }}>
                        💡 <em>Tip:</em> You can also tell Jorgius on a call: <strong>"Do a softer voice"</strong> to cycle styles automatically!
                      </div>
                    </div>
                  </TiltCard>

                  {/* Capabilities Card */}
                  <TiltCard maxTilt={3}>
                    <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <h4 style={{ fontSize: '0.98rem', fontWeight: '700', color: '#fff', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px' }}>
                          ⚡ What You Can Say On Calls
                        </h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                            <span style={{ color: '#34d399', fontWeight: '700' }}>•</span>
                            <span><em>"What unread emails did I get today?"</em></span>
                          </li>
                          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                            <span style={{ color: '#34d399', fontWeight: '700' }}>•</span>
                            <span><em>"Read me my upcoming calendar agenda."</em></span>
                          </li>
                          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                            <span style={{ color: '#34d399', fontWeight: '700' }}>•</span>
                            <span><em>"Can you do a softer voice?"</em></span>
                          </li>
                          <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                            <span style={{ color: '#34d399', fontWeight: '700' }}>•</span>
                            <span><em>"Send a text to Alex saying I'm on my way."</em></span>
                          </li>
                        </ul>
                      </div>

                      <div style={{ marginTop: '20px', padding: '12px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        Powered by <strong>Vapi.ai Voice Infrastructure</strong> &amp; <strong>Gemini 2.0 Real-Time AI</strong> (&lt;500ms latency).
                      </div>
                    </div>
                  </TiltCard>

                </div>
              )}

              {/* Call History & Transcripts Section */}
              {(plan === 'ultra' || isAdmin) && (
                <TiltCard maxTilt={1.5}>
                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#fff' }}>
                          🎙️ Recent Phone Calls &amp; Transcripts
                        </h4>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(52, 211, 153, 0.12)', color: '#34d399', padding: '2px 8px', borderRadius: '12px', fontWeight: '700' }}>
                          {calls.length} Recorded
                        </span>
                      </div>
                      <button
                        onClick={fetchCalls}
                        disabled={loadingCalls}
                        className="btn-ghost"
                        style={{ padding: '6px 12px', fontSize: '0.78rem', gap: '6px' }}
                      >
                        <RefreshCw size={12} className={loadingCalls ? "animate-spin" : ""} />
                        <span>Refresh</span>
                      </button>
                    </div>

                    {loadingCalls && calls.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                        <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 10px auto' }} />
                        <p style={{ fontSize: '0.85rem' }}>Loading recent calls...</p>
                      </div>
                    ) : calls.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '32px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                        <Phone size={28} color="rgba(255,255,255,0.2)" style={{ margin: '0 auto 10px auto' }} />
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#fff' }}>No call history yet</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          Call +1 (716) 670-2614 to speak with Jorgius. Your call transcripts and summaries will appear here automatically!
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {calls.map((c) => {
                          const mins = Math.floor((c.duration_seconds || 0) / 60);
                          const secs = (c.duration_seconds || 0) % 60;
                          const durText = mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
                          const isExpanded = expandedCallId === c.id;

                          return (
                            <div
                              key={c.id || c.call_id}
                              style={{
                                padding: '16px',
                                background: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: '12px',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '8px',
                                    background: 'rgba(52, 211, 153, 0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                  }}>
                                    <Phone size={15} color="#34d399" />
                                  </div>
                                  <div>
                                    <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#fff' }}>
                                      {c.direction === 'outbound' ? 'Outbound Call' : 'Inbound Phone Call'}
                                    </div>
                                    <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                                      {c.created_at ? new Date(c.created_at).toLocaleString() : 'Recent'}
                                    </div>
                                  </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '0.74rem', background: 'rgba(255,255,255,0.06)', color: '#cbd5e1', padding: '3px 8px', borderRadius: '6px', fontWeight: '600' }}>
                                    ⏱️ {durText}
                                  </span>
                                  <span style={{ fontSize: '0.74rem', background: 'rgba(52, 211, 153, 0.12)', color: '#34d399', padding: '3px 8px', borderRadius: '6px', fontWeight: '700' }}>
                                    ✓ Completed
                                  </span>
                                </div>
                              </div>

                              {/* Executive Summary */}
                              {c.summary && (
                                <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', borderLeft: '3px solid #34d399', fontSize: '0.82rem', color: '#e2e8f0', lineHeight: '1.45' }}>
                                  <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: '700', textTransform: 'uppercase', marginBottom: '2px' }}>
                                    Executive Summary
                                  </div>
                                  {c.summary}
                                </div>
                              )}

                              {/* Audio Recording Player */}
                              {c.recording_url && (
                                <div style={{ marginTop: '12px' }}>
                                  <audio controls style={{ width: '100%', height: '34px' }} src={c.recording_url}>
                                    Your browser does not support audio playback.
                                  </audio>
                                </div>
                              )}

                              {/* Expandable Transcript */}
                              {c.transcript && (
                                <div style={{ marginTop: '10px' }}>
                                  <button
                                    onClick={() => setExpandedCallId(isExpanded ? null : c.id)}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#818cf8',
                                      fontSize: '0.76rem',
                                      fontWeight: '600',
                                      cursor: 'pointer',
                                      padding: '4px 0'
                                    }}
                                  >
                                    {isExpanded ? '▲ Hide Full Transcript' : '▼ View Full Conversation Transcript'}
                                  </button>
                                  {isExpanded && (
                                    <div style={{ marginTop: '8px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontSize: '0.78rem', color: '#94a3b8', whiteSpace: 'pre-wrap', lineHeight: '1.5', maxHeight: '250px', overflowY: 'auto' }}>
                                      {c.transcript}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </TiltCard>
              )}

            </div>
          )}

          {/* TAB: CONTACTS & ADDRESS BOOK */}
          {activeTab === 'contacts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Header Card */}
              <TiltCard maxTilt={2}>
                <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ padding: '10px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={22} color="#818cf8" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff' }}>
                          Contacts &amp; Address Book
                        </h3>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Manage stored contacts so Jorgius knows exactly who you mean on voice calls and iMessage.
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setEditingContactId(null);
                        setNewContactName('');
                        setNewContactPhone('');
                        setNewContactEmail('');
                        setNewContactNotes('');
                        setShowAddContactModal(true);
                      }}
                      className="btn-primary"
                      style={{ padding: '9px 18px', fontSize: '0.85rem', gap: '6px' }}
                    >
                      <UserPlus size={15} />
                      <span>+ Add Contact</span>
                    </button>
                  </div>
                </div>
              </TiltCard>

              {/* Contacts List Card */}
              <TiltCard maxTilt={1.5}>
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '12px', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      placeholder="Search contacts by name, email, or phone..."
                      value={contactSearch}
                      onChange={(e) => setContactSearch(e.target.value)}
                      className="form-input"
                      style={{ maxWidth: '340px', fontSize: '0.82rem', padding: '8px 12px' }}
                    />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                        {contacts.length} Contact{contacts.length === 1 ? '' : 's'}
                      </span>
                      <button
                        onClick={fetchContacts}
                        disabled={loadingContacts}
                        className="btn-ghost"
                        style={{ padding: '6px 10px', fontSize: '0.76rem', gap: '5px' }}
                      >
                        <RefreshCw size={12} className={loadingContacts ? "animate-spin" : ""} />
                        <span>Refresh</span>
                      </button>
                    </div>
                  </div>

                  {loadingContacts && contacts.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>
                      <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 10px auto' }} />
                      <p style={{ fontSize: '0.85rem' }}>Loading address book...</p>
                    </div>
                  ) : contacts.filter(c => !contactSearch || (c.name && c.name.toLowerCase().includes(contactSearch.toLowerCase())) || (c.email && c.email.toLowerCase().includes(contactSearch.toLowerCase())) || (c.phone && c.phone.includes(contactSearch))).length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '36px 16px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                      <Users size={32} color="rgba(255,255,255,0.2)" style={{ margin: '0 auto 10px auto' }} />
                      <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#fff' }}>No contacts found</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', maxWidth: '360px', margin: '4px auto 16px auto' }}>
                        Add contacts like family, doctors, or colleagues so Jorgius can resolve names when sending emails or transferring calls.
                      </div>
                      <button
                        onClick={() => {
                          setEditingContactId(null);
                          setNewContactName('');
                          setNewContactPhone('');
                          setNewContactEmail('');
                          setNewContactNotes('');
                          setShowAddContactModal(true);
                        }}
                        className="btn-primary"
                        style={{ padding: '8px 16px', fontSize: '0.82rem', margin: '0 auto' }}
                      >
                        + Add First Contact
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                      {contacts
                        .filter(c => !contactSearch || (c.name && c.name.toLowerCase().includes(contactSearch.toLowerCase())) || (c.email && c.email.toLowerCase().includes(contactSearch.toLowerCase())) || (c.phone && c.phone.includes(contactSearch)))
                        .map((c) => (
                          <div
                            key={c.id}
                            style={{
                              padding: '16px',
                              background: 'rgba(255, 255, 255, 0.03)',
                              borderRadius: '12px',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              gap: '12px'
                            }}
                          >
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <div style={{ fontSize: '0.98rem', fontWeight: '800', color: '#fff' }}>
                                  {c.name}
                                </div>
                                <span style={{ fontSize: '0.68rem', background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', padding: '2px 8px', borderRadius: '6px', fontWeight: '600', textTransform: 'capitalize' }}>
                                  {c.relationship || 'Contact'}
                                </span>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem' }}>
                                {c.phone && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1' }}>
                                    <Phone size={13} color="#34d399" />
                                    <span>{c.phone}</span>
                                  </div>
                                )}
                                {c.email && (
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', wordBreak: 'break-all' }}>
                                    <Mail size={13} color="#818cf8" />
                                    <span>{c.email}</span>
                                  </div>
                                )}
                                {c.notes && (
                                  <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '4px', fontStyle: 'italic' }}>
                                    "{c.notes}"
                                  </div>
                                )}
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                              <button
                                onClick={() => {
                                  setEditingContactId(c.id);
                                  setNewContactName(c.name || '');
                                  setNewContactPhone(c.phone || '');
                                  setNewContactEmail(c.email || '');
                                  setNewContactNotes(c.notes || '');
                                  setShowAddContactModal(true);
                                }}
                                style={{
                                  padding: '5px 10px',
                                  background: 'rgba(255,255,255,0.06)',
                                  border: '1px solid rgba(255,255,255,0.12)',
                                  borderRadius: '6px',
                                  color: '#f8fafc',
                                  fontSize: '0.74rem',
                                  cursor: 'pointer'
                                }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteContact(c.id, c.name)}
                                style={{
                                  padding: '5px 10px',
                                  background: 'rgba(239, 68, 68, 0.08)',
                                  border: '1px solid rgba(239, 68, 68, 0.25)',
                                  borderRadius: '6px',
                                  color: '#f87171',
                                  fontSize: '0.74rem',
                                  cursor: 'pointer',
                                  marginLeft: 'auto'
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </TiltCard>

              {/* Add/Edit Contact Modal */}
              {showAddContactModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(5px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                  <div style={{ background: '#111827', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', padding: '24px', maxWidth: '440px', width: '100%', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff', marginBottom: '16px' }}>
                      {editingContactId ? '✏️ Edit Contact' : '➕ Add New Contact'}
                    </h3>
                    <form onSubmit={handleSaveContact} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Justin Bender, Dr. Smith, Mom"
                          value={newContactName}
                          onChange={(e) => setNewContactName(e.target.value)}
                          className="form-input"
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Phone Number</label>
                        <input
                          type="text"
                          placeholder="e.g. +19546816129"
                          value={newContactPhone}
                          onChange={(e) => setNewContactPhone(e.target.value)}
                          className="form-input"
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Email Address</label>
                        <input
                          type="email"
                          placeholder="e.g. justin@example.com"
                          value={newContactEmail}
                          onChange={(e) => setNewContactEmail(e.target.value)}
                          className="form-input"
                          style={{ width: '100%' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Notes / Context</label>
                        <input
                          type="text"
                          placeholder="e.g. Business partner, Dentist, Family"
                          value={newContactNotes}
                          onChange={(e) => setNewContactNotes(e.target.value)}
                          className="form-input"
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        <button
                          type="button"
                          onClick={() => setShowAddContactModal(false)}
                          className="btn-ghost"
                          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn-primary"
                          style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                        >
                          Save Contact
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB: RECEIPTS & EXPENSES */}
          {activeTab === 'expenses' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Header Card */}
              <TiltCard maxTilt={2}>
                <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Receipt size={22} color="#10b981" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff' }}>
                          Receipts &amp; Expense Tracker
                        </h3>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                          AI multimodal vision receipt scanning &amp; per-user expense breakdown.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={fetchExpenses}
                      className="btn-ghost"
                      style={{ padding: '8px 14px', fontSize: '0.8rem', gap: '6px' }}
                      disabled={loadingExpenses}
                    >
                      <RefreshCw size={14} className={loadingExpenses ? "spin" : ""} />
                      <span>Refresh</span>
                    </button>
                  </div>
                </div>
              </TiltCard>

              {/* Stats Overview */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <TiltCard maxTilt={3}>
                  <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Recorded Spend</span>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#10b981', marginTop: '6px' }}>
                      ${expensesTotal.toFixed(2)}
                    </h2>
                  </div>
                </TiltCard>

                <TiltCard maxTilt={3}>
                  <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Receipts Logged</span>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fff', marginTop: '6px' }}>
                      {expenses.length}
                    </h2>
                  </div>
                </TiltCard>

                <TiltCard maxTilt={3}>
                  <div style={{ padding: '20px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Categories</span>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#818cf8', marginTop: '6px' }}>
                      {new Set(expenses.map(e => e.category)).size}
                    </h2>
                  </div>
                </TiltCard>
              </div>

              {/* Vision Camera Guide Banner */}
              <div style={{ padding: '16px 20px', borderRadius: '14px', background: 'rgba(16, 185, 129, 0.06)', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ fontSize: '1.6rem' }}>📸</div>
                <div style={{ fontSize: '0.84rem', color: '#d1fae5', lineHeight: '1.45' }}>
                  <strong>Multimodal OCR Receipt Scanning:</strong> Snap and send a photo of any receipt, dinner bill, or paper invoice on iMessage. Jorgius automatically extracts the merchant, dollar amount, category, and date!
                </div>
              </div>

              {/* Expense List Table Card */}
              <TiltCard maxTilt={2}>
                <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>
                    Recent Expenses &amp; Purchases
                  </h4>

                  {loadingExpenses ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                      <Loader2 size={24} className="spin" style={{ margin: '0 auto 10px' }} />
                      <p style={{ fontSize: '0.85rem' }}>Loading expenses...</p>
                    </div>
                  ) : expenses.length === 0 ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center', background: 'rgba(255,255,255,0.01)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                      <Receipt size={32} color="rgba(255,255,255,0.2)" style={{ margin: '0 auto 12px' }} />
                      <p style={{ fontSize: '0.9rem', color: '#fff', fontWeight: '600', marginBottom: '4px' }}>No expenses recorded yet</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Text a photo of a receipt or text <em>"Spent $25 on lunch at Chipotle"</em> to get started.
                      </p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {expenses.map((exp) => (
                        <div
                          key={exp.id}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '14px 18px',
                            borderRadius: '12px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.06)',
                            gap: '12px',
                            flexWrap: 'wrap'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#10b981', fontSize: '0.95rem' }}>
                              🧾
                            </div>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontWeight: '700', color: '#fff', fontSize: '0.92rem' }}>{exp.merchant}</span>
                                <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '6px', background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', fontWeight: '600' }}>
                                  {exp.category}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                <span>{exp.date || 'Recent'}</span>
                                {exp.notes && <span> • {exp.notes}</span>}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#10b981' }}>
                              ${exp.amount.toFixed(2)}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteExpense(exp.id)}
                              className="btn-ghost"
                              style={{ padding: '6px', color: '#ef4444', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '8px' }}
                              title="Delete Expense"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TiltCard>

            </div>
          )}

          {/* TAB: EMAIL ANALYSIS (ULTRA EXCLUSIVE) */}
          {activeTab === 'email' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Feature Banner Card */}
              <TiltCard maxTilt={2}>
                <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <div style={{ padding: '10px', background: 'rgba(129, 140, 248, 0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Mail size={22} color="#818cf8" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff' }}>
                        Email Reading & AI Analysis
                      </h3>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        Connect your Gmail and Outlook inboxes to get intelligent AI email digests and instant 2FA passcode alerts over iMessage.
                      </p>
                    </div>
                  </div>

                  {/* Strict Read-Only Security Notice */}
                  <div style={{ marginTop: '16px', padding: '14px', borderRadius: '12px', background: 'rgba(52, 211, 153, 0.05)', border: '1px solid rgba(52, 211, 153, 0.2)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <ShieldCheck size={18} color="#34d399" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                      <strong style={{ color: '#34d399' }}>Read-Only Email Policy:</strong> Jorgius strictly reads and analyzes your incoming email messages to deliver instant text alerts to your iMessage thread. <strong style={{ color: '#fff' }}>No emails are ever composed or sent automatically.</strong>
                    </div>
                  </div>
                </div>
              </TiltCard>

              {/* Ultra Plan Gated Check */}
              {plan !== 'ultra' && !isAdmin ? (
                <TiltCard maxTilt={3}>
                  <div style={{ padding: '32px 24px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                      <Crown size={24} color="#f59e0b" />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
                      Ultra Exclusive Feature
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: '520px', margin: '0 auto 24px auto', lineHeight: '1.5' }}>
                      Email inbox integration, AI spam filtering, and 2FA verification passcode forwarding are exclusive to <strong>Jorgius Ultra ($4.99/mo)</strong>. Upgrade your membership to connect your mailboxes.
                    </p>
                    <a
                      href="https://buy.stripe.com/dRm5kD0uc8qIgkm1nVaVa03"
                      className="btn-ultra"
                      style={{ padding: '12px 28px', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
                    >
                      <Crown size={15} fill="#000" />
                      <span>Upgrade to Jorgius Ultra ($4.99/mo)</span>
                    </a>
                  </div>
                </TiltCard>
              ) : (
                /* Ultra / Admin Active Connect Section */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                  {/* Connected Inboxes Section */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', margin: 0 }}>
                          Connected Email Inboxes
                        </h4>
                        <span style={{ fontSize: '0.75rem', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.3)', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>
                          {connectedAccounts.length} Active
                        </span>
                      </div>
                      <button
                        onClick={() => fetchConnectedAccounts(true)}
                        disabled={loadingAccounts}
                        style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.78rem', padding: '4px 8px', borderRadius: '6px' }}
                      >
                        <RefreshCw size={13} style={{ animation: loadingAccounts ? 'spin 0.8s linear infinite' : 'none' }} />
                        <span>Refresh</span>
                      </button>
                    </div>

                    {loadingAccounts && connectedAccounts.length === 0 ? (
                      <div style={{ padding: '24px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
                        <Loader2 size={22} color="var(--accent-blue)" style={{ margin: '0 auto 8px auto', animation: 'spin 1s linear infinite' }} />
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Scanning connected accounts...</div>
                      </div>
                    ) : connectedAccounts.length > 0 ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                        {connectedAccounts.map((acc, idx) => (
                          <TiltCard key={idx} maxTilt={3}>
                            <div style={{ padding: '18px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(52, 211, 153, 0.25)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{
                                      width: '32px',
                                      height: '32px',
                                      borderRadius: '8px',
                                      background: acc.type === 'google' ? 'rgba(66, 133, 244, 0.15)' : 'rgba(0, 120, 212, 0.15)',
                                      border: `1px solid ${acc.type === 'google' ? 'rgba(66, 133, 244, 0.3)' : 'rgba(0, 120, 212, 0.3)'}`,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      fontWeight: '800',
                                      color: acc.type === 'google' ? '#4285F4' : '#0078D4',
                                      fontSize: '0.95rem'
                                    }}>
                                      {acc.type === 'google' ? 'G' : 'O'}
                                    </div>
                                    <div>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff', wordBreak: 'break-all' }}>
                                          {acc.email}
                                        </div>
                                        {acc.is_default && (
                                          <span style={{ fontSize: '0.68rem', background: 'rgba(245, 158, 11, 0.18)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.35)', padding: '1px 6px', borderRadius: '6px', fontWeight: '700' }}>
                                            ★ Default Sender
                                          </span>
                                        )}
                                      </div>
                                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                        {acc.provider || (acc.type === 'google' ? 'Gmail' : 'Outlook')}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', marginBottom: '14px' }}>
                                  {acc.needs_reconnect ? (
                                    <>
                                      <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 6px #f59e0b' }}></span>
                                      <span style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: '700' }}>Re-Auth Required</span>
                                    </>
                                  ) : (
                                    <>
                                      <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399' }}></span>
                                      <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: '600' }}>Active &amp; Syncing</span>
                                    </>
                                  )}
                                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginLeft: 'auto' }}>
                                    {acc.scopes || 'Read-Only'}
                                  </span>
                                </div>
                              </div>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {!acc.is_default && !acc.needs_reconnect && (
                                  <button
                                    onClick={() => handleSetDefaultEmail(acc.email, acc.type)}
                                    style={{
                                      padding: '6px 12px',
                                      background: 'rgba(255, 255, 255, 0.05)',
                                      border: '1px solid rgba(255, 255, 255, 0.15)',
                                      borderRadius: '8px',
                                      color: '#f8fafc',
                                      fontSize: '0.75rem',
                                      fontWeight: '600',
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '5px',
                                      transition: 'all 0.2s'
                                    }}
                                  >
                                    <span>★ Set as Default Sender</span>
                                  </button>
                                )}

                                {acc.needs_reconnect && (
                                  <a
                                    href={acc.type === 'google' ? 'https://notification-assistant.onrender.com/auth/login' : 'https://notification-assistant.onrender.com/auth/microsoft/login'}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{
                                      padding: '7px 12px',
                                      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                      borderRadius: '8px',
                                      color: '#000',
                                      fontSize: '0.78rem',
                                      fontWeight: '700',
                                      textDecoration: 'none',
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      gap: '6px'
                                    }}
                                  >
                                    <ExternalLink size={12} />
                                    <span>Re-Authorize {acc.type === 'google' ? 'Google' : 'Outlook'}</span>
                                  </a>
                                )}
                                
                                <button
                                  onClick={() => handleDisconnectAccount(acc.email, acc.type)}
                                  disabled={disconnectingEmail === acc.email}
                                  style={{
                                    padding: '7px 12px',
                                    background: 'rgba(239, 68, 68, 0.08)',
                                    border: '1px solid rgba(239, 68, 68, 0.25)',
                                    borderRadius: '8px',
                                    color: '#f87171',
                                    fontSize: '0.78rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '6px',
                                    width: '100%',
                                    transition: 'all 0.2s ease'
                                  }}
                                >
                                  {disconnectingEmail === acc.email ? (
                                    <>
                                      <Loader2 size={12} className="animate-spin" />
                                      <span>Disconnecting...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Trash2 size={12} />
                                      <span>Disconnect Mailbox</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </TiltCard>
                        ))}
                      </div>
                    ) : (
                      <div style={{ padding: '16px 20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed rgba(255,255,255,0.1)', fontSize: '0.82rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                        No mailboxes linked yet. Connect your Gmail or Outlook account below to enable automated email reading and 2FA passcode alerts.
                      </div>
                    )}
                  </div>

                  {/* Connect New Mailbox Section */}
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff', marginBottom: '12px' }}>
                      Connect New Mailbox
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                      
                      {/* Connect Gmail Account */}
                      <TiltCard maxTilt={3}>
                        <div style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(66, 133, 244, 0.1)', border: '1px solid rgba(66, 133, 244, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#4285F4', fontSize: '1rem' }}>G</div>
                              <div>
                                <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: '#fff' }}>Google Gmail</h4>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Read-Only Inbox Analysis</span>
                              </div>
                            </div>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.4' }}>
                              Authorize Jorgius to read unread Gmail messages, extract 2FA codes, and summarize important emails.
                            </p>
                          </div>
                          <a
                            href="https://notification-assistant.onrender.com/auth/login"
                            target="_blank"
                            rel="noreferrer"
                            className="btn-primary"
                            style={{ width: '100%', padding: '10px', justifyContent: 'center', fontSize: '0.84rem', gap: '6px', textDecoration: 'none', background: 'linear-gradient(135deg, #4285F4 0%, #34a853 100%)' }}
                          >
                            <span>Connect Google Account</span>
                          </a>
                        </div>
                      </TiltCard>

                      {/* Connect Outlook Account */}
                      <TiltCard maxTilt={3}>
                        <div style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0, 120, 212, 0.1)', border: '1px solid rgba(0, 120, 212, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#0078D4', fontSize: '1rem' }}>O</div>
                              <div>
                                <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: '#fff' }}>Outlook / Office 365</h4>
                                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Read-Only Inbox Analysis</span>
                              </div>
                            </div>
                            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.4' }}>
                              Connect your Microsoft Outlook or Office 365 inbox for automated unread email polling and alerts.
                            </p>
                          </div>
                          <a
                            href="https://notification-assistant.onrender.com/auth/microsoft/login"
                            target="_blank"
                            rel="noreferrer"
                            className="btn-primary"
                            style={{ width: '100%', padding: '10px', justifyContent: 'center', fontSize: '0.84rem', gap: '6px', textDecoration: 'none', background: 'linear-gradient(135deg, #0078d4 0%, #005a9e 100%)' }}
                          >
                            <span>Connect Outlook Account</span>
                          </a>
                        </div>
                      </TiltCard>

                      {/* Connect Apple iCloud Calendar */}
                      <TiltCard maxTilt={3}>
                        <div style={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>
                                  🍏
                                </div>
                                <div>
                                  <h4 style={{ fontSize: '0.92rem', fontWeight: '700', color: '#fff' }}>Apple iCloud Calendar</h4>
                                  <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>2-Way Direct CalDAV Sync</span>
                                </div>
                              </div>
                              {appleInfo.connected && (
                                <span style={{ fontSize: '0.68rem', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.3)', padding: '2px 8px', borderRadius: '8px', fontWeight: '700' }}>
                                  ✓ Connected
                                </span>
                              )}
                            </div>

                            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: '1.4' }}>
                              Directly create, reschedule, and delete events on your native iPhone, Apple Watch, and Mac Calendar in real time.
                            </p>

                            {appleInfo.connected ? (
                              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '14px' }}>
                                <div style={{ fontSize: '0.78rem', color: '#fff', fontWeight: '600', marginBottom: '4px' }}>
                                  Linked Apple ID: <span style={{ color: '#38bdf8' }}>{appleInfo.apple_id}</span>
                                </div>
                                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                                  Synced Calendars: {appleInfo.calendars?.join(', ') || 'Main, Personal'}
                                </div>
                              </div>
                            ) : (
                              <form onSubmit={handleConnectApple} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                                <div>
                                  <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                    Apple ID Email
                                  </label>
                                  <input
                                    type="email"
                                    placeholder="name@icloud.com or name@gmail.com"
                                    value={appleEmail}
                                    onChange={(e) => setAppleEmail(e.target.value)}
                                    className="form-input"
                                    style={{ width: '100%', fontSize: '0.82rem', padding: '8px 10px' }}
                                    required
                                  />
                                </div>

                                <div>
                                  <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                                    App-Specific Password
                                  </label>
                                  <input
                                    type="password"
                                    placeholder="xxxx-xxxx-xxxx-xxxx"
                                    value={applePassword}
                                    onChange={(e) => setApplePassword(e.target.value)}
                                    className="form-input"
                                    style={{ width: '100%', fontSize: '0.82rem', padding: '8px 10px' }}
                                    required
                                  />
                                </div>

                                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: '1.35' }}>
                                  🔒 Generate an App-Specific Password at <a href="https://appleid.apple.com" target="_blank" rel="noreferrer" style={{ color: '#818cf8', textDecoration: 'underline' }}>appleid.apple.com</a> under <strong>Sign-In and Security → App-Specific Passwords</strong>.
                                </div>

                                {appleMsg && (
                                  <div style={{ fontSize: '0.75rem', color: '#f87171', background: 'rgba(239,68,68,0.1)', padding: '6px 8px', borderRadius: '6px' }}>
                                    {appleMsg}
                                  </div>
                                )}

                                <button
                                  type="submit"
                                  disabled={connectingApple}
                                  className="btn-primary"
                                  style={{ width: '100%', padding: '9px', justifyContent: 'center', fontSize: '0.82rem', gap: '6px', marginTop: '4px' }}
                                >
                                  {connectingApple ? <Loader2 size={13} className="animate-spin" /> : <Calendar size={13} />}
                                  <span>{connectingApple ? 'Verifying with Apple...' : 'Connect Apple Calendar'}</span>
                                </button>
                              </form>
                            )}
                          </div>

                          {appleInfo.connected && (
                            <button
                              onClick={handleDisconnectApple}
                              disabled={connectingApple}
                              style={{
                                padding: '8px 12px',
                                background: 'rgba(239, 68, 68, 0.08)',
                                border: '1px solid rgba(239, 68, 68, 0.25)',
                                borderRadius: '8px',
                                color: '#f87171',
                                fontSize: '0.78rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px',
                                width: '100%',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              {connectingApple ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
                              <span>Disconnect Apple Calendar</span>
                            </button>
                          )}
                        </div>
                      </TiltCard>

                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB: MEMORY & KNOWLEDGE BANK */}
          {activeTab === 'knowledge' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Knowledge Bank Header Card */}
              <TiltCard maxTilt={2}>
                <div style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ padding: '12px', background: 'rgba(255,255,255,0.08)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Brain size={26} color="#fff" />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          Personal Memory & Knowledge Bank
                          <span style={{ fontSize: '0.72rem', background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8', padding: '2px 8px', borderRadius: '12px', fontWeight: '600' }}>
                            Recursive AI Active
                          </span>
                        </h3>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          Everything Jorgius has permanently learned about your VIPs, preferences, habits, and scheduling rules across iMessage & Voice Calls.
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={fetchMemories}
                        className="btn-secondary"
                        style={{ padding: '8px 12px', fontSize: '0.82rem', gap: '6px' }}
                        title="Refresh Knowledge Bank"
                      >
                        <RefreshCw size={14} className={loadingMemories ? 'animate-spin' : ''} /> Refresh
                      </button>
                      <button
                        onClick={() => setShowAddMemoryModal(true)}
                        className="btn-primary"
                        style={{ padding: '8px 14px', fontSize: '0.82rem', gap: '6px' }}
                      >
                        <Plus size={14} /> Add New Memory
                      </button>
                    </div>
                  </div>
                </div>
              </TiltCard>

              {/* Ultra Gatekeeper if not Ultra */}
              {plan !== 'ultra' && !isAdmin && (
                <TiltCard maxTilt={2}>
                  <div style={{ padding: '24px', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Lock size={22} color="#f87171" />
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff' }}>
                          Unlock Full Interactive Knowledge Bank with Jorgius Ultra
                        </h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          Ultra members can view, edit, search, and manage long-term recursive AI facts, relationships, and habits in real-time.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowCheckoutModal(true)}
                      className="btn-primary"
                      style={{ fontSize: '0.82rem', padding: '8px 16px', background: '#f59e0b', borderColor: '#f59e0b' }}
                    >
                      Upgrade to Ultra
                    </button>
                  </div>
                </TiltCard>
              )}

              {/* Search & Category Filter Bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Search memories, VIPs, preferences, or rules..."
                    value={memorySearch}
                    onChange={(e) => setMemorySearch(e.target.value)}
                    className="form-input"
                    style={{ width: '100%', fontSize: '0.85rem', paddingLeft: '14px' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {[
                    { id: 'all', label: 'All Memories' },
                    { id: 'relationship', label: '👥 Relationships' },
                    { id: 'schedule_preference', label: '⏰ Schedule' },
                    { id: 'tone_preference', label: '✍️ Tone & Style' },
                    { id: 'habit', label: '⚡ Habits' },
                    { id: 'rule', label: '🛡️ Rules' },
                    { id: 'general', label: '🧠 Facts' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setMemoryCategoryFilter(cat.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        border: '1px solid',
                        borderColor: memoryCategoryFilter === cat.id ? '#fff' : 'rgba(255,255,255,0.08)',
                        background: memoryCategoryFilter === cat.id ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.02)',
                        color: memoryCategoryFilter === cat.id ? '#fff' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Memories List / Grid */}
              {loadingMemories ? (
                <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <Loader2 size={24} className="animate-spin" style={{ margin: '0 auto 12px auto' }} />
                  <span>Loading learned facts from Knowledge Bank...</span>
                </div>
              ) : memories.length === 0 ? (
                <TiltCard maxTilt={1}>
                  <div style={{ padding: '40px', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <Brain size={36} color="rgba(255,255,255,0.2)" style={{ margin: '0 auto 12px auto' }} />
                    <h4 style={{ fontSize: '1rem', fontWeight: '700', color: '#fff', marginBottom: '6px' }}>
                      No Memories Stored Yet
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 16px auto' }}>
                      As you text or talk with Jorgius, he will automatically extract and remember key facts about you, your team, and your schedule.
                    </p>
                    <button
                      onClick={() => setShowAddMemoryModal(true)}
                      className="btn-primary"
                      style={{ fontSize: '0.82rem', padding: '8px 16px', margin: '0 auto' }}
                    >
                      <Plus size={14} /> Add First Memory Manually
                    </button>
                  </div>
                </TiltCard>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '14px' }}>
                  {memories
                    .filter((m) => {
                      if (memoryCategoryFilter !== 'all' && m.category !== memoryCategoryFilter) return false;
                      if (!memorySearch) return true;
                      const q = memorySearch.toLowerCase();
                      return (m.fact_text || '').toLowerCase().includes(q) || (m.category || '').toLowerCase().includes(q);
                    })
                    .map((m) => {
                      let catLabel = '🧠 Fact';
                      let catColor = '#38bdf8';
                      let catBg = 'rgba(56, 189, 248, 0.1)';
                      let catBorder = 'rgba(56, 189, 248, 0.25)';

                      if (m.category === 'relationship') {
                        catLabel = '👥 Relationship';
                        catColor = '#a78bfa';
                        catBg = 'rgba(167, 139, 250, 0.1)';
                        catBorder = 'rgba(167, 139, 250, 0.25)';
                      } else if (m.category === 'schedule_preference') {
                        catLabel = '⏰ Schedule';
                        catColor = '#34d399';
                        catBg = 'rgba(52, 211, 153, 0.1)';
                        catBorder = 'rgba(52, 211, 153, 0.25)';
                      } else if (m.category === 'tone_preference') {
                        catLabel = '✍️ Tone';
                        catColor = '#fbbf24';
                        catBg = 'rgba(251, 191, 36, 0.1)';
                        catBorder = 'rgba(251, 191, 36, 0.25)';
                      } else if (m.category === 'habit') {
                        catLabel = '⚡ Habit';
                        catColor = '#f472b6';
                        catBg = 'rgba(244, 114, 182, 0.1)';
                        catBorder = 'rgba(244, 114, 182, 0.25)';
                      } else if (m.category === 'rule') {
                        catLabel = '🛡️ Rule';
                        catColor = '#ef4444';
                        catBg = 'rgba(239, 68, 68, 0.1)';
                        catBorder = 'rgba(239, 68, 68, 0.25)';
                      }

                      return (
                        <div
                          key={m.id}
                          style={{
                            padding: '18px',
                            background: 'rgba(255, 255, 255, 0.02)',
                            borderRadius: '14px',
                            border: '1px solid rgba(255, 255, 255, 0.07)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '12px',
                            position: 'relative',
                            transition: 'transform 0.2s ease, border-color 0.2s ease'
                          }}
                        >
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                              <span
                                style={{
                                  fontSize: '0.72rem',
                                  padding: '2px 8px',
                                  borderRadius: '12px',
                                  fontWeight: '700',
                                  color: catColor,
                                  background: catBg,
                                  border: `1px solid ${catBorder}`
                                }}
                              >
                                {catLabel}
                              </span>

                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '0.68rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '3px' }}>
                                  <ShieldCheck size={12} /> Active Fact
                                </span>
                                <button
                                  onClick={() => handleDeleteMemory(m.id, m.fact_text)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'rgba(255, 255, 255, 0.3)',
                                    cursor: 'pointer',
                                    padding: '2px',
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.3)'}
                                  title="Delete memory"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>

                            <p style={{ fontSize: '0.88rem', color: '#fff', lineHeight: '1.45', fontWeight: '500' }}>
                              {m.fact_text}
                            </p>
                          </div>

                          {m.created_at && (
                            <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '6px' }}>
                              Learned: {m.created_at}
                            </span>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}

              {/* Add Memory Modal */}
              {showAddMemoryModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
                  <div style={{ width: '100%', maxWidth: '480px', background: '#0e1017', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '16px', padding: '26px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Brain size={18} color="#fff" /> Add Permanent Memory to Knowledge Bank
                      </h3>
                      <button onClick={() => setShowAddMemoryModal(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>
                      Add a permanent truth or instruction. Jorgius will inject this into his real-time reasoning across all conversations.
                    </p>

                    <form onSubmit={handleAddMemory} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                          Memory Category
                        </label>
                        <CustomSelect
                          value={newMemoryCategory}
                          onChange={(val) => setNewMemoryCategory(val)}
                          placeholder="Select category..."
                          options={[
                            { value: 'general', label: '🧠 Personal Fact / Background' },
                            { value: 'relationship', label: '👥 Relationship / VIP Contact' },
                            { value: 'schedule_preference', label: '⏰ Schedule / Routine Preference' },
                            { value: 'tone_preference', label: '✍️ Tone / Communication Style' },
                            { value: 'habit', label: '⚡ Daily Habit' },
                            { value: 'rule', label: '🛡️ Strict Assistant Rule' },
                          ]}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                          Fact / Memory Description
                        </label>
                        <textarea
                          placeholder="e.g. 'Justin Bender is my lead developer and co-founder' or 'Never schedule meetings before 10 AM EST'"
                          value={newMemoryText}
                          onChange={(e) => setNewMemoryText(e.target.value)}
                          className="form-input"
                          rows={3}
                          style={{ width: '100%', resize: 'vertical' }}
                          required
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
                        <button
                          type="button"
                          onClick={() => setShowAddMemoryModal(false)}
                          className="btn-secondary"
                          style={{ fontSize: '0.85rem' }}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn-primary"
                          disabled={savingMemory}
                          style={{ fontSize: '0.85rem', gap: '6px' }}
                        >
                          {savingMemory ? <Loader2 size={14} className="animate-spin" /> : <><Plus size={14} /> Save to Knowledge Bank</>}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

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
                          {plan === 'ultra' ? 'ACTIVE ($4.99/mo)' : plan === 'pro' ? 'ACTIVE ($0.99/mo)' : 'LIMITED DEMO'}
                        </span>
                      </h3>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                      {plan === 'demo' && (
                        <>
                          <button
                            onClick={() => setShowCheckoutModal(true)}
                            className="btn-primary"
                            style={{ fontSize: '0.85rem', padding: '9px 16px', gap: '8px' }}
                          >
                            <Zap size={15} /> Upgrade to Pro ($0.99/mo)
                          </button>
                          <a
                            href="https://buy.stripe.com/dRm5kD0uc8qIgkm1nVaVa03"
                            className="btn-ultra"
                            style={{ fontSize: '0.85rem', padding: '9px 16px' }}
                          >
                            <Crown size={15} fill="#000" /> Upgrade to Ultra ($4.99/mo)
                          </a>
                        </>
                      )}

                      {plan === 'pro' && (
                        <>
                          <a
                            href="https://buy.stripe.com/dRm5kD0uc8qIgkm1nVaVa03"
                            className="btn-ultra"
                            style={{ fontSize: '0.85rem', padding: '9px 16px' }}
                          >
                            <Crown size={15} fill="#000" /> Upgrade to Ultra ($4.99/mo)
                          </a>
                          <button
                            onClick={() => setShowCancelModal(true)}
                            className="btn-secondary"
                            style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', fontSize: '0.85rem', padding: '9px 16px' }}
                          >
                            <XCircle size={14} /> Downgrade to Demo / Cancel
                          </button>
                        </>
                      )}

                      {plan === 'ultra' && (
                        <>
                          <button
                            onClick={handleDowngradeToPro}
                            className="btn-secondary"
                            disabled={loading}
                            style={{ fontSize: '0.85rem', padding: '9px 16px', gap: '8px' }}
                          >
                            {loading ? <Loader2 size={14} className="animate-spin" /> : <><Zap size={14} /> Downgrade to Pro ($0.99/mo)</>}
                          </button>
                          <button
                            onClick={() => setShowCancelModal(true)}
                            className="btn-secondary"
                            style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', fontSize: '0.85rem', padding: '9px 16px' }}
                          >
                            <XCircle size={14} /> Downgrade to Demo / Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '20px' }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block' }}>Billing Cycle</span>
                      <strong style={{ fontSize: '0.92rem', color: '#fff' }}>
                        {plan === 'ultra' ? 'Monthly ($9.99/month)' : plan === 'pro' ? 'Monthly ($4.99/month)' : 'Free Tier'}
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

              {/* Lifetime & Monthly iMessage Activity Breakdown Card */}
              <TiltCard maxTilt={2}>
                <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Activity size={18} color="#fff" /> Lifetime & Monthly iMessage Analytics
                    </h3>
                    <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', padding: '3px 10px', borderRadius: '20px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }}></span> Real-Time Tracker Active
                    </span>
                  </div>

                  {/* Summary Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Lifetime iMessages</span>
                      <strong style={{ fontSize: '1.35rem', color: '#fff', fontWeight: '800' }}>
                        {userMessageStats.lifetimeTotal}
                      </strong>
                      <span style={{ fontSize: '0.7rem', color: '#10b981', display: 'block', marginTop: '2px' }}>Total Handled</span>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>User Prompts Sent</span>
                      <strong style={{ fontSize: '1.35rem', color: '#fff', fontWeight: '800' }}>
                        {userMessageStats.userSent}
                      </strong>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>Incoming to Jorgius</span>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>AI Responses</span>
                      <strong style={{ fontSize: '1.35rem', color: '#fff', fontWeight: '800' }}>
                        {userMessageStats.aiResponses}
                      </strong>
                      <span style={{ fontSize: '0.7rem', color: '#38bdf8', display: 'block', marginTop: '2px' }}>Dispatched via iMessage</span>
                    </div>

                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <span style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Avg Response Speed</span>
                      <strong style={{ fontSize: '1.35rem', color: '#a78bfa', fontWeight: '800' }}>0.8s</strong>
                      <span style={{ fontSize: '0.7rem', color: '#a78bfa', display: 'block', marginTop: '2px' }}>Ultra-Fast AI Pipeline</span>
                    </div>
                  </div>

                  {/* Monthly Breakdown Table */}
                  <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BarChart3 size={15} color="#fff" /> Monthly Usage Breakdown
                  </h4>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {userMessageStats.monthlyBreakdown.map((m, idx) => (
                      <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', padding: '12px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '130px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#fff' }}>{m.month}</span>
                          {idx === 0 && <span style={{ fontSize: '0.68rem', background: 'rgba(255, 255, 255, 0.1)', color: '#fff', padding: '1px 6px', borderRadius: '4px' }}>Current</span>}
                        </div>
                        
                        <div style={{ flex: 1, minWidth: '150px', maxWidth: '300px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                            <span>{m.count} Messages</span>
                            <span>{plan === 'demo' ? `${Math.min(m.count, 10)}/10 Trial Limit` : 'Unlimited'}</span>
                          </div>
                          <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${plan === 'demo' ? Math.min((m.count / 10) * 100, 100) : Math.min((m.count / 300) * 100, 100)}%`, height: '100%', background: idx === 0 ? 'linear-gradient(90deg, #fff 0%, #38bdf8 100%)' : 'rgba(255,255,255,0.3)', borderRadius: '3px' }} />
                          </div>
                        </div>

                        <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#fff', minWidth: '80px', textAlign: 'right' }}>
                          {m.count} Total
                        </div>
                      </div>
                    ))}
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
                        <strong style={{ color: '#fff' }}>$0.99 / mo</strong>
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
                        {loading ? <Loader2 size={16} className="animate-spin" /> : 'Confirm & Proceed to Stripe Payment'}
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
                      Your subscription status will update immediately and future recurring billing will stop.
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

          {/* TAB: INVITE USERS & REFERRALS */}
          {activeTab === 'invite' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Promo Banner Card */}
              <TiltCard maxTilt={2}>
                <div style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    <div style={{ padding: '10px', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Gift size={22} color="#fff" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff' }}>
                        Invite Friends, Get Free Months!
                      </h3>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        For every friend who signs up for a paid plan using your referral, you get <strong>1 Month Free</strong> of Jorgius!
                      </p>
                    </div>
                  </div>
                </div>
              </TiltCard>

              {/* Grid with iMessage Invite and Link Copy */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                
                {/* Send iMessage Invite Card */}
                <TiltCard maxTilt={3}>
                  <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '14px', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Send size={16} color="#fff" /> Send Instant iMessage Invite
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                        Enter a friend's phone number below. Jorgius will text them an iMessage with your personal signup link.
                      </p>

                      <form onSubmit={handleSendUserInvite} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                            Friend's iMessage Phone Number
                          </label>
                          <input
                            type="tel"
                            placeholder="(555) 000-0000"
                            value={invitePhone}
                            onChange={(e) => setInvitePhone(formatPhoneNumber(e.target.value))}
                            className="form-input"
                            style={{ width: '100%', fontSize: '1rem' }}
                            maxLength={14}
                            required
                          />
                        </div>

                        <button type="submit" className="btn-primary" disabled={inviteSending} style={{ width: '100%', padding: '10px', fontSize: '0.85rem', marginTop: '4px', gap: '8px' }}>
                          {inviteSending ? <Loader2 size={14} className="animate-spin" /> : <><Send size={14} /> Send iMessage Invite</>}
                        </button>
                      </form>
                    </div>
                  </div>
                </TiltCard>

                {/* Personal Referral Link Card */}
                <TiltCard maxTilt={3}>
                  <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '14px', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Copy size={16} color="#fff" /> Copy Referral Link
                      </h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                        Share your unique referral link anywhere to give friends access to Jorgius.
                      </p>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          readOnly
                          value={`https://jorgius.com/?ref=${user?.id ? user.id.slice(0, 8) : 'vip'}`}
                          className="form-input"
                          style={{ width: '100%', fontSize: '0.82rem', background: 'rgba(255,255,255,0.03)' }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(`https://jorgius.com/?ref=${user?.id ? user.id.slice(0, 8) : 'vip'}`);
                            setCopiedRef(true);
                            setTimeout(() => setCopiedRef(false), 3000);
                          }}
                          className="btn-secondary"
                          style={{ padding: '10px 14px', fontSize: '0.82rem', whiteSpace: 'nowrap', gap: '6px' }}
                        >
                          {copiedRef ? <><Check size={14} color="#4ade80" /> Copied!</> : <><Copy size={14} /> Copy</>}
                        </button>
                      </div>
                    </div>

                    <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block' }}>Invites Sent</span>
                        <strong style={{ fontSize: '1rem', color: '#fff' }}>0</strong>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block' }}>Free Months Earned</span>
                        <strong style={{ fontSize: '1rem', color: '#4ade80' }}>0 Months</strong>
                      </div>
                    </div>
                  </div>
                </TiltCard>

              </div>
            </div>
          )}

          {/* TAB 5: HELP & SUPPORT */}
          {activeTab === 'support' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
          )}

          {/* TAB 6: CUSTOM INTEGRATIONS */}
          {activeTab === 'integrations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <TiltCard maxTilt={3}>
                <div style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '16px', color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Cpu size={18} /> Request Custom Integration
                  </h3>

                  {plan !== 'ultra' && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.08)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '20px', fontSize: '0.82rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertCircle size={16} />
                      <span>Custom Integrations requests are exclusive to <strong>Jorgius Ultra</strong> members. Please upgrade to Ultra plan to request custom developer hookups.</span>
                    </div>
                  )}

                  <form onSubmit={handleSendIntegrationRequest} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      Describe the service, API, or custom flow you want Jorgius to integrate with:
                    </label>
                    <textarea
                      placeholder={plan === 'ultra' ? "Describe the integration you need (e.g. connecting to Slack, custom CRM webhook, or specific stock API)..." : "Upgrade to Jorgius Ultra plan to request custom integrations."}
                      value={integrationMsg}
                      onChange={(e) => setIntegrationMsg(e.target.value)}
                      className="form-input"
                      rows={6}
                      style={{ width: '100%', resize: 'none' }}
                      required
                      disabled={plan !== 'ultra'}
                    />

                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={loading || plan !== 'ultra'}
                      style={{
                        alignSelf: 'flex-end',
                        fontSize: '0.85rem',
                        background: plan !== 'ultra' ? 'rgba(255, 255, 255, 0.04)' : undefined,
                        borderColor: plan !== 'ultra' ? 'rgba(255, 255, 255, 0.08)' : undefined,
                        color: plan !== 'ultra' ? 'rgba(255,255,255,0.2)' : undefined,
                        cursor: plan !== 'ultra' ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {loading ? <Loader2 size={14} className="animate-spin" /> : 'Request Custom Integration'}
                    </button>
                  </form>
                </div>
              </TiltCard>
            </div>
          )}

          {/* TAB 4: ADMIN VIEW USERS & MESSAGING */}
          {activeTab === 'users' && isAdmin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Admin iMessage Invite Card */}
              <TiltCard maxTilt={2}>
                <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#fff', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <UserPlus size={18} color="#fff" /> Invite User to Sign Up & Create Account via iMessage
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    Send an official iMessage invitation from Jorgius with the signup link directly to a new user's phone number.
                  </p>

                  <form onSubmit={handleSendAdminInvite} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div style={{ flex: 1, minWidth: '240px' }}>
                      <input
                        type="tel"
                        placeholder="Enter phone number (555) 000-0000"
                        value={adminInvitePhone}
                        onChange={(e) => setAdminInvitePhone(formatPhoneNumber(e.target.value))}
                        className="form-input"
                        style={{ width: '100%', fontSize: '0.92rem' }}
                        maxLength={14}
                        required
                      />
                    </div>
                    <button type="submit" className="btn-primary" disabled={inviteSending} style={{ fontSize: '0.85rem', padding: '10px 20px', gap: '8px' }}>
                      {inviteSending ? <Loader2 size={14} className="animate-spin" /> : <><Send size={14} /> Send iMessage Signup Invite</>}
                    </button>
                  </form>
                </div>
              </TiltCard>

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
                        <CustomSelect
                          value={adminMsgPhone}
                          onChange={(val) => setAdminMsgPhone(val)}
                          placeholder="-- Choose Authorized User --"
                          options={[
                            { value: '', label: '-- Choose Authorized User --' },
                            ...allUsers.map((u) => {
                              const p = u.user_metadata?.phone_number || '';
                              const un = u.user_metadata?.username || u.email;
                              return {
                                value: p || u.email,
                                label: `${un} (${p || u.email})`,
                              };
                            })
                          ]}
                        />
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
                        <CustomSelect
                          value={editPlan}
                          onChange={(val) => setEditPlan(val)}
                          options={[
                            { value: 'demo', label: 'Demo Plan' },
                            { value: 'pro', label: 'Pro Plan' },
                            { value: 'ultra', label: 'Ultra Plan' },
                          ]}
                        />
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

          {/* TAB: ADMIN SYSTEM STATUS EDITOR */}
          {activeTab === 'status' && isAdmin && (
            <AdminPanel embedded={true} />
          )}

        </div>
      </main>

    </div>
  );
}
