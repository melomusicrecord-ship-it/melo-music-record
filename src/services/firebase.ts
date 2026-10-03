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
import { Song, Album, NewsItem, SiteConfig, Subscriber } from '../types';
import { getDemoSongs, getDemoAlbums, getDemoNews, DEFAULT_CONFIG } from './defaultData';

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
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
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
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore: cliente em modo offline ou a inicializar.');
    }
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
      // Seed default songs to Firestore
      const initial = getDemoSongs();
      for (const s of initial) {
        await setDoc(doc(db, path, s.id), s);
      }
      return initial;
    }
    return snap.docs.map((d) => d.data() as Song);
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
