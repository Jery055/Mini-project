import React, { useState } from "react";
import "./Chatbot.css"; // Import the CSS for styling
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [chatVisible, setChatVisible] = useState(false);

  // Function to toggle the chat visibility
  const toggleChat = () => {
    setChatVisible(!chatVisible);
  };

  // Function to add messages to the chat
  const addMessage = (text, sender) => {
    setMessages((prevMessages) => [...prevMessages, { text, sender }]);
  };

  // Function to handle the word-by-word typing effect
  const typeWriter = (words, index = 0) => {
    if (index < words.length) {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        updatedMessages[updatedMessages.length - 1].text += (index === 0 ? "" : " ") + words[index];
        return updatedMessages;
      });
      setTimeout(() => typeWriter(words, index + 1), 100); // Adjust the speed here
    }
  };

  // Function to send a message
  const sendMessage = async () => {
    if (!userInput) return;

    addMessage(userInput, "user");
    setUserInput("");

    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userInput }),
      });
      const data = await response.json();

      if (data.reply) {
        addMessage("", "bot"); // Add an empty message for the bot
        const words = data.reply.split(" "); // Split the response into words
        typeWriter(words); // Start the typing effect
      } else {
        addMessage("Error: " + data.error, "bot");
      }
    } catch (error) {
      console.error("Error:", error);
      addMessage("Failed to connect to the server.", "bot");
    }
  };

  // Handle Enter key press to send message
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div>
      {/* Chat button */}
      <button id="chat-btn" className="btn" onClick={toggleChat}>
        <i className={`fas ${chatVisible ? "fa-times" : "fa-comments"}`}></i>
      </button>

      {/* Chat container */}
      {chatVisible && (
        <div id="chat-container">
          <div id="messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
          </div>
          <div id="input-container" className="d-flex">
            <input
              type="text"
              id="user-input"
              className="form-control"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              autoFocus
            />
            <button id="send-btn" className="btn" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
