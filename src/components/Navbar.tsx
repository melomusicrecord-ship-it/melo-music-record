import React, { useState, useEffect } from 'react';
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
  ChevronRight,
  Home,
  Info
} from 'lucide-react';
import { Language, CustomMenuItem } from '../types';
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
  customMenus?: CustomMenuItem[];
  onOpenCustomPage?: (title: string, content: string, badge?: string) => void;
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
  onToggleTheme,
  customMenus = [],
  onOpenCustomPage
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeCustomDropdownId, setActiveCustomDropdownId] = useState<string | null>(null);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileCatsOpen, setIsMobileCatsOpen] = useState(true);
  const [expandedMobileCustomMenuId, setExpandedMobileCustomMenuId] = useState<string | null>(null);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const t = translations[lang] || translations.pt;
  const waUrl = buildWhatsAppLink(whatsappNumber, 'Olá Melo Music Record!');

  // Filter out 'Instrumentais' from musical genres so it remains strictly a standalone top-level section
  const musicStyles = categories.filter((c) => c.toLowerCase() !== 'instrumentais');
  const isInstrumentalsActive = activeCategory === 'Instrumentais' && !isAlbumsActive && !isNewsActive;
  const isMusicStyleActive = activeCategory !== 'Todas' && activeCategory !== 'Instrumentais' && !isAlbumsActive && !isNewsActive;

  // Filter visible custom menus sorted by order
  const visibleCustomMenus = customMenus
    .filter((m) => m.visible !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  // Lock body scroll and listen for Escape key when left drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isMenuOpen]);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'pt', label: 'Português', flag: '🇦🇴' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'es', label: 'Español', flag: '🇪🇸' }
  ];

  const handleCustomMenuClick = (menu: CustomMenuItem) => {
    if (menu.type === 'page') {
      if (onOpenCustomPage) {
        onOpenCustomPage(menu.label, menu.pageContent || '', menu.badge);
      }
    } else if (menu.type === 'category') {
      onSelectCategory(menu.categoryFilter || menu.label);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (menu.type === 'link' && menu.url) {
      window.open(menu.url, menu.target || '_blank');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full transition-colors duration-200">
      {/* 1. TOP STATUS BAR */}
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

      {/* 2. MAIN NAVBAR (Single clean header bar: No duplicated menu below!) */}
      <nav className="bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-xl">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-4 h-14 sm:h-15 flex items-center justify-between gap-3">
          {/* Brand Logo & Left Hamburger Button (3 Riscos) */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
            {/* 3 Riscos Button on Left for Mobile & Tablet */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="xl:hidden w-8 h-8 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white flex items-center justify-center flex-shrink-0 border border-slate-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
              aria-label="Abrir Menu Lateral"
              title="Abrir Menu Lateral"
            >
              <Menu className="w-4 h-4 text-amber-400" />
            </button>

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

          {/* Desktop Navigation Links (Title Case with Initial Capitals) */}
          <ul className="hidden xl:flex items-center gap-1.5 text-[11px] font-semibold text-slate-300">
            {/* 1. Início */}
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

            {/* 2. Músicas Dropdown (Apenas Estilos Musicais, sem Instrumentais) */}
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

            {/* 3. Álbum e EP */}
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

            {/* 4. Instrumentais (No top, fora das músicas por não ser estilo) */}
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

            {/* 5. News Hoje */}
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

            {/* 6. Dynamic Custom Menus & Submenus */}
            {visibleCustomMenus.map((cMenu) => {
              const hasSubmenus = cMenu.type === 'dropdown' && cMenu.submenus && cMenu.submenus.length > 0;
              const isCustomDropdownOpen = activeCustomDropdownId === cMenu.id;

              if (hasSubmenus) {
                return (
                  <li
                    key={cMenu.id}
                    className="relative"
                    onMouseLeave={() => setActiveCustomDropdownId(null)}
                  >
                    <button
                      onMouseEnter={() => setActiveCustomDropdownId(cMenu.id)}
                      onClick={() =>
                        setActiveCustomDropdownId(isCustomDropdownOpen ? null : cMenu.id)
                      }
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:text-amber-300 hover:bg-slate-800/60 transition-all border border-transparent"
                    >
                      <span>{cMenu.label}</span>
                      {cMenu.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-red-600 text-white font-bold">
                          {cMenu.badge}
                        </span>
                      )}
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

                    {isCustomDropdownOpen && (
                      <div
                        onMouseEnter={() => setActiveCustomDropdownId(cMenu.id)}
                        className="absolute left-0 top-full mt-1 w-52 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl py-1.5 z-50 p-1"
                      >
                        {cMenu.submenus!.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setActiveCustomDropdownId(null);
                              if (sub.type === 'page') {
                                if (onOpenCustomPage) {
                                  onOpenCustomPage(sub.label, sub.pageContent || '', cMenu.badge);
                                }
                              } else if (sub.type === 'category') {
                                onSelectCategory(sub.categoryFilter || sub.label);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              } else if (sub.type === 'link' && sub.url) {
                                window.open(sub.url, sub.target || '_blank');
                              }
                            }}
                            className="w-full text-left px-3 py-1.5 text-[11px] font-medium rounded-lg text-slate-300 hover:bg-slate-800 hover:text-amber-300 transition-colors flex items-center justify-between"
                          >
                            <span className="truncate">{sub.label}</span>
                            <ChevronRight className="w-3 h-3 text-slate-500" />
                          </button>
                        ))}
                      </div>
                    )}
                  </li>
                );
              }

              return (
                <li key={cMenu.id}>
                  <button
                    onClick={() => handleCustomMenuClick(cMenu)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full hover:text-amber-300 hover:bg-slate-800/60 transition-all border border-transparent"
                  >
                    <span>{cMenu.label}</span>
                    {cMenu.badge && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-red-600 text-white font-bold">
                        {cMenu.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}

            {/* 7. Canal YouTube */}
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

            {/* 8. Sobre Nós */}
            <li>
              <button
                onClick={onOpenAbout}
                className="px-2.5 py-1.5 rounded-md hover:text-amber-300 hover:bg-slate-800/40 transition-colors"
              >
                {t.about_us}
              </button>
            </li>
          </ul>

          {/* Search Bar + Controls (Discreet: No public Admin button!) */}
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
      </nav>

      {/* ========================================================
          3. OFF-CANVAS LEFT DRAWER FOR TABLET & MOBILE (When clicking 3 riscos)
          Discreet: No public Admin buttons here!
      ======================================================== */}
      {isMenuOpen && (
        <div className="xl:hidden fixed inset-0 z-50 flex animate-in fade-in duration-200">
          {/* Dark Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Left-Side Drawer Panel */}
          <div className="relative w-72 sm:w-80 max-w-[85vw] h-full bg-slate-950 border-r border-slate-800 shadow-2xl flex flex-col z-50 overflow-hidden animate-in slide-in-from-left duration-250">
            {/* Drawer Header */}
            <div className="p-3.5 sm:p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/70">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 via-red-700 to-sky-900 flex items-center justify-center shadow-md shadow-red-950/50 border border-red-500/30">
                  <Music2 className="w-4 h-4 text-amber-200" />
                </div>
                <div className="leading-tight">
                  <span className="text-xs sm:text-sm font-extrabold tracking-tight text-white block">
                    Melo <span className="text-amber-400">Music</span>
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium block">
                    {t.brand_sub}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition-colors"
                aria-label="Fechar Menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Search inside Drawer */}
            <div className="p-3 border-b border-slate-800/80 bg-slate-900/30">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={t.search_placeholder}
                  className="w-full h-8 pl-8 pr-7 text-xs rounded-lg bg-slate-900 text-slate-100 placeholder-slate-400 border border-slate-800 focus:border-red-500 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => onSearchChange('')}
                    className="absolute right-2 text-slate-400 hover:text-white p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Scrollable Navigation Menu (Lateral Esquerda) */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 text-xs font-semibold">
              {/* 1. Início */}
              <button
                onClick={() => {
                  onSelectCategory('Todas');
                  setIsMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all ${
                  activeCategory === 'Todas' && !isAlbumsActive && !isNewsActive && !searchQuery
                    ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/40 border border-red-500 ring-2 ring-red-400/30'
                    : 'text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {activeCategory === 'Todas' && !isAlbumsActive && !isNewsActive && !searchQuery && (
                    <span className="w-2 h-2 rounded-full bg-white shadow-sm shadow-white animate-pulse" />
                  )}
                  <Home className="w-4 h-4 text-amber-400" />
                  <span>{t.home}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* 2. Álbum e EP */}
              <button
                onClick={() => {
                  onOpenAlbumsOnly();
                  setIsMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all ${
                  isAlbumsActive
                    ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/40 border border-red-500 ring-2 ring-red-400/30'
                    : 'text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isAlbumsActive && (
                    <span className="w-2 h-2 rounded-full bg-white shadow-sm shadow-white animate-pulse" />
                  )}
                  <Disc3 className="w-4 h-4 text-red-500" />
                  <span>{t.albums_eps}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* 3. Instrumentais (Fora das músicas, no topo do menu lateral) */}
              <button
                onClick={() => {
                  onSelectCategory('Instrumentais');
                  setIsMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all ${
                  isInstrumentalsActive
                    ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/40 border border-red-500 ring-2 ring-red-400/30'
                    : 'text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isInstrumentalsActive && (
                    <span className="w-2 h-2 rounded-full bg-white shadow-sm shadow-white animate-pulse" />
                  )}
                  <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                  <span>{t.instrumentals}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* 4. News Hoje */}
              <button
                onClick={() => {
                  onOpenNewsOnly();
                  setIsMenuOpen(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all ${
                  isNewsActive
                    ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/40 border border-red-500 ring-2 ring-red-400/30'
                    : 'text-slate-200 hover:bg-slate-900 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isNewsActive && (
                    <span className="w-2 h-2 rounded-full bg-white shadow-sm shadow-white animate-pulse" />
                  )}
                  <span>{t.news_today}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* 5. Dynamic Custom Menus in Drawer */}
              {visibleCustomMenus.map((cMenu) => {
                const hasSubmenus = cMenu.type === 'dropdown' && cMenu.submenus && cMenu.submenus.length > 0;
                const isExpanded = expandedMobileCustomMenuId === cMenu.id;

                if (hasSubmenus) {
                  return (
                    <div key={cMenu.id} className="pt-1">
                      <button
                        onClick={() =>
                          setExpandedMobileCustomMenuId(isExpanded ? null : cMenu.id)
                        }
                        className="w-full text-left px-3.5 py-2 rounded-xl text-slate-200 hover:bg-slate-900 flex items-center justify-between transition-colors border border-transparent"
                      >
                        <div className="flex items-center gap-2">
                          <span>{cMenu.label}</span>
                          {cMenu.badge && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-red-600 text-white font-bold">
                              {cMenu.badge}
                            </span>
                          )}
                        </div>
                        <ChevronDown
                          className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="pl-4 pr-1 py-1 space-y-1">
                          {cMenu.submenus!.map((sub) => (
                            <button
                              key={sub.id}
                              onClick={() => {
                                setIsMenuOpen(false);
                                if (sub.type === 'page') {
                                  if (onOpenCustomPage) {
                                    onOpenCustomPage(sub.label, sub.pageContent || '', cMenu.badge);
                                  }
                                } else if (sub.type === 'category') {
                                  onSelectCategory(sub.categoryFilter || sub.label);
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                } else if (sub.type === 'link' && sub.url) {
                                  window.open(sub.url, sub.target || '_blank');
                                }
                              }}
                              className="w-full text-left px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900/80 transition-colors text-[11px] flex items-center justify-between"
                            >
                              <span>{sub.label}</span>
                              <ChevronRight className="w-3 h-3 text-slate-600" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={cMenu.id}
                    onClick={() => {
                      setIsMenuOpen(false);
                      handleCustomMenuClick(cMenu);
                    }}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl flex items-center justify-between transition-all text-slate-200 hover:bg-slate-900 border border-transparent"
                  >
                    <div className="flex items-center gap-2">
                      <span>{cMenu.label}</span>
                      {cMenu.badge && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-red-600 text-white font-bold">
                          {cMenu.badge}
                        </span>
                      )}
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                );
              })}

              {/* 6. Estilos Musicais Accordion (sem Instrumentais) */}
              <div className="pt-2">
                <button
                  onClick={() => setIsMobileCatsOpen(!isMobileCatsOpen)}
                  className="w-full text-left px-3.5 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between hover:text-slate-200"
                >
                  <span>Géneros de Música</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isMobileCatsOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isMobileCatsOpen && (
                  <div className="space-y-1 mt-1 pl-2">
                    {musicStyles.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          onSelectCategory(cat);
                          setIsMenuOpen(false);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between transition-all ${
                          activeCategory === cat && !isAlbumsActive && !isNewsActive
                            ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/30'
                            : 'text-slate-300 hover:text-amber-300 hover:bg-slate-900'
                        }`}
                      >
                        <span>{cat}</span>
                        {activeCategory === cat && !isAlbumsActive && !isNewsActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 7. Sobre Nós */}
              <button
                onClick={() => {
                  onOpenAbout();
                  setIsMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-sky-400" />
                  <span>{t.about_us}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* 8. Canal YouTube */}
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-left px-3.5 py-2 rounded-xl text-slate-300 hover:text-red-400 hover:bg-slate-900 flex items-center justify-between"
              >
                <span>{t.youtube_channel}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            </div>

            {/* Drawer Footer with WhatsApp */}
            <div className="p-3 border-t border-slate-800/80 bg-slate-900/50">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Oficial</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
