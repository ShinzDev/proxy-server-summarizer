require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Add this import

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); 
app.use(express.json());

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/', (req, res) => {
    res.send('AI Proxy Server is up and running! 🚀');
});

app.post('/api/summarize', async (req, res) => {
    try {
        const { textToSummarize } = req.body;

        if (!textToSummarize) {
            return res.status(400).json({ error: "No text provided" });
        }

        console.log("Sending text to AI. Length:", textToSummarize.length);

        // 1. Choose the fast, cost-effective model
      // const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const model = genAI.getGenerativeModel({ model: "gemma-3n-e4b-it" });

        // 2. Craft a strict prompt demanding JSON output
        const prompt = `
        You are a highly efficient assistant. Read the following article text and provide a structured summary.
        You MUST respond ONLY with a valid JSON object. Do not include markdown formatting like \`\`\`json.
        
        The JSON object must have exactly these three keys:
        - "readingTime": A string estimating how long it takes to read (e.g., "5 min read").
        - "summary": An array of 3 to 5 string bullet points summarizing the main facts.
        - "insights": A single string paragraph explaining the deeper meaning or key takeaways.

        Article Text:
        ${textToSummarize}
        `;

        // 3. Call the AI
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        // 4. Parse the AI's text response into actual JSON
        // We use a safe parse in case the AI accidentally leaves some markdown around the JSON
        const cleanJsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        const aiData = JSON.parse(cleanJsonString);

        // 5. Send the real AI data back to your Chrome Extension!
        res.json(aiData);

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Failed to summarize text. Check server logs." });
    }
});

app.listen(PORT, () => {
    console.log(`Secure Proxy Server running on http://localhost:${PORT}`);
});





