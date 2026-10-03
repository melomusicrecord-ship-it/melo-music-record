import React, { useState } from 'react';
import { Download, Play, Pause, FileText, Flame, Share2, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Song, Language } from '../types';
import { translations } from '../translations';
import { isToday, formatDate, getPlaceholderCover, normalizeUrl, shareViaWebShare } from '../utils/helpers';
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
  const [sharedNotice, setSharedNotice] = useState<string | null>(null);
  const t = translations[lang] || translations.pt;
  const isReleaseToday = isToday(song.date);
  const hasLyrics = Boolean(song.lyrics && song.lyrics.trim().length > 0);

  const coverSrc = !imageError && song.cover ? normalizeUrl(song.cover) : getPlaceholderCover(song.title);

  const handleWebShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const songUrl = normalizeUrl(song.link) || window.location.href;
    const shareText = `Ouve e baixa "${song.title}" de ${song.artist || 'Melo Music'} na Melo Music Record:`;

    const result = await shareViaWebShare({
      title: `${song.title} - ${song.artist || 'Melo Music'}`,
      text: shareText,
      url: songUrl
    });

    if (result.shared) {
      analyticsService.recordShare(song.title, result.method === 'web-share' ? 'Web Share' : 'Copied Link');
      setSharedNotice(result.method === 'web-share' ? 'Partilhado!' : 'Link copiado!');
      setTimeout(() => setSharedNotice(null), 2500);
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    analyticsService.recordDownload(song);

    try {
      confetti({
        particleCount: 25,
        spread: 50,
        origin: { y: 0.8 },
        colors: ['#e02434', '#e8bb4a', '#1e4976']
      });
    } catch {}

    const downloadLink = normalizeUrl(song.link);
    window.open(downloadLink, '_blank', 'noopener,noreferrer');
  };

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay(song);
  };

  return (
    <article className="group bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-red-950/20 flex flex-col sm:flex-row gap-0 sm:gap-3.5 p-3 relative">
      {/* Cover Thumbnail Container */}
      <div
        onClick={() => onOpenDetails(song)}
        className="w-full sm:w-40 h-44 sm:h-auto aspect-video sm:aspect-square rounded-lg overflow-hidden relative cursor-pointer flex-shrink-0 bg-slate-950"
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
            className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-950 flex items-center justify-center transform active:scale-95 transition-all hover:scale-110"
            title={isPlaying ? t.btn_pause : t.btn_play}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>
        </div>

        {/* Minimal Unboxed Status Tags (Top Corner) */}
        <div className="absolute top-2 left-2 flex items-center gap-1.5 pointer-events-none">
          {isReleaseToday && (
            <span className="flex items-center gap-1 text-[9px] font-bold tracking-wider text-amber-300 bg-red-600/90 backdrop-blur-md px-2 py-0.5 rounded-full border border-red-500/40">
              <Flame className="w-2.5 h-2.5 text-red-400 fill-current animate-pulse" />
              <span>Hoje</span>
            </span>
          )}
          {hasLyrics && (
            <span className="text-[9px] font-semibold text-slate-200 bg-slate-950/80 backdrop-blur-md px-1.5 py-0.5 rounded-md border border-slate-700/60">
              Letra
            </span>
          )}
        </div>
      </div>

      {/* Info & Action Column */}
      <div className="flex-1 flex flex-col justify-between pt-2.5 sm:pt-0 min-w-0">
        <div>
          {/* Metadata Line */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium mb-1">
            <span className="text-amber-400 font-semibold">{song.category || 'Música'}</span>
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
            className="text-xs sm:text-sm md:text-base font-bold text-white group-hover:text-amber-300 transition-colors cursor-pointer line-clamp-2 leading-snug mb-1"
          >
            {song.title}
          </h2>

          {/* Artist */}
          <p className="text-[11px] sm:text-xs text-sky-400 font-semibold mb-1.5 truncate">
            {song.artist || t.artist_unknown}
          </p>

          {/* Snippet */}
          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2.5">
            {song.title} — Lançamento oficial disponível para download de alta velocidade na Melo Music Record.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80">
          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 active:scale-98 transition-all shadow-sm"
          >
            <Download className="w-3 h-3" />
            <span>{t.btn_download}</span>
          </button>

          {/* Details / Lyrics Button */}
          <button
            onClick={() => onOpenDetails(song)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all"
          >
            <FileText className="w-3 h-3 text-amber-400" />
            <span>{hasLyrics ? 'Letra & Detalhes' : t.btn_details}</span>
          </button>

          {/* Web Share Button */}
          <button
            onClick={handleWebShare}
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all ${
              sharedNotice
                ? 'bg-emerald-600/90 text-white border-emerald-500 shadow-md shadow-emerald-950/40'
                : 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border-slate-700 hover:border-red-500/40'
            }`}
            title="Partilhar nas redes sociais via Web Share"
          >
            {sharedNotice ? (
              <>
                <Check className="w-3 h-3 text-emerald-200" />
                <span className="font-bold text-white">{sharedNotice}</span>
              </>
            ) : (
              <>
                <Share2 className="w-3 h-3 text-red-400" />
                <span>Partilhar</span>
              </>
            )}
          </button>

          {/* Listen Button */}
          <button
            onClick={handlePlayToggle}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-sky-300 hover:text-sky-200 bg-sky-950/50 hover:bg-sky-900/60 border border-sky-800/50 transition-all ml-auto"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3" />
                <span>{t.btn_pause}</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3" />
                <span>{t.btn_play}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
