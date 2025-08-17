import { useState, useRef, useEffect } from 'react';
import { MusicalNoteIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/solid';
import api from '../api';

const FocusMusic = () => {
  const [tracks, setTracks] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchTracks = async () => {
      setStatus('Loading track list...');
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/api/music', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.data.success && res.data.tracks.length > 0) {
          setTracks(res.data.tracks);
          setCurrentTrack(res.data.tracks[0]);
          setStatus('Track list loaded.');
        } else {
          setStatus('No tracks found.');
        }
      } catch (err) {
        console.error('Failed to fetch tracks', err.response?.data || err.message);
        setStatus('Error loading tracks.');
      } finally {
        setLoading(false);
      }
    };
    fetchTracks();
  }, []);

  const togglePlay = () => {
    if (!currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      setStatus(`Paused: ${currentTrack.name}`);
    } else {
      setStatus('Loading audio...');
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setStatus(`Now playing: ${currentTrack.name}`);
        })
        .catch(err => {
          console.error('Playback failed', err);
          setStatus('Playback failed — maybe autoplay is blocked.');
        });
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const changeTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(false);
    setStatus(`Selected track: ${track.name}`);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f0ff] to-[#e0f7fa]">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto"> {/* Increased max-width */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 relative overflow-hidden">
            <div className="relative z-10">
              <header className="flex flex-col items-center text-center mb-6">
                <MusicalNoteIcon className="h-12 w-12 text-purple-500 mb-4" />
                <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 mb-2">
                  Focus Music
                </h1>
                <p className="text-gray-500">Local audio files for better privacy</p>
              </header>

              {/* Status Message */}
              <p className="text-center text-sm text-gray-600 mb-6">{status}</p>

              {/* Audio Element */}
              {currentTrack && (
                <audio
                  ref={audioRef}
                  src={`http://localhost:5000${currentTrack.file}`}
                  loop
                  onWaiting={() => setStatus('Buffering...')}
                  onPlaying={() => setStatus(`Now playing: ${currentTrack.name}`)}
                  onEnded={() => setIsPlaying(false)}
                />
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6"> {/* Grid layout for larger screens */}
                {/* Now Playing Section */}
                <div className="lg:col-span-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-lg font-semibold mb-4">Now Playing</h2>
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-32 h-32 rounded-lg bg-purple-100 flex items-center justify-center">
                      <MusicalNoteIcon className="h-12 w-12 text-purple-500" />
                    </div>
                    <div className="text-center">
                      <h3 className="font-medium text-lg">{currentTrack?.name || 'No track selected'}</h3>
                      <p className="text-sm text-gray-500">Local File</p>
                    </div>
                    <div className="flex items-center gap-4 w-full justify-center">
                      <button
                        onClick={togglePlay}
                        className="p-4 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                        disabled={!currentTrack}
                      >
                        {isPlaying ? (
                          <PauseIcon className="h-8 w-8" />
                        ) : (
                          <PlayIcon className="h-8 w-8" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Controls and Track List */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Volume Control */}
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4">Volume Control</h2>
                    <div className="flex items-center gap-3">
                      <MusicalNoteIcon className="h-5 w-5 text-gray-400" />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="flex-1 accent-purple-500"
                      />
                      <span className="text-sm w-10 text-right">{volume}%</span>
                    </div>
                  </div>

                  {/* Track List */}
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4">Available Tracks</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3"> {/* Grid for track list */}
                      {tracks.map((track) => (
                        <div
                          key={track.id}
                          onClick={() => changeTrack(track)}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                            currentTrack && currentTrack.id === track.id
                              ? 'bg-purple-50 border border-purple-200'
                              : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                          }`}
                        >
                          <div className="w-10 h-10 rounded-md bg-purple-100 flex items-center justify-center">
                            <MusicalNoteIcon className="h-5 w-5 text-purple-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium truncate">{track.name}</h3>
                            <p className="text-xs text-gray-500">Local file</p>
                          </div>
                          {currentTrack && currentTrack.id === track.id && isPlaying && (
                            <div className="flex space-x-1">
                              <div className="w-1 h-4 bg-purple-500 animate-pulse"></div>
                              <div className="w-1 h-6 bg-purple-500 animate-pulse"></div>
                              <div className="w-1 h-4 bg-purple-500 animate-pulse"></div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusMusic;