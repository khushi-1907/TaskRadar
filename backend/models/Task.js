const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required']
  },
  priority: {
    type: String,
    required: [true, 'Priority is required'],
    enum: {
      values: ['Low', 'Medium', 'High'],
      message: 'Priority must be Low, Medium, or High'
    },
    default: 'Medium'
  },
  completed: {
    type: Boolean,
    default: false
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for efficient querying
taskSchema.index({ user: 1, deadline: 1 });

module.exports = mongoose.model('Task', taskSchema);