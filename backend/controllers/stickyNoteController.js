const StickyNote = require('../models/StickyNote');

// @desc    Get all sticky notes for the logged-in user
// @route   GET /api/sticky-notes
// @access  Private
const getStickyNotes = async (req, res) => {
  try {
    const notes = await StickyNote.find({ user: req.user._id });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create a new sticky note
// @route   POST /api/sticky-notes
// @access  Private
const createStickyNote = async (req, res) => {
  try {
    const { content, x, y, width, height, color } = req.body;
    
    const newNote = new StickyNote({
      user: req.user._id,
      content,
      x: x || 0,
      y: y || 0,
      width: width || 200,
      height: height || 200,
      color: color || '#fef3c7'
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update a sticky note
// @route   PUT /api/sticky-notes/:id
// @access  Private
const updateStickyNote = async (req, res) => {
  try {
    const note = await StickyNote.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedNote = await StickyNote.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a sticky note
// @route   DELETE /api/sticky-notes/:id
// @access  Private
const deleteStickyNote = async (req, res) => {
  try {
    const note = await StickyNote.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await StickyNote.deleteOne({ _id: req.params.id });
    res.json({ message: 'Note removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getStickyNotes,
  createStickyNote,
  updateStickyNote,
  deleteStickyNote
};