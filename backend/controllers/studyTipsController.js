const axios = require('axios');

// OpenRouter API endpoint
const OR_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OR_API_KEY = process.env.OPENROUTER_API_KEY;

const getStudyTips = async (req, res) => {
  try {
    if (!OR_API_KEY) {
      console.error('OPENROUTER_API_KEY is not set in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error: Missing OpenRouter API key',
      });
    }

    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({
        success: false,
        message: 'Topic is required',
      });
    }

    // Prepare conversation
    const messages = [
      { role: 'system', content: 'You are an AI tutor generating concise study tips.' },
      { role: 'user', content: `Give 5 concise study tips for learning ${topic} effectively. Format as a numbered list.` }
    ];

    // OpenRouter API request
    const response = await axios.post(
      OR_API_URL,
      {
        model: 'deepseek/deepseek-chat-v3-0324:free',
        messages,
        temperature: 0.5
      },
      {
        headers: {
          Authorization: `Bearer ${OR_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Extract generated text
    const output = response.data?.choices?.[0]?.message?.content || '';

    // Extract numbered tips
    const tips = output
      .split('\n')
      .filter(line => /^\d+\./.test(line.trim()))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .slice(0, 5);

    if (!tips.length) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate study tips',
      });
    }

    res.status(200).json({
      success: true,
      tips,
    });
  } catch (error) {
    console.error('Error in getStudyTips:', error);

    if (error.response) {
      return res.status(error.response.status || 500).json({
        success: false,
        message:
          error.response.data?.error ||
          error.message ||
          'Failed to process your request',
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'An unexpected error occurred',
    });
  }
};

module.exports = {
  getStudyTips,
};
