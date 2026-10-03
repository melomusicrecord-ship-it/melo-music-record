import { Language } from '../types';

export function isToday(timestamp?: number): boolean {
  if (!timestamp) return false;
  const d = new Date(timestamp);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export function formatDate(timestamp: number, lang: Language = 'pt'): string {
  const d = new Date(timestamp);
  const localeMap: Record<Language, string> = {
    pt: 'pt-PT',
    en: 'en-US',
    fr: 'fr-FR',
    es: 'es-ES'
  };

  return d.toLocaleDateString(localeMap[lang] || 'pt-PT', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function formatShortDate(timestamp: number, lang: Language = 'pt'): string {
  const d = new Date(timestamp);
  const localeMap: Record<Language, string> = {
    pt: 'pt-PT',
    en: 'en-US',
    fr: 'fr-FR',
    es: 'es-ES'
  };

  return d.toLocaleDateString(localeMap[lang] || 'pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function formatSeconds(sec: number): string {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export function getPlaceholderCover(title?: string): string {
  const pal = [
    ['#1e4976', '#0f2d4d'],
    ['#c9971c', '#1c1e24'],
    ['#e02434', '#22252d'],
    ['#4a90d9', '#1c1e24'],
    ['#8d1420', '#1c1e24']
  ];
  const t = (title || 'M').trim();
  const pair = pal[(t.charCodeAt(0) || 0) % pal.length];
  const letter = (t[0] || '♪').toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="${pair[0]}"/>
        <stop offset="1" stop-color="${pair[1]}"/>
      </linearGradient>
    </defs>
    <rect width="400" height="400" fill="url(#g)"/>
    <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="8"/>
    <circle cx="200" cy="200" r="90" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="4"/>
    <text x="200" y="240" font-family="'Plus Jakarta Sans', Segoe UI, sans-serif" font-size="140" font-weight="800" fill="rgba(255,255,255,0.9)" text-anchor="middle">${letter}</text>
    <text x="200" y="320" font-family="'Plus Jakarta Sans', Segoe UI, sans-serif" font-size="16" font-weight="700" letter-spacing="4" fill="rgba(232,187,74,0.85)" text-anchor="middle">MELO MUSIC</text>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function buildWhatsAppLink(number?: string, message?: string): string {
  const clean = String(number || '').replace(/\D/g, '');
  if (!clean) return '#';
  const url = `https://wa.me/${clean}`;
  if (message) {
    return `${url}?text=${encodeURIComponent(message)}`;
  }
  return url;
}

export function normalizeUrl(url?: string): string {
  const u = (url || '').trim();
  if (!u) return '';
  if (/^https?:\/\//i.test(u) || /^data:/i.test(u) || /^tel:/i.test(u) || /^mailto:/i.test(u)) return u;
  return 'https://' + u;
}
