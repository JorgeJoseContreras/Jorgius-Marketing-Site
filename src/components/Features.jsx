import React from 'react';
import TiltCard from './TiltCard';
import { 
  Calendar,
  Plane,
  Phone,
  Brain,
  BookOpen,
  Key,
  Package,
  Camera,
  Mic,
  Sparkles,
  CheckSquare,
  TrendingUp,
  Clock,
  Sliders,
  Send,
  Globe
} from 'lucide-react';

const FEATURES_DATA = [
  {
    icon: <Calendar size={18} color="#ffffff" />,
    title: '2-Way Apple Calendar Sync',
    desc: 'Zero-click scheduling, rescheduling, and precision deletion directly in your iPhone, Apple Watch, and Mac Calendar via CalDAV.',
    tag: 'iCloud CalDAV',
  },
  {
    icon: <Plane size={18} color="#ffffff" />,
    title: 'Smart Flight & Travel Radar',
    desc: 'Register any flight with automated 24-hr check-in alerts with direct airline links, 3-hr departure countdowns, and live gate tracking.',
    tag: 'Flight Radar',
  },
  {
    icon: <Phone size={18} color="#ffffff" />,
    title: 'Ultra-Low Latency Voice Calls',
    desc: 'Call your assistant anytime for instant hands-free voice intelligence (<500ms latency) with full audio recordings and searchable transcripts.',
    tag: 'Voice Calling',
  },
  {
    icon: <Brain size={18} color="#ffffff" />,
    title: 'Personal Knowledge Bank',
    desc: 'Recursive long-term memory permanently storing your VIP contacts, habits, preferences, and custom scheduling rules across chats and calls.',
    tag: 'Permanent Memory',
  },
  {
    icon: <BookOpen size={18} color="#ffffff" />,
    title: 'Contact Directory & Dossiers',
    desc: 'Save private contacts and generate comprehensive dossiers compiling recent email threads, reminders, and historical chat mentions.',
    tag: 'Private Directory',
  },
  {
    icon: <Key size={18} color="#ffffff" />,
    title: 'Instant 2FA Code Relay',
    desc: 'Two-factor verification codes received in your Gmail or Outlook mailboxes are automatically parsed and texted to your phone in real time.',
    tag: '2FA Relay',
  },
  {
    icon: <Package size={18} color="#ffffff" />,
    title: 'Package & Shipping Watchdog',
    desc: 'Snap a picture of a shipping label or text a tracking number (USPS, UPS, FedEx, DHL) for automated milestone alerts until delivery.',
    tag: 'Live Tracking',
  },
  {
    icon: <Camera size={18} color="#ffffff" />,
    title: 'Multimodal Vision AI',
    desc: 'Turn photos of event flyers into calendar invites, screenshots of bills into payment reminders, and receipts into organized logs.',
    tag: 'Vision AI',
  },
  {
    icon: <Mic size={18} color="#ffffff" />,
    title: 'Voice Memo Transcription',
    desc: 'Send voice messages or audio recordings in iMessage; Jorgius listens, transcribes, and executes reminders, to-dos, or emails on the fly.',
    tag: 'Audio AI',
  },
  {
    icon: <Sparkles size={18} color="#ffffff" />,
    title: 'Tapback Reactions & Inline GIFs',
    desc: 'Sends native Apple Messages tapbacks (laugh, love, emphasize) and searches Giphy for animated inline stickers and memes.',
    tag: 'Native iMessage',
  },
  {
    icon: <CheckSquare size={18} color="#ffffff" />,
    title: 'Isolated Personal To-Do Lists',
    desc: 'Private, user-isolated task checklists managed entirely via text—add, list, complete, and delete action items without extra apps.',
    tag: 'Task Manager',
  },
  {
    icon: <TrendingUp size={18} color="#ffffff" />,
    title: 'Stock & Crypto Watchdogs',
    desc: 'Set real-time stock/crypto price trigger alerts and run instant Discounted Cash Flow (DCF) intrinsic valuation models in chat.',
    tag: 'Market Intelligence',
  },
  {
    icon: <Clock size={18} color="#ffffff" />,
    title: 'Daily Morning Briefings',
    desc: 'Receive an automated 8:00 AM daily briefing featuring local weather forecasts, today’s schedule, and pending to-do priorities.',
    tag: 'Daily Digest',
  },
  {
    icon: <Sliders size={18} color="#ffffff" />,
    title: 'Custom Personality Modes',
    desc: 'Switch seamlessly between Gangster, Executive Assistant, Keep It Short, Gen Z, Sarcastic, or Default personality talking styles.',
    tag: 'Personalized AI',
  },
  {
    icon: <Send size={18} color="#ffffff" />,
    title: 'Smart Message Relay',
    desc: 'Relay text messages to friends and business partners through Jorgius, perfectly matching your unique slang, humor, and energy.',
    tag: 'Tone Matching',
  },
  {
    icon: <Globe size={18} color="#ffffff" />,
    title: 'Autonomous Web Builder',
    desc: 'Build, style, and deploy full HTML/CSS/JS websites published instantly to GitHub Pages with live shareable links.',
    tag: 'Instant Deploy',
  },
];

export default function Features() {
  return (
    <section id="features" style={{ padding: '60px 20px', maxWidth: '1240px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)', fontWeight: '800', fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>
          Engineered for <span className="text-shimmer">Ultimate Autonomous Utility</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '580px', margin: '0 auto', lineHeight: '1.5' }}>
          Explore the complete suite of autonomous capabilities running directly inside your iMessage thread and voice calls.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '18px',
        }}
      >
        {FEATURES_DATA.map((feat, i) => (
          <TiltCard key={i} maxTilt={5} className="features-grid-card">
            <div style={{ padding: '22px 20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {feat.icon}
                  </div>
                  <span
                    style={{
                      fontSize: '0.66rem',
                      fontWeight: '700',
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      padding: '3px 10px',
                      borderRadius: '9999px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    {feat.tag}
                  </span>
                </div>

                <h3
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    color: '#f8fafc',
                    marginBottom: '8px',
                    fontFamily: 'var(--font-heading)',
                  }}
                  className="hover-glow-text"
                >
                  {feat.title}
                </h3>
              </div>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.84rem', lineHeight: '1.5', marginTop: '4px' }}>
                {feat.desc}
              </p>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
