import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, RotateCcw, Minimize2, Sparkles, Flower2 } from 'lucide-react';

// Bespoke original anime cat SVG vector for Mochi
function MochiAvatarSVG({ state = 'idle', size = 64 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`mochi-svg mochi-state-${state}`} aria-hidden="true">
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

      {/* Fluffy tail */}
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
        <g stroke="#5B4A78" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M 33 48 Q 40 54 45 49" />
          <path d="M 55 49 Q 60 54 67 48" />
        </g>
      ) : state === 'happy' ? (
        <g stroke="#5B4A78" strokeWidth="2.5" strokeLinecap="round" fill="none">
          <path d="M 33 50 Q 39 43 45 50" />
          <path d="M 55 50 Q 61 43 67 50" />
        </g>
      ) : state === 'thinking' ? (
        <g>
          <ellipse cx="39" cy="46" rx="5" ry="6" fill="url(#mochiEyeIris)" />
          <circle cx="37" cy="44" r="2.2" fill="#FFFFFF" />
          <ellipse cx="61" cy="45" rx="5" ry="6" fill="url(#mochiEyeIris)" />
          <circle cx="59" cy="43" r="2.2" fill="#FFFFFF" />
          <path d="M 35 39 Q 40 37 45 40" stroke="#5B4A78" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>
      ) : (
        <g>
          <ellipse cx="38" cy="48" rx="6" ry="7.5" fill="url(#mochiEyeIris)" />
          <circle cx="36" cy="45" r="2.5" fill="#FFFFFF" />
          <circle cx="41" cy="51" r="1.2" fill="#FFFFFF" />
          <ellipse cx="62" cy="48" rx="6" ry="7.5" fill="url(#mochiEyeIris)" />
          <circle cx="60" cy="45" r="2.5" fill="#FFFFFF" />
          <circle cx="65" cy="51" r="1.2" fill="#FFFFFF" />
          <path d="M 32 44 Q 38 41 44 44" stroke="#483463" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d="M 56 44 Q 62 41 68 44" stroke="#483463" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>
      )}

      {/* Tiny Cat Nose */}
      <path d="M 49 53 L 51 53 L 50 54.5 Z" fill="#E887A9" />

      {/* Mouth */}
      {state === 'talking' ? (
        <path d="M 47 55 Q 50 60 53 55 Z" fill="#FF8BA7" stroke="#6C4A78" strokeWidth="1.2" />
      ) : (
        <path d="M 46 55 Q 48 57 50 55 Q 52 57 54 55" stroke="#5B4A78" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      )}

      {/* Whiskers */}
      <line x1="22" y1="51" x2="14" y2="49" stroke="#B8A4D1" strokeWidth="1" strokeLinecap="round" />
      <line x1="22" y1="55" x2="13" y2="56" stroke="#B8A4D1" strokeWidth="1" strokeLinecap="round" />
      <line x1="78" y1="51" x2="86" y2="49" stroke="#B8A4D1" strokeWidth="1" strokeLinecap="round" />
      <line x1="78" y1="55" x2="87" y2="56" stroke="#B8A4D1" strokeWidth="1" strokeLinecap="round" />

      {/* Lavender Silk Ribbon / Bow under chin */}
      <g transform="translate(50, 67)">
        <path d="M 0 0 C -8 -6 -14 0 -8 4 C -3 6 0 0 0 0 Z" fill="url(#mochiRibbon)" />
        <path d="M 0 0 C 8 -6 14 0 8 4 C 3 6 0 0 0 0 Z" fill="url(#mochiRibbon)" />
        <circle cx="0" cy="2" r="3.2" fill="#FFD54F" stroke="#FFA000" strokeWidth="0.8" />
        <circle cx="-0.8" cy="1.2" r="0.9" fill="#FFFDE7" />
      </g>

      {/* Front Paws */}
      <ellipse cx="40" cy="74" rx="4.5" ry="3.5" fill="#FFFFFF" stroke="#E2D4F0" strokeWidth="1.2" />
      <ellipse cx="60" cy="74" rx="4.5" ry="3.5" fill="#FFFFFF" stroke="#E2D4F0" strokeWidth="1.2" />
    </svg>
  );
}

const STORAGE_KEY = 'mochi-conversation-v1';
const MAX_CLIENT_HISTORY = 8;

const GREETINGS = {
  '/projects': "You're in the project archive. I can explain any case study here, or help you choose where to begin.",
  '/contact': "This is where notes reach Dimple. If you'd like, I can help you shape a short, clear message.",
  '/skills': "Here is Dimple's toolkit. Ask me which skills sit behind a particular project.",
  '/experience': "This is Dimple's path so far. I can summarise a role or connect the dots between them.",
  '/achievements': "Honours and hackathon moments. Ask me about any of them.",
  '/certifications': "Her listed credentials live here. I can explain what each one covers.",
  '/blog': "These are Dimple's written notes. I can suggest where to start reading.",
  '/gallery': "A visual scrapbook of campus life and creative work. Ask me about any chapter.",
  '/about': "A little more about Dimple. Ask me anything you'd like to understand.",
  '/beyond-code': "The creative side of her world. I can point you to the parts you might enjoy.",
};

