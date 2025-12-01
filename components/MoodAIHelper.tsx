import React, { useEffect, useRef, useState } from 'react';
import GoogleEmoji from '@components/GoogleEmoji';
import { getMoodAdvice } from '@services/geminiService';

const MoodAIHelper: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState('How can I help you navigate the chaos, dear?');
  const [lastSanitized, setLastSanitized] = useState('');
  const [piiWarning, setPiiWarning] = useState('');
  const [animate, setAnimate] = useState(false);
  const responseRef = useRef<HTMLDivElement | null>(null);

  const sanitizeInput = (raw: string): { sanitized: string; redacted: boolean } => {
    if (!raw) return { sanitized: '', redacted: false };
    let sanitized = raw;
    let redacted = false;
    // Email
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
    if (emailRegex.test(sanitized)) { sanitized = sanitized.replace(emailRegex, '[EMAIL REDACTED]'); redacted = true; }
    // URLs
    const urlRegex = /https?:\/\/\S+|www\.\S+/g;
    if (urlRegex.test(sanitized)) { sanitized = sanitized.replace(urlRegex, '[URL REDACTED]'); redacted = true; }
    // Phone numbers (simple)
    const phoneRegex = /\+?\d[\d\-\.\s]{6,}\d/g;
    if (phoneRegex.test(sanitized)) { sanitized = sanitized.replace(phoneRegex, '[PHONE REDACTED]'); redacted = true; }
    // SSN-like
    const ssnRegex = /\b\d{3}-\d{2}-\d{4}\b/g;
    if (ssnRegex.test(sanitized)) { sanitized = sanitized.replace(ssnRegex, '[REDACTED]'); redacted = true; }
    return { sanitized, redacted };
  };

  const handleAsk = async () => {
    if (!query.trim()) return;
    const { sanitized, redacted } = sanitizeInput(query);
    if (redacted) {
      setPiiWarning('Sensitive info removed for your safety.');
    } else {
      setPiiWarning('');
    }
    setLastSanitized(sanitized);
    setLoading(true);
    setResponseText('');
    try {
      const result = await getMoodAdvice(sanitized);
      setResponseText(result);
      setAnimate(true);
      setTimeout(() => setAnimate(false), 900);
    } catch (e) {
      setResponseText('The Mood is having trouble right now. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (responseRef.current && animate) {
      responseRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [animate]);

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      if (e?.detail?.value) {
        setQuery(e.detail.value);
        setTimeout(() => {
          const el = document.getElementById('mood-input');
          if (el) (el as HTMLElement).focus();
        }, 50);
      }
    };
    window.addEventListener('set-mood-query', handler as EventListener);
    return () => window.removeEventListener('set-mood-query', handler as EventListener);
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <GoogleEmoji symbol={'🧠'} size={64} alt="The Mood AI" className="mr-2" />
        </div>
        <div className="font-mono flex-grow">
          <h3 className="text-xl font-bold text-accent-500 mb-1">ASK THE MOOD</h3>
          <p className="text-sm text-text-muted mb-4">Your personal AI, tuned to your emotional frequency.</p>
          <div className="relative">
            <input
              id="mood-input"
              aria-label="Ask The Mood input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What's on your mind, human?"
              className="w-full px-4 py-3 rounded-lg bg-background-dark text-text-light placeholder-accent-400/50 focus:outline-none focus:ring-2 focus:ring-accent-500 pr-28"
            />
            <button
              aria-label="Ask The Mood"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-accent-600 text-white font-bold rounded shadow-md hover:bg-accent-700 transition-colors"
              onClick={handleAsk}
              disabled={loading}
            >
              {loading ? 'PROCESSING...' : 'ASK'}
            </button>
          </div>
          {piiWarning && <p className="mt-2 text-xs text-alert-orange font-mono">{piiWarning}</p>}
          {responseText && (
            <div
              ref={responseRef}
              data-testid="ai-response"
              className={`mt-4 p-4 rounded-lg bg-surface-900 border border-surface-700 ${animate ? 'animate-pulse' : ''}`}
            >
              <p className="whitespace-pre-wrap">{responseText}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodAIHelper;
