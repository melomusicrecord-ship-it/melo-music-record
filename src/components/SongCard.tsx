import React, { useState } from 'react';
import { Download, Play, Pause, FileText, Info, Share2, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Song, Language } from '../types';
import { translations } from '../translations';
import { isToday, formatDate, getPlaceholderCover, normalizeUrl } from '../utils/helpers';
import { analyticsService } from '../services/analyticsService';

interface SongCardProps {
  song: Song;
  isPlaying: boolean;
  onPlay: (song: Song) => void;
  onOpenDetails: (song: Song) => void;
  lang: Language;
}

export const SongCard: React.FC<SongCardProps> = ({
  song,
  isPlaying,
  onPlay,
  onOpenDetails,
  lang
}) => {
  const [imageError, setImageError] = useState(false);
  const t = translations[lang] || translations.pt;
  const isReleaseToday = isToday(song.date);
  const hasLyrics = Boolean(song.lyrics && song.lyrics.trim().length > 0);

  const coverSrc = !imageError && song.cover ? normalizeUrl(song.cover) : getPlaceholderCover(song.title);

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    analyticsService.recordDownload(song);

    // Subtle celebration feedback
    try {
      confetti({
        particleCount: 28,
        spread: 55,
        origin: { y: 0.8 },
        colors: ['#e02434', '#e8bb4a', '#1e4976']
      });
    } catch {
      // Ignored
    }

    const downloadLink = normalizeUrl(song.link);
    window.open(downloadLink, '_blank', 'noopener,noreferrer');
  };

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay(song);
  };

  return (
    <article className="group bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-red-950/20 flex flex-col sm:flex-row gap-0 sm:gap-4 p-3.5 relative">
      {/* Cover Thumbnail Container */}
      <div
        onClick={() => onOpenDetails(song)}
        className="w-full sm:w-48 h-48 sm:h-auto aspect-square sm:aspect-auto rounded-lg overflow-hidden relative cursor-pointer flex-shrink-0 bg-slate-950"
      >
        <img
          src={coverSrc}
          alt={song.title}
          onError={() => setImageError(true)}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Studio Overlay with Quick Play Button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-center justify-center opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handlePlayToggle}
            className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-950 flex items-center justify-center transform active:scale-95 transition-all hover:scale-110"
            title={isPlaying ? t.btn_pause : t.btn_play}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>
        </div>

        {/* Minimal Unboxed Status Tags (Top Corner) */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 pointer-events-none">
          {isReleaseToday && (
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-red-650/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-red-500/40">
              <Flame className="w-3 h-3 text-red-400 fill-current animate-pulse" />
              <span>HOJE</span>
            </span>
          )}
          {hasLyrics && (
            <span className="text-[10px] font-semibold text-slate-200 bg-slate-950/80 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-slate-700/60">
              LETRA
            </span>
          )}
        </div>
      </div>

      {/* Info & Action Column */}
      <div className="flex-1 flex flex-col justify-between pt-3 sm:pt-1">
        <div>
          {/* Typographic Metadata Line (No static pill enclosure) */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium mb-1.5">
            <span className="text-amber-400/90 font-semibold uppercase tracking-wider text-[11px]">
              {song.category || 'Música'}
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{formatDate(song.date, lang)}</span>
            {song.plays ? (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-400">{song.plays.toLocaleString()} {t.plays_count}</span>
              </>
            ) : null}
          </div>

          {/* Title */}
          <h2
            onClick={() => onOpenDetails(song)}
            className="text-base sm:text-lg font-bold text-white group-hover:text-amber-300 transition-colors cursor-pointer line-clamp-2 leading-snug mb-1"
          >
            {song.title}
          </h2>

          {/* Artist */}
          <p className="text-xs sm:text-sm text-sky-400 font-semibold mb-2">
            {song.artist || t.artist_unknown}
          </p>

          {/* Snippet */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
            {song.title} — Lançamento oficial disponível para download de alta velocidade na Melo Music Record.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/80">
          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:scale-98 transition-all shadow-md shadow-red-950/40"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.btn_download}</span>
          </button>

          {/* Details / Lyrics Button */}
          <button
            onClick={() => onOpenDetails(song)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700/80 transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>{hasLyrics ? `${t.btn_details} & Letra` : t.btn_details}</span>
          </button>

          {/* Listen Button */}
          <button
            onClick={handlePlayToggle}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-sky-300 hover:text-sky-200 bg-sky-950/50 hover:bg-sky-900/60 border border-sky-800/50 transition-all ml-auto"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>{t.btn_pause}</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>{t.btn_play}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
