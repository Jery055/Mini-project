// combinedServer.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://maria:maria@cluster0.uo4t1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB:', err));

// Create a schema and model for Markdown documents
const mdSchema = new mongoose.Schema({
    title: String,
    content: String,
    date: { type: Date, default: Date.now }
});

const Markdown = mongoose.model('Markdown', mdSchema);

// POST route to save a new Markdown file to the database
app.post('/api/markdown', async (req, res) => {
    const { title, content } = req.body;

    try {
        const newMd = new Markdown({ title, content });
        await newMd.save();
        res.status(201).json({ message: 'Markdown file saved successfully!' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to save Markdown file', error: err });
    }
});

// GET route to retrieve all Markdown files
app.get('/api/markdown', async (req, res) => {
    try {
        const markdownFiles = await Markdown.find();
        res.status(200).json(markdownFiles);
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve Markdown files', error: err });
    }
});

// GET route to retrieve all Markdown file titles
app.get('/api/markdown/filenames', async (req, res) => {
    try {
        const markdownFiles = await Markdown.find({}, 'title');
        const filenames = markdownFiles.map(file => file.title);
        res.status(200).json(filenames);
    } catch (err) {
        res.status(500).json({ message: 'Failed to retrieve filenames', error: err });
    }
});

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
