import React, { useEffect, useRef, useState } from 'react';
import { getGrandmaAdvice } from '@services/geminiService';

const GrandmaHelper: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState('');
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
      const result = await getGrandmaAdvice(sanitized);
      setResponseText(result);
      setAnimate(true);
      setTimeout(() => setAnimate(false), 900);
    } catch (e) {
      setResponseText('Grandma is having trouble right now. Try again later. Love, Grandma.');
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
    const handler = (e: any) => {
      if (e?.detail?.value) {
        setQuery(e.detail.value);
        setTimeout(() => {
          const el = document.getElementById('grandma-input');
          if (el) (el as HTMLElement).focus();
        }, 50);
      }
    };
    window.addEventListener('set-grandma-query', handler);
    return () => window.removeEventListener('set-grandma-query', handler);
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center space-x-4">
      <div className="flex-shrink-0">
        <img
          className="h-16 w-16 rounded-full"
          src="https://i.ibb.co/L8T6P1t/grandma.png" 
          alt="Grandma AI"
        />
      </div>
      <div className="font-mono">
        <h3 className="text-lg font-bold text-accent-500">ASK GRANDMA</h3>
        <p className="text-sm text-text-muted">MARGIE FAY KATEN (1925-2025)</p>
      </div>
      <div className="mt-4">
        <div className="relative">
          <input
            id="grandma-input"
            aria-label="Ask Grandma input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What's overwhelming you, honey?"
            className="w-full px-4 py-3 rounded-lg bg-background-dark text-text-light placeholder-pink-500/30 focus:outline-none focus:ring-2 focus:ring-accent-500 pr-28"
          />
          <button
            aria-label="Ask Grandma"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-accent-600 text-white font-bold rounded shadow-md hover:bg-accent-700 transition-colors"
            onClick={handleAsk}
            disabled={loading}
          >
            {loading ? 'TRANSMITTING...' : 'ASK'}
          </button>
        </div>
        {piiWarning && <p className="mt-2 text-xs text-alert-orange font-mono">{piiWarning}</p>}
        {responseText && (
          <div
            ref={responseRef}
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

export default GrandmaHelper;
