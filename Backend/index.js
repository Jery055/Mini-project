const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Google Generative AI Setup
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);


app.get('/', (req, res) => {
    res.send('Hello World!');
    }
);
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

    let result = await chat.sendMessage(userPrompt);
    let modelResponse = result.response.text();

    res.json({ reply: modelResponse });
  } catch (error) {
    console.error('Error during AI model interaction:', error.message);
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