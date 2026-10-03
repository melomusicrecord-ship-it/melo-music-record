import React, { useState } from 'react';
import {
  Search,
  ChevronDown,
  Globe,
  Sun,
  Moon,
  Menu,
  X,
  ExternalLink,
  MessageCircle,
  Disc3,
  Music2,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import { buildWhatsAppLink } from '../utils/helpers';

interface NavbarProps {
  whatsappNumber: string;
  youtubeUrl: string;
  categories: string[];
  activeCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAbout: () => void;
  onOpenNewsOnly: () => void;
  onOpenAlbumsOnly: () => void;
  isAlbumsActive: boolean;
  isNewsActive: boolean;
  lang: Language;
  onSelectLanguage: (lang: Language) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  isPlayingAudio: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  whatsappNumber,
  youtubeUrl,
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onOpenAbout,
  onOpenNewsOnly,
  onOpenAlbumsOnly,
  isAlbumsActive,
  isNewsActive,
  lang,
  onSelectLanguage,
  isDark,
  onToggleTheme
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileCatsOpen, setIsMobileCatsOpen] = useState(true);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const t = translations[lang] || translations.pt;
  const waUrl = buildWhatsAppLink(whatsappNumber, 'Olá Melo Music Record!');

  // Filter out 'Instrumentais' from vocal music styles so it remains strictly a standalone top-level section
  const musicStyles = categories.filter((c) => c.toLowerCase() !== 'instrumentais');
  const isInstrumentalsActive = activeCategory === 'Instrumentais' && !isAlbumsActive && !isNewsActive;
  const isMusicStyleActive = activeCategory !== 'Todas' && activeCategory !== 'Instrumentais' && !isAlbumsActive && !isNewsActive;

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'pt', label: 'Português', flag: '🇦🇴' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-colors duration-200">
      {/* Top Bar with WhatsApp (Contact number removed as requested) */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950/90 border-b border-slate-800/80 px-3 sm:px-4 py-1 text-[11px] text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[10px] tracking-tight text-slate-300">
              Estúdio Luanda // Online
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold transition-all hover:scale-102"
              title="Fale Connosco no WhatsApp"
            >
              <MessageCircle className="w-3 h-3 text-emerald-400" />
              <span>WhatsApp Oficial</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-4 h-14 sm:h-15 flex items-center justify-between gap-2">
          {/* Brand Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => {
                onSelectCategory('Todas');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group flex items-center gap-2 text-left focus:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 via-red-700 to-sky-900 flex items-center justify-center shadow-md shadow-red-950/50 group-hover:scale-105 transition-transform border border-red-500/30">
                <Music2 className="w-4 h-4 text-amber-200" />
              </div>
              <div className="leading-tight">
                <span className="text-xs sm:text-sm md:text-base font-extrabold tracking-tight text-white block">
                  Melo <span className="text-amber-400">Music</span> Record
                </span>
                <span className="text-[9px] text-slate-400 tracking-wider font-medium block">
                  {t.brand_sub}
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Menu (Title Case with Initial Capitals, slightly smaller text for better fit) */}
          <ul className="hidden xl:flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
            <li>
              <button
                onClick={() => {
                  onSelectCategory('Todas');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
                  activeCategory === 'Todas' && !searchQuery && !isAlbumsActive && !isNewsActive
                    ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/40 border border-red-500 ring-2 ring-red-400/30'
                    : 'hover:text-amber-300 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                {activeCategory === 'Todas' && !searchQuery && !isAlbumsActive && !isNewsActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
                <span>{t.home}</span>
              </button>
            </li>

            {/* Músicas Dropdown (Apenas Estilos Musicais, sem Instrumentais) */}
            <li className="relative" onMouseLeave={() => setIsDropdownOpen(false)}>
              <button
                onMouseEnter={() => setIsDropdownOpen(true)}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
                  isMusicStyleActive
                    ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/40 border border-red-500 ring-2 ring-red-400/30'
                    : 'hover:text-amber-300 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                {isMusicStyleActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
                <span>{isMusicStyleActive ? activeCategory : t.songs}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {isDropdownOpen && (
                <div
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  className="absolute left-0 top-full mt-1 w-48 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl py-1.5 z-50 p-1"
                >
                  <button
                    onClick={() => {
                      onSelectCategory('Todas');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
                      activeCategory === 'Todas' && !isAlbumsActive
                        ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/30'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {t.all_songs}
                  </button>
                  <div className="h-px bg-slate-800 my-1"></div>
                  {musicStyles.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        onSelectCategory(cat);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-[11px] font-medium rounded-lg transition-all flex items-center justify-between ${
                        activeCategory === cat && !isAlbumsActive
                          ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/30'
                          : 'text-slate-300 hover:bg-slate-800 hover:text-amber-300'
                      }`}
                    >
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              )}
            </li>

            {/* Menu: Álbum e EP */}
            <li>
              <button
                onClick={onOpenAlbumsOnly}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                  isAlbumsActive
                    ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/40 border border-red-500 ring-2 ring-red-400/30'
                    : 'hover:text-amber-300 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                {isAlbumsActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
                <Disc3 className="w-3.5 h-3.5 text-white" />
                <span>{t.albums_eps}</span>
              </button>
            </li>

            {/* Menu: Instrumentais (No top, fora das músicas por não ser estilo) */}
            <li>
              <button
                onClick={() => {
                  onSelectCategory('Instrumentais');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                  isInstrumentalsActive
                    ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/40 border border-red-500 ring-2 ring-red-400/30'
                    : 'hover:text-amber-300 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                {isInstrumentalsActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.instrumentals}</span>
              </button>
            </li>

            <li>
              <button
                onClick={onOpenNewsOnly}
                className={`px-3 py-1.5 rounded-full transition-all ${
                  isNewsActive
                    ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/40 border border-red-500 ring-2 ring-red-400/30'
                    : 'hover:text-amber-300 hover:bg-slate-800/60 border border-transparent'
                }`}
              >
                {t.news_today}
              </button>
            </li>

            <li>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md hover:text-red-400 hover:bg-slate-800/40 transition-colors text-slate-300"
              >
                <span>{t.youtube_channel}</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
            </li>

            <li>
              <button
                onClick={onOpenAbout}
                className="px-2.5 py-1.5 rounded-md hover:text-amber-300 hover:bg-slate-800/40 transition-colors"
              >
                {t.about_us}
              </button>
            </li>
          </ul>

          {/* Search Bar + Controls (Optimized for small screens) */}
          <div className="flex items-center gap-1.5">
            {/* Desktop / Tablet Search Box */}
            <div className="hidden md:flex relative items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t.search_placeholder}
                className="w-40 lg:w-52 h-8 pl-7 pr-6 text-[11px] rounded-full bg-slate-800/90 text-slate-100 placeholder-slate-400 border border-slate-700/80 focus:border-red-500 focus:outline-none transition-all duration-200"
              />
              <Search className="w-3 h-3 text-slate-400 absolute left-2.5 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 text-slate-400 hover:text-white p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Mobile Search Icon Toggle */}
            <button
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="md:hidden w-8 h-8 rounded-full bg-slate-800/90 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-200"
              title="Pesquisar"
              aria-label="Abrir Pesquisa"
            >
              <Search className="w-3.5 h-3.5 text-slate-300" />
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="h-8 px-2 rounded-full bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-[10px] font-semibold text-slate-200 flex items-center gap-1 transition-colors"
                title="Alterar Idioma"
              >
                <Globe className="w-3 h-3 text-amber-400" />
                <span className="uppercase font-mono">{lang}</span>
              </button>

              {isLangOpen && (
                <div className="absolute right-0 top-full mt-1 w-32 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        onSelectLanguage(l.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 text-[11px] flex items-center justify-between hover:bg-slate-800 transition-colors ${
                        lang === l.code ? 'text-amber-400 font-bold bg-slate-800/50' : 'text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{l.flag}</span>
                        <span>{l.label}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={onToggleTheme}
              className="w-8 h-8 rounded-full bg-slate-800/90 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-200 transition-colors flex-shrink-0"
              title={isDark ? t.theme_light : t.theme_dark}
            >
              {isDark ? (
                <Sun className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-sky-400" />
              )}
            </button>

            {/* Mobile Hamburger Toggle (Always visible on mobile/tablet) */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="xl:hidden w-8 h-8 rounded-full bg-red-600/90 hover:bg-red-500 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-red-950 transition-colors"
              aria-label={isMenuOpen ? 'Fechar Menu' : 'Abrir Menu'}
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Expand Bar */}
        {isMobileSearchOpen && (
          <div className="md:hidden px-3 py-2 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t.search_placeholder}
                className="w-full h-8 pl-8 pr-7 text-xs rounded-full bg-slate-900 text-slate-100 placeholder-slate-400 border border-slate-700 focus:border-red-500 focus:outline-none"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              onClick={() => setIsMobileSearchOpen(false)}
              className="px-2.5 py-1 text-xs text-slate-400 hover:text-white"
            >
              Fechar
            </button>
          </div>
        )}

        {/* ========================================================
            MOBILE MENU DRAWER (Guaranteed to show & fit on phone!)
        ======================================================== */}
        {isMenuOpen && (
          <div className="xl:hidden border-t border-slate-800 bg-slate-950/98 backdrop-blur-2xl px-4 py-4 space-y-3 max-h-[82vh] overflow-y-auto shadow-2xl">
            <div className="flex flex-col gap-1.5 text-xs font-semibold">
              <button
                onClick={() => {
                  onSelectCategory('Todas');
                  setIsMenuOpen(false);
                }}
                className={`text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all ${
                  activeCategory === 'Todas' && !isAlbumsActive && !isNewsActive
                    ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/40 border border-red-500 ring-2 ring-red-400/30'
                    : 'text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  {activeCategory === 'Todas' && !isAlbumsActive && !isNewsActive && (
                    <span className="w-2 h-2 rounded-full bg-white shadow-sm shadow-white animate-pulse" />
                  )}
                  <span>{t.home}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Mobile Álbum e EP */}
              <button
                onClick={() => {
                  onOpenAlbumsOnly();
                  setIsMenuOpen(false);
                }}
                className={`text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all ${
                  isAlbumsActive
                    ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/40 border border-red-500 ring-2 ring-red-400/30'
                    : 'text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isAlbumsActive && (
                    <span className="w-2 h-2 rounded-full bg-white shadow-sm shadow-white animate-pulse" />
                  )}
                  <Disc3 className="w-3.5 h-3.5 text-red-500" />
                  <span>{t.albums_eps}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Mobile Instrumentais (Fora das músicas por não ser estilo) */}
              <button
                onClick={() => {
                  onSelectCategory('Instrumentais');
                  setIsMenuOpen(false);
                }}
                className={`text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all ${
                  isInstrumentalsActive
                    ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/40 border border-red-500 ring-2 ring-red-400/30'
                    : 'text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isInstrumentalsActive && (
                    <span className="w-2 h-2 rounded-full bg-white shadow-sm shadow-white animate-pulse" />
                  )}
                  <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.instrumentals}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Mobile News Hoje */}
              <button
                onClick={() => {
                  onOpenNewsOnly();
                  setIsMenuOpen(false);
                }}
                className={`text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all ${
                  isNewsActive
                    ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/40 border border-red-500 ring-2 ring-red-400/30'
                    : 'text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isNewsActive && (
                    <span className="w-2 h-2 rounded-full bg-white shadow-sm shadow-white animate-pulse" />
                  )}
                  <span>{t.news_today}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Mobile Categories Accordion (Apenas Estilos Musicais, sem Instrumentais duplicado) */}
              <div className="pt-2 border-t border-slate-800">
                <button
                  onClick={() => setIsMobileCatsOpen(!isMobileCatsOpen)}
                  className="w-full flex items-center justify-between px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-400"
                >
                  <span>Géneros de Música ({musicStyles.length})</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${isMobileCatsOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isMobileCatsOpen && (
                  <div className="grid grid-cols-2 gap-1.5 p-2 bg-slate-900/60 rounded-xl mt-1 border border-slate-800">
                    <button
                      onClick={() => {
                        onSelectCategory('Todas');
                        setIsMenuOpen(false);
                      }}
                      className={`text-left text-[11px] px-2.5 py-1.5 rounded-lg truncate ${
                        activeCategory === 'Todas' ? 'bg-red-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      Todas as Músicas
                    </button>
                    {musicStyles.map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          onSelectCategory(c);
                          setIsMenuOpen(false);
                        }}
                        className={`text-left text-[11px] px-2.5 py-1.5 rounded-lg truncate ${
                          activeCategory === c
                            ? 'bg-red-600 text-white font-bold'
                            : 'text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* YouTube Channel link */}
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg text-red-400 flex items-center justify-between hover:bg-slate-900 transition-colors mt-2"
              >
                <span>{t.youtube_channel}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {/* Saber Mais */}
              <button
                onClick={() => {
                  onOpenAbout();
                  setIsMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-900 transition-colors"
              >
                {t.about_us}
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
