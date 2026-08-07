import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, CheckCheck, RefreshCw, Zap } from 'lucide-react';

const PRESET_PROMPTS = [
  {
    id: 1,
    title: '📅 Smart Scheduling',
    userMsg: 'Set up a quick sync with Alex for tomorrow at 3 PM and add it to my calendar',
    aiReply: 'Done! Created calendar event "Quick Sync with Alex" for tomorrow, Aug 7 at 3:00 PM. I\'ve also sent Alex an iMessage invite link.',
  },
  {
    id: 2,
    title: '📝 Summarize Group Chat',
    userMsg: 'Summarize the last 20 messages from the Product Team group chat',
    aiReply: 'Key updates from Product Team:\n1. Beta v2.4 launch moved to Thursday.\n2. Design approved the new 3D card layout.\n3. Marcus is handling API key setup.',
  },
  {
    id: 3,
    title: '🔍 Instant Web Search',
    userMsg: 'Find top-rated sushi spots near downtown open right now with outdoor seating',
    aiReply: 'Found 2 top spots open now:\n📍 Omakase Club (4.9★) - 0.4 mi away (Patio open)\n📍 Sakura Bistro (4.7★) - 0.8 mi away\nWant me to reserve a table?',
  },
  {
    id: 4,
    title: '🎨 AI Image Generation',
    userMsg: 'Generate a futuristic cyberpunk poster logo concept for a space event',
    aiReply: '✨ Generated high-res concept artwork directly for your iMessage preview! Tap to expand or send to your design channel.',
  },
];

export default function IMessageDemo() {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hey Jorge! 👋 I’m Jorgius, your personal AI assistant. You can text me anytime in iMessage or add me to group chats. What can I help you with today?',
      time: '10:42 AM',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const chatBottomRef = useRef(null);

  const scrollToBottom = () => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handlePromptClick = (prompt) => {
    if (isTyping) return;

    // Append user message
    const userMessage = {
      sender: 'user',
      text: prompt.userMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI thinking and typing response
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: prompt.aiReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1400);
  };

  const handleCustomSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim() || isTyping) return;

    const userText = inputVal;
    setInputVal('');

    setMessages((prev) => [
      ...prev,
      {
        sender: 'user',
        text: userText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `I'm on it! Operating right inside iMessage to handle "${userText}".`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  const handleReset = () => {
    setMessages([
      {
        sender: 'ai',
        text: 'Hey Jorge! 👋 I’m Jorgius, your personal AI assistant. You can text me anytime in iMessage or add me to group chats. What can I help you with today?',
        time: '10:42 AM',
      },
    ]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', width: '100%' }}>
      {/* Interactive Prompt Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', maxWidth: '600px' }}>
        {PRESET_PROMPTS.map((p) => (
          <button key={p.id} onClick={() => handlePromptClick(p)} className="prompt-pill">
            {p.title}
          </button>
        ))}
        <button
          onClick={handleReset}
          className="prompt-pill"
          style={{ background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#fca5a5' }}
        >
          <RefreshCw size={12} style={{ display: 'inline', marginRight: '4px' }} /> Reset Demo
        </button>
      </div>

      {/* Phone UI Frame */}
      <div className="iphone-frame">
        <div className="iphone-notch" />
        
        {/* iMessage Header */}
        <div className="imessage-header">
          <div className="imessage-avatar">J</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '700', fontSize: '0.95rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
              Jorgius AI <Sparkles size={14} color="#06b6d4" />
            </div>
            <div style={{ fontSize: '0.75rem', color: '#34d399', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
              iMessage Contact • Active
            </div>
          </div>
          <div style={{ color: '#007aff', fontSize: '0.85rem', fontWeight: '600' }}>
            Details
          </div>
        </div>

        {/* Message Feed */}
        <div className="imessage-body">
          <div style={{ textAlign: 'center', fontSize: '0.7rem', color: '#64748b', margin: '8px 0' }}>
            iMessage with Jorgius AI
          </div>

          {messages.map((m, idx) => (
            <div key={idx} className={`bubble ${m.sender === 'user' ? 'bubble-user' : 'bubble-ai'}`}>
              <div style={{ whiteSpace: 'pre-line' }}>{m.text}</div>
              <div style={{ fontSize: '0.65rem', opacity: 0.7, textAlign: 'right', marginTop: '4px' }}>
                {m.time} {m.sender === 'user' && <CheckCheck size={12} style={{ display: 'inline', marginLeft: '2px' }} />}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="bubble bubble-ai">
              <div className="typing-dots">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleCustomSend}
          style={{
            padding: '10px 14px 20px 14px',
            background: '#16161a',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <input
            type="text"
            placeholder="iMessage Jorgius..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            style={{
              flex: 1,
              background: '#26262a',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              padding: '10px 16px',
              color: '#fff',
              fontSize: '0.9rem',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#007aff',
              border: 'none',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
