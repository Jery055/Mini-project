const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI("AIzaSyCXfcahuaSimP8w9J0gKZsKuGK3l9LpSiw");


// Route for the chatbot interface
app.get('/', (req, res) => {
    res.render('chat');
});

// Handle chat interactions
app.post('/chat', async (req, res) => {
    const userPrompt = req.body.prompt;
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "Hello" }],
                },
                {
                    role: "model",
                    parts: [{ text: "Great to meet you. What would you like to know?" }],
                },
            ],
        });

        // Send the user's prompt and await the response
        let result = await chat.sendMessage(userPrompt);
        let modelResponse = result.response.text();

        console.log(modelResponse);
        // Send the cleaned response back to the client
        res.json({ reply: modelResponse });
    } catch (error) {
        console.error('Error during AI model interaction:', error);
        res.status(500).json({ error: 'Failed to get a response from the model.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
