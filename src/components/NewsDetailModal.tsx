import React, { useState } from 'react';
import {
  X,
  Calendar,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Twitter,
  Facebook,
  Send,
  Eye
} from 'lucide-react';
import { NewsItem, Language } from '../types';
import { translations } from '../translations';
import { formatDate, getPlaceholderCover, normalizeUrl } from '../utils/helpers';
import { analyticsService } from '../services/analyticsService';

interface NewsDetailModalProps {
  news: NewsItem | null;
  onClose: () => void;
  lang: Language;
}

export const NewsDetailModal: React.FC<NewsDetailModalProps> = ({ news, onClose, lang }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!news) return null;

  const t = translations[lang] || translations.pt;
  const coverSrc = !imageError && news.image ? normalizeUrl(news.image) : getPlaceholderCover(news.title);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
    analyticsService.recordShare(news.title, 'Copy Link');
  };

  const handleShare = (platform: string) => {
    const text = `Lê na Melo Music Record: ${news.title}`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(currentUrl);

    analyticsService.recordShare(news.title, platform);

    switch (platform) {
      case 'whatsapp':
        window.open(`https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank');
        break;
      case 'telegram':
        window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, '_blank');
        break;
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative my-auto animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col"
      >
        {/* Header Cover Banner */}
        <div className="relative aspect-video sm:aspect-[21/9] w-full bg-slate-950 overflow-hidden">
          <img
            src={coverSrc}
            alt={news.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/40"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-colors border border-white/20"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Tag */}
          <div className="absolute bottom-4 left-4">
            <span
              className={`text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full backdrop-blur-md border ${
                news.type === 'today'
                  ? 'bg-amber-500 text-slate-950 border-amber-300'
                  : 'bg-red-600 text-white border-red-400'
              }`}
            >
              {news.type === 'today' ? 'TUDO DE HOJE' : 'NEWS HOJE'}
            </span>
          </div>
        </div>

        {/* Article Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Metadata */}
          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{formatDate(news.date, lang)}</span>
            </span>
            {news.views ? (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>{news.views.toLocaleString()} leituras</span>
                </span>
              </>
            ) : null}
          </div>

          {/* Title */}
          <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
            {news.title}
          </h2>

          {/* Content */}
          <div className="text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-wrap pt-2">
            {news.content}
          </div>

          {/* Share Bar */}
          <div className="pt-6 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.share_news}</span>
            </h4>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleShare('whatsapp')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={() => handleShare('twitter')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-sky-400 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 transition-colors"
              >
                <Twitter className="w-3.5 h-3.5" />
                <span>X / Twitter</span>
              </button>

              <button
                onClick={() => handleShare('facebook')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 transition-colors"
              >
                <Facebook className="w-3.5 h-3.5" />
                <span>Facebook</span>
              </button>

              <button
                onClick={() => handleShare('telegram')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? t.link_copied : t.share_copy_link}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
