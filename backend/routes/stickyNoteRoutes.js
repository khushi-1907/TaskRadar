const express = require('express');
const { getStickyNotes, createStickyNote, updateStickyNote, deleteStickyNote } = require('../controllers/stickyNoteController');
const { protect } = require('../middleware/protect');

const router = express.Router();

router.route('/')
  .get(protect, getStickyNotes)
  .post(protect, createStickyNote);

router.route('/:id')
  .put(protect, updateStickyNote)
  .delete(protect, deleteStickyNote);

module.exports = router;