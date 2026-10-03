import React, { useState } from 'react';
import { Mail, CheckCircle2, Sparkles, Send } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, Subscriber } from '../types';
import { translations } from '../translations';
import { analyticsService } from '../services/analyticsService';
import { smartCache } from '../services/cacheService';

interface NewsletterWidgetProps {
  lang: Language;
}

export const NewsletterWidget: React.FC<NewsletterWidgetProps> = ({ lang }) => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const t = translations[lang] || translations.pt;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const clean = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!clean || !emailRegex.test(clean)) {
      setErrorMsg(t.newsletter_error);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Save subscriber
      try {
        const key = 'mmr_subscribers_v1';
        const existing: Subscriber[] = JSON.parse(localStorage.getItem(key) || '[]');
        if (!existing.some((s) => s.email === clean)) {
          const newSub: Subscriber = {
            id: 'sub-' + Date.now(),
            email: clean,
            date: Date.now()
          };
          existing.push(newSub);
          localStorage.setItem(key, JSON.stringify(existing));
          smartCache.set('subscribers_count', existing.length);
        }
      } catch {
        // Ignored
      }

      analyticsService.recordNewsletter(clean);

      try {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.8 },
          colors: ['#e02434', '#e8bb4a', '#1e4976']
        });
      } catch {
        // Ignored
      }

      setIsSubmitting(false);
      setIsSubscribed(true);
      setEmail('');
    }, 600);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-sky-950/60 border border-slate-800 rounded-xl p-4 sm:p-5 relative overflow-hidden shadow-xl">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
          <Mail className="w-4 h-4" />
        </div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
          {t.newsletter_title}
        </h3>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed mb-3">
        {t.newsletter_sub}
      </p>

      {isSubscribed ? (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{t.newsletter_success}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder={t.newsletter_placeholder}
              className="w-full h-9 pl-3 pr-8 text-xs rounded-lg bg-slate-950/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:border-red-500 focus:outline-none transition-colors"
            />
          </div>

          {errorMsg && (
            <p className="text-[11px] text-red-400 font-medium">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-9 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-red-950/40 transition-all disabled:opacity-60"
          >
            {isSubmitting ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : (
              <>
                <Send className="w-3 h-3" />
                <span>{t.newsletter_btn}</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};