const DEFAULT_GREETING = "Hello. I'm Mochi, a quiet guide to Dimplverse. Ask about her projects, skills, experience, or how to reach her.";

const STARTERS = {
  '/projects': [
    'Which project should I open first?',
    'Tell me about her InnoVortex work.',
    'Which stack does she build with?'
  ],
  '/contact': [
    'Help me write a short message.',
    'What is the best way to reach Dimple?',
    'Is she open to internships?'
  ],
  '/skills': [
    'Which skills should I learn first?',
    'What does she use for AI work?',
    'Which project shows her frontend skills?'
  ],
  '/experience': [
    'Summarise her internships.',
    'What did she do at Aevona Solutions?',
    'How did she begin with AI?'
  ],
  '/achievements': [
    'What is her proudest achievement?',
    'Tell me about InnoVortex.',
    'Which hackathons has she joined?'
  ],
  '/certifications': [
    'What do her certifications cover?',
    'Which credential fits AI work best?',
    'How can I verify them?'
  ],
  '/blog': [
    'Which post should I read first?',
    'What does she write about?',
    'Tell me the InnoVortex story.'
  ],
  '/gallery': [
    'What can I find in this gallery?',
    'Tell me about her campus life.',
    'Where can I see her creative work?'
  ],
};

const DEFAULT_STARTERS = [
  'Who is Dimple?',
  'Show me her strongest projects.',
  'How can I get in touch?'
];

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function greetingFor(pathname) {
  return GREETINGS[pathname] || DEFAULT_GREETING;
}

function loadSession() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    /* ignore malformed session data */
  }
  return null;
}

