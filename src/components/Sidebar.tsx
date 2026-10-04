import React from 'react';
import {
  Share2,
  Trophy,
  Play,
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
  categories?: string[];
  activeCategory?: string;
  onSelectCategory?: (cat: string) => void;
  onOpenAlbumsOnly?: () => void;
  isAlbumsActive?: boolean;
  categoryCounts?: Record<string, number>;
  totalAlbumsCount?: number;
  totalSongsCount?: number;
  lang: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({
  config,
  top10Songs,
  onSelectSong,
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

      {/* Widget 3: Newsletter VIP */}
      <NewsletterWidget lang={lang} />
    </aside>
  );
};
