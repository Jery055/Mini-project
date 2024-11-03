// api/chat.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI("AIzaSyCXfcahuaSimP8w9J0gKZsKuGK3l9LpSiw");

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userPrompt = req.body.prompt;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: "Hello" }] },
        { role: "model", parts: [{ text: "Great to meet you. What would you like to know?" }] },
      ],
    });

    const result = await chat.sendMessage(userPrompt);
    const modelResponse = result.response.text();

    res.status(200).json({ reply: modelResponse });
  } catch (error) {
    console.error("Error during AI model interaction:", error);
    res.status(500).json({ error: "Failed to get a response from the model." });
  }
};
