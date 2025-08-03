const axios = require('axios');

// @desc    Get study tips for a specific subject
// @route   POST /api/study-tips
// @access  Private
const getStudyTips = async (req, res) => {
  try {
    const { subject } = req.body;

    if (!subject) {
      return res.status(400).json({ message: 'Please provide a subject' });
    }

    const prompt = `Generate 5-7 personalized and effective study tips for learning ${subject}. Focus on practical strategies, common mistakes to avoid, and time management techniques. Make the tips actionable, concise, and suitable for college students. Format as a numbered list.`;

    const response = await axios.post(
      'https://api-inference.huggingface.co/models/google/flan-t5-base',
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 300,
          temperature: 0.7,
          top_p: 0.9
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    const studyTips = response.data[0]?.generated_text?.trim() || 
      `Study Tips for ${subject}:\n\n1. Create a study schedule with specific time blocks\n2. Use active recall and spaced repetition techniques\n3. Practice with real problems and past exams\n4. Join study groups or find a study partner\n5. Take regular breaks to avoid burnout`;

    res.json({ 
      success: true, 
      subject,
      tips: studyTips,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Study Tips Error:', error.response?.data || error.message);
    
    // Fallback tips if API fails
    const fallbackTips = `Study Tips for ${req.body?.subject}:\n\n1. Break complex topics into smaller chunks\n2. Use the Pomodoro Technique (25 min study, 5 min break)\n3. Create mind maps and visual aids\n4. Teach the concept to someone else\n5. Regular review sessions\n6. Apply concepts to real-world examples`;
    
    res.json({ 
      success: true, 
      subject: req.body?.subject,
      tips: fallbackTips,
      timestamp: new Date().toISOString(),
      source: 'fallback'
    });
  }
};

module.exports = { getStudyTips };