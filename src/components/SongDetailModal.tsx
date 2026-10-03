import React, { useState } from 'react';
import {
  X,
  Download,
  Play,
  Pause,
  Copy,
  Check,
  Share2,
  Calendar,
  User,
  Music,
  MessageCircle,
  Twitter,
  Facebook,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Song, Language } from '../types';
import { translations } from '../translations';
import { formatDate, getPlaceholderCover, normalizeUrl, buildWhatsAppLink } from '../utils/helpers';
import { analyticsService } from '../services/analyticsService';

interface SongDetailModalProps {
  song: Song | null;
  onClose: () => void;
  isPlaying: boolean;
  onPlay: (song: Song) => void;
  lang: Language;
}

export const SongDetailModal: React.FC<SongDetailModalProps> = ({
  song,
  onClose,
  isPlaying,
  onPlay,
  lang
}) => {
  const [copiedLyrics, setCopiedLyrics] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!song) return null;

  const t = translations[lang] || translations.pt;
  const coverSrc = !imageError && song.cover ? normalizeUrl(song.cover) : getPlaceholderCover(song.title);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleDownload = () => {
    analyticsService.recordDownload(song);
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#e02434', '#e8bb4a', '#1e4976']
      });
    } catch {
      // Ignored
    }
    window.open(normalizeUrl(song.link), '_blank', 'noopener,noreferrer');
  };

  const handleCopyLyrics = () => {
    if (!song.lyrics) return;
    navigator.clipboard.writeText(song.lyrics);
    setCopiedLyrics(true);
    setTimeout(() => setCopiedLyrics(false), 2200);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
    analyticsService.recordShare(song.title, 'Copy Link');
  };

  const handleShare = (platform: string) => {
    const text = `Ouve e baixa "${song.title}" de ${song.artist || 'Melo Music'} na Melo Music Record:`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(currentUrl);

    analyticsService.recordShare(song.title, platform);

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
      case 'native':
        if (navigator.share) {
          navigator.share({
            title: song.title,
            text: text,
            url: currentUrl
          }).catch(() => {});
        }
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
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header / Track Info */}
        <div className="p-5 sm:p-6 bg-gradient-to-b from-slate-850 to-slate-900 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
            {/* Cover */}
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-xl overflow-hidden shadow-xl shadow-black/60 flex-shrink-0 bg-slate-950 relative border border-slate-700/60">
              <img
                src={coverSrc}
                alt={song.title}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => onPlay(song)}
                className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center text-white transition-colors"
                title={isPlaying ? t.btn_pause : t.btn_play}
              >
                {isPlaying ? (
                  <Pause className="w-10 h-10 fill-current text-amber-400" />
                ) : (
                  <Play className="w-10 h-10 fill-current text-white ml-1" />
                )}
              </button>
            </div>

            {/* Metadata */}
            <div className="flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider uppercase text-amber-300 bg-amber-500/10 border border-amber-500/30 mb-2">
                <Music className="w-3 h-3" />
                <span>{song.category || 'Música'}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight mb-1.5">
                {song.title}
              </h2>

              <p className="text-sm font-semibold text-sky-400 mb-2 flex items-center justify-center sm:justify-start gap-1.5">
                <User className="w-4 h-4 text-sky-500" />
                <span>{song.artist || t.artist_unknown}</span>
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{formatDate(song.date, lang)}</span>
                </span>
                {song.downloads ? (
                  <>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span>{song.downloads.toLocaleString()} downloads</span>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-2.5 mt-5">
            <button
              onClick={handleDownload}
              className="flex-1 min-w-[160px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-lg shadow-red-950/50 transition-all active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>{t.btn_download}</span>
            </button>

            <button
              onClick={() => onPlay(song)}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-sky-200 bg-sky-950/70 hover:bg-sky-900 border border-sky-800/80 transition-all"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>{t.btn_pause}</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>{t.btn_play}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Content: Lyrics & Social Sharing */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Social Share Bar */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.share_song}</span>
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

          {/* Full Lyrics Section */}
          <div className="pt-4 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <span className="w-1 h-3.5 rounded bg-red-600 inline-block"></span>
                <span>{t.lyrics_heading}</span>
              </h3>

              {song.lyrics && song.lyrics.trim().length > 0 && (
                <button
                  onClick={handleCopyLyrics}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  {copiedLyrics ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLyrics ? t.lyrics_copied : t.lyrics_copy}</span>
                </button>
              )}
            </div>

            {song.lyrics && song.lyrics.trim().length > 0 ? (
              <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-4 sm:p-5 text-sm sm:text-base leading-relaxed text-slate-200 whitespace-pre-wrap font-sans font-normal tracking-wide selection:bg-red-500/40">
                {song.lyrics}
              </div>
            ) : (
              <div className="p-6 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-400 italic bg-slate-950/40">
                {t.lyrics_empty}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
