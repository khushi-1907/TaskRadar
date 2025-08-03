const axios = require('axios');

// @desc    Get AI suggestions based on tasks
// @route   POST /api/ai/suggestions 
// @access  Private
exports.getAiSuggestions = async (req, res) => {
  try {
    const { tasks } = req.body;
    
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of tasks'
      });
    }

    // Format tasks for the AI model
    const formattedText = tasks.map(task => {
      return `Task: ${task.title}\nDescription: ${task.description || 'No description'}\nPriority: ${task.priority}\nStatus: ${task.completed ? 'Completed' : 'Pending'}\n`;
    }).join('\n');

    // Send request to Hugging Face API
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      {
        inputs: formattedText,
        parameters: {
          max_length: 250,
          min_length: 50,
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY || ''}`
        }
      }
    );

    // Extract the summary from the response
    const summary = response.data[0]?.summary_text || 'No suggestions available';

    res.status(200).json({
      success: true,
      data: {
        suggestions: summary
      }
    });
  } catch (error) {
    console.error('AI Suggestion Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to get AI suggestions',
      error: error.response?.data?.error || error.message
    });
  }
};