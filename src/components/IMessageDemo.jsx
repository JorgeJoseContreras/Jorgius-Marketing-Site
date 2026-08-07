import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, CheckCheck, RefreshCw } from 'lucide-react';

const PRESET_PROMPTS = [
  {
    id: 1,
    title: '📅 Smart Scheduling',
    userMsg: 'Set up a quick sync with Alex for tomorrow at 3 PM and add it to my calendar',
    aiReply: 'Done! Created calendar event "Quick Sync with Alex" for tomorrow at 3:00 PM. I\'ve sent you a confirmation.',
  },
  {
    id: 2,
    title: '🔍 Instant Web Search',
    userMsg: 'Find top-rated sushi spots near downtown open right now',
    aiReply: 'Found 2 top spots open now:\n📍 Omakase Club (4.9★) - 0.4 mi away\n📍 Sakura Bistro (4.7★) - 0.8 mi away\nWould you like me to book a table?',
  },
  {
    id: 3,
    title: '🔔 Set Reminder',
    userMsg: 'Remind me to call Mom when I get home',
    aiReply: 'Set! I\'ll send you an iMessage reminder to call Mom as soon as your location updates to home.',
  },
  {
    id: 4,
    title: '💡 General Q&A',
    userMsg: 'Explain quantum computing in one simple sentence',
    aiReply: 'Quantum computing is a type of computing that uses quantum mechanics to solve complex problems much faster than regular computers.',
  },
];

export default function IMessageDemo() {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hey Jorge! 👋 I’m Jorgius, your personal AI assistant. You can text me right here on iMessage. How can I help you today?',
      time: '10:42 AM',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const chatBodyRef = useRef(null);

  const scrollToBottom = () => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handlePromptClick = (prompt) => {
    if (isTyping) return;

    const userMessage = {
      sender: 'user',
      text: prompt.userMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

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
    }, 1200);
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
          text: `I'm on it! Handling "${userText}" directly in your thread.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1000);
  };

  const handleReset = () => {
    setMessages([
      {
        sender: 'ai',
        text: 'Hey Jorge! 👋 I’m Jorgius, your personal AI assistant. You can text me right here on iMessage. How can I help you today?',
        time: '10:42 AM',
      },
    ]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', width: '100%' }}>
      {/* Interactive Prompt Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', maxWidth: '500px' }}>
        {PRESET_PROMPTS.map((p) => (
          <button key={p.id} onClick={() => handlePromptClick(p)} className="prompt-pill">
            {p.title}
          </button>
        ))}
        <button
          onClick={handleReset}
          className="prompt-pill"
          style={{ background: 'rgba(255, 255, 255, 0.08)', borderColor: 'rgba(255, 255, 255, 0.2)', color: '#fff' }}
        >
          <RefreshCw size={11} style={{ display: 'inline', marginRight: '4px' }} /> Reset
        </button>
      </div>

      {/* Phone UI Frame */}
      <div className="iphone-frame">
        <div className="iphone-notch" />
        
        {/* iMessage Header */}
        <div className="imessage-header">
          <div className="imessage-avatar">J</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Jorgius <Sparkles size={12} color="#ffffff" />
            </div>
            <div style={{ fontSize: '0.72rem', color: '#8e8e93', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#8e8e93', display: 'inline-block' }} />
              iMessage Contact • Active
            </div>
          </div>
          <div style={{ color: '#007aff', fontSize: '0.82rem', fontWeight: '600' }}>
            Details
          </div>
        </div>

        {/* Message Feed */}
        <div className="imessage-body" ref={chatBodyRef}>
          <div style={{ textAlign: 'center', fontSize: '0.68rem', color: '#48484a', margin: '4px 0' }}>
            iMessage with Jorgius
          </div>

          {messages.map((m, idx) => (
            <div key={idx} className={`bubble ${m.sender === 'user' ? 'bubble-user' : 'bubble-ai'}`}>
              <div style={{ whiteSpace: 'pre-line' }}>{m.text}</div>
              <div style={{ fontSize: '0.6rem', opacity: 0.6, textAlign: 'right', marginTop: '2px' }}>
                {m.time} {m.sender === 'user' && <CheckCheck size={10} style={{ display: 'inline', marginLeft: '2px' }} />}
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
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleCustomSend}
          style={{
            padding: '8px 12px 16px 12px',
            background: '#16161a',
            borderTop: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
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
              padding: '8px 14px',
              color: '#fff',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#ffffff',
              border: 'none',
              color: '#000000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Send size={14} color="#000" />
          </button>
        </form>
      </div>
    </div>
  );
}
