// api/index.js
const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// API Route for handling chat interactions
app.post('/chat', async (req, res) => {
    const userPrompt = req.body.prompt;
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const chat = model.startChat({
            history: [
                { role: "user", parts: [{ text: "Hello" }] },
                { role: "model", parts: [{ text: "Great to meet you. What would you like to know?" }] },
            ],
        });

        // Send the user's prompt and await the response
        let result = await chat.sendMessage(userPrompt);
        let modelResponse = result.response.text();

        console.log(modelResponse);
        res.json({ reply: modelResponse });
    } catch (error) {
        console.error('Error during AI model interaction:', error.message);
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
