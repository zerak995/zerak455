const axios = require('axios');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { message } = req.body;
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Set this in Vercel dashboard

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: message }] }]
      }
    );
    const aiReply = response.data.candidates[0].content.parts[0].text;
    res.status(200).json({ reply: aiReply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 