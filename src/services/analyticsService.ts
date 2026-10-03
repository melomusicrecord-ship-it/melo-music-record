import { RealtimeEvent, AnalyticsStats, Song } from '../types';

const STATS_KEY = 'mmr_analytics_stats_v2';
const EVENTS_KEY = 'mmr_analytics_events_v2';

class AnalyticsService {
  private listeners: ((event: RealtimeEvent) => void)[] = [];
  private stats: AnalyticsStats;
  private events: RealtimeEvent[] = [];

  constructor() {
    this.stats = this.loadStats();
    this.events = this.loadEvents();
    this.recordPageview();
    this.startSimulatedTraffic();
  }

  private loadStats(): AnalyticsStats {
    try {
      const saved = localStorage.getItem(STATS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignored
    }

    return {
      totalPageviews: 28450,
      totalPlays: 19820,
      totalDownloads: 12430,
      totalSubscribers: 432,
      todayVisitors: 1240,
      topGenres: [
        { genre: 'Drill', count: 7850 },
        { genre: 'Afro House', count: 6420 },
        { genre: 'Kizomba', count: 5310 },
        { genre: 'Kuduro', count: 4180 },
        { genre: 'Instrumentais', count: 3200 }
      ],
      hourlyActivity: [
        { hour: '00:00', visits: 120, plays: 80 },
        { hour: '04:00', visits: 60, plays: 35 },
        { hour: '08:00', visits: 380, plays: 240 },
        { hour: '12:00', visits: 620, plays: 490 },
        { hour: '16:00', visits: 890, plays: 710 },
        { hour: '20:00', visits: 1140, plays: 980 }
      ],
      geoDistribution: [
        { country: 'Angola', flag: '🇦🇴', count: 18240 },
        { country: 'Portugal', flag: '🇵🇹', count: 4890 },
        { country: 'Brasil', flag: '🇧🇷', count: 2840 },
        { country: 'Moçambique', flag: '🇲🇿', count: 1720 },
        { country: 'França', flag: '🇫🇷', count: 760 }
      ],
      deviceDistribution: [
        { device: 'Mobile Android', percentage: 68 },
        { device: 'Mobile iOS', percentage: 22 },
        { device: 'Desktop / Laptop', percentage: 10 }
      ]
    };
  }

  private loadEvents(): RealtimeEvent[] {
    try {
      const saved = localStorage.getItem(EVENTS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignored
    }

    const now = Date.now();
    return [
      {
        id: 'ev-1',
        type: 'download',
        label: 'Download: Amanhecer_Lascreve',
        timestamp: now - 1000 * 30,
        location: 'Luanda, AO',
        device: 'Android'
      },
      {
        id: 'ev-2',
        type: 'play',
        label: 'Stream: Tarciso John_Fc Saber Andar',
        timestamp: now - 1000 * 75,
        location: 'Lisboa, PT',
        device: 'iOS'
      },
      {
        id: 'ev-3',
        type: 'newsletter',
        label: 'Novo Inscrito VIP: tarciso***@gmail.com',
        timestamp: now - 1000 * 180,
        location: 'Benguela, AO',
        device: 'Android'
      },
      {
        id: 'ev-4',
        type: 'share',
        label: 'Partilha WhatsApp: Noite de Luanda',
        timestamp: now - 1000 * 240,
        location: 'São Paulo, BR',
        device: 'Android'
      }
    ];
  }

  private save() {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(this.stats));
      localStorage.setItem(EVENTS_KEY, JSON.stringify(this.events.slice(0, 50)));
    } catch {
      // Ignored
    }
  }

  public recordPageview() {
    this.stats.totalPageviews++;
    this.stats.todayVisitors++;
    this.save();
  }

  public recordPlay(song: Song) {
    this.stats.totalPlays++;
    const event: RealtimeEvent = {
      id: 'ev-' + Date.now() + Math.random().toString(36).slice(2, 6),
      type: 'play',
      label: `Stream: ${song.title} (${song.artist || 'Melo'})`,
      timestamp: Date.now(),
      location: 'Luanda, AO',
      device: 'Mobile'
    };
    this.pushEvent(event);
    this.save();
  }

  public recordDownload(song: Song) {
    this.stats.totalDownloads++;
    const event: RealtimeEvent = {
      id: 'ev-' + Date.now() + Math.random().toString(36).slice(2, 6),
      type: 'download',
      label: `Download: ${song.title}`,
      timestamp: Date.now(),
      location: 'Angola / Int.',
      device: 'Mobile'
    };
    this.pushEvent(event);
    this.save();
  }

  public recordNewsletter(email: string) {
    this.stats.totalSubscribers++;
    const masked = email.replace(/(.{2})(.*)(?=@)/, (_gp1, gp2, gp3) => gp2 + '*'.repeat(Math.max(gp3.length, 3)));
    const event: RealtimeEvent = {
      id: 'ev-' + Date.now() + Math.random().toString(36).slice(2, 6),
      type: 'newsletter',
      label: `Novo Inscrito VIP: ${masked}`,
      timestamp: Date.now(),
      location: 'Luanda, AO',
      device: 'Web'
    };
    this.pushEvent(event);
    this.save();
  }

  public recordShare(title: string, platform: string) {
    const event: RealtimeEvent = {
      id: 'ev-' + Date.now() + Math.random().toString(36).slice(2, 6),
      type: 'share',
      label: `Partilha [${platform}]: ${title}`,
      timestamp: Date.now(),
      location: 'Mobile User',
      device: 'Mobile'
    };
    this.pushEvent(event);
  }

  private pushEvent(event: RealtimeEvent) {
    this.events.unshift(event);
    if (this.events.length > 50) this.events.pop();
    this.listeners.forEach((cb) => cb(event));
  }

  public subscribe(cb: (event: RealtimeEvent) => void) {
    this.listeners.push(cb);
    return () => {
      this.listeners = this.listeners.filter((fn) => fn !== cb);
    };
  }

  public getStats(): AnalyticsStats {
    return { ...this.stats };
  }

  public getRecentEvents(): RealtimeEvent[] {
    return [...this.events];
  }

  private startSimulatedTraffic() {
    // Generate organic low-frequency heartbeat events for realism on the live dashboard
    setInterval(() => {
      const sampleEvents: { type: RealtimeEvent['type']; label: string; loc: string }[] = [
        { type: 'play', label: 'Stream: Amanhecer_Lascreve', loc: 'Luanda, AO' },
        { type: 'play', label: 'Stream: Noite de Luanda', loc: 'Porto, PT' },
        { type: 'download', label: 'Download: Tarciso John_Fc Saber Andar', loc: 'Maputo, MZ' },
        { type: 'view_song', label: 'Visualização: Instrumental Pro Drill', loc: 'Luanda, AO' },
        { type: 'view_news', label: 'Leitura Notícia: Lançamentos Afro House', loc: 'Lisboa, PT' }
      ];

      const item = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
      const event: RealtimeEvent = {
        id: 'sim-' + Date.now(),
        type: item.type,
        label: item.label,
        timestamp: Date.now(),
        location: item.loc,
        device: Math.random() > 0.3 ? 'Android' : 'iOS'
      };

      if (item.type === 'play') this.stats.totalPlays++;
      if (item.type === 'download') this.stats.totalDownloads++;
      this.stats.totalPageviews++;

      this.pushEvent(event);
    }, 18000); // every 18 seconds
  }
}

export const analyticsService = new AnalyticsService();
