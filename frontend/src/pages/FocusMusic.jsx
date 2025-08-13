import { useState, useRef } from 'react';
import { MusicalNoteIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/solid';

const FocusMusic = () => {
  const [tracks] = useState([
    {
      id: '1',
      name: 'Please Calm My Mind',
      file: '/music/please-calm-my-mind.mp3'
    },
    {
      id: '2',
      name: 'Deep Concentration',
      file: '/music/deep-concentration.mp3'
    },
    {
      id: '3',
      name: 'Coffee Shop Ambience',
      file: '/music/coffee-shop.mp3'
    }
  ]);

  const [currentTrack, setCurrentTrack] = useState(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const audioRef = useRef(null);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume / 100;
  };

  const changeTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f9f0ff] to-[#e0f7fa]">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 relative overflow-hidden">
            <div className="relative z-10">
              <header className="flex flex-col items-center text-center mb-8">
                <MusicalNoteIcon className="h-12 w-12 text-purple-500 mb-4" />
                <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 mb-2">
                  Focus Music
                </h1>
                <p className="text-gray-500">Local audio files for better privacy</p>
              </header>

              {/* Audio element */}
              <audio
                ref={audioRef}
                src={currentTrack.file}
                loop
                onEnded={() => setIsPlaying(false)}
              />

              {/* Now Playing */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                <h2 className="text-lg font-semibold mb-4">Now Playing</h2>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-purple-100 flex items-center justify-center">
                    <MusicalNoteIcon className="h-8 w-8 text-purple-500" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{currentTrack.name}</h3>
                    <p className="text-sm text-gray-500">Local File</p>
                  </div>
                  <button
                    onClick={togglePlay}
                    className="p-3 rounded-full bg-purple-500 text-white hover:bg-purple-600 transition-colors"
                  >
                    {isPlaying ? (
                      <PauseIcon className="h-6 w-6" />
                    ) : (
                      <PlayIcon className="h-6 w-6" />
                    )}
                  </button>
                </div>
              </div>

              {/* Volume Control */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
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
              <div className="space-y-2">
                <h2 className="text-lg font-semibold mb-2">Available Tracks</h2>
                <div className="space-y-2">
                  {tracks.map((track) => (
                    <div
                      key={track.id}
                      onClick={() => changeTrack(track)}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${currentTrack.id === track.id ? 'bg-purple-50 border border-purple-200' : 'bg-white hover:bg-gray-50 border border-gray-100'}`}
                    >
                      <div className="w-10 h-10 rounded-md bg-purple-100 flex items-center justify-center">
                        <MusicalNoteIcon className="h-5 w-5 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{track.name}</h3>
                        <p className="text-xs text-gray-500">Local file</p>
                      </div>
                      {currentTrack.id === track.id && isPlaying && (
                        <div className="flex space-x-1">
                          <div className="w-1 h-4 bg-purple-500 animate-pulse" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-1 h-6 bg-purple-500 animate-pulse" style={{ animationDelay: '200ms' }}></div>
                          <div className="w-1 h-4 bg-purple-500 animate-pulse" style={{ animationDelay: '400ms' }}></div>
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
  );
};

export default FocusMusic;