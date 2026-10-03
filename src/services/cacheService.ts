interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number; // in milliseconds
  version: string;
}

interface CacheStats {
  hits: number;
  misses: number;
  itemsCount: number;
  estimatedBytes: number;
  lastSync: number;
}

class SmartCacheService {
  private memoryCache = new Map<string, CacheItem<any>>();
  private prefix = 'mmr_cache_v5_';
  private hits = 0;
  private misses = 0;
  private currentVersion = '2.4.0';

  constructor() {
    this.hydrateMemory();
  }

  private hydrateMemory() {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const item: CacheItem<any> = JSON.parse(raw);
            if (Date.now() - item.timestamp < item.ttl) {
              this.memoryCache.set(key.replace(this.prefix, ''), item);
            } else {
              localStorage.removeItem(key);
            }
          }
        }
      }
    } catch {
      // Graceful fallback
    }
  }

  public get<T>(key: string): T | null {
    // 1. Check memory tier
    const memItem = this.memoryCache.get(key);
    if (memItem) {
      if (Date.now() - memItem.timestamp < memItem.ttl) {
        this.hits++;
        return memItem.data as T;
      } else {
        this.memoryCache.delete(key);
      }
    }

    // 2. Check local storage tier
    try {
      const stored = localStorage.getItem(this.prefix + key);
      if (stored) {
        const parsed: CacheItem<T> = JSON.parse(stored);
        if (Date.now() - parsed.timestamp < parsed.ttl) {
          this.memoryCache.set(key, parsed);
          this.hits++;
          return parsed.data;
        } else {
          localStorage.removeItem(this.prefix + key);
        }
      }
    } catch {
      // Ignored
    }

    this.misses++;
    return null;
  }

  public set<T>(key: string, data: T, ttlMs: number = 1000 * 60 * 60 * 24): void {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
      version: this.currentVersion
    };

    this.memoryCache.set(key, item);

    try {
      localStorage.setItem(this.prefix + key, JSON.stringify(item));
    } catch (e) {
      console.warn('Storage quota exceeded, keeping in memory cache only', e);
    }
  }

  public remove(key: string): void {
    this.memoryCache.delete(key);
    try {
      localStorage.removeItem(this.prefix + key);
    } catch {
      // Ignored
    }
  }

  public clearAll(): void {
    this.memoryCache.clear();
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(this.prefix)) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    } catch {
      // Ignored
    }
    this.hits = 0;
    this.misses = 0;
  }

  public preloadAssets(urls: string[]): Promise<number> {
    return new Promise((resolve) => {
      let loaded = 0;
      if (!urls.length) return resolve(0);
      urls.forEach((url) => {
        if (!url) return;
        const img = new Image();
        img.src = url;
        img.onload = () => {
          loaded++;
          if (loaded >= urls.length) resolve(loaded);
        };
        img.onerror = () => {
          loaded++;
          if (loaded >= urls.length) resolve(loaded);
        };
      });
      // Safety timeout
      setTimeout(() => resolve(loaded), 2500);
    });
  }

  public getStats(): CacheStats {
    let bytes = 0;
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(this.prefix)) {
          const val = localStorage.getItem(k);
          if (val) bytes += (k.length + val.length) * 2;
        }
      }
    } catch {
      bytes = 1024 * 12;
    }

    return {
      hits: this.hits,
      misses: this.misses,
      itemsCount: this.memoryCache.size,
      estimatedBytes: bytes,
      lastSync: Date.now()
    };
  }
}

export const smartCache = new SmartCacheService();
