require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
// CORS allows your Chrome extension to make requests to this local server
app.use(cors()); 
app.use(express.json()); // Allows the server to understand JSON data

// A simple GET route so you can see the server is working in your browser
app.get('/', (req, res) => {
res.send('AI Proxy Server is up and running! 🚀');
});
// The Summarization Endpoint
app.post('/api/summarize', async (req, res) => {
    try {
        const { textToSummarize } = req.body;

        if (!textToSummarize) {
            return res.status(400).json({ error: "No text provided" });
        }

        // ---------------------------------------------------------
        // TODO: Insert your specific AI API call here (Gemini, OpenAI, etc.)
        // You will use process.env.GEMINI_API_KEY securely here.
        // ---------------------------------------------------------

        // Mock response for testing the connection
        const mockSummary = {
            summary: ["Point 1: The AI parsed the text.", "Point 2: It generated insights."],
            readingTime: "2 min read"
        };

        res.json(mockSummary);

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Failed to summarize text" });
    }
});

app.listen(PORT, () => {
    console.log(`Secure Proxy Server running on http://localhost:${PORT}`);
});