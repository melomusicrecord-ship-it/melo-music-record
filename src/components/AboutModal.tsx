import React from 'react';
import { X, MessageCircle, Mail, Youtube, MapPin, Music2, ExternalLink } from 'lucide-react';
import { SiteConfig, Language } from '../types';
import { translations } from '../translations';
import { buildWhatsAppLink, normalizeUrl } from '../utils/helpers';

interface AboutModalProps {
  config: SiteConfig;
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const AboutModal: React.FC<AboutModalProps> = ({ config, isOpen, onClose, lang }) => {
  if (!isOpen) return null;

  const t = translations[lang] || translations.pt;
  const waUrl = buildWhatsAppLink(config.whatsapp, 'Olá Melo Music Record! Vim através do site oficial.');

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative my-auto animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="p-6 bg-gradient-to-b from-sky-950/80 via-slate-900 to-slate-900 border-b border-slate-800 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-sky-900 flex items-center justify-center shadow-lg shadow-red-950/50 border border-red-500/30">
            <Music2 className="w-7 h-7 text-amber-200" />
          </div>

          <h2 className="text-xl font-bold text-white">Melo Music Record</h2>
          <p className="text-xs text-amber-400 font-medium uppercase tracking-wider mt-0.5">
            {t.brand_sub}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {/* Contacts List */}
          <div className="space-y-2">
            {config.whatsapp && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-200 hover:text-white transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    WhatsApp Oficial
                  </span>
                  <span className="text-sm font-semibold text-emerald-400 truncate block">
                    {config.whatsapp}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500" />
              </a>
            )}

            {config.email && (
              <a
                href={`mailto:${config.email}`}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-200 hover:text-white transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-red-500/10 text-red-400 border border-red-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Email de Produção
                  </span>
                  <span className="text-sm font-semibold text-red-400 truncate block">
                    {config.email}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500" />
              </a>
            )}

            {config.youtube && (
              <a
                href={normalizeUrl(config.youtube)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 text-slate-200 hover:text-white transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-red-600/10 text-red-500 border border-red-600/30 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  <Youtube className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Canal do YouTube
                  </span>
                  <span className="text-sm font-semibold text-slate-200 truncate block">
                    @melomusicrecord
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500" />
              </a>
            )}

            {config.location && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 text-slate-300">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                    Localização do Estúdio
                  </span>
                  <span className="text-sm font-semibold text-slate-200">
                    {config.location}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Biography Text */}
          {config.about && (
            <div className="pt-3 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Sobre a Gravadora & Visão
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {config.about}
              </p>
            </div>
          )}
        </div>

        <div className="px-6 py-3 bg-slate-950/80 border-t border-slate-800 text-center text-[11px] text-slate-500">
          © {new Date().getFullYear()} Melo Music Record — Luanda, Angola
        </div>
      </div>
    </div>
  );
};
