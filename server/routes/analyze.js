import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

router.post('/analyze-commit', async (req, res) => {
  try {
    const { message, diff } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
       return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const prompt = `Summarize this Git commit in 1-2 lines. Also classify it as one of: [feature, bugfix, refactor, minor].

Commit message:
${message}

Diff (optional):
${diff || 'No diff provided'}

Output strictly in JSON format without markdown blocks:
{
  "summary": "...",
  "type": "feature|bugfix|refactor|minor"
}`;

    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Gemini API Error');
    }

    let rawText = data.candidates[0].content.parts[0].text;
    
    // Clean up potential markdown formatting (```json ... ```)
    rawText = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    let result;
    try {
      result = JSON.parse(rawText);
    } catch(e) {
      // Fallback if AI fails to return proper JSON
      result = {
        summary: rawText,
        type: 'minor'
      };
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error analyzing commit:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
