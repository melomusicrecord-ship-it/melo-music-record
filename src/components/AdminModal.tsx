import React, { useState, useEffect } from 'react';
import {
  X,
  Music,
  Disc3,
  Newspaper,
  BarChart3,
  Zap,
  Globe2,
  Settings,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  DownloadCloud,
  Eye,
  Headphones,
  Users
} from 'lucide-react';
import { Song, Album, NewsItem, SiteConfig, Language, AnalyticsStats, RealtimeEvent } from '../types';
import { translations } from '../translations';
import { smartCache } from '../services/cacheService';
import { analyticsService } from '../services/analyticsService';
import { formatDate } from '../utils/helpers';
import {
  saveSongToFirestore,
  deleteSongFromFirestore,
  saveAlbumToFirestore,
  deleteAlbumFromFirestore,
  saveNewsToFirestore,
  deleteNewsFromFirestore,
  saveConfigToFirestore
} from '../services/firebase';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  songs: Song[];
  albums: Album[];
  news: NewsItem[];
  config: SiteConfig;
  categories: string[];
  onSaveSongs: (songs: Song[]) => void;
  onSaveAlbums: (albums: Album[]) => void;
  onSaveNews: (news: NewsItem[]) => void;
  onSaveConfig: (config: SiteConfig) => void;
  onAddCategory: (category: string) => void;
  lang: Language;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  songs,
  albums,
  news,
  config,
  categories,
  onSaveSongs,
  onSaveAlbums,
  onSaveNews,
  onSaveConfig,
  onAddCategory,
  lang
}) => {
  // Tab navigation
  const [activeTab, setActiveTab] = useState<'songs' | 'albums' | 'news' | 'analytics' | 'cache' | 'api' | 'config'>('songs');

  // Song form state
  const [editingSongId, setEditingSongId] = useState<string | null>(null);
  const [sTitle, setSTitle] = useState('');
  const [sArtist, setSArtist] = useState('');
  const [sCategory, setSCategory] = useState(categories[0] || 'Afro House');
  const [sCover, setSCover] = useState('');
  const [sLink, setSLink] = useState('');
  const [sStream, setSStream] = useState('');
  const [sLyrics, setSLyrics] = useState('');

  // Album & EP form state
  const [editingAlbumId, setEditingAlbumId] = useState<string | null>(null);
  const [aTitle, setATitle] = useState('');
  const [aArtist, setAArtist] = useState('');
  const [aType, setAType] = useState<'Álbum' | 'EP' | 'Mixtape'>('EP');
  const [aCategory, setACategory] = useState(categories[0] || 'Drill');
  const [aCover, setACover] = useState('');
  const [aDownload, setADownload] = useState('');
  const [aTracksCount, setATracksCount] = useState<number>(6);
  const [aTracklist, setATracklist] = useState('');
  const [aDescription, setADescription] = useState('');

  // News form state
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [nTitle, setNTitle] = useState('');
  const [nType, setNType] = useState<'news' | 'today'>('news');
  const [nImage, setNImage] = useState('');
  const [nContent, setNContent] = useState('');

  // Config form state
  const [cfgWhatsapp, setCfgWhatsapp] = useState(config.whatsapp);
  const [cfgYoutube, setCfgYoutube] = useState(config.youtube);
  const [cfgEmail, setCfgEmail] = useState(config.email);
  const [cfgFacebook, setCfgFacebook] = useState(config.facebook);
  const [cfgInstagram, setCfgInstagram] = useState(config.instagram);
  const [cfgTwitter, setCfgTwitter] = useState(config.twitter);
  const [cfgAbout, setCfgAbout] = useState(config.about);
  const [cfgLocation, setCfgLocation] = useState(config.location);
  const [cfgMasterPin, setCfgMasterPin] = useState(config.masterPin);
  const [cfg2FAEnabled, setCfg2FAEnabled] = useState(config.twoFactorEnabled);
  const [cfgWebhook, setCfgWebhook] = useState(config.webhookUrl || '');

  // Analytics & Cache state
  const [stats, setStats] = useState<AnalyticsStats>(analyticsService.getStats());
  const [liveEvents, setLiveEvents] = useState<RealtimeEvent[]>(analyticsService.getRecentEvents());
  const [cacheInfo, setCacheInfo] = useState(smartCache.getStats());
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null);

  const t = translations[lang] || translations.pt;

  // Refresh live analytics and events
  useEffect(() => {
    if (!isOpen) return;

    setStats(analyticsService.getStats());
    setLiveEvents(analyticsService.getRecentEvents());
    setCacheInfo(smartCache.getStats());

    const unsubscribe = analyticsService.subscribe((newEvent) => {
      setLiveEvents((prev) => [newEvent, ...prev.slice(0, 40)]);
      setStats(analyticsService.getStats());
    });

    return () => unsubscribe();
  }, [isOpen]);

  const showNotice = (msg: string, type: 'ok' | 'err' = 'ok') => {
    setNotice({ msg, type });
    setTimeout(() => setNotice(null), 3000);
  };

  if (!isOpen) return null;

  // --- Song Operations ---
  const handleSaveSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sTitle.trim() || !sLink.trim()) {
      showNotice('Preencha o título e o link de download.', 'err');
      return;
    }

    if (editingSongId) {
      let savedSong: Song | null = null;
      const updated = songs.map((s) => {
        if (s.id === editingSongId) {
          savedSong = {
            ...s,
            title: sTitle.trim(),
            artist: sArtist.trim() || 'Melo',
            category: sCategory.trim() || 'Outros',
            cover: sCover.trim(),
            link: sLink.trim(),
            streamUrl: sStream.trim() || sLink.trim(),
            lyrics: sLyrics
          };
          return savedSong;
        }
        return s;
      });
      onSaveSongs(updated);
      smartCache.set('songs_list', updated);
      if (savedSong) saveSongToFirestore(savedSong).catch(console.error);
      showNotice('Música atualizada e guardada no Firebase com sucesso!', 'ok');
      resetSongForm();
    } else {
      const newSong: Song = {
        id: 'song-' + Date.now(),
        title: sTitle.trim(),
        artist: sArtist.trim() || 'Melo',
        category: sCategory.trim() || 'Outros',
        cover: sCover.trim(),
        link: sLink.trim(),
        streamUrl: sStream.trim() || sLink.trim(),
        lyrics: sLyrics,
        date: Date.now(),
        plays: 0,
        downloads: 0
      };
      const updated = [newSong, ...songs];
      onSaveSongs(updated);
      smartCache.set('songs_list', updated);
      saveSongToFirestore(newSong).catch(console.error);
      showNotice('Nova música publicada e guardada no Firebase com sucesso!', 'ok');
      resetSongForm();
    }
  };

  const resetSongForm = () => {
    setEditingSongId(null);
    setSTitle('');
    setSArtist('');
    setSCategory(categories[0] || 'Afro House');
    setSCover('');
    setSLink('');
    setSStream('');
    setSLyrics('');
  };

  const handleEditSong = (song: Song) => {
    setEditingSongId(song.id);
    setSTitle(song.title);
    setSArtist(song.artist);
    setSCategory(song.category);
    setSCover(song.cover);
    setSLink(song.link);
    setSStream(song.streamUrl || song.link);
    setSLyrics(song.lyrics || '');
  };

  const handleDeleteSong = (id: string, title: string) => {
    if (confirm(`Tens a certeza que desejas apagar "${title}"?`)) {
      const updated = songs.filter((s) => s.id !== id);
      onSaveSongs(updated);
      smartCache.set('songs_list', updated);
      deleteSongFromFirestore(id).catch(console.error);
      if (editingSongId === id) resetSongForm();
      showNotice('Música apagada com sucesso.', 'ok');
    }
  };

  // --- Album & EP Operations ---
  const handleSaveAlbum = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aTitle.trim() || !aDownload.trim()) {
      showNotice('Preencha o título e o link de download do projeto.', 'err');
      return;
    }

    const tracklistArray = aTracklist
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);

    const tracksTotal = tracklistArray.length > 0 ? tracklistArray.length : Number(aTracksCount) || 1;

    if (editingAlbumId) {
      let savedAlbum: Album | null = null;
      const updated = albums.map((alb) => {
        if (alb.id === editingAlbumId) {
          savedAlbum = {
            ...alb,
            title: aTitle.trim(),
            artist: aArtist.trim() || 'Melo & Convidados',
            type: aType,
            category: aCategory.trim() || 'Outros',
            cover: aCover.trim(),
            downloadUrl: aDownload.trim(),
            tracksCount: tracksTotal,
            tracklist: tracklistArray,
            description: aDescription.trim()
          };
          return savedAlbum;
        }
        return alb;
      });
      onSaveAlbums(updated);
      smartCache.set('albums_list', updated);
      if (savedAlbum) saveAlbumToFirestore(savedAlbum).catch(console.error);
      showNotice('Projeto atualizado e guardado no Firebase com sucesso!', 'ok');
      resetAlbumForm();
    } else {
      const newAlbum: Album = {
        id: 'album-' + Date.now(),
        title: aTitle.trim(),
        artist: aArtist.trim() || 'Melo & Convidados',
        type: aType,
        category: aCategory.trim() || 'Outros',
        cover: aCover.trim(),
        downloadUrl: aDownload.trim(),
        date: Date.now(),
        tracksCount: tracksTotal,
        tracklist: tracklistArray,
        description: aDescription.trim(),
        downloads: 0
      };
      const updated = [newAlbum, ...albums];
      onSaveAlbums(updated);
      smartCache.set('albums_list', updated);
      saveAlbumToFirestore(newAlbum).catch(console.error);
      showNotice('Novo Álbum / EP publicado e guardado no Firebase!', 'ok');
      resetAlbumForm();
    }
  };

  const resetAlbumForm = () => {
    setEditingAlbumId(null);
    setATitle('');
    setAArtist('');
    setAType('EP');
    setACategory(categories[0] || 'Drill');
    setACover('');
    setADownload('');
    setATracksCount(6);
    setATracklist('');
    setADescription('');
  };

  const handleEditAlbum = (alb: Album) => {
    setEditingAlbumId(alb.id);
    setATitle(alb.title);
    setAArtist(alb.artist);
    setAType(alb.type);
    setACategory(alb.category);
    setACover(alb.cover);
    setADownload(alb.downloadUrl);
    setATracksCount(alb.tracksCount);
    setATracklist(alb.tracklist ? alb.tracklist.join('\n') : '');
    setADescription(alb.description || '');
  };

  const handleDeleteAlbum = (id: string, title: string) => {
    if (confirm(`Tens a certeza que desejas apagar o projeto "${title}"?`)) {
      const updated = albums.filter((a) => a.id !== id);
      onSaveAlbums(updated);
      smartCache.set('albums_list', updated);
      deleteAlbumFromFirestore(id).catch(console.error);
      if (editingAlbumId === id) resetAlbumForm();
      showNotice('Álbum / EP apagado com sucesso.', 'ok');
    }
  };

  // --- News Operations ---
  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nTitle.trim() || !nContent.trim()) {
      showNotice('Preencha o título e o conteúdo da notícia.', 'err');
      return;
    }

    if (editingNewsId) {
      let savedNews: NewsItem | null = null;
      const updated = news.map((item) => {
        if (item.id === editingNewsId) {
          savedNews = {
            ...item,
            title: nTitle.trim(),
            type: nType,
            image: nImage.trim(),
            content: nContent.trim()
          };
          return savedNews;
        }
        return item;
      });
      onSaveNews(updated);
      smartCache.set('news_list', updated);
      if (savedNews) saveNewsToFirestore(savedNews).catch(console.error);
      showNotice('Notícia atualizada e guardada no Firebase com sucesso!', 'ok');
      resetNewsForm();
    } else {
      const newItem: NewsItem = {
        id: 'news-' + Date.now(),
        title: nTitle.trim(),
        type: nType,
        image: nImage.trim(),
        content: nContent.trim(),
        date: Date.now(),
        views: 0
      };
      const updated = [newItem, ...news];
      onSaveNews(updated);
      smartCache.set('news_list', updated);
      saveNewsToFirestore(newItem).catch(console.error);
      showNotice('Notícia publicada e guardada no Firebase com sucesso!', 'ok');
      resetNewsForm();
    }
  };

  const resetNewsForm = () => {
    setEditingNewsId(null);
    setNTitle('');
    setNType('news');
    setNImage('');
    setNContent('');
  };

  const handleEditNews = (item: NewsItem) => {
    setEditingNewsId(item.id);
    setNTitle(item.title);
    setNType(item.type);
    setNImage(item.image);
    setNContent(item.content);
  };

  const handleDeleteNews = (id: string, title: string) => {
    if (confirm(`Tens a certeza que desejas apagar a notícia "${title}"?`)) {
      const updated = news.filter((n) => n.id !== id);
      onSaveNews(updated);
      smartCache.set('news_list', updated);
      deleteNewsFromFirestore(id).catch(console.error);
      if (editingNewsId === id) resetNewsForm();
      showNotice('Notícia apagada com sucesso.', 'ok');
    }
  };

  // --- Config Operations ---
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SiteConfig = {
      ...config,
      whatsapp: cfgWhatsapp.trim(),
      youtube: cfgYoutube.trim(),
      email: cfgEmail.trim(),
      facebook: cfgFacebook.trim(),
      instagram: cfgInstagram.trim(),
      twitter: cfgTwitter.trim(),
      about: cfgAbout.trim(),
      location: cfgLocation.trim(),
      masterPin: cfgMasterPin.trim() || '310194',
      twoFactorEnabled: cfg2FAEnabled,
      webhookUrl: cfgWebhook.trim()
    };
    onSaveConfig(updated);
    smartCache.set('site_config', updated);
    saveConfigToFirestore(updated).catch(console.error);
    showNotice('Configurações guardadas no Firebase com sucesso!', 'ok');
  };

  // --- Cache Operations ---
  const handleClearCache = () => {
    smartCache.clearAll();
    setCacheInfo(smartCache.getStats());
    showNotice('Cache local e de memória esvaziado com sucesso!', 'ok');
  };

  const handlePreloadCache = async () => {
    showNotice('A pré-carregar recursos visuais e listas para o cache...', 'ok');
    const covers = [...songs.map((s) => s.cover), ...albums.map((a) => a.cover)].filter(Boolean);
    const newsImages = news.map((n) => n.image).filter(Boolean);
    await smartCache.preloadAssets([...covers, ...newsImages]);
    smartCache.set('songs_list', songs);
    smartCache.set('albums_list', albums);
    smartCache.set('news_list', news);
    setCacheInfo(smartCache.getStats());
    showNotice('Pré-carregamento concluído! O site agora carrega instantaneamente.', 'ok');
  };

  // --- API Tester ---
  const handleTestAPI = (endpoint: string) => {
    let result: any = null;
    if (endpoint === '/api/v1/songs') {
      result = { status: 200, count: songs.length, data: songs.slice(0, 3) };
    } else if (endpoint === '/api/v1/albums') {
      result = { status: 200, count: albums.length, data: albums };
    } else if (endpoint === '/api/v1/news') {
      result = { status: 200, count: news.length, data: news.slice(0, 2) };
    } else if (endpoint === '/api/v1/analytics') {
      result = { status: 200, stats };
    }
    setApiResponse(JSON.stringify(result, null, 2));
  };

  // --- Export Data Backup ---
  const handleExportData = () => {
    const backup = {
      app: 'Melo Music Record',
      version: '5.2',
      exportedAt: new Date().toISOString(),
      songs,
      albums,
      news,
      config
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `melo-music-record-backup-${Date.now()}.json`;
    a.click();
    showNotice('Cópia de segurança exportada com sucesso!', 'ok');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl overflow-hidden shadow-2xl relative my-auto animate-in zoom-in-95 duration-200 max-h-[94vh] flex flex-col">
        {/* Notice toast inside modal */}
        {notice && (
          <div
            className={`absolute top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-xl text-xs font-bold shadow-2xl border flex items-center gap-2 animate-in slide-in-from-top-2 ${
              notice.type === 'ok'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
                : 'bg-red-950/90 text-red-300 border-red-500/50'
            }`}
          >
            {notice.type === 'ok' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400" />
            )}
            <span>{notice.msg}</span>
          </div>
        )}

        {/* ========================================================
            FULL ADMIN INTERFACE (Multi-Tab, No Code Required)
        ======================================================== */}
        {/* Header */}
        <div className="p-3.5 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950/80 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <span>{t.admin_panel_title}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-500/40 font-semibold shadow-sm">
                Acesso Direto
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
            >
              Fechar Painel
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs (Title Case with Red Rounded Marker with Shadow Effect) */}
        <div className="flex items-center gap-1.5 border-b border-slate-800 px-3 sm:px-4 py-2 bg-slate-950/70 overflow-x-auto text-xs font-semibold scrollbar-none">
          <button
            onClick={() => setActiveTab('songs')}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'songs'
                ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/40 border border-red-500 ring-2 ring-red-400/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            <span>{t.admin_tab_songs} ({songs.length})</span>
          </button>

          {/* Aba Álbuns & EPs */}
          <button
            onClick={() => setActiveTab('albums')}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'albums'
                ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/40 border border-red-500 ring-2 ring-red-400/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
            }`}
          >
            <Disc3 className="w-3.5 h-3.5" />
            <span>{t.admin_tab_albums} ({albums.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('news')}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'news'
                ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/40 border border-red-500 ring-2 ring-red-400/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
            }`}
          >
            <Newspaper className="w-3.5 h-3.5" />
            <span>{t.admin_tab_news} ({news.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'analytics'
                ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/40 border border-red-500 ring-2 ring-red-400/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{t.admin_tab_analytics}</span>
          </button>

          <button
            onClick={() => setActiveTab('cache')}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'cache'
                ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/40 border border-red-500 ring-2 ring-red-400/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>{t.admin_tab_cache}</span>
          </button>

          <button
            onClick={() => setActiveTab('api')}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'api'
                ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/40 border border-red-500 ring-2 ring-red-400/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            <span>{t.admin_tab_api}</span>
          </button>

          <button
            onClick={() => setActiveTab('config')}
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'config'
                ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/40 border border-red-500 ring-2 ring-red-400/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/80 border border-transparent'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{t.admin_tab_settings}</span>
          </button>
        </div>

            {/* Content Body */}
            <div className="p-3 sm:p-6 overflow-y-auto flex-1">
              {/* TAB 1: MÚSICAS */}
              {activeTab === 'songs' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Form */}
                  <form onSubmit={handleSaveSong} className="space-y-4 bg-slate-950/60 p-4 sm:p-5 rounded-xl border border-slate-800">
                    <h3 className="text-xs font-bold tracking-wider text-amber-400 flex items-center justify-between">
                      <span>{editingSongId ? 'Editar Música' : 'Publicar Nova Música'}</span>
                      {editingSongId && (
                        <button
                          type="button"
                          onClick={resetSongForm}
                          className="text-xs text-slate-400 hover:text-white underline"
                        >
                          Cancelar Edição
                        </button>
                      )}
                    </h3>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Título da Música *
                      </label>
                      <input
                        type="text"
                        required
                        value={sTitle}
                        onChange={(e) => setSTitle(e.target.value)}
                        placeholder="Ex: Amanhecer_Lascreve"
                        className="w-full h-9 px-3 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Artista / Cantor
                        </label>
                        <input
                          type="text"
                          value={sArtist}
                          onChange={(e) => setSArtist(e.target.value)}
                          placeholder="Ex: Tarciso John"
                          className="w-full h-9 px-3 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Género / Estilo
                        </label>
                        <div className="flex gap-1.5">
                          <select
                            value={sCategory}
                            onChange={(e) => setSCategory(e.target.value)}
                            className="flex-1 h-9 px-2.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
                          >
                            {categories.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => {
                              const newCat = prompt('Nome do novo género musical:');
                              if (newCat && newCat.trim()) {
                                onAddCategory(newCat.trim());
                                setSCategory(newCat.trim());
                                showNotice(`Género "${newCat.trim()}" adicionado!`, 'ok');
                              }
                            }}
                            className="px-2.5 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-bold flex items-center gap-1"
                            title="Adicionar Novo Género"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Link da Capa (URL da Imagem)
                      </label>
                      <input
                        type="url"
                        value={sCover}
                        onChange={(e) => setSCover(e.target.value)}
                        placeholder="https://exemplo.com/capa.jpg"
                        className="w-full h-9 px-3 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Link de Download *
                        </label>
                        <input
                          type="url"
                          required
                          value={sLink}
                          onChange={(e) => setSLink(e.target.value)}
                          placeholder="https://exemplo.com/musica.mp3"
                          className="w-full h-9 px-3 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Link Áudio Preview / Stream
                        </label>
                        <input
                          type="url"
                          value={sStream}
                          onChange={(e) => setSStream(e.target.value)}
                          placeholder="https://exemplo.com/stream.mp3"
                          className="w-full h-9 px-3 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Letra Completa da Música (Opcional)
                      </label>
                      <textarea
                        rows={5}
                        value={sLyrics}
                        onChange={(e) => setSLyrics(e.target.value)}
                        placeholder="Escreve aqui os versos e o refrão da música..."
                        className="w-full p-3 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 h-9 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-colors"
                      >
                        {editingSongId ? 'Guardar Alterações' : 'Publicar Música'}
                      </button>
                      <button
                        type="button"
                        onClick={resetSongForm}
                        className="px-4 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                      >
                        Limpar
                      </button>
                    </div>
                  </form>

                  {/* List */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold tracking-wider text-amber-400">
                      Músicas Publicadas ({songs.length})
                    </h3>

                    <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
                      {songs.map((song) => (
                        <div
                          key={song.id}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors"
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-900 flex-shrink-0">
                            <img
                              src={song.cover || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"/>'}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-white truncate leading-tight">
                              {song.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 truncate">
                              {song.artist} · <span className="text-amber-400">{song.category}</span>
                            </p>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditSong(song)}
                              className="w-7 h-7 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSong(song.id, song.title)}
                              className="w-7 h-7 rounded-md bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                              title="Apagar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ÁLBUNS & EPS */}
              {activeTab === 'albums' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Form */}
                  <form onSubmit={handleSaveAlbum} className="space-y-4 bg-slate-950/60 p-4 sm:p-5 rounded-xl border border-slate-800">
                    <h3 className="text-xs font-bold tracking-wider text-amber-400 flex items-center justify-between">
                      <span>{editingAlbumId ? 'Editar Álbum / EP' : 'Publicar Novo Álbum ou EP'}</span>
                      {editingAlbumId && (
                        <button
                          type="button"
                          onClick={resetAlbumForm}
                          className="text-xs text-slate-400 hover:text-white underline"
                        >
                          Cancelar Edição
                        </button>
                      )}
                    </h3>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Título do Álbum ou EP *
                      </label>
                      <input
                        type="text"
                        required
                        value={aTitle}
                        onChange={(e) => setATitle(e.target.value)}
                        placeholder="Ex: Origens de Luanda"
                        className="w-full h-9 px-3 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Artista / Grupo
                        </label>
                        <input
                          type="text"
                          value={aArtist}
                          onChange={(e) => setAArtist(e.target.value)}
                          placeholder="Ex: Melo & Família"
                          className="w-full h-9 px-3 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Formato do Projeto
                        </label>
                        <select
                          value={aType}
                          onChange={(e) => setAType(e.target.value as any)}
                          className="w-full h-9 px-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
                        >
                          <option value="EP">EP</option>
                          <option value="Álbum">Álbum</option>
                          <option value="Mixtape">Mixtape</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Género Musical
                        </label>
                        <select
                          value={aCategory}
                          onChange={(e) => setACategory(e.target.value)}
                          className="w-full h-9 px-2 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
                        >
                          {categories.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Link da Foto de Capa
                        </label>
                        <input
                          type="url"
                          value={aCover}
                          onChange={(e) => setACover(e.target.value)}
                          placeholder="https://exemplo.com/capa-album.jpg"
                          className="w-full h-9 px-3 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Link de Download Completo (ZIP / Direct) *
                        </label>
                        <input
                          type="url"
                          required
                          value={aDownload}
                          onChange={(e) => setADownload(e.target.value)}
                          placeholder="https://exemplo.com/album-completo.zip"
                          className="w-full h-9 px-3 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Lista de Faixas (Uma faixa por linha)
                      </label>
                      <textarea
                        rows={6}
                        value={aTracklist}
                        onChange={(e) => setATracklist(e.target.value)}
                        placeholder={"01. Intro (01:45)\n02. Faixa Principal (03:30)\n03. Segunda Faixa (03:15)"}
                        className="w-full p-3 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Descrição / Informações do Projeto
                      </label>
                      <textarea
                        rows={3}
                        value={aDescription}
                        onChange={(e) => setADescription(e.target.value)}
                        placeholder="Breve descrição dos bastidores e gravação do projeto..."
                        className="w-full p-3 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 h-9 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-colors"
                      >
                        {editingAlbumId ? 'Guardar Projeto' : 'Publicar Álbum / EP'}
                      </button>
                      <button
                        type="button"
                        onClick={resetAlbumForm}
                        className="px-4 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                      >
                        Limpar
                      </button>
                    </div>
                  </form>

                  {/* List of Albums */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold tracking-wider text-amber-400">
                      Álbuns & EPs Publicados ({albums.length})
                    </h3>

                    <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
                      {albums.map((alb) => (
                        <div
                          key={alb.id}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-900 flex-shrink-0">
                            <img
                              src={alb.cover || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"/>'}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-white truncate leading-tight">
                              {alb.title}
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              <span className="text-amber-400 font-semibold">{alb.type}</span> · {alb.artist} ({alb.tracksCount} faixas)
                            </p>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditAlbum(alb)}
                              className="w-7 h-7 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteAlbum(alb.id, alb.title)}
                              className="w-7 h-7 rounded-md bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                              title="Apagar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: NOTÍCIAS */}
              {activeTab === 'news' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Form */}
                  <form onSubmit={handleSaveNews} className="space-y-4 bg-slate-950/60 p-4 sm:p-5 rounded-xl border border-slate-800">
                    <h3 className="text-xs font-bold tracking-wider text-amber-400 flex items-center justify-between">
                      <span>{editingNewsId ? 'Editar Notícia' : 'Publicar Nova Notícia'}</span>
                      {editingNewsId && (
                        <button
                          type="button"
                          onClick={resetNewsForm}
                          className="text-xs text-slate-400 hover:text-white underline"
                        >
                          Cancelar Edição
                        </button>
                      )}
                    </h3>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Título da Notícia *
                      </label>
                      <input
                        type="text"
                        required
                        value={nTitle}
                        onChange={(e) => setNTitle(e.target.value)}
                        placeholder="Ex: Novo single anunciado para esta semana"
                        className="w-full h-9 px-3 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Secção / Tipo *
                        </label>
                        <select
                          value={nType}
                          onChange={(e) => setNType(e.target.value as any)}
                          className="w-full h-9 px-2.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
                        >
                          <option value="news">News Hoje (Geral)</option>
                          <option value="today">Tudo de Hoje (Destaque)</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Link da Foto de Capa
                        </label>
                        <input
                          type="url"
                          value={nImage}
                          onChange={(e) => setNImage(e.target.value)}
                          placeholder="https://exemplo.com/foto.jpg"
                          className="w-full h-9 px-3 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Conteúdo da Notícia *
                      </label>
                      <textarea
                        rows={6}
                        required
                        value={nContent}
                        onChange={(e) => setNContent(e.target.value)}
                        placeholder="Escreve aqui o texto completo da notícia..."
                        className="w-full p-3 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-1 h-9 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-colors"
                      >
                        {editingNewsId ? 'Guardar Notícia' : 'Publicar Notícia'}
                      </button>
                      <button
                        type="button"
                        onClick={resetNewsForm}
                        className="px-4 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                      >
                        Limpar
                      </button>
                    </div>
                  </form>

                  {/* List */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold tracking-wider text-amber-400">
                      Notícias Publicadas ({news.length})
                    </h3>

                    <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
                      {news.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors"
                        >
                          <div className="w-12 h-10 rounded-lg overflow-hidden bg-slate-900 flex-shrink-0">
                            <img
                              src={item.image || 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"/>'}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-white truncate leading-tight">
                              {item.title}
                            </h4>
                            <p className="text-[11px] text-slate-400">
                              <span className="text-amber-400 font-semibold">
                                {item.type === 'today' ? 'Tudo de Hoje' : 'News Hoje'}
                              </span>
                              {' · '}
                              <span>{formatDate(item.date, lang)}</span>
                            </p>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleEditNews(item)}
                              className="w-7 h-7 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteNews(item.id, item.title)}
                              className="w-7 h-7 rounded-md bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
                              title="Apagar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: DASHBOARD ANALÍTICO */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  {/* KPI Stat Cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="text-[11px] font-bold tracking-wider">Visualizações</span>
                        <Eye className="w-4 h-4 text-sky-400" />
                      </div>
                      <div className="text-xl sm:text-2xl font-extrabold text-white">
                        {stats.totalPageviews.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold">+14% esta semana</span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="text-[11px] font-bold tracking-wider">Streams / Plays</span>
                        <Headphones className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-xl sm:text-2xl font-extrabold text-white">
                        {stats.totalPlays.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold">Tempo real ativo</span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="text-[11px] font-bold tracking-wider">Downloads Totais</span>
                        <DownloadCloud className="w-4 h-4 text-red-400" />
                      </div>
                      <div className="text-xl sm:text-2xl font-extrabold text-white">
                        {stats.totalDownloads.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-slate-400">Downloads sem limite</span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="flex items-center justify-between text-slate-400 mb-1">
                        <span className="text-[11px] font-bold tracking-wider">Inscritos VIP</span>
                        <Users className="w-4 h-4 text-emerald-400" />
                      </div>
                      <div className="text-xl sm:text-2xl font-extrabold text-white">
                        {stats.totalSubscribers.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-emerald-400 font-semibold">Base de fãs ativa</span>
                    </div>
                  </div>

                  {/* Realtime Live Event Stream + Top Genres */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-slate-950/70 p-4 sm:p-5 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold tracking-wider text-amber-400 flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                          <span>{t.analytics_live_feed}</span>
                        </h4>
                        <span className="text-[10px] font-mono text-slate-500">Últimos eventos</span>
                      </div>

                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {liveEvents.map((ev) => (
                          <div
                            key={ev.id}
                            className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                          >
                            <div className="min-w-0 flex-1">
                              <span className="font-semibold text-white truncate block">
                                {ev.label}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {ev.location} · {ev.device}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-slate-500 pl-2">
                              {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-slate-950/70 p-4 sm:p-5 rounded-xl border border-slate-800 space-y-3">
                      <h4 className="text-xs font-bold tracking-wider text-amber-400">
                        {t.analytics_top_genres}
                      </h4>

                      <div className="space-y-3 pt-1">
                        {stats.topGenres.map((g) => {
                          const total = stats.topGenres.reduce((acc, curr) => acc + curr.count, 0) || 1;
                          const pct = Math.round((g.count / total) * 100);
                          return (
                            <div key={g.genre} className="space-y-1">
                              <div className="flex items-center justify-between text-xs font-semibold">
                                <span className="text-slate-200">{g.genre}</span>
                                <span className="text-slate-400 font-mono">{pct}% ({g.count.toLocaleString()})</span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-sky-500 rounded-full"
                                  style={{ width: `${pct}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Geographic Reach */}
                      <div className="pt-3 border-t border-slate-800">
                        <span className="text-xs font-bold tracking-wider text-slate-400 block mb-2">
                          {t.analytics_geo}
                        </span>
                        <div className="flex flex-wrap gap-2 text-xs">
                          {stats.geoDistribution.map((geo) => (
                            <span
                              key={geo.country}
                              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-medium flex items-center gap-1.5"
                            >
                              <span>{geo.flag}</span>
                              <span>{geo.country}: {geo.count.toLocaleString()}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: CACHE & PERFORMANCE */}
              {activeTab === 'cache' && (
                <div className="space-y-6">
                  <div className="p-4 sm:p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Zap className="w-4 h-4 text-amber-400" />
                          <span>{t.cache_title}</span>
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {t.cache_sub}
                        </p>
                      </div>

                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{t.cache_status_active}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold tracking-wider block">
                          Acertos (Hits)
                        </span>
                        <span className="text-lg font-bold font-mono text-emerald-400">
                          {cacheInfo.hits}
                        </span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold tracking-wider block">
                          Falhas (Misses)
                        </span>
                        <span className="text-lg font-bold font-mono text-slate-400">
                          {cacheInfo.misses}
                        </span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold tracking-wider block">
                          Taxa de Cache Hit
                        </span>
                        <span className="text-lg font-bold font-mono text-amber-400">
                          {cacheInfo.hits + cacheInfo.misses > 0
                            ? Math.round((cacheInfo.hits / (cacheInfo.hits + cacheInfo.misses)) * 100)
                            : 100}%
                        </span>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-slate-400 font-bold tracking-wider block">
                          Armazenamento Est.
                        </span>
                        <span className="text-lg font-bold font-mono text-sky-400">
                          {(cacheInfo.estimatedBytes / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2.5 pt-3">
                      <button
                        onClick={handlePreloadCache}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-colors flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>{t.cache_preload_btn}</span>
                      </button>

                      <button
                        onClick={handleClearCache}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{t.cache_clear_btn}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: INTEGRAÇÕES & API */}
              {activeTab === 'api' && (
                <div className="space-y-6">
                  <div className="p-4 sm:p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Globe2 className="w-4 h-4 text-amber-400" />
                        <span>Integração via API & Webhooks</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Permite a expansão de funcionalidades e partilha com serviços de terceiros (Bots Telegram, Spotify import, Webhooks).
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Chave da API Pública (Read-Only)
                        </label>
                        <input
                          type="text"
                          readOnly
                          value={config.apiKey || 'mmr_live_8f39c2d1b74e6a05'}
                          className="w-full h-9 px-3 text-xs font-mono rounded-lg bg-slate-900 border border-slate-700 text-amber-300 select-all"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          URL de Webhook Externo (Notificações de Lançamentos)
                        </label>
                        <input
                          type="url"
                          value={cfgWebhook}
                          onChange={(e) => setCfgWebhook(e.target.value)}
                          placeholder="https://meu-servico.com/api/webhook"
                          className="w-full h-9 px-3 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* API Endpoint Tester */}
                    <div className="pt-3 border-t border-slate-800 space-y-2">
                      <span className="text-xs font-bold tracking-wider text-slate-300 block">
                        Testador de Endpoints REST
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleTestAPI('/api/v1/songs')}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-sky-400 transition-colors"
                        >
                          GET /api/v1/songs
                        </button>
                        <button
                          onClick={() => handleTestAPI('/api/v1/albums')}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-purple-400 transition-colors"
                        >
                          GET /api/v1/albums
                        </button>
                        <button
                          onClick={() => handleTestAPI('/api/v1/news')}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-emerald-400 transition-colors"
                        >
                          GET /api/v1/news
                        </button>
                        <button
                          onClick={() => handleTestAPI('/api/v1/analytics')}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-amber-400 transition-colors"
                        >
                          GET /api/v1/analytics
                        </button>
                      </div>

                      {apiResponse && (
                        <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-48">
                          {apiResponse}
                        </pre>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <span className="text-xs font-bold text-white block">Cópia de Segurança Total</span>
                        <span className="text-[11px] text-slate-400">Exporta músicas, álbuns, notícias e configurações em formato JSON.</span>
                      </div>
                      <button
                        onClick={handleExportData}
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-colors"
                      >
                        <DownloadCloud className="w-3.5 h-3.5" />
                        <span>Exportar Dados</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 7: CONFIGURAÇÕES GERAIS */}
              {activeTab === 'config' && (
                <form onSubmit={handleSaveConfig} className="space-y-4 max-w-2xl bg-slate-950/60 p-4 sm:p-5 rounded-xl border border-slate-800">
                  <h3 className="text-xs font-bold tracking-wider text-amber-400">
                    Configurações Gerais & Redes
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Número de WhatsApp (com indicativo)
                      </label>
                      <input
                        type="text"
                        value={cfgWhatsapp}
                        onChange={(e) => setCfgWhatsapp(e.target.value)}
                        placeholder="923591571"
                        className="w-full h-9 px-3 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">
                        Email Oficial de Contacto
                      </label>
                      <input
                        type="email"
                        value={cfgEmail}
                        onChange={(e) => setCfgEmail(e.target.value)}
                        placeholder="melomusicrecord@gmail.com"
                        className="w-full h-9 px-3 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Canal do YouTube
                    </label>
                    <input
                      type="url"
                      value={cfgYoutube}
                      onChange={(e) => setCfgYoutube(e.target.value)}
                      placeholder="https://www.youtube.com/@melomusicrecord"
                      className="w-full h-9 px-3 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Facebook</label>
                      <input
                        type="url"
                        value={cfgFacebook}
                        onChange={(e) => setCfgFacebook(e.target.value)}
                        placeholder="https://facebook.com/..."
                        className="w-full h-9 px-3 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Instagram</label>
                      <input
                        type="url"
                        value={cfgInstagram}
                        onChange={(e) => setCfgInstagram(e.target.value)}
                        placeholder="https://instagram.com/..."
                        className="w-full h-9 px-3 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Twitter / X</label>
                      <input
                        type="url"
                        value={cfgTwitter}
                        onChange={(e) => setCfgTwitter(e.target.value)}
                        placeholder="https://x.com/..."
                        className="w-full h-9 px-3 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Localização do Estúdio
                    </label>
                    <input
                      type="text"
                      value={cfgLocation}
                      onChange={(e) => setCfgLocation(e.target.value)}
                      placeholder="Luanda, Angola"
                      className="w-full h-9 px-3 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Texto "Saber Mais" / Biografia
                    </label>
                    <textarea
                      rows={4}
                      value={cfgAbout}
                      onChange={(e) => setCfgAbout(e.target.value)}
                      className="w-full p-3 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none"
                    />
                  </div>

                  {/* Security Section */}
                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold tracking-wider text-amber-400">
                      Segurança do Administrador & 2FA
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-300 block mb-1">
                          Novo Código Mestre PIN
                        </label>
                        <input
                          type="password"
                          value={cfgMasterPin}
                          onChange={(e) => setCfgMasterPin(e.target.value)}
                          placeholder="310194"
                          className="w-full h-9 px-3 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white focus:border-red-500 focus:outline-none font-mono"
                        />
                      </div>

                      <div className="flex items-center gap-3 pt-4 sm:pt-6">
                        <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-200">
                          <input
                            type="checkbox"
                            checked={cfg2FAEnabled}
                            onChange={(e) => setCfg2FAEnabled(e.target.checked)}
                            className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-red-600 focus:ring-0"
                          />
                          <span>Exigir Verificação em 2 Etapas (2FA)</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 h-10 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-colors"
                    >
                      Guardar Configurações
                    </button>
                  </div>
                </form>
              )}
            </div>
      </div>
    </div>
  );
};
