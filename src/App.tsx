import React, { useState, useEffect, useMemo } from 'react';
import {
  Flame,
  Radio,
  SlidersHorizontal,
  X,
  Music2,
  Headphones,
  Search,
  Sparkles,
  Shield,
  Layers
} from 'lucide-react';
import { Song, NewsItem, SiteConfig, Language } from './types';
import { translations } from './translations';
import { DEFAULT_CONFIG, DEFAULT_CATEGORIES, getDemoSongs, getDemoNews } from './services/defaultData';
import { smartCache } from './services/cacheService';
import { audioPlayer, PlayerState } from './services/audioPlayerService';
import { isToday, formatDate } from './utils/helpers';
import { Navbar } from './components/Navbar';
import { SongCard } from './components/SongCard';
import { NewsCard } from './components/NewsCard';
import { Sidebar } from './components/Sidebar';
import { SongDetailModal } from './components/SongDetailModal';
import { NewsDetailModal } from './components/NewsDetailModal';
import { AboutModal } from './components/AboutModal';
import { AdminModal } from './components/AdminModal';
import { AudioPlayerBar } from './components/AudioPlayerBar';

export default function App() {
  // --- Persistent State Initialization ---
  const [songs, setSongs] = useState<Song[]>(() => {
    const cached = smartCache.get<Song[]>('songs_list');
    if (cached && Array.isArray(cached) && cached.length > 0) return cached;
    try {
      const saved = localStorage.getItem('melo_music_record_v5');
      if (saved) return JSON.parse(saved);
    } catch {}
    return getDemoSongs();
  });

  const [news, setNews] = useState<NewsItem[]>(() => {
    const cached = smartCache.get<NewsItem[]>('news_list');
    if (cached && Array.isArray(cached) && cached.length > 0) return cached;
    try {
      const saved = localStorage.getItem('melo_news_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return getDemoNews();
  });

  const [config, setConfig] = useState<SiteConfig>(() => {
    const cached = smartCache.get<SiteConfig>('site_config');
    if (cached) return cached;
    try {
      const saved = localStorage.getItem('melo_music_config_v1');
      if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_CONFIG;
  });

  const [customCategories, setCustomCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('melo_custom_cats_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // --- UI & Preferences State ---
  const [activeCategory, setActiveCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showOnlyNews, setShowOnlyNews] = useState<boolean>(false);
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('mmr_lang');
      if (saved === 'pt' || saved === 'en' || saved === 'fr' || saved === 'es') return saved;
    } catch {}
    return 'pt';
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('mmr_theme');
      if (saved) return saved === 'dark';
    } catch {}
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  // --- Modals & Player State ---
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [playerState, setPlayerState] = useState<PlayerState>(audioPlayer.getState());

  const t = translations[lang] || translations.pt;

  // --- Subscribe to Audio Player ---
  useEffect(() => {
    const unsubscribe = audioPlayer.subscribe((state) => {
      setPlayerState(state);
    });
    return () => unsubscribe();
  }, []);

  // --- Cache & Storage Synchronization ---
  useEffect(() => {
    try {
      localStorage.setItem('melo_music_record_v5', JSON.stringify(songs));
      smartCache.set('songs_list', songs);
    } catch {}
  }, [songs]);

  useEffect(() => {
    try {
      localStorage.setItem('melo_news_v1', JSON.stringify(news));
      smartCache.set('news_list', news);
    } catch {}
  }, [news]);

  useEffect(() => {
    try {
      localStorage.setItem('melo_music_config_v1', JSON.stringify(config));
      smartCache.set('site_config', config);
    } catch {}
  }, [config]);

  useEffect(() => {
    try {
      localStorage.setItem('melo_custom_cats_v1', JSON.stringify(customCategories));
    } catch {}
  }, [customCategories]);

  useEffect(() => {
    try {
      localStorage.setItem('mmr_lang', lang);
    } catch {}
  }, [lang]);

  // --- Dark Mode / Light Mode Class ---
  useEffect(() => {
    try {
      localStorage.setItem('mmr_theme', isDark ? 'dark' : 'light');
    } catch {}
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // --- Preload initial media assets into Smart Cache ---
  useEffect(() => {
    const urls = [
      ...songs.map((s) => s.cover).filter(Boolean),
      ...news.map((n) => n.image).filter(Boolean)
    ];
    smartCache.preloadAssets(urls);
  }, []);

  // --- Dynamic Categories ---
  const allCategories = useMemo(() => {
    const set = new Set(DEFAULT_CATEGORIES);
    customCategories.forEach((c) => set.add(c));
    songs.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    return Array.from(set);
  }, [customCategories, songs]);

  const handleAddCategory = (newCat: string) => {
    if (!customCategories.includes(newCat)) {
      setCustomCategories((prev) => [...prev, newCat]);
    }
  };

  // --- Filtered Songs ---
  const filteredSongs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return songs
      .filter((s) => activeCategory === 'Todas' || s.category === activeCategory)
      .filter((s) => {
        if (!q) return true;
        return (
          (s.title || '').toLowerCase().includes(q) ||
          (s.artist || '').toLowerCase().includes(q) ||
          (s.category || '').toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (b.date || 0) - (a.date || 0));
  }, [songs, activeCategory, searchQuery]);

  // Today songs vs Previous
  const todaySongs = useMemo(() => filteredSongs.filter((s) => isToday(s.date)), [filteredSongs]);
  const olderSongs = useMemo(() => {
    const todayIds = new Set(todaySongs.map((s) => s.id));
    return filteredSongs.filter((s) => !todayIds.has(s.id));
  }, [filteredSongs, todaySongs]);

  // Today news
  const todayNewsCount = useMemo(() => news.filter((n) => isToday(n.date)).length, [news]);
  const totalTodayReleases = todaySongs.length + todayNewsCount;

  // Popular songs for sidebar
  const popularSongs = useMemo(() => {
    return [...songs].sort((a, b) => ((b.plays || 0) + (b.downloads || 0)) - ((a.plays || 0) + (a.downloads || 0)));
  }, [songs]);

  // News list to display
  const newsToDisplay = useMemo(() => {
    const sorted = [...news].sort((a, b) => (b.date || 0) - (a.date || 0));
    return showOnlyNews ? sorted : sorted.slice(0, 4);
  }, [news, showOnlyNews]);

  const handlePlaySong = (song: Song) => {
    if (playerState.currentSong?.id === song.id) {
      audioPlayer.togglePlay();
    } else {
      audioPlayer.playSong(song);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} transition-colors duration-300 pb-28`}>
      {/* Top Bar + Main Navbar */}
      <Navbar
        whatsappNumber={config.whatsapp}
        youtubeUrl={config.youtube}
        categories={allCategories}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setShowOnlyNews(false);
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setShowOnlyNews(false);
        }}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenNewsOnly={() => {
          setShowOnlyNews(true);
          setActiveCategory('Todas');
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        lang={lang}
        onSelectLanguage={setLang}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        isPlayingAudio={playerState.isPlaying}
      />

      {/* Main Layout Grid */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          {/* Main Feed Content Area */}
          <div className="space-y-6 min-w-0">
            {/* "TUDO DE HOJE" BANNER */}
            <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-sky-950/40 border-l-4 border-l-red-600 border border-slate-800 rounded-xl p-4 sm:p-5 flex items-center justify-between flex-wrap gap-3 shadow-lg relative overflow-hidden">
              <div className="flex items-center gap-3">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                </span>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-amber-300">
                    {t.today_banner_title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {totalTodayReleases > 0 ? t.today_banner_sub : t.today_empty_sub}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase text-white bg-red-600 shadow-md shadow-red-950/60">
                  {totalTodayReleases} {t.today_badge}
                </span>
              </div>
            </div>

            {/* FILTER BAR (When searching or viewing a specific genre) */}
            {(activeCategory !== 'Todas' || searchQuery || showOnlyNews) && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs animate-in fade-in">
                <div className="flex items-center gap-2 text-slate-300">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t.showing_filter}</span>
                  <strong className="text-amber-400 uppercase font-bold">
                    {showOnlyNews ? 'NOTÍCIAS' : activeCategory !== 'Todas' ? activeCategory : `"${searchQuery}"`}
                  </strong>
                </div>
                <button
                  onClick={() => {
                    setActiveCategory('Todas');
                    setSearchQuery('');
                    setShowOnlyNews(false);
                  }}
                  className="text-xs font-semibold text-sky-400 hover:text-amber-300 underline transition-colors"
                >
                  {t.show_all}
                </button>
              </div>
            )}

            {/* NEWS SECTION ("News Hoje & Destaques") */}
            {newsToDisplay.length > 0 && !searchQuery && (
              <section className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <span className="w-1 h-3.5 rounded bg-red-600 inline-block"></span>
                    <span>{t.news_section_title}</span>
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    {newsToDisplay.length} artigos
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {newsToDisplay.map((item) => (
                    <NewsCard
                      key={item.id}
                      news={item}
                      onOpenDetails={setSelectedNews}
                      lang={lang}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* TRACKS LIST SECTION */}
            {!showOnlyNews && (
              <section className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                    <span className="w-1 h-3.5 rounded bg-red-600 inline-block"></span>
                    <span>
                      {activeCategory === 'Todas' && !searchQuery
                        ? t.songs_section_today
                        : `${t.songs}: ${activeCategory}`}
                    </span>
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    {filteredSongs.length} músicas
                  </span>
                </div>

                {filteredSongs.length === 0 ? (
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 sm:p-12 text-center text-slate-400 space-y-3">
                    <div className="w-14 h-14 rounded-full bg-slate-800/80 text-slate-500 mx-auto flex items-center justify-center">
                      <Music2 className="w-7 h-7" />
                    </div>
                    <h4 className="text-base font-bold text-white">
                      {t.no_results_title}
                    </h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      {t.no_results_sub}
                    </p>
                    <button
                      onClick={() => {
                        setActiveCategory('Todas');
                        setSearchQuery('');
                      }}
                      className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-colors"
                    >
                      {t.show_all}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Today Tracks */}
                    {todaySongs.map((song) => (
                      <SongCard
                        key={song.id}
                        song={song}
                        isPlaying={playerState.isPlaying && playerState.currentSong?.id === song.id}
                        onPlay={handlePlaySong}
                        onOpenDetails={setSelectedSong}
                        lang={lang}
                      />
                    ))}

                    {/* Separator if both exist */}
                    {todaySongs.length > 0 && olderSongs.length > 0 && (
                      <div className="pt-4 pb-1">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                          <span className="w-1 h-3 rounded bg-sky-600 inline-block"></span>
                          <span>{t.songs_section_earlier}</span>
                        </h4>
                      </div>
                    )}

                    {/* Older Tracks */}
                    {olderSongs.map((song) => (
                      <SongCard
                        key={song.id}
                        song={song}
                        isPlaying={playerState.isPlaying && playerState.currentSong?.id === song.id}
                        onPlay={handlePlaySong}
                        onOpenDetails={setSelectedSong}
                        lang={lang}
                      />
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="w-full">
            <Sidebar
              config={config}
              popularSongs={popularSongs}
              onSelectSong={setSelectedSong}
              lang={lang}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="w-6 h-6 rounded-md bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center">
              <Music2 className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-slate-200">Melo Music Record</span>
            <span className="text-amber-400">·</span>
            <span className="text-slate-400">{t.brand_sub}</span>
          </div>

          <p>
            &copy; {new Date().getFullYear()} <strong>Melo Music Record</strong> — {t.footer_rights} Luanda, Angola.
          </p>
        </div>
      </footer>

      {/* ========================================================
          DISCREET ADMIN ACCESS BUTTON (Floating dot)
          The user explicitly highlighted:
          "menos o botão administrador discreto esta melhor o resto tu sabes com fazer"
      ======================================================== */}
      <button
        onClick={() => setIsAdminOpen(true)}
        aria-label="Acesso Restrito"
        title="Administração Melo Music"
        className="fixed bottom-3 right-3 z-50 w-3.5 h-3.5 rounded-full bg-red-600 opacity-25 hover:opacity-100 hover:scale-150 transition-all duration-300 shadow-md shadow-red-950 focus:outline-none focus:ring-2 focus:ring-red-500/50 cursor-pointer"
      />

      {/* Fixed Bottom Audio Player */}
      <AudioPlayerBar
        playerState={playerState}
        onOpenDetails={() => {
          if (playerState.currentSong) setSelectedSong(playerState.currentSong);
        }}
        lang={lang}
      />

      {/* Song Details & Lyrics Modal */}
      <SongDetailModal
        song={selectedSong}
        onClose={() => setSelectedSong(null)}
        isPlaying={playerState.isPlaying && playerState.currentSong?.id === selectedSong?.id}
        onPlay={handlePlaySong}
        lang={lang}
      />

      {/* News Details Modal */}
      <NewsDetailModal
        news={selectedNews}
        onClose={() => setSelectedNews(null)}
        lang={lang}
      />

      {/* About & Contacts Modal */}
      <AboutModal
        config={config}
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        lang={lang}
      />

      {/* Admin Panel Modal with 2FA, Analytics, Cache & CRUD */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        songs={songs}
        news={news}
        config={config}
        categories={allCategories}
        onSaveSongs={setSongs}
        onSaveNews={setNews}
        onSaveConfig={setConfig}
        onAddCategory={handleAddCategory}
        lang={lang}
      />
    </div>
  );
}
