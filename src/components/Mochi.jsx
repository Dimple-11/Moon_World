import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MessageCircle, X, Send, RotateCcw, Heart, Bot, Volume2, ChevronDown, Minimize2 } from 'lucide-react';

// Highly expressive, bespoke original anime cat SVG vector for Mochi
function MochiAvatarSVG({ state = 'idle', size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mochi-svg mochi-state-${state}`}>
      <defs>
        {/* Soft fur gradients */}
        <linearGradient id="mochiFur" x1="20" y1="10" x2="80" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="85%" stopColor="#F9F4FC" />
          <stop offset="100%" stopColor="#EADFF4" />
        </linearGradient>
        <linearGradient id="mochiEarPink" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFA6C9" />
          <stop offset="100%" stopColor="#F7729C" />
        </linearGradient>
        <linearGradient id="mochiRibbon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#B39DDB" />
          <stop offset="100%" stopColor="#8E24AA" />
        </linearGradient>
        <radialGradient id="mochiBlush" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FF94B8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#FF94B8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mochiEyeIris" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6C5CE7" />
          <stop offset="60%" stopColor="#9C27B0" />
          <stop offset="100%" stopColor="#FF70A6" />
        </linearGradient>
      </defs>

      {/* Fluffy tail (wags in idle & happy) */}
      <path
        d="M 22 75 C 10 70 4 55 12 46 C 18 39 25 45 22 56 C 20 63 24 68 28 72 Z"
        fill="url(#mochiFur)"
        stroke="#E2D4F0"
        strokeWidth="1.5"
        className="mochi-tail-wag"
      />

      {/* Main Body */}
      <ellipse cx="50" cy="65" rx="30" ry="24" fill="url(#mochiFur)" stroke="#E5D8F0" strokeWidth="1.5" />

      {/* Left Ear */}
      <path d="M 25 40 Q 18 12 36 22 Z" fill="url(#mochiFur)" stroke="#E5D8F0" strokeWidth="1.5" />
      <path d="M 27 36 Q 22 18 34 25 Z" fill="url(#mochiEarPink)" opacity="0.9" />

      {/* Right Ear */}
      <path d="M 75 40 Q 82 12 64 22 Z" fill="url(#mochiFur)" stroke="#E5D8F0" strokeWidth="1.5" />
      <path d="M 73 36 Q 78 18 66 25 Z" fill="url(#mochiEarPink)" opacity="0.9" />

      {/* Head with soft fluffy cheeks */}
      <path
        d="M 24 48 C 22 36 34 26 50 26 C 66 26 78 36 76 48 C 80 54 78 62 70 65 C 60 68 40 68 30 65 C 22 62 20 54 24 48 Z"
        fill="url(#mochiFur)"
        stroke="#E2D4F0"
        strokeWidth="1.5"
      />

      {/* Cheek Blush */}
      <circle cx="31" cy="54" r="7" fill="url(#mochiBlush)" />
      <circle cx="69" cy="54" r="7" fill="url(#mochiBlush)" />

      {/* Expression Variations */}
      {state === 'sleeping' ? (
        // Sleeping crescent eyes
        <g stroke="#5B4A78" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M 33 48 Q 40 54 45 49" />
          <path d="M 55 49 Q 60 54 67 48" />
        </g>
      ) : state === 'happy' ? (
        // Joyful smiling arcs
        <g stroke="#5B4A78" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M 33 50 Q 39 43 45 50" />
          <path d="M 55 50 Q 61 43 67 50" />
        </g>
      ) : state === 'thinking' ? (
        // One curious eyebrow raised, looking up
        <g>
          <ellipse cx="39" cy="46" rx="5" ry="6" fill="url(#mochiEyeIris)" />
          <circle cx="37" cy="44" r="2.2" fill="#FFFFFF" />
          <ellipse cx="61" cy="45" rx="5" ry="6" fill="url(#mochiEyeIris)" />
          <circle cx="59" cy="43" r="2.2" fill="#FFFFFF" />
          <path d="M 35 39 Q 40 37 45 40" stroke="#5B4A78" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>
      ) : (
        // Classic large expressive anime eyes with light reflections
        <g>
          {/* Left Eye */}
          <ellipse cx="38" cy="48" rx="6" ry="7.5" fill="url(#mochiEyeIris)" />
          <circle cx="36" cy="45" r="2.5" fill="#FFFFFF" />
          <circle cx="41" cy="51" r="1.2" fill="#FFFFFF" />
          {/* Right Eye */}
          <ellipse cx="62" cy="48" rx="6" ry="7.5" fill="url(#mochiEyeIris)" />
          <circle cx="60" cy="45" r="2.5" fill="#FFFFFF" />
          <circle cx="65" cy="51" r="1.2" fill="#FFFFFF" />
          {/* Lashes */}
          <path d="M 32 44 Q 38 41 44 44" stroke="#483463" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M 56 44 Q 62 41 68 44" stroke="#483463" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>
      )}

      {/* Tiny Cat Nose */}
      <path d="M 49 53 L 51 53 L 50 54.5 Z" fill="#E887A9" />

      {/* Mouth */}
      {state === 'talking' ? (
        // Open chatting mouth
        <path d="M 47 55 Q 50 60 53 55 Z" fill="#FF8BA7" stroke="#6C4A78" strokeWidth="1.2" />
      ) : (
        // Classic cute cat :3 mouth
        <path d="M 46 55 Q 48 57 50 55 Q 52 57 54 55" stroke="#5B4A78" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      )}

      {/* Whiskers */}
      <line x1="22" y1="51" x2="14" y2="49" stroke="#B8A4D1" strokeWidth="1" strokeLinecap="round" />
      <line x1="22" y1="55" x2="13" y2="56" stroke="#B8A4D1" strokeWidth="1" strokeLinecap="round" />
      <line x1="78" y1="51" x2="86" y2="49" stroke="#B8A4D1" strokeWidth="1" strokeLinecap="round" />
      <line x1="78" y1="55" x2="87" y2="56" stroke="#B8A4D1" strokeWidth="1" strokeLinecap="round" />

      {/* Lavender Silk Ribbon / Bow under chin */}
      <g transform="translate(50, 67)">
        {/* Left bow wing */}
        <path d="M 0 0 C -8 -6 -14 0 -8 4 C -3 6 0 0 0 0 Z" fill="url(#mochiRibbon)" />
        {/* Right bow wing */}
        <path d="M 0 0 C 8 -6 14 0 8 4 C 3 6 0 0 0 0 Z" fill="url(#mochiRibbon)" />
        {/* Golden bell or gem in center */}
        <circle cx="0" cy="2" r="3.2" fill="#FFD54F" stroke="#FFA000" strokeWidth="0.8" />
        <circle cx="-0.8" cy="1.2" r="0.9" fill="#FFFDE7" />
      </g>

      {/* Cute Front Paws */}
      <ellipse cx="40" cy="74" rx="4.5" ry="3.5" fill="#FFFFFF" stroke="#E2D4F0" strokeWidth="1.2" />
      <ellipse cx="60" cy="74" rx="4.5" ry="3.5" fill="#FFFFFF" stroke="#E2D4F0" strokeWidth="1.2" />
    </svg>
  );
}

const DEFAULT_QUESTIONS = [
  "What is Dimple's tech stack?",
  "Tell me about her InnoVortex project",
  "Where does she study?",
  "What was her role at Aevona?",
  "Has she written any blogs?",
  "How can I contact or hire her?"
];

export default function Mochi() {
  const [isOpen, setIsOpen] = useState(false);
  const [bubbleText, setBubbleText] = useState("Nyaa~! Welcome to Dimple's World! Click me to chat! ✨");
  const [showBubble, setShowBubble] = useState(true);
  const [catState, setCatState] = useState('idle'); // 'idle' | 'happy' | 'thinking' | 'talking' | 'sleeping'
  const [messages, setMessages] = useState([
    {
      sender: 'mochi',
      text: "Nyaa~! I'm **Mochi**, Dimple's official AI anime cat companion! 🌸 Ask me anything about her projects, machine learning models, IGDTUW journey, or technical skills!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Playful spontaneous speech bubbles when collapsed
  useEffect(() => {
    if (isOpen) return;

    const playfulThoughts = [
      "Did you check out her 145-frame hero character? 🐾",
      "InnoVortex 2024 Top 10 Finalist! Ask me about it! 🏆",
      "Purrr... Dimple's code is written with so much love! ✨",
      "Ask me anything about her AI & Full-Stack projects! 🌸",
      "Nyaa~ feeling curious today? Let's chat! ฅ^•ﻌ•^ฅ"
    ];

    const interval = setInterval(() => {
      const randomThought = playfulThoughts[Math.floor(Math.random() * playfulThoughts.length)];
      setBubbleText(randomThought);
      setShowBubble(true);
      setCatState('happy');

      setTimeout(() => {
        setCatState('idle');
      }, 2000);

      setTimeout(() => {
        setShowBubble(false);
      }, 7000);
    }, 24000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      setCatState('happy');
      setTimeout(() => setCatState('idle'), 1500);
    }
  }, [isOpen]);

  // Send message to backend Gemini AI
  const handleSend = async (textToSend) => {
    const text = (textToSend || inputVal).trim();
    if (!text || isTyping) return;

    const userMsg = {
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);
    setCatState('thinking');

    try {
      const response = await fetch('/api/ai/mochi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6).map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
          }))
        })
      });

      const data = await response.json();
      setCatState('talking');

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'mochi',
            text: data.reply || "Nyaa~! I couldn't catch that, but I'm always happy to talk about Dimple's work!",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
        setIsTyping(false);
        setCatState('happy');
        setTimeout(() => setCatState('idle'), 2500);
      }, 400);
    } catch (err) {
      console.error('Mochi chat error:', err);
      setIsTyping(false);
      setCatState('idle');
      setMessages((prev) => [
        ...prev,
        {
          sender: 'mochi',
          text: "Nyaa~ my little paws had trouble reaching the cloud, but I'm still right here! Dimple is an IT student at IGDTUW building intelligent AI systems! What else would you like to know? 🐾",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        sender: 'mochi',
        text: "Conversation refreshed! ✨ What would you like to explore next about Dimple's work?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="mochi-root-container">
      {/* =========================================================
          COLLAPSED FLOATING AVATAR & SPEECH BUBBLE
          ========================================================= */}
      {!isOpen && (
        <div className="mochi-floating-anchor">
          {/* Spontaneous Speech Bubble */}
          {showBubble && (
            <div className="mochi-speech-bubble" onClick={() => setIsOpen(true)}>
              <span className="mochi-bubble-text">{bubbleText}</span>
              <div className="mochi-bubble-arrow" />
            </div>
          )}

          {/* Interactive Anime Cat Button */}
          <button
            className="mochi-trigger-character"
            onClick={() => {
              setIsOpen(true);
              setShowBubble(false);
            }}
            aria-label="Chat with Mochi, Dimple's AI cat companion"
            title="Chat with Mochi ✨"
          >
            <div className="mochi-avatar-glow" />
            <MochiAvatarSVG state={catState} size={70} />
            <div className="mochi-online-ping" title="Mochi is online" />
          </button>
        </div>
      )}

      {/* =========================================================
          EXPANDED PREMIUM CONVERSATIONAL PANEL
          ========================================================= */}
      {isOpen && (
        <div className="mochi-chat-window-premium">
          {/* Header */}
          <div className="mochi-panel-header">
            <div className="mochi-header-left">
              <div className="mochi-header-avatar-box">
                <MochiAvatarSVG state={catState} size={42} />
                <span className="mochi-header-online-dot" />
              </div>
              <div className="mochi-header-info">
                <div className="mochi-header-name">
                  <span>Mochi</span>
                  <span className="mochi-badge-ai">AI Companion</span>
                </div>
                <div className="mochi-header-sub">Dimple's Virtual Cat · Online</div>
              </div>
            </div>

            <div className="mochi-header-actions">
              <button
                className="mochi-icon-btn"
                onClick={handleClearChat}
                title="Restart conversation"
                aria-label="Restart conversation"
              >
                <RotateCcw size={15} />
              </button>
              <button
                className="mochi-icon-btn"
                onClick={() => setIsOpen(false)}
                title="Minimize chat"
                aria-label="Minimize chat"
              >
                <Minimize2 size={16} />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="mochi-messages-stream">
            {messages.map((msg, idx) => (
              <div key={idx} className={`mochi-message-row is-${msg.sender}`}>
                {msg.sender === 'mochi' && (
                  <div className="mochi-msg-avatar">
                    <MochiAvatarSVG state={idx === messages.length - 1 ? catState : 'idle'} size={28} />
                  </div>
                )}
                <div className="mochi-msg-bubble-wrap">
                  <div className="mochi-msg-bubble">
                    {/* Render basic bold formatting */}
                    {msg.text.split('\n').map((paragraph, pIdx) => (
                      <p key={pIdx}>
                        {paragraph.split('**').map((chunk, cIdx) =>
                          cIdx % 2 === 1 ? <strong key={cIdx}>{chunk}</strong> : chunk
                        )}
                      </p>
                    ))}
                  </div>
                  <span className="mochi-msg-timestamp">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="mochi-message-row is-mochi">
                <div className="mochi-msg-avatar">
                  <MochiAvatarSVG state="thinking" size={28} />
                </div>
                <div className="mochi-typing-bubble">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-caption">Mochi is thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Quick Prompts */}
          <div className="mochi-suggestions-scroll">
            {DEFAULT_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                className="mochi-suggestion-pill"
                onClick={() => handleSend(q)}
                disabled={isTyping}
              >
                <Sparkles size={11} className="suggestion-sparkle" />
                <span>{q}</span>
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <div className="mochi-input-container">
            <input
              ref={inputRef}
              type="text"
              className="mochi-text-input"
              placeholder="Ask Mochi anything about Dimple..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={400}
              disabled={isTyping}
            />
            <button
              className="mochi-send-button"
              onClick={() => handleSend()}
              disabled={!inputVal.trim() || isTyping}
              aria-label="Send message to Mochi"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
