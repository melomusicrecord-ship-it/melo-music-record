import React, { useState, useEffect, useMemo } from 'react';
import {
  Flame,
  SlidersHorizontal,
  Music2,
  Disc3,
  Search,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Song, Album, NewsItem, SiteConfig, Language, CustomMenuItem } from './types';
import { translations } from './translations';
import {
  DEFAULT_CONFIG,
  DEFAULT_CATEGORIES,
  DEFAULT_CUSTOM_MENUS,
  getDemoSongs,
  getDemoAlbums,
  getDemoNews
} from './services/defaultData';
import { smartCache } from './services/cacheService';
import { audioPlayer, PlayerState } from './services/audioPlayerService';
import {
  testFirestoreConnection,
  getSongsFromFirestore,
  getAlbumsFromFirestore,
  getNewsFromFirestore,
  getConfigFromFirestore,
  getCustomMenusFromFirestore
} from './services/firebase';
import { isToday, buildWhatsAppLink } from './utils/helpers';
import { Navbar } from './components/Navbar';
import { SongCard } from './components/SongCard';
import { AlbumCard } from './components/AlbumCard';
import { NewsCard } from './components/NewsCard';
import { Sidebar } from './components/Sidebar';
import { SongDetailModal } from './components/SongDetailModal';
import { AlbumDetailModal } from './components/AlbumDetailModal';
import { NewsDetailModal } from './components/NewsDetailModal';
import { AboutModal } from './components/AboutModal';
import { AdminModal } from './components/AdminModal';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { CustomPageModal } from './components/CustomPageModal';

