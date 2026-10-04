import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Song, Album, NewsItem, SiteConfig, Subscriber, CustomMenuItem } from '../types';
import { getDemoSongs, getDemoAlbums, getDemoNews, DEFAULT_CONFIG, DEFAULT_CUSTOM_MENUS } from './defaultData';

const app = initializeApp(firebaseConfig);

// CRITICAL: The app will break without the firestoreDatabaseId passed here
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write'
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errorCode = (error as { code?: string })?.code;
  const errorMsg = error instanceof Error ? error.message : String(error);
  const isOfflineOrUnavailable =
    errorMsg.includes('unavailable') ||
    errorMsg.includes('offline') ||
    errorMsg.includes('Could not reach Cloud Firestore backend') ||
    errorCode === 'unavailable';

  if (isOfflineOrUnavailable) {
    console.info(`Firestore [${operationType}] at ${path}: Operando em modo offline / cache local.`);
    return;
  }

  const errInfo: FirestoreErrorInfo = {
    error: errorMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email
        })) || []
    },
    operationType,
    path
  };
  console.warn('Firestore Error Info: ', JSON.stringify(errInfo));
}

// Connection test
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    const code = (error as { code?: string })?.code;
    if (
      msg.includes('the client is offline') ||
      msg.includes('unavailable') ||
      msg.includes('Could not reach Cloud Firestore backend') ||
      code === 'unavailable'
    ) {
      console.info('Firestore: Inicializado e a operar em modo offline / cache.');
      return;
    }
    console.warn('Firestore connection notice:', msg);
  }
}

// ==========================================
// FIRESTORE SYNC & CRUD METHODS
// ==========================================

// --- Songs ---
export async function getSongsFromFirestore(): Promise<Song[]> {
  const path = 'songs';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return [];
    }
    const all = snap.docs.map((d) => d.data() as Song);
    // Filter out old demo tracks so real songs take precedence
    return all.filter((s) => !s.id?.startsWith('song-') && !s.link?.includes('pixabay.com'));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function saveSongToFirestore(song: Song): Promise<void> {
  const path = `songs/${song.id}`;
  try {
    await setDoc(doc(db, 'songs', song.id), song);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteSongFromFirestore(songId: string): Promise<void> {
  const path = `songs/${songId}`;
  try {
    await deleteDoc(doc(db, 'songs', songId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// --- Albums & EPs ---
export async function getAlbumsFromFirestore(): Promise<Album[]> {
  const path = 'albums';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      const initial = getDemoAlbums();
      for (const a of initial) {
        await setDoc(doc(db, path, a.id), a);
      }
      return initial;
    }
    return snap.docs.map((d) => d.data() as Album);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function saveAlbumToFirestore(album: Album): Promise<void> {
  const path = `albums/${album.id}`;
  try {
    await setDoc(doc(db, 'albums', album.id), album);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteAlbumFromFirestore(albumId: string): Promise<void> {
  const path = `albums/${albumId}`;
  try {
    await deleteDoc(doc(db, 'albums', albumId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// --- News ---
export async function getNewsFromFirestore(): Promise<NewsItem[]> {
  const path = 'news';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      const initial = getDemoNews();
      for (const n of initial) {
        await setDoc(doc(db, path, n.id), n);
      }
      return initial;
    }
    return snap.docs.map((d) => d.data() as NewsItem);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return [];
  }
}

export async function saveNewsToFirestore(item: NewsItem): Promise<void> {
  const path = `news/${item.id}`;
  try {
    await setDoc(doc(db, 'news', item.id), item);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteNewsFromFirestore(newsId: string): Promise<void> {
  const path = `news/${newsId}`;
  try {
    await deleteDoc(doc(db, 'news', newsId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// --- Site Config ---
export async function getConfigFromFirestore(): Promise<SiteConfig | null> {
  const path = 'config/general';
  try {
    const snap = await getDocs(collection(db, 'config'));
    if (!snap.empty) {
      const docData = snap.docs.find((d) => d.id === 'general');
      if (docData) return docData.data() as SiteConfig;
    }
    // Seed default
    await setDoc(doc(db, 'config', 'general'), DEFAULT_CONFIG);
    return DEFAULT_CONFIG;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

export async function saveConfigToFirestore(cfg: SiteConfig): Promise<void> {
  const path = 'config/general';
  try {
    await setDoc(doc(db, 'config', 'general'), cfg);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// --- Newsletter Subscriber ---
export async function saveSubscriberToFirestore(email: string): Promise<void> {
  const subId = 'sub-' + Date.now();
  const path = `subscribers/${subId}`;
  try {
    const newSub: Subscriber = {
      id: subId,
      email,
      date: Date.now()
    };
    await setDoc(doc(db, 'subscribers', subId), newSub);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// --- Dynamic Top Menus & Submenus ---
export async function getCustomMenusFromFirestore(): Promise<CustomMenuItem[]> {
  const path = 'custom_menus';
  try {
    const snap = await getDocs(collection(db, path));
    if (snap.empty) {
      return DEFAULT_CUSTOM_MENUS;
    }
    const items = snap.docs.map((d) => d.data() as CustomMenuItem);
    return items.sort((a, b) => (a.order || 0) - (b.order || 0));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return DEFAULT_CUSTOM_MENUS;
  }
}

export async function saveCustomMenusToFirestore(menus: CustomMenuItem[]): Promise<void> {
  const path = 'custom_menus';
  try {
    for (const m of menus) {
      await setDoc(doc(db, path, m.id), m);
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCustomMenuFromFirestore(menuId: string): Promise<void> {
  const path = `custom_menus/${menuId}`;
  try {
    await deleteDoc(doc(db, 'custom_menus', menuId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// Helper to remove any demo songs that were previously saved to Firestore
export async function clearAllDemoSongsFromFirestore(): Promise<number> {
  let clearedCount = 0;
  try {
    const snap = await getDocs(collection(db, 'songs'));
    for (const d of snap.docs) {
      const data = d.data() as Song;
      if (d.id.startsWith('song-') || (data.link && data.link.includes('pixabay.com'))) {
        await deleteDoc(doc(db, 'songs', d.id));
        clearedCount++;
      }
    }
  } catch (e) {
    console.warn('Notice when clearing demo songs:', e);
  }
  return clearedCount;
}
