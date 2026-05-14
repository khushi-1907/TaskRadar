const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const getStudyTips = async (req, res) => {
  try {
    if (!GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'Missing Gemini API key',
      });
    }

    const { topic } = req.body;

    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Valid topic is required',
      });
    }

    // ✅ Gemini prompt (single text instead of chat roles)
    const prompt = `
You are an AI tutor. Respond ONLY with a numbered list of 5 concise study tips.

Topic: ${topic}
`;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 300
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    // ✅ Gemini response extraction
    const output =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!output) {
      return res.status(500).json({
        success: false,
        message: 'No response from Gemini model',
      });
    }

    // ✅ SAME parsing logic (works fine)
    const tips = output
      .split('\n')
      .map((line) => line.trim())
      .filter(line =>
        /^(\d+[\.\)]?|[-*•]|\*\*\d+[\.\)]\*\*)\s+/.test(line)
      )
      .map(line =>
        line
          .replace(/^(\d+[\.\)]?|[-*•]|\*\*\d+[\.\)]\*\*)\s+/, '')
          .replace(/^\*\*|\*\*$/g, '')
      )
      .filter(line => line.length > 10)
      .slice(0, 5);

    if (tips.length === 0) {
      console.error('Failed to parse tips from output:', output);
      return res.status(500).json({
        success: false,
        message: 'AI response could not be parsed',
      });
    }

    return res.status(200).json({
      success: true,
      tips,
    });
  } catch (error) {
    console.error('Gemini Error:', error?.response?.data || error);

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
