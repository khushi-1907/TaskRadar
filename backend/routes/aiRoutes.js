const express = require('express');
const { getAiSuggestions } = require('../controllers/aiController');
const { protect } = require('../middleware/protect');

const router = express.Router();

router.post('/suggestions', protect, getAiSuggestions);

module.exports = router;