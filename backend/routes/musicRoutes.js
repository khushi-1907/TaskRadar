const express = require('express');
const { getMusicTracks } = require('../controllers/musicController');
const { protect } = require('../middleware/protect');
const router = express.Router();

router.get('/', protect, getMusicTracks);

module.exports = router;