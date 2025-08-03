const axios = require('axios');

// @desc    Get AI suggestions based on tasks
// @route   POST /api/ai/suggestions 
// @access  Private
exports.getAiSuggestions = async (req, res) => {
  try {
    const { tasks } = req.body;

    // Validate input
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of tasks',
      });
    }

    // Format tasks clearly with newlines
    const formattedText = tasks.map((task, i) => {
      return `Task ${i + 1}:\nTitle: ${task.title || 'Untitled'}\nDescription: ${task.description || 'No description'}\nPriority: ${task.priority || 'Unknown'}\nStatus: ${task.completed ? 'Completed' : 'Pending'}\n`;
    }).join('\n');

    const prompt = `Analyze the following tasks and provide productivity suggestions or optimization tips:\n\n${formattedText}`;

    // Send request to Hugging Face model
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/facebook/bart-large-cnn',
      {
        inputs: prompt,
        parameters: {
          max_length: 250,
          min_length: 60,
        },
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const summary = response.data[0]?.summary_text?.trim() || 'No suggestions available.';

    res.status(200).json({
      success: true,
      data: { suggestions: summary },
    });

  } catch (error) {
    console.error('AI Suggestion Error:', error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: 'Failed to get AI suggestions',
      error: error.response?.data?.error || error.message,
    });
  }
};
