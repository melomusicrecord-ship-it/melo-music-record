import React, { useState } from 'react';
import {
  X,
  Download,
  Share2,
  Copy,
  Check,
  Disc3,
  Calendar,
  User,
  ListMusic,
  MessageCircle,
  Twitter,
  Facebook,
  Send
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Album, Language } from '../types';
import { translations } from '../translations';
import { formatDate, getPlaceholderCover, normalizeUrl, shareViaWebShare } from '../utils/helpers';
import { analyticsService } from '../services/analyticsService';

interface AlbumDetailModalProps {
  album: Album | null;
  onClose: () => void;
  lang: Language;
}

export const AlbumDetailModal: React.FC<AlbumDetailModalProps> = ({
  album,
  onClose,
  lang
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!album) return null;

  const t = translations[lang] || translations.pt;
  const coverSrc = !imageError && album.cover ? normalizeUrl(album.cover) : getPlaceholderCover(album.title);
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleDownload = () => {
    try {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#e02434', '#e8bb4a', '#1e4976']
      });
    } catch {}
    window.open(normalizeUrl(album.downloadUrl), '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2200);
    analyticsService.recordShare(album.title, 'Copy Link');
  };

  const handleShare = (platform: string) => {
    const text = `Baixa o ${album.type} "${album.title}" de ${album.artist} na Melo Music Record:`;
    const encodedText = encodeURIComponent(text);
    const encodedUrl = encodeURIComponent(currentUrl);

    analyticsService.recordShare(album.title, platform);

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
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-800/80 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
          title="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header / Project Info */}
        <div className="p-5 sm:p-6 bg-gradient-to-b from-slate-850 to-slate-900 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start text-center sm:text-left">
            {/* Cover */}
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-xl overflow-hidden shadow-xl shadow-black/60 flex-shrink-0 bg-slate-950 relative border border-slate-700/60">
              <img
                src={coverSrc}
                alt={album.title}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Metadata */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wider text-amber-300 bg-amber-500/10 border border-amber-500/30">
                  {album.type}
                </span>
                <span className="text-xs text-slate-400">
                  {album.category} · {album.tracksCount} {t.tracks_label}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight mb-1.5">
                {album.title}
              </h2>

              <p className="text-sm font-semibold text-sky-400 mb-2 flex items-center justify-center sm:justify-start gap-1.5">
                <User className="w-4 h-4 text-sky-500" />
                <span>{album.artist}</span>
              </p>

              <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{formatDate(album.date, lang)}</span>
                </span>
                {album.downloads ? (
                  <>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span>{album.downloads.toLocaleString()} {t.downloads_count}</span>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-5">
            <button
              onClick={handleDownload}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-lg shadow-red-950/50 transition-all active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>{t.btn_download_album}</span>
            </button>
          </div>
        </div>

        {/* Tracklist & Social Share */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {album.description && (
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              {album.description}
            </p>
          )}

          {/* Tracklist List */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
              <ListMusic className="w-4 h-4 text-red-500" />
              <span>{t.tracklist_heading} ({album.tracksCount} {t.tracks_label})</span>
            </h3>

            {album.tracklist && album.tracklist.length > 0 ? (
              <div className="divide-y divide-slate-800/80 bg-slate-950/70 border border-slate-800 rounded-xl overflow-hidden">
                {album.tracklist.map((track, i) => (
                  <div
                    key={i}
                    className="p-3 text-xs sm:text-sm font-medium text-slate-200 flex items-center gap-3 hover:bg-slate-900/80 transition-colors"
                  >
                    <Disc3 className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span className="truncate">{track}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl border border-dashed border-slate-800 text-center text-xs text-slate-400 italic">
                Faixas disponíveis para download no pacote completo.
              </div>
            )}
          </div>

          {/* Social Share Bar */}
          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.share_album}</span>
            </h4>
            <div className="flex flex-wrap items-center gap-2">
              {/* Native Web Share Primary Button */}
              <button
                onClick={async () => {
                  const albumUrl = normalizeUrl(album.downloadUrl) || currentUrl;
                  const shareText = `Confira o ${album.type} "${album.title}" de ${album.artist} na Melo Music Record:`;
                  const res = await shareViaWebShare({
                    title: `${album.title} (${album.type}) - ${album.artist}`,
                    text: shareText,
                    url: albumUrl
                  });
                  if (res.shared) {
                    analyticsService.recordShare(album.title, 'Web Share');
                    if (res.method === 'clipboard') {
                      setCopiedLink(true);
                      setTimeout(() => setCopiedLink(false), 2200);
                    }
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-md shadow-red-950/40 active:scale-98 transition-all border border-red-500/40"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Partilhar Agora (Web Share)</span>
              </button>

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
