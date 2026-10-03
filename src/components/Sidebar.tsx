import React from 'react';
import {
  Share2,
  Trophy,
  Play,
  Disc3,
  Music,
  SlidersHorizontal,
  FolderOpen,
  ChevronRight,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from 'lucide-react';
import { Song, SiteConfig, Language } from '../types';
import { translations } from '../translations';
import { getPlaceholderCover, normalizeUrl } from '../utils/helpers';
import { NewsletterWidget } from './NewsletterWidget';

interface SidebarProps {
  config: SiteConfig;
  top10Songs: Song[];
  onSelectSong: (song: Song) => void;
  categories: string[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  onOpenAlbumsOnly: () => void;
  isAlbumsActive: boolean;
  categoryCounts?: Record<string, number>;
  totalAlbumsCount?: number;
  totalSongsCount?: number;
  lang: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({
  config,
  top10Songs,
  onSelectSong,
  categories,
  activeCategory,
  onSelectCategory,
  onOpenAlbumsOnly,
  isAlbumsActive,
  categoryCounts = {},
  totalAlbumsCount = 0,
  totalSongsCount = 0,
  lang
}) => {
  const t = translations[lang] || translations.pt;

  return (
    <aside className="space-y-5">
      {/* Widget 1: Social Plugin */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-slate-900 px-3.5 py-2 border-b border-slate-800 flex items-center gap-2">
          <Share2 className="w-3.5 h-3.5 text-amber-400" />
          <h3 className="text-xs font-bold tracking-wider text-white">
            {t.social_plugin_title}
          </h3>
        </div>

        <div className="p-3 grid grid-cols-4 gap-2">
          <a
            href={normalizeUrl(config.facebook)}
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 rounded-lg bg-[#1877F2]/10 hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-[#1877F2]/30 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
            title="Facebook"
          >
            <Facebook className="w-3.5 h-3.5" />
          </a>

          <a
            href={normalizeUrl(config.twitter)}
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 rounded-lg bg-slate-800 hover:bg-black text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
            title="X / Twitter"
          >
            <Twitter className="w-3.5 h-3.5" />
          </a>

          <a
            href={normalizeUrl(config.instagram)}
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 rounded-lg bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-purple-500/10 hover:from-amber-600 hover:via-rose-600 hover:to-purple-600 text-rose-400 hover:text-white border border-rose-500/30 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
            title="Instagram"
          >
            <Instagram className="w-3.5 h-3.5" />
          </a>

          <a
            href={normalizeUrl(config.youtube)}
            target="_blank"
            rel="noopener noreferrer"
            className="h-9 rounded-lg bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/30 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
            title="YouTube"
          >
            <Youtube className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Widget 2: TOP 10 MÚSICAS */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-red-950 via-slate-900 to-slate-900 px-3.5 py-2 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <h3 className="text-xs font-bold tracking-wider text-white">
              {t.top_10_title}
            </h3>
          </div>
          <span className="text-[10px] font-bold text-amber-400 font-mono">
            TOP 10
          </span>
        </div>

        <div className="p-2 divide-y divide-slate-800/70">
          {top10Songs.slice(0, 10).map((song, i) => {
            const cover = song.cover ? normalizeUrl(song.cover) : getPlaceholderCover(song.title);
            const rank = i + 1;

            return (
              <div
                key={song.id}
                onClick={() => onSelectSong(song)}
                className="py-1.5 px-1.5 flex items-center gap-2.5 cursor-pointer group hover:bg-slate-800/60 rounded-lg transition-colors"
              >
                {/* Rank Number */}
                <div
                  className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 font-mono ${
                    rank === 1
                      ? 'bg-amber-400 text-slate-950 shadow-sm shadow-amber-400/30'
                      : rank === 2
                      ? 'bg-slate-300 text-slate-950'
                      : rank === 3
                      ? 'bg-amber-700 text-white'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {rank}
                </div>

                {/* Cover */}
                <div className="w-9 h-9 rounded-md overflow-hidden flex-shrink-0 bg-slate-950 relative border border-slate-800">
                  <img
                    src={cover}
                    alt={song.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                    <Play className="w-3 h-3 fill-current ml-0.5 text-amber-300" />
                  </div>
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-[11px] font-bold text-slate-200 group-hover:text-amber-300 transition-colors line-clamp-1 leading-snug">
                    {song.title}
                  </h4>
                  <p className="text-[10px] text-sky-400 truncate">
                    {song.artist || 'Melo Music'}
                  </p>
                </div>

                {/* Metric */}
                <div className="text-right flex-shrink-0 pl-1">
                  <span className="text-[9px] font-mono font-semibold text-slate-400 block">
                    {song.plays ? song.plays.toLocaleString() : '800+'}
                  </span>
                  <span className="text-[8px] text-slate-500 uppercase">
                    plays
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Widget 3: CATEGORIAS & ESTILOS DE MÚSICA (Posicionado no lado direito logo após o Top 10) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-slate-900 px-3.5 py-2 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
            <h3 className="text-xs font-bold tracking-wider text-white">
              Estilos & Categorias
            </h3>
          </div>
          <span className="text-[10px] text-slate-400">
            {categories.length + 2} opções
          </span>
        </div>

        <div className="p-2 space-y-1">
          {/* Todas as Músicas */}
          <button
            onClick={() => onSelectCategory('Todas')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
              activeCategory === 'Todas' && !isAlbumsActive
                ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/40 border border-red-500 ring-2 ring-red-400/30 scale-[1.02]'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2">
              {activeCategory === 'Todas' && !isAlbumsActive ? (
                <span className="w-2 h-2 rounded-full bg-white shadow-sm shadow-white animate-pulse" />
              ) : (
                <Music className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>Todas as Músicas</span>
            </div>
            {totalSongsCount > 0 && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                activeCategory === 'Todas' && !isAlbumsActive
                  ? 'bg-red-800/90 text-white font-bold'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {totalSongsCount}
              </span>
            )}
          </button>

          {/* Álbum e EP */}
          <button
            onClick={onOpenAlbumsOnly}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
              isAlbumsActive
                ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/40 border border-red-500 ring-2 ring-red-400/30 scale-[1.02]'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2">
              {isAlbumsActive ? (
                <span className="w-2 h-2 rounded-full bg-white shadow-sm shadow-white animate-pulse" />
              ) : (
                <Disc3 className="w-3.5 h-3.5 text-red-500" />
              )}
              <span>Álbum e EP</span>
            </div>
            {totalAlbumsCount > 0 && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                isAlbumsActive
                  ? 'bg-red-800/90 text-white font-bold'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {totalAlbumsCount}
              </span>
            )}
          </button>

          {/* Instrumentais (Fora das músicas e estilos) */}
          <button
            onClick={() => onSelectCategory('Instrumentais')}
            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
              activeCategory === 'Instrumentais' && !isAlbumsActive
                ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/40 border border-red-500 ring-2 ring-red-400/30 scale-[1.02]'
                : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
            }`}
          >
            <div className="flex items-center gap-2">
              {activeCategory === 'Instrumentais' && !isAlbumsActive ? (
                <span className="w-2 h-2 rounded-full bg-white shadow-sm shadow-white animate-pulse" />
              ) : (
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              )}
              <span>Instrumentais</span>
            </div>
            {categoryCounts && (categoryCounts['Instrumentais'] || 0) > 0 && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                activeCategory === 'Instrumentais' && !isAlbumsActive
                  ? 'bg-red-800/90 text-white font-bold'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {categoryCounts['Instrumentais']}
              </span>
            )}
          </button>

          <div className="h-px bg-slate-800/80 my-1"></div>

          {/* Lista de Categorias / Estilos Musicais (Sem duplicar Instrumentais) */}
          <div className="space-y-1">
            {categories
              .filter((cat) => cat.toLowerCase() !== 'instrumentais')
              .map((cat) => {
              const count = categoryCounts[cat] || 0;
              const isActive = activeCategory === cat && !isAlbumsActive;

              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`w-full text-left px-3 py-1.5 rounded-xl text-[11px] font-medium flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/40 border border-red-500 ring-2 ring-red-400/30 scale-[1.02]'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-amber-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={`w-2 h-2 rounded-full transition-all ${isActive ? 'bg-white shadow-sm shadow-white animate-pulse' : 'bg-slate-600'}`}></span>
                    <span className="truncate">{cat}</span>
                  </div>

                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-red-800/90 text-white font-bold' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Widget 4: Newsletter VIP */}
      <NewsletterWidget lang={lang} />
    </aside>
  );
};
