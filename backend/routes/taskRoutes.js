const express = require('express');
const { 
  createTask, 
  getTasks, 
  getTask, 
  updateTask, 
  deleteTask, 
  completeTask 
} = require('../controllers/taskController');
const { protect } = require('../middleware/protect');

const router = express.Router();

// Protect all routes
router.use(protect);

// @route   POST /api/tasks
// @desc    Create a new task
router.post('/', createTask);

// @route   GET /api/tasks
// @desc    Get all tasks of logged in user
router.get('/', getTasks);

// @route   GET /api/tasks/:id
// @desc    Get a single task
router.get('/:id', getTask);

// @route   PUT /api/tasks/:id
// @desc    Update a task
router.put('/:id', updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
router.delete('/:id', deleteTask);

// @route   PUT /api/tasks/:id/complete
// @desc    Mark a task as complete
router.put('/:id/complete', completeTask);

module.exports = router;