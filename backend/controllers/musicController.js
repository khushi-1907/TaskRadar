const musicTracks = [
  {
    id: '1',
    name: 'Lofi Study Beats',
    genre: 'Lo-fi Hip Hop',
    duration: '1:00:00',
    coverImage: 'https://example.com/lofi-cover.jpg',
    streamUrl: '',
    tags: ['focus', 'study', 'calm']
  },
  {
    id: '2',
    name: 'Deep Concentration',
    genre: 'Ambient',
    duration: '45:00',
    coverImage: 'https://example.com/ambient-cover.jpg',
    streamUrl: 'https://example.com/stream/ambient',
    tags: ['deep work', 'flow']
  },
  {
    id: '3',
    name: 'Coffee Shop Background',
    genre: 'Ambient Noise',
    duration: '2:30:00',
    coverImage: 'https://example.com/coffee-cover.jpg',
    streamUrl: 'https://example.com/stream/coffee',
    tags: ['white noise', 'background']
  }
];

// @desc    Get all music tracks
// @route   GET /api/music
// @access  Private
const getMusicTracks = async (req, res) => {
  try {
    res.json({
      success: true,
      tracks: musicTracks
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch music tracks'
    });
  }
};

module.exports = {
  getMusicTracks
};