export default function App() {
  // --- Persistent State Initialization (Demo songs removed so user starts clean) ---
  const [songs, setSongs] = useState<Song[]>(() => {
    const cached = smartCache.get<Song[]>('songs_list');
    if (cached && Array.isArray(cached)) {
      const realCached = cached.filter(
        (s) => !s.id?.startsWith('song-') && !s.link?.includes('pixabay.com')
      );
      if (realCached.length > 0) return realCached;
    }
    try {
      const saved = localStorage.getItem('melo_music_record_v5');
      if (saved) {
        const parsed: Song[] = JSON.parse(saved);
        const realSaved = parsed.filter(
          (s) => !s.id?.startsWith('song-') && !s.link?.includes('pixabay.com')
        );
        return realSaved;
      }
    } catch {}
    return [];
  });

  const [albums, setAlbums] = useState<Album[]>(() => {
    const cached = smartCache.get<Album[]>('albums_list');
    if (cached && Array.isArray(cached) && cached.length > 0) return cached;
    try {
      const saved = localStorage.getItem('melo_albums_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return getDemoAlbums();
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

  const [customMenus, setCustomMenus] = useState<CustomMenuItem[]>(() => {
    const cached = smartCache.get<CustomMenuItem[]>('custom_menus_list');
    if (cached && Array.isArray(cached) && cached.length > 0) return cached;
    try {
      const saved = localStorage.getItem('melo_custom_menus_v1');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_CUSTOM_MENUS;
  });

  const [customPageModal, setCustomPageModal] = useState<{
    isOpen: boolean;
    title: string;
    content: string;
    badge?: string;
  }>({
    isOpen: false,
    title: '',
    content: '',
    badge: undefined
  });

  // --- UI & Preferences State ---
  const [activeCategory, setActiveCategory] = useState<string>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showOnlyNews, setShowOnlyNews] = useState<boolean>(false);
  const [showOnlyAlbums, setShowOnlyAlbums] = useState<boolean>(false);

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
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
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
      localStorage.setItem('melo_albums_v1', JSON.stringify(albums));
      smartCache.set('albums_list', albums);
    } catch {}
  }, [albums]);

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
      localStorage.setItem('melo_custom_menus_v1', JSON.stringify(customMenus));
      smartCache.set('custom_menus_list', customMenus);
    } catch {}
  }, [customMenus]);

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
      ...albums.map((a) => a.cover).filter(Boolean),
      ...news.map((n) => n.image).filter(Boolean)
    ];
    smartCache.preloadAssets(urls);
  }, []);

  // --- Initialize Firestore Connection & Real-Time / Cloud Sync ---
  useEffect(() => {
    testFirestoreConnection();

    let isMounted = true;
    async function syncFirestoreData() {
      try {
        const [cloudSongs, cloudAlbums, cloudNews, cloudConfig, cloudMenus] =
          await Promise.allSettled([
            getSongsFromFirestore(),
            getAlbumsFromFirestore(),
            getNewsFromFirestore(),
            getConfigFromFirestore(),
            getCustomMenusFromFirestore()
          ]);
        if (!isMounted) return;

        if (cloudSongs.status === 'fulfilled') {
          setSongs(cloudSongs.value);
        }
        if (cloudAlbums.status === 'fulfilled' && cloudAlbums.value.length > 0) {
          setAlbums(cloudAlbums.value);
        }
        if (cloudNews.status === 'fulfilled' && cloudNews.value.length > 0) {
          setNews(cloudNews.value);
        }
        if (cloudConfig.status === 'fulfilled' && cloudConfig.value) {
          setConfig(cloudConfig.value);
        }
        if (cloudMenus.status === 'fulfilled' && cloudMenus.value.length > 0) {
          setCustomMenus(cloudMenus.value);
        }
      } catch (err) {
        console.warn('Firestore initial sync notice:', err);
      }
    }
    syncFirestoreData();

    return () => {
      isMounted = false;
    };
  }, []);

  // --- Dynamic Categories ---
  const allCategories = useMemo(() => {
    const set = new Set(DEFAULT_CATEGORIES);
    customCategories.forEach((c) => set.add(c));
    songs.forEach((s) => {
      if (s.category) set.add(s.category);
    });
    albums.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return Array.from(set);
  }, [customCategories, songs, albums]);

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

  // --- Filtered Albums ---
  const filteredAlbums = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return albums
      .filter((a) => activeCategory === 'Todas' || a.category === activeCategory)
      .filter((a) => {
        if (!q) return true;
        return (
          (a.title || '').toLowerCase().includes(q) ||
          (a.artist || '').toLowerCase().includes(q) ||
          (a.category || '').toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (b.date || 0) - (a.date || 0));
  }, [albums, activeCategory, searchQuery]);

  // Today releases count
  const todaySongs = useMemo(() => filteredSongs.filter((s) => isToday(s.date)), [filteredSongs]);
  const todayAlbums = useMemo(() => filteredAlbums.filter((a) => isToday(a.date)), [filteredAlbums]);
  const olderSongs = useMemo(() => {
    const todayIds = new Set(todaySongs.map((s) => s.id));
    return filteredSongs.filter((s) => !todayIds.has(s.id));
  }, [filteredSongs, todaySongs]);

  const todayNewsCount = useMemo(() => news.filter((n) => isToday(n.date)).length, [news]);
  const totalTodayReleases = todaySongs.length + todayAlbums.length + todayNewsCount;

  // TOP 10 Songs (for sidebar)
  const top10Songs = useMemo(() => {
    return [...songs]
      .sort((a, b) => ((b.plays || 0) + (b.downloads || 0)) - ((a.plays || 0) + (a.downloads || 0)))
      .slice(0, 10);
  }, [songs]);

  // Counts of songs per category for the sidebar
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    songs.forEach((s) => {
      if (s.category) {
        counts[s.category] = (counts[s.category] || 0) + 1;
      }
    });
    return counts;
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
          setShowOnlyAlbums(false);
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setShowOnlyNews(false);
          setShowOnlyAlbums(false);
        }}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenNewsOnly={() => {
          setShowOnlyNews(true);
          setShowOnlyAlbums(false);
          setActiveCategory('Todas');
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAlbumsOnly={() => {
          setShowOnlyAlbums(true);
          setShowOnlyNews(false);
          setActiveCategory('Todas');
          setSearchQuery('');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isAlbumsActive={showOnlyAlbums}
        isNewsActive={showOnlyNews}
        lang={lang}
        onSelectLanguage={setLang}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
        isPlayingAudio={playerState.isPlaying}
        customMenus={customMenus}
        onOpenCustomPage={(title, content, badge) => {
          setCustomPageModal({
            isOpen: true,
            title,
            content,
            badge
          });
        }}
      />

      {/* Main Layout Grid */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-5">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_310px] gap-5 sm:gap-7">
          {/* Main Feed Content Area */}
          <div className="space-y-4 sm:space-y-5 min-w-0">
            {/* "Tudo de Hoje" Banner */}
            <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-sky-950/40 border-l-4 border-l-red-600 border border-slate-800 rounded-xl p-3.5 sm:p-4 flex items-center justify-between flex-wrap gap-2.5 shadow-lg relative overflow-hidden">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600"></span>
                </span>
                <div>
                  <h2 className="text-xs sm:text-sm font-extrabold text-amber-300">
                    {t.today_banner_title}
                  </h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {totalTodayReleases > 0 ? t.today_banner_sub : t.today_empty_sub}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white bg-red-600 shadow-md shadow-red-950/60">
                  {totalTodayReleases} {t.today_badge}
                </span>
              </div>
            </div>

            {/* Filter Bar (When searching or filtered) */}
            {(activeCategory !== 'Todas' || searchQuery || showOnlyNews || showOnlyAlbums) && (
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2 flex items-center justify-between text-[11px] animate-in fade-in">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <SlidersHorizontal className="w-3 h-3 text-amber-400" />
                  <span>{t.showing_filter}</span>
                  <strong className="text-amber-400 font-bold">
                    {showOnlyAlbums
                      ? 'Álbum e EP'
                      : showOnlyNews
                      ? 'Notícias'
                      : activeCategory !== 'Todas'
                      ? activeCategory
                      : `"${searchQuery}"`}
                  </strong>
                </div>
                <button
                  onClick={() => {
                    setActiveCategory('Todas');
                    setSearchQuery('');
                    setShowOnlyNews(false);
                    setShowOnlyAlbums(false);
                  }}
                  className="text-[11px] font-semibold text-sky-400 hover:text-amber-300 underline transition-colors"
                >
                  {t.show_all}
                </button>
              </div>
            )}

            {/* ÁLBUNS & EPS SECTION */}
            {(showOnlyAlbums || (!showOnlyNews && !searchQuery && filteredAlbums.length > 0)) && (
              <section className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <h3 className="text-xs sm:text-sm font-extrabold text-amber-400 flex items-center gap-1.5">
                    <Disc3 className="w-3.5 h-3.5 text-red-500" />
                    <span>{t.albums_section_title}</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    {filteredAlbums.length} projetos
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  {filteredAlbums.map((album) => (
                    <AlbumCard
                      key={album.id}
                      album={album}
                      onOpenDetails={setSelectedAlbum}
                      lang={lang}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* NEWS SECTION ("News Hoje & Destaques") */}
            {(showOnlyNews || (activeCategory === 'Todas' && !searchQuery && !showOnlyAlbums && newsToDisplay.length > 0)) && (
              <section className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <h3 className="text-xs sm:text-sm font-extrabold text-amber-400 flex items-center gap-1.5">
                    <span className="w-1 h-3 rounded bg-red-600 inline-block"></span>
                    <span>{t.news_section_title}</span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    {newsToDisplay.length} artigos
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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

            {/* TRACKS / INSTRUMENTAIS LIST SECTION */}
            {!showOnlyNews && !showOnlyAlbums && (
              <section className="space-y-3 pt-1">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <h3 className="text-xs sm:text-sm font-extrabold text-amber-400 flex items-center gap-1.5">
                    <span className="w-1 h-3 rounded bg-red-600 inline-block"></span>
                    <span>
                      {activeCategory === 'Todas' && !searchQuery
                        ? t.songs_section_today
                        : activeCategory === 'Instrumentais'
                        ? 'Instrumentais & Beats Exclusivos'
                        : `${t.songs}: ${activeCategory}`}
                    </span>
                  </h3>
                  <span className="text-[10px] font-mono text-slate-400">
                    {filteredSongs.length} {activeCategory === 'Instrumentais' ? 'instrumentais' : 'músicas'}
                  </span>
                </div>

                {filteredSongs.length === 0 ? (
                  songs.length === 0 && !searchQuery ? (
                    <div className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 text-center text-slate-300 space-y-4 shadow-xl">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-sky-900 text-amber-200 mx-auto flex items-center justify-center shadow-lg shadow-red-950/60 border border-red-500/30">
                        <Music2 className="w-7 h-7" />
                      </div>
                      <div className="space-y-1.5 max-w-md mx-auto">
                        <h4 className="text-base sm:text-lg font-extrabold text-white">
                          Biblioteca Pronta para Músicas Oficiais
                        </h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Todos os arquivos de demonstração foram limpos com sucesso. Novas músicas, beats e instrumentais oficiais estarão disponíveis em breve para reprodução e download direto.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 sm:p-10 text-center text-slate-400 space-y-2.5">
                      <div className="w-12 h-12 rounded-full bg-slate-800/80 text-slate-500 mx-auto flex items-center justify-center">
                        <Music2 className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-white">
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
                        className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-colors"
                      >
                        {t.show_all}
                      </button>
                    </div>
                  )
                ) : (
                  <div className="space-y-2.5">
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
                      <div className="pt-3 pb-0.5">
                        <h4 className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                          <span className="w-1 h-2.5 rounded bg-sky-600 inline-block"></span>
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

          {/* Sidebar Area with Top 10 and Categories */}
          <div className="w-full">
            <Sidebar
              config={config}
              top10Songs={top10Songs}
              onSelectSong={setSelectedSong}
              categories={allCategories}
              activeCategory={activeCategory}
              onSelectCategory={(cat) => {
                setActiveCategory(cat);
                setShowOnlyAlbums(false);
                setShowOnlyNews(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenAlbumsOnly={() => {
                setShowOnlyAlbums(true);
                setShowOnlyNews(false);
                setActiveCategory('Todas');
                setSearchQuery('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              isAlbumsActive={showOnlyAlbums}
              categoryCounts={categoryCounts}
              totalAlbumsCount={albums.length}
              totalSongsCount={songs.length}
              lang={lang}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 py-6 px-4 text-center text-[11px] text-slate-500 mt-10">
        <div className="max-w-7xl mx-auto space-y-2">
          <div className="flex items-center justify-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center">
              <Music2 className="w-3 h-3" />
            </div>
            <span className="font-extrabold text-slate-200">Melo Music Record</span>
            <span className="text-amber-400">·</span>
            <span className="text-slate-400 capitalize">{t.brand_sub}</span>
          </div>

          <p>
            &copy; {new Date().getFullYear()} <strong>Melo Music Record</strong> — {t.footer_rights} Luanda, Angola.
          </p>
        </div>
      </footer>

      {/* Discreet Administrator Trigger Dot */}
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

      {/* Album Details Modal */}
      <AlbumDetailModal
        album={selectedAlbum}
        onClose={() => setSelectedAlbum(null)}
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

      {/* Admin Panel Modal with 2FA, Albums, Analytics, Cache & CRUD */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        songs={songs}
        albums={albums}
        news={news}
        config={config}
        categories={allCategories}
        customMenus={customMenus}
        onSaveSongs={setSongs}
        onSaveAlbums={setAlbums}
        onSaveNews={setNews}
        onSaveConfig={setConfig}
        onSaveCustomMenus={setCustomMenus}
        onAddCategory={handleAddCategory}
        lang={lang}
      />

      {/* Custom Information Page Modal (Dynamic Menus) */}
      <CustomPageModal
        isOpen={customPageModal.isOpen}
        onClose={() => setCustomPageModal((prev) => ({ ...prev, isOpen: false }))}
        title={customPageModal.title}
        content={customPageModal.content}
        badge={customPageModal.badge}
        whatsappUrl={buildWhatsAppLink(
          config.whatsapp,
          `Olá Melo Music Record! Tenho interesse em: ${customPageModal.title}`
        )}
      />
    </div>
  );
}
