import React, { useState } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  FileText,
  X,
  Maximize2
} from 'lucide-react';
import { PlayerState, audioPlayer } from '../services/audioPlayerService';
import { StudioVisualizer } from './StudioVisualizer';
import { formatSeconds, getPlaceholderCover, normalizeUrl } from '../utils/helpers';
import { Language } from '../types';
import { translations } from '../translations';
import { analyticsService } from '../services/analyticsService';

interface AudioPlayerBarProps {
  playerState: PlayerState;
  onOpenDetails: () => void;
  lang: Language;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  playerState,
  onOpenDetails,
  lang
}) => {
  const [imageError, setImageError] = useState(false);
  const song = playerState.currentSong;

  if (!song) return null;

  const t = translations[lang] || translations.pt;
  const coverSrc = !imageError && song.cover ? normalizeUrl(song.cover) : getPlaceholderCover(song.title);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    audioPlayer.seek(val);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    audioPlayer.setVolume(val);
  };

  const handleDownload = () => {
    analyticsService.recordDownload(song);
    window.open(normalizeUrl(song.link), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 shadow-2xl px-3 sm:px-6 py-2.5 transition-all animate-in slide-in-from-bottom-2">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-6">
        {/* Left: Track Info */}
        <div className="flex items-center gap-3 w-full sm:w-1/3 min-w-0">
          <div
            onClick={onOpenDetails}
            className="w-12 h-12 rounded-lg overflow-hidden bg-slate-900 border border-slate-700/80 flex-shrink-0 cursor-pointer relative group"
          >
            <img
              src={coverSrc}
              alt={song.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
              <Maximize2 className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h4
              onClick={onOpenDetails}
              className="text-xs sm:text-sm font-bold text-white truncate cursor-pointer hover:text-amber-300 transition-colors leading-tight"
            >
              {song.title}
            </h4>
            <p className="text-[11px] text-sky-400 font-semibold truncate">
              {song.artist || t.artist_unknown}
            </p>
          </div>

          {/* Studio Realtime Visualizer */}
          <div className="hidden md:flex items-center pl-2">
            <StudioVisualizer isPlaying={playerState.isPlaying} barCount={14} height={28} />
          </div>
        </div>

        {/* Center: Play Controls & Progress */}
        <div className="flex flex-col items-center w-full sm:w-5/12 max-w-lg">
          <div className="flex items-center gap-3 mb-1">
            <button
              onClick={() => audioPlayer.togglePlay()}
              className="w-9 h-9 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-md shadow-red-950 transition-all transform active:scale-95"
              title={playerState.isPlaying ? t.btn_pause : t.btn_play}
            >
              {playerState.isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
          </div>

          {/* Scrubber slider */}
          <div className="w-full flex items-center gap-2 text-[10px] font-mono text-slate-400">
            <span className="w-8 text-right">{formatSeconds(playerState.currentTime)}</span>
            <input
              type="range"
              min={0}
              max={playerState.duration || 100}
              value={playerState.currentTime}
              onChange={handleSeek}
              className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
            />
            <span className="w-8">{formatSeconds(playerState.duration)}</span>
          </div>
        </div>

        {/* Right: Volume & Shortcuts */}
        <div className="hidden sm:flex items-center justify-end gap-3 w-1/3 text-slate-300">
          {/* Lyrics modal shortcut */}
          <button
            onClick={onOpenDetails}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-300 transition-colors"
            title="Ver letra e detalhes"
          >
            <FileText className="w-4 h-4" />
          </button>

          {/* Download button */}
          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400 transition-colors"
            title={t.btn_download}
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Volume slider */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => audioPlayer.toggleMute()}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              {playerState.isMuted || playerState.volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={playerState.isMuted ? 0 : playerState.volume}
              onChange={handleVolume}
              className="w-20 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
