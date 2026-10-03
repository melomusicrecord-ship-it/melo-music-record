import React, { useState } from 'react';
import { Download, Disc3, ListMusic, Sparkles, User, Calendar, Share2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Album, Language } from '../types';
import { translations } from '../translations';
import { isToday, formatDate, getPlaceholderCover, normalizeUrl, shareViaWebShare } from '../utils/helpers';
import { analyticsService } from '../services/analyticsService';

interface AlbumCardProps {
  album: Album;
  onOpenDetails: (album: Album) => void;
  lang: Language;
}

export const AlbumCard: React.FC<AlbumCardProps> = ({
  album,
  onOpenDetails,
  lang
}) => {
  const [imageError, setImageError] = useState(false);
  const [sharedNotice, setSharedNotice] = useState<string | null>(null);
  const t = translations[lang] || translations.pt;
  const isReleaseToday = isToday(album.date);

  const coverSrc = !imageError && album.cover ? normalizeUrl(album.cover) : getPlaceholderCover(album.title);

  const handleWebShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const albumUrl = normalizeUrl(album.downloadUrl) || window.location.href;
    const shareText = `Confira o ${album.type} "${album.title}" de ${album.artist} na Melo Music Record:`;

    const result = await shareViaWebShare({
      title: `${album.title} (${album.type}) - ${album.artist}`,
      text: shareText,
      url: albumUrl
    });

    if (result.shared) {
      analyticsService.recordShare(album.title, result.method === 'web-share' ? 'Web Share' : 'Copied Link');
      setSharedNotice(result.method === 'web-share' ? 'Partilhado!' : 'Link copiado!');
      setTimeout(() => setSharedNotice(null), 2500);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      confetti({
        particleCount: 30,
        spread: 55,
        origin: { y: 0.8 },
        colors: ['#e02434', '#e8bb4a', '#1e4976']
      });
    } catch {}

    const downloadLink = normalizeUrl(album.downloadUrl);
    window.open(downloadLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <article
      onClick={() => onOpenDetails(album)}
      className="group bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-red-950/20 flex flex-col justify-between"
    >
      <div>
        {/* Cover Aspect Square */}
        <div className="w-full aspect-square overflow-hidden relative bg-slate-950">
          <img
            src={coverSrc}
            alt={album.title}
            onError={() => setImageError(true)}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Type Badge & Today Tag */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
            <span className="text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full backdrop-blur-md bg-red-600/90 text-white border border-red-400">
              {album.type}
            </span>
            <span className="text-[10px] font-semibold text-slate-200 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-slate-700/60">
              {album.tracksCount} {t.tracks_label}
            </span>
          </div>

          {isReleaseToday && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-500/40">
              <Sparkles className="w-2.5 h-2.5 text-amber-400" />
              <span>Hoje</span>
            </div>
          )}

          {/* Center Vinyl Overlay on Hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
            <div className="w-12 h-12 rounded-full bg-slate-900/90 border border-slate-700 flex items-center justify-center shadow-xl">
              <Disc3 className="w-6 h-6 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-3.5">
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium mb-1">
            <span className="text-amber-400 font-semibold">{album.category}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{formatDate(album.date, lang)}</span>
          </div>

          <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1 leading-snug mb-0.5">
            {album.title}
          </h3>

          <p className="text-[11px] text-sky-400 font-semibold mb-1.5 truncate">
            {album.artist}
          </p>

          {album.description && (
            <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
              {album.description}
            </p>
          )}
        </div>
      </div>

      {/* Action Row */}
      <div className="px-3.5 pb-3 pt-1 flex items-center gap-1.5 border-t border-slate-800/80">
        <button
          onClick={handleDownload}
          className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:scale-98 transition-all shadow-sm"
        >
          <Download className="w-3 h-3" />
          <span>{t.btn_download}</span>
        </button>

        <button
          onClick={() => onOpenDetails(album)}
          className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
        >
          <ListMusic className="w-3 h-3 text-amber-400" />
          <span>Faixas</span>
        </button>

        <button
          onClick={handleWebShare}
          className={`inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
            sharedNotice
              ? 'bg-emerald-600/90 text-white border-emerald-500 shadow-md shadow-emerald-950/40'
              : 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border-slate-700 hover:border-red-500/40'
          }`}
          title="Partilhar Álbum / EP via Web Share"
        >
          {sharedNotice ? (
            <Check className="w-3 h-3 text-emerald-200" />
          ) : (
            <Share2 className="w-3 h-3 text-red-400" />
          )}
          <span>{sharedNotice || 'Partilhar'}</span>
        </button>
      </div>
    </article>
  );
};
