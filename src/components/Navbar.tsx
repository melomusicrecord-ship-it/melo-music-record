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
  Radio,
  Music2
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
  lang,
  onSelectLanguage,
  isDark,
  onToggleTheme,
  isPlayingAudio
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const t = translations[lang] || translations.pt;
  const waUrl = buildWhatsAppLink(whatsappNumber, 'Olá Melo Music Record! Gostaria de mais informações.');

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'pt', label: 'Português', flag: '🇦🇴' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full transition-colors duration-200">
      {/* Top Bar with WhatsApp */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950/90 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="hidden sm:inline font-mono tracking-tight text-[11px] text-slate-300">
              ESTÚDIO LUANDA // 24/7 ONLINE
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium transition-all hover:scale-102"
              title="Contacto directo via WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: <strong className="text-emerald-300">{whatsappNumber}</strong></span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onSelectCategory('Todas');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group flex items-center gap-2.5 text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-600 via-red-700 to-sky-900 flex items-center justify-center shadow-lg shadow-red-950/50 group-hover:scale-105 transition-transform border border-red-500/30">
                <Music2 className="w-5 h-5 text-amber-200" />
              </div>
              <div className="leading-tight">
                <span className="text-base sm:text-lg font-extrabold tracking-tight text-white block">
                  Melo <span className="text-amber-400">Music</span> Record
                </span>
                <span className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold block">
                  {t.brand_sub}
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Menu */}
          <ul className="hidden lg:flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-300">
            <li>
              <button
                onClick={() => {
                  onSelectCategory('Todas');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-2 rounded-md transition-colors ${
                  activeCategory === 'Todas' && !searchQuery
                    ? 'text-amber-400 bg-slate-800/80'
                    : 'hover:text-amber-300 hover:bg-slate-800/40'
                }`}
              >
                {t.home}
              </button>
            </li>

            {/* Músicas Dropdown */}
            <li className="relative" onMouseLeave={() => setIsDropdownOpen(false)}>
              <button
                onMouseEnter={() => setIsDropdownOpen(true)}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-1 px-3 py-2 rounded-md hover:text-amber-300 hover:bg-slate-800/40 transition-colors"
              >
                <span>{t.songs}</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isDropdownOpen && (
                <div
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  className="absolute left-0 top-full mt-1 w-52 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1"
                >
                  <button
                    onClick={() => {
                      onSelectCategory('Todas');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs font-semibold hover:bg-red-950/40 hover:text-amber-300 transition-colors ${
                      activeCategory === 'Todas' ? 'text-amber-400 bg-slate-800' : 'text-slate-300'
                    }`}
                  >
                    {t.all_songs}
                  </button>
                  <div className="h-px bg-slate-800 my-1"></div>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        onSelectCategory(cat);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-1.5 text-xs font-medium hover:bg-red-950/40 hover:text-amber-300 transition-colors flex items-center justify-between ${
                        activeCategory === cat ? 'text-amber-400 bg-slate-800' : 'text-slate-300'
                      }`}
                    >
                      <span>{cat}</span>
                    </button>
                  ))}
                </div>
              )}
            </li>

            <li>
              <button
                onClick={() => onSelectCategory('Instrumentais')}
                className={`px-3 py-2 rounded-md transition-colors ${
                  activeCategory === 'Instrumentais'
                    ? 'text-amber-400 bg-slate-800/80'
                    : 'hover:text-amber-300 hover:bg-slate-800/40'
                }`}
              >
                {t.instrumentals}
              </button>
            </li>

            <li>
              <button
                onClick={onOpenNewsOnly}
                className="px-3 py-2 rounded-md hover:text-amber-300 hover:bg-slate-800/40 transition-colors"
              >
                {t.news_today}
              </button>
            </li>

            <li>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-2 rounded-md hover:text-red-400 hover:bg-slate-800/40 transition-colors text-slate-300"
              >
                <span>{t.youtube_channel}</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            </li>

            <li>
              <button
                onClick={onOpenAbout}
                className="px-3 py-2 rounded-md hover:text-amber-300 hover:bg-slate-800/40 transition-colors"
              >
                {t.about_us}
              </button>
            </li>
          </ul>

          {/* Search Bar + Controls */}
          <div className="flex items-center gap-2">
            {/* Search Box */}
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t.search_placeholder}
                className="w-36 sm:w-48 md:w-60 h-9 pl-8 pr-7 text-xs rounded-full bg-slate-800/90 text-slate-100 placeholder-slate-400 border border-slate-700/80 focus:border-red-500 focus:w-64 focus:outline-none transition-all duration-200"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 text-slate-400 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="h-9 px-2.5 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
                title="Alterar Idioma"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline uppercase text-[11px] font-bold tracking-wider">
                  {lang}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-36 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1 z-50">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        onSelectLanguage(l.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800 transition-colors ${
                        lang === l.code ? 'text-amber-400 font-bold bg-slate-800/50' : 'text-slate-300'
                      }`}
                    >
                      <span className="flex items-center gap-2">
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
              className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-200 transition-colors"
              title={isDark ? t.theme_light : t.theme_dark}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-sky-400" />
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-9 h-9 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-200"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-1 text-sm font-medium">
              <button
                onClick={() => {
                  onSelectCategory('Todas');
                  setIsMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-lg ${
                  activeCategory === 'Todas' ? 'bg-red-950/40 text-amber-400' : 'text-slate-300'
                }`}
              >
                {t.home}
              </button>

              <div className="px-3 py-1 text-xs uppercase tracking-wider text-slate-400 font-bold">
                {t.songs}
              </div>
              <div className="grid grid-cols-2 gap-1 pl-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      onSelectCategory(c);
                      setIsMenuOpen(false);
                    }}
                    className={`text-left text-xs px-2.5 py-1.5 rounded-md ${
                      activeCategory === c ? 'bg-slate-800 text-amber-400' : 'text-slate-400'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  onSelectCategory('Instrumentais');
                  setIsMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800"
              >
                {t.instrumentals}
              </button>

              <button
                onClick={() => {
                  onOpenNewsOnly();
                  setIsMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800"
              >
                {t.news_today}
              </button>

              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg text-red-400 flex items-center justify-between"
              >
                <span>{t.youtube_channel}</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <button
                onClick={() => {
                  onOpenAbout();
                  setIsMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800"
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
