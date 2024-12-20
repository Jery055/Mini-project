const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const PORT = process.env.PORT || 3000;

const cors = require('cors'); // Import the CORS package

const app = express();

// Enable CORS for specific origin (your frontend URL)
// Configure CORS to allow the frontend origin
app.use(cors()); 

app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb+srv://maria:maria@cluster0.uo4t1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Google Generative AI Setup
const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_API_KEY,
);


app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);
app.get('/chat', (req, res) => {
    res.send('Chatbot API');
    }
);
app.post('/chat', async (req, res) => {
    // Log the incoming request body for debugging purposes
    console.log('Request body:', req.body);
    
    
    const userPrompt = req.body?.prompt;
    
    // If the prompt is missing, return a bad request error
    if (!userPrompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        // Log the received prompt for debugging purposes
        console.log('User prompt:', userPrompt);

        // Initialize the generative model (ensure this part is working correctly)
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Start the chat with a predefined history
        const chat = model.startChat({
            history: [
                { role: 'user', parts: [{ text: 'Hello' }] },
                { role: 'model', parts: [{ text: 'Great to meet you. What would you like to know?' }] },
            ],
        });

        // Send the user's prompt to the model and await the response
        let result = await chat.sendMessage(userPrompt);

        // Extract the response text from the model's response
        let modelResponse = result.response.text();

        // Log the model's response for debugging
        console.log('Model response:', modelResponse);

        // Send the model's response back to the client
        res.json({ reply: modelResponse });
    } catch (error) {
        // Log the error message
        console.error('Error during AI model interaction:', error.message);
        
        // Send a 500 status code and the error message to the client
        res.status(500).json({ error: `Internal Server Error: ${error.message}` });
    }
});


// Markdown routes
const mdSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: { type: Date, default: Date.now },
});

const Markdown = mongoose.model('Markdown', mdSchema);

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

app.get('/api/markdown', async (req, res) => {
  try {
    const markdownFiles = await Markdown.find();
    res.status(200).json(markdownFiles);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve Markdown files', error: err });
  }
});

app.get('/api/markdown/filenames', async (req, res) => {
  try {
    const markdownFiles = await Markdown.find({}, 'title');
    const filenames = markdownFiles.map(file => file.title);
    res.status(200).json(filenames);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve filenames', error: err });
  }
});

// Vercel serverless function handler
module.exports = app;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
}
);