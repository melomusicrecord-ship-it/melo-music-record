import React from 'react';
import {
  Share2,
  TrendingUp,
  Phone,
  MessageCircle,
  Mail,
  Youtube,
  MapPin,
  ExternalLink,
  Music2,
  Facebook,
  Twitter,
  Instagram
} from 'lucide-react';
import { Song, SiteConfig, Language } from '../types';
import { translations } from '../translations';
import { getPlaceholderCover, normalizeUrl, buildWhatsAppLink } from '../utils/helpers';
import { NewsletterWidget } from './NewsletterWidget';

interface SidebarProps {
  config: SiteConfig;
  popularSongs: Song[];
  onSelectSong: (song: Song) => void;
  lang: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({
  config,
  popularSongs,
  onSelectSong,
  lang
}) => {
  const t = translations[lang] || translations.pt;
  const waUrl = buildWhatsAppLink(config.whatsapp, 'Olá Melo Music Record!');

  return (
    <aside className="space-y-6">
      {/* Widget 1: Social Plugin */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center gap-2">
          <Share2 className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            {t.social_plugin_title}
          </h3>
        </div>

        <div className="p-3.5 grid grid-cols-4 gap-2">
          {/* Facebook */}
          <a
            href={normalizeUrl(config.facebook)}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 rounded-lg bg-[#1877F2]/10 hover:bg-[#1877F2] text-[#1877F2] hover:text-white border border-[#1877F2]/30 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
            title="Facebook"
          >
            <Facebook className="w-4 h-4" />
          </a>

          {/* Twitter / X */}
          <a
            href={normalizeUrl(config.twitter)}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 rounded-lg bg-slate-800 hover:bg-black text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
            title="X / Twitter"
          >
            <Twitter className="w-4 h-4" />
          </a>

          {/* Instagram */}
          <a
            href={normalizeUrl(config.instagram)}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 rounded-lg bg-gradient-to-tr from-amber-500/10 via-rose-500/10 to-purple-500/10 hover:from-amber-600 hover:via-rose-600 hover:to-purple-600 text-rose-400 hover:text-white border border-rose-500/30 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
            title="Instagram"
          >
            <Instagram className="w-4 h-4" />
          </a>

          {/* YouTube */}
          <a
            href={normalizeUrl(config.youtube)}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 rounded-lg bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/30 flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
            title="YouTube"
          >
            <Youtube className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Widget 2: Popular Tracks */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            {t.popular_title}
          </h3>
        </div>

        <div className="p-3 divide-y divide-slate-800/80">
          {popularSongs.slice(0, 4).map((song, i) => {
            const cover = song.cover ? normalizeUrl(song.cover) : getPlaceholderCover(song.title);
            return (
              <div
                key={song.id}
                onClick={() => onSelectSong(song)}
                className="py-2.5 first:pt-1 last:pb-1 flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-slate-950 relative border border-slate-800">
                  <img
                    src={cover}
                    alt={song.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute top-0.5 left-0.5 w-4 h-4 rounded bg-black/70 text-[9px] font-bold text-amber-400 flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors line-clamp-1 leading-snug">
                    {song.title}
                  </h4>
                  <p className="text-[11px] text-sky-400 truncate mt-0.5">
                    {song.artist || 'Melo Music'}
                  </p>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
                    {song.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Widget 3: Newsletter VIP */}
      <NewsletterWidget lang={lang} />

      {/* Widget 4: Official Contacts */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center gap-2">
          <Phone className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-white">
            {t.contacts_title}
          </h3>
        </div>

        <div className="p-3 space-y-2 text-xs">
          {config.whatsapp && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors group"
            >
              <div className="w-7 h-7 rounded-md bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-4 h-4" />
              </div>
              <span className="truncate text-emerald-400 font-medium">{config.whatsapp}</span>
            </a>
          )}

          {config.email && (
            <a
              href={`mailto:${config.email}`}
              className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors group"
            >
              <div className="w-7 h-7 rounded-md bg-red-500/10 text-red-400 flex items-center justify-center flex-shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <span className="truncate text-slate-300 group-hover:text-red-400 transition-colors font-medium">
                {config.email}
              </span>
            </a>
          )}

          {config.youtube && (
            <a
              href={normalizeUrl(config.youtube)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors group"
            >
              <div className="w-7 h-7 rounded-md bg-red-600/10 text-red-500 flex items-center justify-center flex-shrink-0">
                <Youtube className="w-4 h-4" />
              </div>
              <span className="truncate text-slate-300 group-hover:text-red-400 transition-colors font-medium">
                Canal Oficial YouTube
              </span>
            </a>
          )}

          {config.location && (
            <div className="flex items-center gap-2.5 p-2 rounded-lg text-slate-400">
              <div className="w-7 h-7 rounded-md bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="truncate font-medium">{config.location}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
