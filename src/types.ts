export type Language = 'pt' | 'en' | 'fr' | 'es';

export interface Song {
  id: string;
  title: string;
  artist: string;
  category: string;
  cover: string;
  link: string;
  streamUrl?: string;
  lyrics?: string;
  date: number;
  plays?: number;
  downloads?: number;
  likes?: number;
}

export interface NewsItem {
  id: string;
  title: string;
  type: 'news' | 'today';
  image: string;
  content: string;
  date: number;
  views?: number;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  type: 'Álbum' | 'EP' | 'Mixtape';
  category: string;
  cover: string;
  downloadUrl: string;
  date: number;
  tracksCount: number;
  tracklist?: string[];
  description?: string;
  downloads?: number;
}

export interface SiteConfig {
  whatsapp: string;
  youtube: string;
  email: string;
  facebook: string;
  instagram: string;
  twitter: string;
  about: string;
  location: string;
  masterPin: string;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  themePreference: 'auto' | 'dark' | 'light';
  webhookUrl?: string;
  apiKey?: string;
}

export interface Subscriber {
  id: string;
  email: string;
  date: number;
  source?: string;
}

export interface RealtimeEvent {
  id: string;
  type: 'play' | 'download' | 'newsletter' | 'view_song' | 'view_news' | 'share';
  label: string;
  timestamp: number;
  location?: string;
  device?: string;
}

export interface AnalyticsStats {
  totalPageviews: number;
  totalPlays: number;
  totalDownloads: number;
  totalSubscribers: number;
  todayVisitors: number;
  topGenres: { genre: string; count: number }[];
  hourlyActivity: { hour: string; visits: number; plays: number }[];
  geoDistribution: { country: string; flag: string; count: number }[];
  deviceDistribution: { device: string; percentage: number }[];
}

export interface CustomSubmenuItem {
  id: string;
  label: string;
  type: 'category' | 'link' | 'page';
  url?: string;
  categoryFilter?: string;
  pageContent?: string;
  target?: '_self' | '_blank';
}

export interface CustomMenuItem {
  id: string;
  label: string;
  type: 'dropdown' | 'category' | 'link' | 'page';
  url?: string;
  categoryFilter?: string;
  pageContent?: string;
  target?: '_self' | '_blank';
  badge?: string;
  submenus?: CustomSubmenuItem[];
  order: number;
  visible: boolean;
}
