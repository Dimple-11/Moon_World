import React, { useState, useRef, useEffect } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Upload, ListMusic, ChevronDown, ChevronUp, Shuffle, Repeat,
  Music, Trash2, Edit2, Check, Sparkles, Disc3, Maximize2, Minimize2
} from 'lucide-react';

const DEFAULT_PLAYLIST = [
  {
    id: 'track-default-1',
    title: 'Sakura Petals in the Wind',
    artist: 'Dimple\'s World Ambient',
    cover: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&w=400&q=80',
    isSynthetic: true,
    url: null,
    duration: 180
  },
  {
    id: 'track-default-2',
    title: 'Midnight Lo-Fi Terminal',
    artist: 'Chill Coding Sessions',
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
    isSynthetic: true,
    url: null,
    duration: 210
  }
];

export default function MusicPlayer({ isForceOpen = false, onCloseForce }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(180);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState('off'); // 'off' | 'all' | 'one'
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [editingTrackId, setEditingTrackId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  // Persist playlist in localStorage
  const [playlist, setPlaylist] = useState(() => {
    try {
      const saved = localStorage.getItem('dimple_music_playlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_PLAYLIST;
  });

  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const synthAudioCtxRef = useRef(null);
  const synthIntervalRef = useRef(null);

  // Sync with forced open trigger from command palette
  useEffect(() => {
    if (isForceOpen) {
      setIsExpanded(true);
      onCloseForce?.();
    }
  }, [isForceOpen, onCloseForce]);

  // Save playlist to localStorage (excluding blob URLs which expire)
  useEffect(() => {
    const toSave = playlist.map(t => ({
      id: t.id,
      title: t.title,
      artist: t.artist,
      cover: t.cover,
      isSynthetic: t.isSynthetic,
      duration: t.duration
    }));
    try {
      localStorage.setItem('dimple_music_playlist', JSON.stringify(toSave));
    } catch (e) {}
  }, [playlist]);

  const currentTrack = playlist[currentTrackIndex] || playlist[0] || DEFAULT_PLAYLIST[0];

  // ==========================================
  // Web Audio API Ambient Synthesizer
  // ==========================================
  const startSyntheticChimes = () => {
    try {
      if (!synthAudioCtxRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        synthAudioCtxRef.current = new AudioContext();
      }
      const ctx = synthAudioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Pentatonic soothing notes in A Major / F# Minor
      const frequencies = [220, 261.63, 293.66, 329.63, 392.00, 440, 523.25, 587.33, 659.25];

      const playChime = () => {
        if (!isPlaying || !synthAudioCtxRef.current) return;
        const noteFreq = frequencies[Math.floor(Math.random() * frequencies.length)];
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(noteFreq, ctx.currentTime);

        const targetVol = isMuted ? 0 : volume * 0.08;
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(targetVol, ctx.currentTime + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 3.3);
      };

      playChime();
      if (synthIntervalRef.current) clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = setInterval(playChime, 1800);
    } catch (e) {
      console.warn('Web Audio synth warning:', e);
    }
  };

  const stopSyntheticChimes = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  };

  // Handle Play/Pause
  useEffect(() => {
    if (isPlaying) {
      if (currentTrack.isSynthetic) {
        startSyntheticChimes();
      } else if (audioRef.current && currentTrack.url) {
        audioRef.current.play().catch(e => console.warn('Audio play error:', e));
      }
    } else {
      stopSyntheticChimes();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
    return () => stopSyntheticChimes();
  }, [isPlaying, currentTrackIndex]);

  // Time simulation for synthetic track
  useEffect(() => {
    let timer;
    if (isPlaying && currentTrack.isSynthetic) {
      timer = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            handleNextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentTrack.isSynthetic, duration]);

  // Audio element event listeners
  const onTimeUpdate = () => {
    if (audioRef.current && !currentTrack.isSynthetic) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration) setDuration(audioRef.current.duration);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current && !currentTrack.isSynthetic) {
      setDuration(audioRef.current.duration || 180);
    }
  };

  const onAudioEnded = () => {
    handleNextTrack();
  };

  // Track controls
  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const handleNextTrack = () => {
    if (repeatMode === 'one') {
      if (audioRef.current) audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setIsPlaying(true);
      return;
    }

    if (isShuffle) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      setCurrentTrackIndex(randomIndex);
    } else {
      setCurrentTrackIndex(prev => (prev + 1) % playlist.length);
    }
    setCurrentTime(0);
  };

  const handlePrevTrack = () => {
    if (currentTime > 3) {
      if (audioRef.current) audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    setCurrentTrackIndex(prev => (prev - 1 + playlist.length) % playlist.length);
    setCurrentTime(0);
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current && !currentTrack.isSynthetic) {
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      if (audioRef.current) audioRef.current.volume = volume || 0.7;
    } else {
      setIsMuted(true);
      if (audioRef.current) audioRef.current.volume = 0;
    }
  };

  // Upload Custom Audio
  const handleAudioUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newTracks = files.map((file, i) => {
      const url = URL.createObjectURL(file);
      const cleanTitle = file.name.replace(/\.[^/.]+$/, "");
      return {
        id: 'user-audio-' + Date.now() + '-' + i,
        title: cleanTitle,
        artist: 'My Local Music',
        cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80',
        isSynthetic: false,
        url,
        duration: 200
      };
    });

    setPlaylist(prev => [...prev, ...newTracks]);
    setCurrentTrackIndex(playlist.length); // Play first uploaded track
    setIsPlaying(true);
    setShowPlaylist(true);
  };

  // Remove Track
  const handleRemoveTrack = (id, e) => {
    e.stopPropagation();
    if (playlist.length <= 1) return;
    const idx = playlist.findIndex(t => t.id === id);
    if (idx === -1) return;

    if (playlist[idx].url) {
      URL.revokeObjectURL(playlist[idx].url);
    }

    const updated = playlist.filter(t => t.id !== id);
    setPlaylist(updated);
    if (currentTrackIndex >= updated.length) {
      setCurrentTrackIndex(0);
    }
  };

  // Rename Track
  const startEditing = (track, e) => {
    e.stopPropagation();
    setEditingTrackId(track.id);
    setEditingTitle(track.title);
  };

  const saveEditing = (id, e) => {
    e?.stopPropagation();
    if (!editingTitle.trim()) return;
    setPlaylist(prev => prev.map(t => t.id === id ? { ...t, title: editingTitle.trim() } : t));
    setEditingTrackId(null);
  };

  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="music-player-master">
      {/* Hidden real audio element */}
      <audio
        ref={audioRef}
        src={currentTrack.url || undefined}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onAudioEnded}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        multiple
        style={{ display: 'none' }}
        onChange={handleAudioUpload}
      />

      {/* =========================================================
          COLLAPSED MINI MUSIC DOCK
          ========================================================= */}
      {!isExpanded && (
        <div className="music-dock-collapsed" onClick={() => setIsExpanded(true)}>
          {/* Mini Album Art / Rotating Vinyl */}
          <div className={`mini-album-art ${isPlaying ? 'is-spinning' : ''}`}>
            <img src={currentTrack.cover} alt={currentTrack.title} />
            <div className="mini-disc-center" />
          </div>

          {/* Track metadata ticker */}
          <div className="mini-track-meta">
            <span className="mini-track-title">{currentTrack.title}</span>
            <span className="mini-track-artist">{currentTrack.artist}</span>
          </div>

          {/* Equalizer animation */}
          <div className={`mini-equalizer ${isPlaying ? 'is-active' : ''}`}>
            <span /><span /><span /><span />
          </div>

          {/* Quick Play/Pause */}
          <button
            className="mini-play-btn"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
          >
            {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
          </button>

          {/* Expand icon */}
          <button
            className="mini-expand-btn"
            onClick={() => setIsExpanded(true)}
            aria-label="Expand music studio"
          >
            <Maximize2 size={13} />
          </button>
        </div>
      )}

      {/* =========================================================
          EXPANDED FLOATING MUSIC STUDIO PANEL
          ========================================================= */}
      {isExpanded && (
        <div className="music-panel-expanded">
          {/* Header */}
          <div className="music-panel-header">
            <div className="music-panel-title-badge">
              <Disc3 size={16} className={`music-disc-icon ${isPlaying ? 'is-spinning' : ''}`} />
              <span>Dimple's Soundscape Studio</span>
            </div>
            <div className="music-panel-header-actions">
              <button
                className="music-action-btn"
                onClick={() => setShowPlaylist(prev => !prev)}
                title="Toggle playlist"
                aria-label="Toggle playlist"
              >
                <ListMusic size={16} />
              </button>
              <button
                className="music-action-btn"
                onClick={() => setIsExpanded(false)}
                title="Minimize player"
                aria-label="Minimize player"
              >
                <Minimize2 size={16} />
              </button>
            </div>
          </div>

          {/* Vinyl & Cover Stage */}
          <div className="music-stage">
            <div className={`vinyl-turntable-wrapper ${isPlaying ? 'is-playing' : ''}`}>
              <div className="vinyl-grooves">
                <img src={currentTrack.cover} alt={currentTrack.title} className="vinyl-center-art" />
                <div className="vinyl-spindle" />
              </div>
            </div>

            <div className="music-meta-block">
              <h4 className="music-current-title">{currentTrack.title}</h4>
              <p className="music-current-artist">{currentTrack.artist}</p>
              {currentTrack.isSynthetic && (
                <span className="synthetic-badge">
                  <Sparkles size={11} />
                  <span>Web Audio Generative Chimes</span>
                </span>
              )}
            </div>
          </div>

          {/* Scrubber & Time */}
          <div className="music-scrubber-row">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="music-seek-bar"
              aria-label="Seek track position"
            />
            <div className="music-time-display">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="music-controls-cluster">
            {/* Shuffle */}
            <button
              className={`ctrl-icon-btn ${isShuffle ? 'is-active' : ''}`}
              onClick={() => setIsShuffle(!isShuffle)}
              title={`Shuffle: ${isShuffle ? 'On' : 'Off'}`}
              aria-label="Toggle shuffle"
            >
              <Shuffle size={15} />
            </button>

            {/* Previous */}
            <button
              className="ctrl-icon-btn"
              onClick={handlePrevTrack}
              title="Previous track"
              aria-label="Previous track"
            >
              <SkipBack size={18} />
            </button>

            {/* Master Play/Pause */}
            <button
              className="ctrl-master-play-btn"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause size={20} fill="currentColor" />
              ) : (
                <Play size={20} fill="currentColor" style={{ marginLeft: 2 }} />
              )}
            </button>

            {/* Next */}
            <button
              className="ctrl-icon-btn"
              onClick={handleNextTrack}
              title="Next track"
              aria-label="Next track"
            >
              <SkipForward size={18} />
            </button>

            {/* Repeat */}
            <button
              className={`ctrl-icon-btn ${repeatMode !== 'off' ? 'is-active' : ''}`}
              onClick={() => setRepeatMode(prev => prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off')}
              title={`Repeat: ${repeatMode}`}
              aria-label="Toggle repeat mode"
            >
              <Repeat size={15} />
              {repeatMode === 'one' && <span className="repeat-one-dot">1</span>}
            </button>
          </div>

          {/* Volume Row */}
          <div className="music-volume-strip">
            <button
              className="vol-icon-btn"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="music-vol-slider"
              aria-label="Volume slider"
            />
            <span className="vol-percentage">{Math.round((isMuted ? 0 : volume) * 100)}%</span>
          </div>

          {/* Upload Audio File CTA */}
          <button
            className="music-upload-cta"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload size={14} />
            <span>Upload Your Own Audio Files</span>
          </button>

          {/* =========================================================
              PLAYLIST DRAWER (Toggled)
              ========================================================= */}
          {showPlaylist && (
            <div className="music-playlist-drawer">
              <div className="playlist-drawer-header">
                <span>Playlist ({playlist.length} tracks)</span>
              </div>
              <div className="playlist-tracks-scroll">
                {playlist.map((track, idx) => {
                  const isCurrent = idx === currentTrackIndex;
                  const isEditing = editingTrackId === track.id;

                  return (
                    <div
                      key={track.id}
                      className={`playlist-item ${isCurrent ? 'is-active' : ''}`}
                      onClick={() => {
                        setCurrentTrackIndex(idx);
                        setIsPlaying(true);
                      }}
                    >
                      <div className="playlist-item-left">
                        <img src={track.cover} alt={track.title} className="playlist-thumb" />
                        <div className="playlist-names">
                          {isEditing ? (
                            <div className="playlist-edit-row" onClick={(e) => e.stopPropagation()}>
                              <input
                                type="text"
                                value={editingTitle}
                                onChange={(e) => setEditingTitle(e.target.value)}
                                className="playlist-inline-input"
                                autoFocus
                              />
                              <button onClick={(e) => saveEditing(track.id, e)} className="playlist-mini-btn">
                                <Check size={12} />
                              </button>
                            </div>
                          ) : (
                            <>
                              <span className="playlist-track-name">{track.title}</span>
                              <span className="playlist-track-artist">{track.artist}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="playlist-item-right" onClick={(e) => e.stopPropagation()}>
                        {!isEditing && (
                          <button
                            className="playlist-mini-btn"
                            onClick={(e) => startEditing(track, e)}
                            title="Rename track"
                            aria-label="Rename track"
                          >
                            <Edit2 size={12} />
                          </button>
                        )}
                        {playlist.length > 1 && (
                          <button
                            className="playlist-mini-btn delete"
                            onClick={(e) => handleRemoveTrack(track.id, e)}
                            title="Remove track"
                            aria-label="Remove track"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
