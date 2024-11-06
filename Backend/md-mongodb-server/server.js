// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Initialize the Express app
const app = express();
app.use(bodyParser.json());

// Connect to MongoDB (replace '<your_connection_string>' with your MongoDB URL)
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

// Listen on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
