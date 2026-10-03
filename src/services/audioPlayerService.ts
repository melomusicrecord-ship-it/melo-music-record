import { Song } from '../types';

type PlayerListener = (state: PlayerState) => void;

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
}

class AudioPlayerService {
  private audio: HTMLAudioElement | null = null;
  private listeners: PlayerListener[] = [];
  private state: PlayerState = {
    currentSong: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.85,
    isMuted: false,
    isLoading: false
  };

  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private animFrameId: number | null = null;
  private simulatedTimeInterval: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initAudio();
    }
  }

  private initAudio() {
    this.audio = new Audio();
    this.audio.preload = 'metadata';
    this.audio.volume = this.state.volume;

    this.audio.addEventListener('play', () => {
      this.state.isPlaying = true;
      this.state.isLoading = false;
      this.notify();
    });

    this.audio.addEventListener('pause', () => {
      this.state.isPlaying = false;
      this.notify();
    });

    this.audio.addEventListener('timeupdate', () => {
      if (this.audio) {
        this.state.currentTime = this.audio.currentTime;
        this.notify();
      }
    });

    this.audio.addEventListener('loadedmetadata', () => {
      if (this.audio) {
        this.state.duration = this.audio.duration || 180;
        this.state.isLoading = false;
        this.notify();
      }
    });

    this.audio.addEventListener('ended', () => {
      this.state.isPlaying = false;
      this.state.currentTime = 0;
      this.notify();
    });

    this.audio.addEventListener('error', () => {
      // If direct audio load fails or cross-origin blocks, fallback to simulated play
      console.warn('Audio stream fallback mode');
      this.state.isLoading = false;
      this.startSimulatedPlayback();
      this.notify();
    });
  }

  private startSimulatedPlayback() {
    if (this.simulatedTimeInterval) clearInterval(this.simulatedTimeInterval);
    this.state.isPlaying = true;
    if (!this.state.duration) this.state.duration = 195; // default 3:15
    this.simulatedTimeInterval = setInterval(() => {
      if (this.state.isPlaying) {
        this.state.currentTime += 0.5;
        if (this.state.currentTime >= this.state.duration) {
          this.state.currentTime = 0;
          this.state.isPlaying = false;
          clearInterval(this.simulatedTimeInterval);
        }
        this.notify();
      }
    }, 500);
  }

  public playSong(song: Song) {
    if (!this.audio) this.initAudio();
    if (this.simulatedTimeInterval) clearInterval(this.simulatedTimeInterval);

    this.state.currentSong = song;
    this.state.isLoading = true;
    this.state.currentTime = 0;
    this.notify();

    const stream = song.streamUrl || song.link;
    if (this.audio) {
      this.audio.src = stream;
      this.audio.play().catch(() => {
        // Autoplay policy or CORS - fallback to simulated beat
        this.startSimulatedPlayback();
        this.notify();
      });
    }
  }

  public togglePlay() {
    if (!this.state.currentSong) return;

    if (this.state.isPlaying) {
      if (this.audio) this.audio.pause();
      if (this.simulatedTimeInterval) clearInterval(this.simulatedTimeInterval);
      this.state.isPlaying = false;
      this.notify();
    } else {
      if (this.audio && this.audio.src) {
        this.audio.play().catch(() => {
          this.startSimulatedPlayback();
          this.notify();
        });
      } else {
        this.startSimulatedPlayback();
        this.notify();
      }
    }
  }

  public seek(seconds: number) {
    this.state.currentTime = seconds;
    if (this.audio && !isNaN(this.audio.duration)) {
      this.audio.currentTime = seconds;
    }
    this.notify();
  }

  public setVolume(vol: number) {
    const clamped = Math.max(0, Math.min(1, vol));
    this.state.volume = clamped;
    this.state.isMuted = clamped === 0;
    if (this.audio) {
      this.audio.volume = clamped;
    }
    this.notify();
  }

  public toggleMute() {
    this.state.isMuted = !this.state.isMuted;
    if (this.audio) {
      this.audio.muted = this.state.isMuted;
    }
    this.notify();
  }

  public getState(): PlayerState {
    return { ...this.state };
  }

  public subscribe(listener: PlayerListener) {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter((fn) => fn !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn({ ...this.state }));
  }
}

export const audioPlayer = new AudioPlayerService();
