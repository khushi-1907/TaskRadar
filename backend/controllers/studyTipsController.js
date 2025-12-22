const axios = require('axios');

// OpenRouter API endpoint
const OR_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OR_API_KEY = process.env.OPENROUTER_API_KEY;

const getStudyTips = async (req, res) => {
  try {
    if (!OR_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Server configuration error: Missing OpenRouter API key',
      });
    }

    const { topic } = req.body;

    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Valid topic is required',
      });
    }

    const messages = [
      {
        role: 'system',
        content: 'You are an AI tutor. Respond ONLY with a numbered list of 5 concise study tips.',
      },
      {
        role: 'user',
        content: `Topic: ${topic}`,
      },
    ];

    const response = await axios.post(
      OR_API_URL,
      {
        model: 'deepseek/deepseek-r1-0528:free',
        messages,
        temperature: 0.5,
        max_tokens: 300,
      },
      {
        headers: {
          Authorization: `Bearer ${OR_API_KEY}`,
          'Content-Type': 'application/json',

          // 🔴 REQUIRED by OpenRouter (often missing)
          'HTTP-Referer': 'http://localhost:3000', // or your site URL
          'X-Title': 'Study Tips API',
        },
      }
    );

    const output = response.data?.choices?.[0]?.message?.content;

    if (!output) {
      return res.status(500).json({
        success: false,
        message: 'No response from AI model',
      });
    }

    // More robust parsing handling various formats (1., 1), *, -, **)
    const tips = output
      .split('\n')
      .map(line => line.trim())
      // Match numbers (1., 1), bullets (*, -, •), and bold numbers (**1.**)
      .filter(line => /^(\d+[\.\)]?|[-*•]|\*\*\d+[\.\)]\*\*)\s+/.test(line))
      // cleanup the list markers and any bold formatting
      .map(line => line.replace(/^(\d+[\.\)]?|[-*•]|\*\*\d+[\.\)]\*\*)\s+/, '').replace(/^\*\*|\*\*$/g, ''))
      .filter(line => line.length > 10) // Filter out very short lines/artifacts
      .slice(0, 5);

    if (tips.length === 0) {
      console.error('Failed to parse tips from output:', output);
      return res.status(500).json({
        success: false,
        message: 'AI response could not be parsed. Please try again.',
      });
    }

    return res.status(200).json({
      success: true,
      tips,
    });
  } catch (error) {
    console.error('Error in getStudyTips:', error?.response?.data || error);

    return res.status(error?.response?.status || 500).json({
      success: false,
      message:
        error?.response?.data?.error?.message ||
        error.message ||
        'Failed to generate study tips',
    });
  }
};

module.exports = { getStudyTips };
