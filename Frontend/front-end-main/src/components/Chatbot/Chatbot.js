import React, { useState, useEffect, useRef } from "react";
import "./Chatbot.css"; // Import the CSS for styling
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [chatVisible, setChatVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setChatVisible(!chatVisible);
  };

  // Function to add messages
  const addMessage = (text, sender) => {
    setMessages((prevMessages) => [...prevMessages, { text, sender }]);
  };

  const sendMessage = async () => {
    if (!userInput || isLoading) return;
    setIsLoading(true);

    // Add user message instantly
    addMessage(userInput, "user");
    const userMessage = userInput;
    setUserInput("");

    try {
      const response = await fetch("https://mini-project-backend-combined.vercel.app/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage }),
      });
      const data = await response.json();

      if (data.reply) {
        // Add bot message instantly
        addMessage(data.reply, "bot");
      } else {
        addMessage("Error: " + data.error, "bot");
      }
    } catch (error) {
      console.error("Error:", error);
      addMessage("Failed to connect to the server.", "bot");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div>
      <button id="chat-btn" className="btn" onClick={toggleChat}>
        <i className={`fas ${chatVisible ? "fa-times" : "fa-comments"}`}></i>
      </button>

      {chatVisible && (
        <div id="chat-container">
          <div id="messages">
            {messages.map((message, index) => (
              <div key={index} className={`message ${message.sender}`}>
                {message.text}
              </div>
            ))}
            <div ref={messagesEndRef}></div>
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
            <button id="send-btn" className="btn" onClick={sendMessage} disabled={isLoading}>
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
