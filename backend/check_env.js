require('dotenv').config();
console.log('API Key exists:', !!process.env.OPENROUTER_API_KEY);
if (process.env.OPENROUTER_API_KEY) {
    console.log('API Key length:', process.env.OPENROUTER_API_KEY.length);
}
