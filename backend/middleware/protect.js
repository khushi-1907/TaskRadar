const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Task = require('../models/Task');

const protect = async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with Bearer
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by decoded id and attach to request object
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token'
    });
  }
};

// Specific middleware to check if user owns the task
const authorizeTaskOwner = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user owns the task
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'User not authorized to access this task'
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = { protect, authorizeTaskOwner };