export default function Mochi() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [catState, setCatState] = useState('idle');
  const [messages, setMessages] = useState(() => {
    const restored = loadSession();
    return restored || [{ id: 'greeting', sender: 'mochi', text: greetingFor(pathname), timestamp: timeNow() }];
  });
  const [inputVal, setInputVal] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const messageIdRef = useRef(0);
  const panelRef = useRef(null);
  const triggerRef = useRef(null);
  const inputRef = useRef(null);
  const streamRef = useRef(null);
  const closeRef = useRef(null);

  const starters = useMemo(() => STARTERS[pathname] || DEFAULT_STARTERS, [pathname]);

  const nextId = () => {
    messageIdRef.current += 1;
    return `m${messageIdRef.current}`;
  };

  // Keep the conversation for this browser session only.
  useEffect(() => {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      /* storage may be unavailable; the in-memory conversation still works */
    }
  }, [messages]);

  const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  const scrollToLatest = useCallback(() => {
    const stream = streamRef.current;
    if (!stream) return;
    stream.scrollTo({
      top: stream.scrollHeight,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth'
    });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    scrollToLatest();
  }, [messages, isThinking, isOpen, scrollToLatest]);

  const closePanel = useCallback(() => {
    setIsOpen(false);
    setCatState('idle');
  }, []);

  closeRef.current = closePanel;

  // Focus management, focus trap and Esc to close.
  useEffect(() => {
    if (!isOpen) return undefined;

    const panel = panelRef.current;
    const returnFocusTo = document.activeElement;

    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 120);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRef.current?.();
        return;
      }

      if (event.key !== 'Tab' || !panel) return;

      const focusable = panel.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      if (returnFocusTo && typeof returnFocusTo.focus === 'function' && document.contains(returnFocusTo)) {
        returnFocusTo.focus();
      } else {
        triggerRef.current?.focus();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setCatState('happy');
    const timer = window.setTimeout(() => setCatState('idle'), 1400);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  const sendMessage = useCallback(
    async (rawText, retryId = null) => {
      const text = String(rawText || '').trim();
      if (!text || isThinking) return;

      if (retryId) {
        setMessages((prev) => prev.filter((msg) => msg.id !== retryId));
      }

      setMessages((prev) => [
        ...prev,
        { id: nextId(), sender: 'user', text, timestamp: timeNow() }
      ]);
      setInputVal('');
      setIsThinking(true);
      setCatState('thinking');

      const history = messages
        .filter((msg) => msg.sender === 'user' || msg.sender === 'mochi')
        .slice(-MAX_CLIENT_HISTORY)
        .map((msg) => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }));

      try {
        const response = await fetch('/api/ai/mochi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: text, history, page: pathname })
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Mochi could not answer just now.');
        }

        setIsOffline(Boolean(data.offline));
        setCatState('talking');
        setMessages((prev) => [
          ...prev,
          { id: nextId(), sender: 'mochi', text: data.reply, timestamp: timeNow() }
        ]);
      } catch (err) {
        console.warn('Mochi chat error:', err);
        setMessages((prev) => [
          ...prev,
          {
            id: nextId(),
            sender: 'mochi',
            text: "I lost my thread for a moment. It isn't your fault. We can try that again, or you can reach Dimple directly from the Contact page.",
            timestamp: timeNow(),
            failed: true,
            retryText: text
          }
        ]);
      } finally {
        setIsThinking(false);
        setCatState('idle');
      }
    },
    [isThinking, messages, pathname]
  );

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage(inputVal);
    }
  };

  const clearConversation = () => {
    const reset = [{ id: nextId(), sender: 'mochi', text: greetingFor(pathname), timestamp: timeNow() }];
    setMessages(reset);
    setInputVal('');
    setCatState('idle');
    inputRef.current?.focus();
  };

  const showStarters = messages.filter((msg) => msg.sender === 'user').length === 0;

  const renderRichText = (text) =>
    String(text).split('\n').map((paragraph, pIdx) => (
      <p key={pIdx}>
        {paragraph.split('**').map((chunk, cIdx) =>
          cIdx % 2 === 1 ? <strong key={cIdx}>{chunk}</strong> : chunk
        )}
      </p>
    ));

  return (
    <div className="mochi-root-container">
      {!isOpen && (
        <div className="mochi-floating-anchor">
          <button
            ref={triggerRef}
            type="button"
            className="mochi-trigger-character"
            onClick={() => setIsOpen(true)}
            aria-label="Open Mochi, a quiet guide to Dimplverse"
            aria-haspopup="dialog"
            aria-expanded={false}
            title="Mochi, your guide to Dimplverse"
          >
            <span className="mochi-avatar-glow" aria-hidden="true" />
            <MochiAvatarSVG state={catState} size={70} />
            <span className="mochi-online-ping" aria-hidden="true" />
          </button>
        </div>
      )}

      {isOpen && (
        <div
          ref={panelRef}
          className="mochi-chat-window-premium"
          role="dialog"
          aria-modal="true"
          aria-labelledby="mochi-panel-title"
        >
          <div className="mochi-panel-header">
            <div className="mochi-header-left">
              <div className="mochi-header-avatar-box">
                <MochiAvatarSVG state={catState} size={42} />
                <span className="mochi-header-online-dot" aria-hidden="true" />
              </div>
              <div className="mochi-header-info">
                <div className="mochi-header-name" id="mochi-panel-title">
                  <span>Mochi</span>
                  <span className="mochi-badge-ai">Guide</span>
                </div>
                <div className="mochi-header-sub">A quiet guide to Dimplverse</div>
              </div>
            </div>

            <div className="mochi-header-actions">
              <button
                type="button"
                className="mochi-icon-btn"
                onClick={clearConversation}
                title="Clear this conversation"
                aria-label="Clear this conversation"
              >
                <RotateCcw size={15} />
              </button>
              <button
                type="button"
                className="mochi-icon-btn"
                onClick={closePanel}
                title="Close chat"
                aria-label="Close chat"
              >
                <Minimize2 size={16} />
              </button>
            </div>
          </div>

          {isOffline && (
            <p className="mochi-offline-note">
              <Flower2 size={12} aria-hidden="true" />
              <span>Offline mode — answers come from Dimple's portfolio notes.</span>
            </p>
          )}

          <div
            ref={streamRef}
            className="mochi-messages-stream"
            role="log"
            aria-live="polite"
            aria-relevant="additions text"
            aria-label="Conversation with Mochi"
          >
            {messages.map((msg) => (
              <div key={msg.id} className={`mochi-message-row is-${msg.sender}`}>
                {msg.sender === 'mochi' && (
                  <div className="mochi-msg-avatar">
                    <MochiAvatarSVG state={msg.failed ? 'thinking' : catState} size={28} />
                  </div>
                )}
                <div className="mochi-msg-bubble-wrap">
                  <div className={`mochi-msg-bubble${msg.failed ? ' is-failed' : ''}`}>
                    {renderRichText(msg.text)}
                  </div>
                  <div className="mochi-msg-meta">
                    <span className="mochi-msg-timestamp">{msg.timestamp}</span>
                    {msg.failed && (
                      <button
                        type="button"
                        className="mochi-retry-btn"
                        onClick={() => sendMessage(msg.retryText, msg.id)}
                        disabled={isThinking}
                      >
                        Try again
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isThinking && (
              <div className="mochi-message-row is-mochi">
                <div className="mochi-msg-avatar">
                  <MochiAvatarSVG state="thinking" size={28} />
                </div>
                <div className="mochi-typing-bubble" aria-hidden="true">
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                  <span className="typing-dot" />
                </div>
                <span className="sr-only">Mochi is thinking</span>
              </div>
            )}
          </div>

          {showStarters && (
            <div className="mochi-suggestions-scroll" aria-label="Gentle conversation starters">
              {starters.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="mochi-suggestion-pill"
                  onClick={() => sendMessage(prompt)}
                  disabled={isThinking}
                >
                  <Sparkles size={11} className="suggestion-sparkle" aria-hidden="true" />
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          )}

          <div className="mochi-input-container">
            <label className="sr-only" htmlFor="mochi-input">Ask Mochi about Dimple</label>
            <input
              ref={inputRef}
              id="mochi-input"
              type="text"
              className="mochi-text-input"
              placeholder="Ask about Dimple's work…"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={500}
              autoComplete="off"
              disabled={isThinking}
            />
            <button
              type="button"
              className="mochi-send-button"
              onClick={() => sendMessage(inputVal)}
              disabled={!inputVal.trim() || isThinking}
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
