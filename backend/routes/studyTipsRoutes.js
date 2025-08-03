const express = require('express');
const { getStudyTips } = require('../controllers/studyTipsController');
const { protect } = require('../middleware/protect');

const router = express.Router();

router.post('/', protect, getStudyTips);

module.exports = router;