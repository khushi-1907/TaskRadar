// backend/controllers/musicController.js
const path = require('path');
const fs = require('fs');

const getMusicTracks = (req, res) => {
  try {
    const musicDir = path.join(__dirname, '../public/music');

    // Read files from music folder
    const files = fs.readdirSync(musicDir);

    // Create track objects
    const tracks = files.map((file, index) => ({
      id: String(index + 1),
      name: file.replace(/\.[^/.]+$/, ""), // remove extension for display
      file: `/music/${file}` // public path
    }));

    res.json({
      success: true,
      tracks
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch music tracks'
    });
  }
};

module.exports = { getMusicTracks };
